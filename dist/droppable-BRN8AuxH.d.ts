import { Rect } from "./types-Cmt4yuYh.js";
import { Draggable } from "./draggable-DJlxblxx.js";
import { Emitter, EventListenerId } from "eventti";

//#region src/droppable/droppable.d.ts
type DroppableId = symbol | string | number;
type DroppableAcceptId = string | number | symbol;
declare const DroppableEventType: {
  readonly Destroy: "destroy";
};
type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];
interface DroppableEventCallbacks {
  [DroppableEventType.Destroy]: () => void;
}
interface DroppableOptions {
  id?: DroppableId;
  accept?: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
  data?: {
    [key: string]: any;
  };
}
declare class Droppable {
  readonly id: DroppableId;
  readonly element: HTMLElement | SVGSVGElement;
  accept: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
  data: {
    [key: string]: any;
  };
  readonly isDestroyed: boolean;
  protected _clientRect: Rect;
  protected _emitter: Emitter<{ [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K] }>;
  constructor(element: HTMLElement | SVGSVGElement, options?: DroppableOptions);
  on<T extends keyof DroppableEventCallbacks>(type: T, listener: DroppableEventCallbacks[T], listenerId?: EventListenerId): EventListenerId;
  off<T extends keyof DroppableEventCallbacks>(type: T, listenerId: EventListenerId): void;
  getClientRect(): Readonly<Rect>;
  updateClientRect(rect?: Rect): void;
  destroy(): void;
}
//#endregion
export { Droppable, DroppableAcceptId, DroppableEventCallbacks, DroppableEventType, DroppableId, DroppableOptions };
//# sourceMappingURL=droppable-BRN8AuxH.d.ts.map