import type { AnyDraggable } from 'dragdoll/draggable';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { dragPreviewStore } from '../utils/drag-preview-store.js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export interface DragPreviewState {
  draggable: AnyDraggable;
  sources: readonly (HTMLElement | SVGSVGElement)[];
  proxies: readonly HTMLElement[];
  exiting: boolean;
  done: () => void;
}

export function useDragPreview(
  draggableInput: MaybeAccessor<AnyDraggable | null>,
): Accessor<DragPreviewState | null> {
  // Bridge the external store into Solid reactivity.
  const [snapshot, setSnapshot] = createSignal(dragPreviewStore.getSnapshot());

  createEffect(() => {
    const unsub = dragPreviewStore.subscribe(() => {
      setSnapshot(dragPreviewStore.getSnapshot());
    });
    onCleanup(unsub);
  });

  return createMemo(() => {
    const draggable = resolveMaybeAccessor(draggableInput);
    const activeDraggables = snapshot();
    if (!draggable || !activeDraggables.has(draggable)) return null;
    const entry = activeDraggables.get(draggable)!;
    return {
      draggable,
      sources: entry.sources,
      proxies: entry.proxies,
      exiting: entry.exiting,
      done: entry.done,
    };
  });
}
