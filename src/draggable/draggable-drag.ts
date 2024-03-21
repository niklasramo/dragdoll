import { Sensor } from '../sensors/sensor.js';

import { DraggableDragItem } from './draggable-drag-item.js';

export class DraggableDrag<S extends Sensor[], E extends S[number]['events']> {
  readonly sensor: S[number];
  readonly isEnded: boolean;
  readonly event: E['start'] | E['move'];
  readonly prevEvent: E['start'] | E['move'];
  readonly startEvent: E['start'] | E['move'];
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];

  constructor(sensor: S[number], startEvent: E['start'] | E['move']) {
    this.sensor = sensor;
    this.isEnded = false;
    this.event = startEvent;
    this.prevEvent = startEvent;
    this.startEvent = startEvent;
    this.endEvent = null;
    this.items = [];
  }
}
