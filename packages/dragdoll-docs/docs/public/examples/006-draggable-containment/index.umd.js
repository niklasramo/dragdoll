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
}, r$3, v = class {
	constructor(t$2 = {}) {
		this.dedupe = t$2.dedupe || E$1.ADD, this.getId = t$2.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$2) {
		let n$5 = this._events.get(t$2);
		return n$5 ? n$5.l || (n$5.l = [...n$5.m.values()]) : null;
	}
	on(t$2, n$5, e$4) {
		let i$4 = this._events, s$2 = i$4.get(t$2);
		s$2 || (s$2 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$4.set(t$2, s$2));
		let o$3 = s$2.m;
		if (e$4 = e$4 === r$3 ? this.getId(n$5) : e$4, o$3.has(e$4)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$4;
			case E$1.UPDATE:
				s$2.l = null;
				break;
			default: o$3.delete(e$4), s$2.l = null;
		}
		return o$3.set(e$4, n$5), s$2.l?.push(n$5), e$4;
	}
	once(t$2, n$5, e$4) {
		let i$4 = 0;
		return e$4 = e$4 === r$3 ? this.getId(n$5) : e$4, this.on(t$2, (...s$2) => {
			i$4 || (i$4 = 1, this.off(t$2, e$4), n$5(...s$2));
		}, e$4);
	}
	off(t$2, n$5) {
		if (t$2 === r$3) {
			this._events.clear();
			return;
		}
		if (n$5 === r$3) {
			this._events.delete(t$2);
			return;
		}
		let e$4 = this._events.get(t$2);
		e$4?.m.delete(n$5) && (e$4.l = null, e$4.m.size || this._events.delete(t$2));
	}
	emit(t$2, ...n$5) {
		let e$4 = this._getListeners(t$2);
		if (e$4) {
			let i$4 = e$4.length, s$2 = 0;
			if (n$5.length) for (; s$2 < i$4; s$2++) e$4[s$2](...n$5);
			else for (; s$2 < i$4; s$2++) e$4[s$2]();
		}
	}
	listenerCount(t$2) {
		if (t$2 === r$3) {
			let n$5 = 0;
			return this._events.forEach((e$4) => {
				n$5 += e$4.m.size;
			}), n$5;
		}
		return this._events.get(t$2)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$1 = E$1, o$2 = class {
	constructor(e$4 = {}) {
		let { phases: t$2 = [], dedupe: r$4, getId: s$2 } = e$4;
		this._phases = t$2, this._emitter = new v({
			getId: s$2,
			dedupe: r$4
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
	on(e$4, t$2, r$4) {
		return this._emitter.on(e$4, t$2, r$4);
	}
	once(e$4, t$2, r$4) {
		return this._emitter.once(e$4, t$2, r$4);
	}
	off(e$4, t$2) {
		return this._emitter.off(e$4, t$2);
	}
	count(e$4) {
		return this._emitter.listenerCount(e$4);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$4 = this._queue, t$2 = this._phases, r$4 = this._getListeners, s$2 = 0, a$3 = t$2.length, n$5;
		for (; s$2 < a$3; s$2++) n$5 = r$4(t$2[s$2]), n$5 && e$4.push(n$5);
		return e$4;
	}
	_processQueue(...e$4) {
		let t$2 = this._queue, r$4 = t$2.length;
		if (!r$4) return;
		let s$2 = 0, a$3 = 0, n$5, c$2;
		for (; s$2 < r$4; s$2++) for (n$5 = t$2[s$2], a$3 = 0, c$2 = n$5.length; a$3 < c$2; a$3++) n$5[a$3](...e$4);
		t$2.length = 0;
	}
};
function u$2(i$4 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$4) => {
		let t$2 = requestAnimationFrame(e$4);
		return () => cancelAnimationFrame(t$2);
	};
	{
		let e$4 = 1e3 / i$4, t$2 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$4) => {
			let s$2 = setTimeout(() => r$4(t$2()), e$4);
			return () => clearTimeout(s$2);
		};
	}
}
var l$2 = class extends o$2 {
	constructor(e$4 = {}) {
		let { paused: t$2 = !1, onDemand: r$4 = !1, requestFrame: s$2 = u$2(),...a$3 } = e$4;
		super(a$3), this._paused = t$2, this._onDemand = r$4, this._requestFrame = s$2, this._cancelFrame = null, this._empty = !0, !t$2 && !r$4 && this._request();
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
	on(e$4, t$2, r$4) {
		let s$2 = super.on(e$4, t$2, r$4);
		return this._empty = !1, this._request(), s$2;
	}
	once(e$4, t$2, r$4) {
		let s$2 = super.once(e$4, t$2, r$4);
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
//#region ../dragdoll/dist/create-full-rect-ABJfaR4O.js
function e$1(e$4, t$2 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0
}) {
	return e$4 && (t$2.width = e$4.width, t$2.height = e$4.height, t$2.x = e$4.x, t$2.y = e$4.y, t$2.left = e$4.x, t$2.top = e$4.y, t$2.right = e$4.x + e$4.width, t$2.bottom = e$4.y + e$4.height), t$2;
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
//#region ../../node_modules/mezr/dist/esm/utils/isWindow.js
function isWindow(n$5) {
	return n$5 instanceof Window;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$4, t$2) {
	if (t$2) return window.getComputedStyle(e$4, t$2);
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
function t$1(t$2) {
	let n$5 = e$3.get(t$2)?.deref();
	return n$5 || (n$5 = window.getComputedStyle(t$2, null), e$3.set(t$2, new WeakRef(n$5))), n$5;
}

//#endregion
//#region ../dragdoll/dist/constants-gNukEJzy.js
const e$2 = typeof window < `u` && window.document !== void 0, t = e$2 && `ontouchstart` in window, n$4 = e$2 && !!window.PointerEvent;
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
	const t$2 = getStyle(n$5);
	if (!IS_SAFARI) {
		const { filter: n$6 } = t$2;
		if (n$6 && "none" !== n$6) return !0;
		const { backdropFilter: e$5 } = t$2;
		if (e$5 && "none" !== e$5) return !0;
		const { willChange: i$5 } = t$2;
		if (i$5 && (i$5.indexOf("filter") > -1 || i$5.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$4 = isBlockElement(n$5);
	if (!e$4) return e$4;
	const { transform: i$4 } = t$2;
	if (i$4 && "none" !== i$4) return !0;
	const { perspective: r$4 } = t$2;
	if (r$4 && "none" !== r$4) return !0;
	const { contentVisibility: o$3 } = t$2;
	if (o$3 && "auto" === o$3) return !0;
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
function getContainingBlock(e$4, t$2 = {}) {
	if (isDocumentElement(e$4)) return e$4.ownerDocument.defaultView;
	const n$5 = t$2.position || getStyle(e$4).position, { skipDisplayNone: i$4, container: o$3 } = t$2;
	switch (n$5) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$3 = o$3 || e$4.parentElement;
			for (; t$3;) {
				const e$5 = isBlockElement(t$3);
				if (e$5) return t$3;
				if (null === e$5 && !i$4) return null;
				t$3 = t$3.parentElement;
			}
			return e$4.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$3 = "fixed" === n$5;
			let l$3 = o$3 || e$4.parentElement;
			for (; l$3;) {
				const e$5 = t$3 ? isContainingBlockForFixedElement(l$3) : isContainingBlockForAbsoluteElement(l$3);
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
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$5, t$2 = {}) {
	const { display: o$3 } = getStyle(n$5);
	if ("none" === o$3 || "contents" === o$3) return null;
	const e$4 = t$2.position || getStyle(n$5).position, { skipDisplayNone: s$2, container: r$4 } = t$2;
	switch (e$4) {
		case "relative": return n$5;
		case "fixed": return getContainingBlock(n$5, {
			container: r$4,
			position: e$4,
			skipDisplayNone: s$2
		});
		case "absolute": {
			const t$3 = getContainingBlock(n$5, {
				container: r$4,
				position: e$4,
				skipDisplayNone: s$2
			});
			return isWindow(t$3) ? n$5.ownerDocument : t$3;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-C1QBodX1.js
function s$1(e$4, t$2) {
	return e$4.isIdentity && t$2.isIdentity ? !0 : e$4.is2D && t$2.is2D ? e$4.a === t$2.a && e$4.b === t$2.b && e$4.c === t$2.c && e$4.d === t$2.d && e$4.e === t$2.e && e$4.f === t$2.f : e$4.m11 === t$2.m11 && e$4.m12 === t$2.m12 && e$4.m13 === t$2.m13 && e$4.m14 === t$2.m14 && e$4.m21 === t$2.m21 && e$4.m22 === t$2.m22 && e$4.m23 === t$2.m23 && e$4.m24 === t$2.m24 && e$4.m31 === t$2.m31 && e$4.m32 === t$2.m32 && e$4.m33 === t$2.m33 && e$4.m34 === t$2.m34 && e$4.m41 === t$2.m41 && e$4.m42 === t$2.m42 && e$4.m43 === t$2.m43 && e$4.m44 === t$2.m44;
}
function c$1(e$4) {
	return e$4.m11 !== 1 || e$4.m12 !== 0 || e$4.m13 !== 0 || e$4.m14 !== 0 || e$4.m21 !== 0 || e$4.m22 !== 1 || e$4.m23 !== 0 || e$4.m24 !== 0 || e$4.m31 !== 0 || e$4.m32 !== 0 || e$4.m33 !== 1 || e$4.m34 !== 0 || e$4.m43 !== 0 || e$4.m44 !== 1;
}
function l$1(e$4, t$2, n$5 = null) {
	if (`moveBefore` in e$4 && e$4.isConnected === t$2.isConnected) try {
		e$4.moveBefore(t$2, n$5);
		return;
	} catch {}
	let r$4 = document.activeElement, i$4 = t$2.contains(r$4);
	e$4.insertBefore(t$2, n$5), i$4 && document.activeElement !== r$4 && r$4 instanceof HTMLElement && r$4.focus({ preventScroll: !0 });
}
function u$1(e$4) {
	return e$4.setMatrixValue(`scale(1, 1)`);
}
function d(e$4, t$2 = 0) {
	let n$5 = 10 ** t$2;
	return Math.round((e$4 + 2 ** -52) * n$5) / n$5;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$4, t$2) {
		this._cache.set(e$4, t$2), this._validation.set(e$4, void 0);
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
	constructor(e$4, t$2) {
		this.sensor = e$4, this.startEvent = t$2, this.prevMoveEvent = t$2, this.moveEvent = t$2, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$4, t$2, n$5 = !1) {
	let { style: r$4 } = e$4;
	for (let e$5 in t$2) r$4.setProperty(e$5, t$2[e$5], n$5 ? `important` : ``);
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
function g(e$4, t$2 = {
	x: 0,
	y: 0
}) {
	if (t$2.x = 0, t$2.y = 0, e$4 instanceof Window) return t$2;
	if (e$4 instanceof Document) return t$2.x = window.scrollX * -1, t$2.y = window.scrollY * -1, t$2;
	let { x: r$4, y: i$4 } = e$4.getBoundingClientRect(), a$3 = t$1(e$4);
	return t$2.x = r$4 + (parseFloat(a$3.borderLeftWidth) || 0), t$2.y = i$4 + (parseFloat(a$3.borderTopWidth) || 0), t$2;
}
function _(e$4) {
	let t$2 = t$1(e$4), r$4 = parseFloat(t$2.height) || 0;
	return t$2.boxSizing === `border-box` ? r$4 : (r$4 += parseFloat(t$2.borderTopWidth) || 0, r$4 += parseFloat(t$2.borderBottomWidth) || 0, r$4 += parseFloat(t$2.paddingTop) || 0, r$4 += parseFloat(t$2.paddingBottom) || 0, e$4 instanceof HTMLElement && (r$4 += e$4.offsetHeight - e$4.clientHeight), r$4);
}
function v$1(e$4) {
	let t$2 = t$1(e$4), r$4 = parseFloat(t$2.width) || 0;
	return t$2.boxSizing === `border-box` ? r$4 : (r$4 += parseFloat(t$2.borderLeftWidth) || 0, r$4 += parseFloat(t$2.borderRightWidth) || 0, r$4 += parseFloat(t$2.paddingLeft) || 0, r$4 += parseFloat(t$2.paddingRight) || 0, e$4 instanceof HTMLElement && (r$4 += e$4.offsetWidth - e$4.clientWidth), r$4);
}
function y(e$4, t$2 = !1) {
	let { translate: r$4, rotate: i$4, scale: a$3, transform: o$3 } = t$1(e$4), s$2 = ``;
	if (r$4 && r$4 !== `none`) {
		let [t$3 = `0px`, n$5 = `0px`, i$5] = r$4.split(` `);
		t$3.includes(`%`) && (t$3 = `${parseFloat(t$3) / 100 * v$1(e$4)}px`), n$5.includes(`%`) && (n$5 = `${parseFloat(n$5) / 100 * _(e$4)}px`), i$5 ? s$2 += `translate3d(${t$3},${n$5},${i$5})` : s$2 += `translate(${t$3},${n$5})`;
	}
	if (i$4 && i$4 !== `none`) {
		let e$5 = i$4.split(` `);
		e$5.length > 1 ? s$2 += `rotate3d(${e$5.join(`,`)})` : s$2 += `rotate(${e$5.join(`,`)})`;
	}
	if (a$3 && a$3 !== `none`) {
		let e$5 = a$3.split(` `);
		e$5.length === 3 ? s$2 += `scale3d(${e$5.join(`,`)})` : s$2 += `scale(${e$5.join(`,`)})`;
	}
	return !t$2 && o$3 && o$3 !== `none` && (s$2 += o$3), s$2;
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
function C(e$4, t$2, n$5 = {
	x: 0,
	y: 0
}) {
	let r$4 = b(e$4) ? e$4 : g(e$4, x), i$4 = b(t$2) ? t$2 : g(t$2, S);
	return n$5.x = i$4.x - r$4.x, n$5.y = i$4.y - r$4.y, n$5;
}
function w(e$4) {
	let t$2 = e$4.split(` `), n$5 = ``, r$4 = ``, i$4 = ``;
	return t$2.length === 1 ? n$5 = r$4 = t$2[0] : t$2.length === 2 ? [n$5, r$4] = t$2 : [n$5, r$4, i$4] = t$2, {
		x: parseFloat(n$5) || 0,
		y: parseFloat(r$4) || 0,
		z: parseFloat(i$4) || 0
	};
}
const T = e$2 ? new DOMMatrix() : null;
function E(e$4, t$2 = new DOMMatrix()) {
	let r$4 = e$4;
	for (u$1(t$2); r$4;) {
		let e$5 = y(r$4);
		if (e$5 && (T.setMatrixValue(e$5), !T.isIdentity)) {
			let { transformOrigin: e$6 } = t$1(r$4), { x: i$4, y: a$3, z: o$3 } = w(e$6);
			o$3 === 0 ? T.setMatrixValue(`translate(${i$4}px,${a$3}px) ${T} translate(${i$4 * -1}px,${a$3 * -1}px)`) : T.setMatrixValue(`translate3d(${i$4}px,${a$3}px,${o$3}px) ${T} translate3d(${i$4 * -1}px,${a$3 * -1}px,${o$3 * -1}px)`), t$2.preMultiplySelf(T);
		}
		r$4 = r$4.parentElement;
	}
	return t$2;
}
const D = e$2 ? h() : null;
var O = class {
	constructor(e$4, t$2) {
		if (!e$4.isConnected) throw Error(`Element is not connected`);
		let { drag: r$4 } = t$2;
		if (!r$4) throw Error(`Drag is not defined`);
		let i$4 = t$1(e$4), a$3 = e$4.getBoundingClientRect(), s$2 = y(e$4, !0);
		this.data = {}, this.element = e$4, this.elementTransformOrigin = w(i$4.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$2 + i$4.transform), this.elementOffsetMatrix = new DOMMatrix(s$2).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		}, this._matrixCache = r$4._matrixCache, this._clientOffsetCache = r$4._clientOffsetCache;
		let c$2 = e$4.parentElement;
		if (!c$2) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$2;
		let l$3 = t$2.settings.container || c$2;
		if (this.dragContainer = l$3, c$2 !== l$3) {
			let { position: e$5 } = i$4;
			if (e$5 !== `fixed` && e$5 !== `absolute`) throw Error(`Dragged element has "${e$5}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$3 = getOffsetContainer(e$4) || e$4;
		this.elementOffsetContainer = u$3, this.dragOffsetContainer = l$3 === c$2 ? u$3 : getOffsetContainer(e$4, { container: l$3 });
		{
			let { width: e$5, height: t$3, x: n$5, y: r$5 } = a$3;
			this.clientRect = {
				width: e$5,
				height: t$3,
				x: n$5,
				y: r$5
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$2.settings.frozenStyles({
			draggable: t$2,
			drag: r$4,
			item: this,
			style: i$4
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$5 = {};
			for (let t$3 of d$1) e$5[t$3] = i$4[t$3];
			this.frozenStyles = e$5;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$3 = {};
			for (let n$5 in this.frozenStyles) t$3[n$5] = e$4.style[n$5];
			this.unfrozenStyles = t$3;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$4) => {
			if (!this._matrixCache.isValid(e$4)) {
				let t$2 = this._matrixCache.get(e$4) || [new DOMMatrix(), new DOMMatrix()], [n$5, r$4] = t$2;
				E(e$4, n$5), r$4.setMatrixValue(n$5.toString()).invertSelf(), this._matrixCache.set(e$4, t$2);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$4, elementContainer: t$2, dragOffsetContainer: n$5, dragContainer: r$4, containerOffset: i$4, _clientOffsetCache: a$3, _matrixCache: o$3 } = this;
		if (e$4 !== n$5) {
			let [s$2, l$3] = [[r$4, n$5], [t$2, e$4]].map(([e$5, t$3]) => {
				let n$6 = a$3.get(t$3) || {
					x: 0,
					y: 0
				};
				if (!a$3.isValid(t$3)) {
					let r$5 = o$3.get(e$5);
					t$3 instanceof HTMLElement && r$5 && !r$5[0].isIdentity ? c$1(r$5[0]) ? (D.style.setProperty(`transform`, r$5[1].toString(), `important`), t$3.append(D), g(D, n$6), D.remove()) : (g(t$3, n$6), n$6.x -= r$5[0].m41, n$6.y -= r$5[0].m42) : g(t$3, n$6);
				}
				return a$3.set(t$3, n$6), n$6;
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
			let { width: e$5, height: t$2 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$5, this.clientRect.height = t$2;
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
	applyPosition: ({ item: e$4, phase: t$2 }) => {
		let n$5 = t$2 === L.End || t$2 === L.EndAlign, [r$4, i$4] = e$4.getContainerMatrix(), [a$3, o$3] = e$4.getDragContainerMatrix(), { position: s$2, alignmentOffset: c$2, containerOffset: l$3, elementTransformMatrix: d$1, elementTransformOrigin: f$1, elementOffsetMatrix: p$1 } = e$4, { x: m$1, y: h$1, z: g$1 } = f$1, _$2 = !d$1.isIdentity && (m$1 !== 0 || h$1 !== 0 || g$1 !== 0), v$2 = s$2.x + c$2.x + l$3.x, y$1 = s$2.y + c$2.y + l$3.y;
		u$1(j), _$2 && (g$1 === 0 ? j.translateSelf(-m$1, -h$1) : j.translateSelf(-m$1, -h$1, -g$1)), n$5 ? i$4.isIdentity || j.multiplySelf(i$4) : o$3.isIdentity || j.multiplySelf(o$3), u$1(M).translateSelf(v$2, y$1), j.multiplySelf(M), r$4.isIdentity || j.multiplySelf(r$4), _$2 && (u$1(M).translateSelf(m$1, h$1, g$1), j.multiplySelf(M)), d$1.isIdentity || j.multiplySelf(d$1), p$1.isIdentity || j.preMultiplySelf(p$1), e$4.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$4 }) => e$4.items[0].clientRect || null,
	positionModifiers: [],
	sensorProcessingMode: I.Sampled,
	dndGroups: /* @__PURE__ */ new Set()
};
var B = class {
	constructor(e$4, t$2 = {}) {
		let { id: n$5 = Symbol(),...r$4 } = t$2;
		this.id = n$5, this.sensors = e$4, this.settings = this._parseSettings(r$4), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((e$5) => {
			this._sensorData.set(e$5, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (t$4) => this._onMove(t$4, e$5),
				onEnd: (t$4) => this._onEnd(t$4, e$5)
			});
			let { onMove: t$3, onEnd: n$6 } = this._sensorData.get(e$5);
			e$5.on(e.Start, t$3, t$3), e$5.on(e.Move, t$3, t$3), e$5.on(e.Cancel, n$6, n$6), e$5.on(e.End, n$6, n$6), e$5.on(e.Destroy, n$6, n$6);
		});
	}
	_parseSettings(e$4, t$2 = z) {
		let { container: n$5 = t$2.container, startPredicate: r$4 = t$2.startPredicate, elements: i$4 = t$2.elements, frozenStyles: a$3 = t$2.frozenStyles, positionModifiers: o$3 = t$2.positionModifiers, applyPosition: s$2 = t$2.applyPosition, computeClientRect: c$2 = t$2.computeClientRect, sensorProcessingMode: l$3 = t$2.sensorProcessingMode, dndGroups: u$3 = t$2.dndGroups, onPrepareStart: d$1 = t$2.onPrepareStart, onStart: f$1 = t$2.onStart, onPrepareMove: p$1 = t$2.onPrepareMove, onMove: m$1 = t$2.onMove, onEnd: h$1 = t$2.onEnd, onDestroy: g$1 = t$2.onDestroy } = e$4 || {};
		return {
			container: n$5,
			startPredicate: r$4,
			elements: i$4,
			frozenStyles: a$3,
			positionModifiers: o$3,
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
	_emit(e$4, ...t$2) {
		this._emitter.emit(e$4, ...t$2);
	}
	_onMove(n$5, r$4) {
		let i$4 = this._sensorData.get(r$4);
		if (i$4) switch (i$4.predicateState) {
			case P.Pending: {
				i$4.predicateEvent = n$5;
				let e$4 = this.settings.startPredicate({
					draggable: this,
					sensor: r$4,
					event: n$5
				});
				e$4 === !0 ? this.resolveStartPredicate(r$4) : e$4 === !1 && this.rejectStartPredicate(r$4);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = n$5, this.settings.sensorProcessingMode === I.Immediate ? (this._prepareMove(), this._applyMove()) : (r$1.once(n$1.read, this._prepareMove, this._moveId), r$1.once(n$1.write, this._applyMove, this._moveId)));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$4, t$2) {
		let n$5 = this._sensorData.get(t$2);
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
			for (let t$2 of e$4.items) t$2.dragContainer !== t$2.elementContainer && l$1(t$2.dragContainer, t$2.element), t$2.frozenStyles && Object.assign(t$2.element.style, t$2.frozenStyles), this.settings.applyPosition({
				phase: L.Start,
				draggable: this,
				drag: e$4,
				item: t$2
			});
			for (let t$2 of e$4.items) {
				let e$5 = t$2.getContainerMatrix()[0], n$5 = t$2.getDragContainerMatrix()[0];
				if (s$1(e$5, n$5) || !c$1(e$5) && !c$1(n$5)) continue;
				let r$4 = t$2.element.getBoundingClientRect(), { alignmentOffset: i$4 } = t$2;
				i$4.x += d(t$2.clientRect.x - r$4.x, 3), i$4.y += d(t$2.clientRect.y - r$4.y, 3);
			}
			for (let t$2 of e$4.items) {
				let { alignmentOffset: n$5 } = t$2;
				(n$5.x !== 0 || n$5.y !== 0) && this.settings.applyPosition({
					phase: L.StartAlign,
					draggable: this,
					drag: e$4,
					item: t$2
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(R.Start, e$4.startEvent), this.settings.onStart?.(e$4, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$4 = this.drag;
		if (!e$4) return;
		let { moveEvent: t$2, prevMoveEvent: n$5 } = e$4;
		t$2 !== n$5 && (this._applyModifiers(F.Move, t$2.x - n$5.x, t$2.y - n$5.y), this._emit(R.PrepareMove, t$2), !e$4.isEnded && (this.settings.onPrepareMove?.(e$4, this), !e$4.isEnded && (e$4.prevMoveEvent = t$2)));
	}
	_applyMove() {
		let e$4 = this.drag;
		if (e$4) {
			for (let t$2 of e$4.items) t$2._moveDiff.x = 0, t$2._moveDiff.y = 0, this.settings.applyPosition({
				phase: L.Move,
				draggable: this,
				drag: e$4,
				item: t$2
			});
			this._emit(R.Move, e$4.moveEvent), !e$4.isEnded && this.settings.onMove?.(e$4, this);
		}
	}
	_prepareAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$2 of e$4.items) {
			let { x: e$5, y: n$5 } = t$2.element.getBoundingClientRect(), r$4 = t$2.clientRect.x - t$2._moveDiff.x - e$5;
			t$2.alignmentOffset.x = t$2.alignmentOffset.x - t$2._alignDiff.x + r$4, t$2._alignDiff.x = r$4;
			let i$4 = t$2.clientRect.y - t$2._moveDiff.y - n$5;
			t$2.alignmentOffset.y = t$2.alignmentOffset.y - t$2._alignDiff.y + i$4, t$2._alignDiff.y = i$4;
		}
	}
	_applyAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$2 of e$4.items) t$2._alignDiff.x = 0, t$2._alignDiff.y = 0, this.settings.applyPosition({
			phase: L.Align,
			draggable: this,
			drag: e$4,
			item: t$2
		});
	}
	_applyModifiers(e$4, t$2, n$5) {
		let { drag: r$4 } = this;
		if (!r$4) return;
		let { positionModifiers: i$4 } = this.settings;
		for (let a$3 of r$4.items) {
			let o$3 = A;
			o$3.x = t$2, o$3.y = n$5;
			for (let t$3 of i$4) o$3 = t$3(o$3, {
				draggable: this,
				drag: r$4,
				item: a$3,
				phase: e$4
			});
			a$3.position.x += o$3.x, a$3.position.y += o$3.y, a$3.clientRect.x += o$3.x, a$3.clientRect.y += o$3.y, e$4 === `move` && (a$3._moveDiff.x += o$3.x, a$3._moveDiff.y += o$3.y);
		}
	}
	on(e$4, t$2, n$5) {
		return this._emitter.on(e$4, t$2, n$5);
	}
	off(e$4, t$2) {
		this._emitter.off(e$4, t$2);
	}
	resolveStartPredicate(n$5, r$4) {
		let i$4 = this._sensorData.get(n$5);
		if (!i$4) return;
		let a$3 = r$4 || i$4.predicateEvent;
		i$4.predicateState === P.Pending && a$3 && (this._startPhase = N.Init, i$4.predicateState = P.Resolved, i$4.predicateEvent = null, this.drag = new p(n$5, a$3), this._sensorData.forEach((e$4, t$2) => {
			t$2 !== n$5 && (e$4.predicateState = P.Rejected, e$4.predicateEvent = null);
		}), this.settings.sensorProcessingMode === I.Immediate ? (this._prepareStart(), this._applyStart()) : (r$1.once(n$1.read, this._prepareStart, this._startId), r$1.once(n$1.write, this._applyStart, this._startId)));
	}
	rejectStartPredicate(e$4) {
		let t$2 = this._sensorData.get(e$4);
		t$2?.predicateState === P.Pending && (t$2.predicateState = P.Rejected, t$2.predicateEvent = null);
	}
	stop() {
		let n$5 = this.drag;
		if (!(!n$5 || n$5.isEnded)) {
			if (this._startPhase === N.Prepare || this._startPhase === N.Apply) throw Error(`Cannot stop drag start process at this point`);
			n$5.isEnded = !0, this._startPhase === N.Init && this._prepareStart(), this._startPhase === N.FinishPrepare && this._applyStart(), this._startPhase = N.None, r$1.off(n$1.read, this._startId), r$1.off(n$1.write, this._startId), r$1.off(n$1.read, this._moveId), r$1.off(n$1.write, this._moveId), r$1.off(n$1.read, this._alignId), r$1.off(n$1.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), this._applyModifiers(F.End, 0, 0);
			for (let e$4 of n$5.items) {
				if (e$4.elementContainer !== e$4.dragContainer && (l$1(e$4.elementContainer, e$4.element), e$4.alignmentOffset.x = 0, e$4.alignmentOffset.y = 0, e$4.containerOffset.x = 0, e$4.containerOffset.y = 0), e$4.unfrozenStyles) for (let t$2 in e$4.unfrozenStyles) e$4.element.style[t$2] = e$4.unfrozenStyles[t$2] || ``;
				this.settings.applyPosition({
					phase: L.End,
					draggable: this,
					drag: n$5,
					item: e$4
				});
			}
			for (let e$4 of n$5.items) if (e$4.elementContainer !== e$4.dragContainer) {
				let t$2 = e$4.element.getBoundingClientRect();
				e$4.alignmentOffset.x = d(e$4.clientRect.x - t$2.x, 3), e$4.alignmentOffset.y = d(e$4.clientRect.y - t$2.y, 3);
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
		this.drag && (n$5 || this.settings.sensorProcessingMode === I.Immediate ? (this._prepareAlign(), this._applyAlign()) : (r$1.once(n$1.read, this._prepareAlign, this._alignId), r$1.once(n$1.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$4, settings: t$2 } = this;
		return e$4 && t$2.computeClientRect?.({
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
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: e$4, onEnd: t$2 }, n$5) => {
			n$5.off(e.Start, e$4), n$5.off(e.Move, e$4), n$5.off(e.Cancel, t$2), n$5.off(e.End, t$2), n$5.off(e.Destroy, t$2);
		}), this._sensorData.clear(), this._emit(R.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-CyG2cFYy.js
function i$3(e$4, t$2) {
	if (`pointerId` in e$4) return e$4.pointerId === t$2 ? e$4 : null;
	if (`changedTouches` in e$4) {
		let n$5 = 0;
		for (; n$5 < e$4.changedTouches.length; n$5++) if (e$4.changedTouches[n$5].identifier === t$2) return e$4.changedTouches[n$5];
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
	let { capture: t$2 = !0, passive: n$5 = !0 } = e$4;
	return {
		capture: t$2,
		passive: n$5
	};
}
function c(n$5) {
	return n$5 === `auto` || n$5 === void 0 ? n$4 ? `pointer` : t ? `touch` : `mouse` : n$5;
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
	constructor(e$4, t$2 = {}) {
		let { listenerOptions: n$5 = {}, sourceEvents: i$4 = `auto`, startPredicate: a$3 = (e$5) => !(`button` in e$5 && e$5.button > 0) } = t$2;
		this.element = e$4, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$3, this._listenerOptions = s(n$5), this._sourceEvents = c(i$4), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$4.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$4) {
		return this.drag ? i$3(e$4, this.drag.pointerId) : null;
	}
	_onStart(e$4) {
		if (this.isDestroyed || this.drag || !this._startPredicate(e$4)) return;
		let t$2 = a$2(e$4);
		if (t$2 === null) return;
		let r$4 = i$3(e$4, t$2);
		if (r$4 === null) return;
		let s$2 = {
			pointerId: t$2,
			pointerType: o$1(e$4),
			x: r$4.clientX,
			y: r$4.clientY
		};
		this.drag = s$2;
		let c$2 = {
			...s$2,
			type: e.Start,
			srcEvent: e$4,
			target: r$4.target
		};
		this._emitter.emit(c$2.type, c$2), this.drag && this._bindWindowListeners();
	}
	_onMove(e$4) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$4);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$4 = {
			type: e.Move,
			srcEvent: e$4,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$4.type, r$4);
	}
	_onCancel(e$4) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$4);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$4 = {
			type: e.Cancel,
			srcEvent: e$4,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$4.type, r$4), this._resetDrag();
	}
	_onEnd(e$4) {
		if (!this.drag) return;
		let t$2 = this._getTrackedPointerEventData(e$4);
		if (!t$2) return;
		this.drag.x = t$2.clientX, this.drag.y = t$2.clientY;
		let r$4 = {
			type: e.End,
			srcEvent: e$4,
			target: t$2.target,
			...this.drag
		};
		this._emitter.emit(r$4.type, r$4), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$4, end: t$2, cancel: n$5 } = l[this._sourceEvents];
		window.addEventListener(e$4, this._onMove, this._listenerOptions), window.addEventListener(t$2, this._onEnd, this._listenerOptions), n$5 && window.addEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$4, end: t$2, cancel: n$5 } = l[this._sourceEvents];
			window.removeEventListener(e$4, this._onMove, this._listenerOptions), window.removeEventListener(t$2, this._onEnd, this._listenerOptions), n$5 && window.removeEventListener(n$5, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
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
		let { listenerOptions: t$2, sourceEvents: n$5, startPredicate: r$4 } = e$4, i$4 = c(n$5), a$3 = s(t$2);
		r$4 && this._startPredicate !== r$4 && (this._startPredicate = r$4), (t$2 && (this._listenerOptions.capture !== a$3.capture || this._listenerOptions.passive === a$3.passive) || n$5 && this._sourceEvents !== i$4) && (this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$5 && (this._sourceEvents = i$4), t$2 && a$3 && (this._listenerOptions = a$3), this.element.addEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$4, t$2, n$5) {
		return this._emitter.on(e$4, t$2, n$5);
	}
	off(e$4, t$2) {
		this._emitter.off(e$4, t$2);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/create-containment-modifier-B5Fb3R4Z.js
const n$3 = e$1(), r$2 = e$1(), i$2 = {
	change: 0,
	drift: 0
};
function a$1(e$4, t$2, n$5, r$4, a$3, o$3, s$2) {
	let c$2 = o$3, l$3 = a$3;
	if (o$3 > 0) {
		if (c$2 = Math.min(Math.max(r$4 - t$2, 0), o$3), s$2) if (a$3 < 0) {
			let e$5 = Math.min(-a$3, o$3);
			l$3 = a$3 + e$5, c$2 = Math.max(0, c$2 - e$5);
		} else l$3 = a$3 + (o$3 - c$2);
	} else if (o$3 < 0 && (c$2 = Math.max(Math.min(n$5 - e$4, 0), o$3), s$2)) if (a$3 > 0) {
		let e$5 = Math.max(-a$3, o$3);
		l$3 = a$3 + e$5, c$2 = Math.min(0, c$2 - e$5);
	} else l$3 = a$3 + (o$3 - c$2);
	i$2.change = c$2, i$2.drift = l$3;
}
function o(o$3, s$2 = ({ drag: e$4 }) => e$4.sensor instanceof u) {
	return function(t$2, c$2) {
		let l$3 = e$1(o$3(c$2), n$3), u$3 = e$1(c$2.item.clientRect, r$2), d$1 = c$2.item.data, f$1 = d$1.__containment__ || {
			drift: {
				x: 0,
				y: 0
			},
			trackDrift: !1
		};
		d$1.__containment__ ||= (f$1.trackDrift = typeof s$2 == `function` ? s$2(c$2) : s$2, f$1);
		let { drift: p$1, trackDrift: m$1 } = f$1;
		return t$2.x &&= (a$1(u$3.left, u$3.right, l$3.left, l$3.right, p$1.x, t$2.x, m$1), p$1.x = i$2.drift, i$2.change), t$2.y &&= (a$1(u$3.top, u$3.bottom, l$3.top, l$3.bottom, p$1.y, t$2.y, m$1), p$1.y = i$2.drift, i$2.change), t$2;
	};
}

//#endregion
//#region ../dragdoll/dist/base-sensor-6CQrwFkA.js
var n$2 = class {
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
	on(e$4, t$2, n$5) {
		return this._emitter.on(e$4, t$2, n$5);
	}
	off(e$4, t$2) {
		this._emitter.off(e$4, t$2);
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
	_createDragData(e$4) {
		return {
			...super._createDragData(e$4),
			time: 0,
			deltaTime: 0
		};
	}
	_start(n$5) {
		this.isDestroyed || this.drag || (super._start(n$5), r$1.on(n$1.read, this._tick, this._tick));
	}
	_end(n$5) {
		this.drag && (r$1.off(n$1.read, this._tick), super._end(n$5));
	}
	_cancel(n$5) {
		this.drag && (r$1.off(n$1.read, this._tick), super._cancel(n$5));
	}
	_tick(e$4) {
		if (this.drag) if (e$4 && this.drag.time) {
			this.drag.deltaTime = e$4 - this.drag.time, this.drag.time = e$4;
			let t$2 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, t$2), !this.drag) return;
			let r$4 = this._speed * (this.drag.deltaTime / 1e3), i$4 = this._direction.x * r$4, a$3 = this._direction.y * r$4;
			(i$4 || a$3) && this._move({
				type: e.Move,
				x: this.drag.x + i$4,
				y: this.drag.y + a$3
			});
		} else this.drag.time = e$4, this.drag.deltaTime = 0;
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
function r(e$4, t$2) {
	if (!e$4.size || !t$2.size) return Infinity;
	let n$5 = Infinity;
	for (let r$4 of e$4) {
		let e$5 = t$2.get(r$4);
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
	startPredicate: (e$4, t$2) => {
		if (t$2.element && document.activeElement === t$2.element) {
			let { left: e$5, top: n$5 } = t$2.element.getBoundingClientRect();
			return {
				x: e$5,
				y: n$5
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$4, t$2 = {}) {
		super();
		let { startPredicate: n$5 = i$1.startPredicate, computeSpeed: r$4 = i$1.computeSpeed, cancelOnVisibilityChange: a$3 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$3 = i$1.cancelOnBlur, startKeys: s$2 = i$1.startKeys, moveLeftKeys: c$2 = i$1.moveLeftKeys, moveRightKeys: l$3 = i$1.moveRightKeys, moveUpKeys: u$3 = i$1.moveUpKeys, moveDownKeys: d$1 = i$1.moveDownKeys, cancelKeys: f$1 = i$1.cancelKeys, endKeys: p$1 = i$1.endKeys } = t$2;
		this.element = e$4, this._startKeys = new Set(s$2), this._cancelKeys = new Set(f$1), this._endKeys = new Set(p$1), this._moveLeftKeys = new Set(c$2), this._moveRightKeys = new Set(l$3), this._moveUpKeys = new Set(u$3), this._moveDownKeys = new Set(d$1), this._moveKeys = new Set([
			...c$2,
			...l$3,
			...u$3,
			...d$1
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$3, this._cancelOnVisibilityChange = a$3, this._computeSpeed = r$4, this._startPredicate = n$5, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$3 && e$4?.addEventListener(`blur`, this._blurCancelHandler), a$3 && document.addEventListener(`visibilitychange`, this._internalCancel);
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
		let e$4 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$2 = r(this._moveRightKeys, this._moveKeyTimestamps), n$5 = r(this._moveUpKeys, this._moveKeyTimestamps), i$4 = r(this._moveDownKeys, this._moveKeyTimestamps), a$3 = e$4 === t$2 ? 0 : e$4 < t$2 ? -1 : 1, o$3 = n$5 === i$4 ? 0 : n$5 < i$4 ? -1 : 1;
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
	_onKeyDown(t$2) {
		if (!this.drag) {
			if (this._startKeys.has(t$2.key)) {
				let n$5 = this._startPredicate(t$2, this);
				n$5 && (t$2.preventDefault(), this._start({
					type: e.Start,
					x: n$5.x,
					y: n$5.y
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
	updateSettings(e$4 = {}) {
		let t$2 = !1, { cancelOnBlur: r$4, cancelOnVisibilityChange: i$4, startPredicate: a$3, computeSpeed: o$3 } = e$4;
		if (r$4 !== void 0 && this._cancelOnBlur !== r$4 && (this._cancelOnBlur = r$4, r$4 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$4 !== void 0 && this._cancelOnVisibilityChange !== i$4 && (this._cancelOnVisibilityChange = i$4, i$4 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$3 !== void 0 && (this._startPredicate = a$3), o$3 !== void 0 && (this._computeSpeed = o$3), n.forEach((n$5, r$5) => {
			let i$5 = `${n$5}Keys`, a$4 = e$4[i$5];
			a$4 !== void 0 && (this[`_${i$5}`] = new Set(a$4), r$5 >= 3 && (t$2 = !0));
		}), t$2) {
			let e$5 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$3, n$5) => e$5[n$5] === t$3) || (this._moveKeys = new Set(e$5), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/006-draggable-containment/index.ts
const element = document.querySelector(".draggable");
new B([new u(element), new a(element)], {
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