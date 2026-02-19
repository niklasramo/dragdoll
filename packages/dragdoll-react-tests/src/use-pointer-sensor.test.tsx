import { PointerSensor } from 'dragdoll/sensors/pointer';
import { usePointerSensor } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

// Helper to emit events on a sensor's internal emitter.
function emitSensorEvent(sensor: PointerSensor, type: string, data?: Record<string, unknown>) {
  (sensor as any)._emitter.emit(type, { type, x: 0, y: 0, ...data });
}

describe('usePointerSensor', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  describe('lifecycle', () => {
    it('should return [null, setRef] initially', async () => {
      const { result } = await renderHook(() => usePointerSensor());
      const [sensor, setRef] = result.current;
      expect(sensor).toBe(null);
      expect(typeof setRef).toBe('function');
    });

    it('should create a sensor when ref callback is called with an element', async () => {
      const { result, act } = await renderHook(() => usePointerSensor());

      await act(() => {
        result.current[1](testEl);
      });

      const [sensor] = result.current;
      expect(sensor).toBeInstanceOf(PointerSensor);
      expect(sensor!.isDestroyed).toBe(false);
    });

    it('should destroy sensor when ref callback is called with null', async () => {
      const { result, act } = await renderHook(() => usePointerSensor());

      await act(() => {
        result.current[1](testEl);
      });

      const sensor = result.current[0];
      expect(sensor).toBeInstanceOf(PointerSensor);

      await act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBe(null);
      expect(sensor!.isDestroyed).toBe(true);
    });

    it('should destroy sensor on unmount (explicit element)', async () => {
      const { result, unmount } = await renderHook(() => usePointerSensor(undefined, testEl));

      const sensor = result.current[0];
      expect(sensor).toBeInstanceOf(PointerSensor);

      unmount();
      expect(sensor!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', async () => {
      const { result } = await renderHook(() => usePointerSensor(undefined, testEl));

      const [sensor] = result.current;
      expect(sensor).toBeInstanceOf(PointerSensor);
      expect(sensor!.element).toBe(testEl);
    });

    it('should update element when explicit element changes', async () => {
      const el2 = createTestElement({ left: '200px' });
      const { result, rerender } = await renderHook(
        ({ element }) => usePointerSensor(undefined, element),
        { initialProps: { element: testEl as Element | Window } },
      );

      expect(result.current[0]!.element).toBe(testEl);

      await rerender({ element: el2 });
      expect(result.current[0]!.element).toBe(el2);

      el2.remove();
    });

    it('should ignore ref callback when explicit element is provided', async () => {
      const { result, act } = await renderHook(() => usePointerSensor(undefined, testEl));

      const sensor = result.current[0];
      const el2 = createTestElement({ left: '200px' });

      await act(() => {
        result.current[1](el2);
      });

      // Sensor should still point to testEl.
      expect(result.current[0]).toBe(sensor);
      expect(result.current[0]!.element).toBe(testEl);

      el2.remove();
    });
  });

  describe('settings', () => {
    it('should update settings when settings change', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => usePointerSensor(settings, testEl),
        { initialProps: { settings: { sourceEvents: 'pointer' as const } } },
      );

      const sensor = result.current[0]!;
      const updateSpy = vi.spyOn(sensor, 'updateSettings');

      await rerender({ settings: { sourceEvents: 'mouse' as const } });

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback', async () => {
      const onStart = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onStart }, testEl));

      const sensor = result.current[0]!;
      emitSensorEvent(sensor, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onMove callback', async () => {
      const onMove = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onMove }, testEl));

      emitSensorEvent(result.current[0]!, 'move');
      expect(onMove).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel callback', async () => {
      const onCancel = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onCancel }, testEl));

      emitSensorEvent(result.current[0]!, 'cancel');
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onEnd callback', async () => {
      const onEnd = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onEnd }, testEl));

      emitSensorEvent(result.current[0]!, 'end');
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('should call onDestroy callback', async () => {
      const onDestroy = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onDestroy }, testEl));

      emitSensorEvent(result.current[0]!, 'destroy');
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });

    it('should use latest callback without re-subscribing', async () => {
      const onStart1 = vi.fn();
      const onStart2 = vi.fn();

      const { result, rerender } = await renderHook(
        ({ onStart }) => usePointerSensor({ onStart }, testEl),
        { initialProps: { onStart: onStart1 } },
      );

      await rerender({ onStart: onStart2 });
      emitSensorEvent(result.current[0]!, 'start');

      expect(onStart1).not.toHaveBeenCalled();
      expect(onStart2).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined callbacks gracefully', async () => {
      const { result } = await renderHook(() => usePointerSensor(undefined, testEl));

      expect(() => {
        emitSensorEvent(result.current[0]!, 'start');
        emitSensorEvent(result.current[0]!, 'move');
        emitSensorEvent(result.current[0]!, 'end');
      }).not.toThrow();
    });
  });

  describe('callback edge cases', () => {
    it('should not throw when emitting events with only partial callbacks defined', async () => {
      const onStart = vi.fn();
      const { result } = await renderHook(() => usePointerSensor({ onStart }, testEl));

      const sensor = result.current[0]!;
      expect(() => {
        emitSensorEvent(sensor, 'start');
        emitSensorEvent(sensor, 'move');
        emitSensorEvent(sensor, 'cancel');
        emitSensorEvent(sensor, 'end');
        emitSensorEvent(sensor, 'destroy');
      }).not.toThrow();

      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should stop calling callback after it is set to undefined', async () => {
      const onStart = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onStart }) => usePointerSensor({ onStart }, testEl),
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
        ({ onStart }) => usePointerSensor({ onStart }, testEl),
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
        usePointerSensor({ onStart, onMove, onEnd }, testEl),
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
      const onStart = vi.fn();
      const { result, rerender } = await renderHook(
        ({ onStart }) => usePointerSensor({ onStart }, testEl),
        { initialProps: { onStart: undefined as undefined | typeof onStart } },
      );

      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).not.toHaveBeenCalled();

      await rerender({ onStart });
      emitSensorEvent(result.current[0]!, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });
});
