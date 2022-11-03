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
    clientX: number;
    clientY: number;
}
interface SensorMoveEvent {
    type: typeof SensorEventType.move;
    clientX: number;
    clientY: number;
}
interface SensorCancelEvent {
    type: typeof SensorEventType.cancel;
    clientX: number;
    clientY: number;
}
interface SensorEndEvent {
    type: typeof SensorEventType.end;
    clientX: number;
    clientY: number;
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
interface Sensor<T extends SensorEvents = SensorEvents> {
    events: T;
    on<K extends keyof T>(eventName: K, listener: (eventData: T[K]) => void): void;
    off<K extends keyof T>(eventName: K, listener: (eventData: T[K]) => void): void;
    cancel(): void;
    destroy(): void;
}

declare class BaseSensor<T extends SensorEvents = SensorEvents> implements Sensor<T> {
    events: T;
    readonly clientX: number;
    readonly clientY: number;
    readonly isActive: boolean;
    readonly isDestroyed: boolean;
    protected _emitter: Emitter<Events>;
    constructor();
    protected _start(data: T['start']): void;
    protected _move(data: T['move']): void;
    protected _end(data: T['end']): void;
    protected _cancel(data: T['cancel']): void;
    on<K extends keyof T>(eventName: K, listener: (e: T[K]) => void, listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof T>(eventName: K, listener: ((e: T[K]) => void) | EventListenerId): void;
    cancel(): void;
    destroy(): void;
}

interface BaseControllerSensorOptions<T extends BaseControllerSensorEvents = BaseControllerSensorEvents> {
    onTick?: ((sensor: BaseControllerSensor<T>) => void) | null;
}
interface BaseControllerSensorTickEvent {
    type: 'tick';
}
interface BaseControllerSensorEvents extends SensorEvents {
    tick: BaseControllerSensorTickEvent;
}
declare class BaseControllerSensor<T extends BaseControllerSensorEvents = BaseControllerSensorEvents> extends BaseSensor<T> implements Sensor<T> {
    events: T;
    direction: {
        x: number;
        y: number;
    };
    speed: number;
    readonly tickTime: number;
    readonly tickDeltaTime: number;
    protected _onTickCallback: Exclude<BaseControllerSensorOptions<T>['onTick'], undefined> | null;
    constructor(options?: BaseControllerSensorOptions<T>);
    protected _start(data: T['start']): void;
    protected _end(data: T['end']): void;
    protected _cancel(data: T['cancel']): void;
    protected _onTickCallbacks(): void;
    protected _onTick(time: number): void;
    updateSettings(options?: BaseControllerSensorOptions<T>): void;
    tick(time: number): void;
    destroy(): void;
}

declare type ListenerOptions = {
    capture?: boolean;
    passive?: boolean;
};
declare type PointerType = 'mouse' | 'pen' | 'touch';
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
declare type PointerSensorSourceEvent = PointerEvent | TouchEvent | MouseEvent;
interface PointerSensorOptions {
    listenerOptions?: ListenerOptions;
    sourceEvents?: keyof typeof SOURCE_EVENTS | 'auto';
    startPredicate?: (e: PointerSensorSourceEvent) => boolean;
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
declare class PointerSensor<T extends PointerSensorEvents = PointerSensorEvents> implements Sensor<T> {
    events: T;
    readonly element: HTMLElement | Window;
    readonly pointerId: number | null;
    readonly pointerType: PointerType | null;
    readonly clientX: number | null;
    readonly clientY: number | null;
    readonly isActive: boolean;
    readonly isDestroyed: boolean;
    protected _startPredicate: (e: PointerSensorSourceEvent) => boolean;
    protected _listenerOptions: ListenerOptions;
    protected _sourceEvents: keyof typeof SOURCE_EVENTS;
    protected _areWindowListenersBound: boolean;
    protected _emitter: Emitter<Events>;
    constructor(element: HTMLElement | Window, options?: PointerSensorOptions);
    protected _getTrackedPointerEventData(e: PointerEvent | TouchEvent | MouseEvent): PointerEvent | MouseEvent | Touch | null;
    protected _onStart(e: PointerEvent | TouchEvent | MouseEvent): void;
    protected _onMove(e: PointerEvent | TouchEvent | MouseEvent): void;
    protected _onCancel(e: PointerEvent | TouchEvent): void;
    protected _onEnd(e: PointerEvent | TouchEvent | MouseEvent): void;
    protected _bindWindowListeners(): void;
    protected _unbindWindowListeners(): void;
    protected _reset(): void;
    cancel(): void;
    updateSettings(options: PointerSensorOptions): void;
    on<K extends keyof T>(eventName: K, listener: (e: T[K]) => void, listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof T>(eventName: K, listener: ((e: T[K]) => void) | EventListenerId): void;
    destroy(): void;
}

declare type KeyboardSensorPredicate = (e: KeyboardEvent, sensor: KeyboardSensor) => {
    x: number;
    y: number;
} | null | void;
interface KeyboardSensorOptions {
    moveDistance?: number;
    startPredicate?: KeyboardSensorPredicate;
    movePredicate?: KeyboardSensorPredicate;
    cancelPredicate?: KeyboardSensorPredicate;
    endPredicate?: KeyboardSensorPredicate;
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
declare class KeyboardSensor<T extends KeyboardSensorEvents = KeyboardSensorEvents> extends BaseSensor<T> implements Sensor<T> {
    events: T;
    protected _moveDistance: number;
    protected _startPredicate: KeyboardSensorPredicate;
    protected _movePredicate: KeyboardSensorPredicate;
    protected _cancelPredicate: KeyboardSensorPredicate;
    protected _endPredicate: KeyboardSensorPredicate;
    constructor(options?: KeyboardSensorOptions);
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: KeyboardSensorOptions): void;
    destroy(): void;
}

interface KeyboardControllerSensorOptions<T extends KeyboardControllerSensorEvents = KeyboardControllerSensorEvents> extends BaseControllerSensorOptions<T> {
    startPredicate?: (e: KeyboardEvent, sensor: KeyboardControllerSensor<T>) => {
        x: number;
        y: number;
    } | null | void;
    computeSpeed?: (sensor: KeyboardControllerSensor<T>) => number;
    startKeys?: string[];
    moveLeftKeys?: string[];
    moveRightKeys?: string[];
    moveUpKeys?: string[];
    moveDownKeys?: string[];
    cancelKeys?: string[];
    endKeys?: string[];
}
interface KeyboardControllerSensorEvents extends BaseControllerSensorEvents {
}
declare class KeyboardControllerSensor<T extends KeyboardControllerSensorEvents = KeyboardControllerSensorEvents> extends BaseControllerSensor<T> implements Sensor<T> {
    events: T;
    protected _startPredicate: Exclude<KeyboardControllerSensorOptions<T>['startPredicate'], undefined>;
    protected _computeSpeed: Exclude<KeyboardControllerSensorOptions<T>['computeSpeed'], undefined>;
    protected _moveKeys: Set<string>;
    protected _moveKeyTimestamps: Map<string, number>;
    protected _startKeys: Set<string>;
    protected _moveLeftKeys: Set<string>;
    protected _moveRightKeys: Set<string>;
    protected _moveUpKeys: Set<string>;
    protected _moveDownKeys: Set<string>;
    protected _cancelKeys: Set<string>;
    protected _endKeys: Set<string>;
    constructor(options?: KeyboardControllerSensorOptions<T>);
    protected _end(data: T['end']): void;
    protected _cancel(data: T['cancel']): void;
    protected _onTickCallbacks(): void;
    protected _updateDirection(): void;
    protected _onKeyUp(e: KeyboardEvent): void;
    protected _onKeyDown(e: KeyboardEvent): void;
    updateSettings(options?: KeyboardControllerSensorOptions<T>): void;
    destroy(): void;
}

declare enum StartPredicateState {
    PENDING = 0,
    RESOLVED = 1,
    REJECTED = 2
}
declare class DraggableItem {
    element: HTMLElement | null;
    rootParent: HTMLElement | null;
    rootContainingBlock: HTMLElement | Document | null;
    dragParent: HTMLElement | null;
    dragContainingBlock: HTMLElement | Document | null;
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    syncDiffX: number;
    syncDiffY: number;
    moveDiffX: number;
    moveDiffY: number;
    containerDiffX: number;
    containerDiffY: number;
    constructor();
}
declare class DraggableDrag<S extends Sensor[], E extends S[number]['events'] = S[number]['events']> {
    sensor: S[number] | null;
    isStarted: boolean;
    isEnded: boolean;
    startEvent: E['start'] | E['move'] | null;
    nextMoveEvent: E['move'] | null;
    prevMoveEvent: E['move'] | null;
    endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
    items: DraggableItem[];
    constructor();
}
declare const DRAGGABLE_DEFAULT_SETTINGS: DraggableSettings<Sensor[]>;
interface DraggableEventCallbacks<E extends SensorEvents> {
    beforestart(event: E['start'] | E['move']): void;
    start(event: E['start'] | E['move']): void;
    beforemove(event: E['move']): void;
    move(event: E['move']): void;
    beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
    end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
    destroy(): void;
}
interface DraggableSettings<S extends Sensor[], E extends S[number]['events'] = S[number]['events']> {
    container: HTMLElement | null;
    startPredicate: (e: E['start'] | E['move'], sensor: S[number], draggable: Draggable<S>) => boolean | undefined | void;
    getElements: (startEvent: E['start'] | E['move']) => HTMLElement[] | null | void;
    releaseElements: (elements: HTMLElement[]) => void;
    getPosition: (element: HTMLElement) => {
        x: number;
        y: number;
    };
    getPositionChange: (element: HTMLElement, startEvent: E['start'] | E['move'], prevEvent: E['start'] | E['move'], nextEvent: E['move']) => {
        x: number;
        y: number;
    };
    renderPosition: (element: HTMLElement, x: number, y: number) => void;
}
declare type DraggableOptions<S extends Sensor[]> = Partial<DraggableSettings<S>>;
declare class Draggable<S extends Sensor[] = Sensor[], E extends S[number]['events'] = S[number]['events']> {
    readonly sensors: S;
    readonly settings: DraggableSettings<S>;
    protected _sensorData: Map<S[number], {
        predicateState: StartPredicateState;
        predicateEvent: E['start'] | E['move'] | null;
        onMove: (e: Parameters<Draggable<S>['_onMove']>[0]) => void;
        onEnd: (e: Parameters<Draggable<S>['_onEnd']>[0]) => void;
    }>;
    protected _emitter: Emitter<{
        [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
    }>;
    protected _drag: DraggableDrag<S> | null;
    protected _startId: symbol;
    protected _moveId: symbol;
    protected _syncId: symbol;
    protected _isDestroyed: boolean;
    constructor(sensors: S, options?: DraggableOptions<S>);
    protected _parseSettings(options?: DraggableOptions<S>, defaults?: DraggableSettings<S>): DraggableSettings<S>;
    protected _emit<K extends keyof DraggableEventCallbacks<E>>(type: K, ...e: Parameters<DraggableEventCallbacks<E>[K]>): void;
    protected _onMove(e: E['start'] | E['move'], sensor: S[number]): void;
    protected _onScroll(): void;
    protected _onEnd(e: E['end'] | E['cancel'] | E['destroy'], sensor: S[number]): void;
    protected _prepareStart(): void;
    protected _applyStart(): void;
    protected _prepareMove(): void;
    protected _applyMove(): void;
    protected _prepareSynchronize(): void;
    protected _applySynchronize(): void;
    isActive(): boolean;
    getDragData(): Readonly<DraggableDrag<S, S[number]["events"]>> | null;
    on<K extends keyof DraggableEventCallbacks<E>>(eventName: K, listener: DraggableEventCallbacks<E>[K], listenerId?: EventListenerId): EventListenerId;
    off<K extends keyof DraggableEventCallbacks<E>>(eventName: K, listener: DraggableEventCallbacks<E>[K] | EventListenerId): void;
    synchronize(syncImmediately?: boolean): void;
    resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']): void;
    rejectStartPredicate(sensor: S[number]): void;
    stop(): void;
    updateSettings(options?: DraggableOptions<S>): void;
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
declare type AutoScrollAxis = typeof AUTO_SCROLL_AXIS[keyof typeof AUTO_SCROLL_AXIS];
declare type AutoScrollDirectionX = typeof AUTO_SCROLL_DIRECTION_X[keyof typeof AUTO_SCROLL_DIRECTION_X];
declare type AutoScrollDirectionY = typeof AUTO_SCROLL_DIRECTION_Y[keyof typeof AUTO_SCROLL_DIRECTION_Y];
declare type AutoScrollDirection = typeof AUTO_SCROLL_DIRECTION[keyof typeof AUTO_SCROLL_DIRECTION];
interface AutoScrollSpeedData {
    direction: AutoScrollDirection;
    threshold: number;
    distance: number;
    value: number;
    maxValue: number;
    duration: number;
    speed: number;
    deltaTime: number;
    isEnding: boolean;
}
interface AutoScrollItem {
    readonly targets: AutoScrollItemTarget[];
    readonly clientRect: Rect;
    readonly position: {
        x: number;
        y: number;
    };
    readonly staticAreaSize: number;
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
}
declare type AutoScrollItemEventCallback = (scrollElement: Window | HTMLElement, scrollDirection: AutoScrollDirection) => void;
declare type AutoScrollItemEffectCallback = () => void;
declare type AutoScrollItemSpeedCallback = (scrollElement: Window | HTMLElement, scrollData: AutoScrollSpeedData) => number;
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

declare const AUTOSCROLL_DRAGGABLE_DEFAULT_SETTINGS: DraggableAutoScrollSettings<Sensor[]>;
declare class DraggableAutoScrollProxy<S extends Sensor<SensorEvents>[]> implements AutoScrollItem {
    protected _draggable: DraggableAutoScroll<S>;
    protected _position: AutoScrollItem['position'];
    protected _clientRect: AutoScrollItem['clientRect'];
    constructor(draggable: DraggableAutoScroll<S>);
    private _getSettings;
    get targets(): AutoScrollItemTarget[];
    get position(): {
        x: number;
        y: number;
    };
    get clientRect(): Rect;
    get staticAreaSize(): number;
    get smoothStop(): boolean;
    get speed(): number | AutoScrollItemSpeedCallback;
    get onStart(): AutoScrollItemEventCallback | null;
    get onStop(): AutoScrollItemEventCallback | null;
    onPrepareScrollEffect(): void;
    onApplyScrollEffect(): void;
}
interface DraggableAutoScrollSettings<S extends Sensor[]> extends DraggableSettings<S> {
    autoScroll: {
        targets: AutoScrollItemTarget[] | ((draggable: Draggable<S>) => AutoScrollItemTarget[]);
        staticAreaSize: number;
        speed: number | AutoScrollItemSpeedCallback;
        smoothStop: boolean;
        getPosition: ((draggable: Draggable<S>) => {
            x: number;
            y: number;
        }) | null;
        getClientRect: ((draggable: Draggable<S>) => {
            left: number;
            top: number;
            width: number;
            height: number;
        }) | null;
        onStart: AutoScrollItemEventCallback | null;
        onStop: AutoScrollItemEventCallback | null;
    };
}
declare type DraggableAutoScrollOptions<S extends Sensor[]> = Partial<DraggableAutoScrollSettings<S>>;
declare class DraggableAutoScroll<S extends Sensor[], E extends S[number]['events'] = S[number]['events']> extends Draggable<S, E> {
    readonly settings: DraggableAutoScrollSettings<S>;
    protected _autoScrollProxy: DraggableAutoScrollProxy<S> | null;
    constructor(sensors: S, options?: DraggableAutoScrollOptions<S>);
    protected _parseAutoScrollSettings(options?: DraggableAutoScrollOptions<S>['autoScroll'], defaults?: DraggableAutoScrollSettings<S>['autoScroll']): DraggableAutoScrollSettings<S>['autoScroll'];
    protected _parseSettings(options?: DraggableAutoScrollOptions<S>, defaults?: DraggableAutoScrollSettings<S>): DraggableAutoScrollSettings<S>;
    updateSettings(options?: DraggableAutoScrollOptions<S>): void;
}

declare const autoScroll: AutoScroll;

declare let tickerReadPhase: EventName;
declare let tickerWritePhase: EventName;
declare let ticker: Ticker<EventName, tikki.DefaultFrameCallback>;
declare function setTicker(newTicker: Ticker<EventName, FrameCallback>, readPhase: EventName, writePhase: EventName): void;

declare function createPointerSensorStartPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
    timeout?: number;
    fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];

export { AUTOSCROLL_DRAGGABLE_DEFAULT_SETTINGS, AUTO_SCROLL_AXIS, AUTO_SCROLL_AXIS_DIRECTION, AUTO_SCROLL_DIRECTION, AutoScroll, AutoScrollEventCallbacks, AutoScrollItem, AutoScrollItemEffectCallback, AutoScrollItemEventCallback, AutoScrollItemSpeedCallback, AutoScrollItemTarget, AutoScrollOptions, AutoScrollSettings, BaseControllerSensor, BaseControllerSensorEvents, BaseControllerSensorOptions, BaseControllerSensorTickEvent, BaseSensor, DRAGGABLE_DEFAULT_SETTINGS, Draggable, DraggableAutoScroll, DraggableAutoScrollOptions, DraggableAutoScrollSettings, DraggableEventCallbacks, DraggableOptions, DraggableSettings, KeyboardControllerSensor, KeyboardControllerSensorEvents, KeyboardControllerSensorOptions, KeyboardSensor, KeyboardSensorCancelEvent, KeyboardSensorDestroyEvent, KeyboardSensorEndEvent, KeyboardSensorEvents, KeyboardSensorMoveEvent, KeyboardSensorOptions, KeyboardSensorPredicate, KeyboardSensorStartEvent, PointerSensor, PointerSensorCancelEvent, PointerSensorDestroyEvent, PointerSensorEndEvent, PointerSensorEvents, PointerSensorMoveEvent, PointerSensorOptions, PointerSensorStartEvent, Sensor, SensorCancelEvent, SensorDestroyEvent, SensorEndEvent, SensorEventType, SensorEvents, SensorMoveEvent, SensorStartEvent, autoScroll, autoScrollSmoothSpeed, createPointerSensorStartPredicate, setTicker, ticker, tickerReadPhase, tickerWritePhase };
