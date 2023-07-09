import { Emitter, Events, EventListenerId, EventName } from 'eventti';
import * as tikki from 'tikki';
import { Ticker, FrameCallback } from 'tikki';

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
    on<K extends keyof E>(eventName: K, listener: (eventData: E[K]) => void): void;
    off<K extends keyof E>(eventName: K, listener: (eventData: E[K]) => void): void;
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
    on<K extends keyof E>(eventName: K, listener: (e: E[K]) => void, listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof E>(eventName: K, listener: ((e: E[K]) => void) | EventListenerId): void;
    cancel(): void;
    destroy(): void;
}

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
    protected _direction: {
        x: number;
        y: number;
    };
    protected _speed: number;
    constructor();
    protected _createDragData(data: E['start']): BaseMotionSensorDragData;
    protected _start(data: E['start']): void;
    protected _end(data: E['end']): void;
    protected _cancel(data: E['cancel']): void;
    protected _tick(time: number): void;
}

type ListenerOptions = {
    capture?: boolean;
    passive?: boolean;
};
type PointerType = 'mouse' | 'pen' | 'touch';
interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}
interface RectExtended extends Rect {
    right: number;
    bottom: number;
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
    readonly element: HTMLElement | Window;
    readonly drag: PointerSensorDragData | null;
    readonly isDestroyed: boolean;
    protected _startPredicate: (e: PointerSensorSourceEvent) => boolean;
    protected _listenerOptions: ListenerOptions;
    protected _sourceEvents: keyof typeof SOURCE_EVENTS;
    protected _areWindowListenersBound: boolean;
    protected _emitter: Emitter<Events>;
    constructor(element: HTMLElement | Window, options?: Partial<PointerSensorSettings>);
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
    on<K extends keyof E>(eventName: K, listener: (e: E[K]) => void, listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof E>(eventName: K, listener: ((e: E[K]) => void) | EventListenerId): void;
    destroy(): void;
}

type KeyboardSensorPredicate = (e: KeyboardEvent, sensor: KeyboardSensor, moveDistance: number) => {
    x: number;
    y: number;
} | null | undefined;
interface KeyboardSensorSettings {
    moveDistance: number;
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
    protected _moveDistance: number;
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
    startPredicate: (e: KeyboardEvent, sensor: KeyboardMotionSensor<E>) => {
        x: number;
        y: number;
    } | null | undefined;
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

declare enum DraggableStartPredicateState {
    PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2
}
declare class DraggableDragItem {
    readonly element: HTMLElement;
    readonly rootParent: HTMLElement;
    readonly rootContainingBlock: HTMLElement | Document;
    readonly dragParent: HTMLElement;
    readonly dragContainingBlock: HTMLElement | Document;
    readonly x: number;
    readonly y: number;
    readonly pX: number;
    readonly pY: number;
    readonly _updateDiffX: number;
    readonly _updateDiffY: number;
    readonly _moveDiffX: number;
    readonly _moveDiffY: number;
    readonly _containerDiffX: number;
    readonly _containerDiffY: number;
    readonly _transform: string;
    constructor(element: HTMLElement, rootParent: HTMLElement, rootContainingBlock: HTMLElement | Document, dragParent: HTMLElement, dragContainingBlock: HTMLElement | Document);
}
declare class DraggableDrag<S extends Sensor[], E extends S[number]['events']> {
    readonly sensor: S[number] | null;
    readonly isStarted: boolean;
    readonly isEnded: boolean;
    readonly startEvent: E['start'] | E['move'] | null;
    readonly nextMoveEvent: E['move'] | null;
    readonly prevMoveEvent: E['move'] | null;
    readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
    readonly items: DraggableDragItem[];
    constructor();
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
    }) => HTMLElement[] | null;
    releaseElements: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        elements: HTMLElement[];
    }) => void;
    getStartPosition: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        item: DraggableDragItem;
    }) => {
        x: number;
        y: number;
    };
    setPosition: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        phase: 'start' | 'move' | 'end';
        item: DraggableDragItem;
        x: number;
        y: number;
    }) => void;
    getPositionChange: (data: {
        draggable: Draggable<S, E>;
        sensor: S[number];
        item: DraggableDragItem;
        event: E['move'];
        prevEvent: E['start'] | E['move'];
        startEvent: E['start'] | E['move'];
    }) => {
        x: number;
        y: number;
    };
}
interface DraggablePlugin {
    name: string;
    version: string;
}
type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;
interface DraggableEventCallbacks<E extends SensorEvents> {
    beforestart(event: E['start'] | E['move']): void;
    start(event: E['start'] | E['move']): void;
    beforemove(event: E['move']): void;
    move(event: E['move']): void;
    beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
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
    on<K extends keyof DraggableEventCallbacks<E>>(eventName: K, listener: DraggableEventCallbacks<E>[K], listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof DraggableEventCallbacks<E>>(eventName: K, listener: DraggableEventCallbacks<E>[K] | EventListenerId): void;
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
    readonly position: {
        x: number;
        y: number;
    };
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
    element: Window | HTMLElement;
    axis?: 'x' | 'y' | 'xy';
    priority?: number;
    threshold?: number;
    padding?: AutoScrollTargetPadding;
    scrollPadding?: AutoScrollTargetPadding;
}
type AutoScrollItemEventCallback = (scrollElement: Window | HTMLElement, scrollDirection: ReturnType<typeof getDirectionAsString>) => void;
type AutoScrollItemEffectCallback = () => void;
type AutoScrollItemSpeedCallback = (scrollElement: Window | HTMLElement, scrollData: AutoScrollSpeedData) => number;
declare class AutoScrollItemData {
    positionX: number;
    positionY: number;
    directionX: AutoScrollDirectionX;
    directionY: AutoScrollDirectionY;
    overlapCheckRequestTime: number;
    constructor();
}
declare class AutoScrollAction {
    element: HTMLElement | Window | null;
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
    element: HTMLElement | Window | null;
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
    protected _requestItemScroll(item: AutoScrollItem, axis: AutoScrollAxis, element: Window | HTMLElement, direction: AutoScrollDirection, threshold: number, distance: number, maxValue: number): void;
    protected _cancelItemScroll(item: AutoScrollItem, axis: AutoScrollAxis): void;
    protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean): void;
    protected _updateScrollRequest(scrollRequest: AutoScrollRequest): boolean;
    protected _updateItems(): void;
    protected _updateRequests(): void;
    protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis): void;
    protected _updateActions(): void;
    protected _applyActions(): void;
    on<T extends keyof AutoScrollEventCallbacks>(eventName: T, listener: AutoScrollEventCallbacks[T]): EventListenerId;
    off<T extends keyof AutoScrollEventCallbacks>(eventName: T, listener: AutoScrollEventCallbacks[T] | EventListenerId): void;
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
    get position(): {
        x: number;
        y: number;
    };
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
    getPosition: ((draggable: Draggable<S, E>) => {
        x: number;
        y: number;
    }) | null;
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

declare let tickerReadPhase: EventName;
declare let tickerWritePhase: EventName;
declare let ticker: Ticker<EventName, tikki.DefaultFrameCallback>;
declare function setTicker(newTicker: Ticker<EventName, FrameCallback>, readPhase: EventName, writePhase: EventName): void;

declare function createPointerSensorStartPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
    timeout?: number;
    fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];

export { AUTO_SCROLL_AXIS, AUTO_SCROLL_AXIS_DIRECTION, AUTO_SCROLL_DIRECTION, AutoScroll, AutoScrollEventCallbacks, AutoScrollItem, AutoScrollItemEffectCallback, AutoScrollItemEventCallback, AutoScrollItemSpeedCallback, AutoScrollItemTarget, AutoScrollOptions, AutoScrollSettings, BaseMotionSensor, BaseMotionSensorDragData, BaseMotionSensorEvents, BaseMotionSensorTickEvent, BaseSensor, BaseSensorDragData, Draggable, DraggableAutoScroll, DraggableAutoScrollOptions, DraggableAutoScrollSettings, DraggableEventCallbacks, DraggablePlugin, DraggablePluginMap, DraggableSettings, KeyboardMotionSensor, KeyboardMotionSensorEvents, KeyboardMotionSensorSettings, KeyboardSensor, KeyboardSensorCancelEvent, KeyboardSensorDestroyEvent, KeyboardSensorEndEvent, KeyboardSensorEvents, KeyboardSensorMoveEvent, KeyboardSensorPredicate, KeyboardSensorSettings, KeyboardSensorStartEvent, PointerSensor, PointerSensorCancelEvent, PointerSensorDestroyEvent, PointerSensorDragData, PointerSensorEndEvent, PointerSensorEvents, PointerSensorMoveEvent, PointerSensorSettings, PointerSensorStartEvent, Sensor, SensorCancelEvent, SensorDestroyEvent, SensorEndEvent, SensorEventType, SensorEvents, SensorMoveEvent, SensorStartEvent, autoScroll, autoScrollPlugin, autoScrollSmoothSpeed, createPointerSensorStartPredicate, setTicker, ticker, tickerReadPhase, tickerWritePhase };
