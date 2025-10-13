(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region ../dragdoll/dist/sensor-TzqXogk2.js
const e = {
	Start: `start`,
	Move: `move`,
	Cancel: `cancel`,
	End: `end`,
	Destroy: `destroy`
};

//#endregion
//#region ../../node_modules/eventti/dist/index.js
var E$1 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$2, v = class {
	constructor(t$3 = {}) {
		this.dedupe = t$3.dedupe || E$1.ADD, this.getId = t$3.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$3) {
		let n$5 = this._events.get(t$3);
		return n$5 ? n$5.l || (n$5.l = [...n$5.m.values()]) : null;
	}
	on(t$3, n$5, e$4) {
		let i$4 = this._events, s$2 = i$4.get(t$3);
		s$2 || (s$2 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$4.set(t$3, s$2));
		let o$3 = s$2.m;
		if (e$4 = e$4 === r$2 ? this.getId(n$5) : e$4, o$3.has(e$4)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$4;
			case E$1.UPDATE:
				s$2.l = null;
				break;
			default: o$3.delete(e$4), s$2.l = null;
		}
		return o$3.set(e$4, n$5), s$2.l?.push(n$5), e$4;
	}
	once(t$3, n$5, e$4) {
		let i$4 = 0;
		return e$4 = e$4 === r$2 ? this.getId(n$5) : e$4, this.on(t$3, (...s$2) => {
			i$4 || (i$4 = 1, this.off(t$3, e$4), n$5(...s$2));
		}, e$4);
	}
	off(t$3, n$5) {
		if (t$3 === r$2) {
			this._events.clear();
			return;
		}
		if (n$5 === r$2) {
			this._events.delete(t$3);
			return;
		}
		let e$4 = this._events.get(t$3);
		e$4?.m.delete(n$5) && (e$4.l = null, e$4.m.size || this._events.delete(t$3));
	}
	emit(t$3, ...n$5) {
		let e$4 = this._getListeners(t$3);
		if (e$4) {
			let i$4 = e$4.length, s$2 = 0;
			if (n$5.length) for (; s$2 < i$4; s$2++) e$4[s$2](...n$5);
			else for (; s$2 < i$4; s$2++) e$4[s$2]();
		}
	}
	listenerCount(t$3) {
		if (t$3 === r$2) {
			let n$5 = 0;
			return this._events.forEach((e$4) => {
				n$5 += e$4.m.size;
			}), n$5;
		}
		return this._events.get(t$3)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$1 = E$1, o$2 = class {
	constructor(e$4 = {}) {
		let { phases: t$3 = [], dedupe: r$3, getId: s$2 } = e$4;
		this._phases = t$3, this._emitter = new v({
			getId: s$2,
			dedupe: r$3
		}), this._queue = [], this.tick = this.tick.bind(this), this._getListeners = this._emitter._getListeners.bind(this._emitter);
	}
	get phases() {
		return this._phases;
	}
	set phases(e$4) {
		this._phases = e$4;
	}
	get dedupe() {
		return this._emitter.dedupe;
	}
	set dedupe(e$4) {
		this._emitter.dedupe = e$4;
	}
	get getId() {
		return this._emitter.getId;
	}
	set getId(e$4) {
		this._emitter.getId = e$4;
	}
	tick(...e$4) {
		this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e$4);
	}
	on(e$4, t$3, r$3) {
		return this._emitter.on(e$4, t$3, r$3);
	}
	once(e$4, t$3, r$3) {
		return this._emitter.once(e$4, t$3, r$3);
	}
	off(e$4, t$3) {
		return this._emitter.off(e$4, t$3);
	}
	count(e$4) {
		return this._emitter.listenerCount(e$4);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$4 = this._queue, t$3 = this._phases, r$3 = this._getListeners, s$2 = 0, a$3 = t$3.length, n$5;
		for (; s$2 < a$3; s$2++) n$5 = r$3(t$3[s$2]), n$5 && e$4.push(n$5);
		return e$4;
	}
	_processQueue(...e$4) {
		let t$3 = this._queue, r$3 = t$3.length;
		if (!r$3) return;
		let s$2 = 0, a$3 = 0, n$5, c$2;
		for (; s$2 < r$3; s$2++) for (n$5 = t$3[s$2], a$3 = 0, c$2 = n$5.length; a$3 < c$2; a$3++) n$5[a$3](...e$4);
		t$3.length = 0;
	}
};
function u$2(i$4 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$4) => {
		let t$3 = requestAnimationFrame(e$4);
		return () => cancelAnimationFrame(t$3);
	};
	{
		let e$4 = 1e3 / i$4, t$3 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$3) => {
			let s$2 = setTimeout(() => r$3(t$3()), e$4);
			return () => clearTimeout(s$2);
		};
	}
}
var l$2 = class extends o$2 {
	constructor(e$4 = {}) {
		let { paused: t$3 = !1, onDemand: r$3 = !1, requestFrame: s$2 = u$2(),...a$3 } = e$4;
		super(a$3), this._paused = t$3, this._onDemand = r$3, this._requestFrame = s$2, this._cancelFrame = null, this._empty = !0, !t$3 && !r$3 && this._request();
	}
	get phases() {
		return this._phases;
	}
	set phases(e$4) {
		this._phases = e$4, e$4.length ? (this._empty = !1, this._request()) : this._empty = !0;
	}
	get paused() {
		return this._paused;
	}
	set paused(e$4) {
		this._paused = e$4, e$4 ? this._cancel() : this._request();
	}
	get onDemand() {
		return this._onDemand;
	}
	set onDemand(e$4) {
		this._onDemand = e$4, e$4 || this._request();
	}
	get requestFrame() {
		return this._requestFrame;
	}
	set requestFrame(e$4) {
		this._requestFrame !== e$4 && (this._requestFrame = e$4, this._cancelFrame && (this._cancel(), this._request()));
	}
	tick(...e$4) {
		if (this._assertEmptyQueue(), this._cancelFrame = null, this._onDemand || this._request(), !this._empty) {
			if (!this._fillQueue().length) {
				this._empty = !0;
				return;
			}
			this._onDemand && this._request(), this._processQueue(...e$4);
		}
	}
	on(e$4, t$3, r$3) {
		let s$2 = super.on(e$4, t$3, r$3);
		return this._empty = !1, this._request(), s$2;
	}
	once(e$4, t$3, r$3) {
		let s$2 = super.once(e$4, t$3, r$3);
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
//#region ../dragdoll/dist/ticker-EaCO7G8S.js
const t = {
	read: Symbol(),
	write: Symbol()
};
let n$2 = new l$2({ phases: [t.read, t.write] });

//#endregion
//#region ../dragdoll/dist/constants-BG0DGMmK.js
const e$2 = typeof window < `u` && window.document !== void 0, t$1 = e$2 && `ontouchstart` in window, n$4 = e$2 && !!window.PointerEvent;
e$2 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

//#endregion
//#region ../dragdoll/dist/get-style-e3zfxW9-.js
const e$3 = /* @__PURE__ */ new WeakMap();
function t$2(t$3) {
	let n$5 = e$3.get(t$3)?.deref();
	return n$5 || (n$5 = window.getComputedStyle(t$3, null), e$3.set(t$3, new WeakRef(n$5))), n$5;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$4, t$3) {
	if (t$3) return window.getComputedStyle(e$4, t$3);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$4)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$4, null), STYLE_DECLARATION_CACHE.set(e$4, new WeakRef(C$1))), C$1;
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
const IS_CHROMIUM = (() => {
	try {
		return window.navigator.userAgentData.brands.some((({ brand: n$5 }) => "Chromium" === n$5));
	} catch (n$5) {
		return !1;
	}
})();

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isBlockElement.js
function isBlockElement(e$4) {
	switch (getStyle(e$4).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$5) {
	const t$3 = getStyle(n$5);
	if (!IS_SAFARI) {
		const { filter: n$6 } = t$3;
		if (n$6 && "none" !== n$6) return !0;
		const { backdropFilter: e$5 } = t$3;
		if (e$5 && "none" !== e$5) return !0;
		const { willChange: i$5 } = t$3;
		if (i$5 && (i$5.indexOf("filter") > -1 || i$5.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$4 = isBlockElement(n$5);
	if (!e$4) return e$4;
	const { transform: i$4 } = t$3;
	if (i$4 && "none" !== i$4) return !0;
	const { perspective: r$3 } = t$3;
	if (r$3 && "none" !== r$3) return !0;
	const { contentVisibility: o$3 } = t$3;
	if (o$3 && "auto" === o$3) return !0;
	const { contain: f$1 } = t$3;
	if (f$1 && ("strict" === f$1 || "content" === f$1 || f$1.indexOf("paint") > -1 || f$1.indexOf("layout") > -1)) return !0;
	const { willChange: c$2 } = t$3;
	return !(!c$2 || !(c$2.indexOf("transform") > -1 || c$2.indexOf("perspective") > -1 || c$2.indexOf("contain") > -1)) || !!(IS_SAFARI && c$2 && c$2.indexOf("filter") > -1);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$3) {
	return "static" !== getStyle(t$3).position || isContainingBlockForFixedElement(t$3);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$4) {
	return e$4 instanceof HTMLHtmlElement;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$4, t$3 = {}) {
	if (isDocumentElement(e$4)) return e$4.ownerDocument.defaultView;
	const n$5 = t$3.position || getStyle(e$4).position, { skipDisplayNone: i$4, container: o$3 } = t$3;
	switch (n$5) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$4 = o$3 || e$4.parentElement;
			for (; t$4;) {
				const e$5 = isBlockElement(t$4);
				if (e$5) return t$4;
				if (null === e$5 && !i$4) return null;
				t$4 = t$4.parentElement;
			}
			return e$4.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$4 = "fixed" === n$5;
			let l$3 = o$3 || e$4.parentElement;
			for (; l$3;) {
				const e$5 = t$4 ? isContainingBlockForFixedElement(l$3) : isContainingBlockForAbsoluteElement(l$3);
				if (!0 === e$5) return l$3;
				if (null === e$5 && !i$4) return null;
				l$3 = l$3.parentElement;
			}
			return e$4.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$5) {
	return n$5 instanceof Window;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$5, t$3 = {}) {
	const { display: o$3 } = getStyle(n$5);
	if ("none" === o$3 || "contents" === o$3) return null;
	const e$4 = t$3.position || getStyle(n$5).position, { skipDisplayNone: s$2, container: r$3 } = t$3;
	switch (e$4) {
		case "relative": return n$5;
		case "fixed": return getContainingBlock(n$5, {
			container: r$3,
			position: e$4,
			skipDisplayNone: s$2
		});
		case "absolute": {
			const t$4 = getContainingBlock(n$5, {
				container: r$3,
				position: e$4,
				skipDisplayNone: s$2
			});
			return isWindow(t$4) ? n$5.ownerDocument : t$4;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-qBrB_jQL.js
function s$1(e$4, t$3) {
	return e$4.isIdentity && t$3.isIdentity ? !0 : e$4.is2D && t$3.is2D ? e$4.a === t$3.a && e$4.b === t$3.b && e$4.c === t$3.c && e$4.d === t$3.d && e$4.e === t$3.e && e$4.f === t$3.f : e$4.m11 === t$3.m11 && e$4.m12 === t$3.m12 && e$4.m13 === t$3.m13 && e$4.m14 === t$3.m14 && e$4.m21 === t$3.m21 && e$4.m22 === t$3.m22 && e$4.m23 === t$3.m23 && e$4.m24 === t$3.m24 && e$4.m31 === t$3.m31 && e$4.m32 === t$3.m32 && e$4.m33 === t$3.m33 && e$4.m34 === t$3.m34 && e$4.m41 === t$3.m41 && e$4.m42 === t$3.m42 && e$4.m43 === t$3.m43 && e$4.m44 === t$3.m44;
}
function c$1(e$4) {
	return e$4.m11 !== 1 || e$4.m12 !== 0 || e$4.m13 !== 0 || e$4.m14 !== 0 || e$4.m21 !== 0 || e$4.m22 !== 1 || e$4.m23 !== 0 || e$4.m24 !== 0 || e$4.m31 !== 0 || e$4.m32 !== 0 || e$4.m33 !== 1 || e$4.m34 !== 0 || e$4.m43 !== 0 || e$4.m44 !== 1;
}
function l$1(e$4, t$3, n$5 = null) {
	if (`moveBefore` in e$4 && e$4.isConnected === t$3.isConnected) try {
		e$4.moveBefore(t$3, n$5);
		return;
	} catch {}
	let r$3 = document.activeElement, i$4 = t$3.contains(r$3);
	e$4.insertBefore(t$3, n$5), i$4 && document.activeElement !== r$3 && r$3 instanceof HTMLElement && r$3.focus({ preventScroll: !0 });
}
function u$1(e$4) {
	return e$4.setMatrixValue(`scale(1, 1)`);
}
function d(e$4, t$3 = 0) {
	let n$5 = 10 ** t$3;
	return Math.round((e$4 + 2 ** -52) * n$5) / n$5;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$4, t$3) {
		this._cache.set(e$4, t$3), this._validation.set(e$4, void 0);
	}
	get(e$4) {
		return this._cache.get(e$4);
	}
	has(e$4) {
		return this._cache.has(e$4);
	}
	delete(e$4) {
		this._cache.delete(e$4), this._validation.delete(e$4);
	}
	isValid(e$4) {
		return this._validation.has(e$4);
	}
	invalidate(e$4) {
		e$4 === void 0 ? this._validation.clear() : this._validation.delete(e$4);
	}
	clear() {
		this._cache.clear(), this._validation.clear();
	}
}, p = class {
	constructor(e$4, t$3) {
		this.sensor = e$4, this.startEvent = t$3, this.prevMoveEvent = t$3, this.moveEvent = t$3, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$4, t$3, n$5 = !1) {
	let { style: r$3 } = e$4;
	for (let e$5 in t$3) r$3.setProperty(e$5, t$3[e$5], n$5 ? `important` : ``);
}
function h() {
	let e$4 = document.createElement(`div`);
	return e$4.classList.add(`dragdoll-measure`), m(e$4, {
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
	}, !0), e$4;
}
function g(e$4, t$3 = {
	x: 0,
	y: 0
}) {
	if (t$3.x = 0, t$3.y = 0, e$4 instanceof Window) return t$3;
	if (e$4 instanceof Document) return t$3.x = window.scrollX * -1, t$3.y = window.scrollY * -1, t$3;
	let { x: n$5, y: r$3 } = e$4.getBoundingClientRect(), a$3 = t$2(e$4);
	return t$3.x = n$5 + (parseFloat(a$3.borderLeftWidth) || 0), t$3.y = r$3 + (parseFloat(a$3.borderTopWidth) || 0), t$3;
}
function _(e$4) {
	let t$3 = t$2(e$4), n$5 = parseFloat(t$3.height) || 0;
	return t$3.boxSizing === `border-box` ? n$5 : (n$5 += parseFloat(t$3.borderTopWidth) || 0, n$5 += parseFloat(t$3.borderBottomWidth) || 0, n$5 += parseFloat(t$3.paddingTop) || 0, n$5 += parseFloat(t$3.paddingBottom) || 0, e$4 instanceof HTMLElement && (n$5 += e$4.offsetHeight - e$4.clientHeight), n$5);
}
function v$1(e$4) {
	let t$3 = t$2(e$4), n$5 = parseFloat(t$3.width) || 0;
	return t$3.boxSizing === `border-box` ? n$5 : (n$5 += parseFloat(t$3.borderLeftWidth) || 0, n$5 += parseFloat(t$3.borderRightWidth) || 0, n$5 += parseFloat(t$3.paddingLeft) || 0, n$5 += parseFloat(t$3.paddingRight) || 0, e$4 instanceof HTMLElement && (n$5 += e$4.offsetWidth - e$4.clientWidth), n$5);
}
function y(e$4, t$3 = !1) {
	let { translate: n$5, rotate: r$3, scale: a$3, transform: o$3 } = t$2(e$4), s$2 = ``;
	if (n$5 && n$5 !== `none`) {
		let [t$4 = `0px`, r$4 = `0px`, i$4] = n$5.split(` `);
		t$4.includes(`%`) && (t$4 = `${parseFloat(t$4) / 100 * v$1(e$4)}px`), r$4.includes(`%`) && (r$4 = `${parseFloat(r$4) / 100 * _(e$4)}px`), i$4 ? s$2 += `translate3d(${t$4},${r$4},${i$4})` : s$2 += `translate(${t$4},${r$4})`;
	}
	if (r$3 && r$3 !== `none`) {
		let e$5 = r$3.split(` `);
		e$5.length > 1 ? s$2 += `rotate3d(${e$5.join(`,`)})` : s$2 += `rotate(${e$5.join(`,`)})`;
	}
	if (a$3 && a$3 !== `none`) {
		let e$5 = a$3.split(` `);
		e$5.length === 3 ? s$2 += `scale3d(${e$5.join(`,`)})` : s$2 += `scale(${e$5.join(`,`)})`;
	}
	return !t$3 && o$3 && o$3 !== `none` && (s$2 += o$3), s$2;
}
function b(e$4) {
	return typeof e$4 == `object` && !!e$4 && `x` in e$4 && `y` in e$4;
}
const x = {
	x: 0,
	y: 0
}, S = {
	x: 0,
	y: 0
};
function C(e$4, t$3, n$5 = {
	x: 0,
	y: 0
}) {
	let r$3 = b(e$4) ? e$4 : g(e$4, x), i$4 = b(t$3) ? t$3 : g(t$3, S);
	return n$5.x = i$4.x - r$3.x, n$5.y = i$4.y - r$3.y, n$5;
}
function w(e$4) {
	let t$3 = e$4.split(` `), n$5 = ``, r$3 = ``, i$4 = ``;
	return t$3.length === 1 ? n$5 = r$3 = t$3[0] : t$3.length === 2 ? [n$5, r$3] = t$3 : [n$5, r$3, i$4] = t$3, {
		x: parseFloat(n$5) || 0,
		y: parseFloat(r$3) || 0,
		z: parseFloat(i$4) || 0
	};
}
const T = e$2 ? new DOMMatrix() : null;
function E(e$4, t$3 = new DOMMatrix()) {
	let n$5 = e$4;
	for (u$1(t$3); n$5;) {
		let e$5 = y(n$5);
		if (e$5 && (T.setMatrixValue(e$5), !T.isIdentity)) {
			let { transformOrigin: e$6 } = t$2(n$5), { x: r$3, y: a$3, z: o$3 } = w(e$6);
			o$3 === 0 ? T.setMatrixValue(`translate(${r$3}px,${a$3}px) ${T} translate(${r$3 * -1}px,${a$3 * -1}px)`) : T.setMatrixValue(`translate3d(${r$3}px,${a$3}px,${o$3}px) ${T} translate3d(${r$3 * -1}px,${a$3 * -1}px,${o$3 * -1}px)`), t$3.preMultiplySelf(T);
		}
		n$5 = n$5.parentElement;
	}
	return t$3;
}
const D = e$2 ? h() : null;
var O = class {
	constructor(e$4, t$3) {
		if (!e$4.isConnected) throw Error(`Element is not connected`);
		let { drag: n$5 } = t$3;
		if (!n$5) throw Error(`Drag is not defined`);
		let r$3 = t$2(e$4), a$3 = e$4.getBoundingClientRect(), s$2 = y(e$4, !0);
		this.data = {}, this.element = e$4, this.elementTransformOrigin = w(r$3.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$2 + r$3.transform), this.elementOffsetMatrix = new DOMMatrix(s$2).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		let c$2 = e$4.parentElement;
		if (!c$2) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$2;
		let l$3 = t$3.settings.container || c$2;
		if (this.dragContainer = l$3, c$2 !== l$3) {
			let { position: e$5 } = r$3;
			if (e$5 !== `fixed` && e$5 !== `absolute`) throw Error(`Dragged element has "${e$5}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$3 = getOffsetContainer(e$4) || e$4;
		this.elementOffsetContainer = u$3, this.dragOffsetContainer = l$3 === c$2 ? u$3 : getOffsetContainer(e$4, { container: l$3 });
		{
			let { width: e$5, height: t$4, x: n$6, y: r$4 } = a$3;
			this.clientRect = {
				width: e$5,
				height: t$4,
				x: n$6,
				y: r$4
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$3.settings.frozenStyles({
			draggable: t$3,
			drag: n$5,
			item: this,
			style: r$3
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$5 = {};
			for (let t$4 of d$1) e$5[t$4] = r$3[t$4];
			this.frozenStyles = e$5;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$4 = {};
			for (let n$6 in this.frozenStyles) t$4[n$6] = e$4.style[n$6];
			this.unfrozenStyles = t$4;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$4) => {
			if (!this._matrixCache.isValid(e$4)) {
				let t$3 = this._matrixCache.get(e$4) || [new DOMMatrix(), new DOMMatrix()], [n$5, r$3] = t$3;
				E(e$4, n$5), r$3.setMatrixValue(n$5.toString()).invertSelf(), this._matrixCache.set(e$4, t$3);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$4, elementContainer: t$3, dragOffsetContainer: n$5, dragContainer: r$3, containerOffset: i$4, _clientOffsetCache: a$3, _matrixCache: o$3 } = this;
		if (e$4 !== n$5) {
			let [s$2, l$3] = [[r$3, n$5], [t$3, e$4]].map(([e$5, t$4]) => {
				let n$6 = a$3.get(t$4) || {
					x: 0,
					y: 0
				};
				if (!a$3.isValid(t$4)) {
					let r$4 = o$3.get(e$5);
					t$4 instanceof HTMLElement && r$4 && !r$4[0].isIdentity ? c$1(r$4[0]) ? (D.style.setProperty(`transform`, r$4[1].toString(), `important`), t$4.append(D), g(D, n$6), D.remove()) : (g(t$4, n$6), n$6.x -= r$4[0].m41, n$6.y -= r$4[0].m42) : g(t$4, n$6);
				}
				return a$3.set(t$4, n$6), n$6;
			});
			C(s$2, l$3, i$4);
		} else i$4.x = 0, i$4.y = 0;
	}
	getContainerMatrix() {
		return this._matrixCache.get(this.elementContainer);
	}
	getDragContainerMatrix() {
		return this._matrixCache.get(this.dragContainer);
	}
	updateSize(e$4) {
		if (e$4) this.clientRect.width = e$4.width, this.clientRect.height = e$4.height;
		else {
			let { width: e$5, height: t$3 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$5, this.clientRect.height = t$3;
		}
	}
};
const k = {
	capture: !0,
	passive: !0
}, A = {
	x: 0,
	y: 0
}, j = e$2 ? new DOMMatrix() : null, M = e$2 ? new DOMMatrix() : null;
var N = function(e$4) {
	return e$4[e$4.None = 0] = `None`, e$4[e$4.Init = 1] = `Init`, e$4[e$4.Prepare = 2] = `Prepare`, e$4[e$4.FinishPrepare = 3] = `FinishPrepare`, e$4[e$4.Apply = 4] = `Apply`, e$4[e$4.FinishApply = 5] = `FinishApply`, e$4;
}(N || {}), P = function(e$4) {
	return e$4[e$4.Pending = 0] = `Pending`, e$4[e$4.Resolved = 1] = `Resolved`, e$4[e$4.Rejected = 2] = `Rejected`, e$4;
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
	applyPosition: ({ item: e$4, phase: t$3 }) => {
		let n$5 = t$3 === I.End || t$3 === I.EndAlign, [r$3, i$4] = e$4.getContainerMatrix(), [a$3, o$3] = e$4.getDragContainerMatrix(), { position: s$2, alignmentOffset: c$2, containerOffset: l$3, elementTransformMatrix: d$1, elementTransformOrigin: f$1, elementOffsetMatrix: p$1 } = e$4, { x: m$1, y: h$1, z: g$1 } = f$1, _$2 = !d$1.isIdentity && (m$1 !== 0 || h$1 !== 0 || g$1 !== 0), v$2 = s$2.x + c$2.x + l$3.x, y$1 = s$2.y + c$2.y + l$3.y;
		u$1(j), _$2 && (g$1 === 0 ? j.translateSelf(-m$1, -h$1) : j.translateSelf(-m$1, -h$1, -g$1)), n$5 ? i$4.isIdentity || j.multiplySelf(i$4) : o$3.isIdentity || j.multiplySelf(o$3), u$1(M).translateSelf(v$2, y$1), j.multiplySelf(M), r$3.isIdentity || j.multiplySelf(r$3), _$2 && (u$1(M).translateSelf(m$1, h$1, g$1), j.multiplySelf(M)), d$1.isIdentity || j.multiplySelf(d$1), p$1.isIdentity || j.preMultiplySelf(p$1), e$4.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$4 }) => e$4.items[0].clientRect || null,
	positionModifiers: [],
	group: null
};
var z = class {
	constructor(t$3, n$5 = {}) {
		let { id: r$3 = Symbol(),...i$4 } = n$5;
		this.id = r$3, this.sensors = t$3, this.settings = this._parseSettings(i$4), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((t$4) => {
			this._sensorData.set(t$4, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (e$4) => this._onMove(e$4, t$4),
				onEnd: (e$4) => this._onEnd(e$4, t$4)
			});
			let { onMove: n$6, onEnd: r$4 } = this._sensorData.get(t$4);
			t$4.on(e.Start, n$6, n$6), t$4.on(e.Move, n$6, n$6), t$4.on(e.Cancel, r$4, r$4), t$4.on(e.End, r$4, r$4), t$4.on(e.Destroy, r$4, r$4);
		});
	}
	_parseSettings(e$4, t$3 = R) {
		let { container: n$5 = t$3.container, startPredicate: r$3 = t$3.startPredicate, elements: i$4 = t$3.elements, frozenStyles: a$3 = t$3.frozenStyles, positionModifiers: o$3 = t$3.positionModifiers, applyPosition: s$2 = t$3.applyPosition, computeClientRect: c$2 = t$3.computeClientRect, group: l$3 = t$3.group, onPrepareStart: u$3 = t$3.onPrepareStart, onStart: d$1 = t$3.onStart, onPrepareMove: f$1 = t$3.onPrepareMove, onMove: p$1 = t$3.onMove, onEnd: m$1 = t$3.onEnd, onDestroy: h$1 = t$3.onDestroy } = e$4 || {};
		return {
			container: n$5,
			startPredicate: r$3,
			elements: i$4,
			frozenStyles: a$3,
			positionModifiers: o$3,
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
	_emit(e$4, ...t$3) {
		this._emitter.emit(e$4, ...t$3);
	}
	_onMove(e$4, r$3) {
		let i$4 = this._sensorData.get(r$3);
		if (i$4) switch (i$4.predicateState) {
			case P.Pending: {
				i$4.predicateEvent = e$4;
				let t$3 = this.settings.startPredicate({
					draggable: this,
					sensor: r$3,
					event: e$4
				});
				t$3 === !0 ? this.resolveStartPredicate(r$3) : t$3 === !1 && this.rejectStartPredicate(r$3);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = e$4, n$2.once(t.read, this._prepareMove, this._moveId), n$2.once(t.write, this._applyMove, this._moveId));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$4, t$3) {
		let n$5 = this._sensorData.get(t$3);
		n$5 && (this.drag ? n$5.predicateState === P.Resolved && (this.drag.endEvent = e$4, this._sensorData.forEach((e$5) => {
			e$5.predicateState = P.Pending, e$5.predicateEvent = null;
		}), this.stop()) : (n$5.predicateState = P.Pending, n$5.predicateEvent = null));
	}
	_prepareStart() {
		let e$4 = this.drag;
		e$4 && (this._startPhase = N.Prepare, e$4.items = (this.settings.elements({
			draggable: this,
			drag: e$4
		}) || []).map((e$5) => new O(e$5, this)), this._applyModifiers(F.Start, 0, 0), this._emit(L.PrepareStart, e$4.startEvent), this.settings.onPrepareStart?.(e$4, this), this._startPhase = N.FinishPrepare);
	}
	_applyStart() {
		let e$4 = this.drag;
		if (e$4) {
			this._startPhase = N.Apply;
			for (let t$3 of e$4.items) t$3.dragContainer !== t$3.elementContainer && l$1(t$3.dragContainer, t$3.element), t$3.frozenStyles && Object.assign(t$3.element.style, t$3.frozenStyles), this.settings.applyPosition({
				phase: I.Start,
				draggable: this,
				drag: e$4,
				item: t$3
			});
			for (let t$3 of e$4.items) {
				let e$5 = t$3.getContainerMatrix()[0], n$5 = t$3.getDragContainerMatrix()[0];
				if (s$1(e$5, n$5) || !c$1(e$5) && !c$1(n$5)) continue;
				let r$3 = t$3.element.getBoundingClientRect(), { alignmentOffset: i$4 } = t$3;
				i$4.x += d(t$3.clientRect.x - r$3.x, 3), i$4.y += d(t$3.clientRect.y - r$3.y, 3);
			}
			for (let t$3 of e$4.items) {
				let { alignmentOffset: n$5 } = t$3;
				(n$5.x !== 0 || n$5.y !== 0) && this.settings.applyPosition({
					phase: I.StartAlign,
					draggable: this,
					drag: e$4,
					item: t$3
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(L.Start, e$4.startEvent), this.settings.onStart?.(e$4, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$4 = this.drag;
		if (!e$4) return;
		let { moveEvent: t$3, prevMoveEvent: n$5 } = e$4;
		t$3 !== n$5 && (this._applyModifiers(F.Move, t$3.x - n$5.x, t$3.y - n$5.y), this._emit(L.PrepareMove, t$3), !e$4.isEnded && (this.settings.onPrepareMove?.(e$4, this), !e$4.isEnded && (e$4.prevMoveEvent = t$3)));
	}
	_applyMove() {
		let e$4 = this.drag;
		if (e$4) {
			for (let t$3 of e$4.items) t$3._moveDiff.x = 0, t$3._moveDiff.y = 0, this.settings.applyPosition({
				phase: I.Move,
				draggable: this,
				drag: e$4,
				item: t$3
			});
			this._emit(L.Move, e$4.moveEvent), !e$4.isEnded && this.settings.onMove?.(e$4, this);
		}
	}
	_prepareAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$3 of e$4.items) {
			let { x: e$5, y: n$5 } = t$3.element.getBoundingClientRect(), r$3 = t$3.clientRect.x - t$3._moveDiff.x - e$5;
			t$3.alignmentOffset.x = t$3.alignmentOffset.x - t$3._alignDiff.x + r$3, t$3._alignDiff.x = r$3;
			let i$4 = t$3.clientRect.y - t$3._moveDiff.y - n$5;
			t$3.alignmentOffset.y = t$3.alignmentOffset.y - t$3._alignDiff.y + i$4, t$3._alignDiff.y = i$4;
		}
	}
	_applyAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$3 of e$4.items) t$3._alignDiff.x = 0, t$3._alignDiff.y = 0, this.settings.applyPosition({
			phase: I.Align,
			draggable: this,
			drag: e$4,
			item: t$3
		});
	}
	_applyModifiers(e$4, t$3, n$5) {
		let { drag: r$3 } = this;
		if (!r$3) return;
		let { positionModifiers: i$4 } = this.settings;
		for (let a$3 of r$3.items) {
			let o$3 = A;
			o$3.x = t$3, o$3.y = n$5;
			for (let t$4 of i$4) o$3 = t$4(o$3, {
				draggable: this,
				drag: r$3,
				item: a$3,
				phase: e$4
			});
			a$3.position.x += o$3.x, a$3.position.y += o$3.y, a$3.clientRect.x += o$3.x, a$3.clientRect.y += o$3.y, e$4 === `move` && (a$3._moveDiff.x += o$3.x, a$3._moveDiff.y += o$3.y);
		}
	}
	on(e$4, t$3, n$5) {
		return this._emitter.on(e$4, t$3, n$5);
	}
	off(e$4, t$3) {
		this._emitter.off(e$4, t$3);
	}
	resolveStartPredicate(e$4, r$3) {
		let i$4 = this._sensorData.get(e$4);
		if (!i$4) return;
		let a$3 = r$3 || i$4.predicateEvent;
		i$4.predicateState === P.Pending && a$3 && (this._startPhase = N.Init, i$4.predicateState = P.Resolved, i$4.predicateEvent = null, this.drag = new p(e$4, a$3), this._sensorData.forEach((t$3, n$5) => {
			n$5 !== e$4 && (t$3.predicateState = P.Rejected, t$3.predicateEvent = null);
		}), n$2.once(t.read, this._prepareStart, this._startId), n$2.once(t.write, this._applyStart, this._startId));
	}
	rejectStartPredicate(e$4) {
		let t$3 = this._sensorData.get(e$4);
		t$3?.predicateState === P.Pending && (t$3.predicateState = P.Rejected, t$3.predicateEvent = null);
	}
	stop() {
		let e$4 = this.drag;
		if (!e$4 || e$4.isEnded) return;
		let r$3 = this._startPhase;
		if (r$3 === N.Prepare || r$3 === N.Apply) throw Error(`Cannot stop drag start process at this point`);
		if (this._startPhase = N.None, e$4.isEnded = !0, n$2.off(t.read, this._startId), n$2.off(t.write, this._startId), n$2.off(t.read, this._moveId), n$2.off(t.write, this._moveId), n$2.off(t.read, this._alignId), n$2.off(t.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), r$3 > N.Init && this._applyModifiers(F.End, 0, 0), r$3 === N.FinishApply) {
			for (let t$3 of e$4.items) {
				if (t$3.elementContainer !== t$3.dragContainer && (l$1(t$3.elementContainer, t$3.element), t$3.alignmentOffset.x = 0, t$3.alignmentOffset.y = 0, t$3.containerOffset.x = 0, t$3.containerOffset.y = 0), t$3.unfrozenStyles) for (let e$5 in t$3.unfrozenStyles) t$3.element.style[e$5] = t$3.unfrozenStyles[e$5] || ``;
				this.settings.applyPosition({
					phase: I.End,
					draggable: this,
					drag: e$4,
					item: t$3
				});
			}
			for (let t$3 of e$4.items) if (t$3.elementContainer !== t$3.dragContainer) {
				let e$5 = t$3.element.getBoundingClientRect();
				t$3.alignmentOffset.x = d(t$3.clientRect.x - e$5.x, 3), t$3.alignmentOffset.y = d(t$3.clientRect.y - e$5.y, 3);
			}
			for (let t$3 of e$4.items) t$3.elementContainer !== t$3.dragContainer && (t$3.alignmentOffset.x !== 0 || t$3.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: I.EndAlign,
				draggable: this,
				drag: e$4,
				item: t$3
			});
		} else if (r$3 === N.FinishPrepare) for (let t$3 of e$4.items) t$3.clientRect.x -= t$3.position.x, t$3.clientRect.y -= t$3.position.y, t$3.position.x = 0, t$3.position.y = 0, t$3.elementContainer !== t$3.dragContainer && (t$3.alignmentOffset.x = 0, t$3.alignmentOffset.y = 0, t$3.containerOffset.x = 0, t$3.containerOffset.y = 0);
		this._emit(L.End, e$4.endEvent), this.settings.onEnd?.(e$4, this), this.drag = null;
	}
	align(e$4 = !1) {
		this.drag && (e$4 ? (this._prepareAlign(), this._applyAlign()) : (n$2.once(t.read, this._prepareAlign, this._alignId), n$2.once(t.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$4, settings: t$3 } = this;
		return e$4 && t$3.computeClientRect?.({
			draggable: this,
			drag: e$4
		}) || null;
	}
	updateSettings(e$4 = {}) {
		this.settings = this._parseSettings(e$4, this.settings);
	}
	use(e$4) {
		return e$4(this);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: t$3, onEnd: n$5 }, r$3) => {
			r$3.off(e.Start, t$3), r$3.off(e.Move, t$3), r$3.off(e.Cancel, n$5), r$3.off(e.End, n$5), r$3.off(e.Destroy, n$5);
		}), this._sensorData.clear(), this._emit(L.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-Dbu_Xu9q.js
function i$3(e$4, t$3) {
	if (`pointerId` in e$4) return e$4.pointerId === t$3 ? e$4 : null;
	if (`changedTouches` in e$4) {
		let n$5 = 0;
		for (; n$5 < e$4.changedTouches.length; n$5++) if (e$4.changedTouches[n$5].identifier === t$3) return e$4.changedTouches[n$5];
		return null;
	}
	return e$4;
}
function a$2(e$4) {
	return `pointerId` in e$4 ? e$4.pointerId : `changedTouches` in e$4 ? e$4.changedTouches[0] ? e$4.changedTouches[0].identifier : null : -1;
}
function o$1(e$4) {
	return `pointerType` in e$4 ? e$4.pointerType : `touches` in e$4 ? `touch` : `mouse`;
}
function s(e$4 = {}) {
	let { capture: t$3 = !0, passive: n$5 = !0 } = e$4;
	return {
		capture: t$3,
		passive: n$5
	};
}
function c(e$4) {
	return e$4 === `auto` || e$4 === void 0 ? n$4 ? `pointer` : t$1 ? `touch` : `mouse` : e$4;
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
	constructor(e$4, t$3 = {}) {
		let { listenerOptions: n$5 = {}, sourceEvents: i$4 = `auto`, startPredicate: a$3 = (e$5) => !(`button` in e$5 && e$5.button > 0) } = t$3;
		this.element = e$4, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$3, this._listenerOptions = s(n$5), this._sourceEvents = c(i$4), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$4.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$4) {
		return this.drag ? i$3(e$4, this.drag.pointerId) : null;
	}
	_onStart(t$3) {
		if (this.isDestroyed || this.drag || !this._startPredicate(t$3)) return;
		let n$5 = a$2(t$3);
		if (n$5 === null) return;
		let r$3 = i$3(t$3, n$5);
		if (r$3 === null) return;
		let s$2 = {
			pointerId: n$5,
			pointerType: o$1(t$3),
			x: r$3.clientX,
			y: r$3.clientY
		};
		this.drag = s$2;
		let c$2 = {
			...s$2,
			type: e.Start,
			srcEvent: t$3,
			target: r$3.target
		};
		this._emitter.emit(c$2.type, c$2), this.drag && this._bindWindowListeners();
	}
	_onMove(t$3) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$3);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e.Move,
			srcEvent: t$3,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3);
	}
	_onCancel(t$3) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$3);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e.Cancel,
			srcEvent: t$3,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_onEnd(t$3) {
		if (!this.drag) return;
		let n$5 = this._getTrackedPointerEventData(t$3);
		if (!n$5) return;
		this.drag.x = n$5.clientX, this.drag.y = n$5.clientY;
		let r$3 = {
			type: e.End,
			srcEvent: t$3,
			target: n$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$4, end: t$3, cancel: n$5 } = l[this._sourceEvents];
		window.addEventListener(e$4, this._onMove, this._listenerOptions), window.addEventListener(t$3, this._onEnd, this._listenerOptions), n$5 && window.addEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$4, end: t$3, cancel: n$5 } = l[this._sourceEvents];
			window.removeEventListener(e$4, this._onMove, this._listenerOptions), window.removeEventListener(t$3, this._onEnd, this._listenerOptions), n$5 && window.removeEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
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
	updateSettings(e$4) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$3, sourceEvents: n$5, startPredicate: r$3 } = e$4, i$4 = c(n$5), a$3 = s(t$3);
		r$3 && this._startPredicate !== r$3 && (this._startPredicate = r$3), (t$3 && (this._listenerOptions.capture !== a$3.capture || this._listenerOptions.passive === a$3.passive) || n$5 && this._sourceEvents !== i$4) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$5 && (this._sourceEvents = i$4), t$3 && a$3 && (this._listenerOptions = a$3), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$4, t$3, n$5) {
		return this._emitter.on(e$4, t$3, n$5);
	}
	off(e$4, t$3) {
		this._emitter.off(e$4, t$3);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/create-full-rect-CRrWdntN.js
function e$1(e$4, t$3 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0
}) {
	return e$4 && (t$3.width = e$4.width, t$3.height = e$4.height, t$3.x = e$4.x, t$3.y = e$4.y, t$3.left = e$4.x, t$3.top = e$4.y, t$3.right = e$4.x + e$4.width, t$3.bottom = e$4.y + e$4.height), t$3;
}

//#endregion
//#region ../dragdoll/dist/draggable/modifiers/containment.js
const n$3 = e$1(), r$1 = e$1(), i$2 = {
	change: 0,
	drift: 0
};
function a$1(e$4, t$3, n$5, r$3, a$3, o$3, s$2) {
	let c$2 = o$3, l$3 = a$3;
	if (o$3 > 0) {
		if (c$2 = Math.min(Math.max(r$3 - t$3, 0), o$3), s$2) if (a$3 < 0) {
			let e$5 = Math.min(-a$3, o$3);
			l$3 = a$3 + e$5, c$2 = Math.max(0, c$2 - e$5);
		} else l$3 = a$3 + (o$3 - c$2);
	} else if (o$3 < 0 && (c$2 = Math.max(Math.min(n$5 - e$4, 0), o$3), s$2)) if (a$3 > 0) {
		let e$5 = Math.max(-a$3, o$3);
		l$3 = a$3 + e$5, c$2 = Math.min(0, c$2 - e$5);
	} else l$3 = a$3 + (o$3 - c$2);
	i$2.change = c$2, i$2.drift = l$3;
}
function o(o$3, s$2 = ({ drag: t$3 }) => t$3.sensor instanceof u) {
	return function(e$4, c$2) {
		let l$3 = e$1(o$3(c$2), n$3), u$3 = e$1(c$2.item.clientRect, r$1), d$1 = c$2.item.data, f$1 = d$1.__containment__ || {
			drift: {
				x: 0,
				y: 0
			},
			trackDrift: !1
		};
		d$1.__containment__ ||= (f$1.trackDrift = typeof s$2 == `function` ? s$2(c$2) : s$2, f$1);
		let { drift: p$1, trackDrift: m$1 } = f$1;
		return e$4.x &&= (a$1(u$3.left, u$3.right, l$3.left, l$3.right, p$1.x, e$4.x, m$1), p$1.x = i$2.drift, i$2.change), e$4.y &&= (a$1(u$3.top, u$3.bottom, l$3.top, l$3.bottom, p$1.y, e$4.y, m$1), p$1.y = i$2.drift, i$2.change), e$4;
	};
}

//#endregion
//#region ../dragdoll/dist/base-sensor-cUrlV0_m.js
var n$1 = class {
	constructor() {
		this.drag = null, this.isDestroyed = !1, this._emitter = new v();
	}
	_createDragData(e$4) {
		return {
			x: e$4.x,
			y: e$4.y
		};
	}
	_updateDragData(e$4) {
		this.drag && (this.drag.x = e$4.x, this.drag.y = e$4.y);
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
	on(e$4, t$3, n$5) {
		return this._emitter.on(e$4, t$3, n$5);
	}
	off(e$4, t$3) {
		this._emitter.off(e$4, t$3);
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
//#region ../dragdoll/dist/base-motion-sensor-BS2TuJo7.js
var i = class extends n$1 {
	constructor() {
		super(), this.drag = null, this._direction = {
			x: 0,
			y: 0
		}, this._speed = 0, this._tick = this._tick.bind(this);
	}
	_createDragData(e$4) {
		return {
			...super._createDragData(e$4),
			time: 0,
			deltaTime: 0
		};
	}
	_start(e$4) {
		this.isDestroyed || this.drag || (super._start(e$4), n$2.on(t.read, this._tick, this._tick));
	}
	_end(e$4) {
		this.drag && (n$2.off(t.read, this._tick), super._end(e$4));
	}
	_cancel(e$4) {
		this.drag && (n$2.off(t.read, this._tick), super._cancel(e$4));
	}
	_tick(t$3) {
		if (this.drag) if (t$3 && this.drag.time) {
			this.drag.deltaTime = t$3 - this.drag.time, this.drag.time = t$3;
			let n$5 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, n$5), !this.drag) return;
			let r$3 = this._speed * (this.drag.deltaTime / 1e3), i$4 = this._direction.x * r$3, a$3 = this._direction.y * r$3;
			(i$4 || a$3) && this._move({
				type: e.Move,
				x: this.drag.x + i$4,
				y: this.drag.y + a$3
			});
		} else this.drag.time = t$3, this.drag.deltaTime = 0;
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
function r(e$4, t$3) {
	if (!e$4.size || !t$3.size) return Infinity;
	let n$5 = Infinity;
	for (let r$3 of e$4) {
		let e$5 = t$3.get(r$3);
		e$5 !== void 0 && e$5 < n$5 && (n$5 = e$5);
	}
	return n$5;
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
	startPredicate: (e$4, t$3) => {
		if (t$3.element && document.activeElement === t$3.element) {
			let { left: e$5, top: n$5 } = t$3.element.getBoundingClientRect();
			return {
				x: e$5,
				y: n$5
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$4, t$3 = {}) {
		super();
		let { startPredicate: n$5 = i$1.startPredicate, computeSpeed: r$3 = i$1.computeSpeed, cancelOnVisibilityChange: a$3 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$3 = i$1.cancelOnBlur, startKeys: s$2 = i$1.startKeys, moveLeftKeys: c$2 = i$1.moveLeftKeys, moveRightKeys: l$3 = i$1.moveRightKeys, moveUpKeys: u$3 = i$1.moveUpKeys, moveDownKeys: d$1 = i$1.moveDownKeys, cancelKeys: f$1 = i$1.cancelKeys, endKeys: p$1 = i$1.endKeys } = t$3;
		this.element = e$4, this._startKeys = new Set(s$2), this._cancelKeys = new Set(f$1), this._endKeys = new Set(p$1), this._moveLeftKeys = new Set(c$2), this._moveRightKeys = new Set(l$3), this._moveUpKeys = new Set(u$3), this._moveDownKeys = new Set(d$1), this._moveKeys = new Set([
			...c$2,
			...l$3,
			...u$3,
			...d$1
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$3, this._cancelOnVisibilityChange = a$3, this._computeSpeed = r$3, this._startPredicate = n$5, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$3 && e$4?.addEventListener(`blur`, this._blurCancelHandler), a$3 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_end(e$4) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._end(e$4));
	}
	_cancel(e$4) {
		this.drag && (this._moveKeyTimestamps.clear(), this._direction.x = 0, this._direction.y = 0, super._cancel(e$4));
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
		let e$4 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$3 = r(this._moveRightKeys, this._moveKeyTimestamps), n$5 = r(this._moveUpKeys, this._moveKeyTimestamps), i$4 = r(this._moveDownKeys, this._moveKeyTimestamps), a$3 = e$4 === t$3 ? 0 : e$4 < t$3 ? -1 : 1, o$3 = n$5 === i$4 ? 0 : n$5 < i$4 ? -1 : 1;
		if (!(a$3 === 0 || o$3 === 0)) {
			let e$5 = 1 / (Math.sqrt(a$3 * a$3 + o$3 * o$3) || 1);
			a$3 *= e$5, o$3 *= e$5;
		}
		this._direction.x = a$3, this._direction.y = o$3;
	}
	_onTick() {
		this._speed = this._computeSpeed(this);
	}
	_onKeyUp(e$4) {
		this._moveKeyTimestamps.get(e$4.key) && (this._moveKeyTimestamps.delete(e$4.key), this._updateDirection());
	}
	_onKeyDown(t$3) {
		if (!this.drag) {
			if (this._startKeys.has(t$3.key)) {
				let n$5 = this._startPredicate(t$3, this);
				n$5 && (t$3.preventDefault(), this._start({
					type: e.Start,
					x: n$5.x,
					y: n$5.y
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
	updateSettings(e$4 = {}) {
		let t$3 = !1, { cancelOnBlur: r$3, cancelOnVisibilityChange: i$4, startPredicate: a$3, computeSpeed: o$3 } = e$4;
		if (r$3 !== void 0 && this._cancelOnBlur !== r$3 && (this._cancelOnBlur = r$3, r$3 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$4 !== void 0 && this._cancelOnVisibilityChange !== i$4 && (this._cancelOnVisibilityChange = i$4, i$4 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$3 !== void 0 && (this._startPredicate = a$3), o$3 !== void 0 && (this._computeSpeed = o$3), n.forEach((n$5, r$4) => {
			let i$5 = `${n$5}Keys`, a$4 = e$4[i$5];
			a$4 !== void 0 && (this[`_${i$5}`] = new Set(a$4), r$4 >= 3 && (t$3 = !0));
		}), t$3) {
			let e$5 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$4, n$5) => e$5[n$5] === t$4) || (this._moveKeys = new Set(e$5), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/006-draggable-containment/index.ts
const element = document.querySelector(".draggable");
new z([new u(element), new a(element)], {
	elements: () => [element],
	positionModifiers: [o(() => {
		return {
			x: 0,
			y: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};
	})],
	onStart: () => {
		element.classList.add("dragging");
	},
	onEnd: () => {
		element.classList.remove("dragging");
	}
});

//#endregion
});