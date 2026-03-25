import type { PointerSensorEvents, PointerSensorSettings } from 'dragdoll/sensors/pointer';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import type { Accessor } from 'solid-js';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';

export function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings: MaybeAccessor<Partial<PointerSensorSettings> | undefined> = {},
  element?: MaybeAccessor<Element | Window | null>,
): readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void] {
  if (isServer) return [() => null, () => {}] as const;

  const resolvedSettings = createMemo(() => resolveMaybeAccessor(settings, {}) || {});
  const resolvedElement = createMemo(() =>
    element === undefined ? undefined : resolveMaybeAccessor(element),
  );

  const [sensor, setSensor] = createSignal<PointerSensor<E> | null>(null);
  let sensorRef: PointerSensor<E> | null = null;

  const destroySensor = () => {
    if (!sensorRef) return;
    sensorRef.destroy();
    sensorRef = null;
    setSensor(null);
  };

  const createSensor = (node: Element | Window) => {
    sensorRef?.destroy();
    const newSensor = new PointerSensor<E>(node, resolvedSettings());
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
    if (explicitElement === null) {
      destroySensor();
      return;
    }
    createSensor(explicitElement);
    onCleanup(destroySensor);
  });

  const setRef = (node: Element | null) => {
    if (element !== undefined) return;
    if (!node) {
      destroySensor();
      return;
    }
    if (sensorRef?.element === node) return;
    createSensor(node);
  };

  onCleanup(destroySensor);

  return [sensor, setRef] as const;
}
