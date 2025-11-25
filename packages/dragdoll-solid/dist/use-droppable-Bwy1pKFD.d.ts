import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import * as solid_js0 from "solid-js";
import { DndObserver } from "dragdoll/dnd-observer";
import { Droppable, DroppableOptions } from "dragdoll/droppable";

//#region src/hooks/use-droppable.d.ts
interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement;
  dndObserver?: DndObserver<any> | null;
}
declare function useDroppable(settingsInput?: MaybeAccessor<UseDroppableSettings | undefined>): readonly [solid_js0.Accessor<Droppable | null>, (node: HTMLElement | SVGSVGElement | null) => void];
//#endregion
export { useDroppable as n, UseDroppableSettings as t };
//# sourceMappingURL=use-droppable-Bwy1pKFD.d.ts.map