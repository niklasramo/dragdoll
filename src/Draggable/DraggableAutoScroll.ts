import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { Draggable, DraggableSettings, DRAGGABLE_DEFAULT_SETTINGS } from './Draggable';

import { Sensor, SensorEvents } from '../Sensors/Sensor';

import {
  AutoScrollItem,
  AutoScrollItemSpeedCallback,
  AutoScrollItemEventCallback,
  AutoScrollItemTarget,
  autoScrollSmoothSpeed,
} from '../AutoScroll/AutoScroll';

import { autoScroll } from '../singletons/autoScroll';

import { Writeable } from '../types';

const AUTOSCROLL_POSITION = { x: 0, y: 0 };

const AUTOSCROLL_CLIENT_RECT = { left: 0, top: 0, width: 0, height: 0 };

export const AUTOSCROLL_DRAGGABLE_DEFAULT_SETTINGS: DraggableAutoScrollSettings<Sensor[]> = {
  ...DRAGGABLE_DEFAULT_SETTINGS,
  autoScroll: {
    targets: [],
    staticAreaSize: 0.2,
    speed: autoScrollSmoothSpeed(),
    smoothStop: false,
    getPosition: (draggable: Draggable<Sensor[]>) => {
      const drag = draggable.getDragData();
      const primaryItem = drag?.items[0];

      // Try to use the first item for the autoscroll data.
      if (primaryItem) {
        AUTOSCROLL_POSITION.x = primaryItem.x;
        AUTOSCROLL_POSITION.y = primaryItem.y;
      }
      // Fallback to the sensor's clientX/clientY values.
      else {
        const e = drag && (drag.nextMoveEvent || drag.startEvent);
        AUTOSCROLL_POSITION.x = e ? e.clientX : 0;
        AUTOSCROLL_POSITION.y = e ? e.clientY : 0;
      }

      return AUTOSCROLL_POSITION;
    },
    getClientRect: (draggable: Draggable<Sensor[]>) => {
      const drag = draggable.getDragData();
      const primaryItem = drag?.items[0];

      // Try to use the first item for the autoscroll data.
      if (primaryItem && primaryItem.element) {
        const { left, top, width, height } = primaryItem.element.getBoundingClientRect();
        AUTOSCROLL_CLIENT_RECT.left = left;
        AUTOSCROLL_CLIENT_RECT.top = top;
        AUTOSCROLL_CLIENT_RECT.width = width;
        AUTOSCROLL_CLIENT_RECT.height = height;
      }
      // Fallback to the sensor's clientX/clientY values and a static size of
      // 50px x 50px.
      else {
        const e = drag && (drag.nextMoveEvent || drag.startEvent);
        AUTOSCROLL_CLIENT_RECT.left = e ? e.clientX - 25 : 0;
        AUTOSCROLL_CLIENT_RECT.top = e ? e.clientY - 25 : 0;
        AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
        AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
      }

      return AUTOSCROLL_CLIENT_RECT;
    },
    onStart: null,
    onStop: null,
  },
};

class DraggableAutoScrollProxy<S extends Sensor<SensorEvents>[]> implements AutoScrollItem {
  protected _draggable: DraggableAutoScroll<S>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];

  constructor(draggable: DraggableAutoScroll<S>) {
    this._draggable = draggable;
    this._position = { x: 0, y: 0 };
    this._clientRect = { left: 0, top: 0, width: 0, height: 0 };
  }

  private _getSettings() {
    return this._draggable.settings.autoScroll;
  }

  get targets() {
    let { targets } = this._getSettings();
    if (typeof targets === 'function') {
      targets = targets(this._draggable);
    }
    return targets;
  }

  get position() {
    let { getPosition } = this._getSettings();
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
    let { getClientRect } = this._getSettings();
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
    return this._getSettings().staticAreaSize;
  }

  get smoothStop() {
    return this._getSettings().smoothStop;
  }

  get speed() {
    return this._getSettings().speed;
  }

  get onStart() {
    return this._getSettings().onStart;
  }

  get onStop() {
    return this._getSettings().onStop;
  }

  onPrepareScrollEffect() {
    const syncId = this._draggable['_syncId'];
    ticker.off(tickerReadPhase, syncId);
    ticker.off(tickerWritePhase, syncId);
    this._draggable['_prepareSynchronize']();
  }

  onApplyScrollEffect() {
    this._draggable['_applySynchronize']();
  }
}

export interface DraggableAutoScrollSettings<S extends Sensor[]> extends DraggableSettings<S> {
  autoScroll: {
    targets: AutoScrollItemTarget[] | ((draggable: Draggable<S>) => AutoScrollItemTarget[]);
    staticAreaSize: number;
    speed: number | AutoScrollItemSpeedCallback;
    smoothStop: boolean;
    getPosition: ((draggable: Draggable<S>) => { x: number; y: number }) | null;
    getClientRect:
      | ((draggable: Draggable<S>) => { left: number; top: number; width: number; height: number })
      | null;
    onStart: AutoScrollItemEventCallback | null;
    onStop: AutoScrollItemEventCallback | null;
  };
}

export type DraggableAutoScrollOptions<S extends Sensor[]> = Partial<
  DraggableAutoScrollSettings<S>
>;

export class DraggableAutoScroll<
  S extends Sensor[],
  E extends S[number]['events'] = S[number]['events']
> extends Draggable<S, E> {
  readonly settings: DraggableAutoScrollSettings<S>;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S> | null;

  constructor(sensors: S, options: DraggableAutoScrollOptions<S> = {}) {
    super(sensors, options);
    this.settings = this._parseSettings(options);
    this._autoScrollProxy = null;

    this.on('start', () => {
      if (!this._autoScrollProxy) {
        this._autoScrollProxy = new DraggableAutoScrollProxy(this);
        autoScroll.addItem(this._autoScrollProxy);
      }
    });

    this.on('beforeend', () => {
      if (this._autoScrollProxy) {
        autoScroll.removeItem(this._autoScrollProxy);
        this._autoScrollProxy = null;
      }
    });
  }

  protected _parseAutoScrollSettings(
    options?: DraggableAutoScrollOptions<S>['autoScroll'],
    defaults: DraggableAutoScrollSettings<S>['autoScroll'] = AUTOSCROLL_DRAGGABLE_DEFAULT_SETTINGS.autoScroll as unknown as DraggableAutoScrollSettings<S>['autoScroll']
  ): DraggableAutoScrollSettings<S>['autoScroll'] {
    const {
      targets = defaults.targets,
      staticAreaSize = defaults.staticAreaSize,
      speed = defaults.speed,
      smoothStop = defaults.smoothStop,
      getPosition = defaults.getPosition,
      getClientRect = defaults.getClientRect,
      onStart = defaults.onStart,
      onStop = defaults.onStop,
    } = options || {};

    return {
      targets,
      staticAreaSize,
      speed,
      smoothStop,
      getPosition,
      getClientRect,
      onStart,
      onStop,
    };
  }

  protected _parseSettings(
    options?: DraggableAutoScrollOptions<S>,
    defaults: DraggableAutoScrollSettings<S> = AUTOSCROLL_DRAGGABLE_DEFAULT_SETTINGS as unknown as DraggableAutoScrollSettings<S>
  ): DraggableAutoScrollSettings<S> {
    return {
      ...super._parseSettings(options, defaults),
      autoScroll: this._parseAutoScrollSettings(options?.autoScroll, defaults.autoScroll),
    };
  }

  updateSettings(options: DraggableAutoScrollOptions<S> = {}) {
    (this as Writeable<this>).settings = this._parseSettings(options, this.settings);
  }
}
