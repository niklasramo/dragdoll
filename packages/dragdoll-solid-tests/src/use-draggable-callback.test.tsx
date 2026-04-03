import { Draggable, DraggableEventType } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableCallback } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestElement } from './utils/create-test-element.js';
import { flush } from './utils/flush.js';

function emitDraggableEvent(draggable: Draggable, type: string, ...args: any[]) {
  (draggable as any)._emitter.emit(type, ...args);
}

describe('useDraggableCallback', () => {
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

  it('should subscribe when draggable and callback are provided', async () => {
    let dispose!: () => void;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      useDraggableCallback(() => draggable, DraggableEventType.Start, onStart as any);
    });

    await flush();
    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    expect(onStart).toHaveBeenCalledTimes(1);
    dispose();
  });

  it('should not subscribe when callback is undefined', async () => {
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      useDraggableCallback(() => draggable, DraggableEventType.Start, undefined);
    });

    await flush();
    expect(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    }).not.toThrow();
    dispose();
  });

  it('should not subscribe when draggable is null', () => {
    createRoot((dispose) => {
      const onStart = vi.fn();
      useDraggableCallback(() => null, DraggableEventType.Start, onStart as any);

      expect(onStart).not.toHaveBeenCalled();
      dispose();
    });
  });

  it('should clean up listener on dispose', async () => {
    let dispose!: () => void;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      useDraggableCallback(() => draggable, DraggableEventType.Start, onStart as any);
    });

    await flush();
    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    expect(onStart).toHaveBeenCalledTimes(1);

    dispose();
    onStart.mockClear();

    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    expect(onStart).not.toHaveBeenCalled();
  });
});
