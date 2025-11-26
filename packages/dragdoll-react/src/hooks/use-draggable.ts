import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DraggableOptions } from 'dragdoll/draggable';
import { Draggable } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { useRef, useState } from 'react';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import { useCallbackStable } from './use-callback-stable.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseDraggableSettings<S extends Sensor = Sensor>
  extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}

export function useDraggable<S extends Sensor = Sensor>(
  sensors: (S | null)[],
  settings?: UseDraggableSettings<S>,
) {
  // Parse sensors. The sensors might be null when they are waiting to be
  // created.
  const resolvedSensors = useMemoStable(() => {
    return sensors.filter((s) => Boolean(s)) as readonly S[];
  }, [...sensors]);

  // Parse settings.
  const { id, dndObserver, ...draggableSettings } = settings || {};

  // Dnd observer from context.
  const dndObserverFromContext = useDndObserverContext<any>();

  // Effective dnd observer.
  const effectiveDndObserver = dndObserver === undefined ? dndObserverFromContext : dndObserver;

  // The draggable instance state.
  const [draggable, setDraggable] = useState<Draggable<S> | null>(null);

  // The draggable instance ref.
  const draggableRef = useRef<Draggable<S> | null>(null);

  // The resolved sensors ref.
  const resolvedSensorsRef = useRef(resolvedSensors);
  resolvedSensorsRef.current = resolvedSensors;

  // Keep track of the currently applied id in a ref. We need this to check if
  // the id has changed since the last time the draggable was created.
  const appliedIdRef = useRef(id);

  // Keep track of the currently applied options.
  const appliedSettingsRef = useRef(settings);

  // Keep track of the applied dnd observer.
  const appliedDndObserverRef = useRef(effectiveDndObserver);

  // Keep track of the current id.
  const idRef = useRef(id);
  idRef.current = id;

  // Keep track of the current dnd observer.
  const dndObserverRef = useRef(effectiveDndObserver);
  dndObserverRef.current = effectiveDndObserver;

  // Keep track of the current draggable settings.
  const draggableSettingsRef = useRef(draggableSettings);
  draggableSettingsRef.current = draggableSettings;

  // Handle draggable destruction.
  const destroyDraggable = useCallbackStable(() => {
    const draggable = draggableRef.current;
    if (!draggable) return;
    // NB: Any DndObserver that has this draggable will automatically remove
    // it when the draggable is destroyed.
    draggable.destroy();
    draggableRef.current = null;
    setDraggable(null);
  }, []);

  // Handle draggable creation.
  const createDraggable = useCallbackStable(() => {
    destroyDraggable();
    const resolvedSensors = resolvedSensorsRef.current;
    if (resolvedSensors.length === 0) return;
    const id = idRef.current;
    const effectiveDndObserver = dndObserverRef.current;
    const currentDraggableSettings = draggableSettingsRef.current || {};

    // Create the draggable.
    const draggable = new Draggable<S>(resolvedSensors, {
      id,
      ...currentDraggableSettings,
    });

    // Add the draggable to the effective dnd observer.
    effectiveDndObserver?.addDraggables([draggable]);

    // Update refs and state.
    draggableRef.current = draggable;
    appliedIdRef.current = id;
    appliedSettingsRef.current = draggableSettingsRef.current;
    appliedDndObserverRef.current = effectiveDndObserver;
    setDraggable(draggable);
  }, [destroyDraggable]);

  // Handle sensors or id change.
  useIsomorphicLayoutEffect(() => {
    // No sensors? Destroy the draggable (if it exists).
    if (!resolvedSensors.length) {
      destroyDraggable();
      return;
    }

    // No draggable? Create a new one.
    const draggable = draggableRef.current;
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
  }, [resolvedSensors, createDraggable, destroyDraggable]);

  // Handle id change. Any time id is updated while there is a draggable, we
  // need to recreate the draggable with the new id.
  useIsomorphicLayoutEffect(() => {
    const draggable = draggableRef.current;
    if (!draggable) return;
    if (appliedIdRef.current === id) return;
    createDraggable();
  }, [id, createDraggable]);

  // Handle dndObserver change.
  useIsomorphicLayoutEffect(() => {
    // Do nothing if the observer hasn't changed.
    const appliedDndObserver = appliedDndObserverRef.current;
    if (appliedDndObserver === effectiveDndObserver) return;

    // If the draggable exists, remove it from the applied dnd observer and add
    // it to the effective dnd observer.
    const draggable = draggableRef.current;
    if (draggable) {
      appliedDndObserver?.removeDraggables([draggable]);
      effectiveDndObserver?.addDraggables([draggable]);
    }

    // Update the applied dnd observer ref.
    appliedDndObserverRef.current = effectiveDndObserver;
  }, [effectiveDndObserver]);

  // Handle settings change.
  useIsomorphicLayoutEffect(() => {
    // Make sure the draggable exists.
    const draggable = draggableRef.current;
    if (!draggable) return;

    // Only update if settings have actually changed (deep equality check).
    // This prevents unnecessary updates when settings object reference changes
    // but values remain the same.
    if (!areConfigsEqual(appliedSettingsRef.current, draggableSettings)) {
      // Here we use the protected method to parse the settings so that we can
      // use the default settings for the ones that are not provided. This is
      // the expected behavior in React's declarative nature.
      draggable.updateSettings(draggable['_parseSettings'](draggableSettings));
    }

    // Update the applied settings.
    appliedSettingsRef.current = draggableSettings;
  }, [draggableSettings]);

  // Cleanup on unmount.
  useIsomorphicLayoutEffect(() => {
    return destroyDraggable;
  }, [destroyDraggable]);

  return draggable;
}
