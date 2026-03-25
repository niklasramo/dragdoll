import { Droppable } from 'dragdoll/droppable';
import { useDroppable } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';

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

    it('should destroy droppable on dispose (explicit element)', () => {
      let instance: Droppable | null = null;
      const dispose = createRoot((dispose) => {
        const [droppable] = useDroppable({ element: testEl });
        instance = droppable();
        expect(instance).toBeInstanceOf(Droppable);
        return dispose;
      });

      dispose();
      expect(instance!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create droppable with explicit element', () => {
      createRoot((dispose) => {
        const [droppable] = useDroppable({ element: testEl });
        expect(droppable()).toBeInstanceOf(Droppable);
        expect(droppable()!.element).toBe(testEl);
        dispose();
      });
    });
  });
});
