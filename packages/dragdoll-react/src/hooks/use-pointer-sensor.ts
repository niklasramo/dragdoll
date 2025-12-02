import type { PointerSensorEvents, PointerSensorSettings } from 'dragdoll/sensors/pointer';
import { PointerSensor, PointerSensorDefaultSettings } from 'dragdoll/sensors/pointer';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UsePointerSensorSettings extends Partial<PointerSensorSettings> {}

export function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings?: UsePointerSensorSettings,
  element?: Element | Window,
) {
  const [sensor, setSensor] = useState<PointerSensor<E> | null>(null);

  const sensorRef = useRef<PointerSensor<E> | null>(sensor);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Helper function to create a new pointer sensor or update the existing
  // sensor's element if it already exists.
  const createSensor = useCallbackStable((node: Element | Window) => {
    const currentSensor = sensorRef.current;
    if (currentSensor) {
      currentSensor.updateElement(node);
      return;
    }

    const newSensor = new PointerSensor<E>(node, settingsRef.current);
    sensorRef.current = newSensor;
    setSensor(newSensor);
  }, []);

  // Helper function to destroy the pointer sensor.
  const destroySensor = useCallbackStable(() => {
    const currentSensor = sensorRef.current;
    if (!currentSensor) return;
    currentSensor.destroy();
    sensorRef.current = null;
    setSensor(null);
  }, []);

  // Ref callback for the pointer sensor element IF user does not provide an
  // explicit element.
  const setRef = useCallbackStable(
    (node: Element | null) => {
      // If user provides an explicit element, do not create a new pointer
      // sensor.
      if (element !== undefined) return;

      // Destroy the pointer sensor if the node is null.
      if (node === null) {
        destroySensor();
        return;
      }

      // Otherwise, create a new pointer sensor or update the existing sensor's
      // element if it already exists.
      createSensor(node);
    },
    [element, createSensor, destroySensor],
  );

  // Handle explicit element change.
  useIsomorphicLayoutEffect(() => {
    if (element === undefined) return;
    createSensor(element);
    return destroySensor;
  }, [element, createSensor, destroySensor]);

  // Handle settings change.
  useIsomorphicLayoutEffect(() => {
    if (sensor) {
      const {
        listenerOptions = PointerSensorDefaultSettings.listenerOptions,
        sourceEvents = PointerSensorDefaultSettings.sourceEvents,
        startPredicate = PointerSensorDefaultSettings.startPredicate,
      } = settings || {};

      sensor.updateSettings({
        listenerOptions,
        sourceEvents,
        startPredicate,
      });
    }
  }, [sensor, settings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
