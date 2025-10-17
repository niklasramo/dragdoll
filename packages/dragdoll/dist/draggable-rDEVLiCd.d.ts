import { CSSProperties, Point, Rect } from "./types-CEK9qPqM.js";
import { Sensor, SensorEvents } from "./sensor-DbtiV--O.js";
import { Emitter, EventListenerId } from "eventti";

//#region src/utils/object-cache.d.ts
declare class ObjectCache<Key, Value> {
  protected _cache: Map<Key, Value>;
  protected _validation: Map<Key, undefined>;
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
declare class DraggableDragItem<S extends Sensor[] = Sensor[], E extends S[number]['_events_type'] = S[number]['_events_type']> {
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
  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S, E>);
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
declare class DraggableDrag<S extends Sensor[], E extends S[number]['_events_type']> {
  readonly sensor: S[number];
  readonly startEvent: E['start'] | E['move'];
  readonly prevMoveEvent: E['start'] | E['move'];
  readonly moveEvent: E['start'] | E['move'];
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];
  readonly isEnded: boolean;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;
  constructor(sensor: S[number], startEvent: E['start'] | E['move']);
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
type DraggableId = symbol | string | number;
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
type DraggableModifierData<S extends Sensor[], E extends S[number]['_events_type']> = {
  draggable: Draggable<S, E>;
  drag: DraggableDrag<S, E>;
  item: DraggableDragItem<S, E>;
  phase: DraggableModifierPhase;
};
type DraggableModifier<S extends Sensor[], E extends S[number]['_events_type']> = (change: Point, data: DraggableModifierData<S, E>) => Point;
interface DraggableSettings<S extends Sensor[], E extends S[number]['_events_type']> {
  container: HTMLElement | null;
  startPredicate: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    event: E['start'] | E['move'];
  }) => boolean | undefined;
  elements: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
  }) => (HTMLElement | SVGSVGElement)[] | null;
  frozenStyles: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
    item: DraggableDragItem<S, E>;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  positionModifiers: DraggableModifier<S, E>[];
  applyPosition: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
    item: DraggableDragItem<S, E>;
    phase: DraggableApplyPositionPhase;
  }) => void;
  computeClientRect?: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
  }) => Readonly<Rect> | null;
  sensorProcessingMode?: DraggableSensorProcessingMode;
  group?: string | number | symbol | null;
  onPrepareStart?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onStart?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onPrepareMove?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onMove?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onEnd?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onDestroy?: (draggable: Draggable<S, E>) => void;
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
interface DraggableEventCallbacks<E extends SensorEvents> {
  [DraggableEventType.PrepareStart]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.Start]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.PrepareMove]: (event: E['move']) => void;
  [DraggableEventType.Move]: (event: E['move']) => void;
  [DraggableEventType.End]: (event: E['end'] | E['cancel'] | E['destroy'] | null) => void;
  [DraggableEventType.Destroy]: () => void;
}
declare const DraggableDefaultSettings: DraggableSettings<any, any>;
declare class Draggable<S extends Sensor[] = Sensor[], E extends S[number]['_events_type'] = S[number]['_events_type'], P extends DraggablePluginMap = {}> {
  readonly id: DraggableId;
  readonly sensors: S;
  readonly settings: DraggableSettings<S, E>;
  readonly plugins: P;
  readonly drag: DraggableDrag<S, E> | null;
  readonly isDestroyed: boolean;
  protected _sensorData: Map<S[number], {
    predicateState: DraggableStartPredicateState;
    predicateEvent: E['start'] | E['move'] | null;
    onMove: (e: Parameters<Draggable<S, E, P>['_onMove']>[0]) => void;
    onEnd: (e: Parameters<Draggable<S, E, P>['_onEnd']>[0]) => void;
  }>;
  protected _emitter: Emitter<{ [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K] }>;
  protected _startPhase: DragStartPhase;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _alignId: symbol;
  constructor(sensors: S, options?: Partial<DraggableSettings<S, E>> & {
    id?: DraggableId;
  });
  protected _parseSettings(options?: Partial<this['settings']>, defaults?: this['settings']): this['settings'];
  protected _emit<K extends keyof DraggableEventCallbacks<E>>(type: K, ...e: Parameters<DraggableEventCallbacks<E>[K]>): void;
  protected _onMove(e: E['start'] | E['move'], sensor: S[number]): void;
  protected _onScroll(): void;
  protected _onEnd(e: E['end'] | E['cancel'] | E['destroy'], sensor: S[number]): void;
  protected _prepareStart(): void;
  protected _applyStart(): void;
  protected _prepareMove(): void;
  protected _applyMove(): void;
  protected _prepareAlign(): void;
  protected _applyAlign(): void;
  _applyModifiers(phase: DraggableModifierPhase, changeX: number, changeY: number): void;
  on<T extends keyof DraggableEventCallbacks<E>>(type: T, listener: DraggableEventCallbacks<E>[T], listenerId?: EventListenerId): EventListenerId;
  off<T extends keyof DraggableEventCallbacks<E>>(type: T, listenerId: EventListenerId): void;
  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']): void;
  rejectStartPredicate(sensor: S[number]): void;
  stop(): void;
  align(instant?: boolean): void;
  getClientRect(): Readonly<Rect> | null;
  updateSettings(options?: Partial<this['settings']>): void;
  use<SS extends S, EE extends SS[number]['_events_type'], PP extends P>(plugin: (draggable: this) => Draggable<SS, EE, PP>): Draggable<SS, EE, PP>;
  destroy(): void;
}
//#endregion
export { Draggable, DraggableApplyPositionPhase, DraggableDefaultSettings, DraggableDrag, DraggableDragItem, DraggableEventCallbacks, DraggableEventType, DraggableId, DraggableModifier, DraggableModifierData, DraggableModifierPhase, DraggablePlugin, DraggablePluginMap, DraggableSensorProcessingMode, DraggableSettings };
//# sourceMappingURL=draggable-rDEVLiCd.d.ts.map