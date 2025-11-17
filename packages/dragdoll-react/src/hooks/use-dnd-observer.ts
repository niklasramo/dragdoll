import type { DndObserverEventCallbacks, DndObserverOptions } from 'dragdoll/dnd-observer';
import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import { useState } from 'react';
import { useDndObserverCallback } from './use-dnd-observer-callback.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export interface UseDndObserverSettings<T extends CollisionData = CollisionData> {
  collisionDetector?: DndObserverOptions<T>['collisionDetector'];
  onStart?: DndObserverEventCallbacks<T>['start'];
  onMove?: DndObserverEventCallbacks<T>['move'];
  onEnter?: DndObserverEventCallbacks<T>['enter'];
  onLeave?: DndObserverEventCallbacks<T>['leave'];
  onCollide?: DndObserverEventCallbacks<T>['collide'];
  onEnd?: DndObserverEventCallbacks<T>['end'];
  onAddDraggables?: DndObserverEventCallbacks<T>['addDraggables'];
  onRemoveDraggables?: DndObserverEventCallbacks<T>['removeDraggables'];
  onAddDroppables?: DndObserverEventCallbacks<T>['addDroppables'];
  onRemoveDroppables?: DndObserverEventCallbacks<T>['removeDroppables'];
  onDestroy?: DndObserverEventCallbacks<T>['destroy'];
}

export function useDndObserver<T extends CollisionData = CollisionData>({
  collisionDetector,
  onStart,
  onMove,
  onEnter,
  onLeave,
  onCollide,
  onEnd,
  onAddDraggables,
  onRemoveDraggables,
  onAddDroppables,
  onRemoveDroppables,
  onDestroy,
}: UseDndObserverSettings<T> = {}) {
  const [dndObserver, setDndObserver] = useState<DndObserver<T> | null>(null);

  // Recreate the instance when the collision detector changes.
  useIsomorphicLayoutEffect(() => {
    const instance = new DndObserver<T>({ collisionDetector });
    setDndObserver(instance);
    return () => {
      instance.destroy();
      setDndObserver(null);
    };
  }, [collisionDetector]);

  // Bind callbacks.
  useDndObserverCallback(DndObserverEventType.Start, onStart, dndObserver);
  useDndObserverCallback(DndObserverEventType.Move, onMove, dndObserver);
  useDndObserverCallback(DndObserverEventType.Enter, onEnter, dndObserver);
  useDndObserverCallback(DndObserverEventType.Leave, onLeave, dndObserver);
  useDndObserverCallback(DndObserverEventType.Collide, onCollide, dndObserver);
  useDndObserverCallback(DndObserverEventType.End, onEnd, dndObserver);
  useDndObserverCallback(DndObserverEventType.AddDraggables, onAddDraggables, dndObserver);
  useDndObserverCallback(DndObserverEventType.RemoveDraggables, onRemoveDraggables, dndObserver);
  useDndObserverCallback(DndObserverEventType.AddDroppables, onAddDroppables, dndObserver);
  useDndObserverCallback(DndObserverEventType.RemoveDroppables, onRemoveDroppables, dndObserver);
  useDndObserverCallback(DndObserverEventType.Destroy, onDestroy, dndObserver);

  return dndObserver;
}
