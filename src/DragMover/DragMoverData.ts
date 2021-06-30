import { DragSensorEvents } from '../DragSensor/DragSensor';

export class DragMoverData<T extends DragSensorEvents> {
  isStarted: boolean;
  startEvent: T['start'] | T['move'] | null;
  nextMoveEvent: T['move'] | null;
  prevMoveEvent: T['move'] | null;
  endEvent: T['cancel'] | T['end'] | T['abort'] | T['destroy'] | null;
  rootParent: HTMLElement | null;
  rootContainingBlock: HTMLElement | Document | null;
  dragParent: HTMLElement | null;
  dragContainingBlock: HTMLElement | Document | null;
  elementX: number;
  elementY: number;
  elementClientX: number;
  elementClientY: number;
  syncDiffX: number;
  syncDiffY: number;
  moveDiffX: number;
  moveDiffY: number;
  containerDiffX: number;
  containerDiffY: number;

  constructor() {
    this.isStarted = false;
    this.rootParent = null;
    this.rootContainingBlock = null;
    this.dragParent = null;
    this.dragContainingBlock = null;
    this.startEvent = null;
    this.nextMoveEvent = null;
    this.prevMoveEvent = null;
    this.endEvent = null;
    this.elementX = 0;
    this.elementY = 0;
    this.elementClientX = 0;
    this.elementClientY = 0;
    this.syncDiffX = 0;
    this.syncDiffY = 0;
    this.moveDiffX = 0;
    this.moveDiffY = 0;
    this.containerDiffX = 0;
    this.containerDiffY = 0;
  }
}
