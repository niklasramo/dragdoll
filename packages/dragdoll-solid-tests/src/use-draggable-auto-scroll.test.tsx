import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableAutoScroll } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

describe('useDraggableAutoScroll', () => {
  let testEl: HTMLElement;
  let sensor: PointerSensor;
  let draggable: Draggable;

  beforeEach(() => {
    testEl = createTestElement();
    sensor = new PointerSensor(testEl);
    draggable = new Draggable([sensor], { id: 'test' });
  });

  afterEach(() => {
    draggable.destroy();
    sensor.destroy();
    testEl.remove();
  });

  it('should register autoscroll plugin on draggable', async () => {
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      useDraggableAutoScroll(() => draggable);
    });

    await flush();
    expect(draggable.plugins.autoscroll).toBeTruthy();
    dispose();
  });

  it('should handle null draggable', () => {
    createRoot((dispose) => {
      const result = useDraggableAutoScroll(() => null);
      expect(result()).toBe(null);
      dispose();
    });
  });

  it('should return the draggable with autoscroll plugin type', async () => {
    let dispose!: () => void;
    let result!: Accessor<any>;

    createRoot((d) => {
      dispose = d;
      result = useDraggableAutoScroll(() => draggable);
    });

    await flush();
    expect(result()).toBeTruthy();
    expect(result()!.plugins.autoscroll).toBeTruthy();
    dispose();
  });
});
