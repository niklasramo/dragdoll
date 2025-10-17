(function(factory) {
  
  typeof define === 'function' && define.amd ? define([], factory) :
  factory();
})(function() {

//#region ../../node_modules/eventti/dist/index.js
var E$1 = {
	ADD: "add",
	UPDATE: "update",
	IGNORE: "ignore",
	THROW: "throw"
}, r$1, v = class {
	constructor(t$4 = {}) {
		this.dedupe = t$4.dedupe || E$1.ADD, this.getId = t$4.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$4) {
		let n$5 = this._events.get(t$4);
		return n$5 ? n$5.l || (n$5.l = [...n$5.m.values()]) : null;
	}
	on(t$4, n$5, e$4) {
		let i$1 = this._events, s$2 = i$1.get(t$4);
		s$2 || (s$2 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$1.set(t$4, s$2));
		let o$2 = s$2.m;
		if (e$4 = e$4 === r$1 ? this.getId(n$5) : e$4, o$2.has(e$4)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$4;
			case E$1.UPDATE:
				s$2.l = null;
				break;
			default: o$2.delete(e$4), s$2.l = null;
		}
		return o$2.set(e$4, n$5), s$2.l?.push(n$5), e$4;
	}
	once(t$4, n$5, e$4) {
		let i$1 = 0;
		return e$4 = e$4 === r$1 ? this.getId(n$5) : e$4, this.on(t$4, (...s$2) => {
			i$1 || (i$1 = 1, this.off(t$4, e$4), n$5(...s$2));
		}, e$4);
	}
	off(t$4, n$5) {
		if (t$4 === r$1) {
			this._events.clear();
			return;
		}
		if (n$5 === r$1) {
			this._events.delete(t$4);
			return;
		}
		let e$4 = this._events.get(t$4);
		e$4?.m.delete(n$5) && (e$4.l = null, e$4.m.size || this._events.delete(t$4));
	}
	emit(t$4, ...n$5) {
		let e$4 = this._getListeners(t$4);
		if (e$4) {
			let i$1 = e$4.length, s$2 = 0;
			if (n$5.length) for (; s$2 < i$1; s$2++) e$4[s$2](...n$5);
			else for (; s$2 < i$1; s$2++) e$4[s$2]();
		}
	}
	listenerCount(t$4) {
		if (t$4 === r$1) {
			let n$5 = 0;
			return this._events.forEach((e$4) => {
				n$5 += e$4.m.size;
			}), n$5;
		}
		return this._events.get(t$4)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$1 = E$1, o$1 = class {
	constructor(e$4 = {}) {
		let { phases: t$4 = [], dedupe: r$2, getId: s$2 } = e$4;
		this._phases = t$4, this._emitter = new v({
			getId: s$2,
			dedupe: r$2
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
	on(e$4, t$4, r$2) {
		return this._emitter.on(e$4, t$4, r$2);
	}
	once(e$4, t$4, r$2) {
		return this._emitter.once(e$4, t$4, r$2);
	}
	off(e$4, t$4) {
		return this._emitter.off(e$4, t$4);
	}
	count(e$4) {
		return this._emitter.listenerCount(e$4);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$4 = this._queue, t$4 = this._phases, r$2 = this._getListeners, s$2 = 0, a$1 = t$4.length, n$5;
		for (; s$2 < a$1; s$2++) n$5 = r$2(t$4[s$2]), n$5 && e$4.push(n$5);
		return e$4;
	}
	_processQueue(...e$4) {
		let t$4 = this._queue, r$2 = t$4.length;
		if (!r$2) return;
		let s$2 = 0, a$1 = 0, n$5, c$2;
		for (; s$2 < r$2; s$2++) for (n$5 = t$4[s$2], a$1 = 0, c$2 = n$5.length; a$1 < c$2; a$1++) n$5[a$1](...e$4);
		t$4.length = 0;
	}
};
function u$2(i$1 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$4) => {
		let t$4 = requestAnimationFrame(e$4);
		return () => cancelAnimationFrame(t$4);
	};
	{
		let e$4 = 1e3 / i$1, t$4 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$2) => {
			let s$2 = setTimeout(() => r$2(t$4()), e$4);
			return () => clearTimeout(s$2);
		};
	}
}
var l$2 = class extends o$1 {
	constructor(e$4 = {}) {
		let { paused: t$4 = !1, onDemand: r$2 = !1, requestFrame: s$2 = u$2(),...a$1 } = e$4;
		super(a$1), this._paused = t$4, this._onDemand = r$2, this._requestFrame = s$2, this._cancelFrame = null, this._empty = !0, !t$4 && !r$2 && this._request();
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
	on(e$4, t$4, r$2) {
		let s$2 = super.on(e$4, t$4, r$2);
		return this._empty = !1, this._request(), s$2;
	}
	once(e$4, t$4, r$2) {
		let s$2 = super.once(e$4, t$4, r$2);
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
//#region ../dragdoll/dist/ticker-ep3c22TT.js
const t$2 = {
	read: Symbol(),
	write: Symbol()
};
let n$4 = new l$2({ phases: [t$2.read, t$2.write] });

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
//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$5) {
	return n$5 instanceof Window;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$4, t$4) {
	if (t$4) return window.getComputedStyle(e$4, t$4);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$4)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$4, null), STYLE_DECLARATION_CACHE.set(e$4, new WeakRef(C$1))), C$1;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$4) {
	return e$4 instanceof HTMLHtmlElement;
}

//#endregion
//#region ../dragdoll/dist/get-style-ZZHAkgcg.js
const e$3 = /* @__PURE__ */ new WeakMap();
function t$3(t$4) {
	let n$5 = e$3.get(t$4)?.deref();
	return n$5 || (n$5 = window.getComputedStyle(t$4, null), e$3.set(t$4, new WeakRef(n$5))), n$5;
}

//#endregion
//#region ../dragdoll/dist/constants-gNukEJzy.js
const e$2 = typeof window < `u` && window.document !== void 0, t$1 = e$2 && `ontouchstart` in window, n$3 = e$2 && !!window.PointerEvent;
e$2 && navigator.vendor && navigator.vendor.indexOf(`Apple`) > -1 && navigator.userAgent && navigator.userAgent.indexOf(`CriOS`) == -1 && navigator.userAgent.indexOf(`FxiOS`);

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
	const t$4 = getStyle(n$5);
	if (!IS_SAFARI) {
		const { filter: n$6 } = t$4;
		if (n$6 && "none" !== n$6) return !0;
		const { backdropFilter: e$5 } = t$4;
		if (e$5 && "none" !== e$5) return !0;
		const { willChange: i$2 } = t$4;
		if (i$2 && (i$2.indexOf("filter") > -1 || i$2.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$4 = isBlockElement(n$5);
	if (!e$4) return e$4;
	const { transform: i$1 } = t$4;
	if (i$1 && "none" !== i$1) return !0;
	const { perspective: r$2 } = t$4;
	if (r$2 && "none" !== r$2) return !0;
	const { contentVisibility: o$2 } = t$4;
	if (o$2 && "auto" === o$2) return !0;
	const { contain: f$1 } = t$4;
	if (f$1 && ("strict" === f$1 || "content" === f$1 || f$1.indexOf("paint") > -1 || f$1.indexOf("layout") > -1)) return !0;
	const { willChange: c$2 } = t$4;
	return !(!c$2 || !(c$2.indexOf("transform") > -1 || c$2.indexOf("perspective") > -1 || c$2.indexOf("contain") > -1)) || !!(IS_SAFARI && c$2 && c$2.indexOf("filter") > -1);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$4) {
	return "static" !== getStyle(t$4).position || isContainingBlockForFixedElement(t$4);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$4, t$4 = {}) {
	if (isDocumentElement(e$4)) return e$4.ownerDocument.defaultView;
	const n$5 = t$4.position || getStyle(e$4).position, { skipDisplayNone: i$1, container: o$2 } = t$4;
	switch (n$5) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$5 = o$2 || e$4.parentElement;
			for (; t$5;) {
				const e$5 = isBlockElement(t$5);
				if (e$5) return t$5;
				if (null === e$5 && !i$1) return null;
				t$5 = t$5.parentElement;
			}
			return e$4.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$5 = "fixed" === n$5;
			let l$3 = o$2 || e$4.parentElement;
			for (; l$3;) {
				const e$5 = t$5 ? isContainingBlockForFixedElement(l$3) : isContainingBlockForAbsoluteElement(l$3);
				if (!0 === e$5) return l$3;
				if (null === e$5 && !i$1) return null;
				l$3 = l$3.parentElement;
			}
			return e$4.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$5, t$4 = {}) {
	const { display: o$2 } = getStyle(n$5);
	if ("none" === o$2 || "contents" === o$2) return null;
	const e$4 = t$4.position || getStyle(n$5).position, { skipDisplayNone: s$2, container: r$2 } = t$4;
	switch (e$4) {
		case "relative": return n$5;
		case "fixed": return getContainingBlock(n$5, {
			container: r$2,
			position: e$4,
			skipDisplayNone: s$2
		});
		case "absolute": {
			const t$5 = getContainingBlock(n$5, {
				container: r$2,
				position: e$4,
				skipDisplayNone: s$2
			});
			return isWindow(t$5) ? n$5.ownerDocument : t$5;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-DooaWjWu.js
function s$1(e$4, t$4) {
	return e$4.isIdentity && t$4.isIdentity ? !0 : e$4.is2D && t$4.is2D ? e$4.a === t$4.a && e$4.b === t$4.b && e$4.c === t$4.c && e$4.d === t$4.d && e$4.e === t$4.e && e$4.f === t$4.f : e$4.m11 === t$4.m11 && e$4.m12 === t$4.m12 && e$4.m13 === t$4.m13 && e$4.m14 === t$4.m14 && e$4.m21 === t$4.m21 && e$4.m22 === t$4.m22 && e$4.m23 === t$4.m23 && e$4.m24 === t$4.m24 && e$4.m31 === t$4.m31 && e$4.m32 === t$4.m32 && e$4.m33 === t$4.m33 && e$4.m34 === t$4.m34 && e$4.m41 === t$4.m41 && e$4.m42 === t$4.m42 && e$4.m43 === t$4.m43 && e$4.m44 === t$4.m44;
}
function c$1(e$4) {
	return e$4.m11 !== 1 || e$4.m12 !== 0 || e$4.m13 !== 0 || e$4.m14 !== 0 || e$4.m21 !== 0 || e$4.m22 !== 1 || e$4.m23 !== 0 || e$4.m24 !== 0 || e$4.m31 !== 0 || e$4.m32 !== 0 || e$4.m33 !== 1 || e$4.m34 !== 0 || e$4.m43 !== 0 || e$4.m44 !== 1;
}
function l$1(e$4, t$4, n$5 = null) {
	if (`moveBefore` in e$4 && e$4.isConnected === t$4.isConnected) try {
		e$4.moveBefore(t$4, n$5);
		return;
	} catch {}
	let r$2 = document.activeElement, i$1 = t$4.contains(r$2);
	e$4.insertBefore(t$4, n$5), i$1 && document.activeElement !== r$2 && r$2 instanceof HTMLElement && r$2.focus({ preventScroll: !0 });
}
function u$1(e$4) {
	return e$4.setMatrixValue(`scale(1, 1)`);
}
function d(e$4, t$4 = 0) {
	let n$5 = 10 ** t$4;
	return Math.round((e$4 + 2 ** -52) * n$5) / n$5;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$4, t$4) {
		this._cache.set(e$4, t$4), this._validation.set(e$4, void 0);
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
	constructor(e$4, t$4) {
		this.sensor = e$4, this.startEvent = t$4, this.prevMoveEvent = t$4, this.moveEvent = t$4, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$4, t$4, n$5 = !1) {
	let { style: r$2 } = e$4;
	for (let e$5 in t$4) r$2.setProperty(e$5, t$4[e$5], n$5 ? `important` : ``);
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
function g(e$4, t$4 = {
	x: 0,
	y: 0
}) {
	if (t$4.x = 0, t$4.y = 0, e$4 instanceof Window) return t$4;
	if (e$4 instanceof Document) return t$4.x = window.scrollX * -1, t$4.y = window.scrollY * -1, t$4;
	let { x: r$2, y: i$1 } = e$4.getBoundingClientRect(), a$1 = t$3(e$4);
	return t$4.x = r$2 + (parseFloat(a$1.borderLeftWidth) || 0), t$4.y = i$1 + (parseFloat(a$1.borderTopWidth) || 0), t$4;
}
function _(e$4) {
	let t$4 = t$3(e$4), r$2 = parseFloat(t$4.height) || 0;
	return t$4.boxSizing === `border-box` ? r$2 : (r$2 += parseFloat(t$4.borderTopWidth) || 0, r$2 += parseFloat(t$4.borderBottomWidth) || 0, r$2 += parseFloat(t$4.paddingTop) || 0, r$2 += parseFloat(t$4.paddingBottom) || 0, e$4 instanceof HTMLElement && (r$2 += e$4.offsetHeight - e$4.clientHeight), r$2);
}
function v$1(e$4) {
	let t$4 = t$3(e$4), r$2 = parseFloat(t$4.width) || 0;
	return t$4.boxSizing === `border-box` ? r$2 : (r$2 += parseFloat(t$4.borderLeftWidth) || 0, r$2 += parseFloat(t$4.borderRightWidth) || 0, r$2 += parseFloat(t$4.paddingLeft) || 0, r$2 += parseFloat(t$4.paddingRight) || 0, e$4 instanceof HTMLElement && (r$2 += e$4.offsetWidth - e$4.clientWidth), r$2);
}
function y(e$4, t$4 = !1) {
	let { translate: r$2, rotate: i$1, scale: a$1, transform: o$2 } = t$3(e$4), s$2 = ``;
	if (r$2 && r$2 !== `none`) {
		let [t$5 = `0px`, n$5 = `0px`, i$2] = r$2.split(` `);
		t$5.includes(`%`) && (t$5 = `${parseFloat(t$5) / 100 * v$1(e$4)}px`), n$5.includes(`%`) && (n$5 = `${parseFloat(n$5) / 100 * _(e$4)}px`), i$2 ? s$2 += `translate3d(${t$5},${n$5},${i$2})` : s$2 += `translate(${t$5},${n$5})`;
	}
	if (i$1 && i$1 !== `none`) {
		let e$5 = i$1.split(` `);
		e$5.length > 1 ? s$2 += `rotate3d(${e$5.join(`,`)})` : s$2 += `rotate(${e$5.join(`,`)})`;
	}
	if (a$1 && a$1 !== `none`) {
		let e$5 = a$1.split(` `);
		e$5.length === 3 ? s$2 += `scale3d(${e$5.join(`,`)})` : s$2 += `scale(${e$5.join(`,`)})`;
	}
	return !t$4 && o$2 && o$2 !== `none` && (s$2 += o$2), s$2;
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
function C(e$4, t$4, n$5 = {
	x: 0,
	y: 0
}) {
	let r$2 = b(e$4) ? e$4 : g(e$4, x), i$1 = b(t$4) ? t$4 : g(t$4, S);
	return n$5.x = i$1.x - r$2.x, n$5.y = i$1.y - r$2.y, n$5;
}
function w(e$4) {
	let t$4 = e$4.split(` `), n$5 = ``, r$2 = ``, i$1 = ``;
	return t$4.length === 1 ? n$5 = r$2 = t$4[0] : t$4.length === 2 ? [n$5, r$2] = t$4 : [n$5, r$2, i$1] = t$4, {
		x: parseFloat(n$5) || 0,
		y: parseFloat(r$2) || 0,
		z: parseFloat(i$1) || 0
	};
}
const T = e$2 ? new DOMMatrix() : null;
function E(e$4, t$4 = new DOMMatrix()) {
	let r$2 = e$4;
	for (u$1(t$4); r$2;) {
		let e$5 = y(r$2);
		if (e$5 && (T.setMatrixValue(e$5), !T.isIdentity)) {
			let { transformOrigin: e$6 } = t$3(r$2), { x: i$1, y: a$1, z: o$2 } = w(e$6);
			o$2 === 0 ? T.setMatrixValue(`translate(${i$1}px,${a$1}px) ${T} translate(${i$1 * -1}px,${a$1 * -1}px)`) : T.setMatrixValue(`translate3d(${i$1}px,${a$1}px,${o$2}px) ${T} translate3d(${i$1 * -1}px,${a$1 * -1}px,${o$2 * -1}px)`), t$4.preMultiplySelf(T);
		}
		r$2 = r$2.parentElement;
	}
	return t$4;
}
const D = e$2 ? h() : null;
var O = class {
	constructor(e$4, t$4) {
		if (!e$4.isConnected) throw Error(`Element is not connected`);
		let { drag: r$2 } = t$4;
		if (!r$2) throw Error(`Drag is not defined`);
		let i$1 = t$3(e$4), a$1 = e$4.getBoundingClientRect(), s$2 = y(e$4, !0);
		this.data = {}, this.element = e$4, this.elementTransformOrigin = w(i$1.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$2 + i$1.transform), this.elementOffsetMatrix = new DOMMatrix(s$2).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = r$2._matrixCache, this._clientOffsetCache = r$2._clientOffsetCache;
		let c$2 = e$4.parentElement;
		if (!c$2) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$2;
		let l$3 = t$4.settings.container || c$2;
		if (this.dragContainer = l$3, c$2 !== l$3) {
			let { position: e$5 } = i$1;
			if (e$5 !== `fixed` && e$5 !== `absolute`) throw Error(`Dragged element has "${e$5}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$3 = getOffsetContainer(e$4) || e$4;
		this.elementOffsetContainer = u$3, this.dragOffsetContainer = l$3 === c$2 ? u$3 : getOffsetContainer(e$4, { container: l$3 });
		{
			let { width: e$5, height: t$5, x: n$5, y: r$3 } = a$1;
			this.clientRect = {
				width: e$5,
				height: t$5,
				x: n$5,
				y: r$3
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$4.settings.frozenStyles({
			draggable: t$4,
			drag: r$2,
			item: this,
			style: i$1
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$5 = {};
			for (let t$5 of d$1) e$5[t$5] = i$1[t$5];
			this.frozenStyles = e$5;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$5 = {};
			for (let n$5 in this.frozenStyles) t$5[n$5] = e$4.style[n$5];
			this.unfrozenStyles = t$5;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$4) => {
			if (!this._matrixCache.isValid(e$4)) {
				let t$4 = this._matrixCache.get(e$4) || [new DOMMatrix(), new DOMMatrix()], [n$5, r$2] = t$4;
				E(e$4, n$5), r$2.setMatrixValue(n$5.toString()).invertSelf(), this._matrixCache.set(e$4, t$4);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$4, elementContainer: t$4, dragOffsetContainer: n$5, dragContainer: r$2, containerOffset: i$1, _clientOffsetCache: a$1, _matrixCache: o$2 } = this;
		if (e$4 !== n$5) {
			let [s$2, l$3] = [[r$2, n$5], [t$4, e$4]].map(([e$5, t$5]) => {
				let n$6 = a$1.get(t$5) || {
					x: 0,
					y: 0
				};
				if (!a$1.isValid(t$5)) {
					let r$3 = o$2.get(e$5);
					t$5 instanceof HTMLElement && r$3 && !r$3[0].isIdentity ? c$1(r$3[0]) ? (D.style.setProperty(`transform`, r$3[1].toString(), `important`), t$5.append(D), g(D, n$6), D.remove()) : (g(t$5, n$6), n$6.x -= r$3[0].m41, n$6.y -= r$3[0].m42) : g(t$5, n$6);
				}
				return a$1.set(t$5, n$6), n$6;
			});
			C(s$2, l$3, i$1);
		} else i$1.x = 0, i$1.y = 0;
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
			let { width: e$5, height: t$4 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$5, this.clientRect.height = t$4;
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
	applyPosition: ({ item: e$4, phase: t$4 }) => {
		let n$5 = t$4 === L.End || t$4 === L.EndAlign, [r$2, i$1] = e$4.getContainerMatrix(), [a$1, o$2] = e$4.getDragContainerMatrix(), { position: s$2, alignmentOffset: c$2, containerOffset: l$3, elementTransformMatrix: d$1, elementTransformOrigin: f$1, elementOffsetMatrix: p$1 } = e$4, { x: m$1, y: h$1, z: g$1 } = f$1, _$2 = !d$1.isIdentity && (m$1 !== 0 || h$1 !== 0 || g$1 !== 0), v$2 = s$2.x + c$2.x + l$3.x, y$1 = s$2.y + c$2.y + l$3.y;
		u$1(j), _$2 && (g$1 === 0 ? j.translateSelf(-m$1, -h$1) : j.translateSelf(-m$1, -h$1, -g$1)), n$5 ? i$1.isIdentity || j.multiplySelf(i$1) : o$2.isIdentity || j.multiplySelf(o$2), u$1(M).translateSelf(v$2, y$1), j.multiplySelf(M), r$2.isIdentity || j.multiplySelf(r$2), _$2 && (u$1(M).translateSelf(m$1, h$1, g$1), j.multiplySelf(M)), d$1.isIdentity || j.multiplySelf(d$1), p$1.isIdentity || j.preMultiplySelf(p$1), e$4.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$4 }) => e$4.items[0].clientRect || null,
	positionModifiers: [],
	sensorProcessingMode: I.Sampled,
	group: null
};
var B = class {
	constructor(e$4, t$4 = {}) {
		let { id: n$5 = Symbol(),...r$2 } = t$4;
		this.id = n$5, this.sensors = e$4, this.settings = this._parseSettings(r$2), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((e$5) => {
			this._sensorData.set(e$5, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (t$6) => this._onMove(t$6, e$5),
				onEnd: (t$6) => this._onEnd(t$6, e$5)
			});
			let { onMove: t$5, onEnd: n$6 } = this._sensorData.get(e$5);
			e$5.on(e.Start, t$5, t$5), e$5.on(e.Move, t$5, t$5), e$5.on(e.Cancel, n$6, n$6), e$5.on(e.End, n$6, n$6), e$5.on(e.Destroy, n$6, n$6);
		});
	}
	_parseSettings(e$4, t$4 = z) {
		let { container: n$5 = t$4.container, startPredicate: r$2 = t$4.startPredicate, elements: i$1 = t$4.elements, frozenStyles: a$1 = t$4.frozenStyles, positionModifiers: o$2 = t$4.positionModifiers, applyPosition: s$2 = t$4.applyPosition, computeClientRect: c$2 = t$4.computeClientRect, sensorProcessingMode: l$3 = t$4.sensorProcessingMode, group: u$3 = t$4.group, onPrepareStart: d$1 = t$4.onPrepareStart, onStart: f$1 = t$4.onStart, onPrepareMove: p$1 = t$4.onPrepareMove, onMove: m$1 = t$4.onMove, onEnd: h$1 = t$4.onEnd, onDestroy: g$1 = t$4.onDestroy } = e$4 || {};
		return {
			container: n$5,
			startPredicate: r$2,
			elements: i$1,
			frozenStyles: a$1,
			positionModifiers: o$2,
			applyPosition: s$2,
			computeClientRect: c$2,
			sensorProcessingMode: l$3,
			group: u$3,
			onPrepareStart: d$1,
			onStart: f$1,
			onPrepareMove: p$1,
			onMove: m$1,
			onEnd: h$1,
			onDestroy: g$1
		};
	}
	_emit(e$4, ...t$4) {
		this._emitter.emit(e$4, ...t$4);
	}
	_onMove(n$5, r$2) {
		let i$1 = this._sensorData.get(r$2);
		if (i$1) switch (i$1.predicateState) {
			case P.Pending: {
				i$1.predicateEvent = n$5;
				let e$4 = this.settings.startPredicate({
					draggable: this,
					sensor: r$2,
					event: n$5
				});
				e$4 === !0 ? this.resolveStartPredicate(r$2) : e$4 === !1 && this.rejectStartPredicate(r$2);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = n$5, this.settings.sensorProcessingMode === I.Immediate ? (this._prepareMove(), this._applyMove()) : (n$4.once(t$2.read, this._prepareMove, this._moveId), n$4.once(t$2.write, this._applyMove, this._moveId)));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$4, t$4) {
		let n$5 = this._sensorData.get(t$4);
		n$5 && (this.drag ? n$5.predicateState === P.Resolved && (this.drag.endEvent = e$4, this._sensorData.forEach((e$5) => {
			e$5.predicateState = P.Pending, e$5.predicateEvent = null;
		}), this.stop()) : (n$5.predicateState = P.Pending, n$5.predicateEvent = null));
	}
	_prepareStart() {
		let e$4 = this.drag;
		e$4 && (this._startPhase = N.Prepare, e$4.items = (this.settings.elements({
			draggable: this,
			drag: e$4
		}) || []).map((e$5) => new O(e$5, this)), this._applyModifiers(F.Start, 0, 0), this._emit(R.PrepareStart, e$4.startEvent), this.settings.onPrepareStart?.(e$4, this), this._startPhase = N.FinishPrepare);
	}
	_applyStart() {
		let e$4 = this.drag;
		if (e$4) {
			this._startPhase = N.Apply;
			for (let t$4 of e$4.items) t$4.dragContainer !== t$4.elementContainer && l$1(t$4.dragContainer, t$4.element), t$4.frozenStyles && Object.assign(t$4.element.style, t$4.frozenStyles), this.settings.applyPosition({
				phase: L.Start,
				draggable: this,
				drag: e$4,
				item: t$4
			});
			for (let t$4 of e$4.items) {
				let e$5 = t$4.getContainerMatrix()[0], n$5 = t$4.getDragContainerMatrix()[0];
				if (s$1(e$5, n$5) || !c$1(e$5) && !c$1(n$5)) continue;
				let r$2 = t$4.element.getBoundingClientRect(), { alignmentOffset: i$1 } = t$4;
				i$1.x += d(t$4.clientRect.x - r$2.x, 3), i$1.y += d(t$4.clientRect.y - r$2.y, 3);
			}
			for (let t$4 of e$4.items) {
				let { alignmentOffset: n$5 } = t$4;
				(n$5.x !== 0 || n$5.y !== 0) && this.settings.applyPosition({
					phase: L.StartAlign,
					draggable: this,
					drag: e$4,
					item: t$4
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(R.Start, e$4.startEvent), this.settings.onStart?.(e$4, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$4 = this.drag;
		if (!e$4) return;
		let { moveEvent: t$4, prevMoveEvent: n$5 } = e$4;
		t$4 !== n$5 && (this._applyModifiers(F.Move, t$4.x - n$5.x, t$4.y - n$5.y), this._emit(R.PrepareMove, t$4), !e$4.isEnded && (this.settings.onPrepareMove?.(e$4, this), !e$4.isEnded && (e$4.prevMoveEvent = t$4)));
	}
	_applyMove() {
		let e$4 = this.drag;
		if (e$4) {
			for (let t$4 of e$4.items) t$4._moveDiff.x = 0, t$4._moveDiff.y = 0, this.settings.applyPosition({
				phase: L.Move,
				draggable: this,
				drag: e$4,
				item: t$4
			});
			this._emit(R.Move, e$4.moveEvent), !e$4.isEnded && this.settings.onMove?.(e$4, this);
		}
	}
	_prepareAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$4 of e$4.items) {
			let { x: e$5, y: n$5 } = t$4.element.getBoundingClientRect(), r$2 = t$4.clientRect.x - t$4._moveDiff.x - e$5;
			t$4.alignmentOffset.x = t$4.alignmentOffset.x - t$4._alignDiff.x + r$2, t$4._alignDiff.x = r$2;
			let i$1 = t$4.clientRect.y - t$4._moveDiff.y - n$5;
			t$4.alignmentOffset.y = t$4.alignmentOffset.y - t$4._alignDiff.y + i$1, t$4._alignDiff.y = i$1;
		}
	}
	_applyAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$4 of e$4.items) t$4._alignDiff.x = 0, t$4._alignDiff.y = 0, this.settings.applyPosition({
			phase: L.Align,
			draggable: this,
			drag: e$4,
			item: t$4
		});
	}
	_applyModifiers(e$4, t$4, n$5) {
		let { drag: r$2 } = this;
		if (!r$2) return;
		let { positionModifiers: i$1 } = this.settings;
		for (let a$1 of r$2.items) {
			let o$2 = A;
			o$2.x = t$4, o$2.y = n$5;
			for (let t$5 of i$1) o$2 = t$5(o$2, {
				draggable: this,
				drag: r$2,
				item: a$1,
				phase: e$4
			});
			a$1.position.x += o$2.x, a$1.position.y += o$2.y, a$1.clientRect.x += o$2.x, a$1.clientRect.y += o$2.y, e$4 === `move` && (a$1._moveDiff.x += o$2.x, a$1._moveDiff.y += o$2.y);
		}
	}
	on(e$4, t$4, n$5) {
		return this._emitter.on(e$4, t$4, n$5);
	}
	off(e$4, t$4) {
		this._emitter.off(e$4, t$4);
	}
	resolveStartPredicate(n$5, r$2) {
		let i$1 = this._sensorData.get(n$5);
		if (!i$1) return;
		let a$1 = r$2 || i$1.predicateEvent;
		i$1.predicateState === P.Pending && a$1 && (this._startPhase = N.Init, i$1.predicateState = P.Resolved, i$1.predicateEvent = null, this.drag = new p(n$5, a$1), this._sensorData.forEach((e$4, t$4) => {
			t$4 !== n$5 && (e$4.predicateState = P.Rejected, e$4.predicateEvent = null);
		}), this.settings.sensorProcessingMode === I.Immediate ? (this._prepareStart(), this._applyStart()) : (n$4.once(t$2.read, this._prepareStart, this._startId), n$4.once(t$2.write, this._applyStart, this._startId)));
	}
	rejectStartPredicate(e$4) {
		let t$4 = this._sensorData.get(e$4);
		t$4?.predicateState === P.Pending && (t$4.predicateState = P.Rejected, t$4.predicateEvent = null);
	}
	stop() {
		let n$5 = this.drag;
		if (!(!n$5 || n$5.isEnded)) {
			if (this._startPhase === N.Prepare || this._startPhase === N.Apply) throw Error(`Cannot stop drag start process at this point`);
			n$5.isEnded = !0, this._startPhase === N.Init && this._prepareStart(), this._startPhase === N.FinishPrepare && this._applyStart(), this._startPhase = N.None, n$4.off(t$2.read, this._startId), n$4.off(t$2.write, this._startId), n$4.off(t$2.read, this._moveId), n$4.off(t$2.write, this._moveId), n$4.off(t$2.read, this._alignId), n$4.off(t$2.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), this._applyModifiers(F.End, 0, 0);
			for (let e$4 of n$5.items) {
				if (e$4.elementContainer !== e$4.dragContainer && (l$1(e$4.elementContainer, e$4.element), e$4.alignmentOffset.x = 0, e$4.alignmentOffset.y = 0, e$4.containerOffset.x = 0, e$4.containerOffset.y = 0), e$4.unfrozenStyles) for (let t$4 in e$4.unfrozenStyles) e$4.element.style[t$4] = e$4.unfrozenStyles[t$4] || ``;
				this.settings.applyPosition({
					phase: L.End,
					draggable: this,
					drag: n$5,
					item: e$4
				});
			}
			for (let e$4 of n$5.items) if (e$4.elementContainer !== e$4.dragContainer) {
				let t$4 = e$4.element.getBoundingClientRect();
				e$4.alignmentOffset.x = d(e$4.clientRect.x - t$4.x, 3), e$4.alignmentOffset.y = d(e$4.clientRect.y - t$4.y, 3);
			}
			for (let e$4 of n$5.items) e$4.elementContainer !== e$4.dragContainer && (e$4.alignmentOffset.x !== 0 || e$4.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: L.EndAlign,
				draggable: this,
				drag: n$5,
				item: e$4
			});
			this._emit(R.End, n$5.endEvent), this.settings.onEnd?.(n$5, this), this.drag = null;
		}
	}
	align(n$5 = !1) {
		this.drag && (n$5 || this.settings.sensorProcessingMode === I.Immediate ? (this._prepareAlign(), this._applyAlign()) : (n$4.once(t$2.read, this._prepareAlign, this._alignId), n$4.once(t$2.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$4, settings: t$4 } = this;
		return e$4 && t$4.computeClientRect?.({
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
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: e$4, onEnd: t$4 }, n$5) => {
			n$5.off(e.Start, e$4), n$5.off(e.Move, e$4), n$5.off(e.Cancel, t$4), n$5.off(e.End, t$4), n$5.off(e.Destroy, t$4);
		}), this._sensorData.clear(), this._emit(R.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-CyG2cFYy.js
function i(e$4, t$4) {
	if (`pointerId` in e$4) return e$4.pointerId === t$4 ? e$4 : null;
	if (`changedTouches` in e$4) {
		let n$5 = 0;
		for (; n$5 < e$4.changedTouches.length; n$5++) if (e$4.changedTouches[n$5].identifier === t$4) return e$4.changedTouches[n$5];
		return null;
	}
	return e$4;
}
function a(e$4) {
	return `pointerId` in e$4 ? e$4.pointerId : `changedTouches` in e$4 ? e$4.changedTouches[0] ? e$4.changedTouches[0].identifier : null : -1;
}
function o(e$4) {
	return `pointerType` in e$4 ? e$4.pointerType : `touches` in e$4 ? `touch` : `mouse`;
}
function s(e$4 = {}) {
	let { capture: t$4 = !0, passive: n$5 = !0 } = e$4;
	return {
		capture: t$4,
		passive: n$5
	};
}
function c(n$5) {
	return n$5 === `auto` || n$5 === void 0 ? n$3 ? `pointer` : t$1 ? `touch` : `mouse` : n$5;
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
	constructor(e$4, t$4 = {}) {
		let { listenerOptions: n$5 = {}, sourceEvents: i$1 = `auto`, startPredicate: a$1 = (e$5) => !(`button` in e$5 && e$5.button > 0) } = t$4;
		this.element = e$4, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$1, this._listenerOptions = s(n$5), this._sourceEvents = c(i$1), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$4.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$4) {
		return this.drag ? i(e$4, this.drag.pointerId) : null;
	}
	_onStart(e$4) {
		if (this.isDestroyed || this.drag || !this._startPredicate(e$4)) return;
		let t$4 = a(e$4);
		if (t$4 === null) return;
		let r$2 = i(e$4, t$4);
		if (r$2 === null) return;
		let s$2 = {
			pointerId: t$4,
			pointerType: o(e$4),
			x: r$2.clientX,
			y: r$2.clientY
		};
		this.drag = s$2;
		let c$2 = {
			...s$2,
			type: e.Start,
			srcEvent: e$4,
			target: r$2.target
		};
		this._emitter.emit(c$2.type, c$2), this.drag && this._bindWindowListeners();
	}
	_onMove(e$4) {
		if (!this.drag) return;
		let t$4 = this._getTrackedPointerEventData(e$4);
		if (!t$4) return;
		this.drag.x = t$4.clientX, this.drag.y = t$4.clientY;
		let r$2 = {
			type: e.Move,
			srcEvent: e$4,
			target: t$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2);
	}
	_onCancel(e$4) {
		if (!this.drag) return;
		let t$4 = this._getTrackedPointerEventData(e$4);
		if (!t$4) return;
		this.drag.x = t$4.clientX, this.drag.y = t$4.clientY;
		let r$2 = {
			type: e.Cancel,
			srcEvent: e$4,
			target: t$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2), this._resetDrag();
	}
	_onEnd(e$4) {
		if (!this.drag) return;
		let t$4 = this._getTrackedPointerEventData(e$4);
		if (!t$4) return;
		this.drag.x = t$4.clientX, this.drag.y = t$4.clientY;
		let r$2 = {
			type: e.End,
			srcEvent: e$4,
			target: t$4.target,
			...this.drag
		};
		this._emitter.emit(r$2.type, r$2), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$4, end: t$4, cancel: n$5 } = l[this._sourceEvents];
		window.addEventListener(e$4, this._onMove, this._listenerOptions), window.addEventListener(t$4, this._onEnd, this._listenerOptions), n$5 && window.addEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$4, end: t$4, cancel: n$5 } = l[this._sourceEvents];
			window.removeEventListener(e$4, this._onMove, this._listenerOptions), window.removeEventListener(t$4, this._onEnd, this._listenerOptions), n$5 && window.removeEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let e$4 = {
			type: e.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(e$4.type, e$4), this._resetDrag();
	}
	updateSettings(e$4) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$4, sourceEvents: n$5, startPredicate: r$2 } = e$4, i$1 = c(n$5), a$1 = s(t$4);
		r$2 && this._startPredicate !== r$2 && (this._startPredicate = r$2), (t$4 && (this._listenerOptions.capture !== a$1.capture || this._listenerOptions.passive === a$1.passive) || n$5 && this._sourceEvents !== i$1) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$5 && (this._sourceEvents = i$1), t$4 && a$1 && (this._listenerOptions = a$1), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$4, t$4, n$5) {
		return this._emitter.on(e$4, t$4, n$5);
	}
	off(e$4, t$4) {
		this._emitter.off(e$4, t$4);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/create-snap-modifier-D1nk7is-.js
function e$1(e$4, t$4) {
	return Math.round(e$4 / t$4) * t$4;
}
function t(t$4, n$5, r$2) {
	let i$1 = r$2 - n$5, a$1 = Math.abs(i$1);
	if (a$1 >= t$4) {
		let n$6 = a$1 % t$4;
		return e$1(i$1 > 0 ? i$1 - n$6 : i$1 + n$6, t$4);
	}
	return 0;
}
function n(e$4, n$5) {
	return function(r$2, { item: i$1 }) {
		let a$1 = i$1.data.__snap__ || (i$1.data.__snap__ = {
			snapX: 0,
			snapY: 0,
			sensorX: 0,
			sensorY: 0
		});
		a$1.sensorX += r$2.x, a$1.sensorY += r$2.y;
		let o$2 = t(e$4, a$1.snapX, a$1.sensorX), s$2 = t(n$5, a$1.snapY, a$1.sensorY);
		return a$1.snapX += o$2, a$1.snapY += s$2, r$2.x = o$2, r$2.y = s$2, r$2;
	};
}

//#endregion
//#region ../dragdoll/dist/base-sensor-6CQrwFkA.js
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
	_start(t$4) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$4), this._emitter.emit(e.Start, t$4));
	}
	_move(t$4) {
		this.drag && (this._updateDragData(t$4), this._emitter.emit(e.Move, t$4));
	}
	_end(t$4) {
		this.drag && (this._updateDragData(t$4), this._emitter.emit(e.End, t$4), this._resetDragData());
	}
	_cancel(t$4) {
		this.drag && (this._updateDragData(t$4), this._emitter.emit(e.Cancel, t$4), this._resetDragData());
	}
	on(e$4, t$4, n$5) {
		return this._emitter.on(e$4, t$4, n$5);
	}
	off(e$4, t$4) {
		this._emitter.off(e$4, t$4);
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
//#region ../dragdoll/dist/keyboard-sensor-CJl8XkdN.js
const n$2 = {
	moveDistance: 25,
	cancelOnBlur: !0,
	cancelOnVisibilityChange: !0,
	startPredicate: (e$4, t$4) => {
		if (t$4.element && (e$4.key === `Enter` || e$4.key === ` `) && document.activeElement === t$4.element) {
			let { x: e$5, y: n$5 } = t$4.element.getBoundingClientRect();
			return {
				x: e$5,
				y: n$5
			};
		}
		return null;
	},
	movePredicate: (e$4, t$4) => {
		if (!t$4.drag) return null;
		switch (e$4.key) {
			case `ArrowLeft`: return {
				x: t$4.drag.x - t$4.moveDistance.x,
				y: t$4.drag.y
			};
			case `ArrowRight`: return {
				x: t$4.drag.x + t$4.moveDistance.x,
				y: t$4.drag.y
			};
			case `ArrowUp`: return {
				x: t$4.drag.x,
				y: t$4.drag.y - t$4.moveDistance.y
			};
			case `ArrowDown`: return {
				x: t$4.drag.x,
				y: t$4.drag.y + t$4.moveDistance.y
			};
			default: return null;
		}
	},
	cancelPredicate: (e$4, t$4) => {
		if (t$4.drag && e$4.key === `Escape`) {
			let { x: e$5, y: n$5 } = t$4.drag;
			return {
				x: e$5,
				y: n$5
			};
		}
		return null;
	},
	endPredicate: (e$4, t$4) => {
		if (t$4.drag && (e$4.key === `Enter` || e$4.key === ` `)) {
			let { x: e$5, y: n$5 } = t$4.drag;
			return {
				x: e$5,
				y: n$5
			};
		}
		return null;
	}
};
var r = class extends n$1 {
	constructor(e$4, t$4 = {}) {
		super();
		let { moveDistance: r$2 = n$2.moveDistance, cancelOnBlur: i$1 = n$2.cancelOnBlur, cancelOnVisibilityChange: a$1 = n$2.cancelOnVisibilityChange, startPredicate: o$2 = n$2.startPredicate, movePredicate: s$2 = n$2.movePredicate, cancelPredicate: c$2 = n$2.cancelPredicate, endPredicate: l$3 = n$2.endPredicate } = t$4;
		this.element = e$4, this.moveDistance = typeof r$2 == `number` ? {
			x: r$2,
			y: r$2
		} : { ...r$2 }, this._cancelOnBlur = i$1, this._cancelOnVisibilityChange = a$1, this._startPredicate = o$2, this._movePredicate = s$2, this._cancelPredicate = c$2, this._endPredicate = l$3, this._onKeyDown = this._onKeyDown.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), document.addEventListener(`keydown`, this._onKeyDown), i$1 && e$4?.addEventListener(`blur`, this._blurCancelHandler), a$1 && document.addEventListener(`visibilitychange`, this._internalCancel);
	}
	_internalCancel() {
		this.cancel();
	}
	_blurCancelHandler() {
		queueMicrotask(() => {
			document.activeElement !== this.element && this.cancel();
		});
	}
	_onKeyDown(t$4) {
		if (!this.drag) {
			let n$6 = this._startPredicate(t$4, this);
			n$6 && (t$4.preventDefault(), this._start({
				type: e.Start,
				x: n$6.x,
				y: n$6.y,
				srcEvent: t$4
			}));
			return;
		}
		let n$5 = this._cancelPredicate(t$4, this);
		if (n$5) {
			t$4.preventDefault(), this._cancel({
				type: e.Cancel,
				x: n$5.x,
				y: n$5.y,
				srcEvent: t$4
			});
			return;
		}
		let r$2 = this._endPredicate(t$4, this);
		if (r$2) {
			t$4.preventDefault(), this._end({
				type: e.End,
				x: r$2.x,
				y: r$2.y,
				srcEvent: t$4
			});
			return;
		}
		let i$1 = this._movePredicate(t$4, this);
		if (i$1) {
			t$4.preventDefault(), this._move({
				type: e.Move,
				x: i$1.x,
				y: i$1.y,
				srcEvent: t$4
			});
			return;
		}
	}
	updateSettings(e$4 = {}) {
		let { moveDistance: t$4, cancelOnBlur: n$5, cancelOnVisibilityChange: r$2, startPredicate: i$1, movePredicate: a$1, cancelPredicate: o$2, endPredicate: s$2 } = e$4;
		t$4 !== void 0 && (typeof t$4 == `number` ? this.moveDistance.x = this.moveDistance.y = t$4 : (this.moveDistance.x = t$4.x, this.moveDistance.y = t$4.y)), n$5 !== void 0 && this._cancelOnBlur !== n$5 && (this._cancelOnBlur = n$5, n$5 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), r$2 !== void 0 && this._cancelOnVisibilityChange !== r$2 && (this._cancelOnVisibilityChange = r$2, r$2 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), i$1 && (this._startPredicate = i$1), a$1 && (this._movePredicate = a$1), o$2 && (this._cancelPredicate = o$2), s$2 && (this._endPredicate = s$2);
	}
	destroy() {
		this.isDestroyed || (super.destroy(), document.removeEventListener(`keydown`, this._onKeyDown), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/005-draggable-snap-to-grid/index.ts
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const element = document.querySelector(".draggable");
new B([new u(element), new r(element, { moveDistance: {
	x: GRID_WIDTH,
	y: GRID_HEIGHT
} })], {
	elements: () => [element],
	positionModifiers: [n(GRID_WIDTH, GRID_HEIGHT)],
	onStart: () => {
		element.classList.add("dragging");
	},
	onEnd: () => {
		element.classList.remove("dragging");
	}
});

//#endregion
});