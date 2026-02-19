import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { useKeyboardMotionSensor } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

function emitSensorEvent(
  sensor: KeyboardMotionSensor,
  type: string,
  data?: Record<string, unknown>,
) {
  (sensor as any)._emitter.emit(type, { type, x: 0, y: 0, ...data });
}

describe('useKeyboardMotionSensor', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  describe('lifecycle', () => {
    it('should return [null, setRef] initially', async () => {
      const { result } = await renderHook(() => useKeyboardMotionSensor());
      expect(result.current[0]).toBe(null);
      expect(typeof result.current[1]).toBe('function');
    });

    it('should create sensor via ref callback', async () => {
      const { result, act } = await renderHook(() => useKeyboardMotionSensor());

      await act(() => {
        result.current[1](testEl);
      });

      expect(result.current[0]).toBeInstanceOf(KeyboardMotionSensor);
      expect(result.current[0]!.isDestroyed).toBe(false);
    });

    it('should destroy sensor on unmount (explicit element)', async () => {
      const { result, unmount } = await renderHook(() =>
        useKeyboardMotionSensor(undefined, testEl),
      );

      const sensor = result.current[0];
      expect(sensor).toBeInstanceOf(KeyboardMotionSensor);

      unmount();
      expect(sensor!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', async () => {
      const { result } = await renderHook(() => useKeyboardMotionSensor(undefined, testEl));

      expect(result.current[0]).toBeInstanceOf(KeyboardMotionSensor);
      expect(result.current[0]!.element).toBe(testEl);
    });
  });

  describe('settings', () => {
    it('should update settings when they change', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => useKeyboardMotionSensor(settings, testEl),
        { initialProps: { settings: { cancelOnBlur: true } } },
      );

      const sensor = result.current[0]!;
      const updateSpy = vi.spyOn(sensor, 'updateSettings');

      await rerender({ settings: { cancelOnBlur: false } });

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('event callbacks', () => {
    it('should call all 6 event callbacks including onTick', async () => {
      const onStart = vi.fn();
      const onMove = vi.fn();
      const onCancel = vi.fn();
      const onEnd = vi.fn();
      const onDestroy = vi.fn();
      const onTick = vi.fn();

      const { result } = await renderHook(() =>
        useKeyboardMotionSensor({ onStart, onMove, onCancel, onEnd, onDestroy, onTick }, testEl),
      );

      const sensor = result.current[0]!;

      emitSensorEvent(sensor, 'start');
      emitSensorEvent(sensor, 'move');
      emitSensorEvent(sensor, 'cancel');
      emitSensorEvent(sensor, 'end');
      emitSensorEvent(sensor, 'destroy');
      emitSensorEvent(sensor, 'tick');

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onMove).toHaveBeenCalledTimes(1);
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledTimes(1);
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should use latest callback via ref pattern', async () => {
      const onTick1 = vi.fn();
      const onTick2 = vi.fn();

      const { result, rerender } = await renderHook(
        ({ onTick }) => useKeyboardMotionSensor({ onTick }, testEl),
        { initialProps: { onTick: onTick1 } },
      );

      await rerender({ onTick: onTick2 });
      emitSensorEvent(result.current[0]!, 'tick');

      expect(onTick1).not.toHaveBeenCalled();
      expect(onTick2).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined callbacks gracefully', async () => {
      const { result } = await renderHook(() => useKeyboardMotionSensor(undefined, testEl));

      expect(() => {
        emitSensorEvent(result.current[0]!, 'start');
        emitSensorEvent(result.current[0]!, 'tick');
      }).not.toThrow();
    });
  });

  describe('callback edge cases', () => {
    it('should not throw when emitting events with only partial callbacks defined', async () => {
      const onTick = vi.fn();
      const { result } = await renderHook(() => useKeyboardMotionSensor({ onTick }, testEl));

      const sensor = result.current[0]!;
      expect(() => {
        emitSensorEvent(sensor, 'start');
        emitSensorEvent(sensor, 'move');
        emitSensorEvent(sensor, 'cancel');
        emitSensorEvent(sensor, 'end');
        emitSensorEvent(sensor, 'destroy');
        emitSensorEvent(sensor, 'tick');
      }).not.toThrow();

      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should stop calling callback after it is set to undefined', async () => {
      const onTick = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onTick }) => useKeyboardMotionSensor({ onTick }, testEl),
        { initialProps: { onTick: onTick as undefined | typeof onTick } },
      );

      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(1);

      await rerender({ onTick: undefined });
      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should resume calling callback after it is redefined', async () => {
      const onTick = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onTick }) => useKeyboardMotionSensor({ onTick }, testEl),
        { initialProps: { onTick: onTick as undefined | typeof onTick } },
      );

      await rerender({ onTick: undefined });
      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(0);

      await rerender({ onTick });
      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple events fired in rapid sequence', async () => {
      const onStart = vi.fn();
      const onTick = vi.fn();
      const onEnd = vi.fn();
      const { result } = await renderHook(() =>
        useKeyboardMotionSensor({ onStart, onTick, onEnd }, testEl),
      );

      const sensor = result.current[0]!;
      emitSensorEvent(sensor, 'start');
      emitSensorEvent(sensor, 'tick');
      emitSensorEvent(sensor, 'tick');
      emitSensorEvent(sensor, 'tick');
      emitSensorEvent(sensor, 'end');

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onTick).toHaveBeenCalledTimes(3);
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('should call callback added after initial mount with no callbacks', async () => {
      const onTick = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onTick }) => useKeyboardMotionSensor({ onTick }, testEl),
        { initialProps: { onTick: undefined as undefined | typeof onTick } },
      );

      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).not.toHaveBeenCalled();

      await rerender({ onTick });
      emitSensorEvent(result.current[0]!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(1);
    });
  });
});
