import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useSensorCallback } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

function emitSensorEvent(sensor: PointerSensor, type: string, data?: Record<string, unknown>) {
  (sensor as any)._emitter.emit(type, { type, x: 0, y: 0, ...data });
}

describe('useSensorCallback', () => {
  let testEl: HTMLElement;
  let sensor: PointerSensor;

  beforeEach(() => {
    testEl = createTestElement();
    sensor = new PointerSensor(testEl);
  });

  afterEach(() => {
    sensor.destroy();
    testEl.remove();
  });

  it('should subscribe when sensor and callback are provided', async () => {
    const onStart = vi.fn();
    await renderHook(() => useSensorCallback(sensor, 'start', onStart));

    emitSensorEvent(sensor, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should not subscribe when callback is undefined', async () => {
    await renderHook(() => useSensorCallback(sensor, 'start', undefined));

    // Should not throw when emitting.
    expect(() => emitSensorEvent(sensor, 'start')).not.toThrow();
  });

  it('should not subscribe when sensor is null', async () => {
    const onStart = vi.fn();
    await renderHook(() => useSensorCallback(null, 'start', onStart));

    // Callback should never be called.
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', async () => {
    const onStart = vi.fn();
    const { unmount } = await renderHook(() => useSensorCallback(sensor, 'start', onStart));

    emitSensorEvent(sensor, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);

    unmount();
    onStart.mockClear();

    emitSensorEvent(sensor, 'start');
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should use latest callback via ref pattern', async () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    const { rerender } = await renderHook(({ cb }) => useSensorCallback(sensor, 'start', cb), {
      initialProps: { cb: cb1 },
    });

    await rerender({ cb: cb2 });
    emitSensorEvent(sensor, 'start');

    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  it('should subscribe/unsubscribe when callback toggles', async () => {
    const onStart = vi.fn();

    const { rerender } = await renderHook(({ cb }) => useSensorCallback(sensor, 'start', cb), {
      initialProps: { cb: onStart as typeof onStart | undefined },
    });

    emitSensorEvent(sensor, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);

    // Remove callback.
    await rerender({ cb: undefined });
    onStart.mockClear();

    emitSensorEvent(sensor, 'start');
    expect(onStart).not.toHaveBeenCalled();

    // Re-add callback.
    await rerender({ cb: onStart });
    emitSensorEvent(sensor, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
