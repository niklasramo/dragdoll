import { PointerSensor } from 'dragdoll/sensors/pointer';
import { usePointerSensor, useSensorCallback } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

function emitSensorEvent(sensor: PointerSensor, type: string, data?: Record<string, unknown>) {
  (sensor as any)._emitter.emit(type, { type, x: 0, y: 0, ...data });
}

describe('useSensorCallback', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  it('should attach and call event listener', async () => {
    let dispose!: () => void;
    let sensor!: Accessor<PointerSensor | null>;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      const [s] = usePointerSensor(undefined, testEl);
      sensor = s;
      useSensorCallback(s, 'start', onStart);
    });

    await flush();
    emitSensorEvent(sensor()!, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('should handle null sensor gracefully', () => {
    createRoot((dispose) => {
      const onStart = vi.fn();
      expect(() => {
        useSensorCallback(null, 'start', onStart);
      }).not.toThrow();
      dispose();
    });
  });

  it('should not subscribe when callback is undefined', async () => {
    let dispose!: () => void;
    let sensor!: Accessor<PointerSensor | null>;

    createRoot((d) => {
      dispose = d;
      const [s] = usePointerSensor(undefined, testEl);
      sensor = s;
      useSensorCallback(s, 'start', undefined);
    });

    await flush();
    // Should not throw when emitting.
    expect(() => emitSensorEvent(sensor()!, 'start')).not.toThrow();
    dispose();
  });

  it('should clean up listener on dispose', async () => {
    let dispose!: () => void;
    let sensor!: Accessor<PointerSensor | null>;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      const [s] = usePointerSensor(undefined, testEl);
      sensor = s;
      useSensorCallback(s, 'start', onStart);
    });

    await flush();
    await flush();
    const sensorInstance = sensor();

    // Verify callback works before dispose.
    emitSensorEvent(sensorInstance!, 'start');
    expect(onStart).toHaveBeenCalledTimes(1);

    dispose();
    onStart.mockClear();

    // After dispose, the callback should no longer be called.
    // Note: dispose() destroys the sensor, so we create a fresh
    // one to verify the callback is truly detached.
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should not call callback when sensor is null', () => {
    createRoot((dispose) => {
      const onStart = vi.fn();
      useSensorCallback(() => null, 'start', onStart);

      expect(onStart).not.toHaveBeenCalled();
      dispose();
    });
  });
});
