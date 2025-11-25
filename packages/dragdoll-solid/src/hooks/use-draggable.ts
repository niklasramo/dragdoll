import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DraggableOptions } from 'dragdoll/draggable';
import { Draggable } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import type { Accessor } from 'solid-js';
import { batch, createEffect, createMemo, createSignal, onCleanup, untrack } from 'solid-js';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor, resolveMaybeAccessorArray } from '../utils/maybe-accessor.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';

export interface UseDraggableSettings<S extends Sensor[] = Sensor[]>
  extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}

export function useDraggable<S extends Sensor[] = Sensor[]>(
  sensors: MaybeAccessor<(S[number] | null)[]> | MaybeAccessor<S[number] | null>[],
  settings?: MaybeAccessor<UseDraggableSettings<S> | undefined>,
): Accessor<Draggable<S> | null> {
  const getResolvedSensors = createMemo(() => {
    return (
      Array.isArray(sensors)
        ? resolveMaybeAccessorArray(sensors)
        : (resolveMaybeAccessor(sensors) ?? [])
    ).filter((sensor): sensor is S[number] => Boolean(sensor)) as S;
  });
  const getSettings = createMemo(() => resolveMaybeAccessor(settings));
  const getId = createMemo(() => getSettings()?.id);
  const getDndObserver = createMemo(() => getSettings()?.dndObserver);
  const getDraggableOptions = createMemo(() => {
    const current = getSettings();
    if (!current) return undefined;
    const { dndObserver: _ignoredObserver, id: _ignoredId, ...rest } = current;
    return rest as Partial<DraggableOptions<S>>;
  });
  const getDndObserverFromContext = useDndObserverContext<any>();
  const getEffectiveDndObserver = createMemo(() => {
    const settingsDndObserver = getDndObserver();
    return settingsDndObserver === undefined ? getDndObserverFromContext() : settingsDndObserver;
  });
  const [getDraggable, setDraggable] = createSignal<Draggable<S> | null>(null);

  // Refs.
  let draggableRef: Draggable<S> | null = null;
  let appliedIdRef = getId();
  let appliedSettingsRef = getDraggableOptions();
  let appliedDndObserverRef = getEffectiveDndObserver();

  // Handle draggable destruction.
  const destroyDraggable = () => {
    if (!draggableRef) return;
    draggableRef.destroy();
    draggableRef = null;
    setDraggable(null);
  };

  // Handle draggable creation.
  const createDraggable = () => {
    batch(() => {
      destroyDraggable();
      const resolvedSensors = untrack(getResolvedSensors);
      if (!resolvedSensors.length) return;
      const options = untrack(getDraggableOptions);
      const id = getId();
      const instance = new Draggable<S>(resolvedSensors, {
        id,
        ...options,
      });

      // Create the draggable.
      const dndObserver = untrack(getEffectiveDndObserver);

      // Add the draggable to the effective dnd observer.
      dndObserver?.addDraggables([instance]);

      // Update refs and state.
      draggableRef = instance;
      appliedIdRef = id;
      appliedSettingsRef = options;
      appliedDndObserverRef = dndObserver;
      setDraggable(instance);
    });
  };

  // Handle sensors change.
  createEffect(() => {
    const resolvedSensors = getResolvedSensors();

    // No sensors? Destroy the draggable (if it exists).
    if (!resolvedSensors.length) {
      destroyDraggable();
      return;
    }

    // No draggable? Create a new one.
    const draggable = draggableRef;
    if (!draggable) {
      createDraggable();
      return;
    }

    // If the sensors have changed, recreate the draggable.
    if (
      resolvedSensors.length !== draggable.sensors.length ||
      resolvedSensors.some((sensor) => !draggable.sensors.includes(sensor))
    ) {
      createDraggable();
    }
  });

  // Handle id change. Any time id is updated while there is a draggable, we
  // need to recreate the draggable with the new id.
  createEffect(() => {
    const draggable = draggableRef;
    if (!draggable) return;
    const id = getId();
    if (appliedIdRef === id) return;
    createDraggable();
  });

  // Handle dndObserver change.
  createEffect(() => {
    const currentObserver = effectiveObserver();
    if (appliedObserver === currentObserver) return;
    const current = draggableRef;
    if (current) {
      appliedObserver?.removeDraggables([current]);
      currentObserver?.addDraggables([current]);
    }
    appliedObserver = currentObserver;
  });

  // Handle settings change.
  createEffect(() => {
    const current = draggableRef;
    if (!current) return;
    const nextSettings = normalizedSettings();
    if (areConfigsEqual(appliedSettings, nextSettings)) return;
    current.updateSettings(current['_parseSettings'](nextSettings));
    appliedSettings = nextSettings;
  });

  onCleanup(destroyDraggable);

  return getDraggable;
}
