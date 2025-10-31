import type { ReactElement } from 'react';
import { cloneElement, memo, useCallback, useRef } from 'react';
import type { DroppableProps } from '../types.js';
import { useDroppable } from './use-droppable.js';

function DroppableComponent({ children, id, accept, data }: DroppableProps) {
  const elementRef = useRef<HTMLElement | SVGSVGElement | null>(null);

  const { ref: setRef } = useDroppable({
    element: elementRef.current,
    id,
    accept,
    data,
  });

  const handleRef = useCallback(
    (node: HTMLElement | SVGSVGElement | null) => {
      elementRef.current = node;
      setRef(node);

      const child = Array.isArray(children) ? children[0] : children;
      if (child && typeof child === 'object' && 'props' in child && child.props.ref) {
        const ref = child.props.ref;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && 'current' in ref) {
          (ref as { current: HTMLElement | SVGSVGElement | null }).current = node;
        }
      }
    },
    [children, setRef],
  );

  if (typeof children === 'function') {
    return children({ ref: handleRef });
  }

  const child = Array.isArray(children) ? children[0] : children;

  if (!child || typeof child !== 'object' || !('props' in child)) {
    throw new Error('Droppable expects a single React element as children');
  }

  return cloneElement(child as ReactElement, { ref: handleRef } as any);
}

export const Droppable = memo(DroppableComponent);
