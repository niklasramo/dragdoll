(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region ../../node_modules/eventti/dist/index.js
var E$2 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$4, v = class {
	constructor(t$6 = {}) {
		this.dedupe = t$6.dedupe || E$2.ADD, this.getId = t$6.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$6) {
		let n$7 = this._events.get(t$6);
		return n$7 ? n$7.l || (n$7.l = [...n$7.m.values()]) : null;
	}
	on(t$6, n$7, e$6) {
		let i$5 = this._events, s$6 = i$5.get(t$6);
		s$6 || (s$6 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$5.set(t$6, s$6));
		let o$4 = s$6.m;
		if (e$6 = e$6 === r$4 ? this.getId(n$7) : e$6, o$4.has(e$6)) switch (this.dedupe) {
			case E$2.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$2.IGNORE: return e$6;
			case E$2.UPDATE:
				s$6.l = null;
				break;
			default: o$4.delete(e$6), s$6.l = null;
		}
		return o$4.set(e$6, n$7), s$6.l?.push(n$7), e$6;
	}
	once(t$6, n$7, e$6) {
		let i$5 = 0;
		return e$6 = e$6 === r$4 ? this.getId(n$7) : e$6, this.on(t$6, (...s$6) => {
			i$5 || (i$5 = 1, this.off(t$6, e$6), n$7(...s$6));
		}, e$6);
	}
	off(t$6, n$7) {
		if (t$6 === r$4) {
			this._events.clear();
			return;
		}
		if (n$7 === r$4) {
			this._events.delete(t$6);
			return;
		}
		let e$6 = this._events.get(t$6);
		e$6?.m.delete(n$7) && (e$6.l = null, e$6.m.size || this._events.delete(t$6));
	}
	emit(t$6, ...n$7) {
		let e$6 = this._getListeners(t$6);
		if (e$6) {
			let i$5 = e$6.length, s$6 = 0;
			if (n$7.length) for (; s$6 < i$5; s$6++) e$6[s$6](...n$7);
			else for (; s$6 < i$5; s$6++) e$6[s$6]();
		}
	}
	listenerCount(t$6) {
		if (t$6 === r$4) {
			let n$7 = 0;
			return this._events.forEach((e$6) => {
				n$7 += e$6.m.size;
			}), n$7;
		}
		return this._events.get(t$6)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$3 = E$2, o$3 = class {
	constructor(e$6 = {}) {
		let { phases: t$6 = [], dedupe: r$5, getId: s$6 } = e$6;
		this._phases = t$6, this._emitter = new v({
			getId: s$6,
			dedupe: r$5
		}), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
	}
	get phases() {
		return this._phases;
	}
	set phases(e$6) {
		this._phases = e$6;
	}
	get dedupe() {
		return this._emitter.dedupe;
	}
	set dedupe(e$6) {
		this._emitter.dedupe = e$6;
	}
	get getId() {
		return this._emitter.getId;
	}
	set getId(e$6) {
		this._emitter.getId = e$6;
	}
	tick(...e$6) {
		this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e$6);
	}
	on(e$6, t$6, r$5) {
		return this._emitter.on(e$6, t$6, r$5);
	}
	once(e$6, t$6, r$5) {
		return this._emitter.once(e$6, t$6, r$5);
	}
	off(e$6, t$6) {
		return this._emitter.off(e$6, t$6);
	}
	count(e$6) {
		return this._emitter.listenerCount(e$6);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$6 = this._queue, t$6 = this._phases, r$5 = this._getListeners, s$6 = 0, a$4 = t$6.length, n$7;
		for (; s$6 < a$4; s$6++) n$7 = r$5(t$6[s$6]), n$7 && e$6.push(n$7);
		return e$6;
	}
	_processQueue(...e$6) {
		let t$6 = this._queue, r$5 = t$6.length;
		if (!r$5) return;
		let s$6 = 0, a$4 = 0, n$7, c$6;
		for (; s$6 < r$5; s$6++) for (n$7 = t$6[s$6], a$4 = 0, c$6 = n$7.length; a$4 < c$6; a$4++) n$7[a$4](...e$6);
		t$6.length = 0;
	}
};
function u$5(i$5 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$6) => {
		let t$6 = requestAnimationFrame(e$6);
		return () => cancelAnimationFrame(t$6);
	};
	{
		let e$6 = 1e3 / i$5, t$6 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$5) => {
			let s$6 = setTimeout(() => r$5(t$6()), e$6);
			return () => clearTimeout(s$6);
		};
	}
}
var l$5 = class extends o$3 {
	constructor(e$6 = {}) {
		let { paused: t$6 = !1, onDemand: r$5 = !1, requestFrame: s$6 = u$5(),...a$4 } = e$6;
		super(a$4), this._paused = t$6, this._onDemand = r$5, this._requestFrame = s$6, this._cancelFrame = null, this._empty = !0, !t$6 && !r$5 && this._request();
	}
	get phases() {
		return this._phases;
	}
	set phases(e$6) {
		this._phases = e$6, e$6.length ? (this._empty = !1, this._request()) : this._empty = !0;
	}
	get paused() {
		return this._paused;
	}
	set paused(e$6) {
		this._paused = e$6, e$6 ? this._cancel() : this._request();
	}
	get onDemand() {
		return this._onDemand;
	}
	set onDemand(e$6) {
		this._onDemand = e$6, e$6 || this._request();
	}
	get requestFrame() {
		return this._requestFrame;
	}
	set requestFrame(e$6) {
		this._requestFrame !== e$6 && (this._requestFrame = e$6, this._cancelFrame && (this._cancel(), this._request()));
	}
	tick(...e$6) {
		if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
			if (!this._fillQueue().length) {
				this._empty = !0;
				return;
			}
			this._onDemand && this._request(), this._processQueue(...e$6);
		}
	}
	on(e$6, t$6, r$5) {
		let s$6 = super.on(e$6, t$6, r$5);
		return this._empty = !1, this._request(), s$6;
	}
	once(e$6, t$6, r$5) {
		let s$6 = super.once(e$6, t$6, r$5);
		return this._empty = !1, this._request(), s$6;
	}
	_request() {
		this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
	}
	_cancel() {
		this._cancelFrame && (this._cancelFrame(), this._cancelFrame = null);
	}
};

//#endregion
//#region ../dragdoll/dist/ticker-CAFcKU20.js
const n$2 = {
	read: Symbol(),
	write: Symbol()
};
let r$1 = new l$5({
	phases: [n$2.read, n$2.write],
	requestFrame: typeof window < `u` ? u$5() : () => () => {}
});

//#endregion
//#region ../dragdoll/dist/create-full-rect-ABJfaR4O.js
function e$5(e$6, t$6 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0
}) {
	return e$6 && (t$6.width = e$6.width, t$6.height = e$6.height, t$6.x = e$6.x, t$6.y = e$6.y, t$6.left = e$6.x, t$6.top = e$6.y, t$6.right = e$6.x + e$6.width, t$6.bottom = e$6.y + e$6.height), t$6;
}

//#endregion
//#region ../dragdoll/dist/get-intersection-score-CvSlwByb.js
function e$2(e$6, t$6, n$7 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	let r$5 = Math.max(e$6.x, t$6.x), i$5 = Math.min(e$6.x + e$6.width, t$6.x + t$6.width);
	if (i$5 <= r$5) return null;
	let a$4 = Math.max(e$6.y, t$6.y), o$4 = Math.min(e$6.y + e$6.height, t$6.y + t$6.height);
	return o$4 <= a$4 ? null : (n$7.x = r$5, n$7.y = a$4, n$7.width = i$5 - r$5, n$7.height = o$4 - a$4, n$7);
}
const t$5 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
};
function n$5(n$7, r$5, i$5) {
	if (i$5 ||= e$2(n$7, r$5, t$5), !i$5) return 0;
	let a$4 = i$5.width * i$5.height;
	return a$4 ? a$4 / (Math.min(n$7.width, r$5.width) * Math.min(n$7.height, r$5.height)) * 100 : 0;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/constants.js
const IS_BROWSER = "undefined" != typeof window && void 0 !== window.document;
const IS_SAFARI = !!(IS_BROWSER && navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && -1 == navigator.userAgent.indexOf("CriOS") && -1 == navigator.userAgent.indexOf("FxiOS"));
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
		return window.navigator.userAgentData.brands.some((({ brand: n$7 }) => "Chromium" === n$7));
	} catch (n$7) {
		return !1;
	}
})();

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$7) {
	return n$7 instanceof Window;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocument.js
function isDocument(n$7) {
	return n$7 instanceof Document;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$6, t$6) {
	if (t$6) return window.getComputedStyle(e$6, t$6);
	let C$2 = STYLE_DECLARATION_CACHE.get(e$6)?.deref();
	return C$2 || (C$2 = window.getComputedStyle(e$6, null), STYLE_DECLARATION_CACHE.set(e$6, new WeakRef(C$2))), C$2;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getPreciseScrollbarSize.js
const SUBPIXEL_OFFSET = /* @__PURE__ */ new Map();
let testStyleElement = null, testParentElement = null, testChildElement = null;
function getSubpixelScrollbarSize(t$6, e$6) {
	const n$7 = t$6.split(".");
	let l$6 = SUBPIXEL_OFFSET.get(n$7[1]);
	if (void 0 === l$6) {
		testStyleElement || (testStyleElement = document.createElement("style")), testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t$6} !important;\n      }\n    `, testParentElement && testChildElement || (testParentElement = document.createElement("div"), testChildElement = document.createElement("div"), testParentElement.appendChild(testChildElement), testParentElement.id = "mezr-scrollbar-test", testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild(testStyleElement), document.body.appendChild(testParentElement);
		l$6 = testParentElement.getBoundingClientRect().width - testChildElement.getBoundingClientRect().width - e$6, SUBPIXEL_OFFSET.set(n$7[1], l$6), document.body.removeChild(testParentElement), document.body.removeChild(testStyleElement);
	}
	return e$6 + l$6;
}
function getPreciseScrollbarSize(t$6, e$6, n$7) {
	if (n$7 <= 0) return 0;
	if (IS_CHROMIUM) {
		const n$8 = getStyle(t$6, "::-webkit-scrollbar"), l$6 = "x" === e$6 ? n$8.height : n$8.width, i$5 = parseFloat(l$6);
		if (!Number.isNaN(i$5) && !Number.isInteger(i$5)) return getSubpixelScrollbarSize(l$6, i$5);
	}
	return n$7;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getWindowWidth.js
function getWindowWidth(e$6, r$5 = !1) {
	if (r$5) return e$6.innerWidth;
	const { innerWidth: t$6, document: i$5 } = e$6, { documentElement: n$7 } = i$5, { clientWidth: c$6 } = n$7;
	return t$6 - getPreciseScrollbarSize(n$7, "y", t$6 - c$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getDocumentWidth.js
function getDocumentWidth({ documentElement: t$6 }) {
	return Math.max(t$6.scrollWidth, t$6.clientWidth, t$6.getBoundingClientRect().width);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$6) {
	return e$6 instanceof HTMLHtmlElement;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getElementWidth.js
function getElementWidth(t$6, e$6 = BOX_EDGE.border) {
	let { width: r$5 } = t$6.getBoundingClientRect();
	if (e$6 === BOX_EDGE.border) return r$5;
	const o$4 = getStyle(t$6);
	return e$6 === BOX_EDGE.margin ? (r$5 += Math.max(0, parseFloat(o$4.marginLeft) || 0), r$5 += Math.max(0, parseFloat(o$4.marginRight) || 0), r$5) : (r$5 -= parseFloat(o$4.borderLeftWidth) || 0, r$5 -= parseFloat(o$4.borderRightWidth) || 0, e$6 === BOX_EDGE.scrollbar ? r$5 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$4.overflowY) && (r$5 -= getPreciseScrollbarSize(t$6, "y", Math.round(r$5) - t$6.clientWidth)), e$6 === BOX_EDGE.padding || (r$5 -= parseFloat(o$4.paddingLeft) || 0, r$5 -= parseFloat(o$4.paddingRight) || 0), r$5));
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getWidth.js
function getWidth(t$6, i$5 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowWidth(t$6, INCLUDE_WINDOW_SCROLLBAR[i$5]) : isDocument(t$6) ? getDocumentWidth(t$6) : getElementWidth(t$6, i$5);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getWindowHeight.js
function getWindowHeight(e$6, r$5 = !1) {
	if (r$5) return e$6.innerHeight;
	const { innerHeight: t$6, document: i$5 } = e$6, { documentElement: n$7 } = i$5, { clientHeight: c$6 } = n$7;
	return t$6 - getPreciseScrollbarSize(n$7, "x", t$6 - c$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getDocumentHeight.js
function getDocumentHeight({ documentElement: t$6 }) {
	return Math.max(t$6.scrollHeight, t$6.clientHeight, t$6.getBoundingClientRect().height);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getElementHeight.js
function getElementHeight(t$6, e$6 = BOX_EDGE.border) {
	let { height: r$5 } = t$6.getBoundingClientRect();
	if (e$6 === BOX_EDGE.border) return r$5;
	const o$4 = getStyle(t$6);
	return e$6 === BOX_EDGE.margin ? (r$5 += Math.max(0, parseFloat(o$4.marginTop) || 0), r$5 += Math.max(0, parseFloat(o$4.marginBottom) || 0), r$5) : (r$5 -= parseFloat(o$4.borderTopWidth) || 0, r$5 -= parseFloat(o$4.borderBottomWidth) || 0, e$6 === BOX_EDGE.scrollbar ? r$5 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$4.overflowX) && (r$5 -= getPreciseScrollbarSize(t$6, "x", Math.round(r$5) - t$6.clientHeight)), e$6 === BOX_EDGE.padding || (r$5 -= parseFloat(o$4.paddingTop) || 0, r$5 -= parseFloat(o$4.paddingBottom) || 0), r$5));
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getHeight.js
function getHeight(t$6, e$6 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowHeight(t$6, INCLUDE_WINDOW_SCROLLBAR[e$6]) : isDocument(t$6) ? getDocumentHeight(t$6) : getElementHeight(t$6, e$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isRectObject.js
function isRectObject(t$6) {
	return t$6?.constructor === Object;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getOffsetFromDocument.js
function getOffsetFromDocument(t$6, o$4 = BOX_EDGE.border) {
	const e$6 = {
		left: 0,
		top: 0
	};
	if (isDocument(t$6)) return e$6;
	if (isWindow(t$6)) return e$6.left += t$6.scrollX || 0, e$6.top += t$6.scrollY || 0, e$6;
	const r$5 = t$6.ownerDocument.defaultView;
	r$5 && (e$6.left += r$5.scrollX || 0, e$6.top += r$5.scrollY || 0);
	const n$7 = t$6.getBoundingClientRect();
	if (e$6.left += n$7.left, e$6.top += n$7.top, o$4 === BOX_EDGE.border) return e$6;
	const l$6 = getStyle(t$6);
	return o$4 === BOX_EDGE.margin ? (e$6.left -= Math.max(0, parseFloat(l$6.marginLeft) || 0), e$6.top -= Math.max(0, parseFloat(l$6.marginTop) || 0), e$6) : (e$6.left += parseFloat(l$6.borderLeftWidth) || 0, e$6.top += parseFloat(l$6.borderTopWidth) || 0, o$4 === BOX_EDGE.scrollbar || o$4 === BOX_EDGE.padding || (e$6.left += parseFloat(l$6.paddingLeft) || 0, e$6.top += parseFloat(l$6.paddingTop) || 0), e$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getOffset.js
function getOffset(t$6, e$6) {
	const o$4 = isRectObject(t$6) ? {
		left: t$6.left,
		top: t$6.top
	} : Array.isArray(t$6) ? getOffsetFromDocument(...t$6) : getOffsetFromDocument(t$6);
	if (e$6 && !isDocument(e$6)) {
		const t$7 = isRectObject(e$6) ? e$6 : Array.isArray(e$6) ? getOffsetFromDocument(e$6[0], e$6[1]) : getOffsetFromDocument(e$6);
		o$4.left -= t$7.left, o$4.top -= t$7.top;
	}
	return o$4;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getRect.js
function getRect(t$6, e$6) {
	let i$5 = 0, g$3 = 0;
	isRectObject(t$6) ? (i$5 = t$6.width, g$3 = t$6.height) : Array.isArray(t$6) ? (i$5 = getWidth(...t$6), g$3 = getHeight(...t$6)) : (i$5 = getWidth(t$6), g$3 = getHeight(t$6));
	const r$5 = getOffset(t$6, e$6);
	return {
		width: i$5,
		height: g$3,
		...r$5,
		right: r$5.left + i$5,
		bottom: r$5.top + g$3
	};
}

//#endregion
//#region ../dragdoll/dist/get-rect-BRzLuevJ.js
function t$4(...t$6) {
	let { width: n$7, height: r$5, left: i$5, top: a$4 } = getRect(...t$6);
	return {
		width: n$7,
		height: r$5,
		x: i$5,
		y: a$4
	};
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isIntersecting.js
function isIntersecting(t$6, e$6) {
	return !(t$6.left + t$6.width <= e$6.left || e$6.left + e$6.width <= t$6.left || t$6.top + t$6.height <= e$6.top || e$6.top + e$6.height <= t$6.top);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getDistanceBetweenPoints.js
function getDistanceBetweenPoints(t$6, e$6, n$7, o$4) {
	return Math.sqrt(Math.pow(n$7 - t$6, 2) + Math.pow(o$4 - e$6, 2));
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getDistanceBetweenRects.js
function getDistanceBetweenRects(t$6, e$6) {
	if (isIntersecting(t$6, e$6)) return null;
	const n$7 = t$6.left + t$6.width, i$5 = t$6.top + t$6.height, o$4 = e$6.left + e$6.width, s$6 = e$6.top + e$6.height;
	return n$7 <= e$6.left ? i$5 <= e$6.top ? getDistanceBetweenPoints(n$7, i$5, e$6.left, e$6.top) : t$6.top >= s$6 ? getDistanceBetweenPoints(n$7, t$6.top, e$6.left, s$6) : e$6.left - n$7 : t$6.left >= o$4 ? i$5 <= e$6.top ? getDistanceBetweenPoints(t$6.left, i$5, o$4, e$6.top) : t$6.top >= s$6 ? getDistanceBetweenPoints(t$6.left, t$6.top, o$4, s$6) : t$6.left - o$4 : i$5 <= e$6.top ? e$6.top - i$5 : t$6.top - s$6;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getNormalizedRect.js
function getNormalizedRect(t$6) {
	return isRectObject(t$6) ? t$6 : getRect(t$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getDistance.js
function getDistance(e$6, t$6) {
	return getDistanceBetweenRects(getNormalizedRect(e$6), getNormalizedRect(t$6));
}

//#endregion
//#region ../dragdoll/dist/auto-scroll-DQA4hZ19.js
var o$2 = class {
	constructor(e$6, { batchSize: t$6 = 100, minBatchCount: n$7 = 0, maxBatchCount: r$5 = 2 ** 53 - 1, initialBatchCount: i$5 = 0, shrinkThreshold: a$4 = 2, onRelease: o$4 } = {}) {
		this._batchSize = Math.floor(Math.max(t$6, 1)), this._minSize = Math.floor(Math.max(n$7, 0)) * this._batchSize, this._maxSize = Math.floor(Math.min(Math.max(r$5 * this._batchSize, this._batchSize), 2 ** 53 - 1)), this._shrinkThreshold = Math.floor(Math.max(a$4, 1) * this._batchSize), this._data = Array(Math.floor(Math.max(Math.max(i$5, n$7) * this._batchSize, 0))), this._index = 0, this._getItem = e$6, this._onRelease = o$4;
	}
	get(...e$6) {
		if (this._index > 0) return this._getItem(this._data[--this._index], ...e$6);
		if (this._index === 0) {
			let e$7 = this._data.length, t$6 = Math.min(this._batchSize, this._maxSize - e$7);
			t$6 > 0 && (this._data.length = e$7 + t$6);
		}
		return this._getItem(void 0, ...e$6);
	}
	release(e$6) {
		if (this._index < this._maxSize && (this._onRelease && this._onRelease(e$6), this._data[this._index++] = e$6, this._index >= this._shrinkThreshold)) {
			let e$7 = this._data.length - this._batchSize;
			e$7 >= this._minSize && (this._data.length = e$7, this._index -= this._batchSize);
		}
	}
	destroy() {
		this._data.length = 0, this._index = 0;
	}
};
const s$5 = e$5(), c$5 = e$5();
function l$4(e$6, t$6) {
	return getDistance(e$5(e$6, s$5), e$5(t$6, c$5));
}
function u$4(e$6) {
	return e$6 instanceof Window;
}
function d$2(e$6) {
	return u$4(e$6) || e$6 === document.documentElement || e$6 === document.body ? window : e$6;
}
function f$2(e$6) {
	return u$4(e$6) ? e$6.scrollX : e$6.scrollLeft;
}
function p$2(e$6) {
	return u$4(e$6) && (e$6 = document.documentElement), e$6.scrollWidth - e$6.clientWidth;
}
function m$2(e$6) {
	return u$4(e$6) ? e$6.scrollY : e$6.scrollTop;
}
function h$2(e$6) {
	return u$4(e$6) && (e$6 = document.documentElement), e$6.scrollHeight - e$6.clientHeight;
}
function g$2(e$6, t$6) {
	return !(e$6.x + e$6.width <= t$6.x || t$6.x + t$6.width <= e$6.x || e$6.y + e$6.height <= t$6.y || t$6.y + t$6.height <= e$6.y);
}
const _$2 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}, v$3 = {
	direction: `none`,
	threshold: 0,
	distance: 0,
	value: 0,
	maxValue: 0,
	duration: 0,
	speed: 0,
	deltaTime: 0,
	isEnding: !1
}, y$2 = {
	x: 1,
	y: 2
}, b$1 = {
	forward: 4,
	reverse: 8
}, x$1 = {
	none: 0,
	left: y$2.x | b$1.reverse,
	right: y$2.x | b$1.forward
}, S$1 = {
	none: 0,
	up: y$2.y | b$1.reverse,
	down: y$2.y | b$1.forward
}, C$1 = {
	...x$1,
	...S$1
};
function w$1(e$6) {
	switch (e$6) {
		case x$1.none:
		case S$1.none: return `none`;
		case x$1.left: return `left`;
		case x$1.right: return `right`;
		case S$1.up: return `up`;
		case S$1.down: return `down`;
		default: throw Error(`Unknown direction value: ${e$6}`);
	}
}
function T$1(e$6, t$6, n$7) {
	let { left: r$5 = 0, right: i$5 = 0, top: a$4 = 0, bottom: o$4 = 0 } = t$6;
	return r$5 = Math.max(0, r$5), i$5 = Math.max(0, i$5), a$4 = Math.max(0, a$4), o$4 = Math.max(0, o$4), n$7.width = e$6.width + r$5 + i$5, n$7.height = e$6.height + a$4 + o$4, n$7.x = e$6.x - r$5, n$7.y = e$6.y - a$4, n$7;
}
function E$1(e$6, t$6) {
	return Math.ceil(e$6) >= Math.floor(t$6);
}
function D$1(e$6, t$6) {
	return Math.min(t$6 / 2, e$6);
}
function O$1(e$6, t$6, n$7, r$5) {
	return Math.max(0, n$7 + e$6 * 2 + r$5 * t$6 - r$5) / 2;
}
var k$1 = class {
	constructor() {
		this.positionX = 0, this.positionY = 0, this.directionX = C$1.none, this.directionY = C$1.none, this.overlapCheckRequestTime = 0;
	}
}, A$1 = class {
	constructor() {
		this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
	}
	reset() {
		this.requestX && (this.requestX.action = null), this.requestY && (this.requestY.action = null), this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
	}
	addRequest(e$6) {
		y$2.x & e$6.direction ? (this.requestX && this.removeRequest(this.requestX), this.requestX = e$6) : (this.requestY && this.removeRequest(this.requestY), this.requestY = e$6), e$6.action = this;
	}
	removeRequest(e$6) {
		this.requestX === e$6 ? (this.requestX = null, e$6.action = null) : this.requestY === e$6 && (this.requestY = null, e$6.action = null);
	}
	computeScrollValues() {
		this.element && (this.scrollLeft = this.requestX ? this.requestX.value : f$2(this.element), this.scrollTop = this.requestY ? this.requestY.value : m$2(this.element));
	}
	scroll() {
		this.element && (this.element.scrollTo ? this.element.scrollTo(this.scrollLeft, this.scrollTop) : (this.element.scrollLeft = this.scrollLeft, this.element.scrollTop = this.scrollTop));
	}
}, j$1 = class {
	constructor() {
		this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
	}
	reset() {
		this.isActive && this.onStop(), this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
	}
	hasReachedEnd() {
		return b$1.forward & this.direction ? E$1(this.value, this.maxValue) : this.value <= 0;
	}
	computeCurrentScrollValue() {
		return this.element ? this.value === this.value ? Math.max(0, Math.min(this.value, this.maxValue)) : y$2.x & this.direction ? f$2(this.element) : m$2(this.element) : 0;
	}
	computeNextScrollValue() {
		let e$6 = this.speed * (this.deltaTime / 1e3), t$6 = b$1.forward & this.direction ? this.value + e$6 : this.value - e$6;
		return Math.max(0, Math.min(t$6, this.maxValue));
	}
	computeSpeed() {
		if (!this.item || !this.element) return 0;
		let { speed: e$6 } = this.item;
		return typeof e$6 == `function` ? (v$3.direction = w$1(this.direction), v$3.threshold = this.threshold, v$3.distance = this.distance, v$3.value = this.value, v$3.maxValue = this.maxValue, v$3.duration = this.duration, v$3.speed = this.speed, v$3.deltaTime = this.deltaTime, v$3.isEnding = this.isEnding, e$6(this.element, v$3)) : e$6;
	}
	tick(e$6) {
		return this.isActive || (this.isActive = !0, this.onStart()), this.deltaTime = e$6, this.value = this.computeCurrentScrollValue(), this.speed = this.computeSpeed(), this.value = this.computeNextScrollValue(), this.duration += e$6, this.value;
	}
	onStart() {
		if (!this.item || !this.element) return;
		let { onStart: e$6 } = this.item;
		typeof e$6 == `function` && e$6(this.element, w$1(this.direction));
	}
	onStop() {
		if (!this.item || !this.element) return;
		let { onStop: e$6 } = this.item;
		typeof e$6 == `function` && e$6(this.element, w$1(this.direction));
	}
};
function M(e$6 = 500, t$6 = .5, n$7 = .25) {
	let r$5 = e$6 * (t$6 > 0 ? 1 / t$6 : Infinity), i$5 = e$6 * (n$7 > 0 ? 1 / n$7 : Infinity);
	return function(t$7, n$8) {
		let a$4 = 0;
		if (!n$8.isEnding) if (n$8.threshold > 0) {
			let t$8 = n$8.threshold - Math.max(0, n$8.distance);
			a$4 = e$6 / n$8.threshold * t$8;
		} else a$4 = e$6;
		let o$4 = n$8.speed;
		if (o$4 === a$4) return a$4;
		let s$6 = a$4;
		return o$4 < a$4 ? (s$6 = o$4 + r$5 * (n$8.deltaTime / 1e3), Math.min(a$4, s$6)) : (s$6 = o$4 - i$5 * (n$8.deltaTime / 1e3), Math.max(a$4, s$6));
	};
}
var N = class {
	constructor(e$6 = {}) {
		let { overlapCheckInterval: t$6 = 150 } = e$6;
		this.items = [], this.settings = { overlapCheckInterval: t$6 }, this._actions = [], this._isDestroyed = !1, this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, this._requests = {
			[y$2.x]: /* @__PURE__ */ new Map(),
			[y$2.y]: /* @__PURE__ */ new Map()
		}, this._itemData = /* @__PURE__ */ new Map(), this._requestPool = new o$2((e$7) => e$7 || new j$1(), {
			initialBatchCount: 1,
			minBatchCount: 1,
			onRelease: (e$7) => e$7.reset()
		}), this._actionPool = new o$2((e$7) => e$7 || new A$1(), {
			batchSize: 10,
			initialBatchCount: 1,
			minBatchCount: 1,
			onRelease: (e$7) => e$7.reset()
		}), this._frameRead = this._frameRead.bind(this), this._frameWrite = this._frameWrite.bind(this);
	}
	_frameRead(e$6) {
		this._isDestroyed || (e$6 && this._tickTime ? (this._tickDeltaTime = e$6 - this._tickTime, this._tickTime = e$6, this._updateItems(), this._updateRequests(), this._updateActions()) : (this._tickTime = e$6, this._tickDeltaTime = 0));
	}
	_frameWrite() {
		this._isDestroyed || this._applyActions();
	}
	_startTicking() {
		this._isTicking || (this._isTicking = !0, r$1.on(n$2.read, this._frameRead, this._frameRead), r$1.on(n$2.write, this._frameWrite, this._frameWrite));
	}
	_stopTicking() {
		this._isTicking && (this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, r$1.off(n$2.read, this._frameRead), r$1.off(n$2.write, this._frameWrite));
	}
	_requestItemScroll(e$6, t$6, n$7, r$5, i$5, a$4, o$4) {
		let s$6 = this._requests[t$6], c$6 = s$6.get(e$6);
		c$6 ? (c$6.element !== n$7 || c$6.direction !== r$5) && c$6.reset() : (c$6 = this._requestPool.get(), s$6.set(e$6, c$6)), c$6.item = e$6, c$6.element = n$7, c$6.direction = r$5, c$6.threshold = i$5, c$6.distance = a$4, c$6.maxValue = o$4;
	}
	_cancelItemScroll(e$6, t$6) {
		let n$7 = this._requests[t$6], r$5 = n$7.get(e$6);
		r$5 && (r$5.action && r$5.action.removeRequest(r$5), this._requestPool.release(r$5), n$7.delete(e$6));
	}
	_checkItemOverlap(e$6, t$6, n$7) {
		let { inertAreaSize: a$4, targets: o$4, clientRect: s$6 } = e$6;
		if (!o$4.length) {
			t$6 && this._cancelItemScroll(e$6, y$2.x), n$7 && this._cancelItemScroll(e$6, y$2.y);
			return;
		}
		let c$6 = this._itemData.get(e$6), u$6 = c$6?.directionX, v$4 = c$6?.directionY;
		if (!u$6 && !v$4) {
			t$6 && this._cancelItemScroll(e$6, y$2.x), n$7 && this._cancelItemScroll(e$6, y$2.y);
			return;
		}
		let b$2 = null, x$2 = -Infinity, w$2 = 0, k$2 = -Infinity, A$2 = C$1.none, j$2 = 0, M$2 = 0, N$2 = null, P$1 = -Infinity, F$1 = 0, I$1 = -Infinity, L$1 = C$1.none, R$1 = 0, z$1 = 0, B$1 = 0;
		for (; B$1 < o$4.length; B$1++) {
			let e$7 = o$4[B$1], c$7 = typeof e$7.threshold == `number` ? e$7.threshold : 50, y$3 = !!(t$6 && u$6 && e$7.axis !== `y`), V = !!(n$7 && v$4 && e$7.axis !== `x`), H = e$7.priority || 0;
			if ((!y$3 || H < x$2) && (!V || H < P$1)) continue;
			let U = d$2(e$7.element || e$7), W = y$3 ? p$2(U) : -1, G = V ? h$2(U) : -1;
			if (W <= 0 && G <= 0) continue;
			let K = t$4([U, `padding`], window), q = n$5(s$6, K) || -Infinity;
			if (q === -Infinity) if (e$7.padding && g$2(s$6, T$1(K, e$7.padding, _$2))) q = -(l$4(s$6, K) || 0);
			else continue;
			if (y$3 && H >= x$2 && W > 0 && (H > x$2 || q > k$2)) {
				let e$8 = 0, t$7 = C$1.none, n$8 = D$1(c$7, K.width), r$5 = O$1(n$8, a$4, s$6.width, K.width);
				u$6 === C$1.right ? (e$8 = K.x + K.width + r$5 - (s$6.x + s$6.width), e$8 <= n$8 && !E$1(f$2(U), W) && (t$7 = C$1.right)) : u$6 === C$1.left && (e$8 = s$6.x - (K.x - r$5), e$8 <= n$8 && f$2(U) > 0 && (t$7 = C$1.left)), t$7 && (b$2 = U, x$2 = H, w$2 = n$8, k$2 = q, A$2 = t$7, j$2 = e$8, M$2 = W);
			}
			if (V && H >= P$1 && G > 0 && (H > P$1 || q > I$1)) {
				let e$8 = 0, t$7 = S$1.none, n$8 = D$1(c$7, K.height), r$5 = O$1(n$8, a$4, s$6.height, K.height);
				v$4 === C$1.down ? (e$8 = K.y + K.height + r$5 - (s$6.y + s$6.height), e$8 <= n$8 && !E$1(m$2(U), G) && (t$7 = C$1.down)) : v$4 === C$1.up && (e$8 = s$6.y - (K.y - r$5), e$8 <= n$8 && m$2(U) > 0 && (t$7 = C$1.up)), t$7 && (N$2 = U, P$1 = H, F$1 = n$8, I$1 = q, L$1 = t$7, R$1 = e$8, z$1 = G);
			}
		}
		t$6 && (b$2 && A$2 ? this._requestItemScroll(e$6, y$2.x, b$2, A$2, w$2, j$2, M$2) : this._cancelItemScroll(e$6, y$2.x)), n$7 && (N$2 && L$1 ? this._requestItemScroll(e$6, y$2.y, N$2, L$1, F$1, R$1, z$1) : this._cancelItemScroll(e$6, y$2.y));
	}
	_updateScrollRequest(e$6) {
		let { inertAreaSize: t$6, smoothStop: n$7, targets: a$4, clientRect: o$4 } = e$6.item, s$6 = null, c$6 = 0;
		for (; c$6 < a$4.length; c$6++) {
			let n$8 = a$4[c$6], l$6 = d$2(n$8.element || n$8);
			if (l$6 !== e$6.element) continue;
			let u$6 = !!(y$2.x & e$6.direction);
			if (u$6) {
				if (n$8.axis === `y`) continue;
			} else if (n$8.axis === `x`) continue;
			let v$4 = u$6 ? p$2(l$6) : h$2(l$6);
			if (v$4 <= 0) break;
			let x$2 = t$4([l$6, `padding`], window);
			if ((n$5(o$4, x$2) || -Infinity) === -Infinity) {
				let e$7 = n$8.scrollPadding || n$8.padding;
				if (!(e$7 && g$2(o$4, T$1(x$2, e$7, _$2)))) break;
			}
			let S$2 = D$1(typeof n$8.threshold == `number` ? n$8.threshold : 50, u$6 ? x$2.width : x$2.height), w$2 = O$1(S$2, t$6, u$6 ? o$4.width : o$4.height, u$6 ? x$2.width : x$2.height), k$2 = 0;
			if (k$2 = e$6.direction === C$1.left ? o$4.x - (x$2.x - w$2) : e$6.direction === C$1.right ? x$2.x + x$2.width + w$2 - (o$4.x + o$4.width) : e$6.direction === C$1.up ? o$4.y - (x$2.y - w$2) : x$2.y + x$2.height + w$2 - (o$4.y + o$4.height), k$2 > S$2) break;
			let A$2 = u$6 ? f$2(l$6) : m$2(l$6);
			if (s$6 = b$1.forward & e$6.direction ? E$1(A$2, v$4) : A$2 <= 0, s$6) break;
			return e$6.maxValue = v$4, e$6.threshold = S$2, e$6.distance = k$2, e$6.isEnding = !1, !0;
		}
		return n$7 === !0 && e$6.speed > 0 ? (s$6 === null && (s$6 = e$6.hasReachedEnd()), e$6.isEnding = !s$6) : e$6.isEnding = !1, e$6.isEnding;
	}
	_updateItems() {
		for (let e$6 = 0; e$6 < this.items.length; e$6++) {
			let t$6 = this.items[e$6], n$7 = this._itemData.get(t$6), { x: r$5, y: i$5 } = t$6.position, a$4 = n$7.positionX, o$4 = n$7.positionY;
			r$5 === a$4 && i$5 === o$4 || (n$7.directionX = r$5 > a$4 ? C$1.right : r$5 < a$4 ? C$1.left : n$7.directionX, n$7.directionY = i$5 > o$4 ? C$1.down : i$5 < o$4 ? C$1.up : n$7.directionY, n$7.positionX = r$5, n$7.positionY = i$5, n$7.overlapCheckRequestTime === 0 && (n$7.overlapCheckRequestTime = this._tickTime));
		}
	}
	_updateRequests() {
		let e$6 = this.items, t$6 = this._requests[y$2.x], n$7 = this._requests[y$2.y], r$5 = 0;
		for (; r$5 < e$6.length; r$5++) {
			let i$5 = e$6[r$5], a$4 = this._itemData.get(i$5), o$4 = a$4.overlapCheckRequestTime, s$6 = o$4 > 0 && this._tickTime - o$4 > this.settings.overlapCheckInterval, c$6 = !0, l$6 = t$6.get(i$5);
			l$6 && l$6.isActive && (c$6 = !this._updateScrollRequest(l$6), c$6 && (s$6 = !0, this._cancelItemScroll(i$5, y$2.x)));
			let u$6 = !0, d$3 = n$7.get(i$5);
			d$3 && d$3.isActive && (u$6 = !this._updateScrollRequest(d$3), u$6 && (s$6 = !0, this._cancelItemScroll(i$5, y$2.y))), s$6 && (a$4.overlapCheckRequestTime = 0, this._checkItemOverlap(i$5, c$6, u$6));
		}
	}
	_requestAction(e$6, t$6) {
		let n$7 = t$6 === y$2.x, r$5 = null, i$5 = 0;
		for (; i$5 < this._actions.length; i$5++) {
			if (r$5 = this._actions[i$5], e$6.element !== r$5.element) {
				r$5 = null;
				continue;
			}
			if (n$7 ? r$5.requestX : r$5.requestY) {
				this._cancelItemScroll(e$6.item, t$6);
				return;
			}
			break;
		}
		r$5 ||= this._actionPool.get(), r$5.element = e$6.element, r$5.addRequest(e$6), e$6.tick(this._tickDeltaTime), this._actions.push(r$5);
	}
	_updateActions() {
		let e$6 = 0;
		for (e$6 = 0; e$6 < this.items.length; e$6++) {
			let t$6 = this.items[e$6], n$7 = this._requests[y$2.x].get(t$6), r$5 = this._requests[y$2.y].get(t$6);
			n$7 && this._requestAction(n$7, y$2.x), r$5 && this._requestAction(r$5, y$2.y);
		}
		for (e$6 = 0; e$6 < this._actions.length; e$6++) this._actions[e$6].computeScrollValues();
	}
	_applyActions() {
		if (!this._actions.length) return;
		let e$6 = 0;
		for (e$6 = 0; e$6 < this._actions.length; e$6++) this._actions[e$6].scroll(), this._actionPool.release(this._actions[e$6]);
		this._actions.length = 0;
	}
	addItem(e$6) {
		if (this._isDestroyed || this._itemData.has(e$6)) return;
		let { x: t$6, y: n$7 } = e$6.position, r$5 = new k$1();
		r$5.positionX = t$6, r$5.positionY = n$7, r$5.directionX = C$1.none, r$5.directionY = C$1.none, r$5.overlapCheckRequestTime = this._tickTime, this._itemData.set(e$6, r$5), this.items.push(e$6), this._isTicking || this._startTicking();
	}
	removeItem(e$6) {
		if (this._isDestroyed) return;
		let t$6 = this.items.indexOf(e$6);
		t$6 !== -1 && (this._requests[y$2.x].get(e$6) && (this._cancelItemScroll(e$6, y$2.x), this._requests[y$2.x].delete(e$6)), this._requests[y$2.y].get(e$6) && (this._cancelItemScroll(e$6, y$2.y), this._requests[y$2.y].delete(e$6)), this._itemData.delete(e$6), this.items.splice(t$6, 1), this._isTicking && !this.items.length && this._stopTicking());
	}
	isDestroyed() {
		return this._isDestroyed;
	}
	isItemScrollingX(e$6) {
		return !!this._requests[y$2.x].get(e$6)?.isActive;
	}
	isItemScrollingY(e$6) {
		return !!this._requests[y$2.y].get(e$6)?.isActive;
	}
	isItemScrolling(e$6) {
		return this.isItemScrollingX(e$6) || this.isItemScrollingY(e$6);
	}
	updateSettings(e$6 = {}) {
		let { overlapCheckInterval: t$6 = this.settings.overlapCheckInterval } = e$6;
		this.settings.overlapCheckInterval = t$6;
	}
	destroy() {
		this._isDestroyed ||= (this.items.forEach((e$6) => this.removeItem(e$6)), this._requestPool.destroy(), this._actionPool.destroy(), this._actions.length = 0, !0);
	}
};

//#endregion
//#region ../dragdoll/dist/collision-detector-C_qir_i0.js
function n$6(e$6, t$6 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	return e$6 && (t$6.width = e$6.width, t$6.height = e$6.height, t$6.x = e$6.x, t$6.y = e$6.y), t$6;
}
var r$3 = class {
	constructor(e$6) {
		this._items = [], this._index = 0, this._getItem = e$6;
	}
	get(...e$6) {
		return this._index >= this._items.length ? this._items[this._index++] = this._getItem(void 0, ...e$6) : this._getItem(this._items[this._index++], ...e$6);
	}
	resetPointer() {
		this._index = 0;
	}
	resetItems(e$6 = 0) {
		let t$6 = Math.max(0, Math.min(e$6, this._items.length));
		this._index = Math.min(this._index, t$6), this._items.length = t$6;
	}
};
const i$4 = Symbol();
var a$3 = class {
	constructor(e$6) {
		this._listenerId = Symbol(), this._dndContext = e$6, this._collisionDataPoolCache = [], this._collisionDataPoolMap = /* @__PURE__ */ new Map();
	}
	_checkCollision(r$5, i$5, a$4) {
		let o$4 = r$5.getClientRect(), s$6 = i$5.getClientRect();
		if (!o$4) return null;
		let c$6 = e$2(o$4, s$6, a$4.intersectionRect);
		if (c$6 === null) return null;
		let l$6 = n$5(o$4, s$6, c$6);
		return l$6 <= 0 ? null : (a$4.droppableId = i$5.id, n$6(s$6, a$4.droppableRect), n$6(o$4, a$4.draggableRect), a$4.intersectionScore = l$6, a$4);
	}
	_sortCollisions(e$6, t$6) {
		return t$6.sort((e$7, t$7) => {
			let n$7 = t$7.intersectionScore - e$7.intersectionScore;
			return n$7 === 0 ? e$7.droppableRect.width * e$7.droppableRect.height - t$7.droppableRect.width * t$7.droppableRect.height : n$7;
		});
	}
	_createCollisionData() {
		return {
			droppableId: i$4,
			droppableRect: n$6(),
			draggableRect: n$6(),
			intersectionRect: n$6(),
			intersectionScore: 0
		};
	}
	getCollisionDataPool(e$6) {
		let t$6 = this._collisionDataPoolMap.get(e$6);
		return t$6 || (t$6 = this._collisionDataPoolCache.pop() || new r$3((e$7) => e$7 || this._createCollisionData()), this._collisionDataPoolMap.set(e$6, t$6)), t$6;
	}
	removeCollisionDataPool(e$6) {
		let t$6 = this._collisionDataPoolMap.get(e$6);
		t$6 && (t$6.resetItems(20), t$6.resetPointer(), this._collisionDataPoolCache.push(t$6), this._collisionDataPoolMap.delete(e$6));
	}
	detectCollisions(e$6, t$6, n$7) {
		if (n$7.length = 0, !t$6.size) return;
		let r$5 = this.getCollisionDataPool(e$6), i$5 = null, a$4 = t$6.values();
		for (let t$7 of a$4) i$5 ||= r$5.get(), this._checkCollision(e$6, t$7, i$5) && (n$7.push(i$5), i$5 = null);
		n$7.length > 1 && this._sortCollisions(e$6, n$7), r$5.resetPointer();
	}
	destroy() {
		this._collisionDataPoolMap.forEach((e$6) => {
			e$6.resetItems();
		});
	}
};

//#endregion
//#region ../dragdoll/dist/get-style-ZZHAkgcg.js
const e$4 = /* @__PURE__ */ new WeakMap();
function t$3(t$6) {
	let n$7 = e$4.get(t$6)?.deref();
	return n$7 || (n$7 = window.getComputedStyle(t$6, null), e$4.set(t$6, new WeakRef(n$7))), n$7;
}

//#endregion
//#region ../dragdoll/dist/is-document-BQAkbLgN.js
function e$3(e$6) {
	return e$6 instanceof Document;
}

//#endregion
//#region ../dragdoll/dist/advanced-collision-detector-BXyCbT9h.js
const s$4 = `visible`;
function c$4(e$6, t$6, n$7 = []) {
	let r$5 = t$6 ? e$6 : e$6?.parentNode;
	for (n$7.length = 0; r$5 && !e$3(r$5);) if (r$5 instanceof Element) {
		let e$7 = t$3(r$5);
		e$7.overflowY === s$4 || e$7.overflowX === s$4 || n$7.push(r$5), r$5 = r$5.parentNode;
	} else r$5 = r$5 instanceof ShadowRoot ? r$5.host : r$5.parentNode;
	return n$7.push(window), n$7;
}
let l$3;
const u$3 = n$6(), d$1 = {
	width: 2 ** 53 - 1,
	height: 2 ** 53 - 1,
	x: (2 ** 53 - 1) * -.5,
	y: (2 ** 53 - 1) * -.5
}, f$1 = [], p$1 = [], m$1 = [], h$1 = [];
function g$1(e$6) {
	if (!f$1.length) {
		let t$6 = e$6.drag?.items?.[0]?.dragContainer;
		t$6 ? c$4(t$6, !0, f$1) : f$1.push(window);
	}
}
function _$1(e$6) {
	p$1.length || c$4(e$6.element, !1, p$1);
}
function v$2(t$6, r$5 = n$6()) {
	n$6(t$6.length ? t$4([t$6[0], `padding`], window) : d$1, r$5);
	for (let a$4 = 1; a$4 < t$6.length; a$4++) {
		let o$4 = t$6[a$4];
		if (!e$2(r$5, t$4([o$4, `padding`], window), r$5)) {
			n$6(u$3, r$5);
			break;
		}
	}
	return r$5;
}
var y = class extends a$3 {
	constructor(e$6, t$6) {
		super(e$6), this._dragStates = /* @__PURE__ */ new Map(), this._visibilityLogic = t$6?.visibilityLogic || `relative`, this._listenersAttached = !1, this._clearCache = () => this.clearCache();
	}
	_checkCollision(n$7, r$5, a$4) {
		let o$4 = this._dragStates.get(n$7);
		if (!o$4) return null;
		let s$6 = n$7.getClientRect(), c$6 = r$5.getClientRect();
		if (!s$6 || !c$6) return null;
		let u$6 = o$4.clipMaskKeyMap.get(r$5);
		if (!u$6) {
			let e$6 = this._visibilityLogic === `relative`;
			if (p$1.length = 0, m$1.length = 0, h$1.length = 0, _$1(r$5), u$6 = p$1[0] || window, o$4.clipMaskKeyMap.set(r$5, u$6), !o$4.clipMaskMap.has(u$6)) {
				if (g$1(n$7), e$6) {
					let e$7 = window;
					for (let t$7 of p$1) if (f$1.includes(t$7)) {
						e$7 = t$7;
						break;
					}
					for (let t$7 of f$1) {
						if (t$7 === e$7) break;
						m$1.push(t$7);
					}
					for (let t$7 of p$1) {
						if (t$7 === e$7) break;
						h$1.push(t$7);
					}
				} else m$1.push(...f$1), h$1.push(...p$1);
				let t$6 = e$6 || !l$3 ? v$2(m$1) : n$6(l$3), r$6 = v$2(h$1);
				!e$6 && !l$3 && (l$3 = t$6), o$4.clipMaskMap.set(u$6, [t$6, r$6]);
			}
			p$1.length = 0, m$1.length = 0, h$1.length = 0;
		}
		let [d$3, y$3] = o$4.clipMaskMap.get(u$6) || [];
		if (!d$3 || !y$3 || !e$2(s$6, d$3, a$4.draggableVisibleRect) || !e$2(c$6, y$3, a$4.droppableVisibleRect) || !e$2(a$4.draggableVisibleRect, a$4.droppableVisibleRect, a$4.intersectionRect)) return null;
		let b$2 = n$5(a$4.draggableVisibleRect, a$4.droppableVisibleRect, a$4.intersectionRect);
		return b$2 <= 0 ? null : (a$4.droppableId = r$5.id, n$6(c$6, a$4.droppableRect), n$6(s$6, a$4.draggableRect), a$4.intersectionScore = b$2, a$4);
	}
	_sortCollisions(e$6, t$6) {
		return t$6.sort((e$7, t$7) => {
			let n$7 = t$7.intersectionScore - e$7.intersectionScore;
			return n$7 === 0 ? e$7.droppableVisibleRect.width * e$7.droppableVisibleRect.height - t$7.droppableVisibleRect.width * t$7.droppableVisibleRect.height : n$7;
		});
	}
	_createCollisionData() {
		let e$6 = super._createCollisionData();
		return e$6.droppableVisibleRect = n$6(), e$6.draggableVisibleRect = n$6(), e$6;
	}
	_getDragState(e$6) {
		let t$6 = this._dragStates.get(e$6);
		return t$6 || (t$6 = {
			clipMaskKeyMap: /* @__PURE__ */ new Map(),
			clipMaskMap: /* @__PURE__ */ new Map(),
			cacheDirty: !0
		}, this._dragStates.set(e$6, t$6), this._listenersAttached ||= (window.addEventListener(`scroll`, this._clearCache, {
			capture: !0,
			passive: !0
		}), window.addEventListener(`resize`, this._clearCache, { passive: !0 }), !0), t$6);
	}
	getCollisionDataPool(e$6) {
		return this._getDragState(e$6), super.getCollisionDataPool(e$6);
	}
	removeCollisionDataPool(e$6) {
		this._dragStates.delete(e$6) && this._dndContext.drags.size <= 0 && (this._listenersAttached &&= (window.removeEventListener(`scroll`, this._clearCache, { capture: !0 }), window.removeEventListener(`resize`, this._clearCache), !1)), super.removeCollisionDataPool(e$6);
	}
	detectCollisions(e$6, t$6, n$7) {
		f$1.length = 0, l$3 = null;
		let r$5 = this._getDragState(e$6);
		r$5.cacheDirty &&= (r$5.clipMaskKeyMap.clear(), r$5.clipMaskMap.clear(), !1), super.detectCollisions(e$6, t$6, n$7), f$1.length = 0, l$3 = null;
	}
	clearCache(e$6) {
		if (e$6) {
			let t$6 = this._dragStates.get(e$6);
			t$6 && (t$6.cacheDirty = !0);
		} else this._dragStates.forEach((e$7) => {
			e$7.cacheDirty = !0;
		});
	}
};

//#endregion
//#region ../dragdoll/dist/constants-gNukEJzy.js
const e$1 = typeof window < `u` && window.document !== void 0, t$1 = e$1 && `ontouchstart` in window, n$4 = e$1 && !!window.PointerEvent;
e$1 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

//#endregion
//#region ../dragdoll/dist/sensor-C-EBcfly.js
const e = {
	Start: `start`,
	Move: `move`,
	Cancel: `cancel`,
	End: `end`,
	Destroy: `destroy`
};

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isBlockElement.js
function isBlockElement(e$6) {
	switch (getStyle(e$6).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$7) {
	const t$6 = getStyle(n$7);
	if (!IS_SAFARI) {
		const { filter: n$8 } = t$6;
		if (n$8 && "none" !== n$8) return !0;
		const { backdropFilter: e$7 } = t$6;
		if (e$7 && "none" !== e$7) return !0;
		const { willChange: i$6 } = t$6;
		if (i$6 && (i$6.indexOf("filter") > -1 || i$6.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$6 = isBlockElement(n$7);
	if (!e$6) return e$6;
	const { transform: i$5 } = t$6;
	if (i$5 && "none" !== i$5) return !0;
	const { perspective: r$5 } = t$6;
	if (r$5 && "none" !== r$5) return !0;
	const { contentVisibility: o$4 } = t$6;
	if (o$4 && "auto" === o$4) return !0;
	const { contain: f$3 } = t$6;
	if (f$3 && ("strict" === f$3 || "content" === f$3 || f$3.indexOf("paint") > -1 || f$3.indexOf("layout") > -1)) return !0;
	const { willChange: c$6 } = t$6;
	return !(!c$6 || !(c$6.indexOf("transform") > -1 || c$6.indexOf("perspective") > -1 || c$6.indexOf("contain") > -1)) || !!(IS_SAFARI && c$6 && c$6.indexOf("filter") > -1);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$6) {
	return "static" !== getStyle(t$6).position || isContainingBlockForFixedElement(t$6);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$6, t$6 = {}) {
	if (isDocumentElement(e$6)) return e$6.ownerDocument.defaultView;
	const n$7 = t$6.position || getStyle(e$6).position, { skipDisplayNone: i$5, container: o$4 } = t$6;
	switch (n$7) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$7 = o$4 || e$6.parentElement;
			for (; t$7;) {
				const e$7 = isBlockElement(t$7);
				if (e$7) return t$7;
				if (null === e$7 && !i$5) return null;
				t$7 = t$7.parentElement;
			}
			return e$6.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$7 = "fixed" === n$7;
			let l$6 = o$4 || e$6.parentElement;
			for (; l$6;) {
				const e$7 = t$7 ? isContainingBlockForFixedElement(l$6) : isContainingBlockForAbsoluteElement(l$6);
				if (!0 === e$7) return l$6;
				if (null === e$7 && !i$5) return null;
				l$6 = l$6.parentElement;
			}
			return e$6.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$7, t$6 = {}) {
	const { display: o$4 } = getStyle(n$7);
	if ("none" === o$4 || "contents" === o$4) return null;
	const e$6 = t$6.position || getStyle(n$7).position, { skipDisplayNone: s$6, container: r$5 } = t$6;
	switch (e$6) {
		case "relative": return n$7;
		case "fixed": return getContainingBlock(n$7, {
			container: r$5,
			position: e$6,
			skipDisplayNone: s$6
		});
		case "absolute": {
			const t$7 = getContainingBlock(n$7, {
				container: r$5,
				position: e$6,
				skipDisplayNone: s$6
			});
			return isWindow(t$7) ? n$7.ownerDocument : t$7;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-C1QBodX1.js
function s$3(e$6, t$6) {
	return e$6.isIdentity && t$6.isIdentity ? !0 : e$6.is2D && t$6.is2D ? e$6.a === t$6.a && e$6.b === t$6.b && e$6.c === t$6.c && e$6.d === t$6.d && e$6.e === t$6.e && e$6.f === t$6.f : e$6.m11 === t$6.m11 && e$6.m12 === t$6.m12 && e$6.m13 === t$6.m13 && e$6.m14 === t$6.m14 && e$6.m21 === t$6.m21 && e$6.m22 === t$6.m22 && e$6.m23 === t$6.m23 && e$6.m24 === t$6.m24 && e$6.m31 === t$6.m31 && e$6.m32 === t$6.m32 && e$6.m33 === t$6.m33 && e$6.m34 === t$6.m34 && e$6.m41 === t$6.m41 && e$6.m42 === t$6.m42 && e$6.m43 === t$6.m43 && e$6.m44 === t$6.m44;
}
function c$3(e$6) {
	return e$6.m11 !== 1 || e$6.m12 !== 0 || e$6.m13 !== 0 || e$6.m14 !== 0 || e$6.m21 !== 0 || e$6.m22 !== 1 || e$6.m23 !== 0 || e$6.m24 !== 0 || e$6.m31 !== 0 || e$6.m32 !== 0 || e$6.m33 !== 1 || e$6.m34 !== 0 || e$6.m43 !== 0 || e$6.m44 !== 1;
}
function l$2(e$6, t$6, n$7 = null) {
	if (`moveBefore` in e$6 && e$6.isConnected === t$6.isConnected) try {
		e$6.moveBefore(t$6, n$7);
		return;
	} catch {}
	let r$5 = document.activeElement, i$5 = t$6.contains(r$5);
	e$6.insertBefore(t$6, n$7), i$5 && document.activeElement !== r$5 && r$5 instanceof HTMLElement && r$5.focus({ preventScroll: !0 });
}
function u$2(e$6) {
	return e$6.setMatrixValue(`scale(1, 1)`);
}
function d(e$6, t$6 = 0) {
	let n$7 = 10 ** t$6;
	return Math.round((e$6 + 2 ** -52) * n$7) / n$7;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$6, t$6) {
		this._cache.set(e$6, t$6), this._validation.set(e$6, void 0);
	}
	get(e$6) {
		return this._cache.get(e$6);
	}
	has(e$6) {
		return this._cache.has(e$6);
	}
	delete(e$6) {
		this._cache.delete(e$6), this._validation.delete(e$6);
	}
	isValid(e$6) {
		return this._validation.has(e$6);
	}
	invalidate(e$6) {
		e$6 === void 0 ? this._validation.clear() : this._validation.delete(e$6);
	}
	clear() {
		this._cache.clear(), this._validation.clear();
	}
}, p = class {
	constructor(e$6, t$6) {
		this.sensor = e$6, this.startEvent = t$6, this.prevMoveEvent = t$6, this.moveEvent = t$6, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$6, t$6, n$7 = !1) {
	let { style: r$5 } = e$6;
	for (let e$7 in t$6) r$5.setProperty(e$7, t$6[e$7], n$7 ? `important` : ``);
}
function h() {
	let e$6 = document.createElement(`div`);
	return e$6.classList.add(`dragdoll-measure`), m(e$6, {
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
	}, !0), e$6;
}
function g(e$6, t$6 = {
	x: 0,
	y: 0
}) {
	if (t$6.x = 0, t$6.y = 0, e$6 instanceof Window) return t$6;
	if (e$6 instanceof Document) return t$6.x = window.scrollX * -1, t$6.y = window.scrollY * -1, t$6;
	let { x: r$5, y: i$5 } = e$6.getBoundingClientRect(), a$4 = t$3(e$6);
	return t$6.x = r$5 + (parseFloat(a$4.borderLeftWidth) || 0), t$6.y = i$5 + (parseFloat(a$4.borderTopWidth) || 0), t$6;
}
function _(e$6) {
	let t$6 = t$3(e$6), r$5 = parseFloat(t$6.height) || 0;
	return t$6.boxSizing === `border-box` ? r$5 : (r$5 += parseFloat(t$6.borderTopWidth) || 0, r$5 += parseFloat(t$6.borderBottomWidth) || 0, r$5 += parseFloat(t$6.paddingTop) || 0, r$5 += parseFloat(t$6.paddingBottom) || 0, e$6 instanceof HTMLElement && (r$5 += e$6.offsetHeight - e$6.clientHeight), r$5);
}
function v$1(e$6) {
	let t$6 = t$3(e$6), r$5 = parseFloat(t$6.width) || 0;
	return t$6.boxSizing === `border-box` ? r$5 : (r$5 += parseFloat(t$6.borderLeftWidth) || 0, r$5 += parseFloat(t$6.borderRightWidth) || 0, r$5 += parseFloat(t$6.paddingLeft) || 0, r$5 += parseFloat(t$6.paddingRight) || 0, e$6 instanceof HTMLElement && (r$5 += e$6.offsetWidth - e$6.clientWidth), r$5);
}
function y$1(e$6, t$6 = !1) {
	let { translate: r$5, rotate: i$5, scale: a$4, transform: o$4 } = t$3(e$6), s$6 = ``;
	if (r$5 && r$5 !== `none`) {
		let [t$7 = `0px`, n$7 = `0px`, i$6] = r$5.split(` `);
		t$7.includes(`%`) && (t$7 = `${parseFloat(t$7) / 100 * v$1(e$6)}px`), n$7.includes(`%`) && (n$7 = `${parseFloat(n$7) / 100 * _(e$6)}px`), i$6 ? s$6 += `translate3d(${t$7},${n$7},${i$6})` : s$6 += `translate(${t$7},${n$7})`;
	}
	if (i$5 && i$5 !== `none`) {
		let e$7 = i$5.split(` `);
		e$7.length > 1 ? s$6 += `rotate3d(${e$7.join(`,`)})` : s$6 += `rotate(${e$7.join(`,`)})`;
	}
	if (a$4 && a$4 !== `none`) {
		let e$7 = a$4.split(` `);
		e$7.length === 3 ? s$6 += `scale3d(${e$7.join(`,`)})` : s$6 += `scale(${e$7.join(`,`)})`;
	}
	return !t$6 && o$4 && o$4 !== `none` && (s$6 += o$4), s$6;
}
function b(e$6) {
	return typeof e$6 == `object` && !!e$6 && `x` in e$6 && `y` in e$6;
}
const x = {
	x: 0,
	y: 0
}, S = {
	x: 0,
	y: 0
};
function C(e$6, t$6, n$7 = {
	x: 0,
	y: 0
}) {
	let r$5 = b(e$6) ? e$6 : g(e$6, x), i$5 = b(t$6) ? t$6 : g(t$6, S);
	return n$7.x = i$5.x - r$5.x, n$7.y = i$5.y - r$5.y, n$7;
}
function w(e$6) {
	let t$6 = e$6.split(` `), n$7 = ``, r$5 = ``, i$5 = ``;
	return t$6.length === 1 ? n$7 = r$5 = t$6[0] : t$6.length === 2 ? [n$7, r$5] = t$6 : [n$7, r$5, i$5] = t$6, {
		x: parseFloat(n$7) || 0,
		y: parseFloat(r$5) || 0,
		z: parseFloat(i$5) || 0
	};
}
const T = e$1 ? new DOMMatrix() : null;
function E(e$6, t$6 = new DOMMatrix()) {
	let r$5 = e$6;
	for (u$2(t$6); r$5;) {
		let e$7 = y$1(r$5);
		if (e$7 && (T.setMatrixValue(e$7), !T.isIdentity)) {
			let { transformOrigin: e$8 } = t$3(r$5), { x: i$5, y: a$4, z: o$4 } = w(e$8);
			o$4 === 0 ? T.setMatrixValue(`translate(${i$5}px,${a$4}px) ${T} translate(${i$5 * -1}px,${a$4 * -1}px)`) : T.setMatrixValue(`translate3d(${i$5}px,${a$4}px,${o$4}px) ${T} translate3d(${i$5 * -1}px,${a$4 * -1}px,${o$4 * -1}px)`), t$6.preMultiplySelf(T);
		}
		r$5 = r$5.parentElement;
	}
	return t$6;
}
const D = e$1 ? h() : null;
var O = class {
	constructor(e$6, t$6) {
		if (!e$6.isConnected) throw Error(`Element is not connected`);
		let { drag: r$5 } = t$6;
		if (!r$5) throw Error(`Drag is not defined`);
		let i$5 = t$3(e$6), a$4 = e$6.getBoundingClientRect(), s$6 = y$1(e$6, !0);
		this.data = {}, this.element = e$6, this.elementTransformOrigin = w(i$5.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$6 + i$5.transform), this.elementOffsetMatrix = new DOMMatrix(s$6).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = r$5._matrixCache, this._clientOffsetCache = r$5._clientOffsetCache;
		let c$6 = e$6.parentElement;
		if (!c$6) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$6;
		let l$6 = t$6.settings.container || c$6;
		if (this.dragContainer = l$6, c$6 !== l$6) {
			let { position: e$7 } = i$5;
			if (e$7 !== `fixed` && e$7 !== `absolute`) throw Error(`Dragged element has "${e$7}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$6 = getOffsetContainer(e$6) || e$6;
		this.elementOffsetContainer = u$6, this.dragOffsetContainer = l$6 === c$6 ? u$6 : getOffsetContainer(e$6, { container: l$6 });
		{
			let { width: e$7, height: t$7, x: n$7, y: r$6 } = a$4;
			this.clientRect = {
				width: e$7,
				height: t$7,
				x: n$7,
				y: r$6
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$3 = t$6.settings.frozenStyles({
			draggable: t$6,
			drag: r$5,
			item: this,
			style: i$5
		});
		if (Array.isArray(d$3)) if (d$3.length) {
			let e$7 = {};
			for (let t$7 of d$3) e$7[t$7] = i$5[t$7];
			this.frozenStyles = e$7;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$3;
		if (this.frozenStyles) {
			let t$7 = {};
			for (let n$7 in this.frozenStyles) t$7[n$7] = e$6.style[n$7];
			this.unfrozenStyles = t$7;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$6) => {
			if (!this._matrixCache.isValid(e$6)) {
				let t$6 = this._matrixCache.get(e$6) || [new DOMMatrix(), new DOMMatrix()], [n$7, r$5] = t$6;
				E(e$6, n$7), r$5.setMatrixValue(n$7.toString()).invertSelf(), this._matrixCache.set(e$6, t$6);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$6, elementContainer: t$6, dragOffsetContainer: n$7, dragContainer: r$5, containerOffset: i$5, _clientOffsetCache: a$4, _matrixCache: o$4 } = this;
		if (e$6 !== n$7) {
			let [s$6, l$6] = [[r$5, n$7], [t$6, e$6]].map(([e$7, t$7]) => {
				let n$8 = a$4.get(t$7) || {
					x: 0,
					y: 0
				};
				if (!a$4.isValid(t$7)) {
					let r$6 = o$4.get(e$7);
					t$7 instanceof HTMLElement && r$6 && !r$6[0].isIdentity ? c$3(r$6[0]) ? (D.style.setProperty(`transform`, r$6[1].toString(), `important`), t$7.append(D), g(D, n$8), D.remove()) : (g(t$7, n$8), n$8.x -= r$6[0].m41, n$8.y -= r$6[0].m42) : g(t$7, n$8);
				}
				return a$4.set(t$7, n$8), n$8;
			});
			C(s$6, l$6, i$5);
		} else i$5.x = 0, i$5.y = 0;
	}
	getContainerMatrix() {
		return this._matrixCache.get(this.elementContainer);
	}
	getDragContainerMatrix() {
		return this._matrixCache.get(this.dragContainer);
	}
	updateSize(e$6) {
		if (e$6) this.clientRect.width = e$6.width, this.clientRect.height = e$6.height;
		else {
			let { width: e$7, height: t$6 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$7, this.clientRect.height = t$6;
		}
	}
};
const k = {
	capture: !0,
	passive: !0
}, A = {
	x: 0,
	y: 0
}, j = e$1 ? new DOMMatrix() : null, M$1 = e$1 ? new DOMMatrix() : null;
var N$1 = function(e$6) {
	return e$6[e$6.None = 0] = `None`, e$6[e$6.Init = 1] = `Init`, e$6[e$6.Prepare = 2] = `Prepare`, e$6[e$6.FinishPrepare = 3] = `FinishPrepare`, e$6[e$6.Apply = 4] = `Apply`, e$6[e$6.FinishApply = 5] = `FinishApply`, e$6;
}(N$1 || {}), P = function(e$6) {
	return e$6[e$6.Pending = 0] = `Pending`, e$6[e$6.Resolved = 1] = `Resolved`, e$6[e$6.Rejected = 2] = `Rejected`, e$6;
}(P || {});
const F = {
	Start: `start`,
	Move: `move`,
	End: `end`
}, I = {
	Immediate: `immediate`,
	Sampled: `sampled`
}, L = {
	Start: `start`,
	StartAlign: `start-align`,
	Move: `move`,
	Align: `align`,
	End: `end`,
	EndAlign: `end-align`
}, R = {
	PrepareStart: `preparestart`,
	Start: `start`,
	PrepareMove: `preparemove`,
	Move: `move`,
	End: `end`,
	Destroy: `destroy`
}, z = {
	container: null,
	startPredicate: () => !0,
	elements: () => null,
	frozenStyles: () => null,
	applyPosition: ({ item: e$6, phase: t$6 }) => {
		let n$7 = t$6 === L.End || t$6 === L.EndAlign, [r$5, i$5] = e$6.getContainerMatrix(), [a$4, o$4] = e$6.getDragContainerMatrix(), { position: s$6, alignmentOffset: c$6, containerOffset: l$6, elementTransformMatrix: d$3, elementTransformOrigin: f$3, elementOffsetMatrix: p$3 } = e$6, { x: m$3, y: h$3, z: g$3 } = f$3, _$4 = !d$3.isIdentity && (m$3 !== 0 || h$3 !== 0 || g$3 !== 0), v$4 = s$6.x + c$6.x + l$6.x, y$3 = s$6.y + c$6.y + l$6.y;
		u$2(j), _$4 && (g$3 === 0 ? j.translateSelf(-m$3, -h$3) : j.translateSelf(-m$3, -h$3, -g$3)), n$7 ? i$5.isIdentity || j.multiplySelf(i$5) : o$4.isIdentity || j.multiplySelf(o$4), u$2(M$1).translateSelf(v$4, y$3), j.multiplySelf(M$1), r$5.isIdentity || j.multiplySelf(r$5), _$4 && (u$2(M$1).translateSelf(m$3, h$3, g$3), j.multiplySelf(M$1)), d$3.isIdentity || j.multiplySelf(d$3), p$3.isIdentity || j.preMultiplySelf(p$3), e$6.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$6 }) => e$6.items[0].clientRect || null,
	positionModifiers: [],
	sensorProcessingMode: I.Sampled,
	dndGroups: /* @__PURE__ */ new Set()
};
var B = class {
	constructor(e$6, t$6 = {}) {
		let { id: n$7 = Symbol(),...r$5 } = t$6;
		this.id = n$7, this.sensors = e$6, this.settings = this._parseSettings(r$5), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N$1.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((e$7) => {
			this._sensorData.set(e$7, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (t$8) => this._onMove(t$8, e$7),
				onEnd: (t$8) => this._onEnd(t$8, e$7)
			});
			let { onMove: t$7, onEnd: n$8 } = this._sensorData.get(e$7);
			e$7.on(e.Start, t$7, t$7), e$7.on(e.Move, t$7, t$7), e$7.on(e.Cancel, n$8, n$8), e$7.on(e.End, n$8, n$8), e$7.on(e.Destroy, n$8, n$8);
		});
	}
	_parseSettings(e$6, t$6 = z) {
		let { container: n$7 = t$6.container, startPredicate: r$5 = t$6.startPredicate, elements: i$5 = t$6.elements, frozenStyles: a$4 = t$6.frozenStyles, positionModifiers: o$4 = t$6.positionModifiers, applyPosition: s$6 = t$6.applyPosition, computeClientRect: c$6 = t$6.computeClientRect, sensorProcessingMode: l$6 = t$6.sensorProcessingMode, dndGroups: u$6 = t$6.dndGroups, onPrepareStart: d$3 = t$6.onPrepareStart, onStart: f$3 = t$6.onStart, onPrepareMove: p$3 = t$6.onPrepareMove, onMove: m$3 = t$6.onMove, onEnd: h$3 = t$6.onEnd, onDestroy: g$3 = t$6.onDestroy } = e$6 || {};
		return {
			container: n$7,
			startPredicate: r$5,
			elements: i$5,
			frozenStyles: a$4,
			positionModifiers: o$4,
			applyPosition: s$6,
			computeClientRect: c$6,
			sensorProcessingMode: l$6,
			dndGroups: u$6,
			onPrepareStart: d$3,
			onStart: f$3,
			onPrepareMove: p$3,
			onMove: m$3,
			onEnd: h$3,
			onDestroy: g$3
		};
	}
	_emit(e$6, ...t$6) {
		this._emitter.emit(e$6, ...t$6);
	}
	_onMove(n$7, r$5) {
		let i$5 = this._sensorData.get(r$5);
		if (i$5) switch (i$5.predicateState) {
			case P.Pending: {
				i$5.predicateEvent = n$7;
				let e$6 = this.settings.startPredicate({
					draggable: this,
					sensor: r$5,
					event: n$7
				});
				e$6 === !0 ? this.resolveStartPredicate(r$5) : e$6 === !1 && this.rejectStartPredicate(r$5);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = n$7, this.settings.sensorProcessingMode === I.Immediate ? (this._prepareMove(), this._applyMove()) : (r$1.once(n$2.read, this._prepareMove, this._moveId), r$1.once(n$2.write, this._applyMove, this._moveId)));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$6, t$6) {
		let n$7 = this._sensorData.get(t$6);
		n$7 && (this.drag ? n$7.predicateState === P.Resolved && (this.drag.endEvent = e$6, this._sensorData.forEach((e$7) => {
			e$7.predicateState = P.Pending, e$7.predicateEvent = null;
		}), this.stop()) : (n$7.predicateState = P.Pending, n$7.predicateEvent = null));
	}
	_prepareStart() {
		let e$6 = this.drag;
		e$6 && (this._startPhase = N$1.Prepare, e$6.items = (this.settings.elements({
			draggable: this,
			drag: e$6
		}) || []).map((e$7) => new O(e$7, this)), this._applyModifiers(F.Start, 0, 0), this._emit(R.PrepareStart, e$6.startEvent), this.settings.onPrepareStart?.(e$6, this), this._startPhase = N$1.FinishPrepare);
	}
	_applyStart() {
		let e$6 = this.drag;
		if (e$6) {
			this._startPhase = N$1.Apply;
			for (let t$6 of e$6.items) t$6.dragContainer !== t$6.elementContainer && l$2(t$6.dragContainer, t$6.element), t$6.frozenStyles && Object.assign(t$6.element.style, t$6.frozenStyles), this.settings.applyPosition({
				phase: L.Start,
				draggable: this,
				drag: e$6,
				item: t$6
			});
			for (let t$6 of e$6.items) {
				let e$7 = t$6.getContainerMatrix()[0], n$7 = t$6.getDragContainerMatrix()[0];
				if (s$3(e$7, n$7) || !c$3(e$7) && !c$3(n$7)) continue;
				let r$5 = t$6.element.getBoundingClientRect(), { alignmentOffset: i$5 } = t$6;
				i$5.x += d(t$6.clientRect.x - r$5.x, 3), i$5.y += d(t$6.clientRect.y - r$5.y, 3);
			}
			for (let t$6 of e$6.items) {
				let { alignmentOffset: n$7 } = t$6;
				(n$7.x !== 0 || n$7.y !== 0) && this.settings.applyPosition({
					phase: L.StartAlign,
					draggable: this,
					drag: e$6,
					item: t$6
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(R.Start, e$6.startEvent), this.settings.onStart?.(e$6, this), this._startPhase = N$1.FinishApply;
		}
	}
	_prepareMove() {
		let e$6 = this.drag;
		if (!e$6) return;
		let { moveEvent: t$6, prevMoveEvent: n$7 } = e$6;
		t$6 !== n$7 && (this._applyModifiers(F.Move, t$6.x - n$7.x, t$6.y - n$7.y), this._emit(R.PrepareMove, t$6), !e$6.isEnded && (this.settings.onPrepareMove?.(e$6, this), !e$6.isEnded && (e$6.prevMoveEvent = t$6)));
	}
	_applyMove() {
		let e$6 = this.drag;
		if (e$6) {
			for (let t$6 of e$6.items) t$6._moveDiff.x = 0, t$6._moveDiff.y = 0, this.settings.applyPosition({
				phase: L.Move,
				draggable: this,
				drag: e$6,
				item: t$6
			});
			this._emit(R.Move, e$6.moveEvent), !e$6.isEnded && this.settings.onMove?.(e$6, this);
		}
	}
	_prepareAlign() {
		let { drag: e$6 } = this;
		if (e$6) for (let t$6 of e$6.items) {
			let { x: e$7, y: n$7 } = t$6.element.getBoundingClientRect(), r$5 = t$6.clientRect.x - t$6._moveDiff.x - e$7;
			t$6.alignmentOffset.x = t$6.alignmentOffset.x - t$6._alignDiff.x + r$5, t$6._alignDiff.x = r$5;
			let i$5 = t$6.clientRect.y - t$6._moveDiff.y - n$7;
			t$6.alignmentOffset.y = t$6.alignmentOffset.y - t$6._alignDiff.y + i$5, t$6._alignDiff.y = i$5;
		}
	}
	_applyAlign() {
		let { drag: e$6 } = this;
		if (e$6) for (let t$6 of e$6.items) t$6._alignDiff.x = 0, t$6._alignDiff.y = 0, this.settings.applyPosition({
			phase: L.Align,
			draggable: this,
			drag: e$6,
			item: t$6
		});
	}
	_applyModifiers(e$6, t$6, n$7) {
		let { drag: r$5 } = this;
		if (!r$5) return;
		let { positionModifiers: i$5 } = this.settings;
		for (let a$4 of r$5.items) {
			let o$4 = A;
			o$4.x = t$6, o$4.y = n$7;
			for (let t$7 of i$5) o$4 = t$7(o$4, {
				draggable: this,
				drag: r$5,
				item: a$4,
				phase: e$6
			});
			a$4.position.x += o$4.x, a$4.position.y += o$4.y, a$4.clientRect.x += o$4.x, a$4.clientRect.y += o$4.y, e$6 === `move` && (a$4._moveDiff.x += o$4.x, a$4._moveDiff.y += o$4.y);
		}
	}
	on(e$6, t$6, n$7) {
		return this._emitter.on(e$6, t$6, n$7);
	}
	off(e$6, t$6) {
		this._emitter.off(e$6, t$6);
	}
	resolveStartPredicate(n$7, r$5) {
		let i$5 = this._sensorData.get(n$7);
		if (!i$5) return;
		let a$4 = r$5 || i$5.predicateEvent;
		i$5.predicateState === P.Pending && a$4 && (this._startPhase = N$1.Init, i$5.predicateState = P.Resolved, i$5.predicateEvent = null, this.drag = new p(n$7, a$4), this._sensorData.forEach((e$6, t$6) => {
			t$6 !== n$7 && (e$6.predicateState = P.Rejected, e$6.predicateEvent = null);
		}), this.settings.sensorProcessingMode === I.Immediate ? (this._prepareStart(), this._applyStart()) : (r$1.once(n$2.read, this._prepareStart, this._startId), r$1.once(n$2.write, this._applyStart, this._startId)));
	}
	rejectStartPredicate(e$6) {
		let t$6 = this._sensorData.get(e$6);
		t$6?.predicateState === P.Pending && (t$6.predicateState = P.Rejected, t$6.predicateEvent = null);
	}
	stop() {
		let n$7 = this.drag;
		if (!(!n$7 || n$7.isEnded)) {
			if (this._startPhase === N$1.Prepare || this._startPhase === N$1.Apply) throw Error(`Cannot stop drag start process at this point`);
			n$7.isEnded = !0, this._startPhase === N$1.Init && this._prepareStart(), this._startPhase === N$1.FinishPrepare && this._applyStart(), this._startPhase = N$1.None, r$1.off(n$2.read, this._startId), r$1.off(n$2.write, this._startId), r$1.off(n$2.read, this._moveId), r$1.off(n$2.write, this._moveId), r$1.off(n$2.read, this._alignId), r$1.off(n$2.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), this._applyModifiers(F.End, 0, 0);
			for (let e$6 of n$7.items) {
				if (e$6.elementContainer !== e$6.dragContainer && (l$2(e$6.elementContainer, e$6.element), e$6.alignmentOffset.x = 0, e$6.alignmentOffset.y = 0, e$6.containerOffset.x = 0, e$6.containerOffset.y = 0), e$6.unfrozenStyles) for (let t$6 in e$6.unfrozenStyles) e$6.element.style[t$6] = e$6.unfrozenStyles[t$6] || ``;
				this.settings.applyPosition({
					phase: L.End,
					draggable: this,
					drag: n$7,
					item: e$6
				});
			}
			for (let e$6 of n$7.items) if (e$6.elementContainer !== e$6.dragContainer) {
				let t$6 = e$6.element.getBoundingClientRect();
				e$6.alignmentOffset.x = d(e$6.clientRect.x - t$6.x, 3), e$6.alignmentOffset.y = d(e$6.clientRect.y - t$6.y, 3);
			}
			for (let e$6 of n$7.items) e$6.elementContainer !== e$6.dragContainer && (e$6.alignmentOffset.x !== 0 || e$6.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: L.EndAlign,
				draggable: this,
				drag: n$7,
				item: e$6
			});
			this._emit(R.End, n$7.endEvent), this.settings.onEnd?.(n$7, this), this.drag = null;
		}
	}
	align(n$7 = !1) {
		this.drag && (n$7 || this.settings.sensorProcessingMode === I.Immediate ? (this._prepareAlign(), this._applyAlign()) : (r$1.once(n$2.read, this._prepareAlign, this._alignId), r$1.once(n$2.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$6, settings: t$6 } = this;
		return e$6 && t$6.computeClientRect?.({
			draggable: this,
			drag: e$6
		}) || null;
	}
	updateSettings(e$6 = {}) {
		this.settings = this._parseSettings(e$6, this.settings);
	}
	use(e$6) {
		return e$6(this);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: e$6, onEnd: t$6 }, n$7) => {
			n$7.off(e.Start, e$6), n$7.off(e.Move, e$6), n$7.off(e.Cancel, t$6), n$7.off(e.End, t$6), n$7.off(e.Destroy, t$6);
		}), this._sensorData.clear(), this._emit(R.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/droppable-BW9Ygu-q.js
const t$2 = { Destroy: `destroy` };
var n = class {
	constructor(t$6, n$7 = {}) {
		let { id: r$5 = Symbol(), accept: i$5 = () => !0, data: a$4 = {} } = n$7;
		this.id = r$5, this.element = t$6, this.accept = i$5, this.data = a$4, this.isDestroyed = !1, this._clientRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}, this._emitter = new v(), this.updateClientRect();
	}
	on(e$6, t$6, n$7) {
		return this._emitter.on(e$6, t$6, n$7);
	}
	off(e$6, t$6) {
		this._emitter.off(e$6, t$6);
	}
	getClientRect() {
		return this._clientRect;
	}
	updateClientRect(e$6) {
		let t$6 = e$6 || this.element.getBoundingClientRect(), { _clientRect: n$7 } = this;
		n$7.x = t$6.x, n$7.y = t$6.y, n$7.width = t$6.width, n$7.height = t$6.height;
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this._emitter.emit(t$2.Destroy), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/dnd-context-CuyeEdWl.js
var s$2 = function(e$6) {
	return e$6[e$6.Idle = 0] = `Idle`, e$6[e$6.Computing = 1] = `Computing`, e$6[e$6.Computed = 2] = `Computed`, e$6[e$6.Emitting = 3] = `Emitting`, e$6;
}(s$2 || {});
const c$2 = {
	capture: !0,
	passive: !0
}, l = {
	Start: `start`,
	Move: `move`,
	Enter: `enter`,
	Leave: `leave`,
	Collide: `collide`,
	End: `end`,
	AddDraggables: `addDraggables`,
	RemoveDraggables: `removeDraggables`,
	AddDroppables: `addDroppables`,
	RemoveDroppables: `removeDroppables`,
	Destroy: `destroy`
};
var u = class {
	constructor(r$5 = {}) {
		this._onScroll = () => {
			this._drags.size !== 0 && (r$1.once(n$2.read, () => {
				this.updateDroppableClientRects();
			}, this._listenerId), this.detectCollisions());
		};
		let { collisionDetector: i$5 } = r$5;
		this.draggables = /* @__PURE__ */ new Map(), this.droppables = /* @__PURE__ */ new Map(), this.isDestroyed = !1, this._drags = /* @__PURE__ */ new Map(), this._listenerId = Symbol(), this._emitter = new v(), this._onScroll = this._onScroll.bind(this), this._collisionDetector = i$5 ? i$5(this) : new a$3(this);
	}
	get drags() {
		return this._drags;
	}
	_isMatch(e$6, t$6) {
		let n$7 = !1;
		if (typeof t$6.accept == `function`) n$7 = t$6.accept(e$6);
		else {
			let r$5 = e$6.settings.dndGroups, i$5 = t$6.accept;
			if (!r$5 || r$5.size === 0 || i$5.size === 0) return !1;
			let a$4 = i$5.size < r$5.size, o$4 = a$4 ? i$5 : r$5, s$6 = a$4 ? r$5 : i$5;
			for (let e$7 of o$4) s$6.has(e$7) && (n$7 = !0);
		}
		if (n$7 && e$6.drag) {
			let n$8 = e$6.drag.items;
			for (let e$7 = 0; e$7 < n$8.length; e$7++) if (n$8[e$7].element === t$6.element) return !1;
		}
		return n$7;
	}
	_getTargets(e$6) {
		let t$6 = this._drags.get(e$6);
		if (t$6?._targets) return t$6._targets;
		let n$7 = /* @__PURE__ */ new Map();
		for (let t$7 of this.droppables.values()) this._isMatch(e$6, t$7) && n$7.set(t$7.id, t$7);
		return t$6 && (t$6._targets = n$7), n$7;
	}
	_onDragPrepareStart(e$6) {
		this.draggables.has(e$6.id) && (this._drags.get(e$6) || (this._drags.set(e$6, {
			isEnded: !1,
			data: {},
			_targets: null,
			_cd: {
				phase: s$2.Idle,
				tickerId: Symbol(),
				targets: /* @__PURE__ */ new Map(),
				collisions: [],
				contacts: /* @__PURE__ */ new Set(),
				prevContacts: /* @__PURE__ */ new Set(),
				addedContacts: /* @__PURE__ */ new Set(),
				persistedContacts: /* @__PURE__ */ new Set()
			}
		}), this._drags.size === 1 && this.updateDroppableClientRects(), this._computeCollisions(e$6), this._drags.size === 1 && window.addEventListener(`scroll`, this._onScroll, c$2)));
	}
	_onDragStart(e$6) {
		let t$6 = this._drags.get(e$6);
		if (!(!t$6 || t$6.isEnded)) {
			if (this._emitter.listenerCount(l.Start)) {
				let t$7 = this._getTargets(e$6);
				this._emitter.emit(l.Start, {
					draggable: e$6,
					targets: t$7
				});
			}
			this._emitCollisions(e$6);
		}
	}
	_onDragPrepareMove(e$6) {
		let t$6 = this._drags.get(e$6);
		!t$6 || t$6.isEnded || this._computeCollisions(e$6);
	}
	_onDragMove(e$6) {
		let t$6 = this._drags.get(e$6);
		if (!(!t$6 || t$6.isEnded)) {
			if (this._emitter.listenerCount(l.Move)) {
				let t$7 = this._getTargets(e$6);
				this._emitter.emit(l.Move, {
					draggable: e$6,
					targets: t$7
				});
			}
			this._emitCollisions(e$6);
		}
	}
	_onDragEnd(e$6) {
		this._stopDrag(e$6);
	}
	_onDragCancel(e$6) {
		this._stopDrag(e$6, !0);
	}
	_onDraggableDestroy(e$6) {
		this.removeDraggables([e$6]);
	}
	_stopDrag(e$6, t$6 = !1) {
		let n$7 = this._drags.get(e$6);
		if (!n$7 || n$7.isEnded) return !1;
		n$7.isEnded = !0;
		let r$5 = n$7._cd.phase === s$2.Emitting;
		r$5 || (this._computeCollisions(e$6, !0), this._emitCollisions(e$6, !0));
		let { targets: i$5, collisions: a$4, contacts: o$4 } = n$7._cd;
		return this._emitter.listenerCount(l.End) && this._emitter.emit(l.End, {
			canceled: t$6,
			draggable: e$6,
			targets: i$5,
			collisions: a$4,
			contacts: o$4
		}), r$5 ? (window.queueMicrotask(() => {
			this._finalizeStopDrag(e$6);
		}), !0) : (this._finalizeStopDrag(e$6), !1);
	}
	_finalizeStopDrag(n$7) {
		let r$5 = this._drags.get(n$7);
		!r$5 || !r$5.isEnded || (this._drags.delete(n$7), this._collisionDetector.removeCollisionDataPool(n$7), r$1.off(n$2.read, r$5._cd.tickerId), r$1.off(n$2.write, r$5._cd.tickerId), this._drags.size || (r$1.off(n$2.read, this._listenerId), window.removeEventListener(`scroll`, this._onScroll, c$2)));
	}
	_computeCollisions(e$6, t$6 = !1) {
		let n$7 = this._drags.get(e$6);
		if (!n$7 || !t$6 && n$7.isEnded) return;
		let r$5 = n$7._cd;
		switch (r$5.phase) {
			case s$2.Computing: throw Error(`Collisions are being computed.`);
			case s$2.Emitting: throw Error(`Collisions are being emitted.`);
			default: break;
		}
		r$5.phase = s$2.Computing, r$5.targets = this._getTargets(e$6), this._collisionDetector.detectCollisions(e$6, r$5.targets, r$5.collisions), r$5.phase = s$2.Computed;
	}
	_emitCollisions(e$6, t$6 = !1) {
		let n$7 = this._drags.get(e$6);
		if (!n$7 || !t$6 && n$7.isEnded) return;
		let r$5 = n$7._cd;
		switch (r$5.phase) {
			case s$2.Computing: throw Error(`Collisions are being computed.`);
			case s$2.Emitting: throw Error(`Collisions are being emitted.`);
			case s$2.Idle: return;
			default: break;
		}
		r$5.phase = s$2.Emitting;
		let i$5 = this._emitter, a$4 = r$5.collisions, o$4 = r$5.targets, c$6 = r$5.addedContacts, u$6 = r$5.persistedContacts, d$3 = r$5.contacts, f$3 = r$5.prevContacts;
		r$5.prevContacts = d$3, r$5.contacts = f$3;
		let p$3 = d$3;
		c$6.clear(), u$6.clear(), f$3.clear();
		for (let e$7 of a$4) {
			let t$7 = o$4.get(e$7.droppableId);
			t$7 && (f$3.add(t$7), d$3.has(t$7) ? (u$6.add(t$7), d$3.delete(t$7)) : c$6.add(t$7));
		}
		d$3.size && i$5.listenerCount(l.Leave) && i$5.emit(l.Leave, {
			draggable: e$6,
			targets: o$4,
			collisions: a$4,
			contacts: f$3,
			removedContacts: p$3
		}), c$6.size && i$5.listenerCount(l.Enter) && i$5.emit(l.Enter, {
			draggable: e$6,
			targets: o$4,
			collisions: a$4,
			contacts: f$3,
			addedContacts: c$6
		}), i$5.listenerCount(l.Collide) && (f$3.size || p$3.size) && i$5.emit(l.Collide, {
			draggable: e$6,
			targets: o$4,
			collisions: a$4,
			contacts: f$3,
			addedContacts: c$6,
			removedContacts: p$3,
			persistedContacts: u$6
		}), c$6.clear(), u$6.clear(), d$3.clear(), r$5.phase = s$2.Idle;
	}
	on(e$6, t$6, n$7) {
		return this._emitter.on(e$6, t$6, n$7);
	}
	off(e$6, t$6) {
		this._emitter.off(e$6, t$6);
	}
	updateDroppableClientRects() {
		for (let e$6 of this.droppables.values()) e$6.updateClientRect();
	}
	clearTargets(e$6) {
		if (e$6) {
			let t$6 = this._drags.get(e$6);
			t$6 && (t$6._targets = null);
		} else for (let e$7 of this._drags.values()) e$7._targets = null;
	}
	detectCollisions(n$7) {
		if (!this.isDestroyed) if (n$7) {
			let r$5 = this._drags.get(n$7);
			if (!r$5 || r$5.isEnded) return;
			r$1.once(n$2.read, () => this._computeCollisions(n$7), r$5._cd.tickerId), r$1.once(n$2.write, () => this._emitCollisions(n$7), r$5._cd.tickerId);
		} else for (let [n$8, r$5] of this._drags) r$5.isEnded || (r$1.once(n$2.read, () => this._computeCollisions(n$8), r$5._cd.tickerId), r$1.once(n$2.write, () => this._emitCollisions(n$8), r$5._cd.tickerId));
	}
	addDraggables(e$6) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$6) this.draggables.has(n$7.id) || (t$6.add(n$7), this.draggables.set(n$7.id, n$7), n$7.on(R.PrepareStart, () => {
			this._onDragPrepareStart(n$7);
		}, this._listenerId), n$7.on(R.Start, () => {
			this._onDragStart(n$7);
		}, this._listenerId), n$7.on(R.PrepareMove, () => {
			this._onDragPrepareMove(n$7);
		}, this._listenerId), n$7.on(R.Move, () => {
			this._onDragMove(n$7);
		}, this._listenerId), n$7.on(R.End, (e$7) => {
			e$7?.type === e.End ? this._onDragEnd(n$7) : e$7?.type === e.Cancel && this._onDragCancel(n$7);
		}, this._listenerId), n$7.on(R.Destroy, () => {
			this._onDraggableDestroy(n$7);
		}, this._listenerId));
		if (t$6.size) {
			this._emitter.listenerCount(l.AddDraggables) && this._emitter.emit(l.AddDraggables, { draggables: t$6 });
			for (let e$7 of t$6) if (!this.isDestroyed && e$7.drag && !e$7.drag.isEnded) {
				let t$7 = e$7._startPhase;
				t$7 >= 2 && this._onDragPrepareStart(e$7), t$7 >= 4 && this._onDragStart(e$7);
			}
		}
	}
	removeDraggables(e$6) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$6) this.draggables.has(n$7.id) && (t$6.add(n$7), this.draggables.delete(n$7.id), n$7.off(R.PrepareStart, this._listenerId), n$7.off(R.Start, this._listenerId), n$7.off(R.PrepareMove, this._listenerId), n$7.off(R.Move, this._listenerId), n$7.off(R.End, this._listenerId), n$7.off(R.Destroy, this._listenerId));
		for (let e$7 of t$6) this._stopDrag(e$7, !0);
		this._emitter.listenerCount(l.RemoveDraggables) && this._emitter.emit(l.RemoveDraggables, { draggables: t$6 });
	}
	addDroppables(e$6) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$6) this.droppables.has(n$7.id) || (t$6.add(n$7), this.droppables.set(n$7.id, n$7), n$7.on(t$2.Destroy, () => {
			this.removeDroppables([n$7]);
		}, this._listenerId), this._drags.forEach(({ _targets: e$7 }, t$7) => {
			e$7 && this._isMatch(t$7, n$7) && (e$7.set(n$7.id, n$7), this.detectCollisions(t$7));
		}));
		t$6.size && this._emitter.listenerCount(l.AddDroppables) && this._emitter.emit(l.AddDroppables, { droppables: t$6 });
	}
	removeDroppables(e$6) {
		if (this.isDestroyed) return;
		let t$6 = /* @__PURE__ */ new Set();
		for (let n$7 of e$6) this.droppables.has(n$7.id) && (this.droppables.delete(n$7.id), t$6.add(n$7), n$7.off(t$2.Destroy, this._listenerId), this._drags.forEach(({ _targets: e$7 }, t$7) => {
			e$7 && e$7.has(n$7.id) && (e$7.delete(n$7.id), this.detectCollisions(t$7));
		}));
		t$6.size && this._emitter.listenerCount(l.RemoveDroppables) && this._emitter.emit(l.RemoveDroppables, { droppables: t$6 });
	}
	destroy() {
		if (this.isDestroyed) return;
		this.isDestroyed = !0, this.draggables.forEach((e$7) => {
			e$7.off(R.PrepareStart, this._listenerId), e$7.off(R.Start, this._listenerId), e$7.off(R.PrepareMove, this._listenerId), e$7.off(R.Move, this._listenerId), e$7.off(R.End, this._listenerId), e$7.off(R.Destroy, this._listenerId);
		}), this.droppables.forEach((e$7) => {
			e$7.off(t$2.Destroy, this._listenerId);
		});
		let e$6 = this._drags.keys();
		for (let t$6 of e$6) this._stopDrag(t$6, !0);
		this._emitter.emit(l.Destroy), this._emitter.off(), this._collisionDetector.destroy(), this.draggables.clear(), this.droppables.clear();
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-CyG2cFYy.js
function i$3(e$6, t$6) {
	if (`pointerId` in e$6) return e$6.pointerId === t$6 ? e$6 : null;
	if (`changedTouches` in e$6) {
		let n$7 = 0;
		for (; n$7 < e$6.changedTouches.length; n$7++) if (e$6.changedTouches[n$7].identifier === t$6) return e$6.changedTouches[n$7];
		return null;
	}
	return e$6;
}
function a$2(e$6) {
	return `pointerId` in e$6 ? e$6.pointerId : `changedTouches` in e$6 ? e$6.changedTouches[0] ? e$6.changedTouches[0].identifier : null : -1;
}
function o$1(e$6) {
	return `pointerType` in e$6 ? e$6.pointerType : `touches` in e$6 ? `touch` : `mouse`;
}
function s$1(e$6 = {}) {
	let { capture: t$6 = !0, passive: n$7 = !0 } = e$6;
	return {
		capture: t$6,
		passive: n$7
	};
}
function c$1(n$7) {
	return n$7 === `auto` || n$7 === void 0 ? n$4 ? `pointer` : t$1 ? `touch` : `mouse` : n$7;
}
const l$1 = {
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
};
var u$1 = class {
	constructor(e$6, t$6 = {}) {
		let { listenerOptions: n$7 = {}, sourceEvents: i$5 = `auto`, startPredicate: a$4 = (e$7) => !(`button` in e$7 && e$7.button > 0) } = t$6;
		this.element = e$6, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$4, this._listenerOptions = s$1(n$7), this._sourceEvents = c$1(i$5), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$6.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$6) {
		return this.drag ? i$3(e$6, this.drag.pointerId) : null;
	}
	_onStart(e$6) {
		if (this.isDestroyed || this.drag || !this._startPredicate(e$6)) return;
		let t$6 = a$2(e$6);
		if (t$6 === null) return;
		let r$5 = i$3(e$6, t$6);
		if (r$5 === null) return;
		let s$6 = {
			pointerId: t$6,
			pointerType: o$1(e$6),
			x: r$5.clientX,
			y: r$5.clientY
		};
		this.drag = s$6;
		let c$6 = {
			...s$6,
			type: e.Start,
			srcEvent: e$6,
			target: r$5.target
		};
		this._emitter.emit(c$6.type, c$6), this.drag && this._bindWindowListeners();
	}
	_onMove(e$6) {
		if (!this.drag) return;
		let t$6 = this._getTrackedPointerEventData(e$6);
		if (!t$6) return;
		this.drag.x = t$6.clientX, this.drag.y = t$6.clientY;
		let r$5 = {
			type: e.Move,
			srcEvent: e$6,
			target: t$6.target,
			...this.drag
		};
		this._emitter.emit(r$5.type, r$5);
	}
	_onCancel(e$6) {
		if (!this.drag) return;
		let t$6 = this._getTrackedPointerEventData(e$6);
		if (!t$6) return;
		this.drag.x = t$6.clientX, this.drag.y = t$6.clientY;
		let r$5 = {
			type: e.Cancel,
			srcEvent: e$6,
			target: t$6.target,
			...this.drag
		};
		this._emitter.emit(r$5.type, r$5), this._resetDrag();
	}
	_onEnd(e$6) {
		if (!this.drag) return;
		let t$6 = this._getTrackedPointerEventData(e$6);
		if (!t$6) return;
		this.drag.x = t$6.clientX, this.drag.y = t$6.clientY;
		let r$5 = {
			type: e.End,
			srcEvent: e$6,
			target: t$6.target,
			...this.drag
		};
		this._emitter.emit(r$5.type, r$5), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$6, end: t$6, cancel: n$7 } = l$1[this._sourceEvents];
		window.addEventListener(e$6, this._onMove, this._listenerOptions), window.addEventListener(t$6, this._onEnd, this._listenerOptions), n$7 && window.addEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$6, end: t$6, cancel: n$7 } = l$1[this._sourceEvents];
			window.removeEventListener(e$6, this._onMove, this._listenerOptions), window.removeEventListener(t$6, this._onEnd, this._listenerOptions), n$7 && window.removeEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let e$6 = {
			type: e.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(e$6.type, e$6), this._resetDrag();
	}
	updateSettings(e$6) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$6, sourceEvents: n$7, startPredicate: r$5 } = e$6, i$5 = c$1(n$7), a$4 = s$1(t$6);
		r$5 && this._startPredicate !== r$5 && (this._startPredicate = r$5), (t$6 && (this._listenerOptions.capture !== a$4.capture || this._listenerOptions.passive === a$4.passive) || n$7 && this._sourceEvents !== i$5) && (this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$7 && (this._sourceEvents = i$5), t$6 && a$4 && (this._listenerOptions = a$4), this.element.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$6, t$6, n$7) {
		return this._emitter.on(e$6, t$6, n$7);
	}
	off(e$6, t$6) {
		this._emitter.off(e$6, t$6);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/auto-scroll-BjLM0PHw.js
const t = new N();

//#endregion
//#region ../dragdoll/dist/auto-scroll-plugin-KDmgXWVX.js
const r$2 = {
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
		speed: M(),
		smoothStop: !1,
		getPosition: (e$6) => {
			let { drag: t$6 } = e$6, n$7 = t$6?.items[0];
			if (n$7) return n$7.position;
			let i$5 = t$6 && (t$6.moveEvent || t$6.startEvent);
			return r$2.x = i$5 ? i$5.x : 0, r$2.y = i$5 ? i$5.y : 0, r$2;
		},
		getClientRect: (e$6) => {
			let { drag: t$6 } = e$6, n$7 = e$6.getClientRect();
			if (n$7) return n$7;
			let r$5 = t$6 && (t$6.moveEvent || t$6.startEvent);
			return i$2.width = r$5 ? 50 : 0, i$2.height = r$5 ? 50 : 0, i$2.x = r$5 ? r$5.x - 25 : 0, i$2.y = r$5 ? r$5.y - 25 : 0, i$2;
		},
		onStart: null,
		onStop: null
	};
}
var o = class {
	constructor(e$6, t$6) {
		this._draggableAutoScroll = e$6, this._draggable = t$6, this._position = {
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
		let { targets: e$6 } = this._getSettings();
		return typeof e$6 == `function` && (e$6 = e$6(this._draggable)), e$6;
	}
	get position() {
		let e$6 = this._position, { getPosition: t$6 } = this._getSettings();
		return typeof t$6 == `function` ? Object.assign(e$6, t$6(this._draggable)) : (e$6.x = 0, e$6.y = 0), e$6;
	}
	get clientRect() {
		let e$6 = this._clientRect, { getClientRect: t$6 } = this._getSettings();
		return typeof t$6 == `function` ? Object.assign(e$6, t$6(this._draggable)) : (e$6.width = 0, e$6.height = 0, e$6.x = 0, e$6.y = 0), e$6;
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
	constructor(e$6, r$5 = {}) {
		this.name = `autoscroll`, this.version = `0.0.3`, this.settings = this._parseSettings(r$5), this._autoScrollProxy = null, e$6.on(R.Start, () => {
			this._autoScrollProxy || (this._autoScrollProxy = new o(this, e$6), t.addItem(this._autoScrollProxy));
		}), e$6.on(R.End, () => {
			this._autoScrollProxy &&= (t.removeItem(this._autoScrollProxy), null);
		});
	}
	_parseSettings(e$6, t$6 = a$1()) {
		let { targets: n$7 = t$6.targets, inertAreaSize: r$5 = t$6.inertAreaSize, speed: i$5 = t$6.speed, smoothStop: o$4 = t$6.smoothStop, getPosition: s$6 = t$6.getPosition, getClientRect: c$6 = t$6.getClientRect, onStart: l$6 = t$6.onStart, onStop: u$6 = t$6.onStop } = e$6 || {};
		return {
			targets: n$7,
			inertAreaSize: r$5,
			speed: i$5,
			smoothStop: o$4,
			getPosition: s$6,
			getClientRect: c$6,
			onStart: l$6,
			onStop: u$6
		};
	}
	updateSettings(e$6 = {}) {
		this.settings = this._parseSettings(e$6, this.settings);
	}
};
function c(e$6) {
	return (t$6) => {
		let n$7 = new s(t$6, e$6), r$5 = t$6;
		return r$5.plugins[n$7.name] = n$7, r$5;
	};
}

//#endregion
//#region ../dragdoll/dist/base-sensor-6CQrwFkA.js
var n$3 = class {
	constructor() {
		this.drag = null, this.isDestroyed = !1, this._emitter = new v();
	}
	_createDragData(e$6) {
		return {
			x: e$6.x,
			y: e$6.y
		};
	}
	_updateDragData(e$6) {
		this.drag && (this.drag.x = e$6.x, this.drag.y = e$6.y);
	}
	_resetDragData() {
		this.drag = null;
	}
	_start(t$6) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$6), this._emitter.emit(e.Start, t$6));
	}
	_move(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e.Move, t$6));
	}
	_end(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e.End, t$6), this._resetDragData());
	}
	_cancel(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e.Cancel, t$6), this._resetDragData());
	}
	on(e$6, t$6, n$7) {
		return this._emitter.on(e$6, t$6, n$7);
	}
	off(e$6, t$6) {
		this._emitter.off(e$6, t$6);
	}
	cancel() {
		this.drag && this._cancel({
			type: e.Cancel,
			x: this.drag.x,
			y: this.drag.y
		});
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/base-motion-sensor-DuT5ttYp.js
var i = class extends n$3 {
	constructor() {
		super(), this.drag = null, this._direction = {
			x: 0,
			y: 0
		}, this._speed = 0, this._tick = this._tick.bind(this);
	}
	_createDragData(e$6) {
		return {
			...super._createDragData(e$6),
			time: 0,
			deltaTime: 0
		};
	}
	_start(n$7) {
		this.isDestroyed || this.drag || (super._start(n$7), r$1.on(n$2.read, this._tick, this._tick));
	}
	_end(n$7) {
		this.drag && (r$1.off(n$2.read, this._tick), super._end(n$7));
	}
	_cancel(n$7) {
		this.drag && (r$1.off(n$2.read, this._tick), super._cancel(n$7));
	}
	_tick(e$6) {
		if (this.drag) if (e$6 && this.drag.time) {
			this.drag.deltaTime = e$6 - this.drag.time, this.drag.time = e$6;
			let t$6 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, t$6), !this.drag) return;
			let r$5 = this._speed * (this.drag.deltaTime / 1e3), i$5 = this._direction.x * r$5, a$4 = this._direction.y * r$5;
			(i$5 || a$4) && this._move({
				type: e.Move,
				x: this.drag.x + i$5,
				y: this.drag.y + a$4
			});
		} else this.drag.time = e$6, this.drag.deltaTime = 0;
	}
};

//#endregion
//#region ../dragdoll/dist/keyboard-motion-sensor-Cgfa6qtI.js
const n$1 = [
	`start`,
	`cancel`,
	`end`,
	`moveLeft`,
	`moveRight`,
	`moveUp`,
	`moveDown`
];
function r(e$6, t$6) {
	if (!e$6.size || !t$6.size) return Infinity;
	let n$7 = Infinity;
	for (let r$5 of e$6) {
		let e$7 = t$6.get(r$5);
		e$7 !== void 0 && e$7 < n$7 && (n$7 = e$7);
	}
	return n$7;
}
const i$1 = {
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
	startPredicate: (e$6, t$6) => {
		if (t$6.element && document.activeElement === t$6.element) {
			let { left: e$7, top: n$7 } = t$6.element.getBoundingClientRect();
			return {
				x: e$7,
				y: n$7
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$6, t$6 = {}) {
		super();
		let { startPredicate: n$7 = i$1.startPredicate, computeSpeed: r$5 = i$1.computeSpeed, cancelOnVisibilityChange: a$4 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$4 = i$1.cancelOnBlur, startKeys: s$6 = i$1.startKeys, moveLeftKeys: c$6 = i$1.moveLeftKeys, moveRightKeys: l$6 = i$1.moveRightKeys, moveUpKeys: u$6 = i$1.moveUpKeys, moveDownKeys: d$3 = i$1.moveDownKeys, cancelKeys: f$3 = i$1.cancelKeys, endKeys: p$3 = i$1.endKeys } = t$6;
		this.element = e$6, this._startKeys = new Set(s$6), this._cancelKeys = new Set(f$3), this._endKeys = new Set(p$3), this._moveLeftKeys = new Set(c$6), this._moveRightKeys = new Set(l$6), this._moveUpKeys = new Set(u$6), this._moveDownKeys = new Set(d$3), this._moveKeys = new Set([
			...c$6,
			...l$6,
			...u$6,
			...d$3
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$4, this._cancelOnVisibilityChange = a$4, this._computeSpeed = r$5, this._startPredicate = n$7, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$4 && e$6?.addEventListener(`blur`, this._blurCancelHandler), a$4 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_end(e$6) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._end(e$6));
	}
	_cancel(e$6) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._cancel(e$6));
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
		let e$6 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$6 = r(this._moveRightKeys, this._moveKeyTimestamps), n$7 = r(this._moveUpKeys, this._moveKeyTimestamps), i$5 = r(this._moveDownKeys, this._moveKeyTimestamps), a$4 = e$6 === t$6 ? 0 : e$6 < t$6 ? -1 : 1, o$4 = n$7 === i$5 ? 0 : n$7 < i$5 ? -1 : 1;
		if (!(a$4 === 0 || o$4 === 0)) {
			let e$7 = 1 / (Math.sqrt(a$4 * a$4 + o$4 * o$4) || 1);
			a$4 *= e$7, o$4 *= e$7;
		}
		this._direction.x = a$4, this._direction.y = o$4;
	}
	_onTick() {
		this._speed = this._computeSpeed(this);
	}
	_onKeyUp(e$6) {
		this._moveKeyTimestamps.get(e$6.key) && (this._moveKeyTimestamps.delete(e$6.key), this._updateDirection());
	}
	_onKeyDown(t$6) {
		if (!this.drag) {
			if (this._startKeys.has(t$6.key)) {
				let n$7 = this._startPredicate(t$6, this);
				n$7 && (t$6.preventDefault(), this._start({
					type: e.Start,
					x: n$7.x,
					y: n$7.y
				}));
			}
			return;
		}
		if (this._cancelKeys.has(t$6.key)) {
			t$6.preventDefault(), this._internalCancel();
			return;
		}
		if (this._endKeys.has(t$6.key)) {
			t$6.preventDefault(), this._end({
				type: e.End,
				x: this.drag.x,
				y: this.drag.y
			});
			return;
		}
		if (this._moveKeys.has(t$6.key)) {
			t$6.preventDefault(), this._moveKeyTimestamps.get(t$6.key) || (this._moveKeyTimestamps.set(t$6.key, Date.now()), this._updateDirection());
			return;
		}
	}
	updateSettings(e$6 = {}) {
		let t$6 = !1, { cancelOnBlur: r$5, cancelOnVisibilityChange: i$5, startPredicate: a$4, computeSpeed: o$4 } = e$6;
		if (r$5 !== void 0 && this._cancelOnBlur !== r$5 && (this._cancelOnBlur = r$5, r$5 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$5 !== void 0 && this._cancelOnVisibilityChange !== i$5 && (this._cancelOnVisibilityChange = i$5, i$5 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$4 !== void 0 && (this._startPredicate = a$4), o$4 !== void 0 && (this._computeSpeed = o$4), n$1.forEach((n$7, r$6) => {
			let i$6 = `${n$7}Keys`, a$5 = e$6[i$6];
			a$5 !== void 0 && (this[`_${i$6}`] = new Set(a$5), r$6 >= 3 && (t$6 = !0));
		}), t$6) {
			let e$7 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$7, n$7) => e$7[n$7] === t$7) || (this._moveKeys = new Set(e$7), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/012-dnd-advanced-collision-detector/index.ts
const bestMatchMap = /* @__PURE__ */ new Map();
const scrollContainers = [...document.querySelectorAll(".scroll-list")];
const draggableElements = [...document.querySelectorAll(".draggable")];
const droppableElements = [...document.querySelectorAll(".droppable")];
const dndContext = new u({ collisionDetector: (ctx) => new y(ctx) });
const droppables = [];
for (const droppableElement of droppableElements) {
	const droppable = new n(droppableElement);
	droppables.push(droppable);
}
const draggables = [];
for (const draggableElement of draggableElements) {
	const draggable = new B([new u$1(draggableElement), new a(draggableElement)], {
		elements: () => [draggableElement],
		container: document.body,
		frozenStyles: () => ["width", "height"],
		startPredicate: () => !draggableElement.classList.contains("animate"),
		onStart: () => {
			draggableElement.classList.add("dragging");
		},
		onEnd: () => {
			draggableElement.classList.remove("dragging");
		}
	}).use(c({ targets: scrollContainers.map((scrollContainer) => ({
		element: scrollContainer,
		axis: "y",
		padding: {
			top: 0,
			bottom: 0
		}
	})) }));
	draggables.push(draggable);
}
dndContext.addDroppables(droppables);
dndContext.addDraggables(draggables);
dndContext.on(l.Collide, ({ draggable, contacts }) => {
	const draggableElement = draggable.drag?.items[0].element;
	if (!draggableElement) return;
	const draggableId = draggableElement.getAttribute("data-id") || "";
	if (draggableId === "") return;
	let nextBestMatch = null;
	for (const droppable of contacts) {
		const containedDraggableId = droppable.element.getAttribute("data-draggable-contained") || "";
		if (containedDraggableId && containedDraggableId !== draggableId) continue;
		const overDraggableId = droppable.element.getAttribute("data-draggable-over") || "";
		if (overDraggableId && overDraggableId !== draggableId) continue;
		nextBestMatch = droppable;
		break;
	}
	const bestMatch = bestMatchMap.get(draggable);
	if (nextBestMatch !== null && nextBestMatch !== bestMatch) {
		bestMatch?.element.removeAttribute("data-draggable-over");
		nextBestMatch.element.setAttribute("data-draggable-over", draggableId);
		bestMatchMap.set(draggable, nextBestMatch);
	}
});
dndContext.on(l.End, ({ draggable, canceled }) => {
	const draggableElement = draggable.drag?.items[0].element;
	if (!draggableElement) return;
	const bestMatch = bestMatchMap.get(draggable);
	const originalContainer = draggableElement.parentElement;
	const targetContainer = !canceled && bestMatch ? bestMatch.element : originalContainer;
	if (originalContainer !== targetContainer) {
		const offsetData = getOffset(originalContainer, targetContainer);
		const transformString = `translate(${offsetData.left}px, ${offsetData.top}px) ${draggableElement.style.transform}`;
		draggableElement.style.transform = transformString;
		targetContainer.appendChild(draggableElement);
		originalContainer.removeAttribute("data-draggable-contained");
		targetContainer.setAttribute("data-draggable-contained", draggableElement.getAttribute("data-id"));
	}
	if (!new DOMMatrix().setMatrixValue(draggableElement.style.transform).isIdentity) {
		draggableElement.classList.add("animate");
		const onTransitionEnd = (e$6) => {
			if (e$6.target === draggableElement && e$6.propertyName === "transform") {
				draggableElement.classList.remove("animate");
				document.body.removeEventListener("transitionend", onTransitionEnd);
			}
		};
		document.body.addEventListener("transitionend", onTransitionEnd);
		draggableElement.clientHeight;
		draggableElement.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
	}
	bestMatch?.element.removeAttribute("data-draggable-over");
	bestMatchMap.delete(draggable);
});

//#endregion
});