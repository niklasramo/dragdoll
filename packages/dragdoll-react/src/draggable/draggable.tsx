import type { Sensor } from 'dragdoll';
import type { ReactElement } from 'react';
import { cloneElement, memo, useCallback, useRef } from 'react';
import type { DraggableProps } from '../types.js';
import { useDraggable } from './use-draggable.js';

function DraggableComponent<S extends Sensor[] = Sensor[]>({
  children,
  id,
  pointerSensor = true,
  keyboardSensor,
  keyboardMotionSensor,
  sensors,
  elements,
  ...settings
}: DraggableProps<S>) {
  const elementRef = useRef<HTMLElement | SVGSVGElement | null>(null);

  const { ref: setRef } = useDraggable({
    element: elementRef.current,
    id,
    pointerSensor,
    keyboardSensor,
    keyboardMotionSensor,
    sensors,
    elements: elements || (() => (elementRef.current ? [elementRef.current] : null)),
    ...settings,
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
    throw new Error('Draggable expects a single React element as children');
  }

  return cloneElement(child as ReactElement, { ref: handleRef } as any);
}

export const Draggable = memo(DraggableComponent) as typeof DraggableComponent;
