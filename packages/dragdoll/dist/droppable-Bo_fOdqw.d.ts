import { a as Rect } from "./types-BaIRuLz3.js";
import { a as SensorEventListenerId } from "./sensor-C7UNOJhU.js";
import { a as DraggableDndGroup, t as AnyDraggable } from "./draggable-DlxtQzUd.js";
import { Emitter } from "eventti";

//#region src/droppable/droppable.d.ts
type DroppableId = symbol | string | number;
declare const DroppableEventType: {
  readonly Destroy: "destroy";
};
type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];
interface DroppableEventCallbacks {
  [DroppableEventType.Destroy]: () => void;
}
interface DroppableOptions {
  id?: DroppableId;
  accept?: Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
  data?: {
    [key: string]: any;
  };
}
declare class Droppable {
  readonly id: DroppableId;
  readonly element: HTMLElement | SVGSVGElement;
  readonly isDestroyed: boolean;
  accept: Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
  data: {
    [key: string]: any;
  };
  protected _clientRect: Rect;
  protected _emitter: Emitter<{ [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K] }>;
  constructor(element: HTMLElement | SVGSVGElement, options?: DroppableOptions);
  on<T extends keyof DroppableEventCallbacks>(type: T, listener: DroppableEventCallbacks[T], listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<T extends keyof DroppableEventCallbacks>(type: T, listenerId: SensorEventListenerId): void;
  getClientRect(): Readonly<Rect>;
  updateClientRect(rect?: Rect): void;
  destroy(): void;
}
//#endregion
export { DroppableOptions as a, DroppableId as i, DroppableEventCallbacks as n, DroppableEventType as r, Droppable as t };
//# sourceMappingURL=droppable-Bo_fOdqw.d.ts.map