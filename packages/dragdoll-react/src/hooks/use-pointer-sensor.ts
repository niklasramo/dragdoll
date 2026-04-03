import type { PointerSensorEvents, PointerSensorSettings } from 'dragdoll/sensors/pointer';
import { PointerSensor, PointerSensorDefaultSettings } from 'dragdoll/sensors/pointer';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';
import { useSensorCallback } from './use-sensor-callback.js';

export interface UsePointerSensorSettings extends Partial<PointerSensorSettings> {
  onStart?: (e: PointerSensorEvents['start']) => void;
  onMove?: (e: PointerSensorEvents['move']) => void;
  onCancel?: (e: PointerSensorEvents['cancel']) => void;
  onEnd?: (e: PointerSensorEvents['end']) => void;
  onDestroy?: (e: PointerSensorEvents['destroy']) => void;
}

export function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings?: UsePointerSensorSettings,
  element?: Element | Window,
) {
  const { onStart, onMove, onCancel, onEnd, onDestroy } = settings || {};

  const [sensor, setSensor] = useState<PointerSensor<E> | null>(null);

  const sensorRef = useRef<PointerSensor<E> | null>(sensor);

  const settingsRef = useRef(settings as Partial<PointerSensorSettings> | undefined);
  settingsRef.current = settings as Partial<PointerSensorSettings> | undefined;

  useSensorCallback(sensor, 'start', onStart as ((e: E['start']) => void) | undefined);
  useSensorCallback(sensor, 'move', onMove as ((e: E['move']) => void) | undefined);
  useSensorCallback(sensor, 'cancel', onCancel as ((e: E['cancel']) => void) | undefined);
  useSensorCallback(sensor, 'end', onEnd as ((e: E['end']) => void) | undefined);
  useSensorCallback(sensor, 'destroy', onDestroy as ((e: E['destroy']) => void) | undefined);

  // Helper function to create a new pointer sensor or update the
  // existing sensor's element if it already exists.
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

  // Ref callback for the pointer sensor element if user does not
  // provide an explicit element.
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

      // Otherwise, create a new pointer sensor or update the
      // existing sensor's element if it already exists.
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
    if (!sensor) return;

    sensor.updateSettings({
      listenerOptions: settings?.listenerOptions ?? PointerSensorDefaultSettings.listenerOptions,
      sourceEvents: settings?.sourceEvents ?? PointerSensorDefaultSettings.sourceEvents,
      startPredicate: settings?.startPredicate ?? PointerSensorDefaultSettings.startPredicate,
      cancelOnVisibilityChange:
        settings?.cancelOnVisibilityChange ?? PointerSensorDefaultSettings.cancelOnVisibilityChange,
      cancelOnEscape: settings?.cancelOnEscape ?? PointerSensorDefaultSettings.cancelOnEscape,
      preventNativeDrag:
        settings?.preventNativeDrag ?? PointerSensorDefaultSettings.preventNativeDrag,
      preventContextMenu:
        settings?.preventContextMenu ?? PointerSensorDefaultSettings.preventContextMenu,
    });
  }, [sensor, settings]);

  return useMemoStable(() => {
    return [sensor, setRef] as const;
  }, [sensor, setRef]);
}
