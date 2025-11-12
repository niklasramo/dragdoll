import type { PointerSensorEvents, PointerSensorSettings } from 'dragdoll';
import { PointerSensor } from 'dragdoll';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings: Partial<PointerSensorSettings> = {},
  element?: Element | Window,
) {
  const [sensor, setSensor] = useState<PointerSensor<E> | null>(null);
  const sensorRef = useRef<PointerSensor<E> | null>(sensor);
  const settingsRef = useRef(settings);

  // Helper function to create a new pointer sensor.
  const createSensor = useCallbackStable((node: Element | Window) => {
    sensorRef.current?.destroy();
    const newSensor = new PointerSensor<E>(node, settingsRef.current);
    sensorRef.current = newSensor;
    setSensor(newSensor);
  }, []);

  // Helper function to destroy the pointer sensor.
  const destroySensor = useCallbackStable(() => {
    if (!sensorRef.current) return;
    sensorRef.current.destroy();
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

      // Create a new pointer sensor if there is no sensor or the node has
      // changed.
      const currentSensor = sensorRef.current;
      if (!currentSensor || currentSensor.element !== node) {
        createSensor(node);
      }
    },
    [element, createSensor, destroySensor],
  );

  // Keep settings up to date.
  settingsRef.current = settings;

  // Handle explicit element change.
  useIsomorphicLayoutEffect(() => {
    if (element === undefined) return;
    createSensor(element);
    return destroySensor;
  }, [element, createSensor, destroySensor]);

  // Handle settings change.
  useIsomorphicLayoutEffect(() => {
    if (sensor) sensor.updateSettings(settings);
  }, [sensor, settings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
