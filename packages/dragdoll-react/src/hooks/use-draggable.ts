import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DraggableId, DraggableOptions } from 'dragdoll/draggable';
import { Draggable } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { useRef, useState } from 'react';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import { createDragPreviewProxies } from '../utils/create-drag-preview-proxies.js';
import { dragPreviewStore } from '../utils/drag-preview-store.js';
import { useCallbackStable } from './use-callback-stable.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseDraggableSettings<S extends Sensor = Sensor>
  // Omit container to prevent accidental React unmount errors
  // when using dragPreview.
  extends Omit<Partial<DraggableOptions<S>>, 'container'> {
  dndObserver?: DndObserver<any> | null;
  // If true, generates a proxy element that receives all drag
  // movements. Your original element stays in place. Use
  // `<DragPreview>` to render visuals into the proxy.
  dragPreview?: boolean;
  // The container element to reparent drag preview proxy elements
  // into during drag. Defaults to `document.body`. Useful for
  // iframe, shadow DOM, or scoped z-index contexts. Only used
  // when `dragPreview` is true.
  dragPreviewContainer?: HTMLElement | (() => HTMLElement);
  // If set to a positive number, enables exit animation for drag
  // previews. On drag end the proxy stays alive in an "exiting"
  // state. The `DragPreview` render props receive `exiting: true`
  // and a `done()` callback. Call `done()` when your animation
  // finishes to remove the proxy. If `done()` is not called
  // within this many milliseconds the proxy is removed
  // automatically as a safety fallback. Only used when
  // `dragPreview` is true.
  dragPreviewExitTimeout?: number;
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

  // Parse settings. Strip React-only options that should not reach
  // the core Draggable or be included in the settings equality
  // check.
  const { id, dndObserver, dragPreviewContainer, dragPreviewExitTimeout, ...draggableSettings } =
    settings || {};

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

  const dragPreviewContainerRef = useRef(dragPreviewContainer);
  dragPreviewContainerRef.current = dragPreviewContainer;

  const dragPreviewExitTimeoutRef = useRef(dragPreviewExitTimeout);
  dragPreviewExitTimeoutRef.current = dragPreviewExitTimeout;

  // Keep track of the currently applied draggable settings.
  const appliedSettingsRef = useRef<typeof draggableSettings | undefined>(undefined);

  // Handle draggable destruction.
  const destroyDraggable = useCallbackStable(() => {
    const draggable = draggableRef.current;
    if (!draggable) return;
    // Any DndObserver that has this draggable will automatically
    // remove it when the draggable is destroyed.
    draggable.destroy();
    draggableRef.current = null;
    appliedSettingsRef.current = undefined;
    setDraggable(null);
  }, []);

  // Handle draggable creation.
  const createDraggable = useCallbackStable(
    (id: DraggableId) => {
      destroyDraggable();

      const isDragPreview = draggableSettingsRef.current.dragPreview;

      // Create the draggable.
      const draggable = new Draggable<S>(resolvedSensorsRef.current, {
        id,
        ...draggableSettingsRef.current,
        // Override the elements method dynamically so it does not
        // cause recreation on settings equality check.
        elements(data) {
          const settings = draggableSettingsRef.current;
          const getSourceElements = settings.elements || (() => null);
          const sources = getSourceElements(data);

          // If drag preview is not enabled or there are no sources,
          // return the sources.
          if (!settings.dragPreview || !sources || sources.length === 0) {
            return sources;
          }

          // Create a proxy for each source element.
          const proxies = createDragPreviewProxies(sources);

          // Push to global store so DragPreview knows this
          // draggable is active.
          dragPreviewStore.add(data.draggable, sources, proxies);

          // Cleanup: remove from store first (triggers React portal
          // unmount), then defer proxy DOM removal so React can
          // finish unmounting.
          const onDragEnd = () => {
            const exitTimeout = dragPreviewExitTimeoutRef.current || 0;

            if (exitTimeout > 0) {
              // Set data-exiting attribute on proxies for CSS
              // targeting.
              for (const el of proxies) el.dataset.exiting = 'true';

              // Create idempotent cleanup with fallback timer.
              let cleaned = false;
              const cleanup = () => {
                if (cleaned) return;
                cleaned = true;
                clearTimeout(fallbackTimer);
                dragPreviewStore.remove(data.draggable);
                setTimeout(() => {
                  for (const el of proxies) el.remove();
                }, 0);
              };
              const fallbackTimer = setTimeout(cleanup, exitTimeout);

              // Transition the store entry to exiting state.
              dragPreviewStore.startExiting(data.draggable, cleanup);
            } else {
              // Instant removal (current behavior).
              dragPreviewStore.remove(data.draggable);
              setTimeout(() => {
                for (const el of proxies) el.remove();
              }, 0);
            }

            data.draggable.off('end', endListenerId);
            data.draggable.off('destroy', destroyListenerId);
          };
          const endListenerId = data.draggable.on('end', onDragEnd);
          const destroyListenerId = data.draggable.on('destroy', onDragEnd);

          return proxies;
        },
        // The container function tells the core where to reparent
        // the proxy during drag. The proxy starts in the original's
        // parent (set above) and gets moved to the drag container
        // (default: document.body) by the core's _applyStart, which
        // also applies full transform normalization (matrix
        // inversion, alignment correction, etc.).
        ...(isDragPreview
          ? {
              container: () => {
                const opt = dragPreviewContainerRef.current;
                return (typeof opt === 'function' ? opt() : opt) || document.body;
              },
            }
          : {}),
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

    // Custom equality check. When dragPreview is enabled on both
    // prev and next, we ignore `elements` because the
    // construction-time closure manages it internally via
    // draggableSettingsRef (reads the latest user-provided elements
    // dynamically).
    let hasChanged = false;

    if (appliedSettingsRef.current) {
      const prev = { ...appliedSettingsRef.current };
      const next = { ...draggableSettings };

      if (prev.elements === next.elements || (!!prev.dragPreview && !!next.dragPreview)) {
        delete prev.elements;
        delete next.elements;
      }

      hasChanged = !areConfigsEqual(prev, next);
    } else {
      hasChanged = true;
    }

    if (!hasChanged) return;

    // Here we use the protected method to parse the settings so
    // that we can use the default settings for the ones that are
    // not provided.
    const parsedSettings = draggable['_parseSettings'](draggableSettings);

    // When dragPreview is enabled, skip passing `elements` to
    // updateSettings because the construction-time closure already
    // reads the latest settings via ref. When dragPreview is off,
    // pass the user's elements if provided.
    draggable.updateSettings({
      ...parsedSettings,
      ...(!draggableSettings.dragPreview && draggableSettings.elements
        ? { elements: draggableSettings.elements }
        : {}),
      ...(draggableSettings.dragPreview
        ? {
            container: () => {
              const opt = dragPreviewContainerRef.current;
              return (typeof opt === 'function' ? opt() : opt) || document.body;
            },
          }
        : {}),
    } as any);

    // If dndGroups or computeClientRect changed we need to update
    // the effective dnd observer's matches and queue a collision
    // check.
    if (appliedSettingsRef.current) {
      const dndGroupsChanged = draggableSettings.dndGroups !== appliedSettingsRef.current.dndGroups;
      const computeClientRectChanged =
        draggableSettings.computeClientRect !== appliedSettingsRef.current.computeClientRect;

      if (dndGroupsChanged) {
        effectiveDndObserverRef.current?.clearTargets(draggable);
      }

      if (dndGroupsChanged || computeClientRectChanged) {
        effectiveDndObserverRef.current?.detectCollisions(draggable);
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
