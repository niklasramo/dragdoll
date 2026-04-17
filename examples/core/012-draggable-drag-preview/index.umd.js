(function(factory) {
	typeof define === "function" && define.amd ? define([], factory) : factory();
})(function() {
	//#region ../../node_modules/eventti/dist/index.js
	const e$5 = {
		ADD: `add`,
		UPDATE: `update`,
		IGNORE: `ignore`,
		THROW: `throw`
	};
	var t$7 = class {
		dedupe;
		getId;
		_events;
		constructor(t = {}) {
			this.dedupe = t.dedupe || e$5.ADD, this.getId = t.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
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
				case e$5.THROW: throw Error(`Eventti: duplicate listener id!`);
				case e$5.IGNORE: return r;
				case e$5.UPDATE:
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
	}, o$3 = class {
		constructor(e = {}) {
			let { phases: t = [], dedupe: r, getId: s } = e;
			this._phases = t, this._emitter = new t$7({
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
	function u$2(i = 60) {
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
	var l$2 = class extends o$3 {
		constructor(e = {}) {
			let { paused: t = !1, onDemand: r = !1, requestFrame: s = u$2(), ...a } = e;
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
	const n$6 = {
		read: Symbol(),
		write: Symbol()
	};
	let r$5 = new l$2({
		phases: [n$6.read, n$6.write],
		requestFrame: typeof window < `u` ? u$2() : () => () => {}
	});
	//#endregion
	//#region ../dragdoll/dist/create-full-rect-CN40ot0y.js
	function e$4(e, t = {
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0
	}) {
		return e && (t.width = e.width, t.height = e.height, t.x = e.x, t.y = e.y, t.left = e.x, t.top = e.y, t.right = e.x + e.width, t.bottom = e.y + e.height), t;
	}
	//#endregion
	//#region ../dragdoll/dist/get-intersection-score-DeyaSQFJ.js
	function e$3(e, t, n = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	}) {
		let r = Math.max(e.x, t.x), i = Math.min(e.x + e.width, t.x + t.width);
		if (i <= r) return null;
		let a = Math.max(e.y, t.y), o = Math.min(e.y + e.height, t.y + t.height);
		return o <= a ? null : (n.x = r, n.y = a, n.width = i - r, n.height = o - a, n);
	}
	const t$6 = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	};
	function n$5(n, r, i) {
		if (i ||= e$3(n, r, t$6), !i) return 0;
		let a = i.width * i.height;
		return a ? a / (Math.min(n.width, r.width) * Math.min(n.height, r.height)) * 100 : 0;
	}
	//#endregion
	//#region ../dragdoll/dist/utils/get-style.js
	const e$2 = /* @__PURE__ */ new WeakMap();
	function t$5(t) {
		let n = e$2.get(t)?.deref();
		return n || (n = window.getComputedStyle(t, null), e$2.set(t, new WeakRef(n))), n;
	}
	//#endregion
	//#region ../dragdoll/dist/get-rect-CYE6A0nw.js
	function t$4(e) {
		return e instanceof Window;
	}
	const n$4 = new Set([`auto`, `scroll`]);
	function r$4(r, i) {
		let a = i || {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		if (t$4(r)) return a.x = 0, a.y = 0, a.width = r.innerWidth, a.height = r.innerHeight, a;
		let o = r.getBoundingClientRect(), s = t$5(r), c = parseFloat(s.borderLeftWidth) || 0, l = parseFloat(s.borderRightWidth) || 0, u = parseFloat(s.borderTopWidth) || 0, d = parseFloat(s.borderBottomWidth) || 0;
		a.x = o.left + c, a.y = o.top + u;
		let f = o.width - c - l, p = o.height - u - d, m = r;
		return m !== m.ownerDocument.documentElement && (n$4.has(s.overflowY) && (f -= Math.max(0, Math.round(f) - m.clientWidth)), n$4.has(s.overflowX) && (p -= Math.max(0, Math.round(p) - m.clientHeight))), a.width = f, a.height = p, a;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isIntersecting.js
	function isIntersecting(t, e) {
		return !(t.left + t.width <= e.left || e.left + e.width <= t.left || t.top + t.height <= e.top || e.top + e.height <= t.top);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getDistanceBetweenPoints.js
	function getDistanceBetweenPoints(t, e, n, o) {
		return Math.sqrt(Math.pow(n - t, 2) + Math.pow(o - e, 2));
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getDistanceBetweenRects.js
	function getDistanceBetweenRects(t, e) {
		if (isIntersecting(t, e)) return null;
		const n = t.left + t.width, i = t.top + t.height, o = e.left + e.width, s = e.top + e.height;
		return n <= e.left ? i <= e.top ? getDistanceBetweenPoints(n, i, e.left, e.top) : t.top >= s ? getDistanceBetweenPoints(n, t.top, e.left, s) : e.left - n : t.left >= o ? i <= e.top ? getDistanceBetweenPoints(t.left, i, o, e.top) : t.top >= s ? getDistanceBetweenPoints(t.left, t.top, o, s) : t.left - o : i <= e.top ? e.top - i : t.top - s;
	}
	const IS_SAFARI = !!("undefined" != typeof window && void 0 !== window.document && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
	const BOX_EDGE = {
		content: "content",
		padding: "padding",
		scrollbar: "scrollbar",
		border: "border",
		margin: "margin"
	};
	const INCLUDE_WINDOW_SCROLLBAR = {
		[BOX_EDGE.content]: !1,
		[BOX_EDGE.padding]: !1,
		[BOX_EDGE.scrollbar]: !0,
		[BOX_EDGE.border]: !0,
		[BOX_EDGE.margin]: !0
	};
	const SCROLLABLE_OVERFLOWS = new Set(["auto", "scroll"]);
	const IS_CHROMIUM = (() => {
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
	//#region ../../node_modules/mezr/dist/esm/utils/isDocument.js
	function isDocument(n) {
		return n instanceof Document;
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
	//#region ../../node_modules/mezr/dist/esm/utils/getPreciseScrollbarSize.js
	const SUBPIXEL_OFFSET = /* @__PURE__ */ new Map();
	let testStyleElement = null, testParentElement = null, testChildElement = null;
	function getSubpixelScrollbarSize(t, e) {
		const n = t.split(".");
		let l = SUBPIXEL_OFFSET.get(n[1]);
		if (void 0 === l) {
			testStyleElement || (testStyleElement = document.createElement("style")), testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t} !important;\n      }\n    `, testParentElement && testChildElement || (testParentElement = document.createElement("div"), testChildElement = document.createElement("div"), testParentElement.appendChild(testChildElement), testParentElement.id = "mezr-scrollbar-test", testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild(testStyleElement), document.body.appendChild(testParentElement);
			l = testParentElement.getBoundingClientRect().width - testChildElement.getBoundingClientRect().width - e, SUBPIXEL_OFFSET.set(n[1], l), document.body.removeChild(testParentElement), document.body.removeChild(testStyleElement);
		}
		return e + l;
	}
	function getPreciseScrollbarSize(t, e, n) {
		if (n <= 0) return 0;
		if (IS_CHROMIUM) {
			const n = getStyle(t, "::-webkit-scrollbar"), l = "x" === e ? n.height : n.width, i = parseFloat(l);
			if (!Number.isNaN(i) && !Number.isInteger(i)) return getSubpixelScrollbarSize(l, i);
		}
		return n;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getWindowWidth.js
	function getWindowWidth(e, r = !1) {
		if (r) return e.innerWidth;
		const { innerWidth: t, document: i } = e, { documentElement: n } = i, { clientWidth: c } = n;
		return t - getPreciseScrollbarSize(n, "y", t - c);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getDocumentWidth.js
	function getDocumentWidth({ documentElement: t }) {
		return Math.max(t.scrollWidth, t.clientWidth, t.getBoundingClientRect().width);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
	function isDocumentElement(e) {
		return e instanceof HTMLHtmlElement;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getElementWidth.js
	function getElementWidth(t, e = BOX_EDGE.border) {
		let { width: r } = t.getBoundingClientRect();
		if (e === BOX_EDGE.border) return r;
		const o = getStyle(t);
		return e === BOX_EDGE.margin ? (r += Math.max(0, parseFloat(o.marginLeft) || 0), r += Math.max(0, parseFloat(o.marginRight) || 0), r) : (r -= parseFloat(o.borderLeftWidth) || 0, r -= parseFloat(o.borderRightWidth) || 0, e === BOX_EDGE.scrollbar ? r : (!isDocumentElement(t) && SCROLLABLE_OVERFLOWS.has(o.overflowY) && (r -= getPreciseScrollbarSize(t, "y", Math.round(r) - t.clientWidth)), e === BOX_EDGE.padding || (r -= parseFloat(o.paddingLeft) || 0, r -= parseFloat(o.paddingRight) || 0), r));
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getWidth.js
	function getWidth(t, i = BOX_EDGE.border) {
		return isWindow(t) ? getWindowWidth(t, INCLUDE_WINDOW_SCROLLBAR[i]) : isDocument(t) ? getDocumentWidth(t) : getElementWidth(t, i);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getWindowHeight.js
	function getWindowHeight(e, r = !1) {
		if (r) return e.innerHeight;
		const { innerHeight: t, document: i } = e, { documentElement: n } = i, { clientHeight: c } = n;
		return t - getPreciseScrollbarSize(n, "x", t - c);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getDocumentHeight.js
	function getDocumentHeight({ documentElement: t }) {
		return Math.max(t.scrollHeight, t.clientHeight, t.getBoundingClientRect().height);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getElementHeight.js
	function getElementHeight(t, e = BOX_EDGE.border) {
		let { height: r } = t.getBoundingClientRect();
		if (e === BOX_EDGE.border) return r;
		const o = getStyle(t);
		return e === BOX_EDGE.margin ? (r += Math.max(0, parseFloat(o.marginTop) || 0), r += Math.max(0, parseFloat(o.marginBottom) || 0), r) : (r -= parseFloat(o.borderTopWidth) || 0, r -= parseFloat(o.borderBottomWidth) || 0, e === BOX_EDGE.scrollbar ? r : (!isDocumentElement(t) && SCROLLABLE_OVERFLOWS.has(o.overflowX) && (r -= getPreciseScrollbarSize(t, "x", Math.round(r) - t.clientHeight)), e === BOX_EDGE.padding || (r -= parseFloat(o.paddingTop) || 0, r -= parseFloat(o.paddingBottom) || 0), r));
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getHeight.js
	function getHeight(t, e = BOX_EDGE.border) {
		return isWindow(t) ? getWindowHeight(t, INCLUDE_WINDOW_SCROLLBAR[e]) : isDocument(t) ? getDocumentHeight(t) : getElementHeight(t, e);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/isRectObject.js
	function isRectObject(t) {
		return t?.constructor === Object;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getOffsetFromDocument.js
	function getOffsetFromDocument(t, o = BOX_EDGE.border) {
		const e = {
			left: 0,
			top: 0
		};
		if (isDocument(t)) return e;
		if (isWindow(t)) return e.left += t.scrollX || 0, e.top += t.scrollY || 0, e;
		const r = t.ownerDocument.defaultView;
		r && (e.left += r.scrollX || 0, e.top += r.scrollY || 0);
		const n = t.getBoundingClientRect();
		if (e.left += n.left, e.top += n.top, o === BOX_EDGE.border) return e;
		const l = getStyle(t);
		return o === BOX_EDGE.margin ? (e.left -= Math.max(0, parseFloat(l.marginLeft) || 0), e.top -= Math.max(0, parseFloat(l.marginTop) || 0), e) : (e.left += parseFloat(l.borderLeftWidth) || 0, e.top += parseFloat(l.borderTopWidth) || 0, o === BOX_EDGE.scrollbar || o === BOX_EDGE.padding || (e.left += parseFloat(l.paddingLeft) || 0, e.top += parseFloat(l.paddingTop) || 0), e);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getOffset.js
	function getOffset(t, e) {
		const o = isRectObject(t) ? {
			left: t.left,
			top: t.top
		} : Array.isArray(t) ? getOffsetFromDocument(...t) : getOffsetFromDocument(t);
		if (e && !isDocument(e)) {
			const t = isRectObject(e) ? e : Array.isArray(e) ? getOffsetFromDocument(e[0], e[1]) : getOffsetFromDocument(e);
			o.left -= t.left, o.top -= t.top;
		}
		return o;
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getRect.js
	function getRect(t, e) {
		let i = 0, g = 0;
		isRectObject(t) ? (i = t.width, g = t.height) : Array.isArray(t) ? (i = getWidth(...t), g = getHeight(...t)) : (i = getWidth(t), g = getHeight(t));
		const r = getOffset(t, e);
		return {
			width: i,
			height: g,
			...r,
			right: r.left + i,
			bottom: r.top + g
		};
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/utils/getNormalizedRect.js
	function getNormalizedRect(t) {
		return isRectObject(t) ? t : getRect(t);
	}
	//#endregion
	//#region ../../node_modules/mezr/dist/esm/getDistance.js
	function getDistance(e, t) {
		return getDistanceBetweenRects(getNormalizedRect(e), getNormalizedRect(t));
	}
	//#endregion
	//#region ../dragdoll/dist/auto-scroll-BACUol2g.js
	const s$3 = e$4(), c$3 = e$4();
	function l$1(e, t) {
		return getDistance(e$4(e, s$3), e$4(t, c$3));
	}
	function u$1(e) {
		return t$4(e) || e === document.documentElement || e === document.body ? window : e;
	}
	function d$1(e) {
		return t$4(e) ? e.scrollX : e.scrollLeft;
	}
	function f$1(e) {
		return t$4(e) && (e = document.documentElement), e.scrollWidth - e.clientWidth;
	}
	function p$1(e) {
		return t$4(e) ? e.scrollY : e.scrollTop;
	}
	function m$1(e) {
		return t$4(e) && (e = document.documentElement), e.scrollHeight - e.clientHeight;
	}
	function h$1(e, t) {
		return !(e.x + e.width <= t.x || t.x + t.width <= e.x || e.y + e.height <= t.y || t.y + t.height <= e.y);
	}
	var g$1 = class {
		_batchSize;
		_maxSize;
		_minSize;
		_shrinkThreshold;
		_data;
		_index;
		_getItem;
		_onRelease;
		constructor(e, { batchSize: t = 100, minBatchCount: n = 0, maxBatchCount: r = 2 ** 53 - 1, initialBatchCount: i = 0, shrinkThreshold: a = 2, onRelease: o } = {}) {
			this._batchSize = Math.floor(Math.max(t, 1)), this._minSize = Math.floor(Math.max(n, 0)) * this._batchSize, this._maxSize = Math.floor(Math.min(Math.max(r * this._batchSize, this._batchSize), 2 ** 53 - 1)), this._shrinkThreshold = Math.floor(Math.max(a, 1) * this._batchSize), this._data = Array(Math.floor(Math.max(Math.max(i, n) * this._batchSize, 0))), this._index = 0, this._getItem = e, this._onRelease = o;
		}
		get(...e) {
			if (this._index > 0) return this._getItem(this._data[--this._index], ...e);
			if (this._index === 0) {
				let e = this._data.length, t = Math.min(this._batchSize, this._maxSize - e);
				t > 0 && (this._data.length = e + t);
			}
			return this._getItem(void 0, ...e);
		}
		release(e) {
			if (this._index < this._maxSize && (this._onRelease && this._onRelease(e), this._data[this._index++] = e, this._index >= this._shrinkThreshold)) {
				let e = this._data.length - this._batchSize;
				e >= this._minSize && (this._data.length = e, this._index -= this._batchSize);
			}
		}
		destroy() {
			this._data.length = 0, this._index = 0;
		}
	};
	const _$1 = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	}, v$1 = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	}, y$1 = {
		direction: `none`,
		threshold: 0,
		distance: 0,
		value: 0,
		maxValue: 0,
		duration: 0,
		speed: 0,
		deltaTime: 0,
		isEnding: !1
	}, b$1 = {
		x: 1,
		y: 2
	}, x$1 = {
		forward: 4,
		reverse: 8
	}, S$1 = {
		none: 0,
		left: b$1.x | x$1.reverse,
		right: b$1.x | x$1.forward
	}, C$1 = {
		none: 0,
		up: b$1.y | x$1.reverse,
		down: b$1.y | x$1.forward
	}, w$1 = {
		...S$1,
		...C$1
	};
	function T$1(e) {
		switch (e) {
			case S$1.none:
			case C$1.none: return `none`;
			case S$1.left: return `left`;
			case S$1.right: return `right`;
			case C$1.up: return `up`;
			case C$1.down: return `down`;
			default: throw Error(`Unknown direction value: ${e}`);
		}
	}
	function E$1(e, t, n) {
		let { left: r = 0, right: i = 0, top: a = 0, bottom: o = 0 } = t;
		return r = Math.max(0, r), i = Math.max(0, i), a = Math.max(0, a), o = Math.max(0, o), n.width = e.width + r + i, n.height = e.height + a + o, n.x = e.x - r, n.y = e.y - a, n;
	}
	function D$1(e, t) {
		return Math.ceil(e) >= Math.floor(t);
	}
	function O$1(e, t) {
		return Math.min(t / 2, e);
	}
	function k$1(e, t, n, r) {
		return Math.max(0, n + e * 2 + r * t - r) / 2;
	}
	var A$1 = class {
		positionX;
		positionY;
		directionX;
		directionY;
		overlapCheckRequestTime;
		constructor() {
			this.positionX = 0, this.positionY = 0, this.directionX = w$1.none, this.directionY = w$1.none, this.overlapCheckRequestTime = 0;
		}
	}, j$1 = class {
		element;
		requestX;
		requestY;
		scrollLeft;
		scrollTop;
		constructor() {
			this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
		}
		reset() {
			this.requestX && (this.requestX.action = null), this.requestY && (this.requestY.action = null), this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
		}
		addRequest(e) {
			b$1.x & e.direction ? (this.requestX && this.removeRequest(this.requestX), this.requestX = e) : (this.requestY && this.removeRequest(this.requestY), this.requestY = e), e.action = this;
		}
		removeRequest(e) {
			this.requestX === e ? (this.requestX = null, e.action = null) : this.requestY === e && (this.requestY = null, e.action = null);
		}
		computeScrollValues() {
			this.element && (this.scrollLeft = this.requestX ? this.requestX.value : d$1(this.element), this.scrollTop = this.requestY ? this.requestY.value : p$1(this.element));
		}
		scroll() {
			this.element && (this.element.scrollTo ? this.element.scrollTo(this.scrollLeft, this.scrollTop) : (this.element.scrollLeft = this.scrollLeft, this.element.scrollTop = this.scrollTop));
		}
	}, M$1 = class {
		item;
		element;
		isActive;
		isEnding;
		direction;
		value;
		maxValue;
		threshold;
		distance;
		deltaTime;
		speed;
		duration;
		action;
		constructor() {
			this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
		}
		reset() {
			this.isActive && this.onStop(), this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
		}
		hasReachedEnd() {
			return x$1.forward & this.direction ? D$1(this.value, this.maxValue) : this.value <= 0;
		}
		computeCurrentScrollValue() {
			return this.element ? this.value === this.value ? Math.max(0, Math.min(this.value, this.maxValue)) : b$1.x & this.direction ? d$1(this.element) : p$1(this.element) : 0;
		}
		computeNextScrollValue() {
			let e = this.speed * (this.deltaTime / 1e3), t = x$1.forward & this.direction ? this.value + e : this.value - e;
			return Math.max(0, Math.min(t, this.maxValue));
		}
		computeSpeed() {
			if (!this.item || !this.element) return 0;
			let { speed: e } = this.item;
			return typeof e == `function` ? (y$1.direction = T$1(this.direction), y$1.threshold = this.threshold, y$1.distance = this.distance, y$1.value = this.value, y$1.maxValue = this.maxValue, y$1.duration = this.duration, y$1.speed = this.speed, y$1.deltaTime = this.deltaTime, y$1.isEnding = this.isEnding, e(this.element, y$1)) : e;
		}
		tick(e) {
			return this.isActive || (this.isActive = !0, this.onStart()), this.deltaTime = e, this.value = this.computeCurrentScrollValue(), this.speed = this.computeSpeed(), this.value = this.computeNextScrollValue(), this.duration += e, this.value;
		}
		onStart() {
			if (!this.item || !this.element) return;
			let { onStart: e } = this.item;
			typeof e == `function` && e(this.element, T$1(this.direction));
		}
		onStop() {
			if (!this.item || !this.element) return;
			let { onStop: e } = this.item;
			typeof e == `function` && e(this.element, T$1(this.direction));
		}
	};
	function N$1(e = 500, t = .5, n = .25) {
		let r = e * (t > 0 ? 1 / t : Infinity), i = e * (n > 0 ? 1 / n : Infinity);
		return function(t, n) {
			let a = 0;
			if (!n.isEnding) if (n.threshold > 0) {
				let t = n.threshold - Math.max(0, n.distance);
				a = e / n.threshold * t;
			} else a = e;
			let o = n.speed;
			if (o === a) return a;
			if (o < a) {
				let e = o + r * (n.deltaTime / 1e3);
				return Math.min(a, e);
			} else {
				let e = o - i * (n.deltaTime / 1e3);
				return Math.max(a, e);
			}
		};
	}
	var P$1 = class {
		items;
		settings;
		_isDestroyed;
		_isTicking;
		_tickTime;
		_tickDeltaTime;
		_itemData;
		_actions;
		_requests;
		_requestPool;
		_actionPool;
		constructor(e = {}) {
			let { overlapCheckInterval: t = 150 } = e;
			this.items = [], this.settings = { overlapCheckInterval: t }, this._actions = [], this._isDestroyed = !1, this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, this._requests = {
				[b$1.x]: /* @__PURE__ */ new Map(),
				[b$1.y]: /* @__PURE__ */ new Map()
			}, this._itemData = /* @__PURE__ */ new Map(), this._requestPool = new g$1((e) => e || new M$1(), {
				initialBatchCount: 1,
				minBatchCount: 1,
				onRelease: (e) => e.reset()
			}), this._actionPool = new g$1((e) => e || new j$1(), {
				batchSize: 10,
				initialBatchCount: 1,
				minBatchCount: 1,
				onRelease: (e) => e.reset()
			}), this._frameRead = this._frameRead.bind(this), this._frameWrite = this._frameWrite.bind(this);
		}
		_frameRead(e) {
			this._isDestroyed || (e && this._tickTime ? (this._tickDeltaTime = e - this._tickTime, this._tickTime = e, this._updateItems(), this._updateRequests(), this._updateActions()) : (this._tickTime = e, this._tickDeltaTime = 0));
		}
		_frameWrite() {
			this._isDestroyed || this._applyActions();
		}
		_startTicking() {
			this._isTicking || (this._isTicking = !0, r$5.on(n$6.read, this._frameRead, this._frameRead), r$5.on(n$6.write, this._frameWrite, this._frameWrite));
		}
		_stopTicking() {
			this._isTicking && (this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, r$5.off(n$6.read, this._frameRead), r$5.off(n$6.write, this._frameWrite));
		}
		_requestItemScroll(e, t, n, r, i, a, o) {
			let s = this._requests[t], c = s.get(e);
			c ? (c.element !== n || c.direction !== r) && c.reset() : (c = this._requestPool.get(), s.set(e, c)), c.item = e, c.element = n, c.direction = r, c.threshold = i, c.distance = a, c.maxValue = o;
		}
		_cancelItemScroll(e, t) {
			let n = this._requests[t], r = n.get(e);
			r && (r.action && r.action.removeRequest(r), this._requestPool.release(r), n.delete(e));
		}
		_checkItemOverlap(e, t, n) {
			let { inertAreaSize: i, targets: o, clientRect: s } = e;
			if (!o.length) {
				t && this._cancelItemScroll(e, b$1.x), n && this._cancelItemScroll(e, b$1.y);
				return;
			}
			let c = this._itemData.get(e), g = c?.directionX, y = c?.directionY;
			if (!g && !y) {
				t && this._cancelItemScroll(e, b$1.x), n && this._cancelItemScroll(e, b$1.y);
				return;
			}
			let x = null, S = -Infinity, T = 0, A = -Infinity, j = w$1.none, M = 0, N = 0, P = null, F = -Infinity, I = 0, L = -Infinity, R = w$1.none, z = 0, B = 0, V = 0;
			for (; V < o.length; V++) {
				let e = o[V], c = typeof e.threshold == `number` ? e.threshold : 50, b = !!(t && g && e.axis !== `y`), H = !!(n && y && e.axis !== `x`), U = e.priority || 0;
				if ((!b || U < S) && (!H || U < F)) continue;
				let W = u$1(e.element || e), G = b ? f$1(W) : -1, K = H ? m$1(W) : -1;
				if (G <= 0 && K <= 0) continue;
				let q = r$4(W, v$1), J = n$5(s, q) || -Infinity;
				if (J === -Infinity) if (e.padding && h$1(s, E$1(q, e.padding, _$1))) J = -(l$1(s, q) || 0);
				else continue;
				if (b && U >= S && G > 0 && (U > S || J > A)) {
					let e = 0, t = w$1.none, n = O$1(c, q.width), r = k$1(n, i, s.width, q.width);
					g === w$1.right ? (e = q.x + q.width + r - (s.x + s.width), e <= n && !D$1(d$1(W), G) && (t = w$1.right)) : g === w$1.left && (e = s.x - (q.x - r), e <= n && d$1(W) > 0 && (t = w$1.left)), t && (x = W, S = U, T = n, A = J, j = t, M = e, N = G);
				}
				if (H && U >= F && K > 0 && (U > F || J > L)) {
					let e = 0, t = C$1.none, n = O$1(c, q.height), r = k$1(n, i, s.height, q.height);
					y === w$1.down ? (e = q.y + q.height + r - (s.y + s.height), e <= n && !D$1(p$1(W), K) && (t = w$1.down)) : y === w$1.up && (e = s.y - (q.y - r), e <= n && p$1(W) > 0 && (t = w$1.up)), t && (P = W, F = U, I = n, L = J, R = t, z = e, B = K);
				}
			}
			t && (x && j ? this._requestItemScroll(e, b$1.x, x, j, T, M, N) : this._cancelItemScroll(e, b$1.x)), n && (P && R ? this._requestItemScroll(e, b$1.y, P, R, I, z, B) : this._cancelItemScroll(e, b$1.y));
		}
		_updateScrollRequest(e) {
			let { inertAreaSize: t, smoothStop: n, targets: i, clientRect: o } = e.item, s = null, c = 0;
			for (; c < i.length; c++) {
				let n = i[c], l = u$1(n.element || n);
				if (l !== e.element) continue;
				let g = !!(b$1.x & e.direction);
				if (g) {
					if (n.axis === `y`) continue;
				} else if (n.axis === `x`) continue;
				let y = g ? f$1(l) : m$1(l);
				if (y <= 0) break;
				let S = r$4(l, v$1);
				if ((n$5(o, S) || -Infinity) === -Infinity) {
					let e = n.scrollPadding || n.padding;
					if (!(e && h$1(o, E$1(S, e, _$1)))) break;
				}
				let C = O$1(typeof n.threshold == `number` ? n.threshold : 50, g ? S.width : S.height), T = k$1(C, t, g ? o.width : o.height, g ? S.width : S.height), A = 0;
				if (A = e.direction === w$1.left ? o.x - (S.x - T) : e.direction === w$1.right ? S.x + S.width + T - (o.x + o.width) : e.direction === w$1.up ? o.y - (S.y - T) : S.y + S.height + T - (o.y + o.height), A > C) break;
				let j = g ? d$1(l) : p$1(l);
				if (s = x$1.forward & e.direction ? D$1(j, y) : j <= 0, s) break;
				return e.maxValue = y, e.threshold = C, e.distance = A, e.isEnding = !1, !0;
			}
			return n === !0 && e.speed > 0 ? (s === null && (s = e.hasReachedEnd()), e.isEnding = !s) : e.isEnding = !1, e.isEnding;
		}
		_updateItems() {
			for (let e = 0; e < this.items.length; e++) {
				let t = this.items[e], n = this._itemData.get(t), { x: r, y: i } = t.position, a = n.positionX, o = n.positionY;
				r === a && i === o || (n.directionX = r > a ? w$1.right : r < a ? w$1.left : n.directionX, n.directionY = i > o ? w$1.down : i < o ? w$1.up : n.directionY, n.positionX = r, n.positionY = i, n.overlapCheckRequestTime === 0 && (n.overlapCheckRequestTime = this._tickTime));
			}
		}
		_updateRequests() {
			let e = this.items, t = this._requests[b$1.x], n = this._requests[b$1.y], r = 0;
			for (; r < e.length; r++) {
				let i = e[r], a = this._itemData.get(i), o = a.overlapCheckRequestTime, s = o > 0 && this._tickTime - o > this.settings.overlapCheckInterval, c = !0, l = t.get(i);
				l && l.isActive && (c = !this._updateScrollRequest(l), c && (s = !0, this._cancelItemScroll(i, b$1.x)));
				let u = !0, d = n.get(i);
				d && d.isActive && (u = !this._updateScrollRequest(d), u && (s = !0, this._cancelItemScroll(i, b$1.y))), s && (a.overlapCheckRequestTime = 0, this._checkItemOverlap(i, c, u));
			}
		}
		_requestAction(e, t) {
			let n = t === b$1.x, r = null, i = 0;
			for (; i < this._actions.length; i++) {
				if (r = this._actions[i], e.element !== r.element) {
					r = null;
					continue;
				}
				if (n ? r.requestX : r.requestY) {
					this._cancelItemScroll(e.item, t);
					return;
				}
				break;
			}
			r ||= this._actionPool.get(), r.element = e.element, r.addRequest(e), e.tick(this._tickDeltaTime), this._actions.push(r);
		}
		_updateActions() {
			let e = 0;
			for (e = 0; e < this.items.length; e++) {
				let t = this.items[e], n = this._requests[b$1.x].get(t), r = this._requests[b$1.y].get(t);
				n && this._requestAction(n, b$1.x), r && this._requestAction(r, b$1.y);
			}
			for (e = 0; e < this._actions.length; e++) this._actions[e].computeScrollValues();
		}
		_applyActions() {
			if (!this._actions.length) return;
			let e = 0;
			for (e = 0; e < this._actions.length; e++) this._actions[e].scroll(), this._actionPool.release(this._actions[e]);
			this._actions.length = 0;
		}
		addItem(e) {
			if (this._isDestroyed || this._itemData.has(e)) return;
			let { x: t, y: n } = e.position, r = new A$1();
			r.positionX = t, r.positionY = n, r.directionX = w$1.none, r.directionY = w$1.none, r.overlapCheckRequestTime = this._tickTime, this._itemData.set(e, r), this.items.push(e), this._isTicking || this._startTicking();
		}
		removeItem(e) {
			if (this._isDestroyed) return;
			let t = this.items.indexOf(e);
			t !== -1 && (this._requests[b$1.x].get(e) && (this._cancelItemScroll(e, b$1.x), this._requests[b$1.x].delete(e)), this._requests[b$1.y].get(e) && (this._cancelItemScroll(e, b$1.y), this._requests[b$1.y].delete(e)), this._itemData.delete(e), this.items.splice(t, 1), this._isTicking && !this.items.length && this._stopTicking());
		}
		isDestroyed() {
			return this._isDestroyed;
		}
		isItemScrollingX(e) {
			return !!this._requests[b$1.x].get(e)?.isActive;
		}
		isItemScrollingY(e) {
			return !!this._requests[b$1.y].get(e)?.isActive;
		}
		isItemScrolling(e) {
			return this.isItemScrollingX(e) || this.isItemScrollingY(e);
		}
		updateSettings(e = {}) {
			let { overlapCheckInterval: t = this.settings.overlapCheckInterval } = e;
			this.settings.overlapCheckInterval = t;
		}
		destroy() {
			this._isDestroyed ||= (this.items.forEach((e) => this.removeItem(e)), this._requestPool.destroy(), this._actionPool.destroy(), this._actions.length = 0, !0);
		}
	};
	//#endregion
	//#region ../dragdoll/dist/constants-Civq9RS1.js
	const e$1 = typeof window < `u` && window.document !== void 0, t$3 = e$1 && `ontouchstart` in window, n$3 = e$1 && !!window.PointerEvent;
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
	function i$4(e, t) {
		if (`pointerId` in e) return e.pointerId === t ? e : null;
		if (`changedTouches` in e) {
			let n = 0;
			for (; n < e.changedTouches.length; n++) if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
			return null;
		}
		return e;
	}
	function a$3(e) {
		return `pointerId` in e ? e.pointerId : `changedTouches` in e ? e.changedTouches[0] ? e.changedTouches[0].identifier : null : -1;
	}
	function o$2(e) {
		return `pointerType` in e ? e.pointerType : `touches` in e ? `touch` : `mouse`;
	}
	function s$2(e = {}) {
		let { capture: t = !0, passive: n = !0 } = e;
		return {
			capture: t,
			passive: n
		};
	}
	function c$2(n) {
		return n === `auto` || n === void 0 ? n$3 ? `pointer` : t$3 ? `touch` : `mouse` : n;
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
			this.element = e, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._cancelOnVisibilityChange = o ?? !0, this._cancelOnEscape = d ?? !0, this._preventNativeDrag = f ?? !0, this._preventContextMenu = p ?? !1, this._startPredicate = a, this._listenerOptions = s$2(n), this._sourceEvents = c$2(i), this._emitter = new t$7(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), o && document.addEventListener(`visibilitychange`, this._visibilityChangeHandler);
		}
		_getTrackedPointerEventData(e) {
			return this.drag ? i$4(e, this.drag.pointerId) : null;
		}
		_onStart(e$8) {
			if (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e$8)) return;
			let t = a$3(e$8);
			if (t === null) return;
			let r = i$4(e$8, t);
			if (r === null) return;
			let s = {
				pointerId: t,
				pointerType: o$2(e$8),
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
				srcEvent: e$8,
				target: r.target
			}, this._emitter.emit(this._eventData.type, this._eventData), this.drag && this._bindWindowListeners();
		}
		_onMove(e$9) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$9);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.Move, r.srcEvent = e$9, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r);
		}
		_onCancel(e$10) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$10);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.Cancel, r.srcEvent = e$10, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r), this._resetDrag();
		}
		_onEnd(e$11) {
			let t = this.drag, r = this._eventData;
			if (!t || !r) return;
			let i = this._getTrackedPointerEventData(e$11);
			if (!i) return;
			let a = i.clientX, o = i.clientY;
			t.deltaX = a - t.x, t.deltaY = o - t.y, t.x = a, t.y = o, r.type = e.End, r.srcEvent = e$11, r.target = i.target, r.x = a, r.y = o, r.deltaX = t.deltaX, r.deltaY = t.deltaY, this._emitter.emit(r.type, r), this._resetDrag();
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
			let { listenerOptions: t, sourceEvents: n, startPredicate: r, cancelOnVisibilityChange: i, cancelOnEscape: a, preventNativeDrag: o, preventContextMenu: u } = e, d = c$2(n), f = s$2(t);
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
	function t$2(t) {
		let n = t$5(t);
		if (n.boxSizing === `border-box`) return parseFloat(n.height) || 0;
		let r = parseFloat(n.height) || 0, i = parseFloat(n.borderTopWidth) || 0, a = parseFloat(n.borderBottomWidth) || 0, o = parseFloat(n.paddingTop) || 0, s = parseFloat(n.paddingBottom) || 0, c = i + a, l = r + (o + s) + c;
		if (!(t instanceof HTMLElement)) return l;
		let u = t.offsetHeight, d = u - t.clientHeight, f = Math.max(0, Number.isInteger(window.devicePixelRatio) ? d - Math.round(c) : d - c), p = u - l, m = Math.abs(p), h = Math.abs(p - f);
		return f > 0 && h < m ? l + 2 * p : l + f;
	}
	function n$2(t) {
		let n = t$5(t);
		if (n.boxSizing === `border-box`) return parseFloat(n.width) || 0;
		let r = parseFloat(n.width) || 0, i = parseFloat(n.borderLeftWidth) || 0, a = parseFloat(n.borderRightWidth) || 0, o = parseFloat(n.paddingLeft) || 0, s = parseFloat(n.paddingRight) || 0, c = i + a, l = r + (o + s) + c;
		if (!(t instanceof HTMLElement)) return l;
		let u = t.offsetWidth, d = u - t.clientWidth, f = Math.max(0, Number.isInteger(window.devicePixelRatio) ? d - Math.round(c) : d - c), p = u - l, m = Math.abs(p), h = Math.abs(p - f);
		return f > 0 && h < m ? l + 2 * p : l + f;
	}
	function r$3(r, i = !1) {
		let { translate: a, rotate: o, scale: s, transform: c } = t$5(r), l = ``;
		if (a && a !== `none`) {
			let [e = `0px`, i = `0px`, o] = a.split(` `);
			e.includes(`%`) && (e = `${parseFloat(e) / 100 * n$2(r)}px`), i.includes(`%`) && (i = `${parseFloat(i) / 100 * t$2(r)}px`), o ? l += `translate3d(${e},${i},${o})` : l += `translate(${e},${i})`;
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
	function r$2(e) {
		return e.setMatrixValue(`scale(1)`);
	}
	function i$3(e, t = {
		x: 0,
		y: 0,
		z: 0
	}) {
		let n = e.split(` `), r = ``, i = ``, a = ``;
		return n.length === 1 ? r = i = n[0] : n.length === 2 ? [r, i] = n : [r, i, a] = n, t.x = parseFloat(r) || 0, t.y = parseFloat(i) || 0, t.z = parseFloat(a) || 0, t;
	}
	const a$2 = e$1 ? new DOMMatrix() : null, o$1 = e$1 ? new DOMMatrix() : null, s$1 = {
		x: 0,
		y: 0,
		z: 0
	};
	function c$1(t, c = new DOMMatrix()) {
		let l = t;
		for (r$2(c); l;) {
			let t = r$3(l);
			if (t && (a$2.setMatrixValue(t), !a$2.isIdentity)) {
				let { transformOrigin: t } = t$5(l);
				i$3(t, s$1);
				let { x: n, y: u, z: d } = s$1;
				d === 0 ? (a$2.translateSelf(-n, -u), r$2(o$1).translateSelf(n, u)) : (a$2.translateSelf(-n, -u, -d), r$2(o$1).translateSelf(n, u, d)), a$2.preMultiplySelf(o$1), c.preMultiplySelf(a$2);
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
		let { x: r, y: i } = e.getBoundingClientRect(), a = t$5(e);
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
			let i = t$5(e), a = e.getBoundingClientRect(), s = r$3(e, !0);
			this.data = {}, this.element = e, this.elementTransformOrigin = i$3(i.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s + i.transform), this.elementOffsetMatrix = new DOMMatrix(s).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
					c$1(e, n), r$2(r).multiplySelf(n).invertSelf(), this._matrixCache.set(e, t);
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
			r$2(k), _ && (g === 0 ? k.translateSelf(-m, -h) : k.translateSelf(-m, -h, -g)), n ? i.isIdentity || k.multiplySelf(i) : o.isIdentity || k.multiplySelf(o), r$2(A).translateSelf(v, y), k.multiplySelf(A), r.isIdentity || k.multiplySelf(r), _ && (r$2(A).translateSelf(m, h, g), k.multiplySelf(A)), d.isIdentity || k.multiplySelf(d), p.isIdentity || k.preMultiplySelf(p), e.element.style.transform = `${k}`;
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
			this.id = n, this._sensors = e, this.settings = this._parseSettings(r), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new t$7(), this._startPhase = j.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._modifierData = {
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
		_bindSensor(e$6) {
			this._sensorData.set(e$6, {
				predicateState: M.Pending,
				predicateEvent: null,
				onMove: (t) => this._onMove(t, e$6),
				onEnd: (t) => this._onEnd(t, e$6)
			});
			let { onMove: t, onEnd: n } = this._sensorData.get(e$6);
			e$6.on(e.Start, t, t), e$6.on(e.Move, t, t), e$6.on(e.Cancel, n, n), e$6.on(e.End, n, n);
		}
		_unbindSensor(e$7) {
			let t = this._sensorData.get(e$7);
			if (!t) return;
			let { onMove: n, onEnd: r } = t;
			e$7.off(e.Start, n), e$7.off(e.Move, n), e$7.off(e.Cancel, r), e$7.off(e.End, r), this._sensorData.delete(e$7);
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
					this.drag && (Object.assign(this.drag.moveEvent, n), this.settings.sensorProcessingMode === P.Immediate ? (this._prepareMove(), this._applyMove()) : (r$5.once(n$6.read, this._prepareMove, this._moveId), r$5.once(n$6.write, this._applyMove, this._moveId)));
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
			}), this.settings.sensorProcessingMode === P.Immediate ? (this._prepareStart(), this._applyStart()) : (r$5.once(n$6.read, this._prepareStart, this._startId), r$5.once(n$6.write, this._applyStart, this._startId)));
		}
		rejectStartPredicate(e) {
			let t = this._sensorData.get(e);
			t?.predicateState === M.Pending && (t.predicateState = M.Rejected, t.predicateEvent = null);
		}
		stop() {
			let n = this.drag;
			if (!n || n.isEnded) return;
			if (this._startPhase === j.Prepare || this._startPhase === j.Apply) throw Error(`Cannot stop drag start process at this point`);
			if (n.isEnded = !0, this._prepareStart(), this._applyStart(), this._startPhase = j.None, r$5.off(n$6.read, this._startId), r$5.off(n$6.write, this._startId), r$5.off(n$6.read, this._moveId), r$5.off(n$6.write, this._moveId), r$5.off(n$6.read, this._alignId), r$5.off(n$6.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, D), this._selectionChangeHandler &&= ((n.items[0]?.element?.ownerDocument ?? document).removeEventListener(`selectionchange`, this._selectionChangeHandler), null), this._pointerCaptureTarget && this._pointerCaptureId !== null) {
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
			!this.drag || this.drag.isEnded || (n || this.settings.sensorProcessingMode === P.Immediate ? (this._prepareAlign(), this._applyAlign()) : (r$5.once(n$6.read, this._prepareAlign, this._alignId), r$5.once(n$6.write, this._applyAlign, this._alignId)));
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
	//#region ../dragdoll/dist/singletons/auto-scroll.js
	const t$1 = new P$1();
	//#endregion
	//#region ../dragdoll/dist/draggable/plugins/auto-scroll.js
	const r$1 = {
		x: 0,
		y: 0
	}, i$2 = {
		width: 0,
		height: 0,
		x: 0,
		y: 0
	};
	function a$1() {
		return {
			targets: [],
			inertAreaSize: .2,
			speed: N$1(),
			smoothStop: !1,
			getPosition: (e) => {
				let { drag: t } = e, n = t?.items[0];
				if (n) return n.position;
				let i = t && (t.moveEvent || t.startEvent);
				return r$1.x = i ? i.x : 0, r$1.y = i ? i.y : 0, r$1;
			},
			getClientRect: (e) => {
				let { drag: t } = e, n = e.getClientRect();
				if (n) return n;
				let r = t && (t.moveEvent || t.startEvent);
				return i$2.width = r ? 50 : 0, i$2.height = r ? 50 : 0, i$2.x = r ? r.x - 25 : 0, i$2.y = r ? r.y - 25 : 0, i$2;
			},
			onStart: null,
			onStop: null
		};
	}
	var o = class {
		_draggableAutoScroll;
		_draggable;
		_position;
		_clientRect;
		constructor(e, t) {
			this._draggableAutoScroll = e, this._draggable = t, this._position = {
				x: 0,
				y: 0
			}, this._clientRect = {
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
			let { targets: e } = this._getSettings();
			return typeof e == `function` && (e = e(this._draggable)), e;
		}
		get position() {
			let e = this._position, { getPosition: t } = this._getSettings();
			return typeof t == `function` ? Object.assign(e, t(this._draggable)) : (e.x = 0, e.y = 0), e;
		}
		get clientRect() {
			let e = this._clientRect, { getClientRect: t } = this._getSettings();
			return typeof t == `function` ? Object.assign(e, t(this._draggable)) : (e.width = 0, e.height = 0, e.x = 0, e.y = 0), e;
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
	}, s = class {
		name;
		version;
		settings;
		_autoScrollProxy;
		constructor(e, r = {}) {
			this.name = `autoscroll`, this.version = `0.0.3`, this.settings = this._parseSettings(r), this._autoScrollProxy = null, e.on(I.Start, () => {
				this._autoScrollProxy || (this._autoScrollProxy = new o(this, e), t$1.addItem(this._autoScrollProxy));
			}), e.on(I.End, () => {
				this._autoScrollProxy &&= (t$1.removeItem(this._autoScrollProxy), null);
			});
		}
		_parseSettings(e, t = a$1()) {
			let { targets: n = t.targets, inertAreaSize: r = t.inertAreaSize, speed: i = t.speed, smoothStop: o = t.smoothStop, getPosition: s = t.getPosition, getClientRect: c = t.getClientRect, onStart: l = t.onStart, onStop: u = t.onStop } = e || {};
			return {
				targets: n,
				inertAreaSize: r,
				speed: i,
				smoothStop: o,
				getPosition: s,
				getClientRect: c,
				onStart: l,
				onStop: u
			};
		}
		updateSettings(e = {}) {
			this.settings = this._parseSettings(e, this.settings);
		}
	};
	function c(e) {
		return (t) => {
			let n = new s(t, e), r = t;
			return r.plugins[n.name] = n, r;
		};
	}
	//#endregion
	//#region ../dragdoll/dist/sensors/base.js
	var n$1 = class {
		drag;
		isDestroyed;
		_emitter;
		constructor() {
			this.drag = null, this.isDestroyed = !1, this._emitter = new t$7();
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
			this.isDestroyed || this.drag || (super._start(n), r$5.on(n$6.read, this._tick, this._tick));
		}
		_end(n) {
			this.drag && (r$5.off(n$6.read, this._tick), super._end(n));
		}
		_cancel(n) {
			this.drag && (r$5.off(n$6.read, this._tick), super._cancel(n));
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
	//#region ../dragdoll/dist/utils/get-local-offset.js
	function t(t, n, r, i) {
		let a = t.parentElement, o = i || {
			x: 0,
			y: 0
		};
		if (!a) {
			let e = t.getBoundingClientRect();
			return o.x = n - e.left, o.y = r - e.top, o;
		}
		let s = c$1(a), c = s.m11, l = s.m12, u = s.m21, d = s.m22, f = t.getBoundingClientRect(), p = n - f.left, m = r - f.top, h = c * d - l * u;
		if (Math.abs(h) < 1e-10) return o.x = p, o.y = m, o;
		let g = 1 / h;
		return o.x = (d * p - u * m) * g, o.y = (-l * p + c * m) * g, o;
	}
	//#endregion
	//#region examples/core/012-draggable-drag-preview/index.ts
	const scrollContainer = document.querySelector(".transform-inner");
	const cards = document.querySelectorAll(".card.draggable");
	let zIndex = 0;
	cards.forEach((card) => {
		new R([new d(card), new a(card)], {
			elements: () => {
				const clone = card.cloneNode(true);
				clone.style.pointerEvents = "none";
				clone.style.contain = "layout";
				clone.classList.add("dragging");
				const clonePos = getComputedStyle(clone).position;
				if (clonePos === "absolute" || clonePos === "fixed") {
					card.parentElement.appendChild(clone);
					return [clone];
				}
				clone.style.position = "absolute";
				clone.style.left = `0px`;
				clone.style.top = `0px`;
				clone.style.margin = "0";
				card.parentElement.appendChild(clone);
				const cardRect = card.getBoundingClientRect();
				const cloneOffset = t(clone, cardRect.x, cardRect.y);
				clone.style.left = `${cloneOffset.x}px`;
				clone.style.top = `${cloneOffset.y}px`;
				return [clone];
			},
			container: () => document.body,
			onStart: () => {
				card.classList.add("dragging");
			},
			onEnd: (drag) => {
				const dragItem = drag.items[0];
				const offset = t(card, dragItem.clientRect.x, dragItem.clientRect.y);
				const parts = (getComputedStyle(card).translate || "").split(" ");
				const x = (parseFloat(parts[0]) || 0) + offset.x;
				const y = (parseFloat(parts[1]) || 0) + offset.y;
				card.style.translate = `${x}px ${y}px`;
				card.style.zIndex = String(++zIndex);
				dragItem.element.remove();
				card.classList.remove("dragging");
			}
		}).use(c({ targets: () => [{
			element: scrollContainer,
			axis: "y",
			padding: {
				top: Infinity,
				bottom: Infinity
			}
		}] }));
	});
	//#endregion
});
