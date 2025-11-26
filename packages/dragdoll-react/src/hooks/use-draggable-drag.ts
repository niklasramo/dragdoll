import { Draggable, DraggableDrag, DraggableEventType } from 'dragdoll/draggable';
import type { Sensor } from 'dragdoll/sensors';
import { useState } from 'react';
import { useDraggableCallback } from './use-draggable-callback.js';

export function useDraggableDrag<S extends Sensor = Sensor>(
  draggable: Draggable<S> | null,
  trackMove: boolean = false,
) {
  const [drag, setDrag] = useState<DraggableDrag<S> | null>(draggable?.drag || null);
  const forceRender = useState<undefined | symbol>(undefined)[1];

  useDraggableCallback(draggable, DraggableEventType.Start, (drag) => {
    setDrag(drag);
  });

  useDraggableCallback(draggable, DraggableEventType.Move, () => {
    if (trackMove) forceRender(Symbol());
  });

  useDraggableCallback(draggable, DraggableEventType.End, () => {
    setDrag(null);
  });

  return drag;
}
