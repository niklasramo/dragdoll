import type {
  Draggable,
  DraggableEventCallback,
  DraggableEventCallbacks,
} from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useDraggableCallback<
  S extends Sensor[] = Sensor[],
  K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>,
>(
  draggableInput: MaybeAccessor<Draggable<S> | null>,
  eventType: K,
  callback: MaybeAccessor<DraggableEventCallback<S, K> | undefined>,
) {
  const resolvedDraggable = createMemo(() => resolveMaybeAccessor(draggableInput));
  let callbackRef: DraggableEventCallback<S, K> | undefined;
  const [hasCallback, setHasCallback] = createSignal(false);

  createEffect(() => {
    const resolvedCallback = resolveMaybeAccessor(callback);
    callbackRef = resolvedCallback;
    setHasCallback(Boolean(resolvedCallback));
  });

  createEffect(() => {
    const draggable = resolvedDraggable();
    if (!draggable || !hasCallback()) return;
    const listener = ((...args: any[]) => {
      (callbackRef as ((...innerArgs: any[]) => void) | undefined)?.(...args);
    }) as DraggableEventCallback<S, K>;
    const listenerId = draggable.on(eventType, listener);
    onCleanup(() => draggable.off(eventType, listenerId));
  });
}
