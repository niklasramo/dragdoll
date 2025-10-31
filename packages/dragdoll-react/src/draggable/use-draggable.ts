import type {
  DraggableId,
  DraggableSettings,
  KeyboardMotionSensorSettings,
  KeyboardSensorSettings,
  PointerSensorSettings,
  Sensor,
} from 'dragdoll';
import { Draggable, KeyboardMotionSensor, KeyboardSensor, PointerSensor } from 'dragdoll';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDndContext } from '../dnd-context/use-dnd-context.js';
import type { UseDraggableOptions, UseDraggableReturn } from '../types.js';

export function useDraggable<S extends Sensor[] = Sensor[]>({
  element,
  id,
  pointerSensor = true,
  keyboardSensor,
  keyboardMotionSensor,
  sensors,
  elements,
  ...settings
}: UseDraggableOptions<S>): UseDraggableReturn<S> {
  const draggableRef = useRef<Draggable<S> | null>(null);
  const [draggable, setDraggable] = useState<Draggable<S> | null>(null);
  const dndContext = useDndContext().context;
  const elementRef = useRef<HTMLElement | SVGSVGElement | null>(null);

  const createSensors = useCallback(() => {
    if (sensors) {
      return sensors;
    }

    const sensorArray: Sensor[] = [];

    if (elementRef.current) {
      if (pointerSensor) {
        const opts =
          typeof pointerSensor === 'object' ? pointerSensor : ({} as PointerSensorSettings);
        sensorArray.push(new PointerSensor(elementRef.current, opts));
      }

      if (keyboardSensor) {
        const opts =
          typeof keyboardSensor === 'object' ? keyboardSensor : ({} as KeyboardSensorSettings);
        sensorArray.push(new KeyboardSensor(elementRef.current, opts));
      }

      if (keyboardMotionSensor) {
        const opts =
          typeof keyboardMotionSensor === 'object'
            ? keyboardMotionSensor
            : ({} as KeyboardMotionSensorSettings);
        sensorArray.push(new KeyboardMotionSensor(elementRef.current, opts));
      }
    }

    return sensorArray as S;
  }, [pointerSensor, keyboardSensor, keyboardMotionSensor, sensors]);

  const createDraggable = useCallback(() => {
    if (!elementRef.current || draggableRef.current) return;

    const sensorArray = createSensors();
    if (sensorArray.length === 0) return;

    const draggableOptions: Partial<DraggableSettings<S>> & { id?: DraggableId } = {
      id,
      ...settings,
      elements:
        elements ||
        ((() =>
          elementRef.current ? [elementRef.current] : null) as DraggableSettings<S>['elements']),
    };

    const instance = new Draggable<S>(sensorArray as S, draggableOptions);
    draggableRef.current = instance;
    setDraggable(instance);

    dndContext.addDraggables([instance]);

    return instance;
  }, [id, createSensors, elements, settings, dndContext]);

  const setRef = useCallback(
    (el: HTMLElement | SVGSVGElement | null) => {
      elementRef.current = el;
      if (el && !draggableRef.current) {
        createDraggable();
      }
    },
    [createDraggable],
  );

  useEffect(() => {
    elementRef.current = element;
    if (element && !draggableRef.current) {
      createDraggable();
    }
  }, [element, createDraggable]);

  useEffect(() => {
    return () => {
      if (draggableRef.current) {
        dndContext.removeDraggables([draggableRef.current]);
        draggableRef.current.destroy();
        draggableRef.current = null;
        setDraggable(null);
      }
    };
  }, [dndContext]);

  return useMemo(
    () => ({
      draggable,
      ref: setRef,
    }),
    [draggable, setRef],
  );
}
