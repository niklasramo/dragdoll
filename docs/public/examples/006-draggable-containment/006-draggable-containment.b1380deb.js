const $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5 = {
    Start: 'start',
    Move: 'move',
    Cancel: 'cancel',
    End: 'end',
    Destroy: 'destroy'
};
class $b7f29e04c7dc9749$export$f5fe6b3a9dfe845b {
}


var $e4e7a534e772252d$export$242b5ede4c93f7ba = {
    ADD: "add",
    UPDATE: "update",
    IGNORE: "ignore",
    THROW: "throw"
}, $e4e7a534e772252d$var$r, $e4e7a534e772252d$export$4293555f241ae35a = class {
    constructor(t = {}){
        this.dedupe = t.dedupe || $e4e7a534e772252d$export$242b5ede4c93f7ba.ADD, this.getId = t.getId || (()=>Symbol()), this._events = new Map;
    }
    _getListeners(t) {
        let n = this._events.get(t);
        return n ? n.l || (n.l = [
            ...n.m.values()
        ]) : null;
    }
    on(t, n, e) {
        let i = this._events, s = i.get(t);
        s || (s = {
            m: new Map,
            l: null
        }, i.set(t, s));
        let o = s.m;
        if (e = e === $e4e7a534e772252d$var$r ? this.getId(n) : e, o.has(e)) switch(this.dedupe){
            case $e4e7a534e772252d$export$242b5ede4c93f7ba.THROW:
                throw new Error("Eventti: duplicate listener id!");
            case $e4e7a534e772252d$export$242b5ede4c93f7ba.IGNORE:
                return e;
            case $e4e7a534e772252d$export$242b5ede4c93f7ba.UPDATE:
                s.l = null;
                break;
            default:
                o.delete(e), s.l = null;
        }
        return o.set(e, n), s.l?.push(n), e;
    }
    once(t, n, e) {
        let i = 0;
        return e = e === $e4e7a534e772252d$var$r ? this.getId(n) : e, this.on(t, (...s)=>{
            i || (i = 1, this.off(t, e), n(...s));
        }, e);
    }
    off(t, n) {
        if (t === $e4e7a534e772252d$var$r) {
            this._events.clear();
            return;
        }
        if (n === $e4e7a534e772252d$var$r) {
            this._events.delete(t);
            return;
        }
        let e = this._events.get(t);
        e?.m.delete(n) && (e.l = null, e.m.size || this._events.delete(t));
    }
    emit(t, ...n) {
        let e = this._getListeners(t);
        if (e) {
            let i = e.length, s = 0;
            if (n.length) for(; s < i; s++)e[s](...n);
            else for(; s < i; s++)e[s]();
        }
    }
    listenerCount(t) {
        if (t === $e4e7a534e772252d$var$r) {
            let n = 0;
            return this._events.forEach((e)=>{
                n += e.m.size;
            }), n;
        }
        return this._events.get(t)?.m.size || 0;
    }
};



class $b8cf3f0ef33e91cf$export$2176a6ff266bf511 {
    constructor(){
        this.drag = null;
        this.isDestroyed = false;
        this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)();
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
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start, data);
    }
    _move(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move, data);
    }
    _end(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End, data);
        this._resetDragData();
    }
    _cancel(data) {
        if (!this.drag) return;
        this._updateDragData(data);
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel, data);
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
        this._cancel({
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel,
            x: this.drag.x,
            y: this.drag.y
        });
    }
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this.cancel();
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy, {
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy
        });
        this._emitter.off();
    }
}





var $39d853e28916f3ce$export$815e2a1977260d23 = (0, $e4e7a534e772252d$export$242b5ede4c93f7ba), $39d853e28916f3ce$export$39c54bcc89dcee11 = class {
    constructor(e = {}){
        let { phases: t = [], dedupe: r, getId: s } = e;
        this._phases = t, this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)({
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
function $39d853e28916f3ce$export$789135d3cf084551(i = 60) {
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
var $39d853e28916f3ce$export$bf5a5397711dbf71 = class extends $39d853e28916f3ce$export$39c54bcc89dcee11 {
    constructor(e = {}){
        let { paused: t = !1, onDemand: r = !1, requestFrame: s = $39d853e28916f3ce$export$789135d3cf084551(), ...a } = e;
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
function $39d853e28916f3ce$export$4d497fac909c98f0(i) {
    return (e)=>{
        let t = i.requestAnimationFrame(e);
        return ()=>i.cancelAnimationFrame(t);
    };
}


const $e434efa1a293c3f2$export$ef9171fc2626 = {
    read: Symbol(),
    write: Symbol()
};
let $e434efa1a293c3f2$export$e94d57566be028aa = new (0, $39d853e28916f3ce$export$bf5a5397711dbf71)({
    phases: [
        $e434efa1a293c3f2$export$ef9171fc2626.read,
        $e434efa1a293c3f2$export$ef9171fc2626.write
    ]
});
function $e434efa1a293c3f2$export$9bc58717d06262f5(newTicker, phases) {
    $e434efa1a293c3f2$export$e94d57566be028aa = newTicker;
    Object.assign($e434efa1a293c3f2$export$ef9171fc2626, phases);
}


class $07403df99f68f50f$export$2f0ad9ba2f0800d extends (0, $b8cf3f0ef33e91cf$export$2176a6ff266bf511) {
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
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).on((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._tick, this._tick);
    }
    _end(data) {
        if (!this.drag) return;
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._tick);
        super._end(data);
    }
    _cancel(data) {
        if (!this.drag) return;
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._tick);
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
                type: 'tick',
                time: this.drag.time,
                deltaTime: this.drag.deltaTime
            };
            this._emitter.emit('tick', tickEvent);
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
                type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move,
                x: this.drag.x + deltaX,
                y: this.drag.y + deltaY
            });
        } else {
            this.drag.time = time;
            this.drag.deltaTime = 0;
        }
    }
}




function $aeb1faa61a1da9e9$export$6e8069a9617a39e2(e, id) {
    // If we have a pointer event return the whole event if there's a match, and
    // null otherwise.
    if ('pointerId' in e) return e.pointerId === id ? e : null;
    // For touch events let's check if there's a changed touch object that matches
    // the pointerId in which case return the touch object.
    if ('changedTouches' in e) {
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


function $3ce9f989e3b1215a$export$887a228355cf7d95(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
}


function $c295f9e09f57d107$export$a845ff6c553b3014(e) {
    // If we have pointer id available let's use it.
    if ('pointerId' in e) return e.pointerId;
    // For touch events let's get the first changed touch's identifier.
    if ('changedTouches' in e) return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
    // For mouse/other events let's provide a static id. And let's make it a
    // negative number so it has it has not chance of clashing with touch/pointer
    // ids.
    return -1;
}


function $28cac6dbd0c9b92c$export$4d6c83612522bb80(options = {}) {
    const { capture: capture = true, passive: passive = true } = options;
    return {
        capture: capture,
        passive: passive
    };
}


const $b85aa28c289cb8ee$export$e44ffb50cc242ec5 = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const $b85aa28c289cb8ee$export$4af9b1d833a619de = $b85aa28c289cb8ee$export$e44ffb50cc242ec5 && 'ontouchstart' in window;
const $b85aa28c289cb8ee$export$7728c852ca75bb6d = $b85aa28c289cb8ee$export$e44ffb50cc242ec5 && !!window.PointerEvent;
const $b85aa28c289cb8ee$export$af54264dae9065e6 = !!($b85aa28c289cb8ee$export$e44ffb50cc242ec5 && navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && navigator.userAgent && navigator.userAgent.indexOf('CriOS') == -1 && navigator.userAgent.indexOf('FxiOS') == -1);


function $d7b9fe5a227ed738$export$6475a94861c59472(sourceEvents) {
    return sourceEvents === 'auto' || sourceEvents === undefined ? (0, $b85aa28c289cb8ee$export$7728c852ca75bb6d) ? 'pointer' : (0, $b85aa28c289cb8ee$export$4af9b1d833a619de) ? 'touch' : 'mouse' : sourceEvents;
}


const $e72ff61c97f755fe$var$POINTER_EVENTS = {
    start: 'pointerdown',
    move: 'pointermove',
    cancel: 'pointercancel',
    end: 'pointerup'
};
const $e72ff61c97f755fe$var$TOUCH_EVENTS = {
    start: 'touchstart',
    move: 'touchmove',
    cancel: 'touchcancel',
    end: 'touchend'
};
const $e72ff61c97f755fe$var$MOUSE_EVENTS = {
    start: 'mousedown',
    move: 'mousemove',
    cancel: '',
    end: 'mouseup'
};
const $e72ff61c97f755fe$var$SOURCE_EVENTS = {
    pointer: $e72ff61c97f755fe$var$POINTER_EVENTS,
    touch: $e72ff61c97f755fe$var$TOUCH_EVENTS,
    mouse: $e72ff61c97f755fe$var$MOUSE_EVENTS
};
class $e72ff61c97f755fe$export$b26af955418d6638 {
    constructor(element, options = {}){
        const { listenerOptions: listenerOptions = {}, sourceEvents: sourceEvents = 'auto', startPredicate: startPredicate = (e)=>'button' in e && e.button > 0 ? false : true } = options;
        this.element = element;
        this.drag = null;
        this.isDestroyed = false;
        this._areWindowListenersBound = false;
        this._startPredicate = startPredicate;
        this._listenerOptions = (0, $28cac6dbd0c9b92c$export$4d6c83612522bb80)(listenerOptions);
        this._sourceEvents = (0, $d7b9fe5a227ed738$export$6475a94861c59472)(sourceEvents);
        this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)();
        this._onStart = this._onStart.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onEnd = this._onEnd.bind(this);
        // Listen to start event.
        element.addEventListener($e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
    /**
   * Check if the provided event contains the tracked pointer id or in the case
   * of touch event if the first changed touch is the tracked touch object and
   * return the event or touch object. Otherwise return null.
   */ _getTrackedPointerEventData(e) {
        return this.drag ? (0, $aeb1faa61a1da9e9$export$6e8069a9617a39e2)(e, this.drag.pointerId) : null;
    }
    /**
   * Listener for start event.
   */ _onStart(e) {
        if (this.isDestroyed || this.drag) return;
        // Make sure start predicate is fulfilled.
        if (!this._startPredicate(e)) return;
        // Try to get pointer id.
        const pointerId = (0, $c295f9e09f57d107$export$a845ff6c553b3014)(e);
        if (pointerId === null) return;
        // Try to get pointer.
        const pointerEventData = (0, $aeb1faa61a1da9e9$export$6e8069a9617a39e2)(e, pointerId);
        if (pointerEventData === null) return;
        // Create drag data.
        const dragData = {
            pointerId: pointerId,
            pointerType: (0, $3ce9f989e3b1215a$export$887a228355cf7d95)(e),
            x: pointerEventData.clientX,
            y: pointerEventData.clientY
        };
        // Set drag data.
        this.drag = dragData;
        // Emit start event.
        const eventData = {
            ...dragData,
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start,
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
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move,
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
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel,
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
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End,
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
        const { move: move, end: end, cancel: cancel } = $e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents];
        window.addEventListener(move, this._onMove, this._listenerOptions);
        window.addEventListener(end, this._onEnd, this._listenerOptions);
        if (cancel) window.addEventListener(cancel, this._onCancel, this._listenerOptions);
        this._areWindowListenersBound = true;
    }
    /**
   * Unbind window event listeners for move/end/cancel.
   */ _unbindWindowListeners() {
        if (this._areWindowListenersBound) {
            const { move: move, end: end, cancel: cancel } = $e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents];
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
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel,
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
        const nextSourceEvents = (0, $d7b9fe5a227ed738$export$6475a94861c59472)(sourceEvents);
        const nextListenerOptions = (0, $28cac6dbd0c9b92c$export$4d6c83612522bb80)(listenerOptions);
        // Update start predicate if needed.
        if (startPredicate && this._startPredicate !== startPredicate) this._startPredicate = startPredicate;
        // Update listener options and/or source events if needed.
        if (listenerOptions && (this._listenerOptions.capture !== nextListenerOptions.capture || this._listenerOptions.passive === nextListenerOptions.passive) || sourceEvents && this._sourceEvents !== nextSourceEvents) {
            // Unbind start listener.
            this.element.removeEventListener($e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
            // Unbind window listeners.
            this._unbindWindowListeners();
            // Cancel current drag process.
            this.cancel();
            // Update options to instace.
            if (sourceEvents) this._sourceEvents = nextSourceEvents;
            if (listenerOptions && nextListenerOptions) this._listenerOptions = nextListenerOptions;
            // Rebind start listener with new options.
            this.element.addEventListener($e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
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
        this._emitter.emit((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy, {
            type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy
        });
        // Destroy emitter.
        this._emitter.off();
        // Unbind start event listeners.
        this.element.removeEventListener($e72ff61c97f755fe$var$SOURCE_EVENTS[this._sourceEvents].start, this._onStart, this._listenerOptions);
    }
}




const $2a9b1c646b3552c1$export$247491620fa01a28 = {
    moveDistance: 25,
    cancelOnBlur: true,
    cancelOnVisibilityChange: true,
    startPredicate: (e, sensor)=>{
        if (sensor.element && (e.key === 'Enter' || e.key === ' ')) {
            if (document.activeElement === sensor.element) {
                const { x: x, y: y } = sensor.element.getBoundingClientRect();
                return {
                    x: x,
                    y: y
                };
            }
        }
        return null;
    },
    movePredicate: (e, sensor)=>{
        if (!sensor.drag) return null;
        switch(e.key){
            case 'ArrowLeft':
                return {
                    x: sensor.drag.x - sensor.moveDistance.x,
                    y: sensor.drag.y
                };
            case 'ArrowRight':
                return {
                    x: sensor.drag.x + sensor.moveDistance.x,
                    y: sensor.drag.y
                };
            case 'ArrowUp':
                return {
                    x: sensor.drag.x,
                    y: sensor.drag.y - sensor.moveDistance.y
                };
            case 'ArrowDown':
                return {
                    x: sensor.drag.x,
                    y: sensor.drag.y + sensor.moveDistance.y
                };
            default:
                return null;
        }
    },
    cancelPredicate: (e, sensor)=>{
        if (sensor.drag && e.key === 'Escape') {
            const { x: x, y: y } = sensor.drag;
            return {
                x: x,
                y: y
            };
        }
        return null;
    },
    endPredicate: (e, sensor)=>{
        if (sensor.drag && (e.key === 'Enter' || e.key === ' ')) {
            const { x: x, y: y } = sensor.drag;
            return {
                x: x,
                y: y
            };
        }
        return null;
    }
};
class $2a9b1c646b3552c1$export$44d67f2a438aeba9 extends (0, $b8cf3f0ef33e91cf$export$2176a6ff266bf511) {
    constructor(element, options = {}){
        super();
        const { moveDistance: moveDistance = $2a9b1c646b3552c1$export$247491620fa01a28.moveDistance, cancelOnBlur: cancelOnBlur = $2a9b1c646b3552c1$export$247491620fa01a28.cancelOnBlur, cancelOnVisibilityChange: cancelOnVisibilityChange = $2a9b1c646b3552c1$export$247491620fa01a28.cancelOnVisibilityChange, startPredicate: startPredicate = $2a9b1c646b3552c1$export$247491620fa01a28.startPredicate, movePredicate: movePredicate = $2a9b1c646b3552c1$export$247491620fa01a28.movePredicate, cancelPredicate: cancelPredicate = $2a9b1c646b3552c1$export$247491620fa01a28.cancelPredicate, endPredicate: endPredicate = $2a9b1c646b3552c1$export$247491620fa01a28.endPredicate } = options;
        this.element = element;
        this.moveDistance = typeof moveDistance === 'number' ? {
            x: moveDistance,
            y: moveDistance
        } : {
            ...moveDistance
        };
        this._cancelOnBlur = cancelOnBlur;
        this._cancelOnVisibilityChange = cancelOnVisibilityChange;
        this._startPredicate = startPredicate;
        this._movePredicate = movePredicate;
        this._cancelPredicate = cancelPredicate;
        this._endPredicate = endPredicate;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._internalCancel = this._internalCancel.bind(this);
        this._blurCancelHandler = this._blurCancelHandler.bind(this);
        document.addEventListener('keydown', this._onKeyDown);
        if (cancelOnBlur) element?.addEventListener('blur', this._blurCancelHandler);
        if (cancelOnVisibilityChange) document.addEventListener('visibilitychange', this._internalCancel);
    }
    _internalCancel() {
        this.cancel();
    }
    _blurCancelHandler() {
        // If the Draggable has a container defined the dragged element will be
        // appended to the container, which will cause the element to lose focus
        // temporarily in some browsers (e.g. Chrome). Draggable will automatically
        // restore the focus immediately after the element is appended, but the blur
        // event will be triggered anyway. This is why we need to defer the cancel
        // call to the next microtask, where we can check if the element is still
        // focused.
        queueMicrotask(()=>{
            if (document.activeElement !== this.element) this.cancel();
        });
    }
    _onKeyDown(e) {
        // Handle start.
        if (!this.drag) {
            const startPosition = this._startPredicate(e, this);
            if (startPosition) {
                e.preventDefault();
                this._start({
                    type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start,
                    x: startPosition.x,
                    y: startPosition.y,
                    srcEvent: e
                });
            }
            return;
        }
        // Handle cancel.
        const cancelPosition = this._cancelPredicate(e, this);
        if (cancelPosition) {
            e.preventDefault();
            this._cancel({
                type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel,
                x: cancelPosition.x,
                y: cancelPosition.y,
                srcEvent: e
            });
            return;
        }
        // Handle end.
        const endPosition = this._endPredicate(e, this);
        if (endPosition) {
            e.preventDefault();
            this._end({
                type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End,
                x: endPosition.x,
                y: endPosition.y,
                srcEvent: e
            });
            return;
        }
        // Handle move.
        const movePosition = this._movePredicate(e, this);
        if (movePosition) {
            e.preventDefault();
            this._move({
                type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move,
                x: movePosition.x,
                y: movePosition.y,
                srcEvent: e
            });
            return;
        }
    }
    updateSettings(options = {}) {
        const { moveDistance: moveDistance, cancelOnBlur: cancelOnBlur, cancelOnVisibilityChange: cancelOnVisibilityChange, startPredicate: startPredicate, movePredicate: movePredicate, cancelPredicate: cancelPredicate, endPredicate: endPredicate } = options;
        if (moveDistance !== undefined) {
            if (typeof moveDistance === 'number') this.moveDistance.x = this.moveDistance.y = moveDistance;
            else {
                this.moveDistance.x = moveDistance.x;
                this.moveDistance.y = moveDistance.y;
            }
        }
        if (cancelOnBlur !== undefined && this._cancelOnBlur !== cancelOnBlur) {
            this._cancelOnBlur = cancelOnBlur;
            if (cancelOnBlur) this.element?.addEventListener('blur', this._blurCancelHandler);
            else this.element?.removeEventListener('blur', this._blurCancelHandler);
        }
        if (cancelOnVisibilityChange !== undefined && this._cancelOnVisibilityChange !== cancelOnVisibilityChange) {
            this._cancelOnVisibilityChange = cancelOnVisibilityChange;
            if (cancelOnVisibilityChange) document.addEventListener('visibilitychange', this._internalCancel);
            else document.removeEventListener('visibilitychange', this._internalCancel);
        }
        if (startPredicate) this._startPredicate = startPredicate;
        if (movePredicate) this._movePredicate = movePredicate;
        if (cancelPredicate) this._cancelPredicate = cancelPredicate;
        if (endPredicate) this._endPredicate = endPredicate;
    }
    destroy() {
        if (this.isDestroyed) return;
        super.destroy();
        document.removeEventListener('keydown', this._onKeyDown);
        if (this._cancelOnBlur) this.element?.removeEventListener('blur', this._blurCancelHandler);
        if (this._cancelOnVisibilityChange) document.removeEventListener('visibilitychange', this._internalCancel);
    }
}




const $7fff4587bd07df96$var$KEY_TYPES = [
    'start',
    'cancel',
    'end',
    'moveLeft',
    'moveRight',
    'moveUp',
    'moveDown'
];
function $7fff4587bd07df96$var$getEarliestTimestamp(keys, timestamps) {
    if (!keys.size || !timestamps.size) return Infinity;
    let result = Infinity;
    for (const key of keys){
        const timestamp = timestamps.get(key);
        if (timestamp !== undefined && timestamp < result) result = timestamp;
    }
    return result;
}
const $7fff4587bd07df96$export$fbce5a9938cd33df = {
    startKeys: [
        ' ',
        'Enter'
    ],
    moveLeftKeys: [
        'ArrowLeft'
    ],
    moveRightKeys: [
        'ArrowRight'
    ],
    moveUpKeys: [
        'ArrowUp'
    ],
    moveDownKeys: [
        'ArrowDown'
    ],
    cancelKeys: [
        'Escape'
    ],
    endKeys: [
        ' ',
        'Enter'
    ],
    cancelOnBlur: true,
    cancelOnVisibilityChange: true,
    computeSpeed: ()=>500,
    startPredicate: (_e, sensor)=>{
        if (sensor.element && document.activeElement === sensor.element) {
            const { left: left, top: top } = sensor.element.getBoundingClientRect();
            return {
                x: left,
                y: top
            };
        }
        return null;
    }
};
class $7fff4587bd07df96$export$436f6efcc297171 extends (0, $07403df99f68f50f$export$2f0ad9ba2f0800d) {
    constructor(element, options = {}){
        super();
        const { startPredicate: startPredicate = $7fff4587bd07df96$export$fbce5a9938cd33df.startPredicate, computeSpeed: computeSpeed = $7fff4587bd07df96$export$fbce5a9938cd33df.computeSpeed, cancelOnVisibilityChange: cancelOnVisibilityChange = $7fff4587bd07df96$export$fbce5a9938cd33df.cancelOnVisibilityChange, cancelOnBlur: cancelOnBlur = $7fff4587bd07df96$export$fbce5a9938cd33df.cancelOnBlur, startKeys: startKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.startKeys, moveLeftKeys: moveLeftKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.moveLeftKeys, moveRightKeys: moveRightKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.moveRightKeys, moveUpKeys: moveUpKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.moveUpKeys, moveDownKeys: moveDownKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.moveDownKeys, cancelKeys: cancelKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.cancelKeys, endKeys: endKeys = $7fff4587bd07df96$export$fbce5a9938cd33df.endKeys } = options;
        this.element = element;
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
        this._cancelOnBlur = cancelOnBlur;
        this._cancelOnVisibilityChange = cancelOnVisibilityChange;
        this._computeSpeed = computeSpeed;
        this._startPredicate = startPredicate;
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTick = this._onTick.bind(this);
        this._internalCancel = this._internalCancel.bind(this);
        this._blurCancelHandler = this._blurCancelHandler.bind(this);
        this.on('tick', this._onTick, this._onTick);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
        if (cancelOnBlur) element?.addEventListener('blur', this._blurCancelHandler);
        if (cancelOnVisibilityChange) document.addEventListener('visibilitychange', this._internalCancel);
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
    _internalCancel() {
        this.cancel();
    }
    _blurCancelHandler() {
        // If the Draggable has a container defined the dragged element will be
        // appended to the container, which will cause the element to lose focus
        // temporarily in some browsers (e.g. Chrome). Draggable will automatically
        // restore the focus immediately after the element is appended, but the blur
        // event will be triggered anyway. This is why we need to defer the cancel
        // call to the next microtask, where we can check if the element is still
        // focused.
        queueMicrotask(()=>{
            if (document.activeElement !== this.element) this.cancel();
        });
    }
    _updateDirection() {
        const leftTime = $7fff4587bd07df96$var$getEarliestTimestamp(this._moveLeftKeys, this._moveKeyTimestamps);
        const rightTime = $7fff4587bd07df96$var$getEarliestTimestamp(this._moveRightKeys, this._moveKeyTimestamps);
        const upTime = $7fff4587bd07df96$var$getEarliestTimestamp(this._moveUpKeys, this._moveKeyTimestamps);
        const downTime = $7fff4587bd07df96$var$getEarliestTimestamp(this._moveDownKeys, this._moveKeyTimestamps);
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
                        type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start,
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
            this._internalCancel();
            return;
        }
        // Handle end.
        if (this._endKeys.has(e.key)) {
            e.preventDefault();
            this._end({
                type: (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End,
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
        const { cancelOnBlur: cancelOnBlur, cancelOnVisibilityChange: cancelOnVisibilityChange, startPredicate: startPredicate, computeSpeed: computeSpeed } = options;
        if (cancelOnBlur !== undefined && this._cancelOnBlur !== cancelOnBlur) {
            this._cancelOnBlur = cancelOnBlur;
            if (cancelOnBlur) this.element?.addEventListener('blur', this._blurCancelHandler);
            else this.element?.removeEventListener('blur', this._blurCancelHandler);
        }
        if (cancelOnVisibilityChange !== undefined && this._cancelOnVisibilityChange !== cancelOnVisibilityChange) {
            this._cancelOnVisibilityChange = cancelOnVisibilityChange;
            if (cancelOnVisibilityChange) document.addEventListener('visibilitychange', this._internalCancel);
            else document.removeEventListener('visibilitychange', this._internalCancel);
        }
        if (startPredicate !== undefined) this._startPredicate = startPredicate;
        if (computeSpeed !== undefined) this._computeSpeed = computeSpeed;
        $7fff4587bd07df96$var$KEY_TYPES.forEach((keyType, index)=>{
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
        this.off('tick', this._onTick);
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup', this._onKeyUp);
        if (this._cancelOnBlur) this.element?.removeEventListener('blur', this._blurCancelHandler);
        if (this._cancelOnVisibilityChange) document.removeEventListener('visibilitychange', this._internalCancel);
    }
}




class $dae2d52ffd859f14$export$ee7258b8691956a3 {
    constructor(){
        this._cache = new Map();
        this._validation = new Map();
    }
    set(key, value) {
        this._cache.set(key, value);
        this._validation.set(key, undefined);
    }
    get(key) {
        return this._cache.get(key);
    }
    has(key) {
        return this._cache.has(key);
    }
    delete(key) {
        this._cache.delete(key);
        this._validation.delete(key);
    }
    isValid(key) {
        return this._validation.has(key);
    }
    invalidate(key) {
        if (key === undefined) this._validation.clear();
        else this._validation.delete(key);
    }
    clear() {
        this._cache.clear();
        this._validation.clear();
    }
}


class $ce7a95b3ae8104e2$export$12e4b40eac1bcb71 {
    constructor(sensor, startEvent){
        this.sensor = sensor;
        this.startEvent = startEvent;
        this.prevMoveEvent = startEvent;
        this.moveEvent = startEvent;
        this.endEvent = null;
        this.items = [];
        this.isEnded = false;
        this._matrixCache = new (0, $dae2d52ffd859f14$export$ee7258b8691956a3)();
        this._clientOffsetCache = new (0, $dae2d52ffd859f14$export$ee7258b8691956a3)();
    }
}


const $65ad764949353701$var$STYLE_DECLARATION_CACHE = new WeakMap;
function $65ad764949353701$export$3d2f074408bd1b82(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let C = $65ad764949353701$var$STYLE_DECLARATION_CACHE.get(e)?.deref();
    return C || (C = window.getComputedStyle(e, null), $65ad764949353701$var$STYLE_DECLARATION_CACHE.set(e, new WeakRef(C))), C;
}


const $8cef340d01b5ba40$export$e44ffb50cc242ec5 = "undefined" != typeof window && void 0 !== window.document;
const $8cef340d01b5ba40$export$af54264dae9065e6 = !!($8cef340d01b5ba40$export$e44ffb50cc242ec5 && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
const $8cef340d01b5ba40$export$11fd24d838ebde87 = {
    content: "content",
    padding: "padding",
    scrollbar: "scrollbar",
    border: "border",
    margin: "margin"
};
const $8cef340d01b5ba40$export$76e909bcfd8ba196 = {
    [$8cef340d01b5ba40$export$11fd24d838ebde87.content]: !1,
    [$8cef340d01b5ba40$export$11fd24d838ebde87.padding]: !1,
    [$8cef340d01b5ba40$export$11fd24d838ebde87.scrollbar]: !0,
    [$8cef340d01b5ba40$export$11fd24d838ebde87.border]: !0,
    [$8cef340d01b5ba40$export$11fd24d838ebde87.margin]: !0
};
const $8cef340d01b5ba40$export$d2ad2856e215d28e = new Set([
    "auto",
    "scroll"
]);
const $8cef340d01b5ba40$export$cd414719242f618c = (()=>{
    try {
        return window.navigator.userAgentData.brands.some(({ brand: n })=>"Chromium" === n);
    } catch (n) {
        return !1;
    }
})();




function $5db358c21c70b735$export$fab73c3646bf1f5e(e) {
    switch((0, $65ad764949353701$export$3d2f074408bd1b82)(e).display){
        case "none":
            return null;
        case "inline":
        case "contents":
            return !1;
        default:
            return !0;
    }
}


function $272acad5c935d918$export$e5ce114ae0e5f4e8(n) {
    const t = (0, $65ad764949353701$export$3d2f074408bd1b82)(n);
    if (!(0, $8cef340d01b5ba40$export$af54264dae9065e6)) {
        const { filter: n } = t;
        if (n && "none" !== n) return !0;
        const { backdropFilter: e } = t;
        if (e && "none" !== e) return !0;
        const { willChange: i } = t;
        if (i && (i.indexOf("filter") > -1 || i.indexOf("backdrop-filter") > -1)) return !0;
    }
    const e = (0, $5db358c21c70b735$export$fab73c3646bf1f5e)(n);
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
    return !(!c || !(c.indexOf("transform") > -1 || c.indexOf("perspective") > -1 || c.indexOf("contain") > -1)) || !!((0, $8cef340d01b5ba40$export$af54264dae9065e6) && c && c.indexOf("filter") > -1);
}




function $a923102b6825af41$export$996cb64f2dabb66f(t) {
    return "static" !== (0, $65ad764949353701$export$3d2f074408bd1b82)(t).position || (0, $272acad5c935d918$export$e5ce114ae0e5f4e8)(t);
}



function $7f91b5daceb63fab$export$d8a62a489b442872(e) {
    return e instanceof HTMLHtmlElement;
}


function $ab425563b6685912$export$940d8225183e1404(e, t = {}) {
    if ((0, $7f91b5daceb63fab$export$d8a62a489b442872)(e)) return e.ownerDocument.defaultView;
    const n = t.position || (0, $65ad764949353701$export$3d2f074408bd1b82)(e).position, { skipDisplayNone: i, container: o } = t;
    switch(n){
        case "static":
        case "relative":
        case "sticky":
        case "-webkit-sticky":
            {
                let t = o || e.parentElement;
                for(; t;){
                    const e = (0, $5db358c21c70b735$export$fab73c3646bf1f5e)(t);
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
                    const e = t ? (0, $272acad5c935d918$export$e5ce114ae0e5f4e8)(l) : (0, $a923102b6825af41$export$996cb64f2dabb66f)(l);
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


function $c9c2988a494de166$export$8d3dd0be5eb9f11f(t, e) {
    return !(t.left + t.width <= e.left || e.left + e.width <= t.left || t.top + t.height <= e.top || e.top + e.height <= t.top);
}


function $e47a48fe2e681492$export$53137579a3174918(t, e, n, o) {
    return Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - e, 2));
}


function $cbc3988fecfe8835$export$2d670be792dba464(t, e) {
    if ((0, $c9c2988a494de166$export$8d3dd0be5eb9f11f)(t, e)) return null;
    const n = t.left + t.width, i = t.top + t.height, o = e.left + e.width, s = e.top + e.height;
    return n <= e.left ? i <= e.top ? (0, $e47a48fe2e681492$export$53137579a3174918)(n, i, e.left, e.top) : t.top >= s ? (0, $e47a48fe2e681492$export$53137579a3174918)(n, t.top, e.left, s) : e.left - n : t.left >= o ? i <= e.top ? (0, $e47a48fe2e681492$export$53137579a3174918)(t.left, i, o, e.top) : t.top >= s ? (0, $e47a48fe2e681492$export$53137579a3174918)(t.left, t.top, o, s) : t.left - o : i <= e.top ? e.top - i : t.top - s;
}



function $4e6b83ae058ab888$export$5a096129d439f843(n) {
    return n instanceof Window;
}


function $0a0e00e544acad6d$export$62858bae88b53fd0(n) {
    return n instanceof Document;
}




const $68c58e6b2159256a$var$SUBPIXEL_OFFSET = new Map;
let $68c58e6b2159256a$var$testStyleElement = null, $68c58e6b2159256a$var$testParentElement = null, $68c58e6b2159256a$var$testChildElement = null;
function $68c58e6b2159256a$var$getSubpixelScrollbarSize(t, e) {
    const n = t.split(".");
    let l = $68c58e6b2159256a$var$SUBPIXEL_OFFSET.get(n[1]);
    if (void 0 === l) {
        $68c58e6b2159256a$var$testStyleElement || ($68c58e6b2159256a$var$testStyleElement = document.createElement("style")), $68c58e6b2159256a$var$testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t} !important;\n      }\n    `, $68c58e6b2159256a$var$testParentElement && $68c58e6b2159256a$var$testChildElement || ($68c58e6b2159256a$var$testParentElement = document.createElement("div"), $68c58e6b2159256a$var$testChildElement = document.createElement("div"), $68c58e6b2159256a$var$testParentElement.appendChild($68c58e6b2159256a$var$testChildElement), $68c58e6b2159256a$var$testParentElement.id = "mezr-scrollbar-test", $68c58e6b2159256a$var$testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", $68c58e6b2159256a$var$testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild($68c58e6b2159256a$var$testStyleElement), document.body.appendChild($68c58e6b2159256a$var$testParentElement);
        l = $68c58e6b2159256a$var$testParentElement.getBoundingClientRect().width - $68c58e6b2159256a$var$testChildElement.getBoundingClientRect().width - e, $68c58e6b2159256a$var$SUBPIXEL_OFFSET.set(n[1], l), document.body.removeChild($68c58e6b2159256a$var$testParentElement), document.body.removeChild($68c58e6b2159256a$var$testStyleElement);
    }
    return e + l;
}
function $68c58e6b2159256a$export$5ad86f4734d24a64(t, e, n) {
    if (n <= 0) return 0;
    if (0, $8cef340d01b5ba40$export$cd414719242f618c) {
        const n = (0, $65ad764949353701$export$3d2f074408bd1b82)(t, "::-webkit-scrollbar"), l = "x" === e ? n.height : n.width, i = parseFloat(l);
        if (!Number.isNaN(i) && !Number.isInteger(i)) return $68c58e6b2159256a$var$getSubpixelScrollbarSize(l, i);
    }
    return n;
}


function $a606f886c8a27d9b$export$91cf85d6c980faa0(e, r = !1) {
    if (r) return e.innerWidth;
    const { innerWidth: t, document: i } = e, { documentElement: n } = i, { clientWidth: c } = n;
    return t - (0, $68c58e6b2159256a$export$5ad86f4734d24a64)(n, "y", t - c);
}


function $0ebef02992ef8024$export$a76b7f4aaec6cdf4({ documentElement: t }) {
    return Math.max(t.scrollWidth, t.clientWidth, t.getBoundingClientRect().width);
}






function $50398bdba06c604f$export$742d7f6cc44470f1(t, e = (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) {
    let { width: r } = t.getBoundingClientRect();
    if (e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) return r;
    const o = (0, $65ad764949353701$export$3d2f074408bd1b82)(t);
    return e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).margin ? (r += Math.max(0, parseFloat(o.marginLeft) || 0), r += Math.max(0, parseFloat(o.marginRight) || 0), r) : (r -= parseFloat(o.borderLeftWidth) || 0, r -= parseFloat(o.borderRightWidth) || 0, e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).scrollbar ? r : (!(0, $7f91b5daceb63fab$export$d8a62a489b442872)(t) && (0, $8cef340d01b5ba40$export$d2ad2856e215d28e).has(o.overflowY) && (r -= (0, $68c58e6b2159256a$export$5ad86f4734d24a64)(t, "y", Math.round(r) - t.clientWidth)), e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).padding || (r -= parseFloat(o.paddingLeft) || 0, r -= parseFloat(o.paddingRight) || 0), r));
}


function $667c2544c0b9eb76$export$3c49c185de0c2bfc(t, i = (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) {
    return (0, $4e6b83ae058ab888$export$5a096129d439f843)(t) ? (0, $a606f886c8a27d9b$export$91cf85d6c980faa0)(t, (0, $8cef340d01b5ba40$export$76e909bcfd8ba196)[i]) : (0, $0a0e00e544acad6d$export$62858bae88b53fd0)(t) ? (0, $0ebef02992ef8024$export$a76b7f4aaec6cdf4)(t) : (0, $50398bdba06c604f$export$742d7f6cc44470f1)(t, i);
}






function $b367ae5c21f58ee3$export$a3648dbc3769cbf4(e, r = !1) {
    if (r) return e.innerHeight;
    const { innerHeight: t, document: i } = e, { documentElement: n } = i, { clientHeight: c } = n;
    return t - (0, $68c58e6b2159256a$export$5ad86f4734d24a64)(n, "x", t - c);
}


function $4bf1cf7803616187$export$5806f5d4b3eb6a6a({ documentElement: t }) {
    return Math.max(t.scrollHeight, t.clientHeight, t.getBoundingClientRect().height);
}






function $44627bae74961b62$export$8e0f1520ce23a388(t, e = (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) {
    let { height: r } = t.getBoundingClientRect();
    if (e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) return r;
    const o = (0, $65ad764949353701$export$3d2f074408bd1b82)(t);
    return e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).margin ? (r += Math.max(0, parseFloat(o.marginTop) || 0), r += Math.max(0, parseFloat(o.marginBottom) || 0), r) : (r -= parseFloat(o.borderTopWidth) || 0, r -= parseFloat(o.borderBottomWidth) || 0, e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).scrollbar ? r : (!(0, $7f91b5daceb63fab$export$d8a62a489b442872)(t) && (0, $8cef340d01b5ba40$export$d2ad2856e215d28e).has(o.overflowX) && (r -= (0, $68c58e6b2159256a$export$5ad86f4734d24a64)(t, "x", Math.round(r) - t.clientHeight)), e === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).padding || (r -= parseFloat(o.paddingTop) || 0, r -= parseFloat(o.paddingBottom) || 0), r));
}


function $eb568002b951ac5b$export$c08559766941f856(t, e = (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) {
    return (0, $4e6b83ae058ab888$export$5a096129d439f843)(t) ? (0, $b367ae5c21f58ee3$export$a3648dbc3769cbf4)(t, (0, $8cef340d01b5ba40$export$76e909bcfd8ba196)[e]) : (0, $0a0e00e544acad6d$export$62858bae88b53fd0)(t) ? (0, $4bf1cf7803616187$export$5806f5d4b3eb6a6a)(t) : (0, $44627bae74961b62$export$8e0f1520ce23a388)(t, e);
}


function $97bb8ef5a3ed1ced$export$ff047630cae37d8e(t) {
    return t?.constructor === Object;
}







function $1ddfc565f5f24ff9$export$9f1480883798e819(t, o = (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) {
    const e = {
        left: 0,
        top: 0
    };
    if ((0, $0a0e00e544acad6d$export$62858bae88b53fd0)(t)) return e;
    if ((0, $4e6b83ae058ab888$export$5a096129d439f843)(t)) return e.left += t.scrollX || 0, e.top += t.scrollY || 0, e;
    const r = t.ownerDocument.defaultView;
    r && (e.left += r.scrollX || 0, e.top += r.scrollY || 0);
    const n = t.getBoundingClientRect();
    if (e.left += n.left, e.top += n.top, o === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).border) return e;
    const l = (0, $65ad764949353701$export$3d2f074408bd1b82)(t);
    return o === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).margin ? (e.left -= Math.max(0, parseFloat(l.marginLeft) || 0), e.top -= Math.max(0, parseFloat(l.marginTop) || 0), e) : (e.left += parseFloat(l.borderLeftWidth) || 0, e.top += parseFloat(l.borderTopWidth) || 0, o === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).scrollbar || o === (0, $8cef340d01b5ba40$export$11fd24d838ebde87).padding || (e.left += parseFloat(l.paddingLeft) || 0, e.top += parseFloat(l.paddingTop) || 0), e);
}


function $099080697fe67d0e$export$622cea445a1c5b7d(t, e) {
    const o = (0, $97bb8ef5a3ed1ced$export$ff047630cae37d8e)(t) ? {
        left: t.left,
        top: t.top
    } : Array.isArray(t) ? (0, $1ddfc565f5f24ff9$export$9f1480883798e819)(...t) : (0, $1ddfc565f5f24ff9$export$9f1480883798e819)(t);
    if (e && !(0, $0a0e00e544acad6d$export$62858bae88b53fd0)(e)) {
        const t = (0, $97bb8ef5a3ed1ced$export$ff047630cae37d8e)(e) ? e : Array.isArray(e) ? (0, $1ddfc565f5f24ff9$export$9f1480883798e819)(e[0], e[1]) : (0, $1ddfc565f5f24ff9$export$9f1480883798e819)(e);
        o.left -= t.left, o.top -= t.top;
    }
    return o;
}



function $51639583c18ebb93$export$4b834cebd9e5cebe(t, e) {
    let i = 0, g = 0;
    (0, $97bb8ef5a3ed1ced$export$ff047630cae37d8e)(t) ? (i = t.width, g = t.height) : Array.isArray(t) ? (i = (0, $667c2544c0b9eb76$export$3c49c185de0c2bfc)(...t), g = (0, $eb568002b951ac5b$export$c08559766941f856)(...t)) : (i = (0, $667c2544c0b9eb76$export$3c49c185de0c2bfc)(t), g = (0, $eb568002b951ac5b$export$c08559766941f856)(t));
    const r = (0, $099080697fe67d0e$export$622cea445a1c5b7d)(t, e);
    return {
        width: i,
        height: g,
        ...r,
        right: r.left + i,
        bottom: r.top + g
    };
}



function $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d(t) {
    return (0, $97bb8ef5a3ed1ced$export$ff047630cae37d8e)(t) ? t : (0, $51639583c18ebb93$export$4b834cebd9e5cebe)(t);
}


function $126ac7744288dbf9$export$79376507b09a66f(e, t) {
    const c = (0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(e), i = (0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(t);
    return (0, $cbc3988fecfe8835$export$2d670be792dba464)(c, i);
}




function $8a9f7f9457831eaa$export$72209efa88586d42(t, ...e) {
    const o = {
        ...(0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(t),
        right: 0,
        bottom: 0
    };
    for (const t of e){
        const e = (0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(t), i = Math.max(o.left, e.left), h = Math.min(o.left + o.width, e.left + e.width);
        if (h <= i) return null;
        const r = Math.max(o.top, e.top), l = Math.min(o.top + o.height, e.height + e.top);
        if (l <= r) return null;
        o.left = i, o.top = r, o.width = h - i, o.height = l - r;
    }
    return o.right = o.left + o.width, o.bottom = o.top + o.height, o;
}






function $b2d9660139a5b6b9$export$243d7fadef466e38(n, t = {}) {
    const i = (0, $65ad764949353701$export$3d2f074408bd1b82)(n), { display: o } = i;
    if ("none" === o || "contents" === o) return null;
    const e = t.position || (0, $65ad764949353701$export$3d2f074408bd1b82)(n).position, { skipDisplayNone: s, container: r } = t;
    switch(e){
        case "relative":
            return n;
        case "fixed":
            return (0, $ab425563b6685912$export$940d8225183e1404)(n, {
                container: r,
                position: e,
                skipDisplayNone: s
            });
        case "absolute":
            {
                const t = (0, $ab425563b6685912$export$940d8225183e1404)(n, {
                    container: r,
                    position: e,
                    skipDisplayNone: s
                });
                return (0, $4e6b83ae058ab888$export$5a096129d439f843)(t) ? n.ownerDocument : t;
            }
        default:
            return null;
    }
}



function $7b360c672c5d4730$export$f63a1e5ecde5e3c4(t, e) {
    const o = (0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(t), i = (0, $24eeb73ae6f9dcc4$export$e4e616e82e79ab9d)(e);
    return {
        left: i.left - o.left,
        right: o.left + o.width - (i.left + i.width),
        top: i.top - o.top,
        bottom: o.top + o.height - (i.top + i.height)
    };
}






const $b75b79b0209a801e$var$STYLE_DECLARATION_CACHE = new WeakMap();
function $b75b79b0209a801e$export$3d2f074408bd1b82(element) {
    let styleDeclaration = $b75b79b0209a801e$var$STYLE_DECLARATION_CACHE.get(element)?.deref();
    if (!styleDeclaration) {
        styleDeclaration = window.getComputedStyle(element, null);
        $b75b79b0209a801e$var$STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
    }
    return styleDeclaration;
}



function $b573589083190077$export$ee9ce4f6079fba39(element, result = {
    x: 0,
    y: 0
}) {
    result.x = 0;
    result.y = 0;
    // If window, return 0, 0.
    if (element instanceof Window) return result;
    // If document, return the offset from Window.
    if (element instanceof Document) {
        result.x = window.scrollX * -1;
        result.y = window.scrollY * -1;
        return result;
    }
    // If element, calculate the offset from the element's padding box to the
    // window's top-left corner.
    const { x: x, y: y } = element.getBoundingClientRect();
    const style = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(element);
    result.x = x + (parseFloat(style.borderLeftWidth) || 0);
    result.y = y + (parseFloat(style.borderTopWidth) || 0);
    return result;
}



function $b460b3fb12ddb1cf$export$aff838a5553f2a92(value) {
    return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}


const $ac3b89bdbc283306$var$OFFSET_A = {
    x: 0,
    y: 0
};
const $ac3b89bdbc283306$var$OFFSET_B = {
    x: 0,
    y: 0
};
function $ac3b89bdbc283306$export$5e94c6e790b2d913(elemA, elemB, result = {
    x: 0,
    y: 0
}) {
    const offsetA = (0, $b460b3fb12ddb1cf$export$aff838a5553f2a92)(elemA) ? elemA : (0, $b573589083190077$export$ee9ce4f6079fba39)(elemA, $ac3b89bdbc283306$var$OFFSET_A);
    const offsetB = (0, $b460b3fb12ddb1cf$export$aff838a5553f2a92)(elemB) ? elemB : (0, $b573589083190077$export$ee9ce4f6079fba39)(elemB, $ac3b89bdbc283306$var$OFFSET_B);
    result.x = offsetB.x - offsetA.x;
    result.y = offsetB.y - offsetA.y;
    return result;
}



function $6810de09ef7bb8d4$export$b3766677c9f6af1c(element) {
    const style = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(element);
    let height = parseFloat(style.height) || 0;
    if (style.boxSizing === 'border-box') return height;
    // Add border.
    height += parseFloat(style.borderTopWidth) || 0;
    height += parseFloat(style.borderBottomWidth) || 0;
    // Add padding.
    height += parseFloat(style.paddingTop) || 0;
    height += parseFloat(style.paddingBottom) || 0;
    // Add scrollbar height.
    if (element instanceof HTMLElement) height += element.offsetHeight - element.clientHeight;
    return height;
}



function $a03fb573c6dac2c9$export$615771b112a2e273(element) {
    const style = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(element);
    let width = parseFloat(style.width) || 0;
    if (style.boxSizing === 'border-box') return width;
    // Add border.
    width += parseFloat(style.borderLeftWidth) || 0;
    width += parseFloat(style.borderRightWidth) || 0;
    // Add padding.
    width += parseFloat(style.paddingLeft) || 0;
    width += parseFloat(style.paddingRight) || 0;
    // Add scrollbar width.
    if (element instanceof HTMLElement) width += element.offsetWidth - element.clientWidth;
    return width;
}



function $821e825ab0888da6$export$44ca8ec68e5a97e(el, ignoreNormalTransform = false) {
    const { translate: translate, rotate: rotate, scale: scale, transform: transform } = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(el);
    let transformString = '';
    // Parse translate shorthand.
    if (translate && translate !== 'none') {
        let [x = '0px', y = '0px', z] = translate.split(' ');
        // Transform x to pixels if it's a percentage.
        if (x.includes('%')) x = `${parseFloat(x) / 100 * (0, $a03fb573c6dac2c9$export$615771b112a2e273)(el)}px`;
        // Transform y to pixels if it's a percentage.
        if (y.includes('%')) y = `${parseFloat(y) / 100 * (0, $6810de09ef7bb8d4$export$b3766677c9f6af1c)(el)}px`;
        // z can never be a percentage, but if it is defined we need to use
        // translate3d instead of translate.
        if (z) transformString += `translate3d(${x},${y},${z})`;
        else transformString += `translate(${x},${y})`;
    }
    // Parse rotate shorthand.
    if (rotate && rotate !== 'none') {
        const rotateValues = rotate.split(' ');
        if (rotateValues.length > 1) transformString += `rotate3d(${rotateValues.join(',')})`;
        else transformString += `rotate(${rotateValues.join(',')})`;
    }
    // Parse scale shorthand.
    if (scale && scale !== 'none') {
        const scaleValues = scale.split(' ');
        if (scaleValues.length === 3) transformString += `scale3d(${scaleValues.join(',')})`;
        else transformString += `scale(${scaleValues.join(',')})`;
    }
    // Parse transform.
    if (!ignoreNormalTransform && transform && transform !== 'none') transformString += transform;
    return transformString;
}



function $7e1617964030f7dd$export$808822009ec670b1(transformOrigin) {
    const values = transformOrigin.split(' ');
    let originX = '';
    let originY = '';
    let originZ = '';
    if (values.length === 1) originX = originY = values[0];
    else if (values.length === 2) [originX, originY] = values;
    else [originX, originY, originZ] = values;
    return {
        x: parseFloat(originX) || 0,
        y: parseFloat(originY) || 0,
        z: parseFloat(originZ) || 0
    };
}


const $c87c13e795b928df$var$RESET_TRANSFORM = 'scale(1, 1)';
function $c87c13e795b928df$export$5e2c7a53f84076f2(m) {
    return m.setMatrixValue($c87c13e795b928df$var$RESET_TRANSFORM);
}



const $1271bf80faee7ee7$var$MATRIX = (0, $b85aa28c289cb8ee$export$e44ffb50cc242ec5) ? new DOMMatrix() : null;
function $1271bf80faee7ee7$export$10e4b24b91657790(el, result = new DOMMatrix()) {
    let currentElement = el;
    // Reset the result matrix to identity.
    (0, $c87c13e795b928df$export$5e2c7a53f84076f2)(result);
    while(currentElement){
        const transformString = (0, $821e825ab0888da6$export$44ca8ec68e5a97e)(currentElement);
        if (transformString) {
            $1271bf80faee7ee7$var$MATRIX.setMatrixValue(transformString);
            if (!$1271bf80faee7ee7$var$MATRIX.isIdentity) {
                const { transformOrigin: transformOrigin } = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(currentElement);
                const { x: x, y: y, z: z } = (0, $7e1617964030f7dd$export$808822009ec670b1)(transformOrigin);
                if (z === 0) $1271bf80faee7ee7$var$MATRIX.setMatrixValue(`translate(${x}px,${y}px) ${$1271bf80faee7ee7$var$MATRIX} translate(${x * -1}px,${y * -1}px)`);
                else $1271bf80faee7ee7$var$MATRIX.setMatrixValue(`translate3d(${x}px,${y}px,${z}px) ${$1271bf80faee7ee7$var$MATRIX} translate3d(${x * -1}px,${y * -1}px,${z * -1}px)`);
                result.preMultiplySelf($1271bf80faee7ee7$var$MATRIX);
            }
        }
        currentElement = currentElement.parentElement;
    }
    return result;
}


function $d39c1430c2c971fe$export$ac3d318a39e8020a(el, styles, important = false) {
    const { style: style } = el;
    for(const key in styles)style.setProperty(key, styles[key], important ? 'important' : '');
}


function $3625b5560175528a$export$8de5e08b53f62319() {
    const el = document.createElement('div');
    el.classList.add('dragdoll-measure');
    (0, $d39c1430c2c971fe$export$ac3d318a39e8020a)(el, {
        display: 'block',
        position: 'absolute',
        inset: '0px',
        padding: '0px',
        margin: '0px',
        border: 'none',
        opacity: '0',
        transform: 'none',
        'transform-origin': '0 0',
        transition: 'none',
        animation: 'none',
        'pointer-events': 'none'
    }, true);
    return el;
}


// The naming is a bit misleading here, but this function in essence checks if a
// matrix contains any transformation other than a 2d translation.
function $ba8ad8073c33464d$export$8317bebcfd6ca26c(m) {
    return m.m11 !== 1 || m.m12 !== 0 || m.m13 !== 0 || m.m14 !== 0 || m.m21 !== 0 || m.m22 !== 1 || m.m23 !== 0 || m.m24 !== 0 || m.m31 !== 0 || m.m32 !== 0 || m.m33 !== 1 || m.m34 !== 0 || m.m43 !== 0 || m.m44 !== 1;
}





const $93e17dd02dc97955$var$MEASURE_ELEMENT = (0, $b85aa28c289cb8ee$export$e44ffb50cc242ec5) ? (0, $3625b5560175528a$export$8de5e08b53f62319)() : null;
class $93e17dd02dc97955$export$b87fb2dc7f11ca52 {
    constructor(element, draggable){
        // Make sure the element is in DOM.
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
        if (!element.isConnected) throw new Error('Element is not connected');
        // Make sure drag is defined.
        const { drag: drag } = draggable;
        if (!drag) throw new Error('Drag is not defined');
        const style = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(element);
        const clientRect = element.getBoundingClientRect();
        const individualTransforms = (0, $821e825ab0888da6$export$44ca8ec68e5a97e)(element, true);
        this.data = {};
        this.element = element;
        this.elementTransformOrigin = (0, $7e1617964030f7dd$export$808822009ec670b1)(style.transformOrigin);
        this.elementTransformMatrix = new DOMMatrix().setMatrixValue(individualTransforms + style.transform);
        this.elementOffsetMatrix = new DOMMatrix(individualTransforms).invertSelf();
        this.frozenStyles = null;
        this.unfrozenStyles = null;
        this.position = {
            x: 0,
            y: 0
        };
        this.containerOffset = {
            x: 0,
            y: 0
        };
        this.alignmentOffset = {
            x: 0,
            y: 0
        };
        this._moveDiff = {
            x: 0,
            y: 0
        };
        this._alignDiff = {
            x: 0,
            y: 0
        };
        this._matrixCache = drag['_matrixCache'];
        this._clientOffsetCache = drag['_clientOffsetCache'];
        // Use element's parent element as the element container.
        const elementContainer = element.parentElement;
        if (!elementContainer) throw new Error('Dragged element does not have a parent element.');
        this.elementContainer = elementContainer;
        // Get element's drag parent, default to element's parent element.
        const dragContainer = draggable.settings.container || elementContainer;
        this.dragContainer = dragContainer;
        // Make sure that the element is fixed or absolute positioned if there
        // is a drag container.
        if (elementContainer !== dragContainer) {
            const { position: position } = style;
            if (position !== 'fixed' && position !== 'absolute') throw new Error(`Dragged element has "${position}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
        }
        // Compute element's offset container.
        const elementOffsetContainer = (0, $b2d9660139a5b6b9$export$243d7fadef466e38)(element) || element;
        this.elementOffsetContainer = elementOffsetContainer;
        // Get drag container's offset container.
        const dragOffsetContainer = dragContainer === elementContainer ? elementOffsetContainer : (0, $b2d9660139a5b6b9$export$243d7fadef466e38)(element, {
            container: dragContainer
        });
        this.dragOffsetContainer = dragOffsetContainer;
        // Compute element's client rect.
        {
            const { width: width, height: height, x: x, y: y } = clientRect;
            this.clientRect = {
                width: width,
                height: height,
                x: x,
                y: y
            };
        }
        // Compute container matrices and offset.
        this._updateContainerMatrices();
        this._updateContainerOffset();
        // Get element's frozen props.
        const frozenStyles = draggable.settings.frozenStyles({
            draggable: draggable,
            drag: drag,
            item: this,
            style: style
        });
        if (Array.isArray(frozenStyles)) {
            if (frozenStyles.length) {
                const props = {};
                for (const prop of frozenStyles)props[prop] = style[prop];
                this.frozenStyles = props;
            } else this.frozenStyles = null;
        } else this.frozenStyles = frozenStyles;
        // Lastly, let's compute the unfrozen props. We store the current inline
        // style values for all frozen props so that we can restore them after the
        // drag process is over.
        if (this.frozenStyles) {
            const unfrozenStyles = {};
            for(const key in this.frozenStyles)if (this.frozenStyles.hasOwnProperty(key)) unfrozenStyles[key] = element.style[key];
            this.unfrozenStyles = unfrozenStyles;
        }
    }
    _updateContainerMatrices() {
        [
            this.elementContainer,
            this.dragContainer
        ].forEach((container)=>{
            if (!this._matrixCache.isValid(container)) {
                const matrices = this._matrixCache.get(container) || [
                    new DOMMatrix(),
                    new DOMMatrix()
                ];
                const [matrix, inverseMatrix] = matrices;
                (0, $1271bf80faee7ee7$export$10e4b24b91657790)(container, matrix);
                inverseMatrix.setMatrixValue(matrix.toString()).invertSelf();
                this._matrixCache.set(container, matrices);
            }
        });
    }
    _updateContainerOffset() {
        const { elementOffsetContainer: elementOffsetContainer, elementContainer: elementContainer, dragOffsetContainer: dragOffsetContainer, dragContainer: dragContainer, containerOffset: containerOffset, _clientOffsetCache: _clientOffsetCache, _matrixCache: _matrixCache } = this;
        // If element's offset container is different than drag container's
        // offset container let's compute the offset between the offset containers.
        if (elementOffsetContainer !== dragOffsetContainer) {
            // Get the client offsets for the element and drag containers.
            const [dragOffset, elementOffset] = [
                [
                    dragContainer,
                    dragOffsetContainer
                ],
                [
                    elementContainer,
                    elementOffsetContainer
                ]
            ].map(([container, offsetContainer])=>{
                // Get the client offset from the cache or create a new one.
                const offset = _clientOffsetCache.get(offsetContainer) || {
                    x: 0,
                    y: 0
                };
                // If the client offset is not cached let's compute it.
                if (!_clientOffsetCache.isValid(offsetContainer)) {
                    // Get the world transform matrices.
                    const matrices = _matrixCache.get(container);
                    // If the offset container is a valid HTMLElement and the matrix is
                    // not an identity matrix we need to do some extra work.
                    if (offsetContainer instanceof HTMLElement && matrices && !matrices[0].isIdentity) {
                        // If the matrix is scaled, rotated, skewed or 3d translated we
                        // (unfortunately) need to add a temporary measure element to
                        // compute the untransformed offset from the window's top-left
                        // corner. If there was a way to compute the offset without
                        // manipulating the DOM, we would definitely do that, but
                        // unfortunately, there seems to be no way to do that accurately
                        // with subpixel precision.
                        if ((0, $ba8ad8073c33464d$export$8317bebcfd6ca26c)(matrices[0])) {
                            $93e17dd02dc97955$var$MEASURE_ELEMENT.style.setProperty('transform', matrices[1].toString(), 'important');
                            offsetContainer.append($93e17dd02dc97955$var$MEASURE_ELEMENT);
                            (0, $b573589083190077$export$ee9ce4f6079fba39)($93e17dd02dc97955$var$MEASURE_ELEMENT, offset);
                            $93e17dd02dc97955$var$MEASURE_ELEMENT.remove();
                        } else {
                            (0, $b573589083190077$export$ee9ce4f6079fba39)(offsetContainer, offset);
                            offset.x -= matrices[0].m41;
                            offset.y -= matrices[0].m42;
                        }
                    } else (0, $b573589083190077$export$ee9ce4f6079fba39)(offsetContainer, offset);
                }
                // Cache the client offset.
                _clientOffsetCache.set(offsetContainer, offset);
                return offset;
            });
            (0, $ac3b89bdbc283306$export$5e94c6e790b2d913)(dragOffset, elementOffset, containerOffset);
        } else {
            containerOffset.x = 0;
            containerOffset.y = 0;
        }
    }
    getContainerMatrix() {
        return this._matrixCache.get(this.elementContainer);
    }
    getDragContainerMatrix() {
        return this._matrixCache.get(this.dragContainer);
    }
    updateSize(dimensions) {
        if (dimensions) {
            this.clientRect.width = dimensions.width;
            this.clientRect.height = dimensions.height;
        } else {
            const { width: width, height: height } = this.element.getBoundingClientRect();
            this.clientRect.width = width;
            this.clientRect.height = height;
        }
    }
}



// A special append method which doesn't lose focus when appending an element.
function $3ba9e1e7a6850ba1$export$33e13bbfe889ab45(element, container, innerContainer) {
    const focusedElement = document.activeElement;
    const containsFocus = element.contains(focusedElement);
    if (innerContainer) innerContainer.append(element);
    container.append(innerContainer || element);
    if (containsFocus && document.activeElement !== focusedElement) focusedElement.focus({
        preventScroll: true
    });
}


function $b71b05db74a54e91$export$a3992db8dd0fd9e6(value, decimals = 0) {
    const multiplier = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}



function $afa85d7904abb0f0$export$da3f9f1be978dbbc(m1, m2) {
    if (m1.isIdentity && m2.isIdentity) return true;
    if (m1.is2D && m2.is2D) return m1.a === m2.a && m1.b === m2.b && m1.c === m2.c && m1.d === m2.d && m1.e === m2.e && m1.f === m2.f;
    return m1.m11 === m2.m11 && m1.m12 === m2.m12 && m1.m13 === m2.m13 && m1.m14 === m2.m14 && m1.m21 === m2.m21 && m1.m22 === m2.m22 && m1.m23 === m2.m23 && m1.m24 === m2.m24 && m1.m31 === m2.m31 && m1.m32 === m2.m32 && m1.m33 === m2.m33 && m1.m34 === m2.m34 && m1.m41 === m2.m41 && m1.m42 === m2.m42 && m1.m43 === m2.m43 && m1.m44 === m2.m44;
}




const $0d0c72b4b6dc9dbb$var$SCROLL_LISTENER_OPTIONS = {
    capture: true,
    passive: true
};
const $0d0c72b4b6dc9dbb$var$POSITION_CHANGE = {
    x: 0,
    y: 0
};
const $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX = (0, $b85aa28c289cb8ee$export$e44ffb50cc242ec5) ? new DOMMatrix() : null;
const $0d0c72b4b6dc9dbb$var$TEMP_MATRIX = (0, $b85aa28c289cb8ee$export$e44ffb50cc242ec5) ? new DOMMatrix() : null;
var $0d0c72b4b6dc9dbb$var$DragStartPhase = /*#__PURE__*/ function(DragStartPhase) {
    DragStartPhase[DragStartPhase["None"] = 0] = "None";
    DragStartPhase[DragStartPhase["Init"] = 1] = "Init";
    DragStartPhase[DragStartPhase["Prepare"] = 2] = "Prepare";
    DragStartPhase[DragStartPhase["FinishPrepare"] = 3] = "FinishPrepare";
    DragStartPhase[DragStartPhase["Apply"] = 4] = "Apply";
    DragStartPhase[DragStartPhase["FinishApply"] = 5] = "FinishApply";
    return DragStartPhase;
}($0d0c72b4b6dc9dbb$var$DragStartPhase || {});
var $0d0c72b4b6dc9dbb$var$DraggableStartPredicateState = /*#__PURE__*/ function(DraggableStartPredicateState) {
    DraggableStartPredicateState[DraggableStartPredicateState["Pending"] = 0] = "Pending";
    DraggableStartPredicateState[DraggableStartPredicateState["Resolved"] = 1] = "Resolved";
    DraggableStartPredicateState[DraggableStartPredicateState["Rejected"] = 2] = "Rejected";
    return DraggableStartPredicateState;
}($0d0c72b4b6dc9dbb$var$DraggableStartPredicateState || {});
const $0d0c72b4b6dc9dbb$export$44f02bfd7d637941 = {
    Start: 'start',
    Move: 'move',
    End: 'end'
};
const $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61 = {
    Start: 'start',
    StartAlign: 'start-align',
    Move: 'move',
    Align: 'align',
    End: 'end',
    EndAlign: 'end-align'
};
const $0d0c72b4b6dc9dbb$export$a85ab346e352a830 = {
    PrepareStart: 'preparestart',
    Start: 'start',
    PrepareMove: 'preparemove',
    Move: 'move',
    End: 'end',
    Destroy: 'destroy'
};
const $0d0c72b4b6dc9dbb$export$7ce0cd3869d5dcd9 = {
    container: null,
    startPredicate: ()=>true,
    elements: ()=>null,
    frozenStyles: ()=>null,
    applyPosition: ({ item: item, phase: phase })=>{
        const isEndPhase = phase === $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.End || phase === $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.EndAlign;
        const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();
        const [_dragContainerMatrix, inverseDragContainerMatrix] = item.getDragContainerMatrix();
        const { position: position, alignmentOffset: alignmentOffset, containerOffset: containerOffset, elementTransformMatrix: elementTransformMatrix, elementTransformOrigin: elementTransformOrigin, elementOffsetMatrix: elementOffsetMatrix } = item;
        const { x: oX, y: oY, z: oZ } = elementTransformOrigin;
        const needsOriginOffset = !elementTransformMatrix.isIdentity && (oX !== 0 || oY !== 0 || oZ !== 0);
        const tX = position.x + alignmentOffset.x + containerOffset.x;
        const tY = position.y + alignmentOffset.y + containerOffset.y;
        // Reset the matrix to identity.
        (0, $c87c13e795b928df$export$5e2c7a53f84076f2)($0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX);
        // First of all negate the element's transform origin.
        if (needsOriginOffset) {
            if (oZ === 0) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.translateSelf(-oX, -oY);
            else $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.translateSelf(-oX, -oY, -oZ);
        }
        // Invert the current container's matrix, so we can apply the
        // translation in world space coordinates. If this is the end phase the
        // element will have been appended back to the original container if
        // there was a drag container defined. Otherwise the element will be
        // appended to the drag container (if defined).
        if (isEndPhase) {
            if (!inverseContainerMatrix.isIdentity) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf(inverseContainerMatrix);
        } else if (!inverseDragContainerMatrix.isIdentity) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf(inverseDragContainerMatrix);
        // Apply the translation (in world space coordinates).
        (0, $c87c13e795b928df$export$5e2c7a53f84076f2)($0d0c72b4b6dc9dbb$var$TEMP_MATRIX).translateSelf(tX, tY);
        $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf($0d0c72b4b6dc9dbb$var$TEMP_MATRIX);
        // Apply the element's original container's world matrix so we can apply
        // the element's original transform as if it was in the original
        // container's local space coordinates.
        if (!containerMatrix.isIdentity) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf(containerMatrix);
        // Undo the transform origin negation.
        if (needsOriginOffset) {
            (0, $c87c13e795b928df$export$5e2c7a53f84076f2)($0d0c72b4b6dc9dbb$var$TEMP_MATRIX).translateSelf(oX, oY, oZ);
            $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf($0d0c72b4b6dc9dbb$var$TEMP_MATRIX);
        }
        // Apply the element's original transform.
        if (!elementTransformMatrix.isIdentity) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.multiplySelf(elementTransformMatrix);
        // Apply the element's offset matrix. The offset matrix is in practice the
        // inverse transform matrix of the element's individual transforms
        // (translate, rotate and scale). These individual transforms are applied
        // before the element's transform matrix, so we need to premultiply the
        // final matrix with the offset matrix.
        if (!elementOffsetMatrix.isIdentity) $0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX.preMultiplySelf(elementOffsetMatrix);
        // Apply the matrix to the element.
        item.element.style.transform = `${$0d0c72b4b6dc9dbb$var$ELEMENT_MATRIX}`;
    },
    computeClientRect: ({ drag: drag })=>{
        return drag.items[0].clientRect || null;
    },
    positionModifiers: [],
    group: null
};
class $0d0c72b4b6dc9dbb$export$f2a139e5d18b9882 {
    constructor(sensors, options = {}){
        this.id = Symbol();
        this.sensors = sensors;
        this.settings = this._parseSettings(options);
        this.plugins = {};
        this.drag = null;
        this.isDestroyed = false;
        this._sensorData = new Map();
        this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)();
        this._startPhase = 0;
        this._startId = Symbol();
        this._moveId = Symbol();
        this._alignId = Symbol();
        // Bind methods (that need binding).
        this._onMove = this._onMove.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onEnd = this._onEnd.bind(this);
        this._prepareStart = this._prepareStart.bind(this);
        this._applyStart = this._applyStart.bind(this);
        this._prepareMove = this._prepareMove.bind(this);
        this._applyMove = this._applyMove.bind(this);
        this._prepareAlign = this._prepareAlign.bind(this);
        this._applyAlign = this._applyAlign.bind(this);
        // Bind drag sensor events.
        this.sensors.forEach((sensor)=>{
            this._sensorData.set(sensor, {
                predicateState: 0,
                predicateEvent: null,
                onMove: (e)=>this._onMove(e, sensor),
                onEnd: (e)=>this._onEnd(e, sensor)
            });
            const { onMove: onMove, onEnd: onEnd } = this._sensorData.get(sensor);
            sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start, onMove, onMove);
            sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move, onMove, onMove);
            sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel, onEnd, onEnd);
            sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End, onEnd, onEnd);
            sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy, onEnd, onEnd);
        });
    }
    _parseSettings(options, defaults = $0d0c72b4b6dc9dbb$export$7ce0cd3869d5dcd9) {
        const { container: container = defaults.container, startPredicate: startPredicate = defaults.startPredicate, elements: elements = defaults.elements, frozenStyles: frozenStyles = defaults.frozenStyles, positionModifiers: positionModifiers = defaults.positionModifiers, applyPosition: applyPosition = defaults.applyPosition, computeClientRect: computeClientRect = defaults.computeClientRect, group: group = defaults.group, onPrepareStart: onPrepareStart = defaults.onPrepareStart, onStart: onStart = defaults.onStart, onPrepareMove: onPrepareMove = defaults.onPrepareMove, onMove: onMove = defaults.onMove, onEnd: onEnd = defaults.onEnd, onDestroy: onDestroy = defaults.onDestroy } = options || {};
        return {
            container: container,
            startPredicate: startPredicate,
            elements: elements,
            frozenStyles: frozenStyles,
            positionModifiers: positionModifiers,
            applyPosition: applyPosition,
            computeClientRect: computeClientRect,
            group: group,
            onPrepareStart: onPrepareStart,
            onStart: onStart,
            onPrepareMove: onPrepareMove,
            onMove: onMove,
            onEnd: onEnd,
            onDestroy: onDestroy
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
                    this.drag.moveEvent = e;
                    (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._prepareMove, this._moveId);
                    (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._applyMove, this._moveId);
                }
                break;
        }
    }
    _onScroll() {
        this.align();
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
        // Update start phase.
        this._startPhase = 2;
        // Get elements that we'll need to move with the drag.
        // NB: It is okay if there are no elements and thus no items. The drag
        // process will process as usual, but no elements will be moved.
        const elements = this.settings.elements({
            draggable: this,
            drag: drag
        }) || [];
        // Create drag items.
        drag.items = elements.map((element)=>{
            return new (0, $93e17dd02dc97955$export$b87fb2dc7f11ca52)(element, this);
        });
        // Apply modifiers for the start phase.
        this._applyModifiers($0d0c72b4b6dc9dbb$export$44f02bfd7d637941.Start, 0, 0);
        // Emit preparestart event.
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.PrepareStart, drag.startEvent);
        // Call onPrepareStart callback.
        this.settings.onPrepareStart?.(drag, this);
        // Update start phase.
        this._startPhase = 3;
    }
    _applyStart() {
        const drag = this.drag;
        if (!drag) return;
        // Update start phase.
        this._startPhase = 4;
        for (const item of drag.items){
            // Append element within the container element if such is provided.
            if (item.dragContainer !== item.elementContainer) (0, $3ba9e1e7a6850ba1$export$33e13bbfe889ab45)(item.element, item.dragContainer);
            // Freeze element's props if such are provided.
            if (item.frozenStyles) Object.assign(item.element.style, item.frozenStyles);
            // Set element's start position.
            this.settings.applyPosition({
                phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.Start,
                draggable: this,
                drag: drag,
                item: item
            });
        }
        // Compute the start offset (if needed).
        for (const item of drag.items){
            const containerMatrix = item.getContainerMatrix()[0];
            const dragContainerMatrix = item.getDragContainerMatrix()[0];
            // If both container matrices are equal, we can skip the computation.
            if ((0, $afa85d7904abb0f0$export$da3f9f1be978dbbc)(containerMatrix, dragContainerMatrix)) continue;
            // We can also skip computation if both matrices contain only 2D
            // translations.
            if (!(0, $ba8ad8073c33464d$export$8317bebcfd6ca26c)(containerMatrix) && !(0, $ba8ad8073c33464d$export$8317bebcfd6ca26c)(dragContainerMatrix)) continue;
            const rect = item.element.getBoundingClientRect();
            const { alignmentOffset: alignmentOffset } = item;
            // Round the align diff to nearest 3rd decimal to avoid applying it if the
            // value is so small that it's not visible.
            alignmentOffset.x += (0, $b71b05db74a54e91$export$a3992db8dd0fd9e6)(item.clientRect.x - rect.x, 3);
            alignmentOffset.y += (0, $b71b05db74a54e91$export$a3992db8dd0fd9e6)(item.clientRect.y - rect.y, 3);
        }
        // Apply start offset (if needed).
        for (const item of drag.items){
            const { alignmentOffset: alignmentOffset } = item;
            if (alignmentOffset.x !== 0 || alignmentOffset.y !== 0) this.settings.applyPosition({
                phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.StartAlign,
                draggable: this,
                drag: drag,
                item: item
            });
        }
        // Bind scroll listeners.
        window.addEventListener('scroll', this._onScroll, $0d0c72b4b6dc9dbb$var$SCROLL_LISTENER_OPTIONS);
        // Emit start event.
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.Start, drag.startEvent);
        // Call onStart callback.
        this.settings.onStart?.(drag, this);
        // Update start phase.
        this._startPhase = 5;
    }
    _prepareMove() {
        const drag = this.drag;
        if (!drag) return;
        // Get next event and previous event so we can compute the movement
        // difference between the clientX/Y values.
        const { moveEvent: moveEvent, prevMoveEvent: prevMoveEvent } = drag;
        if (moveEvent === prevMoveEvent) return;
        // Apply modifiers for the move phase.
        this._applyModifiers($0d0c72b4b6dc9dbb$export$44f02bfd7d637941.Move, moveEvent.x - prevMoveEvent.x, moveEvent.y - prevMoveEvent.y);
        // Emit preparemove event.
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.PrepareMove, moveEvent);
        // Make sure that the drag is still active.
        if (drag.isEnded) return;
        // Call onPrepareMove callback.
        this.settings.onPrepareMove?.(drag, this);
        // Make sure that the drag is still active.
        if (drag.isEnded) return;
        // Store next move event as previous move event.
        drag.prevMoveEvent = moveEvent;
    }
    _applyMove() {
        const drag = this.drag;
        if (!drag) return;
        // Reset movement diff and move the element.
        for (const item of drag.items){
            item['_moveDiff'].x = 0;
            item['_moveDiff'].y = 0;
            this.settings.applyPosition({
                phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.Move,
                draggable: this,
                drag: drag,
                item: item
            });
        }
        // Emit move event.
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.Move, drag.moveEvent);
        // Make sure that the drag is still active.
        if (drag.isEnded) return;
        // Call onMove callback.
        this.settings.onMove?.(drag, this);
    }
    _prepareAlign() {
        const { drag: drag } = this;
        if (!drag) return;
        for (const item of drag.items){
            const { x: x, y: y } = item.element.getBoundingClientRect();
            // Note that we INTENTIONALLY DO NOT UPDATE THE CLIENT RECT COORDINATES
            // here. The point of this method is to update the POSITION of the
            // draggable item based on how much the client rect has drifted so that
            // the element is visually repositioned to the correct place.
            // Update horizontal position data.
            const alignDiffX = item.clientRect.x - item['_moveDiff'].x - x;
            item.alignmentOffset.x = item.alignmentOffset.x - item['_alignDiff'].x + alignDiffX;
            item['_alignDiff'].x = alignDiffX;
            // Update vertical position data.
            const alignDiffY = item.clientRect.y - item['_moveDiff'].y - y;
            item.alignmentOffset.y = item.alignmentOffset.y - item['_alignDiff'].y + alignDiffY;
            item['_alignDiff'].y = alignDiffY;
        }
    }
    _applyAlign() {
        const { drag: drag } = this;
        if (!drag) return;
        for (const item of drag.items){
            item['_alignDiff'].x = 0;
            item['_alignDiff'].y = 0;
            this.settings.applyPosition({
                phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.Align,
                draggable: this,
                drag: drag,
                item: item
            });
        }
    }
    _applyModifiers(phase, changeX, changeY) {
        const { drag: drag } = this;
        if (!drag) return;
        const { positionModifiers: positionModifiers } = this.settings;
        for (const item of drag.items){
            let positionChange = $0d0c72b4b6dc9dbb$var$POSITION_CHANGE;
            positionChange.x = changeX;
            positionChange.y = changeY;
            for (const modifier of positionModifiers)positionChange = modifier(positionChange, {
                draggable: this,
                drag: drag,
                item: item,
                phase: phase
            });
            item.position.x += positionChange.x;
            item.position.y += positionChange.y;
            item.clientRect.x += positionChange.x;
            item.clientRect.y += positionChange.y;
            if (phase === 'move') {
                item['_moveDiff'].x += positionChange.x;
                item['_moveDiff'].y += positionChange.y;
            }
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
            //  Update start phase.
            this._startPhase = 1;
            // Resolve the provided sensor's start predicate.
            sensorData.predicateState = 1;
            sensorData.predicateEvent = null;
            this.drag = new (0, $ce7a95b3ae8104e2$export$12e4b40eac1bcb71)(sensor, startEvent);
            // Reject other sensors' start predicates.
            this._sensorData.forEach((data, s)=>{
                if (s === sensor) return;
                data.predicateState = 2;
                data.predicateEvent = null;
            });
            // Queue drag start.
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._prepareStart, this._startId);
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._applyStart, this._startId);
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
        // Get current start phase.
        const startPhase = this._startPhase;
        // Throw an error if drag is being stopped in the middle of the start
        // prepare or apply process. This is not allowed.
        if (startPhase === 2 || startPhase === 4) throw new Error('Cannot stop drag start process at this point');
        // Reset drag start phase.
        this._startPhase = 0;
        // Mark drag process as ended.
        drag.isEnded = true;
        // Cancel all queued ticks.
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._startId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._startId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._moveId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._moveId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._alignId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._alignId);
        // Unbind scroll listener.
        window.removeEventListener('scroll', this._onScroll, $0d0c72b4b6dc9dbb$var$SCROLL_LISTENER_OPTIONS);
        // Apply modifiers for the end phase, if needed.
        if (startPhase > 1) this._applyModifiers($0d0c72b4b6dc9dbb$export$44f02bfd7d637941.End, 0, 0);
        // If the drag start process was successfully finished before stopping it,
        // we need to do quite a bit of cleanup and finalization.
        if (startPhase === 5) {
            for (const item of drag.items){
                // Move elements within the root container if they were moved to a
                // different container during the drag process. Also reset alignment
                // and container offsets for those elements.
                if (item.elementContainer !== item.dragContainer) {
                    (0, $3ba9e1e7a6850ba1$export$33e13bbfe889ab45)(item.element, item.elementContainer);
                    item.alignmentOffset.x = 0;
                    item.alignmentOffset.y = 0;
                    item.containerOffset.x = 0;
                    item.containerOffset.y = 0;
                }
                // Unfreeze element's props if such are provided.
                if (item.unfrozenStyles) for(const key in item.unfrozenStyles)item.element.style[key] = item.unfrozenStyles[key] || '';
                // Set (maybe) final position after drag.
                this.settings.applyPosition({
                    phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.End,
                    draggable: this,
                    drag: drag,
                    item: item
                });
            }
            // Make sure that all elements that were reparented during the drag process
            // are actually aligned with the item's cached client rect data. NB: This
            // procedure causes a reflow, but it's necessary to ensure that the elements
            // are visually aligned correctly. We do the DOM reading in a separate loop
            // to avoid layout thrashing more than necessary.
            for (const item of drag.items)if (item.elementContainer !== item.dragContainer) {
                const itemRect = item.element.getBoundingClientRect();
                // Round the align diff to nearest 3rd decimal to avoid applying it if
                // the value is so small that it's not visible.
                item.alignmentOffset.x = (0, $b71b05db74a54e91$export$a3992db8dd0fd9e6)(item.clientRect.x - itemRect.x, 3);
                item.alignmentOffset.y = (0, $b71b05db74a54e91$export$a3992db8dd0fd9e6)(item.clientRect.y - itemRect.y, 3);
            }
            // Apply final alignment to all the elements that need it.
            for (const item of drag.items)if (item.elementContainer !== item.dragContainer && (item.alignmentOffset.x !== 0 || item.alignmentOffset.y !== 0)) this.settings.applyPosition({
                phase: $0d0c72b4b6dc9dbb$export$41e4de7bbd8ceb61.EndAlign,
                draggable: this,
                drag: drag,
                item: item
            });
        } else if (startPhase === 3) for (const item of drag.items){
            // Make sure the client rect and position data reflects the reality. As
            // the item was never moved, we can just reset the position data.
            item.clientRect.x -= item.position.x;
            item.clientRect.y -= item.position.y;
            item.position.x = 0;
            item.position.y = 0;
            // Reset alignment and container offsets.
            if (item.elementContainer !== item.dragContainer) {
                item.alignmentOffset.x = 0;
                item.alignmentOffset.y = 0;
                item.containerOffset.x = 0;
                item.containerOffset.y = 0;
            }
        }
        // Emit end event.
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.End, drag.endEvent);
        // Call onEnd callback.
        this.settings.onEnd?.(drag, this);
        // Reset drag data.
        this.drag = null;
    }
    align(instant = false) {
        if (!this.drag) return;
        if (instant) {
            this._prepareAlign();
            this._applyAlign();
        } else {
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._prepareAlign, this._alignId);
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._applyAlign, this._alignId);
        }
    }
    getClientRect() {
        const { drag: drag, settings: settings } = this;
        if (!drag) return null;
        return settings.computeClientRect?.({
            draggable: this,
            drag: drag
        }) || null;
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
            sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start, onMove);
            sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Move, onMove);
            sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel, onEnd);
            sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End, onEnd);
            sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Destroy, onEnd);
        });
        this._sensorData.clear();
        this._emit($0d0c72b4b6dc9dbb$export$a85ab346e352a830.Destroy);
        this.settings.onDestroy?.(this);
        this._emitter.off();
    }
}






const $26b99708933973c1$var$SCROLLABLE_OVERFLOWS = new Set([
    'auto',
    'scroll',
    'overlay'
]);
function $26b99708933973c1$export$2bb74740c4e19def(element) {
    const style = (0, $b75b79b0209a801e$export$3d2f074408bd1b82)(element);
    return !!($26b99708933973c1$var$SCROLLABLE_OVERFLOWS.has(style.overflowY) || $26b99708933973c1$var$SCROLLABLE_OVERFLOWS.has(style.overflowX));
}


/**
 * Check if the current value is a document.
 */ function $789757134a6ba490$export$62858bae88b53fd0(value) {
    return value instanceof Document;
}


function $73a32fa1436292cd$export$e4864aa91b5ed091(element, result = []) {
    let parent = element?.parentNode;
    // Reset the result array.
    result.length = 0;
    while(parent && !(0, $789757134a6ba490$export$62858bae88b53fd0)(parent)){
        if (parent instanceof Element) {
            if ((0, $26b99708933973c1$export$2bb74740c4e19def)(parent)) result.push(parent);
            parent = parent.parentNode;
        } else if (parent instanceof ShadowRoot) parent = parent.host;
        else parent = parent.parentNode;
    }
    // Always push window to the results (as last scrollable element).
    result.push(window);
    return result;
}



function $0dfdc060a41a8f62$var$getScrollables(element) {
    const scrollables = [];
    if ((0, $26b99708933973c1$export$2bb74740c4e19def)(element)) scrollables.push(element);
    (0, $73a32fa1436292cd$export$e4864aa91b5ed091)(element, scrollables);
    return scrollables;
}
function $0dfdc060a41a8f62$export$42a28ce04aa194cc(options = {}) {
    let dragAllowed = undefined;
    let startTimeStamp = 0;
    let targetElement = null;
    let timer = undefined;
    const { touchDelay: touchDelay = 250, fallback: fallback = ()=>true } = options;
    const onContextMenu = (e)=>e.preventDefault();
    const onTouchMove = (e)=>{
        if (!startTimeStamp) return;
        if (dragAllowed) {
            e.cancelable && e.preventDefault();
            return;
        }
        if (dragAllowed === undefined) {
            if (e.cancelable && e.timeStamp - startTimeStamp > touchDelay) {
                dragAllowed = true;
                e.preventDefault();
            } else dragAllowed = false;
        }
    };
    const pointerSensorStartPredicate = (data)=>{
        if (!(data.sensor instanceof (0, $e72ff61c97f755fe$export$b26af955418d6638))) return fallback(data);
        const { draggable: draggable, sensor: sensor, event: event } = data;
        const e = event;
        if (e.pointerType === 'touch') {
            // On first event (touchstart/pointerdown) we need to store the drag start
            // data and bind listeners for touchmove and contextmenu.
            if (e.type === (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start && (e.srcEvent.type === 'pointerdown' || e.srcEvent.type === 'touchstart')) {
                // Prevent potentially scrollable nodes from scrolling to make sure
                // native scrolling does not interfere with dragging.
                targetElement = e.target;
                const scrollables = targetElement ? $0dfdc060a41a8f62$var$getScrollables(targetElement) : [];
                scrollables.forEach((scrollable)=>{
                    scrollable.addEventListener('touchmove', onTouchMove, {
                        passive: false,
                        capture: true
                    });
                });
                const dragEndListener = ()=>{
                    if (!startTimeStamp) return;
                    // Unbind listeners.
                    draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, dragEndListener);
                    draggable.sensors.forEach((sensor)=>{
                        if (sensor instanceof (0, $e72ff61c97f755fe$export$b26af955418d6638)) sensor.off((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End, dragEndListener);
                    });
                    targetElement?.removeEventListener('contextmenu', onContextMenu);
                    scrollables.forEach((scrollable)=>{
                        scrollable.removeEventListener('touchmove', onTouchMove, {
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
                targetElement?.addEventListener('contextmenu', onContextMenu);
                // Reset data on drag end. We want to listen to all sensors as we don't
                // know yet which one will start the drag.
                draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, dragEndListener);
                draggable.sensors.forEach((sensor)=>{
                    if (sensor instanceof (0, $e72ff61c97f755fe$export$b26af955418d6638)) sensor.on((0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End, dragEndListener);
                });
                // If we have touchDelay defined, let's set a timer that force starts
                // the drag process after the timeout.
                // TODO: This will start drag sometimes when it's not actually possible
                // to prevent the native scrolling on touch devices. We'd need a way
                // to check if the first touchstart/touchmove is cancelable. Needs
                // testing on real devices. The funky thing is that we seem to need to
                // get one touchmove event to check if we can prevent native scrolling
                // but that is kind of too late already.. let's see if we can detect
                // that earlier somehow.
                if (touchDelay > 0) timer = window.setTimeout(()=>{
                    draggable.resolveStartPredicate(sensor);
                    dragAllowed = true;
                    timer = undefined;
                }, touchDelay);
            }
            return dragAllowed;
        }
        // On mouse/pen let's allow starting drag immediately if mouse's left button
        // is pressed down.
        if (e.type === (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Start && !e.srcEvent.button) return true;
        else return false;
    };
    return pointerSensorStartPredicate;
}


function $0b5391881dc2b3a6$var$round(value, multipleOf) {
    return Math.round(value / multipleOf) * multipleOf;
}
function $0b5391881dc2b3a6$var$getAxisChange(cellSize, snapPosition, sensorPosition) {
    const change = sensorPosition - snapPosition;
    const changeAbs = Math.abs(change);
    if (changeAbs >= cellSize) {
        const overflow = changeAbs % cellSize;
        return $0b5391881dc2b3a6$var$round(change > 0 ? change - overflow : change + overflow, cellSize);
    }
    return 0;
}
function $0b5391881dc2b3a6$export$7f11ea1f0ba255b5(cellWidth, cellHeight) {
    return function snapModifier(change, { item: item }) {
        const snapState = item.data.__snap__ || (item.data.__snap__ = {
            snapX: 0,
            snapY: 0,
            sensorX: 0,
            sensorY: 0
        });
        // Add the change to the sensor position.
        snapState.sensorX += change.x;
        snapState.sensorY += change.y;
        // Compute the change on the x and y axis.
        const changeX = $0b5391881dc2b3a6$var$getAxisChange(cellWidth, snapState.snapX, snapState.sensorX);
        const changeY = $0b5391881dc2b3a6$var$getAxisChange(cellHeight, snapState.snapY, snapState.sensorY);
        // Add the change to the snap position.
        snapState.snapX += changeX;
        snapState.snapY += changeY;
        // Update the change.
        change.x = changeX;
        change.y = changeY;
        return change;
    };
}



function $5a69d436ccaf0646$export$3a8bd5429d724075(sourceRect, result = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
}) {
    if (sourceRect) {
        result.width = sourceRect.width;
        result.height = sourceRect.height;
        result.x = sourceRect.x;
        result.y = sourceRect.y;
        result.left = sourceRect.x;
        result.top = sourceRect.y;
        result.right = sourceRect.x + sourceRect.width;
        result.bottom = sourceRect.y + sourceRect.height;
    }
    return result;
}


const $e4a9d189cff00937$var$TEMP_RECT_1 = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)();
const $e4a9d189cff00937$var$TEMP_RECT_2 = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)();
const $e4a9d189cff00937$var$ADJUSTMENT_DATA = {
    change: 0,
    drift: 0
};
function $e4a9d189cff00937$var$adjustAxisChange(itemStartX, itemEndX, containerStartX, containerEndX, drift, change, trackDrift) {
    let nextChange = change;
    let nextDrift = drift;
    if (change > 0) {
        nextChange = Math.min(Math.max(containerEndX - itemEndX, 0), change);
        if (trackDrift) {
            if (drift < 0) {
                const driftChange = Math.min(-drift, change);
                nextDrift = drift + driftChange;
                nextChange = Math.max(0, nextChange - driftChange);
            } else nextDrift = drift + (change - nextChange);
        }
    } else if (change < 0) {
        nextChange = Math.max(Math.min(containerStartX - itemStartX, 0), change);
        if (trackDrift) {
            if (drift > 0) {
                const driftChange = Math.max(-drift, change);
                nextDrift = drift + driftChange;
                nextChange = Math.min(0, nextChange - driftChange);
            } else nextDrift = drift + (change - nextChange);
        }
    }
    $e4a9d189cff00937$var$ADJUSTMENT_DATA.change = nextChange;
    $e4a9d189cff00937$var$ADJUSTMENT_DATA.drift = nextDrift;
}
function $e4a9d189cff00937$export$b43dd221600cdb2e(getContainerRect, trackSensorDrift = ({ drag: drag })=>{
    return drag.sensor instanceof (0, $e72ff61c97f755fe$export$b26af955418d6638);
}) {
    return function containmentModifier(change, data) {
        const containerRect = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)(getContainerRect(data), $e4a9d189cff00937$var$TEMP_RECT_1);
        const itemRect = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)(data.item.clientRect, $e4a9d189cff00937$var$TEMP_RECT_2);
        const itemData = data.item.data;
        const containmentState = itemData.__containment__ || {
            drift: {
                x: 0,
                y: 0
            },
            trackDrift: false
        };
        // On first move, store the containment state. Item data will be kept alive
        // for the duration of the drag, but it will be removed once the drag ends.
        if (!itemData.__containment__) {
            containmentState.trackDrift = typeof trackSensorDrift === 'function' ? trackSensorDrift(data) : trackSensorDrift;
            itemData.__containment__ = containmentState;
        }
        const { drift: drift, trackDrift: trackDrift } = containmentState;
        if (change.x) {
            $e4a9d189cff00937$var$adjustAxisChange(itemRect.left, itemRect.right, containerRect.left, containerRect.right, drift.x, change.x, trackDrift);
            drift.x = $e4a9d189cff00937$var$ADJUSTMENT_DATA.drift;
            change.x = $e4a9d189cff00937$var$ADJUSTMENT_DATA.change;
        }
        if (change.y) {
            $e4a9d189cff00937$var$adjustAxisChange(itemRect.top, itemRect.bottom, containerRect.top, containerRect.bottom, drift.y, change.y, trackDrift);
            drift.y = $e4a9d189cff00937$var$ADJUSTMENT_DATA.drift;
            change.y = $e4a9d189cff00937$var$ADJUSTMENT_DATA.change;
        }
        return change;
    };
}



class $e5f3b5673dfe6018$export$10de443c437e240b {
    constructor(getItem, { batchSize: batchSize = 100, minBatchCount: minBatchCount = 0, maxBatchCount: maxBatchCount = Number.MAX_SAFE_INTEGER, initialBatchCount: initialBatchCount = 0, shrinkThreshold: shrinkThreshold = 2, onRelease: onRelease } = {}){
        this._batchSize = Math.floor(Math.max(batchSize, 1));
        this._minSize = Math.floor(Math.max(minBatchCount, 0)) * this._batchSize;
        this._maxSize = Math.floor(Math.min(Math.max(maxBatchCount * this._batchSize, this._batchSize), Number.MAX_SAFE_INTEGER));
        this._shrinkThreshold = Math.floor(Math.max(shrinkThreshold, 1) * this._batchSize);
        this._data = new Array(Math.floor(Math.max(Math.max(initialBatchCount, minBatchCount) * this._batchSize, 0)));
        this._index = 0;
        this._getItem = getItem;
        this._onRelease = onRelease;
    }
    get(...args) {
        // Return existing object from the pool, if available.
        if (this._index > 0) return this._getItem(this._data[--this._index], ...args);
        // Check if we need to grow the array because we're out of objects. Grow by
        // batchSize (capped at maxSize).
        if (this._index === 0) {
            const currentCapacity = this._data.length;
            const growBy = Math.min(this._batchSize, this._maxSize - currentCapacity);
            if (growBy > 0) this._data.length = currentCapacity + growBy;
        }
        // Create a new object when pool is empty.
        return this._getItem(undefined, ...args);
    }
    release(object) {
        // Only add to pool if below max size.
        if (this._index < this._maxSize) {
            if (this._onRelease) this._onRelease(object);
            // Store at current index, then increment.
            this._data[this._index++] = object;
            // Check if we should shrink after adding object.
            if (this._index >= this._shrinkThreshold) {
                // Only shrink if it wouldn't bring us below the minimum capacity
                const newCapacity = this._data.length - this._batchSize;
                if (newCapacity >= this._minSize) {
                    this._data.length = newCapacity;
                    this._index -= this._batchSize;
                }
            }
        }
    }
    destroy() {
        this._data.length = 0;
        this._index = 0;
    }
}





const $7209e3369c19bf94$var$RECT_A = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)();
const $7209e3369c19bf94$var$RECT_B = (0, $5a69d436ccaf0646$export$3a8bd5429d724075)();
function $7209e3369c19bf94$export$79376507b09a66f(a, b) {
    return (0, $126ac7744288dbf9$export$79376507b09a66f)((0, $5a69d436ccaf0646$export$3a8bd5429d724075)(a, $7209e3369c19bf94$var$RECT_A), (0, $5a69d436ccaf0646$export$3a8bd5429d724075)(b, $7209e3369c19bf94$var$RECT_B));
}


function $a33e267a6bda430c$export$990bfa80a352efc5(a, b, result = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
}) {
    const x1 = Math.max(a.x, b.x);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    if (x2 <= x1) return null;
    const y1 = Math.max(a.y, b.y);
    const y2 = Math.min(a.y + a.height, b.y + b.height);
    if (y2 <= y1) return null;
    result.x = x1;
    result.y = y1;
    result.width = x2 - x1;
    result.height = y2 - y1;
    return result;
}


const $ec0caa97c3c0620a$var$TEMP_RECT = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};
function $ec0caa97c3c0620a$export$25b3e1e24e1ba229(a, b, intersectionRect) {
    if (!intersectionRect) intersectionRect = (0, $a33e267a6bda430c$export$990bfa80a352efc5)(a, b, $ec0caa97c3c0620a$var$TEMP_RECT);
    if (!intersectionRect) return 0;
    const area = intersectionRect.width * intersectionRect.height;
    if (!area) return 0;
    const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
    return area / maxArea * 100;
}



function $ef561677d46962d4$export$4b834cebd9e5cebe(...args) {
    const { width: width, height: height, left: x, top: y } = (0, $51639583c18ebb93$export$4b834cebd9e5cebe)(...args);
    return {
        width: width,
        height: height,
        x: x,
        y: y
    };
}


/**
 * Check if the current value is a window.
 */ function $8c18767d3a0f64f7$export$5a096129d439f843(value) {
    return value instanceof Window;
}


function $2485ffd82c20bd99$export$31d37ff78a483ce2(element) {
    if ((0, $8c18767d3a0f64f7$export$5a096129d439f843)(element) || element === document.documentElement || element === document.body) return window;
    else return element;
}



function $02a67028ed95ab7e$export$1389d168952b34b5(element) {
    return (0, $8c18767d3a0f64f7$export$5a096129d439f843)(element) ? element.scrollX : element.scrollLeft;
}



function $cdf903cd8fa4370b$export$c16047c7a398106d(element) {
    if ((0, $8c18767d3a0f64f7$export$5a096129d439f843)(element)) element = document.documentElement;
    return element.scrollWidth - element.clientWidth;
}



function $6fe1ec35916e767b$export$c4a223a8ba9e4ea5(element) {
    return (0, $8c18767d3a0f64f7$export$5a096129d439f843)(element) ? element.scrollY : element.scrollTop;
}



function $7a2ca2d47a2a34d5$export$39d53b245a98193e(element) {
    if ((0, $8c18767d3a0f64f7$export$5a096129d439f843)(element)) element = document.documentElement;
    return element.scrollHeight - element.clientHeight;
}


function $e2a0efbe7e37d8be$export$8d3dd0be5eb9f11f(a, b) {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
}


//
// CONSTANTS
//
const $45f763d3a9362ecf$var$TEMP_RECT = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};
const $45f763d3a9362ecf$var$DEFAULT_THRESHOLD = 50;
const $45f763d3a9362ecf$var$SPEED_DATA = {
    direction: 'none',
    threshold: 0,
    distance: 0,
    value: 0,
    maxValue: 0,
    duration: 0,
    speed: 0,
    deltaTime: 0,
    isEnding: false
};
const $45f763d3a9362ecf$export$5bbd74ab6c855dff = {
    x: 1,
    y: 2
};
const $45f763d3a9362ecf$export$3eeb7a7b68c92567 = {
    forward: 4,
    reverse: 8
};
const $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_X = {
    none: 0,
    left: $45f763d3a9362ecf$export$5bbd74ab6c855dff.x | $45f763d3a9362ecf$export$3eeb7a7b68c92567.reverse,
    right: $45f763d3a9362ecf$export$5bbd74ab6c855dff.x | $45f763d3a9362ecf$export$3eeb7a7b68c92567.forward
};
const $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y = {
    none: 0,
    up: $45f763d3a9362ecf$export$5bbd74ab6c855dff.y | $45f763d3a9362ecf$export$3eeb7a7b68c92567.reverse,
    down: $45f763d3a9362ecf$export$5bbd74ab6c855dff.y | $45f763d3a9362ecf$export$3eeb7a7b68c92567.forward
};
const $45f763d3a9362ecf$export$c9fbd1f9176bc8ed = {
    ...$45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_X,
    ...$45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y
};
function $45f763d3a9362ecf$var$getDirectionAsString(direction) {
    switch(direction){
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_X.none:
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y.none:
            return 'none';
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_X.left:
            return 'left';
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_X.right:
            return 'right';
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y.up:
            return 'up';
        case $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y.down:
            return 'down';
        default:
            throw new Error(`Unknown direction value: ${direction}`);
    }
}
function $45f763d3a9362ecf$var$getPaddedRect(rect, padding, result) {
    let { left: left = 0, right: right = 0, top: top = 0, bottom: bottom = 0 } = padding;
    // Don't allow negative padding.
    left = Math.max(0, left);
    right = Math.max(0, right);
    top = Math.max(0, top);
    bottom = Math.max(0, bottom);
    result.width = rect.width + left + right;
    result.height = rect.height + top + bottom;
    result.x = rect.x - left;
    result.y = rect.y - top;
    return result;
}
function $45f763d3a9362ecf$var$isScrolledToMax(scrollValue, maxScrollValue) {
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
function $45f763d3a9362ecf$var$computeThreshold(idealThreshold, targetSize) {
    return Math.min(targetSize / 2, idealThreshold);
}
function $45f763d3a9362ecf$var$computeEdgeOffset(threshold, inertAreaSize, itemSize, targetSize) {
    return Math.max(0, itemSize + threshold * 2 + targetSize * inertAreaSize - targetSize) / 2;
}
class $45f763d3a9362ecf$var$AutoScrollItemData {
    constructor(){
        this.positionX = 0;
        this.positionY = 0;
        this.directionX = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        this.directionY = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        this.overlapCheckRequestTime = 0;
    }
}
class $45f763d3a9362ecf$var$AutoScrollAction {
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
        if ($45f763d3a9362ecf$export$5bbd74ab6c855dff.x & request.direction) {
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
        this.scrollLeft = this.requestX ? this.requestX.value : (0, $02a67028ed95ab7e$export$1389d168952b34b5)(this.element);
        this.scrollTop = this.requestY ? this.requestY.value : (0, $6fe1ec35916e767b$export$c4a223a8ba9e4ea5)(this.element);
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
class $45f763d3a9362ecf$var$AutoScrollRequest {
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
        return $45f763d3a9362ecf$export$3eeb7a7b68c92567.forward & this.direction ? $45f763d3a9362ecf$var$isScrolledToMax(this.value, this.maxValue) : this.value <= 0;
    }
    computeCurrentScrollValue() {
        if (!this.element) return 0;
        if (this.value !== this.value) return $45f763d3a9362ecf$export$5bbd74ab6c855dff.x & this.direction ? (0, $02a67028ed95ab7e$export$1389d168952b34b5)(this.element) : (0, $6fe1ec35916e767b$export$c4a223a8ba9e4ea5)(this.element);
        return Math.max(0, Math.min(this.value, this.maxValue));
    }
    computeNextScrollValue() {
        const delta = this.speed * (this.deltaTime / 1000);
        const nextValue = $45f763d3a9362ecf$export$3eeb7a7b68c92567.forward & this.direction ? this.value + delta : this.value - delta;
        return Math.max(0, Math.min(nextValue, this.maxValue));
    }
    computeSpeed() {
        if (!this.item || !this.element) return 0;
        const { speed: speed } = this.item;
        if (typeof speed === 'function') {
            $45f763d3a9362ecf$var$SPEED_DATA.direction = $45f763d3a9362ecf$var$getDirectionAsString(this.direction);
            $45f763d3a9362ecf$var$SPEED_DATA.threshold = this.threshold;
            $45f763d3a9362ecf$var$SPEED_DATA.distance = this.distance;
            $45f763d3a9362ecf$var$SPEED_DATA.value = this.value;
            $45f763d3a9362ecf$var$SPEED_DATA.maxValue = this.maxValue;
            $45f763d3a9362ecf$var$SPEED_DATA.duration = this.duration;
            $45f763d3a9362ecf$var$SPEED_DATA.speed = this.speed;
            $45f763d3a9362ecf$var$SPEED_DATA.deltaTime = this.deltaTime;
            $45f763d3a9362ecf$var$SPEED_DATA.isEnding = this.isEnding;
            return speed(this.element, $45f763d3a9362ecf$var$SPEED_DATA);
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
        if (typeof onStart === 'function') onStart(this.element, $45f763d3a9362ecf$var$getDirectionAsString(this.direction));
    }
    onStop() {
        if (!this.item || !this.element) return;
        const { onStop: onStop } = this.item;
        if (typeof onStop === 'function') onStop(this.element, $45f763d3a9362ecf$var$getDirectionAsString(this.direction));
    }
}
function $45f763d3a9362ecf$export$55a384729d91296b(// Pixels per second.
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
class $45f763d3a9362ecf$export$3fb39aee5567f02e {
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
            [$45f763d3a9362ecf$export$5bbd74ab6c855dff.x]: new Map(),
            [$45f763d3a9362ecf$export$5bbd74ab6c855dff.y]: new Map()
        };
        this._itemData = new Map();
        this._requestPool = new (0, $e5f3b5673dfe6018$export$10de443c437e240b)((request)=>request || new $45f763d3a9362ecf$var$AutoScrollRequest(), {
            initialBatchCount: 1,
            minBatchCount: 1,
            onRelease: (request)=>request.reset()
        });
        this._actionPool = new (0, $e5f3b5673dfe6018$export$10de443c437e240b)((action)=>action || new $45f763d3a9362ecf$var$AutoScrollAction(), {
            batchSize: 10,
            initialBatchCount: 1,
            minBatchCount: 1,
            onRelease: (action)=>action.reset()
        });
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
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).on((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._frameRead, this._frameRead);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).on((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._frameWrite, this._frameWrite);
    }
    _stopTicking() {
        if (!this._isTicking) return;
        this._isTicking = false;
        this._tickTime = 0;
        this._tickDeltaTime = 0;
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._frameRead);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).write, this._frameWrite);
    }
    _requestItemScroll(item, axis, element, direction, threshold, distance, maxValue) {
        const reqMap = this._requests[axis];
        let request = reqMap.get(item);
        if (request) {
            if (request.element !== element || request.direction !== direction) request.reset();
        } else {
            request = this._requestPool.get();
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
        this._requestPool.release(request);
        reqMap.delete(item);
    }
    _checkItemOverlap(item, checkX, checkY) {
        const { inertAreaSize: inertAreaSize, targets: targets, clientRect: clientRect } = item;
        if (!targets.length) {
            checkX && this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
            checkY && this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
            return;
        }
        const itemData = this._itemData.get(item);
        const moveDirectionX = itemData?.directionX;
        const moveDirectionY = itemData?.directionY;
        if (!moveDirectionX && !moveDirectionY) {
            checkX && this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
            checkY && this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
            return;
        }
        let xElement = null;
        let xPriority = -Infinity;
        let xThreshold = 0;
        let xScore = -Infinity;
        let xDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        let xDistance = 0;
        let xMaxScroll = 0;
        let yElement = null;
        let yPriority = -Infinity;
        let yThreshold = 0;
        let yScore = -Infinity;
        let yDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        let yDistance = 0;
        let yMaxScroll = 0;
        let i = 0;
        for(; i < targets.length; i++){
            const target = targets[i];
            const targetThreshold = typeof target.threshold === 'number' ? target.threshold : $45f763d3a9362ecf$var$DEFAULT_THRESHOLD;
            const testAxisX = !!(checkX && moveDirectionX && target.axis !== 'y');
            const testAxisY = !!(checkY && moveDirectionY && target.axis !== 'x');
            const testPriority = target.priority || 0;
            // Ignore this item if it's x-axis and y-axis priority is lower than
            // the currently matching item's.
            if ((!testAxisX || testPriority < xPriority) && (!testAxisY || testPriority < yPriority)) continue;
            const testElement = (0, $2485ffd82c20bd99$export$31d37ff78a483ce2)(target.element || target);
            const testMaxScrollX = testAxisX ? (0, $cdf903cd8fa4370b$export$c16047c7a398106d)(testElement) : -1;
            const testMaxScrollY = testAxisY ? (0, $7a2ca2d47a2a34d5$export$39d53b245a98193e)(testElement) : -1;
            // Ignore this item if there is no possibility to scroll.
            if (testMaxScrollX <= 0 && testMaxScrollY <= 0) continue;
            const testRect = (0, $ef561677d46962d4$export$4b834cebd9e5cebe)([
                testElement,
                'padding'
            ], window);
            let testScore = (0, $ec0caa97c3c0620a$export$25b3e1e24e1ba229)(clientRect, testRect) || -Infinity;
            // If the item has no overlap with the target.
            if (testScore === -Infinity) {
                // If the target has virtual extra padding defined and it's padded
                // version overlaps with item then let's compute the shortest distance
                // between item and target and use that value (negated) as testScore.
                if (target.padding && (0, $e2a0efbe7e37d8be$export$8d3dd0be5eb9f11f)(clientRect, $45f763d3a9362ecf$var$getPaddedRect(testRect, target.padding, $45f763d3a9362ecf$var$TEMP_RECT))) testScore = -((0, $7209e3369c19bf94$export$79376507b09a66f)(clientRect, testRect) || 0);
                else continue;
            }
            // Test x-axis.
            if (testAxisX && testPriority >= xPriority && testMaxScrollX > 0 && (testPriority > xPriority || testScore > xScore)) {
                let testDistance = 0;
                let testDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
                const testThreshold = $45f763d3a9362ecf$var$computeThreshold(targetThreshold, testRect.width);
                const testEdgeOffset = $45f763d3a9362ecf$var$computeEdgeOffset(testThreshold, inertAreaSize, clientRect.width, testRect.width);
                if (moveDirectionX === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.right) {
                    testDistance = testRect.x + testRect.width + testEdgeOffset - (clientRect.x + clientRect.width);
                    if (testDistance <= testThreshold && !$45f763d3a9362ecf$var$isScrolledToMax((0, $02a67028ed95ab7e$export$1389d168952b34b5)(testElement), testMaxScrollX)) testDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.right;
                } else if (moveDirectionX === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.left) {
                    testDistance = clientRect.x - (testRect.x - testEdgeOffset);
                    if (testDistance <= testThreshold && (0, $02a67028ed95ab7e$export$1389d168952b34b5)(testElement) > 0) testDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.left;
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
                let testDirection = $45f763d3a9362ecf$var$AUTO_SCROLL_DIRECTION_Y.none;
                const testThreshold = $45f763d3a9362ecf$var$computeThreshold(targetThreshold, testRect.height);
                const testEdgeOffset = $45f763d3a9362ecf$var$computeEdgeOffset(testThreshold, inertAreaSize, clientRect.height, testRect.height);
                if (moveDirectionY === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.down) {
                    testDistance = testRect.y + testRect.height + testEdgeOffset - (clientRect.y + clientRect.height);
                    if (testDistance <= testThreshold && !$45f763d3a9362ecf$var$isScrolledToMax((0, $6fe1ec35916e767b$export$c4a223a8ba9e4ea5)(testElement), testMaxScrollY)) testDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.down;
                } else if (moveDirectionY === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.up) {
                    testDistance = clientRect.y - (testRect.y - testEdgeOffset);
                    if (testDistance <= testThreshold && (0, $6fe1ec35916e767b$export$c4a223a8ba9e4ea5)(testElement) > 0) testDirection = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.up;
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
            if (xElement && xDirection) this._requestItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x, xElement, xDirection, xThreshold, xDistance, xMaxScroll);
            else this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
        }
        // Request or cancel y-axis scroll.
        if (checkY) {
            if (yElement && yDirection) this._requestItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y, yElement, yDirection, yThreshold, yDistance, yMaxScroll);
            else this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
        }
    }
    _updateScrollRequest(scrollRequest) {
        const item = scrollRequest.item;
        const { inertAreaSize: inertAreaSize, smoothStop: smoothStop, targets: targets, clientRect: clientRect } = item;
        let hasReachedEnd = null;
        let i = 0;
        for(; i < targets.length; i++){
            const target = targets[i];
            // Make sure we have a matching element.
            const testElement = (0, $2485ffd82c20bd99$export$31d37ff78a483ce2)(target.element || target);
            if (testElement !== scrollRequest.element) continue;
            // Make sure we have a matching axis.
            const testIsAxisX = !!($45f763d3a9362ecf$export$5bbd74ab6c855dff.x & scrollRequest.direction);
            if (testIsAxisX) {
                if (target.axis === 'y') continue;
            } else {
                if (target.axis === 'x') continue;
            }
            // Make sure the element is still scrollable.
            const testMaxScroll = testIsAxisX ? (0, $cdf903cd8fa4370b$export$c16047c7a398106d)(testElement) : (0, $7a2ca2d47a2a34d5$export$39d53b245a98193e)(testElement);
            if (testMaxScroll <= 0) break;
            const testRect = (0, $ef561677d46962d4$export$4b834cebd9e5cebe)([
                testElement,
                'padding'
            ], window);
            const testScore = (0, $ec0caa97c3c0620a$export$25b3e1e24e1ba229)(clientRect, testRect) || -Infinity;
            // If the item has no overlap with the target nor the padded target rect
            // let's stop scrolling.
            if (testScore === -Infinity) {
                const padding = target.scrollPadding || target.padding;
                if (!(padding && (0, $e2a0efbe7e37d8be$export$8d3dd0be5eb9f11f)(clientRect, $45f763d3a9362ecf$var$getPaddedRect(testRect, padding, $45f763d3a9362ecf$var$TEMP_RECT)))) break;
            }
            // Compute threshold.
            const targetThreshold = typeof target.threshold === 'number' ? target.threshold : $45f763d3a9362ecf$var$DEFAULT_THRESHOLD;
            const testThreshold = $45f763d3a9362ecf$var$computeThreshold(targetThreshold, testIsAxisX ? testRect.width : testRect.height);
            // Compute edge offset.
            const testEdgeOffset = $45f763d3a9362ecf$var$computeEdgeOffset(testThreshold, inertAreaSize, testIsAxisX ? clientRect.width : clientRect.height, testIsAxisX ? testRect.width : testRect.height);
            // Compute distance (based on current direction).
            let testDistance = 0;
            if (scrollRequest.direction === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.left) testDistance = clientRect.x - (testRect.x - testEdgeOffset);
            else if (scrollRequest.direction === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.right) testDistance = testRect.x + testRect.width + testEdgeOffset - (clientRect.x + clientRect.width);
            else if (scrollRequest.direction === $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.up) testDistance = clientRect.y - (testRect.y - testEdgeOffset);
            else testDistance = testRect.y + testRect.height + testEdgeOffset - (clientRect.y + clientRect.height);
            // Stop scrolling if threshold is not exceeded.
            if (testDistance > testThreshold) break;
            // Stop scrolling if we have reached max scroll value.
            const testScroll = testIsAxisX ? (0, $02a67028ed95ab7e$export$1389d168952b34b5)(testElement) : (0, $6fe1ec35916e767b$export$c4a223a8ba9e4ea5)(testElement);
            hasReachedEnd = $45f763d3a9362ecf$export$3eeb7a7b68c92567.forward & scrollRequest.direction ? $45f763d3a9362ecf$var$isScrolledToMax(testScroll, testMaxScroll) : testScroll <= 0;
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
            itemData.directionX = x > prevX ? $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.right : x < prevX ? $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.left : itemData.directionX;
            // Update direction y.
            itemData.directionY = y > prevY ? $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.down : y < prevY ? $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.up : itemData.directionY;
            // Update positions.
            itemData.positionX = x;
            itemData.positionY = y;
            // Request overlap check (if not already requested).
            if (itemData.overlapCheckRequestTime === 0) itemData.overlapCheckRequestTime = this._tickTime;
        }
    }
    _updateRequests() {
        const items = this.items;
        const requestsX = this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.x];
        const requestsY = this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.y];
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
                    this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
                }
            }
            let checkY = true;
            const reqY = requestsY.get(item);
            if (reqY && reqY.isActive) {
                checkY = !this._updateScrollRequest(reqY);
                if (checkY) {
                    needsCheck = true;
                    this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
                }
            }
            if (needsCheck) {
                itemData.overlapCheckRequestTime = 0;
                this._checkItemOverlap(item, checkX, checkY);
            }
        }
    }
    _requestAction(request, axis) {
        const isAxisX = axis === $45f763d3a9362ecf$export$5bbd74ab6c855dff.x;
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
        if (!action) action = this._actionPool.get();
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
            const reqX = this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.x].get(item);
            const reqY = this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.y].get(item);
            if (reqX) this._requestAction(reqX, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
            if (reqY) this._requestAction(reqY, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
        }
        // Compute scroll values.
        for(i = 0; i < this._actions.length; i++)this._actions[i].computeScrollValues();
    }
    _applyActions() {
        // No actions -> no scrolling.
        if (!this._actions.length) return;
        // Scroll all the required elements.
        let i = 0;
        for(i = 0; i < this._actions.length; i++){
            this._actions[i].scroll();
            this._actionPool.release(this._actions[i]);
        }
        // Reset actions.
        this._actions.length = 0;
    }
    addItem(item) {
        if (this._isDestroyed || this._itemData.has(item)) return;
        const { x: x, y: y } = item.position;
        const itemData = new $45f763d3a9362ecf$var$AutoScrollItemData();
        itemData.positionX = x;
        itemData.positionY = y;
        itemData.directionX = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        itemData.directionY = $45f763d3a9362ecf$export$c9fbd1f9176bc8ed.none;
        itemData.overlapCheckRequestTime = this._tickTime;
        this._itemData.set(item, itemData);
        this.items.push(item);
        if (!this._isTicking) this._startTicking();
    }
    removeItem(item) {
        if (this._isDestroyed) return;
        const index = this.items.indexOf(item);
        if (index === -1) return;
        if (this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.x].get(item)) {
            this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.x);
            this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.x].delete(item);
        }
        if (this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.y].get(item)) {
            this._cancelItemScroll(item, $45f763d3a9362ecf$export$5bbd74ab6c855dff.y);
            this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.y].delete(item);
        }
        this._itemData.delete(item);
        this.items.splice(index, 1);
        if (this._isTicking && !this.items.length) this._stopTicking();
    }
    isDestroyed() {
        return this._isDestroyed;
    }
    isItemScrollingX(item) {
        return !!this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.x].get(item)?.isActive;
    }
    isItemScrollingY(item) {
        return !!this._requests[$45f763d3a9362ecf$export$5bbd74ab6c855dff.y].get(item)?.isActive;
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
        this.items.forEach((item)=>this.removeItem(item));
        this._requestPool.destroy();
        this._actionPool.destroy();
        this._actions.length = 0;
        this._isDestroyed = true;
    }
}



const $92cd9a0cd3661853$export$d976747ecb966cea = new (0, $45f763d3a9362ecf$export$3fb39aee5567f02e)();


const $244877ffe9407e42$var$AUTOSCROLL_POSITION = {
    x: 0,
    y: 0
};
const $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};
function $244877ffe9407e42$var$getDefaultSettings() {
    return {
        targets: [],
        inertAreaSize: 0.2,
        speed: (0, $45f763d3a9362ecf$export$55a384729d91296b)(),
        smoothStop: false,
        getPosition: (draggable)=>{
            const { drag: drag } = draggable;
            const primaryItem = drag?.items[0];
            // Try to use the first item for the autoscroll data.
            if (primaryItem) return primaryItem.position;
            // Fallback to the sensor's clientX/clientY values.
            const e = drag && (drag.moveEvent || drag.startEvent);
            $244877ffe9407e42$var$AUTOSCROLL_POSITION.x = e ? e.x : 0;
            $244877ffe9407e42$var$AUTOSCROLL_POSITION.y = e ? e.y : 0;
            return $244877ffe9407e42$var$AUTOSCROLL_POSITION;
        },
        getClientRect: (draggable)=>{
            const { drag: drag } = draggable;
            // Try to use the default draggable client rect.
            const clientRect = draggable.getClientRect();
            if (clientRect) return clientRect;
            // Fallback to the sensor's clientX/clientY values and a static size of
            // 50x50px.
            const e = drag && (drag.moveEvent || drag.startEvent);
            $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
            $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
            $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT.x = e ? e.x - 25 : 0;
            $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT.y = e ? e.y - 25 : 0;
            return $244877ffe9407e42$var$AUTOSCROLL_CLIENT_RECT;
        },
        onStart: null,
        onStop: null
    };
}
class $244877ffe9407e42$var$DraggableAutoScrollProxy {
    constructor(draggableAutoScroll, draggable){
        this._draggableAutoScroll = draggableAutoScroll;
        this._draggable = draggable;
        this._position = {
            x: 0,
            y: 0
        };
        this._clientRect = {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        };
    }
    _getSettings() {
        return this._draggableAutoScroll.settings;
    }
    get targets() {
        let { targets: targets } = this._getSettings();
        if (typeof targets === 'function') targets = targets(this._draggable);
        return targets;
    }
    get position() {
        const position = this._position;
        const { getPosition: getPosition } = this._getSettings();
        if (typeof getPosition === 'function') Object.assign(position, getPosition(this._draggable));
        else {
            position.x = 0;
            position.y = 0;
        }
        return position;
    }
    get clientRect() {
        const rect = this._clientRect;
        const { getClientRect: getClientRect } = this._getSettings();
        if (typeof getClientRect === 'function') Object.assign(rect, getClientRect(this._draggable));
        else {
            rect.width = 0;
            rect.height = 0;
            rect.x = 0;
            rect.y = 0;
        }
        return rect;
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
}
class $244877ffe9407e42$export$5059276ad4233de3 {
    constructor(draggable, options = {}){
        this.name = 'autoscroll';
        this.version = '0.0.3';
        this.settings = this._parseSettings(options);
        this._autoScrollProxy = null;
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Start, ()=>{
            if (!this._autoScrollProxy) {
                this._autoScrollProxy = new $244877ffe9407e42$var$DraggableAutoScrollProxy(this, draggable);
                (0, $92cd9a0cd3661853$export$d976747ecb966cea).addItem(this._autoScrollProxy);
            }
        });
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, ()=>{
            if (this._autoScrollProxy) {
                (0, $92cd9a0cd3661853$export$d976747ecb966cea).removeItem(this._autoScrollProxy);
                this._autoScrollProxy = null;
            }
        });
    }
    _parseSettings(options, defaults = $244877ffe9407e42$var$getDefaultSettings()) {
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
function $244877ffe9407e42$export$c0f5c18ade842ccd(options) {
    return (draggable)=>{
        const p = new $244877ffe9407e42$export$5059276ad4233de3(draggable, options);
        const d = draggable;
        d.plugins[p.name] = p;
        return d;
    };
}





const $8cf3b9f73d8dfc46$export$38b6bae3524fed9e = {
    Destroy: 'destroy'
};
const $8cf3b9f73d8dfc46$export$f7d1599333345bbc = {
    accept: ()=>true,
    data: {}
};
class $8cf3b9f73d8dfc46$export$423ec2075359570a {
    constructor(element, options = {}){
        const { accept: accept = $8cf3b9f73d8dfc46$export$f7d1599333345bbc.accept, data: data = $8cf3b9f73d8dfc46$export$f7d1599333345bbc.data } = options;
        this.id = Symbol();
        this.element = element;
        this.accept = accept;
        this.data = {
            ...data
        };
        this.isDestroyed = false;
        this._clientRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)();
        this.updateClientRect();
    }
    on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    getClientRect() {
        return this._clientRect;
    }
    updateClientRect(rect) {
        const bcr = rect || this.element.getBoundingClientRect();
        const { _clientRect: _clientRect } = this;
        _clientRect.x = bcr.x;
        _clientRect.y = bcr.y;
        _clientRect.width = bcr.width;
        _clientRect.height = bcr.height;
    }
    destroy() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        this._emitter.emit($8cf3b9f73d8dfc46$export$38b6bae3524fed9e.Destroy);
        this._emitter.off();
    }
}



class $58dee706ab5c60e6$export$8d6d40335cc0e943 {
    constructor(getItem){
        this._items = [];
        this._index = 0;
        this._getItem = getItem;
    }
    get(...args) {
        if (this._index >= this._items.length) return this._items[this._index++] = this._getItem(undefined, ...args);
        return this._getItem(this._items[this._index++], ...args);
    }
    resetPointer() {
        this._index = 0;
    }
    resetItems(maxLength = 0) {
        const newItemCount = Math.max(0, Math.min(maxLength, this._items.length));
        this._index = Math.min(this._index, newItemCount);
        this._items.length = newItemCount;
    }
}




function $8c16eefbe97bde49$export$bd5271f935fe8c1a(sourceRect, result = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
}) {
    if (sourceRect) {
        result.width = sourceRect.width;
        result.height = sourceRect.height;
        result.x = sourceRect.x;
        result.y = sourceRect.y;
    }
    return result;
}


// The max amount of collisions we keep in collision pool when we return it
// to the pool cache.
const $24bdaa72c91e807d$var$MAX_CACHED_COLLISIONS = 20;
const $24bdaa72c91e807d$var$EMPTY_SYMBOL = Symbol();
const $24bdaa72c91e807d$export$ac79253b7e6fb14 = {
    checkCollision: (draggable, droppable, collisionData)=>{
        const draggableRect = draggable.getClientRect();
        const droppableRect = droppable.getClientRect();
        if (!draggableRect) return null;
        const intersectionRect = (0, $a33e267a6bda430c$export$990bfa80a352efc5)(draggableRect, droppableRect, collisionData.intersectionRect);
        if (intersectionRect === null) return null;
        const intersectionScore = (0, $ec0caa97c3c0620a$export$25b3e1e24e1ba229)(draggableRect, droppableRect, intersectionRect);
        if (intersectionScore <= 0) return null;
        collisionData.droppableId = droppable.id;
        (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(droppableRect, collisionData.droppableRect);
        (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(draggableRect, collisionData.draggableRect);
        collisionData.intersectionScore = intersectionScore;
        return collisionData;
    },
    sortCollisions: (_draggable, collisions)=>{
        return collisions.sort((a, b)=>{
            const diff = b.intersectionScore - a.intersectionScore;
            if (diff !== 0) return diff;
            return a.droppableRect.width * a.droppableRect.height - b.droppableRect.width * b.droppableRect.height;
        });
    },
    createCollisionData: ()=>{
        return {
            droppableId: $24bdaa72c91e807d$var$EMPTY_SYMBOL,
            droppableRect: (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(),
            draggableRect: (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(),
            intersectionRect: (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(),
            intersectionScore: 0
        };
    }
};
class $24bdaa72c91e807d$export$b931ab7b292a336c {
    constructor(dndContext, { checkCollision: checkCollision = $24bdaa72c91e807d$export$ac79253b7e6fb14.checkCollision, createCollisionData: createCollisionData = $24bdaa72c91e807d$export$ac79253b7e6fb14.createCollisionData, sortCollisions: sortCollisions = $24bdaa72c91e807d$export$ac79253b7e6fb14.sortCollisions } = {}){
        this._listenerId = Symbol();
        this._dndContext = dndContext;
        this._collisionDataPoolCache = [];
        this._collisionDataPoolMap = new Map();
        // These can be overriden anytime.
        this.checkCollision = checkCollision;
        this.sortCollisions = sortCollisions;
        this.createCollisionData = createCollisionData;
    }
    getCollisionDataPool(draggable) {
        let pool = this._collisionDataPoolMap.get(draggable);
        if (!pool) {
            pool = this._collisionDataPoolCache.pop() || new (0, $58dee706ab5c60e6$export$8d6d40335cc0e943)((item)=>{
                return item || this.createCollisionData();
            });
            this._collisionDataPoolMap.set(draggable, pool);
        }
        return pool;
    }
    removeCollisionDataPool(draggable) {
        const pool = this._collisionDataPoolMap.get(draggable);
        if (pool) {
            pool.resetItems($24bdaa72c91e807d$var$MAX_CACHED_COLLISIONS);
            pool.resetPointer();
            this._collisionDataPoolCache.push(pool);
            this._collisionDataPoolMap.delete(draggable);
        }
    }
    detectCollisions(draggable, targets, collisions) {
        // Reset the collisions array and colliding droppables set.
        collisions.length = 0;
        // If we don't have any targets, we can bail early.
        if (!targets.size) return;
        // Get or create the collision data pool for the draggable.
        const collisionDataPool = this.getCollisionDataPool(draggable);
        // Detect collisions between the draggable and all targets.
        let collisionData = null;
        const droppables = targets.values();
        for (const droppable of droppables){
            collisionData = collisionData || collisionDataPool.get();
            if (this.checkCollision(draggable, droppable, collisionData)) {
                collisions.push(collisionData);
                collisionData = null;
            }
        }
        // Sort the collisions.
        if (collisions.length > 1) this.sortCollisions(draggable, collisions);
        // Reset collision data pool pointer.
        collisionDataPool.resetPointer();
    }
    destroy() {
        this._collisionDataPoolMap.forEach((pool)=>{
            pool.resetItems();
        });
    }
}



var $fa11c4bc76a2544e$var$CollisionDetectionPhase = /*#__PURE__*/ function(CollisionDetectionPhase) {
    CollisionDetectionPhase[CollisionDetectionPhase["Idle"] = 0] = "Idle";
    CollisionDetectionPhase[CollisionDetectionPhase["Computing"] = 1] = "Computing";
    CollisionDetectionPhase[CollisionDetectionPhase["Computed"] = 2] = "Computed";
    CollisionDetectionPhase[CollisionDetectionPhase["Emitting"] = 3] = "Emitting";
    return CollisionDetectionPhase;
}($fa11c4bc76a2544e$var$CollisionDetectionPhase || {});
const $fa11c4bc76a2544e$var$SCROLL_LISTENER_OPTIONS = {
    capture: true,
    passive: true
};
const $fa11c4bc76a2544e$export$360ab8c194eb7385 = {
    Start: 'start',
    Move: 'move',
    Enter: 'enter',
    Leave: 'leave',
    Collide: 'collide',
    End: 'end',
    AddDraggable: 'addDraggable',
    RemoveDraggable: 'removeDraggable',
    AddDroppables: 'addDroppables',
    RemoveDroppables: 'removeDroppables',
    Destroy: 'destroy'
};
class $fa11c4bc76a2544e$export$2d5c5ceac203fc1e {
    constructor(options = {}){
        this._onScroll = ()=>{
            if (this._drags.size === 0) return;
            // Queue droppable client rects update.
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, ()=>{
                this.updateDroppableClientRects();
            }, this._listenerId);
            // Queue collision detection for all active draggables.
            this.detectCollisions();
        };
        const { collisionDetector: collisionDetector } = options;
        this.draggables = new Set();
        this.droppables = new Map();
        this._drags = new Map();
        this.isDestroyed = false;
        this._listenerId = Symbol();
        this._emitter = new (0, $e4e7a534e772252d$export$4293555f241ae35a)();
        // Bind methods.
        this._onScroll = this._onScroll.bind(this);
        if (typeof collisionDetector === 'function') this._collisionDetector = collisionDetector(this);
        else this._collisionDetector = new (0, $24bdaa72c91e807d$export$b931ab7b292a336c)(this, collisionDetector);
    }
    get drags() {
        return this._drags;
    }
    _getTargets(draggable) {
        const drag = this._drags.get(draggable);
        if (drag?._targets) return drag._targets;
        const targets = new Map();
        for (const droppable of this.droppables.values())if (this.isMatch(draggable, droppable)) targets.set(droppable.id, droppable);
        if (drag) drag._targets = targets;
        return targets;
    }
    _onDragPrepareStart(draggable) {
        // Make sure the draggable is registered.
        if (!this.draggables.has(draggable)) return;
        // Make sure the draggable is not being dragged, yet.
        if (this._drags.get(draggable)) return;
        // Set the initial drag data for the draggable.
        this._drags.set(draggable, {
            isEnded: false,
            data: {},
            _targets: null,
            _cd: {
                phase: 0,
                tickerId: Symbol(),
                targets: new Map(),
                collisions: [],
                contacts: new Set(),
                prevContacts: new Set(),
                addedContacts: new Set(),
                persistedContacts: new Set()
            }
        });
        // Recompute the droppable client rects if this is the first dragged
        // draggable. We only want to do this once per "drag process" and that
        // starts when a draggable starts dragging while there are no other dragged
        // draggables, and stops when a draggable ends dragging while there are no
        // other dragged draggables.
        if (this._drags.size === 1) this.updateDroppableClientRects();
        // Run collision detection for the draggable. Note that we just compute the
        // collisions here, but don't _yet_ emit the collisions events, we do that
        // part after emitting the start event.
        this._computeCollisions(draggable);
        // Add scroll listener if this is the first dragged draggable.
        if (this._drags.size === 1) window.addEventListener('scroll', this._onScroll, $fa11c4bc76a2544e$var$SCROLL_LISTENER_OPTIONS);
    }
    _onDragStart(draggable) {
        // Make sure the draggable is being dragged.
        const drag = this._drags.get(draggable);
        if (!drag || drag.isEnded) return;
        // Emit "start" event.
        if (this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.Start)) {
            const targets = this._getTargets(draggable);
            this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Start, {
                draggable: draggable,
                targets: targets
            });
        }
        // Lastly, emit collisions events.
        this._emitCollisions(draggable);
    }
    _onDragPrepareMove(draggable) {
        // Make sure the draggable is being dragged.
        const drag = this._drags.get(draggable);
        if (!drag || drag.isEnded) return;
        // Run collision detection.
        this._computeCollisions(draggable);
    }
    _onDragMove(draggable) {
        // Make sure the draggable is being dragged.
        const drag = this._drags.get(draggable);
        if (!drag || drag.isEnded) return;
        // Emit "move" event.
        if (this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.Move)) {
            const targets = this._getTargets(draggable);
            this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Move, {
                draggable: draggable,
                targets: targets
            });
        }
        // Lastly, emit collisions events.
        this._emitCollisions(draggable);
    }
    _onDragEnd(draggable) {
        this._stopDrag(draggable);
    }
    _onDragCancel(draggable) {
        this._stopDrag(draggable, true);
    }
    _onDragDestroy(draggable) {
        this.removeDraggable(draggable);
    }
    // Returns true if the final cleanup was queued to a microtask.
    _stopDrag(draggable, isCancelled = false) {
        // Make sure the draggable is being dragged.
        const drag = this._drags.get(draggable);
        if (!drag || drag.isEnded) return false;
        // Mark the drag as ended.
        drag.isEnded = true;
        // Check if the collisions are being emitted currently. This can happen if
        // the user causes drag to end synchronously in any way during the collision
        // emit phase.
        const isEmittingCollisions = drag._cd.phase === 3;
        // If the collisions are not being emitted currently, do a final collision
        // detection pass before emitting the drop event to ensure we have the most
        // up to date collisions data.
        if (!isEmittingCollisions) {
            this._computeCollisions(draggable, true);
            this._emitCollisions(draggable, true);
        }
        // Get the targets, collisions and colliding targets from the last collision
        // detection pass.
        const { targets: targets, collisions: collisions, contacts: contacts } = drag._cd;
        // Emit "end" event.
        if (this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.End)) this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.End, {
            isCancelled: isCancelled,
            draggable: draggable,
            targets: targets,
            collisions: collisions,
            contacts: contacts
        });
        // Wait for the collisions to be emitted before finalizing the drag end.
        // Also let's return true to indicate that the drag end was not finished
        // synchronously.
        if (isEmittingCollisions) {
            window.queueMicrotask(()=>{
                this._finalizeStopDrag(draggable);
            });
            return true;
        }
        this._finalizeStopDrag(draggable);
        return false;
    }
    _finalizeStopDrag(draggable) {
        const drag = this._drags.get(draggable);
        if (!drag || !drag.isEnded) return;
        // Remove the drag data.
        this._drags.delete(draggable);
        // Free up the collision data pool from the collision detector.
        this._collisionDetector.removeCollisionDataPool(draggable);
        // Clear the queued detect collisions callbacks.
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, drag._cd.tickerId);
        (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).write, drag._cd.tickerId);
        // Remove scroll ticker and listener if this was the last dragged draggable.
        if (!this._drags.size) {
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).off((0, $e434efa1a293c3f2$export$ef9171fc2626).read, this._listenerId);
            window.removeEventListener('scroll', this._onScroll, $fa11c4bc76a2544e$var$SCROLL_LISTENER_OPTIONS);
        }
    }
    _computeCollisions(draggable, force = false) {
        const drag = this._drags.get(draggable);
        if (!drag || !force && drag.isEnded) return;
        const cd = drag._cd;
        // Throw an error if collisions are being computed or emitted.
        switch(cd.phase){
            case 1:
                throw new Error('Collisions are being computed.');
            case 3:
                throw new Error('Collisions are being emitted.');
            default:
                break;
        }
        // Mark collision detection as computing.
        cd.phase = 1;
        // Get the targets of the draggable and set them as the collision targets.
        const targets = cd.targets = this._getTargets(draggable);
        // NB: Running collision detection will mutate the collision data of the
        // current collisions of the draggable (since we use object pool objects
        // directly for memory efficiency), so if we need to compare the current and
        // next collisions we need to cache the current collisions before running
        // the detection. But, we don't need to do that now, we just care about the
        // previous colliding droppables so this is fine.
        this._collisionDetector.detectCollisions(draggable, targets, cd.collisions);
        // Mark collision detection as computed.
        cd.phase = 2;
    }
    _emitCollisions(draggable, force = false) {
        const drag = this._drags.get(draggable);
        if (!drag || !force && drag.isEnded) return;
        const cd = drag._cd;
        // Make sure we have computed the collisions.
        switch(cd.phase){
            case 1:
                throw new Error('Collisions are being computed.');
            case 3:
                throw new Error('Collisions are being emitted.');
            case 0:
                // Silently ignore if collisions have not been computed yet. This is
                // a potential scenario, a valid one, but we should not throw an error
                // here.
                return;
            default:
                break;
        }
        // Mark collision detection as emitting.
        cd.phase = 3;
        const emitter = this._emitter;
        const collisions = cd.collisions;
        const targets = cd.targets;
        const addedContacts = cd.addedContacts;
        const persistedContacts = cd.persistedContacts;
        // Swap pointers to the colliding droppables sets.
        const prevContacts = cd.contacts;
        const contacts = cd.prevContacts;
        cd.prevContacts = prevContacts;
        cd.contacts = contacts;
        // Make removedContacts piggyback on prevContacts.
        const removedContacts = prevContacts;
        // Clear reusable sets.
        addedContacts.clear();
        persistedContacts.clear();
        contacts.clear();
        // Populate the colliding droppables set based on collisions and find out
        // added, persisted and removed collisions (leftover from the previous
        // collision phase).
        for (const collision of collisions){
            const droppable = targets.get(collision.droppableId);
            // NB: We should always have a droppable here since we compute the
            // collisions with the targets of the draggable, but it's still good to
            // be defensive here.
            if (!droppable) continue;
            contacts.add(droppable);
            if (prevContacts.has(droppable)) {
                persistedContacts.add(droppable);
                // Let's remove the droppable from the previous colliding droppables set,
                // this way the removed collisions will be the ones that are left in the
                // previous colliding droppables set.
                prevContacts.delete(droppable);
            } else addedContacts.add(droppable);
        }
        // Emit "leave" events.
        if (prevContacts.size && emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.Leave)) emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Leave, {
            draggable: draggable,
            targets: targets,
            collisions: collisions,
            contacts: contacts,
            removedContacts: removedContacts
        });
        // Emit "enter" events.
        if (addedContacts.size && emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.Enter)) emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Enter, {
            draggable: draggable,
            targets: targets,
            collisions: collisions,
            contacts: contacts,
            addedContacts: addedContacts
        });
        // Emit "collide" events if we have any contacts or removed contacts.
        if (emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.Collide) && (contacts.size || removedContacts.size)) emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Collide, {
            draggable: draggable,
            targets: targets,
            collisions: collisions,
            contacts: contacts,
            addedContacts: addedContacts,
            removedContacts: removedContacts,
            persistedContacts: persistedContacts
        });
        // Clear reusable sets.
        addedContacts.clear();
        persistedContacts.clear();
        prevContacts.clear();
        // Mark collision detection as idle.
        cd.phase = 0;
    }
    on(type, listener, listenerId) {
        return this._emitter.on(type, listener, listenerId);
    }
    off(type, listenerId) {
        this._emitter.off(type, listenerId);
    }
    updateDroppableClientRects() {
        for (const droppable of this.droppables.values())droppable.updateClientRect();
    }
    isMatch(draggable, droppable) {
        let isMatch = typeof droppable.accept === 'function' ? droppable.accept(draggable) : droppable.accept.includes(draggable.settings.group);
        // Make sure that none of the draggable's elements match the droppable's
        // element.
        if (isMatch && draggable.drag) {
            const items = draggable.drag.items;
            for(let i = 0; i < items.length; i++){
                if (items[i].element === droppable.element) return false;
            }
        }
        return isMatch;
    }
    clearTargets(draggable) {
        if (draggable) {
            const drag = this._drags.get(draggable);
            if (drag) drag._targets = null;
        } else for (const drag of this._drags.values())drag._targets = null;
    }
    detectCollisions(draggable) {
        if (this.isDestroyed) return;
        if (draggable) {
            const drag = this._drags.get(draggable);
            if (!drag || drag.isEnded) return;
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, ()=>this._computeCollisions(draggable), drag._cd.tickerId);
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).write, ()=>this._emitCollisions(draggable), drag._cd.tickerId);
        } else for (const [d, drag] of this._drags){
            if (drag.isEnded) continue;
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).read, ()=>this._computeCollisions(d), drag._cd.tickerId);
            (0, $e434efa1a293c3f2$export$e94d57566be028aa).once((0, $e434efa1a293c3f2$export$ef9171fc2626).write, ()=>this._emitCollisions(d), drag._cd.tickerId);
        }
    }
    addDraggable(draggable) {
        if (this.isDestroyed || this.draggables.has(draggable)) return;
        this.draggables.add(draggable);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareStart, ()=>{
            this._onDragPrepareStart(draggable);
        }, this._listenerId);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Start, ()=>{
            this._onDragStart(draggable);
        }, this._listenerId);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareMove, ()=>{
            this._onDragPrepareMove(draggable);
        }, this._listenerId);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Move, ()=>{
            this._onDragMove(draggable);
        }, this._listenerId);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, (e)=>{
            if (e?.type === (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).End) this._onDragEnd(draggable);
            else if (e?.type === (0, $b7f29e04c7dc9749$export$61fde4a8bbe7f5d5).Cancel) this._onDragCancel(draggable);
        }, this._listenerId);
        draggable.on((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Destroy, ()=>{
            this._onDragDestroy(draggable);
        }, this._listenerId);
        // Emit "addDraggable" event.
        if (this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.AddDraggable)) this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.AddDraggable, {
            draggable: draggable
        });
        // If the draggable is already being dragged, start the drag process
        // manually. Note that we are reading internal state of the draggable here
        // (`_startPhase`) to avoid double starting the drag process. We need to
        // be careful here and make sure to update this logic if we change the
        // draggable's internal state logic.
        if (!this.isDestroyed && draggable.drag && !draggable.drag.isEnded) {
            const startPhase = draggable['_startPhase'];
            if (startPhase >= 2) this._onDragPrepareStart(draggable);
            if (startPhase >= 4) this._onDragStart(draggable);
        }
    }
    removeDraggable(draggable) {
        // Make sure the draggable is registered.
        if (this.isDestroyed || !this.draggables.has(draggable)) return;
        // Remove draggable.
        this.draggables.delete(draggable);
        // Unbind the event listeners.
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareStart, this._listenerId);
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Start, this._listenerId);
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareMove, this._listenerId);
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Move, this._listenerId);
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, this._listenerId);
        draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Destroy, this._listenerId);
        // Cancel the drag.
        this._stopDrag(draggable, true);
        // Emit "removeDraggable" event.
        if (this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.RemoveDraggable)) this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.RemoveDraggable, {
            draggable: draggable
        });
    }
    addDroppables(droppables) {
        if (this.isDestroyed) return;
        const addedDroppables = new Set();
        for (const droppable of droppables){
            // Make sure the droppable is not registered.
            if (this.droppables.has(droppable.id)) continue;
            // Add the droppable to the validated set of droppables.
            addedDroppables.add(droppable);
            // Add the droppable to the droppable map.
            this.droppables.set(droppable.id, droppable);
            // Bind the destroy event listener.
            droppable.on((0, $8cf3b9f73d8dfc46$export$38b6bae3524fed9e).Destroy, ()=>{
                this.removeDroppables([
                    droppable
                ]);
            }, this._listenerId);
            // Add the droppable to the targets of all currently dragged draggables,
            // where the droppable is a valid target.
            this._drags.forEach(({ _targets: _targets }, draggable)=>{
                if (_targets && this.isMatch(draggable, droppable)) {
                    _targets.set(droppable.id, droppable);
                    this.detectCollisions(draggable);
                }
            });
        }
        // Emit "addDroppables" event.
        if (addedDroppables.size && this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.AddDroppables)) this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.AddDroppables, {
            droppables: addedDroppables
        });
    }
    removeDroppables(droppables) {
        if (this.isDestroyed) return;
        const removedDroppables = new Set();
        for (const droppable of droppables){
            // Make sure the droppable is registered.
            if (!this.droppables.has(droppable.id)) continue;
            // Remove the droppable from the droppables map.
            this.droppables.delete(droppable.id);
            // Add the droppable to the validated set of droppables.
            removedDroppables.add(droppable);
            // Unbind the destroy event listener.
            droppable.off((0, $8cf3b9f73d8dfc46$export$38b6bae3524fed9e).Destroy, this._listenerId);
            // Remove the droppable from the targets set of all dragged draggables and
            // queue collision detection for them.
            this._drags.forEach(({ _targets: _targets }, draggable)=>{
                if (_targets && _targets.has(droppable.id)) {
                    _targets.delete(droppable.id);
                    this.detectCollisions(draggable);
                }
            });
        }
        // Emit "removeDroppables" event.
        if (removedDroppables.size && this._emitter.listenerCount($fa11c4bc76a2544e$export$360ab8c194eb7385.RemoveDroppables)) this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.RemoveDroppables, {
            droppables: removedDroppables
        });
    }
    destroy() {
        // Make sure the context is not destroyed yet.
        if (this.isDestroyed) return;
        this.isDestroyed = true;
        // Unbind all draggable event listeners.
        this.draggables.forEach((draggable)=>{
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareStart, this._listenerId);
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Start, this._listenerId);
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).PrepareMove, this._listenerId);
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Move, this._listenerId);
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).End, this._listenerId);
            draggable.off((0, $0d0c72b4b6dc9dbb$export$a85ab346e352a830).Destroy, this._listenerId);
        });
        // Unbind all droppable event listeners.
        this.droppables.forEach((droppable)=>{
            droppable.off((0, $8cf3b9f73d8dfc46$export$38b6bae3524fed9e).Destroy, this._listenerId);
        });
        // Cancel all active drags.
        const activeDraggables = this._drags.keys();
        for (const draggable of activeDraggables)this._stopDrag(draggable, true);
        // Emit "destroy" event.
        this._emitter.emit($fa11c4bc76a2544e$export$360ab8c194eb7385.Destroy);
        // Unbind all emitter listeners.
        this._emitter.off();
        // Destroy the collision detector.
        this._collisionDetector.destroy();
        // Clear the draggables and droppables.
        this.draggables.clear();
        this.droppables.clear();
    }
}









const $31f0e541fc872793$var$DROPPABLE_CHAIN = [];
const $31f0e541fc872793$var$DRAGGABLE_CHAIN = [];
const $31f0e541fc872793$var$DROPPABLE_ANCESTORS = [];
const $31f0e541fc872793$var$DRAGGABLE_ANCESTORS = [];
function $31f0e541fc872793$var$clearCache() {
    $31f0e541fc872793$var$DROPPABLE_CHAIN.length = 0;
    $31f0e541fc872793$var$DRAGGABLE_CHAIN.length = 0;
    $31f0e541fc872793$var$DROPPABLE_ANCESTORS.length = 0;
    $31f0e541fc872793$var$DRAGGABLE_ANCESTORS.length = 0;
}
function $31f0e541fc872793$var$computeVisibleRect(rect, scrollContainers, result = {
    ...rect
}) {
    // Make sure to initialize the result with the original rect.
    (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(rect, result);
    // Compute the visible part of the rect by intersecting it with the scroll
    // containers. If there's no intersection, return null.
    for (const scrollContainer of scrollContainers){
        const scrollContainerRect = (0, $ef561677d46962d4$export$4b834cebd9e5cebe)([
            scrollContainer,
            'padding'
        ], window);
        const intersection = (0, $a33e267a6bda430c$export$990bfa80a352efc5)(result, scrollContainerRect, result);
        if (!intersection) return null;
    }
    return result;
}
const $31f0e541fc872793$export$d57a96fcba7d6b57 = {
    checkCollision: (draggable, droppable, collisionData)=>{
        const draggableRect = draggable.getClientRect();
        if (!draggableRect) return null;
        const droppableRect = droppable.getClientRect();
        const draggableElement = draggable.drag?.items[0]?.element || null;
        (0, $73a32fa1436292cd$export$e4864aa91b5ed091)(draggableElement, $31f0e541fc872793$var$DRAGGABLE_ANCESTORS);
        (0, $73a32fa1436292cd$export$e4864aa91b5ed091)(droppable.element, $31f0e541fc872793$var$DROPPABLE_ANCESTORS);
        // Find first common scroll container (FCSC). There's always at least
        // window.
        let fcsc = window;
        for (const droppableAncestor of $31f0e541fc872793$var$DROPPABLE_ANCESTORS)if ($31f0e541fc872793$var$DRAGGABLE_ANCESTORS.includes(droppableAncestor)) {
            fcsc = droppableAncestor;
            break;
        }
        // Get draggale's scroll container chain.
        $31f0e541fc872793$var$DRAGGABLE_CHAIN.length = 0;
        for (const draggableAncestor of $31f0e541fc872793$var$DRAGGABLE_ANCESTORS){
            if (draggableAncestor === fcsc) break;
            if (draggableAncestor instanceof Element) $31f0e541fc872793$var$DRAGGABLE_CHAIN.push(draggableAncestor);
        }
        // Get droppable's scroll container chain.
        $31f0e541fc872793$var$DROPPABLE_CHAIN.length = 0;
        for (const droppableAncestor of $31f0e541fc872793$var$DROPPABLE_ANCESTORS){
            if (droppableAncestor === fcsc) break;
            if (droppableAncestor instanceof Element) $31f0e541fc872793$var$DROPPABLE_CHAIN.push(droppableAncestor);
        }
        // Compute droppable visible rect.
        const droppableVisibleRect = $31f0e541fc872793$var$computeVisibleRect(droppableRect, $31f0e541fc872793$var$DROPPABLE_CHAIN, collisionData.droppableVisibleRect);
        if (!droppableVisibleRect) {
            $31f0e541fc872793$var$clearCache();
            return null;
        }
        // Compute draggable visible rect.
        const draggableVisibleRect = $31f0e541fc872793$var$computeVisibleRect(draggableRect, $31f0e541fc872793$var$DRAGGABLE_CHAIN, collisionData.draggableVisibleRect);
        if (!draggableVisibleRect) {
            $31f0e541fc872793$var$clearCache();
            return null;
        }
        // Compute intersection rect between the visible rects.
        const intersectionRect = (0, $a33e267a6bda430c$export$990bfa80a352efc5)(draggableVisibleRect, droppableVisibleRect, collisionData.intersectionRect);
        if (!intersectionRect) {
            $31f0e541fc872793$var$clearCache();
            return null;
        }
        // Compute intersection score.
        const score = (0, $ec0caa97c3c0620a$export$25b3e1e24e1ba229)(draggableVisibleRect, droppableVisibleRect, intersectionRect);
        if (score <= 0) {
            $31f0e541fc872793$var$clearCache();
            return null;
        }
        (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(droppableRect, collisionData.droppableRect);
        (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)(draggableRect, collisionData.draggableRect);
        collisionData.droppableId = droppable.id;
        collisionData.intersectionScore = score;
        $31f0e541fc872793$var$clearCache();
        return collisionData;
    },
    sortCollisions: (_draggable, collisions)=>{
        return collisions.sort((a, b)=>{
            const diff = b.intersectionScore - a.intersectionScore;
            if (diff !== 0) return diff;
            return a.droppableVisibleRect.width * a.droppableVisibleRect.height - b.droppableVisibleRect.width * b.droppableVisibleRect.height;
        });
    },
    createCollisionData: ()=>{
        const data = (0, $24bdaa72c91e807d$export$ac79253b7e6fb14).createCollisionData();
        data.droppableVisibleRect = (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)();
        data.draggableVisibleRect = (0, $8c16eefbe97bde49$export$bd5271f935fe8c1a)();
        return data;
    }
};
class $31f0e541fc872793$export$33a3c5dbfd7c6c65 extends (0, $24bdaa72c91e807d$export$b931ab7b292a336c) {
    constructor(dndContext){
        super(dndContext, {
            ...$31f0e541fc872793$export$d57a96fcba7d6b57
        });
    }
}








const $f770251f4470ce8a$var$element = document.querySelector('.draggable');
const $f770251f4470ce8a$var$pointerSensor = new (0, $e72ff61c97f755fe$export$b26af955418d6638)($f770251f4470ce8a$var$element);
const $f770251f4470ce8a$var$keyboardSensor = new (0, $7fff4587bd07df96$export$436f6efcc297171)($f770251f4470ce8a$var$element);
const $f770251f4470ce8a$var$draggable = new (0, $0d0c72b4b6dc9dbb$export$f2a139e5d18b9882)([
    $f770251f4470ce8a$var$pointerSensor,
    $f770251f4470ce8a$var$keyboardSensor
], {
    elements: ()=>[
            $f770251f4470ce8a$var$element
        ],
    positionModifiers: [
        (0, $e4a9d189cff00937$export$b43dd221600cdb2e)(()=>{
            return {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        })
    ],
    onStart: ()=>{
        $f770251f4470ce8a$var$element.classList.add('dragging');
    },
    onEnd: ()=>{
        $f770251f4470ce8a$var$element.classList.remove('dragging');
    }
});


