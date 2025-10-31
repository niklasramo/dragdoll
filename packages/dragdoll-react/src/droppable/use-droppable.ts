import type { DroppableOptions } from 'dragdoll';
import { Droppable } from 'dragdoll';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDndContext } from '../dnd-context/use-dnd-context.js';
import type { UseDroppableOptions, UseDroppableReturn } from '../types.js';

export function useDroppable({
  element,
  id,
  accept,
  data,
}: UseDroppableOptions): UseDroppableReturn {
  const droppableRef = useRef<Droppable | null>(null);
  const [droppable, setDroppable] = useState<Droppable | null>(null);
  const dndContext = useDndContext().context;
  const elementRef = useRef<HTMLElement | SVGSVGElement | null>(null);

  const createDroppable = useCallback(() => {
    if (!elementRef.current || droppableRef.current) return;

    const options: DroppableOptions = {
      id,
      accept,
      data,
    };

    const instance = new Droppable(elementRef.current, options);
    droppableRef.current = instance;
    setDroppable(instance);

    dndContext.addDroppables([instance]);

    return instance;
  }, [id, accept, data, dndContext]);

  const setRef = useCallback(
    (el: HTMLElement | SVGSVGElement | null) => {
      elementRef.current = el;
      if (el && !droppableRef.current) {
        createDroppable();
      }
    },
    [createDroppable],
  );

  useEffect(() => {
    elementRef.current = element;
    if (element && !droppableRef.current) {
      createDroppable();
    }
  }, [element, createDroppable]);

  useEffect(() => {
    if (droppableRef.current) {
      if (accept !== undefined) {
        droppableRef.current.accept = accept;
      }
      if (data !== undefined) {
        droppableRef.current.data = data;
      }
    }
  }, [accept, data]);

  useEffect(() => {
    return () => {
      if (droppableRef.current) {
        dndContext.removeDroppables([droppableRef.current]);
        droppableRef.current.destroy();
        droppableRef.current = null;
        setDroppable(null);
      }
    };
  }, [dndContext]);

  return useMemo(
    () => ({
      droppable,
      ref: setRef,
    }),
    [droppable, setRef],
  );
}
