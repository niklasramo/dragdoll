(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region dist/sensor-TzqXogk2.js
const e = {
	Start: `start`,
	Move: `move`,
	Cancel: `cancel`,
	End: `end`,
	Destroy: `destroy`
};

//#endregion
//#region node_modules/eventti/dist/index.js
var E$1 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$1, v = class {
	constructor(t$3 = {}) {
		this.dedupe = t$3.dedupe || E$1.ADD, this.getId = t$3.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$3) {
		let n$4 = this._events.get(t$3);
		return n$4 ? n$4.l || (n$4.l = [...n$4.m.values()]) : null;
	}
	on(t$3, n$4, e$3) {
		let i$3 = this._events, s$2 = i$3.get(t$3);
		s$2 || (s$2 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$3.set(t$3, s$2));
		let o$2 = s$2.m;
		if (e$3 = e$3 === r$1 ? this.getId(n$4) : e$3, o$2.has(e$3)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$3;
			case E$1.UPDATE:
				s$2.l = null;
				break;
			default: o$2.delete(e$3), s$2.l = null;
		}
		return o$2.set(e$3, n$4), s$2.l?.push(n$4), e$3;
	}
	once(t$3, n$4, e$3) {
		let i$3 = 0;
		return e$3 = e$3 === r$1 ? this.getId(n$4) : e$3, this.on(t$3, (...s$2) => {
			i$3 || (i$3 = 1, this.off(t$3, e$3), n$4(...s$2));
		}, e$3);
	}
	off(t$3, n$4) {
		if (t$3 === r$1) {
			this._events.clear();
			return;
		}
		if (n$4 === r$1) {
			this._events.delete(t$3);
			return;
		}
		let e$3 = this._events.get(t$3);
		e$3?.m.delete(n$4) && (e$3.l = null, e$3.m.size || this._events.delete(t$3));
	}
	emit(t$3, ...n$4) {
		let e$3 = this._getListeners(t$3);
		if (e$3) {
			let i$3 = e$3.length, s$2 = 0;
			if (n$4.length) for (; s$2 < i$3; s$2++) e$3[s$2](...n$4);
			else for (; s$2 < i$3; s$2++) e$3[s$2]();
		}
	}
	listenerCount(t$3) {
		if (t$3 === r$1) {
			let n$4 = 0;
			return this._events.forEach((e$3) => {
				n$4 += e$3.m.size;
			}), n$4;
		}
		return this._events.get(t$3)?.m.size || 0;
	}
};

//#endregion
//#region node_modules/tikki/dist/index.js
var _$1 = E$1, o$1 = class {
	constructor(e$3 = {}) {
		let { phases: t$3 = [], dedupe: r$2, getId: s$2 } = e$3;
		this._phases = t$3, this._emitter = new v({
			getId: s$2,
			dedupe: r$2
		}), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
	}
	get phases() {
		return this._phases;
	}
	set phases(e$3) {
		this._phases = e$3;
	}
	get dedupe() {
		return this._emitter.dedupe;
	}
	set dedupe(e$3) {
		this._emitter.dedupe = e$3;
	}
	get getId() {
		return this._emitter.getId;
	}
	set getId(e$3) {
		this._emitter.getId = e$3;
	}
	tick(...e$3) {
		this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e$3);
	}
	on(e$3, t$3, r$2) {
		return this._emitter.on(e$3, t$3, r$2);
	}
	once(e$3, t$3, r$2) {
		return this._emitter.once(e$3, t$3, r$2);
	}
	off(e$3, t$3) {
		return this._emitter.off(e$3, t$3);
	}
	count(e$3) {
		return this._emitter.listenerCount(e$3);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$3 = this._queue, t$3 = this._phases, r$2 = this._getListeners, s$2 = 0, a$2 = t$3.length, n$4;
		for (; s$2 < a$2; s$2++) n$4 = r$2(t$3[s$2]), n$4 && e$3.push(n$4);
		return e$3;
	}
	_processQueue(...e$3) {
		let t$3 = this._queue, r$2 = t$3.length;
		if (!r$2) return;
		let s$2 = 0, a$2 = 0, n$4, c$2;
		for (; s$2 < r$2; s$2++) for (n$4 = t$3[s$2], a$2 = 0, c$2 = n$4.length; a$2 < c$2; a$2++) n$4[a$2](...e$3);
		t$3.length = 0;
	}
};
function u$2(i$3 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$3) => {
		let t$3 = requestAnimationFrame(e$3);
		return () => cancelAnimationFrame(t$3);
	};
	{
		let e$3 = 1e3 / i$3, t$3 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$2) => {
			let s$2 = setTimeout(() => r$2(t$3()), e$3);
			return () => clearTimeout(s$2);
		};
	}
}
var l$2 = class extends o$1 {
	constructor(e$3 = {}) {
		let { paused: t$3 = !1, onDemand: r$2 = !1, requestFrame: s$2 = u$2(),...a$2 } = e$3;
		super(a$2), this._paused = t$3, this._onDemand = r$2, this._requestFrame = s$2, this._cancelFrame = null, this._empty = !0, !t$3 && !r$2 && this._request();
	}
	get phases() {
		return this._phases;
	}
	set phases(e$3) {
		this._phases = e$3, e$3.length ? (this._empty = !1, this._request()) : this._empty = !0;
	}
	get paused() {
		return this._paused;
	}
	set paused(e$3) {
		this._paused = e$3, e$3 ? this._cancel() : this._request();
	}
	get onDemand() {
		return this._onDemand;
	}
	set onDemand(e$3) {
		this._onDemand = e$3, e$3 || this._request();
	}
	get requestFrame() {
		return this._requestFrame;
	}
	set requestFrame(e$3) {
		this._requestFrame !== e$3 && (this._requestFrame = e$3, this._cancelFrame && (this._cancel(), this._request()));
	}
	tick(...e$3) {
		if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
			if (!this._fillQueue().length) {
				this._empty = !0;
				return;
			}
			this._onDemand && this._request(), this._processQueue(...e$3);
		}
	}
	on(e$3, t$3, r$2) {
		let s$2 = super.on(e$3, t$3, r$2);
		return this._empty = !1, this._request(), s$2;
	}
	once(e$3, t$3, r$2) {
		let s$2 = super.once(e$3, t$3, r$2);
		return this._empty = !1, this._request(), s$2;
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
const t = {
	read: Symbol(),
	write: Symbol()
};
let n$2 = new l$2({ phases: [t.read, t.write] });

//#endregion
//#region dist/constants-BG0DGMmK.js
const e$1 = typeof window < `u` && window.document !== void 0, t$1 = e$1 && `ontouchstart` in window, n$3 = e$1 && !!window.PointerEvent;
e$1 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

//#endregion
//#region dist/get-style-e3zfxW9-.js
const e$2 = /* @__PURE__ */ new WeakMap();
function t$2(t$3) {
	let n$4 = e$2.get(t$3)?.deref();
	return n$4 || (n$4 = window.getComputedStyle(t$3, null), e$2.set(t$3, new WeakRef(n$4))), n$4;
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$3, t$3) {
	if (t$3) return window.getComputedStyle(e$3, t$3);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$3)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$3, null), STYLE_DECLARATION_CACHE.set(e$3, new WeakRef(C$1))), C$1;
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
const IS_CHROMIUM = (() => {
	try {
		return window.navigator.userAgentData.brands.some((({ brand: n$4 }) => "Chromium" === n$4));
	} catch (n$4) {
		return !1;
	}
})();

//#endregion
//#region node_modules/mezr/dist/esm/utils/isBlockElement.js
function isBlockElement(e$3) {
	switch (getStyle(e$3).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$4) {
	const t$3 = getStyle(n$4);
	if (!IS_SAFARI) {
		const { filter: n$5 } = t$3;
		if (n$5 && "none" !== n$5) return !0;
		const { backdropFilter: e$4 } = t$3;
		if (e$4 && "none" !== e$4) return !0;
		const { willChange: i$4 } = t$3;
		if (i$4 && (i$4.indexOf("filter") > -1 || i$4.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$3 = isBlockElement(n$4);
	if (!e$3) return e$3;
	const { transform: i$3 } = t$3;
	if (i$3 && "none" !== i$3) return !0;
	const { perspective: r$2 } = t$3;
	if (r$2 && "none" !== r$2) return !0;
	const { contentVisibility: o$2 } = t$3;
	if (o$2 && "auto" === o$2) return !0;
	const { contain: f$1 } = t$3;
	if (f$1 && ("strict" === f$1 || "content" === f$1 || f$1.indexOf("paint") > -1 || f$1.indexOf("layout") > -1)) return !0;
	const { willChange: c$2 } = t$3;
	return !(!c$2 || !(c$2.indexOf("transform") > -1 || c$2.indexOf("perspective") > -1 || c$2.indexOf("contain") > -1)) || !!(IS_SAFARI && c$2 && c$2.indexOf("filter") > -1);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$3) {
	return "static" !== getStyle(t$3).position || isContainingBlockForFixedElement(t$3);
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$3) {
	return e$3 instanceof HTMLHtmlElement;
}

//#endregion
//#region node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$3, t$3 = {}) {
	if (isDocumentElement(e$3)) return e$3.ownerDocument.defaultView;
	const n$4 = t$3.position || getStyle(e$3).position, { skipDisplayNone: i$3, container: o$2 } = t$3;
	switch (n$4) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$4 = o$2 || e$3.parentElement;
			for (; t$4;) {
				const e$4 = isBlockElement(t$4);
				if (e$4) return t$4;
				if (null === e$4 && !i$3) return null;
				t$4 = t$4.parentElement;
			}
			return e$3.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$4 = "fixed" === n$4;
			let l$3 = o$2 || e$3.parentElement;
			for (; l$3;) {
				const e$4 = t$4 ? isContainingBlockForFixedElement(l$3) : isContainingBlockForAbsoluteElement(l$3);
				if (!0 === e$4) return l$3;
				if (null === e$4 && !i$3) return null;
				l$3 = l$3.parentElement;
			}
			return e$3.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$4) {
	return n$4 instanceof Window;
}

//#endregion
//#region node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$4, t$3 = {}) {
	const { display: o$2 } = getStyle(n$4);
	if ("none" === o$2 || "contents" === o$2) return null;
	const e$3 = t$3.position || getStyle(n$4).position, { skipDisplayNone: s$2, container: r$2 } = t$3;
	switch (e$3) {
		case "relative": return n$4;
		case "fixed": return getContainingBlock(n$4, {
			container: r$2,
			position: e$3,
			skipDisplayNone: s$2
		});
		case "absolute": {
			const t$4 = getContainingBlock(n$4, {
				container: r$2,
				position: e$3,
				skipDisplayNone: s$2
			});
			return isWindow(t$4) ? n$4.ownerDocument : t$4;
		}
		default: return null;
	}
}

//#endregion
//#region dist/draggable-CAyDmcAi.js
var s$1 = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$3, t$3) {
		this._cache.set(e$3, t$3), this._validation.set(e$3, void 0);
	}
	get(e$3) {
		return this._cache.get(e$3);
	}
	has(e$3) {
		return this._cache.has(e$3);
	}
	delete(e$3) {
		this._cache.delete(e$3), this._validation.delete(e$3);
	}
	isValid(e$3) {
		return this._validation.has(e$3);
	}
	invalidate(e$3) {
		e$3 === void 0 ? this._validation.clear() : this._validation.delete(e$3);
	}
	clear() {
		this._cache.clear(), this._validation.clear();
	}
}, c$1 = class {
	constructor(e$3, t$3) {
		this.sensor = e$3, this.startEvent = t$3, this.prevMoveEvent = t$3, this.moveEvent = t$3, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new s$1(), this._clientOffsetCache = new s$1();
	}
};
function l$1(e$3, t$3 = {
	x: 0,
	y: 0
}) {
	if (t$3.x = 0, t$3.y = 0, e$3 instanceof Window) return t$3;
	if (e$3 instanceof Document) return t$3.x = window.scrollX * -1, t$3.y = window.scrollY * -1, t$3;
	let { x: n$4, y: r$2 } = e$3.getBoundingClientRect(), a$2 = t$2(e$3);
	return t$3.x = n$4 + (parseFloat(a$2.borderLeftWidth) || 0), t$3.y = r$2 + (parseFloat(a$2.borderTopWidth) || 0), t$3;
}
function u$1(e$3) {
	return typeof e$3 == `object` && !!e$3 && `x` in e$3 && `y` in e$3;
}
const d = {
	x: 0,
	y: 0
}, f = {
	x: 0,
	y: 0
};
function p(e$3, t$3, n$4 = {
	x: 0,
	y: 0
}) {
	let r$2 = u$1(e$3) ? e$3 : l$1(e$3, d), i$3 = u$1(t$3) ? t$3 : l$1(t$3, f);
	return n$4.x = i$3.x - r$2.x, n$4.y = i$3.y - r$2.y, n$4;
}
function m(e$3) {
	let t$3 = t$2(e$3), n$4 = parseFloat(t$3.height) || 0;
	return t$3.boxSizing === `border-box` ? n$4 : (n$4 += parseFloat(t$3.borderTopWidth) || 0, n$4 += parseFloat(t$3.borderBottomWidth) || 0, n$4 += parseFloat(t$3.paddingTop) || 0, n$4 += parseFloat(t$3.paddingBottom) || 0, e$3 instanceof HTMLElement && (n$4 += e$3.offsetHeight - e$3.clientHeight), n$4);
}
function h(e$3) {
	let t$3 = t$2(e$3), n$4 = parseFloat(t$3.width) || 0;
	return t$3.boxSizing === `border-box` ? n$4 : (n$4 += parseFloat(t$3.borderLeftWidth) || 0, n$4 += parseFloat(t$3.borderRightWidth) || 0, n$4 += parseFloat(t$3.paddingLeft) || 0, n$4 += parseFloat(t$3.paddingRight) || 0, e$3 instanceof HTMLElement && (n$4 += e$3.offsetWidth - e$3.clientWidth), n$4);
}
function g(e$3, t$3 = !1) {
	let { translate: n$4, rotate: r$2, scale: a$2, transform: o$2 } = t$2(e$3), s$2 = ``;
	if (n$4 && n$4 !== `none`) {
		let [t$4 = `0px`, r$3 = `0px`, i$3] = n$4.split(` `);
		t$4.includes(`%`) && (t$4 = `${parseFloat(t$4) / 100 * h(e$3)}px`), r$3.includes(`%`) && (r$3 = `${parseFloat(r$3) / 100 * m(e$3)}px`), i$3 ? s$2 += `translate3d(${t$4},${r$3},${i$3})` : s$2 += `translate(${t$4},${r$3})`;
	}
	if (r$2 && r$2 !== `none`) {
		let e$4 = r$2.split(` `);
		e$4.length > 1 ? s$2 += `rotate3d(${e$4.join(`,`)})` : s$2 += `rotate(${e$4.join(`,`)})`;
	}
	if (a$2 && a$2 !== `none`) {
		let e$4 = a$2.split(` `);
		e$4.length === 3 ? s$2 += `scale3d(${e$4.join(`,`)})` : s$2 += `scale(${e$4.join(`,`)})`;
	}
	return !t$3 && o$2 && o$2 !== `none` && (s$2 += o$2), s$2;
}
function _(e$3) {
	let t$3 = e$3.split(` `), n$4 = ``, r$2 = ``, i$3 = ``;
	return t$3.length === 1 ? n$4 = r$2 = t$3[0] : t$3.length === 2 ? [n$4, r$2] = t$3 : [n$4, r$2, i$3] = t$3, {
		x: parseFloat(n$4) || 0,
		y: parseFloat(r$2) || 0,
		z: parseFloat(i$3) || 0
	};
}
function v$1(e$3) {
	return e$3.setMatrixValue(`scale(1, 1)`);
}
const y = e$1 ? new DOMMatrix() : null;
function b(e$3, t$3 = new DOMMatrix()) {
	let n$4 = e$3;
	for (v$1(t$3); n$4;) {
		let e$4 = g(n$4);
		if (e$4 && (y.setMatrixValue(e$4), !y.isIdentity)) {
			let { transformOrigin: e$5 } = t$2(n$4), { x: r$2, y: a$2, z: o$2 } = _(e$5);
			o$2 === 0 ? y.setMatrixValue(`translate(${r$2}px,${a$2}px) ${y} translate(${r$2 * -1}px,${a$2 * -1}px)`) : y.setMatrixValue(`translate3d(${r$2}px,${a$2}px,${o$2}px) ${y} translate3d(${r$2 * -1}px,${a$2 * -1}px,${o$2 * -1}px)`), t$3.preMultiplySelf(y);
		}
		n$4 = n$4.parentElement;
	}
	return t$3;
}
function x(e$3, t$3, n$4 = !1) {
	let { style: r$2 } = e$3;
	for (let e$4 in t$3) r$2.setProperty(e$4, t$3[e$4], n$4 ? `important` : ``);
}
function S() {
	let e$3 = document.createElement(`div`);
	return e$3.classList.add(`dragdoll-measure`), x(e$3, {
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
	}, !0), e$3;
}
function C(e$3) {
	return e$3.m11 !== 1 || e$3.m12 !== 0 || e$3.m13 !== 0 || e$3.m14 !== 0 || e$3.m21 !== 0 || e$3.m22 !== 1 || e$3.m23 !== 0 || e$3.m24 !== 0 || e$3.m31 !== 0 || e$3.m32 !== 0 || e$3.m33 !== 1 || e$3.m34 !== 0 || e$3.m43 !== 0 || e$3.m44 !== 1;
}
const w = e$1 ? S() : null;
var T = class {
	constructor(e$3, t$3) {
		if (!e$3.isConnected) throw Error(`Element is not connected`);
		let { drag: n$4 } = t$3;
		if (!n$4) throw Error(`Drag is not defined`);
		let r$2 = t$2(e$3), a$2 = e$3.getBoundingClientRect(), s$2 = g(e$3, !0);
		this.data = {}, this.element = e$3, this.elementTransformOrigin = _(r$2.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$2 + r$2.transform), this.elementOffsetMatrix = new DOMMatrix(s$2).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = n$4._matrixCache, this._clientOffsetCache = n$4._clientOffsetCache;
		let c$2 = e$3.parentElement;
		if (!c$2) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$2;
		let l$3 = t$3.settings.container || c$2;
		if (this.dragContainer = l$3, c$2 !== l$3) {
			let { position: e$4 } = r$2;
			if (e$4 !== `fixed` && e$4 !== `absolute`) throw Error(`Dragged element has "${e$4}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$3 = getOffsetContainer(e$3) || e$3;
		this.elementOffsetContainer = u$3, this.dragOffsetContainer = l$3 === c$2 ? u$3 : getOffsetContainer(e$3, { container: l$3 });
		{
			let { width: e$4, height: t$4, x: n$5, y: r$3 } = a$2;
			this.clientRect = {
				width: e$4,
				height: t$4,
				x: n$5,
				y: r$3
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$3.settings.frozenStyles({
			draggable: t$3,
			drag: n$4,
			item: this,
			style: r$2
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$4 = {};
			for (let t$4 of d$1) e$4[t$4] = r$2[t$4];
			this.frozenStyles = e$4;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$4 = {};
			for (let n$5 in this.frozenStyles) this.frozenStyles.hasOwnProperty(n$5) && (t$4[n$5] = e$3.style[n$5]);
			this.unfrozenStyles = t$4;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$3) => {
			if (!this._matrixCache.isValid(e$3)) {
				let t$3 = this._matrixCache.get(e$3) || [new DOMMatrix(), new DOMMatrix()], [n$4, r$2] = t$3;
				b(e$3, n$4), r$2.setMatrixValue(n$4.toString()).invertSelf(), this._matrixCache.set(e$3, t$3);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$3, elementContainer: t$3, dragOffsetContainer: n$4, dragContainer: r$2, containerOffset: i$3, _clientOffsetCache: a$2, _matrixCache: o$2 } = this;
		if (e$3 !== n$4) {
			let [s$2, c$2] = [[r$2, n$4], [t$3, e$3]].map(([e$4, t$4]) => {
				let n$5 = a$2.get(t$4) || {
					x: 0,
					y: 0
				};
				if (!a$2.isValid(t$4)) {
					let r$3 = o$2.get(e$4);
					t$4 instanceof HTMLElement && r$3 && !r$3[0].isIdentity ? C(r$3[0]) ? (w.style.setProperty(`transform`, r$3[1].toString(), `important`), t$4.append(w), l$1(w, n$5), w.remove()) : (l$1(t$4, n$5), n$5.x -= r$3[0].m41, n$5.y -= r$3[0].m42) : l$1(t$4, n$5);
				}
				return a$2.set(t$4, n$5), n$5;
			});
			p(s$2, c$2, i$3);
		} else i$3.x = 0, i$3.y = 0;
	}
	getContainerMatrix() {
		return this._matrixCache.get(this.elementContainer);
	}
	getDragContainerMatrix() {
		return this._matrixCache.get(this.dragContainer);
	}
	updateSize(e$3) {
		if (e$3) this.clientRect.width = e$3.width, this.clientRect.height = e$3.height;
		else {
			let { width: e$4, height: t$3 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$4, this.clientRect.height = t$3;
		}
	}
};
function E(e$3, t$3, n$4 = null) {
	if (`moveBefore` in e$3 && e$3.isConnected === t$3.isConnected) try {
		e$3.moveBefore(t$3, n$4);
		return;
	} catch {}
	let r$2 = document.activeElement, i$3 = t$3.contains(r$2);
	e$3.insertBefore(t$3, n$4), i$3 && document.activeElement !== r$2 && r$2 instanceof HTMLElement && r$2.focus({ preventScroll: !0 });
}
function D(e$3, t$3 = 0) {
	let n$4 = 10 ** t$3;
	return Math.round((e$3 + 2 ** -52) * n$4) / n$4;
}
function O(e$3, t$3) {
	return e$3.isIdentity && t$3.isIdentity ? !0 : e$3.is2D && t$3.is2D ? e$3.a === t$3.a && e$3.b === t$3.b && e$3.c === t$3.c && e$3.d === t$3.d && e$3.e === t$3.e && e$3.f === t$3.f : e$3.m11 === t$3.m11 && e$3.m12 === t$3.m12 && e$3.m13 === t$3.m13 && e$3.m14 === t$3.m14 && e$3.m21 === t$3.m21 && e$3.m22 === t$3.m22 && e$3.m23 === t$3.m23 && e$3.m24 === t$3.m24 && e$3.m31 === t$3.m31 && e$3.m32 === t$3.m32 && e$3.m33 === t$3.m33 && e$3.m34 === t$3.m34 && e$3.m41 === t$3.m41 && e$3.m42 === t$3.m42 && e$3.m43 === t$3.m43 && e$3.m44 === t$3.m44;
}
const k = {
	capture: !0,
	passive: !0
}, A = {
	x: 0,
	y: 0
}, j = e$1 ? new DOMMatrix() : null, M = e$1 ? new DOMMatrix() : null;
var N = function(e$3) {
	return e$3[e$3.None = 0] = `None`, e$3[e$3.Init = 1] = `Init`, e$3[e$3.Prepare = 2] = `Prepare`, e$3[e$3.FinishPrepare = 3] = `FinishPrepare`, e$3[e$3.Apply = 4] = `Apply`, e$3[e$3.FinishApply = 5] = `FinishApply`, e$3;
}(N || {}), P = function(e$3) {
	return e$3[e$3.Pending = 0] = `Pending`, e$3[e$3.Resolved = 1] = `Resolved`, e$3[e$3.Rejected = 2] = `Rejected`, e$3;
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
	applyPosition: ({ item: e$3, phase: t$3 }) => {
		let n$4 = t$3 === I.End || t$3 === I.EndAlign, [r$2, i$3] = e$3.getContainerMatrix(), [a$2, o$2] = e$3.getDragContainerMatrix(), { position: s$2, alignmentOffset: c$2, containerOffset: l$3, elementTransformMatrix: u$3, elementTransformOrigin: d$1, elementOffsetMatrix: f$1 } = e$3, { x: p$1, y: m$1, z: h$1 } = d$1, g$1 = !u$3.isIdentity && (p$1 !== 0 || m$1 !== 0 || h$1 !== 0), _$2 = s$2.x + c$2.x + l$3.x, y$1 = s$2.y + c$2.y + l$3.y;
		v$1(j), g$1 && (h$1 === 0 ? j.translateSelf(-p$1, -m$1) : j.translateSelf(-p$1, -m$1, -h$1)), n$4 ? i$3.isIdentity || j.multiplySelf(i$3) : o$2.isIdentity || j.multiplySelf(o$2), v$1(M).translateSelf(_$2, y$1), j.multiplySelf(M), r$2.isIdentity || j.multiplySelf(r$2), g$1 && (v$1(M).translateSelf(p$1, m$1, h$1), j.multiplySelf(M)), u$3.isIdentity || j.multiplySelf(u$3), f$1.isIdentity || j.preMultiplySelf(f$1), e$3.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$3 }) => e$3.items[0].clientRect || null,
	positionModifiers: [],
	group: null
};
var z = class {
	constructor(t$3, n$4 = {}) {
		let { id: r$2 = Symbol(),...i$3 } = n$4;
		this.id = r$2, this.sensors = t$3, this.settings = this._parseSettings(i$3), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((t$4) => {
			this._sensorData.set(t$4, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (e$3) => this._onMove(e$3, t$4),
				onEnd: (e$3) => this._onEnd(e$3, t$4)
			});
			let { onMove: n$5, onEnd: r$3 } = this._sensorData.get(t$4);
			t$4.on(e.Start, n$5, n$5), t$4.on(e.Move, n$5, n$5), t$4.on(e.Cancel, r$3, r$3), t$4.on(e.End, r$3, r$3), t$4.on(e.Destroy, r$3, r$3);
		});
	}
	_parseSettings(e$3, t$3 = R) {
		let { container: n$4 = t$3.container, startPredicate: r$2 = t$3.startPredicate, elements: i$3 = t$3.elements, frozenStyles: a$2 = t$3.frozenStyles, positionModifiers: o$2 = t$3.positionModifiers, applyPosition: s$2 = t$3.applyPosition, computeClientRect: c$2 = t$3.computeClientRect, group: l$3 = t$3.group, onPrepareStart: u$3 = t$3.onPrepareStart, onStart: d$1 = t$3.onStart, onPrepareMove: f$1 = t$3.onPrepareMove, onMove: p$1 = t$3.onMove, onEnd: m$1 = t$3.onEnd, onDestroy: h$1 = t$3.onDestroy } = e$3 || {};
		return {
			container: n$4,
			startPredicate: r$2,
			elements: i$3,
			frozenStyles: a$2,
			positionModifiers: o$2,
			applyPosition: s$2,
			computeClientRect: c$2,
			group: l$3,
			onPrepareStart: u$3,
			onStart: d$1,
			onPrepareMove: f$1,
			onMove: p$1,
			onEnd: m$1,
			onDestroy: h$1
		};
	}
	_emit(e$3, ...t$3) {
		this._emitter.emit(e$3, ...t$3);
	}
	_onMove(e$3, r$2) {
		let i$3 = this._sensorData.get(r$2);
		if (i$3) switch (i$3.predicateState) {
			case P.Pending: {
				i$3.predicateEvent = e$3;
				let t$3 = this.settings.startPredicate({
					draggable: this,
					sensor: r$2,
					event: e$3
				});
				t$3 === !0 ? this.resolveStartPredicate(r$2) : t$3 === !1 && this.rejectStartPredicate(r$2);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = e$3, n$2.once(t.read, this._prepareMove, this._moveId), n$2.once(t.write, this._applyMove, this._moveId));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$3, t$3) {
		let n$4 = this._sensorData.get(t$3);
		n$4 && (this.drag ? n$4.predicateState === P.Resolved && (this.drag.endEvent = e$3, this._sensorData.forEach((e$4) => {
			e$4.predicateState = P.Pending, e$4.predicateEvent = null;
		}), this.stop()) : (n$4.predicateState = P.Pending, n$4.predicateEvent = null));
	}
	_prepareStart() {
		let e$3 = this.drag;
		e$3 && (this._startPhase = N.Prepare, e$3.items = (this.settings.elements({
			draggable: this,
			drag: e$3
		}) || []).map((e$4) => new T(e$4, this)), this._applyModifiers(F.Start, 0, 0), this._emit(L.PrepareStart, e$3.startEvent), this.settings.onPrepareStart?.(e$3, this), this._startPhase = N.FinishPrepare);
	}
	_applyStart() {
		let e$3 = this.drag;
		if (e$3) {
			this._startPhase = N.Apply;
			for (let t$3 of e$3.items) t$3.dragContainer !== t$3.elementContainer && E(t$3.dragContainer, t$3.element), t$3.frozenStyles && Object.assign(t$3.element.style, t$3.frozenStyles), this.settings.applyPosition({
				phase: I.Start,
				draggable: this,
				drag: e$3,
				item: t$3
			});
			for (let t$3 of e$3.items) {
				let e$4 = t$3.getContainerMatrix()[0], n$4 = t$3.getDragContainerMatrix()[0];
				if (O(e$4, n$4) || !C(e$4) && !C(n$4)) continue;
				let r$2 = t$3.element.getBoundingClientRect(), { alignmentOffset: i$3 } = t$3;
				i$3.x += D(t$3.clientRect.x - r$2.x, 3), i$3.y += D(t$3.clientRect.y - r$2.y, 3);
			}
			for (let t$3 of e$3.items) {
				let { alignmentOffset: n$4 } = t$3;
				(n$4.x !== 0 || n$4.y !== 0) && this.settings.applyPosition({
					phase: I.StartAlign,
					draggable: this,
					drag: e$3,
					item: t$3
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(L.Start, e$3.startEvent), this.settings.onStart?.(e$3, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$3 = this.drag;
		if (!e$3) return;
		let { moveEvent: t$3, prevMoveEvent: n$4 } = e$3;
		t$3 !== n$4 && (this._applyModifiers(F.Move, t$3.x - n$4.x, t$3.y - n$4.y), this._emit(L.PrepareMove, t$3), !e$3.isEnded && (this.settings.onPrepareMove?.(e$3, this), !e$3.isEnded && (e$3.prevMoveEvent = t$3)));
	}
	_applyMove() {
		let e$3 = this.drag;
		if (e$3) {
			for (let t$3 of e$3.items) t$3._moveDiff.x = 0, t$3._moveDiff.y = 0, this.settings.applyPosition({
				phase: I.Move,
				draggable: this,
				drag: e$3,
				item: t$3
			});
			this._emit(L.Move, e$3.moveEvent), !e$3.isEnded && this.settings.onMove?.(e$3, this);
		}
	}
	_prepareAlign() {
		let { drag: e$3 } = this;
		if (e$3) for (let t$3 of e$3.items) {
			let { x: e$4, y: n$4 } = t$3.element.getBoundingClientRect(), r$2 = t$3.clientRect.x - t$3._moveDiff.x - e$4;
			t$3.alignmentOffset.x = t$3.alignmentOffset.x - t$3._alignDiff.x + r$2, t$3._alignDiff.x = r$2;
			let i$3 = t$3.clientRect.y - t$3._moveDiff.y - n$4;
			t$3.alignmentOffset.y = t$3.alignmentOffset.y - t$3._alignDiff.y + i$3, t$3._alignDiff.y = i$3;
		}
	}
	_applyAlign() {
		let { drag: e$3 } = this;
		if (e$3) for (let t$3 of e$3.items) t$3._alignDiff.x = 0, t$3._alignDiff.y = 0, this.settings.applyPosition({
			phase: I.Align,
			draggable: this,
			drag: e$3,
			item: t$3
		});
	}
	_applyModifiers(e$3, t$3, n$4) {
		let { drag: r$2 } = this;
		if (!r$2) return;
		let { positionModifiers: i$3 } = this.settings;
		for (let a$2 of r$2.items) {
			let o$2 = A;
			o$2.x = t$3, o$2.y = n$4;
			for (let t$4 of i$3) o$2 = t$4(o$2, {
				draggable: this,
				drag: r$2,
				item: a$2,
				phase: e$3
			});
			a$2.position.x += o$2.x, a$2.position.y += o$2.y, a$2.clientRect.x += o$2.x, a$2.clientRect.y += o$2.y, e$3 === `move` && (a$2._moveDiff.x += o$2.x, a$2._moveDiff.y += o$2.y);
		}
	}
	on(e$3, t$3, n$4) {
		return this._emitter.on(e$3, t$3, n$4);
	}
	off(e$3, t$3) {
		this._emitter.off(e$3, t$3);
	}
	resolveStartPredicate(e$3, r$2) {
		let i$3 = this._sensorData.get(e$3);
		if (!i$3) return;
		let a$2 = r$2 || i$3.predicateEvent;
		i$3.predicateState === P.Pending && a$2 && (this._startPhase = N.Init, i$3.predicateState = P.Resolved, i$3.predicateEvent = null, this.drag = new c$1(e$3, a$2), this._sensorData.forEach((t$3, n$4) => {
			n$4 !== e$3 && (t$3.predicateState = P.Rejected, t$3.predicateEvent = null);
		}), n$2.once(t.read, this._prepareStart, this._startId), n$2.once(t.write, this._applyStart, this._startId));
	}
	rejectStartPredicate(e$3) {
		let t$3 = this._sensorData.get(e$3);
		t$3?.predicateState === P.Pending && (t$3.predicateState = P.Rejected, t$3.predicateEvent = null);
	}
	stop() {
		let e$3 = this.drag;
		if (!e$3 || e$3.isEnded) return;
		let r$2 = this._startPhase;
		if (r$2 === N.Prepare || r$2 === N.Apply) throw Error(`Cannot stop drag start process at this point`);
		if (this._startPhase = N.None, e$3.isEnded = !0, n$2.off(t.read, this._startId), n$2.off(t.write, this._startId), n$2.off(t.read, this._moveId), n$2.off(t.write, this._moveId), n$2.off(t.read, this._alignId), n$2.off(t.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), r$2 > N.Init && this._applyModifiers(F.End, 0, 0), r$2 === N.FinishApply) {
			for (let t$3 of e$3.items) {
				if (t$3.elementContainer !== t$3.dragContainer && (E(t$3.elementContainer, t$3.element), t$3.alignmentOffset.x = 0, t$3.alignmentOffset.y = 0, t$3.containerOffset.x = 0, t$3.containerOffset.y = 0), t$3.unfrozenStyles) for (let e$4 in t$3.unfrozenStyles) t$3.element.style[e$4] = t$3.unfrozenStyles[e$4] || ``;
				this.settings.applyPosition({
					phase: I.End,
					draggable: this,
					drag: e$3,
					item: t$3
				});
			}
			for (let t$3 of e$3.items) if (t$3.elementContainer !== t$3.dragContainer) {
				let e$4 = t$3.element.getBoundingClientRect();
				t$3.alignmentOffset.x = D(t$3.clientRect.x - e$4.x, 3), t$3.alignmentOffset.y = D(t$3.clientRect.y - e$4.y, 3);
			}
			for (let t$3 of e$3.items) t$3.elementContainer !== t$3.dragContainer && (t$3.alignmentOffset.x !== 0 || t$3.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: I.EndAlign,
				draggable: this,
				drag: e$3,
				item: t$3
			});
		} else if (r$2 === N.FinishPrepare) for (let t$3 of e$3.items) t$3.clientRect.x -= t$3.position.x, t$3.clientRect.y -= t$3.position.y, t$3.position.x = 0, t$3.position.y = 0, t$3.elementContainer !== t$3.dragContainer && (t$3.alignmentOffset.x = 0, t$3.alignmentOffset.y = 0, t$3.containerOffset.x = 0, t$3.containerOffset.y = 0);
		this._emit(L.End, e$3.endEvent), this.settings.onEnd?.(e$3, this), this.drag = null;
	}
	align(e$3 = !1) {
		this.drag && (e$3 ? (this._prepareAlign(), this._applyAlign()) : (n$2.once(t.read, this._prepareAlign, this._alignId), n$2.once(t.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$3, settings: t$3 } = this;
		return e$3 && t$3.computeClientRect?.({
			draggable: this,
			drag: e$3
		}) || null;
	}
	updateSettings(e$3 = {}) {
		this.settings = this._parseSettings(e$3, this.settings);
	}
	use(e$3) {
		return e$3(this);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: t$3, onEnd: n$4 }, r$2) => {
			r$2.off(e.Start, t$3), r$2.off(e.Move, t$3), r$2.off(e.Cancel, n$4), r$2.off(e.End, n$4), r$2.off(e.Destroy, n$4);
		}), this._sensorData.clear(), this._emit(L.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region dist/pointer-sensor-DZDIojjB.js
function i$2(e$3, t$3) {
	if (`pointerId` in e$3) return e$3.pointerId === t$3 ? e$3 : null;
	if (`changedTouches` in e$3) {
		let n$4 = 0;
		for (; n$4 < e$3.changedTouches.length; n$4++) if (e$3.changedTouches[n$4].identifier === t$3) return e$3.changedTouches[n$4];
		return null;
	}
	return e$3;
}
function a$1(e$3) {
	return `pointerType` in e$3 ? e$3.pointerType : `touches` in e$3 ? `touch` : `mouse`;
}
function o(e$3) {
	return `pointerId` in e$3 ? e$3.pointerId : `changedTouches` in e$3 ? e$3.changedTouches[0] ? e$3.changedTouches[0].identifier : null : -1;
}
function s(e$3 = {}) {
	let { capture: t$3 = !0, passive: n$4 = !0 } = e$3;
	return {
		capture: t$3,
		passive: n$4
	};
}
function c(e$3) {
	return e$3 === `auto` || e$3 === void 0 ? n$3 ? `pointer` : t$1 ? `touch` : `mouse` : e$3;
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
};
var u = class {
	constructor(e$3, t$3 = {}) {
		let { listenerOptions: n$4 = {}, sourceEvents: i$3 = `auto`, startPredicate: a$2 = (e$4) => !(`button` in e$4 && e$4.button > 0) } = t$3;
		this.element = e$3, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$2, this._listenerOptions = s(n$4), this._sourceEvents = c(i$3), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$3.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$3) {
		return this.drag ? i$2(e$3, this.drag.pointerId) : null;
	}
	_onStart(t$3) {
		if (this.isDestroyed || this.drag || !this._startPredicate(t$3)) return;
		let n$4 = o(t$3);
		if (n$4 === null) return;
		let r$2 = i$2(t$3, n$4);
		if (r$2 === null) return;
		let s$2 = {
			pointerId: n$4,
			pointerType: a$1(t$3),
			x: r$2.clientX,
			y: r$2.clientY
		};
		this.drag = s$2;
		let c$2 = {
			...s$2,
			type: e.Start,
			srcEvent: t$3,
			target: r$2.target
		};
		this._emitter.emit(c$2.type, c$2), this.drag && this._bindWindowListeners();
	}
	_onMove(t$3) {
		if (!this.drag) return;
		let n$4 = this._getTrackedPointerEventData(t$3);
		if (!n$4) return;
		this.drag.x = n$4.clientX, this.drag.y = n$4.clientY;
		let r$2 = {
			type: e.Move,
			srcEvent: t$3,
			target: n$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2);
	}
	_onCancel(t$3) {
		if (!this.drag) return;
		let n$4 = this._getTrackedPointerEventData(t$3);
		if (!n$4) return;
		this.drag.x = n$4.clientX, this.drag.y = n$4.clientY;
		let r$2 = {
			type: e.Cancel,
			srcEvent: t$3,
			target: n$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2), this._resetDrag();
	}
	_onEnd(t$3) {
		if (!this.drag) return;
		let n$4 = this._getTrackedPointerEventData(t$3);
		if (!n$4) return;
		this.drag.x = n$4.clientX, this.drag.y = n$4.clientY;
		let r$2 = {
			type: e.End,
			srcEvent: t$3,
			target: n$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$3, end: t$3, cancel: n$4 } = l[this._sourceEvents];
		window.addEventListener(e$3, this._onMove, this._listenerOptions), window.addEventListener(t$3, this._onEnd, this._listenerOptions), n$4 && window.addEventListener(n$4, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$3, end: t$3, cancel: n$4 } = l[this._sourceEvents];
			window.removeEventListener(e$3, this._onMove, this._listenerOptions), window.removeEventListener(t$3, this._onEnd, this._listenerOptions), n$4 && window.removeEventListener(n$4, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let t$3 = {
			type: e.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(t$3.type, t$3), this._resetDrag();
	}
	updateSettings(e$3) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$3, sourceEvents: n$4, startPredicate: r$2 } = e$3, i$3 = c(n$4), a$2 = s(t$3);
		r$2 && this._startPredicate !== r$2 && (this._startPredicate = r$2), (t$3 && (this._listenerOptions.capture !== a$2.capture || this._listenerOptions.passive === a$2.passive) || n$4 && this._sourceEvents !== i$3) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$4 && (this._sourceEvents = i$3), t$3 && a$2 && (this._listenerOptions = a$2), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$3, t$3, n$4) {
		return this._emitter.on(e$3, t$3, n$4);
	}
	off(e$3, t$3) {
		this._emitter.off(e$3, t$3);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region dist/base-sensor-cUrlV0_m.js
var n$1 = class {
	constructor() {
		this.drag = null, this.isDestroyed = !1, this._emitter = new v();
	}
	_createDragData(e$3) {
		return {
			x: e$3.x,
			y: e$3.y
		};
	}
	_updateDragData(e$3) {
		this.drag && (this.drag.x = e$3.x, this.drag.y = e$3.y);
	}
	_resetDragData() {
		this.drag = null;
	}
	_start(t$3) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$3), this._emitter.emit(e.Start, t$3));
	}
	_move(t$3) {
		this.drag && (this._updateDragData(t$3), this._emitter.emit(e.Move, t$3));
	}
	_end(t$3) {
		this.drag && (this._updateDragData(t$3), this._emitter.emit(e.End, t$3), this._resetDragData());
	}
	_cancel(t$3) {
		this.drag && (this._updateDragData(t$3), this._emitter.emit(e.Cancel, t$3), this._resetDragData());
	}
	on(e$3, t$3, n$4) {
		return this._emitter.on(e$3, t$3, n$4);
	}
	off(e$3, t$3) {
		this._emitter.off(e$3, t$3);
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
//#region dist/base-motion-sensor-BS2TuJo7.js
var i = class extends n$1 {
	constructor() {
		super(), this.drag = null, this._direction = {
			x: 0,
			y: 0
		}, this._speed = 0, this._tick = this._tick.bind(this);
	}
	_createDragData(e$3) {
		return {
			...super._createDragData(e$3),
			time: 0,
			deltaTime: 0
		};
	}
	_start(e$3) {
		this.isDestroyed || this.drag || (super._start(e$3), n$2.on(t.read, this._tick, this._tick));
	}
	_end(e$3) {
		this.drag && (n$2.off(t.read, this._tick), super._end(e$3));
	}
	_cancel(e$3) {
		this.drag && (n$2.off(t.read, this._tick), super._cancel(e$3));
	}
	_tick(t$3) {
		if (this.drag) if (t$3 && this.drag.time) {
			this.drag.deltaTime = t$3 - this.drag.time, this.drag.time = t$3;
			let n$4 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, n$4), !this.drag) return;
			let r$2 = this._speed * (this.drag.deltaTime / 1e3), i$3 = this._direction.x * r$2, a$2 = this._direction.y * r$2;
			(i$3 || a$2) && this._move({
				type: e.Move,
				x: this.drag.x + i$3,
				y: this.drag.y + a$2
			});
		} else this.drag.time = t$3, this.drag.deltaTime = 0;
	}
};

//#endregion
//#region dist/sensors/keyboard-motion-sensor.js
const n = [
	`start`,
	`cancel`,
	`end`,
	`moveLeft`,
	`moveRight`,
	`moveUp`,
	`moveDown`
];
function r(e$3, t$3) {
	if (!e$3.size || !t$3.size) return Infinity;
	let n$4 = Infinity;
	for (let r$2 of e$3) {
		let e$4 = t$3.get(r$2);
		e$4 !== void 0 && e$4 < n$4 && (n$4 = e$4);
	}
	return n$4;
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
	startPredicate: (e$3, t$3) => {
		if (t$3.element && document.activeElement === t$3.element) {
			let { left: e$4, top: n$4 } = t$3.element.getBoundingClientRect();
			return {
				x: e$4,
				y: n$4
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$3, t$3 = {}) {
		super();
		let { startPredicate: n$4 = i$1.startPredicate, computeSpeed: r$2 = i$1.computeSpeed, cancelOnVisibilityChange: a$2 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$2 = i$1.cancelOnBlur, startKeys: s$2 = i$1.startKeys, moveLeftKeys: c$2 = i$1.moveLeftKeys, moveRightKeys: l$3 = i$1.moveRightKeys, moveUpKeys: u$3 = i$1.moveUpKeys, moveDownKeys: d$1 = i$1.moveDownKeys, cancelKeys: f$1 = i$1.cancelKeys, endKeys: p$1 = i$1.endKeys } = t$3;
		this.element = e$3, this._startKeys = new Set(s$2), this._cancelKeys = new Set(f$1), this._endKeys = new Set(p$1), this._moveLeftKeys = new Set(c$2), this._moveRightKeys = new Set(l$3), this._moveUpKeys = new Set(u$3), this._moveDownKeys = new Set(d$1), this._moveKeys = new Set([
			...c$2,
			...l$3,
			...u$3,
			...d$1
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$2, this._cancelOnVisibilityChange = a$2, this._computeSpeed = r$2, this._startPredicate = n$4, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$2 && e$3?.addEventListener(`blur`, this._blurCancelHandler), a$2 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_end(e$3) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._end(e$3));
	}
	_cancel(e$3) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._cancel(e$3));
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
		let e$3 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$3 = r(this._moveRightKeys, this._moveKeyTimestamps), n$4 = r(this._moveUpKeys, this._moveKeyTimestamps), i$3 = r(this._moveDownKeys, this._moveKeyTimestamps), a$2 = e$3 === t$3 ? 0 : e$3 < t$3 ? -1 : 1, o$2 = n$4 === i$3 ? 0 : n$4 < i$3 ? -1 : 1;
		if (!(a$2 === 0 || o$2 === 0)) {
			let e$4 = 1 / (Math.sqrt(a$2 * a$2 + o$2 * o$2) || 1);
			a$2 *= e$4, o$2 *= e$4;
		}
		this._direction.x = a$2, this._direction.y = o$2;
	}
	_onTick() {
		this._speed = this._computeSpeed(this);
	}
	_onKeyUp(e$3) {
		this._moveKeyTimestamps.get(e$3.key) && (this._moveKeyTimestamps.delete(e$3.key), this._updateDirection());
	}
	_onKeyDown(t$3) {
		if (!this.drag) {
			if (this._startKeys.has(t$3.key)) {
				let n$4 = this._startPredicate(t$3, this);
				n$4 && (t$3.preventDefault(), this._start({
					type: e.Start,
					x: n$4.x,
					y: n$4.y
				}));
			}
			return;
		}
		if (this._cancelKeys.has(t$3.key)) {
			t$3.preventDefault(), this._internalCancel();
			return;
		}
		if (this._endKeys.has(t$3.key)) {
			t$3.preventDefault(), this._end({
				type: e.End,
				x: this.drag.x,
				y: this.drag.y
			});
			return;
		}
		if (this._moveKeys.has(t$3.key)) {
			t$3.preventDefault(), this._moveKeyTimestamps.get(t$3.key) || (this._moveKeyTimestamps.set(t$3.key, Date.now()), this._updateDirection());
			return;
		}
	}
	updateSettings(e$3 = {}) {
		let t$3 = !1, { cancelOnBlur: r$2, cancelOnVisibilityChange: i$3, startPredicate: a$2, computeSpeed: o$2 } = e$3;
		if (r$2 !== void 0 && this._cancelOnBlur !== r$2 && (this._cancelOnBlur = r$2, r$2 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$3 !== void 0 && this._cancelOnVisibilityChange !== i$3 && (this._cancelOnVisibilityChange = i$3, i$3 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$2 !== void 0 && (this._startPredicate = a$2), o$2 !== void 0 && (this._computeSpeed = o$2), n.forEach((n$4, r$3) => {
			let i$4 = `${n$4}Keys`, a$3 = e$3[i$4];
			a$3 !== void 0 && (this[`_${i$4}`] = new Set(a$3), r$3 >= 3 && (t$3 = !0));
		}), t$3) {
			let e$4 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$4, n$4) => e$4[n$4] === t$4) || (this._moveKeys = new Set(e$4), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/008-draggable-drag-handle/index.ts
const element = document.querySelector(".draggable");
const draggable = new z([new u(element.querySelector(".handle")), new a(element)], {
	elements: () => [element],
	onStart: () => {
		element.classList.add("dragging");
		if (draggable.drag.sensor instanceof u) element.classList.add("pointer-dragging");
		else element.classList.add("keyboard-dragging");
	},
	onEnd: () => {
		element.classList.remove("dragging", "pointer-dragging", "keyboard-dragging");
	}
});

//#endregion
});