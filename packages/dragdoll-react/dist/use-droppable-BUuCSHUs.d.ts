import { DndObserver } from "dragdoll/dnd-observer";
import { Droppable, DroppableOptions } from "dragdoll/droppable";

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
//# sourceMappingURL=use-droppable-BUuCSHUs.d.ts.map