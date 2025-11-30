import type { KeyboardSensorEvents, KeyboardSensorSettings } from 'dragdoll/sensors/keyboard';
import { KeyboardSensor, KeyboardSensorDefaultSettings } from 'dragdoll/sensors/keyboard';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseKeyboardSensorSettings<E extends KeyboardSensorEvents = KeyboardSensorEvents>
  extends Partial<KeyboardSensorSettings<E>> {}

export function useKeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>(
  settings?: UseKeyboardSensorSettings<E>,
  element?: Element | null,
) {
  const [sensor, setSensor] = useState<KeyboardSensor<E> | null>(null);

  const sensorRef = useRef<KeyboardSensor<E> | null>(sensor);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Helper function to create a new keyboard sensor or update the existing
  // sensor's element if it already exists.
  const createSensor = useCallbackStable((node: Element | null) => {
    const currentSensor = sensorRef.current;
    if (currentSensor) {
      currentSensor.updateElement(node);
      return;
    }

    const newSensor = new KeyboardSensor<E>(node, settingsRef.current);
    sensorRef.current = newSensor;
    setSensor(newSensor);
  }, []);

  // Helper function to destroy the keyboard sensor.
  const destroySensor = useCallbackStable(() => {
    const currentSensor = sensorRef.current;
    if (!currentSensor) return;
    currentSensor.destroy();
    sensorRef.current = null;
    setSensor(null);
  }, []);

  // Ref callback for the keyboard sensor element IF user does not provide an
  // explicit element.
  const setRef = useCallbackStable(
    (node: Element | null) => {
      // If user provides an explicit element, do not create a new keyboard
      // sensor.
      if (element !== undefined) return;

      // Destroy the keyboard sensor if the node is null.
      if (node === null) {
        destroySensor();
        return;
      }

      // Otherwise, create a new keyboard sensor or update the existing sensor's
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
        moveDistance = KeyboardSensorDefaultSettings.moveDistance,
        cancelOnBlur = KeyboardSensorDefaultSettings.cancelOnBlur,
        cancelOnVisibilityChange = KeyboardSensorDefaultSettings.cancelOnVisibilityChange,
        startPredicate = KeyboardSensorDefaultSettings.startPredicate,
        movePredicate = KeyboardSensorDefaultSettings.movePredicate,
        cancelPredicate = KeyboardSensorDefaultSettings.cancelPredicate,
        endPredicate = KeyboardSensorDefaultSettings.endPredicate,
      } = settings || {};

      sensor.updateSettings({
        moveDistance,
        cancelOnBlur,
        cancelOnVisibilityChange,
        startPredicate,
        movePredicate,
        cancelPredicate,
        endPredicate,
      });
    }
  }, [sensor, settings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
