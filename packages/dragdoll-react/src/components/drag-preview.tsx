import type { AnyDraggable, DraggableDragItem } from 'dragdoll/draggable';
import React from 'react';
import { createPortal } from 'react-dom';
import { useDragPreview } from '../hooks/use-drag-preview.js';

export interface DragPreviewRenderProps {
  draggable: AnyDraggable;
  item: DraggableDragItem | null;
  index: number;
  sourceElement: HTMLElement | SVGSVGElement;
  exiting: boolean;
  done: () => void;
}

export interface DragPreviewProps {
  draggable: AnyDraggable | null;
  children?: ((props: DragPreviewRenderProps) => React.ReactNode) | React.ReactNode;
}

export function DragPreview({ draggable, children }: DragPreviewProps) {
  const result = useDragPreview(draggable);

  if (!result || !result.proxies.length) {
    return null;
  }

  const { draggable: activeDraggable, sources, proxies, exiting, done } = result;
  const items = activeDraggable.drag?.items;

  return (
    <>
      {proxies.map((proxyEl, index) =>
        createPortal(
          typeof children === 'function'
            ? children({
                draggable: activeDraggable,
                item: items?.[index] ?? null,
                index,
                sourceElement: sources[index],
                exiting,
                done,
              })
            : children,
          proxyEl,
          `drag-preview-portal-${index}`,
        ),
      )}
    </>
  );
}
