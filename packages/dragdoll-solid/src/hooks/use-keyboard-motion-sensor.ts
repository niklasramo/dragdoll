import type {
  KeyboardMotionSensorEvents,
  KeyboardMotionSensorSettings,
} from 'dragdoll/sensors/keyboard-motion';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo, createSignal, onCleanup, untrack } from 'solid-js';
import { isServer } from 'solid-js/web';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useKeyboardMotionSensor<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
>(
  settings: MaybeAccessor<Partial<KeyboardMotionSensorSettings<E>> | undefined> = {},
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardMotionSensor<E> | null>, (node: Element | null) => void] {
  if (isServer) return [() => null, () => {}] as const;

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

  // Read settings via untrack to avoid creating a dependency in
  // the caller's tracking scope. Settings changes are handled by
  // the dedicated settings effect below.
  const createSensor = (node: Element | null) => {
    if (node === null) {
      destroySensor();
      return;
    }
    sensorRef?.destroy();
    const newSensor = new KeyboardMotionSensor<E>(node, untrack(resolvedSettings));
    sensorRef = newSensor;
    setSensor(newSensor);
  };

  // Handle settings change.
  createEffect(() => {
    const current = sensorRef;
    if (current) current.updateSettings(resolvedSettings());
  });

  // Handle explicit element change. Settings are read untracked
  // inside createSensor so this effect only depends on the
  // element.
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
