import { Rect } from "./types-CEK9qPqM.js";
import { SensorEventListenerId } from "./sensor-IikAh47T.js";
import { AnyDraggable, DraggableDndGroup } from "./draggable-4HkzSPcJ.js";
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
export { Droppable, DroppableEventCallbacks, DroppableEventType, DroppableId, DroppableOptions };
//# sourceMappingURL=droppable-BP1gsrmk.d.ts.map