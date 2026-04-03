import { DndObserver } from 'dragdoll/dnd-observer';
import { Droppable } from 'dragdoll/droppable';
import { useDroppable } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

describe('useDroppable', () => {
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
        const [droppable, setRef] = useDroppable();
        expect(droppable()).toBe(null);
        expect(typeof setRef).toBe('function');
        dispose();
      });
    });

    it('should create a droppable when ref callback is called with an element', () => {
      createRoot((dispose) => {
        const [droppable, setRef] = useDroppable();
        setRef(testEl);
        expect(droppable()).toBeInstanceOf(Droppable);
        expect(droppable()!.isDestroyed).toBe(false);
        dispose();
      });
    });

    it('should destroy droppable when ref callback is called with null', () => {
      createRoot((dispose) => {
        const [droppable, setRef] = useDroppable();
        setRef(testEl);
        const instance = droppable();
        expect(instance).toBeInstanceOf(Droppable);

        setRef(null);
        expect(droppable()).toBe(null);
        expect(instance!.isDestroyed).toBe(true);
        dispose();
      });
    });

    it('should destroy droppable on dispose (explicit element)', async () => {
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ element: testEl });
        droppable = dr;
      });

      await flush();
      const instance = droppable();
      expect(instance).toBeInstanceOf(Droppable);
      dispose();
      expect(instance!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create droppable with explicit element', async () => {
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ element: testEl });
        droppable = dr;
      });

      await flush();
      expect(droppable()).toBeInstanceOf(Droppable);
      expect(droppable()!.element).toBe(testEl);
      dispose();
    });

    it('should ignore ref callback when explicit element is provided', async () => {
      const el2 = createTestElement({ left: '200px' });
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;
      let setRef!: (el: HTMLElement | null) => void;

      createRoot((d) => {
        dispose = d;
        const [dr, sr] = useDroppable({ element: testEl });
        droppable = dr;
        setRef = sr;
      });

      await flush();
      const instance = droppable();

      setRef(el2);

      // Droppable should still use testEl.
      expect(droppable()).toBe(instance);
      expect(droppable()!.element).toBe(testEl);
      dispose();
      el2.remove();
    });
  });

  describe('id', () => {
    it('should use provided id', async () => {
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ id: 'drop-1', element: testEl });
        droppable = dr;
      });

      await flush();
      expect(droppable()!.id).toBe('drop-1');
      dispose();
    });
  });

  describe('DndObserver integration', () => {
    it('should add droppable to explicit observer', async () => {
      const observer = new DndObserver();
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ element: testEl, dndObserver: observer });
        droppable = dr;
      });

      await flush();
      expect(observer.droppables.has(droppable()!.id)).toBe(true);
      dispose();
      observer.destroy();
    });

    it('should remove droppable from observer on dispose', async () => {
      const observer = new DndObserver();
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ element: testEl, dndObserver: observer });
        droppable = dr;
      });

      await flush();
      const droppableId = droppable()!.id;
      expect(observer.droppables.has(droppableId)).toBe(true);
      dispose();
      expect(observer.droppables.has(droppableId)).toBe(false);
      observer.destroy();
    });
  });

  describe('settings updates', () => {
    it('should update data', async () => {
      let dispose!: () => void;
      let droppable!: Accessor<Droppable | null>;

      createRoot((d) => {
        dispose = d;
        const [dr] = useDroppable({ element: testEl, data: { key: 'value1' } });
        droppable = dr;
      });

      await flush();
      expect(droppable()!.data).toEqual({ key: 'value1' });
      dispose();
    });
  });
});
