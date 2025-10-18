import type { EventListenerId } from 'eventti';
import { Emitter } from 'eventti';
import type { Draggable, DraggableDndGroup } from '../draggable/draggable.js';
import type { Rect, Writeable } from '../types.js';

export type DroppableId = symbol | string | number;

export const DroppableEventType = {
  Destroy: 'destroy',
} as const;

export type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];

export interface DroppableEventCallbacks {
  [DroppableEventType.Destroy]: () => void;
}

export interface DroppableOptions {
  id?: DroppableId;
  accept?: Set<DraggableDndGroup> | ((draggable: Draggable<any>) => boolean);
  data?: { [key: string]: any };
}

export class Droppable {
  readonly id: DroppableId;
  readonly element: HTMLElement | SVGSVGElement;
  accept: Set<DraggableDndGroup> | ((draggable: Draggable<any>) => boolean);
  data: { [key: string]: any };
  readonly isDestroyed: boolean;
  protected _clientRect: Rect;
  protected _emitter: Emitter<{
    [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K];
  }>;

  constructor(element: HTMLElement | SVGSVGElement, options: DroppableOptions = {}) {
    const { id = Symbol(), accept = () => true, data = {} } = options;

    this.id = id;
    this.element = element;
    this.accept = accept;
    this.data = data;
    this.isDestroyed = false;
    this._clientRect = { x: 0, y: 0, width: 0, height: 0 };
    this._emitter = new Emitter();

    this.updateClientRect();
  }

  on<T extends keyof DroppableEventCallbacks>(
    type: T,
    listener: DroppableEventCallbacks[T],
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof DroppableEventCallbacks>(type: T, listenerId: EventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  getClientRect() {
    return this._clientRect as Readonly<Rect>;
  }

  updateClientRect(rect?: Rect) {
    const bcr = rect || this.element.getBoundingClientRect();
    const { _clientRect } = this;
    _clientRect.x = bcr.x;
    _clientRect.y = bcr.y;
    _clientRect.width = bcr.width;
    _clientRect.height = bcr.height;
  }

  destroy() {
    if (this.isDestroyed) return;
    (this as Writeable<typeof this>).isDestroyed = true;

    this._emitter.emit(DroppableEventType.Destroy);
    this._emitter.off();
  }
}
