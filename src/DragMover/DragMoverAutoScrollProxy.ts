import { DragMover } from './DragMover';

import { DragSensorEvents } from '../DragSensor/DragSensor';

import { AutoScrollItem } from '../AutoScroll/AutoScrollItem';

export class DragMoverAutoScrollProxy<T extends DragSensorEvents> implements AutoScrollItem {
  readonly dragMover: DragMover<T>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];

  constructor(dragMover: DragMover<T>) {
    this.dragMover = dragMover;
    this._position = { x: 0, y: 0 };
    this._clientRect = { left: 0, top: 0, width: 0, height: 0 };
  }

  get targets() {
    let { targets } = this.dragMover.settings.autoScroll;
    if (typeof targets === 'function') {
      targets = targets(this.dragMover);
    }
    return targets;
  }

  get position() {
    const data = this.dragMover.getData();
    this._position.x = data?.elementX || 0;
    this._position.y = data?.elementY || 0;
    return this._position;
  }

  get clientRect() {
    const { left, top, width, height } = this.dragMover.element.getBoundingClientRect();
    this._clientRect.left = left;
    this._clientRect.top = top;
    this._clientRect.width = width;
    this._clientRect.height = height;
    return this._clientRect;
  }

  get safeZone() {
    return this.dragMover.settings.autoScroll.safeZone;
  }

  get smoothStop() {
    return this.dragMover.settings.autoScroll.smoothStop;
  }

  get speed() {
    return this.dragMover.settings.autoScroll.speed;
  }

  get onStart() {
    return this.dragMover.settings.autoScroll.onStart;
  }

  get onStop() {
    return this.dragMover.settings.autoScroll.onStop;
  }

  onPrepareAfterScrollEffect() {
    // @ts-ignore
    this.dragMover.settings.cancelReadOperation(this.dragMover._prepareSync);
    // @ts-ignore
    this.dragMover.settings.cancelWriteOperation(this.dragMover._applySync);
    // @ts-ignore
    this.dragMover._prepareSync();
  }

  onApplyAfterScrollEffect() {
    // @ts-ignore
    this.dragMover._applySync();
  }
}
