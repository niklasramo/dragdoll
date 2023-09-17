import { Sensor } from '../sensors/sensor.js';

import { DraggableDragItem } from './draggable-drag-item.js';

export class DraggableDrag<S extends Sensor[], E extends S[number]['events']> {
  readonly sensor: S[number] | null;
  readonly isStarted: boolean;
  readonly isEnded: boolean;
  readonly startEvent: E['start'] | E['move'] | null;
  readonly nextMoveEvent: E['move'] | null;
  readonly prevMoveEvent: E['move'] | null;
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];

  constructor() {
    this.sensor = null;
    this.isEnded = false;
    this.isStarted = false;
    this.startEvent = null;
    this.nextMoveEvent = null;
    this.prevMoveEvent = null;
    this.endEvent = null;
    this.items = [];
  }
}
