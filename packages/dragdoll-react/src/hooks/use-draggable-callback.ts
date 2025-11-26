import type {
  Draggable,
  DraggableEventCallback,
  DraggableEventCallbacks,
} from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export function useDraggableCallback<
  S extends Sensor = Sensor,
  K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>,
>(draggable: Draggable<S> | null, eventType: K, callback?: DraggableEventCallback<S, K>) {
  const hasCallback = !!callback;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useIsomorphicLayoutEffect(() => {
    if (!draggable || !hasCallback) return;
    const listener = ((...args: any[]) => {
      (callbackRef.current as ((...args: any[]) => void) | undefined)?.(...args);
    }) as DraggableEventCallback<S, K>;
    const id = draggable.on(eventType, listener);
    return () => void draggable.off(eventType, id);
  }, [draggable, eventType, hasCallback]);
}
