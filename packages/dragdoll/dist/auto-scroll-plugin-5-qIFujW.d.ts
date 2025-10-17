import { Point, Rect } from "./types-CEK9qPqM.js";
import { AutoScrollItem, AutoScrollItemEventCallback, AutoScrollItemSpeedCallback, AutoScrollItemTarget } from "./auto-scroll-Lt4FzAiU.js";
import { Sensor } from "./sensor-DbtiV--O.js";
import { Draggable, DraggablePluginMap } from "./draggable-rDEVLiCd.js";

//#region src/draggable/plugins/auto-scroll-plugin.d.ts
declare class DraggableAutoScrollProxy<S extends Sensor[], E extends S[number]['_events_type']> implements AutoScrollItem {
  protected _draggableAutoScroll: DraggableAutoScroll<S, E>;
  protected _draggable: Draggable<S, E>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];
  constructor(draggableAutoScroll: DraggableAutoScroll<S, E>, draggable: Draggable<S, E>);
  protected _getSettings(): DraggableAutoScrollSettings<S, E>;
  get targets(): AutoScrollItemTarget[];
  get position(): Point;
  get clientRect(): Rect;
  get inertAreaSize(): number;
  get smoothStop(): boolean;
  get speed(): number | AutoScrollItemSpeedCallback;
  get onStart(): AutoScrollItemEventCallback | null;
  get onStop(): AutoScrollItemEventCallback | null;
}
interface DraggableAutoScrollSettings<S extends Sensor[], E extends S[number]['_events_type']> {
  targets: AutoScrollItemTarget[] | ((draggable: Draggable<S, E>) => AutoScrollItemTarget[]);
  inertAreaSize: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  getPosition: ((draggable: Draggable<S, E>) => Point) | null;
  getClientRect: ((draggable: Draggable<S, E>) => Rect) | null;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}
type DraggableAutoScrollOptions<S extends Sensor[], E extends S[number]['_events_type']> = Partial<DraggableAutoScrollSettings<S, E>>;
declare class DraggableAutoScroll<S extends Sensor[] = Sensor[], E extends S[number]['_events_type'] = S[number]['_events_type']> {
  readonly name: 'autoscroll';
  readonly version: string;
  readonly settings: DraggableAutoScrollSettings<S, E>;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S, E> | null;
  constructor(draggable: Draggable<S, E>, options?: DraggableAutoScrollOptions<S, E>);
  protected _parseSettings(options?: Partial<this['settings']>, defaults?: this['settings']): this['settings'];
  updateSettings(options?: Partial<this['settings']>): void;
}
declare function autoScrollPlugin<S extends Sensor[], E extends S[number]['_events_type'], P extends DraggablePluginMap>(options?: DraggableAutoScrollOptions<S, E>): (draggable: Draggable<S, E, P>) => Draggable<S, E, P> & {
  plugins: {
    autoscroll: DraggableAutoScroll<S, E>;
  };
};
//#endregion
export { DraggableAutoScroll, DraggableAutoScrollOptions, DraggableAutoScrollSettings, autoScrollPlugin };
//# sourceMappingURL=auto-scroll-plugin-5-qIFujW.d.ts.map