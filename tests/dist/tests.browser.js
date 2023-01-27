(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chai'), require('eventti'), require('tikki')) :
    typeof define === 'function' && define.amd ? define(['chai', 'eventti', 'tikki'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.chai, global.eventti, global.tikki));
})(this, (function (chai, eventti, tikki) { 'use strict';

    const SensorEventType = {
        start: 'start',
        move: 'move',
        cancel: 'cancel',
        end: 'end',
        destroy: 'destroy',
    };

    class BaseSensor {
        constructor() {
            this.clientX = 0;
            this.clientY = 0;
            this.isActive = false;
            this.isDestroyed = false;
            this._emitter = new eventti.Emitter();
        }
        _start(data) {
            if (this.isDestroyed || this.isActive)
                return;
            this.clientX = data.clientX;
            this.clientY = data.clientY;
            this.isActive = true;
            this._emitter.emit(SensorEventType.start, data);
        }
        _move(data) {
            if (!this.isActive)
                return;
            this.clientX = data.clientX;
            this.clientY = data.clientY;
            this._emitter.emit(SensorEventType.move, data);
        }
        _end(data) {
            if (!this.isActive)
                return;
            this.clientX = data.clientX;
            this.clientY = data.clientY;
            this.isActive = false;
            this._emitter.emit(SensorEventType.end, data);
        }
        _cancel(data) {
            if (!this.isActive)
                return;
            this.clientX = data.clientX;
            this.clientY = data.clientY;
            this.isActive = false;
            this._emitter.emit(SensorEventType.cancel, data);
        }
        on(eventName, listener, listenerId) {
            return this._emitter.on(eventName, listener, listenerId);
        }
        off(eventName, listener) {
            this._emitter.off(eventName, listener);
        }
        cancel() {
            if (!this.isActive)
                return;
            this.isActive = false;
            this._emitter.emit(SensorEventType.cancel, {
                type: SensorEventType.cancel,
                clientX: this.clientX,
                clientY: this.clientY,
            });
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
    let ticker = new tikki.Ticker({ phases: [tickerReadPhase, tickerWritePhase] });

    const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    (() => {
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
    !!(IS_BROWSER &&
        navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1);

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

    var StartPredicateState;
    (function (StartPredicateState) {
        StartPredicateState[StartPredicateState["PENDING"] = 0] = "PENDING";
        StartPredicateState[StartPredicateState["RESOLVED"] = 1] = "RESOLVED";
        StartPredicateState[StartPredicateState["REJECTED"] = 2] = "REJECTED";
    })(StartPredicateState || (StartPredicateState = {}));

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
        if (isWindow(element)) {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        }
        else {
            return element.scrollWidth - element.clientWidth;
        }
    }

    function getScrollTop(element) {
        return isWindow(element) ? element.pageYOffset : element.scrollTop;
    }

    function getScrollTopMax(element) {
        if (isWindow(element)) {
            return document.documentElement.scrollHeight - document.documentElement.clientHeight;
        }
        else {
            return element.scrollHeight - element.clientHeight;
        }
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
                ? this.value >= this.maxValue
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
            this._emitter = new eventti.Emitter();
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
                if (!testMaxScrollX && !testMaxScrollY)
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
                        if (testDistance <= testThreshold && getScrollLeft(testElement) < testMaxScrollX) {
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
                        if (testDistance <= testThreshold && getScrollTop(testElement) < testMaxScrollY) {
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
                        ? testScroll >= testMaxScroll
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
        describe('isActive property', () => {
            it(`should be false on init`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.isActive, false);
                s.destroy();
            });
        });
        describe('isDestroyed property', () => {
            it(`should be false on init`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
        });
        describe('clientX property', () => {
            it(`should be 0 on init`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.clientX, 0);
                s.destroy();
            });
        });
        describe('clientY property', () => {
            it(`should be 0 on init`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.clientY, 0);
                s.destroy();
            });
        });
        describe('_emitter', () => {
            it('should allow duplicate listeners by default', () => {
                const s = new BaseSensor();
                chai.assert.equal(s['_emitter'].allowDuplicateListeners, true);
            });
            it('should replace event listeners with duplicate ids by default', () => {
                const s = new BaseSensor();
                chai.assert.equal(s['_emitter'].idDedupeMode, 'replace');
            });
        });
        describe('_start method', () => {
            it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.clientX, 1);
                chai.assert.equal(s.clientY, 2);
                s.destroy();
            });
            it(`should set isActive property to true`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.isActive, false);
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isActive, true);
                s.destroy();
            });
            it(`should not modify isDestroyed property`, function () {
                const s = new BaseSensor();
                chai.assert.equal(s.isDestroyed, false);
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should emit "start" event with correct arguments after updating instance properties`, function () {
                const s = new BaseSensor();
                const startArgs = { type: 'start', clientX: 1, clientY: 2 };
                let emitCount = 0;
                s.on('start', (data) => {
                    chai.assert.equal(s.clientX, data.clientX);
                    chai.assert.equal(s.clientY, data.clientY);
                    chai.assert.equal(s.isActive, true);
                    chai.assert.equal(s.isDestroyed, false);
                    chai.assert.deepEqual(data, startArgs);
                    ++emitCount;
                });
                s['_start'](startArgs);
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if drag is already active (isActive is true)`, function () {
                const s = new BaseSensor();
                let emitCount = 0;
                s.on('start', () => void ++emitCount);
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                const { clientX, clientY, isActive, isDestroyed } = s;
                s['_start']({ type: 'start', clientX: 3, clientY: 4 });
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if instance is destroyed (isDestroyed is true)`, function () {
                const s = new BaseSensor();
                let emitCount = 0;
                s.on('start', () => void ++emitCount);
                s.destroy();
                const { clientX, clientY, isActive, isDestroyed } = s;
                s['_start']({ type: 'start', clientX: 3, clientY: 4 });
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 0);
                s.destroy();
            });
        });
        describe('_move method', () => {
            it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_move']({ type: 'move', clientX: 3, clientY: 4 });
                chai.assert.equal(s.clientX, 3);
                chai.assert.equal(s.clientY, 4);
                s.destroy();
            });
            it(`should not modify isActive/isDestroyed properties`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isActive, true);
                chai.assert.equal(s.isDestroyed, false);
                s['_move']({ type: 'move', clientX: 3, clientY: 4 });
                chai.assert.equal(s.isActive, true);
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should emit "move" event with correct arguments after updating instance properties`, function () {
                const s = new BaseSensor();
                const moveArgs = { type: 'move', clientX: 3, clientY: 4 };
                let emitCount = 0;
                s.on('move', (data) => {
                    chai.assert.equal(s.clientX, data.clientX);
                    chai.assert.equal(s.clientY, data.clientY);
                    chai.assert.equal(s.isActive, true);
                    chai.assert.equal(s.isDestroyed, false);
                    chai.assert.deepEqual(data, moveArgs);
                    ++emitCount;
                });
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_move'](moveArgs);
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if drag is not active`, function () {
                const s = new BaseSensor();
                const { clientX, clientY, isActive, isDestroyed } = s;
                let emitCount = 0;
                s.on('move', () => void ++emitCount);
                s['_move']({ type: 'move', clientX: 3, clientY: 4 });
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 0);
                s.destroy();
            });
        });
        describe('_cancel method', () => {
            it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
                chai.assert.equal(s.clientX, 5);
                chai.assert.equal(s.clientY, 6);
                s.destroy();
            });
            it(`should set isActive property to false`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isActive, true);
                s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
                chai.assert.equal(s.isActive, false);
                s.destroy();
            });
            it(`should not modify isDestroyed property`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isDestroyed, false);
                s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
                const s = new BaseSensor();
                const cancelArgs = { type: 'cancel', clientX: 5, clientY: 6 };
                let emitCount = 0;
                s.on('cancel', (data) => {
                    chai.assert.equal(s.clientX, data.clientX);
                    chai.assert.equal(s.clientY, data.clientY);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, false);
                    chai.assert.deepEqual(data, cancelArgs);
                    ++emitCount;
                });
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_cancel'](cancelArgs);
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if drag is not active`, function () {
                const s = new BaseSensor();
                const { clientX, clientY, isActive, isDestroyed } = s;
                let emitCount = 0;
                s.on('cancel', () => void ++emitCount);
                s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 0);
                s.destroy();
            });
        });
        describe('_end method', () => {
            it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_end']({ type: 'end', clientX: 5, clientY: 6 });
                chai.assert.equal(s.clientX, 5);
                chai.assert.equal(s.clientY, 6);
                s.destroy();
            });
            it(`should set isActive property to false`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isActive, true);
                s['_end']({ type: 'end', clientX: 5, clientY: 6 });
                chai.assert.equal(s.isActive, false);
                s.destroy();
            });
            it(`should not modify isDestroyed property`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isDestroyed, false);
                s['_end']({ type: 'end', clientX: 5, clientY: 6 });
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should emit "end" event with correct arguments after updating instance properties`, function () {
                const s = new BaseSensor();
                const endArgs = { type: 'end', clientX: 5, clientY: 6 };
                let emitCount = 0;
                s.on('end', (data) => {
                    chai.assert.equal(s.clientX, data.clientX);
                    chai.assert.equal(s.clientY, data.clientY);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, false);
                    chai.assert.deepEqual(data, endArgs);
                    ++emitCount;
                });
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s['_end'](endArgs);
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if drag is not active`, function () {
                const s = new BaseSensor();
                const { clientX, clientY, isActive, isDestroyed } = s;
                let emitCount = 0;
                s.on('end', () => void ++emitCount);
                s['_end']({ type: 'end', clientX: 5, clientY: 6 });
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 0);
                s.destroy();
            });
        });
        describe('cancel method', () => {
            it(`should not update clientX/clientY/isDestroyed properties`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.clientX, 1);
                chai.assert.equal(s.clientY, 2);
                chai.assert.equal(s.isDestroyed, false);
                s.cancel();
                chai.assert.equal(s.clientX, 1);
                chai.assert.equal(s.clientY, 2);
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should set isActive property to false`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isActive, true);
                s.cancel();
                chai.assert.equal(s.isActive, false);
                s.destroy();
            });
            it(`should not modify isDestroyed property`, function () {
                const s = new BaseSensor();
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(s.isDestroyed, false);
                s.cancel();
                chai.assert.equal(s.isDestroyed, false);
                s.destroy();
            });
            it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
                const s = new BaseSensor();
                let emitCount = 0;
                s.on('cancel', (data) => {
                    chai.assert.equal(s.clientX, data.clientX);
                    chai.assert.equal(s.clientY, data.clientY);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, false);
                    chai.assert.deepEqual(data, {
                        type: 'cancel',
                        clientX: 1,
                        clientY: 2,
                    });
                    ++emitCount;
                });
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                s.cancel();
                chai.assert.equal(emitCount, 1);
                s.destroy();
            });
            it(`should not do anything if drag is not active`, function () {
                const s = new BaseSensor();
                const { clientX, clientY, isActive, isDestroyed } = s;
                let emitCount = 0;
                s.on('cancel', () => void ++emitCount);
                s.cancel();
                chai.assert.equal(s.clientX, clientX);
                chai.assert.equal(s.clientY, clientY);
                chai.assert.equal(s.isActive, isActive);
                chai.assert.equal(s.isDestroyed, isDestroyed);
                chai.assert.equal(emitCount, 0);
                s.destroy();
            });
        });
        describe('on method', () => {
            it('should return a symbol (by default) which acts as an id for removing the event listener', () => {
                const s = new BaseSensor();
                const idA = s.on('start', () => { });
                chai.assert.equal(typeof idA, 'symbol');
            });
            it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
                const s = new BaseSensor();
                const idA = Symbol();
                chai.assert.equal(s.on('start', () => { }, idA), idA);
                const idB = 1;
                chai.assert.equal(s.on('start', () => { }, idB), idB);
                const idC = 'foo';
                chai.assert.equal(s.on('start', () => { }, idC), idC);
            });
        });
        describe('off method', () => {
            it('should remove an event listener based on id', () => {
                const s = new BaseSensor();
                let msg = '';
                const idA = s.on('start', () => void (msg += 'a'));
                s.on('start', () => void (msg += 'b'));
                s.off('start', idA);
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(msg, 'b');
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
                s['_start']({ type: 'start', clientX: 1, clientY: 2 });
                chai.assert.equal(msg, 'bb');
            });
        });
        describe('destroy method', () => {
            it(`should (if drag is active):
          1. set isDestroyed property to true
          2. set isActive property to false
          3. emit "cancel" event with the current clientX/Y coordinates
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, function () {
                const s = new BaseSensor();
                const startArgs = { type: 'start', clientX: 1, clientY: 2 };
                let events = [];
                s['_start'](startArgs);
                s.on('start', (data) => void events.push(data.type));
                s.on('move', (data) => void events.push(data.type));
                s.on('end', (data) => void events.push(data.type));
                s.on('cancel', (data) => {
                    chai.assert.equal(s.clientX, startArgs.clientX);
                    chai.assert.equal(s.clientY, startArgs.clientY);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, true);
                    chai.assert.deepEqual(data, {
                        type: 'cancel',
                        clientX: startArgs.clientX,
                        clientY: startArgs.clientY,
                    });
                    events.push(data.type);
                });
                s.on('destroy', (data) => {
                    chai.assert.equal(s.clientX, startArgs.clientX);
                    chai.assert.equal(s.clientY, startArgs.clientY);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, true);
                    chai.assert.deepEqual(data, {
                        type: 'destroy',
                    });
                    events.push(data.type);
                });
                chai.assert.equal(s['_emitter'].listenerCount(), 5);
                s.destroy();
                chai.assert.equal(s.clientX, startArgs.clientX);
                chai.assert.equal(s.clientY, startArgs.clientY);
                chai.assert.equal(s.isActive, false);
                chai.assert.equal(s.isDestroyed, true);
                chai.assert.deepEqual(events, ['cancel', 'destroy']);
                chai.assert.equal(s['_emitter'].listenerCount(), 0);
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
                    chai.assert.equal(s.clientX, 0);
                    chai.assert.equal(s.clientY, 0);
                    chai.assert.equal(s.isActive, false);
                    chai.assert.equal(s.isDestroyed, true);
                    chai.assert.deepEqual(data, {
                        type: 'destroy',
                    });
                    events.push(data.type);
                });
                chai.assert.equal(s['_emitter'].listenerCount(), 5);
                s.destroy();
                chai.assert.equal(s.clientX, 0);
                chai.assert.equal(s.clientY, 0);
                chai.assert.equal(s.isActive, false);
                chai.assert.equal(s.isDestroyed, true);
                chai.assert.deepEqual(events, ['destroy']);
                chai.assert.equal(s['_emitter'].listenerCount(), 0);
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
                chai.assert.equal(s.clientX, 0);
                chai.assert.equal(s.clientY, 0);
                chai.assert.equal(s.isActive, false);
                chai.assert.equal(s.isDestroyed, true);
                chai.assert.deepEqual(events, []);
            });
        });
    });

}));
