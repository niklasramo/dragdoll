import type { AnyDraggable } from 'dragdoll/draggable';

type SourceElements = readonly (HTMLElement | SVGSVGElement)[];

export type DragPreviewStoreEntry = {
  sources: SourceElements;
  proxies: readonly HTMLElement[];
  exiting: boolean;
  done: () => void;
};

const NOOP = () => {};

let activeDraggables = new Map<AnyDraggable, DragPreviewStoreEntry>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const dragPreviewStore = {
  add(draggable: AnyDraggable, sources: SourceElements, proxies: readonly HTMLElement[]) {
    activeDraggables = new Map(activeDraggables);
    activeDraggables.set(draggable, { sources, proxies, exiting: false, done: NOOP });
    notify();
  },
  startExiting(draggable: AnyDraggable, done: () => void) {
    const entry = activeDraggables.get(draggable);
    if (!entry) return;
    activeDraggables = new Map(activeDraggables);
    activeDraggables.set(draggable, { ...entry, exiting: true, done });
    notify();
  },
  remove(draggable: AnyDraggable) {
    if (activeDraggables.has(draggable)) {
      activeDraggables = new Map(activeDraggables);
      activeDraggables.delete(draggable);
      notify();
    }
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return activeDraggables;
  },
};
