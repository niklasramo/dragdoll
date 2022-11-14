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
            this.cancel();
            this.isDestroyed = true;
            this._emitter.emit(SensorEventType.destroy, {
                type: SensorEventType.destroy,
            });
            this._emitter.off();
        }
    }

    let tickerReadPhase = Symbol();
    let tickerWritePhase = Symbol();
    let ticker = new tikki.Ticker({ phases: [tickerReadPhase, tickerWritePhase] });

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
    const HAS_TOUCH_EVENTS = 'ontouchstart' in window;
    const HAS_POINTER_EVENTS = !!window.PointerEvent;
    const IS_SAFARI = !!(navigator.vendor &&
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
            this.pointerId = null;
            this.pointerType = null;
            this.clientX = null;
            this.clientY = null;
            this.isActive = false;
            this.isDestroyed = false;
            this._areWindowListenersBound = false;
            this._startPredicate = startPredicate;
            this._listenerOptions = parseListenerOptions(listenerOptions);
            this._sourceEvents = parseSourceEvents(sourceEvents);
            this._emitter = new eventti.Emitter();
            this._onStart = this._onStart.bind(this);
            this._onMove = this._onMove.bind(this);
            this._onCancel = this._onCancel.bind(this);
            this._onEnd = this._onEnd.bind(this);
            element.addEventListener(SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
        }
        _getTrackedPointerEventData(e) {
            if (this.pointerId === null)
                return null;
            return getPointerEventData(e, this.pointerId);
        }
        _onStart(e) {
            if (this.isDestroyed)
                return;
            if (this.pointerId !== null)
                return;
            if (!this._startPredicate(e))
                return;
            const pointerId = getPointerId(e);
            if (pointerId === null)
                return;
            const pointerEventData = getPointerEventData(e, pointerId);
            if (pointerEventData === null)
                return;
            this.pointerId = pointerId;
            this.pointerType = getPointerType(e);
            this.clientX = pointerEventData.clientX;
            this.clientY = pointerEventData.clientY;
            this.isActive = true;
            const eventData = {
                type: SensorEventType.start,
                clientX: this.clientX,
                clientY: this.clientY,
                pointerId: this.pointerId,
                pointerType: this.pointerType,
                srcEvent: e,
                target: pointerEventData.target,
            };
            this._emitter.emit(eventData.type, eventData);
            if (this.pointerId !== null && this.isActive) {
                this._bindWindowListeners();
            }
        }
        _onMove(e) {
            const pointerEventData = this._getTrackedPointerEventData(e);
            if (!pointerEventData || !this.isActive)
                return;
            this.clientX = pointerEventData.clientX;
            this.clientY = pointerEventData.clientY;
            const eventData = {
                type: SensorEventType.move,
                clientX: this.clientX,
                clientY: this.clientY,
                pointerId: this.pointerId,
                pointerType: this.pointerType,
                srcEvent: e,
                target: pointerEventData.target,
            };
            this._emitter.emit(eventData.type, eventData);
        }
        _onCancel(e) {
            const pointerEventData = this._getTrackedPointerEventData(e);
            if (!pointerEventData || !this.isActive)
                return;
            this.isActive = false;
            this.clientX = pointerEventData.clientX;
            this.clientY = pointerEventData.clientY;
            const eventData = {
                type: SensorEventType.cancel,
                clientX: this.clientX,
                clientY: this.clientY,
                pointerId: this.pointerId,
                pointerType: this.pointerType,
                srcEvent: e,
                target: pointerEventData.target,
            };
            this._emitter.emit(eventData.type, eventData);
            this._reset();
        }
        _onEnd(e) {
            const pointerEventData = this._getTrackedPointerEventData(e);
            if (!pointerEventData || !this.isActive)
                return;
            this.isActive = false;
            this.clientX = pointerEventData.clientX;
            this.clientY = pointerEventData.clientY;
            const eventData = {
                type: SensorEventType.end,
                clientX: this.clientX,
                clientY: this.clientY,
                pointerId: this.pointerId,
                pointerType: this.pointerType,
                srcEvent: e,
                target: pointerEventData.target,
            };
            this._emitter.emit(eventData.type, eventData);
            this._reset();
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
        _reset() {
            this.pointerId = null;
            this.pointerType = null;
            this.clientX = null;
            this.clientY = null;
            this.isActive = false;
            this._unbindWindowListeners();
        }
        cancel() {
            if (!this.pointerId || !this.isActive)
                return;
            this.isActive = false;
            const eventData = {
                type: SensorEventType.cancel,
                clientX: this.clientX,
                clientY: this.clientY,
                pointerId: this.pointerId,
                pointerType: this.pointerType,
                srcEvent: null,
                target: null,
            };
            this._emitter.emit(eventData.type, eventData);
            this._reset();
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
                    if (document.activeElement) {
                        const { left, top } = document.activeElement.getBoundingClientRect();
                        return { x: left, y: top };
                    }
                }
                return null;
            }, movePredicate = (e, sensor) => {
                switch (e.key) {
                    case 'ArrowLeft': {
                        return {
                            x: sensor.clientX - sensor._moveDistance,
                            y: sensor.clientY,
                        };
                    }
                    case 'ArrowRight': {
                        return {
                            x: sensor.clientX + sensor._moveDistance,
                            y: sensor.clientY,
                        };
                    }
                    case 'ArrowUp': {
                        return {
                            x: sensor.clientX,
                            y: sensor.clientY - sensor._moveDistance,
                        };
                    }
                    case 'ArrowDown': {
                        return {
                            x: sensor.clientX,
                            y: sensor.clientY + sensor._moveDistance,
                        };
                    }
                    default: {
                        return null;
                    }
                }
            }, cancelPredicate = (e, sensor) => {
                if (e.key === 'Escape') {
                    return { x: sensor.clientX, y: sensor.clientY };
                }
                return null;
            }, endPredicate = (e, sensor) => {
                if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
                    return { x: sensor.clientX, y: sensor.clientY };
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
            if (!this.isActive) {
                const startPosition = this._startPredicate(e, this);
                if (startPosition) {
                    e.preventDefault();
                    this._start({
                        type: 'start',
                        clientX: startPosition.x,
                        clientY: startPosition.y,
                        srcEvent: e,
                    });
                }
                return;
            }
            const cancelPosition = this._cancelPredicate(e, this);
            if (cancelPosition) {
                e.preventDefault();
                this._cancel({
                    type: 'cancel',
                    clientX: cancelPosition.x,
                    clientY: cancelPosition.y,
                    srcEvent: e,
                });
                return;
            }
            const endPosition = this._endPredicate(e, this);
            if (endPosition) {
                e.preventDefault();
                this._end({
                    type: 'end',
                    clientX: endPosition.x,
                    clientY: endPosition.y,
                    srcEvent: e,
                });
                return;
            }
            const movePosition = this._movePredicate(e, this);
            if (movePosition) {
                e.preventDefault();
                this._move({
                    type: 'move',
                    clientX: movePosition.x,
                    clientY: movePosition.y,
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
            document.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('blur', this.cancel);
            window.removeEventListener('visibilitychange', this.cancel);
            super.destroy();
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

    function isContainingBlock(element) {
        if (getStyle(element, 'position') !== 'static') {
            return true;
        }
        const display = getStyle(element, 'display');
        if (display === 'inline' || display === 'none') {
            return false;
        }
        const transform = getStyle(element, 'transform');
        if (transform && transform !== 'none') {
            return true;
        }
        const perspective = getStyle(element, 'perspective');
        if (perspective && perspective !== 'none') {
            return true;
        }
        const contentVisibility = getStyle(element, 'content-visibility');
        if (contentVisibility && (contentVisibility === 'auto' || contentVisibility === 'hidden')) {
            return true;
        }
        const contain = getStyle(element, 'contain');
        if (contain &&
            (contain === 'strict' ||
                contain === 'content' ||
                contain.indexOf('paint') > -1 ||
                contain.indexOf('layout') > -1)) {
            return true;
        }
        if (!IS_SAFARI) {
            const filter = getStyle(element, 'filter');
            if (filter && filter !== 'none') {
                return true;
            }
            const willChange = getStyle(element, 'will-change');
            if (willChange &&
                (willChange.indexOf('transform') > -1 || willChange.indexOf('perspective') > -1)) {
                return true;
            }
        }
        return false;
    }

    function getContainingBlock(element) {
        let res = element || document;
        while (res && res !== document && !isContainingBlock(element)) {
            res = res.parentElement || document;
        }
        return res;
    }

    function getStyleAsFloat(el, styleProp) {
        return parseFloat(getStyle(el, styleProp)) || 0;
    }

    function getOffset(element, result = { left: 0, top: 0 }) {
        result.left = 0;
        result.top = 0;
        if (element === document)
            return result;
        result.left = window.pageXOffset || 0;
        result.top = window.pageYOffset || 0;
        if ('self' in element && element.self === window.self)
            return result;
        const { left, top } = element.getBoundingClientRect();
        result.left += left;
        result.top += top;
        result.left += getStyleAsFloat(element, 'border-left-width');
        result.top += getStyleAsFloat(element, 'border-top-width');
        return result;
    }

    const offsetA = { left: 0, top: 0 };
    const offsetB = { left: 0, top: 0 };
    function getOffsetDiff(elemA, elemB, result = { left: 0, top: 0 }) {
        result.left = 0;
        result.top = 0;
        if (elemA === elemB)
            return result;
        getOffset(elemA, offsetA);
        getOffset(elemB, offsetB);
        result.left = offsetB.left - offsetA.left;
        result.top = offsetB.top - offsetA.top;
        return result;
    }

    const IDENTITY_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)';
    const IDENTITY_MATRIX_3D = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
    const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;
    const OFFSET_DIFF = { left: 0, top: 0 };
    const POSITION_CHANGE = { x: 0, y: 0 };
    var StartPredicateState;
    (function (StartPredicateState) {
        StartPredicateState[StartPredicateState["PENDING"] = 0] = "PENDING";
        StartPredicateState[StartPredicateState["RESOLVED"] = 1] = "RESOLVED";
        StartPredicateState[StartPredicateState["REJECTED"] = 2] = "REJECTED";
    })(StartPredicateState || (StartPredicateState = {}));
    class DraggableDragItem {
        constructor() {
            this.element = null;
            this.rootParent = null;
            this.rootContainingBlock = null;
            this.dragParent = null;
            this.dragContainingBlock = null;
            this.x = 0;
            this.y = 0;
            this.clientX = 0;
            this.clientY = 0;
            this.syncDiffX = 0;
            this.syncDiffY = 0;
            this.moveDiffX = 0;
            this.moveDiffY = 0;
            this.containerDiffX = 0;
            this.containerDiffY = 0;
        }
    }
    class DraggableDragData {
        constructor() {
            this.sensor = null;
            this.isEnded = false;
            this.isStarted = false;
            this.startEvent = null;
            this.nextMoveEvent = null;
            this.prevMoveEvent = null;
            this.endEvent = null;
            this.items = [];
            this.extraData = {};
        }
    }
    function getDefaultSettings() {
        return {
            container: null,
            startPredicate: () => true,
            getElements: () => null,
            releaseElements: () => { },
            getElementStartPosition: ({ element, draggable }) => {
                const { drag } = draggable;
                if (drag) {
                    const transformMap = drag.extraData.transformMap || new Map();
                    drag.extraData.transformMap = transformMap;
                    const t = getStyle(element, 'transform');
                    if (t && t !== 'none' && t !== IDENTITY_MATRIX && t !== IDENTITY_MATRIX_3D) {
                        transformMap.set(element, t);
                    }
                    else {
                        transformMap.set(element, '');
                    }
                }
                return { x: 0, y: 0 };
            },
            setElementPosition: ({ draggable, element, x, y }) => {
                const { drag } = draggable;
                const transformMap = drag === null || drag === void 0 ? void 0 : drag.extraData.transformMap;
                const initTransform = (transformMap === null || transformMap === void 0 ? void 0 : transformMap.get(element)) || '';
                element.style.transform = `translate(${x}px, ${y}px) ${initTransform}`;
            },
            getElementPositionChange: ({ event, prevEvent }) => {
                POSITION_CHANGE.x = event.clientX - prevEvent.clientX;
                POSITION_CHANGE.y = event.clientY - prevEvent.clientY;
                return POSITION_CHANGE;
            },
        };
    }
    class Draggable {
        constructor(sensors, options = {}) {
            this.sensors = sensors;
            this.settings = this._parseSettings(options);
            this.drag = null;
            this.plugins = new Map();
            this.isDestroyed = false;
            this._sensorData = new Map();
            this._emitter = new eventti.Emitter();
            this._startId = Symbol();
            this._moveId = Symbol();
            this._syncId = Symbol();
            this._onMove = this._onMove.bind(this);
            this._onScroll = this._onScroll.bind(this);
            this._onEnd = this._onEnd.bind(this);
            this._prepareStart = this._prepareStart.bind(this);
            this._applyStart = this._applyStart.bind(this);
            this._prepareMove = this._prepareMove.bind(this);
            this._applyMove = this._applyMove.bind(this);
            this._prepareSynchronize = this._prepareSynchronize.bind(this);
            this._applySynchronize = this._applySynchronize.bind(this);
            this.sensors.forEach((sensor) => {
                this._sensorData.set(sensor, {
                    predicateState: StartPredicateState.PENDING,
                    predicateEvent: null,
                    onMove: (e) => this._onMove(e, sensor),
                    onEnd: (e) => this._onEnd(e, sensor),
                });
                const { onMove, onEnd } = this._sensorData.get(sensor);
                sensor.on('start', onMove);
                sensor.on('move', onMove);
                sensor.on('cancel', onEnd);
                sensor.on('end', onEnd);
                sensor.on('destroy', onEnd);
            });
        }
        _parseSettings(options, defaults = getDefaultSettings()) {
            const { container = defaults.container, startPredicate = defaults.startPredicate, getElements = defaults.getElements, releaseElements = defaults.releaseElements, getElementStartPosition = defaults.getElementStartPosition, setElementPosition = defaults.setElementPosition, getElementPositionChange = defaults.getElementPositionChange, } = options || {};
            return {
                container,
                startPredicate,
                getElements,
                releaseElements,
                getElementStartPosition,
                setElementPosition,
                getElementPositionChange,
            };
        }
        _emit(type, ...e) {
            this._emitter.emit(type, ...e);
        }
        _onMove(e, sensor) {
            const sensorData = this._sensorData.get(sensor);
            if (!sensorData)
                return;
            switch (sensorData.predicateState) {
                case StartPredicateState.PENDING: {
                    sensorData.predicateEvent = e;
                    const shouldStart = this.settings.startPredicate({
                        draggable: this,
                        sensor,
                        event: e,
                    });
                    if (shouldStart === true) {
                        this.resolveStartPredicate(sensor);
                    }
                    else if (shouldStart === false) {
                        this.rejectStartPredicate(sensor);
                    }
                    break;
                }
                case StartPredicateState.RESOLVED: {
                    if (this.drag) {
                        this.drag.nextMoveEvent = e;
                        ticker.once(tickerReadPhase, this._prepareMove, this._moveId);
                        ticker.once(tickerWritePhase, this._applyMove, this._moveId);
                    }
                    break;
                }
            }
        }
        _onScroll() {
            this.synchronize();
        }
        _onEnd(e, sensor) {
            const sensorData = this._sensorData.get(sensor);
            if (!sensorData)
                return;
            if (!this.drag) {
                sensorData.predicateState = StartPredicateState.PENDING;
                sensorData.predicateEvent = null;
            }
            else if (sensorData.predicateState === StartPredicateState.RESOLVED) {
                this.drag.endEvent = e;
                this._sensorData.forEach((data) => {
                    data.predicateState = StartPredicateState.PENDING;
                    data.predicateEvent = null;
                });
                this.stop();
            }
        }
        _prepareStart() {
            const { drag } = this;
            if (!drag || !drag.startEvent)
                return;
            const elements = this.settings.getElements({
                draggable: this,
                sensor: drag.sensor,
                startEvent: drag.startEvent,
            }) || [];
            drag.items = elements.map((element) => {
                if (!element.isConnected) {
                    throw new Error('Element is not connected');
                }
                const item = new DraggableDragItem();
                item.element = element;
                const rootParent = element.parentNode;
                item.rootParent = rootParent;
                const rootContainingBlock = getContainingBlock(rootParent);
                item.rootContainingBlock = rootContainingBlock;
                const dragParent = this.settings.container || rootParent;
                item.dragParent = dragParent;
                const dragContainingBlock = dragParent === rootParent ? rootContainingBlock : getContainingBlock(dragParent);
                item.dragContainingBlock = dragContainingBlock;
                const { x, y } = this.settings.getElementStartPosition({
                    draggable: this,
                    sensor: drag.sensor,
                    element,
                });
                item.x = x;
                item.y = y;
                const clientRect = element.getBoundingClientRect();
                item.clientX = clientRect.left;
                item.clientY = clientRect.top;
                if (rootContainingBlock !== dragContainingBlock) {
                    const { left, top } = getOffsetDiff(dragContainingBlock, rootContainingBlock, OFFSET_DIFF);
                    item.containerDiffX = left;
                    item.containerDiffY = top;
                }
                return item;
            });
        }
        _applyStart() {
            const drag = this.drag;
            if (!drag || !drag.startEvent)
                return;
            this._emit('beforestart', drag.startEvent);
            if (this.drag !== drag)
                return;
            const { container } = this.settings;
            if (container) {
                for (const item of drag.items) {
                    if (!item.element)
                        continue;
                    if (item.element.parentNode !== container) {
                        container.appendChild(item.element);
                        item.x += item.containerDiffX;
                        item.y += item.containerDiffY;
                    }
                    this.settings.setElementPosition({
                        phase: 'start',
                        draggable: this,
                        sensor: drag.sensor,
                        element: item.element,
                        x: item.x,
                        y: item.y,
                    });
                }
            }
            window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);
            drag.isStarted = true;
            this._emit('start', drag.startEvent);
        }
        _prepareMove() {
            const { drag } = this;
            if (!drag || !drag.startEvent)
                return;
            const nextEvent = drag.nextMoveEvent;
            const prevEvent = drag.prevMoveEvent || drag.startEvent;
            if (!nextEvent || nextEvent === prevEvent)
                return;
            for (const item of drag.items) {
                if (!item.element)
                    continue;
                const { x: changeX, y: changeY } = this.settings.getElementPositionChange({
                    draggable: this,
                    sensor: drag.sensor,
                    element: item.element,
                    startEvent: drag.startEvent,
                    prevEvent,
                    event: nextEvent,
                });
                if (changeX) {
                    item.x = item.x - item.moveDiffX + changeX;
                    item.clientX = item.clientX - item.moveDiffX + changeX;
                    item.moveDiffX = changeX;
                }
                if (changeY) {
                    item.y = item.y - item.moveDiffY + changeY;
                    item.clientY = item.clientY - item.moveDiffY + changeY;
                    item.moveDiffY = changeY;
                }
            }
            drag.prevMoveEvent = nextEvent;
        }
        _applyMove() {
            const { drag } = this;
            if (!drag || !drag.nextMoveEvent)
                return;
            for (const item of drag.items) {
                item.moveDiffX = 0;
                item.moveDiffY = 0;
            }
            this._emit('beforemove', drag.nextMoveEvent);
            if (this.drag !== drag)
                return;
            for (const item of drag.items) {
                if (!item.element)
                    continue;
                this.settings.setElementPosition({
                    phase: 'move',
                    draggable: this,
                    sensor: drag.sensor,
                    element: item.element,
                    x: item.x,
                    y: item.y,
                });
            }
            this._emit('move', drag.nextMoveEvent);
        }
        _prepareSynchronize() {
            const { drag } = this;
            if (!drag)
                return;
            for (const item of drag.items) {
                if (!item.element)
                    continue;
                if (item.rootContainingBlock !== item.dragContainingBlock) {
                    const { left, top } = getOffsetDiff(item.dragContainingBlock, item.rootContainingBlock, OFFSET_DIFF);
                    item.containerDiffX = left;
                    item.containerDiffY = top;
                }
                const { left, top } = item.element.getBoundingClientRect();
                const syncDiffX = item.clientX - item.moveDiffX - left;
                item.x = item.x - item.syncDiffX + syncDiffX;
                item.syncDiffX = syncDiffX;
                const syncDiffY = item.clientY - item.moveDiffY - top;
                item.y = item.y - item.syncDiffY + syncDiffY;
                item.syncDiffY = syncDiffY;
            }
        }
        _applySynchronize() {
            const { drag } = this;
            if (!drag)
                return;
            for (const item of drag.items) {
                if (!item.element)
                    continue;
                item.syncDiffX = 0;
                item.syncDiffY = 0;
                this.settings.setElementPosition({
                    phase: 'move',
                    draggable: this,
                    sensor: drag.sensor,
                    element: item.element,
                    x: item.x,
                    y: item.y,
                });
            }
        }
        on(eventName, listener, listenerId) {
            return this._emitter.on(eventName, listener, listenerId);
        }
        off(eventName, listener) {
            this._emitter.off(eventName, listener);
        }
        synchronize(syncImmediately = false) {
            if (!this.drag)
                return;
            if (syncImmediately) {
                this._prepareSynchronize();
                this._applySynchronize();
            }
            else {
                ticker.once(tickerReadPhase, this._prepareSynchronize, this._syncId);
                ticker.once(tickerWritePhase, this._applySynchronize, this._syncId);
            }
        }
        resolveStartPredicate(sensor, e) {
            const sensorData = this._sensorData.get(sensor);
            if (!sensorData)
                return;
            const startEvent = e || sensorData.predicateEvent;
            if (sensorData.predicateState === StartPredicateState.PENDING && startEvent) {
                sensorData.predicateState = StartPredicateState.RESOLVED;
                sensorData.predicateEvent = null;
                this.drag = new DraggableDragData();
                this.drag.sensor = sensor;
                this.drag.startEvent = startEvent;
                this._sensorData.forEach((data, s) => {
                    if (s === sensor)
                        return;
                    data.predicateState = StartPredicateState.REJECTED;
                    data.predicateEvent = null;
                });
                ticker.once(tickerReadPhase, this._prepareStart, this._startId);
                ticker.once(tickerWritePhase, this._applyStart, this._startId);
            }
        }
        rejectStartPredicate(sensor) {
            const sensorData = this._sensorData.get(sensor);
            if ((sensorData === null || sensorData === void 0 ? void 0 : sensorData.predicateState) === StartPredicateState.PENDING) {
                sensorData.predicateState = StartPredicateState.REJECTED;
                sensorData.predicateEvent = null;
            }
        }
        stop() {
            const { drag } = this;
            if (!drag || drag.isEnded)
                return;
            drag.isEnded = true;
            this._emit('beforeend', drag.endEvent);
            ticker.off(tickerReadPhase, this._startId);
            ticker.off(tickerWritePhase, this._startId);
            ticker.off(tickerReadPhase, this._moveId);
            ticker.off(tickerWritePhase, this._moveId);
            ticker.off(tickerReadPhase, this._syncId);
            ticker.off(tickerWritePhase, this._syncId);
            if (drag.isStarted) {
                window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);
                const elements = [];
                for (const item of drag.items) {
                    if (!item.element)
                        continue;
                    elements.push(item.element);
                    if (item.rootParent && item.element.parentNode !== item.rootParent) {
                        item.x -= item.containerDiffX;
                        item.y -= item.containerDiffY;
                        item.containerDiffX = 0;
                        item.containerDiffY = 0;
                        item.rootParent.appendChild(item.element);
                    }
                    this.settings.setElementPosition({
                        phase: 'end',
                        draggable: this,
                        sensor: drag.sensor,
                        element: item.element,
                        x: item.x,
                        y: item.y,
                    });
                }
                if (elements.length) {
                    this.settings.releaseElements({
                        draggable: this,
                        sensor: drag.sensor,
                        elements,
                    });
                }
            }
            this._emit('end', drag.endEvent);
            this.drag = null;
        }
        updateSettings(options = {}) {
            this.settings = this._parseSettings(options, this.settings);
        }
        use(plugin) {
            const pluginInstance = plugin(this);
            if (!pluginInstance.name) {
                throw new Error('Plugin has no name.');
            }
            if (this.plugins.has(pluginInstance.name)) {
                throw new Error(`${pluginInstance.name} plugin is already added.`);
            }
            this.plugins.set(pluginInstance.name, pluginInstance);
            return this;
        }
        destroy() {
            if (this.isDestroyed)
                return;
            this.isDestroyed = true;
            this.stop();
            this._sensorData.forEach(({ onMove, onEnd }, sensor) => {
                sensor.off('start', onMove);
                sensor.off('move', onMove);
                sensor.off('cancel', onEnd);
                sensor.off('end', onEnd);
                sensor.off('destroy', onEnd);
            });
            this._sensorData.clear();
            this._emit('destroy');
            this._emitter.off();
        }
    }

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
        return !(a.left + a.width <= b.left ||
            b.left + b.width <= a.left ||
            a.top + a.height <= b.top ||
            b.top + b.height <= a.top);
    }

    function getIntersectionArea(a, b) {
        if (!isRectsOverlapping(a, b))
            return 0;
        const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
        const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
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

    function getScrollTop(element) {
        return isWindow(element) ? element.pageYOffset : element.scrollTop;
    }

    function getScrollLeftMax(element) {
        if (isWindow(element)) {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
        }
        else {
            return element.scrollWidth - element.clientWidth;
        }
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
            let xScore = 0;
            let xDirection = AUTO_SCROLL_DIRECTION.none;
            let xDistance = 0;
            let xMaxScroll = 0;
            let yElement = null;
            let yPriority = -Infinity;
            let yThreshold = 0;
            let yScore = 0;
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
                const testScore = getIntersectionScore(itemRect, testRect);
                if (testScore <= 0)
                    continue;
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
                const testScore = getIntersectionScore(itemRect, testRect);
                if (testScore <= 0) {
                    break;
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
                if (hasReachedEnd) {
                    break;
                }
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

    const SCROLLABLE_OVERFLOWS = new Set(['auto', 'scroll', 'overlay']);
    function isScrollable(element) {
        return !!(SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow')) ||
            SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow-x')) ||
            SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow-y')));
    }

    function getScrollableAncestors(element, result = []) {
        let parent = null;
        while (element) {
            parent = element.parentNode;
            if (!parent || parent instanceof Document) {
                break;
            }
            element = 'host' in parent ? parent.host : parent;
            if (isScrollable(element)) {
                result.push(element);
            }
        }
        result.push(window);
        return result;
    }

    function getScrollables(element) {
        const scrollables = [];
        if (isScrollable(element)) {
            scrollables.push(element);
        }
        getScrollableAncestors(element, scrollables);
        return scrollables;
    }
    function createPointerSensorStartPredicate(options = {}) {
        let dragAllowed = undefined;
        let startTimeStamp = 0;
        let targetElement = null;
        let timer = undefined;
        const { timeout = 250, fallback = () => true } = options;
        const onContextMenu = (e) => e.preventDefault();
        const onTouchMove = (e) => {
            if (!startTimeStamp)
                return;
            if (dragAllowed) {
                e.cancelable && e.preventDefault();
                return;
            }
            if (dragAllowed === undefined) {
                if (e.cancelable && e.timeStamp - startTimeStamp > timeout) {
                    dragAllowed = true;
                    e.preventDefault();
                }
                else {
                    dragAllowed = false;
                }
            }
        };
        const pointerSensorStartPredicate = (data) => {
            if (!(data.sensor instanceof PointerSensor)) {
                return fallback(data);
            }
            const { draggable, sensor, event } = data;
            const e = event;
            if (e.pointerType === 'touch') {
                if (e.type === 'start' &&
                    (e.srcEvent.type === 'pointerdown' || e.srcEvent.type === 'touchstart')) {
                    targetElement = e.target;
                    const scrollables = targetElement ? getScrollables(targetElement) : [];
                    scrollables.forEach((scrollable) => {
                        scrollable.addEventListener('touchmove', onTouchMove, {
                            passive: false,
                            capture: true,
                        });
                    });
                    const dragEndListener = () => {
                        if (!startTimeStamp)
                            return;
                        draggable.off('beforeend', dragEndListener);
                        draggable.sensors.forEach((sensor) => {
                            if (sensor instanceof PointerSensor) {
                                sensor.off('end', dragEndListener);
                            }
                        });
                        targetElement === null || targetElement === void 0 ? void 0 : targetElement.removeEventListener('contextmenu', onContextMenu);
                        scrollables.forEach((scrollable) => {
                            scrollable.removeEventListener('touchmove', onTouchMove, {
                                capture: true,
                            });
                        });
                        startTimeStamp = 0;
                        dragAllowed = undefined;
                        targetElement = null;
                        timer = void window.clearTimeout(timer);
                    };
                    dragAllowed = undefined;
                    startTimeStamp = e.srcEvent.timeStamp;
                    targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener('contextmenu', onContextMenu);
                    draggable.on('beforeend', dragEndListener);
                    draggable.sensors.forEach((sensor) => {
                        if (sensor instanceof PointerSensor) {
                            sensor.off('end', dragEndListener);
                        }
                    });
                    if (timeout > 0) {
                        timer = window.setTimeout(() => {
                            draggable.resolveStartPredicate(sensor);
                            dragAllowed = true;
                            timer = undefined;
                        }, timeout);
                    }
                }
                return dragAllowed;
            }
            if (e.type === 'start' && !e.srcEvent.button) {
                return true;
            }
            else {
                return false;
            }
        };
        return pointerSensorStartPredicate;
    }

    describe('foo', () => {
        it(`bar`, () => {
            const pointerSensor = new PointerSensor(document.createElement('div'));
            const keyboardSensor = new KeyboardSensor();
            const draggable = new Draggable([keyboardSensor, pointerSensor], {
                getElementPositionChange: () => {
                    return { x: 0, y: 0 };
                },
                startPredicate: createPointerSensorStartPredicate(),
            });
            console.log(PointerSensor, Draggable, draggable);
            chai.assert.equal(1, 1);
        });
    });

}));
