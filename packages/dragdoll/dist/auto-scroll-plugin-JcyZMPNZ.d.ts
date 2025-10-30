import { Point, Rect } from "./types-CEK9qPqM.js";
import { AutoScrollItem, AutoScrollItemEventCallback, AutoScrollItemSpeedCallback, AutoScrollItemTarget } from "./auto-scroll-BB3SKUM1.js";
import { Sensor } from "./sensor-IikAh47T.js";
import { Draggable, DraggablePluginMap } from "./draggable-4HkzSPcJ.js";

//#region src/draggable/plugins/auto-scroll-plugin.d.ts
declare class DraggableAutoScrollProxy<S extends Sensor[]> implements AutoScrollItem {
  protected _draggableAutoScroll: DraggableAutoScroll<S>;
  protected _draggable: Draggable<S>;
  protected _position: AutoScrollItem['position'];
  protected _clientRect: AutoScrollItem['clientRect'];
  constructor(draggableAutoScroll: DraggableAutoScroll<S>, draggable: Draggable<S>);
  protected _getSettings(): DraggableAutoScrollSettings<S>;
  get targets(): AutoScrollItemTarget[];
  get position(): Point;
  get clientRect(): Rect;
  get inertAreaSize(): number;
  get smoothStop(): boolean;
  get speed(): number | AutoScrollItemSpeedCallback;
  get onStart(): AutoScrollItemEventCallback | null;
  get onStop(): AutoScrollItemEventCallback | null;
}
interface DraggableAutoScrollSettings<S extends Sensor[]> {
  targets: AutoScrollItemTarget[] | ((draggable: Draggable<S>) => AutoScrollItemTarget[]);
  inertAreaSize: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  getPosition: ((draggable: Draggable<S>) => Point) | null;
  getClientRect: ((draggable: Draggable<S>) => Rect) | null;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}
type DraggableAutoScrollOptions<S extends Sensor[]> = Partial<DraggableAutoScrollSettings<S>>;
declare class DraggableAutoScroll<S extends Sensor[] = Sensor[]> {
  readonly name: 'autoscroll';
  readonly version: string;
  readonly settings: DraggableAutoScrollSettings<S>;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S> | null;
  constructor(draggable: Draggable<S>, options?: DraggableAutoScrollOptions<S>);
  protected _parseSettings(options?: Partial<this['settings']>, defaults?: this['settings']): this['settings'];
  updateSettings(options?: Partial<this['settings']>): void;
}
declare function autoScrollPlugin<S extends Sensor[], P extends DraggablePluginMap>(options?: DraggableAutoScrollOptions<S>): (draggable: Draggable<S, P>) => Draggable<S, P> & {
  plugins: {
    autoscroll: DraggableAutoScroll<S>;
  };
};
//#endregion
export { DraggableAutoScroll, DraggableAutoScrollOptions, DraggableAutoScrollSettings, autoScrollPlugin };
//# sourceMappingURL=auto-scroll-plugin-JcyZMPNZ.d.ts.map