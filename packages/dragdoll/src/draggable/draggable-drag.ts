import type { Sensor } from '../sensors/sensor.js';
import type { Point } from '../types.js';
import { ObjectCache } from '../utils/object-cache.js';
import type { DraggableDragItem } from './draggable-drag-item.js';

export class DraggableDrag<S extends Sensor> {
  readonly sensor: S;
  readonly startEvent: S['_events_type']['start'] | S['_events_type']['move'];
  readonly prevMoveEvent: S['_events_type']['start'] | S['_events_type']['move'];
  readonly moveEvent: S['_events_type']['start'] | S['_events_type']['move'];
  readonly endEvent:
    | S['_events_type']['end']
    | S['_events_type']['cancel']
    | S['_events_type']['destroy']
    | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(sensor: S, startEvent: S['_events_type']['start'] | S['_events_type']['move']) {
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
