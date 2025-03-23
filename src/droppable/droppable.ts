import { Emitter, EventListenerId } from 'eventti';

import { Draggable } from '../draggable/draggable.js';

import { Rect, Writeable } from '../types.js';

export type DroppableAcceptId = string | number | symbol;

export const DroppableEventType = {
  Destroy: 'destroy',
} as const;

export type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];

export interface DroppableEventCallbacks {
  [DroppableEventType.Destroy]: () => void;
}

export interface DroppableOptions {
  accept?: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
}

export const defaultDroppableOptions: Required<DroppableOptions> = {
  accept: () => true,
};

export class Droppable {
  readonly element: HTMLElement | SVGSVGElement;
  readonly accept: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
  readonly isDestroyed: boolean;
  readonly _clientRect: Rect;
  protected _emitter: Emitter<{
    [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K];
  }>;

  constructor(element: HTMLElement | SVGSVGElement, options: DroppableOptions = {}) {
    const { accept = defaultDroppableOptions.accept } = options;

    this.element = element;
    this.accept = accept;
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

  updateClientRect() {
    const bcr = this.element.getBoundingClientRect();
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
