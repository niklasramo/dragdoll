import { Draggable, DraggableEventType } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableDrag } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

// Helper to emit draggable events.
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
    const { result } = await renderHook(() => useDraggableDrag(draggable));
    expect(result.current).toBe(null);
  });

  it('should return null when draggable is null', async () => {
    const { result } = await renderHook(() => useDraggableDrag(null));
    expect(result.current).toBe(null);
  });

  it('should set drag on start event', async () => {
    const { result, act } = await renderHook(() => useDraggableDrag(draggable));

    const fakeDrag = { isEnded: false } as any;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
    });

    expect(result.current).toBe(fakeDrag);
  });

  it('should clear drag on end event', async () => {
    const { result, act } = await renderHook(() => useDraggableDrag(draggable));

    const fakeDrag = { isEnded: false } as any;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
    });

    expect(result.current).toBe(fakeDrag);

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.End, fakeDrag, draggable);
    });

    expect(result.current).toBe(null);
  });

  it('should not cause re-render on move when trackMove is false', async () => {
    let renderCount = 0;
    const { result, act } = await renderHook(() => {
      renderCount++;
      return useDraggableDrag(draggable, false);
    });

    const fakeDrag = { isEnded: false } as any;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
    });

    const countAfterStart = renderCount;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
    });

    // Move should not cause additional renders when trackMove is false.
    expect(renderCount).toBe(countAfterStart);
    expect(result.current).toBe(fakeDrag);
  });

  it('should cause re-render on move when trackMove is true', async () => {
    let renderCount = 0;
    const { result, act } = await renderHook(() => {
      renderCount++;
      return useDraggableDrag(draggable, true);
    });

    const fakeDrag = { isEnded: false } as any;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
    });

    const countAfterStart = renderCount;

    await act(() => {
      emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
    });

    // Move should cause an additional render when trackMove is true.
    expect(renderCount).toBeGreaterThan(countAfterStart);
    expect(result.current).toBe(fakeDrag);
  });

  it('should unsubscribe on unmount', async () => {
    const { unmount } = await renderHook(() => useDraggableDrag(draggable));

    unmount();

    // Emitting after unmount should not throw.
    expect(() => {
      emitDraggableEvent(draggable, DraggableEventType.Start, {} as any, draggable);
    }).not.toThrow();
  });

  describe('trackMove toggling', () => {
    it('should pick up moves when trackMove changes from false to true', async () => {
      let renderCount = 0;
      const { rerender, act } = await renderHook(
        ({ trackMove }) => {
          renderCount++;
          return useDraggableDrag(draggable, trackMove);
        },
        { initialProps: { trackMove: false } },
      );

      const fakeDrag = { isEnded: false } as any;

      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
      });

      const countAfterStart = renderCount;

      // Move with trackMove=false — no re-render.
      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
      });
      expect(renderCount).toBe(countAfterStart);

      // Switch to trackMove=true.
      await rerender({ trackMove: true });
      const countAfterToggle = renderCount;

      // Move with trackMove=true — should re-render.
      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
      });
      expect(renderCount).toBeGreaterThan(countAfterToggle);
    });

    it('should stop re-rendering when trackMove changes from true to false', async () => {
      let renderCount = 0;
      const { rerender, act } = await renderHook(
        ({ trackMove }) => {
          renderCount++;
          return useDraggableDrag(draggable, trackMove);
        },
        { initialProps: { trackMove: true } },
      );

      const fakeDrag = { isEnded: false } as any;

      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
      });

      // Move with trackMove=true — causes re-render.
      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
      });

      // Switch to trackMove=false.
      await rerender({ trackMove: false });
      const countAfterToggle = renderCount;

      // Move with trackMove=false — should NOT re-render.
      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Move, fakeDrag, draggable);
      });
      expect(renderCount).toBe(countAfterToggle);
    });

    it('should resubscribe when draggable instance changes', async () => {
      const el2 = createTestElement({ left: '200px' });
      const sensor2 = new PointerSensor(el2);
      const draggable2 = new Draggable([sensor2], { id: 'test-2' });

      const { result, rerender, act } = await renderHook(({ d }) => useDraggableDrag(d), {
        initialProps: { d: draggable as Draggable | null },
      });

      const fakeDrag1 = { isEnded: false, id: 1 } as any;
      await act(() => {
        emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag1, draggable);
      });
      expect(result.current).toBe(fakeDrag1);

      // Switch to draggable2 — should reset and listen to new instance.
      await rerender({ d: draggable2 });

      const fakeDrag2 = { isEnded: false, id: 2 } as any;
      await act(() => {
        emitDraggableEvent(draggable2, DraggableEventType.Start, fakeDrag2, draggable2);
      });
      expect(result.current).toBe(fakeDrag2);

      draggable2.destroy();
      sensor2.destroy();
      el2.remove();
    });

    it('should handle multiple rapid start/end cycles', async () => {
      const { result, act } = await renderHook(() => useDraggableDrag(draggable));

      for (let i = 0; i < 3; i++) {
        const fakeDrag = { isEnded: false, cycle: i } as any;

        await act(() => {
          emitDraggableEvent(draggable, DraggableEventType.Start, fakeDrag, draggable);
        });
        expect(result.current).toBe(fakeDrag);

        await act(() => {
          emitDraggableEvent(draggable, DraggableEventType.End, fakeDrag, draggable);
        });
        expect(result.current).toBe(null);
      }
    });
  });
});
