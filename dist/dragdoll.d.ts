import * as eventti from 'eventti';
import { EventListenerId, Emitter, Events } from 'eventti';
import * as tikki from 'tikki';
import { AutoTicker, Phase, FrameCallback } from 'tikki';

declare const SensorEventType: {
    readonly Start: "start";
    readonly Move: "move";
    readonly Cancel: "cancel";
    readonly End: "end";
    readonly Destroy: "destroy";
};
type SensorEventType = (typeof SensorEventType)[keyof typeof SensorEventType];
interface SensorStartEvent {
    type: typeof SensorEventType.Start;
    x: number;
    y: number;
}
interface SensorMoveEvent {
    type: typeof SensorEventType.Move;
    x: number;
    y: number;
}
interface SensorCancelEvent {
    type: typeof SensorEventType.Cancel;
    x: number;
    y: number;
}
interface SensorEndEvent {
    type: typeof SensorEventType.End;
    x: number;
    y: number;
}
interface SensorDestroyEvent {
    type: typeof SensorEventType.Destroy;
}
interface SensorEvents {
    start: SensorStartEvent;
    move: SensorMoveEvent;
    cancel: SensorCancelEvent;
    end: SensorEndEvent;
    destroy: SensorDestroyEvent;
}
declare abstract class Sensor<E extends SensorEvents = SensorEvents> {
    _events_type: E;
    abstract on<T extends keyof E>(type: T, listener: (eventData: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
    abstract off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
    abstract cancel(): void;
    abstract destroy(): void;
}

interface BaseSensorDragData {
    readonly x: number;
    readonly y: number;
}
declare class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
    _events_type: E;
    readonly drag: BaseSensorDragData | null;
    readonly isDestroyed: boolean;
    protected _emitter: Emitter<Events>;
    constructor();
    protected _createDragData(data: E['start']): BaseSensorDragData;
    protected _updateDragData(data: E['move'] | E['end'] | E['cancel']): void;
    protected _resetDragData(): void;
    protected _start(data: E['start']): void;
    protected _move(data: E['move']): void;
    protected _end(data: E['end']): void;
    protected _cancel(data: E['cancel']): void;
    on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
    cancel(): void;
    destroy(): void;
}

type ListenerOptions = {
    capture?: boolean;
    passive?: boolean;
};
type PointerType = 'mouse' | 'pen' | 'touch';
type Point = {
    x: number;
    y: number;
};
type Dimensions = {
    width: number;
    height: number;
};
interface Rect extends Point, Dimensions {
}
type CSSProperties = Partial<Omit<CSSStyleDeclaration, 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty' | 'length' | 'parentRule'>>;

interface BaseMotionSensorTickEvent {
    type: 'tick';
    time: number;
    deltaTime: number;
}
interface BaseMotionSensorEvents extends SensorEvents {
    tick: BaseMotionSensorTickEvent;
}
interface BaseMotionSensorDragData extends BaseSensorDragData {
    readonly time: number;
    readonly deltaTime: number;
}
declare class BaseMotionSensor<E extends BaseMotionSensorEvents = BaseMotionSensorEvents> extends BaseSensor<E> implements Sensor<E> {
    _events_type: E;
    readonly drag: BaseMotionSensorDragData | null;
    protected _direction: Point;
    protected _speed: number;
    constructor();
    protected _createDragData(data: E['start']): BaseMotionSensorDragData;
    protected _start(data: E['start']): void;
    protected _end(data: E['end']): void;
    protected _cancel(data: E['cancel']): void;
    protected _tick(time: number): void;
}

declare const SOURCE_EVENTS: {
    readonly pointer: {
        readonly start: "pointerdown";
        readonly move: "pointermove";
        readonly cancel: "pointercancel";
        readonly end: "pointerup";
    };
    readonly touch: {
        readonly start: "touchstart";
        readonly move: "touchmove";
        readonly cancel: "touchcancel";
        readonly end: "touchend";
    };
    readonly mouse: {
        readonly start: "mousedown";
        readonly move: "mousemove";
        readonly cancel: "";
        readonly end: "mouseup";
    };
};
type PointerSensorSourceEvent = PointerEvent | TouchEvent | MouseEvent;
type PointerSensorDragData = {
    readonly pointerId: number;
    readonly pointerType: PointerType;
    readonly x: number;
    readonly y: number;
};
interface PointerSensorSettings {
    listenerOptions: ListenerOptions;
    sourceEvents: keyof typeof SOURCE_EVENTS | 'auto';
    startPredicate: (e: PointerSensorSourceEvent) => boolean;
}
interface PointerSensorStartEvent extends SensorStartEvent {
    pointerId: number;
    pointerType: PointerType;
    srcEvent: PointerSensorSourceEvent;
    target: EventTarget | null;
}
interface PointerSensorMoveEvent extends SensorMoveEvent {
    pointerId: number;
    pointerType: PointerType;
    srcEvent: PointerSensorSourceEvent;
    target: EventTarget | null;
}
interface PointerSensorCancelEvent extends SensorCancelEvent {
    pointerId: number;
    pointerType: PointerType;
    srcEvent: PointerSensorSourceEvent | null;
    target: EventTarget | null;
}
interface PointerSensorEndEvent extends SensorEndEvent {
    pointerId: number;
    pointerType: PointerType;
    srcEvent: PointerSensorSourceEvent | null;
    target: EventTarget | null;
}
interface PointerSensorDestroyEvent extends SensorDestroyEvent {
}
interface PointerSensorEvents {
    start: PointerSensorStartEvent;
    move: PointerSensorMoveEvent;
    cancel: PointerSensorCancelEvent;
    end: PointerSensorEndEvent;
    destroy: PointerSensorDestroyEvent;
}
declare class PointerSensor<E extends PointerSensorEvents = PointerSensorEvents> implements Sensor<E> {
    _events_type: E;
    readonly element: Element | Window;
    readonly drag: PointerSensorDragData | null;
    readonly isDestroyed: boolean;
    protected _startPredicate: (e: PointerSensorSourceEvent) => boolean;
    protected _listenerOptions: ListenerOptions;
    protected _sourceEvents: keyof typeof SOURCE_EVENTS;
    protected _areWindowListenersBound: boolean;
    protected _emitter: Emitter<Events>;
    constructor(element: Element | Window, options?: Partial<PointerSensorSettings>);
    protected _getTrackedPointerEventData(e: PointerSensorSourceEvent): PointerEvent | MouseEvent | Touch | null;
    protected _onStart(e: PointerSensorSourceEvent): void;
    protected _onMove(e: PointerSensorSourceEvent): void;
    protected _onCancel(e: PointerEvent | TouchEvent): void;
    protected _onEnd(e: PointerSensorSourceEvent): void;
    protected _bindWindowListeners(): void;
    protected _unbindWindowListeners(): void;
    protected _resetDrag(): void;
    cancel(): void;
    updateSettings(options: Partial<PointerSensorSettings>): void;
    on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
    destroy(): void;
}

type KeyboardSensorPredicate<E extends KeyboardSensorEvents = KeyboardSensorEvents> = (e: KeyboardEvent, sensor: KeyboardSensor<E>) => Point | null | undefined;
interface KeyboardSensorSettings<E extends KeyboardSensorEvents = KeyboardSensorEvents> {
    moveDistance: number | Point;
    cancelOnBlur: boolean;
    cancelOnVisibilityChange: boolean;
    startPredicate: KeyboardSensorPredicate<E>;
    movePredicate: KeyboardSensorPredicate<E>;
    cancelPredicate: KeyboardSensorPredicate<E>;
    endPredicate: KeyboardSensorPredicate<E>;
}
interface KeyboardSensorStartEvent extends SensorStartEvent {
    srcEvent: KeyboardEvent;
}
interface KeyboardSensorMoveEvent extends SensorMoveEvent {
    srcEvent: KeyboardEvent;
}
interface KeyboardSensorCancelEvent extends SensorCancelEvent {
    srcEvent?: KeyboardEvent;
}
interface KeyboardSensorEndEvent extends SensorEndEvent {
    srcEvent: KeyboardEvent;
}
interface KeyboardSensorDestroyEvent extends SensorDestroyEvent {
}
interface KeyboardSensorEvents {
    start: KeyboardSensorStartEvent;
    move: KeyboardSensorMoveEvent;
    cancel: KeyboardSensorCancelEvent;
    end: KeyboardSensorEndEvent;
    destroy: KeyboardSensorDestroyEvent;
}
declare const keyboardSensorDefaults: KeyboardSensorSettings<any>;
declare class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents> extends BaseSensor<E> implements Sensor<E> {
    _events_type: E;
    readonly element: Element | null;
    readonly moveDistance: Point;
    protected _cancelOnBlur: boolean;
    protected _cancelOnVisibilityChange: boolean;
    protected _startPredicate: KeyboardSensorPredicate<E>;
    protected _movePredicate: KeyboardSensorPredicate<E>;
    protected _cancelPredicate: KeyboardSensorPredicate<E>;
    protected _endPredicate: KeyboardSensorPredicate<E>;
    constructor(element: Element | null, options?: Partial<KeyboardSensorSettings<E>>);
    protected _internalCancel(): void;
    protected _blurCancelHandler(): void;
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: Partial<KeyboardSensorSettings<E>>): void;
    destroy(): void;
}

interface KeyboardMotionSensorSettings<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> {
    startKeys: string[];
    moveLeftKeys: string[];
    moveRightKeys: string[];
    moveUpKeys: string[];
    moveDownKeys: string[];
    cancelKeys: string[];
    endKeys: string[];
    cancelOnBlur: boolean;
    cancelOnVisibilityChange: boolean;
    computeSpeed: (sensor: KeyboardMotionSensor<E>) => number;
    startPredicate: (e: KeyboardEvent, sensor: KeyboardMotionSensor<E>) => Point | null | undefined;
}
interface KeyboardMotionSensorEvents extends BaseMotionSensorEvents {
}
declare const keyboardMotionSensorDefaults: KeyboardMotionSensorSettings<any>;
declare class KeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> extends BaseMotionSensor<E> implements Sensor<E> {
    _events_type: E;
    readonly element: Element | null;
    protected _moveKeys: Set<string>;
    protected _moveKeyTimestamps: Map<string, number>;
    protected _startKeys: Set<string>;
    protected _moveLeftKeys: Set<string>;
    protected _moveRightKeys: Set<string>;
    protected _moveUpKeys: Set<string>;
    protected _moveDownKeys: Set<string>;
    protected _cancelKeys: Set<string>;
    protected _endKeys: Set<string>;
    protected _cancelOnBlur: boolean;
    protected _cancelOnVisibilityChange: boolean;
    protected _computeSpeed: Exclude<KeyboardMotionSensorSettings<E>['computeSpeed'], undefined>;
    protected _startPredicate: Exclude<KeyboardMotionSensorSettings<E>['startPredicate'], undefined>;
    constructor(element: Element | null, options?: Partial<KeyboardMotionSensorSettings<E>>);
    protected _end(data: E['end']): void;
    protected _cancel(data: E['cancel']): void;
    protected _internalCancel(): void;
    protected _blurCancelHandler(): void;
    protected _updateDirection(): void;
    protected _onTick(): void;
    protected _onKeyUp(e: KeyboardEvent): void;
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: Partial<KeyboardMotionSensorSettings<E>>): void;
    destroy(): void;
}

declare class ObjectCache<Key extends any, Value extends any> {
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

declare enum DragStartPhase {
    None = 0,
    Init = 1,
    Prepare = 2,
    FinishPrepare = 3,
    Apply = 4,
    FinishApply = 5
}
declare enum DraggableStartPredicateState {
    Pending = 0,
    Resolved = 1,
    Rejected = 2
}
declare const DraggableModifierPhase: {
    readonly Start: "start";
    readonly Move: "move";
    readonly End: "end";
};
type DraggableModifierPhase = (typeof DraggableModifierPhase)[keyof typeof DraggableModifierPhase];
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
    readonly id: Symbol;
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
    protected _emitter: Emitter<{
        [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
    }>;
    protected _startPhase: DragStartPhase;
    protected _startId: symbol;
    protected _moveId: symbol;
    protected _alignId: symbol;
    constructor(sensors: S, options?: Partial<DraggableSettings<S, E>>);
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

declare function createTouchDelayPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
    touchDelay?: number;
    fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];

declare function createSnapModifier<S extends Sensor[], E extends S[number]['_events_type']>(cellWidth: number, cellHeight: number): DraggableModifier<S, E>;

declare function createContainmentModifier<S extends Sensor[], E extends S[number]['_events_type']>(getContainerRect: (data: DraggableModifierData<S, E>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S, E>) => boolean)): DraggableModifier<S, E>;

declare class ClassicObjectPool<Item extends NonNullable<any>, ItemArgs extends any[] = []> {
    protected _batchSize: number;
    protected _maxSize: number;
    protected _minSize: number;
    protected _shrinkThreshold: number;
    protected _data: Item[];
    protected _index: number;
    protected _getItem: (item?: Item, ...args: ItemArgs) => Item;
    protected _onRelease: ((item: Item) => void) | undefined;
    constructor(getItem: (item?: Item, ...args: ItemArgs) => Item, { batchSize, minBatchCount, maxBatchCount, initialBatchCount, shrinkThreshold, onRelease, }?: {
        batchSize?: number;
        minBatchCount?: number;
        maxBatchCount?: number;
        initialBatchCount?: number;
        shrinkThreshold?: number;
        onRelease?: (object: Item) => void;
    });
    get(...args: ItemArgs): Item;
    release(object: Item): void;
    destroy(): void;
}

declare const AUTO_SCROLL_AXIS: {
    readonly x: 1;
    readonly y: 2;
};
declare const AUTO_SCROLL_AXIS_DIRECTION: {
    readonly forward: 4;
    readonly reverse: 8;
};
declare const AUTO_SCROLL_DIRECTION_X: {
    readonly none: 0;
    readonly left: 9;
    readonly right: 5;
};
declare const AUTO_SCROLL_DIRECTION_Y: {
    readonly none: 0;
    readonly up: 10;
    readonly down: 6;
};
declare const AUTO_SCROLL_DIRECTION: {
    readonly none: 0;
    readonly up: 10;
    readonly down: 6;
    readonly left: 9;
    readonly right: 5;
};
declare function getDirectionAsString(direction: number): "none" | "left" | "right" | "up" | "down";
type AutoScrollAxis = (typeof AUTO_SCROLL_AXIS)[keyof typeof AUTO_SCROLL_AXIS];
type AutoScrollDirectionX = (typeof AUTO_SCROLL_DIRECTION_X)[keyof typeof AUTO_SCROLL_DIRECTION_X];
type AutoScrollDirectionY = (typeof AUTO_SCROLL_DIRECTION_Y)[keyof typeof AUTO_SCROLL_DIRECTION_Y];
type AutoScrollDirection = (typeof AUTO_SCROLL_DIRECTION)[keyof typeof AUTO_SCROLL_DIRECTION];
interface AutoScrollSpeedData {
    direction: ReturnType<typeof getDirectionAsString>;
    threshold: number;
    distance: number;
    value: number;
    maxValue: number;
    duration: number;
    speed: number;
    deltaTime: number;
    isEnding: boolean;
}
type AutoScrollTargetPadding = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
};
interface AutoScrollItem {
    readonly targets: AutoScrollItemTarget[];
    readonly clientRect: Rect;
    readonly position: Point;
    readonly inertAreaSize: number;
    readonly smoothStop: boolean;
    readonly speed: number | AutoScrollItemSpeedCallback;
    readonly onStart?: AutoScrollItemEventCallback | null;
    readonly onStop?: AutoScrollItemEventCallback | null;
}
interface AutoScrollSettings {
    overlapCheckInterval: number;
}
interface AutoScrollOptions extends Partial<AutoScrollSettings> {
}
interface AutoScrollItemTarget {
    element: Window | Element;
    axis?: 'x' | 'y' | 'xy';
    priority?: number;
    threshold?: number;
    padding?: AutoScrollTargetPadding;
    scrollPadding?: AutoScrollTargetPadding;
}
type AutoScrollItemEventCallback = (scrollElement: Window | Element, scrollDirection: ReturnType<typeof getDirectionAsString>) => void;
type AutoScrollItemEffectCallback = () => void;
type AutoScrollItemSpeedCallback = (scrollElement: Window | Element, scrollData: AutoScrollSpeedData) => number;
declare class AutoScrollItemData {
    positionX: number;
    positionY: number;
    directionX: AutoScrollDirectionX;
    directionY: AutoScrollDirectionY;
    overlapCheckRequestTime: number;
    constructor();
}
declare class AutoScrollAction {
    element: Element | Window | null;
    requestX: AutoScrollRequest | null;
    requestY: AutoScrollRequest | null;
    scrollLeft: number;
    scrollTop: number;
    constructor();
    reset(): void;
    addRequest(request: AutoScrollRequest): void;
    removeRequest(request: AutoScrollRequest): void;
    computeScrollValues(): void;
    scroll(): void;
}
declare class AutoScrollRequest {
    item: AutoScrollItem | null;
    element: Element | Window | null;
    isActive: boolean;
    isEnding: boolean;
    direction: AutoScrollDirection;
    value: number;
    maxValue: number;
    threshold: number;
    distance: number;
    deltaTime: number;
    speed: number;
    duration: number;
    action: AutoScrollAction | null;
    constructor();
    reset(): void;
    hasReachedEnd(): boolean;
    computeCurrentScrollValue(): number;
    computeNextScrollValue(): number;
    computeSpeed(): number;
    tick(deltaTime: number): number;
    onStart(): void;
    onStop(): void;
}
declare function autoScrollSmoothSpeed(maxSpeed?: number, accelerationFactor?: number, decelerationFactor?: number): AutoScrollItemSpeedCallback;
declare class AutoScroll {
    readonly items: AutoScrollItem[];
    readonly settings: AutoScrollSettings;
    protected _isDestroyed: boolean;
    protected _isTicking: boolean;
    protected _tickTime: number;
    protected _tickDeltaTime: number;
    protected _itemData: Map<AutoScrollItem, AutoScrollItemData>;
    protected _actions: AutoScrollAction[];
    protected _requests: {
        [AUTO_SCROLL_AXIS.x]: Map<AutoScrollItem, AutoScrollRequest>;
        [AUTO_SCROLL_AXIS.y]: Map<AutoScrollItem, AutoScrollRequest>;
    };
    protected _requestPool: ClassicObjectPool<AutoScrollRequest>;
    protected _actionPool: ClassicObjectPool<AutoScrollAction>;
    constructor(options?: AutoScrollOptions);
    protected _frameRead(time: number): void;
    protected _frameWrite(): void;
    protected _startTicking(): void;
    protected _stopTicking(): void;
    protected _requestItemScroll(item: AutoScrollItem, axis: AutoScrollAxis, element: Window | Element, direction: AutoScrollDirection, threshold: number, distance: number, maxValue: number): void;
    protected _cancelItemScroll(item: AutoScrollItem, axis: AutoScrollAxis): void;
    protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean): void;
    protected _updateScrollRequest(scrollRequest: AutoScrollRequest): boolean;
    protected _updateItems(): void;
    protected _updateRequests(): void;
    protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis): void;
    protected _updateActions(): void;
    protected _applyActions(): void;
    addItem(item: AutoScrollItem): void;
    removeItem(item: AutoScrollItem): void;
    isDestroyed(): boolean;
    isItemScrollingX(item: AutoScrollItem): boolean;
    isItemScrollingY(item: AutoScrollItem): boolean;
    isItemScrolling(item: AutoScrollItem): boolean;
    updateSettings(options?: AutoScrollOptions): void;
    destroy(): void;
}

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

type DroppableAcceptId = string | number | symbol;
declare const DroppableEventType: {
    readonly Destroy: "destroy";
};
type DroppableEventType = (typeof DroppableEventType)[keyof typeof DroppableEventType];
interface DroppableEventCallbacks {
    [DroppableEventType.Destroy]: () => void;
}
interface DroppableOptions {
    accept?: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
    data?: {
        [key: string]: any;
    };
}
declare const defaultDroppableOptions: Required<DroppableOptions>;
declare class Droppable {
    readonly id: Symbol;
    readonly element: HTMLElement | SVGSVGElement;
    accept: DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
    data: {
        [key: string]: any;
    };
    readonly isDestroyed: boolean;
    protected _clientRect: Rect;
    protected _emitter: Emitter<{
        [K in keyof DroppableEventCallbacks]: DroppableEventCallbacks[K];
    }>;
    constructor(element: HTMLElement | SVGSVGElement, options?: DroppableOptions);
    on<T extends keyof DroppableEventCallbacks>(type: T, listener: DroppableEventCallbacks[T], listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof DroppableEventCallbacks>(type: T, listenerId: EventListenerId): void;
    getClientRect(): Readonly<Rect>;
    updateClientRect(rect?: Rect): void;
    destroy(): void;
}

declare class FastObjectPool<Item extends NonNullable<any>, ItemArgs extends any[]> {
    protected _items: Item[];
    protected _index: number;
    protected _getItem: (item?: Item, ...args: ItemArgs) => Item;
    constructor(getItem: (item?: Item, ...args: ItemArgs) => Item);
    get(...args: ItemArgs): Item;
    resetPointer(): void;
    resetItems(maxLength?: number): void;
}

interface CollisionData {
    droppableId: Symbol;
    droppableRect: Rect;
    draggableRect: Rect;
    intersectionRect: Rect;
    intersectionScore: number;
}
interface CollisionDetectorOptions<T extends CollisionData = CollisionData> {
    getCollisionData?: (draggable: Draggable<any>, droppable: Droppable) => T | null;
    sortCollisions?: (draggable: Draggable<any>, collisions: T[]) => T[];
    mergeCollisionData?: (target: T, source: T) => T;
    createCollisionData?: (source: T) => T;
}
declare const CollisionDetectorDefaultOptions: {
    readonly getCollisionData: <T extends CollisionData = CollisionData>(draggable: Draggable<any>, droppable: Droppable, result?: T) => T | null;
    readonly mergeCollisionData: <T extends CollisionData = CollisionData>(target: T, source: T) => T;
    readonly createCollisionData: <T extends CollisionData = CollisionData>(source: T) => T;
    readonly sortCollisions: <T extends CollisionData = CollisionData>(_draggable: Draggable<any>, collisions: T[]) => T[];
};
declare class CollisionDetector<T extends CollisionData = CollisionData> {
    protected _listenerId: Symbol;
    protected _dndContext: DndContext<T>;
    protected _collisionDataPool: FastObjectPool<T, [T]>;
    getCollisionData: (draggable: Draggable<any>, droppable: Droppable) => T | null;
    createCollisionData: (source: T) => T;
    mergeCollisionData: (target: T, source: T) => T;
    sortCollisions: (draggable: Draggable<any>, collisions: T[]) => T[];
    constructor(dndContext: DndContext<T>, { getCollisionData, sortCollisions, mergeCollisionData, createCollisionData, }?: CollisionDetectorOptions<T>);
    protected _onRemoveDroppable(_e: Parameters<DndContextEventCallbacks<T>[typeof DndContextEventType.RemoveDroppable]>[0]): void;
    detectCollisions(draggable: Draggable<any>, targets: Set<Droppable>, collisionMap: Map<Droppable, T>): void;
    destroy(): void;
}

declare const DndContextEventType: {
    readonly Start: "start";
    readonly Move: "move";
    readonly Enter: "enter";
    readonly Leave: "leave";
    readonly Over: "over";
    readonly Drop: "drop";
    readonly End: "end";
    readonly Cancel: "cancel";
    readonly AddDraggable: "addDraggable";
    readonly RemoveDraggable: "removeDraggable";
    readonly AddDroppable: "addDroppable";
    readonly RemoveDroppable: "removeDroppable";
    readonly Destroy: "destroy";
};
type DndContextEventType = (typeof DndContextEventType)[keyof typeof DndContextEventType];
interface DndContextEventCallbacks<T extends CollisionData = CollisionData> {
    [DndContextEventType.Start]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Move]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Enter]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
        collisions: ReadonlyMap<Droppable, T>;
        addedCollisions: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Leave]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
        collisions: ReadonlyMap<Droppable, T>;
        removedCollisions: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Over]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
        collisions: ReadonlyMap<Droppable, T>;
        persistedCollisions: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Drop]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
        collisions: ReadonlyMap<Droppable, T>;
    }) => void;
    [DndContextEventType.End]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.Cancel]: (data: {
        draggable: Draggable<any>;
        targets: ReadonlySet<Droppable>;
    }) => void;
    [DndContextEventType.AddDraggable]: (data: {
        draggable: Draggable<any>;
    }) => void;
    [DndContextEventType.RemoveDraggable]: (data: {
        draggable: Draggable<any>;
    }) => void;
    [DndContextEventType.AddDroppable]: (data: {
        droppable: Droppable;
    }) => void;
    [DndContextEventType.RemoveDroppable]: (data: {
        droppable: Droppable;
    }) => void;
    [DndContextEventType.Destroy]: () => void;
}
interface DndContextOptions<T extends CollisionData = CollisionData> {
    collisionDetector?: CollisionDetectorOptions<T> | ((dndContext: DndContext<T>) => CollisionDetector<T>);
}
type DndContextCollisionDetection<T extends CollisionData = CollisionData> = (draggable: Draggable<any>, targetDroppables: Set<Droppable>) => Map<Droppable, T>;
declare class DndContext<T extends CollisionData = CollisionData> {
    readonly draggables: ReadonlySet<Draggable<any>>;
    readonly droppables: ReadonlyMap<Symbol, Droppable>;
    protected _listenerId: Symbol;
    protected _scrollTickerId: Symbol;
    protected _dragData: Map<Draggable<any>, {
        targets: Set<Droppable> | null;
        collisions: Map<Droppable, T>;
        prevCollisions: Map<Droppable, T>;
        data: {
            [key: string]: any;
        };
    }>;
    protected _collisionDetector: CollisionDetector<T>;
    protected _isCheckingCollisions: boolean;
    protected _removedCollisions: Set<Droppable>;
    protected _addedCollisions: Set<Droppable>;
    protected _persistedCollisions: Set<Droppable>;
    protected _emitter: Emitter<{
        [K in keyof DndContextEventCallbacks<T>]: DndContextEventCallbacks<T>[K];
    }>;
    constructor(options?: DndContextOptions<T>);
    protected _getTargets(draggable: Draggable<any>): Set<Droppable>;
    protected _onDragPrepareStart(draggable: Draggable<any>): void;
    protected _onDragStart(draggable: Draggable<any>): void;
    protected _onDragMove(draggable: Draggable<any>): void;
    protected _onDragEnd(draggable: Draggable<any>): void;
    protected _onDragCancel(draggable: Draggable<any>): void;
    protected _onDragDestroy(draggable: Draggable<any>): void;
    protected _onScroll: () => void;
    on<K extends keyof DndContextEventCallbacks<T>>(type: K, listener: DndContextEventCallbacks<T>[K], listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof DndContextEventCallbacks<T>>(type: K, listenerId: EventListenerId): void;
    isMatch(draggable: Draggable<any>, droppable: Droppable): boolean;
    getData(draggable: Draggable<any>): {
        [key: string]: any;
    } | null;
    clearTargets(draggable: Draggable<any>): void;
    updateDroppableClientRects(): void;
    detectCollisions(draggable: Draggable<any>): void;
    addDraggable(draggable: Draggable<any>): void;
    removeDraggable(draggable: Draggable<any>): void;
    addDroppable(droppable: Droppable): void;
    removeDroppable(droppable: Droppable): void;
    destroy(): void;
}

interface CollisionDataExtended extends CollisionData {
}
declare class VisibleRectCollisionDetector<T extends CollisionDataExtended = CollisionDataExtended> extends CollisionDetector<T> {
    constructor(dndContext: DndContext<T>);
}

declare const autoScroll: AutoScroll;

declare const tickerPhases: {
    read: symbol;
    write: symbol;
};
declare let ticker: AutoTicker<eventti.EventName, tikki.AutoTickerDefaultFrameCallback>;
declare function setTicker(newTicker: AutoTicker<Phase, FrameCallback>, phases: typeof tickerPhases): void;

export { AUTO_SCROLL_AXIS, AUTO_SCROLL_AXIS_DIRECTION, AUTO_SCROLL_DIRECTION, AutoScroll, type AutoScrollItem, type AutoScrollItemEffectCallback, type AutoScrollItemEventCallback, type AutoScrollItemSpeedCallback, type AutoScrollItemTarget, type AutoScrollOptions, type AutoScrollSettings, BaseMotionSensor, type BaseMotionSensorDragData, type BaseMotionSensorEvents, type BaseMotionSensorTickEvent, BaseSensor, type BaseSensorDragData, type CollisionData, type CollisionDataExtended, CollisionDetector, CollisionDetectorDefaultOptions, type CollisionDetectorOptions, DndContext, type DndContextCollisionDetection, type DndContextEventCallbacks, DndContextEventType, type DndContextOptions, Draggable, DraggableApplyPositionPhase, DraggableAutoScroll, type DraggableAutoScrollOptions, type DraggableAutoScrollSettings, DraggableDefaultSettings, type DraggableEventCallbacks, DraggableEventType, type DraggableModifier, type DraggableModifierData, DraggableModifierPhase, type DraggablePlugin, type DraggablePluginMap, type DraggableSettings, Droppable, type DroppableAcceptId, type DroppableEventCallbacks, DroppableEventType, type DroppableOptions, KeyboardMotionSensor, type KeyboardMotionSensorEvents, type KeyboardMotionSensorSettings, KeyboardSensor, type KeyboardSensorCancelEvent, type KeyboardSensorDestroyEvent, type KeyboardSensorEndEvent, type KeyboardSensorEvents, type KeyboardSensorMoveEvent, type KeyboardSensorPredicate, type KeyboardSensorSettings, type KeyboardSensorStartEvent, PointerSensor, type PointerSensorCancelEvent, type PointerSensorDestroyEvent, type PointerSensorDragData, type PointerSensorEndEvent, type PointerSensorEvents, type PointerSensorMoveEvent, type PointerSensorSettings, type PointerSensorStartEvent, Sensor, type SensorCancelEvent, type SensorDestroyEvent, type SensorEndEvent, SensorEventType, type SensorEvents, type SensorMoveEvent, type SensorStartEvent, VisibleRectCollisionDetector, autoScroll, autoScrollPlugin, autoScrollSmoothSpeed, createContainmentModifier, createSnapModifier, createTouchDelayPredicate, defaultDroppableOptions, keyboardMotionSensorDefaults, keyboardSensorDefaults, setTicker, ticker, tickerPhases };
