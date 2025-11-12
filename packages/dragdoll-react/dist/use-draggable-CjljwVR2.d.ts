import { DndObserver, Draggable, DraggableOptions, Sensor } from "dragdoll";

//#region src/hooks/use-draggable.d.ts
interface UseDraggableSettings<S extends Sensor[] = Sensor[]> extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}
declare function useDraggable<S extends Sensor[] = Sensor[]>(sensors: (S[number] | null)[], settings?: UseDraggableSettings<S>): Draggable<S, {}> | null;
//#endregion
export { useDraggable as n, UseDraggableSettings as t };
//# sourceMappingURL=use-draggable-CjljwVR2.d.ts.map