import { ticker, tickerReadPhase, tickerWritePhase } from '../../singletons/ticker.js';

import { Draggable, DraggablePluginMap } from '../draggable.js';

import { Sensor } from '../../sensors/sensor.js';

import {
  AutoScrollItem,
  AutoScrollItemSpeedCallback,
  AutoScrollItemEventCallback,
  AutoScrollItemTarget,
  autoScrollSmoothSpeed,
} from '../../auto-scroll/auto-scroll.js';

import { autoScroll } from '../../singletons/auto-scroll.js';

import { Writeable } from '../../types.js';

const AUTOSCROLL_POSITION = { x: 0, y: 0 };

const AUTOSCROLL_CLIENT_RECT = { left: 0, top: 0, width: 0, height: 0 };

function getDefaultSettings<S extends Sensor[], E extends S[number]['events']>() {
  return {
    targets: [],
    inertAreaSize: 0.2,
    speed: autoScrollSmoothSpeed(),
    smoothStop: false,
    getPosition: (draggable: Draggable<S, E>) => {
      const { drag } = draggable;
      const primaryItem = drag?.items[0];

      // Try to use the first item for the autoscroll data.
      if (primaryItem) {
        AUTOSCROLL_POSITION.x = primaryItem.position.x;
        AUTOSCROLL_POSITION.y = primaryItem.position.y;
      }
      // Fallback to the sensor's clientX/clientY values.
      else {
        const e = drag && (drag.event || drag.startEvent);
        AUTOSCROLL_POSITION.x = e ? e.x : 0;
        AUTOSCROLL_POSITION.y = e ? e.y : 0;
      }

      return AUTOSCROLL_POSITION;
    },
    getClientRect: (draggable: Draggable<S, E>) => {
      const { drag } = draggable;
      const primaryItem = drag?.items[0];

      // Try to use the first item for the autoscroll data.
      if (primaryItem && primaryItem.element) {
        const { left, top, width, height } = primaryItem.clientRect;
        AUTOSCROLL_CLIENT_RECT.left = left;
        AUTOSCROLL_CLIENT_RECT.top = top;
        AUTOSCROLL_CLIENT_RECT.width = width;
        AUTOSCROLL_CLIENT_RECT.height = height;
      }
      // Fallback to the sensor's clientX/clientY values and a static size of
      // 50x50px.
      else {
        const e = drag && (drag.event || drag.startEvent);
        AUTOSCROLL_CLIENT_RECT.left = e ? e.x - 25 : 0;
        AUTOSCROLL_CLIENT_RECT.top = e ? e.y - 25 : 0;
        AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
        AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
      }

      return AUTOSCROLL_CLIENT_RECT;
    },
    onStart: null,
    onStop: null,
  };
}

class DraggableAutoScrollProxy<S extends Sensor[], E extends S[number]['events']>
  implements AutoScrollItem
{
  protected _draggableAutoScroll: DraggableAutoScroll<S, E>;
  protected _draggable: Draggable<S, E>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];

  constructor(draggableAutoScroll: DraggableAutoScroll<S, E>, draggable: Draggable<S, E>) {
    this._draggableAutoScroll = draggableAutoScroll;
    this._draggable = draggable;
    this._position = { x: 0, y: 0 };
    this._clientRect = { left: 0, top: 0, width: 0, height: 0 };
  }

  private _getSettings() {
    return this._draggableAutoScroll.settings;
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

  get inertAreaSize() {
    return this._getSettings().inertAreaSize;
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
    const updateId = this._draggable['_updateId'];
    ticker.off(tickerReadPhase, updateId);
    ticker.off(tickerWritePhase, updateId);
    this._draggable['_preparePositionUpdate']();
  }

  onApplyScrollEffect() {
    this._draggable['_applyPositionUpdate']();
  }
}

export interface DraggableAutoScrollSettings<S extends Sensor[], E extends S[number]['events']> {
  targets: AutoScrollItemTarget[] | ((draggable: Draggable<S, E>) => AutoScrollItemTarget[]);
  inertAreaSize: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  getPosition: ((draggable: Draggable<S, E>) => { x: number; y: number }) | null;
  getClientRect:
    | ((draggable: Draggable<S, E>) => {
        left: number;
        top: number;
        width: number;
        height: number;
      })
    | null;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}

export type DraggableAutoScrollOptions<S extends Sensor[], E extends S[number]['events']> = Partial<
  DraggableAutoScrollSettings<S, E>
>;

export class DraggableAutoScroll<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events'],
> {
  readonly name: 'autoscroll';
  readonly version: string;
  readonly settings: DraggableAutoScrollSettings<S, E>;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S, E> | null;

  constructor(draggable: Draggable<S, E>, options: DraggableAutoScrollOptions<S, E> = {}) {
    this.name = 'autoscroll';
    this.version = '0.0.2';
    this.settings = this._parseSettings(options);
    this._autoScrollProxy = null;

    draggable.on('start', () => {
      if (!this._autoScrollProxy) {
        this._autoScrollProxy = new DraggableAutoScrollProxy(this, draggable);
        autoScroll.addItem(this._autoScrollProxy);
      }
    });

    draggable.on('end', () => {
      if (this._autoScrollProxy) {
        autoScroll.removeItem(this._autoScrollProxy);
        this._autoScrollProxy = null;
      }
    });
  }

  protected _parseSettings(
    options?: Partial<this['settings']>,
    defaults: this['settings'] = getDefaultSettings(),
  ): this['settings'] {
    const {
      targets = defaults.targets,
      inertAreaSize = defaults.inertAreaSize,
      speed = defaults.speed,
      smoothStop = defaults.smoothStop,
      getPosition = defaults.getPosition,
      getClientRect = defaults.getClientRect,
      onStart = defaults.onStart,
      onStop = defaults.onStop,
    } = options || {};

    return {
      targets,
      inertAreaSize,
      speed,
      smoothStop,
      getPosition,
      getClientRect,
      onStart,
      onStop,
    };
  }

  updateSettings(options: Partial<this['settings']> = {}) {
    (this as Writeable<this>).settings = this._parseSettings(options, this.settings);
  }
}

export function autoScrollPlugin<
  S extends Sensor[],
  E extends S[number]['events'],
  P extends DraggablePluginMap,
>(options?: DraggableAutoScrollOptions<S, E>) {
  return (draggable: Draggable<S, E, P>) => {
    const p = new DraggableAutoScroll(draggable, options);
    const d = draggable as typeof draggable & {
      plugins: { [p.name]: typeof p };
    };
    d.plugins[p.name] = p;
    return d;
  };
}
