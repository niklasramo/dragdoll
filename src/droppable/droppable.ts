import type { Rect, Writeable } from '../types.js';

import type { EventListenerId } from 'eventti';

import type { Draggable } from '../draggable/draggable.js';

import { Emitter } from 'eventti';

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
  parent?: Droppable | null;
  data?: { [key: string]: any };
}

export const defaultDroppableOptions: Required<DroppableOptions> = {
  accept: () => true,
  parent: null,
  data: {},
};

export class Droppable {
  readonly id: Symbol;
  readonly element: HTMLElement | SVGSVGElement;
  readonly parent: Droppable | null;
  readonly children: ReadonlySet<Droppable>;
  accept: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
  data: { [key: string]: any };
  readonly isDestroyed: boolean;
  protected _clientRect: Rect;
  protected _emitter: Emitter<{
    [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K];
  }>;

  constructor(element: HTMLElement | SVGSVGElement, options: DroppableOptions = {}) {
    const {
      accept = defaultDroppableOptions.accept,
      parent = defaultDroppableOptions.parent,
      data = defaultDroppableOptions.data,
    } = options;

    this.id = Symbol();
    this.element = element;
    this.parent = null;
    this.children = new Set();
    this.accept = accept;
    this.data = { ...data };
    this.isDestroyed = false;
    this._clientRect = { x: 0, y: 0, width: 0, height: 0 };
    this._emitter = new Emitter();

    this.setParent(parent);
    this.updateClientRect();
  }

  protected _isDescendantOf(droppable: Droppable): boolean {
    let current: Droppable | null = droppable;
    while (current) {
      if (current === this) return true;
      current = current.parent;
    }
    return false;
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

  setParent(parent: Droppable | null) {
    if (this.parent === parent) return;

    if (parent === this) {
      throw new Error('Droppable cannot be its own parent.');
    }

    if (parent && parent._isDescendantOf(this)) {
      throw new Error('Cannot set a descendant as parent.');
    }

    if (this.parent) {
      (this.parent.children as Set<Droppable>).delete(this);
    }

    if (parent) {
      (parent.children as Set<Droppable>).add(this);
    }

    (this as Writeable<typeof this>).parent = parent;
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

    // Reset parent.
    this.setParent(null);

    // Reset the parent of all children, which are still attached to this
    // droppable.
    this.children.forEach((child) => {
      if (child.parent === this) {
        child.setParent(null);
      }
    });

    // Clear children.
    (this.children as Set<Droppable>).clear();
  }
}
