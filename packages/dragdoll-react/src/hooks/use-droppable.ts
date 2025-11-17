import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DroppableOptions } from 'dragdoll/droppable';
import { Droppable as DroppableCore } from 'dragdoll/droppable';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

export interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement;
  dndObserver?: DndObserver<any> | null;
}

export function useDroppable({
  id,
  accept,
  data,
  element,
  dndObserver,
}: UseDroppableSettings = {}) {
  // Dnd observer from context.
  const dndObserverFromContext = useDndObserverContext<any>();

  // Effective dnd observer.
  const effectiveDndObserver = dndObserver === undefined ? dndObserverFromContext : dndObserver;

  // Droppable instance state.
  const [droppable, setDroppable] = useState<DroppableCore | null>(null);

  // Keep track of the droppable instance in a ref.
  const droppableRef = useRef<DroppableCore | null>(null);

  // Keep track of the current settings.
  const settingsRef = useRef({ id, accept, data });
  settingsRef.current.id = id;
  settingsRef.current.accept = accept;
  settingsRef.current.data = data;

  // Keep track of the currently applied id in a ref. We need this to check if
  // the id has changed since the last time the draggable was created.
  const appliedIdRef = useRef(id);

  // Keep track of the current effective dnd observer.
  const dndObserverRef = useRef(effectiveDndObserver);
  dndObserverRef.current = effectiveDndObserver;

  // Keep track of the applied dnd observer.
  const appliedDndObserverRef = useRef(effectiveDndObserver);

  // Destroy the droppable.
  const destroyDroppable = useCallbackStable(() => {
    const droppable = droppableRef.current;
    if (!droppable) return;
    droppable.destroy();
    droppableRef.current = null;
    setDroppable(null);
  }, []);

  // Create the droppable.
  const createDroppable = useCallbackStable(
    (node: HTMLElement | SVGSVGElement) => {
      destroyDroppable();

      // Create the droppable.
      const effectiveDndObserver = dndObserverRef.current;
      const droppable = new DroppableCore(node, settingsRef.current);

      // Update refs and state.
      droppableRef.current = droppable;
      appliedIdRef.current = settingsRef.current.id;
      appliedDndObserverRef.current = effectiveDndObserver;
      setDroppable(droppable);
    },
    [destroyDroppable],
  );

  // Ref callback when element is not explicitly provided.
  const setRef = useCallbackStable(
    (node: HTMLElement | SVGSVGElement | null) => {
      // If user provides an explicit element, do not create a new droppable.
      // sensor.
      if (element !== undefined) return;

      // Destroy the droppable if the node is null.
      if (node === null) {
        destroyDroppable();
        return;
      }

      // Create a new droppable if there is no droppable or the node has
      // changed.
      const currentDroppable = droppableRef.current;
      if (!currentDroppable || currentDroppable.element !== node) {
        createDroppable(node);
      }
    },
    [element, createDroppable, destroyDroppable],
  );

  // Handle explicit element change.
  useIsomorphicLayoutEffect(() => {
    if (element === undefined) return;
    createDroppable(element);
    return destroyDroppable;
  }, [element, createDroppable, destroyDroppable]);

  // Handle id change. Any time id is updated while there is a droppable, we
  // need to recreate the droppable with the new id.
  useIsomorphicLayoutEffect(() => {
    const droppable = droppableRef.current;
    if (!droppable) return;
    if (appliedIdRef.current === id) return;
    createDroppable(droppable.element);
  }, [id, createDroppable]);

  // Handle observer change.
  useIsomorphicLayoutEffect(() => {
    // Do nothing if the effective dnd observer hasn't changed.
    const appliedDndObserver = appliedDndObserverRef.current;
    if (appliedDndObserver === effectiveDndObserver) return;

    // If the droppable exists, remove it from the applied dnd observer and add
    // it to the effective dnd observer.
    const droppable = droppableRef.current;
    if (droppable) {
      appliedDndObserver?.removeDroppables([droppable]);
      effectiveDndObserver?.addDroppables([droppable]);
    }

    // Update the applied dnd observer ref.
    appliedDndObserverRef.current = effectiveDndObserver;
  }, [effectiveDndObserver]);

  // Handle accept change.
  useIsomorphicLayoutEffect(() => {
    const droppable = droppableRef.current;
    if (!droppable) return;
    droppable.accept = accept || (() => true);
  }, [accept]);

  // Handle data change.
  useIsomorphicLayoutEffect(() => {
    const droppable = droppableRef.current;
    if (!droppable) return;
    droppable.data = data || {};
  }, [data]);

  // Cleanup on unmount.
  useIsomorphicLayoutEffect(() => {
    return destroyDroppable;
  }, [destroyDroppable]);

  return useMemoStable(() => {
    return [droppable, setRef] as const;
  }, [droppable, setRef]);
}
