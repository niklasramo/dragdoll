import type {
  CollisionData,
  DndContext,
  DndContextEventCallbacks,
  DndContextOptions,
  Draggable,
  DraggableId,
  DraggableSettings,
  Droppable,
  DroppableId,
  DroppableOptions,
  KeyboardMotionSensorSettings,
  KeyboardSensorSettings,
  PointerSensorSettings,
  Sensor,
} from 'dragdoll';
import type { ReactNode } from 'react';

export interface DndContextProviderProps<T extends CollisionData = CollisionData> {
  children: ReactNode;
  options?: DndContextOptions<T>;
  onStart?: DndContextEventCallbacks<T>['start'];
  onMove?: DndContextEventCallbacks<T>['move'];
  onEnter?: DndContextEventCallbacks<T>['enter'];
  onLeave?: DndContextEventCallbacks<T>['leave'];
  onCollide?: DndContextEventCallbacks<T>['collide'];
  onEnd?: DndContextEventCallbacks<T>['end'];
}

export interface DraggableProps<S extends Sensor[] = Sensor[]>
  extends Omit<
    Partial<DraggableSettings<S>>,
    'elements' | 'onPrepareStart' | 'onStart' | 'onPrepareMove' | 'onMove' | 'onEnd' | 'onDestroy'
  > {
  children:
    | ReactNode
    | ((props: { ref: (element: HTMLElement | SVGSVGElement | null) => void }) => ReactNode);
  id?: DraggableId;
  pointerSensor?: boolean | Partial<PointerSensorSettings>;
  keyboardSensor?: boolean | Partial<KeyboardSensorSettings>;
  keyboardMotionSensor?: boolean | Partial<KeyboardMotionSensorSettings>;
  sensors?: S;
  elements?: () => (HTMLElement | SVGSVGElement)[] | null;
  onPrepareStart?: DraggableSettings<S>['onPrepareStart'];
  onStart?: DraggableSettings<S>['onStart'];
  onPrepareMove?: DraggableSettings<S>['onPrepareMove'];
  onMove?: DraggableSettings<S>['onMove'];
  onEnd?: DraggableSettings<S>['onEnd'];
  onDestroy?: DraggableSettings<S>['onDestroy'];
}

export interface DroppableProps {
  children:
    | ReactNode
    | ((props: { ref: (element: HTMLElement | SVGSVGElement | null) => void }) => ReactNode);
  id?: DroppableId;
  accept?: DroppableOptions['accept'];
  data?: DroppableOptions['data'];
}

export interface UseDndContextValue<T extends CollisionData = CollisionData> {
  context: DndContext<T>;
}

export interface UseDraggableOptions<S extends Sensor[] = Sensor[]>
  extends Omit<
    Partial<DraggableSettings<S>>,
    'elements' | 'onPrepareStart' | 'onStart' | 'onPrepareMove' | 'onMove' | 'onEnd' | 'onDestroy'
  > {
  element: HTMLElement | SVGSVGElement | null;
  id?: DraggableId;
  pointerSensor?: boolean | Partial<PointerSensorSettings>;
  keyboardSensor?: boolean | Partial<KeyboardSensorSettings>;
  keyboardMotionSensor?: boolean | Partial<KeyboardMotionSensorSettings>;
  sensors?: S;
  elements?: () => (HTMLElement | SVGSVGElement)[] | null;
  onPrepareStart?: DraggableSettings<S>['onPrepareStart'];
  onStart?: DraggableSettings<S>['onStart'];
  onPrepareMove?: DraggableSettings<S>['onPrepareMove'];
  onMove?: DraggableSettings<S>['onMove'];
  onEnd?: DraggableSettings<S>['onEnd'];
  onDestroy?: DraggableSettings<S>['onDestroy'];
}

export interface UseDraggableReturn<S extends Sensor[] = Sensor[]> {
  draggable: Draggable<S> | null;
  ref: (element: HTMLElement | SVGSVGElement | null) => void;
}

export interface UseDroppableOptions extends DroppableOptions {
  element: HTMLElement | SVGSVGElement | null;
}

export interface UseDroppableReturn {
  droppable: Droppable | null;
  ref: (element: HTMLElement | SVGSVGElement | null) => void;
}
