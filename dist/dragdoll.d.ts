import * as eventti from 'eventti';
import { EventListenerId, Emitter, Events } from 'eventti';
import * as tikki from 'tikki';
import { Phase, AutoTicker, FrameCallback } from 'tikki';

declare const SensorEventType: {
    readonly start: "start";
    readonly move: "move";
    readonly cancel: "cancel";
    readonly end: "end";
    readonly destroy: "destroy";
};
interface SensorStartEvent {
    type: typeof SensorEventType.start;
    x: number;
    y: number;
}
interface SensorMoveEvent {
    type: typeof SensorEventType.move;
    x: number;
    y: number;
}
interface SensorCancelEvent {
    type: typeof SensorEventType.cancel;
    x: number;
    y: number;
}
interface SensorEndEvent {
    type: typeof SensorEventType.end;
    x: number;
    y: number;
}
interface SensorDestroyEvent {
    type: typeof SensorEventType.destroy;
}
interface SensorEvents {
    start: SensorStartEvent;
    move: SensorMoveEvent;
    cancel: SensorCancelEvent;
    end: SensorEndEvent;
    destroy: SensorDestroyEvent;
}
interface Sensor<E extends SensorEvents = SensorEvents> {
    events: E;
    on<T extends keyof E>(type: T, listener: (eventData: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
    cancel(): void;
    destroy(): void;
}

interface BaseSensorDragData {
    readonly x: number;
    readonly y: number;
}
declare class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
    events: E;
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
interface Rect extends Dimensions {
    left: number;
    top: number;
}
interface RectExtended extends Rect {
    right: number;
    bottom: number;
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
    events: E;
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
    events: E;
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

type KeyboardSensorPredicate = (e: KeyboardEvent, sensor: KeyboardSensor, moveDistance: Point) => Point | null | undefined;
interface KeyboardSensorSettings {
    moveDistance: number | Point;
    startPredicate: KeyboardSensorPredicate;
    movePredicate: KeyboardSensorPredicate;
    cancelPredicate: KeyboardSensorPredicate;
    endPredicate: KeyboardSensorPredicate;
}
interface KeyboardSensorStartEvent extends SensorStartEvent {
    srcEvent: KeyboardEvent;
}
interface KeyboardSensorMoveEvent extends SensorMoveEvent {
    srcEvent: KeyboardEvent;
}
interface KeyboardSensorCancelEvent extends SensorCancelEvent {
    srcEvent: KeyboardEvent;
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
declare class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents> extends BaseSensor<E> implements Sensor<E> {
    events: E;
    protected _moveDistance: Point;
    protected _startPredicate: KeyboardSensorPredicate;
    protected _movePredicate: KeyboardSensorPredicate;
    protected _cancelPredicate: KeyboardSensorPredicate;
    protected _endPredicate: KeyboardSensorPredicate;
    constructor(options?: Partial<KeyboardSensorSettings>);
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: Partial<KeyboardSensorSettings>): void;
    destroy(): void;
}

interface KeyboardMotionSensorSettings<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> {
    startPredicate: (e: KeyboardEvent, sensor: KeyboardMotionSensor<E>) => Point | null | undefined;
    computeSpeed: (sensor: KeyboardMotionSensor<E>) => number;
    startKeys: string[];
    moveLeftKeys: string[];
    moveRightKeys: string[];
    moveUpKeys: string[];
    moveDownKeys: string[];
    cancelKeys: string[];
    endKeys: string[];
}
interface KeyboardMotionSensorEvents extends BaseMotionSensorEvents {
}
declare class KeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> extends BaseMotionSensor<E> implements Sensor<E> {
    events: E;
    protected _startPredicate: Exclude<KeyboardMotionSensorSettings<E>['startPredicate'], undefined>;
    protected _computeSpeed: Exclude<KeyboardMotionSensorSettings<E>['computeSpeed'], undefined>;
    protected _moveKeys: Set<string>;
    protected _moveKeyTimestamps: Map<string, number>;
    protected _startKeys: Set<string>;
    protected _moveLeftKeys: Set<string>;
    protected _moveRightKeys: Set<string>;
    protected _moveUpKeys: Set<string>;
    protected _moveDownKeys: Set<string>;
    protected _cancelKeys: Set<string>;
    protected _endKeys: Set<string>;
    constructor(options?: Partial<KeyboardMotionSensorSettings<E>>);
    protected _end(data: E['end']): void;
    protected _cancel(data: E['cancel']): void;
    protected _updateDirection(): void;
    protected _onTick(): void;
    protected _onKeyUp(e: KeyboardEvent): void;
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: Partial<KeyboardMotionSensorSettings<E>>): void;
    destroy(): void;
}

declare class DraggableDragItem<S extends Sensor[] = Sensor[], E extends S[number]['events'] = S[number]['events']> {
    data: {
        [key: string]: any;
    };
    readonly element: HTMLElement | SVGSVGElement;
    readonly elementContainer: HTMLElement;
    readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
    readonly dragContainer: HTMLElement;
    readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
    readonly initialTransform: string;
    readonly frozenProps: CSSProperties | null;
    readonly unfrozenProps: CSSProperties | null;
    readonly clientRect: Rect;
    readonly position: Point;
    readonly _updateDiff: Point;
    readonly _moveDiff: Point;
    readonly _containerDiff: Point;
    constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S, E>);
    updateSize(dimensions?: {
        width: number;
        height: number;
    }): void;
}

declare class DraggableDrag<S extends Sensor[], E extends S[number]['events']> {
    readonly sensor: S[number];
    readonly isEnded: boolean;
    readonly event: E['start'] | E['move'];
    readonly prevEvent: E['start'] | E['move'];
    readonly startEvent: E['start'] | E['move'];
    readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
    readonly items: DraggableDragItem[];
    constructor(sensor: S[number], startEvent: E['start'] | E['move']);
}

declare enum DraggableStartPredicateState {
    PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2
}
interface DraggableSettings<S extends Sensor[], E extends S[number]['events']> {
    container: HTMLElement | null;
    startPredicate: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        event: E['start'] | E['move'];
    }) => boolean | undefined;
    getElements: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        startEvent: E['start'] | E['move'];
    }) => (HTMLElement | SVGSVGElement)[] | null;
    releaseElements: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        elements: (HTMLElement | SVGSVGElement)[];
    }) => void;
    getFrozenProps: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        item: DraggableDragItem<S, E>;
        style: CSSStyleDeclaration;
    }) => CSSProperties | (keyof CSSProperties)[] | null;
    getStartPosition: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        item: DraggableDragItem<S, E>;
        style: CSSStyleDeclaration;
    }) => Point;
    setPosition: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        phase: 'start' | 'move' | 'end';
        item: DraggableDragItem<S, E>;
        x: number;
        y: number;
    }) => void;
    getPositionChange: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        item: DraggableDragItem<S, E>;
        event: E['start'] | E['move'];
        prevEvent: E['start'] | E['move'];
        startEvent: E['start'] | E['move'];
    }) => Point;
}
interface DraggablePlugin {
    name: string;
    version: string;
}
type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;
interface DraggableEventCallbacks<E extends SensorEvents> {
    preparestart(event: E['start'] | E['move']): void;
    start(event: E['start'] | E['move']): void;
    preparemove(event: E['move']): void;
    move(event: E['move']): void;
    end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
    destroy(): void;
}
declare class Draggable<S extends Sensor[] = Sensor[], E extends S[number]['events'] = S[number]['events'], P extends DraggablePluginMap = {}> {
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
    protected _startId: symbol;
    protected _moveId: symbol;
    protected _updateId: symbol;
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
    protected _preparePositionUpdate(): void;
    protected _applyPositionUpdate(): void;
    on<T extends keyof DraggableEventCallbacks<E>>(type: T, listener: DraggableEventCallbacks<E>[T], listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof DraggableEventCallbacks<E>>(type: T, listenerId: EventListenerId): void;
    resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']): void;
    rejectStartPredicate(sensor: S[number]): void;
    stop(): void;
    updatePosition(instant?: boolean): void;
    updateSettings(options?: Partial<this['settings']>): void;
    use<SS extends S, EE extends SS[number]['events'], PP extends P>(plugin: (draggable: this) => Draggable<SS, EE, PP>): Draggable<SS, EE, PP>;
    destroy(): void;
}

declare class Pool<T> {
    protected _data: T[];
    protected _createObject: () => T;
    protected _onPut: ((object: T) => void) | undefined;
    constructor(createObject: () => T, onPut?: (object: T) => void);
    pick(): T;
    put(object: T): void;
    reset(): void;
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
    readonly onPrepareScrollEffect?: AutoScrollItemEffectCallback | null;
    readonly onApplyScrollEffect?: AutoScrollItemEffectCallback | null;
}
interface AutoScrollSettings {
    overlapCheckInterval: number;
}
interface AutoScrollOptions extends Partial<AutoScrollSettings> {
}
interface AutoScrollEventCallbacks {
    beforescroll(): void;
    afterscroll(): void;
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
    protected _requestPool: Pool<AutoScrollRequest>;
    protected _actionPool: Pool<AutoScrollAction>;
    protected _emitter: Emitter<{
        beforescroll: () => void;
        afterscroll: () => void;
    }>;
    constructor(options?: AutoScrollOptions);
    protected _frameRead(time: number): void;
    protected _frameWrite(): void;
    protected _startTicking(): void;
    protected _stopTicking(): void;
    protected _getItemClientRect(item: AutoScrollItem, result?: RectExtended): RectExtended;
    protected _requestItemScroll(item: AutoScrollItem, axis: AutoScrollAxis, element: Window | Element, direction: AutoScrollDirection, threshold: number, distance: number, maxValue: number): void;
    protected _cancelItemScroll(item: AutoScrollItem, axis: AutoScrollAxis): void;
    protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean): void;
    protected _updateScrollRequest(scrollRequest: AutoScrollRequest): boolean;
    protected _updateItems(): void;
    protected _updateRequests(): void;
    protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis): void;
    protected _updateActions(): void;
    protected _applyActions(): void;
    on<T extends keyof AutoScrollEventCallbacks>(type: T, listener: AutoScrollEventCallbacks[T], listenerId?: EventListenerId): EventListenerId;
    off<T extends keyof AutoScrollEventCallbacks>(type: T, listenerId: EventListenerId): void;
    addItem(item: AutoScrollItem): void;
    removeItem(item: AutoScrollItem): void;
    isDestroyed(): boolean;
    isItemScrollingX(item: AutoScrollItem): boolean;
    isItemScrollingY(item: AutoScrollItem): boolean;
    isItemScrolling(item: AutoScrollItem): boolean;
    updateSettings(options?: AutoScrollOptions): void;
    destroy(): void;
}

declare class DraggableAutoScrollProxy<S extends Sensor[], E extends S[number]['events']> implements AutoScrollItem {
    protected _draggableAutoScroll: DraggableAutoScroll<S, E>;
    protected _draggable: Draggable<S, E>;
    protected _position: AutoScrollItem['position'];
    protected _clientRect: AutoScrollItem['clientRect'];
    constructor(draggableAutoScroll: DraggableAutoScroll<S, E>, draggable: Draggable<S, E>);
    private _getSettings;
    get targets(): AutoScrollItemTarget[];
    get position(): Point;
    get clientRect(): Rect;
    get inertAreaSize(): number;
    get smoothStop(): boolean;
    get speed(): number | AutoScrollItemSpeedCallback;
    get onStart(): AutoScrollItemEventCallback | null;
    get onStop(): AutoScrollItemEventCallback | null;
    onPrepareScrollEffect(): void;
    onApplyScrollEffect(): void;
}
interface DraggableAutoScrollSettings<S extends Sensor[], E extends S[number]['events']> {
    targets: AutoScrollItemTarget[] | ((draggable: Draggable<S, E>) => AutoScrollItemTarget[]);
    inertAreaSize: number;
    speed: number | AutoScrollItemSpeedCallback;
    smoothStop: boolean;
    getPosition: ((draggable: Draggable<S, E>) => Point) | null;
    getClientRect: ((draggable: Draggable<S, E>) => {
        left: number;
        top: number;
        width: number;
        height: number;
    }) | null;
    onStart: AutoScrollItemEventCallback | null;
    onStop: AutoScrollItemEventCallback | null;
}
type DraggableAutoScrollOptions<S extends Sensor[], E extends S[number]['events']> = Partial<DraggableAutoScrollSettings<S, E>>;
declare class DraggableAutoScroll<S extends Sensor[] = Sensor[], E extends S[number]['events'] = S[number]['events']> {
    readonly name: 'autoscroll';
    readonly version: string;
    readonly settings: DraggableAutoScrollSettings<S, E>;
    protected _autoScrollProxy: DraggableAutoScrollProxy<S, E> | null;
    constructor(draggable: Draggable<S, E>, options?: DraggableAutoScrollOptions<S, E>);
    protected _parseSettings(options?: Partial<this['settings']>, defaults?: this['settings']): this['settings'];
    updateSettings(options?: Partial<this['settings']>): void;
}
declare function autoScrollPlugin<S extends Sensor[], E extends S[number]['events'], P extends DraggablePluginMap>(options?: DraggableAutoScrollOptions<S, E>): (draggable: Draggable<S, E, P>) => Draggable<S, E, P> & {
    plugins: {
        autoscroll: DraggableAutoScroll<S, E>;
    };
};

declare const autoScroll: AutoScroll;

declare let tickerReadPhase: Phase;
declare let tickerWritePhase: Phase;
declare let ticker: AutoTicker<eventti.EventName, tikki.AutoTickerDefaultFrameCallback>;
declare function setTicker(newTicker: AutoTicker<Phase, FrameCallback>, readPhase: Phase, writePhase: Phase): void;

declare function createPointerSensorStartPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
    timeout?: number;
    fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];

declare function createSnapModifier(gridWidth: number, gridHeight: number): ({ startEvent, event, item, }: {
    startEvent: SensorStartEvent | SensorMoveEvent;
    event: SensorMoveEvent;
    item: DraggableDragItem;
}) => {
    x: number;
    y: number;
};

export { AUTO_SCROLL_AXIS, AUTO_SCROLL_AXIS_DIRECTION, AUTO_SCROLL_DIRECTION, AutoScroll, type AutoScrollEventCallbacks, type AutoScrollItem, type AutoScrollItemEffectCallback, type AutoScrollItemEventCallback, type AutoScrollItemSpeedCallback, type AutoScrollItemTarget, type AutoScrollOptions, type AutoScrollSettings, BaseMotionSensor, type BaseMotionSensorDragData, type BaseMotionSensorEvents, type BaseMotionSensorTickEvent, BaseSensor, type BaseSensorDragData, Draggable, DraggableAutoScroll, type DraggableAutoScrollOptions, type DraggableAutoScrollSettings, type DraggableEventCallbacks, type DraggablePlugin, type DraggablePluginMap, type DraggableSettings, KeyboardMotionSensor, type KeyboardMotionSensorEvents, type KeyboardMotionSensorSettings, KeyboardSensor, type KeyboardSensorCancelEvent, type KeyboardSensorDestroyEvent, type KeyboardSensorEndEvent, type KeyboardSensorEvents, type KeyboardSensorMoveEvent, type KeyboardSensorPredicate, type KeyboardSensorSettings, type KeyboardSensorStartEvent, PointerSensor, type PointerSensorCancelEvent, type PointerSensorDestroyEvent, type PointerSensorDragData, type PointerSensorEndEvent, type PointerSensorEvents, type PointerSensorMoveEvent, type PointerSensorSettings, type PointerSensorStartEvent, type Sensor, type SensorCancelEvent, type SensorDestroyEvent, type SensorEndEvent, SensorEventType, type SensorEvents, type SensorMoveEvent, type SensorStartEvent, autoScroll, autoScrollPlugin, autoScrollSmoothSpeed, createPointerSensorStartPredicate, createSnapModifier, setTicker, ticker, tickerReadPhase, tickerWritePhase };
