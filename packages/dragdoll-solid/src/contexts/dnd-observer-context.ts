import type { DndObserver } from 'dragdoll/dnd-observer';
import type { Accessor } from 'solid-js';
import { createContext } from 'solid-js';

const defaultObserverAccessor: Accessor<DndObserver | null> = () => null;

export const DndObserverContext =
  createContext<Accessor<DndObserver | null>>(defaultObserverAccessor);
