import { PointerSensor } from 'dragdoll/sensors/pointer';
import { usePointerSensor, useSensorCallback } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';

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

  it('should attach and call event listener', () => {
    createRoot((dispose) => {
      const [sensor] = usePointerSensor(undefined, testEl);
      const onStart = vi.fn();
      useSensorCallback(sensor, 'start', onStart);

      emitSensorEvent(sensor()!, 'start');
      expect(onStart).toHaveBeenCalledTimes(1);
      dispose();
    });
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

  it('should clean up listener on dispose', () => {
    let sensorInstance: PointerSensor | null = null;
    const onStart = vi.fn();

    const dispose = createRoot((dispose) => {
      const [sensor] = usePointerSensor(undefined, testEl);
      sensorInstance = sensor();
      useSensorCallback(sensor, 'start', onStart);
      return dispose;
    });

    dispose();

    // After dispose, the callback should no longer be called.
    emitSensorEvent(sensorInstance!, 'start');
    expect(onStart).toHaveBeenCalledTimes(0);
  });
});
