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
import { useSensorCallback } from './use-sensor-callback.js';

export interface UseKeyboardMotionSensorSettings<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
> extends Partial<KeyboardMotionSensorSettings<E>> {
  onStart?: (e: E['start']) => void;
  onMove?: (e: E['move']) => void;
  onCancel?: (e: E['cancel']) => void;
  onEnd?: (e: E['end']) => void;
  onDestroy?: (e: E['destroy']) => void;
  onTick?: (e: E['tick']) => void;
}

export function useKeyboardMotionSensor<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
>(settings?: UseKeyboardMotionSensorSettings<E>, element?: Element | null) {
  const { onStart, onMove, onCancel, onEnd, onDestroy, onTick, ...sensorSettings } =
    settings || ({} as UseKeyboardMotionSensorSettings<E>);

  const [sensor, setSensor] = useState<KeyboardMotionSensor<E> | null>(null);

  const sensorRef = useRef<KeyboardMotionSensor<E> | null>(sensor);

  const settingsRef = useRef(
    sensorSettings as Partial<KeyboardMotionSensorSettings<E>> | undefined,
  );
  settingsRef.current = sensorSettings as Partial<KeyboardMotionSensorSettings<E>> | undefined;

  useSensorCallback(sensor, 'start', onStart);
  useSensorCallback(sensor, 'move', onMove);
  useSensorCallback(sensor, 'cancel', onCancel);
  useSensorCallback(sensor, 'end', onEnd);
  useSensorCallback(sensor, 'destroy', onDestroy);
  useSensorCallback(sensor, 'tick', onTick);

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
      } = sensorSettings;

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
  }, [sensor, sensorSettings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
