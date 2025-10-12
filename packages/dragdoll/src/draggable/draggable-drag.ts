import type { Sensor } from '../sensors/sensor.js';

import type { Point } from '../types.js';

import type { DraggableDragItem } from './draggable-drag-item.js';

import { ObjectCache } from '../utils/object-cache.js';

export class DraggableDrag<S extends Sensor[], E extends S[number]['_events_type']> {
  readonly sensor: S[number];
  readonly startEvent: E['start'] | E['move'];
  readonly prevMoveEvent: E['start'] | E['move'];
  readonly moveEvent: E['start'] | E['move'];
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(sensor: S[number], startEvent: E['start'] | E['move']) {
    this.sensor = sensor;
    this.startEvent = startEvent;
    this.prevMoveEvent = startEvent;
    this.moveEvent = startEvent;
    this.endEvent = null;
    this.items = [];
    this.isEnded = false;
    this._matrixCache = new ObjectCache();
    this._clientOffsetCache = new ObjectCache();
  }
}
