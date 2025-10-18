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
	constructor(t$5 = {}) {
		this.dedupe = t$5.dedupe || E$1.ADD, this.getId = t$5.getId || (() => Symbol()), this._events = /* @__PURE__ */ new Map();
	}
	_getListeners(t$5) {
		let n$7 = this._events.get(t$5);
		return n$7 ? n$7.l || (n$7.l = [...n$7.m.values()]) : null;
	}
	on(t$5, n$7, e$4) {
		let i$4 = this._events, s$3 = i$4.get(t$5);
		s$3 || (s$3 = {
			m: /* @__PURE__ */ new Map(),
			l: null
		}, i$4.set(t$5, s$3));
		let o$2 = s$3.m;
		if (e$4 = e$4 === r$2 ? this.getId(n$7) : e$4, o$2.has(e$4)) switch (this.dedupe) {
			case E$1.THROW: throw new Error("Eventti: duplicate listener id!");
			case E$1.IGNORE: return e$4;
			case E$1.UPDATE:
				s$3.l = null;
				break;
			default: o$2.delete(e$4), s$3.l = null;
		}
		return o$2.set(e$4, n$7), s$3.l?.push(n$7), e$4;
	}
	once(t$5, n$7, e$4) {
		let i$4 = 0;
		return e$4 = e$4 === r$2 ? this.getId(n$7) : e$4, this.on(t$5, (...s$3) => {
			i$4 || (i$4 = 1, this.off(t$5, e$4), n$7(...s$3));
		}, e$4);
	}
	off(t$5, n$7) {
		if (t$5 === r$2) {
			this._events.clear();
			return;
		}
		if (n$7 === r$2) {
			this._events.delete(t$5);
			return;
		}
		let e$4 = this._events.get(t$5);
		e$4?.m.delete(n$7) && (e$4.l = null, e$4.m.size || this._events.delete(t$5));
	}
	emit(t$5, ...n$7) {
		let e$4 = this._getListeners(t$5);
		if (e$4) {
			let i$4 = e$4.length, s$3 = 0;
			if (n$7.length) for (; s$3 < i$4; s$3++) e$4[s$3](...n$7);
			else for (; s$3 < i$4; s$3++) e$4[s$3]();
		}
	}
	listenerCount(t$5) {
		if (t$5 === r$2) {
			let n$7 = 0;
			return this._events.forEach((e$4) => {
				n$7 += e$4.m.size;
			}), n$7;
		}
		return this._events.get(t$5)?.m.size || 0;
	}
};

//#endregion
//#region ../../node_modules/tikki/dist/index.js
var _$1 = E$1, o$1 = class {
	constructor(e$4 = {}) {
		let { phases: t$5 = [], dedupe: r$3, getId: s$3 } = e$4;
		this._phases = t$5, this._emitter = new v({
			getId: s$3,
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
	on(e$4, t$5, r$3) {
		return this._emitter.on(e$4, t$5, r$3);
	}
	once(e$4, t$5, r$3) {
		return this._emitter.once(e$4, t$5, r$3);
	}
	off(e$4, t$5) {
		return this._emitter.off(e$4, t$5);
	}
	count(e$4) {
		return this._emitter.listenerCount(e$4);
	}
	_assertEmptyQueue() {
		if (this._queue.length) throw new Error("Ticker: Can't tick before the previous tick has finished!");
	}
	_fillQueue() {
		let e$4 = this._queue, t$5 = this._phases, r$3 = this._getListeners, s$3 = 0, a$3 = t$5.length, n$7;
		for (; s$3 < a$3; s$3++) n$7 = r$3(t$5[s$3]), n$7 && e$4.push(n$7);
		return e$4;
	}
	_processQueue(...e$4) {
		let t$5 = this._queue, r$3 = t$5.length;
		if (!r$3) return;
		let s$3 = 0, a$3 = 0, n$7, c$3;
		for (; s$3 < r$3; s$3++) for (n$7 = t$5[s$3], a$3 = 0, c$3 = n$7.length; a$3 < c$3; a$3++) n$7[a$3](...e$4);
		t$5.length = 0;
	}
};
function u$3(i$4 = 60) {
	if (typeof requestAnimationFrame == "function" && typeof cancelAnimationFrame == "function") return (e$4) => {
		let t$5 = requestAnimationFrame(e$4);
		return () => cancelAnimationFrame(t$5);
	};
	{
		let e$4 = 1e3 / i$4, t$5 = typeof performance > "u" ? () => Date.now() : () => performance.now();
		return (r$3) => {
			let s$3 = setTimeout(() => r$3(t$5()), e$4);
			return () => clearTimeout(s$3);
		};
	}
}
var l$3 = class extends o$1 {
	constructor(e$4 = {}) {
		let { paused: t$5 = !1, onDemand: r$3 = !1, requestFrame: s$3 = u$3(),...a$3 } = e$4;
		super(a$3), this._paused = t$5, this._onDemand = r$3, this._requestFrame = s$3, this._cancelFrame = null, this._empty = !0, !t$5 && !r$3 && this._request();
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
	on(e$4, t$5, r$3) {
		let s$3 = super.on(e$4, t$5, r$3);
		return this._empty = !1, this._request(), s$3;
	}
	once(e$4, t$5, r$3) {
		let s$3 = super.once(e$4, t$5, r$3);
		return this._empty = !1, this._request(), s$3;
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
const t = {
	read: Symbol(),
	write: Symbol()
};
let n$2 = new l$3({ phases: [t.read, t.write] });

//#endregion
//#region ../dragdoll/dist/get-intersection-score-CvSlwByb.js
function e$3(e$4, t$5, n$7 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	let r$3 = Math.max(e$4.x, t$5.x), i$4 = Math.min(e$4.x + e$4.width, t$5.x + t$5.width);
	if (i$4 <= r$3) return null;
	let a$3 = Math.max(e$4.y, t$5.y), o$2 = Math.min(e$4.y + e$4.height, t$5.y + t$5.height);
	return o$2 <= a$3 ? null : (n$7.x = r$3, n$7.y = a$3, n$7.width = i$4 - r$3, n$7.height = o$2 - a$3, n$7);
}
const t$4 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
};
function n$5(n$7, r$3, i$4) {
	if (i$4 ||= e$3(n$7, r$3, t$4), !i$4) return 0;
	let a$3 = i$4.width * i$4.height;
	return a$3 ? a$3 / (Math.min(n$7.width, r$3.width) * Math.min(n$7.height, r$3.height)) * 100 : 0;
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
//#region ../../node_modules/mezr/dist/esm/utils/getStyle.js
const STYLE_DECLARATION_CACHE = /* @__PURE__ */ new WeakMap();
function getStyle(e$4, t$5) {
	if (t$5) return window.getComputedStyle(e$4, t$5);
	let C$1 = STYLE_DECLARATION_CACHE.get(e$4)?.deref();
	return C$1 || (C$1 = window.getComputedStyle(e$4, null), STYLE_DECLARATION_CACHE.set(e$4, new WeakRef(C$1))), C$1;
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isDocumentElement.js
function isDocumentElement(e$4) {
	return e$4 instanceof HTMLHtmlElement;
}

//#endregion
//#region ../dragdoll/dist/collision-detector-C_qir_i0.js
function n$6(e$4, t$5 = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}) {
	return e$4 && (t$5.width = e$4.width, t$5.height = e$4.height, t$5.x = e$4.x, t$5.y = e$4.y), t$5;
}
var r$1 = class {
	constructor(e$4) {
		this._items = [], this._index = 0, this._getItem = e$4;
	}
	get(...e$4) {
		return this._index >= this._items.length ? this._items[this._index++] = this._getItem(void 0, ...e$4) : this._getItem(this._items[this._index++], ...e$4);
	}
	resetPointer() {
		this._index = 0;
	}
	resetItems(e$4 = 0) {
		let t$5 = Math.max(0, Math.min(e$4, this._items.length));
		this._index = Math.min(this._index, t$5), this._items.length = t$5;
	}
};
const i$3 = Symbol();
var a$2 = class {
	constructor(e$4) {
		this._listenerId = Symbol(), this._dndContext = e$4, this._collisionDataPoolCache = [], this._collisionDataPoolMap = /* @__PURE__ */ new Map();
	}
	_checkCollision(r$3, i$4, a$3) {
		let o$2 = r$3.getClientRect(), s$3 = i$4.getClientRect();
		if (!o$2) return null;
		let c$3 = e$3(o$2, s$3, a$3.intersectionRect);
		if (c$3 === null) return null;
		let l$4 = n$5(o$2, s$3, c$3);
		return l$4 <= 0 ? null : (a$3.droppableId = i$4.id, n$6(s$3, a$3.droppableRect), n$6(o$2, a$3.draggableRect), a$3.intersectionScore = l$4, a$3);
	}
	_sortCollisions(e$4, t$5) {
		return t$5.sort((e$5, t$6) => {
			let n$7 = t$6.intersectionScore - e$5.intersectionScore;
			return n$7 === 0 ? e$5.droppableRect.width * e$5.droppableRect.height - t$6.droppableRect.width * t$6.droppableRect.height : n$7;
		});
	}
	_createCollisionData() {
		return {
			droppableId: i$3,
			droppableRect: n$6(),
			draggableRect: n$6(),
			intersectionRect: n$6(),
			intersectionScore: 0
		};
	}
	getCollisionDataPool(e$4) {
		let t$5 = this._collisionDataPoolMap.get(e$4);
		return t$5 || (t$5 = this._collisionDataPoolCache.pop() || new r$1((e$5) => e$5 || this._createCollisionData()), this._collisionDataPoolMap.set(e$4, t$5)), t$5;
	}
	removeCollisionDataPool(e$4) {
		let t$5 = this._collisionDataPoolMap.get(e$4);
		t$5 && (t$5.resetItems(20), t$5.resetPointer(), this._collisionDataPoolCache.push(t$5), this._collisionDataPoolMap.delete(e$4));
	}
	detectCollisions(e$4, t$5, n$7) {
		if (n$7.length = 0, !t$5.size) return;
		let r$3 = this.getCollisionDataPool(e$4), i$4 = null, a$3 = t$5.values();
		for (let t$6 of a$3) i$4 ||= r$3.get(), this._checkCollision(e$4, t$6, i$4) && (n$7.push(i$4), i$4 = null);
		n$7.length > 1 && this._sortCollisions(e$4, n$7), r$3.resetPointer();
	}
	destroy() {
		this._collisionDataPoolMap.forEach((e$4) => {
			e$4.resetItems();
		});
	}
};

//#endregion
//#region ../dragdoll/dist/get-style-ZZHAkgcg.js
const e$2 = /* @__PURE__ */ new WeakMap();
function t$3(t$5) {
	let n$7 = e$2.get(t$5)?.deref();
	return n$7 || (n$7 = window.getComputedStyle(t$5, null), e$2.set(t$5, new WeakRef(n$7))), n$7;
}

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
function isContainingBlockForFixedElement(n$7) {
	const t$5 = getStyle(n$7);
	if (!IS_SAFARI) {
		const { filter: n$8 } = t$5;
		if (n$8 && "none" !== n$8) return !0;
		const { backdropFilter: e$5 } = t$5;
		if (e$5 && "none" !== e$5) return !0;
		const { willChange: i$5 } = t$5;
		if (i$5 && (i$5.indexOf("filter") > -1 || i$5.indexOf("backdrop-filter") > -1)) return !0;
	}
	const e$4 = isBlockElement(n$7);
	if (!e$4) return e$4;
	const { transform: i$4 } = t$5;
	if (i$4 && "none" !== i$4) return !0;
	const { perspective: r$3 } = t$5;
	if (r$3 && "none" !== r$3) return !0;
	const { contentVisibility: o$2 } = t$5;
	if (o$2 && "auto" === o$2) return !0;
	const { contain: f$1 } = t$5;
	if (f$1 && ("strict" === f$1 || "content" === f$1 || f$1.indexOf("paint") > -1 || f$1.indexOf("layout") > -1)) return !0;
	const { willChange: c$3 } = t$5;
	return !(!c$3 || !(c$3.indexOf("transform") > -1 || c$3.indexOf("perspective") > -1 || c$3.indexOf("contain") > -1)) || !!(IS_SAFARI && c$3 && c$3.indexOf("filter") > -1);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/utils/isContainingBlockForAbsoluteElement.js
function isContainingBlockForAbsoluteElement(t$5) {
	return "static" !== getStyle(t$5).position || isContainingBlockForFixedElement(t$5);
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getContainingBlock.js
function getContainingBlock(e$4, t$5 = {}) {
	if (isDocumentElement(e$4)) return e$4.ownerDocument.defaultView;
	const n$7 = t$5.position || getStyle(e$4).position, { skipDisplayNone: i$4, container: o$2 } = t$5;
	switch (n$7) {
		case "static":
		case "relative":
		case "sticky":
		case "-webkit-sticky": {
			let t$6 = o$2 || e$4.parentElement;
			for (; t$6;) {
				const e$5 = isBlockElement(t$6);
				if (e$5) return t$6;
				if (null === e$5 && !i$4) return null;
				t$6 = t$6.parentElement;
			}
			return e$4.ownerDocument.documentElement;
		}
		case "absolute":
		case "fixed": {
			const t$6 = "fixed" === n$7;
			let l$4 = o$2 || e$4.parentElement;
			for (; l$4;) {
				const e$5 = t$6 ? isContainingBlockForFixedElement(l$4) : isContainingBlockForAbsoluteElement(l$4);
				if (!0 === e$5) return l$4;
				if (null === e$5 && !i$4) return null;
				l$4 = l$4.parentElement;
			}
			return e$4.ownerDocument.defaultView;
		}
		default: return null;
	}
}

//#endregion
//#region ../../node_modules/mezr/dist/esm/getOffsetContainer.js
function getOffsetContainer(n$7, t$5 = {}) {
	const { display: o$2 } = getStyle(n$7);
	if ("none" === o$2 || "contents" === o$2) return null;
	const e$4 = t$5.position || getStyle(n$7).position, { skipDisplayNone: s$3, container: r$3 } = t$5;
	switch (e$4) {
		case "relative": return n$7;
		case "fixed": return getContainingBlock(n$7, {
			container: r$3,
			position: e$4,
			skipDisplayNone: s$3
		});
		case "absolute": {
			const t$6 = getContainingBlock(n$7, {
				container: r$3,
				position: e$4,
				skipDisplayNone: s$3
			});
			return isWindow(t$6) ? n$7.ownerDocument : t$6;
		}
		default: return null;
	}
}

//#endregion
//#region ../dragdoll/dist/draggable-C0ryZvr6.js
function s$2(e$4, t$5) {
	return e$4.isIdentity && t$5.isIdentity ? !0 : e$4.is2D && t$5.is2D ? e$4.a === t$5.a && e$4.b === t$5.b && e$4.c === t$5.c && e$4.d === t$5.d && e$4.e === t$5.e && e$4.f === t$5.f : e$4.m11 === t$5.m11 && e$4.m12 === t$5.m12 && e$4.m13 === t$5.m13 && e$4.m14 === t$5.m14 && e$4.m21 === t$5.m21 && e$4.m22 === t$5.m22 && e$4.m23 === t$5.m23 && e$4.m24 === t$5.m24 && e$4.m31 === t$5.m31 && e$4.m32 === t$5.m32 && e$4.m33 === t$5.m33 && e$4.m34 === t$5.m34 && e$4.m41 === t$5.m41 && e$4.m42 === t$5.m42 && e$4.m43 === t$5.m43 && e$4.m44 === t$5.m44;
}
function c$2(e$4) {
	return e$4.m11 !== 1 || e$4.m12 !== 0 || e$4.m13 !== 0 || e$4.m14 !== 0 || e$4.m21 !== 0 || e$4.m22 !== 1 || e$4.m23 !== 0 || e$4.m24 !== 0 || e$4.m31 !== 0 || e$4.m32 !== 0 || e$4.m33 !== 1 || e$4.m34 !== 0 || e$4.m43 !== 0 || e$4.m44 !== 1;
}
function l$2(e$4, t$5, n$7 = null) {
	if (`moveBefore` in e$4 && e$4.isConnected === t$5.isConnected) try {
		e$4.moveBefore(t$5, n$7);
		return;
	} catch {}
	let r$3 = document.activeElement, i$4 = t$5.contains(r$3);
	e$4.insertBefore(t$5, n$7), i$4 && document.activeElement !== r$3 && r$3 instanceof HTMLElement && r$3.focus({ preventScroll: !0 });
}
function u$2(e$4) {
	return e$4.setMatrixValue(`scale(1, 1)`);
}
function d(e$4, t$5 = 0) {
	let n$7 = 10 ** t$5;
	return Math.round((e$4 + 2 ** -52) * n$7) / n$7;
}
var f = class {
	constructor() {
		this._cache = /* @__PURE__ */ new Map(), this._validation = /* @__PURE__ */ new Map();
	}
	set(e$4, t$5) {
		this._cache.set(e$4, t$5), this._validation.set(e$4, void 0);
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
	constructor(e$4, t$5) {
		this.sensor = e$4, this.startEvent = t$5, this.prevMoveEvent = t$5, this.moveEvent = t$5, this.endEvent = null, this.items = [], this.isEnded = !1, this._matrixCache = new f(), this._clientOffsetCache = new f();
	}
};
function m(e$4, t$5, n$7 = !1) {
	let { style: r$3 } = e$4;
	for (let e$5 in t$5) r$3.setProperty(e$5, t$5[e$5], n$7 ? `important` : ``);
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
function g(e$4, t$5 = {
	x: 0,
	y: 0
}) {
	if (t$5.x = 0, t$5.y = 0, e$4 instanceof Window) return t$5;
	if (e$4 instanceof Document) return t$5.x = window.scrollX * -1, t$5.y = window.scrollY * -1, t$5;
	let { x: r$3, y: i$4 } = e$4.getBoundingClientRect(), a$3 = t$3(e$4);
	return t$5.x = r$3 + (parseFloat(a$3.borderLeftWidth) || 0), t$5.y = i$4 + (parseFloat(a$3.borderTopWidth) || 0), t$5;
}
function _(e$4) {
	let t$5 = t$3(e$4), r$3 = parseFloat(t$5.height) || 0;
	return t$5.boxSizing === `border-box` ? r$3 : (r$3 += parseFloat(t$5.borderTopWidth) || 0, r$3 += parseFloat(t$5.borderBottomWidth) || 0, r$3 += parseFloat(t$5.paddingTop) || 0, r$3 += parseFloat(t$5.paddingBottom) || 0, e$4 instanceof HTMLElement && (r$3 += e$4.offsetHeight - e$4.clientHeight), r$3);
}
function v$1(e$4) {
	let t$5 = t$3(e$4), r$3 = parseFloat(t$5.width) || 0;
	return t$5.boxSizing === `border-box` ? r$3 : (r$3 += parseFloat(t$5.borderLeftWidth) || 0, r$3 += parseFloat(t$5.borderRightWidth) || 0, r$3 += parseFloat(t$5.paddingLeft) || 0, r$3 += parseFloat(t$5.paddingRight) || 0, e$4 instanceof HTMLElement && (r$3 += e$4.offsetWidth - e$4.clientWidth), r$3);
}
function y(e$4, t$5 = !1) {
	let { translate: r$3, rotate: i$4, scale: a$3, transform: o$2 } = t$3(e$4), s$3 = ``;
	if (r$3 && r$3 !== `none`) {
		let [t$6 = `0px`, n$7 = `0px`, i$5] = r$3.split(` `);
		t$6.includes(`%`) && (t$6 = `${parseFloat(t$6) / 100 * v$1(e$4)}px`), n$7.includes(`%`) && (n$7 = `${parseFloat(n$7) / 100 * _(e$4)}px`), i$5 ? s$3 += `translate3d(${t$6},${n$7},${i$5})` : s$3 += `translate(${t$6},${n$7})`;
	}
	if (i$4 && i$4 !== `none`) {
		let e$5 = i$4.split(` `);
		e$5.length > 1 ? s$3 += `rotate3d(${e$5.join(`,`)})` : s$3 += `rotate(${e$5.join(`,`)})`;
	}
	if (a$3 && a$3 !== `none`) {
		let e$5 = a$3.split(` `);
		e$5.length === 3 ? s$3 += `scale3d(${e$5.join(`,`)})` : s$3 += `scale(${e$5.join(`,`)})`;
	}
	return !t$5 && o$2 && o$2 !== `none` && (s$3 += o$2), s$3;
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
function C(e$4, t$5, n$7 = {
	x: 0,
	y: 0
}) {
	let r$3 = b(e$4) ? e$4 : g(e$4, x), i$4 = b(t$5) ? t$5 : g(t$5, S);
	return n$7.x = i$4.x - r$3.x, n$7.y = i$4.y - r$3.y, n$7;
}
function w(e$4) {
	let t$5 = e$4.split(` `), n$7 = ``, r$3 = ``, i$4 = ``;
	return t$5.length === 1 ? n$7 = r$3 = t$5[0] : t$5.length === 2 ? [n$7, r$3] = t$5 : [n$7, r$3, i$4] = t$5, {
		x: parseFloat(n$7) || 0,
		y: parseFloat(r$3) || 0,
		z: parseFloat(i$4) || 0
	};
}
const T = e$1 ? new DOMMatrix() : null;
function E(e$4, t$5 = new DOMMatrix()) {
	let r$3 = e$4;
	for (u$2(t$5); r$3;) {
		let e$5 = y(r$3);
		if (e$5 && (T.setMatrixValue(e$5), !T.isIdentity)) {
			let { transformOrigin: e$6 } = t$3(r$3), { x: i$4, y: a$3, z: o$2 } = w(e$6);
			o$2 === 0 ? T.setMatrixValue(`translate(${i$4}px,${a$3}px) ${T} translate(${i$4 * -1}px,${a$3 * -1}px)`) : T.setMatrixValue(`translate3d(${i$4}px,${a$3}px,${o$2}px) ${T} translate3d(${i$4 * -1}px,${a$3 * -1}px,${o$2 * -1}px)`), t$5.preMultiplySelf(T);
		}
		r$3 = r$3.parentElement;
	}
	return t$5;
}
const D = e$1 ? h() : null;
var O = class {
	constructor(e$4, t$5) {
		if (!e$4.isConnected) throw Error(`Element is not connected`);
		let { drag: r$3 } = t$5;
		if (!r$3) throw Error(`Drag is not defined`);
		let i$4 = t$3(e$4), a$3 = e$4.getBoundingClientRect(), s$3 = y(e$4, !0);
		this.data = {}, this.element = e$4, this.elementTransformOrigin = w(i$4.transformOrigin), this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s$3 + i$4.transform), this.elementOffsetMatrix = new DOMMatrix(s$3).invertSelf(), this.frozenStyles = null, this.unfrozenStyles = null, this.position = {
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
		let c$3 = e$4.parentElement;
		if (!c$3) throw Error(`Dragged element does not have a parent element.`);
		this.elementContainer = c$3;
		let l$4 = t$5.settings.container || c$3;
		if (this.dragContainer = l$4, c$3 !== l$4) {
			let { position: e$5 } = i$4;
			if (e$5 !== `fixed` && e$5 !== `absolute`) throw Error(`Dragged element has "${e$5}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`);
		}
		let u$4 = getOffsetContainer(e$4) || e$4;
		this.elementOffsetContainer = u$4, this.dragOffsetContainer = l$4 === c$3 ? u$4 : getOffsetContainer(e$4, { container: l$4 });
		{
			let { width: e$5, height: t$6, x: n$7, y: r$4 } = a$3;
			this.clientRect = {
				width: e$5,
				height: t$6,
				x: n$7,
				y: r$4
			};
		}
		this._updateContainerMatrices(), this._updateContainerOffset();
		let d$1 = t$5.settings.frozenStyles({
			draggable: t$5,
			drag: r$3,
			item: this,
			style: i$4
		});
		if (Array.isArray(d$1)) if (d$1.length) {
			let e$5 = {};
			for (let t$6 of d$1) e$5[t$6] = i$4[t$6];
			this.frozenStyles = e$5;
		} else this.frozenStyles = null;
		else this.frozenStyles = d$1;
		if (this.frozenStyles) {
			let t$6 = {};
			for (let n$7 in this.frozenStyles) t$6[n$7] = e$4.style[n$7];
			this.unfrozenStyles = t$6;
		}
	}
	_updateContainerMatrices() {
		[this.elementContainer, this.dragContainer].forEach((e$4) => {
			if (!this._matrixCache.isValid(e$4)) {
				let t$5 = this._matrixCache.get(e$4) || [new DOMMatrix(), new DOMMatrix()], [n$7, r$3] = t$5;
				E(e$4, n$7), r$3.setMatrixValue(n$7.toString()).invertSelf(), this._matrixCache.set(e$4, t$5);
			}
		});
	}
	_updateContainerOffset() {
		let { elementOffsetContainer: e$4, elementContainer: t$5, dragOffsetContainer: n$7, dragContainer: r$3, containerOffset: i$4, _clientOffsetCache: a$3, _matrixCache: o$2 } = this;
		if (e$4 !== n$7) {
			let [s$3, l$4] = [[r$3, n$7], [t$5, e$4]].map(([e$5, t$6]) => {
				let n$8 = a$3.get(t$6) || {
					x: 0,
					y: 0
				};
				if (!a$3.isValid(t$6)) {
					let r$4 = o$2.get(e$5);
					t$6 instanceof HTMLElement && r$4 && !r$4[0].isIdentity ? c$2(r$4[0]) ? (D.style.setProperty(`transform`, r$4[1].toString(), `important`), t$6.append(D), g(D, n$8), D.remove()) : (g(t$6, n$8), n$8.x -= r$4[0].m41, n$8.y -= r$4[0].m42) : g(t$6, n$8);
				}
				return a$3.set(t$6, n$8), n$8;
			});
			C(s$3, l$4, i$4);
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
			let { width: e$5, height: t$5 } = this.element.getBoundingClientRect();
			this.clientRect.width = e$5, this.clientRect.height = t$5;
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
	applyPosition: ({ item: e$4, phase: t$5 }) => {
		let n$7 = t$5 === L.End || t$5 === L.EndAlign, [r$3, i$4] = e$4.getContainerMatrix(), [a$3, o$2] = e$4.getDragContainerMatrix(), { position: s$3, alignmentOffset: c$3, containerOffset: l$4, elementTransformMatrix: d$1, elementTransformOrigin: f$1, elementOffsetMatrix: p$1 } = e$4, { x: m$1, y: h$1, z: g$1 } = f$1, _$2 = !d$1.isIdentity && (m$1 !== 0 || h$1 !== 0 || g$1 !== 0), v$2 = s$3.x + c$3.x + l$4.x, y$1 = s$3.y + c$3.y + l$4.y;
		u$2(j), _$2 && (g$1 === 0 ? j.translateSelf(-m$1, -h$1) : j.translateSelf(-m$1, -h$1, -g$1)), n$7 ? i$4.isIdentity || j.multiplySelf(i$4) : o$2.isIdentity || j.multiplySelf(o$2), u$2(M).translateSelf(v$2, y$1), j.multiplySelf(M), r$3.isIdentity || j.multiplySelf(r$3), _$2 && (u$2(M).translateSelf(m$1, h$1, g$1), j.multiplySelf(M)), d$1.isIdentity || j.multiplySelf(d$1), p$1.isIdentity || j.preMultiplySelf(p$1), e$4.element.style.transform = `${j}`;
	},
	computeClientRect: ({ drag: e$4 }) => e$4.items[0].clientRect || null,
	positionModifiers: [],
	sensorProcessingMode: I.Sampled,
	dndGroups: /* @__PURE__ */ new Set()
};
var B = class {
	constructor(e$4, t$5 = {}) {
		let { id: n$7 = Symbol(),...r$3 } = t$5;
		this.id = n$7, this.sensors = e$4, this.settings = this._parseSettings(r$3), this.plugins = {}, this.drag = null, this.isDestroyed = !1, this._sensorData = /* @__PURE__ */ new Map(), this._emitter = new v(), this._startPhase = N.None, this._startId = Symbol(), this._moveId = Symbol(), this._alignId = Symbol(), this._onMove = this._onMove.bind(this), this._onScroll = this._onScroll.bind(this), this._onEnd = this._onEnd.bind(this), this._prepareStart = this._prepareStart.bind(this), this._applyStart = this._applyStart.bind(this), this._prepareMove = this._prepareMove.bind(this), this._applyMove = this._applyMove.bind(this), this._prepareAlign = this._prepareAlign.bind(this), this._applyAlign = this._applyAlign.bind(this), this.sensors.forEach((e$5) => {
			this._sensorData.set(e$5, {
				predicateState: P.Pending,
				predicateEvent: null,
				onMove: (t$7) => this._onMove(t$7, e$5),
				onEnd: (t$7) => this._onEnd(t$7, e$5)
			});
			let { onMove: t$6, onEnd: n$8 } = this._sensorData.get(e$5);
			e$5.on(e.Start, t$6, t$6), e$5.on(e.Move, t$6, t$6), e$5.on(e.Cancel, n$8, n$8), e$5.on(e.End, n$8, n$8), e$5.on(e.Destroy, n$8, n$8);
		});
	}
	_parseSettings(e$4, t$5 = z) {
		let { container: n$7 = t$5.container, startPredicate: r$3 = t$5.startPredicate, elements: i$4 = t$5.elements, frozenStyles: a$3 = t$5.frozenStyles, positionModifiers: o$2 = t$5.positionModifiers, applyPosition: s$3 = t$5.applyPosition, computeClientRect: c$3 = t$5.computeClientRect, sensorProcessingMode: l$4 = t$5.sensorProcessingMode, dndGroups: u$4 = t$5.dndGroups, onPrepareStart: d$1 = t$5.onPrepareStart, onStart: f$1 = t$5.onStart, onPrepareMove: p$1 = t$5.onPrepareMove, onMove: m$1 = t$5.onMove, onEnd: h$1 = t$5.onEnd, onDestroy: g$1 = t$5.onDestroy } = e$4 || {};
		return {
			container: n$7,
			startPredicate: r$3,
			elements: i$4,
			frozenStyles: a$3,
			positionModifiers: o$2,
			applyPosition: s$3,
			computeClientRect: c$3,
			sensorProcessingMode: l$4,
			dndGroups: u$4,
			onPrepareStart: d$1,
			onStart: f$1,
			onPrepareMove: p$1,
			onMove: m$1,
			onEnd: h$1,
			onDestroy: g$1
		};
	}
	_emit(e$4, ...t$5) {
		this._emitter.emit(e$4, ...t$5);
	}
	_onMove(n$7, r$3) {
		let i$4 = this._sensorData.get(r$3);
		if (i$4) switch (i$4.predicateState) {
			case P.Pending: {
				i$4.predicateEvent = n$7;
				let e$4 = this.settings.startPredicate({
					draggable: this,
					sensor: r$3,
					event: n$7
				});
				e$4 === !0 ? this.resolveStartPredicate(r$3) : e$4 === !1 && this.rejectStartPredicate(r$3);
				break;
			}
			case P.Resolved:
				this.drag && (this.drag.moveEvent = n$7, this.settings.sensorProcessingMode === I.Immediate ? (this._prepareMove(), this._applyMove()) : (n$2.once(t.read, this._prepareMove, this._moveId), n$2.once(t.write, this._applyMove, this._moveId)));
				break;
		}
	}
	_onScroll() {
		this.align();
	}
	_onEnd(e$4, t$5) {
		let n$7 = this._sensorData.get(t$5);
		n$7 && (this.drag ? n$7.predicateState === P.Resolved && (this.drag.endEvent = e$4, this._sensorData.forEach((e$5) => {
			e$5.predicateState = P.Pending, e$5.predicateEvent = null;
		}), this.stop()) : (n$7.predicateState = P.Pending, n$7.predicateEvent = null));
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
			for (let t$5 of e$4.items) t$5.dragContainer !== t$5.elementContainer && l$2(t$5.dragContainer, t$5.element), t$5.frozenStyles && Object.assign(t$5.element.style, t$5.frozenStyles), this.settings.applyPosition({
				phase: L.Start,
				draggable: this,
				drag: e$4,
				item: t$5
			});
			for (let t$5 of e$4.items) {
				let e$5 = t$5.getContainerMatrix()[0], n$7 = t$5.getDragContainerMatrix()[0];
				if (s$2(e$5, n$7) || !c$2(e$5) && !c$2(n$7)) continue;
				let r$3 = t$5.element.getBoundingClientRect(), { alignmentOffset: i$4 } = t$5;
				i$4.x += d(t$5.clientRect.x - r$3.x, 3), i$4.y += d(t$5.clientRect.y - r$3.y, 3);
			}
			for (let t$5 of e$4.items) {
				let { alignmentOffset: n$7 } = t$5;
				(n$7.x !== 0 || n$7.y !== 0) && this.settings.applyPosition({
					phase: L.StartAlign,
					draggable: this,
					drag: e$4,
					item: t$5
				});
			}
			window.addEventListener(`scroll`, this._onScroll, k), this._emit(R.Start, e$4.startEvent), this.settings.onStart?.(e$4, this), this._startPhase = N.FinishApply;
		}
	}
	_prepareMove() {
		let e$4 = this.drag;
		if (!e$4) return;
		let { moveEvent: t$5, prevMoveEvent: n$7 } = e$4;
		t$5 !== n$7 && (this._applyModifiers(F.Move, t$5.x - n$7.x, t$5.y - n$7.y), this._emit(R.PrepareMove, t$5), !e$4.isEnded && (this.settings.onPrepareMove?.(e$4, this), !e$4.isEnded && (e$4.prevMoveEvent = t$5)));
	}
	_applyMove() {
		let e$4 = this.drag;
		if (e$4) {
			for (let t$5 of e$4.items) t$5._moveDiff.x = 0, t$5._moveDiff.y = 0, this.settings.applyPosition({
				phase: L.Move,
				draggable: this,
				drag: e$4,
				item: t$5
			});
			this._emit(R.Move, e$4.moveEvent), !e$4.isEnded && this.settings.onMove?.(e$4, this);
		}
	}
	_prepareAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$5 of e$4.items) {
			let { x: e$5, y: n$7 } = t$5.element.getBoundingClientRect(), r$3 = t$5.clientRect.x - t$5._moveDiff.x - e$5;
			t$5.alignmentOffset.x = t$5.alignmentOffset.x - t$5._alignDiff.x + r$3, t$5._alignDiff.x = r$3;
			let i$4 = t$5.clientRect.y - t$5._moveDiff.y - n$7;
			t$5.alignmentOffset.y = t$5.alignmentOffset.y - t$5._alignDiff.y + i$4, t$5._alignDiff.y = i$4;
		}
	}
	_applyAlign() {
		let { drag: e$4 } = this;
		if (e$4) for (let t$5 of e$4.items) t$5._alignDiff.x = 0, t$5._alignDiff.y = 0, this.settings.applyPosition({
			phase: L.Align,
			draggable: this,
			drag: e$4,
			item: t$5
		});
	}
	_applyModifiers(e$4, t$5, n$7) {
		let { drag: r$3 } = this;
		if (!r$3) return;
		let { positionModifiers: i$4 } = this.settings;
		for (let a$3 of r$3.items) {
			let o$2 = A;
			o$2.x = t$5, o$2.y = n$7;
			for (let t$6 of i$4) o$2 = t$6(o$2, {
				draggable: this,
				drag: r$3,
				item: a$3,
				phase: e$4
			});
			a$3.position.x += o$2.x, a$3.position.y += o$2.y, a$3.clientRect.x += o$2.x, a$3.clientRect.y += o$2.y, e$4 === `move` && (a$3._moveDiff.x += o$2.x, a$3._moveDiff.y += o$2.y);
		}
	}
	on(e$4, t$5, n$7) {
		return this._emitter.on(e$4, t$5, n$7);
	}
	off(e$4, t$5) {
		this._emitter.off(e$4, t$5);
	}
	resolveStartPredicate(n$7, r$3) {
		let i$4 = this._sensorData.get(n$7);
		if (!i$4) return;
		let a$3 = r$3 || i$4.predicateEvent;
		i$4.predicateState === P.Pending && a$3 && (this._startPhase = N.Init, i$4.predicateState = P.Resolved, i$4.predicateEvent = null, this.drag = new p(n$7, a$3), this._sensorData.forEach((e$4, t$5) => {
			t$5 !== n$7 && (e$4.predicateState = P.Rejected, e$4.predicateEvent = null);
		}), this.settings.sensorProcessingMode === I.Immediate ? (this._prepareStart(), this._applyStart()) : (n$2.once(t.read, this._prepareStart, this._startId), n$2.once(t.write, this._applyStart, this._startId)));
	}
	rejectStartPredicate(e$4) {
		let t$5 = this._sensorData.get(e$4);
		t$5?.predicateState === P.Pending && (t$5.predicateState = P.Rejected, t$5.predicateEvent = null);
	}
	stop() {
		let n$7 = this.drag;
		if (!(!n$7 || n$7.isEnded)) {
			if (this._startPhase === N.Prepare || this._startPhase === N.Apply) throw Error(`Cannot stop drag start process at this point`);
			n$7.isEnded = !0, this._startPhase === N.Init && this._prepareStart(), this._startPhase === N.FinishPrepare && this._applyStart(), this._startPhase = N.None, n$2.off(t.read, this._startId), n$2.off(t.write, this._startId), n$2.off(t.read, this._moveId), n$2.off(t.write, this._moveId), n$2.off(t.read, this._alignId), n$2.off(t.write, this._alignId), window.removeEventListener(`scroll`, this._onScroll, k), this._applyModifiers(F.End, 0, 0);
			for (let e$4 of n$7.items) {
				if (e$4.elementContainer !== e$4.dragContainer && (l$2(e$4.elementContainer, e$4.element), e$4.alignmentOffset.x = 0, e$4.alignmentOffset.y = 0, e$4.containerOffset.x = 0, e$4.containerOffset.y = 0), e$4.unfrozenStyles) for (let t$5 in e$4.unfrozenStyles) e$4.element.style[t$5] = e$4.unfrozenStyles[t$5] || ``;
				this.settings.applyPosition({
					phase: L.End,
					draggable: this,
					drag: n$7,
					item: e$4
				});
			}
			for (let e$4 of n$7.items) if (e$4.elementContainer !== e$4.dragContainer) {
				let t$5 = e$4.element.getBoundingClientRect();
				e$4.alignmentOffset.x = d(e$4.clientRect.x - t$5.x, 3), e$4.alignmentOffset.y = d(e$4.clientRect.y - t$5.y, 3);
			}
			for (let e$4 of n$7.items) e$4.elementContainer !== e$4.dragContainer && (e$4.alignmentOffset.x !== 0 || e$4.alignmentOffset.y !== 0) && this.settings.applyPosition({
				phase: L.EndAlign,
				draggable: this,
				drag: n$7,
				item: e$4
			});
			this._emit(R.End, n$7.endEvent), this.settings.onEnd?.(n$7, this), this.drag = null;
		}
	}
	align(n$7 = !1) {
		this.drag && (n$7 || this.settings.sensorProcessingMode === I.Immediate ? (this._prepareAlign(), this._applyAlign()) : (n$2.once(t.read, this._prepareAlign, this._alignId), n$2.once(t.write, this._applyAlign, this._alignId)));
	}
	getClientRect() {
		let { drag: e$4, settings: t$5 } = this;
		return e$4 && t$5.computeClientRect?.({
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
		this.isDestroyed || (this.isDestroyed = !0, this.stop(), this._sensorData.forEach(({ onMove: e$4, onEnd: t$5 }, n$7) => {
			n$7.off(e.Start, e$4), n$7.off(e.Move, e$4), n$7.off(e.Cancel, t$5), n$7.off(e.End, t$5), n$7.off(e.Destroy, t$5);
		}), this._sensorData.clear(), this._emit(R.Destroy), this.settings.onDestroy?.(this), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/droppable-BW9Ygu-q.js
const t$2 = { Destroy: `destroy` };
var n = class {
	constructor(t$5, n$7 = {}) {
		let { id: r$3 = Symbol(), accept: i$4 = () => !0, data: a$3 = {} } = n$7;
		this.id = r$3, this.element = t$5, this.accept = i$4, this.data = a$3, this.isDestroyed = !1, this._clientRect = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}, this._emitter = new v(), this.updateClientRect();
	}
	on(e$4, t$5, n$7) {
		return this._emitter.on(e$4, t$5, n$7);
	}
	off(e$4, t$5) {
		this._emitter.off(e$4, t$5);
	}
	getClientRect() {
		return this._clientRect;
	}
	updateClientRect(e$4) {
		let t$5 = e$4 || this.element.getBoundingClientRect(), { _clientRect: n$7 } = this;
		n$7.x = t$5.x, n$7.y = t$5.y, n$7.width = t$5.width, n$7.height = t$5.height;
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this._emitter.emit(t$2.Destroy), this._emitter.off());
	}
};

//#endregion
//#region ../dragdoll/dist/dnd-context-B0dcvuev.js
var s$1 = function(e$4) {
	return e$4[e$4.Idle = 0] = `Idle`, e$4[e$4.Computing = 1] = `Computing`, e$4[e$4.Computed = 2] = `Computed`, e$4[e$4.Emitting = 3] = `Emitting`, e$4;
}(s$1 || {});
const c$1 = {
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
	constructor(r$3 = {}) {
		this._onScroll = () => {
			this._drags.size !== 0 && (n$2.once(t.read, () => {
				this.updateDroppableClientRects();
			}, this._listenerId), this.detectCollisions());
		};
		let { collisionDetector: i$4 } = r$3;
		this.draggables = /* @__PURE__ */ new Map(), this.droppables = /* @__PURE__ */ new Map(), this.isDestroyed = !1, this._drags = /* @__PURE__ */ new Map(), this._listenerId = Symbol(), this._emitter = new v(), this._onScroll = this._onScroll.bind(this), this._collisionDetector = i$4 ? i$4(this) : new a$2(this);
	}
	get drags() {
		return this._drags;
	}
	_isMatch(e$4, t$5) {
		let n$7 = !1;
		if (typeof t$5.accept == `function`) n$7 = t$5.accept(e$4);
		else {
			let r$3 = e$4.settings.dndGroups, i$4 = t$5.accept;
			if (!r$3 || r$3.size === 0 || i$4.size === 0) return !1;
			let a$3 = i$4.size < r$3.size, o$2 = a$3 ? i$4 : r$3, s$3 = a$3 ? r$3 : i$4;
			for (let e$5 of o$2) s$3.has(e$5) && (n$7 = !0);
		}
		if (n$7 && e$4.drag) {
			let n$8 = e$4.drag.items;
			for (let e$5 = 0; e$5 < n$8.length; e$5++) if (n$8[e$5].element === t$5.element) return !1;
		}
		return n$7;
	}
	_getTargets(e$4) {
		let t$5 = this._drags.get(e$4);
		if (t$5?._targets) return t$5._targets;
		let n$7 = /* @__PURE__ */ new Map();
		for (let t$6 of this.droppables.values()) this._isMatch(e$4, t$6) && n$7.set(t$6.id, t$6);
		return t$5 && (t$5._targets = n$7), n$7;
	}
	_onDragPrepareStart(e$4) {
		this.draggables.has(e$4.id) && (this._drags.get(e$4) || (this._drags.set(e$4, {
			isEnded: !1,
			data: {},
			_targets: null,
			_cd: {
				phase: s$1.Idle,
				tickerId: Symbol(),
				targets: /* @__PURE__ */ new Map(),
				collisions: [],
				contacts: /* @__PURE__ */ new Set(),
				prevContacts: /* @__PURE__ */ new Set(),
				addedContacts: /* @__PURE__ */ new Set(),
				persistedContacts: /* @__PURE__ */ new Set()
			}
		}), this._drags.size === 1 && this.updateDroppableClientRects(), this._computeCollisions(e$4), this._drags.size === 1 && window.addEventListener(`scroll`, this._onScroll, c$1)));
	}
	_onDragStart(e$4) {
		let t$5 = this._drags.get(e$4);
		if (!(!t$5 || t$5.isEnded)) {
			if (this._emitter.listenerCount(l.Start)) {
				let t$6 = this._getTargets(e$4);
				this._emitter.emit(l.Start, {
					draggable: e$4,
					targets: t$6
				});
			}
			this._emitCollisions(e$4);
		}
	}
	_onDragPrepareMove(e$4) {
		let t$5 = this._drags.get(e$4);
		!t$5 || t$5.isEnded || this._computeCollisions(e$4);
	}
	_onDragMove(e$4) {
		let t$5 = this._drags.get(e$4);
		if (!(!t$5 || t$5.isEnded)) {
			if (this._emitter.listenerCount(l.Move)) {
				let t$6 = this._getTargets(e$4);
				this._emitter.emit(l.Move, {
					draggable: e$4,
					targets: t$6
				});
			}
			this._emitCollisions(e$4);
		}
	}
	_onDragEnd(e$4) {
		this._stopDrag(e$4);
	}
	_onDragCancel(e$4) {
		this._stopDrag(e$4, !0);
	}
	_onDraggableDestroy(e$4) {
		this.removeDraggables([e$4]);
	}
	_stopDrag(e$4, t$5 = !1) {
		let n$7 = this._drags.get(e$4);
		if (!n$7 || n$7.isEnded) return !1;
		n$7.isEnded = !0;
		let r$3 = n$7._cd.phase === s$1.Emitting;
		r$3 || (this._computeCollisions(e$4, !0), this._emitCollisions(e$4, !0));
		let { targets: i$4, collisions: a$3, contacts: o$2 } = n$7._cd;
		return this._emitter.listenerCount(l.End) && this._emitter.emit(l.End, {
			canceled: t$5,
			draggable: e$4,
			targets: i$4,
			collisions: a$3,
			contacts: o$2
		}), r$3 ? (window.queueMicrotask(() => {
			this._finalizeStopDrag(e$4);
		}), !0) : (this._finalizeStopDrag(e$4), !1);
	}
	_finalizeStopDrag(n$7) {
		let r$3 = this._drags.get(n$7);
		!r$3 || !r$3.isEnded || (this._drags.delete(n$7), this._collisionDetector.removeCollisionDataPool(n$7), n$2.off(t.read, r$3._cd.tickerId), n$2.off(t.write, r$3._cd.tickerId), this._drags.size || (n$2.off(t.read, this._listenerId), window.removeEventListener(`scroll`, this._onScroll, c$1)));
	}
	_computeCollisions(e$4, t$5 = !1) {
		let n$7 = this._drags.get(e$4);
		if (!n$7 || !t$5 && n$7.isEnded) return;
		let r$3 = n$7._cd;
		switch (r$3.phase) {
			case s$1.Computing: throw Error(`Collisions are being computed.`);
			case s$1.Emitting: throw Error(`Collisions are being emitted.`);
			default: break;
		}
		r$3.phase = s$1.Computing, r$3.targets = this._getTargets(e$4), this._collisionDetector.detectCollisions(e$4, r$3.targets, r$3.collisions), r$3.phase = s$1.Computed;
	}
	_emitCollisions(e$4, t$5 = !1) {
		let n$7 = this._drags.get(e$4);
		if (!n$7 || !t$5 && n$7.isEnded) return;
		let r$3 = n$7._cd;
		switch (r$3.phase) {
			case s$1.Computing: throw Error(`Collisions are being computed.`);
			case s$1.Emitting: throw Error(`Collisions are being emitted.`);
			case s$1.Idle: return;
			default: break;
		}
		r$3.phase = s$1.Emitting;
		let i$4 = this._emitter, a$3 = r$3.collisions, o$2 = r$3.targets, c$3 = r$3.addedContacts, u$4 = r$3.persistedContacts, d$1 = r$3.contacts, f$1 = r$3.prevContacts;
		r$3.prevContacts = d$1, r$3.contacts = f$1;
		let p$1 = d$1;
		c$3.clear(), u$4.clear(), f$1.clear();
		for (let e$5 of a$3) {
			let t$6 = o$2.get(e$5.droppableId);
			t$6 && (f$1.add(t$6), d$1.has(t$6) ? (u$4.add(t$6), d$1.delete(t$6)) : c$3.add(t$6));
		}
		d$1.size && i$4.listenerCount(l.Leave) && i$4.emit(l.Leave, {
			draggable: e$4,
			targets: o$2,
			collisions: a$3,
			contacts: f$1,
			removedContacts: p$1
		}), c$3.size && i$4.listenerCount(l.Enter) && i$4.emit(l.Enter, {
			draggable: e$4,
			targets: o$2,
			collisions: a$3,
			contacts: f$1,
			addedContacts: c$3
		}), i$4.listenerCount(l.Collide) && (f$1.size || p$1.size) && i$4.emit(l.Collide, {
			draggable: e$4,
			targets: o$2,
			collisions: a$3,
			contacts: f$1,
			addedContacts: c$3,
			removedContacts: p$1,
			persistedContacts: u$4
		}), c$3.clear(), u$4.clear(), d$1.clear(), r$3.phase = s$1.Idle;
	}
	on(e$4, t$5, n$7) {
		return this._emitter.on(e$4, t$5, n$7);
	}
	off(e$4, t$5) {
		this._emitter.off(e$4, t$5);
	}
	updateDroppableClientRects() {
		for (let e$4 of this.droppables.values()) e$4.updateClientRect();
	}
	clearTargets(e$4) {
		if (e$4) {
			let t$5 = this._drags.get(e$4);
			t$5 && (t$5._targets = null);
		} else for (let e$5 of this._drags.values()) e$5._targets = null;
	}
	detectCollisions(n$7) {
		if (!this.isDestroyed) if (n$7) {
			let r$3 = this._drags.get(n$7);
			if (!r$3 || r$3.isEnded) return;
			n$2.once(t.read, () => this._computeCollisions(n$7), r$3._cd.tickerId), n$2.once(t.write, () => this._emitCollisions(n$7), r$3._cd.tickerId);
		} else for (let [n$8, r$3] of this._drags) r$3.isEnded || (n$2.once(t.read, () => this._computeCollisions(n$8), r$3._cd.tickerId), n$2.once(t.write, () => this._emitCollisions(n$8), r$3._cd.tickerId));
	}
	addDraggables(e$4) {
		if (this.isDestroyed) return;
		let t$5 = /* @__PURE__ */ new Set();
		for (let n$7 of e$4) this.draggables.has(n$7.id) || (t$5.add(n$7), this.draggables.set(n$7.id, n$7), n$7.on(R.PrepareStart, () => {
			this._onDragPrepareStart(n$7);
		}, this._listenerId), n$7.on(R.Start, () => {
			this._onDragStart(n$7);
		}, this._listenerId), n$7.on(R.PrepareMove, () => {
			this._onDragPrepareMove(n$7);
		}, this._listenerId), n$7.on(R.Move, () => {
			this._onDragMove(n$7);
		}, this._listenerId), n$7.on(R.End, (e$5) => {
			e$5?.type === e.End ? this._onDragEnd(n$7) : e$5?.type === e.Cancel && this._onDragCancel(n$7);
		}, this._listenerId), n$7.on(R.Destroy, () => {
			this._onDraggableDestroy(n$7);
		}, this._listenerId));
		if (t$5.size) {
			this._emitter.listenerCount(l.AddDraggables) && this._emitter.emit(l.AddDraggables, { draggables: t$5 });
			for (let e$5 of t$5) if (!this.isDestroyed && e$5.drag && !e$5.drag.isEnded) {
				let t$6 = e$5._startPhase;
				t$6 >= 2 && this._onDragPrepareStart(e$5), t$6 >= 4 && this._onDragStart(e$5);
			}
		}
	}
	removeDraggables(e$4) {
		if (this.isDestroyed) return;
		let t$5 = /* @__PURE__ */ new Set();
		for (let n$7 of e$4) this.draggables.has(n$7.id) && (t$5.add(n$7), this.draggables.delete(n$7.id), n$7.off(R.PrepareStart, this._listenerId), n$7.off(R.Start, this._listenerId), n$7.off(R.PrepareMove, this._listenerId), n$7.off(R.Move, this._listenerId), n$7.off(R.End, this._listenerId), n$7.off(R.Destroy, this._listenerId));
		for (let e$5 of t$5) this._stopDrag(e$5, !0);
		this._emitter.listenerCount(l.RemoveDraggables) && this._emitter.emit(l.RemoveDraggables, { draggables: t$5 });
	}
	addDroppables(e$4) {
		if (this.isDestroyed) return;
		let t$5 = /* @__PURE__ */ new Set();
		for (let n$7 of e$4) this.droppables.has(n$7.id) || (t$5.add(n$7), this.droppables.set(n$7.id, n$7), n$7.on(t$2.Destroy, () => {
			this.removeDroppables([n$7]);
		}, this._listenerId), this._drags.forEach(({ _targets: e$5 }, t$6) => {
			e$5 && this._isMatch(t$6, n$7) && (e$5.set(n$7.id, n$7), this.detectCollisions(t$6));
		}));
		t$5.size && this._emitter.listenerCount(l.AddDroppables) && this._emitter.emit(l.AddDroppables, { droppables: t$5 });
	}
	removeDroppables(e$4) {
		if (this.isDestroyed) return;
		let t$5 = /* @__PURE__ */ new Set();
		for (let n$7 of e$4) this.droppables.has(n$7.id) && (this.droppables.delete(n$7.id), t$5.add(n$7), n$7.off(t$2.Destroy, this._listenerId), this._drags.forEach(({ _targets: e$5 }, t$6) => {
			e$5 && e$5.has(n$7.id) && (e$5.delete(n$7.id), this.detectCollisions(t$6));
		}));
		t$5.size && this._emitter.listenerCount(l.RemoveDroppables) && this._emitter.emit(l.RemoveDroppables, { droppables: t$5 });
	}
	destroy() {
		if (this.isDestroyed) return;
		this.isDestroyed = !0, this.draggables.forEach((e$5) => {
			e$5.off(R.PrepareStart, this._listenerId), e$5.off(R.Start, this._listenerId), e$5.off(R.PrepareMove, this._listenerId), e$5.off(R.Move, this._listenerId), e$5.off(R.End, this._listenerId), e$5.off(R.Destroy, this._listenerId);
		}), this.droppables.forEach((e$5) => {
			e$5.off(t$2.Destroy, this._listenerId);
		});
		let e$4 = this._drags.keys();
		for (let t$5 of e$4) this._stopDrag(t$5, !0);
		this._emitter.emit(l.Destroy), this._emitter.off(), this._collisionDetector.destroy(), this.draggables.clear(), this.droppables.clear();
	}
};

//#endregion
//#region ../dragdoll/dist/pointer-sensor-CyG2cFYy.js
function i$2(e$4, t$5) {
	if (`pointerId` in e$4) return e$4.pointerId === t$5 ? e$4 : null;
	if (`changedTouches` in e$4) {
		let n$7 = 0;
		for (; n$7 < e$4.changedTouches.length; n$7++) if (e$4.changedTouches[n$7].identifier === t$5) return e$4.changedTouches[n$7];
		return null;
	}
	return e$4;
}
function a$1(e$4) {
	return `pointerId` in e$4 ? e$4.pointerId : `changedTouches` in e$4 ? e$4.changedTouches[0] ? e$4.changedTouches[0].identifier : null : -1;
}
function o(e$4) {
	return `pointerType` in e$4 ? e$4.pointerType : `touches` in e$4 ? `touch` : `mouse`;
}
function s(e$4 = {}) {
	let { capture: t$5 = !0, passive: n$7 = !0 } = e$4;
	return {
		capture: t$5,
		passive: n$7
	};
}
function c(n$7) {
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
	constructor(e$4, t$5 = {}) {
		let { listenerOptions: n$7 = {}, sourceEvents: i$4 = `auto`, startPredicate: a$3 = (e$5) => !(`button` in e$5 && e$5.button > 0) } = t$5;
		this.element = e$4, this.drag = null, this.isDestroyed = !1, this._areWindowListenersBound = !1, this._startPredicate = a$3, this._listenerOptions = s(n$7), this._sourceEvents = c(i$4), this._emitter = new v(), this._onStart = this._onStart.bind(this), this._onMove = this._onMove.bind(this), this._onCancel = this._onCancel.bind(this), this._onEnd = this._onEnd.bind(this), e$4.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions);
	}
	_getTrackedPointerEventData(e$4) {
		return this.drag ? i$2(e$4, this.drag.pointerId) : null;
	}
	_onStart(e$4) {
		if (this.isDestroyed || this.drag || !this._startPredicate(e$4)) return;
		let t$5 = a$1(e$4);
		if (t$5 === null) return;
		let r$3 = i$2(e$4, t$5);
		if (r$3 === null) return;
		let s$3 = {
			pointerId: t$5,
			pointerType: o(e$4),
			x: r$3.clientX,
			y: r$3.clientY
		};
		this.drag = s$3;
		let c$3 = {
			...s$3,
			type: e.Start,
			srcEvent: e$4,
			target: r$3.target
		};
		this._emitter.emit(c$3.type, c$3), this.drag && this._bindWindowListeners();
	}
	_onMove(e$4) {
		if (!this.drag) return;
		let t$5 = this._getTrackedPointerEventData(e$4);
		if (!t$5) return;
		this.drag.x = t$5.clientX, this.drag.y = t$5.clientY;
		let r$3 = {
			type: e.Move,
			srcEvent: e$4,
			target: t$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3);
	}
	_onCancel(e$4) {
		if (!this.drag) return;
		let t$5 = this._getTrackedPointerEventData(e$4);
		if (!t$5) return;
		this.drag.x = t$5.clientX, this.drag.y = t$5.clientY;
		let r$3 = {
			type: e.Cancel,
			srcEvent: e$4,
			target: t$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_onEnd(e$4) {
		if (!this.drag) return;
		let t$5 = this._getTrackedPointerEventData(e$4);
		if (!t$5) return;
		this.drag.x = t$5.clientX, this.drag.y = t$5.clientY;
		let r$3 = {
			type: e.End,
			srcEvent: e$4,
			target: t$5.target,
			...this.drag
		};
		this._emitter.emit(r$3.type, r$3), this._resetDrag();
	}
	_bindWindowListeners() {
		if (this._areWindowListenersBound) return;
		let { move: e$4, end: t$5, cancel: n$7 } = l$1[this._sourceEvents];
		window.addEventListener(e$4, this._onMove, this._listenerOptions), window.addEventListener(t$5, this._onEnd, this._listenerOptions), n$7 && window.addEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !0;
	}
	_unbindWindowListeners() {
		if (this._areWindowListenersBound) {
			let { move: e$4, end: t$5, cancel: n$7 } = l$1[this._sourceEvents];
			window.removeEventListener(e$4, this._onMove, this._listenerOptions), window.removeEventListener(t$5, this._onEnd, this._listenerOptions), n$7 && window.removeEventListener(n$7, this._onCancel, this._listenerOptions), this._areWindowListenersBound = !1;
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
		let { listenerOptions: t$5, sourceEvents: n$7, startPredicate: r$3 } = e$4, i$4 = c(n$7), a$3 = s(t$5);
		r$3 && this._startPredicate !== r$3 && (this._startPredicate = r$3), (t$5 && (this._listenerOptions.capture !== a$3.capture || this._listenerOptions.passive === a$3.passive) || n$7 && this._sourceEvents !== i$4) && (this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions), this._unbindWindowListeners(), this.cancel(), n$7 && (this._sourceEvents = i$4), t$5 && a$3 && (this._listenerOptions = a$3), this.element.addEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
	on(e$4, t$5, n$7) {
		return this._emitter.on(e$4, t$5, n$7);
	}
	off(e$4, t$5) {
		this._emitter.off(e$4, t$5);
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.cancel(), this._emitter.emit(e.Destroy, { type: e.Destroy }), this._emitter.off(), this.element.removeEventListener(l$1[this._sourceEvents].start, this._onStart, this._listenerOptions));
	}
};

//#endregion
//#region ../dragdoll/dist/base-sensor-6CQrwFkA.js
var n$3 = class {
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
	_start(t$5) {
		this.isDestroyed || this.drag || (this.drag = this._createDragData(t$5), this._emitter.emit(e.Start, t$5));
	}
	_move(t$5) {
		this.drag && (this._updateDragData(t$5), this._emitter.emit(e.Move, t$5));
	}
	_end(t$5) {
		this.drag && (this._updateDragData(t$5), this._emitter.emit(e.End, t$5), this._resetDragData());
	}
	_cancel(t$5) {
		this.drag && (this._updateDragData(t$5), this._emitter.emit(e.Cancel, t$5), this._resetDragData());
	}
	on(e$4, t$5, n$7) {
		return this._emitter.on(e$4, t$5, n$7);
	}
	off(e$4, t$5) {
		this._emitter.off(e$4, t$5);
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
//#region ../dragdoll/dist/base-motion-sensor-BbLuAcN2.js
var i = class extends n$3 {
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
	_start(n$7) {
		this.isDestroyed || this.drag || (super._start(n$7), n$2.on(t.read, this._tick, this._tick));
	}
	_end(n$7) {
		this.drag && (n$2.off(t.read, this._tick), super._end(n$7));
	}
	_cancel(n$7) {
		this.drag && (n$2.off(t.read, this._tick), super._cancel(n$7));
	}
	_tick(e$4) {
		if (this.drag) if (e$4 && this.drag.time) {
			this.drag.deltaTime = e$4 - this.drag.time, this.drag.time = e$4;
			let t$5 = {
				type: `tick`,
				time: this.drag.time,
				deltaTime: this.drag.deltaTime
			};
			if (this._emitter.emit(`tick`, t$5), !this.drag) return;
			let r$3 = this._speed * (this.drag.deltaTime / 1e3), i$4 = this._direction.x * r$3, a$3 = this._direction.y * r$3;
			(i$4 || a$3) && this._move({
				type: e.Move,
				x: this.drag.x + i$4,
				y: this.drag.y + a$3
			});
		} else this.drag.time = e$4, this.drag.deltaTime = 0;
	}
};

//#endregion
//#region ../dragdoll/dist/keyboard-motion-sensor-MJpXsP3y.js
const n$1 = [
	`start`,
	`cancel`,
	`end`,
	`moveLeft`,
	`moveRight`,
	`moveUp`,
	`moveDown`
];
function r(e$4, t$5) {
	if (!e$4.size || !t$5.size) return Infinity;
	let n$7 = Infinity;
	for (let r$3 of e$4) {
		let e$5 = t$5.get(r$3);
		e$5 !== void 0 && e$5 < n$7 && (n$7 = e$5);
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
	startPredicate: (e$4, t$5) => {
		if (t$5.element && document.activeElement === t$5.element) {
			let { left: e$5, top: n$7 } = t$5.element.getBoundingClientRect();
			return {
				x: e$5,
				y: n$7
			};
		}
		return null;
	}
};
var a = class extends i {
	constructor(e$4, t$5 = {}) {
		super();
		let { startPredicate: n$7 = i$1.startPredicate, computeSpeed: r$3 = i$1.computeSpeed, cancelOnVisibilityChange: a$3 = i$1.cancelOnVisibilityChange, cancelOnBlur: o$2 = i$1.cancelOnBlur, startKeys: s$3 = i$1.startKeys, moveLeftKeys: c$3 = i$1.moveLeftKeys, moveRightKeys: l$4 = i$1.moveRightKeys, moveUpKeys: u$4 = i$1.moveUpKeys, moveDownKeys: d$1 = i$1.moveDownKeys, cancelKeys: f$1 = i$1.cancelKeys, endKeys: p$1 = i$1.endKeys } = t$5;
		this.element = e$4, this._startKeys = new Set(s$3), this._cancelKeys = new Set(f$1), this._endKeys = new Set(p$1), this._moveLeftKeys = new Set(c$3), this._moveRightKeys = new Set(l$4), this._moveUpKeys = new Set(u$4), this._moveDownKeys = new Set(d$1), this._moveKeys = new Set([
			...c$3,
			...l$4,
			...u$4,
			...d$1
		]), this._moveKeyTimestamps = /* @__PURE__ */ new Map(), this._cancelOnBlur = o$2, this._cancelOnVisibilityChange = a$3, this._computeSpeed = r$3, this._startPredicate = n$7, this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onTick = this._onTick.bind(this), this._internalCancel = this._internalCancel.bind(this), this._blurCancelHandler = this._blurCancelHandler.bind(this), this.on(`tick`, this._onTick, this._onTick), document.addEventListener(`keydown`, this._onKeyDown), document.addEventListener(`keyup`, this._onKeyUp), o$2 && e$4?.addEventListener(`blur`, this._blurCancelHandler), a$3 && document.addEventListener(`visibilitychange`, this._internalCancel);
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
		let e$4 = r(this._moveLeftKeys, this._moveKeyTimestamps), t$5 = r(this._moveRightKeys, this._moveKeyTimestamps), n$7 = r(this._moveUpKeys, this._moveKeyTimestamps), i$4 = r(this._moveDownKeys, this._moveKeyTimestamps), a$3 = e$4 === t$5 ? 0 : e$4 < t$5 ? -1 : 1, o$2 = n$7 === i$4 ? 0 : n$7 < i$4 ? -1 : 1;
		if (!(a$3 === 0 || o$2 === 0)) {
			let e$5 = 1 / (Math.sqrt(a$3 * a$3 + o$2 * o$2) || 1);
			a$3 *= e$5, o$2 *= e$5;
		}
		this._direction.x = a$3, this._direction.y = o$2;
	}
	_onTick() {
		this._speed = this._computeSpeed(this);
	}
	_onKeyUp(e$4) {
		this._moveKeyTimestamps.get(e$4.key) && (this._moveKeyTimestamps.delete(e$4.key), this._updateDirection());
	}
	_onKeyDown(t$5) {
		if (!this.drag) {
			if (this._startKeys.has(t$5.key)) {
				let n$7 = this._startPredicate(t$5, this);
				n$7 && (t$5.preventDefault(), this._start({
					type: e.Start,
					x: n$7.x,
					y: n$7.y
				}));
			}
			return;
		}
		if (this._cancelKeys.has(t$5.key)) {
			t$5.preventDefault(), this._internalCancel();
			return;
		}
		if (this._endKeys.has(t$5.key)) {
			t$5.preventDefault(), this._end({
				type: e.End,
				x: this.drag.x,
				y: this.drag.y
			});
			return;
		}
		if (this._moveKeys.has(t$5.key)) {
			t$5.preventDefault(), this._moveKeyTimestamps.get(t$5.key) || (this._moveKeyTimestamps.set(t$5.key, Date.now()), this._updateDirection());
			return;
		}
	}
	updateSettings(e$4 = {}) {
		let t$5 = !1, { cancelOnBlur: r$3, cancelOnVisibilityChange: i$4, startPredicate: a$3, computeSpeed: o$2 } = e$4;
		if (r$3 !== void 0 && this._cancelOnBlur !== r$3 && (this._cancelOnBlur = r$3, r$3 ? this.element?.addEventListener(`blur`, this._blurCancelHandler) : this.element?.removeEventListener(`blur`, this._blurCancelHandler)), i$4 !== void 0 && this._cancelOnVisibilityChange !== i$4 && (this._cancelOnVisibilityChange = i$4, i$4 ? document.addEventListener(`visibilitychange`, this._internalCancel) : document.removeEventListener(`visibilitychange`, this._internalCancel)), a$3 !== void 0 && (this._startPredicate = a$3), o$2 !== void 0 && (this._computeSpeed = o$2), n$1.forEach((n$7, r$4) => {
			let i$5 = `${n$7}Keys`, a$4 = e$4[i$5];
			a$4 !== void 0 && (this[`_${i$5}`] = new Set(a$4), r$4 >= 3 && (t$5 = !0));
		}), t$5) {
			let e$5 = [
				...this._moveLeftKeys,
				...this._moveRightKeys,
				...this._moveUpKeys,
				...this._moveDownKeys
			];
			[...this._moveKeys].every((t$6, n$7) => e$5[n$7] === t$6) || (this._moveKeys = new Set(e$5), this._moveKeyTimestamps.clear(), this._updateDirection());
		}
	}
	destroy() {
		this.isDestroyed || (super.destroy(), this.off(`tick`, this._onTick), document.removeEventListener(`keydown`, this._onKeyDown), document.removeEventListener(`keyup`, this._onKeyUp), this._cancelOnBlur && this.element?.removeEventListener(`blur`, this._blurCancelHandler), this._cancelOnVisibilityChange && document.removeEventListener(`visibilitychange`, this._internalCancel));
	}
};

//#endregion
//#region examples/011-dnd-basic/index.ts
let zIndex = 0;
const dndContext = new u();
const draggableElements = [...document.querySelectorAll(".draggable")];
[...document.querySelectorAll(".droppable")].forEach((element) => {
	const droppable = new n(element);
	droppable.data.overIds = /* @__PURE__ */ new Set();
	droppable.data.droppedIds = /* @__PURE__ */ new Set();
	dndContext.addDroppables([droppable]);
});
draggableElements.forEach((element) => {
	const draggable = new B([new u$1(element), new a(element)], {
		elements: () => [element],
		startPredicate: () => !element.classList.contains("dragging"),
		onStart: () => {
			element.classList.add("dragging");
			element.style.zIndex = `${++zIndex}`;
		},
		onEnd: () => {
			element.classList.remove("dragging");
		}
	});
	dndContext.addDraggables([draggable]);
});
dndContext.on(l.Start, (data) => {
	const { draggable, targets } = data;
	targets.forEach((droppable) => {
		droppable.data.droppedIds.delete(draggable.id);
		if (droppable.data.droppedIds.size === 0) droppable.element.classList.remove("draggable-dropped");
	});
});
dndContext.on(l.Collide, (data) => {
	const { draggable, contacts, removedContacts } = data;
	removedContacts.forEach((target) => {
		target.data.overIds.delete(draggable.id);
		if (target.data.overIds.size === 0) target.element.classList.remove("draggable-over");
	});
	let i$4 = 0;
	for (const droppable of contacts) {
		if (i$4 === 0) {
			droppable.data.overIds.add(draggable.id);
			droppable.element.classList.add("draggable-over");
		} else {
			droppable.data.overIds.delete(draggable.id);
			if (droppable.data.overIds.size === 0) droppable.element.classList.remove("draggable-over");
		}
		++i$4;
	}
});
dndContext.on(l.End, (data) => {
	const { draggable, contacts } = data;
	for (const droppable of contacts) {
		droppable.data.droppedIds.add(draggable.id);
		droppable.element.classList.add("draggable-dropped");
		droppable.data.overIds.delete(draggable.id);
		if (droppable.data.overIds.size === 0) droppable.element.classList.remove("draggable-over");
		return;
	}
});

//#endregion
});