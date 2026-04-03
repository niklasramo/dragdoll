import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { useKeyboardMotionSensor, useSensorCallback } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

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
    it('should return [accessor, setRef] initially', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = useKeyboardMotionSensor();
        expect(sensor()).toBe(null);
        expect(typeof setRef).toBe('function');
        dispose();
      });
    });

    it('should create a sensor when ref callback is called with an element', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = useKeyboardMotionSensor();
        setRef(testEl);
        expect(sensor()).toBeInstanceOf(KeyboardMotionSensor);
        expect(sensor()!.isDestroyed).toBe(false);
        dispose();
      });
    });

    it('should destroy sensor when ref callback is called with null', () => {
      createRoot((dispose) => {
        const [sensor, setRef] = useKeyboardMotionSensor();
        setRef(testEl);
        const sensorInstance = sensor();
        expect(sensorInstance).toBeInstanceOf(KeyboardMotionSensor);

        setRef(null);
        expect(sensor()).toBe(null);
        expect(sensorInstance!.isDestroyed).toBe(true);
        dispose();
      });
    });

    it('should destroy sensor on dispose (explicit element)', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
      });

      await flush();
      const sensorInstance = sensor();
      expect(sensorInstance).toBeInstanceOf(KeyboardMotionSensor);
      dispose();
      expect(sensorInstance!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create sensor with explicit element', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
      });

      await flush();
      expect(sensor()).toBeInstanceOf(KeyboardMotionSensor);
      expect(sensor()!.element).toBe(testEl);
      dispose();
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;
      const onStart = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
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
      let sensor!: Accessor<KeyboardMotionSensor | null>;
      const onMove = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'move', onMove);
      });

      await flush();
      emitSensorEvent(sensor()!, 'move');
      expect(onMove).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onTick callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;
      const onTick = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'tick', onTick);
      });

      await flush();
      emitSensorEvent(sensor()!, 'tick');
      expect(onTick).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onEnd callback via useSensorCallback', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;
      const onEnd = vi.fn();

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
        useSensorCallback(s, 'end', onEnd);
      });

      await flush();
      emitSensorEvent(sensor()!, 'end');
      expect(onEnd).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should handle events without a registered callback gracefully', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<KeyboardMotionSensor | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = useKeyboardMotionSensor(undefined, testEl);
        sensor = s;
      });

      await flush();

      const s = sensor()!;
      expect(() => {
        emitSensorEvent(s, 'start');
        emitSensorEvent(s, 'move');
        emitSensorEvent(s, 'tick');
        emitSensorEvent(s, 'end');
      }).not.toThrow();
      dispose();
    });
  });
});
