import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DroppableOptions } from 'dragdoll/droppable';
import { Droppable, DroppableDefaultSettings } from 'dragdoll/droppable';
import { useRef, useState } from 'react';
import { useCallbackStable } from './use-callback-stable.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';
import { useMemoStable } from './use-memo-stable.js';

const UNAPPLIED_ID = Symbol();

export interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement | null;
  dndObserver?: DndObserver<any> | null;
}

export function useDroppable({
  id,
  accept,
  data,
  computeClientRect,
  element,
  dndObserver,
}: UseDroppableSettings = {}) {
  // Dnd observer from context.
  const dndObserverFromContext = useDndObserverContext<any>();

  // Effective dnd observer.
  const effectiveDndObserver = dndObserver === undefined ? dndObserverFromContext : dndObserver;

  // Droppable instance state.
  const [droppable, setDroppable] = useState<Droppable | null>(null);

  // Keep track of the droppable instance in a ref.
  const droppableRef = useRef<Droppable | null>(null);

  // Keep track of the current settings.
  const settingsRef = useRef({ id, accept, data, computeClientRect });
  settingsRef.current.id = id;
  settingsRef.current.accept = accept;
  settingsRef.current.data = data;
  settingsRef.current.computeClientRect = computeClientRect;

  // Keep track of the currently applied id in a ref. We need this to check if
  // the id has changed since the last time the draggable was created.
  const appliedIdRef = useRef<typeof id>(UNAPPLIED_ID);

  // Keep track of the current effective dnd observer.
  const dndObserverRef = useRef(effectiveDndObserver);
  dndObserverRef.current = effectiveDndObserver;

  // Destroy the droppable.
  const destroyDroppable = useCallbackStable(() => {
    const droppable = droppableRef.current;
    if (!droppable) return;
    droppable.destroy();
    droppableRef.current = null;
    appliedIdRef.current = UNAPPLIED_ID;
    setDroppable(null);
  }, []);

  // Create the droppable.
  const createDroppable = useCallbackStable((node: HTMLElement | SVGSVGElement | null) => {
    let droppable = droppableRef.current;
    if (droppable) {
      // If the droppable already exists with the same node and the id has not
      // changed, do not create a new one.
      if (droppable.element === node && appliedIdRef.current === settingsRef.current.id) {
        return;
      }

      // Destroy the existing droppable.
      droppable.destroy();
    }

    // Create the droppable.
    droppable = new Droppable(node, settingsRef.current);

    // Update refs and state.
    droppableRef.current = droppable;
    appliedIdRef.current = settingsRef.current.id;
    setDroppable(droppable);
  }, []);

  // Ref callback when element is not explicitly provided.
  const setRef = useCallbackStable(
    (node: HTMLElement | SVGSVGElement | null) => {
      // If user provides an explicit element, do not create a new droppable.
      if (element !== undefined) return;

      // Destroy the droppable if the node is null.
      if (node === null) {
        destroyDroppable();
        return;
      }

      // Create a new droppable.
      createDroppable(node);
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
    if (droppable && appliedIdRef.current !== id) {
      createDroppable(droppable.element);
    }
  }, [droppable, id, createDroppable]);

  // Handle observer change.
  useIsomorphicLayoutEffect(() => {
    if (!droppable || !effectiveDndObserver) return;
    effectiveDndObserver.addDroppables([droppable]);
    return () => {
      effectiveDndObserver.removeDroppables([droppable]);
    };
  }, [droppable, effectiveDndObserver]);

  // Handle accept change.
  useIsomorphicLayoutEffect(() => {
    if (!droppable) return;
    droppable.accept = accept || DroppableDefaultSettings.accept;
    dndObserverRef.current?.clearTargets();
  }, [droppable, accept]);

  // Handle data change.
  useIsomorphicLayoutEffect(() => {
    if (!droppable) return;
    droppable.data = data || {};
  }, [droppable, data]);

  // Handle computeClientRect change.
  useIsomorphicLayoutEffect(() => {
    if (!droppable) return;
    droppable.computeClientRect = computeClientRect || DroppableDefaultSettings.computeClientRect;
    droppable.updateClientRect();
    dndObserverRef.current?.detectCollisions();
  }, [droppable, computeClientRect]);

  // Cleanup on unmount.
  useIsomorphicLayoutEffect(() => {
    return destroyDroppable;
  }, [destroyDroppable]);

  return useMemoStable(() => {
    return [droppable, setRef] as const;
  }, [droppable, setRef]);
}
