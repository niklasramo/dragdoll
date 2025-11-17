import { a as Rect, r as Point, t as CSSProperties } from "./types-BaIRuLz3.js";
import { a as SensorEventListenerId, t as Sensor, u as SensorsEventsType } from "./sensor-C7UNOJhU.js";
import { Emitter } from "eventti";

//#region src/utils/object-cache.d.ts
declare class ObjectCache<Key, Value> {
  protected _cache: Map<Key, Value>;
  protected _validation: Set<Key>;
  constructor();
  set(key: Key, value: Value): void;
  get(key: Key): Value | undefined;
  has(key: Key): boolean;
  delete(key: Key): void;
  isValid(key: Key): boolean;
  invalidate(key?: Key): void;
  clear(): void;
}
//#endregion
//#region src/draggable/draggable-drag-item.d.ts
declare class DraggableDragItem<S extends Sensor[] = Sensor[]> {
  data: {
    [key: string]: any;
  };
  readonly element: HTMLElement | SVGSVGElement;
  readonly elementContainer: HTMLElement;
  readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly dragContainer: HTMLElement;
  readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly elementTransformOrigin: {
    x: number;
    y: number;
    z: number;
  };
  readonly elementTransformMatrix: DOMMatrix;
  readonly elementOffsetMatrix: DOMMatrix;
  readonly frozenStyles: CSSProperties | null;
  readonly unfrozenStyles: CSSProperties | null;
  readonly clientRect: Rect;
  readonly position: Point;
  readonly containerOffset: Point;
  readonly alignmentOffset: Point;
  protected _moveDiff: Point;
  protected _alignDiff: Point;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;
  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S>);
  protected _updateContainerMatrices(): void;
  protected _updateContainerOffset(): void;
  getContainerMatrix(): [DOMMatrix, DOMMatrix];
  getDragContainerMatrix(): [DOMMatrix, DOMMatrix];
  updateSize(dimensions?: {
    width: number;
    height: number;
  }): void;
}
//#endregion
//#region src/draggable/draggable-drag.d.ts
declare class DraggableDrag<S extends Sensor[]> {
  readonly sensor: S[number];
  readonly startEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly prevMoveEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly moveEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  readonly endEvent: SensorsEventsType<S>['end'] | SensorsEventsType<S>['cancel'] | SensorsEventsType<S>['destroy'] | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;
  constructor(sensor: S[number], startEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move']);
}
//#endregion
//#region src/draggable/draggable.d.ts
declare enum DragStartPhase {
  None = 0,
  Init = 1,
  Prepare = 2,
  FinishPrepare = 3,
  Apply = 4,
  FinishApply = 5,
}
declare enum DraggableStartPredicateState {
  Pending = 0,
  Resolved = 1,
  Rejected = 2,
}
type AnyDraggable = Draggable<any, any>;
type DraggableId = string | number | symbol;
type DraggableDndGroup = string | number | symbol;
declare const DraggableModifierPhase: {
  readonly Start: "start";
  readonly Move: "move";
  readonly End: "end";
};
type DraggableModifierPhase = (typeof DraggableModifierPhase)[keyof typeof DraggableModifierPhase];
declare const DraggableSensorProcessingMode: {
  readonly Immediate: "immediate";
  readonly Sampled: "sampled";
};
type DraggableSensorProcessingMode = (typeof DraggableSensorProcessingMode)[keyof typeof DraggableSensorProcessingMode];
declare const DraggableApplyPositionPhase: {
  readonly Start: "start";
  readonly StartAlign: "start-align";
  readonly Move: "move";
  readonly Align: "align";
  readonly End: "end";
  readonly EndAlign: "end-align";
};
type DraggableApplyPositionPhase = (typeof DraggableApplyPositionPhase)[keyof typeof DraggableApplyPositionPhase];
type DraggableModifierData<S extends Sensor[]> = {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  phase: DraggableModifierPhase;
};
type DraggableModifier<S extends Sensor[]> = (change: Point, data: DraggableModifierData<S>) => Point;
interface DraggableSettings<S extends Sensor[]> {
  container: HTMLElement | null | ((data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
    element: HTMLElement | SVGSVGElement;
  }) => HTMLElement | null);
  startPredicate: (data: {
    draggable: Draggable<S>;
    sensor: S[number];
    event: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  }) => boolean | undefined;
  elements: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
  }) => (HTMLElement | SVGSVGElement)[] | null;
  frozenStyles: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
    item: DraggableDragItem<S>;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  positionModifiers: DraggableModifier<S>[];
  applyPosition: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
    item: DraggableDragItem<S>;
    phase: DraggableApplyPositionPhase;
  }) => void;
  computeClientRect?: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
  }) => Readonly<Rect> | null;
  sensorProcessingMode?: DraggableSensorProcessingMode;
  dndGroups?: Set<DraggableDndGroup>;
  onPrepareStart?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onStart?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onPrepareMove?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onMove?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onEnd?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onDestroy?: (draggable: Draggable<S>) => void;
}
interface DraggableOptions<S extends Sensor[]> extends Partial<DraggableSettings<S>> {
  id?: DraggableId;
}
interface DraggablePlugin {
  name: string;
  version: string;
}
type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;
declare const DraggableEventType: {
  readonly PrepareStart: "preparestart";
  readonly Start: "start";
  readonly PrepareMove: "preparemove";
  readonly Move: "move";
  readonly End: "end";
  readonly Destroy: "destroy";
};
type DraggableEventType = (typeof DraggableEventType)[keyof typeof DraggableEventType];
interface DraggableEventCallbacks<S extends Sensor[]> {
  [DraggableEventType.PrepareStart]: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  [DraggableEventType.Start]: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  [DraggableEventType.PrepareMove]: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  [DraggableEventType.Move]: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  [DraggableEventType.End]: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  [DraggableEventType.Destroy]: () => void;
}
type DraggableEventCallback<S extends Sensor[] = Sensor[], K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>> = DraggableEventCallbacks<S>[K];
declare const DraggableDefaultSettings: DraggableSettings<any>;
declare class Draggable<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}> {
  readonly id: DraggableId;
  readonly sensors: S;
  readonly settings: DraggableSettings<S>;
  readonly plugins: P;
  readonly drag: DraggableDrag<S> | null;
  readonly isDestroyed: boolean;
  protected _sensorData: Map<S[number], {
    predicateState: DraggableStartPredicateState;
    predicateEvent: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'] | null;
    onMove: (e: Parameters<Draggable<S, P>['_onMove']>[0]) => void;
    onEnd: (e: Parameters<Draggable<S, P>['_onEnd']>[0]) => void;
  }>;
  protected _emitter: Emitter<{ [K in keyof DraggableEventCallbacks<S>]: DraggableEventCallbacks<S>[K] }>;
  protected _startPhase: DragStartPhase;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _alignId: symbol;
  constructor(sensors: S, options?: DraggableOptions<S>);
  protected _parseSettings(options?: Partial<this['settings']>, defaults?: this['settings']): this['settings'];
  protected _emit<K extends keyof DraggableEventCallbacks<S>>(type: K, ...e: Parameters<DraggableEventCallbacks<S>[K]>): void;
  protected _onMove(e: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'], sensor: S[number]): void;
  protected _onScroll(): void;
  protected _onEnd(e: SensorsEventsType<S>['end'] | SensorsEventsType<S>['cancel'] | SensorsEventsType<S>['destroy'], sensor: S[number]): void;
  protected _prepareStart(): void;
  protected _applyStart(): void;
  protected _prepareMove(): void;
  protected _applyMove(): void;
  protected _prepareAlign(): void;
  protected _applyAlign(): void;
  protected _applyModifiers(phase: DraggableModifierPhase, changeX: number, changeY: number): void;
  on<T extends keyof DraggableEventCallbacks<S>>(type: T, listener: DraggableEventCallbacks<S>[T], listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<T extends keyof DraggableEventCallbacks<S>>(type: T, listenerId: SensorEventListenerId): void;
  resolveStartPredicate(sensor: S[number], e?: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move']): void;
  rejectStartPredicate(sensor: S[number]): void;
  stop(): void;
  align(instant?: boolean): void;
  getClientRect(): Readonly<Rect> | null;
  updateSettings(options: Partial<this['settings']>): void;
  use<SS extends S, PP extends P>(plugin: (draggable: this) => Draggable<SS, PP>): Draggable<SS, PP>;
  destroy(): void;
}
//#endregion
export { DraggableSettings as _, DraggableDndGroup as a, DraggableEventType as c, DraggableModifierData as d, DraggableModifierPhase as f, DraggableSensorProcessingMode as g, DraggablePluginMap as h, DraggableDefaultSettings as i, DraggableId as l, DraggablePlugin as m, Draggable as n, DraggableEventCallback as o, DraggableOptions as p, DraggableApplyPositionPhase as r, DraggableEventCallbacks as s, AnyDraggable as t, DraggableModifier as u, DraggableDrag as v, DraggableDragItem as y };
//# sourceMappingURL=draggable-kDevCMz8.d.ts.map