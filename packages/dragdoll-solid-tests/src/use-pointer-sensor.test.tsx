import { PointerSensor } from 'dragdoll/sensors/pointer';
import { usePointerSensor } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';

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
    it('should return [accessor, setRef] initially', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = usePointerSensor();
        expect(sensor()).toBe(null);
        expect(typeof setRef).toBe('function');
        dispose();
      });
    });

    it('should create a sensor when ref callback is called with an element', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = usePointerSensor();
        setRef(testEl);
        // Solid effects are synchronous in the same tick
        expect(sensor()).toBeInstanceOf(PointerSensor);
        expect(sensor()!.isDestroyed).toBe(false);
        dispose();
      });
    });

    it('should destroy sensor when ref callback is called with null', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = usePointerSensor();
        setRef(testEl);
        const sensorInstance = sensor();
        expect(sensorInstance).toBeInstanceOf(PointerSensor);

        setRef(null);
        expect(sensor()).toBe(null);
        expect(sensorInstance!.isDestroyed).toBe(true);
        dispose();
      });
    });

    it('should destroy sensor on dispose (explicit element)', () => {
      let sensorInstance: PointerSensor | null = null;
      const dispose = createRoot((dispose) => {
        const [sensor] = usePointerSensor(undefined, testEl);
        sensorInstance = sensor();
        expect(sensorInstance).toBeInstanceOf(PointerSensor);
        return dispose;
      });

      dispose();
      expect(sensorInstance!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', () => {
      createRoot((dispose) => {
        const [sensor] = usePointerSensor(undefined, testEl);
        expect(sensor()).toBeInstanceOf(PointerSensor);
        expect(sensor()!.element).toBe(testEl);
        dispose();
      });
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback', () => {
      createRoot((dispose) => {
        const onStart = vi.fn();
        const [sensor] = usePointerSensor({ onStart }, testEl);
        emitSensorEvent(sensor()!, 'start');
        expect(onStart).toHaveBeenCalledTimes(1);
        dispose();
      });
    });

    it('should call onMove callback', () => {
      createRoot((dispose) => {
        const onMove = vi.fn();
        const [sensor] = usePointerSensor({ onMove }, testEl);
        emitSensorEvent(sensor()!, 'move');
        expect(onMove).toHaveBeenCalledTimes(1);
        dispose();
      });
    });

    it('should call onEnd callback', () => {
      createRoot((dispose) => {
        const onEnd = vi.fn();
        const [sensor] = usePointerSensor({ onEnd }, testEl);
        emitSensorEvent(sensor()!, 'end');
        expect(onEnd).toHaveBeenCalledTimes(1);
        dispose();
      });
    });

    it('should handle multiple events fired in rapid sequence', () => {
      createRoot((dispose) => {
        const onStart = vi.fn();
        const onMove = vi.fn();
        const onEnd = vi.fn();
        const [sensor] = usePointerSensor({ onStart, onMove, onEnd }, testEl);

        const s = sensor()!;
        emitSensorEvent(s, 'start');
        emitSensorEvent(s, 'move');
        emitSensorEvent(s, 'move');
        emitSensorEvent(s, 'move');
        emitSensorEvent(s, 'end');

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onMove).toHaveBeenCalledTimes(3);
        expect(onEnd).toHaveBeenCalledTimes(1);
        dispose();
      });
    });
  });
});
