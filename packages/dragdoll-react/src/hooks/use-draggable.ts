import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DraggableId, DraggableOptions } from 'dragdoll/draggable';
import { Draggable } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { useRef, useState } from 'react';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import { useCallbackStable } from './use-callback-stable.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseDraggableSettings<S extends Sensor = Sensor> extends Partial<
  DraggableOptions<S>
> {
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

  const computedId = useMemoStable(() => {
    return id === undefined ? Symbol() : id;
  }, [id]);

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

  // Keep track of the current draggable settings.
  const draggableSettingsRef = useRef(draggableSettings);
  draggableSettingsRef.current = draggableSettings;

  const effectiveDndObserverRef = useRef(effectiveDndObserver);
  effectiveDndObserverRef.current = effectiveDndObserver;

  // Keep track of the currently applied draggable settings.
  const appliedSettingsRef = useRef<typeof draggableSettings | undefined>(undefined);

  // Handle draggable destruction.
  const destroyDraggable = useCallbackStable(() => {
    const draggable = draggableRef.current;
    if (!draggable) return;
    // NB: Any DndObserver that has this draggable will automatically remove
    // it when the draggable is destroyed.
    draggable.destroy();
    draggableRef.current = null;
    appliedSettingsRef.current = undefined;
    setDraggable(null);
  }, []);

  // Handle draggable creation.
  const createDraggable = useCallbackStable(
    (id: DraggableId) => {
      destroyDraggable();

      // Create the draggable.
      const draggable = new Draggable<S>(resolvedSensorsRef.current, {
        id,
        ...draggableSettingsRef.current,
      });

      // Update refs and state.
      draggableRef.current = draggable;
      appliedSettingsRef.current = draggableSettingsRef.current;
      setDraggable(draggable);
    },
    [destroyDraggable],
  );

  // Handle draggable creation. Happens on init and on id change.
  useIsomorphicLayoutEffect(() => {
    if (draggable === null || draggable.id !== computedId) {
      createDraggable(computedId);
    }
  }, [draggable, computedId, createDraggable]);

  // Handle sensors change.
  useIsomorphicLayoutEffect(() => {
    if (draggable && draggable.sensors !== resolvedSensors) {
      draggable.sensors = resolvedSensors;
    }
  }, [draggable, resolvedSensors]);

  // Handle effective dndObserver change.
  useIsomorphicLayoutEffect(() => {
    if (!draggable) return;
    effectiveDndObserver?.addDraggables([draggable]);
    return () => {
      effectiveDndObserver?.removeDraggables([draggable]);
    };
  }, [draggable, effectiveDndObserver]);

  // Handle settings change.
  useIsomorphicLayoutEffect(() => {
    // Make sure the draggable exists.
    if (!draggable) return;

    // Get the current draggable settings.
    const draggableSettings = draggableSettingsRef.current;

    // If the settings have not changed, do nothing.
    if (appliedSettingsRef.current === draggableSettings) return;

    // Only update if settings have actually changed (deep equality check).
    // This prevents unnecessary updates when settings object reference changes
    // but values remain the same.
    if (!areConfigsEqual(appliedSettingsRef.current, draggableSettings)) {
      // Here we use the protected method to parse the settings so that we can
      // use the default settings for the ones that are not provided. This is
      // the expected behavior in React's declarative nature.
      draggable.updateSettings(draggable['_parseSettings'](draggableSettings));

      // If dndGroups or computeClientRect changed we need to update the
      // effective dnd observer's matches and queue a collision check.
      if (appliedSettingsRef.current) {
        if (draggableSettings.dndGroups !== appliedSettingsRef.current.dndGroups) {
          effectiveDndObserverRef.current?.clearTargets(draggable);
        }
      }
    }

    // Update the applied settings.
    appliedSettingsRef.current = draggableSettings;
  }, [draggable, settings]);

  // Cleanup on unmount.
  useIsomorphicLayoutEffect(() => {
    return destroyDraggable;
  }, [destroyDraggable]);

  return draggable;
}
