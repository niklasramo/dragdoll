import type { KeyboardSensorEvents, KeyboardSensorSettings } from 'dragdoll/sensors/keyboard';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function useKeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>(
  settings: MaybeAccessor<Partial<KeyboardSensorSettings<E>> | undefined> = {},
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardSensor<E> | null>, (node: Element | null) => void] {
  if (isServer) return [() => null, () => {}] as const;

  const resolvedSettings = createMemo(() => resolveMaybeAccessor(settings, {}) || {});
  const resolvedElement = createMemo(() =>
    element === undefined ? undefined : resolveMaybeAccessor(element),
  );

  const [sensor, setSensor] = createSignal<KeyboardSensor<E> | null>(null);
  let sensorRef: KeyboardSensor<E> | null = null;

  const destroySensor = () => {
    if (!sensorRef) return;
    sensorRef.destroy();
    sensorRef = null;
    setSensor(null);
  };

  const createSensor = (node: Element | null) => {
    if (node === null) {
      destroySensor();
      return;
    }
    sensorRef?.destroy();
    const newSensor = new KeyboardSensor<E>(node, resolvedSettings());
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
