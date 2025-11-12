import type { Sensor, SensorsEventsType } from '../sensors/sensor.js';
import type { Point } from '../types.js';
import { ObjectCache } from '../utils/object-cache.js';
import type { DraggableDragItem } from './draggable-drag-item.js';

export class DraggableDrag<S extends Sensor[]> {
  readonly sensor: S[number];
  readonly startEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly prevMoveEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly moveEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly endEvent:
    | SensorsEventsType<S>['end']
    | SensorsEventsType<S>['cancel']
    | SensorsEventsType<S>['destroy']
    | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(
    sensor: S[number],
    startEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'],
  ) {
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
