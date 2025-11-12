import type { CollisionData, DndObserver } from 'dragdoll';
import { useContext } from 'react';
import { DndObserverContext } from '../contexts/dnd-observer-context.js';

export function useDndObserverContext<
  T extends CollisionData = CollisionData,
>(): DndObserver<T> | null {
  return useContext(DndObserverContext);
}
