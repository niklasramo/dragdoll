import { Draggable, DraggableDrag, DraggableEventType } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useDraggableDrag<S extends Sensor = Sensor>(
  draggableInput: MaybeAccessor<Draggable<S> | null>,
  trackMove = false,
) {
  const resolvedDraggable = createMemo(() => resolveMaybeAccessor(draggableInput));
  const [drag, setDrag] = createSignal<DraggableDrag<S> | null>(null);
  const [tick, setTick] = createSignal(0);

  createEffect(() => {
    const draggable = resolvedDraggable();
    setDrag(draggable?.drag || null);
    if (!draggable) return;

    const startId = draggable.on(DraggableEventType.Start, () => {
      setDrag(draggable.drag || null);
    });

    let moveId: ReturnType<Draggable<S>['on']> | null = null;
    if (trackMove) {
      moveId = draggable.on(DraggableEventType.Move, () => {
        if (draggable.drag) {
          setTick((value) => (value + 1) % Number.MAX_SAFE_INTEGER);
        }
      });
    }

    const endId = draggable.on(DraggableEventType.End, () => {
      setDrag(null);
    });

    onCleanup(() => {
      draggable.off(DraggableEventType.Start, startId);
      if (moveId) draggable.off(DraggableEventType.Move, moveId);
      draggable.off(DraggableEventType.End, endId);
    });
  });

  return createMemo(() => {
    tick();
    return drag();
  });
}
