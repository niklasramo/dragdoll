import type { DndObserver, DndObserverEventCallbacks } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';

export function useDndObserverCallback<
  T extends CollisionData = CollisionData,
  K extends keyof DndObserverEventCallbacks<T> = keyof DndObserverEventCallbacks<T>,
>(
  eventType: K,
  callback: MaybeAccessor<DndObserverEventCallbacks<T>[K] | undefined>,
  dndObserver?: MaybeAccessor<DndObserver<T> | null>,
) {
  const observerFromContext = useDndObserverContext<T>();
  const effectiveObserver = createMemo(() => {
    if (dndObserver === undefined) return observerFromContext();
    return resolveMaybeAccessor(dndObserver);
  });

  let resolvedCallback: DndObserverEventCallbacks<T>[K] | undefined;
  const [hasCallback, setHasCallback] = createSignal(false);

  createEffect(() => {
    resolvedCallback = resolveMaybeAccessor(callback);
    setHasCallback(Boolean(resolvedCallback));
  });

  createEffect(() => {
    const observer = effectiveObserver();
    if (!observer || !hasCallback()) return;
    const listener = ((...args: any[]) => {
      (resolvedCallback as ((...innerArgs: any[]) => void) | undefined)?.(...args);
    }) as DndObserverEventCallbacks<T>[K];
    const listenerId = observer.on(eventType, listener);
    onCleanup(() => observer.off(eventType, listenerId));
  });
}
