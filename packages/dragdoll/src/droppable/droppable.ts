import { Emitter } from 'eventti';
import type { AnyDraggable, DraggableDndGroup } from '../draggable/draggable.js';
import type { SensorEventListenerId } from '../sensors/sensor.js';
import type { Rect, Writeable } from '../types.js';

export type DroppableId = symbol | string | number;

export const DroppableEventType = {
  Destroy: 'destroy',
} as const;

export const DroppableDefaultSettings = {
  accept: () => true,
  computeClientRect: (droppable: Droppable) =>
    droppable.element?.getBoundingClientRect() || droppable.getClientRect(),
};

export type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];

export interface DroppableEventCallbacks {
  [DroppableEventType.Destroy]: () => void;
}

export interface DroppableOptions {
  id?: DroppableId;
  accept?: Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
  data?: { [key: string]: any };
  computeClientRect?: (droppable: Droppable) => Rect;
}

export class Droppable {
  readonly id: DroppableId;
  readonly element: HTMLElement | SVGSVGElement | null;
  readonly isDestroyed: boolean;
  accept: Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
  data: { [key: string]: any };
  computeClientRect: (droppable: Droppable) => Rect;
  protected _clientRect: Rect;
  protected _emitter: Emitter<{
    [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K];
  }>;

  constructor(element: HTMLElement | SVGSVGElement | null, options: DroppableOptions = {}) {
    const {
      id = Symbol(),
      accept = DroppableDefaultSettings.accept,
      data = {},
      computeClientRect = DroppableDefaultSettings.computeClientRect,
    } = options;

    this.id = id;
    this.element = element;
    this.isDestroyed = false;
    this.accept = accept;
    this.data = data;
    this.computeClientRect = computeClientRect;
    this._clientRect = { x: 0, y: 0, width: 0, height: 0 };
    this._emitter = new Emitter();

    this.updateClientRect();
  }

  on<T extends keyof DroppableEventCallbacks>(
    type: T,
    listener: DroppableEventCallbacks[T],
    listenerId?: SensorEventListenerId,
  ): SensorEventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof DroppableEventCallbacks>(type: T, listenerId: SensorEventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  getClientRect() {
    return this._clientRect as Readonly<Rect>;
  }

  updateClientRect() {
    const computedRect = this.computeClientRect(this);
    const clientRect = this._clientRect;
    clientRect.x = computedRect.x;
    clientRect.y = computedRect.y;
    clientRect.width = computedRect.width;
    clientRect.height = computedRect.height;
  }

  destroy() {
    if (this.isDestroyed) return;
    (this as Writeable<typeof this>).isDestroyed = true;

    this._emitter.emit(DroppableEventType.Destroy);
    this._emitter.off();
  }
}
