import type {
  KeyboardMotionSensorEvents,
  KeyboardMotionSensorSettings,
} from 'dragdoll/sensors/keyboard-motion';
import {
  KeyboardMotionSensor,
  KeyboardMotionSensorDefaultSettings,
} from 'dragdoll/sensors/keyboard-motion';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseKeyboardMotionSensorSettings<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
> extends Partial<KeyboardMotionSensorSettings<E>> {}

export function useKeyboardMotionSensor<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
>(settings?: UseKeyboardMotionSensorSettings<E>, element?: Element | null) {
  const [sensor, setSensor] = useState<KeyboardMotionSensor<E> | null>(null);

  const sensorRef = useRef<KeyboardMotionSensor<E> | null>(sensor);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Helper function to create a new keyboard motion sensor or update the existing
  // sensor's element if it already exists.
  const createSensor = useCallbackStable((node: Element | null) => {
    const currentSensor = sensorRef.current;
    if (currentSensor) {
      currentSensor.updateElement(node);
      return;
    }

    const newSensor = new KeyboardMotionSensor<E>(node, settingsRef.current);
    sensorRef.current = newSensor;
    setSensor(newSensor);
  }, []);

  // Helper function to destroy the keyboard motion sensor.
  const destroySensor = useCallbackStable(() => {
    const currentSensor = sensorRef.current;
    if (!currentSensor) return;
    currentSensor.destroy();
    sensorRef.current = null;
    setSensor(null);
  }, []);

  // Ref callback for the keyboard motion sensor element IF user does not provide an
  // explicit element.
  const setRef = useCallbackStable(
    (node: Element | null) => {
      // If user provides an explicit element, do not create a new keyboard motion
      // sensor.
      if (element !== undefined) return;

      // Destroy the keyboard motion sensor if the node is null.
      if (node === null) {
        destroySensor();
        return;
      }

      // Otherwise, create a new keyboard motion sensor or update the existing sensor's
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
        startKeys = KeyboardMotionSensorDefaultSettings.startKeys,
        moveLeftKeys = KeyboardMotionSensorDefaultSettings.moveLeftKeys,
        moveRightKeys = KeyboardMotionSensorDefaultSettings.moveRightKeys,
        moveUpKeys = KeyboardMotionSensorDefaultSettings.moveUpKeys,
        moveDownKeys = KeyboardMotionSensorDefaultSettings.moveDownKeys,
        cancelKeys = KeyboardMotionSensorDefaultSettings.cancelKeys,
        endKeys = KeyboardMotionSensorDefaultSettings.endKeys,
        cancelOnBlur = KeyboardMotionSensorDefaultSettings.cancelOnBlur,
        cancelOnVisibilityChange = KeyboardMotionSensorDefaultSettings.cancelOnVisibilityChange,
        computeSpeed = KeyboardMotionSensorDefaultSettings.computeSpeed,
        startPredicate = KeyboardMotionSensorDefaultSettings.startPredicate,
      } = settings || {};

      sensor.updateSettings({
        startKeys,
        moveLeftKeys,
        moveRightKeys,
        moveUpKeys,
        moveDownKeys,
        cancelKeys,
        endKeys,
        cancelOnBlur,
        cancelOnVisibilityChange,
        computeSpeed,
        startPredicate,
      });
    }
  }, [sensor, settings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
