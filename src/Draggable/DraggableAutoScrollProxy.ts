import { Draggable } from './Draggable';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { Sensor, SensorEvents } from '../Sensors/Sensor';

import { AutoScrollItem } from '../AutoScroll/AutoScroll';

export class DraggableAutoScrollProxy<S extends Sensor<SensorEvents>[]> implements AutoScrollItem {
  protected _draggable: Draggable<S>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];

  constructor(draggable: Draggable<S>) {
    this._draggable = draggable;
    this._position = { x: 0, y: 0 };
    this._clientRect = { left: 0, top: 0, width: 0, height: 0 };
  }

  get targets() {
    let { targets } = this._draggable.settings.autoScroll;
    if (typeof targets === 'function') {
      targets = targets(this._draggable);
    }
    return targets;
  }

  get position() {
    let { getPosition } = this._draggable.settings.autoScroll;
    if (typeof getPosition === 'function') {
      const position = getPosition(this._draggable);
      this._position.x = position.x;
      this._position.y = position.y;
    } else {
      this._position.x = 0;
      this._position.y = 0;
    }
    return this._position;
  }

  get clientRect() {
    let { getClientRect } = this._draggable.settings.autoScroll;
    if (typeof getClientRect === 'function') {
      const { left, top, width, height } = getClientRect(this._draggable);
      this._clientRect.left = left;
      this._clientRect.top = top;
      this._clientRect.width = width;
      this._clientRect.height = height;
    } else {
      this._clientRect.left = 0;
      this._clientRect.top = 0;
      this._clientRect.width = 0;
      this._clientRect.height = 0;
    }
    return this._clientRect;
  }

  get staticAreaSize() {
    return this._draggable.settings.autoScroll.staticAreaSize;
  }

  get smoothStop() {
    return this._draggable.settings.autoScroll.smoothStop;
  }

  get speed() {
    return this._draggable.settings.autoScroll.speed;
  }

  get onStart() {
    return this._draggable.settings.autoScroll.onStart;
  }

  get onStop() {
    return this._draggable.settings.autoScroll.onStop;
  }

  onPrepareScrollEffect() {
    const { _draggable } = this;
    const syncId = _draggable['_syncId'];
    ticker.off(tickerReadPhase, syncId);
    ticker.off(tickerWritePhase, syncId);
    _draggable['_prepareSynchronize']();
  }

  onApplyScrollEffect() {
    this._draggable['_applySynchronize']();
  }
}
