import { PointerSensor } from 'dragdoll/sensors/pointer';
import { usePointerSensor, useSensorCallback } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

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

    it('should destroy sensor on dispose (explicit element)', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
      });

      await flush();
      const sensorInstance = sensor();
      expect(sensorInstance).toBeInstanceOf(PointerSensor);
      dispose();
      expect(sensorInstance!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
      });

      await flush();
      expect(sensor()).toBeInstanceOf(PointerSensor);
      expect(sensor()!.element).toBe(testEl);
      dispose();
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback via useSensorCallback', async () => {
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

    it('should call onMove callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;
      const onMove = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'move', onMove);
      });

      await flush();
      emitSensorEvent(sensor()!, 'move');
      expect(onMove).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onCancel callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;
      const onCancel = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'cancel', onCancel);
      });

      await flush();
      emitSensorEvent(sensor()!, 'cancel');
      expect(onCancel).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onEnd callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;
      const onEnd = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'end', onEnd);
      });

      await flush();
      emitSensorEvent(sensor()!, 'end');
      expect(onEnd).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onDestroy callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;
      const onDestroy = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'destroy', onDestroy);
      });

      await flush();
      emitSensorEvent(sensor()!, 'destroy');
      expect(onDestroy).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should handle events without callbacks gracefully', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
      });

      await flush();

      expect(() => {
        emitSensorEvent(sensor()!, 'start');
        emitSensorEvent(sensor()!, 'move');
        emitSensorEvent(sensor()!, 'end');
      }).not.toThrow();
      dispose();
    });

    it('should handle events without a registered callback gracefully', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<PointerSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
      });

      await flush();

      const s = sensor()!;
      expect(() => {
        emitSensorEvent(s, 'start');
        emitSensorEvent(s, 'move');
        emitSensorEvent(s, 'cancel');
        emitSensorEvent(s, 'end');
      }).not.toThrow();
      dispose();
    });
  });
});
