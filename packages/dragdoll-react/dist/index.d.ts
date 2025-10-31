import { CollisionData, DndContext, DndContextEventCallbacks, DndContextOptions, Draggable as Draggable$1, DraggableId, DraggableSettings, Droppable as Droppable$1, DroppableId, DroppableOptions, KeyboardMotionSensorSettings, KeyboardSensorSettings, PointerSensorSettings, Sensor } from "dragdoll";
import * as react0 from "react";
import { ReactNode } from "react";
import * as react_jsx_runtime0 from "react/jsx-runtime";

//#region src/types.d.ts
interface DndContextProviderProps<T extends CollisionData = CollisionData> {
  children: ReactNode;
  options?: DndContextOptions<T>;
  onStart?: DndContextEventCallbacks<T>['start'];
  onMove?: DndContextEventCallbacks<T>['move'];
  onEnter?: DndContextEventCallbacks<T>['enter'];
  onLeave?: DndContextEventCallbacks<T>['leave'];
  onCollide?: DndContextEventCallbacks<T>['collide'];
  onEnd?: DndContextEventCallbacks<T>['end'];
}
interface DraggableProps<S extends Sensor[] = Sensor[]> extends Omit<Partial<DraggableSettings<S>>, 'elements' | 'onPrepareStart' | 'onStart' | 'onPrepareMove' | 'onMove' | 'onEnd' | 'onDestroy'> {
  children: ReactNode | ((props: {
    ref: (element: HTMLElement | SVGSVGElement | null) => void;
  }) => ReactNode);
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
interface DroppableProps {
  children: ReactNode | ((props: {
    ref: (element: HTMLElement | SVGSVGElement | null) => void;
  }) => ReactNode);
  id?: DroppableId;
  accept?: DroppableOptions['accept'];
  data?: DroppableOptions['data'];
}
interface UseDndContextValue<T extends CollisionData = CollisionData> {
  context: DndContext<T>;
}
interface UseDraggableOptions<S extends Sensor[] = Sensor[]> extends Omit<Partial<DraggableSettings<S>>, 'elements' | 'onPrepareStart' | 'onStart' | 'onPrepareMove' | 'onMove' | 'onEnd' | 'onDestroy'> {
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
interface UseDraggableReturn<S extends Sensor[] = Sensor[]> {
  draggable: Draggable$1<S> | null;
  ref: (element: HTMLElement | SVGSVGElement | null) => void;
}
interface UseDroppableOptions extends DroppableOptions {
  element: HTMLElement | SVGSVGElement | null;
}
interface UseDroppableReturn {
  droppable: Droppable$1 | null;
  ref: (element: HTMLElement | SVGSVGElement | null) => void;
}
//#endregion
//#region src/dnd-context/dnd-context-provider.d.ts
declare const DndContextContext: react0.Context<UseDndContextValue<any> | null>;
declare function DndContextProvider<T extends CollisionData = CollisionData>({
  children,
  options,
  onStart,
  onMove,
  onEnter,
  onLeave,
  onCollide,
  onEnd
}: DndContextProviderProps<T>): react_jsx_runtime0.JSX.Element | null;
//#endregion
//#region src/dnd-context/use-dnd-context.d.ts
declare function useDndContext<T extends CollisionData = CollisionData>(): UseDndContextValue<T>;
declare function useDndContextEvents<T extends CollisionData = CollisionData>(handlers: Partial<DndContextEventCallbacks<T>>): void;
//#endregion
//#region src/draggable/draggable.d.ts
declare function DraggableComponent<S extends Sensor[] = Sensor[]>({
  children,
  id,
  pointerSensor,
  keyboardSensor,
  keyboardMotionSensor,
  sensors,
  elements,
  ...settings
}: DraggableProps<S>): react0.ReactNode;
declare const Draggable: typeof DraggableComponent;
//#endregion
//#region src/draggable/use-draggable.d.ts
declare function useDraggable<S extends Sensor[] = Sensor[]>({
  element,
  id,
  pointerSensor,
  keyboardSensor,
  keyboardMotionSensor,
  sensors,
  elements,
  ...settings
}: UseDraggableOptions<S>): UseDraggableReturn<S>;
//#endregion
//#region src/droppable/droppable.d.ts
declare function DroppableComponent({
  children,
  id,
  accept,
  data
}: DroppableProps): react0.ReactNode;
declare const Droppable: react0.MemoExoticComponent<typeof DroppableComponent>;
//#endregion
//#region src/droppable/use-droppable.d.ts
declare function useDroppable({
  element,
  id,
  accept,
  data
}: UseDroppableOptions): UseDroppableReturn;
//#endregion
export { DndContextContext, DndContextProvider, DndContextProviderProps, Draggable, DraggableProps, Droppable, DroppableProps, UseDndContextValue, UseDraggableOptions, UseDraggableReturn, UseDroppableOptions, UseDroppableReturn, useDndContext, useDndContextEvents, useDraggable, useDroppable };
//# sourceMappingURL=index.d.ts.map