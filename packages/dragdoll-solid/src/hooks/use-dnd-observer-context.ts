import type { DndObserver } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import type { Accessor } from 'solid-js';
import { useContext } from 'solid-js';
import { DndObserverContext } from '../contexts/dnd-observer-context.js';

export function useDndObserverContext<T extends CollisionData = CollisionData>() {
  return useContext(DndObserverContext) as Accessor<DndObserver<T> | null>;
}
