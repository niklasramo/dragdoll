import { Draggable, DraggableEventType } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableDrag } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

function emitDraggableEvent(draggable: Draggable, type: string, ...args: any[]) {
  (draggable as any)._emitter.emit(type, ...args);
}

describe('useDraggableDrag', () => {
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

  it('should return null when not dragging', async () => {
    let dispose!: () => void;
    let drag!: Accessor<any>;

    createRoot((d) => {
      dispose = d;
      drag = useDraggableDrag(() => draggable);
    });

    await flush();
    await flush();
    expect(drag()).toBe(null);
    dispose();
  });

  it('should return null when draggable is null', () => {
    createRoot((dispose) => {
      const drag = useDraggableDrag(() => null);
      expect(drag()).toBe(null);
      dispose();
    });
  });

  it('should unsubscribe on dispose', async () => {
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      useDraggableDrag(() => draggable);
    });

    await flush();
    await flush();

    dispose();

    // Emitting after dispose should not throw.
    expect(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    }).not.toThrow();
  });

  it('should not throw during drag lifecycle events', async () => {
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      useDraggableDrag(() => draggable);
    });

    await flush();
    await flush();

    // Emit a full drag lifecycle — none should throw.
    const fakeDrag = { isEnded: false } as any;
    expect(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
      emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
      emitDraggableEvent(draggable, DraggableEventType.End, fakeDrag, draggable);
    }).not.toThrow();

    dispose();
  });
});
