import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { useKeyboardSensor } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

function emitSensorEvent(sensor: KeyboardSensor, type: string, data?: Record<string, unknown>) {
  (sensor as any)._emitter.emit(type, { type, x: 0, y: 0, ...data });
}

describe('useKeyboardSensor', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  describe('lifecycle', () => {
    it('should return [null, setRef] initially', async () => {
      const { result } = await renderHook(() => useKeyboardSensor());
      expect(result.current[0]).toBe(null);
      expect(typeof result.current[1]).toBe('function');
    });

    it('should create sensor via ref callback', async () => {
      const { result, act } = await renderHook(() => useKeyboardSensor());

      await act(() => {
        result.current[1](testEl);
      });

      expect(result.current[0]).toBeInstanceOf(KeyboardSensor);
      expect(result.current[0]!.isDestroyed).toBe(false);
    });

    it('should destroy sensor when ref is set to null', async () => {
      const { result, act } = await renderHook(() => useKeyboardSensor());

      await act(() => {
        result.current[1](testEl);
      });

      const sensor = result.current[0];

      await act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBe(null);
      expect(sensor!.isDestroyed).toBe(true);
    });

    it('should destroy sensor on unmount (explicit element)', async () => {
      const { result, unmount } = await renderHook(() => useKeyboardSensor(undefined, testEl));

      const sensor = result.current[0];
      expect(sensor).toBeInstanceOf(KeyboardSensor);

      unmount();
      expect(sensor!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', async () => {
      const { result } = await renderHook(() => useKeyboardSensor(undefined, testEl));

      expect(result.current[0]).toBeInstanceOf(KeyboardSensor);
      expect(result.current[0]!.element).toBe(testEl);
    });

    it('should update element when it changes', async () => {
      const el2 = createTestElement({ left: '200px' });
      const { result, rerender } = await renderHook(
        ({ element }) => useKeyboardSensor(undefined, element),
        { initialProps: { element: testEl as Element | null } },
      );

      expect(result.current[0]!.element).toBe(testEl);

      await rerender({ element: el2 });
      expect(result.current[0]!.element).toBe(el2);

      el2.remove();
    });
  });

  describe('settings', () => {
    it('should update settings when they change', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => useKeyboardSensor(settings, testEl),
        { initialProps: { settings: { moveDistance: 10 } } },
      );

      const sensor = result.current[0]!;
      const updateSpy = vi.spyOn(sensor, 'updateSettings');

      await rerender({ settings: { moveDistance: 20 } });

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('event callbacks', () => {
    it('should call all event callbacks', async () => {
      const onStart = vi.fn();
      const onMove = vi.fn();
      const onCancel = vi.fn();
      const onEnd = vi.fn();
      const onDestroy = vi.fn();

      const { result } = await renderHook(() =>
        useKeyboardSensor({ onStart, onMove, onCancel, onEnd, onDestroy }, testEl),
      );

      const sensor = result.current[0]!;

      emitSensorEvent(sensor, 'start');
      emitSensorEvent(sensor, 'move');
      emitSensorEvent(sensor, 'cancel');
      emitSensorEvent(sensor, 'end');
      emitSensorEvent(sensor, 'destroy');

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onMove).toHaveBeenCalledTimes(1);
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });

    it('should use latest callback via ref pattern', async () => {
      const onStart1 = vi.fn();
      const onStart2 = vi.fn();

      const { result, rerender } = await renderHook(
        ({ onStart }) => useKeyboardSensor({ onStart }, testEl),
        { initialProps: { onStart: onStart1 } },
      );

      await rerender({ onStart: onStart2 });
      emitSensorEvent(result.current[0]!, 'start');

      expect(onStart1).not.toHaveBeenCalled();
      expect(onStart2).toHaveBeenCalledTimes(1);
    });
  });

  describe('callback edge cases', () => {
    it('should not throw when emitting events with only partial callbacks defined', async () => {
      const onMove = vi.fn();
      const { result } = await renderHook(() => useKeyboardSensor({ onMove }, testEl));

      const sensor = result.current[0]!;
      expect(() => {
        emitSensorEvent(sensor, 'start');
        emitSensorEvent(sensor, 'move');
        emitSensorEvent(sensor, 'cancel');
        emitSensorEvent(sensor, 'end');
        emitSensorEvent(sensor, 'destroy');
      }).not.toThrow();

      expect(onMove).toHaveBeenCalledTimes(1);
    });

    it('should stop calling callback after it is set to undefined', async () => {
      const onStart = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onStart }) => useKeyboardSensor({ onStart }, testEl),
        { initialProps: { onStart: onStart as undefined | typeof onStart } },
      );

      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);

      await rerender({ onStart: undefined });
      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should resume calling callback after it is redefined', async () => {
      const onStart = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onStart }) => useKeyboardSensor({ onStart }, testEl),
        { initialProps: { onStart: onStart as undefined | typeof onStart } },
      );

      await rerender({ onStart: undefined });
      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).toHaveBeenCalledTimes(0);

      await rerender({ onStart });
      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple events fired in rapid sequence', async () => {
      const onStart = vi.fn();
      const onMove = vi.fn();
      const onEnd = vi.fn();
      const { result } = await renderHook(() =>
        useKeyboardSensor({ onStart, onMove, onEnd }, testEl),
      );

      const sensor = result.current[0]!;
      emitSensorEvent(sensor, 'start');
      emitSensorEvent(sensor, 'move');
      emitSensorEvent(sensor, 'move');
      emitSensorEvent(sensor, 'move');
      emitSensorEvent(sensor, 'end');

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onMove).toHaveBeenCalledTimes(3);
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('should call callback added after initial mount with no callbacks', async () => {
      const onEnd = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onEnd }) => useKeyboardSensor({ onEnd }, testEl),
        { initialProps: { onEnd: undefined as undefined | typeof onEnd } },
      );

      emitSensorEvent(result.current[0]!, 'end');
      expect(onEnd).not.toHaveBeenCalled();

      await rerender({ onEnd });
      emitSensorEvent(result.current[0]!, 'end');
      expect(onEnd).toHaveBeenCalledTimes(1);
    });
  });
});
