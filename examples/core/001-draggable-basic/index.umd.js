(function(factory) {
	typeof define === "function" && define.amd ? define([], factory) : factory();
})(function() {
	//#region ../../node_modules/eventti/dist/index.js
	const e$3 = {
		ADD: `add`,
		UPDATE: `update`,
		IGNORE: `ignore`,
		THROW: `throw`
	};
	var t$3 = class {
		dedupe;
		getId;
		_events;
		constructor(t = {}) {
			this.dedupe = t.dedupe || e$3.ADD, this.getId = t.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
		}
		_getListeners(e) {
			let t = this._events.get(e);
			return t ? t.l ||= [...t.m.values()] : null;
		}
		on(t, n, r) {
			let i = this._events, a = i.get(t);
			a || (a = {
				m: /* @__PURE__ */ new Map(),
				l: null
			}, i.set(t, a));
			let o = a.m;
			if (r = r === void 0 ? this.getId(n) : r, o.has(r)) switch (this.dedupe) {
				case e$3.THROW: throw Error(`Eventti: duplicate listener id!`);
				case e$3.IGNORE: return r;
				case e$3.UPDATE:
					a.l = null;
					break;
				default: o.delete(r), a.l = null;
			}
			return o.set(r, n), a.l?.push(n), r;
		}
		once(e, t, n) {
			let r = 0;
			return n = n === void 0 ? this.getId(t) : n, this.on(e, ((...i) => {
				r || (r = 1, this.off(e, n), t(...i));
			}), n);
		}
		off(e, t) {
			if (e === void 0) {
				this._events.clear();
				return;
			}
			if (t === void 0) {
				this._events.delete(e);
				return;
			}
			let n = this._events.get(e);
			n?.m.delete(t) && (n.l = null, n.m.size || this._events.delete(e));
		}
		emit(e, ...t) {
			let n = this._getListeners(e);
			if (n) {
				let e = n.length, r = 0;
				if (t.length) for (; r < e; r++) n[r](...t);
				else for (; r < e; r++) n[r]();
			}
		}
		listenerCount(e) {
			if (e === void 0) {
				let e = 0;
				return this._events.forEach((t) => {
					e += t.m.size;
				}), e;
			}
			return this._events.get(e)?.m.size || 0;
		}
	}, o$2 = class {
		constructor(e = {}) {
			let { phases: t = [], dedupe: r, getId: s } = e;
			this._phases = t, this._emitter = new t$3({
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
			for (; s < a; s++) n = r(t[s]), n && e.push(n);
			return e;
		}
		_processQueue(...e) {
			let t = this._queue, r = t.length;
			if (!r) return;
			let s = 0, a = 0, n, c;
			for (; s < r; s++) for (n = t[s], a = 0, c = n.length; a < c; a++) n[a](...e);
			t.length = 0;
		}
	};
	function u$1(i = 60) {
		if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e) => {
			let t = requestAnimationFrame(e);
			return () => cancelAnimationFrame(t);
		};
		{
			let e = 1e3 / i, t = typeof performance > "u" ? () => Date.now() : () => performance.now();
			return (r) => {
				let s = setTimeout(() => r(t()), e);
				return () => clearTimeout(s);
			};
		}
	}
	var l$1 = class extends o$2 {
		constructor(e = {}) {
			let { paused: t = !1, onDemand: r = !1, requestFrame: s = u$1(), ...a } = e;
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
	//#endregion
	//#region ../dragdoll/dist/singletons/ticker.js
	const n$4 = {
		read: Symbol(),
		write: Symbol()
	};
	let r$3 = new l$1({
		phases: [n$4.read, n$4.write],
		requestFrame: typeof window < `u` ? u$1() : () => () => {}
	});
	//#endregion
	//#region ../dragdoll/dist/utils/get-style.js
	const e$2 = /* @__PURE__ */ new WeakMap();
	function t$2(t) {
		let n = e$2.get(t)?.deref();
		return n || (n = window.getComputedStyle(t, null), e$2.set(t, new WeakRef(n))), n;
	}
	const IS_SAFARI = !!("undefined" != typeof window && void 0 !== window.document && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
	const BOX_EDGE = {
		content: "content",
		padding: "padding",
		scrollbar: "scrollbar",
		border: "border",
		margin: "margin"
	};
	BOX_EDGE.content, BOX_EDGE.padding, BOX_EDGE.scrollbar, BOX_EDGE.border, BOX_EDGE.margin;
	(() => {
		try {
			return window.navigator.userAgentData.brands.some((({ brand: n }) => "Chromium" === n));
		} catch (n) {
			return !1;
		}
	})();
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
	function isWindow(n) {
		return n instanceof Window;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
	const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
	function getStyle(e, t) {
		if (t) return window.getComputedStyle(e, t);
		let C = STYLE_DECLARATION_CACHE.get(e)?.deref();
		return C || (C = window.getComputedStyle(e, null), STYLE_DECLARATION_CACHE.set(e, new WeakRef(C))), C;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
	function isDocumentElement(e) {
		return e instanceof HTMLHtmlElement;
	}
	//#endregion
	//#region ../dragdoll/dist/constants-Civq9RS1.js
	const e$1 = typeof window < `u` && window.document !== void 0, t$1 = e$1 && `ontouchstart` in window, n$3 = e$1 && !!window.PointerEvent;
	e$1 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);
	//#endregion
	//#region ../dragdoll/dist/sensors.js
	const e = {
		Start: `start`,
		Move: `move`,
		Cancel: `cancel`,
		End: `end`,
		Destroy: `destroy`
	};
	//#endregion
	//#region ../dragdoll/dist/pointer-sensor-B321QRT8.js
	function i$3(e, t) {
		if (`pointerId` in e) return e.pointerId === t ? e : null;
		if (`changedTouches` in e) {
			let n = 0;
			for (; n < e.changedTouches.length; n++) if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
			return null;
		}
		return e;
	}
	function a$2(e) {
		return `pointerId` in e ? e.pointerId : `changedTouches` in e ? e.changedTouches[0] ? e.changedTouches[0].identifier : null : -1;
	}
	function o$1(e) {
		return `pointerType` in e ? e.pointerType : `touches` in e ? `touch` : `mouse`;
	}
	function s$1(e = {}) {
		let { capture: t = !0, passive: n = !0 } = e;
		return {
			capture: t,
			passive: n
		};
	}
	function c$1(n) {
		return n === `auto` || n === void 0 ? n$3 ? `pointer` : t$1 ? `touch` : `mouse` : n;
	}
	const l = {
		pointer: {
			start: `pointerdown`,
			move: `pointermove`,
			cancel: `pointercancel`,
			end: `pointerup`
		},
		touch: {
			start: `touchstart`,
			move: `touchmove`,
			cancel: `touchcancel`,
			end: `touchend`
		},
		mouse: {
			start: `mousedown`,
			move: `mousemove`,
			cancel: ``,
			end: `mouseup`
		}
	}, u = {
		listenerOptions: {},
		sourceEvents: `auto`,
		startPredicate: (e) => !(`button` in e && e.button > 0),
		cancelOnVisibilityChange: !0,
		cancelOnEscape: !0,
		preventNativeDrag: !0,
		preventContextMenu: !1
	};
	var d = class {
		element;
		drag;
		isDestroyed;
		_startPredicate;
		_listenerOptions;
		_sourceEvents;
		_areWindowListenersBound;
		_emitter;
		_eventData = null;
		_removeClickBlocker = null;
		_cancelOnVisibilityChange;
		_cancelOnEscape;
		_preventNativeDrag;
		_preventContextMenu;
		_preventNativeDragHandler = (e) => e.preventDefault();
		_preventContextMenuHandler = (e) => e.preventDefault();
		_visibilityChangeHandler = () => {
			this.cancel();
		};
		_onKeyDown = (e) => {
			e.key === `Escape` && this.drag && (e.preventDefault(), this.cancel());
		};
		constructor(e, t = {}) {
			let { listenerOptions: n = u.listenerOptions, sourceEvents: i = u.sourceEvents, startPredicate: a = u.startPredicate, cancelOnVisibilityChange: o = u.cancelOnVisibilityChange, cancelOnEscape: d = u.cancelOnEscape, preventNativeDrag: f = u.preventNativeDrag, preventContextMenu: p = u.preventContextMenu } = t;
			this.element = e, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._cancelOnVisibilityChange = o ?? !0, this._cancelOnEscape = d ?? !0, this._preventNativeDrag = f ?? !0, this._preventContextMenu = p ?? !1, this._startPredicate = a, this._listenerOptions = s$1(n), this._sourceEvents = c$1(i), this._emitter = new t$3(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), o && document.addEventListener(`visibilitychange`, this._visibilityChangeHandler);
		}
		_getTrackedPointerEventData(e) {
			return this.drag ? i$3(e, this.drag.pointerId) : null;
		}
		_onStart(e$6) {
			if (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e$6)) return;
			let t = a$2(e$6);
			if (t === null) return;
			let r = i$3(e$6, t);
			if (r === null) return;
			let s = {
				pointerId: t,
				pointerType: o$1(e$6),
				startX: r.clientX,
				startY: r.clientY,
				x: r.clientX,
				y: r.clientY,
				deltaX: 0,
				deltaY: 0
			};
			this.drag = s, this._eventData = {
				...s,
				type: e.Start,
				srcEvent: e$6,
				target: r.target
			}, this._emitter.emit(this._eventData.type, this._eventData), this.drag && this._bindWindowListeners();
		}
		_onMove(e$7) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$7);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.Move, r.srcEvent = e$7, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r);
		}
		_onCancel(e$8) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$8);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.Cancel, r.srcEvent = e$8, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r), this._resetDrag();
		}
		_onEnd(e$9) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$9);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.End, r.srcEvent = e$9, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r), this._resetDrag();
		}
		_bindWindowListeners() {
			if (this._areWindowListenersBound) return;
			let { move: e, end: t, cancel: n } = l[this._sourceEvents];
			window.addEventListener(e, this._onMove, this._listenerOptions), window.addEventListener(t, this._onEnd, this._listenerOptions), n && window.addEventListener(n, this._onCancel, this._listenerOptions), this._cancelOnEscape && document.addEventListener(`keydown`, this._onKeyDown), this._preventNativeDrag && window.addEventListener(`dragstart`, this._preventNativeDragHandler), this._preventContextMenu && window.addEventListener(`contextmenu`, this._preventContextMenuHandler), this._areWindowListenersBound = !0;
		}
		_unbindWindowListeners() {
			if (this._areWindowListenersBound) {
				let { move: e, end: t, cancel: n } = l[this._sourceEvents];
				window.removeEventListener(e, this._onMove, this._listenerOptions), window.removeEventListener(t, this._onEnd, this._listenerOptions), n && window.removeEventListener(n, this._onCancel, this._listenerOptions), this._cancelOnEscape && document.removeEventListener(`keydown`, this._onKeyDown), this._preventNativeDrag && window.removeEventListener(`dragstart`, this._preventNativeDragHandler), this._preventContextMenu && window.removeEventListener(`contextmenu`, this._preventContextMenuHandler), this._areWindowListenersBound = !1;
			}
		}
		_resetDrag() {
			this.drag = null, this._eventData = null, this._unbindWindowListeners();
		}
		cancel() {
			this.drag && (this._eventData.type = e.Cancel, this._eventData.srcEvent = null, this._eventData.target = null, this._eventData.x = this.drag.x, this._eventData.y = this.drag.y, this._eventData.deltaX = this.drag.deltaX, this._eventData.deltaY = this.drag.deltaY, this._emitter.emit(this._eventData.type, this._eventData), this._resetDrag());
		}
		updateElement(e) {
			this.isDestroyed || this.element === e || (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), e.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this.element = e);
		}
		updateSettings(e) {
			if (this.isDestroyed) return;
			let { listenerOptions: t, sourceEvents: n, startPredicate: r, cancelOnVisibilityChange: i, cancelOnEscape: a, preventNativeDrag: o, preventContextMenu: u } = e, d = c$1(n), f = s$1(t);
			r && this._startPredicate !== r && (this._startPredicate = r), i !== void 0 && this._cancelOnVisibilityChange !== i && (this._cancelOnVisibilityChange = i, i ? document.addEventListener(`visibilitychange`, this._visibilityChangeHandler) : document.removeEventListener(`visibilitychange`, this._visibilityChangeHandler)), a !== void 0 && this._cancelOnEscape !== a && (this._cancelOnEscape = a, this._areWindowListenersBound && (a ? document.addEventListener(`keydown`, this._onKeyDown) : document.removeEventListener(`keydown`, this._onKeyDown))), o !== void 0 && this._preventNativeDrag !== o && (this._preventNativeDrag = o, this._areWindowListenersBound && (o ? window.addEventListener(`dragstart`, this._preventNativeDragHandler) : window.removeEventListener(`dragstart`, this._preventNativeDragHandler))), u !== void 0 && this._preventContextMenu !== u && (this._preventContextMenu = u, this._areWindowListenersBound && (u ? window.addEventListener(`contextmenu`, this._preventContextMenuHandler) : window.removeEventListener(`contextmenu`, this._preventContextMenuHandler))), (t && (this._listenerOptions.capture !== f.capture || this._listenerOptions.passive !== f.passive) || n && this._sourceEvents !== d) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n && (this._sourceEvents = d), t && f && (this._listenerOptions = f), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
		}
		on(e, t, n) {
			return this._emitter.on(e, t, n);
		}
		off(e, t) {
			this._emitter.off(e, t);
		}
		preventClickOnEnd() {
			this._removeClickBlocker?.();
			let e = (e) => {
				e.isTrusted && (e.preventDefault(), e.stopPropagation(), this._removeClickBlocker?.());
			};
			this.element.addEventListener(`click`, e, { capture: !0 }), this._removeClickBlocker = () => {
				this.element.removeEventListener(`click`, e, !0), this._removeClickBlocker = null;
			};
		}
		destroy() {
			this.isDestroyed || (this.isDestroyed = !0, this._removeClickBlocker?.(), this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._visibilityChangeHandler));
		}
	};
	//#endregion
	//#region ../dragdoll/dist/get-element-transform-string-tl0-Pn98.js
	function t(t) {
		let n = t$2(t);
		if (n.boxSizing === `border-box`) return parseFloat(n.height) || 0;
		let r = parseFloat(n.height) || 0, i = parseFloat(n.borderTopWidth) || 0, a = parseFloat(n.borderBottomWidth) || 0, o = parseFloat(n.paddingTop) || 0, s = parseFloat(n.paddingBottom) || 0, c = i + a, l = r + (o + s) + c;
		if (!(t instanceof HTMLElement)) return l;
		let u = t.offsetHeight, d = u - t.clientHeight, f = Math.max(0, Number.isInteger(window.devicePixelRatio) ? d - Math.round(c) : d - c), p = u - l, m = Math.abs(p), h = Math.abs(p - f);
		return f > 0 && h < m ? l + 2 * p : l + f;
	}
	function n$2(t) {
		let n = t$2(t);
		if (n.boxSizing === `border-box`) return parseFloat(n.width) || 0;
		let r = parseFloat(n.width) || 0, i = parseFloat(n.borderLeftWidth) || 0, a = parseFloat(n.borderRightWidth) || 0, o = parseFloat(n.paddingLeft) || 0, s = parseFloat(n.paddingRight) || 0, c = i + a, l = r + (o + s) + c;
		if (!(t instanceof HTMLElement)) return l;
		let u = t.offsetWidth, d = u - t.clientWidth, f = Math.max(0, Number.isInteger(window.devicePixelRatio) ? d - Math.round(c) : d - c), p = u - l, m = Math.abs(p), h = Math.abs(p - f);
		return f > 0 && h < m ? l + 2 * p : l + f;
	}
	function r$2(r, i = !1) {
		let { translate: a, rotate: o, scale: s, transform: c } = t$2(r), l = ``;
		if (a && a !== `none`) {
			let [e = `0px`, i = `0px`, o] = a.split(` `);
			e.includes(`%`) && (e = `${parseFloat(e) / 100 * n$2(r)}px`), i.includes(`%`) && (i = `${parseFloat(i) / 100 * t(r)}px`), o ? l += `translate3d(${e},${i},${o})` : l += `translate(${e},${i})`;
		}
		if (o && o !== `none`) {
			let e = o.split(` `);
			e.length > 1 ? l += `rotate3d(${e.join(`,`)})` : l += `rotate(${e.join(`,`)})`;
		}
		if (s && s !== `none`) {
			let e = s.split(` `);
			e.length === 3 ? l += `scale3d(${e.join(`,`)})` : l += `scale(${e.join(`,`)})`;
		}
		return !i && c && c !== `none` && (l += c), l;
	}
	//#endregion
	//#region ../dragdoll/dist/get-world-transform-matrix-CPlGWCEu.js
	function r$1(e) {
		return e.setMatrixValue(`scale(1)`);
	}
	function i$2(e, t = {
		x: 0,
		y: 0,
		z: 0
	}) {
		let n = e.split(` `), r = ``, i = ``, a = ``;
		return n.length === 1 ? r = i = n[0] : n.length === 2 ? [r, i] = n : [r, i, a] = n, t.x = parseFloat(r) || 0, t.y = parseFloat(i) || 0, t.z = parseFloat(a) || 0, t;
	}
	const a$1 = e$1 ? new DOMMatrix() : null, o = e$1 ? new DOMMatrix() : null, s = {
		x: 0,
		y: 0,
		z: 0
	};
	function c(t, c = new DOMMatrix()) {
		let l = t;
		for (r$1(c); l;) {
			let t = r$2(l);
			if (t && (a$1.setMatrixValue(t), !a$1.isIdentity)) {
				let { transformOrigin: t } = t$2(l);
				i$2(t, s);
				let { x: n, y: u, z: d } = s;
				d === 0 ? (a$1.translateSelf(-n, -u), r$1(o).translateSelf(n, u)) : (a$1.translateSelf(-n, -u, -d), r$1(o).translateSelf(n, u, d)), a$1.preMultiplySelf(o), c.preMultiplySelf(a$1);
			}
			l = l.parentElement;
		}
		return c;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isBlockElement.js
	function isBlockElement(e) {
		switch (getStyle(e).display) {
			case "none": return null;
			case "inline":
			case "contents": return !1;
			default: return !0;
		}
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
	function isContainingBlockForFixedElement(n) {
		const t = getStyle(n);
		if (!IS_SAFARI) {
			const { filter: n } = t;
			if (n && "none" !== n) return !0;
			const { backdropFilter: e } = t;
			if (e && "none" !== e) return !0;
			const { willChange: i } = t;
			if (i && (i.indexOf("filter") > -1 || i.indexOf("backdrop-filter") > -1)) return !0;
		}
		const e = isBlockElement(n);
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
		return !(!c || !(c.indexOf("transform") > -1 || c.indexOf("perspective") > -1 || c.indexOf("contain") > -1)) || !!(IS_SAFARI && c && c.indexOf("filter") > -1);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
	function isContainingBlockForAbsoluteElement(t) {
		return "static" !== getStyle(t).position || isContainingBlockForFixedElement(t);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
	function getContainingBlock(e, t = {}) {
		if (isDocumentElement(e)) return e.ownerDocument.defaultView;
		const n = t.position || getStyle(e).position, { skipDisplayNone: i, container: o } = t;
		switch (n) {
			case "static":
			case "relative":
			case "sticky":
			case "-webkit-sticky": {
				let t = o || e.parentElement;
				for (; t;) {
					const e = isBlockElement(t);
					if (e) return t;
					if (null === e && !i) return null;
					t = t.parentElement;
				}
				return e.ownerDocument.documentElement;
			}
			case "absolute":
			case "fixed": {
				const t = "fixed" === n;
				let l = o || e.parentElement;
				for (; l;) {
					const e = t ? isContainingBlockForFixedElement(l) : isContainingBlockForAbsoluteElement(l);
					if (!0 === e) return l;
					if (null === e && !i) return null;
					l = l.parentElement;
				}
				return e.ownerDocument.defaultView;
			}
			default: return null;
		}
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
	function getOffsetContainer(n, t = {}) {
		const { display: o } = getStyle(n);
		if ("none" === o || "contents" === o) return null;
		const e = t.position || getStyle(n).position, { skipDisplayNone: s, container: r } = t;
		switch (e) {
			case "relative": return n;
			case "fixed": return getContainingBlock(n, {
				container: r,
				position: e,
				skipDisplayNone: s
			});
			case "absolute": {
				const t = getContainingBlock(n, {
					container: r,
					position: e,
					skipDisplayNone: s
				});
				return isWindow(t) ? n.ownerDocument : t;
			}
			default: return null;
		}
	}
	//#endregion
	//#region ../dragdoll/dist/draggable-C0bXGT_u.js
	function f(e, t) {
		return e.isIdentity && t.isIdentity ? !0 : e.is2D && t.is2D ? e.a === t.a && e.b === t.b && e.c === t.c && e.d === t.d && e.e === t.e && e.f === t.f : e.m11 === t.m11 && e.m12 === t.m12 && e.m13 === t.m13 && e.m14 === t.m14 && e.m21 === t.m21 && e.m22 === t.m22 && e.m23 === t.m23 && e.m24 === t.m24 && e.m31 === t.m31 && e.m32 === t.m32 && e.m33 === t.m33 && e.m34 === t.m34 && e.m41 === t.m41 && e.m42 === t.m42 && e.m43 === t.m43 && e.m44 === t.m44;
	}
	function p(e) {
		return e.m11 !== 1 || e.m12 !== 0 || e.m13 !== 0 || e.m14 !== 0 || e.m21 !== 0 || e.m22 !== 1 || e.m23 !== 0 || e.m24 !== 0 || e.m31 !== 0 || e.m32 !== 0 || e.m33 !== 1 || e.m34 !== 0 || e.m43 !== 0 || e.m44 !== 1;
	}
	function m(e, t, n = null) {
		if (`moveBefore` in e && e.isConnected === t.isConnected) try {
			e.moveBefore(t, n);
			return;
		} catch {}
		let r = document.activeElement, i = t.contains(r);
		e.insertBefore(t, n), i && document.activeElement !== r && r instanceof HTMLElement && r.focus({ preventScroll: !0 });
	}
	function h(e, t = 0) {
		let n = 10 ** t;
		return Math.round((e + 2 ** -52) * n) / n;
	}
	var g = class {
		_cache;
		_validation;
		constructor() {
			this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Set();
		}
		set(e, t) {
			this._cache.set(e, t), this._validation.add(e);
		}
		get(e) {
			return this._cache.get(e);
		}
		has(e) {
			return this._cache.has(e);
		}
		delete(e) {
			this._cache.delete(e), this._validation.delete(e);
		}
		isValid(e) {
			return this._validation.has(e);
		}
		invalidate(e) {
			e === void 0 ? this._validation.clear() : this._validation.delete(e);
		}
		clear() {
			this._cache.clear(), this._validation.clear();
		}
	}, _ = class {
		sensor;
		startEvent;
		prevMoveEvent;
		moveEvent;
		endEvent;
		items;
		isEnded;
		_matrixCache;
		_clientOffsetCache;
		constructor(e, t) {
			this.sensor = e, this.startEvent = { ...t }, this.prevMoveEvent = { ...t }, this.moveEvent = { ...t }, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new g(), this._clientOffsetCache = new g();
		}
	};
	function v(e, t, n = !1) {
		let { style: r } = e;
		for (let e in t) r.setProperty(e, t[e], n ? `important` : ``);
	}
	function y() {
		let e = document.createElement(`div`);
		return e.classList.add(`dragdoll-measure`), v(e, {
			display: `block`,
			position: `absolute`,
			inset: `0px`,
			padding: `0px`,
			margin: `0px`,
			border: `none`,
			opacity: `0`,
			transform: `none`,
			"transform-origin": `0 0`,
			transition: `none`,
			animation: `none`,
			"pointer-events": `none`
		}, !0), e;
	}
	function b(e, t = {
		x: 0,
		y: 0
	}) {
		if (t.x = 0, t.y = 0, e instanceof Window) return t;
		if (e instanceof Document) return t.x = window.scrollX * -1, t.y = window.scrollY * -1, t;
		let { x: r, y: i } = e.getBoundingClientRect(), a = t$2(e);
		return t.x = r + (parseFloat(a.borderLeftWidth) || 0), t.y = i + (parseFloat(a.borderTopWidth) || 0), t;
	}
	function x(e) {
		return typeof e == `object` && !!e && `x` in e && `y` in e;
	}
	const S = {
		x: 0,
		y: 0
	}, C = {
		x: 0,
		y: 0
	};
	function w(e, t, n = {
		x: 0,
		y: 0
	}) {
		let r = x(e) ? e : b(e, S), i = x(t) ? t : b(t, C);
		return n.x = i.x - r.x, n.y = i.y - r.y, n;
	}
	const T = e$1 ? y() : null;
	var E = class {
		data;
		element;
		elementContainer;
		elementOffsetContainer;
		dragContainer;
		dragOffsetContainer;
		elementTransformOrigin;
		elementTransformMatrix;
		elementOffsetMatrix;
		frozenStyles;
		unfrozenStyles;
		clientRect;
		position;
		containerOffset;
		alignmentOffset;
		_moveDiff;
		_alignDiff;
		_matrixCache;
		_clientOffsetCache;
		constructor(e, t) {
			if (!e.isConnected) throw Error(`Element is not connected`);
			let { drag: r } = t;
			if (!r) throw Error(`Drag is not defined`);
			let i = t$2(e), a = e.getBoundingClientRect(), s = r$2(e, !0);
			this.data = {}, this.element = e, this.elementTransformOrigin = i$2(i.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s + i.transform), this.elementOffsetMatrix = new DOMMatrix(s).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
				x: 0,
				y: 0
			}, this.containerOffset = {
				x: 0,
				y: 0
			}, this.alignmentOffset = {
				x: 0,
				y: 0
			}, this._moveDiff = {
				x: 0,
				y: 0
			}, this._alignDiff = {
				x: 0,
				y: 0
			}, this._matrixCache = r._matrixCache, this._clientOffsetCache = r._clientOffsetCache;
			let c = e.parentElement;
			if (!c) throw Error(`Dragged element does not have a parent element.`);
			this.elementContainer = c;
			let u = t.settings.container, f = (typeof u == `function` ? u({
				draggable: t,
				drag: r,
				element: e
			}) : u) || c;
			if (this.dragContainer = f, c !== f) {
				let { position: e } = i;
				if (e !== `fixed` && e !== `absolute`) throw Error(`Dragged element has "${e}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
			}
			let p = getOffsetContainer(e) || e;
			this.elementOffsetContainer = p, this.dragOffsetContainer = f === c ? p : getOffsetContainer(e, { container: f });
			{
				let { width: e, height: t, x: n, y: r } = a;
				this.clientRect = {
					width: e,
					height: t,
					x: n,
					y: r
				};
			}
			this._updateContainerMatrices(), this._updateContainerOffset();
			let m = t.settings.frozenStyles({
				draggable: t,
				drag: r,
				item: this,
				style: i
			});
			if (Array.isArray(m)) if (m.length) {
				let e = {};
				for (let t of m) e[t] = i[t];
				this.frozenStyles = e;
			} else this.frozenStyles = null;
			else this.frozenStyles = m;
			if (this.frozenStyles) {
				let t = {};
				for (let n in this.frozenStyles) t[n] = e.style[n];
				this.unfrozenStyles = t;
			}
		}
		_updateContainerMatrices() {
			[this.elementContainer, this.dragContainer].forEach((e) => {
				if (!this._matrixCache.isValid(e)) {
					let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()], [n, r] = t;
					c(e, n), r$1(r).multiplySelf(n).invertSelf(), this._matrixCache.set(e, t);
				}
			});
		}
		_updateContainerOffset() {
			let { elementOffsetContainer: e, elementContainer: t, dragOffsetContainer: n, dragContainer: r, containerOffset: i, _clientOffsetCache: a, _matrixCache: o } = this;
			if (e !== n) {
				let [s, c] = [[r, n], [t, e]].map(([e, t]) => {
					let n = a.get(t) || {
						x: 0,
						y: 0
					};
					if (!a.isValid(t)) {
						let r = o.get(e);
						t instanceof HTMLElement && r && !r[0].isIdentity ? p(r[0]) ? (T.style.setProperty(`transform`, r[1].toString(), `important`), t.append(T), b(T, n), T.remove()) : (b(t, n), n.x -= r[0].m41, n.y -= r[0].m42) : b(t, n);
					}
					return a.set(t, n), n;
				});
				w(s, c, i);
			} else i.x = 0, i.y = 0;
		}
		getContainerMatrix() {
			return this._matrixCache.get(this.elementContainer);
		}
		getDragContainerMatrix() {
			return this._matrixCache.get(this.dragContainer);
		}
		updateSize(e) {
			if (e) this.clientRect.width = e.width, this.clientRect.height = e.height;
			else {
				let { width: e, height: t } = this.element.getBoundingClientRect();
				this.clientRect.width = e, this.clientRect.height = t;
			}
		}
	};
	const D = {
		capture: !0,
		passive: !0
	}, O = {
		x: 0,
		y: 0
	}, k = e$1 ? new DOMMatrix() : null, A = e$1 ? new DOMMatrix() : null;
	var j = function(e) {
		return e[e.None = 0] = `None`, e[e.Init = 1] = `Init`, e[e.Prepare = 2] = `Prepare`, e[e.FinishPrepare = 3] = `FinishPrepare`, e[e.Apply = 4] = `Apply`, e[e.FinishApply = 5] = `FinishApply`, e;
	}(j || {}), M = function(e) {
		return e[e.Pending = 0] = `Pending`, e[e.Resolved = 1] = `Resolved`, e[e.Rejected = 2] = `Rejected`, e;
	}(M || {});
	const N = {
		Start: `start`,
		Move: `move`,
		End: `end`
	}, P = {
		Immediate: `immediate`,
		Sampled: `sampled`
	}, F = {
		Start: `start`,
		StartAlign: `start-align`,
		Move: `move`,
		Align: `align`,
		End: `end`,
		EndAlign: `end-align`
	}, I = {
		PrepareStart: `preparestart`,
		Start: `start`,
		PrepareMove: `preparemove`,
		Move: `move`,
		End: `end`,
		Destroy: `destroy`
	}, L = {
		container: null,
		startPredicate: () => !0,
		elements: () => null,
		frozenStyles: () => null,
		applyPosition: ({ item: e, phase: t }) => {
			let n = t === F.End || t === F.EndAlign, [r, i] = e.getContainerMatrix(), [a, o] = e.getDragContainerMatrix(), { position: c, alignmentOffset: l, containerOffset: u, elementTransformMatrix: d, elementTransformOrigin: f, elementOffsetMatrix: p } = e, { x: m, y: h, z: g } = f, _ = !d.isIdentity && (m !== 0 || h !== 0 || g !== 0), v = c.x + l.x + u.x, y = c.y + l.y + u.y;
			r$1(k), _ && (g === 0 ? k.translateSelf(-m, -h) : k.translateSelf(-m, -h, -g)), n ? i.isIdentity || k.multiplySelf(i) : o.isIdentity || k.multiplySelf(o), r$1(A).translateSelf(v, y), k.multiplySelf(A), r.isIdentity || k.multiplySelf(r), _ && (r$1(A).translateSelf(m, h, g), k.multiplySelf(A)), d.isIdentity || k.multiplySelf(d), p.isIdentity || k.preMultiplySelf(p), e.element.style.transform = `${k}`;
		},
		computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
		positionModifiers: [],
		sensorProcessingMode: P.Sampled,
		dndGroups: void 0,
		preventClickOnEnd: !0,
		preventTextSelection: !0,
		capturePointer: !0
	};
	var R = class {
		id;
		_sensors;
		settings;
		plugins;
		drag;
		isDestroyed;
		_sensorData;
		_emitter;
		_startPhase;
		_startId;
		_moveId;
		_alignId;
		_modifierData;
		_selectionChangeHandler = null;
		_pointerCaptureTarget = null;
		_pointerCaptureId = null;
		constructor(e, t = {}) {
			let { id: n = Symbol(), ...r } = t;
			this.id = n, this._sensors = e, this.settings = this._parseSettings(r), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new t$3(), this._startPhase = j.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._modifierData = {
				draggable: this,
				drag: null,
				item: null,
				phase: N.Start
			}, this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this._sensors.forEach((e) => {
				this._bindSensor(e);
			});
		}
		get sensors() {
			return this._sensors;
		}
		set sensors(e) {
			let t = this._sensors;
			if (e === t) return;
			let n = t.filter((t) => !e.includes(t)), r = e.filter((e) => !t.includes(e));
			this._sensors = e, n.forEach((e) => {
				this._unbindSensor(e);
			}), r.forEach((e) => {
				this._bindSensor(e);
			});
			let i = this.drag?.sensor;
			i && n.includes(i) && this.stop();
		}
		_bindSensor(e$4) {
			this._sensorData.set(e$4, {
				predicateState: M.Pending,
				predicateEvent: null,
				onMove: (t) => this._onMove(t, e$4),
				onEnd: (t) => this._onEnd(t, e$4)
			});
			let { onMove: t, onEnd: n } = this._sensorData.get(e$4);
			e$4.on(e.Start, t, t), e$4.on(e.Move, t, t), e$4.on(e.Cancel, n, n), e$4.on(e.End, n, n);
		}
		_unbindSensor(e$5) {
			let t = this._sensorData.get(e$5);
			if (!t) return;
			let { onMove: n, onEnd: r } = t;
			e$5.off(e.Start, n), e$5.off(e.Move, n), e$5.off(e.Cancel, r), e$5.off(e.End, r), this._sensorData.delete(e$5);
		}
		_parseSettings(e, t = L) {
			let { container: n = t.container, startPredicate: r = t.startPredicate, elements: i = t.elements, frozenStyles: a = t.frozenStyles, positionModifiers: o = t.positionModifiers, applyPosition: s = t.applyPosition, computeClientRect: c = t.computeClientRect, sensorProcessingMode: l = t.sensorProcessingMode, dndGroups: u = t.dndGroups, preventClickOnEnd: d = t.preventClickOnEnd, preventTextSelection: f = t.preventTextSelection, capturePointer: p = t.capturePointer, onPrepareStart: m = t.onPrepareStart, onStart: h = t.onStart, onPrepareMove: g = t.onPrepareMove, onMove: _ = t.onMove, onEnd: v = t.onEnd, onDestroy: y = t.onDestroy } = e || {};
			return {
				container: n,
				startPredicate: r,
				elements: i,
				frozenStyles: a,
				positionModifiers: o,
				applyPosition: s,
				computeClientRect: c,
				sensorProcessingMode: l,
				dndGroups: u,
				preventClickOnEnd: d,
				preventTextSelection: f,
				capturePointer: p,
				onPrepareStart: m,
				onStart: h,
				onPrepareMove: g,
				onMove: _,
				onEnd: v,
				onDestroy: y
			};
		}
		_emit(e, ...t) {
			this._emitter.emit(e, ...t);
		}
		_onMove(n, r) {
			let i = this._sensorData.get(r);
			if (i) switch (i.predicateState) {
				case M.Pending: {
					i.predicateEvent = n;
					let e = this.settings.startPredicate({
						draggable: this,
						sensor: r,
						event: n
					});
					e === !0 ? this.resolveStartPredicate(r) : e === !1 && this.rejectStartPredicate(r);
					break;
				}
				case M.Resolved:
					this.drag && (Object.assign(this.drag.moveEvent, n), this.settings.sensorProcessingMode === P.Immediate ? (this._prepareMove(), this._applyMove()) : (r$3.once(n$4.read, this._prepareMove, this._moveId), r$3.once(n$4.write, this._applyMove, this._moveId)));
					break;
			}
		}
		_onScroll() {
			this.align();
		}
		_onEnd(e, t) {
			let n = this._sensorData.get(t);
			n && (this.drag ? n.predicateState === M.Resolved && (this.drag.endEvent = { ...e }, this._sensorData.forEach((e) => {
				e.predicateState = M.Pending, e.predicateEvent = null;
			}), this.stop()) : (n.predicateState = M.Pending, n.predicateEvent = null));
		}
		_prepareStart() {
			let e = this.drag;
			!e || this._startPhase !== j.Init || (this._startPhase = j.Prepare, e.items = (this.settings.elements({
				draggable: this,
				drag: e
			}) || []).map((e) => new E(e, this)), this._applyModifiers(N.Start, 0, 0), this._emit(I.PrepareStart, e, this), this.settings.onPrepareStart?.(e, this), this._startPhase = j.FinishPrepare);
		}
		_applyStart() {
			let e = this.drag;
			if (!(!e || this._startPhase !== j.FinishPrepare)) {
				if (this._startPhase = j.Apply, this.settings.preventClickOnEnd) {
					let t = e.sensor;
					`preventClickOnEnd` in t && typeof t.preventClickOnEnd == `function` && t.preventClickOnEnd();
				}
				if (this.settings.preventTextSelection) {
					let t = e.items[0]?.element?.ownerDocument ?? document;
					t.getSelection()?.removeAllRanges(), this._selectionChangeHandler = () => t.getSelection()?.removeAllRanges(), t.addEventListener(`selectionchange`, this._selectionChangeHandler);
				}
				if (this.settings.capturePointer) {
					let t = e.sensor;
					if (t instanceof d && t.drag) {
						let n = e.items[0]?.element?.ownerDocument?.body;
						if (n) try {
							n.setPointerCapture(t.drag.pointerId), this._pointerCaptureTarget = n, this._pointerCaptureId = t.drag.pointerId;
						} catch {}
					}
				}
				for (let t of e.items) t.dragContainer !== t.elementContainer && m(t.dragContainer, t.element), t.frozenStyles && Object.assign(t.element.style, t.frozenStyles), this.settings.applyPosition({
					phase: F.Start,
					draggable: this,
					drag: e,
					item: t
				});
				for (let t of e.items) {
					let e = t.getContainerMatrix()[0], n = t.getDragContainerMatrix()[0];
					if (f(e, n) || !p(e) && !p(n)) continue;
					let r = t.element.getBoundingClientRect(), { alignmentOffset: i } = t;
					i.x += h(t.clientRect.x - r.x, 3), i.y += h(t.clientRect.y - r.y, 3);
				}
				for (let t of e.items) {
					let { alignmentOffset: n } = t;
					(n.x !== 0 || n.y !== 0) && this.settings.applyPosition({
						phase: F.StartAlign,
						draggable: this,
						drag: e,
						item: t
					});
				}
				window.addEventListener(`scroll`, this._onScroll, D), this._emit(I.Start, e, this), this.settings.onStart?.(e, this), this._startPhase = j.FinishApply;
			}
		}
		_prepareMove() {
			let e = this.drag;
			if (!e || e.isEnded) return;
			let { moveEvent: t, prevMoveEvent: n } = e, r = t.x - n.x, i = t.y - n.y;
			!r && !i || (this._applyModifiers(N.Move, r, i), this._emit(I.PrepareMove, e, this), !e.isEnded && (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
		}
		_applyMove() {
			let e = this.drag;
			if (!(!e || e.isEnded)) {
				for (let t of e.items) t._moveDiff.x = 0, t._moveDiff.y = 0, this.settings.applyPosition({
					phase: F.Move,
					draggable: this,
					drag: e,
					item: t
				});
				this._emit(I.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this);
			}
		}
		_prepareAlign() {
			let { drag: e } = this;
			if (!(!e || e.isEnded)) for (let t of e.items) {
				let { x: e, y: n } = t.element.getBoundingClientRect(), r = t.clientRect.x - t._moveDiff.x - e;
				t.alignmentOffset.x = t.alignmentOffset.x - t._alignDiff.x + r, t._alignDiff.x = r;
				let i = t.clientRect.y - t._moveDiff.y - n;
				t.alignmentOffset.y = t.alignmentOffset.y - t._alignDiff.y + i, t._alignDiff.y = i;
			}
		}
		_applyAlign() {
			let { drag: e } = this;
			if (!(!e || e.isEnded)) for (let t of e.items) t._alignDiff.x = 0, t._alignDiff.y = 0, this.settings.applyPosition({
				phase: F.Align,
				draggable: this,
				drag: e,
				item: t
			});
		}
		_applyModifiers(e, t, n) {
			let { drag: r } = this;
			if (!r) return;
			let i = this.settings.positionModifiers, a = this._modifierData;
			a.drag = r;
			for (let o of r.items) {
				let r = O;
				r.x = t, r.y = n, a.item = o, a.phase = e;
				for (let e of i) r = e(r, a);
				o.position.x += r.x, o.position.y += r.y, o.clientRect.x += r.x, o.clientRect.y += r.y, e === `move` && (o._moveDiff.x += r.x, o._moveDiff.y += r.y);
			}
		}
		on(e, t, n) {
			return this._emitter.on(e, t, n);
		}
		off(e, t) {
			this._emitter.off(e, t);
		}
		resolveStartPredicate(n, r) {
			let i = this._sensorData.get(n);
			if (!i) return;
			let a = r || i.predicateEvent;
			i.predicateState === M.Pending && a && (this._startPhase = j.Init, i.predicateState = M.Resolved, i.predicateEvent = null, this.drag = new _(n, a), this._sensorData.forEach((e, t) => {
				t !== n && (e.predicateState = M.Rejected, e.predicateEvent = null);
			}), this.settings.sensorProcessingMode === P.Immediate ? (this._prepareStart(), this._applyStart()) : (r$3.once(n$4.read, this._prepareStart, this._startId), r$3.once(n$4.write, this._applyStart, this._startId)));
		}
		rejectStartPredicate(e) {
			let t = this._sensorData.get(e);
			t?.predicateState === M.Pending && (t.predicateState = M.Rejected, t.predicateEvent = null);
		}
		stop() {
			let n = this.drag;
			if (!n || n.isEnded) return;
			if (this._startPhase === j.Prepare || this._startPhase === j.Apply) throw Error(`Cannot stop drag start process at this point`);
			if (n.isEnded = !0, this._prepareStart(), this._applyStart(), this._startPhase = j.None, r$3.off(n$4.read, this._startId), r$3.off(n$4.write, this._startId), r$3.off(n$4.read, this._moveId), r$3.off(n$4.write, this._moveId), r$3.off(n$4.read, this._alignId), r$3.off(n$4.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, D), this._selectionChangeHandler &&= ((n.items[0]?.element?.ownerDocument ?? document).removeEventListener(`selectionchange`, this._selectionChangeHandler), null), this._pointerCaptureTarget && this._pointerCaptureId !== null) {
				try {
					this._pointerCaptureTarget.releasePointerCapture(this._pointerCaptureId);
				} catch {}
				this._pointerCaptureTarget = null, this._pointerCaptureId = null;
			}
			this._applyModifiers(N.End, 0, 0);
			for (let e of n.items) {
				if (e.elementContainer !== e.dragContainer && (m(e.elementContainer, e.element), e.alignmentOffset.x = 0, e.alignmentOffset.y = 0, e.containerOffset.x = 0, e.containerOffset.y = 0), e.unfrozenStyles) for (let t in e.unfrozenStyles) e.element.style[t] = e.unfrozenStyles[t] || ``;
				this.settings.applyPosition({
					phase: F.End,
					draggable: this,
					drag: n,
					item: e
				});
			}
			for (let e of n.items) if (e.elementContainer !== e.dragContainer) {
				let t = e.element.getBoundingClientRect();
				e.alignmentOffset.x = h(e.clientRect.x - t.x, 3), e.alignmentOffset.y = h(e.clientRect.y - t.y, 3);
			}
			for (let e of n.items) e.elementContainer !== e.dragContainer && (e.alignmentOffset.x !== 0 || e.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: F.EndAlign,
				draggable: this,
				drag: n,
				item: e
			});
			this._emit(I.End, n, this), this.settings.onEnd?.(n, this), this.drag = null;
			let r = this._modifierData;
			r.drag = null, r.item = null;
		}
		align(n = !1) {
			!this.drag || this.drag.isEnded || (n || this.settings.sensorProcessingMode === P.Immediate ? (this._prepareAlign(), this._applyAlign()) : (r$3.once(n$4.read, this._prepareAlign, this._alignId), r$3.once(n$4.write, this._applyAlign, this._alignId)));
		}
		getClientRect() {
			let { drag: e, settings: t } = this;
			return e && t.computeClientRect?.({
				draggable: this,
				drag: e
			}) || null;
		}
		updateSettings(e) {
			let t = this.settings.capturePointer;
			if (this.settings = this._parseSettings(e, this.settings), t && !this.settings.capturePointer && this._pointerCaptureTarget) {
				if (this._pointerCaptureId !== null) try {
					this._pointerCaptureTarget.releasePointerCapture(this._pointerCaptureId);
				} catch {}
				this._pointerCaptureTarget = null, this._pointerCaptureId = null;
			}
		}
		use(e) {
			return e(this);
		}
		destroy() {
			this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensors.forEach((e) => {
				this._unbindSensor(e);
			}), this._emit(I.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
		}
	};
	//#endregion
	//#region ../dragdoll/dist/sensors/base.js
	var n$1 = class {
		drag;
		isDestroyed;
		_emitter;
		constructor() {
			this.drag = null, this.isDestroyed = !1, this._emitter = new t$3();
		}
		_createDragData(e) {
			return {
				x: e.x,
				y: e.y,
				startX: e.x,
				startY: e.y,
				deltaX: 0,
				deltaY: 0
			};
		}
		_updateDragData(e) {
			this.drag && (this.drag.deltaX = e.x - this.drag.x, this.drag.deltaY = e.y - this.drag.y, this.drag.x = e.x, this.drag.y = e.y);
		}
		_resetDragData() {
			this.drag = null;
		}
		_start(t) {
			if (this.isDestroyed || this.drag) return;
			let n = this._createDragData(t), r = t;
			r.startX = n.startX, r.startY = n.startY, r.deltaX = n.deltaX, r.deltaY = n.deltaY, this.drag = n, this._emitter.emit(e.Start, r);
		}
		_move(t) {
			if (!this.drag) return;
			this._updateDragData(t);
			let n = t;
			n.startX = this.drag.startX, n.startY = this.drag.startY, n.deltaX = this.drag.deltaX, n.deltaY = this.drag.deltaY, this._emitter.emit(e.Move, n);
		}
		_end(t) {
			if (!this.drag) return;
			this._updateDragData(t);
			let n = t;
			n.startX = this.drag.startX, n.startY = this.drag.startY, n.deltaX = this.drag.deltaX, n.deltaY = this.drag.deltaY, this._emitter.emit(e.End, n), this._resetDragData();
		}
		_cancel(t) {
			if (!this.drag) return;
			this._updateDragData(t);
			let n = t;
			n.startX = this.drag.startX, n.startY = this.drag.startY, n.deltaX = this.drag.deltaX, n.deltaY = this.drag.deltaY, this._emitter.emit(e.Cancel, n), this._resetDragData();
		}
		on(e, t, n) {
			return this._emitter.on(e, t, n);
		}
		off(e, t) {
			this._emitter.off(e, t);
		}
		cancel() {
			this.drag && this._cancel({
				type: e.Cancel,
				x: this.drag.x,
				y: this.drag.y,
				startX: this.drag.startX,
				startY: this.drag.startY,
				deltaX: this.drag.deltaX,
				deltaY: this.drag.deltaY
			});
		}
		destroy() {
			this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off());
		}
	};
	//#endregion
	//#region ../dragdoll/dist/sensors/base-motion.js
	var i$1 = class extends n$1 {
		drag;
		_direction;
		_speed;
		_tickEvent;
		_moveEvent;
		constructor() {
			super(), this.drag = null, this._direction = {
				x: 0,
				y: 0
			}, this._speed = 0, this._tickEvent = {
				type: `tick`,
				time: 0,
				deltaTime: 0
			}, this._moveEvent = {
				type: e.Move,
				x: 0,
				y: 0,
				srcEvent: null,
				target: null,
				startX: 0,
				startY: 0,
				deltaX: 0,
				deltaY: 0
			}, this._tick = this._tick.bind(this);
		}
		_createDragData(e) {
			return {
				...super._createDragData(e),
				time: 0,
				deltaTime: 0
			};
		}
		_start(n) {
			this.isDestroyed || this.drag || (super._start(n), r$3.on(n$4.read, this._tick, this._tick));
		}
		_end(n) {
			this.drag && (r$3.off(n$4.read, this._tick), super._end(n));
		}
		_cancel(n) {
			this.drag && (r$3.off(n$4.read, this._tick), super._cancel(n));
		}
		_tick(e) {
			if (this.drag) if (e && this.drag.time) {
				this.drag.deltaTime = e - this.drag.time, this.drag.time = e;
				let t = this._tickEvent;
				if (t.time = this.drag.time, t.deltaTime = this.drag.deltaTime, this._emitter.emit(`tick`, t), !this.drag) return;
				let n = this._speed * (this.drag.deltaTime / 1e3), r = this._direction.x * n, i = this._direction.y * n;
				if (r || i) {
					let e = this._moveEvent;
					e.x = this.drag.x + r, e.y = this.drag.y + i, this._move(e);
				}
			} else this.drag.time = e, this.drag.deltaTime = 0;
		}
	};
	//#endregion
	//#region ../dragdoll/dist/sensors/keyboard-motion.js
	const n = [
		`start`,
		`cancel`,
		`end`,
		`moveLeft`,
		`moveRight`,
		`moveUp`,
		`moveDown`
	];
	function r(e, t) {
		if (!e.size || !t.size) return Infinity;
		let n = Infinity;
		for (let r of e) {
			let e = t.get(r);
			e !== void 0 && e < n && (n = e);
		}
		return n;
	}
	const i = {
		startKeys: [` `, `Enter`],
		moveLeftKeys: [`ArrowLeft`],
		moveRightKeys: [`ArrowRight`],
		moveUpKeys: [`ArrowUp`],
		moveDownKeys: [`ArrowDown`],
		cancelKeys: [`Escape`],
		endKeys: [` `, `Enter`],
		cancelOnBlur: !0,
		cancelOnVisibilityChange: !0,
		computeSpeed: () => 500,
		startPredicate: (e, t) => {
			if (t.element && document.activeElement === t.element) {
				let { left: e, top: n } = t.element.getBoundingClientRect();
				return {
					x: e,
					y: n
				};
			}
			return null;
		}
	};
	var a = class extends i$1 {
		element;
		_eventData = {
			type: ``,
			x: 0,
			y: 0,
			srcEvent: null
		};
		_moveKeys;
		_moveKeyTimestamps;
		_startKeys;
		_moveLeftKeys;
		_moveRightKeys;
		_moveUpKeys;
		_moveDownKeys;
		_cancelKeys;
		_endKeys;
		_cancelOnBlur;
		_cancelOnVisibilityChange;
		_computeSpeed;
		_startPredicate;
		constructor(e, t = {}) {
			super();
			let { startPredicate: n = i.startPredicate, computeSpeed: r = i.computeSpeed, cancelOnVisibilityChange: a = i.cancelOnVisibilityChange, cancelOnBlur: o = i.cancelOnBlur, startKeys: s = i.startKeys, moveLeftKeys: c = i.moveLeftKeys, moveRightKeys: l = i.moveRightKeys, moveUpKeys: u = i.moveUpKeys, moveDownKeys: d = i.moveDownKeys, cancelKeys: f = i.cancelKeys, endKeys: p = i.endKeys } = t;
			this.element = e, this._startKeys = new Set(s), this._cancelKeys = new Set(f), this._endKeys = new Set(p), this._moveLeftKeys = new Set(c), this._moveRightKeys = new Set(l), this._moveUpKeys = new Set(u), this._moveDownKeys = new Set(d), this._moveKeys = new Set([
				...c,
				...l,
				...u,
				...d
			]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o, this._cancelOnVisibilityChange = a, this._computeSpeed = r, this._startPredicate = n, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o && e?.addEventListener(`blur`, this._blurCancelHandler), a && document.addEventListener(`visibilitychange`, this._internalCancel);
		}
		_end(e) {
			this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._end(e));
		}
		_cancel(e) {
			this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._cancel(e));
		}
		_internalCancel() {
			this.cancel();
		}
		_blurCancelHandler() {
			queueMicrotask(() => {
				document.activeElement !== this.element && this.cancel();
			});
		}
		_updateDirection() {
			let e = r(this._moveLeftKeys, this._moveKeyTimestamps), t = r(this._moveRightKeys, this._moveKeyTimestamps), n = r(this._moveUpKeys, this._moveKeyTimestamps), i = r(this._moveDownKeys, this._moveKeyTimestamps), a = e === t ? 0 : e < t ? -1 : 1, o = n === i ? 0 : n < i ? -1 : 1;
			if (!(a === 0 || o === 0)) {
				let e = 1 / (Math.sqrt(a * a + o * o) || 1);
				a *= e, o *= e;
			}
			this._direction.x = a, this._direction.y = o;
		}
		_onTick() {
			this._speed = this._computeSpeed(this);
		}
		_onKeyUp(e) {
			this._moveKeyTimestamps.get(e.key) && (this._moveKeyTimestamps.delete(e.key), this._updateDirection());
		}
		_onKeyDown(t) {
			if (!this.drag) {
				if (this._startKeys.has(t.key)) {
					let n = this._startPredicate(t, this);
					if (n) {
						t.preventDefault();
						let r = this._eventData;
						r.type = e.Start, r.x = n.x, r.y = n.y, r.srcEvent = t, this._start(r);
					}
				}
				return;
			}
			if (this._cancelKeys.has(t.key)) {
				t.preventDefault(), this._internalCancel();
				return;
			}
			if (this._endKeys.has(t.key)) {
				t.preventDefault();
				let n = this._eventData;
				n.type = e.End, n.x = this.drag.x, n.y = this.drag.y, n.srcEvent = t, this._end(n);
				return;
			}
			if (this._moveKeys.has(t.key)) {
				t.preventDefault(), this._moveKeyTimestamps.get(t.key) || (this._moveKeyTimestamps.set(t.key, Date.now()), this._updateDirection());
				return;
			}
		}
		updateElement(e) {
			this.isDestroyed || this.element === e || (this._cancelOnBlur && (this.element?.removeEventListener(`blur`, this._blurCancelHandler), e?.addEventListener(`blur`, this._blurCancelHandler)), this.element = e);
		}
		updateSettings(e) {
			if (this.isDestroyed) return;
			let t = !1, { cancelOnBlur: r, cancelOnVisibilityChange: i, startPredicate: a, computeSpeed: o } = e;
			if (r !== void 0 && this._cancelOnBlur !== r && (this._cancelOnBlur = r, r ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i !== void 0 && this._cancelOnVisibilityChange !== i && (this._cancelOnVisibilityChange = i, i ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a !== void 0 && (this._startPredicate = a), o !== void 0 && (this._computeSpeed = o), n.forEach((n, r) => {
				let i = `${n}Keys`, a = e[i];
				a !== void 0 && (this[`_${i}`] = new Set(a), r >= 3 && (t = !0));
			}), t) {
				let e = [
					...this._moveLeftKeys,
					...this._moveRightKeys,
					...this._moveUpKeys,
					...this._moveDownKeys
				];
				this._moveKeys.size === e.length && [...this._moveKeys].every((t, n) => e[n] === t) || (this._moveKeys = new Set(e), this._moveKeyTimestamps.clear(), this._updateDirection());
			}
		}
		destroy() {
			this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
		}
	};
	//#endregion
	//#region examples/core/001-draggable-basic/index.ts
	let zIndex = 0;
	[...document.querySelectorAll(".draggable")].forEach((element) => {
		new R([new d(element), new a(element)], {
			elements: () => [element],
			onStart: () => {
				element.classList.add("dragging");
				element.style.zIndex = `${++zIndex}`;
			},
			onEnd: () => {
				element.classList.remove("dragging");
			}
		});
	});
	//#endregion
});
