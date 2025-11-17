import type { DndObserver } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import { useContext } from 'react';
import { DndObserverContext } from '../contexts/dnd-observer-context.js';

export function useDndObserverContext<
  T extends CollisionData = CollisionData,
>(): DndObserver<T> | null {
  return useContext(DndObserverContext);
}
