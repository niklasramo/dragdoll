import type { CollisionData } from 'dragdoll';
import { DndObserver, DndObserverEventCallbacks } from 'dragdoll';
import { useRef } from 'react';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export function useDndObserverCallback<
  T extends CollisionData = CollisionData,
  K extends keyof DndObserverEventCallbacks<T> = keyof DndObserverEventCallbacks<T>,
>(eventType: K, callback?: DndObserverEventCallbacks<T>[K], dndObserver?: DndObserver<T> | null) {
  const dndObserverFromContext = useDndObserverContext<T>();
  const effectiveDndObserver = dndObserver === undefined ? dndObserverFromContext : dndObserver;
  const hasCallback = !!callback;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useIsomorphicLayoutEffect(() => {
    if (!effectiveDndObserver || !hasCallback) return;
    const listener = ((...args: any[]) => {
      (callbackRef.current as ((...args: any[]) => void) | undefined)?.(...args);
    }) as DndObserverEventCallbacks<T>[K];
    const id = effectiveDndObserver.on(eventType, listener);
    return () => void effectiveDndObserver.off(eventType, id);
  }, [eventType, effectiveDndObserver, hasCallback]);
}
