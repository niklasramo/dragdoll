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
}, r$2, v = class {
	constructor(t$2 = {}) {
		this.dedupe = t$2.dedupe || E$1.ADD, this.getId = t$2.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$2) {
		let n$4 = this._events.get(t$2);
		return n$4 ? n$4.l || (n$4.l = [...n$4.m.values()]) : null;
	}
	on(t$2, n$4, e$3) {
		let i$3 = this._events, s$2 = i$3.get(t$2);
		s$2 || (s$2 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$3.set(t$2, s$2));
		let o$2 = s$2.m;
		if (e$3 = e$3 === r$2 ? this.getId(n$4) : e$3, o$2.has(e$3)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$3;
			case E$1.UPDATE:
				s$2.l = null;
				break;
			default: o$2.delete(e$3), s$2.l = null;
		}
		return o$2.set(e$3, n$4), s$2.l?.push(n$4), e$3;
	}
	once(t$2, n$4, e$3) {
		let i$3 = 0;
		return e$3 = e$3 === r$2 ? this.getId(n$4) : e$3, this.on(t$2, (...s$2) => {
			i$3 || (i$3 = 1, this.off(t$2, e$3), n$4(...s$2));
		}, e$3);
	}
	off(t$2, n$4) {
		if (t$2 === r$2) {
			this._events.clear();
			return;
		}
		if (n$4 === r$2) {
			this._events.delete(t$2);
			return;
		}
		let e$3 = this._events.get(t$2);
		e$3?.m.delete(n$4) && (e$3.l = null, e$3.m.size || this._events.delete(t$2));
	}
	emit(t$2, ...n$4) {
		let e$3 = this._getListeners(t$2);
		if (e$3) {
			let i$3 = e$3.length, s$2 = 0;
			if (n$4.length) for (; s$2 < i$3; s$2++) e$3[s$2](...n$4);
			else for (; s$2 < i$3; s$2++) e$3[s$2]();
		}
	}
	listenerCount(t$2) {
		if (t$2 === r$2) {
			let n$4 = 0;
			return this._events.forEach((e$3) => {
				n$4 += e$3.m.size;
			}), n$4;
		}
		return this._events.get(t$2)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$1 = E$1, o$1 = class {
	constructor(e$3 = {}) {
		let { phases: t$2 = [], dedupe: r$3, getId: s$2 } = e$3;
		this._phases = t$2, this._emitter = new v({
			getId: s$2,
			dedupe: r$3
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
	on(e$3, t$2, r$3) {
		return this._emitter.on(e$3, t$2, r$3);
	}
	once(e$3, t$2, r$3) {
		return this._emitter.once(e$3, t$2, r$3);
	}
	off(e$3, t$2) {
		return this._emitter.off(e$3, t$2);
	}
	count(e$3) {
		return this._emitter.listenerCount(e$3);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$3 = this._queue, t$2 = this._phases, r$3 = this._getListeners, s$2 = 0, a$2 = t$2.length, n$4;
		for (; s$2 < a$2; s$2++) n$4 = r$3(t$2[s$2]), n$4 && e$3.push(n$4);
		return e$3;
	}
	_processQueue(...e$3) {
		let t$2 = this._queue, r$3 = t$2.length;
		if (!r$3) return;
		let s$2 = 0, a$2 = 0, n$4, c$2;
		for (; s$2 < r$3; s$2++) for (n$4 = t$2[s$2], a$2 = 0, c$2 = n$4.length; a$2 < c$2; a$2++) n$4[a$2](...e$3);
		t$2.length = 0;
	}
};
function u$2(i$3 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$3) => {
		let t$2 = requestAnimationFrame(e$3);
		return () => cancelAnimationFrame(t$2);
	};
	{
		let e$3 = 1e3 / i$3, t$2 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$3) => {
			let s$2 = setTimeout(() => r$3(t$2()), e$3);
			return () => clearTimeout(s$2);
		};
	}
}
var l$2 = class extends o$1 {
	constructor(e$3 = {}) {
		let { paused: t$2 = !1, onDemand: r$3 = !1, requestFrame: s$2 = u$2(),...a$2 } = e$3;
		super(a$2), this._paused = t$2, this._onDemand = r$3, this._requestFrame = s$2, this._cancelFrame = null, this._empty = !0, !t$2 && !r$3 && this._request();
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
	on(e$3, t$2, r$3) {
		let s$2 = super.on(e$3, t$2, r$3);
		return this._empty = !1, this._request(), s$2;
	}
	once(e$3, t$2, r$3) {
		let s$2 = super.once(e$3, t$2, r$3);
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
//#region ../dragdoll/dist/ticker-CAFcKU20.js
const n$1 = {
	read: Symbol(),
	write: Symbol()
};
let r$1 = new l$2({
	phases: [n$1.read, n$1.write],
	requestFrame: typeof window < `u` ? u$2() : () => () => {}
});

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
		return window.navigator.userAgentData.brands.some((({ brand: n$4 }) => "Chromium" === n$4));
	} catch (n$4) {
		return !1;
	}
})();

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$4) {
	return n$4 instanceof Window;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$3, t$2) {
	if (t$2) return window.getComputedStyle(e$3, t$2);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$3)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$3, null), STYLE_DECLARATION_CACHE.set(e$3, new WeakRef(C$1))), C$1;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$3) {
	return e$3 instanceof HTMLHtmlElement;
}

//#endregion
//#region ../dragdoll/dist/get-style-ZZHAkgcg.js
const e$2 = /* @__PURE__ */ new WeakMap();
function t$1(t$2) {
	let n$4 = e$2.get(t$2)?.deref();
	return n$4 || (n$4 = window.getComputedStyle(t$2, null), e$2.set(t$2, new WeakRef(n$4))), n$4;
}

//#endregion
//#region ../dragdoll/dist/constants-gNukEJzy.js
const e$1 = typeof window < `u` && window.document !== void 0, t = e$1 && `ontouchstart` in window, n$3 = e$1 && !!window.PointerEvent;
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
function isBlockElement(e$3) {
	switch (getStyle(e$3).display) {
		case "none": return null;
		case "inline":
		case "contents": return !1;
		default: return !0;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForFixedElement.js
function isContainingBlockForFixedElement(n$4) {
	const t$2 = getStyle(n$4);
	if (!IS_SAFARI) {
		const { filter: n$5 } = t$2;
		if (n$5 && "none" !== n$5) return !0;
		const { backdropFilter: e$4 } = t$2;
		if (e$4 && "none" !== e$4) return !0;
		const { willChange: i$4 } = t$2;
		if (i$4 && (i$4.indexOf("filter") > -1 || i$4.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$3 = isBlockElement(n$4);
	if (!e$3) return e$3;
	const { transform: i$3 } = t$2;
	if (i$3 && "none" !== i$3) return !0;
	const { perspective: r$3 } = t$2;
	if (r$3 && "none" !== r$3) return !0;
	const { contentVisibility: o$2 } = t$2;
	if (o$2 && "auto" === o$2) return !0;
	const { contain: f$1 } = t$2;
	if (f$1 && ("strict" === f$1 || "content" === f$1 || f$1.indexOf("paint") > -1 || f$1.indexOf("layout") > -1)) return !0;
	const { willChange: c$2 } = t$2;
	return !(!c$2 || !(c$2.indexOf("transform") > -1 || c$2.indexOf("perspective") > -1 || c$2.indexOf("contain") > -1)) || !!(IS_SAFARI && c$2 && c$2.indexOf("filter") > -1);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$2) {
	return "static" !== getStyle(t$2).position || isContainingBlockForFixedElement(t$2);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$3, t$2 = {}) {
	if (isDocumentElement(e$3)) return e$3.ownerDocument.defaultView;
	const n$4 = t$2.position || getStyle(e$3).position, { skipDisplayNone: i$3, container: o$2 } = t$2;
	switch (n$4) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$3 = o$2 || e$3.parentElement;
			for (; t$3;) {
				const e$4 = isBlockElement(t$3);
				if (e$4) return t$3;
				if (null === e$4 && !i$3) return null;
				t$3 = t$3.parentElement;
			}
			return e$3.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$3 = "fixed" === n$4;
			let l$3 = o$2 || e$3.parentElement;
			for (; l$3;) {
				const e$4 = t$3 ? isContainingBlockForFixedElement(l$3) : isContainingBlockForAbsoluteElement(l$3);
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
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$4, t$2 = {}) {
	const { display: o$2 } = getStyle(n$4);
	if ("none" === o$2 || "contents" === o$2) return null;
	const e$3 = t$2.position || getStyle(n$4).position, { skipDisplayNone: s$2, container: r$3 } = t$2;
	switch (e$3) {
		case "relative": return n$4;
		case "fixed": return getContainingBlock(n$4, {
			container: r$3,
			position: e$3,
			skipDisplayNone: s$2
		});
		case "absolute": {
			const t$3 = getContainingBlock(n$4, {
				container: r$3,
				position: e$3,
				skipDisplayNone: s$2
			});
			return isWindow(t$3) ? n$4.ownerDocument : t$3;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-C1QBodX1.js
function s$1(e$3, t$2) {
	return e$3.isIdentity && t$2.isIdentity ? !0 : e$3.is2D && t$2.is2D ? e$3.a === t$2.a && e$3.b === t$2.b && e$3.c === t$2.c && e$3.d === t$2.d && e$3.e === t$2.e && e$3.f === t$2.f : e$3.m11 === t$2.m11 && e$3.m12 === t$2.m12 && e$3.m13 === t$2.m13 && e$3.m14 === t$2.m14 && e$3.m21 === t$2.m21 && e$3.m22 === t$2.m22 && e$3.m23 === t$2.m23 && e$3.m24 === t$2.m24 && e$3.m31 === t$2.m31 && e$3.m32 === t$2.m32 && e$3.m33 === t$2.m33 && e$3.m34 === t$2.m34 && e$3.m41 === t$2.m41 && e$3.m42 === t$2.m42 && e$3.m43 === t$2.m43 && e$3.m44 === t$2.m44;
}
function c$1(e$3) {
	return e$3.m11 !== 1 || e$3.m12 !== 0 || e$3.m13 !== 0 || e$3.m14 !== 0 || e$3.m21 !== 0 || e$3.m22 !== 1 || e$3.m23 !== 0 || e$3.m24 !== 0 || e$3.m31 !== 0 || e$3.m32 !== 0 || e$3.m33 !== 1 || e$3.m34 !== 0 || e$3.m43 !== 0 || e$3.m44 !== 1;
}
function l$1(e$3, t$2, n$4 = null) {
	if (`moveBefore` in e$3 && e$3.isConnected === t$2.isConnected) try {
		e$3.moveBefore(t$2, n$4);
		return;
	} catch {}
	let r$3 = document.activeElement, i$3 = t$2.contains(r$3);
	e$3.insertBefore(t$2, n$4), i$3 && document.activeElement !== r$3 && r$3 instanceof HTMLElement && r$3.focus({ preventScroll: !0 });
}
function u$1(e$3) {
	return e$3.setMatrixValue(`scale(1, 1)`);
}
function d(e$3, t$2 = 0) {
	let n$4 = 10 ** t$2;
	return Math.round((e$3 + 2 ** -52) * n$4) / n$4;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$3, t$2) {
		this._cache.set(e$3, t$2), this._validation.set(e$3, void 0);
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
}, p = class {
	constructor(e$3, t$2) {
		this.sensor = e$3, this.startEvent = t$2, this.prevMoveEvent = t$2, this.moveEvent = t$2, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$3, t$2, n$4 = !1) {
	let { style: r$3 } = e$3;
	for (let e$4 in t$2) r$3.setProperty(e$4, t$2[e$4], n$4 ? `important` : ``);
}
function h() {
	let e$3 = document.createElement(`div`);
	return e$3.classList.add(`dragdoll-measure`), m(e$3, {
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
function g(e$3, t$2 = {
	x: 0,
	y: 0
}) {
	if (t$2.x = 0, t$2.y = 0, e$3 instanceof Window) return t$2;
	if (e$3 instanceof Document) return t$2.x = window.scrollX * -1, t$2.y = window.scrollY * -1, t$2;
	let { x: r$3, y: i$3 } = e$3.getBoundingClientRect(), a$2 = t$1(e$3);
	return t$2.x = r$3 + (parseFloat(a$2.borderLeftWidth) || 0), t$2.y = i$3 + (parseFloat(a$2.borderTopWidth) || 0), t$2;
}
function _(e$3) {
	let t$2 = t$1(e$3), r$3 = parseFloat(t$2.height) || 0;
	return t$2.boxSizing === `border-box` ? r$3 : (r$3 += parseFloat(t$2.borderTopWidth) || 0, r$3 += parseFloat(t$2.borderBottomWidth) || 0, r$3 += parseFloat(t$2.paddingTop) || 0, r$3 += parseFloat(t$2.paddingBottom) || 0, e$3 instanceof HTMLElement && (r$3 += e$3.offsetHeight - e$3.clientHeight), r$3);
}
function v$1(e$3) {
	let t$2 = t$1(e$3), r$3 = parseFloat(t$2.width) || 0;
	return t$2.boxSizing === `border-box` ? r$3 : (r$3 += parseFloat(t$2.borderLeftWidth) || 0, r$3 += parseFloat(t$2.borderRightWidth) || 0, r$3 += parseFloat(t$2.paddingLeft) || 0, r$3 += parseFloat(t$2.paddingRight) || 0, e$3 instanceof HTMLElement && (r$3 += e$3.offsetWidth - e$3.clientWidth), r$3);
}
function y(e$3, t$2 = !1) {
	let { translate: r$3, rotate: i$3, scale: a$2, transform: o$2 } = t$1(e$3), s$2 = ``;
	if (r$3 && r$3 !== `none`) {
		let [t$3 = `0px`, n$4 = `0px`, i$4] = r$3.split(` `);
		t$3.includes(`%`) && (t$3 = `${parseFloat(t$3) / 100 * v$1(e$3)}px`), n$4.includes(`%`) && (n$4 = `${parseFloat(n$4) / 100 * _(e$3)}px`), i$4 ? s$2 += `translate3d(${t$3},${n$4},${i$4})` : s$2 += `translate(${t$3},${n$4})`;
	}
	if (i$3 && i$3 !== `none`) {
		let e$4 = i$3.split(` `);
		e$4.length > 1 ? s$2 += `rotate3d(${e$4.join(`,`)})` : s$2 += `rotate(${e$4.join(`,`)})`;
	}
	if (a$2 && a$2 !== `none`) {
		let e$4 = a$2.split(` `);
		e$4.length === 3 ? s$2 += `scale3d(${e$4.join(`,`)})` : s$2 += `scale(${e$4.join(`,`)})`;
	}
	return !t$2 && o$2 && o$2 !== `none` && (s$2 += o$2), s$2;
}
function b(e$3) {
	return typeof e$3 == `object` && !!e$3 && `x` in e$3 && `y` in e$3;
}
const x = {
	x: 0,
	y: 0
}, S = {
	x: 0,
	y: 0
};
function C(e$3, t$2, n$4 = {
	x: 0,
	y: 0
}) {
	let r$3 = b(e$3) ? e$3 : g(e$3, x), i$3 = b(t$2) ? t$2 : g(t$2, S);
	return n$4.x = i$3.x - r$3.x, n$4.y = i$3.y - r$3.y, n$4;
}
function w(e$3) {
	let t$2 = e$3.split(` `), n$4 = ``, r$3 = ``, i$3 = ``;
	return t$2.length === 1 ? n$4 = r$3 = t$2[0] : t$2.length === 2 ? [n$4, r$3] = t$2 : [n$4, r$3, i$3] = t$2, {
		x: parseFloat(n$4) || 0,
		y: parseFloat(r$3) || 0,
		z: parseFloat(i$3) || 0
	};
}
const T = e$1 ? new DOMMatrix() : null;
function E(e$3, t$2 = new DOMMatrix()) {
	let r$3 = e$3;
	for (u$1(t$2); r$3;) {
		let e$4 = y(r$3);
		if (e$4 && (T.setMatrixValue(e$4), !T.isIdentity)) {
			let { transformOrigin: e$5 } = t$1(r$3), { x: i$3, y: a$2, z: o$2 } = w(e$5);
			o$2 === 0 ? T.setMatrixValue(`translate(${i$3}px,${a$2}px) ${T} translate(${i$3 * -1}px,${a$2 * -1}px)`) : T.setMatrixValue(`translate3d(${i$3}px,${a$2}px,${o$2}px) ${T} translate3d(${i$3 * -1}px,${a$2 * -1}px,${o$2 * -1}px)`), t$2.preMultiplySelf(T);
		}
		r$3 = r$3.parentElement;
	}
	return t$2;
}
const D = e$1 ? h() : null;
var O = class {
	constructor(e$3, t$2) {
		if (!e$3.isConnected) throw Error(`Element is not connected`);
		let { drag: r$3 } = t$2;
		if (!r$3) throw Error(`Drag is not defined`);
		let i$3 = t$1(e$3), a$2 = e$3.getBoundingClientRect(), s$2 = y(e$3, !0);
		this.data = {}, this.element = e$3, this.elementTransformOrigin = w(i$3.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$2 + i$3.transform), this.elementOffsetMatrix = new DOMMatrix(s$2).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = r$3._matrixCache, this._clientOffsetCache = r$3._clientOffsetCache;
		let c$2 = e$3.parentElement;
		if (!c$2) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$2;
		let l$3 = t$2.settings.container || c$2;
		if (this.dragContainer = l$3, c$2 !== l$3) {
			let { position: e$4 } = i$3;
			if (e$4 !== `fixed` && e$4 !== `absolute`) throw Error(`Dragged element has "${e$4}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$3 = getOffsetContainer(e$3) || e$3;
		this.elementOffsetContainer = u$3, this.dragOffsetContainer = l$3 === c$2 ? u$3 : getOffsetContainer(e$3, { container: l$3 });
		{
			let { width: e$4, height: t$3, x: n$4, y: r$4 } = a$2;
			this.clientRect = {
				width: e$4,
				height: t$3,
				x: n$4,
				y: r$4
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$2.settings.frozenStyles({
			draggable: t$2,
			drag: r$3,
			item: this,
			style: i$3
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$4 = {};
			for (let t$3 of d$1) e$4[t$3] = i$3[t$3];
			this.frozenStyles = e$4;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$3 = {};
			for (let n$4 in this.frozenStyles) t$3[n$4] = e$3.style[n$4];
			this.unfrozenStyles = t$3;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$3) => {
			if (!this._matrixCache.isValid(e$3)) {
				let t$2 = this._matrixCache.get(e$3) || [new DOMMatrix(), new DOMMatrix()], [n$4, r$3] = t$2;
				E(e$3, n$4), r$3.setMatrixValue(n$4.toString()).invertSelf(), this._matrixCache.set(e$3, t$2);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$3, elementContainer: t$2, dragOffsetContainer: n$4, dragContainer: r$3, containerOffset: i$3, _clientOffsetCache: a$2, _matrixCache: o$2 } = this;
		if (e$3 !== n$4) {
			let [s$2, l$3] = [[r$3, n$4], [t$2, e$3]].map(([e$4, t$3]) => {
				let n$5 = a$2.get(t$3) || {
					x: 0,
					y: 0
				};
				if (!a$2.isValid(t$3)) {
					let r$4 = o$2.get(e$4);
					t$3 instanceof HTMLElement && r$4 && !r$4[0].isIdentity ? c$1(r$4[0]) ? (D.style.setProperty(`transform`, r$4[1].toString(), `important`), t$3.append(D), g(D, n$5), D.remove()) : (g(t$3, n$5), n$5.x -= r$4[0].m41, n$5.y -= r$4[0].m42) : g(t$3, n$5);
				}
				return a$2.set(t$3, n$5), n$5;
			});
			C(s$2, l$3, i$3);
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
			let { width: e$4, height: t$2 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$4, this.clientRect.height = t$2;
		}
	}
};
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
	applyPosition: ({ item: e$3, phase: t$2 }) => {
		let n$4 = t$2 === L.End || t$2 === L.EndAlign, [r$3, i$3] = e$3.getContainerMatrix(), [a$2, o$2] = e$3.getDragContainerMatrix(), { position: s$2, alignmentOffset: c$2, containerOffset: l$3, elementTransformMatrix: d$1, elementTransformOrigin: f$1, elementOffsetMatrix: p$1 } = e$3, { x: m$1, y: h$1, z: g$1 } = f$1, _$2 = !d$1.isIdentity && (m$1 !== 0 || h$1 !== 0 || g$1 !== 0), v$2 = s$2.x + c$2.x + l$3.x, y$1 = s$2.y + c$2.y + l$3.y;
		u$1(j), _$2 && (g$1 === 0 ? j.translateSelf(-m$1, -h$1) : j.translateSelf(-m$1, -h$1, -g$1)), n$4 ? i$3.isIdentity || j.multiplySelf(i$3) : o$2.isIdentity || j.multiplySelf(o$2), u$1(M).translateSelf(v$2, y$1), j.multiplySelf(M), r$3.isIdentity || j.multiplySelf(r$3), _$2 && (u$1(M).translateSelf(m$1, h$1, g$1), j.multiplySelf(M)), d$1.isIdentity || j.multiplySelf(d$1), p$1.isIdentity || j.preMultiplySelf(p$1), e$3.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$3 }) => e$3.items[0].clientRect || null,
	positionModifiers: [],
	sensorProcessingMode: I.Sampled,
	dndGroups: /* @__PURE__ */ new Set()
};
var B = class {
	constructor(e$3, t$2 = {}) {
		let { id: n$4 = Symbol(),...r$3 } = t$2;
		this.id = n$4, this.sensors = e$3, this.settings = this._parseSettings(r$3), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((e$4) => {
			this._sensorData.set(e$4, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (t$4) => this._onMove(t$4, e$4),
				onEnd: (t$4) => this._onEnd(t$4, e$4)
			});
			let { onMove: t$3, onEnd: n$5 } = this._sensorData.get(e$4);
			e$4.on(e.Start, t$3, t$3), e$4.on(e.Move, t$3, t$3), e$4.on(e.Cancel, n$5, n$5), e$4.on(e.End, n$5, n$5), e$4.on(e.Destroy, n$5, n$5);
		});
	}
	_parseSettings(e$3, t$2 = z) {
		let { container: n$4 = t$2.container, startPredicate: r$3 = t$2.startPredicate, elements: i$3 = t$2.elements, frozenStyles: a$2 = t$2.frozenStyles, positionModifiers: o$2 = t$2.positionModifiers, applyPosition: s$2 = t$2.applyPosition, computeClientRect: c$2 = t$2.computeClientRect, sensorProcessingMode: l$3 = t$2.sensorProcessingMode, dndGroups: u$3 = t$2.dndGroups, onPrepareStart: d$1 = t$2.onPrepareStart, onStart: f$1 = t$2.onStart, onPrepareMove: p$1 = t$2.onPrepareMove, onMove: m$1 = t$2.onMove, onEnd: h$1 = t$2.onEnd, onDestroy: g$1 = t$2.onDestroy } = e$3 || {};
		return {
			container: n$4,
			startPredicate: r$3,
			elements: i$3,
			frozenStyles: a$2,
			positionModifiers: o$2,
			applyPosition: s$2,
			computeClientRect: c$2,
			sensorProcessingMode: l$3,
			dndGroups: u$3,
			onPrepareStart: d$1,
			onStart: f$1,
			onPrepareMove: p$1,
			onMove: m$1,
			onEnd: h$1,
			onDestroy: g$1
		};
	}
	_emit(e$3, ...t$2) {
		this._emitter.emit(e$3, ...t$2);
	}
	_onMove(n$4, r$3) {
		let i$3 = this._sensorData.get(r$3);
		if (i$3) switch (i$3.predicateState) {
			case P.Pending: {
				i$3.predicateEvent = n$4;
				let e$3 = this.settings.startPredicate({
					draggable: this,
					sensor: r$3,
					event: n$4
				});
				e$3 === !0 ? this.resolveStartPredicate(r$3) : e$3 === !1 && this.rejectStartPredicate(r$3);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = n$4, this.settings.sensorProcessingMode === I.Immediate ? (this._prepareMove(), this._applyMove()) : (r$1.once(n$1.read, this._prepareMove, this._moveId), r$1.once(n$1.write, this._applyMove, this._moveId)));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$3, t$2) {
		let n$4 = this._sensorData.get(t$2);
		n$4 && (this.drag ? n$4.predicateState === P.Resolved && (this.drag.endEvent = e$3, this._sensorData.forEach((e$4) => {
			e$4.predicateState = P.Pending, e$4.predicateEvent = null;
		}), this.stop()) : (n$4.predicateState = P.Pending, n$4.predicateEvent = null));
	}
	_prepareStart() {
		let e$3 = this.drag;
		e$3 && (this._startPhase = N.Prepare, e$3.items = (this.settings.elements({
			draggable: this,
			drag: e$3
		}) || []).map((e$4) => new O(e$4, this)), this._applyModifiers(F.Start, 0, 0), this._emit(R.PrepareStart, e$3.startEvent), this.settings.onPrepareStart?.(e$3, this), this._startPhase = N.FinishPrepare);
	}
	_applyStart() {
		let e$3 = this.drag;
		if (e$3) {
			this._startPhase = N.Apply;
			for (let t$2 of e$3.items) t$2.dragContainer !== t$2.elementContainer && l$1(t$2.dragContainer, t$2.element), t$2.frozenStyles && Object.assign(t$2.element.style, t$2.frozenStyles), this.settings.applyPosition({
				phase: L.Start,
				draggable: this,
				drag: e$3,
				item: t$2
			});
			for (let t$2 of e$3.items) {
				let e$4 = t$2.getContainerMatrix()[0], n$4 = t$2.getDragContainerMatrix()[0];
				if (s$1(e$4, n$4) || !c$1(e$4) && !c$1(n$4)) continue;
				let r$3 = t$2.element.getBoundingClientRect(), { alignmentOffset: i$3 } = t$2;
				i$3.x += d(t$2.clientRect.x - r$3.x, 3), i$3.y += d(t$2.clientRect.y - r$3.y, 3);
			}
			for (let t$2 of e$3.items) {
				let { alignmentOffset: n$4 } = t$2;
				(n$4.x !== 0 || n$4.y !== 0) && this.settings.applyPosition({
					phase: L.StartAlign,
					draggable: this,
					drag: e$3,
					item: t$2
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(R.Start, e$3.startEvent), this.settings.onStart?.(e$3, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$3 = this.drag;
		if (!e$3) return;
		let { moveEvent: t$2, prevMoveEvent: n$4 } = e$3;
		t$2 !== n$4 && (this._applyModifiers(F.Move, t$2.x - n$4.x, t$2.y - n$4.y), this._emit(R.PrepareMove, t$2), !e$3.isEnded && (this.settings.onPrepareMove?.(e$3, this), !e$3.isEnded && (e$3.prevMoveEvent = t$2)));
	}
	_applyMove() {
		let e$3 = this.drag;
		if (e$3) {
			for (let t$2 of e$3.items) t$2._moveDiff.x = 0, t$2._moveDiff.y = 0, this.settings.applyPosition({
				phase: L.Move,
				draggable: this,
				drag: e$3,
				item: t$2
			});
			this._emit(R.Move, e$3.moveEvent), !e$3.isEnded && this.settings.onMove?.(e$3, this);
		}
	}
	_prepareAlign() {
		let { drag: e$3 } = this;
		if (e$3) for (let t$2 of e$3.items) {
			let { x: e$4, y: n$4 } = t$2.element.getBoundingClientRect(), r$3 = t$2.clientRect.x - t$2._moveDiff.x - e$4;
			t$2.alignmentOffset.x = t$2.alignmentOffset.x - t$2._alignDiff.x + r$3, t$2._alignDiff.x = r$3;
			let i$3 = t$2.clientRect.y - t$2._moveDiff.y - n$4;
			t$2.alignmentOffset.y = t$2.alignmentOffset.y - t$2._alignDiff.y + i$3, t$2._alignDiff.y = i$3;
		}
	}
	_applyAlign() {
		let { drag: e$3 } = this;
		if (e$3) for (let t$2 of e$3.items) t$2._alignDiff.x = 0, t$2._alignDiff.y = 0, this.settings.applyPosition({
			phase: L.Align,
			draggable: this,
			drag: e$3,
			item: t$2
		});
	}
	_applyModifiers(e$3, t$2, n$4) {
		let { drag: r$3 } = this;
		if (!r$3) return;
		let { positionModifiers: i$3 } = this.settings;
		for (let a$2 of r$3.items) {
			let o$2 = A;
			o$2.x = t$2, o$2.y = n$4;
			for (let t$3 of i$3) o$2 = t$3(o$2, {
				draggable: this,
				drag: r$3,
				item: a$2,
				phase: e$3
			});
			a$2.position.x += o$2.x, a$2.position.y += o$2.y, a$2.clientRect.x += o$2.x, a$2.clientRect.y += o$2.y, e$3 === `move` && (a$2._moveDiff.x += o$2.x, a$2._moveDiff.y += o$2.y);
		}
	}
	on(e$3, t$2, n$4) {
		return this._emitter.on(e$3, t$2, n$4);
	}
	off(e$3, t$2) {
		this._emitter.off(e$3, t$2);
	}
	resolveStartPredicate(n$4, r$3) {
		let i$3 = this._sensorData.get(n$4);
		if (!i$3) return;
		let a$2 = r$3 || i$3.predicateEvent;
		i$3.predicateState === P.Pending && a$2 && (this._startPhase = N.Init, i$3.predicateState = P.Resolved, i$3.predicateEvent = null, this.drag = new p(n$4, a$2), this._sensorData.forEach((e$3, t$2) => {
			t$2 !== n$4 && (e$3.predicateState = P.Rejected, e$3.predicateEvent = null);
		}), this.settings.sensorProcessingMode === I.Immediate ? (this._prepareStart(), this._applyStart()) : (r$1.once(n$1.read, this._prepareStart, this._startId), r$1.once(n$1.write, this._applyStart, this._startId)));
	}
	rejectStartPredicate(e$3) {
		let t$2 = this._sensorData.get(e$3);
		t$2?.predicateState === P.Pending && (t$2.predicateState = P.Rejected, t$2.predicateEvent = null);
	}
	stop() {
		let n$4 = this.drag;
		if (!(!n$4 || n$4.isEnded)) {
			if (this._startPhase === N.Prepare || this._startPhase === N.Apply) throw Error(`Cannot stop drag start process at this point`);
			n$4.isEnded = !0, this._startPhase === N.Init && this._prepareStart(), this._startPhase === N.FinishPrepare && this._applyStart(), this._startPhase = N.None, r$1.off(n$1.read, this._startId), r$1.off(n$1.write, this._startId), r$1.off(n$1.read, this._moveId), r$1.off(n$1.write, this._moveId), r$1.off(n$1.read, this._alignId), r$1.off(n$1.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), this._applyModifiers(F.End, 0, 0);
			for (let e$3 of n$4.items) {
				if (e$3.elementContainer !== e$3.dragContainer && (l$1(e$3.elementContainer, e$3.element), e$3.alignmentOffset.x = 0, e$3.alignmentOffset.y = 0, e$3.containerOffset.x = 0, e$3.containerOffset.y = 0), e$3.unfrozenStyles) for (let t$2 in e$3.unfrozenStyles) e$3.element.style[t$2] = e$3.unfrozenStyles[t$2] || ``;
				this.settings.applyPosition({
					phase: L.End,
					draggable: this,
					drag: n$4,
					item: e$3
				});
			}
			for (let e$3 of n$4.items) if (e$3.elementContainer !== e$3.dragContainer) {
				let t$2 = e$3.element.getBoundingClientRect();
				e$3.alignmentOffset.x = d(e$3.clientRect.x - t$2.x, 3), e$3.alignmentOffset.y = d(e$3.clientRect.y - t$2.y, 3);
			}
			for (let e$3 of n$4.items) e$3.elementContainer !== e$3.dragContainer && (e$3.alignmentOffset.x !== 0 || e$3.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: L.EndAlign,
				draggable: this,
				drag: n$4,
				item: e$3
			});
			this._emit(R.End, n$4.endEvent), this.settings.onEnd?.(n$4, this), this.drag = null;
		}
	}
	align(n$4 = !1) {
		this.drag && (n$4 || this.settings.sensorProcessingMode === I.Immediate ? (this._prepareAlign(), this._applyAlign()) : (r$1.once(n$1.read, this._prepareAlign, this._alignId), r$1.once(n$1.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$3, settings: t$2 } = this;
		return e$3 && t$2.computeClientRect?.({
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
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: e$3, onEnd: t$2 }, n$4) => {
			n$4.off(e.Start, e$3), n$4.off(e.Move, e$3), n$4.off(e.Cancel, t$2), n$4.off(e.End, t$2), n$4.off(e.Destroy, t$2);
		}), this._sensorData.clear(), this._emit(R.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-CyG2cFYy.js
function i$2(e$3, t$2) {
	if (`pointerId` in e$3) return e$3.pointerId === t$2 ? e$3 : null;
	if (`changedTouches` in e$3) {
		let n$4 = 0;
		for (; n$4 < e$3.changedTouches.length; n$4++) if (e$3.changedTouches[n$4].identifier === t$2) return e$3.changedTouches[n$4];
		return null;
	}
	return e$3;
}
function a$1(e$3) {
	return `pointerId` in e$3 ? e$3.pointerId : `changedTouches` in e$3 ? e$3.changedTouches[0] ? e$3.changedTouches[0].identifier : null : -1;
}
function o(e$3) {
	return `pointerType` in e$3 ? e$3.pointerType : `touches` in e$3 ? `touch` : `mouse`;
}
function s(e$3 = {}) {
	let { capture: t$2 = !0, passive: n$4 = !0 } = e$3;
	return {
		capture: t$2,
		passive: n$4
	};
}
function c(n$4) {
	return n$4 === `auto` || n$4 === void 0 ? n$3 ? `pointer` : t ? `touch` : `mouse` : n$4;
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
	constructor(e$3, t$2 = {}) {
		let { listenerOptions: n$4 = {}, sourceEvents: i$3 = `auto`, startPredicate: a$2 = (e$4) => !(`button` in e$4 && e$4.button > 0) } = t$2;
		this.element = e$3, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$2, this._listenerOptions = s(n$4), this._sourceEvents = c(i$3), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$3.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$3) {
		return this.drag ? i$2(e$3, this.drag.pointerId) : null;
	}
	_onStart(e$3) {
		if (this.isDestroyed || this.drag || !this._startPredicate(e$3)) return;
		let t$2 = a$1(e$3);
		if (t$2 === null) return;
		let r$3 = i$2(e$3, t$2);
		if (r$3 === null) return;
		let s$2 = {
			pointerId: t$2,
			pointerType: o(e$3),
			x: r$3.clientX,
			y: r$3.clientY
		};
		this.drag = s$2;
		let c$2 = {
			...s$2,
			type: e.Start,
			srcEvent: e$3,
			target: r$3.target
		};
		this._emitter.emit(c$2.type, c$2), this.drag && this._bindWindowListeners();
	}
	_onMove(e$3) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$3);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$3 = {
			type: e.Move,
			srcEvent: e$3,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3);
	}
	_onCancel(e$3) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$3);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$3 = {
			type: e.Cancel,
			srcEvent: e$3,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_onEnd(e$3) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$3);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$3 = {
			type: e.End,
			srcEvent: e$3,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$3, end: t$2, cancel: n$4 } = l[this._sourceEvents];
		window.addEventListener(e$3, this._onMove, this._listenerOptions), window.addEventListener(t$2, this._onEnd, this._listenerOptions), n$4 && window.addEventListener(n$4, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$3, end: t$2, cancel: n$4 } = l[this._sourceEvents];
			window.removeEventListener(e$3, this._onMove, this._listenerOptions), window.removeEventListener(t$2, this._onEnd, this._listenerOptions), n$4 && window.removeEventListener(n$4, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
		}
	}
	_resetDrag() {
		this.drag = null, this._unbindWindowListeners();
	}
	cancel() {
		if (!this.drag) return;
		let e$3 = {
			type: e.Cancel,
			srcEvent: null,
			target: null,
			...this.drag
		};
		this._emitter.emit(e$3.type, e$3), this._resetDrag();
	}
	updateSettings(e$3) {
		if (this.isDestroyed) return;
		let { listenerOptions: t$2, sourceEvents: n$4, startPredicate: r$3 } = e$3, i$3 = c(n$4), a$2 = s(t$2);
		r$3 && this._startPredicate !== r$3 && (this._startPredicate = r$3), (t$2 && (this._listenerOptions.capture !== a$2.capture || this._listenerOptions.passive === a$2.passive) || n$4 && this._sourceEvents !== i$3) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$4 && (this._sourceEvents = i$3), t$2 && a$2 && (this._listenerOptions = a$2), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$3, t$2, n$4) {
		return this._emitter.on(e$3, t$2, n$4);
	}
	off(e$3, t$2) {
		this._emitter.off(e$3, t$2);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/base-sensor-6CQrwFkA.js
var n$2 = class {
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
	_start(t$2) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$2), this._emitter.emit(e.Start, t$2));
	}
	_move(t$2) {
		this.drag && (this._updateDragData(t$2), this._emitter.emit(e.Move, t$2));
	}
	_end(t$2) {
		this.drag && (this._updateDragData(t$2), this._emitter.emit(e.End, t$2), this._resetDragData());
	}
	_cancel(t$2) {
		this.drag && (this._updateDragData(t$2), this._emitter.emit(e.Cancel, t$2), this._resetDragData());
	}
	on(e$3, t$2, n$4) {
		return this._emitter.on(e$3, t$2, n$4);
	}
	off(e$3, t$2) {
		this._emitter.off(e$3, t$2);
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
var i = class extends n$2 {
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
	_start(n$4) {
		this.isDestroyed || this.drag || (super._start(n$4), r$1.on(n$1.read, this._tick, this._tick));
	}
	_end(n$4) {
		this.drag && (r$1.off(n$1.read, this._tick), super._end(n$4));
	}
	_cancel(n$4) {
		this.drag && (r$1.off(n$1.read, this._tick), super._cancel(n$4));
	}
	_tick(e$3) {
		if (this.drag) if (e$3 && this.drag.time) {
			this.drag.deltaTime = e$3 - this.drag.time, this.drag.time = e$3;
			let t$2 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, t$2), !this.drag) return;
			let r$3 = this._speed * (this.drag.deltaTime / 1e3), i$3 = this._direction.x * r$3, a$2 = this._direction.y * r$3;
			(i$3 || a$2) && this._move({
				type: e.Move,
				x: this.drag.x + i$3,
				y: this.drag.y + a$2
			});
		} else this.drag.time = e$3, this.drag.deltaTime = 0;
	}
};

//#endregion
//#region ../dragdoll/dist/keyboard-motion-sensor-Cgfa6qtI.js
const n = [
	`start`,
	`cancel`,
	`end`,
	`moveLeft`,
	`moveRight`,
	`moveUp`,
	`moveDown`
];
function r(e$3, t$2) {
	if (!e$3.size || !t$2.size) return Infinity;
	let n$4 = Infinity;
	for (let r$3 of e$3) {
		let e$4 = t$2.get(r$3);
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
	startPredicate: (e$3, t$2) => {
		if (t$2.element && document.activeElement === t$2.element) {
			let { left: e$4, top: n$4 } = t$2.element.getBoundingClientRect();
			return {
				x: e$4,
				y: n$4
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$3, t$2 = {}) {
		super();
		let { startPredicate: n$4 = i$1.startPredicate, computeSpeed: r$3 = i$1.computeSpeed, cancelOnVisibilityChange: a$2 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$2 = i$1.cancelOnBlur, startKeys: s$2 = i$1.startKeys, moveLeftKeys: c$2 = i$1.moveLeftKeys, moveRightKeys: l$3 = i$1.moveRightKeys, moveUpKeys: u$3 = i$1.moveUpKeys, moveDownKeys: d$1 = i$1.moveDownKeys, cancelKeys: f$1 = i$1.cancelKeys, endKeys: p$1 = i$1.endKeys } = t$2;
		this.element = e$3, this._startKeys = new Set(s$2), this._cancelKeys = new Set(f$1), this._endKeys = new Set(p$1), this._moveLeftKeys = new Set(c$2), this._moveRightKeys = new Set(l$3), this._moveUpKeys = new Set(u$3), this._moveDownKeys = new Set(d$1), this._moveKeys = new Set([
			...c$2,
			...l$3,
			...u$3,
			...d$1
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$2, this._cancelOnVisibilityChange = a$2, this._computeSpeed = r$3, this._startPredicate = n$4, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$2 && e$3?.addEventListener(`blur`, this._blurCancelHandler), a$2 && document.addEventListener(`visibilitychange`, this._internalCancel);
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
		let e$3 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$2 = r(this._moveRightKeys, this._moveKeyTimestamps), n$4 = r(this._moveUpKeys, this._moveKeyTimestamps), i$3 = r(this._moveDownKeys, this._moveKeyTimestamps), a$2 = e$3 === t$2 ? 0 : e$3 < t$2 ? -1 : 1, o$2 = n$4 === i$3 ? 0 : n$4 < i$3 ? -1 : 1;
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
	_onKeyDown(t$2) {
		if (!this.drag) {
			if (this._startKeys.has(t$2.key)) {
				let n$4 = this._startPredicate(t$2, this);
				n$4 && (t$2.preventDefault(), this._start({
					type: e.Start,
					x: n$4.x,
					y: n$4.y
				}));
			}
			return;
		}
		if (this._cancelKeys.has(t$2.key)) {
			t$2.preventDefault(), this._internalCancel();
			return;
		}
		if (this._endKeys.has(t$2.key)) {
			t$2.preventDefault(), this._end({
				type: e.End,
				x: this.drag.x,
				y: this.drag.y
			});
			return;
		}
		if (this._moveKeys.has(t$2.key)) {
			t$2.preventDefault(), this._moveKeyTimestamps.get(t$2.key) || (this._moveKeyTimestamps.set(t$2.key, Date.now()), this._updateDirection());
			return;
		}
	}
	updateSettings(e$3 = {}) {
		let t$2 = !1, { cancelOnBlur: r$3, cancelOnVisibilityChange: i$3, startPredicate: a$2, computeSpeed: o$2 } = e$3;
		if (r$3 !== void 0 && this._cancelOnBlur !== r$3 && (this._cancelOnBlur = r$3, r$3 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$3 !== void 0 && this._cancelOnVisibilityChange !== i$3 && (this._cancelOnVisibilityChange = i$3, i$3 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$2 !== void 0 && (this._startPredicate = a$2), o$2 !== void 0 && (this._computeSpeed = o$2), n.forEach((n$4, r$4) => {
			let i$4 = `${n$4}Keys`, a$3 = e$3[i$4];
			a$3 !== void 0 && (this[`_${i$4}`] = new Set(a$3), r$4 >= 3 && (t$2 = !0));
		}), t$2) {
			let e$4 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$3, n$4) => e$4[n$4] === t$3) || (this._moveKeys = new Set(e$4), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/009-draggable-ghost-element/index.ts
const element = document.querySelector(".draggable");
new B([new u(element), new a(element)], {
	elements: () => {
		const elemRect = element.getBoundingClientRect();
		const clone = element.cloneNode(true);
		clone.style.position = "fixed";
		clone.style.width = `${elemRect.width}px`;
		clone.style.height = `${elemRect.height}px`;
		clone.style.left = `${elemRect.left}px`;
		clone.style.top = `${elemRect.top}px`;
		clone.classList.add("ghost", "dragging");
		clone.style.transform = "";
		document.body.appendChild(clone);
		return [clone];
	},
	onStart: () => {
		element.classList.add("dragging");
	},
	onEnd: (drag) => {
		const dragItem = drag.items[0];
		const matrix = new DOMMatrix().setMatrixValue(`translate(${dragItem.position.x}px, ${dragItem.position.y}px) ${element.style.transform}`);
		element.style.transform = `${matrix}`;
		dragItem.element.remove();
		element.classList.remove("dragging");
	}
});

//#endregion
});