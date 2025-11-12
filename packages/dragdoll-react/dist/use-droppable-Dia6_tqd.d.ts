import { DndObserver, Droppable, DroppableOptions } from "dragdoll";

//#region src/hooks/use-droppable.d.ts
interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement;
  dndObserver?: DndObserver<any> | null;
}
declare function useDroppable({
  id,
  accept,
  data,
  element,
  dndObserver
}?: UseDroppableSettings): readonly [Droppable | null, (node: HTMLElement | SVGSVGElement | null) => void];
//#endregion
export { useDroppable as n, UseDroppableSettings as t };
//# sourceMappingURL=use-droppable-Dia6_tqd.d.ts.map