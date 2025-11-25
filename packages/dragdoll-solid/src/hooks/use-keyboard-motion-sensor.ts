import type {
  KeyboardMotionSensorEvents,
  KeyboardMotionSensorSettings,
} from 'dragdoll/sensors/keyboard-motion';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useKeyboardMotionSensor<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
>(
  settings: MaybeAccessor<Partial<KeyboardMotionSensorSettings<E>> | undefined> = {},
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardMotionSensor<E> | null>, (node: Element | null) => void] {
  const resolvedSettings = createMemo(() => resolveMaybeAccessor(settings, {}) || {});
  const resolvedElement = createMemo(() =>
    element === undefined ? undefined : resolveMaybeAccessor(element),
  );

  const [sensor, setSensor] = createSignal<KeyboardMotionSensor<E> | null>(null);
  let sensorRef: KeyboardMotionSensor<E> | null = null;

  const destroySensor = () => {
    if (!sensorRef) return;
    sensorRef.destroy();
    sensorRef = null;
    setSensor(null);
  };

  const createSensor = (node: Element | null) => {
    sensorRef?.destroy();
    const newSensor = new KeyboardMotionSensor<E>(node, resolvedSettings());
    sensorRef = newSensor;
    setSensor(newSensor);
  };

  createEffect(() => {
    const current = sensorRef;
    if (current) current.updateSettings(resolvedSettings());
  });

  createEffect(() => {
    const explicitElement = resolvedElement();
    if (explicitElement === undefined) return;
    createSensor(explicitElement);
    onCleanup(destroySensor);
  });

  const setRef = (node: Element | null) => {
    if (element !== undefined) return;
    if (node === null) {
      destroySensor();
      return;
    }
    if (sensorRef?.element === node) return;
    createSensor(node);
  };

  onCleanup(destroySensor);

  return [sensor, setRef] as const;
}
