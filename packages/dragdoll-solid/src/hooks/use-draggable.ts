import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DraggableOptions } from 'dragdoll/draggable';
import { Draggable } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import type { Accessor } from 'solid-js';
import { batch, createEffect, createMemo, createSignal, onCleanup, untrack } from 'solid-js';
import { isServer } from 'solid-js/web';
import { areConfigsEqual } from '../utils/are-configs-equal.js';
import { createDragPreviewProxies } from '../utils/create-drag-preview-proxies.js';
import { dragPreviewStore } from '../utils/drag-preview-store.js';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor, resolveMaybeAccessorArray } from '../utils/maybe-accessor.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';

export interface UseDraggableSettings<S extends Sensor = Sensor>
  // Omit container to prevent accidental framework unmount errors
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
  sensors: MaybeAccessor<(S | null)[]> | MaybeAccessor<S | null>[],
  settings?: MaybeAccessor<UseDraggableSettings<S> | undefined>,
): Accessor<Draggable<S> | null> {
  if (isServer) return () => null;

  const getResolvedSensors = createMemo(() => {
    return (
      Array.isArray(sensors)
        ? resolveMaybeAccessorArray(sensors)
        : (resolveMaybeAccessor(sensors) ?? [])
    ).filter((sensor): sensor is S => Boolean(sensor)) as readonly S[];
  });

  const getSettings = createMemo(() => resolveMaybeAccessor(settings));
  const getId = createMemo(() => getSettings()?.id);
  const getDndObserver = createMemo(() => getSettings()?.dndObserver);
  const getDraggableOptions = createMemo(() => {
    const current = getSettings();
    if (!current) return undefined;
    const {
      dndObserver: _ignoredObserver,
      id: _ignoredId,
      dragPreviewContainer: _ignoredContainer,
      dragPreviewExitTimeout: _ignoredExitTimeout,
      ...rest
    } = current;
    return rest as Partial<DraggableOptions<S>> & { dragPreview?: boolean };
  });

  const getDndObserverFromContext = useDndObserverContext<any>();
  const getEffectiveDndObserver = createMemo(() => {
    const settingsDndObserver = getDndObserver();
    return settingsDndObserver === undefined ? getDndObserverFromContext() : settingsDndObserver;
  });

  const [getDraggable, setDraggable] = createSignal<Draggable<S> | null>(null);

  // Refs (plain variables, not signals) for imperative tracking.
  let draggableRef: Draggable<S> | null = null;
  let appliedIdRef = getId();
  let appliedSettingsRef = getDraggableOptions();
  let appliedDndObserverRef = getEffectiveDndObserver();

  // Always-latest refs for settings read inside closures.
  let draggableSettingsRef = getDraggableOptions();
  let dragPreviewContainerRef = getSettings()?.dragPreviewContainer;
  let dragPreviewExitTimeoutRef = getSettings()?.dragPreviewExitTimeout;

  // Keep closure refs in sync.
  createEffect(() => {
    const s = getSettings();
    draggableSettingsRef = getDraggableOptions();
    dragPreviewContainerRef = s?.dragPreviewContainer;
    dragPreviewExitTimeoutRef = s?.dragPreviewExitTimeout;
  });

  const destroyDraggable = () => {
    if (!draggableRef) return;
    draggableRef.destroy();
    draggableRef = null;
    appliedSettingsRef = undefined;
    setDraggable(null);
  };

  const createDraggableInstance = () => {
    batch(() => {
      destroyDraggable();
      const resolvedSensors = untrack(getResolvedSensors);
      if (!resolvedSensors.length) return;
      const options = untrack(getDraggableOptions);
      const id = untrack(getId);
      const isDragPreview = options?.dragPreview;

      const instance = new Draggable<S>(resolvedSensors, {
        id,
        ...options,
        // Override elements dynamically for drag preview support.
        elements(data) {
          const currentSettings = draggableSettingsRef;
          const getSourceElements = currentSettings?.elements || (() => null);
          const sources = getSourceElements(data);

          if (!currentSettings?.dragPreview || !sources || sources.length === 0) {
            return sources;
          }

          // Create proxy elements for drag preview.
          const proxies = createDragPreviewProxies(sources);
          dragPreviewStore.add(data.draggable, sources, proxies);

          // Cleanup on drag end.
          const onDragEnd = () => {
            const exitTimeout = dragPreviewExitTimeoutRef || 0;

            if (exitTimeout > 0) {
              for (const el of proxies) el.dataset.exiting = 'true';

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
              dragPreviewStore.startExiting(data.draggable, cleanup);
            } else {
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
        // Container for drag preview reparenting.
        ...(isDragPreview
          ? {
              container: () => {
                const opt = dragPreviewContainerRef;
                return (typeof opt === 'function' ? opt() : opt) || document.body;
              },
            }
          : {}),
      });

      // Add to dnd observer.
      const dndObserver = untrack(getEffectiveDndObserver);
      dndObserver?.addDraggables([instance]);

      // Update refs and state.
      draggableRef = instance;
      appliedIdRef = id;
      appliedSettingsRef = options;
      appliedDndObserverRef = dndObserver;
      setDraggable(instance);
    });
  };

  // Handle sensors change. When the draggable already exists we
  // assign directly to `draggable.sensors` instead of destroying
  // and recreating the instance. The core's setter diffs the
  // arrays and only (un)binds the sensors that actually changed,
  // which preserves any in-progress drag state.
  createEffect(() => {
    const resolvedSensors = getResolvedSensors();

    if (!resolvedSensors.length) {
      destroyDraggable();
      return;
    }

    const draggable = draggableRef;
    if (!draggable) {
      createDraggableInstance();
      return;
    }

    if (draggable.sensors !== resolvedSensors) {
      draggable.sensors = resolvedSensors;
    }
  });

  // Handle id change.
  createEffect(() => {
    const draggable = draggableRef;
    if (!draggable) return;
    const id = getId();
    if (appliedIdRef === id) return;
    createDraggableInstance();
  });

  // Handle dndObserver change.
  createEffect(() => {
    const currentObserver = getEffectiveDndObserver();
    if (appliedDndObserverRef === currentObserver) return;
    const current = draggableRef;
    if (current) {
      appliedDndObserverRef?.removeDraggables([current]);
      currentObserver?.addDraggables([current]);
    }
    appliedDndObserverRef = currentObserver;
  });

  // Handle settings change.
  createEffect(() => {
    const current = draggableRef;
    if (!current) return;
    const nextSettings = getDraggableOptions();

    // Custom equality check: when dragPreview is enabled on both
    // prev and next, ignore `elements` because the
    // construction-time closure manages it internally via
    // draggableSettingsRef.
    let hasChanged = false;

    if (appliedSettingsRef) {
      const prev = { ...appliedSettingsRef };
      const next = { ...nextSettings };

      if (prev.elements === next.elements || (!!prev.dragPreview && !!next.dragPreview)) {
        delete prev.elements;
        delete next.elements;
      }

      hasChanged = !areConfigsEqual(prev, next);
    } else {
      hasChanged = true;
    }

    if (!hasChanged) return;

    const parsedSettings = current['_parseSettings'](nextSettings);

    current.updateSettings({
      ...parsedSettings,
      ...(!nextSettings?.dragPreview && nextSettings?.elements
        ? { elements: nextSettings.elements }
        : {}),
      ...(nextSettings?.dragPreview
        ? {
            container: () => {
              const opt = dragPreviewContainerRef;
              return (typeof opt === 'function' ? opt() : opt) || document.body;
            },
          }
        : {}),
    } as any);

    // If dndGroups or computeClientRect changed, update the
    // observer.
    if (appliedSettingsRef) {
      const dndGroupsChanged = nextSettings?.dndGroups !== appliedSettingsRef.dndGroups;
      const computeClientRectChanged =
        nextSettings?.computeClientRect !== appliedSettingsRef.computeClientRect;

      if (dndGroupsChanged) {
        appliedDndObserverRef?.clearTargets(current);
      }

      if (dndGroupsChanged || computeClientRectChanged) {
        appliedDndObserverRef?.detectCollisions(current);
      }
    }

    appliedSettingsRef = nextSettings;
  });

  onCleanup(destroyDraggable);

  return getDraggable;
}
