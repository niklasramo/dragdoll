import { Draggable } from 'dragdoll/draggable';
import { useDraggable, usePointerSensor } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';

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

    it('should create draggable when sensor with element is provided', () => {
      createRoot((dispose) => {
        const [sensor] = usePointerSensor(undefined, testEl);
        const draggable = useDraggable([sensor()], {
          elements: () => [testEl],
        });
        expect(draggable()).toBeInstanceOf(Draggable);
        dispose();
      });
    });

    it('should destroy draggable on dispose', () => {
      let draggableInstance: Draggable | null = null;
      const dispose = createRoot((dispose) => {
        const [sensor] = usePointerSensor(undefined, testEl);
        const draggable = useDraggable([sensor()], {
          elements: () => [testEl],
        });
        draggableInstance = draggable();
        expect(draggableInstance).toBeInstanceOf(Draggable);
        return dispose;
      });

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
  });

  describe('drag preview', () => {
    it('should accept dragPreview setting without error', () => {
      createRoot((dispose) => {
        const [sensor] = usePointerSensor(undefined, testEl);
        const draggable = useDraggable([sensor()], {
          elements: () => [testEl],
          dragPreview: true,
        });
        expect(draggable()).toBeInstanceOf(Draggable);
        dispose();
      });
    });
  });
});
