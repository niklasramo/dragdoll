import type { DndObserver } from 'dragdoll/dnd-observer';
import type { DroppableOptions } from 'dragdoll/droppable';
import { Droppable as DroppableCore } from 'dragdoll/droppable';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';
import type { MaybeAccessor } from '../utils/maybe-accessor.js';
import { resolveMaybeAccessor } from '../utils/maybe-accessor.js';
import { useDndObserverContext } from './use-dnd-observer-context.js';

export interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement;
  dndObserver?: DndObserver<any> | null;
}

export function useDroppable(settingsInput?: MaybeAccessor<UseDroppableSettings | undefined>) {
  if (isServer) return [() => null, () => {}] as const;

  const resolvedSettings = createMemo(() => resolveMaybeAccessor(settingsInput));
  const elementAccessor = createMemo(() => resolvedSettings()?.element);
  const overrideObserver = createMemo(() => resolvedSettings()?.dndObserver);
  const idAccessor = createMemo(() => resolvedSettings()?.id);
  const acceptAccessor = createMemo(() => resolvedSettings()?.accept);
  const dataAccessor = createMemo(() => resolvedSettings()?.data);
  const computeClientRectAccessor = createMemo(() => resolvedSettings()?.computeClientRect);

  const observerFromContext = useDndObserverContext<any>();
  const effectiveObserver = createMemo(() => {
    const override = overrideObserver();
    return override === undefined ? observerFromContext() : override;
  });

  const [droppable, setDroppable] = createSignal<DroppableCore | null>(null);
  let droppableRef: DroppableCore | null = null;
  let appliedId = idAccessor();
  let appliedObserver = effectiveObserver();

  const destroyDroppable = () => {
    if (!droppableRef) return;
    droppableRef.destroy();
    droppableRef = null;
    setDroppable(null);
  };

  const createDroppableInstance = (node: HTMLElement | SVGSVGElement) => {
    destroyDroppable();
    const options: DroppableOptions = {
      id: idAccessor(),
      accept: acceptAccessor(),
      data: dataAccessor(),
    };
    const instance = new DroppableCore(node, options);
    droppableRef = instance;
    appliedId = options.id;
    const observer = effectiveObserver();
    if (observer) observer.addDroppables([instance]);
    appliedObserver = observer;
    setDroppable(instance);
  };

  const setRef = (node: HTMLElement | SVGSVGElement | null) => {
    if (elementAccessor() !== undefined) return;
    if (node === null) {
      destroyDroppable();
      return;
    }
    if (droppableRef?.element === node) return;
    createDroppableInstance(node);
  };

  createEffect(() => {
    const explicitElement = elementAccessor();
    if (explicitElement === undefined) return;
    if (explicitElement === null) {
      destroyDroppable();
      return;
    }
    createDroppableInstance(explicitElement);
    onCleanup(destroyDroppable);
  });

  createEffect(() => {
    const droppable = droppableRef;
    if (!droppable) return;
    const nextId = idAccessor();
    if (appliedId === nextId) return;
    if (droppable.element) createDroppableInstance(droppable.element);
  });

  createEffect(() => {
    const currentObserver = effectiveObserver();
    if (appliedObserver === currentObserver) return;
    const droppable = droppableRef;
    if (droppable) {
      appliedObserver?.removeDroppables([droppable]);
      currentObserver?.addDroppables([droppable]);
    }
    appliedObserver = currentObserver;
  });

  createEffect(() => {
    const droppable = droppableRef;
    if (!droppable) return;
    const nextAccept = acceptAccessor() || (() => true);
    droppable.accept = nextAccept;
    // Re-run collision detection when accept changes.
    appliedObserver?.detectCollisions();
  });

  createEffect(() => {
    const droppable = droppableRef;
    if (!droppable) return;
    droppable.data = dataAccessor() || {};
  });

  createEffect(() => {
    const droppable = droppableRef;
    if (!droppable) return;
    const nextComputeClientRect = computeClientRectAccessor();
    if (nextComputeClientRect) {
      droppable.computeClientRect = nextComputeClientRect;
    }
    appliedObserver?.detectCollisions();
  });

  onCleanup(destroyDroppable);

  return [droppable, setRef] as const;
}
