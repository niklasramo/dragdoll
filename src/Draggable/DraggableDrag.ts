import { Sensor } from '../Sensors/Sensor';
import { DraggableItem } from './DraggableItem';

export class DraggableDrag<
  S extends Sensor[],
  E extends S[number]['events'] = S[number]['events']
> {
  sensor: S[number] | null;
  isStarted: boolean;
  isEnded: boolean;
  startEvent: E['start'] | E['move'] | null;
  nextMoveEvent: E['move'] | null;
  prevMoveEvent: E['move'] | null;
  endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  items: DraggableItem[];

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
