import type { DndObserverEventCallbacks, DndObserverOptions } from 'dragdoll/dnd-observer';
import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';
import { useDndObserverCallback } from './use-dnd-observer-callback.js';

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

export function useDndObserver<T extends CollisionData = CollisionData>(
  settingsInput: MaybeAccessor<UseDndObserverSettings<T> | undefined> = undefined,
) {
  const settings = createMemo(() => resolveMaybeAccessor(settingsInput));
  const collisionDetector = createMemo(() => settings()?.collisionDetector);
  const [dndObserver, setDndObserver] = createSignal<DndObserver<T> | null>(null);

  createEffect(() => {
    const dndObserverInstance = new DndObserver<T>({
      collisionDetector: collisionDetector(),
    });
    setDndObserver(dndObserverInstance);
    onCleanup(() => {
      dndObserverInstance.destroy();
      setDndObserver(null);
    });
  });

  useDndObserverCallback(
    DndObserverEventType.Start,
    createMemo(() => settings()?.onStart),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Move,
    createMemo(() => settings()?.onMove),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Enter,
    createMemo(() => settings()?.onEnter),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Leave,
    createMemo(() => settings()?.onLeave),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Collide,
    createMemo(() => settings()?.onCollide),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.End,
    createMemo(() => settings()?.onEnd),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.AddDraggables,
    createMemo(() => settings()?.onAddDraggables),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.RemoveDraggables,
    createMemo(() => settings()?.onRemoveDraggables),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.AddDroppables,
    createMemo(() => settings()?.onAddDroppables),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.RemoveDroppables,
    createMemo(() => settings()?.onRemoveDroppables),
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Destroy,
    createMemo(() => settings()?.onDestroy),
    dndObserver,
  );

  return dndObserver;
}
