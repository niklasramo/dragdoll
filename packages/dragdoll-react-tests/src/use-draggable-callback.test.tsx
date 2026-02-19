import { Draggable, DraggableEventType } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableCallback } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

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
    const onStart = vi.fn();
    await renderHook(() =>
      useDraggableCallback(draggable, DraggableEventType.Start, onStart as any),
    );

    const fakeDrag = {} as any;
    emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should not subscribe when callback is undefined', async () => {
    await renderHook(() => useDraggableCallback(draggable, DraggableEventType.Start, undefined));

    expect(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    }).not.toThrow();
  });

  it('should not subscribe when draggable is null', async () => {
    const onStart = vi.fn();
    await renderHook(() => useDraggableCallback(null, DraggableEventType.Start, onStart as any));

    expect(onStart).not.toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', async () => {
    const onStart = vi.fn();
    const { unmount } = await renderHook(() =>
      useDraggableCallback(draggable, DraggableEventType.Start, onStart as any),
    );

    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    expect(onStart).toHaveBeenCalledTimes(1);

    unmount();
    onStart.mockClear();

    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should use latest callback via ref pattern', async () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    const { rerender } = await renderHook(
      ({ cb }) => useDraggableCallback(draggable, DraggableEventType.Start, cb as any),
      { initialProps: { cb: cb1 } },
    );

    await rerender({ cb: cb2 });
    emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);

    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledTimes(1);
  });
});
