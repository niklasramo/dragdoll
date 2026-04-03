import { DndObserver } from 'dragdoll/dnd-observer';
import { Draggable } from 'dragdoll/draggable';
import { useDraggable, usePointerSensor } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

describe('useDraggable', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  describe('lifecycle', () => {
    it('should return null accessor when no sensors are provided', () => {
      createRoot((dispose) => {
        const draggable = useDraggable([]);
        expect(draggable()).toBe(null);
        dispose();
      });
    });

    it('should create draggable when sensor with element is provided', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(draggable()).toBeInstanceOf(Draggable);
      dispose();
    });

    it('should destroy draggable on dispose', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      const draggableInstance = draggable();
      expect(draggableInstance).toBeInstanceOf(Draggable);
      dispose();
      expect(draggableInstance!.isDestroyed).toBe(true);
    });

    it('should handle null sensors gracefully', () => {
      createRoot((dispose) => {
        const draggable = useDraggable([null]);
        expect(draggable()).toBe(null);
        dispose();
      });
    });

    it('should auto-generate an id when not provided', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(typeof draggable()!.id).toBe('symbol');
      dispose();
    });

    it('should use the provided id', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          id: 'test-id',
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(draggable()!.id).toBe('test-id');
      dispose();
    });
  });

  describe('sensors', () => {
    it('should set sensors on the Draggable', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(draggable()!.sensors).toContain(sensor());
      dispose();
    });

    it('should filter out null sensors', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([() => null, sensor, () => null], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(draggable()!.sensors).toHaveLength(1);
      expect(draggable()!.sensors[0]).toBe(sensor());
      dispose();
    });
  });

  describe('DndObserver integration', () => {
    it('should add draggable to explicit dndObserver', async () => {
      const observer = new DndObserver();
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          dndObserver: observer,
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      expect(observer.draggables.has(draggable()!.id)).toBe(true);
      dispose();
      observer.destroy();
    });

    it('should remove draggable from observer on dispose', async () => {
      const observer = new DndObserver();
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          dndObserver: observer,
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();
      const draggableId = draggable()!.id;
      expect(observer.draggables.has(draggableId)).toBe(true);
      dispose();
      expect(observer.draggables.has(draggableId)).toBe(false);
      observer.destroy();
    });
  });

  describe('destruction safety', () => {
    it('should handle double destroy safely', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
        });
      });

      await flush();
      await flush();

      const instance = draggable()!;
      instance.destroy();
      expect(instance.isDestroyed).toBe(true);

      expect(() => dispose()).not.toThrow();
    });
  });

  describe('drag preview', () => {
    it('should accept dragPreview setting without error', async () => {
      let dispose!: () => void;
      let sensor!: Accessor<import('dragdoll/sensors/pointer').PointerSensor | null>;
      let draggable!: Accessor<Draggable | null>;

      createRoot((d) => {
        dispose = d;
        const [s] = usePointerSensor(undefined, testEl);
        sensor = s;
        draggable = useDraggable([sensor], {
          elements: () => [testEl],
          dragPreview: true,
        });
      });

      await flush();
      await flush();
      expect(draggable()).toBeInstanceOf(Draggable);
      dispose();
    });
  });
});
