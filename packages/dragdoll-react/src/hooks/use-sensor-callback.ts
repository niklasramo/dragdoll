import type { Sensor, SensorEvents } from 'dragdoll/sensors';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

export function useSensorCallback<
  E extends SensorEvents = SensorEvents,
  K extends keyof E = keyof E,
>(sensor: Sensor<E> | null, eventType: K, callback?: (eventData: E[K]) => void) {
  const hasCallback = !!callback;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useIsomorphicLayoutEffect(() => {
    if (!sensor || !hasCallback) return;
    const listener = (eventData: E[K]) => {
      callbackRef.current?.(eventData);
    };
    const id = sensor.on(eventType, listener);
    return () => void sensor.off(eventType, id);
  }, [sensor, eventType, hasCallback]);
}
