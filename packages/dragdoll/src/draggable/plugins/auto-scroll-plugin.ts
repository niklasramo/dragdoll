import type {
  AutoScrollItem,
  AutoScrollItemEventCallback,
  AutoScrollItemSpeedCallback,
  AutoScrollItemTarget,
} from '../../auto-scroll/auto-scroll.js';
import { autoScrollSmoothSpeed } from '../../auto-scroll/auto-scroll.js';
import type { Sensor } from '../../sensors/sensor.js';
import { autoScroll } from '../../singletons/auto-scroll.js';
import type { Point, Rect, Writeable } from '../../types.js';
import type { Draggable, DraggablePluginMap } from '../draggable.js';
import { DraggableEventType } from '../draggable.js';

const AUTOSCROLL_POSITION: Point = { x: 0, y: 0 };

const AUTOSCROLL_CLIENT_RECT: Rect = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

function getDefaultSettings<S extends Sensor[]>() {
  return {
    targets: [],
    inertAreaSize: 0.2,
    speed: autoScrollSmoothSpeed(),
    smoothStop: false,
    getPosition: (draggable: Draggable<S>) => {
      const { drag } = draggable;
      const primaryItem = drag?.items[0];

      // Try to use the first item for the autoscroll data.
      if (primaryItem) {
        return primaryItem.position;
      }

      // Fallback to the sensor's clientX/clientY values.
      const e = drag && (drag.moveEvent || drag.startEvent);
      AUTOSCROLL_POSITION.x = e ? e.x : 0;
      AUTOSCROLL_POSITION.y = e ? e.y : 0;
      return AUTOSCROLL_POSITION;
    },
    getClientRect: (draggable: Draggable<S>) => {
      const { drag } = draggable;

      // Try to use the default draggable client rect.
      const clientRect = draggable.getClientRect();
      if (clientRect) return clientRect;

      // Fallback to the sensor's clientX/clientY values and a static size of
      // 50x50px.
      const e = drag && (drag.moveEvent || drag.startEvent);
      AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
      AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
      AUTOSCROLL_CLIENT_RECT.x = e ? e.x - 25 : 0;
      AUTOSCROLL_CLIENT_RECT.y = e ? e.y - 25 : 0;
      return AUTOSCROLL_CLIENT_RECT;
    },
    onStart: null,
    onStop: null,
  };
}

class DraggableAutoScrollProxy<S extends Sensor[]> implements AutoScrollItem {
  protected _draggableAutoScroll: DraggableAutoScroll<S>;
  protected _draggable: Draggable<S>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];

  constructor(draggableAutoScroll: DraggableAutoScroll<S>, draggable: Draggable<S>) {
    this._draggableAutoScroll = draggableAutoScroll;
    this._draggable = draggable;
    this._position = { x: 0, y: 0 };
    this._clientRect = { width: 0, height: 0, x: 0, y: 0 };
  }

  protected _getSettings() {
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
    const position = this._position;
    const { getPosition } = this._getSettings();
    if (typeof getPosition === 'function') {
      Object.assign(position, getPosition(this._draggable));
    } else {
      position.x = 0;
      position.y = 0;
    }
    return position;
  }

  get clientRect() {
    const rect = this._clientRect;
    const { getClientRect } = this._getSettings();
    if (typeof getClientRect === 'function') {
      Object.assign(rect, getClientRect(this._draggable));
    } else {
      rect.width = 0;
      rect.height = 0;
      rect.x = 0;
      rect.y = 0;
    }
    return rect;
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
}

export interface DraggableAutoScrollSettings<S extends Sensor[]> {
  targets: AutoScrollItemTarget[] | ((draggable: Draggable<S>) => AutoScrollItemTarget[]);
  inertAreaSize: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  getPosition: ((draggable: Draggable<S>) => Point) | null;
  getClientRect: ((draggable: Draggable<S>) => Rect) | null;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}

export type DraggableAutoScrollOptions<S extends Sensor[]> = Partial<
  DraggableAutoScrollSettings<S>
>;

export class DraggableAutoScroll<S extends Sensor[] = Sensor[]> {
  readonly name: 'autoscroll';
  readonly version: string;
  readonly settings: DraggableAutoScrollSettings<S>;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S> | null;

  constructor(draggable: Draggable<S>, options: DraggableAutoScrollOptions<S> = {}) {
    this.name = 'autoscroll';
    this.version = '0.0.3';
    this.settings = this._parseSettings(options);
    this._autoScrollProxy = null;

    draggable.on(DraggableEventType.Start, () => {
      if (!this._autoScrollProxy) {
        this._autoScrollProxy = new DraggableAutoScrollProxy(this, draggable);
        autoScroll.addItem(this._autoScrollProxy);
      }
    });

    draggable.on(DraggableEventType.End, () => {
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

export function autoScrollPlugin<S extends Sensor[], P extends DraggablePluginMap>(
  options?: DraggableAutoScrollOptions<S>,
) {
  return (draggable: Draggable<S, P>) => {
    const p = new DraggableAutoScroll(draggable, options);
    const d = draggable as typeof draggable & {
      plugins: { [p.name]: typeof p };
    };
    d.plugins[p.name] = p;
    return d;
  };
}
