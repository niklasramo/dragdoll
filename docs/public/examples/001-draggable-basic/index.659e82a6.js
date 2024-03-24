const $805227e408b1eeef$export$61fde4a8bbe7f5d5 = {
    start: "start",
    move: "move",
    cancel: "cancel",
    end: "end",
    destroy: "destroy"
};


var $088d3595c1e06dc8$export$242b5ede4c93f7ba = {
    ADD: "add",
    UPDATE: "update",
    IGNORE: "ignore",
    THROW: "throw"
}, $088d3595c1e06dc8$export$4293555f241ae35a = class {
    constructor(n = {}){
        let { dedupe: t = $088d3595c1e06dc8$export$242b5ede4c93f7ba.ADD, getId: e = ()=>Symbol() } = n;
        this.dedupe = t, this.getId = e, this._events = new Map;
    }
    _getListeners(n) {
        let t = this._events.get(n);
        if (t) {
            let { idMap: e } = t;
            if (e.size) return t.emitList = t.emitList || [
                ...e.values()
            ];
        }
        return null;
    }
    on(n, t, e) {
        let { _events: s } = this, i = s.get(n);
        i || (i = {
            idMap: new Map,
            emitList: null
        }, s.set(n, i));
        let { idMap: d, emitList: o } = i;
        if (e = e === void 0 ? this.getId(t) : e, d.has(e)) switch(this.dedupe){
            case $088d3595c1e06dc8$export$242b5ede4c93f7ba.THROW:
                throw new Error("Eventti: duplicate listener id!");
            case $088d3595c1e06dc8$export$242b5ede4c93f7ba.IGNORE:
                return e;
            case $088d3595c1e06dc8$export$242b5ede4c93f7ba.UPDATE:
                i.emitList = null;
                break;
            default:
                d.delete(e), i.emitList = null;
        }
        return d.set(e, t), o?.push(t), e;
    }
    once(n, t, e) {
        let s = !1;
        return e = e === void 0 ? this.getId(t) : e, this.on(n, (...i)=>{
            s || (s = !0, this.off(n, e), t(...i));
        }, e);
    }
    off(n, t) {
        if (n === void 0) {
            this._events.clear();
            return;
        }
        if (t === void 0) {
            this._events.delete(n);
            return;
        }
        let e = this._events.get(n);
        e && e.idMap.delete(t) && (e.emitList = null, e.idMap.size || this._events.delete(n));
    }
    emit(n, ...t) {
        let e = this._getListeners(n);
        if (!e) return;
        let { length: s } = e;
        if (t.length) {
            if (s === 1) e[0](...t);
            else {
                let i = 0;
                for(; i < s; i++)e[i](...t);
            }
        } else if (s === 1) e[0]();
        else {
            let i = 0;
            for(; i < s; i++)e[i]();
        }
    }
    listenerCount(n) {
        if (n === void 0) {
            let t = 0;
            return this._events.forEach((e, s)=>{
                t += this.listenerCount(s);
            }), t;
        }
        return this._events.get(n)?.idMap.size || 0;
    }
};



class $54ea790b4548258e$export$2176a6ff266bf511 {
    constructor(){
        this.drag = null;
        this.isDestroyed = false;
        this._emitter = new (0, $088d3595c1e06dc8$export$4293555f241ae35a)();
    }
    _createDragData(data) {
        return {
            x: data.x,
            y: data.y
        };
    }
    _updateDragData(data) {
        if (!this.drag) return;
        this.drag.x = data.x;
        this.drag.y = data.y;
    }
    _resetDragData() {
        this.drag = null;
    }
    _start(data) {
        if (this.isDestroyed || this.drag) return;
        this.drag = this._createDragData(data);
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).start, data);
    }
    _move(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).move, data);
    }
    _end(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).end, data);
        this._resetDragData();
    }
    _cancel(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).cancel, data);
        this._resetDragData();
    }
    on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    cancel() {
        if (!this.drag) return;
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).cancel, {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).cancel,
            x: this.drag.x,
            y: this.drag.y
        });
        this._resetDragData();
    }
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.cancel();
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).destroy, {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).destroy
        });
        this._emitter.off();
    }
}




var $feba8261fab8f8f1$export$815e2a1977260d23 = (0, $088d3595c1e06dc8$export$242b5ede4c93f7ba), $feba8261fab8f8f1$export$39c54bcc89dcee11 = class {
    constructor(e = {}){
        let { phases: t = [], dedupe: r, getId: s } = e;
        this._phases = t, this._emitter = new (0, $088d3595c1e06dc8$export$4293555f241ae35a)({
            getId: s,
            dedupe: r
        }), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
    }
    get phases() {
        return this._phases;
    }
    set phases(e) {
        this._phases = e;
    }
    get dedupe() {
        return this._emitter.dedupe;
    }
    set dedupe(e) {
        this._emitter.dedupe = e;
    }
    get getId() {
        return this._emitter.getId;
    }
    set getId(e) {
        this._emitter.getId = e;
    }
    tick(...e) {
        this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e);
    }
    on(e, t, r) {
        return this._emitter.on(e, t, r);
    }
    once(e, t, r) {
        return this._emitter.once(e, t, r);
    }
    off(e, t) {
        return this._emitter.off(e, t);
    }
    count(e) {
        return this._emitter.listenerCount(e);
    }
    _assertEmptyQueue() {
        if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
    }
    _fillQueue() {
        let e = this._queue, t = this._phases, r = this._getListeners, s = 0, a = t.length, n;
        for(; s < a; s++)n = r(t[s]), n && e.push(n);
        return e;
    }
    _processQueue(...e) {
        let t = this._queue, r = t.length;
        if (!r) return;
        let s = 0, a = 0, n, c;
        for(; s < r; s++)for(n = t[s], a = 0, c = n.length; a < c; a++)n[a](...e);
        t.length = 0;
    }
};
function $feba8261fab8f8f1$export$789135d3cf084551(i = 60) {
    if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e)=>{
        let t = requestAnimationFrame(e);
        return ()=>cancelAnimationFrame(t);
    };
    {
        let e = 1e3 / i, t = typeof performance > "u" ? ()=>Date.now() : ()=>performance.now();
        return (r)=>{
            let s = setTimeout(()=>r(t()), e);
            return ()=>clearTimeout(s);
        };
    }
}
var $feba8261fab8f8f1$export$bf5a5397711dbf71 = class extends $feba8261fab8f8f1$export$39c54bcc89dcee11 {
    constructor(e = {}){
        let { paused: t = !1, onDemand: r = !1, requestFrame: s = $feba8261fab8f8f1$export$789135d3cf084551(), ...a } = e;
        super(a), this._paused = t, this._onDemand = r, this._requestFrame = s, this._cancelFrame = null, this._empty = !0, !t && !r && this._request();
    }
    get phases() {
        return this._phases;
    }
    set phases(e) {
        this._phases = e, e.length ? (this._empty = !1, this._request()) : this._empty = !0;
    }
    get paused() {
        return this._paused;
    }
    set paused(e) {
        this._paused = e, e ? this._cancel() : this._request();
    }
    get onDemand() {
        return this._onDemand;
    }
    set onDemand(e) {
        this._onDemand = e, e || this._request();
    }
    get requestFrame() {
        return this._requestFrame;
    }
    set requestFrame(e) {
        this._requestFrame !== e && (this._requestFrame = e, this._cancelFrame && (this._cancel(), this._request()));
    }
    tick(...e) {
        if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
            if (!this._fillQueue().length) {
                this._empty = !0;
                return;
            }
            this._onDemand && this._request(), this._processQueue(...e);
        }
    }
    on(e, t, r) {
        let s = super.on(e, t, r);
        return this._empty = !1, this._request(), s;
    }
    once(e, t, r) {
        let s = super.once(e, t, r);
        return this._empty = !1, this._request(), s;
    }
    _request() {
        this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
    }
    _cancel() {
        this._cancelFrame && (this._cancelFrame(), this._cancelFrame = null);
    }
};
function $feba8261fab8f8f1$export$4d497fac909c98f0(i) {
    return (e)=>{
        let t = i.requestAnimationFrame(e);
        return ()=>i.cancelAnimationFrame(t);
    };
}


let $8c2d7f782ca4b6c1$export$9138efc7ba4fca22 = Symbol();
let $8c2d7f782ca4b6c1$export$5fd1e257088db342 = Symbol();
let $8c2d7f782ca4b6c1$export$e94d57566be028aa = new (0, $feba8261fab8f8f1$export$bf5a5397711dbf71)({
    phases: [
        $8c2d7f782ca4b6c1$export$9138efc7ba4fca22,
        $8c2d7f782ca4b6c1$export$5fd1e257088db342
    ]
});
function $8c2d7f782ca4b6c1$export$9bc58717d06262f5(newTicker, readPhase, writePhase) {
    $8c2d7f782ca4b6c1$export$9138efc7ba4fca22 = readPhase;
    $8c2d7f782ca4b6c1$export$5fd1e257088db342 = writePhase;
    $8c2d7f782ca4b6c1$export$e94d57566be028aa = newTicker;
}


class $e750ffefa3390919$export$2f0ad9ba2f0800d extends (0, $54ea790b4548258e$export$2176a6ff266bf511) {
    constructor(){
        super();
        this.drag = null;
        this._direction = {
            x: 0,
            y: 0
        };
        this._speed = 0;
        this._tick = this._tick.bind(this);
    }
    _createDragData(data) {
        return {
            ...super._createDragData(data),
            time: 0,
            deltaTime: 0
        };
    }
    _start(data) {
        if (this.isDestroyed || this.drag) return;
        super._start(data);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).on((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._tick, this._tick);
    }
    _end(data) {
        if (!this.drag) return;
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._tick);
        super._end(data);
    }
    _cancel(data) {
        if (!this.drag) return;
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._tick);
        super._cancel(data);
    }
    _tick(time) {
        if (!this.drag) return;
        if (time && this.drag.time) {
            // Update tick time and delta time.
            this.drag.deltaTime = time - this.drag.time;
            this.drag.time = time;
            // Emit tick event.
            const tickEvent = {
                type: "tick",
                time: this.drag.time,
                deltaTime: this.drag.deltaTime
            };
            this._emitter.emit("tick", tickEvent);
            // Make sure the sensor is still active.
            if (!this.drag) return;
            // Compute the movement offset (delta) by applying time factor to
            // the speed. The speed is assumed to be provided as pixels-per-second.
            const speedFactor = this._speed * (this.drag.deltaTime / 1000);
            const deltaX = this._direction.x * speedFactor;
            const deltaY = this._direction.y * speedFactor;
            // Trigger move event if the clientX/Y needs change. Note that calling
            // this._move() automatically updates clientX/Y values also so we don't
            // need to do it here.
            if (deltaX || deltaY) this._move({
                type: "move",
                x: this.drag.x + deltaX,
                y: this.drag.y + deltaY
            });
        } else {
            this.drag.time = time;
            this.drag.deltaTime = 0;
        }
    }
}




function $f5165be5e83fa7ff$export$6e8069a9617a39e2(e, id) {
    // If we have a pointer event return the whole event if there's a match, and
    // null otherwise.
    if ("pointerId" in e) return e.pointerId === id ? e : null;
    // For touch events let's check if there's a changed touch object that matches
    // the pointerId in which case return the touch object.
    if ("changedTouches" in e) {
        let i = 0;
        for(; i < e.changedTouches.length; i++){
            if (e.changedTouches[i].identifier === id) return e.changedTouches[i];
        }
        return null;
    }
    // For mouse/other events let's assume there's only one pointer and just
    // return the event.
    return e;
}


function $76ede048909e0151$export$887a228355cf7d95(e) {
    return "pointerType" in e ? e.pointerType : "touches" in e ? "touch" : "mouse";
}


function $243ecfc9ee8e079b$export$a845ff6c553b3014(e) {
    // If we have pointer id available let's use it.
    if ("pointerId" in e) return e.pointerId;
    // For touch events let's get the first changed touch's identifier.
    if ("changedTouches" in e) return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
    // For mouse/other events let's provide a static id. And let's make it a
    // negative number so it has it has not chance of clashing with touch/pointer
    // ids.
    return -1;
}


const $7561e0e34050a3b8$export$e44ffb50cc242ec5 = typeof window !== "undefined" && typeof window.document !== "undefined";
const $7561e0e34050a3b8$export$ffcf6b6ce241bd05 = (()=>{
    let isPassiveEventsSupported = false;
    try {
        const passiveOpts = Object.defineProperty({}, "passive", {
            get: function() {
                isPassiveEventsSupported = true;
            }
        });
        // @ts-ignore
        window.addEventListener("testPassive", null, passiveOpts);
        // @ts-ignore
        window.removeEventListener("testPassive", null, passiveOpts);
    } catch (e) {}
    return isPassiveEventsSupported;
})();
const $7561e0e34050a3b8$export$4af9b1d833a619de = $7561e0e34050a3b8$export$e44ffb50cc242ec5 && "ontouchstart" in window;
const $7561e0e34050a3b8$export$7728c852ca75bb6d = $7561e0e34050a3b8$export$e44ffb50cc242ec5 && !!window.PointerEvent;
const $7561e0e34050a3b8$export$af54264dae9065e6 = !!($7561e0e34050a3b8$export$e44ffb50cc242ec5 && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1);


function $87864baaa7f24788$export$4d6c83612522bb80(options = {}) {
    const { capture: capture = true, passive: passive = true } = options;
    if (0, $7561e0e34050a3b8$export$ffcf6b6ce241bd05) return {
        capture: capture,
        passive: passive
    };
    else return {
        capture: capture
    };
}



function $f6710b34df35f4d2$export$6475a94861c59472(sourceEvents) {
    return sourceEvents === "auto" || sourceEvents === undefined ? (0, $7561e0e34050a3b8$export$7728c852ca75bb6d) ? "pointer" : (0, $7561e0e34050a3b8$export$4af9b1d833a619de) ? "touch" : "mouse" : sourceEvents;
}


const $792d52ca200635d4$var$POINTER_EVENTS = {
    start: "pointerdown",
    move: "pointermove",
    cancel: "pointercancel",
    end: "pointerup"
};
const $792d52ca200635d4$var$TOUCH_EVENTS = {
    start: "touchstart",
    move: "touchmove",
    cancel: "touchcancel",
    end: "touchend"
};
const $792d52ca200635d4$var$MOUSE_EVENTS = {
    start: "mousedown",
    move: "mousemove",
    cancel: "",
    end: "mouseup"
};
const $792d52ca200635d4$var$SOURCE_EVENTS = {
    pointer: $792d52ca200635d4$var$POINTER_EVENTS,
    touch: $792d52ca200635d4$var$TOUCH_EVENTS,
    mouse: $792d52ca200635d4$var$MOUSE_EVENTS
};
class $792d52ca200635d4$export$b26af955418d6638 {
    constructor(element, options = {}){
        const { listenerOptions: listenerOptions = {}, sourceEvents: sourceEvents = "auto", startPredicate: startPredicate = (e)=>"button" in e && e.button > 0 ? false : true } = options;
        this.element = element;
        this.drag = null;
        this.isDestroyed = false;
        this._areWindowListenersBound = false;
        this._startPredicate = startPredicate;
        this._listenerOptions = (0, $87864baaa7f24788$export$4d6c83612522bb80)(listenerOptions);
        this._sourceEvents = (0, $f6710b34df35f4d2$export$6475a94861c59472)(sourceEvents);
        this._emitter = new (0, $088d3595c1e06dc8$export$4293555f241ae35a)();
        this._onStart = this._onStart.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onEnd = this._onEnd.bind(this);
        // Listen to start event.
        element.addEventListener($792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
    /**
   * Check if the provided event contains the tracked pointer id or in the case
   * of touch event if the first changed touch is the tracked touch object and
   * return the event or touch object. Otherwise return null.
   */ _getTrackedPointerEventData(e) {
        return this.drag ? (0, $f5165be5e83fa7ff$export$6e8069a9617a39e2)(e, this.drag.pointerId) : null;
    }
    /**
   * Listener for start event.
   */ _onStart(e) {
        if (this.isDestroyed || this.drag) return;
        // Make sure start predicate is fulfilled.
        if (!this._startPredicate(e)) return;
        // Try to get pointer id.
        const pointerId = (0, $243ecfc9ee8e079b$export$a845ff6c553b3014)(e);
        if (pointerId === null) return;
        // Try to get pointer.
        const pointerEventData = (0, $f5165be5e83fa7ff$export$6e8069a9617a39e2)(e, pointerId);
        if (pointerEventData === null) return;
        // Create drag data.
        const dragData = {
            pointerId: pointerId,
            pointerType: (0, $76ede048909e0151$export$887a228355cf7d95)(e),
            x: pointerEventData.clientX,
            y: pointerEventData.clientY
        };
        // Set drag data.
        this.drag = dragData;
        // Emit start event.
        const eventData = {
            ...dragData,
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).start,
            srcEvent: e,
            target: pointerEventData.target
        };
        this._emitter.emit(eventData.type, eventData);
        // If the drag procedure was not reset within the start procedure let's
        // activate the instance (start listening to move/cancel/end events).
        if (this.drag) this._bindWindowListeners();
    }
    /**
   * Listener for move event.
   */ _onMove(e) {
        if (!this.drag) return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData) return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).move,
            srcEvent: e,
            target: pointerEventData.target,
            ...this.drag
        };
        this._emitter.emit(eventData.type, eventData);
    }
    /**
   * Listener for cancel event.
   */ _onCancel(e) {
        if (!this.drag) return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData) return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).cancel,
            srcEvent: e,
            target: pointerEventData.target,
            ...this.drag
        };
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    /**
   * Listener for end event.
   */ _onEnd(e) {
        if (!this.drag) return;
        const pointerEventData = this._getTrackedPointerEventData(e);
        if (!pointerEventData) return;
        this.drag.x = pointerEventData.clientX;
        this.drag.y = pointerEventData.clientY;
        const eventData = {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).end,
            srcEvent: e,
            target: pointerEventData.target,
            ...this.drag
        };
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    /**
   * Bind window event listeners for move/end/cancel.
   */ _bindWindowListeners() {
        if (this._areWindowListenersBound) return;
        const { move: move, end: end, cancel: cancel } = $792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents];
        window.addEventListener(move, this._onMove, this._listenerOptions);
        window.addEventListener(end, this._onEnd, this._listenerOptions);
        if (cancel) window.addEventListener(cancel, this._onCancel, this._listenerOptions);
        this._areWindowListenersBound = true;
    }
    /**
   * Unbind window event listeners for move/end/cancel.
   */ _unbindWindowListeners() {
        if (this._areWindowListenersBound) {
            const { move: move, end: end, cancel: cancel } = $792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents];
            window.removeEventListener(move, this._onMove, this._listenerOptions);
            window.removeEventListener(end, this._onEnd, this._listenerOptions);
            if (cancel) window.removeEventListener(cancel, this._onCancel, this._listenerOptions);
            this._areWindowListenersBound = false;
        }
    }
    /**
   * Reset drag data.
   */ _resetDrag() {
        this.drag = null;
        this._unbindWindowListeners();
    }
    /**
   * Forcefully cancel the drag process.
   */ cancel() {
        if (!this.drag) return;
        const eventData = {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).cancel,
            srcEvent: null,
            target: null,
            ...this.drag
        };
        this._emitter.emit(eventData.type, eventData);
        this._resetDrag();
    }
    /**
   * Update the instance's settings.
   */ updateSettings(options) {
        if (this.isDestroyed) return;
        const { listenerOptions: listenerOptions, sourceEvents: sourceEvents, startPredicate: startPredicate } = options;
        const nextSourceEvents = (0, $f6710b34df35f4d2$export$6475a94861c59472)(sourceEvents);
        const nextListenerOptions = (0, $87864baaa7f24788$export$4d6c83612522bb80)(listenerOptions);
        // Update start predicate if needed.
        if (startPredicate && this._startPredicate !== startPredicate) this._startPredicate = startPredicate;
        // Update listener options and/or source events if needed.
        if (listenerOptions && (this._listenerOptions.capture !== nextListenerOptions.capture || this._listenerOptions.passive === nextListenerOptions.passive) || sourceEvents && this._sourceEvents !== nextSourceEvents) {
            // Unbind start listener.
            this.element.removeEventListener($792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
            // Unbind window listeners.
            this._unbindWindowListeners();
            // Cancel current drag process.
            this.cancel();
            // Update options to instace.
            if (sourceEvents) this._sourceEvents = nextSourceEvents;
            if (listenerOptions && nextListenerOptions) this._listenerOptions = nextListenerOptions;
            // Rebind start listener with new options.
            this.element.addEventListener($792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
        }
    }
    /**
   * Bind a drag event listener.
   */ on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    /**
   * Unbind a drag event listener.
   */ off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    /**
   * Destroy the instance and unbind all drag event listeners.
   */ destroy() {
        if (this.isDestroyed) return;
        // Mark as destroyed.
        this.isDestroyed = true;
        // Cancel any ongoing drag process.
        this.cancel();
        // Emit destroy event.
        this._emitter.emit((0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).destroy, {
            type: (0, $805227e408b1eeef$export$61fde4a8bbe7f5d5).destroy
        });
        // Destroy emitter.
        this._emitter.off();
        // Unbind start event listeners.
        this.element.removeEventListener($792d52ca200635d4$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
}



class $70401cb4f427e35f$export$44d67f2a438aeba9 extends (0, $54ea790b4548258e$export$2176a6ff266bf511) {
    constructor(options = {}){
        super();
        const { moveDistance: moveDistance = 25, startPredicate: startPredicate = (e)=>{
            if (e.key === "Enter" || e.key === " ") {
                if (document.activeElement && document.activeElement !== document.body) {
                    const { left: left, top: top } = document.activeElement.getBoundingClientRect();
                    return {
                        x: left,
                        y: top
                    };
                }
            }
            return null;
        }, movePredicate: movePredicate = (e, sensor, moveDistance)=>{
            if (!sensor.drag) return null;
            switch(e.key){
                case "ArrowLeft":
                    return {
                        x: sensor.drag.x - moveDistance.x,
                        y: sensor.drag.y
                    };
                case "ArrowRight":
                    return {
                        x: sensor.drag.x + moveDistance.x,
                        y: sensor.drag.y
                    };
                case "ArrowUp":
                    return {
                        x: sensor.drag.x,
                        y: sensor.drag.y - moveDistance.y
                    };
                case "ArrowDown":
                    return {
                        x: sensor.drag.x,
                        y: sensor.drag.y + moveDistance.y
                    };
                default:
                    return null;
            }
        }, cancelPredicate: cancelPredicate = (e, sensor)=>{
            if (sensor.drag && e.key === "Escape") return {
                x: sensor.drag.x,
                y: sensor.drag.y
            };
            return null;
        }, endPredicate: endPredicate = (e, sensor)=>{
            if (sensor.drag && (e.key === "Enter" || e.key === " ")) return {
                x: sensor.drag.x,
                y: sensor.drag.y
            };
            return null;
        } } = options;
        this._moveDistance = typeof moveDistance === "number" ? {
            x: moveDistance,
            y: moveDistance
        } : {
            ...moveDistance
        };
        this._startPredicate = startPredicate;
        this._movePredicate = movePredicate;
        this._cancelPredicate = cancelPredicate;
        this._endPredicate = endPredicate;
        this.cancel = this.cancel.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        document.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("blur", this.cancel);
        window.addEventListener("visibilitychange", this.cancel);
    }
    _onKeyDown(e) {
        // Handle start.
        if (!this.drag) {
            const startPosition = this._startPredicate(e, this, this._moveDistance);
            if (startPosition) {
                e.preventDefault();
                this._start({
                    type: "start",
                    x: startPosition.x,
                    y: startPosition.y,
                    srcEvent: e
                });
            }
            return;
        }
        // Handle cancel.
        const cancelPosition = this._cancelPredicate(e, this, this._moveDistance);
        if (cancelPosition) {
            e.preventDefault();
            this._cancel({
                type: "cancel",
                x: cancelPosition.x,
                y: cancelPosition.y,
                srcEvent: e
            });
            return;
        }
        // Handle end.
        const endPosition = this._endPredicate(e, this, this._moveDistance);
        if (endPosition) {
            e.preventDefault();
            this._end({
                type: "end",
                x: endPosition.x,
                y: endPosition.y,
                srcEvent: e
            });
            return;
        }
        // Handle move.
        const movePosition = this._movePredicate(e, this, this._moveDistance);
        if (movePosition) {
            e.preventDefault();
            this._move({
                type: "move",
                x: movePosition.x,
                y: movePosition.y,
                srcEvent: e
            });
            return;
        }
    }
    updateSettings(options = {}) {
        if (options.moveDistance !== undefined) {
            if (typeof options.moveDistance === "number") {
                this._moveDistance.x = options.moveDistance;
                this._moveDistance.y = options.moveDistance;
            } else {
                this._moveDistance.x = options.moveDistance.x;
                this._moveDistance.y = options.moveDistance.y;
            }
        }
        if (options.startPredicate !== undefined) this._startPredicate = options.startPredicate;
        if (options.movePredicate !== undefined) this._movePredicate = options.movePredicate;
        if (options.cancelPredicate !== undefined) this._cancelPredicate = options.cancelPredicate;
        if (options.endPredicate !== undefined) this._endPredicate = options.endPredicate;
    }
    destroy() {
        if (this.isDestroyed) return;
        super.destroy();
        document.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("blur", this.cancel);
        window.removeEventListener("visibilitychange", this.cancel);
    }
}



const $9e75b1bcee5bf187$var$KEY_TYPES = [
    "start",
    "cancel",
    "end",
    "moveLeft",
    "moveRight",
    "moveUp",
    "moveDown"
];
function $9e75b1bcee5bf187$var$getEarliestTimestamp(keys, timestamps) {
    if (!keys.size || !timestamps.size) return Infinity;
    let result = Infinity;
    for (const key of keys){
        const timestamp = timestamps.get(key);
        if (timestamp !== undefined && timestamp < result) result = timestamp;
    }
    return result;
}
class $9e75b1bcee5bf187$export$436f6efcc297171 extends (0, $e750ffefa3390919$export$2f0ad9ba2f0800d) {
    constructor(options = {}){
        super();
        const { startPredicate: startPredicate = ()=>{
            if (document.activeElement) {
                const { left: left, top: top } = document.activeElement.getBoundingClientRect();
                return {
                    x: left,
                    y: top
                };
            }
            return null;
        }, computeSpeed: computeSpeed = ()=>500, startKeys: startKeys = [
            " ",
            "Enter"
        ], moveLeftKeys: moveLeftKeys = [
            "ArrowLeft"
        ], moveRightKeys: moveRightKeys = [
            "ArrowRight"
        ], moveUpKeys: moveUpKeys = [
            "ArrowUp"
        ], moveDownKeys: moveDownKeys = [
            "ArrowDown"
        ], cancelKeys: cancelKeys = [
            "Escape"
        ], endKeys: endKeys = [
            " ",
            "Enter"
        ] } = options;
        this._computeSpeed = computeSpeed;
        this._startPredicate = startPredicate;
        this._startKeys = new Set(startKeys);
        this._cancelKeys = new Set(cancelKeys);
        this._endKeys = new Set(endKeys);
        this._moveLeftKeys = new Set(moveLeftKeys);
        this._moveRightKeys = new Set(moveRightKeys);
        this._moveUpKeys = new Set(moveUpKeys);
        this._moveDownKeys = new Set(moveDownKeys);
        this._moveKeys = new Set([
            ...moveLeftKeys,
            ...moveRightKeys,
            ...moveUpKeys,
            ...moveDownKeys
        ]);
        this._moveKeyTimestamps = new Map();
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTick = this._onTick.bind(this);
        this.on("tick", this._onTick, this._onTick);
        document.addEventListener("keydown", this._onKeyDown);
        document.addEventListener("keyup", this._onKeyUp);
        window.addEventListener("blur", this.cancel);
        window.addEventListener("visibilitychange", this.cancel);
    }
    _end(data) {
        if (!this.drag) return;
        this._moveKeyTimestamps.clear();
        this._direction.x = 0;
        this._direction.y = 0;
        super._end(data);
    }
    _cancel(data) {
        if (!this.drag) return;
        this._moveKeyTimestamps.clear();
        this._direction.x = 0;
        this._direction.y = 0;
        super._cancel(data);
    }
    _updateDirection() {
        const leftTime = $9e75b1bcee5bf187$var$getEarliestTimestamp(this._moveLeftKeys, this._moveKeyTimestamps);
        const rightTime = $9e75b1bcee5bf187$var$getEarliestTimestamp(this._moveRightKeys, this._moveKeyTimestamps);
        const upTime = $9e75b1bcee5bf187$var$getEarliestTimestamp(this._moveUpKeys, this._moveKeyTimestamps);
        const downTime = $9e75b1bcee5bf187$var$getEarliestTimestamp(this._moveDownKeys, this._moveKeyTimestamps);
        let x = leftTime === rightTime ? 0 : leftTime < rightTime ? -1 : 1;
        let y = upTime === downTime ? 0 : upTime < downTime ? -1 : 1;
        // If the direction is NE/NW/SE/SW we need to normalize the direction
        // vector.
        if (!(x === 0 || y === 0)) {
            const normFactor = 1 / (Math.sqrt(x * x + y * y) || 1);
            x *= normFactor;
            y *= normFactor;
        }
        this._direction.x = x;
        this._direction.y = y;
    }
    _onTick() {
        this._speed = this._computeSpeed(this);
    }
    _onKeyUp(e) {
        if (this._moveKeyTimestamps.get(e.key)) {
            this._moveKeyTimestamps.delete(e.key);
            this._updateDirection();
        }
    }
    _onKeyDown(e) {
        // Handle start.
        if (!this.drag) {
            if (this._startKeys.has(e.key)) {
                const startPosition = this._startPredicate(e, this);
                if (startPosition) {
                    e.preventDefault();
                    this._start({
                        type: "start",
                        x: startPosition.x,
                        y: startPosition.y
                    });
                }
            }
            return;
        }
        // Handle cancel.
        if (this._cancelKeys.has(e.key)) {
            e.preventDefault();
            this._cancel({
                type: "cancel",
                x: this.drag.x,
                y: this.drag.y
            });
            return;
        }
        // Handle end.
        if (this._endKeys.has(e.key)) {
            e.preventDefault();
            this._end({
                type: "end",
                x: this.drag.x,
                y: this.drag.y
            });
            return;
        }
        // Handle move.
        if (this._moveKeys.has(e.key)) {
            e.preventDefault();
            if (!this._moveKeyTimestamps.get(e.key)) {
                this._moveKeyTimestamps.set(e.key, Date.now());
                this._updateDirection();
            }
            return;
        }
    }
    updateSettings(options = {}) {
        let moveKeysMayNeedUpdate = false;
        if (options.startPredicate !== undefined) this._startPredicate = options.startPredicate;
        if (options.computeSpeed !== undefined) this._computeSpeed = options.computeSpeed;
        $9e75b1bcee5bf187$var$KEY_TYPES.forEach((keyType, index)=>{
            const name = `${keyType}Keys`;
            const value = options[name];
            if (value !== undefined) {
                this[`_${name}`] = new Set(value);
                if (index >= 3) moveKeysMayNeedUpdate = true;
            }
        });
        if (moveKeysMayNeedUpdate) {
            // Construct the next move keys array.
            const nextMoveKeys = [
                ...this._moveLeftKeys,
                ...this._moveRightKeys,
                ...this._moveUpKeys,
                ...this._moveDownKeys
            ];
            // Check if the next move keys are equal to the current ones.
            const areMoveKeysEqual = [
                ...this._moveKeys
            ].every((key, index)=>nextMoveKeys[index] === key);
            // Update move keys if needed.
            if (!areMoveKeysEqual) {
                this._moveKeys = new Set(nextMoveKeys);
                this._moveKeyTimestamps.clear();
                this._updateDirection();
            }
        }
    }
    destroy() {
        if (this.isDestroyed) return;
        super.destroy();
        this.off("tick", this._onTick);
        document.removeEventListener("keydown", this._onKeyDown);
        document.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener("blur", this.cancel);
        window.removeEventListener("visibilitychange", this.cancel);
    }
}




class $d353d5806c14ac2c$export$12e4b40eac1bcb71 {
    constructor(sensor, startEvent){
        this.sensor = sensor;
        this.isEnded = false;
        this.event = startEvent;
        this.prevEvent = startEvent;
        this.startEvent = startEvent;
        this.endEvent = null;
        this.items = [];
    }
}


const $d89c0845f164a4bf$var$STYLE_DECLARATION_CACHE = new WeakMap;
function $d89c0845f164a4bf$export$3d2f074408bd1b82(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let C = $d89c0845f164a4bf$var$STYLE_DECLARATION_CACHE.get(e)?.deref();
    return C || (C = window.getComputedStyle(e, null), $d89c0845f164a4bf$var$STYLE_DECLARATION_CACHE.set(e, new WeakRef(C))), C;
}


const $73b86597f1534ba9$export$e44ffb50cc242ec5 = "undefined" != typeof window && void 0 !== window.document;
const $73b86597f1534ba9$export$af54264dae9065e6 = !!($73b86597f1534ba9$export$e44ffb50cc242ec5 && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
const $73b86597f1534ba9$export$11fd24d838ebde87 = {
    content: "content",
    padding: "padding",
    scrollbar: "scrollbar",
    border: "border",
    margin: "margin"
};
const $73b86597f1534ba9$export$76e909bcfd8ba196 = {
    [$73b86597f1534ba9$export$11fd24d838ebde87.content]: !1,
    [$73b86597f1534ba9$export$11fd24d838ebde87.padding]: !1,
    [$73b86597f1534ba9$export$11fd24d838ebde87.scrollbar]: !0,
    [$73b86597f1534ba9$export$11fd24d838ebde87.border]: !0,
    [$73b86597f1534ba9$export$11fd24d838ebde87.margin]: !0
};
const $73b86597f1534ba9$export$d2ad2856e215d28e = new Set([
    "auto",
    "scroll"
]);
const $73b86597f1534ba9$export$cd414719242f618c = (()=>{
    try {
        return window.navigator.userAgentData.brands.some(({ brand: n })=>"Chromium" === n);
    } catch (n) {
        return !1;
    }
})();




function $2117b79b8a03d08f$export$fab73c3646bf1f5e(e) {
    switch((0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(e).display){
        case "none":
            return null;
        case "inline":
        case "contents":
            return !1;
        default:
            return !0;
    }
}


function $4d79c833256785a2$export$e5ce114ae0e5f4e8(n) {
    const t = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(n);
    if (!(0, $73b86597f1534ba9$export$af54264dae9065e6)) {
        const { filter: n } = t;
        if (n && "none" !== n) return !0;
        const { backdropFilter: e } = t;
        if (e && "none" !== e) return !0;
        const { willChange: i } = t;
        if (i && (i.indexOf("filter") > -1 || i.indexOf("backdrop-filter") > -1)) return !0;
    }
    const e = (0, $2117b79b8a03d08f$export$fab73c3646bf1f5e)(n);
    if (!e) return e;
    const { transform: i } = t;
    if (i && "none" !== i) return !0;
    const { perspective: r } = t;
    if (r && "none" !== r) return !0;
    const { contentVisibility: o } = t;
    if (o && "auto" === o) return !0;
    const { contain: f } = t;
    if (f && ("strict" === f || "content" === f || f.indexOf("paint") > -1 || f.indexOf("layout") > -1)) return !0;
    const { willChange: c } = t;
    return !(!c || !(c.indexOf("transform") > -1 || c.indexOf("perspective") > -1 || c.indexOf("contain") > -1)) || !!((0, $73b86597f1534ba9$export$af54264dae9065e6) && c && c.indexOf("filter") > -1);
}




function $f1ae4c5aa2a8b518$export$996cb64f2dabb66f(t) {
    return "static" !== (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(t).position || (0, $4d79c833256785a2$export$e5ce114ae0e5f4e8)(t);
}



function $9f157138ba57e1f1$export$d8a62a489b442872(e) {
    return e instanceof HTMLHtmlElement;
}


function $edd10e7a206ac733$export$940d8225183e1404(e, t = {}) {
    if ((0, $9f157138ba57e1f1$export$d8a62a489b442872)(e)) return e.ownerDocument.defaultView;
    const n = t.position || (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(e).position, { skipDisplayNone: i, container: o } = t;
    switch(n){
        case "static":
        case "relative":
        case "sticky":
        case "-webkit-sticky":
            {
                let t = o || e.parentElement;
                for(; t;){
                    const e = (0, $2117b79b8a03d08f$export$fab73c3646bf1f5e)(t);
                    if (e) return t;
                    if (null === e && !i) return null;
                    t = t.parentElement;
                }
                return e.ownerDocument.documentElement;
            }
        case "absolute":
        case "fixed":
            {
                const t = "fixed" === n;
                let l = o || e.parentElement;
                for(; l;){
                    const e = t ? (0, $4d79c833256785a2$export$e5ce114ae0e5f4e8)(l) : (0, $f1ae4c5aa2a8b518$export$996cb64f2dabb66f)(l);
                    if (!0 === e) return l;
                    if (null === e && !i) return null;
                    l = l.parentElement;
                }
                return e.ownerDocument.defaultView;
            }
        default:
            return null;
    }
}


function $88f238e74afc3d48$export$8d3dd0be5eb9f11f(t, e) {
    return !(t.left + t.width <= e.left || e.left + e.width <= t.left || t.top + t.height <= e.top || e.top + e.height <= t.top);
}


function $191fedb0176831f8$export$53137579a3174918(t, e, n, o) {
    return Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - e, 2));
}


function $02b8930067ac211c$export$2d670be792dba464(t, e) {
    if ((0, $88f238e74afc3d48$export$8d3dd0be5eb9f11f)(t, e)) return null;
    const n = t.left + t.width, i = t.top + t.height, o = e.left + e.width, s = e.top + e.height;
    return n <= e.left ? i <= e.top ? (0, $191fedb0176831f8$export$53137579a3174918)(n, i, e.left, e.top) : t.top >= s ? (0, $191fedb0176831f8$export$53137579a3174918)(n, t.top, e.left, s) : e.left - n : t.left >= o ? i <= e.top ? (0, $191fedb0176831f8$export$53137579a3174918)(t.left, i, o, e.top) : t.top >= s ? (0, $191fedb0176831f8$export$53137579a3174918)(t.left, t.top, o, s) : t.left - o : i <= e.top ? e.top - i : t.top - s;
}



function $a1289e2dd8f4fa35$export$5a096129d439f843(n) {
    return n instanceof Window;
}


function $fe6ad177d3c46442$export$62858bae88b53fd0(n) {
    return n instanceof Document;
}




const $21c1c2d2c4760712$var$SUBPIXEL_OFFSET = new Map;
let $21c1c2d2c4760712$var$testStyleElement = null, $21c1c2d2c4760712$var$testParentElement = null, $21c1c2d2c4760712$var$testChildElement = null;
function $21c1c2d2c4760712$var$getSubpixelScrollbarSize(t, e) {
    const n = t.split(".");
    let l = $21c1c2d2c4760712$var$SUBPIXEL_OFFSET.get(n[1]);
    if (void 0 === l) {
        $21c1c2d2c4760712$var$testStyleElement || ($21c1c2d2c4760712$var$testStyleElement = document.createElement("style")), $21c1c2d2c4760712$var$testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t} !important;\n      }\n    `, $21c1c2d2c4760712$var$testParentElement && $21c1c2d2c4760712$var$testChildElement || ($21c1c2d2c4760712$var$testParentElement = document.createElement("div"), $21c1c2d2c4760712$var$testChildElement = document.createElement("div"), $21c1c2d2c4760712$var$testParentElement.appendChild($21c1c2d2c4760712$var$testChildElement), $21c1c2d2c4760712$var$testParentElement.id = "mezr-scrollbar-test", $21c1c2d2c4760712$var$testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", $21c1c2d2c4760712$var$testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild($21c1c2d2c4760712$var$testStyleElement), document.body.appendChild($21c1c2d2c4760712$var$testParentElement);
        l = $21c1c2d2c4760712$var$testParentElement.getBoundingClientRect().width - $21c1c2d2c4760712$var$testChildElement.getBoundingClientRect().width - e, $21c1c2d2c4760712$var$SUBPIXEL_OFFSET.set(n[1], l), document.body.removeChild($21c1c2d2c4760712$var$testParentElement), document.body.removeChild($21c1c2d2c4760712$var$testStyleElement);
    }
    return e + l;
}
function $21c1c2d2c4760712$export$5ad86f4734d24a64(t, e, n) {
    if (n <= 0) return 0;
    if (0, $73b86597f1534ba9$export$cd414719242f618c) {
        const n = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(t, "::-webkit-scrollbar"), l = "x" === e ? n.height : n.width, i = parseFloat(l);
        if (!Number.isNaN(i) && !Number.isInteger(i)) return $21c1c2d2c4760712$var$getSubpixelScrollbarSize(l, i);
    }
    return n;
}


function $740d70f0f5e143ee$export$91cf85d6c980faa0(e, r = !1) {
    if (r) return e.innerWidth;
    const { innerWidth: t, document: i } = e, { documentElement: n } = i, { clientWidth: c } = n;
    return t - (0, $21c1c2d2c4760712$export$5ad86f4734d24a64)(n, "y", t - c);
}


function $b9103cc173307f8e$export$a76b7f4aaec6cdf4({ documentElement: t }) {
    return Math.max(t.scrollWidth, t.clientWidth, t.getBoundingClientRect().width);
}






function $5ce865d8b0b150ac$export$742d7f6cc44470f1(t, e = (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) {
    let { width: r } = t.getBoundingClientRect();
    if (e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) return r;
    const o = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(t);
    return e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).margin ? (r += Math.max(0, parseFloat(o.marginLeft) || 0), r += Math.max(0, parseFloat(o.marginRight) || 0), r) : (r -= parseFloat(o.borderLeftWidth) || 0, r -= parseFloat(o.borderRightWidth) || 0, e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).scrollbar ? r : (!(0, $9f157138ba57e1f1$export$d8a62a489b442872)(t) && (0, $73b86597f1534ba9$export$d2ad2856e215d28e).has(o.overflowY) && (r -= (0, $21c1c2d2c4760712$export$5ad86f4734d24a64)(t, "y", Math.round(r) - t.clientWidth)), e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).padding || (r -= parseFloat(o.paddingLeft) || 0, r -= parseFloat(o.paddingRight) || 0), r));
}


function $2db86a82cc00f4cf$export$3c49c185de0c2bfc(t, i = (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) {
    return (0, $a1289e2dd8f4fa35$export$5a096129d439f843)(t) ? (0, $740d70f0f5e143ee$export$91cf85d6c980faa0)(t, (0, $73b86597f1534ba9$export$76e909bcfd8ba196)[i]) : (0, $fe6ad177d3c46442$export$62858bae88b53fd0)(t) ? (0, $b9103cc173307f8e$export$a76b7f4aaec6cdf4)(t) : (0, $5ce865d8b0b150ac$export$742d7f6cc44470f1)(t, i);
}






function $e132daa1b477948e$export$a3648dbc3769cbf4(e, r = !1) {
    if (r) return e.innerHeight;
    const { innerHeight: t, document: i } = e, { documentElement: n } = i, { clientHeight: c } = n;
    return t - (0, $21c1c2d2c4760712$export$5ad86f4734d24a64)(n, "x", t - c);
}


function $67c11d594eebd27a$export$5806f5d4b3eb6a6a({ documentElement: t }) {
    return Math.max(t.scrollHeight, t.clientHeight, t.getBoundingClientRect().height);
}






function $8626fa170e88625f$export$8e0f1520ce23a388(t, e = (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) {
    let { height: r } = t.getBoundingClientRect();
    if (e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) return r;
    const o = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(t);
    return e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).margin ? (r += Math.max(0, parseFloat(o.marginTop) || 0), r += Math.max(0, parseFloat(o.marginBottom) || 0), r) : (r -= parseFloat(o.borderTopWidth) || 0, r -= parseFloat(o.borderBottomWidth) || 0, e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).scrollbar ? r : (!(0, $9f157138ba57e1f1$export$d8a62a489b442872)(t) && (0, $73b86597f1534ba9$export$d2ad2856e215d28e).has(o.overflowX) && (r -= (0, $21c1c2d2c4760712$export$5ad86f4734d24a64)(t, "x", Math.round(r) - t.clientHeight)), e === (0, $73b86597f1534ba9$export$11fd24d838ebde87).padding || (r -= parseFloat(o.paddingTop) || 0, r -= parseFloat(o.paddingBottom) || 0), r));
}


function $890f7300e6aaa507$export$c08559766941f856(t, e = (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) {
    return (0, $a1289e2dd8f4fa35$export$5a096129d439f843)(t) ? (0, $e132daa1b477948e$export$a3648dbc3769cbf4)(t, (0, $73b86597f1534ba9$export$76e909bcfd8ba196)[e]) : (0, $fe6ad177d3c46442$export$62858bae88b53fd0)(t) ? (0, $67c11d594eebd27a$export$5806f5d4b3eb6a6a)(t) : (0, $8626fa170e88625f$export$8e0f1520ce23a388)(t, e);
}


function $8589aa69aa9926be$export$ff047630cae37d8e(t) {
    return t?.constructor === Object;
}







function $f6bcd77a75e6c181$export$9f1480883798e819(t, o = (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) {
    const e = {
        left: 0,
        top: 0
    };
    if ((0, $fe6ad177d3c46442$export$62858bae88b53fd0)(t)) return e;
    if ((0, $a1289e2dd8f4fa35$export$5a096129d439f843)(t)) return e.left += t.scrollX || 0, e.top += t.scrollY || 0, e;
    const r = t.ownerDocument.defaultView;
    r && (e.left += r.scrollX || 0, e.top += r.scrollY || 0);
    const n = t.getBoundingClientRect();
    if (e.left += n.left, e.top += n.top, o === (0, $73b86597f1534ba9$export$11fd24d838ebde87).border) return e;
    const l = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(t);
    return o === (0, $73b86597f1534ba9$export$11fd24d838ebde87).margin ? (e.left -= Math.max(0, parseFloat(l.marginLeft) || 0), e.top -= Math.max(0, parseFloat(l.marginTop) || 0), e) : (e.left += parseFloat(l.borderLeftWidth) || 0, e.top += parseFloat(l.borderTopWidth) || 0, o === (0, $73b86597f1534ba9$export$11fd24d838ebde87).scrollbar || o === (0, $73b86597f1534ba9$export$11fd24d838ebde87).padding || (e.left += parseFloat(l.paddingLeft) || 0, e.top += parseFloat(l.paddingTop) || 0), e);
}


function $84fa6060d02598f1$export$622cea445a1c5b7d(t, e) {
    const o = (0, $8589aa69aa9926be$export$ff047630cae37d8e)(t) ? {
        left: t.left,
        top: t.top
    } : Array.isArray(t) ? (0, $f6bcd77a75e6c181$export$9f1480883798e819)(...t) : (0, $f6bcd77a75e6c181$export$9f1480883798e819)(t);
    if (e && !(0, $fe6ad177d3c46442$export$62858bae88b53fd0)(e)) {
        const t = (0, $8589aa69aa9926be$export$ff047630cae37d8e)(e) ? e : Array.isArray(e) ? (0, $f6bcd77a75e6c181$export$9f1480883798e819)(e[0], e[1]) : (0, $f6bcd77a75e6c181$export$9f1480883798e819)(e);
        o.left -= t.left, o.top -= t.top;
    }
    return o;
}



function $016235b23a08b22b$export$4b834cebd9e5cebe(t, e) {
    let i = 0, g = 0;
    (0, $8589aa69aa9926be$export$ff047630cae37d8e)(t) ? (i = t.width, g = t.height) : Array.isArray(t) ? (i = (0, $2db86a82cc00f4cf$export$3c49c185de0c2bfc)(...t), g = (0, $890f7300e6aaa507$export$c08559766941f856)(...t)) : (i = (0, $2db86a82cc00f4cf$export$3c49c185de0c2bfc)(t), g = (0, $890f7300e6aaa507$export$c08559766941f856)(t));
    const r = (0, $84fa6060d02598f1$export$622cea445a1c5b7d)(t, e);
    return {
        width: i,
        height: g,
        ...r,
        right: r.left + i,
        bottom: r.top + g
    };
}



function $dfebc57a30f2c8e6$export$e4e616e82e79ab9d(t) {
    return (0, $8589aa69aa9926be$export$ff047630cae37d8e)(t) ? t : (0, $016235b23a08b22b$export$4b834cebd9e5cebe)(t);
}


function $502406f6343b1a94$export$79376507b09a66f(e, t) {
    const c = (0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(e), i = (0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(t);
    return (0, $02b8930067ac211c$export$2d670be792dba464)(c, i);
}




function $b383fef22c6d125e$export$72209efa88586d42(t, ...e) {
    const o = {
        ...(0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(t),
        right: 0,
        bottom: 0
    };
    for (const t of e){
        const e = (0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(t), i = Math.max(o.left, e.left), h = Math.min(o.left + o.width, e.left + e.width);
        if (h <= i) return null;
        const r = Math.max(o.top, e.top), l = Math.min(o.top + o.height, e.height + e.top);
        if (l <= r) return null;
        o.left = i, o.top = r, o.width = h - i, o.height = l - r;
    }
    return o.right = o.left + o.width, o.bottom = o.top + o.height, o;
}






function $80c30c679099895e$export$243d7fadef466e38(n, t = {}) {
    const i = (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(n), { display: o } = i;
    if ("none" === o || "contents" === o) return null;
    const e = t.position || (0, $d89c0845f164a4bf$export$3d2f074408bd1b82)(n).position, { skipDisplayNone: s, container: r } = t;
    switch(e){
        case "relative":
            return n;
        case "fixed":
            return (0, $edd10e7a206ac733$export$940d8225183e1404)(n, {
                container: r,
                position: e,
                skipDisplayNone: s
            });
        case "absolute":
            {
                const t = (0, $edd10e7a206ac733$export$940d8225183e1404)(n, {
                    container: r,
                    position: e,
                    skipDisplayNone: s
                });
                return (0, $a1289e2dd8f4fa35$export$5a096129d439f843)(t) ? n.ownerDocument : t;
            }
        default:
            return null;
    }
}



function $dac7066881febe64$export$f63a1e5ecde5e3c4(t, e) {
    const o = (0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(t), i = (0, $dfebc57a30f2c8e6$export$e4e616e82e79ab9d)(e);
    return {
        left: i.left - o.left,
        right: o.left + o.width - (i.left + i.width),
        top: i.top - o.top,
        bottom: o.top + o.height - (i.top + i.height)
    };
}






const $0357fc671186a867$var$STYLE_DECLARATION_CACHE = new WeakMap();
function $0357fc671186a867$export$3d2f074408bd1b82(element) {
    let styleDeclaration = $0357fc671186a867$var$STYLE_DECLARATION_CACHE.get(element)?.deref();
    if (!styleDeclaration) {
        styleDeclaration = window.getComputedStyle(element, null);
        $0357fc671186a867$var$STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
    }
    return styleDeclaration;
}



function $3b71d9f1eab50f51$export$5e94c6e790b2d913(elemA, elemB, result = {
    left: 0,
    top: 0
}) {
    result.left = 0;
    result.top = 0;
    // If elements are same let's return early.
    if (elemA === elemB) return result;
    // Finally, let's calculate the offset diff.
    const offsetA = (0, $84fa6060d02598f1$export$622cea445a1c5b7d)([
        elemA,
        "padding"
    ]);
    const offsetB = (0, $84fa6060d02598f1$export$622cea445a1c5b7d)([
        elemB,
        "padding"
    ]);
    result.left = offsetB.left - offsetA.left;
    result.top = offsetB.top - offsetA.top;
    return result;
}


const $14b312e0772fa5e6$var$OFFSET_DIFF = {
    left: 0,
    top: 0
};
const $14b312e0772fa5e6$var$IDENTITY_MATRIX = "matrix(1, 0, 0, 1, 0, 0)";
const $14b312e0772fa5e6$var$IDENTITY_MATRIX_3D = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
class $14b312e0772fa5e6$export$b87fb2dc7f11ca52 {
    constructor(element, draggable){
        // Make sure the element is in DOM.
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
        if (!element.isConnected) throw new Error("Element is not connected");
        // Make sure sensor is defined.
        const sensor = draggable.drag?.sensor;
        if (!sensor) throw new Error("Sensor is not defined");
        const item = this;
        const style = (0, $0357fc671186a867$export$3d2f074408bd1b82)(element);
        const clientRect = element.getBoundingClientRect();
        this.data = {};
        this.element = element;
        this.frozenProps = null;
        this.unfrozenProps = null;
        this.position = {
            x: 0,
            y: 0
        };
        this._updateDiff = {
            x: 0,
            y: 0
        };
        this._moveDiff = {
            x: 0,
            y: 0
        };
        this._containerDiff = {
            x: 0,
            y: 0
        };
        // Use element's parent element as the element container.
        const elementContainer = element.parentElement;
        if (!elementContainer) throw new Error("Element does not have a parent element.");
        this.elementContainer = elementContainer;
        // Compute element's offset container.
        const elementOffsetContainer = (0, $80c30c679099895e$export$243d7fadef466e38)(element);
        if (!elementOffsetContainer) throw new Error("Offset container could not be computed for the element!");
        this.elementOffsetContainer = elementOffsetContainer;
        // Get element's drag parent, default to element's parent element.
        const dragContainer = draggable.settings.container || elementContainer;
        this.dragContainer = dragContainer;
        // Get drag container's offset container.
        const dragOffsetContainer = dragContainer === elementContainer ? elementOffsetContainer : (0, $80c30c679099895e$export$243d7fadef466e38)(element, {
            container: dragContainer
        });
        if (!dragOffsetContainer) throw new Error("Drag offset container could not be computed for the element!");
        this.dragOffsetContainer = dragOffsetContainer;
        // Store element's client rect.
        {
            const { left: left, top: top, width: width, height: height } = clientRect;
            this.clientRect = {
                left: left,
                top: top,
                width: width,
                height: height
            };
        }
        // If element's offset container is different than drag container's
        // offset container let's compute the offset between the offset containers.
        if (elementOffsetContainer !== dragOffsetContainer) {
            const { left: left, top: top } = (0, $3b71d9f1eab50f51$export$5e94c6e790b2d913)(dragOffsetContainer, elementOffsetContainer, $14b312e0772fa5e6$var$OFFSET_DIFF);
            this._containerDiff.x = left;
            this._containerDiff.y = top;
        }
        // Store element's initial transform.
        const { transform: transform } = style;
        if (transform && transform !== "none" && transform !== $14b312e0772fa5e6$var$IDENTITY_MATRIX && transform !== $14b312e0772fa5e6$var$IDENTITY_MATRIX_3D) this.initialTransform = transform;
        else this.initialTransform = "";
        // Get element's initial position. This position is relative to the
        // properties the user is using to move the element. For example, if the
        // user is using the `translate` transform to move the element then the
        // initial position will be relative to the `translate` transform and the
        // position here should reflect the transform value delta.
        const { x: x, y: y } = draggable.settings.getStartPosition({
            draggable: draggable,
            sensor: sensor,
            item: item,
            style: style
        });
        this.position.x = x;
        this.position.y = y;
        // Get element's frozen props.
        const frozenProps = draggable.settings.getFrozenProps({
            draggable: draggable,
            sensor: sensor,
            item: item,
            style: style
        });
        if (Array.isArray(frozenProps)) {
            if (frozenProps.length) {
                const props = {};
                for (const prop of frozenProps)props[prop] = style[prop];
                this.frozenProps = props;
            } else this.frozenProps = null;
        } else this.frozenProps = frozenProps;
        // Lastly, let's compute the unfrozen props. We store the current inline
        // style values for all frozen props so that we can restore them after the
        // drag process is over.
        if (this.frozenProps) {
            const unfrozenProps = {};
            for(const key in this.frozenProps)if (this.frozenProps.hasOwnProperty(key)) unfrozenProps[key] = element.style[key];
            this.unfrozenProps = unfrozenProps;
        }
    }
    updateSize(dimensions) {
        if (dimensions) {
            this.clientRect.width = dimensions.width;
            this.clientRect.height = dimensions.height;
        } else {
            const rect = this.element.getBoundingClientRect();
            this.clientRect.width = rect.width;
            this.clientRect.height = rect.height;
        }
    }
}




const $792c55b8bb65db3f$var$SCROLL_LISTENER_OPTIONS = (0, $7561e0e34050a3b8$export$ffcf6b6ce241bd05) ? {
    capture: true,
    passive: true
} : true;
const $792c55b8bb65db3f$var$OFFSET_DIFF = {
    left: 0,
    top: 0
};
const $792c55b8bb65db3f$var$POSITION_CHANGE = {
    x: 0,
    y: 0
};
var $792c55b8bb65db3f$var$DraggableStartPredicateState;
(function(DraggableStartPredicateState) {
    DraggableStartPredicateState[DraggableStartPredicateState["PENDING"] = 0] = "PENDING";
    DraggableStartPredicateState[DraggableStartPredicateState["RESOLVED"] = 1] = "RESOLVED";
    DraggableStartPredicateState[DraggableStartPredicateState["REJECTED"] = 2] = "REJECTED";
})($792c55b8bb65db3f$var$DraggableStartPredicateState || ($792c55b8bb65db3f$var$DraggableStartPredicateState = {}));
function $792c55b8bb65db3f$var$getDefaultSettings() {
    return {
        container: null,
        startPredicate: ()=>true,
        getElements: ()=>null,
        releaseElements: ()=>null,
        getFrozenProps: ()=>null,
        getStartPosition: ()=>{
            return {
                x: 0,
                y: 0
            };
        },
        setPosition: ({ item: item, x: x, y: y })=>{
            item.element.style.transform = `translate(${x}px, ${y}px) ${item.initialTransform}`;
        },
        getPositionChange: ({ event: event, prevEvent: prevEvent })=>{
            $792c55b8bb65db3f$var$POSITION_CHANGE.x = event.x - prevEvent.x;
            $792c55b8bb65db3f$var$POSITION_CHANGE.y = event.y - prevEvent.y;
            return $792c55b8bb65db3f$var$POSITION_CHANGE;
        }
    };
}
class $792c55b8bb65db3f$export$f2a139e5d18b9882 {
    constructor(sensors, options = {}){
        this.sensors = sensors;
        this.settings = this._parseSettings(options);
        this.plugins = {};
        this.drag = null;
        this.isDestroyed = false;
        this._sensorData = new Map();
        this._emitter = new (0, $088d3595c1e06dc8$export$4293555f241ae35a)();
        this._startId = Symbol();
        this._moveId = Symbol();
        this._updateId = Symbol();
        // Bind methods (that need binding).
        this._onMove = this._onMove.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._prepareStart = this._prepareStart.bind(this);
        this._applyStart = this._applyStart.bind(this);
        this._prepareMove = this._prepareMove.bind(this);
        this._applyMove = this._applyMove.bind(this);
        this._preparePositionUpdate = this._preparePositionUpdate.bind(this);
        this._applyPositionUpdate = this._applyPositionUpdate.bind(this);
        // Bind drag sensor events.
        this.sensors.forEach((sensor)=>{
            this._sensorData.set(sensor, {
                predicateState: 0,
                predicateEvent: null,
                onMove: (e)=>this._onMove(e, sensor),
                onEnd: (e)=>this._onEnd(e, sensor)
            });
            const { onMove: onMove, onEnd: onEnd } = this._sensorData.get(sensor);
            sensor.on("start", onMove, onMove);
            sensor.on("move", onMove, onMove);
            sensor.on("cancel", onEnd, onEnd);
            sensor.on("end", onEnd, onEnd);
            sensor.on("destroy", onEnd, onEnd);
        });
    }
    _parseSettings(options, defaults = $792c55b8bb65db3f$var$getDefaultSettings()) {
        const { container: container = defaults.container, startPredicate: startPredicate = defaults.startPredicate, getElements: getElements = defaults.getElements, releaseElements: releaseElements = defaults.releaseElements, getFrozenProps: getFrozenProps = defaults.getFrozenProps, getStartPosition: getStartPosition = defaults.getStartPosition, setPosition: setPosition = defaults.setPosition, getPositionChange: getPositionChange = defaults.getPositionChange } = options || {};
        return {
            container: container,
            startPredicate: startPredicate,
            getElements: getElements,
            releaseElements: releaseElements,
            getFrozenProps: getFrozenProps,
            getStartPosition: getStartPosition,
            setPosition: setPosition,
            getPositionChange: getPositionChange
        };
    }
    _emit(type, ...e) {
        this._emitter.emit(type, ...e);
    }
    _onMove(e, sensor) {
        const sensorData = this._sensorData.get(sensor);
        if (!sensorData) return;
        switch(sensorData.predicateState){
            case 0:
                {
                    sensorData.predicateEvent = e;
                    // Check if drag should start.
                    const shouldStart = this.settings.startPredicate({
                        draggable: this,
                        sensor: sensor,
                        event: e
                    });
                    // Resolve procedure (start move process).
                    if (shouldStart === true) this.resolveStartPredicate(sensor);
                    else if (shouldStart === false) this.rejectStartPredicate(sensor);
                    break;
                }
            case 1:
                // Move the element if dragging is active.
                if (this.drag) {
                    this.drag.event = e;
                    (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._prepareMove, this._moveId);
                    (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._applyMove, this._moveId);
                }
                break;
        }
    }
    _onScroll() {
        this.updatePosition();
    }
    _onEnd(e, sensor) {
        const sensorData = this._sensorData.get(sensor);
        if (!sensorData) return;
        // If there is no active drag yet, let's reset the sensor's start predicate
        // so that it can try starting drag again.
        if (!this.drag) {
            sensorData.predicateState = 0;
            sensorData.predicateEvent = null;
        } else if (sensorData.predicateState === 1) {
            this.drag.endEvent = e;
            this._sensorData.forEach((data)=>{
                data.predicateState = 0;
                data.predicateEvent = null;
            });
            this.stop();
        }
    }
    _prepareStart() {
        const drag = this.drag;
        if (!drag) return;
        // Get elements that we'll need to move with the drag.
        // NB: It is okay if there are no elements and thus no items. The drag
        // process will process as usual, but nothing is moving by default.
        const elements = this.settings.getElements({
            draggable: this,
            sensor: drag.sensor,
            startEvent: drag.startEvent
        }) || [];
        // Create drag items.
        drag.items = elements.map((element)=>{
            return new (0, $14b312e0772fa5e6$export$b87fb2dc7f11ca52)(element, this);
        });
        // Emit preparestart event.
        this._emit("preparestart", drag.startEvent);
    }
    _applyStart() {
        const drag = this.drag;
        if (!drag) return;
        const { container: container } = this.settings;
        for (const item of drag.items){
            // Append element within the container element if such is provided.
            if (container && item.element.parentElement !== container) {
                container.appendChild(item.element);
                item.position.x += item._containerDiff.x;
                item.position.y += item._containerDiff.y;
            }
            // Freeze element's props if such are provided.
            if (item.frozenProps) Object.assign(item.element.style, item.frozenProps);
            // Set the element's start position.
            this.settings.setPosition({
                phase: "start",
                draggable: this,
                sensor: drag.sensor,
                item: item,
                x: item.position.x,
                y: item.position.y
            });
        }
        // Bind scroll listeners.
        window.addEventListener("scroll", this._onScroll, $792c55b8bb65db3f$var$SCROLL_LISTENER_OPTIONS);
        // Emit start event.
        this._emit("start", drag.startEvent);
    }
    _prepareMove() {
        const drag = this.drag;
        if (!drag) return;
        // Get next event and previous event so we can compute the movement
        // difference between the clientX/Y values.
        const { event: event, prevEvent: prevEvent, startEvent: startEvent, sensor: sensor } = drag;
        if (event === prevEvent) return;
        for (const item of drag.items){
            // Compute how much x and y needs to be transformed.
            const { x: changeX, y: changeY } = this.settings.getPositionChange({
                draggable: this,
                sensor: sensor,
                item: item,
                event: event,
                prevEvent: prevEvent,
                startEvent: startEvent
            });
            // Update horizontal position data.
            if (changeX) {
                item.position.x += changeX;
                item.clientRect.left += changeX;
                item._moveDiff.x += changeX;
            }
            // Update vertical position data.
            if (changeY) {
                item.position.y += changeY;
                item.clientRect.top += changeY;
                item._moveDiff.y += changeY;
            }
        }
        // Store next event as previous event.
        drag.prevEvent = event;
        // Emit preparemove event.
        this._emit("preparemove", event);
    }
    _applyMove() {
        const drag = this.drag;
        if (!drag) return;
        // Reset movement diff and move the element.
        for (const item of drag.items){
            item._moveDiff.x = 0;
            item._moveDiff.y = 0;
            this.settings.setPosition({
                phase: "move",
                draggable: this,
                sensor: drag.sensor,
                item: item,
                x: item.position.x,
                y: item.position.y
            });
        }
        // Emit move event.
        if (drag.event) this._emit("move", drag.event);
    }
    _preparePositionUpdate() {
        const { drag: drag } = this;
        if (!drag) return;
        for (const item of drag.items){
            // Update container diff.
            if (item.elementOffsetContainer !== item.dragOffsetContainer) {
                const { left: left, top: top } = (0, $3b71d9f1eab50f51$export$5e94c6e790b2d913)(item.dragOffsetContainer, item.elementOffsetContainer, $792c55b8bb65db3f$var$OFFSET_DIFF);
                item._containerDiff.x = left;
                item._containerDiff.y = top;
            }
            const { left: left, top: top, width: width, height: height } = item.element.getBoundingClientRect();
            // Update horizontal position data.
            const updateDiffX = item.clientRect.left - item._moveDiff.x - left;
            item.position.x = item.position.x - item._updateDiff.x + updateDiffX;
            item._updateDiff.x = updateDiffX;
            // Update vertical position data.
            const updateDiffY = item.clientRect.top - item._moveDiff.y - top;
            item.position.y = item.position.y - item._updateDiff.y + updateDiffY;
            item._updateDiff.y = updateDiffY;
            // Update item client size. This is not necessary for the drag process,
            // but since we're computing the bounding client rect, we might as well
            // update the size in the process. The size is used by the auto-scroll
            // plugin and possibly some other third-party plugins.
            item.clientRect.width = width;
            item.clientRect.height = height;
        }
    }
    _applyPositionUpdate() {
        const { drag: drag } = this;
        if (!drag) return;
        for (const item of drag.items){
            item._updateDiff.x = 0;
            item._updateDiff.y = 0;
            this.settings.setPosition({
                phase: "move",
                draggable: this,
                sensor: drag.sensor,
                item: item,
                x: item.position.x,
                y: item.position.y
            });
        }
    }
    on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    resolveStartPredicate(sensor, e) {
        const sensorData = this._sensorData.get(sensor);
        if (!sensorData) return;
        const startEvent = e || sensorData.predicateEvent;
        if (sensorData.predicateState === 0 && startEvent) {
            // Resolve the provided sensor's start predicate.
            sensorData.predicateState = 1;
            sensorData.predicateEvent = null;
            this.drag = new (0, $d353d5806c14ac2c$export$12e4b40eac1bcb71)(sensor, startEvent);
            // Reject other sensors' start predicates.
            this._sensorData.forEach((data, s)=>{
                if (s === sensor) return;
                data.predicateState = 2;
                data.predicateEvent = null;
            });
            // Queue drag start.
            (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._prepareStart, this._startId);
            (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._applyStart, this._startId);
        }
    }
    rejectStartPredicate(sensor) {
        const sensorData = this._sensorData.get(sensor);
        if (sensorData?.predicateState === 0) {
            sensorData.predicateState = 2;
            sensorData.predicateEvent = null;
        }
    }
    stop() {
        const drag = this.drag;
        if (!drag || drag.isEnded) return;
        // Mark drag process as ended.
        drag.isEnded = true;
        // Cancel all queued ticks.
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._startId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._startId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._moveId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._moveId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._updateId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._updateId);
        // Unbind scroll listener.
        window.removeEventListener("scroll", this._onScroll, $792c55b8bb65db3f$var$SCROLL_LISTENER_OPTIONS);
        // Move elements within the root container and collect all elements
        // to an elements array.
        const elements = [];
        for (const item of drag.items){
            elements.push(item.element);
            if (item.elementContainer && item.element.parentElement !== item.elementContainer) {
                item.position.x -= item._containerDiff.x;
                item.position.y -= item._containerDiff.y;
                item._containerDiff.x = 0;
                item._containerDiff.y = 0;
                item.elementContainer.appendChild(item.element);
            }
            // Unfreeze element's props if such are provided.
            if (item.unfrozenProps) for(const key in item.unfrozenProps)item.element.style[key] = item.unfrozenProps[key] || "";
            // Set final position after drag.
            this.settings.setPosition({
                phase: "end",
                draggable: this,
                sensor: drag.sensor,
                item: item,
                x: item.position.x,
                y: item.position.y
            });
        }
        // Call "releaseElements" callback.
        if (elements.length) this.settings.releaseElements({
            draggable: this,
            sensor: drag.sensor,
            elements: elements
        });
        // Emit end event.
        this._emit("end", drag.endEvent);
        // Reset drag data.
        this.drag = null;
    }
    updatePosition(instant = false) {
        if (!this.drag) return;
        if (instant) {
            this._preparePositionUpdate();
            this._applyPositionUpdate();
        } else {
            (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._preparePositionUpdate, this._updateId);
            (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).once((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._applyPositionUpdate, this._updateId);
        }
    }
    updateSettings(options = {}) {
        this.settings = this._parseSettings(options, this.settings);
    }
    use(plugin) {
        return plugin(this);
    }
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.stop();
        this._sensorData.forEach(({ onMove: onMove, onEnd: onEnd }, sensor)=>{
            sensor.off("start", onMove);
            sensor.off("move", onMove);
            sensor.off("cancel", onEnd);
            sensor.off("end", onEnd);
            sensor.off("destroy", onEnd);
        });
        this._sensorData.clear();
        this._emit("destroy");
        this._emitter.off();
    }
}





class $845945aa9037e9c2$export$14963ee5c8637e11 {
    constructor(createObject, onPut){
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




function $defa3c104590a6e9$export$f3fe0e9a60cde324(a, b) {
    const intersection = (0, $b383fef22c6d125e$export$72209efa88586d42)(a, b);
    return intersection ? intersection.width * intersection.height : 0;
}


function $960d12c0ef4d8d12$export$25b3e1e24e1ba229(a, b) {
    const area = (0, $defa3c104590a6e9$export$f3fe0e9a60cde324)(a, b);
    if (!area) return 0;
    const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
    return area / maxArea * 100;
}


/**
 * Check if the current value is a window.
 */ function $1eb610c1b1e227db$export$5a096129d439f843(value) {
    return value instanceof Window;
}


function $e65e66c8ec1805cf$export$31d37ff78a483ce2(element) {
    if ((0, $1eb610c1b1e227db$export$5a096129d439f843)(element) || element === document.documentElement || element === document.body) return window;
    else return element;
}



function $33d05a3bd325dc4b$export$1389d168952b34b5(element) {
    return (0, $1eb610c1b1e227db$export$5a096129d439f843)(element) ? element.pageXOffset : element.scrollLeft;
}



function $91aa171c07aecd5f$export$c16047c7a398106d(element) {
    if ((0, $1eb610c1b1e227db$export$5a096129d439f843)(element)) element = document.documentElement;
    return element.scrollWidth - element.clientWidth;
}



function $5edd28f58e093b4d$export$c4a223a8ba9e4ea5(element) {
    return (0, $1eb610c1b1e227db$export$5a096129d439f843)(element) ? element.pageYOffset : element.scrollTop;
}



function $60454a12296c8639$export$39d53b245a98193e(element) {
    if ((0, $1eb610c1b1e227db$export$5a096129d439f843)(element)) element = document.documentElement;
    return element.scrollHeight - element.clientHeight;
}


function $75ccfeacce467af1$export$8d3dd0be5eb9f11f(a, b) {
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}


//
// CONSTANTS
//
const $847760a2c3e36b4b$var$R1 = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};
const $847760a2c3e36b4b$var$R2 = {
    ...$847760a2c3e36b4b$var$R1
};
const $847760a2c3e36b4b$var$DEFAULT_THRESHOLD = 50;
const $847760a2c3e36b4b$var$SPEED_DATA = {
    direction: "none",
    threshold: 0,
    distance: 0,
    value: 0,
    maxValue: 0,
    duration: 0,
    speed: 0,
    deltaTime: 0,
    isEnding: false
};
const $847760a2c3e36b4b$export$5bbd74ab6c855dff = {
    x: 1,
    y: 2
};
const $847760a2c3e36b4b$export$3eeb7a7b68c92567 = {
    forward: 4,
    reverse: 8
};
const $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_X = {
    none: 0,
    left: $847760a2c3e36b4b$export$5bbd74ab6c855dff.x | $847760a2c3e36b4b$export$3eeb7a7b68c92567.reverse,
    right: $847760a2c3e36b4b$export$5bbd74ab6c855dff.x | $847760a2c3e36b4b$export$3eeb7a7b68c92567.forward
};
const $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y = {
    none: 0,
    up: $847760a2c3e36b4b$export$5bbd74ab6c855dff.y | $847760a2c3e36b4b$export$3eeb7a7b68c92567.reverse,
    down: $847760a2c3e36b4b$export$5bbd74ab6c855dff.y | $847760a2c3e36b4b$export$3eeb7a7b68c92567.forward
};
const $847760a2c3e36b4b$export$c9fbd1f9176bc8ed = {
    ...$847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_X,
    ...$847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y
};
function $847760a2c3e36b4b$var$getDirectionAsString(direction) {
    switch(direction){
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_X.none:
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y.none:
            return "none";
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_X.left:
            return "left";
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_X.right:
            return "right";
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y.up:
            return "up";
        case $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y.down:
            return "down";
        default:
            throw new Error(`Unknown direction value: ${direction}`);
    }
}
function $847760a2c3e36b4b$var$getPaddedRect(rect, padding, result) {
    let { left: left = 0, right: right = 0, top: top = 0, bottom: bottom = 0 } = padding;
    // Don't allow negative padding.
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
function $847760a2c3e36b4b$var$isScrolledToMax(scrollValue, maxScrollValue) {
    // In some scenarios the scrollValue and/or maxScrollValue can be a float
    // with subpixel values which might cause some funky scenarios where the
    // element tries to scroll to the end but never actually reaches it. In such
    // cases we want to do some rounding to detect that the element has actually
    // reached the end of the scroll.
    return Math.ceil(scrollValue) >= Math.floor(maxScrollValue);
}
//
// PRIVATE UTILS
//
function $847760a2c3e36b4b$var$computeThreshold(idealThreshold, targetSize) {
    return Math.min(targetSize / 2, idealThreshold);
}
function $847760a2c3e36b4b$var$computeEdgeOffset(threshold, inertAreaSize, itemSize, targetSize) {
    return Math.max(0, itemSize + threshold * 2 + targetSize * inertAreaSize - targetSize) / 2;
}
class $847760a2c3e36b4b$var$AutoScrollItemData {
    constructor(){
        this.positionX = 0;
        this.positionY = 0;
        this.directionX = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        this.directionY = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        this.overlapCheckRequestTime = 0;
    }
}
class $847760a2c3e36b4b$var$AutoScrollAction {
    constructor(){
        this.element = null;
        this.requestX = null;
        this.requestY = null;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }
    reset() {
        if (this.requestX) this.requestX.action = null;
        if (this.requestY) this.requestY.action = null;
        this.element = null;
        this.requestX = null;
        this.requestY = null;
        this.scrollLeft = 0;
        this.scrollTop = 0;
    }
    addRequest(request) {
        if ($847760a2c3e36b4b$export$5bbd74ab6c855dff.x & request.direction) {
            this.requestX && this.removeRequest(this.requestX);
            this.requestX = request;
        } else {
            this.requestY && this.removeRequest(this.requestY);
            this.requestY = request;
        }
        request.action = this;
    }
    removeRequest(request) {
        if (this.requestX === request) {
            this.requestX = null;
            request.action = null;
        } else if (this.requestY === request) {
            this.requestY = null;
            request.action = null;
        }
    }
    computeScrollValues() {
        if (!this.element) return;
        this.scrollLeft = this.requestX ? this.requestX.value : (0, $33d05a3bd325dc4b$export$1389d168952b34b5)(this.element);
        this.scrollTop = this.requestY ? this.requestY.value : (0, $5edd28f58e093b4d$export$c4a223a8ba9e4ea5)(this.element);
    }
    scroll() {
        if (!this.element) return;
        if (this.element.scrollTo) this.element.scrollTo(this.scrollLeft, this.scrollTop);
        else {
            this.element.scrollLeft = this.scrollLeft;
            this.element.scrollTop = this.scrollTop;
        }
    }
}
class $847760a2c3e36b4b$var$AutoScrollRequest {
    constructor(){
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
        if (this.isActive) this.onStop();
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
        return $847760a2c3e36b4b$export$3eeb7a7b68c92567.forward & this.direction ? $847760a2c3e36b4b$var$isScrolledToMax(this.value, this.maxValue) : this.value <= 0;
    }
    computeCurrentScrollValue() {
        if (!this.element) return 0;
        if (this.value !== this.value) return $847760a2c3e36b4b$export$5bbd74ab6c855dff.x & this.direction ? (0, $33d05a3bd325dc4b$export$1389d168952b34b5)(this.element) : (0, $5edd28f58e093b4d$export$c4a223a8ba9e4ea5)(this.element);
        return Math.max(0, Math.min(this.value, this.maxValue));
    }
    computeNextScrollValue() {
        const delta = this.speed * (this.deltaTime / 1000);
        const nextValue = $847760a2c3e36b4b$export$3eeb7a7b68c92567.forward & this.direction ? this.value + delta : this.value - delta;
        return Math.max(0, Math.min(nextValue, this.maxValue));
    }
    computeSpeed() {
        if (!this.item || !this.element) return 0;
        const { speed: speed } = this.item;
        if (typeof speed === "function") {
            $847760a2c3e36b4b$var$SPEED_DATA.direction = $847760a2c3e36b4b$var$getDirectionAsString(this.direction);
            $847760a2c3e36b4b$var$SPEED_DATA.threshold = this.threshold;
            $847760a2c3e36b4b$var$SPEED_DATA.distance = this.distance;
            $847760a2c3e36b4b$var$SPEED_DATA.value = this.value;
            $847760a2c3e36b4b$var$SPEED_DATA.maxValue = this.maxValue;
            $847760a2c3e36b4b$var$SPEED_DATA.duration = this.duration;
            $847760a2c3e36b4b$var$SPEED_DATA.speed = this.speed;
            $847760a2c3e36b4b$var$SPEED_DATA.deltaTime = this.deltaTime;
            $847760a2c3e36b4b$var$SPEED_DATA.isEnding = this.isEnding;
            return speed(this.element, $847760a2c3e36b4b$var$SPEED_DATA);
        } else return speed;
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
        if (!this.item || !this.element) return;
        const { onStart: onStart } = this.item;
        if (typeof onStart === "function") onStart(this.element, $847760a2c3e36b4b$var$getDirectionAsString(this.direction));
    }
    onStop() {
        if (!this.item || !this.element) return;
        const { onStop: onStop } = this.item;
        if (typeof onStop === "function") onStop(this.element, $847760a2c3e36b4b$var$getDirectionAsString(this.direction));
    }
}
function $847760a2c3e36b4b$export$55a384729d91296b(// Pixels per second.
maxSpeed = 500, // Time in seconds, how long it will take to accelerate from 0 to maxSpeed.
accelerationFactor = 0.5, // Time in seconds, how long it will take to decelerate maxSpeed to 0.
decelerationFactor = 0.25) {
    const acceleration = maxSpeed * (accelerationFactor > 0 ? 1 / accelerationFactor : Infinity);
    const deceleration = maxSpeed * (decelerationFactor > 0 ? 1 / decelerationFactor : Infinity);
    return function(_element, data) {
        let targetSpeed = 0;
        if (!data.isEnding) {
            if (data.threshold > 0) {
                const factor = data.threshold - Math.max(0, data.distance);
                targetSpeed = maxSpeed / data.threshold * factor;
            } else targetSpeed = maxSpeed;
        }
        const currentSpeed = data.speed;
        if (currentSpeed === targetSpeed) return targetSpeed;
        let nextSpeed = targetSpeed;
        if (currentSpeed < targetSpeed) {
            nextSpeed = currentSpeed + acceleration * (data.deltaTime / 1000);
            return Math.min(targetSpeed, nextSpeed);
        } else {
            nextSpeed = currentSpeed - deceleration * (data.deltaTime / 1000);
            return Math.max(targetSpeed, nextSpeed);
        }
    };
}
class $847760a2c3e36b4b$export$3fb39aee5567f02e {
    constructor(options = {}){
        const { overlapCheckInterval: overlapCheckInterval = 150 } = options;
        this.items = [];
        this.settings = {
            overlapCheckInterval: overlapCheckInterval
        };
        this._actions = [];
        this._isDestroyed = false;
        this._isTicking = false;
        this._tickTime = 0;
        this._tickDeltaTime = 0;
        this._requests = {
            [$847760a2c3e36b4b$export$5bbd74ab6c855dff.x]: new Map(),
            [$847760a2c3e36b4b$export$5bbd74ab6c855dff.y]: new Map()
        };
        this._itemData = new Map();
        this._requestPool = new (0, $845945aa9037e9c2$export$14963ee5c8637e11)(()=>new $847760a2c3e36b4b$var$AutoScrollRequest(), (request)=>request.reset());
        this._actionPool = new (0, $845945aa9037e9c2$export$14963ee5c8637e11)(()=>new $847760a2c3e36b4b$var$AutoScrollAction(), (action)=>action.reset());
        this._emitter = new (0, $088d3595c1e06dc8$export$4293555f241ae35a)();
        this._frameRead = this._frameRead.bind(this);
        this._frameWrite = this._frameWrite.bind(this);
    }
    _frameRead(time) {
        if (this._isDestroyed) return;
        if (time && this._tickTime) {
            this._tickDeltaTime = time - this._tickTime;
            this._tickTime = time;
            this._updateItems();
            this._updateRequests();
            this._updateActions();
        } else {
            this._tickTime = time;
            this._tickDeltaTime = 0;
        }
    }
    _frameWrite() {
        if (this._isDestroyed) return;
        this._applyActions();
    }
    _startTicking() {
        if (this._isTicking) return;
        this._isTicking = true;
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).on((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._frameRead, this._frameRead);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).on((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._frameWrite, this._frameWrite);
    }
    _stopTicking() {
        if (!this._isTicking) return;
        this._isTicking = false;
        this._tickTime = 0;
        this._tickDeltaTime = 0;
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), this._frameRead);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), this._frameWrite);
    }
    _getItemClientRect(item, result = {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }) {
        const { clientRect: clientRect } = item;
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
            if (request.element !== element || request.direction !== direction) request.reset();
        } else {
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
        if (!request) return;
        if (request.action) request.action.removeRequest(request);
        this._requestPool.put(request);
        reqMap.delete(item);
    }
    _checkItemOverlap(item, checkX, checkY) {
        const { inertAreaSize: inertAreaSize, targets: targets } = item;
        if (!targets.length) {
            checkX && this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
            checkY && this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
            return;
        }
        const itemData = this._itemData.get(item);
        const moveDirectionX = itemData?.directionX;
        const moveDirectionY = itemData?.directionY;
        if (!moveDirectionX && !moveDirectionY) {
            checkX && this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
            checkY && this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
            return;
        }
        const itemRect = this._getItemClientRect(item, $847760a2c3e36b4b$var$R1);
        let xElement = null;
        let xPriority = -Infinity;
        let xThreshold = 0;
        let xScore = -Infinity;
        let xDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        let xDistance = 0;
        let xMaxScroll = 0;
        let yElement = null;
        let yPriority = -Infinity;
        let yThreshold = 0;
        let yScore = -Infinity;
        let yDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        let yDistance = 0;
        let yMaxScroll = 0;
        let i = 0;
        for(; i < targets.length; i++){
            const target = targets[i];
            const targetThreshold = typeof target.threshold === "number" ? target.threshold : $847760a2c3e36b4b$var$DEFAULT_THRESHOLD;
            const testAxisX = !!(checkX && moveDirectionX && target.axis !== "y");
            const testAxisY = !!(checkY && moveDirectionY && target.axis !== "x");
            const testPriority = target.priority || 0;
            // Ignore this item if it's x-axis and y-axis priority is lower than
            // the currently matching item's.
            if ((!testAxisX || testPriority < xPriority) && (!testAxisY || testPriority < yPriority)) continue;
            const testElement = (0, $e65e66c8ec1805cf$export$31d37ff78a483ce2)(target.element || target);
            const testMaxScrollX = testAxisX ? (0, $91aa171c07aecd5f$export$c16047c7a398106d)(testElement) : -1;
            const testMaxScrollY = testAxisY ? (0, $60454a12296c8639$export$39d53b245a98193e)(testElement) : -1;
            // Ignore this item if there is no possibility to scroll.
            if (testMaxScrollX <= 0 && testMaxScrollY <= 0) continue;
            const testRect = (0, $016235b23a08b22b$export$4b834cebd9e5cebe)([
                testElement,
                "padding"
            ], window);
            let testScore = (0, $960d12c0ef4d8d12$export$25b3e1e24e1ba229)(itemRect, testRect) || -Infinity;
            // If the item has no overlap with the target.
            if (testScore === -Infinity) {
                // If the target has virtual extra padding defined and it's padded
                // version overlaps with item then let's compute the shortest distance
                // between item and target and use that value (negated) as testScore.
                if (target.padding && (0, $75ccfeacce467af1$export$8d3dd0be5eb9f11f)(itemRect, $847760a2c3e36b4b$var$getPaddedRect(testRect, target.padding, $847760a2c3e36b4b$var$R2))) testScore = -((0, $502406f6343b1a94$export$79376507b09a66f)(itemRect, testRect) || 0);
                else continue;
            }
            // Test x-axis.
            if (testAxisX && testPriority >= xPriority && testMaxScrollX > 0 && (testPriority > xPriority || testScore > xScore)) {
                let testDistance = 0;
                let testDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
                const testThreshold = $847760a2c3e36b4b$var$computeThreshold(targetThreshold, testRect.width);
                const testEdgeOffset = $847760a2c3e36b4b$var$computeEdgeOffset(testThreshold, inertAreaSize, itemRect.width, testRect.width);
                if (moveDirectionX === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.right) {
                    testDistance = testRect.right + testEdgeOffset - itemRect.right;
                    if (testDistance <= testThreshold && !$847760a2c3e36b4b$var$isScrolledToMax((0, $33d05a3bd325dc4b$export$1389d168952b34b5)(testElement), testMaxScrollX)) testDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.right;
                } else if (moveDirectionX === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.left) {
                    testDistance = itemRect.left - (testRect.left - testEdgeOffset);
                    if (testDistance <= testThreshold && (0, $33d05a3bd325dc4b$export$1389d168952b34b5)(testElement) > 0) testDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.left;
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
            // Test y-axis.
            if (testAxisY && testPriority >= yPriority && testMaxScrollY > 0 && (testPriority > yPriority || testScore > yScore)) {
                let testDistance = 0;
                let testDirection = $847760a2c3e36b4b$var$AUTO_SCROLL_DIRECTION_Y.none;
                const testThreshold = $847760a2c3e36b4b$var$computeThreshold(targetThreshold, testRect.height);
                const testEdgeOffset = $847760a2c3e36b4b$var$computeEdgeOffset(testThreshold, inertAreaSize, itemRect.height, testRect.height);
                if (moveDirectionY === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.down) {
                    testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
                    if (testDistance <= testThreshold && !$847760a2c3e36b4b$var$isScrolledToMax((0, $5edd28f58e093b4d$export$c4a223a8ba9e4ea5)(testElement), testMaxScrollY)) testDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.down;
                } else if (moveDirectionY === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.up) {
                    testDistance = itemRect.top - (testRect.top - testEdgeOffset);
                    if (testDistance <= testThreshold && (0, $5edd28f58e093b4d$export$c4a223a8ba9e4ea5)(testElement) > 0) testDirection = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.up;
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
        // Request or cancel x-axis scroll.
        if (checkX) {
            if (xElement && xDirection) this._requestItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x, xElement, xDirection, xThreshold, xDistance, xMaxScroll);
            else this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
        }
        // Request or cancel y-axis scroll.
        if (checkY) {
            if (yElement && yDirection) this._requestItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y, yElement, yDirection, yThreshold, yDistance, yMaxScroll);
            else this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
        }
    }
    _updateScrollRequest(scrollRequest) {
        const item = scrollRequest.item;
        const { inertAreaSize: inertAreaSize, smoothStop: smoothStop, targets: targets } = item;
        const itemRect = this._getItemClientRect(item, $847760a2c3e36b4b$var$R1);
        let hasReachedEnd = null;
        let i = 0;
        for(; i < targets.length; i++){
            const target = targets[i];
            // Make sure we have a matching element.
            const testElement = (0, $e65e66c8ec1805cf$export$31d37ff78a483ce2)(target.element || target);
            if (testElement !== scrollRequest.element) continue;
            // Make sure we have a matching axis.
            const testIsAxisX = !!($847760a2c3e36b4b$export$5bbd74ab6c855dff.x & scrollRequest.direction);
            if (testIsAxisX) {
                if (target.axis === "y") continue;
            } else {
                if (target.axis === "x") continue;
            }
            // Make sure the element is still scrollable.
            const testMaxScroll = testIsAxisX ? (0, $91aa171c07aecd5f$export$c16047c7a398106d)(testElement) : (0, $60454a12296c8639$export$39d53b245a98193e)(testElement);
            if (testMaxScroll <= 0) break;
            const testRect = (0, $016235b23a08b22b$export$4b834cebd9e5cebe)([
                testElement,
                "padding"
            ], window);
            const testScore = (0, $960d12c0ef4d8d12$export$25b3e1e24e1ba229)(itemRect, testRect) || -Infinity;
            // If the item has no overlap with the target nor the padded target rect
            // let's stop scrolling.
            if (testScore === -Infinity) {
                const padding = target.scrollPadding || target.padding;
                if (!(padding && (0, $75ccfeacce467af1$export$8d3dd0be5eb9f11f)(itemRect, $847760a2c3e36b4b$var$getPaddedRect(testRect, padding, $847760a2c3e36b4b$var$R2)))) break;
            }
            // Compute threshold.
            const targetThreshold = typeof target.threshold === "number" ? target.threshold : $847760a2c3e36b4b$var$DEFAULT_THRESHOLD;
            const testThreshold = $847760a2c3e36b4b$var$computeThreshold(targetThreshold, testIsAxisX ? testRect.width : testRect.height);
            // Compute edge offset.
            const testEdgeOffset = $847760a2c3e36b4b$var$computeEdgeOffset(testThreshold, inertAreaSize, testIsAxisX ? itemRect.width : itemRect.height, testIsAxisX ? testRect.width : testRect.height);
            // Compute distance (based on current direction).
            let testDistance = 0;
            if (scrollRequest.direction === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.left) testDistance = itemRect.left - (testRect.left - testEdgeOffset);
            else if (scrollRequest.direction === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.right) testDistance = testRect.right + testEdgeOffset - itemRect.right;
            else if (scrollRequest.direction === $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.up) testDistance = itemRect.top - (testRect.top - testEdgeOffset);
            else testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
            // Stop scrolling if threshold is not exceeded.
            if (testDistance > testThreshold) break;
            // Stop scrolling if we have reached max scroll value.
            const testScroll = testIsAxisX ? (0, $33d05a3bd325dc4b$export$1389d168952b34b5)(testElement) : (0, $5edd28f58e093b4d$export$c4a223a8ba9e4ea5)(testElement);
            hasReachedEnd = $847760a2c3e36b4b$export$3eeb7a7b68c92567.forward & scrollRequest.direction ? $847760a2c3e36b4b$var$isScrolledToMax(testScroll, testMaxScroll) : testScroll <= 0;
            if (hasReachedEnd) break;
            // Scrolling can continue, let's update the values.
            scrollRequest.maxValue = testMaxScroll;
            scrollRequest.threshold = testThreshold;
            scrollRequest.distance = testDistance;
            scrollRequest.isEnding = false;
            return true;
        }
        // Before we end the request, let's see if we need to stop the scrolling
        // smoothly or immediately.
        if (smoothStop === true && scrollRequest.speed > 0) {
            if (hasReachedEnd === null) hasReachedEnd = scrollRequest.hasReachedEnd();
            scrollRequest.isEnding = hasReachedEnd ? false : true;
        } else scrollRequest.isEnding = false;
        return scrollRequest.isEnding;
    }
    _updateItems() {
        for(let i = 0; i < this.items.length; i++){
            const item = this.items[i];
            const itemData = this._itemData.get(item);
            const { x: x, y: y } = item.position;
            const prevX = itemData.positionX;
            const prevY = itemData.positionY;
            // If there is no change in position -> skip.
            if (x === prevX && y === prevY) continue;
            // Update direction x.
            itemData.directionX = x > prevX ? $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.right : x < prevX ? $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.left : itemData.directionX;
            // Update direction y.
            itemData.directionY = y > prevY ? $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.down : y < prevY ? $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.up : itemData.directionY;
            // Update positions.
            itemData.positionX = x;
            itemData.positionY = y;
            // Request overlap check (if not already requested).
            if (itemData.overlapCheckRequestTime === 0) itemData.overlapCheckRequestTime = this._tickTime;
        }
    }
    _updateRequests() {
        const items = this.items;
        const requestsX = this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.x];
        const requestsY = this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.y];
        let i = 0;
        for(; i < items.length; i++){
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
                    this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
                }
            }
            let checkY = true;
            const reqY = requestsY.get(item);
            if (reqY && reqY.isActive) {
                checkY = !this._updateScrollRequest(reqY);
                if (checkY) {
                    needsCheck = true;
                    this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
                }
            }
            if (needsCheck) {
                itemData.overlapCheckRequestTime = 0;
                this._checkItemOverlap(item, checkX, checkY);
            }
        }
    }
    _requestAction(request, axis) {
        const isAxisX = axis === $847760a2c3e36b4b$export$5bbd74ab6c855dff.x;
        let action = null;
        let i = 0;
        for(; i < this._actions.length; i++){
            action = this._actions[i];
            // If the action's request does not match the request's -> skip.
            if (request.element !== action.element) {
                action = null;
                continue;
            }
            // If the request and action share the same element, but the request slot
            // for the requested axis is already reserved let's ignore and cancel this
            // request.
            if (isAxisX ? action.requestX : action.requestY) {
                this._cancelItemScroll(request.item, axis);
                return;
            }
            break;
        }
        if (!action) action = this._actionPool.pick();
        action.element = request.element;
        action.addRequest(request);
        request.tick(this._tickDeltaTime);
        this._actions.push(action);
    }
    _updateActions() {
        let i = 0;
        // Generate actions.
        for(i = 0; i < this.items.length; i++){
            const item = this.items[i];
            const reqX = this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.x].get(item);
            const reqY = this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.y].get(item);
            if (reqX) this._requestAction(reqX, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
            if (reqY) this._requestAction(reqY, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
        }
        // Compute scroll values.
        for(i = 0; i < this._actions.length; i++)this._actions[i].computeScrollValues();
    }
    _applyActions() {
        // No actions -> no scrolling.
        if (!this._actions.length) return;
        // TODO: Would be nice to emit also the elements that will be scrolled,
        // to which direction they will be scrolled and how much they will be
        // scrolled.
        this._emitter.emit("beforescroll");
        let i = 0;
        // Scroll all the required elements.
        for(i = 0; i < this._actions.length; i++){
            this._actions[i].scroll();
            this._actionPool.put(this._actions[i]);
        }
        // Reset actions.
        this._actions.length = 0;
        // Call after scroll callbacks for all items that were scrolled.
        let item;
        for(i = 0; i < this.items.length; i++){
            item = this.items[i];
            if (item.onPrepareScrollEffect) item.onPrepareScrollEffect();
        }
        for(i = 0; i < this.items.length; i++){
            item = this.items[i];
            if (item.onApplyScrollEffect) item.onApplyScrollEffect();
        }
        // TODO: Would be nice to emit also the elements that were scrolled,
        // to which direction they were scrolled and how much they were scrolled.
        this._emitter.emit("afterscroll");
    }
    /**
   * Bind a listener.
   */ on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    /**
   * Unbind a listener.
   */ off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    addItem(item) {
        if (this._isDestroyed || this._itemData.has(item)) return;
        const { x: x, y: y } = item.position;
        const itemData = new $847760a2c3e36b4b$var$AutoScrollItemData();
        itemData.positionX = x;
        itemData.positionY = y;
        itemData.directionX = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        itemData.directionY = $847760a2c3e36b4b$export$c9fbd1f9176bc8ed.none;
        itemData.overlapCheckRequestTime = this._tickTime;
        this._itemData.set(item, itemData);
        this.items.push(item);
        if (!this._isTicking) this._startTicking();
    }
    removeItem(item) {
        if (this._isDestroyed) return;
        const index = this.items.indexOf(item);
        if (index === -1) return;
        if (this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.x].get(item)) {
            this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.x);
            this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.x].delete(item);
        }
        if (this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.y].get(item)) {
            this._cancelItemScroll(item, $847760a2c3e36b4b$export$5bbd74ab6c855dff.y);
            this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.y].delete(item);
        }
        this._itemData.delete(item);
        this.items.splice(index, 1);
        if (this._isTicking && !this.items.length) this._stopTicking();
    }
    isDestroyed() {
        return this._isDestroyed;
    }
    isItemScrollingX(item) {
        return !!this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.x].get(item)?.isActive;
    }
    isItemScrollingY(item) {
        return !!this._requests[$847760a2c3e36b4b$export$5bbd74ab6c855dff.y].get(item)?.isActive;
    }
    isItemScrolling(item) {
        return this.isItemScrollingX(item) || this.isItemScrollingY(item);
    }
    updateSettings(options = {}) {
        const { overlapCheckInterval: overlapCheckInterval = this.settings.overlapCheckInterval } = options;
        this.settings.overlapCheckInterval = overlapCheckInterval;
    }
    destroy() {
        if (this._isDestroyed) return;
        const items = this.items.slice(0);
        let i = 0;
        for(; i < items.length; i++)this.removeItem(items[i]);
        this._actions.length = 0;
        this._requestPool.reset();
        this._actionPool.reset();
        this._emitter.off();
        this._isDestroyed = true;
    }
}



const $eab06f1663dc6e1d$export$d976747ecb966cea = new (0, $847760a2c3e36b4b$export$3fb39aee5567f02e)();


const $a19e81f4131cdd76$var$AUTOSCROLL_POSITION = {
    x: 0,
    y: 0
};
const $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};
function $a19e81f4131cdd76$var$getDefaultSettings() {
    return {
        targets: [],
        inertAreaSize: 0.2,
        speed: (0, $847760a2c3e36b4b$export$55a384729d91296b)(),
        smoothStop: false,
        getPosition: (draggable)=>{
            const { drag: drag } = draggable;
            const primaryItem = drag?.items[0];
            // Try to use the first item for the autoscroll data.
            if (primaryItem) {
                $a19e81f4131cdd76$var$AUTOSCROLL_POSITION.x = primaryItem.position.x;
                $a19e81f4131cdd76$var$AUTOSCROLL_POSITION.y = primaryItem.position.y;
            } else {
                const e = drag && (drag.event || drag.startEvent);
                $a19e81f4131cdd76$var$AUTOSCROLL_POSITION.x = e ? e.x : 0;
                $a19e81f4131cdd76$var$AUTOSCROLL_POSITION.y = e ? e.y : 0;
            }
            return $a19e81f4131cdd76$var$AUTOSCROLL_POSITION;
        },
        getClientRect: (draggable)=>{
            const { drag: drag } = draggable;
            const primaryItem = drag?.items[0];
            // Try to use the first item for the autoscroll data.
            if (primaryItem && primaryItem.element) {
                const { left: left, top: top, width: width, height: height } = primaryItem.clientRect;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.left = left;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.top = top;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.width = width;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.height = height;
            } else {
                const e = drag && (drag.event || drag.startEvent);
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.left = e ? e.x - 25 : 0;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.top = e ? e.y - 25 : 0;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
                $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
            }
            return $a19e81f4131cdd76$var$AUTOSCROLL_CLIENT_RECT;
        },
        onStart: null,
        onStop: null
    };
}
class $a19e81f4131cdd76$var$DraggableAutoScrollProxy {
    constructor(draggableAutoScroll, draggable){
        this._draggableAutoScroll = draggableAutoScroll;
        this._draggable = draggable;
        this._position = {
            x: 0,
            y: 0
        };
        this._clientRect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
    }
    _getSettings() {
        return this._draggableAutoScroll.settings;
    }
    get targets() {
        let { targets: targets } = this._getSettings();
        if (typeof targets === "function") targets = targets(this._draggable);
        return targets;
    }
    get position() {
        let { getPosition: getPosition } = this._getSettings();
        if (typeof getPosition === "function") {
            const position = getPosition(this._draggable);
            this._position.x = position.x;
            this._position.y = position.y;
        } else {
            this._position.x = 0;
            this._position.y = 0;
        }
        return this._position;
    }
    get clientRect() {
        let { getClientRect: getClientRect } = this._getSettings();
        if (typeof getClientRect === "function") {
            const { left: left, top: top, width: width, height: height } = getClientRect(this._draggable);
            this._clientRect.left = left;
            this._clientRect.top = top;
            this._clientRect.width = width;
            this._clientRect.height = height;
        } else {
            this._clientRect.left = 0;
            this._clientRect.top = 0;
            this._clientRect.width = 0;
            this._clientRect.height = 0;
        }
        return this._clientRect;
    }
    get inertAreaSize() {
        return this._getSettings().inertAreaSize;
    }
    get smoothStop() {
        return this._getSettings().smoothStop;
    }
    get speed() {
        return this._getSettings().speed;
    }
    get onStart() {
        return this._getSettings().onStart;
    }
    get onStop() {
        return this._getSettings().onStop;
    }
    onPrepareScrollEffect() {
        const updateId = this._draggable["_updateId"];
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$9138efc7ba4fca22), updateId);
        (0, $8c2d7f782ca4b6c1$export$e94d57566be028aa).off((0, $8c2d7f782ca4b6c1$export$5fd1e257088db342), updateId);
        this._draggable["_preparePositionUpdate"]();
    }
    onApplyScrollEffect() {
        this._draggable["_applyPositionUpdate"]();
    }
}
class $a19e81f4131cdd76$export$5059276ad4233de3 {
    constructor(draggable, options = {}){
        this.name = "autoscroll";
        this.version = "0.0.2";
        this.settings = this._parseSettings(options);
        this._autoScrollProxy = null;
        draggable.on("start", ()=>{
            if (!this._autoScrollProxy) {
                this._autoScrollProxy = new $a19e81f4131cdd76$var$DraggableAutoScrollProxy(this, draggable);
                (0, $eab06f1663dc6e1d$export$d976747ecb966cea).addItem(this._autoScrollProxy);
            }
        });
        draggable.on("end", ()=>{
            if (this._autoScrollProxy) {
                (0, $eab06f1663dc6e1d$export$d976747ecb966cea).removeItem(this._autoScrollProxy);
                this._autoScrollProxy = null;
            }
        });
    }
    _parseSettings(options, defaults = $a19e81f4131cdd76$var$getDefaultSettings()) {
        const { targets: targets = defaults.targets, inertAreaSize: inertAreaSize = defaults.inertAreaSize, speed: speed = defaults.speed, smoothStop: smoothStop = defaults.smoothStop, getPosition: getPosition = defaults.getPosition, getClientRect: getClientRect = defaults.getClientRect, onStart: onStart = defaults.onStart, onStop: onStop = defaults.onStop } = options || {};
        return {
            targets: targets,
            inertAreaSize: inertAreaSize,
            speed: speed,
            smoothStop: smoothStop,
            getPosition: getPosition,
            getClientRect: getClientRect,
            onStart: onStart,
            onStop: onStop
        };
    }
    updateSettings(options = {}) {
        this.settings = this._parseSettings(options, this.settings);
    }
}
function $a19e81f4131cdd76$export$c0f5c18ade842ccd(options) {
    return (draggable)=>{
        const p = new $a19e81f4131cdd76$export$5059276ad4233de3(draggable, options);
        const d = draggable;
        d.plugins[p.name] = p;
        return d;
    };
}







const $4c57447af3a2649b$var$SCROLLABLE_OVERFLOWS = new Set([
    "auto",
    "scroll",
    "overlay"
]);
function $4c57447af3a2649b$export$2bb74740c4e19def(element) {
    const style = (0, $0357fc671186a867$export$3d2f074408bd1b82)(element);
    return !!($4c57447af3a2649b$var$SCROLLABLE_OVERFLOWS.has(style.overflowY) || $4c57447af3a2649b$var$SCROLLABLE_OVERFLOWS.has(style.overflowX));
}


/**
 * Check if the current value is a document.
 */ function $a5557f3259fe2768$export$62858bae88b53fd0(value) {
    return value instanceof Document;
}


function $c4a68430e39d92be$export$e4864aa91b5ed091(element, result = []) {
    let parent = element?.parentNode;
    while(parent && !(0, $a5557f3259fe2768$export$62858bae88b53fd0)(parent)){
        if (parent instanceof Element) {
            if ((0, $4c57447af3a2649b$export$2bb74740c4e19def)(parent)) result.push(parent);
            parent = parent.parentNode;
        } else if (parent instanceof ShadowRoot) parent = parent.host;
        else parent = parent.parentNode;
    }
    // Always push window to the results (as last scrollable element).
    result.push(window);
    return result;
}



function $bf69e6d48d01a2a7$var$getScrollables(element) {
    const scrollables = [];
    if ((0, $4c57447af3a2649b$export$2bb74740c4e19def)(element)) scrollables.push(element);
    (0, $c4a68430e39d92be$export$e4864aa91b5ed091)(element, scrollables);
    return scrollables;
}
function $bf69e6d48d01a2a7$export$88d83dc4a35d804f(options = {}) {
    let dragAllowed = undefined;
    let startTimeStamp = 0;
    let targetElement = null;
    let timer = undefined;
    const { timeout: timeout = 250, fallback: fallback = ()=>true } = options;
    const onContextMenu = (e)=>e.preventDefault();
    const onTouchMove = (e)=>{
        if (!startTimeStamp) return;
        if (dragAllowed) {
            e.cancelable && e.preventDefault();
            return;
        }
        if (dragAllowed === undefined) {
            if (e.cancelable && e.timeStamp - startTimeStamp > timeout) {
                dragAllowed = true;
                e.preventDefault();
            } else dragAllowed = false;
        }
    };
    const pointerSensorStartPredicate = (data)=>{
        if (!(data.sensor instanceof (0, $792d52ca200635d4$export$b26af955418d6638))) return fallback(data);
        const { draggable: draggable, sensor: sensor, event: event } = data;
        const e = event;
        if (e.pointerType === "touch") {
            // On first event (touchstart/pointerdown) we need to store the drag start
            // data and bind listeners for touchmove and contextmenu.
            if (e.type === "start" && (e.srcEvent.type === "pointerdown" || e.srcEvent.type === "touchstart")) {
                // Prevent potentially scrollable nodes from scrolling to make sure
                // native scrolling does not interfere with dragging.
                targetElement = e.target;
                const scrollables = targetElement ? $bf69e6d48d01a2a7$var$getScrollables(targetElement) : [];
                scrollables.forEach((scrollable)=>{
                    scrollable.addEventListener("touchmove", onTouchMove, {
                        passive: false,
                        capture: true
                    });
                });
                const dragEndListener = ()=>{
                    if (!startTimeStamp) return;
                    // Unbind listeners.
                    draggable.off("end", dragEndListener);
                    draggable.sensors.forEach((sensor)=>{
                        if (sensor instanceof (0, $792d52ca200635d4$export$b26af955418d6638)) sensor.off("end", dragEndListener);
                    });
                    targetElement?.removeEventListener("contextmenu", onContextMenu);
                    scrollables.forEach((scrollable)=>{
                        scrollable.removeEventListener("touchmove", onTouchMove, {
                            capture: true
                        });
                    });
                    // Reset state.
                    startTimeStamp = 0;
                    dragAllowed = undefined;
                    targetElement = null;
                    timer = void window.clearTimeout(timer);
                };
                // Set start state.
                dragAllowed = undefined;
                startTimeStamp = e.srcEvent.timeStamp;
                // Prevent context menu popping up.
                targetElement?.addEventListener("contextmenu", onContextMenu);
                // Reset data on drag end.
                draggable.on("end", dragEndListener);
                draggable.sensors.forEach((sensor)=>{
                    if (sensor instanceof (0, $792d52ca200635d4$export$b26af955418d6638)) sensor.off("end", dragEndListener);
                });
                // If we have timeout defined, let's set a timer that force starts
                // the drag process after the timeout.
                // TODO: This will start drag sometimes when it's not actually possible
                // to prevent the native scrolling on touch devices. We'd need a way
                // to check if the first touchstart/touchmove is cancelable. Needs
                // testing on real devices. The funky thing is that we seem to need to
                // get one touchmove event to check if we can prevent native scrolling
                // but that is kind of too late already.. let's see if we can detect
                // that earlier somehow.
                if (timeout > 0) timer = window.setTimeout(()=>{
                    draggable.resolveStartPredicate(sensor);
                    dragAllowed = true;
                    timer = undefined;
                }, timeout);
            }
            return dragAllowed;
        }
        // On mouse/pen let's allow starting drag immediately if mouse's left button
        // is pressed down.
        if (e.type === "start" && !e.srcEvent.button) return true;
        else return false;
    };
    return pointerSensorStartPredicate;
}


function $16f33ecaba6c77e5$var$round(value, multipleOf) {
    return Math.round(value / multipleOf) * multipleOf;
}
function $16f33ecaba6c77e5$var$getAxisChange(gridSize, snapPosition, sensorPosition) {
    let change = sensorPosition - snapPosition;
    let changeAbs = Math.abs(change);
    if (changeAbs >= gridSize) {
        const overflow = changeAbs % gridSize;
        return $16f33ecaba6c77e5$var$round(change > 0 ? change - overflow : change + overflow, gridSize);
    }
    return 0;
}
function $16f33ecaba6c77e5$export$7f11ea1f0ba255b5(gridWidth, gridHeight) {
    return function snapModifier({ startEvent: startEvent, event: event, item: item }) {
        let { __snapX__: __snapX__ = startEvent.x, __snapY__: __snapY__ = startEvent.y } = item.data;
        const changeX = $16f33ecaba6c77e5$var$getAxisChange(gridWidth, __snapX__, event.x);
        const changeY = $16f33ecaba6c77e5$var$getAxisChange(gridHeight, __snapY__, event.y);
        if (changeX) item.data.__snapX__ = __snapX__ + changeX;
        if (changeY) item.data.__snapY__ = __snapY__ + changeY;
        return {
            x: changeX,
            y: changeY
        };
    };
}




const $87d1b149f849cf35$var$element = document.querySelector(".draggable");
const $87d1b149f849cf35$var$pointerSensor = new (0, $792d52ca200635d4$export$b26af955418d6638)($87d1b149f849cf35$var$element);
const $87d1b149f849cf35$var$keyboardSensor = new (0, $9e75b1bcee5bf187$export$436f6efcc297171)();
const $87d1b149f849cf35$var$draggable = new (0, $792c55b8bb65db3f$export$f2a139e5d18b9882)([
    $87d1b149f849cf35$var$pointerSensor,
    $87d1b149f849cf35$var$keyboardSensor
], {
    getElements: ()=>[
            $87d1b149f849cf35$var$element
        ],
    startPredicate: (0, $bf69e6d48d01a2a7$export$88d83dc4a35d804f)(),
    getFrozenProps: ()=>[
            "transform"
        ]
});
$87d1b149f849cf35$var$draggable.on("start", ()=>{
    $87d1b149f849cf35$var$element.classList.add("dragging");
});
$87d1b149f849cf35$var$draggable.on("end", ()=>{
    $87d1b149f849cf35$var$element.classList.remove("dragging");
});


//# sourceMappingURL=index.659e82a6.js.map
