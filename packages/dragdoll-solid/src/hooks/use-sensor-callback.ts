import type { Sensor, SensorEvents } from 'dragdoll/sensors';
import { createEffect, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useSensorCallback<
  E extends SensorEvents = SensorEvents,
  K extends keyof E = keyof E,
>(
  sensorInput: MaybeAccessor<Sensor<E> | null>,
  eventType: K,
  callback?: MaybeAccessor<((eventData: E[K]) => void) | undefined>,
) {
  // Store callback in a plain variable (not a signal) to avoid
  // re-subscribing the event listener when only the callback changes.
  let callbackRef: ((eventData: E[K]) => void) | undefined;

  // Keep callbackRef in sync with the latest value.
  createEffect(() => {
    callbackRef = resolveMaybeAccessor(callback);
  });

  // Attach/detach event listener when sensor changes.
  createEffect(() => {
    const sensor = resolveMaybeAccessor(sensorInput);
    if (!sensor || !callbackRef) return;
    const listener = (eventData: E[K]) => {
      callbackRef?.(eventData);
    };
    const id = sensor.on(eventType, listener);
    onCleanup(() => sensor.off(eventType, id));
  });
}
