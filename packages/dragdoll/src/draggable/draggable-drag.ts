import type { Sensor } from '../sensors/sensor.js';
import type { Point } from '../types.js';
import { ObjectCache } from '../utils/object-cache.js';
import type { DraggableDragItem } from './draggable-drag-item.js';

// Internal type for inferring the events type from the sensor type.
type E<S extends Sensor[]> = S[number]['_events_type'];

export class DraggableDrag<S extends Sensor[]> {
  readonly sensor: S[number];
  readonly startEvent: E<S>['start'] | E<S>['move'];
  readonly prevMoveEvent: E<S>['start'] | E<S>['move'];
  readonly moveEvent: E<S>['start'] | E<S>['move'];
  readonly endEvent: E<S>['end'] | E<S>['cancel'] | E<S>['destroy'] | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(sensor: S[number], startEvent: E<S>['start'] | E<S>['move']) {
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
