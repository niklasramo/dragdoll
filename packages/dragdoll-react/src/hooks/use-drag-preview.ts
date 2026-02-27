import type { AnyDraggable } from 'dragdoll/draggable';
import { useMemo, useSyncExternalStore } from 'react';
import { dragPreviewStore } from '../utils/drag-preview-store.js';

export interface DragPreviewState {
  draggable: AnyDraggable;
  sources: readonly (HTMLElement | SVGSVGElement)[];
  proxies: readonly HTMLElement[];
  exiting: boolean;
  done: () => void;
}

export function useDragPreview(draggable: AnyDraggable | null): DragPreviewState | null {
  const activeDraggables = useSyncExternalStore(
    dragPreviewStore.subscribe,
    dragPreviewStore.getSnapshot,
    dragPreviewStore.getSnapshot,
  );

  return useMemo(() => {
    if (!draggable || !activeDraggables.has(draggable)) return null;
    const entry = activeDraggables.get(draggable)!;
    return {
      draggable,
      sources: entry.sources,
      proxies: entry.proxies,
      exiting: entry.exiting,
      done: entry.done,
    };
  }, [draggable, activeDraggables]);
}
