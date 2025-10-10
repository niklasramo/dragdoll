(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region dist/sensor-TzqXogk2.js
const e$2 = {
	Start: `start`,
	Move: `move`,
	Cancel: `cancel`,
	End: `end`,
	Destroy: `destroy`
};

//#endregion
//#region node_modules/eventti/dist/index.js
var E$2 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$2, v$1 = class {
	constructor(t$6 = {}) {
		this.dedupe = t$6.dedupe || E$2.ADD, this.getId = t$6.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$6) {
		let n$5 = this._events.get(t$6);
		return n$5 ? n$5.l || (n$5.l = [...n$5.m.values()]) : null;
	}
	on(t$6, n$5, e$5) {
		let i$4 = this._events, s$4 = i$4.get(t$6);
		s$4 || (s$4 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$4.set(t$6, s$4));
		let o$4 = s$4.m;
		if (e$5 = e$5 === r$2 ? this.getId(n$5) : e$5, o$4.has(e$5)) switch (this.dedupe) {
			case E$2.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$2.IGNORE: return e$5;
			case E$2.UPDATE:
				s$4.l = null;
				break;
			default: o$4.delete(e$5), s$4.l = null;
		}
		return o$4.set(e$5, n$5), s$4.l?.push(n$5), e$5;
	}
	once(t$6, n$5, e$5) {
		let i$4 = 0;
		return e$5 = e$5 === r$2 ? this.getId(n$5) : e$5, this.on(t$6, (...s$4) => {
			i$4 || (i$4 = 1, this.off(t$6, e$5), n$5(...s$4));
		}, e$5);
	}
	off(t$6, n$5) {
		if (t$6 === r$2) {
			this._events.clear();
			return;
		}
		if (n$5 === r$2) {
			this._events.delete(t$6);
			return;
		}
		let e$5 = this._events.get(t$6);
		e$5?.m.delete(n$5) && (e$5.l = null, e$5.m.size || this._events.delete(t$6));
	}
	emit(t$6, ...n$5) {
		let e$5 = this._getListeners(t$6);
		if (e$5) {
			let i$4 = e$5.length, s$4 = 0;
			if (n$5.length) for (; s$4 < i$4; s$4++) e$5[s$4](...n$5);
			else for (; s$4 < i$4; s$4++) e$5[s$4]();
		}
	}
	listenerCount(t$6) {
		if (t$6 === r$2) {
			let n$5 = 0;
			return this._events.forEach((e$5) => {
				n$5 += e$5.m.size;
			}), n$5;
		}
		return this._events.get(t$6)?.m.size || 0;
	}
};

//#endregion
//#region node_modules/tikki/dist/index.js
var _$2 = E$2, o$3 = class {
	constructor(e$5 = {}) {
		let { phases: t$6 = [], dedupe: r$3, getId: s$4 } = e$5;
		this._phases = t$6, this._emitter = new v$1({
			getId: s$4,
			dedupe: r$3
		}), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
	}
	get phases() {
		return this._phases;
	}
	set phases(e$5) {
		this._phases = e$5;
	}
	get dedupe() {
		return this._emitter.dedupe;
	}
	set dedupe(e$5) {
		this._emitter.dedupe = e$5;
	}
	get getId() {
		return this._emitter.getId;
	}
	set getId(e$5) {
		this._emitter.getId = e$5;
	}
	tick(...e$5) {
		this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e$5);
	}
	on(e$5, t$6, r$3) {
		return this._emitter.on(e$5, t$6, r$3);
	}
	once(e$5, t$6, r$3) {
		return this._emitter.once(e$5, t$6, r$3);
	}
	off(e$5, t$6) {
		return this._emitter.off(e$5, t$6);
	}
	count(e$5) {
		return this._emitter.listenerCount(e$5);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$5 = this._queue, t$6 = this._phases, r$3 = this._getListeners, s$4 = 0, a$3 = t$6.length, n$5;
		for (; s$4 < a$3; s$4++) n$5 = r$3(t$6[s$4]), n$5 && e$5.push(n$5);
		return e$5;
	}
	_processQueue(...e$5) {
		let t$6 = this._queue, r$3 = t$6.length;
		if (!r$3) return;
		let s$4 = 0, a$3 = 0, n$5, c$4;
		for (; s$4 < r$3; s$4++) for (n$5 = t$6[s$4], a$3 = 0, c$4 = n$5.length; a$3 < c$4; a$3++) n$5[a$3](...e$5);
		t$6.length = 0;
	}
};
function u$3(i$4 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$5) => {
		let t$6 = requestAnimationFrame(e$5);
		return () => cancelAnimationFrame(t$6);
	};
	{
		let e$5 = 1e3 / i$4, t$6 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$3) => {
			let s$4 = setTimeout(() => r$3(t$6()), e$5);
			return () => clearTimeout(s$4);
		};
	}
}
var l$3 = class extends o$3 {
	constructor(e$5 = {}) {
		let { paused: t$6 = !1, onDemand: r$3 = !1, requestFrame: s$4 = u$3(),...a$3 } = e$5;
		super(a$3), this._paused = t$6, this._onDemand = r$3, this._requestFrame = s$4, this._cancelFrame = null, this._empty = !0, !t$6 && !r$3 && this._request();
	}
	get phases() {
		return this._phases;
	}
	set phases(e$5) {
		this._phases = e$5, e$5.length ? (this._empty = !1, this._request()) : this._empty = !0;
	}
	get paused() {
		return this._paused;
	}
	set paused(e$5) {
		this._paused = e$5, e$5 ? this._cancel() : this._request();
	}
	get onDemand() {
		return this._onDemand;
	}
	set onDemand(e$5) {
		this._onDemand = e$5, e$5 || this._request();
	}
	get requestFrame() {
		return this._requestFrame;
	}
	set requestFrame(e$5) {
		this._requestFrame !== e$5 && (this._requestFrame = e$5, this._cancelFrame && (this._cancel(), this._request()));
	}
	tick(...e$5) {
		if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
			if (!this._fillQueue().length) {
				this._empty = !0;
				return;
			}
			this._onDemand && this._request(), this._processQueue(...e$5);
		}
	}
	on(e$5, t$6, r$3) {
		let s$4 = super.on(e$5, t$6, r$3);
		return this._empty = !1, this._request(), s$4;
	}
	once(e$5, t$6, r$3) {
		let s$4 = super.once(e$5, t$6, r$3);
		return this._empty = !1, this._request(), s$4;
	}
	_request() {
		this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
	}
	_cancel() {
		this._cancelFrame && (this._cancelFrame(), this._cancelFrame = null);
	}
};

//#endregion
//#region dist/ticker-EaCO7G8S.js
const t$1 = {
	read: Symbol(),
	write: Symbol()
};
let n = new l$3({ phases: [t$1.read, t$1.write] });

//#endregion
//#region dist/constants-BG0DGMmK.js
const e$3 = typeof window < `u` && window.document !== void 0, t$4 = e$3 && `ontouchstart` in window, n$4 = e$3 && !!window.PointerEvent;
e$3 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

//#endregion
//#region dist/get-style-e3zfxW9-.js
const e$4 = /* @__PURE__ */ new WeakMap();
function t$5(t$6) {
	let n$5 = e$4.get(t$6)?.deref();
	return n$5 || (n$5 = window.getComputedStyle(t$6, null), e$4.set(t$6, new WeakRef(n$5))), n$5;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$5, t$6) {
	if (t$6) return window.getComputedStyle(e$5, t$6);
	let C$2 = STYLE_DECLARATION_CACHE.get(e$5)?.deref();
	return C$2 || (C$2 = window.getComputedStyle(e$5, null), STYLE_DECLARATION_CACHE.set(e$5, new WeakRef(C$2))), C$2;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/constants.js
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
		return window.navigator.userAgentData.brands.some((({ brand: n$5 }) => "Chromium" === n$5));
	} catch (n$5) {
		return !1;
	}
})();

//#endregion
//#region node_modules/mezr/dist/esm/utils/isBlockElement.js
function isBlockElement(e$5) {
	switch (getStyle(e$5).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$5) {
	const t$6 = getStyle(n$5);
	if (!IS_SAFARI) {
		const { filter: n$6 } = t$6;
		if (n$6 && "none" !== n$6) return !0;
		const { backdropFilter: e$6 } = t$6;
		if (e$6 && "none" !== e$6) return !0;
		const { willChange: i$5 } = t$6;
		if (i$5 && (i$5.indexOf("filter") > -1 || i$5.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$5 = isBlockElement(n$5);
	if (!e$5) return e$5;
	const { transform: i$4 } = t$6;
	if (i$4 && "none" !== i$4) return !0;
	const { perspective: r$3 } = t$6;
	if (r$3 && "none" !== r$3) return !0;
	const { contentVisibility: o$4 } = t$6;
	if (o$4 && "auto" === o$4) return !0;
	const { contain: f$2 } = t$6;
	if (f$2 && ("strict" === f$2 || "content" === f$2 || f$2.indexOf("paint") > -1 || f$2.indexOf("layout") > -1)) return !0;
	const { willChange: c$4 } = t$6;
	return !(!c$4 || !(c$4.indexOf("transform") > -1 || c$4.indexOf("perspective") > -1 || c$4.indexOf("contain") > -1)) || !!(IS_SAFARI && c$4 && c$4.indexOf("filter") > -1);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$6) {
	return "static" !== getStyle(t$6).position || isContainingBlockForFixedElement(t$6);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$5) {
	return e$5 instanceof HTMLHtmlElement;
}

//#endregion
//#region node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$5, t$6 = {}) {
	if (isDocumentElement(e$5)) return e$5.ownerDocument.defaultView;
	const n$5 = t$6.position || getStyle(e$5).position, { skipDisplayNone: i$4, container: o$4 } = t$6;
	switch (n$5) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$7 = o$4 || e$5.parentElement;
			for (; t$7;) {
				const e$6 = isBlockElement(t$7);
				if (e$6) return t$7;
				if (null === e$6 && !i$4) return null;
				t$7 = t$7.parentElement;
			}
			return e$5.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$7 = "fixed" === n$5;
			let l$4 = o$4 || e$5.parentElement;
			for (; l$4;) {
				const e$6 = t$7 ? isContainingBlockForFixedElement(l$4) : isContainingBlockForAbsoluteElement(l$4);
				if (!0 === e$6) return l$4;
				if (null === e$6 && !i$4) return null;
				l$4 = l$4.parentElement;
			}
			return e$5.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$5) {
	return n$5 instanceof Window;
}

//#endregion
//#region node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$5, t$6 = {}) {
	const { display: o$4 } = getStyle(n$5);
	if ("none" === o$4 || "contents" === o$4) return null;
	const e$5 = t$6.position || getStyle(n$5).position, { skipDisplayNone: s$4, container: r$3 } = t$6;
	switch (e$5) {
		case "relative": return n$5;
		case "fixed": return getContainingBlock(n$5, {
			container: r$3,
			position: e$5,
			skipDisplayNone: s$4
		});
		case "absolute": {
			const t$7 = getContainingBlock(n$5, {
				container: r$3,
				position: e$5,
				skipDisplayNone: s$4
			});
			return isWindow(t$7) ? n$5.ownerDocument : t$7;
		}
		default: return null;
	}
}

//#endregion
//#region dist/draggable-CAyDmcAi.js
var s$3 = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$5, t$6) {
		this._cache.set(e$5, t$6), this._validation.set(e$5, void 0);
	}
	get(e$5) {
		return this._cache.get(e$5);
	}
	has(e$5) {
		return this._cache.has(e$5);
	}
	delete(e$5) {
		this._cache.delete(e$5), this._validation.delete(e$5);
	}
	isValid(e$5) {
		return this._validation.has(e$5);
	}
	invalidate(e$5) {
		e$5 === void 0 ? this._validation.clear() : this._validation.delete(e$5);
	}
	clear() {
		this._cache.clear(), this._validation.clear();
	}
}, c$3 = class {
	constructor(e$5, t$6) {
		this.sensor = e$5, this.startEvent = t$6, this.prevMoveEvent = t$6, this.moveEvent = t$6, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new s$3(), this._clientOffsetCache = new s$3();
	}
};
function l$2(e$5, t$6 = {
	x: 0,
	y: 0
}) {
	if (t$6.x = 0, t$6.y = 0, e$5 instanceof Window) return t$6;
	if (e$5 instanceof Document) return t$6.x = window.scrollX * -1, t$6.y = window.scrollY * -1, t$6;
	let { x: n$5, y: r$3 } = e$5.getBoundingClientRect(), a$3 = t$5(e$5);
	return t$6.x = n$5 + (parseFloat(a$3.borderLeftWidth) || 0), t$6.y = r$3 + (parseFloat(a$3.borderTopWidth) || 0), t$6;
}
function u$2(e$5) {
	return typeof e$5 == `object` && !!e$5 && `x` in e$5 && `y` in e$5;
}
const d$1 = {
	x: 0,
	y: 0
}, f$1 = {
	x: 0,
	y: 0
};
function p$1(e$5, t$6, n$5 = {
	x: 0,
	y: 0
}) {
	let r$3 = u$2(e$5) ? e$5 : l$2(e$5, d$1), i$4 = u$2(t$6) ? t$6 : l$2(t$6, f$1);
	return n$5.x = i$4.x - r$3.x, n$5.y = i$4.y - r$3.y, n$5;
}
function m$1(e$5) {
	let t$6 = t$5(e$5), n$5 = parseFloat(t$6.height) || 0;
	return t$6.boxSizing === `border-box` ? n$5 : (n$5 += parseFloat(t$6.borderTopWidth) || 0, n$5 += parseFloat(t$6.borderBottomWidth) || 0, n$5 += parseFloat(t$6.paddingTop) || 0, n$5 += parseFloat(t$6.paddingBottom) || 0, e$5 instanceof HTMLElement && (n$5 += e$5.offsetHeight - e$5.clientHeight), n$5);
}
function h$1(e$5) {
	let t$6 = t$5(e$5), n$5 = parseFloat(t$6.width) || 0;
	return t$6.boxSizing === `border-box` ? n$5 : (n$5 += parseFloat(t$6.borderLeftWidth) || 0, n$5 += parseFloat(t$6.borderRightWidth) || 0, n$5 += parseFloat(t$6.paddingLeft) || 0, n$5 += parseFloat(t$6.paddingRight) || 0, e$5 instanceof HTMLElement && (n$5 += e$5.offsetWidth - e$5.clientWidth), n$5);
}
function g$1(e$5, t$6 = !1) {
	let { translate: n$5, rotate: r$3, scale: a$3, transform: o$4 } = t$5(e$5), s$4 = ``;
	if (n$5 && n$5 !== `none`) {
		let [t$7 = `0px`, r$4 = `0px`, i$4] = n$5.split(` `);
		t$7.includes(`%`) && (t$7 = `${parseFloat(t$7) / 100 * h$1(e$5)}px`), r$4.includes(`%`) && (r$4 = `${parseFloat(r$4) / 100 * m$1(e$5)}px`), i$4 ? s$4 += `translate3d(${t$7},${r$4},${i$4})` : s$4 += `translate(${t$7},${r$4})`;
	}
	if (r$3 && r$3 !== `none`) {
		let e$6 = r$3.split(` `);
		e$6.length > 1 ? s$4 += `rotate3d(${e$6.join(`,`)})` : s$4 += `rotate(${e$6.join(`,`)})`;
	}
	if (a$3 && a$3 !== `none`) {
		let e$6 = a$3.split(` `);
		e$6.length === 3 ? s$4 += `scale3d(${e$6.join(`,`)})` : s$4 += `scale(${e$6.join(`,`)})`;
	}
	return !t$6 && o$4 && o$4 !== `none` && (s$4 += o$4), s$4;
}
function _$1(e$5) {
	let t$6 = e$5.split(` `), n$5 = ``, r$3 = ``, i$4 = ``;
	return t$6.length === 1 ? n$5 = r$3 = t$6[0] : t$6.length === 2 ? [n$5, r$3] = t$6 : [n$5, r$3, i$4] = t$6, {
		x: parseFloat(n$5) || 0,
		y: parseFloat(r$3) || 0,
		z: parseFloat(i$4) || 0
	};
}
function v$2(e$5) {
	return e$5.setMatrixValue(`scale(1, 1)`);
}
const y$1 = e$3 ? new DOMMatrix() : null;
function b$1(e$5, t$6 = new DOMMatrix()) {
	let n$5 = e$5;
	for (v$2(t$6); n$5;) {
		let e$6 = g$1(n$5);
		if (e$6 && (y$1.setMatrixValue(e$6), !y$1.isIdentity)) {
			let { transformOrigin: e$7 } = t$5(n$5), { x: r$3, y: a$3, z: o$4 } = _$1(e$7);
			o$4 === 0 ? y$1.setMatrixValue(`translate(${r$3}px,${a$3}px) ${y$1} translate(${r$3 * -1}px,${a$3 * -1}px)`) : y$1.setMatrixValue(`translate3d(${r$3}px,${a$3}px,${o$4}px) ${y$1} translate3d(${r$3 * -1}px,${a$3 * -1}px,${o$4 * -1}px)`), t$6.preMultiplySelf(y$1);
		}
		n$5 = n$5.parentElement;
	}
	return t$6;
}
function x$1(e$5, t$6, n$5 = !1) {
	let { style: r$3 } = e$5;
	for (let e$6 in t$6) r$3.setProperty(e$6, t$6[e$6], n$5 ? `important` : ``);
}
function S$1() {
	let e$5 = document.createElement(`div`);
	return e$5.classList.add(`dragdoll-measure`), x$1(e$5, {
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
	}, !0), e$5;
}
function C$1(e$5) {
	return e$5.m11 !== 1 || e$5.m12 !== 0 || e$5.m13 !== 0 || e$5.m14 !== 0 || e$5.m21 !== 0 || e$5.m22 !== 1 || e$5.m23 !== 0 || e$5.m24 !== 0 || e$5.m31 !== 0 || e$5.m32 !== 0 || e$5.m33 !== 1 || e$5.m34 !== 0 || e$5.m43 !== 0 || e$5.m44 !== 1;
}
const w$1 = e$3 ? S$1() : null;
var T$1 = class {
	constructor(e$5, t$6) {
		if (!e$5.isConnected) throw Error(`Element is not connected`);
		let { drag: n$5 } = t$6;
		if (!n$5) throw Error(`Drag is not defined`);
		let r$3 = t$5(e$5), a$3 = e$5.getBoundingClientRect(), s$4 = g$1(e$5, !0);
		this.data = {}, this.element = e$5, this.elementTransformOrigin = _$1(r$3.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$4 + r$3.transform), this.elementOffsetMatrix = new DOMMatrix(s$4).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = n$5._matrixCache, this._clientOffsetCache = n$5._clientOffsetCache;
		let c$4 = e$5.parentElement;
		if (!c$4) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$4;
		let l$4 = t$6.settings.container || c$4;
		if (this.dragContainer = l$4, c$4 !== l$4) {
			let { position: e$6 } = r$3;
			if (e$6 !== `fixed` && e$6 !== `absolute`) throw Error(`Dragged element has "${e$6}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$4 = getOffsetContainer(e$5) || e$5;
		this.elementOffsetContainer = u$4, this.dragOffsetContainer = l$4 === c$4 ? u$4 : getOffsetContainer(e$5, { container: l$4 });
		{
			let { width: e$6, height: t$7, x: n$6, y: r$4 } = a$3;
			this.clientRect = {
				width: e$6,
				height: t$7,
				x: n$6,
				y: r$4
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$2 = t$6.settings.frozenStyles({
			draggable: t$6,
			drag: n$5,
			item: this,
			style: r$3
		});
		if (Array.isArray(d$2)) if (d$2.length) {
			let e$6 = {};
			for (let t$7 of d$2) e$6[t$7] = r$3[t$7];
			this.frozenStyles = e$6;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$2;
		if (this.frozenStyles) {
			let t$7 = {};
			for (let n$6 in this.frozenStyles) this.frozenStyles.hasOwnProperty(n$6) && (t$7[n$6] = e$5.style[n$6]);
			this.unfrozenStyles = t$7;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$5) => {
			if (!this._matrixCache.isValid(e$5)) {
				let t$6 = this._matrixCache.get(e$5) || [new DOMMatrix(), new DOMMatrix()], [n$5, r$3] = t$6;
				b$1(e$5, n$5), r$3.setMatrixValue(n$5.toString()).invertSelf(), this._matrixCache.set(e$5, t$6);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$5, elementContainer: t$6, dragOffsetContainer: n$5, dragContainer: r$3, containerOffset: i$4, _clientOffsetCache: a$3, _matrixCache: o$4 } = this;
		if (e$5 !== n$5) {
			let [s$4, c$4] = [[r$3, n$5], [t$6, e$5]].map(([e$6, t$7]) => {
				let n$6 = a$3.get(t$7) || {
					x: 0,
					y: 0
				};
				if (!a$3.isValid(t$7)) {
					let r$4 = o$4.get(e$6);
					t$7 instanceof HTMLElement && r$4 && !r$4[0].isIdentity ? C$1(r$4[0]) ? (w$1.style.setProperty(`transform`, r$4[1].toString(), `important`), t$7.append(w$1), l$2(w$1, n$6), w$1.remove()) : (l$2(t$7, n$6), n$6.x -= r$4[0].m41, n$6.y -= r$4[0].m42) : l$2(t$7, n$6);
				}
				return a$3.set(t$7, n$6), n$6;
			});
			p$1(s$4, c$4, i$4);
		} else i$4.x = 0, i$4.y = 0;
	}
	getContainerMatrix() {
		return this._matrixCache.get(this.elementContainer);
	}
	getDragContainerMatrix() {
		return this._matrixCache.get(this.dragContainer);
	}
	updateSize(e$5) {
		if (e$5) this.clientRect.width = e$5.width, this.clientRect.height = e$5.height;
		else {
			let { width: e$6, height: t$6 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$6, this.clientRect.height = t$6;
		}
	}
};
function E$1(e$5, t$6, n$5 = null) {
	if (`moveBefore` in e$5 && e$5.isConnected === t$6.isConnected) try {
		e$5.moveBefore(t$6, n$5);
		return;
	} catch {}
	let r$3 = document.activeElement, i$4 = t$6.contains(r$3);
	e$5.insertBefore(t$6, n$5), i$4 && document.activeElement !== r$3 && r$3 instanceof HTMLElement && r$3.focus({ preventScroll: !0 });
}
function D$1(e$5, t$6 = 0) {
	let n$5 = 10 ** t$6;
	return Math.round((e$5 + 2 ** -52) * n$5) / n$5;
}
function O$1(e$5, t$6) {
	return e$5.isIdentity && t$6.isIdentity ? !0 : e$5.is2D && t$6.is2D ? e$5.a === t$6.a && e$5.b === t$6.b && e$5.c === t$6.c && e$5.d === t$6.d && e$5.e === t$6.e && e$5.f === t$6.f : e$5.m11 === t$6.m11 && e$5.m12 === t$6.m12 && e$5.m13 === t$6.m13 && e$5.m14 === t$6.m14 && e$5.m21 === t$6.m21 && e$5.m22 === t$6.m22 && e$5.m23 === t$6.m23 && e$5.m24 === t$6.m24 && e$5.m31 === t$6.m31 && e$5.m32 === t$6.m32 && e$5.m33 === t$6.m33 && e$5.m34 === t$6.m34 && e$5.m41 === t$6.m41 && e$5.m42 === t$6.m42 && e$5.m43 === t$6.m43 && e$5.m44 === t$6.m44;
}
const k$1 = {
	capture: !0,
	passive: !0
}, A$1 = {
	x: 0,
	y: 0
}, j$1 = e$3 ? new DOMMatrix() : null, M$1 = e$3 ? new DOMMatrix() : null;
var N$1 = function(e$5) {
	return e$5[e$5.None = 0] = `None`, e$5[e$5.Init = 1] = `Init`, e$5[e$5.Prepare = 2] = `Prepare`, e$5[e$5.FinishPrepare = 3] = `FinishPrepare`, e$5[e$5.Apply = 4] = `Apply`, e$5[e$5.FinishApply = 5] = `FinishApply`, e$5;
}(N$1 || {}), P = function(e$5) {
	return e$5[e$5.Pending = 0] = `Pending`, e$5[e$5.Resolved = 1] = `Resolved`, e$5[e$5.Rejected = 2] = `Rejected`, e$5;
}(P || {});
const F = {
	Start: `start`,
	Move: `move`,
	End: `end`
}, I = {
	Start: `start`,
	StartAlign: `start-align`,
	Move: `move`,
	Align: `align`,
	End: `end`,
	EndAlign: `end-align`
}, L = {
	PrepareStart: `preparestart`,
	Start: `start`,
	PrepareMove: `preparemove`,
	Move: `move`,
	End: `end`,
	Destroy: `destroy`
}, R = {
	container: null,
	startPredicate: () => !0,
	elements: () => null,
	frozenStyles: () => null,
	applyPosition: ({ item: e$5, phase: t$6 }) => {
		let n$5 = t$6 === I.End || t$6 === I.EndAlign, [r$3, i$4] = e$5.getContainerMatrix(), [a$3, o$4] = e$5.getDragContainerMatrix(), { position: s$4, alignmentOffset: c$4, containerOffset: l$4, elementTransformMatrix: u$4, elementTransformOrigin: d$2, elementOffsetMatrix: f$2 } = e$5, { x: p$2, y: m$2, z: h$2 } = d$2, g$2 = !u$4.isIdentity && (p$2 !== 0 || m$2 !== 0 || h$2 !== 0), _$3 = s$4.x + c$4.x + l$4.x, y$2 = s$4.y + c$4.y + l$4.y;
		v$2(j$1), g$2 && (h$2 === 0 ? j$1.translateSelf(-p$2, -m$2) : j$1.translateSelf(-p$2, -m$2, -h$2)), n$5 ? i$4.isIdentity || j$1.multiplySelf(i$4) : o$4.isIdentity || j$1.multiplySelf(o$4), v$2(M$1).translateSelf(_$3, y$2), j$1.multiplySelf(M$1), r$3.isIdentity || j$1.multiplySelf(r$3), g$2 && (v$2(M$1).translateSelf(p$2, m$2, h$2), j$1.multiplySelf(M$1)), u$4.isIdentity || j$1.multiplySelf(u$4), f$2.isIdentity || j$1.preMultiplySelf(f$2), e$5.element.style.transform = `${j$1}`;
	},
	computeClientRect: ({ drag: e$5 }) => e$5.items[0].clientRect || null,
	positionModifiers: [],
	group: null
};
var z = class {
	constructor(t$6, n$5 = {}) {
		let { id: r$3 = Symbol(),...i$4 } = n$5;
		this.id = r$3, this.sensors = t$6, this.settings = this._parseSettings(i$4), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v$1(), this._startPhase = N$1.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((t$7) => {
			this._sensorData.set(t$7, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (e$5) => this._onMove(e$5, t$7),
				onEnd: (e$5) => this._onEnd(e$5, t$7)
			});
			let { onMove: n$6, onEnd: r$4 } = this._sensorData.get(t$7);
			t$7.on(e$2.Start, n$6, n$6), t$7.on(e$2.Move, n$6, n$6), t$7.on(e$2.Cancel, r$4, r$4), t$7.on(e$2.End, r$4, r$4), t$7.on(e$2.Destroy, r$4, r$4);
		});
	}
	_parseSettings(e$5, t$6 = R) {
		let { container: n$5 = t$6.container, startPredicate: r$3 = t$6.startPredicate, elements: i$4 = t$6.elements, frozenStyles: a$3 = t$6.frozenStyles, positionModifiers: o$4 = t$6.positionModifiers, applyPosition: s$4 = t$6.applyPosition, computeClientRect: c$4 = t$6.computeClientRect, group: l$4 = t$6.group, onPrepareStart: u$4 = t$6.onPrepareStart, onStart: d$2 = t$6.onStart, onPrepareMove: f$2 = t$6.onPrepareMove, onMove: p$2 = t$6.onMove, onEnd: m$2 = t$6.onEnd, onDestroy: h$2 = t$6.onDestroy } = e$5 || {};
		return {
			container: n$5,
			startPredicate: r$3,
			elements: i$4,
			frozenStyles: a$3,
			positionModifiers: o$4,
			applyPosition: s$4,
			computeClientRect: c$4,
			group: l$4,
			onPrepareStart: u$4,
			onStart: d$2,
			onPrepareMove: f$2,
			onMove: p$2,
			onEnd: m$2,
			onDestroy: h$2
		};
	}
	_emit(e$5, ...t$6) {
		this._emitter.emit(e$5, ...t$6);
	}
	_onMove(e$5, r$3) {
		let i$4 = this._sensorData.get(r$3);
		if (i$4) switch (i$4.predicateState) {
			case P.Pending: {
				i$4.predicateEvent = e$5;
				let t$6 = this.settings.startPredicate({
					draggable: this,
					sensor: r$3,
					event: e$5
				});
				t$6 === !0 ? this.resolveStartPredicate(r$3) : t$6 === !1 && this.rejectStartPredicate(r$3);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = e$5, n.once(t$1.read, this._prepareMove, this._moveId), n.once(t$1.write, this._applyMove, this._moveId));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$5, t$6) {
		let n$5 = this._sensorData.get(t$6);
		n$5 && (this.drag ? n$5.predicateState === P.Resolved && (this.drag.endEvent = e$5, this._sensorData.forEach((e$6) => {
			e$6.predicateState = P.Pending, e$6.predicateEvent = null;
		}), this.stop()) : (n$5.predicateState = P.Pending, n$5.predicateEvent = null));
	}
	_prepareStart() {
		let e$5 = this.drag;
		e$5 && (this._startPhase = N$1.Prepare, e$5.items = (this.settings.elements({
			draggable: this,
			drag: e$5
		}) || []).map((e$6) => new T$1(e$6, this)), this._applyModifiers(F.Start, 0, 0), this._emit(L.PrepareStart, e$5.startEvent), this.settings.onPrepareStart?.(e$5, this), this._startPhase = N$1.FinishPrepare);
	}
	_applyStart() {
		let e$5 = this.drag;
		if (e$5) {
			this._startPhase = N$1.Apply;
			for (let t$6 of e$5.items) t$6.dragContainer !== t$6.elementContainer && E$1(t$6.dragContainer, t$6.element), t$6.frozenStyles && Object.assign(t$6.element.style, t$6.frozenStyles), this.settings.applyPosition({
				phase: I.Start,
				draggable: this,
				drag: e$5,
				item: t$6
			});
			for (let t$6 of e$5.items) {
				let e$6 = t$6.getContainerMatrix()[0], n$5 = t$6.getDragContainerMatrix()[0];
				if (O$1(e$6, n$5) || !C$1(e$6) && !C$1(n$5)) continue;
				let r$3 = t$6.element.getBoundingClientRect(), { alignmentOffset: i$4 } = t$6;
				i$4.x += D$1(t$6.clientRect.x - r$3.x, 3), i$4.y += D$1(t$6.clientRect.y - r$3.y, 3);
			}
			for (let t$6 of e$5.items) {
				let { alignmentOffset: n$5 } = t$6;
				(n$5.x !== 0 || n$5.y !== 0) && this.settings.applyPosition({
					phase: I.StartAlign,
					draggable: this,
					drag: e$5,
					item: t$6
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k$1), this._emit(L.Start, e$5.startEvent), this.settings.onStart?.(e$5, this), this._startPhase = N$1.FinishApply;
		}
	}
	_prepareMove() {
		let e$5 = this.drag;
		if (!e$5) return;
		let { moveEvent: t$6, prevMoveEvent: n$5 } = e$5;
		t$6 !== n$5 && (this._applyModifiers(F.Move, t$6.x - n$5.x, t$6.y - n$5.y), this._emit(L.PrepareMove, t$6), !e$5.isEnded && (this.settings.onPrepareMove?.(e$5, this), !e$5.isEnded && (e$5.prevMoveEvent = t$6)));
	}
	_applyMove() {
		let e$5 = this.drag;
		if (e$5) {
			for (let t$6 of e$5.items) t$6._moveDiff.x = 0, t$6._moveDiff.y = 0, this.settings.applyPosition({
				phase: I.Move,
				draggable: this,
				drag: e$5,
				item: t$6
			});
			this._emit(L.Move, e$5.moveEvent), !e$5.isEnded && this.settings.onMove?.(e$5, this);
		}
	}
	_prepareAlign() {
		let { drag: e$5 } = this;
		if (e$5) for (let t$6 of e$5.items) {
			let { x: e$6, y: n$5 } = t$6.element.getBoundingClientRect(), r$3 = t$6.clientRect.x - t$6._moveDiff.x - e$6;
			t$6.alignmentOffset.x = t$6.alignmentOffset.x - t$6._alignDiff.x + r$3, t$6._alignDiff.x = r$3;
			let i$4 = t$6.clientRect.y - t$6._moveDiff.y - n$5;
			t$6.alignmentOffset.y = t$6.alignmentOffset.y - t$6._alignDiff.y + i$4, t$6._alignDiff.y = i$4;
		}
	}
	_applyAlign() {
		let { drag: e$5 } = this;
		if (e$5) for (let t$6 of e$5.items) t$6._alignDiff.x = 0, t$6._alignDiff.y = 0, this.settings.applyPosition({
			phase: I.Align,
			draggable: this,
			drag: e$5,
			item: t$6
		});
	}
	_applyModifiers(e$5, t$6, n$5) {
		let { drag: r$3 } = this;
		if (!r$3) return;
		let { positionModifiers: i$4 } = this.settings;
		for (let a$3 of r$3.items) {
			let o$4 = A$1;
			o$4.x = t$6, o$4.y = n$5;
			for (let t$7 of i$4) o$4 = t$7(o$4, {
				draggable: this,
				drag: r$3,
				item: a$3,
				phase: e$5
			});
			a$3.position.x += o$4.x, a$3.position.y += o$4.y, a$3.clientRect.x += o$4.x, a$3.clientRect.y += o$4.y, e$5 === `move` && (a$3._moveDiff.x += o$4.x, a$3._moveDiff.y += o$4.y);
		}
	}
	on(e$5, t$6, n$5) {
		return this._emitter.on(e$5, t$6, n$5);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	resolveStartPredicate(e$5, r$3) {
		let i$4 = this._sensorData.get(e$5);
		if (!i$4) return;
		let a$3 = r$3 || i$4.predicateEvent;
		i$4.predicateState === P.Pending && a$3 && (this._startPhase = N$1.Init, i$4.predicateState = P.Resolved, i$4.predicateEvent = null, this.drag = new c$3(e$5, a$3), this._sensorData.forEach((t$6, n$5) => {
			n$5 !== e$5 && (t$6.predicateState = P.Rejected, t$6.predicateEvent = null);
		}), n.once(t$1.read, this._prepareStart, this._startId), n.once(t$1.write, this._applyStart, this._startId));
	}
	rejectStartPredicate(e$5) {
		let t$6 = this._sensorData.get(e$5);
		t$6?.predicateState === P.Pending && (t$6.predicateState = P.Rejected, t$6.predicateEvent = null);
	}
	stop() {
		let e$5 = this.drag;
		if (!e$5 || e$5.isEnded) return;
		let r$3 = this._startPhase;
		if (r$3 === N$1.Prepare || r$3 === N$1.Apply) throw Error(`Cannot stop drag start process at this point`);
		if (this._startPhase = N$1.None, e$5.isEnded = !0, n.off(t$1.read, this._startId), n.off(t$1.write, this._startId), n.off(t$1.read, this._moveId), n.off(t$1.write, this._moveId), n.off(t$1.read, this._alignId), n.off(t$1.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k$1), r$3 > N$1.Init && this._applyModifiers(F.End, 0, 0), r$3 === N$1.FinishApply) {
			for (let t$6 of e$5.items) {
				if (t$6.elementContainer !== t$6.dragContainer && (E$1(t$6.elementContainer, t$6.element), t$6.alignmentOffset.x = 0, t$6.alignmentOffset.y = 0, t$6.containerOffset.x = 0, t$6.containerOffset.y = 0), t$6.unfrozenStyles) for (let e$6 in t$6.unfrozenStyles) t$6.element.style[e$6] = t$6.unfrozenStyles[e$6] || ``;
				this.settings.applyPosition({
					phase: I.End,
					draggable: this,
					drag: e$5,
					item: t$6
				});
			}
			for (let t$6 of e$5.items) if (t$6.elementContainer !== t$6.dragContainer) {
				let e$6 = t$6.element.getBoundingClientRect();
				t$6.alignmentOffset.x = D$1(t$6.clientRect.x - e$6.x, 3), t$6.alignmentOffset.y = D$1(t$6.clientRect.y - e$6.y, 3);
			}
			for (let t$6 of e$5.items) t$6.elementContainer !== t$6.dragContainer && (t$6.alignmentOffset.x !== 0 || t$6.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: I.EndAlign,
				draggable: this,
				drag: e$5,
				item: t$6
			});
		} else if (r$3 === N$1.FinishPrepare) for (let t$6 of e$5.items) t$6.clientRect.x -= t$6.position.x, t$6.clientRect.y -= t$6.position.y, t$6.position.x = 0, t$6.position.y = 0, t$6.elementContainer !== t$6.dragContainer && (t$6.alignmentOffset.x = 0, t$6.alignmentOffset.y = 0, t$6.containerOffset.x = 0, t$6.containerOffset.y = 0);
		this._emit(L.End, e$5.endEvent), this.settings.onEnd?.(e$5, this), this.drag = null;
	}
	align(e$5 = !1) {
		this.drag && (e$5 ? (this._prepareAlign(), this._applyAlign()) : (n.once(t$1.read, this._prepareAlign, this._alignId), n.once(t$1.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$5, settings: t$6 } = this;
		return e$5 && t$6.computeClientRect?.({
			draggable: this,
			drag: e$5
		}) || null;
	}
	updateSettings(e$5 = {}) {
		this.settings = this._parseSettings(e$5, this.settings);
	}
	use(e$5) {
		return e$5(this);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: t$6, onEnd: n$5 }, r$3) => {
			r$3.off(e$2.Start, t$6), r$3.off(e$2.Move, t$6), r$3.off(e$2.Cancel, n$5), r$3.off(e$2.End, n$5), r$3.off(e$2.Destroy, n$5);
		}), this._sensorData.clear(), this._emit(L.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region dist/pointer-sensor-DZDIojjB.js
function i$3(e$5, t$6) {
	if (`pointerId` in e$5) return e$5.pointerId === t$6 ? e$5 : null;
	if (`changedTouches` in e$5) {
		let n$5 = 0;
		for (; n$5 < e$5.changedTouches.length; n$5++) if (e$5.changedTouches[n$5].identifier === t$6) return e$5.changedTouches[n$5];
		return null;
	}
	return e$5;
}
function a$2(e$5) {
	return `pointerType` in e$5 ? e$5.pointerType : `touches` in e$5 ? `touch` : `mouse`;
}
function o$2(e$5) {
	return `pointerId` in e$5 ? e$5.pointerId : `changedTouches` in e$5 ? e$5.changedTouches[0] ? e$5.changedTouches[0].identifier : null : -1;
}
function s$2(e$5 = {}) {
	let { capture: t$6 = !0, passive: n$5 = !0 } = e$5;
	return {
		capture: t$6,
		passive: n$5
	};
}
function c$2(e$5) {
	return e$5 === `auto` || e$5 === void 0 ? n$4 ? `pointer` : t$4 ? `touch` : `mouse` : e$5;
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
var u = class {
	constructor(e$5, t$6 = {}) {
		let { listenerOptions: n$5 = {}, sourceEvents: i$4 = `auto`, startPredicate: a$3 = (e$6) => !(`button` in e$6 && e$6.button > 0) } = t$6;
		this.element = e$5, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$3, this._listenerOptions = s$2(n$5), this._sourceEvents = c$2(i$4), this._emitter = new v$1(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$5.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$5) {
		return this.drag ? i$3(e$5, this.drag.pointerId) : null;
	}
	_onStart(t$6) {
		if (this.isDestroyed || this.drag || !this._startPredicate(t$6)) return;
		let n$5 = o$2(t$6);
		if (n$5 === null) return;
		let r$3 = i$3(t$6, n$5);
		if (r$3 === null) return;
		let s$4 = {
			pointerId: n$5,
			pointerType: a$2(t$6),
			x: r$3.clientX,
			y: r$3.clientY
		};
		this.drag = s$4;
		let c$4 = {
			...s$4,
			type: e$2.Start,
			srcEvent: t$6,
			target: r$3.target
		};
		this._emitter.emit(c$4.type, c$4), this.drag && this._bindWindowListeners();
	}
	_onMove(t$6) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$6);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e$2.Move,
			srcEvent: t$6,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3);
	}
	_onCancel(t$6) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$6);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e$2.Cancel,
			srcEvent: t$6,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_onEnd(t$6) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$6);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e$2.End,
			srcEvent: t$6,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$5, end: t$6, cancel: n$5 } = l$1[this._sourceEvents];
		window.addEventListener(e$5, this._onMove, this._listenerOptions), window.addEventListener(t$6, this._onEnd, this._listenerOptions), n$5 && window.addEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$5, end: t$6, cancel: n$5 } = l$1[this._sourceEvents];
			window.removeEventListener(e$5, this._onMove, this._listenerOptions), window.removeEventListener(t$6, this._onEnd, this._listenerOptions), n$5 && window.removeEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let t$6 = {
			type: e$2.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(t$6.type, t$6), this._resetDrag();
	}
	updateSettings(e$5) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$6, sourceEvents: n$5, startPredicate: r$3 } = e$5, i$4 = c$2(n$5), a$3 = s$2(t$6);
		r$3 && this._startPredicate !== r$3 && (this._startPredicate = r$3), (t$6 && (this._listenerOptions.capture !== a$3.capture || this._listenerOptions.passive === a$3.passive) || n$5 && this._sourceEvents !== i$4) && (this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$5 && (this._sourceEvents = i$4), t$6 && a$3 && (this._listenerOptions = a$3), this.element.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$5, t$6, n$5) {
		return this._emitter.on(e$5, t$6, n$5);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e$2.Destroy, { type: e$2.Destroy }), this._emitter.off(), this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region dist/base-sensor-cUrlV0_m.js
var n$3 = class {
	constructor() {
		this.drag = null, this.isDestroyed = !1, this._emitter = new v$1();
	}
	_createDragData(e$5) {
		return {
			x: e$5.x,
			y: e$5.y
		};
	}
	_updateDragData(e$5) {
		this.drag && (this.drag.x = e$5.x, this.drag.y = e$5.y);
	}
	_resetDragData() {
		this.drag = null;
	}
	_start(t$6) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$6), this._emitter.emit(e$2.Start, t$6));
	}
	_move(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.Move, t$6));
	}
	_end(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.End, t$6), this._resetDragData());
	}
	_cancel(t$6) {
		this.drag && (this._updateDragData(t$6), this._emitter.emit(e$2.Cancel, t$6), this._resetDragData());
	}
	on(e$5, t$6, n$5) {
		return this._emitter.on(e$5, t$6, n$5);
	}
	off(e$5, t$6) {
		this._emitter.off(e$5, t$6);
	}
	cancel() {
		this.drag && this._cancel({
			type: e$2.Cancel,
			x: this.drag.x,
			y: this.drag.y
		});
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e$2.Destroy, { type: e$2.Destroy }), this._emitter.off());
	}
};

//#endregion
//#region dist/base-motion-sensor-BS2TuJo7.js
var i$1 = class extends n$3 {
	constructor() {
		super(), this.drag = null, this._direction = {
			x: 0,
			y: 0
		}, this._speed = 0, this._tick = this._tick.bind(this);
	}
	_createDragData(e$5) {
		return {
			...super._createDragData(e$5),
			time: 0,
			deltaTime: 0
		};
	}
	_start(e$5) {
		this.isDestroyed || this.drag || (super._start(e$5), n.on(t$1.read, this._tick, this._tick));
	}
	_end(e$5) {
		this.drag && (n.off(t$1.read, this._tick), super._end(e$5));
	}
	_cancel(e$5) {
		this.drag && (n.off(t$1.read, this._tick), super._cancel(e$5));
	}
	_tick(t$6) {
		if (this.drag) if (t$6 && this.drag.time) {
			this.drag.deltaTime = t$6 - this.drag.time, this.drag.time = t$6;
			let n$5 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, n$5), !this.drag) return;
			let r$3 = this._speed * (this.drag.deltaTime / 1e3), i$4 = this._direction.x * r$3, a$3 = this._direction.y * r$3;
			(i$4 || a$3) && this._move({
				type: e$2.Move,
				x: this.drag.x + i$4,
				y: this.drag.y + a$3
			});
		} else this.drag.time = t$6, this.drag.deltaTime = 0;
	}
};

//#endregion
//#region dist/sensors/keyboard-motion-sensor.js
const n$2 = [
	`start`,
	`cancel`,
	`end`,
	`moveLeft`,
	`moveRight`,
	`moveUp`,
	`moveDown`
];
function r$1(e$5, t$6) {
	if (!e$5.size || !t$6.size) return Infinity;
	let n$5 = Infinity;
	for (let r$3 of e$5) {
		let e$6 = t$6.get(r$3);
		e$6 !== void 0 && e$6 < n$5 && (n$5 = e$6);
	}
	return n$5;
}
const i$2 = {
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
	startPredicate: (e$5, t$6) => {
		if (t$6.element && document.activeElement === t$6.element) {
			let { left: e$6, top: n$5 } = t$6.element.getBoundingClientRect();
			return {
				x: e$6,
				y: n$5
			};
		}
		return null;
	}
};
var a = class extends i$1 {
	constructor(e$5, t$6 = {}) {
		super();
		let { startPredicate: n$5 = i$2.startPredicate, computeSpeed: r$3 = i$2.computeSpeed, cancelOnVisibilityChange: a$3 = i$2.cancelOnVisibilityChange, cancelOnBlur: o$4 = i$2.cancelOnBlur, startKeys: s$4 = i$2.startKeys, moveLeftKeys: c$4 = i$2.moveLeftKeys, moveRightKeys: l$4 = i$2.moveRightKeys, moveUpKeys: u$4 = i$2.moveUpKeys, moveDownKeys: d$2 = i$2.moveDownKeys, cancelKeys: f$2 = i$2.cancelKeys, endKeys: p$2 = i$2.endKeys } = t$6;
		this.element = e$5, this._startKeys = new Set(s$4), this._cancelKeys = new Set(f$2), this._endKeys = new Set(p$2), this._moveLeftKeys = new Set(c$4), this._moveRightKeys = new Set(l$4), this._moveUpKeys = new Set(u$4), this._moveDownKeys = new Set(d$2), this._moveKeys = new Set([
			...c$4,
			...l$4,
			...u$4,
			...d$2
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$4, this._cancelOnVisibilityChange = a$3, this._computeSpeed = r$3, this._startPredicate = n$5, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$4 && e$5?.addEventListener(`blur`, this._blurCancelHandler), a$3 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_end(e$5) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._end(e$5));
	}
	_cancel(e$5) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._cancel(e$5));
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
		let e$5 = r$1(this._moveLeftKeys, this._moveKeyTimestamps), t$6 = r$1(this._moveRightKeys, this._moveKeyTimestamps), n$5 = r$1(this._moveUpKeys, this._moveKeyTimestamps), i$4 = r$1(this._moveDownKeys, this._moveKeyTimestamps), a$3 = e$5 === t$6 ? 0 : e$5 < t$6 ? -1 : 1, o$4 = n$5 === i$4 ? 0 : n$5 < i$4 ? -1 : 1;
		if (!(a$3 === 0 || o$4 === 0)) {
			let e$6 = 1 / (Math.sqrt(a$3 * a$3 + o$4 * o$4) || 1);
			a$3 *= e$6, o$4 *= e$6;
		}
		this._direction.x = a$3, this._direction.y = o$4;
	}
	_onTick() {
		this._speed = this._computeSpeed(this);
	}
	_onKeyUp(e$5) {
		this._moveKeyTimestamps.get(e$5.key) && (this._moveKeyTimestamps.delete(e$5.key), this._updateDirection());
	}
	_onKeyDown(t$6) {
		if (!this.drag) {
			if (this._startKeys.has(t$6.key)) {
				let n$5 = this._startPredicate(t$6, this);
				n$5 && (t$6.preventDefault(), this._start({
					type: e$2.Start,
					x: n$5.x,
					y: n$5.y
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
				type: e$2.End,
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
	updateSettings(e$5 = {}) {
		let t$6 = !1, { cancelOnBlur: r$3, cancelOnVisibilityChange: i$4, startPredicate: a$3, computeSpeed: o$4 } = e$5;
		if (r$3 !== void 0 && this._cancelOnBlur !== r$3 && (this._cancelOnBlur = r$3, r$3 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$4 !== void 0 && this._cancelOnVisibilityChange !== i$4 && (this._cancelOnVisibilityChange = i$4, i$4 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$3 !== void 0 && (this._startPredicate = a$3), o$4 !== void 0 && (this._computeSpeed = o$4), n$2.forEach((n$5, r$4) => {
			let i$5 = `${n$5}Keys`, a$4 = e$5[i$5];
			a$4 !== void 0 && (this[`_${i$5}`] = new Set(a$4), r$4 >= 3 && (t$6 = !0));
		}), t$6) {
			let e$6 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$7, n$5) => e$6[n$5] === t$7) || (this._moveKeys = new Set(e$6), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region dist/create-full-rect-CRrWdntN.js
function e(e$5, t$6 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0
}) {
	return e$5 && (t$6.width = e$5.width, t$6.height = e$5.height, t$6.x = e$5.x, t$6.y = e$5.y, t$6.left = e$5.x, t$6.top = e$5.y, t$6.right = e$5.x + e$5.width, t$6.bottom = e$5.y + e$5.height), t$6;
}

//#endregion
//#region dist/get-intersection-score-nMuj0vta.js
function e$1(e$5, t$6, n$5 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	let r$3 = Math.max(e$5.x, t$6.x), i$4 = Math.min(e$5.x + e$5.width, t$6.x + t$6.width);
	if (i$4 <= r$3) return null;
	let a$3 = Math.max(e$5.y, t$6.y), o$4 = Math.min(e$5.y + e$5.height, t$6.y + t$6.height);
	return o$4 <= a$3 ? null : (n$5.x = r$3, n$5.y = a$3, n$5.width = i$4 - r$3, n$5.height = o$4 - a$3, n$5);
}
const t$3 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
};
function n$1(n$5, r$3, i$4) {
	if (i$4 ||= e$1(n$5, r$3, t$3), !i$4) return 0;
	let a$3 = i$4.width * i$4.height;
	return a$3 ? a$3 / (Math.min(n$5.width, r$3.width) * Math.min(n$5.height, r$3.height)) * 100 : 0;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isDocument.js
function isDocument(n$5) {
	return n$5 instanceof Document;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getPreciseScrollbarSize.js
const SUBPIXEL_OFFSET = /* @__PURE__ */ new Map();
let testStyleElement = null, testParentElement = null, testChildElement = null;
function getSubpixelScrollbarSize(t$6, e$5) {
	const n$5 = t$6.split(".");
	let l$4 = SUBPIXEL_OFFSET.get(n$5[1]);
	if (void 0 === l$4) {
		testStyleElement || (testStyleElement = document.createElement("style")), testStyleElement.innerHTML = `\n      #mezr-scrollbar-test::-webkit-scrollbar {\n        width: ${t$6} !important;\n      }\n    `, testParentElement && testChildElement || (testParentElement = document.createElement("div"), testChildElement = document.createElement("div"), testParentElement.appendChild(testChildElement), testParentElement.id = "mezr-scrollbar-test", testParentElement.style.cssText = "\n        all: unset !important;\n        position: fixed !important;\n        top: -200px !important;\n        left: 0px !important;\n        width: 100px !important;\n        height: 100px !important;\n        overflow: scroll !important;\n        pointer-events: none !important;\n        visibility: hidden !important;\n      ", testChildElement.style.cssText = "\n        all: unset !important;\n        position: absolute !important;\n        inset: 0 !important;\n      "), document.body.appendChild(testStyleElement), document.body.appendChild(testParentElement);
		l$4 = testParentElement.getBoundingClientRect().width - testChildElement.getBoundingClientRect().width - e$5, SUBPIXEL_OFFSET.set(n$5[1], l$4), document.body.removeChild(testParentElement), document.body.removeChild(testStyleElement);
	}
	return e$5 + l$4;
}
function getPreciseScrollbarSize(t$6, e$5, n$5) {
	if (n$5 <= 0) return 0;
	if (IS_CHROMIUM) {
		const n$6 = getStyle(t$6, "::-webkit-scrollbar"), l$4 = "x" === e$5 ? n$6.height : n$6.width, i$4 = parseFloat(l$4);
		if (!Number.isNaN(i$4) && !Number.isInteger(i$4)) return getSubpixelScrollbarSize(l$4, i$4);
	}
	return n$5;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getWindowWidth.js
function getWindowWidth(e$5, r$3 = !1) {
	if (r$3) return e$5.innerWidth;
	const { innerWidth: t$6, document: i$4 } = e$5, { documentElement: n$5 } = i$4, { clientWidth: c$4 } = n$5;
	return t$6 - getPreciseScrollbarSize(n$5, "y", t$6 - c$4);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDocumentWidth.js
function getDocumentWidth({ documentElement: t$6 }) {
	return Math.max(t$6.scrollWidth, t$6.clientWidth, t$6.getBoundingClientRect().width);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getElementWidth.js
function getElementWidth(t$6, e$5 = BOX_EDGE.border) {
	let { width: r$3 } = t$6.getBoundingClientRect();
	if (e$5 === BOX_EDGE.border) return r$3;
	const o$4 = getStyle(t$6);
	return e$5 === BOX_EDGE.margin ? (r$3 += Math.max(0, parseFloat(o$4.marginLeft) || 0), r$3 += Math.max(0, parseFloat(o$4.marginRight) || 0), r$3) : (r$3 -= parseFloat(o$4.borderLeftWidth) || 0, r$3 -= parseFloat(o$4.borderRightWidth) || 0, e$5 === BOX_EDGE.scrollbar ? r$3 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$4.overflowY) && (r$3 -= getPreciseScrollbarSize(t$6, "y", Math.round(r$3) - t$6.clientWidth)), e$5 === BOX_EDGE.padding || (r$3 -= parseFloat(o$4.paddingLeft) || 0, r$3 -= parseFloat(o$4.paddingRight) || 0), r$3));
}

//#endregion
//#region node_modules/mezr/dist/esm/getWidth.js
function getWidth(t$6, i$4 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowWidth(t$6, INCLUDE_WINDOW_SCROLLBAR[i$4]) : isDocument(t$6) ? getDocumentWidth(t$6) : getElementWidth(t$6, i$4);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getWindowHeight.js
function getWindowHeight(e$5, r$3 = !1) {
	if (r$3) return e$5.innerHeight;
	const { innerHeight: t$6, document: i$4 } = e$5, { documentElement: n$5 } = i$4, { clientHeight: c$4 } = n$5;
	return t$6 - getPreciseScrollbarSize(n$5, "x", t$6 - c$4);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDocumentHeight.js
function getDocumentHeight({ documentElement: t$6 }) {
	return Math.max(t$6.scrollHeight, t$6.clientHeight, t$6.getBoundingClientRect().height);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getElementHeight.js
function getElementHeight(t$6, e$5 = BOX_EDGE.border) {
	let { height: r$3 } = t$6.getBoundingClientRect();
	if (e$5 === BOX_EDGE.border) return r$3;
	const o$4 = getStyle(t$6);
	return e$5 === BOX_EDGE.margin ? (r$3 += Math.max(0, parseFloat(o$4.marginTop) || 0), r$3 += Math.max(0, parseFloat(o$4.marginBottom) || 0), r$3) : (r$3 -= parseFloat(o$4.borderTopWidth) || 0, r$3 -= parseFloat(o$4.borderBottomWidth) || 0, e$5 === BOX_EDGE.scrollbar ? r$3 : (!isDocumentElement(t$6) && SCROLLABLE_OVERFLOWS.has(o$4.overflowX) && (r$3 -= getPreciseScrollbarSize(t$6, "x", Math.round(r$3) - t$6.clientHeight)), e$5 === BOX_EDGE.padding || (r$3 -= parseFloat(o$4.paddingTop) || 0, r$3 -= parseFloat(o$4.paddingBottom) || 0), r$3));
}

//#endregion
//#region node_modules/mezr/dist/esm/getHeight.js
function getHeight(t$6, e$5 = BOX_EDGE.border) {
	return isWindow(t$6) ? getWindowHeight(t$6, INCLUDE_WINDOW_SCROLLBAR[e$5]) : isDocument(t$6) ? getDocumentHeight(t$6) : getElementHeight(t$6, e$5);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isRectObject.js
function isRectObject(t$6) {
	return t$6?.constructor === Object;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getOffsetFromDocument.js
function getOffsetFromDocument(t$6, o$4 = BOX_EDGE.border) {
	const e$5 = {
		left: 0,
		top: 0
	};
	if (isDocument(t$6)) return e$5;
	if (isWindow(t$6)) return e$5.left += t$6.scrollX || 0, e$5.top += t$6.scrollY || 0, e$5;
	const r$3 = t$6.ownerDocument.defaultView;
	r$3 && (e$5.left += r$3.scrollX || 0, e$5.top += r$3.scrollY || 0);
	const n$5 = t$6.getBoundingClientRect();
	if (e$5.left += n$5.left, e$5.top += n$5.top, o$4 === BOX_EDGE.border) return e$5;
	const l$4 = getStyle(t$6);
	return o$4 === BOX_EDGE.margin ? (e$5.left -= Math.max(0, parseFloat(l$4.marginLeft) || 0), e$5.top -= Math.max(0, parseFloat(l$4.marginTop) || 0), e$5) : (e$5.left += parseFloat(l$4.borderLeftWidth) || 0, e$5.top += parseFloat(l$4.borderTopWidth) || 0, o$4 === BOX_EDGE.scrollbar || o$4 === BOX_EDGE.padding || (e$5.left += parseFloat(l$4.paddingLeft) || 0, e$5.top += parseFloat(l$4.paddingTop) || 0), e$5);
}

//#endregion
//#region node_modules/mezr/dist/esm/getOffset.js
function getOffset(t$6, e$5) {
	const o$4 = isRectObject(t$6) ? {
		left: t$6.left,
		top: t$6.top
	} : Array.isArray(t$6) ? getOffsetFromDocument(...t$6) : getOffsetFromDocument(t$6);
	if (e$5 && !isDocument(e$5)) {
		const t$7 = isRectObject(e$5) ? e$5 : Array.isArray(e$5) ? getOffsetFromDocument(e$5[0], e$5[1]) : getOffsetFromDocument(e$5);
		o$4.left -= t$7.left, o$4.top -= t$7.top;
	}
	return o$4;
}

//#endregion
//#region node_modules/mezr/dist/esm/getRect.js
function getRect(t$6, e$5) {
	let i$4 = 0, g$2 = 0;
	isRectObject(t$6) ? (i$4 = t$6.width, g$2 = t$6.height) : Array.isArray(t$6) ? (i$4 = getWidth(...t$6), g$2 = getHeight(...t$6)) : (i$4 = getWidth(t$6), g$2 = getHeight(t$6));
	const r$3 = getOffset(t$6, e$5);
	return {
		width: i$4,
		height: g$2,
		...r$3,
		right: r$3.left + i$4,
		bottom: r$3.top + g$2
	};
}

//#endregion
//#region dist/get-rect-rpTuZ8DC.js
function t$2(...t$6) {
	let { width: n$5, height: r$3, left: i$4, top: a$3 } = getRect(...t$6);
	return {
		width: n$5,
		height: r$3,
		x: i$4,
		y: a$3
	};
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isIntersecting.js
function isIntersecting(t$6, e$5) {
	return !(t$6.left + t$6.width <= e$5.left || e$5.left + e$5.width <= t$6.left || t$6.top + t$6.height <= e$5.top || e$5.top + e$5.height <= t$6.top);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDistanceBetweenPoints.js
function getDistanceBetweenPoints(t$6, e$5, n$5, o$4) {
	return Math.sqrt(Math.pow(n$5 - t$6, 2) + Math.pow(o$4 - e$5, 2));
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getDistanceBetweenRects.js
function getDistanceBetweenRects(t$6, e$5) {
	if (isIntersecting(t$6, e$5)) return null;
	const n$5 = t$6.left + t$6.width, i$4 = t$6.top + t$6.height, o$4 = e$5.left + e$5.width, s$4 = e$5.top + e$5.height;
	return n$5 <= e$5.left ? i$4 <= e$5.top ? getDistanceBetweenPoints(n$5, i$4, e$5.left, e$5.top) : t$6.top >= s$4 ? getDistanceBetweenPoints(n$5, t$6.top, e$5.left, s$4) : e$5.left - n$5 : t$6.left >= o$4 ? i$4 <= e$5.top ? getDistanceBetweenPoints(t$6.left, i$4, o$4, e$5.top) : t$6.top >= s$4 ? getDistanceBetweenPoints(t$6.left, t$6.top, o$4, s$4) : t$6.left - o$4 : i$4 <= e$5.top ? e$5.top - i$4 : t$6.top - s$4;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getNormalizedRect.js
function getNormalizedRect(t$6) {
	return isRectObject(t$6) ? t$6 : getRect(t$6);
}

//#endregion
//#region node_modules/mezr/dist/esm/getDistance.js
function getDistance(e$5, t$6) {
	return getDistanceBetweenRects(getNormalizedRect(e$5), getNormalizedRect(t$6));
}

//#endregion
//#region dist/auto-scroll-Drw3BB1r.js
var o$1 = class {
	constructor(e$5, { batchSize: t$6 = 100, minBatchCount: n$5 = 0, maxBatchCount: r$3 = 2 ** 53 - 1, initialBatchCount: i$4 = 0, shrinkThreshold: a$3 = 2, onRelease: o$4 } = {}) {
		this._batchSize = Math.floor(Math.max(t$6, 1)), this._minSize = Math.floor(Math.max(n$5, 0)) * this._batchSize, this._maxSize = Math.floor(Math.min(Math.max(r$3 * this._batchSize, this._batchSize), 2 ** 53 - 1)), this._shrinkThreshold = Math.floor(Math.max(a$3, 1) * this._batchSize), this._data = Array(Math.floor(Math.max(Math.max(i$4, n$5) * this._batchSize, 0))), this._index = 0, this._getItem = e$5, this._onRelease = o$4;
	}
	get(...e$5) {
		if (this._index > 0) return this._getItem(this._data[--this._index], ...e$5);
		if (this._index === 0) {
			let e$6 = this._data.length, t$6 = Math.min(this._batchSize, this._maxSize - e$6);
			t$6 > 0 && (this._data.length = e$6 + t$6);
		}
		return this._getItem(void 0, ...e$5);
	}
	release(e$5) {
		if (this._index < this._maxSize && (this._onRelease && this._onRelease(e$5), this._data[this._index++] = e$5, this._index >= this._shrinkThreshold)) {
			let e$6 = this._data.length - this._batchSize;
			e$6 >= this._minSize && (this._data.length = e$6, this._index -= this._batchSize);
		}
	}
	destroy() {
		this._data.length = 0, this._index = 0;
	}
};
const s$1 = e(), c$1 = e();
function l(e$5, t$6) {
	return getDistance(e(e$5, s$1), e(t$6, c$1));
}
function u$1(e$5) {
	return e$5 instanceof Window;
}
function d(e$5) {
	return u$1(e$5) || e$5 === document.documentElement || e$5 === document.body ? window : e$5;
}
function f(e$5) {
	return u$1(e$5) ? e$5.scrollX : e$5.scrollLeft;
}
function p(e$5) {
	return u$1(e$5) && (e$5 = document.documentElement), e$5.scrollWidth - e$5.clientWidth;
}
function m(e$5) {
	return u$1(e$5) ? e$5.scrollY : e$5.scrollTop;
}
function h(e$5) {
	return u$1(e$5) && (e$5 = document.documentElement), e$5.scrollHeight - e$5.clientHeight;
}
function g(e$5, t$6) {
	return !(e$5.x + e$5.width <= t$6.x || t$6.x + t$6.width <= e$5.x || e$5.y + e$5.height <= t$6.y || t$6.y + t$6.height <= e$5.y);
}
const _ = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}, v = {
	direction: `none`,
	threshold: 0,
	distance: 0,
	value: 0,
	maxValue: 0,
	duration: 0,
	speed: 0,
	deltaTime: 0,
	isEnding: !1
}, y = {
	x: 1,
	y: 2
}, b = {
	forward: 4,
	reverse: 8
}, x = {
	none: 0,
	left: y.x | b.reverse,
	right: y.x | b.forward
}, S = {
	none: 0,
	up: y.y | b.reverse,
	down: y.y | b.forward
}, C = {
	...x,
	...S
};
function w(e$5) {
	switch (e$5) {
		case x.none:
		case S.none: return `none`;
		case x.left: return `left`;
		case x.right: return `right`;
		case S.up: return `up`;
		case S.down: return `down`;
		default: throw Error(`Unknown direction value: ${e$5}`);
	}
}
function T(e$5, t$6, n$5) {
	let { left: r$3 = 0, right: i$4 = 0, top: a$3 = 0, bottom: o$4 = 0 } = t$6;
	return r$3 = Math.max(0, r$3), i$4 = Math.max(0, i$4), a$3 = Math.max(0, a$3), o$4 = Math.max(0, o$4), n$5.width = e$5.width + r$3 + i$4, n$5.height = e$5.height + a$3 + o$4, n$5.x = e$5.x - r$3, n$5.y = e$5.y - a$3, n$5;
}
function E(e$5, t$6) {
	return Math.ceil(e$5) >= Math.floor(t$6);
}
function D(e$5, t$6) {
	return Math.min(t$6 / 2, e$5);
}
function O(e$5, t$6, n$5, r$3) {
	return Math.max(0, n$5 + e$5 * 2 + r$3 * t$6 - r$3) / 2;
}
var k = class {
	constructor() {
		this.positionX = 0, this.positionY = 0, this.directionX = C.none, this.directionY = C.none, this.overlapCheckRequestTime = 0;
	}
}, A = class {
	constructor() {
		this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
	}
	reset() {
		this.requestX && (this.requestX.action = null), this.requestY && (this.requestY.action = null), this.element = null, this.requestX = null, this.requestY = null, this.scrollLeft = 0, this.scrollTop = 0;
	}
	addRequest(e$5) {
		y.x & e$5.direction ? (this.requestX && this.removeRequest(this.requestX), this.requestX = e$5) : (this.requestY && this.removeRequest(this.requestY), this.requestY = e$5), e$5.action = this;
	}
	removeRequest(e$5) {
		this.requestX === e$5 ? (this.requestX = null, e$5.action = null) : this.requestY === e$5 && (this.requestY = null, e$5.action = null);
	}
	computeScrollValues() {
		this.element && (this.scrollLeft = this.requestX ? this.requestX.value : f(this.element), this.scrollTop = this.requestY ? this.requestY.value : m(this.element));
	}
	scroll() {
		this.element && (this.element.scrollTo ? this.element.scrollTo(this.scrollLeft, this.scrollTop) : (this.element.scrollLeft = this.scrollLeft, this.element.scrollTop = this.scrollTop));
	}
}, j = class {
	constructor() {
		this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
	}
	reset() {
		this.isActive && this.onStop(), this.item = null, this.element = null, this.isActive = !1, this.isEnding = !1, this.direction = 0, this.value = NaN, this.maxValue = 0, this.threshold = 0, this.distance = 0, this.deltaTime = 0, this.speed = 0, this.duration = 0, this.action = null;
	}
	hasReachedEnd() {
		return b.forward & this.direction ? E(this.value, this.maxValue) : this.value <= 0;
	}
	computeCurrentScrollValue() {
		return this.element ? this.value === this.value ? Math.max(0, Math.min(this.value, this.maxValue)) : y.x & this.direction ? f(this.element) : m(this.element) : 0;
	}
	computeNextScrollValue() {
		let e$5 = this.speed * (this.deltaTime / 1e3), t$6 = b.forward & this.direction ? this.value + e$5 : this.value - e$5;
		return Math.max(0, Math.min(t$6, this.maxValue));
	}
	computeSpeed() {
		if (!this.item || !this.element) return 0;
		let { speed: e$5 } = this.item;
		return typeof e$5 == `function` ? (v.direction = w(this.direction), v.threshold = this.threshold, v.distance = this.distance, v.value = this.value, v.maxValue = this.maxValue, v.duration = this.duration, v.speed = this.speed, v.deltaTime = this.deltaTime, v.isEnding = this.isEnding, e$5(this.element, v)) : e$5;
	}
	tick(e$5) {
		return this.isActive || (this.isActive = !0, this.onStart()), this.deltaTime = e$5, this.value = this.computeCurrentScrollValue(), this.speed = this.computeSpeed(), this.value = this.computeNextScrollValue(), this.duration += e$5, this.value;
	}
	onStart() {
		if (!this.item || !this.element) return;
		let { onStart: e$5 } = this.item;
		typeof e$5 == `function` && e$5(this.element, w(this.direction));
	}
	onStop() {
		if (!this.item || !this.element) return;
		let { onStop: e$5 } = this.item;
		typeof e$5 == `function` && e$5(this.element, w(this.direction));
	}
};
function M(e$5 = 500, t$6 = .5, n$5 = .25) {
	let r$3 = e$5 * (t$6 > 0 ? 1 / t$6 : Infinity), i$4 = e$5 * (n$5 > 0 ? 1 / n$5 : Infinity);
	return function(t$7, n$6) {
		let a$3 = 0;
		if (!n$6.isEnding) if (n$6.threshold > 0) {
			let t$8 = n$6.threshold - Math.max(0, n$6.distance);
			a$3 = e$5 / n$6.threshold * t$8;
		} else a$3 = e$5;
		let o$4 = n$6.speed;
		if (o$4 === a$3) return a$3;
		let s$4 = a$3;
		return o$4 < a$3 ? (s$4 = o$4 + r$3 * (n$6.deltaTime / 1e3), Math.min(a$3, s$4)) : (s$4 = o$4 - i$4 * (n$6.deltaTime / 1e3), Math.max(a$3, s$4));
	};
}
var N = class {
	constructor(e$5 = {}) {
		let { overlapCheckInterval: t$6 = 150 } = e$5;
		this.items = [], this.settings = { overlapCheckInterval: t$6 }, this._actions = [], this._isDestroyed = !1, this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, this._requests = {
			[y.x]: /* @__PURE__ */ new Map(),
			[y.y]: /* @__PURE__ */ new Map()
		}, this._itemData = /* @__PURE__ */ new Map(), this._requestPool = new o$1((e$6) => e$6 || new j(), {
			initialBatchCount: 1,
			minBatchCount: 1,
			onRelease: (e$6) => e$6.reset()
		}), this._actionPool = new o$1((e$6) => e$6 || new A(), {
			batchSize: 10,
			initialBatchCount: 1,
			minBatchCount: 1,
			onRelease: (e$6) => e$6.reset()
		}), this._frameRead = this._frameRead.bind(this), this._frameWrite = this._frameWrite.bind(this);
	}
	_frameRead(e$5) {
		this._isDestroyed || (e$5 && this._tickTime ? (this._tickDeltaTime = e$5 - this._tickTime, this._tickTime = e$5, this._updateItems(), this._updateRequests(), this._updateActions()) : (this._tickTime = e$5, this._tickDeltaTime = 0));
	}
	_frameWrite() {
		this._isDestroyed || this._applyActions();
	}
	_startTicking() {
		this._isTicking || (this._isTicking = !0, n.on(t$1.read, this._frameRead, this._frameRead), n.on(t$1.write, this._frameWrite, this._frameWrite));
	}
	_stopTicking() {
		this._isTicking && (this._isTicking = !1, this._tickTime = 0, this._tickDeltaTime = 0, n.off(t$1.read, this._frameRead), n.off(t$1.write, this._frameWrite));
	}
	_requestItemScroll(e$5, t$6, n$5, r$3, i$4, a$3, o$4) {
		let s$4 = this._requests[t$6], c$4 = s$4.get(e$5);
		c$4 ? (c$4.element !== n$5 || c$4.direction !== r$3) && c$4.reset() : (c$4 = this._requestPool.get(), s$4.set(e$5, c$4)), c$4.item = e$5, c$4.element = n$5, c$4.direction = r$3, c$4.threshold = i$4, c$4.distance = a$3, c$4.maxValue = o$4;
	}
	_cancelItemScroll(e$5, t$6) {
		let n$5 = this._requests[t$6], r$3 = n$5.get(e$5);
		r$3 && (r$3.action && r$3.action.removeRequest(r$3), this._requestPool.release(r$3), n$5.delete(e$5));
	}
	_checkItemOverlap(e$5, t$6, n$5) {
		let { inertAreaSize: a$3, targets: o$4, clientRect: s$4 } = e$5;
		if (!o$4.length) {
			t$6 && this._cancelItemScroll(e$5, y.x), n$5 && this._cancelItemScroll(e$5, y.y);
			return;
		}
		let c$4 = this._itemData.get(e$5), u$4 = c$4?.directionX, v$3 = c$4?.directionY;
		if (!u$4 && !v$3) {
			t$6 && this._cancelItemScroll(e$5, y.x), n$5 && this._cancelItemScroll(e$5, y.y);
			return;
		}
		let b$2 = null, x$2 = -Infinity, w$2 = 0, k$2 = -Infinity, A$2 = C.none, j$2 = 0, M$2 = 0, N$2 = null, P$1 = -Infinity, F$1 = 0, I$1 = -Infinity, L$1 = C.none, R$1 = 0, z$1 = 0, B = 0;
		for (; B < o$4.length; B++) {
			let e$6 = o$4[B], c$5 = typeof e$6.threshold == `number` ? e$6.threshold : 50, y$2 = !!(t$6 && u$4 && e$6.axis !== `y`), V = !!(n$5 && v$3 && e$6.axis !== `x`), H = e$6.priority || 0;
			if ((!y$2 || H < x$2) && (!V || H < P$1)) continue;
			let U = d(e$6.element || e$6), W = y$2 ? p(U) : -1, G = V ? h(U) : -1;
			if (W <= 0 && G <= 0) continue;
			let K = t$2([U, `padding`], window), q = n$1(s$4, K) || -Infinity;
			if (q === -Infinity) if (e$6.padding && g(s$4, T(K, e$6.padding, _))) q = -(l(s$4, K) || 0);
			else continue;
			if (y$2 && H >= x$2 && W > 0 && (H > x$2 || q > k$2)) {
				let e$7 = 0, t$7 = C.none, n$6 = D(c$5, K.width), r$3 = O(n$6, a$3, s$4.width, K.width);
				u$4 === C.right ? (e$7 = K.x + K.width + r$3 - (s$4.x + s$4.width), e$7 <= n$6 && !E(f(U), W) && (t$7 = C.right)) : u$4 === C.left && (e$7 = s$4.x - (K.x - r$3), e$7 <= n$6 && f(U) > 0 && (t$7 = C.left)), t$7 && (b$2 = U, x$2 = H, w$2 = n$6, k$2 = q, A$2 = t$7, j$2 = e$7, M$2 = W);
			}
			if (V && H >= P$1 && G > 0 && (H > P$1 || q > I$1)) {
				let e$7 = 0, t$7 = S.none, n$6 = D(c$5, K.height), r$3 = O(n$6, a$3, s$4.height, K.height);
				v$3 === C.down ? (e$7 = K.y + K.height + r$3 - (s$4.y + s$4.height), e$7 <= n$6 && !E(m(U), G) && (t$7 = C.down)) : v$3 === C.up && (e$7 = s$4.y - (K.y - r$3), e$7 <= n$6 && m(U) > 0 && (t$7 = C.up)), t$7 && (N$2 = U, P$1 = H, F$1 = n$6, I$1 = q, L$1 = t$7, R$1 = e$7, z$1 = G);
			}
		}
		t$6 && (b$2 && A$2 ? this._requestItemScroll(e$5, y.x, b$2, A$2, w$2, j$2, M$2) : this._cancelItemScroll(e$5, y.x)), n$5 && (N$2 && L$1 ? this._requestItemScroll(e$5, y.y, N$2, L$1, F$1, R$1, z$1) : this._cancelItemScroll(e$5, y.y));
	}
	_updateScrollRequest(e$5) {
		let { inertAreaSize: t$6, smoothStop: n$5, targets: a$3, clientRect: o$4 } = e$5.item, s$4 = null, c$4 = 0;
		for (; c$4 < a$3.length; c$4++) {
			let n$6 = a$3[c$4], l$4 = d(n$6.element || n$6);
			if (l$4 !== e$5.element) continue;
			let u$4 = !!(y.x & e$5.direction);
			if (u$4) {
				if (n$6.axis === `y`) continue;
			} else if (n$6.axis === `x`) continue;
			let v$3 = u$4 ? p(l$4) : h(l$4);
			if (v$3 <= 0) break;
			let x$2 = t$2([l$4, `padding`], window);
			if ((n$1(o$4, x$2) || -Infinity) === -Infinity) {
				let e$6 = n$6.scrollPadding || n$6.padding;
				if (!(e$6 && g(o$4, T(x$2, e$6, _)))) break;
			}
			let S$2 = D(typeof n$6.threshold == `number` ? n$6.threshold : 50, u$4 ? x$2.width : x$2.height), w$2 = O(S$2, t$6, u$4 ? o$4.width : o$4.height, u$4 ? x$2.width : x$2.height), k$2 = 0;
			if (k$2 = e$5.direction === C.left ? o$4.x - (x$2.x - w$2) : e$5.direction === C.right ? x$2.x + x$2.width + w$2 - (o$4.x + o$4.width) : e$5.direction === C.up ? o$4.y - (x$2.y - w$2) : x$2.y + x$2.height + w$2 - (o$4.y + o$4.height), k$2 > S$2) break;
			let A$2 = u$4 ? f(l$4) : m(l$4);
			if (s$4 = b.forward & e$5.direction ? E(A$2, v$3) : A$2 <= 0, s$4) break;
			return e$5.maxValue = v$3, e$5.threshold = S$2, e$5.distance = k$2, e$5.isEnding = !1, !0;
		}
		return n$5 === !0 && e$5.speed > 0 ? (s$4 === null && (s$4 = e$5.hasReachedEnd()), e$5.isEnding = !s$4) : e$5.isEnding = !1, e$5.isEnding;
	}
	_updateItems() {
		for (let e$5 = 0; e$5 < this.items.length; e$5++) {
			let t$6 = this.items[e$5], n$5 = this._itemData.get(t$6), { x: r$3, y: i$4 } = t$6.position, a$3 = n$5.positionX, o$4 = n$5.positionY;
			r$3 === a$3 && i$4 === o$4 || (n$5.directionX = r$3 > a$3 ? C.right : r$3 < a$3 ? C.left : n$5.directionX, n$5.directionY = i$4 > o$4 ? C.down : i$4 < o$4 ? C.up : n$5.directionY, n$5.positionX = r$3, n$5.positionY = i$4, n$5.overlapCheckRequestTime === 0 && (n$5.overlapCheckRequestTime = this._tickTime));
		}
	}
	_updateRequests() {
		let e$5 = this.items, t$6 = this._requests[y.x], n$5 = this._requests[y.y], r$3 = 0;
		for (; r$3 < e$5.length; r$3++) {
			let i$4 = e$5[r$3], a$3 = this._itemData.get(i$4), o$4 = a$3.overlapCheckRequestTime, s$4 = o$4 > 0 && this._tickTime - o$4 > this.settings.overlapCheckInterval, c$4 = !0, l$4 = t$6.get(i$4);
			l$4 && l$4.isActive && (c$4 = !this._updateScrollRequest(l$4), c$4 && (s$4 = !0, this._cancelItemScroll(i$4, y.x)));
			let u$4 = !0, d$2 = n$5.get(i$4);
			d$2 && d$2.isActive && (u$4 = !this._updateScrollRequest(d$2), u$4 && (s$4 = !0, this._cancelItemScroll(i$4, y.y))), s$4 && (a$3.overlapCheckRequestTime = 0, this._checkItemOverlap(i$4, c$4, u$4));
		}
	}
	_requestAction(e$5, t$6) {
		let n$5 = t$6 === y.x, r$3 = null, i$4 = 0;
		for (; i$4 < this._actions.length; i$4++) {
			if (r$3 = this._actions[i$4], e$5.element !== r$3.element) {
				r$3 = null;
				continue;
			}
			if (n$5 ? r$3.requestX : r$3.requestY) {
				this._cancelItemScroll(e$5.item, t$6);
				return;
			}
			break;
		}
		r$3 ||= this._actionPool.get(), r$3.element = e$5.element, r$3.addRequest(e$5), e$5.tick(this._tickDeltaTime), this._actions.push(r$3);
	}
	_updateActions() {
		let e$5 = 0;
		for (e$5 = 0; e$5 < this.items.length; e$5++) {
			let t$6 = this.items[e$5], n$5 = this._requests[y.x].get(t$6), r$3 = this._requests[y.y].get(t$6);
			n$5 && this._requestAction(n$5, y.x), r$3 && this._requestAction(r$3, y.y);
		}
		for (e$5 = 0; e$5 < this._actions.length; e$5++) this._actions[e$5].computeScrollValues();
	}
	_applyActions() {
		if (!this._actions.length) return;
		let e$5 = 0;
		for (e$5 = 0; e$5 < this._actions.length; e$5++) this._actions[e$5].scroll(), this._actionPool.release(this._actions[e$5]);
		this._actions.length = 0;
	}
	addItem(e$5) {
		if (this._isDestroyed || this._itemData.has(e$5)) return;
		let { x: t$6, y: n$5 } = e$5.position, r$3 = new k();
		r$3.positionX = t$6, r$3.positionY = n$5, r$3.directionX = C.none, r$3.directionY = C.none, r$3.overlapCheckRequestTime = this._tickTime, this._itemData.set(e$5, r$3), this.items.push(e$5), this._isTicking || this._startTicking();
	}
	removeItem(e$5) {
		if (this._isDestroyed) return;
		let t$6 = this.items.indexOf(e$5);
		t$6 !== -1 && (this._requests[y.x].get(e$5) && (this._cancelItemScroll(e$5, y.x), this._requests[y.x].delete(e$5)), this._requests[y.y].get(e$5) && (this._cancelItemScroll(e$5, y.y), this._requests[y.y].delete(e$5)), this._itemData.delete(e$5), this.items.splice(t$6, 1), this._isTicking && !this.items.length && this._stopTicking());
	}
	isDestroyed() {
		return this._isDestroyed;
	}
	isItemScrollingX(e$5) {
		return !!this._requests[y.x].get(e$5)?.isActive;
	}
	isItemScrollingY(e$5) {
		return !!this._requests[y.y].get(e$5)?.isActive;
	}
	isItemScrolling(e$5) {
		return this.isItemScrollingX(e$5) || this.isItemScrollingY(e$5);
	}
	updateSettings(e$5 = {}) {
		let { overlapCheckInterval: t$6 = this.settings.overlapCheckInterval } = e$5;
		this.settings.overlapCheckInterval = t$6;
	}
	destroy() {
		this._isDestroyed ||= (this.items.forEach((e$5) => this.removeItem(e$5)), this._requestPool.destroy(), this._actionPool.destroy(), this._actions.length = 0, !0);
	}
};

//#endregion
//#region dist/auto-scroll-JoquSmSR.js
const t = new N();

//#endregion
//#region dist/draggable/plugins/auto-scroll-plugin.js
const r = {
	x: 0,
	y: 0
}, i = {
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
		getPosition: (e$5) => {
			let { drag: t$6 } = e$5, n$5 = t$6?.items[0];
			if (n$5) return n$5.position;
			let i$4 = t$6 && (t$6.moveEvent || t$6.startEvent);
			return r.x = i$4 ? i$4.x : 0, r.y = i$4 ? i$4.y : 0, r;
		},
		getClientRect: (e$5) => {
			let { drag: t$6 } = e$5, n$5 = e$5.getClientRect();
			if (n$5) return n$5;
			let r$3 = t$6 && (t$6.moveEvent || t$6.startEvent);
			return i.width = r$3 ? 50 : 0, i.height = r$3 ? 50 : 0, i.x = r$3 ? r$3.x - 25 : 0, i.y = r$3 ? r$3.y - 25 : 0, i;
		},
		onStart: null,
		onStop: null
	};
}
var o = class {
	constructor(e$5, t$6) {
		this._draggableAutoScroll = e$5, this._draggable = t$6, this._position = {
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
		let { targets: e$5 } = this._getSettings();
		return typeof e$5 == `function` && (e$5 = e$5(this._draggable)), e$5;
	}
	get position() {
		let e$5 = this._position, { getPosition: t$6 } = this._getSettings();
		return typeof t$6 == `function` ? Object.assign(e$5, t$6(this._draggable)) : (e$5.x = 0, e$5.y = 0), e$5;
	}
	get clientRect() {
		let e$5 = this._clientRect, { getClientRect: t$6 } = this._getSettings();
		return typeof t$6 == `function` ? Object.assign(e$5, t$6(this._draggable)) : (e$5.width = 0, e$5.height = 0, e$5.x = 0, e$5.y = 0), e$5;
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
	constructor(t$6, r$3 = {}) {
		this.name = `autoscroll`, this.version = `0.0.3`, this.settings = this._parseSettings(r$3), this._autoScrollProxy = null, t$6.on(L.Start, () => {
			this._autoScrollProxy || (this._autoScrollProxy = new o(this, t$6), t.addItem(this._autoScrollProxy));
		}), t$6.on(L.End, () => {
			this._autoScrollProxy &&= (t.removeItem(this._autoScrollProxy), null);
		});
	}
	_parseSettings(e$5, t$6 = a$1()) {
		let { targets: n$5 = t$6.targets, inertAreaSize: r$3 = t$6.inertAreaSize, speed: i$4 = t$6.speed, smoothStop: o$4 = t$6.smoothStop, getPosition: s$4 = t$6.getPosition, getClientRect: c$4 = t$6.getClientRect, onStart: l$4 = t$6.onStart, onStop: u$4 = t$6.onStop } = e$5 || {};
		return {
			targets: n$5,
			inertAreaSize: r$3,
			speed: i$4,
			smoothStop: o$4,
			getPosition: s$4,
			getClientRect: c$4,
			onStart: l$4,
			onStop: u$4
		};
	}
	updateSettings(e$5 = {}) {
		this.settings = this._parseSettings(e$5, this.settings);
	}
};
function c(e$5) {
	return (t$6) => {
		let n$5 = new s(t$6, e$5), r$3 = t$6;
		return r$3.plugins[n$5.name] = n$5, r$3;
	};
}

//#endregion
//#region examples/002-draggable-auto-scroll/index.ts
const element = document.querySelector(".draggable");
const dragContainer = document.querySelector(".drag-container");
new z([new u(element), new a(element, { computeSpeed: () => 100 })], {
	container: dragContainer,
	elements: () => [element],
	frozenStyles: () => ["left", "top"],
	onStart: () => {
		element.classList.add("dragging");
	},
	onEnd: () => {
		element.classList.remove("dragging");
	}
}).use(c({ targets: [{
	element: window,
	axis: "y",
	padding: {
		top: Infinity,
		bottom: Infinity
	}
}] }));

//#endregion
});