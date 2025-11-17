import type {
  KeyboardMotionSensorEvents,
  KeyboardMotionSensorSettings,
} from 'dragdoll/sensors/keyboard-motion';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export function useKeyboardMotionSensor<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
>(settings: Partial<KeyboardMotionSensorSettings<E>> = {}, element?: Element | null) {
  const [sensor, setSensor] = useState<KeyboardMotionSensor<E> | null>(null);
  const sensorRef = useRef<KeyboardMotionSensor<E> | null>(sensor);
  const settingsRef = useRef(settings);

  // Helper function to create a new keyboard sensor.
  const createSensor = useCallbackStable((node: Element | null) => {
    sensorRef.current?.destroy();
    const newSensor = new KeyboardMotionSensor<E>(node, settingsRef.current);
    sensorRef.current = newSensor;
    setSensor(newSensor);
  }, []);

  // Helper function to destroy the keyboard sensor.
  const destroySensor = useCallbackStable(() => {
    if (!sensorRef.current) return;
    sensorRef.current.destroy();
    sensorRef.current = null;
    setSensor(null);
  }, []);

  // Ref callback for the keyboard sensor element IF user does not provide an
  // explicit element.
  const setRef = useCallbackStable(
    (node: Element | null) => {
      // If user provides an explicit element or null, do not create a new
      // keyboard sensor.
      if (element !== undefined) return;

      // Destroy the keyboard sensor if the node is null.
      if (node === null) {
        destroySensor();
        return;
      }

      // Create a new keyboard sensor if there is no sensor or the node has
      // changed.
      const currentSensor = sensorRef.current;
      if (!currentSensor || currentSensor.element !== node) {
        createSensor(node);
      }
    },
    [element, createSensor, destroySensor],
  );

  // Keep the settings up to date.
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
