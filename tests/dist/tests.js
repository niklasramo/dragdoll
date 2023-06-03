import { assert } from 'chai';
import { Emitter } from 'eventti';
import { Ticker } from 'tikki';

const SensorEventType = {
    start: 'start',
    move: 'move',
    cancel: 'cancel',
    end: 'end',
    destroy: 'destroy',
};

class BaseSensor {
    constructor() {
        this.drag = null;
        this.isDestroyed = false;
        this._emitter = new Emitter();
    }
    _createDragData(data) {
        return {
            x: data.x,
            y: data.y,
        };
    }
    _updateDragData(data) {
        if (!this.drag)
            return;
        this.drag.x = data.x;
        this.drag.y = data.y;
    }
    _resetDragData() {
        this.drag = null;
    }
    _start(data) {
        if (this.isDestroyed || this.drag)
            return;
        this.drag = this._createDragData(data);
        this._emitter.emit(SensorEventType.start, data);
    }
    _move(data) {
        if (!this.drag)
            return;
        this._updateDragData(data);
        this._emitter.emit(SensorEventType.move, data);
    }
    _end(data) {
        if (!this.drag)
            return;
        this._updateDragData(data);
        this._emitter.emit(SensorEventType.end, data);
        this._resetDragData();
    }
    _cancel(data) {
        if (!this.drag)
            return;
        this._updateDragData(data);
        this._emitter.emit(SensorEventType.cancel, data);
        this._resetDragData();
    }
    on(eventName, listener, listenerId) {
        return this._emitter.on(eventName, listener, listenerId);
    }
    off(eventName, listener) {
        this._emitter.off(eventName, listener);
    }
    cancel() {
        if (!this.drag)
            return;
        this._emitter.emit(SensorEventType.cancel, {
            type: SensorEventType.cancel,
            x: this.drag.x,
            y: this.drag.y,
        });
        this._resetDragData();
    }
    destroy() {
        if (this.isDestroyed)
            return;
        this.isDestroyed = true;
        this.cancel();
        this._emitter.emit(SensorEventType.destroy, {
            type: SensorEventType.destroy,
        });
        this._emitter.off();
    }
}

let tickerReadPhase = Symbol();
let tickerWritePhase = Symbol();
let ticker = new Ticker({ phases: [tickerReadPhase, tickerWritePhase] });

function getPointerEventData(e, id) {
    if ('pointerId' in e) {
        return e.pointerId === id ? e : null;
    }
    if ('changedTouches' in e) {
        let i = 0;
        for (; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === id) {
                return e.changedTouches[i];
            }
        }
        return null;
    }
    return e;
}

function getPointerType(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
}

function getPointerId(e) {
    if ('pointerId' in e)
        return e.pointerId;
    if ('changedTouches' in e)
        return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
    return -1;
}

const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const HAS_PASSIVE_EVENTS = (() => {
    let isPassiveEventsSupported = false;
    try {
        const passiveOpts = Object.defineProperty({}, 'passive', {
            get: function () {
                isPassiveEventsSupported = true;
            },
        });
        window.addEventListener('testPassive', null, passiveOpts);
        window.removeEventListener('testPassive', null, passiveOpts);
    }
    catch (e) { }
    return isPassiveEventsSupported;
})();
const HAS_TOUCH_EVENTS = IS_BROWSER && 'ontouchstart' in window;
const HAS_POINTER_EVENTS = IS_BROWSER && !!window.PointerEvent;
!!(IS_BROWSER &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1);

function parseListenerOptions(options = {}) {
    const { capture = true, passive = true } = options;
    if (HAS_PASSIVE_EVENTS) {
        return { capture, passive };
    }
    else {
        return { capture };
    }
}

function parseSourceEvents(sourceEvents) {
    return sourceEvents === 'auto' || sourceEvents === undefined
        ? HAS_POINTER_EVENTS
            ? 'pointer'
            : HAS_TOUCH_EVENTS
                ? 'touch'
                : 'mouse'
        : sourceEvents;
}

const POINTER_EVENTS = {
    start: 'pointerdown',
    move: 'pointermove',
    cancel: 'pointercancel',
    end: 'pointerup',
};
const TOUCH_EVENTS = {
    start: 'touchstart',
    move: 'touchmove',
    cancel: 'touchcancel',
    end: 'touchend',
};
const MOUSE_EVENTS = {
    start: 'mousedown',
    move: 'mousemove',
    cancel: '',
    end: 'mouseup',
};
const SOURCE_EVENTS = {
    pointer: POINTER_EVENTS,
    touch: TOUCH_EVENTS,
    mouse: MOUSE_EVENTS,
};
class PointerSensor {
    constructor(element, options = {}) {
        const { listenerOptions = {}, sourceEvents = 'auto', startPredicate = (e) => ('button' in e && e.button > 0 ? false : true), } = options;
        this.element = element;
        this.drag = null;
        this.isDestroyed = false;
        this._areWindowListenersBound = false;
        this._startPredicate = startPredicate;
        this._listenerOptions = parseListenerOptions(listenerOptions);
        this._sourceEvents = parseSourceEvents(sourceEvents);
        this._emitter = new Emitter();
        this._onStart = this._onStart.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onEnd = this._onEnd.bind(this);
        element.addEventListener(SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
    _getTrackedPointerEventData(e) {
        return this.drag ? getPointerEventData(e, this.drag.pointerId) : null;
    }
    _onStart(e) {
        if (this.isDestroyed || this.drag)
            return;
        if (!this._startPredicate(e))
            return;
        const pointerId = getPointerId(e);
        if (pointerId === null)
            return;
        const pointerEventData = getPointerEventData(e, pointerId);
        if (pointerEventData === null)
            return;
        const dragData = {
            pointerId,
            pointerType: getPointerType(e),
            x: pointerEventData.clientX,
            y: pointerEventData.clientY,
        };
        this.drag = dragData;
        const eventData = Object.assign(Object.assign({}, dragData), { type: SensorEventType.start, srcEvent: e, target: pointerEventData.target });
        this._emitter.emit(eventData.type, eventData);
        if (this.drag) {
            this._bindWindowListeners();
        }
    }
    _onMove(e) {
        if (!this.drag)
            return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData)
            return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = Object.assign({ type: SensorEventType.move, srcEvent: e, target: pointerEventData.target }, this.drag);
        this._emitter.emit(eventData.type, eventData);
    }
    _onCancel(e) {
        if (!this.drag)
            return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData)
            return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = Object.assign({ type: SensorEventType.cancel, srcEvent: e, target: pointerEventData.target }, this.drag);
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    _onEnd(e) {
        if (!this.drag)
            return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData)
            return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = Object.assign({ type: SensorEventType.end, srcEvent: e, target: pointerEventData.target }, this.drag);
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    _bindWindowListeners() {
        if (this._areWindowListenersBound)
            return;
        const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
        window.addEventListener(move, this._onMove, this._listenerOptions);
        window.addEventListener(end, this._onEnd, this._listenerOptions);
        if (cancel) {
            window.addEventListener(cancel, this._onCancel, this._listenerOptions);
        }
        this._areWindowListenersBound = true;
    }
    _unbindWindowListeners() {
        if (this._areWindowListenersBound) {
            const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
            window.removeEventListener(move, this._onMove, this._listenerOptions);
            window.removeEventListener(end, this._onEnd, this._listenerOptions);
            if (cancel) {
                window.removeEventListener(cancel, this._onCancel, this._listenerOptions);
            }
            this._areWindowListenersBound = false;
        }
    }
    _resetDrag() {
        this.drag = null;
        this._unbindWindowListeners();
    }
    cancel() {
        if (!this.drag)
            return;
        const eventData = Object.assign({ type: SensorEventType.cancel, srcEvent: null, target: null }, this.drag);
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    updateSettings(options) {
        if (this.isDestroyed)
            return;
        const { listenerOptions, sourceEvents, startPredicate } = options;
        const nextSourceEvents = parseSourceEvents(sourceEvents);
        const nextListenerOptions = parseListenerOptions(listenerOptions);
        if (startPredicate && this._startPredicate !== startPredicate) {
            this._startPredicate = startPredicate;
        }
        if ((listenerOptions &&
            (this._listenerOptions.capture !== nextListenerOptions.capture ||
                this._listenerOptions.passive === nextListenerOptions.passive)) ||
            (sourceEvents && this._sourceEvents !== nextSourceEvents)) {
            this.element.removeEventListener(SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
            this._unbindWindowListeners();
            this.cancel();
            if (sourceEvents) {
                this._sourceEvents = nextSourceEvents;
            }
            if (listenerOptions && nextListenerOptions) {
                this._listenerOptions = nextListenerOptions;
            }
            this.element.addEventListener(SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
        }
    }
    on(eventName, listener, listenerId) {
        return this._emitter.on(eventName, listener, listenerId);
    }
    off(eventName, listener) {
        this._emitter.off(eventName, listener);
    }
    destroy() {
        if (this.isDestroyed)
            return;
        this.isDestroyed = true;
        this.cancel();
        this._emitter.emit(SensorEventType.destroy, {
            type: SensorEventType.destroy,
        });
        this._emitter.off();
        this.element.removeEventListener(SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
}

class KeyboardSensor extends BaseSensor {
    constructor(options = {}) {
        super();
        const { moveDistance = 25, startPredicate = (e) => {
            if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
                if (document.activeElement && document.activeElement !== document.body) {
                    const { left, top } = document.activeElement.getBoundingClientRect();
                    return { x: left, y: top };
                }
            }
            return null;
        }, movePredicate = (e, sensor, moveDistance) => {
            if (!sensor.drag)
                return null;
            switch (e.key) {
                case 'ArrowLeft': {
                    return {
                        x: sensor.drag.x - moveDistance,
                        y: sensor.drag.y,
                    };
                }
                case 'ArrowRight': {
                    return {
                        x: sensor.drag.x + moveDistance,
                        y: sensor.drag.y,
                    };
                }
                case 'ArrowUp': {
                    return {
                        x: sensor.drag.x,
                        y: sensor.drag.y - moveDistance,
                    };
                }
                case 'ArrowDown': {
                    return {
                        x: sensor.drag.x,
                        y: sensor.drag.y + moveDistance,
                    };
                }
                default: {
                    return null;
                }
            }
        }, cancelPredicate = (e, sensor) => {
            if (sensor.drag && e.key === 'Escape') {
                return { x: sensor.drag.x, y: sensor.drag.y };
            }
            return null;
        }, endPredicate = (e, sensor) => {
            if (sensor.drag && (e.key === 'Enter' || e.key === 'Space' || e.key === ' ')) {
                return { x: sensor.drag.x, y: sensor.drag.y };
            }
            return null;
        }, } = options;
        this._moveDistance = moveDistance;
        this._startPredicate = startPredicate;
        this._movePredicate = movePredicate;
        this._cancelPredicate = cancelPredicate;
        this._endPredicate = endPredicate;
        this.cancel = this.cancel.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        document.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('blur', this.cancel);
        window.addEventListener('visibilitychange', this.cancel);
    }
    _onKeyDown(e) {
        if (!this.drag) {
            const startPosition = this._startPredicate(e, this, this._moveDistance);
            if (startPosition) {
                e.preventDefault();
                this._start({
                    type: 'start',
                    x: startPosition.x,
                    y: startPosition.y,
                    srcEvent: e,
                });
            }
            return;
        }
        const cancelPosition = this._cancelPredicate(e, this, this._moveDistance);
        if (cancelPosition) {
            e.preventDefault();
            this._cancel({
                type: 'cancel',
                x: cancelPosition.x,
                y: cancelPosition.y,
                srcEvent: e,
            });
            return;
        }
        const endPosition = this._endPredicate(e, this, this._moveDistance);
        if (endPosition) {
            e.preventDefault();
            this._end({
                type: 'end',
                x: endPosition.x,
                y: endPosition.y,
                srcEvent: e,
            });
            return;
        }
        const movePosition = this._movePredicate(e, this, this._moveDistance);
        if (movePosition) {
            e.preventDefault();
            this._move({
                type: 'move',
                x: movePosition.x,
                y: movePosition.y,
                srcEvent: e,
            });
            return;
        }
    }
    updateSettings(options = {}) {
        if (options.moveDistance !== undefined) {
            this._moveDistance = options.moveDistance;
        }
        if (options.startPredicate !== undefined) {
            this._startPredicate = options.startPredicate;
        }
        if (options.movePredicate !== undefined) {
            this._movePredicate = options.movePredicate;
        }
        if (options.cancelPredicate !== undefined) {
            this._cancelPredicate = options.cancelPredicate;
        }
        if (options.endPredicate !== undefined) {
            this._endPredicate = options.endPredicate;
        }
    }
    destroy() {
        if (this.isDestroyed)
            return;
        super.destroy();
        document.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('blur', this.cancel);
        window.removeEventListener('visibilitychange', this.cancel);
    }
}

const STYLES_CACHE = new WeakMap();
function getStyle(element, prop) {
    if (!prop)
        return '';
    let styleDeclaration = STYLES_CACHE.get(element);
    if (!styleDeclaration) {
        styleDeclaration = window.getComputedStyle(element, null);
        STYLES_CACHE.set(element, styleDeclaration);
    }
    return styleDeclaration.getPropertyValue(prop);
}

function getStyleAsFloat(el, styleProp) {
    return parseFloat(getStyle(el, styleProp)) || 0;
}

var DraggableStartPredicateState;
(function (DraggableStartPredicateState) {
    DraggableStartPredicateState[DraggableStartPredicateState["PENDING"] = 0] = "PENDING";
    DraggableStartPredicateState[DraggableStartPredicateState["RESOLVED"] = 1] = "RESOLVED";
    DraggableStartPredicateState[DraggableStartPredicateState["REJECTED"] = 2] = "REJECTED";
})(DraggableStartPredicateState || (DraggableStartPredicateState = {}));

class Pool {
    constructor(createObject, onPut) {
        this._data = [];
        this._createObject = createObject;
        this._onPut = onPut;
    }
    pick() {
        return this._data.length ? this._data.pop() : this._createObject();
    }
    put(object) {
        if (this._data.indexOf(object) === -1) {
            this._onPut && this._onPut(object);
            this._data.push(object);
        }
    }
    reset() {
        this._data.length = 0;
    }
}

function isRectsOverlapping(a, b) {
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}

function getIntersectionArea(a, b) {
    if (!isRectsOverlapping(a, b))
        return 0;
    const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return width * height;
}

function getIntersectionScore(a, b) {
    const area = getIntersectionArea(a, b);
    if (!area)
        return 0;
    const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
    return (area / maxArea) * 100;
}

function isWindow(value) {
    return value === window;
}

function getContentRect(element, result = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }) {
    if (isWindow(element)) {
        result.width = document.documentElement.clientWidth;
        result.height = document.documentElement.clientHeight;
        result.left = 0;
        result.right = result.width;
        result.top = 0;
        result.bottom = result.height;
    }
    else {
        const { left, top } = element.getBoundingClientRect();
        const borderLeft = element.clientLeft || getStyleAsFloat(element, 'border-left-width');
        const borderTop = element.clientTop || getStyleAsFloat(element, 'border-top-width');
        result.width = element.clientWidth;
        result.height = element.clientHeight;
        result.left = left + borderLeft;
        result.right = result.left + result.width;
        result.top = top + borderTop;
        result.bottom = result.top + result.height;
    }
    return result;
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function getDistanceBetweenRects(a, b) {
    if (isRectsOverlapping(a, b))
        return 0;
    if (a.right < b.left) {
        if (a.bottom < b.top) {
            return distanceBetweenPoints(a.right, a.bottom, b.left, b.top);
        }
        else if (a.top > b.bottom) {
            return distanceBetweenPoints(a.right, a.top, b.left, b.bottom);
        }
        else {
            return b.left - a.right;
        }
    }
    else if (a.left > b.right) {
        if (a.bottom < b.top) {
            return distanceBetweenPoints(a.left, a.bottom, b.right, b.top);
        }
        else if (a.top > b.bottom) {
            return distanceBetweenPoints(a.left, a.top, b.right, b.bottom);
        }
        else {
            return a.left - b.right;
        }
    }
    else {
        if (a.bottom < b.top) {
            return b.top - a.bottom;
        }
        else {
            return a.top - b.bottom;
        }
    }
}

function getScrollElement(element) {
    if (isWindow(element) || element === document.documentElement || element === document.body) {
        return window;
    }
    else {
        return element;
    }
}

function getScrollLeft(element) {
    return isWindow(element) ? element.pageXOffset : element.scrollLeft;
}

function getScrollLeftMax(element) {
    if (isWindow(element))
        element = document.documentElement;
    return element.scrollWidth - element.clientWidth;
}

function getScrollTop(element) {
    return isWindow(element) ? element.pageYOffset : element.scrollTop;
}

function getScrollTopMax(element) {
    if (isWindow(element))
        element = document.documentElement;
    return element.scrollHeight - element.clientHeight;
}

const R1 = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};
const R2 = Object.assign({}, R1);
const R3 = Object.assign({}, R1);
const DEFAULT_THRESHOLD = 50;
const SPEED_DATA = {
    direction: 'none',
    threshold: 0,
    distance: 0,
    value: 0,
    maxValue: 0,
    duration: 0,
    speed: 0,
    deltaTime: 0,
    isEnding: false,
};
const AUTO_SCROLL_AXIS = {
    x: 1,
    y: 2,
};
const AUTO_SCROLL_AXIS_DIRECTION = {
    forward: 4,
    reverse: 8,
};
const AUTO_SCROLL_DIRECTION_X = {
    none: 0,
    left: (AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.reverse),
    right: (AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.forward),
};
const AUTO_SCROLL_DIRECTION_Y = {
    none: 0,
    up: (AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.reverse),
    down: (AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.forward),
};
const AUTO_SCROLL_DIRECTION = Object.assign(Object.assign({}, AUTO_SCROLL_DIRECTION_X), AUTO_SCROLL_DIRECTION_Y);
function getDirectionAsString(direction) {
    switch (direction) {
        case AUTO_SCROLL_DIRECTION_X.none:
        case AUTO_SCROLL_DIRECTION_Y.none:
            return 'none';
        case AUTO_SCROLL_DIRECTION_X.left:
            return 'left';
        case AUTO_SCROLL_DIRECTION_X.right:
            return 'right';
        case AUTO_SCROLL_DIRECTION_Y.up:
            return 'up';
        case AUTO_SCROLL_DIRECTION_Y.down:
            return 'down';
        default:
            throw new Error(`Unknown direction value: ${direction}`);
    }
}
function getPaddedRect(rect, padding, result) {
    let { left = 0, right = 0, top = 0, bottom = 0 } = padding;
    left = Math.max(0, left);
    right = Math.max(0, right);
    top = Math.max(0, top);
    bottom = Math.max(0, bottom);
    result.width = rect.width + left + right;
    result.height = rect.height + top + bottom;
    result.left = rect.left - left;
    result.top = rect.top - top;
    result.right = rect.right + right;
    result.bottom = rect.bottom + bottom;
    return result;
}
function isScrolledToMax(scrollValue, maxScrollValue) {
    return Math.ceil(scrollValue) >= Math.floor(maxScrollValue);
}
function computeThreshold(idealThreshold, targetSize) {
    return Math.min(targetSize / 2, idealThreshold);
}
function computeEdgeOffset(threshold, inertAreaSize, itemSize, targetSize) {
    return Math.max(0, itemSize + threshold * 2 + targetSize * inertAreaSize - targetSize) / 2;
}
class AutoScrollItemData {
    constructor() {
        this.positionX = 0;
        this.positionY = 0;
        this.directionX = AUTO_SCROLL_DIRECTION.none;
        this.directionY = AUTO_SCROLL_DIRECTION.none;
        this.overlapCheckRequestTime = 0;
    }
}
class AutoScrollAction {
    constructor() {
        this.element = null;
        this.requestX = null;
        this.requestY = null;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }
    reset() {
        if (this.requestX)
            this.requestX.action = null;
        if (this.requestY)
            this.requestY.action = null;
        this.element = null;
        this.requestX = null;
        this.requestY = null;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }
    addRequest(request) {
        if (AUTO_SCROLL_AXIS.x & request.direction) {
            this.requestX && this.removeRequest(this.requestX);
            this.requestX = request;
        }
        else {
            this.requestY && this.removeRequest(this.requestY);
            this.requestY = request;
        }
        request.action = this;
    }
    removeRequest(request) {
        if (this.requestX === request) {
            this.requestX = null;
            request.action = null;
        }
        else if (this.requestY === request) {
            this.requestY = null;
            request.action = null;
        }
    }
    computeScrollValues() {
        if (!this.element)
            return;
        this.scrollLeft = this.requestX ? this.requestX.value : getScrollLeft(this.element);
        this.scrollTop = this.requestY ? this.requestY.value : getScrollTop(this.element);
    }
    scroll() {
        if (!this.element)
            return;
        if (this.element.scrollTo) {
            this.element.scrollTo(this.scrollLeft, this.scrollTop);
        }
        else {
            this.element.scrollLeft = this.scrollLeft;
            this.element.scrollTop = this.scrollTop;
        }
    }
}
class AutoScrollRequest {
    constructor() {
        this.item = null;
        this.element = null;
        this.isActive = false;
        this.isEnding = false;
        this.direction = 0;
        this.value = NaN;
        this.maxValue = 0;
        this.threshold = 0;
        this.distance = 0;
        this.deltaTime = 0;
        this.speed = 0;
        this.duration = 0;
        this.action = null;
    }
    reset() {
        if (this.isActive)
            this.onStop();
        this.item = null;
        this.element = null;
        this.isActive = false;
        this.isEnding = false;
        this.direction = 0;
        this.value = NaN;
        this.maxValue = 0;
        this.threshold = 0;
        this.distance = 0;
        this.deltaTime = 0;
        this.speed = 0;
        this.duration = 0;
        this.action = null;
    }
    hasReachedEnd() {
        return AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction
            ? isScrolledToMax(this.value, this.maxValue)
            : this.value <= 0;
    }
    computeCurrentScrollValue() {
        if (!this.element)
            return 0;
        if (this.value !== this.value) {
            return AUTO_SCROLL_AXIS.x & this.direction
                ? getScrollLeft(this.element)
                : getScrollTop(this.element);
        }
        return Math.max(0, Math.min(this.value, this.maxValue));
    }
    computeNextScrollValue() {
        const delta = this.speed * (this.deltaTime / 1000);
        const nextValue = AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction ? this.value + delta : this.value - delta;
        return Math.max(0, Math.min(nextValue, this.maxValue));
    }
    computeSpeed() {
        if (!this.item || !this.element)
            return 0;
        const { speed } = this.item;
        if (typeof speed === 'function') {
            SPEED_DATA.direction = getDirectionAsString(this.direction);
            SPEED_DATA.threshold = this.threshold;
            SPEED_DATA.distance = this.distance;
            SPEED_DATA.value = this.value;
            SPEED_DATA.maxValue = this.maxValue;
            SPEED_DATA.duration = this.duration;
            SPEED_DATA.speed = this.speed;
            SPEED_DATA.deltaTime = this.deltaTime;
            SPEED_DATA.isEnding = this.isEnding;
            return speed(this.element, SPEED_DATA);
        }
        else {
            return speed;
        }
    }
    tick(deltaTime) {
        if (!this.isActive) {
            this.isActive = true;
            this.onStart();
        }
        this.deltaTime = deltaTime;
        this.value = this.computeCurrentScrollValue();
        this.speed = this.computeSpeed();
        this.value = this.computeNextScrollValue();
        this.duration += deltaTime;
        return this.value;
    }
    onStart() {
        if (!this.item || !this.element)
            return;
        const { onStart } = this.item;
        if (typeof onStart === 'function') {
            onStart(this.element, getDirectionAsString(this.direction));
        }
    }
    onStop() {
        if (!this.item || !this.element)
            return;
        const { onStop } = this.item;
        if (typeof onStop === 'function') {
            onStop(this.element, getDirectionAsString(this.direction));
        }
    }
}
class AutoScroll {
    constructor(options = {}) {
        const { overlapCheckInterval = 150 } = options;
        this.items = [];
        this.settings = {
            overlapCheckInterval,
        };
        this._actions = [];
        this._isDestroyed = false;
        this._isTicking = false;
        this._tickTime = 0;
        this._tickDeltaTime = 0;
        this._requests = {
            [AUTO_SCROLL_AXIS.x]: new Map(),
            [AUTO_SCROLL_AXIS.y]: new Map(),
        };
        this._itemData = new Map();
        this._requestPool = new Pool(() => new AutoScrollRequest(), (request) => request.reset());
        this._actionPool = new Pool(() => new AutoScrollAction(), (action) => action.reset());
        this._emitter = new Emitter();
        this._frameRead = this._frameRead.bind(this);
        this._frameWrite = this._frameWrite.bind(this);
    }
    _frameRead(time) {
        if (this._isDestroyed)
            return;
        if (time && this._tickTime) {
            this._tickDeltaTime = time - this._tickTime;
            this._tickTime = time;
            this._updateItems();
            this._updateRequests();
            this._updateActions();
        }
        else {
            this._tickTime = time;
            this._tickDeltaTime = 0;
        }
    }
    _frameWrite() {
        if (this._isDestroyed)
            return;
        this._applyActions();
    }
    _startTicking() {
        if (this._isTicking)
            return;
        this._isTicking = true;
        ticker.on(tickerReadPhase, this._frameRead);
        ticker.on(tickerWritePhase, this._frameWrite);
    }
    _stopTicking() {
        if (!this._isTicking)
            return;
        this._isTicking = false;
        this._tickTime = 0;
        this._tickDeltaTime = 0;
        ticker.off(tickerReadPhase, this._frameRead);
        ticker.off(tickerWritePhase, this._frameWrite);
    }
    _getItemClientRect(item, result = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }) {
        const { clientRect } = item;
        result.left = clientRect.left;
        result.top = clientRect.top;
        result.width = clientRect.width;
        result.height = clientRect.height;
        result.right = clientRect.left + clientRect.width;
        result.bottom = clientRect.top + clientRect.height;
        return result;
    }
    _requestItemScroll(item, axis, element, direction, threshold, distance, maxValue) {
        const reqMap = this._requests[axis];
        let request = reqMap.get(item);
        if (request) {
            if (request.element !== element || request.direction !== direction) {
                request.reset();
            }
        }
        else {
            request = this._requestPool.pick();
            reqMap.set(item, request);
        }
        request.item = item;
        request.element = element;
        request.direction = direction;
        request.threshold = threshold;
        request.distance = distance;
        request.maxValue = maxValue;
    }
    _cancelItemScroll(item, axis) {
        const reqMap = this._requests[axis];
        const request = reqMap.get(item);
        if (!request)
            return;
        if (request.action)
            request.action.removeRequest(request);
        this._requestPool.put(request);
        reqMap.delete(item);
    }
    _checkItemOverlap(item, checkX, checkY) {
        const { inertAreaSize, targets } = item;
        if (!targets.length) {
            checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
            checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
            return;
        }
        const itemData = this._itemData.get(item);
        const moveDirectionX = itemData.directionX;
        const moveDirectionY = itemData.directionY;
        if (!moveDirectionX && !moveDirectionY) {
            checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
            checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
            return;
        }
        const itemRect = this._getItemClientRect(item, R1);
        let xElement = null;
        let xPriority = -Infinity;
        let xThreshold = 0;
        let xScore = -Infinity;
        let xDirection = AUTO_SCROLL_DIRECTION.none;
        let xDistance = 0;
        let xMaxScroll = 0;
        let yElement = null;
        let yPriority = -Infinity;
        let yThreshold = 0;
        let yScore = -Infinity;
        let yDirection = AUTO_SCROLL_DIRECTION.none;
        let yDistance = 0;
        let yMaxScroll = 0;
        let i = 0;
        for (; i < targets.length; i++) {
            const target = targets[i];
            const targetThreshold = typeof target.threshold === 'number' ? target.threshold : DEFAULT_THRESHOLD;
            const testAxisX = !!(checkX && moveDirectionX && target.axis !== 'y');
            const testAxisY = !!(checkY && moveDirectionY && target.axis !== 'x');
            const testPriority = target.priority || 0;
            if ((!testAxisX || testPriority < xPriority) && (!testAxisY || testPriority < yPriority)) {
                continue;
            }
            const testElement = getScrollElement(target.element || target);
            const testMaxScrollX = testAxisX ? getScrollLeftMax(testElement) : -1;
            const testMaxScrollY = testAxisY ? getScrollTopMax(testElement) : -1;
            if (testMaxScrollX <= 0 && testMaxScrollY <= 0)
                continue;
            const testRect = getContentRect(testElement, R2);
            let testScore = getIntersectionScore(itemRect, testRect) || -Infinity;
            if (testScore === -Infinity) {
                if (target.padding &&
                    isRectsOverlapping(itemRect, getPaddedRect(testRect, target.padding, R3))) {
                    testScore = -getDistanceBetweenRects(itemRect, testRect);
                }
                else {
                    continue;
                }
            }
            if (testAxisX &&
                testPriority >= xPriority &&
                testMaxScrollX > 0 &&
                (testPriority > xPriority || testScore > xScore)) {
                let testDistance = 0;
                let testDirection = AUTO_SCROLL_DIRECTION.none;
                const testThreshold = computeThreshold(targetThreshold, testRect.width);
                const testEdgeOffset = computeEdgeOffset(testThreshold, inertAreaSize, itemRect.width, testRect.width);
                if (moveDirectionX === AUTO_SCROLL_DIRECTION.right) {
                    testDistance = testRect.right + testEdgeOffset - itemRect.right;
                    if (testDistance <= testThreshold &&
                        !isScrolledToMax(getScrollLeft(testElement), testMaxScrollX)) {
                        testDirection = AUTO_SCROLL_DIRECTION.right;
                    }
                }
                else if (moveDirectionX === AUTO_SCROLL_DIRECTION.left) {
                    testDistance = itemRect.left - (testRect.left - testEdgeOffset);
                    if (testDistance <= testThreshold && getScrollLeft(testElement) > 0) {
                        testDirection = AUTO_SCROLL_DIRECTION.left;
                    }
                }
                if (testDirection) {
                    xElement = testElement;
                    xPriority = testPriority;
                    xThreshold = testThreshold;
                    xScore = testScore;
                    xDirection = testDirection;
                    xDistance = testDistance;
                    xMaxScroll = testMaxScrollX;
                }
            }
            if (testAxisY &&
                testPriority >= yPriority &&
                testMaxScrollY > 0 &&
                (testPriority > yPriority || testScore > yScore)) {
                let testDistance = 0;
                let testDirection = AUTO_SCROLL_DIRECTION_Y.none;
                const testThreshold = computeThreshold(targetThreshold, testRect.height);
                const testEdgeOffset = computeEdgeOffset(testThreshold, inertAreaSize, itemRect.height, testRect.height);
                if (moveDirectionY === AUTO_SCROLL_DIRECTION.down) {
                    testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
                    if (testDistance <= testThreshold &&
                        !isScrolledToMax(getScrollTop(testElement), testMaxScrollY)) {
                        testDirection = AUTO_SCROLL_DIRECTION.down;
                    }
                }
                else if (moveDirectionY === AUTO_SCROLL_DIRECTION.up) {
                    testDistance = itemRect.top - (testRect.top - testEdgeOffset);
                    if (testDistance <= testThreshold && getScrollTop(testElement) > 0) {
                        testDirection = AUTO_SCROLL_DIRECTION.up;
                    }
                }
                if (testDirection) {
                    yElement = testElement;
                    yPriority = testPriority;
                    yThreshold = testThreshold;
                    yScore = testScore;
                    yDirection = testDirection;
                    yDistance = testDistance;
                    yMaxScroll = testMaxScrollY;
                }
            }
        }
        if (checkX) {
            if (xElement && xDirection) {
                this._requestItemScroll(item, AUTO_SCROLL_AXIS.x, xElement, xDirection, xThreshold, xDistance, xMaxScroll);
            }
            else {
                this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
            }
        }
        if (checkY) {
            if (yElement && yDirection) {
                this._requestItemScroll(item, AUTO_SCROLL_AXIS.y, yElement, yDirection, yThreshold, yDistance, yMaxScroll);
            }
            else {
                this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
            }
        }
    }
    _updateScrollRequest(scrollRequest) {
        const item = scrollRequest.item;
        const { inertAreaSize, smoothStop, targets } = item;
        const itemRect = this._getItemClientRect(item, R1);
        let hasReachedEnd = null;
        let i = 0;
        for (; i < targets.length; i++) {
            const target = targets[i];
            const testElement = getScrollElement(target.element || target);
            if (testElement !== scrollRequest.element)
                continue;
            const testIsAxisX = !!(AUTO_SCROLL_AXIS.x & scrollRequest.direction);
            if (testIsAxisX) {
                if (target.axis === 'y')
                    continue;
            }
            else {
                if (target.axis === 'x')
                    continue;
            }
            const testMaxScroll = testIsAxisX
                ? getScrollLeftMax(testElement)
                : getScrollTopMax(testElement);
            if (testMaxScroll <= 0) {
                break;
            }
            const testRect = getContentRect(testElement, R2);
            const testScore = getIntersectionScore(itemRect, testRect) || -Infinity;
            if (testScore === -Infinity) {
                const padding = target.scrollPadding || target.padding;
                if (!(padding && isRectsOverlapping(itemRect, getPaddedRect(testRect, padding, R3)))) {
                    break;
                }
            }
            const targetThreshold = typeof target.threshold === 'number' ? target.threshold : DEFAULT_THRESHOLD;
            const testThreshold = computeThreshold(targetThreshold, testIsAxisX ? testRect.width : testRect.height);
            const testEdgeOffset = computeEdgeOffset(testThreshold, inertAreaSize, testIsAxisX ? itemRect.width : itemRect.height, testIsAxisX ? testRect.width : testRect.height);
            let testDistance = 0;
            if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.left) {
                testDistance = itemRect.left - (testRect.left - testEdgeOffset);
            }
            else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.right) {
                testDistance = testRect.right + testEdgeOffset - itemRect.right;
            }
            else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.up) {
                testDistance = itemRect.top - (testRect.top - testEdgeOffset);
            }
            else {
                testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
            }
            if (testDistance > testThreshold) {
                break;
            }
            const testScroll = testIsAxisX ? getScrollLeft(testElement) : getScrollTop(testElement);
            hasReachedEnd =
                AUTO_SCROLL_AXIS_DIRECTION.forward & scrollRequest.direction
                    ? isScrolledToMax(testScroll, testMaxScroll)
                    : testScroll <= 0;
            if (hasReachedEnd)
                break;
            scrollRequest.maxValue = testMaxScroll;
            scrollRequest.threshold = testThreshold;
            scrollRequest.distance = testDistance;
            scrollRequest.isEnding = false;
            return true;
        }
        if (smoothStop === true && scrollRequest.speed > 0) {
            if (hasReachedEnd === null)
                hasReachedEnd = scrollRequest.hasReachedEnd();
            scrollRequest.isEnding = hasReachedEnd ? false : true;
        }
        else {
            scrollRequest.isEnding = false;
        }
        return scrollRequest.isEnding;
    }
    _updateItems() {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const itemData = this._itemData.get(item);
            const { x, y } = item.position;
            const prevX = itemData.positionX;
            const prevY = itemData.positionY;
            if (x === prevX && y === prevY) {
                continue;
            }
            itemData.directionX =
                x > prevX
                    ? AUTO_SCROLL_DIRECTION.right
                    : x < prevX
                        ? AUTO_SCROLL_DIRECTION.left
                        : itemData.directionX;
            itemData.directionY =
                y > prevY
                    ? AUTO_SCROLL_DIRECTION.down
                    : y < prevY
                        ? AUTO_SCROLL_DIRECTION.up
                        : itemData.directionY;
            itemData.positionX = x;
            itemData.positionY = y;
            if (itemData.overlapCheckRequestTime === 0) {
                itemData.overlapCheckRequestTime = this._tickTime;
            }
        }
    }
    _updateRequests() {
        const items = this.items;
        const requestsX = this._requests[AUTO_SCROLL_AXIS.x];
        const requestsY = this._requests[AUTO_SCROLL_AXIS.y];
        let i = 0;
        for (; i < items.length; i++) {
            const item = items[i];
            const itemData = this._itemData.get(item);
            const checkTime = itemData.overlapCheckRequestTime;
            let needsCheck = checkTime > 0 && this._tickTime - checkTime > this.settings.overlapCheckInterval;
            let checkX = true;
            const reqX = requestsX.get(item);
            if (reqX && reqX.isActive) {
                checkX = !this._updateScrollRequest(reqX);
                if (checkX) {
                    needsCheck = true;
                    this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
                }
            }
            let checkY = true;
            const reqY = requestsY.get(item);
            if (reqY && reqY.isActive) {
                checkY = !this._updateScrollRequest(reqY);
                if (checkY) {
                    needsCheck = true;
                    this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
                }
            }
            if (needsCheck) {
                itemData.overlapCheckRequestTime = 0;
                this._checkItemOverlap(item, checkX, checkY);
            }
        }
    }
    _requestAction(request, axis) {
        const isAxisX = axis === AUTO_SCROLL_AXIS.x;
        let action = null;
        let i = 0;
        for (; i < this._actions.length; i++) {
            action = this._actions[i];
            if (request.element !== action.element) {
                action = null;
                continue;
            }
            if (isAxisX ? action.requestX : action.requestY) {
                this._cancelItemScroll(request.item, axis);
                return;
            }
            break;
        }
        if (!action)
            action = this._actionPool.pick();
        action.element = request.element;
        action.addRequest(request);
        request.tick(this._tickDeltaTime);
        this._actions.push(action);
    }
    _updateActions() {
        let i = 0;
        for (i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const reqX = this._requests[AUTO_SCROLL_AXIS.x].get(item);
            const reqY = this._requests[AUTO_SCROLL_AXIS.y].get(item);
            if (reqX)
                this._requestAction(reqX, AUTO_SCROLL_AXIS.x);
            if (reqY)
                this._requestAction(reqY, AUTO_SCROLL_AXIS.y);
        }
        for (i = 0; i < this._actions.length; i++) {
            this._actions[i].computeScrollValues();
        }
    }
    _applyActions() {
        if (!this._actions.length)
            return;
        this._emitter.emit('beforescroll');
        let i = 0;
        for (i = 0; i < this._actions.length; i++) {
            this._actions[i].scroll();
            this._actionPool.put(this._actions[i]);
        }
        this._actions.length = 0;
        let item;
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item.onPrepareScrollEffect) {
                item.onPrepareScrollEffect();
            }
        }
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (item.onApplyScrollEffect) {
                item.onApplyScrollEffect();
            }
        }
        this._emitter.emit('afterscroll');
    }
    on(eventName, listener) {
        return this._emitter.on(eventName, listener);
    }
    off(eventName, listener) {
        this._emitter.off(eventName, listener);
    }
    addItem(item) {
        if (this._isDestroyed || this._itemData.has(item))
            return;
        const { x, y } = item.position;
        const itemData = new AutoScrollItemData();
        itemData.positionX = x;
        itemData.positionY = y;
        itemData.directionX = AUTO_SCROLL_DIRECTION.none;
        itemData.directionY = AUTO_SCROLL_DIRECTION.none;
        itemData.overlapCheckRequestTime = this._tickTime;
        this._itemData.set(item, itemData);
        this.items.push(item);
        if (!this._isTicking)
            this._startTicking();
    }
    removeItem(item) {
        if (this._isDestroyed)
            return;
        const index = this.items.indexOf(item);
        if (index === -1)
            return;
        if (this._requests[AUTO_SCROLL_AXIS.x].get(item)) {
            this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
            this._requests[AUTO_SCROLL_AXIS.x].delete(item);
        }
        if (this._requests[AUTO_SCROLL_AXIS.y].get(item)) {
            this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
            this._requests[AUTO_SCROLL_AXIS.y].delete(item);
        }
        this._itemData.delete(item);
        this.items.splice(index, 1);
        if (this._isTicking && !this.items.length) {
            this._stopTicking();
        }
    }
    isDestroyed() {
        return this._isDestroyed;
    }
    isItemScrollingX(item) {
        var _a;
        return !!((_a = this._requests[AUTO_SCROLL_AXIS.x].get(item)) === null || _a === void 0 ? void 0 : _a.isActive);
    }
    isItemScrollingY(item) {
        var _a;
        return !!((_a = this._requests[AUTO_SCROLL_AXIS.y].get(item)) === null || _a === void 0 ? void 0 : _a.isActive);
    }
    isItemScrolling(item) {
        return this.isItemScrollingX(item) || this.isItemScrollingY(item);
    }
    updateSettings(options = {}) {
        const { overlapCheckInterval = this.settings.overlapCheckInterval } = options;
        this.settings.overlapCheckInterval = overlapCheckInterval;
    }
    destroy() {
        if (this._isDestroyed)
            return;
        const items = this.items.slice(0);
        let i = 0;
        for (; i < items.length; i++) {
            this.removeItem(items[i]);
        }
        this._actions.length = 0;
        this._requestPool.reset();
        this._actionPool.reset();
        this._emitter.off();
        this._isDestroyed = true;
    }
}

new AutoScroll();

describe('BaseSensor', () => {
    describe('drag property', () => {
        it(`should be null on init`, function () {
            const s = new BaseSensor();
            assert.equal(s.drag, null);
            s.destroy();
        });
    });
    describe('isDestroyed property', () => {
        it(`should be false on init`, function () {
            const s = new BaseSensor();
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
    });
    describe('_emitter', () => {
        it('should allow duplicate listeners by default', () => {
            const s = new BaseSensor();
            assert.equal(s['_emitter'].allowDuplicateListeners, true);
        });
        it('should replace event listeners with duplicate ids by default', () => {
            const s = new BaseSensor();
            assert.equal(s['_emitter'].idDedupeMode, 'replace');
        });
    });
    describe('_start method', () => {
        it(`should create drag data`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.deepEqual(s.drag, { x: 1, y: 2 });
            s.destroy();
        });
        it(`should not modify isDestroyed property`, function () {
            const s = new BaseSensor();
            assert.equal(s.isDestroyed, false);
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
        it(`should emit "start" event with correct arguments after updating instance properties`, function () {
            const s = new BaseSensor();
            const startArgs = { type: 'start', x: 1, y: 2 };
            let emitCount = 0;
            s.on('start', (data) => {
                assert.deepEqual(s.drag, { x: data.x, y: data.y });
                assert.equal(s.isDestroyed, false);
                assert.deepEqual(data, startArgs);
                ++emitCount;
            });
            s['_start'](startArgs);
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if drag is already active`, function () {
            const s = new BaseSensor();
            let emitCount = 0;
            s.on('start', () => void ++emitCount);
            s['_start']({ type: 'start', x: 1, y: 2 });
            const isDestroyed = s.isDestroyed;
            const { drag } = s;
            s['_start']({ type: 'start', x: 3, y: 4 });
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if instance is destroyed (isDestroyed is true)`, function () {
            const s = new BaseSensor();
            let emitCount = 0;
            s.on('start', () => void ++emitCount);
            s.destroy();
            const { drag, isDestroyed } = s;
            s['_start']({ type: 'start', x: 3, y: 4 });
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 0);
            s.destroy();
        });
    });
    describe('_move method', () => {
        it(`should update drag data to reflect the provided coordinates`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_move']({ type: 'move', x: 3, y: 4 });
            assert.deepEqual(s.drag, { x: 3, y: 4 });
            s.destroy();
        });
        it(`should not modify isDestroyed property`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(s.isDestroyed, false);
            s['_move']({ type: 'move', x: 3, y: 4 });
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
        it(`should emit "move" event with correct arguments after updating instance properties`, function () {
            const s = new BaseSensor();
            const moveArgs = { type: 'move', x: 3, y: 4 };
            let emitCount = 0;
            s.on('move', (data) => {
                assert.deepEqual(s.drag, { x: data.x, y: data.y });
                assert.equal(s.isDestroyed, false);
                assert.deepEqual(data, moveArgs);
                ++emitCount;
            });
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_move'](moveArgs);
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if drag is not active`, function () {
            const s = new BaseSensor();
            const { drag, isDestroyed } = s;
            let emitCount = 0;
            s.on('move', () => void ++emitCount);
            s['_move']({ type: 'move', x: 3, y: 4 });
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 0);
            s.destroy();
        });
    });
    describe('_cancel method', () => {
        it(`should reset drag data`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_cancel']({ type: 'cancel', x: 5, y: 6 });
            assert.equal(s.drag, null);
            s.destroy();
        });
        it(`should not modify isDestroyed property`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(s.isDestroyed, false);
            s['_cancel']({ type: 'cancel', x: 5, y: 6 });
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
        it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
            const s = new BaseSensor();
            const cancelArgs = { type: 'cancel', x: 5, y: 6 };
            let emitCount = 0;
            s.on('cancel', (data) => {
                assert.deepEqual(s.drag, { x: data.x, y: data.y });
                assert.equal(s.isDestroyed, false);
                assert.deepEqual(data, cancelArgs);
                ++emitCount;
            });
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_cancel'](cancelArgs);
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if drag is not active`, function () {
            const s = new BaseSensor();
            const { drag, isDestroyed } = s;
            let emitCount = 0;
            s.on('cancel', () => void ++emitCount);
            s['_cancel']({ type: 'cancel', x: 3, y: 4 });
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 0);
            s.destroy();
        });
    });
    describe('_end method', () => {
        it(`should reset drag data`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_end']({ type: 'end', x: 5, y: 6 });
            assert.equal(s.drag, null);
            s.destroy();
        });
        it(`should not modify isDestroyed property`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(s.isDestroyed, false);
            s['_end']({ type: 'end', x: 5, y: 6 });
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
        it(`should emit "end" event with correct arguments after updating instance properties`, function () {
            const s = new BaseSensor();
            const endArgs = { type: 'end', x: 5, y: 6 };
            let emitCount = 0;
            s.on('end', (data) => {
                assert.deepEqual(s.drag, { x: data.x, y: data.y });
                assert.equal(s.isDestroyed, false);
                assert.deepEqual(data, endArgs);
                ++emitCount;
            });
            s['_start']({ type: 'start', x: 1, y: 2 });
            s['_end'](endArgs);
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if drag is not active`, function () {
            const s = new BaseSensor();
            const { drag, isDestroyed } = s;
            let emitCount = 0;
            s.on('end', () => void ++emitCount);
            s['_end']({ type: 'end', x: 3, y: 4 });
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 0);
            s.destroy();
        });
    });
    describe('cancel method', () => {
        it(`should reset drag data`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            s.cancel();
            assert.equal(s.drag, null);
            s.destroy();
        });
        it(`should not modify isDestroyed property`, function () {
            const s = new BaseSensor();
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(s.isDestroyed, false);
            s.cancel();
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
        it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
            const s = new BaseSensor();
            let emitCount = 0;
            s.on('cancel', (data) => {
                assert.deepEqual(s.drag, { x: data.x, y: data.y });
                assert.equal(s.isDestroyed, false);
                assert.deepEqual(data, {
                    type: 'cancel',
                    x: 1,
                    y: 2,
                });
                ++emitCount;
            });
            s['_start']({ type: 'start', x: 1, y: 2 });
            s.cancel();
            assert.equal(emitCount, 1);
            s.destroy();
        });
        it(`should not do anything if drag is not active`, function () {
            const s = new BaseSensor();
            const { drag, isDestroyed } = s;
            let emitCount = 0;
            s.on('cancel', () => void ++emitCount);
            s.cancel();
            assert.deepEqual(s.drag, drag);
            assert.equal(s.isDestroyed, isDestroyed);
            assert.equal(emitCount, 0);
            s.destroy();
        });
    });
    describe('on method', () => {
        it('should return a symbol (by default) which acts as an id for removing the event listener', () => {
            const s = new BaseSensor();
            const idA = s.on('start', () => { });
            assert.equal(typeof idA, 'symbol');
        });
        it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
            const s = new BaseSensor();
            const idA = Symbol();
            assert.equal(s.on('start', () => { }, idA), idA);
            const idB = 1;
            assert.equal(s.on('start', () => { }, idB), idB);
            const idC = 'foo';
            assert.equal(s.on('start', () => { }, idC), idC);
        });
    });
    describe('off method', () => {
        it('should remove an event listener based on id', () => {
            const s = new BaseSensor();
            let msg = '';
            const idA = s.on('start', () => void (msg += 'a'));
            s.on('start', () => void (msg += 'b'));
            s.off('start', idA);
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(msg, 'b');
        });
        it('should remove event listeners based on the listener callback', () => {
            const s = new BaseSensor();
            let msg = '';
            const listenerA = () => void (msg += 'a');
            const listenerB = () => void (msg += 'b');
            s.on('start', listenerA);
            s.on('start', listenerB);
            s.on('start', listenerB);
            s.on('start', listenerA);
            s.off('start', listenerA);
            s['_start']({ type: 'start', x: 1, y: 2 });
            assert.equal(msg, 'bb');
        });
    });
    describe('destroy method', () => {
        it(`should (if drag is active):
          1. set isDestroyed property to true
          2. emit "cancel" event with the current x/Y coordinates
          3. reset drag data
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, function () {
            const s = new BaseSensor();
            const startArgs = { type: 'start', x: 1, y: 2 };
            let events = [];
            s['_start'](startArgs);
            s.on('start', (data) => void events.push(data.type));
            s.on('move', (data) => void events.push(data.type));
            s.on('end', (data) => void events.push(data.type));
            s.on('cancel', (data) => {
                assert.deepEqual(s.drag, { x: startArgs.x, y: startArgs.y });
                assert.equal(s.isDestroyed, true);
                assert.deepEqual(data, {
                    type: 'cancel',
                    x: startArgs.x,
                    y: startArgs.y,
                });
                events.push(data.type);
            });
            s.on('destroy', (data) => {
                assert.equal(s.drag, null);
                assert.equal(s.isDestroyed, true);
                assert.deepEqual(data, {
                    type: 'destroy',
                });
                events.push(data.type);
            });
            assert.equal(s['_emitter'].listenerCount(), 5);
            s.destroy();
            assert.equal(s.drag, null);
            assert.equal(s.isDestroyed, true);
            assert.deepEqual(events, ['cancel', 'destroy']);
            assert.equal(s['_emitter'].listenerCount(), 0);
        });
        it(`should (if drag is not active):
          1. set isDestroyed property to true
          2. emit "destroy" event
          3. remove all listeners from the internal emitter
       `, function () {
            const s = new BaseSensor();
            let events = [];
            s.on('start', (data) => void events.push(data.type));
            s.on('move', (data) => void events.push(data.type));
            s.on('end', (data) => void events.push(data.type));
            s.on('cancel', (data) => void events.push(data.type));
            s.on('destroy', (data) => {
                assert.equal(s.drag, null);
                assert.equal(s.isDestroyed, true);
                assert.deepEqual(data, {
                    type: 'destroy',
                });
                events.push(data.type);
            });
            assert.equal(s['_emitter'].listenerCount(), 5);
            s.destroy();
            assert.equal(s.drag, null);
            assert.equal(s.isDestroyed, true);
            assert.deepEqual(events, ['destroy']);
            assert.equal(s['_emitter'].listenerCount(), 0);
        });
        it('should not do anything if the sensor is already destroyed', () => {
            const s = new BaseSensor();
            s.destroy();
            let events = [];
            s.on('start', (data) => void events.push(data.type));
            s.on('move', (data) => void events.push(data.type));
            s.on('end', (data) => void events.push(data.type));
            s.on('cancel', (data) => void events.push(data.type));
            s.on('destroy', (data) => void events.push(data.type));
            s.destroy();
            assert.equal(s.drag, null);
            assert.equal(s.isDestroyed, true);
            assert.deepEqual(events, []);
        });
    });
});

const defaultStyles = {
    display: 'block',
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: '100px',
    height: '100px',
    padding: '0px',
    margin: '0px',
    boxSizing: 'border-box',
    backgroundColor: 'red',
};
function createTestElement(styles = {}) {
    const el = document.createElement('div');
    el.tabIndex = 0;
    Object.assign(el.style, Object.assign(Object.assign({}, defaultStyles), styles));
    document.body.appendChild(el);
    return el;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class FakeTouch {
    constructor(options = {}) {
        const { identifier = 0, target = null, clientX = 0, clientY = 0, screenX = 0, screenY = 0, radiusX = 0, radiusY = 0, rotationAngle = 0, force = 0, } = options;
        const mouseEvent = new MouseEvent('mousedown', { clientX, clientY, screenX, screenY });
        this.identifier = identifier;
        this.target =
            target ||
                document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY) ||
                document.documentElement;
        this.clientX = mouseEvent.clientX;
        this.clientY = mouseEvent.clientY;
        this.screenX = mouseEvent.screenX;
        this.screenY = mouseEvent.screenY;
        this.pageX = mouseEvent.pageX;
        this.pageY = mouseEvent.pageY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.rotationAngle = rotationAngle;
        this.force = force;
    }
}
class FakeTouchEvent extends UIEvent {
    constructor(type, options = {}) {
        const { altKey = false, ctrlKey = false, metaKey = false, shiftKey = false, touches = [], targetTouches = [], changedTouches = [] } = options, parentOptions = __rest(options, ["altKey", "ctrlKey", "metaKey", "shiftKey", "touches", "targetTouches", "changedTouches"]);
        super(type, parentOptions);
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.metaKey = metaKey;
        this.shiftKey = shiftKey;
        this.touches = touches;
        this.targetTouches = targetTouches;
        this.changedTouches = changedTouches;
    }
}

function createFakeTouchEvent(type, options = {}) {
    const { identifier, target, clientX, clientY, screenX, screenY, radiusX, radiusY, rotationAngle, force } = options, eventOptions = __rest(options, ["identifier", "target", "clientX", "clientY", "screenX", "screenY", "radiusX", "radiusY", "rotationAngle", "force"]);
    const touch = new FakeTouch({
        identifier,
        target,
        clientX,
        clientY,
        screenX,
        screenY,
        radiusX,
        radiusY,
        rotationAngle,
        force,
    });
    const touchEvent = new FakeTouchEvent(type, Object.assign(Object.assign({}, eventOptions), { touches: [touch], changedTouches: [touch], targetTouches: [touch] }));
    return touchEvent;
}

let idCounter = 100;
function createFakeDrag(steps, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { eventType = 'mouse', stepDuration = 16, extraSteps = 0, cancelAtEnd = false, pointerId = ++idCounter, pointerType = 'touch', onAfterStep, } = options;
        const finalSteps = [...steps];
        if (extraSteps > 0) {
            const stepTo = finalSteps.pop();
            const stepFrom = finalSteps.pop();
            finalSteps.push(stepFrom);
            for (let i = 0; i < extraSteps; i++) {
                const alpha = (i + 1) / (extraSteps + 1);
                const x = stepFrom.x + (stepTo.x - stepFrom.x) * alpha;
                const y = stepFrom.y + (stepTo.y - stepFrom.y) * alpha;
                finalSteps.push({
                    x: Math.round(x),
                    y: Math.round(y),
                });
            }
            finalSteps.push(stepTo);
        }
        for (let i = 0; i < finalSteps.length; i++) {
            const isStart = i === 0;
            const isEnd = i === finalSteps.length - 1;
            const { x, y } = finalSteps[i];
            if (!isStart && !isEnd) {
                const prevStep = finalSteps[i - 1];
                if (prevStep.x === x && prevStep.y === y) {
                    continue;
                }
            }
            if (!isStart && stepDuration > 0) {
                yield new Promise((resolve) => setTimeout(resolve, stepDuration));
            }
            const target = document.elementFromPoint(x, y);
            if (!target)
                throw new Error('No event target found!');
            switch (eventType) {
                case 'mouse': {
                    const eventName = isStart ? 'mousedown' : isEnd ? 'mouseup' : 'mousemove';
                    const event = new MouseEvent(eventName, {
                        clientX: x,
                        clientY: y,
                        bubbles: true,
                        cancelable: true,
                        view: window,
                    });
                    target.dispatchEvent(event);
                    if (onAfterStep)
                        onAfterStep(event);
                    break;
                }
                case 'touch': {
                    const eventName = isStart
                        ? 'touchstart'
                        : isEnd
                            ? cancelAtEnd
                                ? 'touchcancel'
                                : 'touchend'
                            : 'touchmove';
                    const event = createFakeTouchEvent(eventName, {
                        clientX: x,
                        clientY: y,
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        target,
                        identifier: pointerId,
                    });
                    target.dispatchEvent(event);
                    if (onAfterStep)
                        onAfterStep(event);
                    break;
                }
                case 'pointer': {
                    const eventName = isStart
                        ? 'pointerdown'
                        : isEnd
                            ? cancelAtEnd
                                ? 'pointercancel'
                                : 'pointerup'
                            : 'pointermove';
                    const event = new PointerEvent(eventName, {
                        clientX: x,
                        clientY: y,
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        pointerId,
                        pointerType,
                        isPrimary: true,
                        width: 100,
                        height: 100,
                    });
                    target.dispatchEvent(event);
                    if (onAfterStep)
                        onAfterStep(event);
                    break;
                }
            }
        }
    });
}

function addDefaultPageStyles(doc) {
    if (doc.getElementById('default-page-styles'))
        return;
    const styleSheet = doc.createElement('style');
    styleSheet.id = 'default-page-styles';
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
    * {
      box-sizing: border-box;
    }
    html { 
      width: 100%;
      height: 100%;
    }
    body {
      width: 100%;
      min-height: 100%;
      margin: 0;
    }
  `;
    doc.head.appendChild(styleSheet);
}
function removeDefaultPageStyles(doc) {
    var _a;
    (_a = doc.getElementById('default-page-styles')) === null || _a === void 0 ? void 0 : _a.remove();
}

describe('PointerSensor', () => {
    beforeEach(() => {
        if (IS_BROWSER) {
            addDefaultPageStyles(document);
            return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        return;
    });
    afterEach(() => {
        if (IS_BROWSER) {
            removeDefaultPageStyles(document);
            return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        return;
    });
    describe('drag property', () => {
        it(`should be null on init`, function () {
            const s = new PointerSensor(document.body);
            assert.equal(s.drag, null);
            s.destroy();
        });
    });
    describe('isDestroyed property', () => {
        it(`should be false on init`, function () {
            const s = new PointerSensor(document.body);
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
    });
    describe('target element parameter', () => {
        it('should accept document.documentElement', function () {
            if (!IS_BROWSER)
                this.skip();
            const s = new PointerSensor(document.documentElement, { sourceEvents: 'mouse' });
            document.documentElement.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s.drag, null);
            s.destroy();
        });
        it('should accept document.body', function () {
            if (!IS_BROWSER)
                this.skip();
            const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s.drag, null);
            s.destroy();
        });
        it('should accept a descendant of document.body', function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'mouse' });
            el.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s.drag, null);
            el.remove();
            s.destroy();
        });
    });
    describe('sourceEvents option', () => {
        it('should listen to mouse/pointer/touch events when set to "mouse"/"pointer"/"touch"', function () {
            if (!IS_BROWSER)
                this.skip();
            const mouseSensor = new PointerSensor(document.body, { sourceEvents: 'mouse' });
            const pointerSensor = new PointerSensor(document.body, { sourceEvents: 'pointer' });
            const touchSensor = new PointerSensor(document.body, { sourceEvents: 'touch' });
            const mouseList = [];
            const pointerList = [];
            const touchList = [];
            mouseSensor.on('start', (e) => mouseList.push(e.type));
            mouseSensor.on('move', (e) => mouseList.push(e.type));
            mouseSensor.on('end', (e) => mouseList.push(e.type));
            pointerSensor.on('start', (e) => pointerList.push(e.type));
            pointerSensor.on('move', (e) => pointerList.push(e.type));
            pointerSensor.on('end', (e) => pointerList.push(e.type));
            touchSensor.on('start', (e) => touchList.push(e.type));
            touchSensor.on('move', (e) => touchList.push(e.type));
            touchSensor.on('end', (e) => touchList.push(e.type));
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'mouse',
                stepDuration: 0,
            });
            assert.deepEqual(mouseList, ['start', 'move', 'end']);
            assert.deepEqual(pointerList, []);
            assert.deepEqual(touchList, []);
            mouseList.length = 0;
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'pointer',
                stepDuration: 0,
            });
            assert.deepEqual(mouseList, []);
            assert.deepEqual(pointerList, ['start', 'move', 'end']);
            assert.deepEqual(touchList, []);
            pointerList.length = 0;
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'touch',
                stepDuration: 0,
            });
            assert.deepEqual(mouseList, []);
            assert.deepEqual(pointerList, []);
            assert.deepEqual(touchList, ['start', 'move', 'end']);
            mouseSensor.destroy();
            pointerSensor.destroy();
            touchSensor.destroy();
        });
    });
    describe('startPredicate option', () => {
        it('should allow start only when e.button is 0 by default', function () {
            const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });
            document.body.dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
            assert.equal(s.drag, null);
            document.body.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
            assert.notEqual(s.drag, null);
            s.destroy();
        });
        it('should allow start when true is returned and prevent start when false is returned', function () {
            const s1 = new PointerSensor(document.body, {
                sourceEvents: 'mouse',
                startPredicate: () => true,
            });
            const s2 = new PointerSensor(document.body, {
                sourceEvents: 'mouse',
                startPredicate: () => false,
            });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s1.drag, null);
            assert.equal(s2.drag, null);
            s1.destroy();
            s2.destroy();
        });
    });
    describe('updateSettings method', () => {
        it(`should update startPredicate setting`, function () {
            const s = new PointerSensor(document.body, {
                sourceEvents: 'mouse',
                startPredicate: () => false,
            });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.equal(s.drag, null);
            s.updateSettings({ startPredicate: () => true });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s.drag, null);
        });
        it(`should update sourceEvents setting`, function () {
            const s = new PointerSensor(document.body, {
                sourceEvents: 'pointer',
                startPredicate: () => true,
            });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.equal(s.drag, null);
            s.updateSettings({ sourceEvents: 'mouse' });
            document.body.dispatchEvent(new MouseEvent('mousedown'));
            assert.notEqual(s.drag, null);
        });
    });
    describe('start event', () => {
        it(`should be triggered correctly on mousedown`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'mouse' });
            let startEvent = null;
            let sourceEvent;
            s.on('start', (e) => {
                if (startEvent === null) {
                    startEvent = e;
                }
                else {
                    assert.fail('start event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'mouse',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'mousedown') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(startEvent, {
                type: 'start',
                srcEvent: sourceEvent,
                target: el,
                pointerId: -1,
                pointerType: 'mouse',
                x: 1,
                y: 1,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on pointerdown`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'pointer' });
            let startEvent = null;
            let sourceEvent;
            s.on('start', (e) => {
                if (startEvent === null) {
                    startEvent = e;
                }
                else {
                    assert.fail('start event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'pointer',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'pointerdown') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(startEvent, {
                type: 'start',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.pointerId,
                pointerType: sourceEvent.pointerType,
                x: 1,
                y: 1,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on touchstart`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'touch' });
            let startEvent = null;
            let sourceEvent;
            s.on('start', (e) => {
                if (startEvent === null) {
                    startEvent = e;
                }
                else {
                    assert.fail('start event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'touch',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'touchstart') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(startEvent, {
                type: 'start',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.changedTouches[0].identifier,
                pointerType: 'touch',
                x: 1,
                y: 1,
            });
            s.destroy();
            el.remove();
        });
    });
    describe('move event', () => {
        it(`should be triggered correctly on mousemove`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'mouse' });
            let moveEvent = null;
            let sourceEvent;
            s.on('move', (e) => {
                if (moveEvent === null) {
                    moveEvent = e;
                }
                else {
                    assert.fail('move event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'mouse',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'mousemove') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(moveEvent, {
                type: 'move',
                srcEvent: sourceEvent,
                target: el,
                pointerId: -1,
                pointerType: 'mouse',
                x: 2,
                y: 2,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on pointermove`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'pointer' });
            let moveEvent = null;
            let sourceEvent;
            s.on('move', (e) => {
                if (moveEvent === null) {
                    moveEvent = e;
                }
                else {
                    assert.fail('move event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'pointer',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'pointermove') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(moveEvent, {
                type: 'move',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.pointerId,
                pointerType: sourceEvent.pointerType,
                x: 2,
                y: 2,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on touchmove`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'touch' });
            let moveEvent = null;
            let sourceEvent;
            s.on('move', (e) => {
                if (moveEvent === null) {
                    moveEvent = e;
                }
                else {
                    assert.fail('start event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'touch',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'touchmove') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(moveEvent, {
                type: 'move',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.changedTouches[0].identifier,
                pointerType: 'touch',
                x: 2,
                y: 2,
            });
            s.destroy();
            el.remove();
        });
    });
    describe('end event', () => {
        it(`should be triggered correctly on mouseup`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'mouse' });
            let endEvent = null;
            let sourceEvent;
            s.on('end', (e) => {
                if (endEvent === null) {
                    endEvent = e;
                }
                else {
                    assert.fail('end event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'mouse',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'mouseup') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(endEvent, {
                type: 'end',
                srcEvent: sourceEvent,
                target: el,
                pointerId: -1,
                pointerType: 'mouse',
                x: 3,
                y: 3,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on pointerup`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'pointer' });
            let endEvent = null;
            let sourceEvent;
            s.on('end', (e) => {
                if (endEvent === null) {
                    endEvent = e;
                }
                else {
                    assert.fail('end event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'pointer',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'pointerup') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(endEvent, {
                type: 'end',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.pointerId,
                pointerType: sourceEvent.pointerType,
                x: 3,
                y: 3,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on touchend`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'touch' });
            let endEvent = null;
            let sourceEvent;
            s.on('end', (e) => {
                if (endEvent === null) {
                    endEvent = e;
                }
                else {
                    assert.fail('end event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'touch',
                stepDuration: 0,
                onAfterStep: (e) => {
                    if (e.type === 'touchend') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(endEvent, {
                type: 'end',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.changedTouches[0].identifier,
                pointerType: 'touch',
                x: 3,
                y: 3,
            });
            s.destroy();
            el.remove();
        });
    });
    describe('cancel event', () => {
        it(`should be triggered correctly on pointercancel`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'pointer' });
            let cancelEvent = null;
            let sourceEvent;
            s.on('cancel', (e) => {
                if (cancelEvent === null) {
                    cancelEvent = e;
                }
                else {
                    assert.fail('cancel event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'pointer',
                stepDuration: 0,
                cancelAtEnd: true,
                onAfterStep: (e) => {
                    if (e.type === 'pointercancel') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(cancelEvent, {
                type: 'cancel',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.pointerId,
                pointerType: sourceEvent.pointerType,
                x: 3,
                y: 3,
            });
            s.destroy();
            el.remove();
        });
        it(`should be triggered correctly on touchcancel`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement();
            const s = new PointerSensor(el, { sourceEvents: 'touch' });
            let cancelEvent = null;
            let sourceEvent;
            s.on('cancel', (e) => {
                if (cancelEvent === null) {
                    cancelEvent = e;
                }
                else {
                    assert.fail('cancel event listener called twice');
                }
            });
            createFakeDrag([
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 },
            ], {
                eventType: 'touch',
                stepDuration: 0,
                cancelAtEnd: true,
                onAfterStep: (e) => {
                    if (e.type === 'touchcancel') {
                        sourceEvent = e;
                    }
                },
            });
            assert.deepEqual(cancelEvent, {
                type: 'cancel',
                srcEvent: sourceEvent,
                target: el,
                pointerId: sourceEvent.changedTouches[0].identifier,
                pointerType: 'touch',
                x: 3,
                y: 3,
            });
            s.destroy();
            el.remove();
        });
    });
});

describe('KeyboardSensor', () => {
    beforeEach(() => {
        if (IS_BROWSER) {
            addDefaultPageStyles(document);
            return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        return;
    });
    afterEach(() => {
        if (IS_BROWSER) {
            removeDefaultPageStyles(document);
            return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        return;
    });
    describe('drag property', () => {
        it(`should be null on init`, function () {
            const s = new KeyboardSensor();
            assert.equal(s.drag, null);
            s.destroy();
        });
    });
    describe('isDestroyed property', () => {
        it(`should be false on init`, function () {
            const s = new KeyboardSensor();
            assert.equal(s.isDestroyed, false);
            s.destroy();
        });
    });
    describe('start event', () => {
        it(`should be triggered correctly on Enter`, function () {
            if (!IS_BROWSER)
                this.skip();
            const el = createTestElement({ left: '10px', top: '20px' });
            const s = new KeyboardSensor();
            let startEvent = null;
            s.on('start', (e) => {
                if (startEvent === null) {
                    startEvent = e;
                }
                else {
                    assert.fail('start event listener called twice');
                }
            });
            const srcEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            document.dispatchEvent(srcEvent);
            assert.equal(s.drag, null);
            el.focus();
            document.dispatchEvent(srcEvent);
            assert.deepEqual(startEvent, {
                type: 'start',
                srcEvent: srcEvent,
                x: 10,
                y: 20,
            });
            s.destroy();
            el.remove();
        });
    });
});
