'use strict';
var SolidExample_010_draggable_start_threshold = (() => {
  var pn = Object.defineProperty;
  var mn = (e, t, n) =>
    t in e ? pn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => mn(e, typeof t != 'symbol' ? t + '' : t, n);
  var S = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return gt(this.context.count);
    },
    getNextContextId() {
      return gt(this.context.count++);
    },
  };
  function gt(e) {
    let t = String(e),
      n = t.length - 1;
    return S.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Be(e) {
    S.context = e;
  }
  function yn() {
    return { ...S.context, id: S.getNextContextId(), count: 0 };
  }
  var vn = !1,
    bn = (e, t) => e === t;
  var Ce = { equals: bn },
    pt = null,
    bt = Dt,
    L = 1,
    ue = 2,
    _t = { owned: null, cleanups: null, context: null, owner: null };
  var p = null,
    u = null,
    de = null,
    ie = null,
    b = null,
    w = null,
    C = null,
    Oe = 0;
  function St(e, t) {
    let n = b,
      r = p,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? _t : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => k(() => Z(o)));
    ((p = o), (b = null));
    try {
      return Y(a, !0);
    } finally {
      ((b = n), (p = r));
    }
  }
  function R(e, t) {
    t = t ? Object.assign({}, Ce, t) : Ce;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (u && u.running && u.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Ct(n, s)
      );
    return [Et.bind(n), r];
  }
  function J(e, t, n) {
    let r = We(e, t, !1, L);
    de && u && u.running ? w.push(r) : he(r);
  }
  function F(e, t, n) {
    bt = En;
    let r = We(e, t, !1, L),
      s = Ve && qe(Ve);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), C ? C.push(r) : he(r));
  }
  function D(e, t, n) {
    n = n ? Object.assign({}, Ce, n) : Ce;
    let r = We(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      de && u && u.running ? ((r.tState = L), w.push(r)) : he(r),
      Et.bind(r)
    );
  }
  function wt(e) {
    return Y(e, !1);
  }
  function k(e) {
    if (!ie && b === null) return e();
    let t = b;
    b = null;
    try {
      return ie ? ie.untrack(e) : e();
    } finally {
      b = t;
    }
  }
  function G(e) {
    return (p === null || (p.cleanups === null ? (p.cleanups = [e]) : p.cleanups.push(e)), e);
  }
  function _n(e) {
    if (u && u.running) return (e(), u.done);
    let t = b,
      n = p;
    return Promise.resolve().then(() => {
      ((b = t), (p = n));
      let r;
      return (
        (de || Ve) &&
          ((r =
            u ||
            (u = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          r.done || (r.done = new Promise((s) => (r.resolve = s))),
          (r.running = !0)),
        Y(e, !1),
        (b = p = null),
        r ? r.done : void 0
      );
    });
  }
  var [tr, mt] = R(!1);
  function xt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Dn(n), defaultValue: e };
  }
  function qe(e) {
    let t;
    return p && p.context && (t = p.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function Sn(e) {
    let t = D(e),
      n = D(() => je(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var Ve;
  function Et() {
    let e = u && u.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === L) he(this);
      else {
        let t = w;
        ((w = null), Y(() => De(this), !1), (w = t));
      }
    if (b) {
      let t = this.observers ? this.observers.length : 0;
      (b.sources
        ? (b.sources.push(this), b.sourceSlots.push(t))
        : ((b.sources = [this]), (b.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(b), this.observerSlots.push(b.sources.length - 1))
          : ((this.observers = [b]), (this.observerSlots = [b.sources.length - 1])));
    }
    return e && u.sources.has(this) ? this.tValue : this.value;
  }
  function Ct(e, t, n) {
    let r = u && u.running && u.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (u) {
        let s = u.running;
        ((s || (!n && u.sources.has(e))) && (u.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        Y(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = u && u.running;
            (o && u.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? w.push(i) : C.push(i), i.observers && Ot(i)),
              o ? (i.tState = L) : (i.state = L));
          }
          if (w.length > 1e6) throw ((w = []), new Error());
        }, !1);
    }
    return t;
  }
  function he(e) {
    if (!e.fn) return;
    Z(e);
    let t = Oe;
    (yt(e, u && u.running && u.sources.has(e) ? e.tValue : e.value, t),
      u &&
        !u.running &&
        u.sources.has(e) &&
        queueMicrotask(() => {
          Y(() => {
            (u && (u.running = !0), (b = p = e), yt(e, e.tValue, t), (b = p = null));
          }, !1);
        }));
  }
  function yt(e, t, n) {
    let r,
      s = p,
      i = b;
    b = p = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (u && u.running
            ? ((e.tState = L), e.tOwned && e.tOwned.forEach(Z), (e.tOwned = void 0))
            : ((e.state = L), e.owned && e.owned.forEach(Z), (e.owned = null))),
        (e.updatedAt = n + 1),
        ze(o)
      );
    } finally {
      ((b = i), (p = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Ct(e, r, !0)
        : u && u.running && e.pure
          ? (u.sources.has(e) || (e.value = r), u.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function We(e, t, n, r = L, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: p,
      context: p ? p.context : null,
      pure: n,
    };
    if (
      (u && u.running && ((i.state = 0), (i.tState = r)),
      p === null ||
        (p !== _t &&
          (u && u.running && p.pure
            ? p.tOwned
              ? p.tOwned.push(i)
              : (p.tOwned = [i])
            : p.owned
              ? p.owned.push(i)
              : (p.owned = [i]))),
      ie && i.fn)
    ) {
      let o = i.fn,
        [a, l] = R(void 0, { equals: !1 }),
        f = ie.factory(o, l);
      G(() => f.dispose());
      let c,
        h = () =>
          _n(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (g) => (a(), u && u.running ? (c || (c = ie.factory(o, h)), c.track(g)) : f.track(g));
    }
    return i;
  }
  function fe(e) {
    let t = u && u.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === ue) return De(e);
    if (e.suspense && k(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Oe); ) {
      if (t && u.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (u.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === L) he(e);
      else if ((t ? e.tState : e.state) === ue) {
        let s = w;
        ((w = null), Y(() => De(e, n[0]), !1), (w = s));
      }
    }
  }
  function Y(e, t) {
    if (w) return e();
    let n = !1;
    (t || (w = []), C ? (n = !0) : (C = []), Oe++);
    try {
      let r = e();
      return (wn(n), r);
    } catch (r) {
      (n || (C = null), (w = null), ze(r));
    }
  }
  function wn(e) {
    if ((w && (de && u && u.running ? xn(w) : Dt(w), (w = null)), e)) return;
    let t;
    if (u) {
      if (!u.promises.size && !u.queue.size) {
        let r = u.sources,
          s = u.disposed;
        (C.push.apply(C, u.effects), (t = u.resolve));
        for (let i of C) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((u = null),
          Y(() => {
            for (let i of s) Z(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) Z(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            mt(!1);
          }, !1));
      } else if (u.running) {
        ((u.running = !1), u.effects.push.apply(u.effects, C), (C = null), mt(!0));
        return;
      }
    }
    let n = C;
    ((C = null), n.length && Y(() => bt(n), !1), t && t());
  }
  function Dt(e) {
    for (let t = 0; t < e.length; t++) fe(e[t]);
  }
  function xn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = u.queue;
      r.has(n) ||
        (r.add(n),
        de(() => {
          (r.delete(n),
            Y(() => {
              ((u.running = !0), fe(n));
            }, !1),
            u && (u.running = !1));
        }));
    }
  }
  function En(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : fe(r);
    }
    if (S.context) {
      if (S.count) {
        (S.effects || (S.effects = []), S.effects.push(...e.slice(0, n)));
        return;
      }
      Be();
    }
    for (
      S.effects &&
        (S.done || !S.count) &&
        ((e = [...S.effects, ...e]), (n += S.effects.length), delete S.effects),
        t = 0;
      t < n;
      t++
    )
      fe(e[t]);
  }
  function De(e, t) {
    let n = u && u.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === L ? s !== t && (!s.updatedAt || s.updatedAt < Oe) && fe(s) : i === ue && De(s, t);
      }
    }
  }
  function Ot(e) {
    let t = u && u.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = ue) : (r.state = ue),
        r.pure ? w.push(r) : C.push(r),
        r.observers && Ot(r));
    }
  }
  function Z(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        let n = e.sources.pop(),
          r = e.sourceSlots.pop(),
          s = n.observers;
        if (s && s.length) {
          let i = s.pop(),
            o = n.observerSlots.pop();
          r < s.length && ((i.sourceSlots[o] = r), (s[r] = i), (n.observerSlots[r] = o));
        }
      }
    if (e.tOwned) {
      for (t = e.tOwned.length - 1; t >= 0; t--) Z(e.tOwned[t]);
      delete e.tOwned;
    }
    if (u && u.running && e.pure) Mt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) Z(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    u && u.running ? (e.tState = 0) : (e.state = 0);
  }
  function Mt(e, t) {
    if ((t || ((e.tState = 0), u.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Mt(e.owned[n]);
  }
  function Cn(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function vt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      ze(r, (n && n.owner) || null);
    }
  }
  function ze(e, t = p) {
    let n = pt && t && t.context && t.context[pt],
      r = Cn(e);
    if (!n) throw r;
    C
      ? C.push({
          fn() {
            vt(r, n, t);
          },
          state: L,
        })
      : vt(r, n, t);
  }
  function je(e) {
    if (typeof e == 'function' && !e.length) return je(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = je(e[n]);
        Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
      }
      return t;
    }
    return e;
  }
  function Dn(e, t) {
    return function (r) {
      let s;
      return (
        J(
          () => (s = k(() => ((p.context = { ...p.context, [e]: r.value }), Sn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var On = !1;
  function Me(e, t) {
    if (On && S.context) {
      let n = S.context;
      Be(yn());
      let r = k(() => e(t || {}));
      return (Be(n), r);
    }
    return k(() => e(t || {}));
  }
  var Pn = [
      'allowfullscreen',
      'async',
      'alpha',
      'autofocus',
      'autoplay',
      'checked',
      'controls',
      'default',
      'disabled',
      'formnovalidate',
      'hidden',
      'indeterminate',
      'inert',
      'ismap',
      'loop',
      'multiple',
      'muted',
      'nomodule',
      'novalidate',
      'open',
      'playsinline',
      'readonly',
      'required',
      'reversed',
      'seamless',
      'selected',
      'adauctionheaders',
      'browsingtopics',
      'credentialless',
      'defaultchecked',
      'defaultmuted',
      'defaultselected',
      'defer',
      'disablepictureinpicture',
      'disableremoteplayback',
      'preservespitch',
      'shadowrootclonable',
      'shadowrootcustomelementregistry',
      'shadowrootdelegatesfocus',
      'shadowrootserializable',
      'sharedstoragewritable',
    ],
    mr = new Set([
      'className',
      'value',
      'readOnly',
      'noValidate',
      'formNoValidate',
      'isMap',
      'noModule',
      'playsInline',
      'adAuctionHeaders',
      'allowFullscreen',
      'browsingTopics',
      'defaultChecked',
      'defaultMuted',
      'defaultSelected',
      'disablePictureInPicture',
      'disableRemotePlayback',
      'preservesPitch',
      'shadowRootClonable',
      'shadowRootCustomElementRegistry',
      'shadowRootDelegatesFocus',
      'shadowRootSerializable',
      'sharedStorageWritable',
      ...Pn,
    ]);
  function An(e, t, n) {
    let r = n.length,
      s = t.length,
      i = r,
      o = 0,
      a = 0,
      l = t[s - 1].nextSibling,
      f = null;
    for (; o < s || a < i; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[s - 1] === n[i - 1]; ) (s--, i--);
      if (s === o) {
        let c = i < r ? (a ? n[a - 1].nextSibling : n[i - a]) : l;
        for (; a < i; ) e.insertBefore(n[a++], c);
      } else if (i === a) for (; o < s; ) ((!f || !f.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[i - 1] && n[a] === t[s - 1]) {
        let c = t[--s].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--i], c), (t[s] = n[i]));
      } else {
        if (!f) {
          f = new Map();
          let h = a;
          for (; h < i; ) f.set(n[h], h++);
        }
        let c = f.get(t[o]);
        if (c != null)
          if (a < c && c < i) {
            let h = o,
              g = 1,
              y;
            for (; ++h < s && h < i && !((y = f.get(t[h])) == null || y !== c + g); ) g++;
            if (g > c - a) {
              let _ = t[o];
              for (; a < c; ) e.insertBefore(n[a++], _);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function At(e, t, n, r = {}) {
    let s;
    return (
      St((i) => {
        ((s = i), t === document ? e() : Tn(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function Tt(e, t, n, r) {
    let s,
      i = () => {
        let a = r
          ? document.createElementNS('http://www.w3.org/1998/Math/MathML', 'template')
          : document.createElement('template');
        return (
          (a.innerHTML = e),
          n ? a.content.firstChild.firstChild : r ? a.firstChild : a.content.firstChild
        );
      },
      o = t
        ? () => k(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function kt(e, t, n) {
    Xe(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
  }
  function It(e, t) {
    Xe(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Lt(e, t, n) {
    n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
  }
  function Rt(e, t, n) {
    return k(() => e(t, n));
  }
  function Tn(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Pe(e, t, r, n);
    J((s) => Pe(e, t(), s, n), r);
  }
  function Xe(e) {
    return !!S.context && !S.done && (!e || e.isConnected);
  }
  function Pe(e, t, n, r, s) {
    let i = Xe(e);
    if (i) {
      !n && (n = [...e.childNodes]);
      let l = [];
      for (let f = 0; f < n.length; f++) {
        let c = n[f];
        c.nodeType === 8 && c.data.slice(0, 2) === '!$' ? c.remove() : l.push(c);
      }
      n = l;
    }
    for (; typeof n == 'function'; ) n = n();
    if (t === n) return n;
    let o = typeof t,
      a = r !== void 0;
    if (((e = (a && n[0] && n[0].parentNode) || e), o === 'string' || o === 'number')) {
      if (i || (o === 'number' && ((t = t.toString()), t === n))) return n;
      if (a) {
        let l = n[0];
        (l && l.nodeType === 3 ? l.data !== t && (l.data = t) : (l = document.createTextNode(t)),
          (n = oe(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = oe(e, n, r);
    } else {
      if (o === 'function')
        return (
          J(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Pe(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          f = n && Array.isArray(n);
        if (Ye(l, t, n, s)) return (J(() => (n = Pe(e, l, n, r, !0))), () => n);
        if (i) {
          if (!l.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let c = l[0];
          if (c.parentNode !== e) return n;
          let h = [c];
          for (; (c = c.nextSibling) !== r; ) h.push(c);
          return (n = h);
        }
        if (l.length === 0) {
          if (((n = oe(e, n, r)), a)) return n;
        } else f ? (n.length === 0 ? Pt(e, l, r) : An(e, n, l)) : (n && oe(e), Pt(e, l));
        n = l;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = oe(e, n, r, t));
          oe(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Ye(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        f;
      if (!(a == null || a === !0 || a === !1))
        if ((f = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Ye(e, a, l) || s;
        else if (f === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Ye(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
          } else (e.push(a), (s = !0));
        else {
          let c = String(a);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return s;
  }
  function Pt(e, t, n = null) {
    for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
  }
  function oe(e, t, n, r) {
    if (n === void 0) return (e.textContent = '');
    let s = r || document.createTextNode('');
    if (t.length) {
      let i = !1;
      for (let o = t.length - 1; o >= 0; o--) {
        let a = t[o];
        if (s !== a) {
          let l = a.parentNode === e;
          !i && !o ? (l ? e.replaceChild(s, a) : e.insertBefore(s, n)) : l && a.remove();
        } else i = !0;
      }
    } else e.insertBefore(s, n);
    return [s];
  }
  var Ae = !1;
  var ge = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ae = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || ge.ADD),
          (this.getId = e.getId || (() => Symbol())),
          (this._events = new Map()));
      }
      _getListeners(e) {
        let t = this._events.get(e);
        return t ? t.l || (t.l = [...t.m.values()]) : null;
      }
      on(e, t, n) {
        let r = this._events,
          s = r.get(e);
        s || ((s = { m: new Map(), l: null }), r.set(e, s));
        let i = s.m;
        if (((n = n === void 0 ? this.getId(t) : n), i.has(n)))
          switch (this.dedupe) {
            case ge.THROW:
              throw Error('Eventti: duplicate listener id!');
            case ge.IGNORE:
              return n;
            case ge.UPDATE:
              s.l = null;
              break;
            default:
              (i.delete(n), (s.l = null));
          }
        return (i.set(n, t), s.l?.push(t), n);
      }
      once(e, t, n) {
        let r = 0;
        return (
          (n = n === void 0 ? this.getId(t) : n),
          this.on(
            e,
            (...s) => {
              r || ((r = 1), this.off(e, n), t(...s));
            },
            n,
          )
        );
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
        n?.m.delete(t) && ((n.l = null), n.m.size || this._events.delete(e));
      }
      emit(e, ...t) {
        let n = this._getListeners(e);
        if (n) {
          let r = n.length,
            s = 0;
          if (t.length) for (; s < r; s++) n[s](...t);
          else for (; s < r; s++) n[s]();
        }
      }
      listenerCount(e) {
        if (e === void 0) {
          let t = 0;
          return (
            this._events.forEach((n) => {
              t += n.m.size;
            }),
            t
          );
        }
        return this._events.get(e)?.m.size || 0;
      }
    };
  var kn = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new ae({ getId: r, dedupe: n })),
        (this._queue = []),
        (this.tick = this.tick.bind(this)),
        (this._getListeners = this._emitter._getListeners.bind(this._emitter)));
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
      (this._assertEmptyQueue(), this._fillQueue(), this._processQueue(...e));
    }
    on(e, t, n) {
      return this._emitter.on(e, t, n);
    }
    once(e, t, n) {
      return this._emitter.once(e, t, n);
    }
    off(e, t) {
      return this._emitter.off(e, t);
    }
    count(e) {
      return this._emitter.listenerCount(e);
    }
    _assertEmptyQueue() {
      if (this._queue.length)
        throw new Error("Ticker: Can't tick before the previous tick has finished!");
    }
    _fillQueue() {
      let e = this._queue,
        t = this._phases,
        n = this._getListeners,
        r = 0,
        s = t.length,
        i;
      for (; r < s; r++) ((i = n(t[r])), i && e.push(i));
      return e;
    }
    _processQueue(...e) {
      let t = this._queue,
        n = t.length;
      if (!n) return;
      let r = 0,
        s = 0,
        i,
        o;
      for (; r < n; r++) for (i = t[r], s = 0, o = i.length; s < o; s++) i[s](...e);
      t.length = 0;
    }
  };
  function Ge(e = 60) {
    if (typeof requestAnimationFrame == 'function' && typeof cancelAnimationFrame == 'function')
      return (t) => {
        let n = requestAnimationFrame(t);
        return () => cancelAnimationFrame(n);
      };
    {
      let t = 1e3 / e,
        n = typeof performance > 'u' ? () => Date.now() : () => performance.now();
      return (r) => {
        let s = setTimeout(() => r(n()), t);
        return () => clearTimeout(s);
      };
    }
  }
  var Ft = class extends kn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Ge(), ...s } = e;
      (super(s),
        (this._paused = t),
        (this._onDemand = n),
        (this._requestFrame = r),
        (this._cancelFrame = null),
        (this._empty = !0),
        !t && !n && this._request());
    }
    get phases() {
      return this._phases;
    }
    set phases(e) {
      ((this._phases = e), e.length ? ((this._empty = !1), this._request()) : (this._empty = !0));
    }
    get paused() {
      return this._paused;
    }
    set paused(e) {
      ((this._paused = e), e ? this._cancel() : this._request());
    }
    get onDemand() {
      return this._onDemand;
    }
    set onDemand(e) {
      ((this._onDemand = e), e || this._request());
    }
    get requestFrame() {
      return this._requestFrame;
    }
    set requestFrame(e) {
      this._requestFrame !== e &&
        ((this._requestFrame = e), this._cancelFrame && (this._cancel(), this._request()));
    }
    tick(...e) {
      if (
        (this._assertEmptyQueue(),
        (this._cancelFrame = null),
        this._onDemand || this._request(),
        !this._empty)
      ) {
        if (!this._fillQueue().length) {
          this._empty = !0;
          return;
        }
        (this._onDemand && this._request(), this._processQueue(...e));
      }
    }
    on(e, t, n) {
      let r = super.on(e, t, n);
      return ((this._empty = !1), this._request(), r);
    }
    once(e, t, n) {
      let r = super.once(e, t, n);
      return ((this._empty = !1), this._request(), r);
    }
    _request() {
      this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
    }
    _cancel() {
      this._cancelFrame && (this._cancelFrame(), (this._cancelFrame = null));
    }
  };
  var M = { read: Symbol(), write: Symbol() },
    I = new Ft({
      phases: [M.read, M.write],
      requestFrame: typeof window < 'u' ? Ge() : () => () => {},
    });
  var $t = new WeakMap();
  function $(e) {
    let t = $t.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), $t.set(e, new WeakRef(t))), t);
  }
  var In = typeof window < 'u' && window.document !== void 0,
    Ue = !!(
      In &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    pe = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Pr = {
      [pe.content]: !1,
      [pe.padding]: !1,
      [pe.scrollbar]: !0,
      [pe.border]: !0,
      [pe.margin]: !0,
    };
  var Ar = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function Nt(e) {
    return e instanceof Window;
  }
  var Ht = new WeakMap();
  function W(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Ht.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Ht.set(e, new WeakRef(n))), n);
  }
  function Bt(e) {
    return e instanceof HTMLHtmlElement;
  }
  var U = typeof window < 'u' && window.document !== void 0,
    Vt = U && 'ontouchstart' in window,
    jt = U && !!window.PointerEvent;
  U &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var x = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function qt(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Ln(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Rn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Wt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function zt(e) {
    return e === 'auto' || e === void 0 ? (jt ? 'pointer' : Vt ? 'touch' : 'mouse') : e;
  }
  var ee = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    te = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    me = class {
      constructor(e, t = {}) {
        d(this, 'element');
        d(this, 'drag');
        d(this, 'isDestroyed');
        d(this, '_startPredicate');
        d(this, '_listenerOptions');
        d(this, '_sourceEvents');
        d(this, '_areWindowListenersBound');
        d(this, '_emitter');
        d(this, '_eventData', null);
        d(this, '_removeClickBlocker', null);
        d(this, '_cancelOnVisibilityChange');
        d(this, '_cancelOnEscape');
        d(this, '_preventNativeDrag');
        d(this, '_preventContextMenu');
        d(this, '_preventNativeDragHandler', (e) => e.preventDefault());
        d(this, '_preventContextMenuHandler', (e) => e.preventDefault());
        d(this, '_visibilityChangeHandler', () => {
          this.cancel();
        });
        d(this, '_onKeyDown', (e) => {
          e.key === 'Escape' && this.drag && (e.preventDefault(), this.cancel());
        });
        let {
          listenerOptions: n = te.listenerOptions,
          sourceEvents: r = te.sourceEvents,
          startPredicate: s = te.startPredicate,
          cancelOnVisibilityChange: i = te.cancelOnVisibilityChange,
          cancelOnEscape: o = te.cancelOnEscape,
          preventNativeDrag: a = te.preventNativeDrag,
          preventContextMenu: l = te.preventContextMenu,
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._cancelOnVisibilityChange = i ?? !0),
          (this._cancelOnEscape = o ?? !0),
          (this._preventNativeDrag = a ?? !0),
          (this._preventContextMenu = l ?? !1),
          (this._startPredicate = s),
          (this._listenerOptions = Wt(n)),
          (this._sourceEvents = zt(r)),
          (this._emitter = new ae()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(ee[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? qt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Ln(e);
        if (t === null) return;
        let n = qt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Rn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: x.Start, srcEvent: e, target: n.target }),
          this._emitter.emit(this._eventData.type, this._eventData),
          this.drag && this._bindWindowListeners());
      }
      _onMove(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let r = this._getTrackedPointerEventData(e);
        if (!r) return;
        let s = r.clientX,
          i = r.clientY;
        ((t.deltaX = s - t.x),
          (t.deltaY = i - t.y),
          (t.x = s),
          (t.y = i),
          (n.type = x.Move),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = s),
          (n.y = i),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n));
      }
      _onCancel(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let r = this._getTrackedPointerEventData(e);
        if (!r) return;
        let s = r.clientX,
          i = r.clientY;
        ((t.deltaX = s - t.x),
          (t.deltaY = i - t.y),
          (t.x = s),
          (t.y = i),
          (n.type = x.Cancel),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = s),
          (n.y = i),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n),
          this._resetDrag());
      }
      _onEnd(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let r = this._getTrackedPointerEventData(e);
        if (!r) return;
        let s = r.clientX,
          i = r.clientY;
        ((t.deltaX = s - t.x),
          (t.deltaY = i - t.y),
          (t.x = s),
          (t.y = i),
          (n.type = x.End),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = s),
          (n.y = i),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n),
          this._resetDrag());
      }
      _bindWindowListeners() {
        if (this._areWindowListenersBound) return;
        let { move: e, end: t, cancel: n } = ee[this._sourceEvents];
        (window.addEventListener(e, this._onMove, this._listenerOptions),
          window.addEventListener(t, this._onEnd, this._listenerOptions),
          n && window.addEventListener(n, this._onCancel, this._listenerOptions),
          this._cancelOnEscape && document.addEventListener('keydown', this._onKeyDown),
          this._preventNativeDrag &&
            window.addEventListener('dragstart', this._preventNativeDragHandler),
          this._preventContextMenu &&
            window.addEventListener('contextmenu', this._preventContextMenuHandler),
          (this._areWindowListenersBound = !0));
      }
      _unbindWindowListeners() {
        if (this._areWindowListenersBound) {
          let { move: e, end: t, cancel: n } = ee[this._sourceEvents];
          (window.removeEventListener(e, this._onMove, this._listenerOptions),
            window.removeEventListener(t, this._onEnd, this._listenerOptions),
            n && window.removeEventListener(n, this._onCancel, this._listenerOptions),
            this._cancelOnEscape && document.removeEventListener('keydown', this._onKeyDown),
            this._preventNativeDrag &&
              window.removeEventListener('dragstart', this._preventNativeDragHandler),
            this._preventContextMenu &&
              window.removeEventListener('contextmenu', this._preventContextMenuHandler),
            (this._areWindowListenersBound = !1));
        }
      }
      _resetDrag() {
        ((this.drag = null), (this._eventData = null), this._unbindWindowListeners());
      }
      cancel() {
        this.drag &&
          ((this._eventData.type = x.Cancel),
          (this._eventData.srcEvent = null),
          (this._eventData.target = null),
          (this._eventData.x = this.drag.x),
          (this._eventData.y = this.drag.y),
          (this._eventData.deltaX = this.drag.deltaX),
          (this._eventData.deltaY = this.drag.deltaY),
          this._emitter.emit(this._eventData.type, this._eventData),
          this._resetDrag());
      }
      updateElement(e) {
        this.isDestroyed ||
          this.element === e ||
          (this.element.removeEventListener(
            ee[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(ee[this._sourceEvents].start, this._onStart, this._listenerOptions),
          (this.element = e));
      }
      updateSettings(e) {
        if (this.isDestroyed) return;
        let {
            listenerOptions: t,
            sourceEvents: n,
            startPredicate: r,
            cancelOnVisibilityChange: s,
            cancelOnEscape: i,
            preventNativeDrag: o,
            preventContextMenu: a,
          } = e,
          l = zt(n),
          f = Wt(t);
        (r && this._startPredicate !== r && (this._startPredicate = r),
          s !== void 0 &&
            this._cancelOnVisibilityChange !== s &&
            ((this._cancelOnVisibilityChange = s),
            s
              ? document.addEventListener('visibilitychange', this._visibilityChangeHandler)
              : document.removeEventListener('visibilitychange', this._visibilityChangeHandler)),
          i !== void 0 &&
            this._cancelOnEscape !== i &&
            ((this._cancelOnEscape = i),
            this._areWindowListenersBound &&
              (i
                ? document.addEventListener('keydown', this._onKeyDown)
                : document.removeEventListener('keydown', this._onKeyDown))),
          o !== void 0 &&
            this._preventNativeDrag !== o &&
            ((this._preventNativeDrag = o),
            this._areWindowListenersBound &&
              (o
                ? window.addEventListener('dragstart', this._preventNativeDragHandler)
                : window.removeEventListener('dragstart', this._preventNativeDragHandler))),
          a !== void 0 &&
            this._preventContextMenu !== a &&
            ((this._preventContextMenu = a),
            this._areWindowListenersBound &&
              (a
                ? window.addEventListener('contextmenu', this._preventContextMenuHandler)
                : window.removeEventListener('contextmenu', this._preventContextMenuHandler))),
          ((t &&
            (this._listenerOptions.capture !== f.capture ||
              this._listenerOptions.passive !== f.passive)) ||
            (n && this._sourceEvents !== l)) &&
            (this.element.removeEventListener(
              ee[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && f && (this._listenerOptions = f),
            this.element.addEventListener(
              ee[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            )));
      }
      on(e, t, n) {
        return this._emitter.on(e, t, n);
      }
      off(e, t) {
        this._emitter.off(e, t);
      }
      preventClickOnEnd() {
        this._removeClickBlocker?.();
        let e = (t) => {
          t.isTrusted && (t.preventDefault(), t.stopPropagation(), this._removeClickBlocker?.());
        };
        (this.element.addEventListener('click', e, { capture: !0 }),
          (this._removeClickBlocker = () => {
            (this.element.removeEventListener('click', e, !0), (this._removeClickBlocker = null));
          }));
      }
      destroy() {
        this.isDestroyed ||
          ((this.isDestroyed = !0),
          this._removeClickBlocker?.(),
          this.cancel(),
          this._emitter.emit(x.Destroy, { type: x.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            ee[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Fn(e) {
    let t = $(e),
      n = parseFloat(t.height) || 0;
    return (
      t.boxSizing === 'border-box' ||
        ((n += parseFloat(t.borderTopWidth) || 0),
        (n += parseFloat(t.borderBottomWidth) || 0),
        (n += parseFloat(t.paddingTop) || 0),
        (n += parseFloat(t.paddingBottom) || 0),
        e instanceof HTMLElement && (n += e.offsetHeight - e.clientHeight)),
      n
    );
  }
  function $n(e) {
    let t = $(e),
      n = parseFloat(t.width) || 0;
    return (
      t.boxSizing === 'border-box' ||
        ((n += parseFloat(t.borderLeftWidth) || 0),
        (n += parseFloat(t.borderRightWidth) || 0),
        (n += parseFloat(t.paddingLeft) || 0),
        (n += parseFloat(t.paddingRight) || 0),
        e instanceof HTMLElement && (n += e.offsetWidth - e.clientWidth)),
      n
    );
  }
  function re(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = $(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', f] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * $n(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Fn(e)}px`),
        f ? (o += `translate3d(${a},${l},${f})`) : (o += `translate(${a},${l})`));
    }
    if (r && r !== 'none') {
      let a = r.split(' ');
      a.length > 1 ? (o += `rotate3d(${a.join(',')})`) : (o += `rotate(${a.join(',')})`);
    }
    if (s && s !== 'none') {
      let a = s.split(' ');
      a.length === 3 ? (o += `scale3d(${a.join(',')})`) : (o += `scale(${a.join(',')})`);
    }
    return (!t && i && i !== 'none' && (o += i), o);
  }
  function ye(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function Ke(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var se = U ? new DOMMatrix() : null;
  function ve(e, t = new DOMMatrix()) {
    let n = e;
    for (ye(t); n; ) {
      let r = re(n);
      if (r && (se.setMatrixValue(r), !se.isIdentity)) {
        let { transformOrigin: s } = $(n),
          { x: i, y: o, z: a } = Ke(s);
        (a === 0
          ? se.setMatrixValue(`translate(${i}px,${o}px) ${se} translate(${i * -1}px,${o * -1}px)`)
          : se.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${se} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(se));
      }
      n = n.parentElement;
    }
    return t;
  }
  function Te(e) {
    switch (W(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function ke(e) {
    let t = W(e);
    if (!Ue) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: f } = t;
      if (f && f !== 'none') return !0;
      let { willChange: c } = t;
      if (c && (c.indexOf('filter') > -1 || c.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Te(e);
    if (!n) return n;
    let { transform: r } = t;
    if (r && r !== 'none') return !0;
    let { perspective: s } = t;
    if (s && s !== 'none') return !0;
    let { contentVisibility: i } = t;
    if (i && i === 'auto') return !0;
    let { contain: o } = t;
    if (
      o &&
      (o === 'strict' || o === 'content' || o.indexOf('paint') > -1 || o.indexOf('layout') > -1)
    )
      return !0;
    let { willChange: a } = t;
    return (
      !(
        !a ||
        !(a.indexOf('transform') > -1 || a.indexOf('perspective') > -1 || a.indexOf('contain') > -1)
      ) || !!(Ue && a && a.indexOf('filter') > -1)
    );
  }
  function Yt(e) {
    return W(e).position !== 'static' || ke(e);
  }
  function Qe(e, t = {}) {
    if (Bt(e)) return e.ownerDocument.defaultView;
    let n = t.position || W(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = Te(i);
          if (o) return i;
          if (o === null && !r) return null;
          i = i.parentElement;
        }
        return e.ownerDocument.documentElement;
      }
      case 'absolute':
      case 'fixed': {
        let i = n === 'fixed',
          o = s || e.parentElement;
        for (; o; ) {
          let a = i ? ke(o) : Yt(o);
          if (a === !0) return o;
          if (a === null && !r) return null;
          o = o.parentElement;
        }
        return e.ownerDocument.defaultView;
      }
      default:
        return null;
    }
  }
  function Ze(e, t = {}) {
    let n = W(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || W(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return Qe(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = Qe(e, { container: o, position: s, skipDisplayNone: i });
        return Nt(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Nn(e, t) {
    return e.isIdentity && t.isIdentity
      ? !0
      : e.is2D && t.is2D
        ? e.a === t.a && e.b === t.b && e.c === t.c && e.d === t.d && e.e === t.e && e.f === t.f
        : e.m11 === t.m11 &&
          e.m12 === t.m12 &&
          e.m13 === t.m13 &&
          e.m14 === t.m14 &&
          e.m21 === t.m21 &&
          e.m22 === t.m22 &&
          e.m23 === t.m23 &&
          e.m24 === t.m24 &&
          e.m31 === t.m31 &&
          e.m32 === t.m32 &&
          e.m33 === t.m33 &&
          e.m34 === t.m34 &&
          e.m41 === t.m41 &&
          e.m42 === t.m42 &&
          e.m43 === t.m43 &&
          e.m44 === t.m44;
  }
  function Je(e) {
    return (
      e.m11 !== 1 ||
      e.m12 !== 0 ||
      e.m13 !== 0 ||
      e.m14 !== 0 ||
      e.m21 !== 0 ||
      e.m22 !== 1 ||
      e.m23 !== 0 ||
      e.m24 !== 0 ||
      e.m31 !== 0 ||
      e.m32 !== 0 ||
      e.m33 !== 1 ||
      e.m34 !== 0 ||
      e.m43 !== 0 ||
      e.m44 !== 1
    );
  }
  function Xt(e, t, n = null) {
    if ('moveBefore' in e && e.isConnected === t.isConnected)
      try {
        e.moveBefore(t, n);
        return;
      } catch {}
    let r = document.activeElement,
      s = t.contains(r);
    (e.insertBefore(t, n),
      s &&
        document.activeElement !== r &&
        r instanceof HTMLElement &&
        r.focus({ preventScroll: !0 }));
  }
  function Ie(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Gt = class {
      constructor() {
        d(this, '_cache');
        d(this, '_validation');
        ((this._cache = new Map()), (this._validation = new Set()));
      }
      set(e, t) {
        (this._cache.set(e, t), this._validation.add(e));
      }
      get(e) {
        return this._cache.get(e);
      }
      has(e) {
        return this._cache.has(e);
      }
      delete(e) {
        (this._cache.delete(e), this._validation.delete(e));
      }
      isValid(e) {
        return this._validation.has(e);
      }
      invalidate(e) {
        e === void 0 ? this._validation.clear() : this._validation.delete(e);
      }
      clear() {
        (this._cache.clear(), this._validation.clear());
      }
    },
    Qt = class {
      constructor(e, t) {
        d(this, 'sensor');
        d(this, 'startEvent');
        d(this, 'prevMoveEvent');
        d(this, 'moveEvent');
        d(this, 'endEvent');
        d(this, 'items');
        d(this, 'isEnded');
        d(this, '_matrixCache');
        d(this, '_clientOffsetCache');
        ((this.sensor = e),
          (this.startEvent = { ...t }),
          (this.prevMoveEvent = { ...t }),
          (this.moveEvent = { ...t }),
          (this.endEvent = null),
          (this.items = []),
          (this.isEnded = !1),
          (this._matrixCache = new Gt()),
          (this._clientOffsetCache = new Gt()));
      }
    };
  function Hn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function Bn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Hn(
        e,
        {
          display: 'block',
          position: 'absolute',
          inset: '0px',
          padding: '0px',
          margin: '0px',
          border: 'none',
          opacity: '0',
          transform: 'none',
          'transform-origin': '0 0',
          transition: 'none',
          animation: 'none',
          'pointer-events': 'none',
        },
        !0,
      ),
      e
    );
  }
  function _e(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = $(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function Ut(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Vn = { x: 0, y: 0 },
    jn = { x: 0, y: 0 };
  function qn(e, t, n = { x: 0, y: 0 }) {
    let r = Ut(e) ? e : _e(e, Vn),
      s = Ut(t) ? t : _e(t, jn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Le = U ? Bn() : null,
    Zt = class {
      constructor(e, t) {
        d(this, 'data');
        d(this, 'element');
        d(this, 'elementContainer');
        d(this, 'elementOffsetContainer');
        d(this, 'dragContainer');
        d(this, 'dragOffsetContainer');
        d(this, 'elementTransformOrigin');
        d(this, 'elementTransformMatrix');
        d(this, 'elementOffsetMatrix');
        d(this, 'frozenStyles');
        d(this, 'unfrozenStyles');
        d(this, 'clientRect');
        d(this, 'position');
        d(this, 'containerOffset');
        d(this, 'alignmentOffset');
        d(this, '_moveDiff');
        d(this, '_alignDiff');
        d(this, '_matrixCache');
        d(this, '_clientOffsetCache');
        if (!e.isConnected) throw Error('Element is not connected');
        let { drag: n } = t;
        if (!n) throw Error('Drag is not defined');
        let r = $(e),
          s = e.getBoundingClientRect(),
          i = re(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Ke(r.transformOrigin)),
          (this.elementTransformMatrix = new DOMMatrix().setMatrixValue(i + r.transform)),
          (this.elementOffsetMatrix = new DOMMatrix(i).invertSelf()),
          (this.frozenStyles = null),
          (this.unfrozenStyles = null),
          (this.position = { x: 0, y: 0 }),
          (this.containerOffset = { x: 0, y: 0 }),
          (this.alignmentOffset = { x: 0, y: 0 }),
          (this._moveDiff = { x: 0, y: 0 }),
          (this._alignDiff = { x: 0, y: 0 }),
          (this._matrixCache = n._matrixCache),
          (this._clientOffsetCache = n._clientOffsetCache));
        let o = e.parentElement;
        if (!o) throw Error('Dragged element does not have a parent element.');
        this.elementContainer = o;
        let a = t.settings.container,
          l = (typeof a == 'function' ? a({ draggable: t, drag: n, element: e }) : a) || o;
        if (((this.dragContainer = l), o !== l)) {
          let { position: h } = r;
          if (h !== 'fixed' && h !== 'absolute')
            throw Error(
              `Dragged element has "${h}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let f = Ze(e) || e;
        ((this.elementOffsetContainer = f),
          (this.dragOffsetContainer = l === o ? f : Ze(e, { container: l })));
        {
          let { width: h, height: g, x: y, y: _ } = s;
          this.clientRect = { width: h, height: g, x: y, y: _ };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let c = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(c))
          if (c.length) {
            let h = {};
            for (let g of c) h[g] = r[g];
            this.frozenStyles = h;
          } else this.frozenStyles = null;
        else this.frozenStyles = c;
        if (this.frozenStyles) {
          let h = {};
          for (let g in this.frozenStyles) h[g] = e.style[g];
          this.unfrozenStyles = h;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, r] = t;
            (ve(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
          }
        });
      }
      _updateContainerOffset() {
        let {
          elementOffsetContainer: e,
          elementContainer: t,
          dragOffsetContainer: n,
          dragContainer: r,
          containerOffset: s,
          _clientOffsetCache: i,
          _matrixCache: o,
        } = this;
        if (e !== n) {
          let [a, l] = [
            [r, n],
            [t, e],
          ].map(([f, c]) => {
            let h = i.get(c) || { x: 0, y: 0 };
            if (!i.isValid(c)) {
              let g = o.get(f);
              c instanceof HTMLElement && g && !g[0].isIdentity
                ? Je(g[0])
                  ? (Le.style.setProperty('transform', g[1].toString(), 'important'),
                    c.append(Le),
                    _e(Le, h),
                    Le.remove())
                  : (_e(c, h), (h.x -= g[0].m41), (h.y -= g[0].m42))
                : _e(c, h);
            }
            return (i.set(c, h), h);
          });
          qn(a, l, s);
        } else ((s.x = 0), (s.y = 0));
      }
      getContainerMatrix() {
        return this._matrixCache.get(this.elementContainer);
      }
      getDragContainerMatrix() {
        return this._matrixCache.get(this.dragContainer);
      }
      updateSize(e) {
        if (e) ((this.clientRect.width = e.width), (this.clientRect.height = e.height));
        else {
          let { width: t, height: n } = this.element.getBoundingClientRect();
          ((this.clientRect.width = t), (this.clientRect.height = n));
        }
      }
    },
    Kt = { capture: !0, passive: !0 },
    Wn = { x: 0, y: 0 },
    z = U ? new DOMMatrix() : null,
    Re = U ? new DOMMatrix() : null,
    N = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(N || {}),
    H = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(H || {}),
    be = { Start: 'start', Move: 'move', End: 'end' },
    Se = { Immediate: 'immediate', Sampled: 'sampled' },
    K = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    A = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    Jt = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === K.End || t === K.EndAlign,
          [r, s] = e.getContainerMatrix(),
          [i, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: f,
            elementTransformMatrix: c,
            elementTransformOrigin: h,
            elementOffsetMatrix: g,
          } = e,
          { x: y, y: _, z: O } = h,
          P = !c.isIdentity && (y !== 0 || _ !== 0 || O !== 0),
          V = a.x + l.x + f.x,
          X = a.y + l.y + f.y;
        (ye(z),
          P && (O === 0 ? z.translateSelf(-y, -_) : z.translateSelf(-y, -_, -O)),
          n ? s.isIdentity || z.multiplySelf(s) : o.isIdentity || z.multiplySelf(o),
          ye(Re).translateSelf(V, X),
          z.multiplySelf(Re),
          r.isIdentity || z.multiplySelf(r),
          P && (ye(Re).translateSelf(y, _, O), z.multiplySelf(Re)),
          c.isIdentity || z.multiplySelf(c),
          g.isIdentity || z.preMultiplySelf(g),
          (e.element.style.transform = `${z}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Se.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    et = class {
      constructor(e, t = {}) {
        d(this, 'id');
        d(this, '_sensors');
        d(this, 'settings');
        d(this, 'plugins');
        d(this, 'drag');
        d(this, 'isDestroyed');
        d(this, '_sensorData');
        d(this, '_emitter');
        d(this, '_startPhase');
        d(this, '_startId');
        d(this, '_moveId');
        d(this, '_alignId');
        d(this, '_modifierData');
        d(this, '_selectionChangeHandler', null);
        d(this, '_pointerCaptureTarget', null);
        d(this, '_pointerCapturePointerId', null);
        let { id: n = Symbol(), ...r } = t;
        ((this.id = n),
          (this._sensors = e),
          (this.settings = this._parseSettings(r)),
          (this.plugins = {}),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._sensorData = new Map()),
          (this._emitter = new ae()),
          (this._startPhase = N.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: be.Start }),
          (this._onMove = this._onMove.bind(this)),
          (this._onScroll = this._onScroll.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          (this._prepareStart = this._prepareStart.bind(this)),
          (this._applyStart = this._applyStart.bind(this)),
          (this._prepareMove = this._prepareMove.bind(this)),
          (this._applyMove = this._applyMove.bind(this)),
          (this._prepareAlign = this._prepareAlign.bind(this)),
          (this._applyAlign = this._applyAlign.bind(this)),
          this._sensors.forEach((s) => {
            this._bindSensor(s);
          }));
      }
      get sensors() {
        return this._sensors;
      }
      set sensors(e) {
        let t = this._sensors;
        if (e === t) return;
        let n = t.filter((i) => !e.includes(i)),
          r = e.filter((i) => !t.includes(i));
        ((this._sensors = e),
          n.forEach((i) => {
            this._unbindSensor(i);
          }),
          r.forEach((i) => {
            this._bindSensor(i);
          }));
        let s = this.drag?.sensor;
        s && n.includes(s) && this.stop();
      }
      _bindSensor(e) {
        this._sensorData.set(e, {
          predicateState: H.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(x.Start, t, t), e.on(x.Move, t, t), e.on(x.Cancel, n, n), e.on(x.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(x.Start, n),
          e.off(x.Move, n),
          e.off(x.Cancel, r),
          e.off(x.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = Jt) {
        let {
          container: n = t.container,
          startPredicate: r = t.startPredicate,
          elements: s = t.elements,
          frozenStyles: i = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: f = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: g = t.preventTextSelection,
          capturePointer: y = t.capturePointer,
          onPrepareStart: _ = t.onPrepareStart,
          onStart: O = t.onStart,
          onPrepareMove: P = t.onPrepareMove,
          onMove: V = t.onMove,
          onEnd: X = t.onEnd,
          onDestroy: ne = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: s,
          frozenStyles: i,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: l,
          sensorProcessingMode: f,
          dndGroups: c,
          preventClickOnEnd: h,
          preventTextSelection: g,
          capturePointer: y,
          onPrepareStart: _,
          onStart: O,
          onPrepareMove: P,
          onMove: V,
          onEnd: X,
          onDestroy: ne,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case H.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case H.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Se.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (I.once(M.read, this._prepareMove, this._moveId),
                    I.once(M.write, this._applyMove, this._moveId)));
              break;
          }
      }
      _onScroll() {
        this.align();
      }
      _onEnd(e, t) {
        let n = this._sensorData.get(t);
        n &&
          (this.drag
            ? n.predicateState === H.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = H.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = H.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== N.Init ||
          ((this._startPhase = N.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Zt(t, this),
          )),
          this._applyModifiers(be.Start, 0, 0),
          this._emit(A.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = N.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== N.FinishPrepare)) {
          if (((this._startPhase = N.Apply), this.settings.preventClickOnEnd)) {
            let t = e.sensor;
            'preventClickOnEnd' in t &&
              typeof t.preventClickOnEnd == 'function' &&
              t.preventClickOnEnd();
          }
          if (this.settings.preventTextSelection) {
            let t = e.items[0]?.element?.ownerDocument ?? document;
            (t.getSelection()?.removeAllRanges(),
              (this._selectionChangeHandler = () => t.getSelection()?.removeAllRanges()),
              t.addEventListener('selectionchange', this._selectionChangeHandler));
          }
          if (this.settings.capturePointer) {
            let t = e.sensor;
            if (t instanceof me && t.drag) {
              let n = e.items[0]?.element?.ownerDocument?.body;
              if (n)
                try {
                  (n.setPointerCapture(t.drag.pointerId),
                    (this._pointerCaptureTarget = n),
                    (this._pointerCapturePointerId = t.drag.pointerId));
                } catch {}
            }
          }
          for (let t of e.items)
            (t.dragContainer !== t.elementContainer && Xt(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: K.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Nn(n, r) || (!Je(n) && !Je(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Ie(t.clientRect.x - s.x, 3)), (i.y += Ie(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: K.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Kt),
            this._emit(A.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = N.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(be.Move, r, s),
          this._emit(A.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: K.Move, draggable: this, drag: e, item: t }));
          (this._emit(A.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
        }
      }
      _prepareAlign() {
        let { drag: e } = this;
        if (!(!e || e.isEnded))
          for (let t of e.items) {
            let { x: n, y: r } = t.element.getBoundingClientRect(),
              s = t.clientRect.x - t._moveDiff.x - n;
            ((t.alignmentOffset.x = t.alignmentOffset.x - t._alignDiff.x + s),
              (t._alignDiff.x = s));
            let i = t.clientRect.y - t._moveDiff.y - r;
            ((t.alignmentOffset.y = t.alignmentOffset.y - t._alignDiff.y + i),
              (t._alignDiff.y = i));
          }
      }
      _applyAlign() {
        let { drag: e } = this;
        if (!(!e || e.isEnded))
          for (let t of e.items)
            ((t._alignDiff.x = 0),
              (t._alignDiff.y = 0),
              this.settings.applyPosition({ phase: K.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let s = this.settings.positionModifiers,
          i = this._modifierData;
        i.drag = r;
        for (let o of r.items) {
          let a = Wn;
          ((a.x = t), (a.y = n), (i.item = o), (i.phase = e));
          for (let l of s) a = l(a, i);
          ((o.position.x += a.x),
            (o.position.y += a.y),
            (o.clientRect.x += a.x),
            (o.clientRect.y += a.y),
            e === 'move' && ((o._moveDiff.x += a.x), (o._moveDiff.y += a.y)));
        }
      }
      on(e, t, n) {
        return this._emitter.on(e, t, n);
      }
      off(e, t) {
        this._emitter.off(e, t);
      }
      resolveStartPredicate(e, t) {
        let n = this._sensorData.get(e);
        if (!n) return;
        let r = t || n.predicateEvent;
        n.predicateState === H.Pending &&
          r &&
          ((this._startPhase = N.Init),
          (n.predicateState = H.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Qt(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = H.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (I.once(M.read, this._prepareStart, this._startId),
              I.once(M.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === H.Pending &&
          ((t.predicateState = H.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === N.Prepare || this._startPhase === N.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = N.None),
          I.off(M.read, this._startId),
          I.off(M.write, this._startId),
          I.off(M.read, this._moveId),
          I.off(M.write, this._moveId),
          I.off(M.read, this._alignId),
          I.off(M.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Kt),
          this._selectionChangeHandler &&
            (this._selectionChangeHandler =
              ((e.items[0]?.element?.ownerDocument ?? document).removeEventListener(
                'selectionchange',
                this._selectionChangeHandler,
              ),
              null)),
          this._pointerCaptureTarget && this._pointerCapturePointerId !== null)
        ) {
          try {
            this._pointerCaptureTarget.releasePointerCapture(this._pointerCapturePointerId);
          } catch {}
          ((this._pointerCaptureTarget = null), (this._pointerCapturePointerId = null));
        }
        this._applyModifiers(be.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Xt(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: K.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = Ie(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = Ie(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: K.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(A.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (I.once(M.read, this._prepareAlign, this._alignId),
              I.once(M.write, this._applyAlign, this._alignId)));
      }
      getClientRect() {
        let { drag: e, settings: t } = this;
        return (e && t.computeClientRect?.({ draggable: this, drag: e })) || null;
      }
      updateSettings(e) {
        let t = this.settings.capturePointer;
        if (
          ((this.settings = this._parseSettings(e, this.settings)),
          t && !this.settings.capturePointer && this._pointerCaptureTarget)
        ) {
          if (this._pointerCapturePointerId !== null)
            try {
              this._pointerCaptureTarget.releasePointerCapture(this._pointerCapturePointerId);
            } catch {}
          ((this._pointerCaptureTarget = null), (this._pointerCapturePointerId = null));
        }
      }
      use(e) {
        return e(this);
      }
      destroy() {
        this.isDestroyed ||
          ((this.isDestroyed = !0),
          this.stop(),
          this._sensors.forEach((e) => {
            this._unbindSensor(e);
          }),
          this._emit(A.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  var en = (e, { phase: t, drag: n }) => {
    if (t === 'start') {
      let r = n.sensor.drag?.startX ?? n.startEvent.startX,
        s = n.sensor.drag?.startY ?? n.startEvent.startY;
      r !== void 0 && s !== void 0 && ((e.x += n.startEvent.x - r), (e.y += n.startEvent.y - s));
    }
    return e;
  };
  var zn = () => {},
    B = new Map(),
    nt = new Set();
  function tt() {
    nt.forEach((e) => e());
  }
  var we = {
    add(e, t, n) {
      ((B = new Map(B)), B.set(e, { sources: t, proxies: n, exiting: !1, done: zn }), tt());
    },
    startExiting(e, t) {
      let n = B.get(e);
      n && ((B = new Map(B)), B.set(e, { ...n, exiting: !0, done: t }), tt());
    },
    remove(e) {
      B.has(e) && ((B = new Map(B)), B.delete(e), tt());
    },
    subscribe(e) {
      return (nt.add(e), () => nt.delete(e));
    },
    getSnapshot() {
      return B;
    },
  };
  var Yn = (e) => typeof e == 'function' && e.length === 0;
  function Q(e, t) {
    return e === void 0 ? t : Yn(e) ? e() : e;
  }
  function tn(e) {
    return e.map((t) => Q(t));
  }
  var Xn = () => null,
    nn = xt(Xn);
  function rn() {
    return qe(nn);
  }
  var Gn = Object.prototype.hasOwnProperty,
    sn = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function Fe(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      r = Array.isArray(t);
    if (n || r) {
      if (!n || !r) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let f = 0; f < l; f++) if (!Fe(e[f], t[f])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!sn(e) || !sn(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let f = o[l];
      if (!Gn.call(t, f) || !Fe(e[f], t[f])) return !1;
    }
    return !0;
  }
  var $e = new Map(),
    Ne = [],
    rt = [],
    st = [],
    it = [],
    ot = [],
    at = [],
    lt = [],
    ct = [];
  function on() {
    ($e.clear(),
      (Ne.length = 0),
      (rt.length = 0),
      (st.length = 0),
      (it.length = 0),
      (ot.length = 0),
      (at.length = 0),
      (lt.length = 0),
      (ct.length = 0));
  }
  function an(e) {
    let t = [];
    on();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = $(r),
        a = re(r),
        l = a ? o.transformOrigin : '',
        f,
        c;
      if (r instanceof SVGSVGElement) ((f = `${i.width}px`), (c = `${i.height}px`));
      else {
        let y = parseFloat(o.width),
          _ = parseFloat(o.height);
        if (!(y >= 0) || !(_ >= 0)) ((f = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((f = o.width), (c = o.height));
        else {
          let O = parseFloat(o.paddingLeft) || 0,
            P = parseFloat(o.paddingRight) || 0,
            V = parseFloat(o.borderLeftWidth) || 0,
            X = parseFloat(o.borderRightWidth) || 0,
            ne = parseFloat(o.paddingTop) || 0,
            m = parseFloat(o.paddingBottom) || 0,
            v = parseFloat(o.borderTopWidth) || 0,
            j = parseFloat(o.borderBottomWidth) || 0;
          ((f = `${y + O + P + V + X}px`), (c = `${_ + ne + m + v + j}px`));
        }
      }
      let h = document.createElement('div'),
        g = h.style;
      ((g.position = 'absolute'),
        (g.left = '0px'),
        (g.top = '0px'),
        (g.margin = '0'),
        (g.padding = '0'),
        (g.boxSizing = 'border-box'),
        (g.pointerEvents = 'none'),
        (g.contain = 'layout'),
        (h.dataset.dragPreviewProxy = 'true'),
        (Ne[n] = s),
        (t[n] = h),
        (rt[n] = i),
        (st[n] = a),
        (it[n] = l),
        (ot[n] = f),
        (at[n] = c),
        $e.has(s) || $e.set(s, ve(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ne[n],
        s = t[n],
        i = st[n],
        o = it[n],
        a = ot[n],
        l = at[n],
        f = s.style;
      ((f.width = a),
        (f.height = l),
        i && ((f.transform = i), o && (f.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ne[n],
        s = t[n],
        i = rt[n],
        o = $e.get(r),
        a = 0,
        l = 0,
        f = o.m11,
        c = o.m12,
        h = o.m21,
        g = o.m22,
        y = f * g - c * h,
        _ = s.getBoundingClientRect(),
        O = i.left - _.left,
        P = i.top - _.top;
      if (Math.abs(y) < 1e-10) ((a = O), (l = P));
      else {
        let V = 1 / y;
        ((a = (g * O - h * P) * V), (l = (-c * O + f * P) * V));
      }
      ((lt[n] = a), (ct[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = lt[n],
        i = ct[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (on(), t);
  }
  function ln(e, t) {
    if (Ae) return () => null;
    let n = D(() => (Array.isArray(e) ? tn(e) : (Q(e) ?? [])).filter((m) => !!m)),
      r = D(() => Q(t)),
      s = D(() => r()?.id),
      i = D(() => r()?.dndObserver),
      o = D(() => {
        let m = r();
        if (!m) return;
        let {
          dndObserver: v,
          id: j,
          dragPreviewContainer: xe,
          dragPreviewExitTimeout: E,
          ...q
        } = m;
        return q;
      }),
      a = rn(),
      l = D(() => {
        let m = i();
        return m === void 0 ? a() : m;
      }),
      [f, c] = R(null),
      h = null,
      g = s(),
      y = o(),
      _ = l(),
      O = o(),
      P = r()?.dragPreviewContainer,
      V = r()?.dragPreviewExitTimeout;
    F(() => {
      let m = r();
      ((O = o()), (P = m?.dragPreviewContainer), (V = m?.dragPreviewExitTimeout));
    });
    let X = () => {
        h && (h.destroy(), (h = null), (y = void 0), c(null));
      },
      ne = () => {
        wt(() => {
          X();
          let m = k(n);
          if (!m.length) return;
          let v = k(o),
            j = s(),
            xe = v?.dragPreview,
            E = new et(m, {
              id: j,
              ...v,
              elements(T) {
                let ut = O,
                  le = (ut?.elements || (() => null))(T);
                if (!ut?.dragPreview || !le || le.length === 0) return le;
                let ce = an(le);
                we.add(T.draggable, le, ce);
                let ft = () => {
                    let dt = V || 0;
                    if (dt > 0) {
                      for (let He of ce) He.dataset.exiting = 'true';
                      let Ee = !1,
                        ht = () => {
                          Ee ||
                            ((Ee = !0),
                            clearTimeout(gn),
                            we.remove(T.draggable),
                            setTimeout(() => {
                              for (let He of ce) He.remove();
                            }, 0));
                        },
                        gn = setTimeout(ht, dt);
                      we.startExiting(T.draggable, ht);
                    } else
                      (we.remove(T.draggable),
                        setTimeout(() => {
                          for (let Ee of ce) Ee.remove();
                        }, 0));
                    (T.draggable.off('end', dn), T.draggable.off('destroy', hn));
                  },
                  dn = T.draggable.on('end', ft),
                  hn = T.draggable.on('destroy', ft);
                return ce;
              },
              ...(xe
                ? {
                    container: () => {
                      let T = P;
                      return (typeof T == 'function' ? T() : T) || document.body;
                    },
                  }
                : {}),
            }),
            q = k(l);
          (q?.addDraggables([E]), (h = E), (g = j), (y = v), (_ = q), c(E));
        });
      };
    return (
      F(() => {
        let m = n();
        if (!m.length) {
          X();
          return;
        }
        let v = h;
        if (!v) {
          ne();
          return;
        }
        (m.length !== v.sensors.length || m.some((j) => !v.sensors.includes(j))) && ne();
      }),
      F(() => {
        if (!h) return;
        let v = s();
        g !== v && ne();
      }),
      F(() => {
        let m = l();
        if (_ === m) return;
        let v = h;
        (v && (_?.removeDraggables([v]), m?.addDraggables([v])), (_ = m));
      }),
      F(() => {
        let m = h;
        if (!m) return;
        let v = o(),
          j = !1;
        if (y) {
          let E = { ...y },
            q = { ...v };
          ((E.elements === q.elements || (E.dragPreview && q.dragPreview)) &&
            (delete E.elements, delete q.elements),
            (j = !Fe(E, q)));
        } else j = !0;
        if (!j) return;
        let xe = m._parseSettings(v);
        if (
          (m.updateSettings({
            ...xe,
            ...(!v?.dragPreview && v?.elements ? { elements: v.elements } : {}),
            ...(v?.dragPreview
              ? {
                  container: () => {
                    let E = P;
                    return (typeof E == 'function' ? E() : E) || document.body;
                  },
                }
              : {}),
          }),
          y)
        ) {
          let E = v?.dndGroups !== y.dndGroups,
            q = v?.computeClientRect !== y.computeClientRect;
          (E && _?.clearTargets(m), (E || q) && _?.detectCollisions(m));
        }
        y = v;
      }),
      G(X),
      f
    );
  }
  function cn(e, t = !1) {
    let n = D(() => Q(e)),
      [r, s] = R(null),
      [i, o] = R(0);
    return (
      F(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(A.Start, () => {
            s(a.drag || null);
          }),
          f = null;
        t &&
          (f = a.on(A.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(A.End, () => {
          s(null);
        });
        G(() => {
          (a.off(A.Start, l), f && a.off(A.Move, f), a.off(A.End, c));
        });
      }),
      D(() => (i(), r()))
    );
  }
  function un(e = {}, t) {
    if (Ae) return [() => null, () => {}];
    let n = D(() => Q(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : Q(t))),
      [s, i] = R(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new me(c, n());
        ((o = h), i(h));
      };
    (F(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      F(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), G(a));
        }
      }));
    let f = (c) => {
      if (t === void 0) {
        if (!c) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (G(a), [s, f]);
  }
  var Un = Tt(
      '<a href=https://muuri.dev target=_blank rel="noopener noreferrer"><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 640 512"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C680.8 251.2 170.6 330 220.6 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372.1 74 321.1 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C540.8 260.8 470.6 182 420.6 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"></path></svg><span>muuri.dev',
    ),
    Kn = 5;
  function Qn() {
    let e = null,
      [t, n] = R(1),
      r = 1,
      [s, i] = un(),
      a = ln([s], {
        elements: () => (e ? [e] : []),
        startPredicate: ({ event: c }) => {
          let h = c.x - c.startX,
            g = c.y - c.startY;
          return Math.sqrt(h * h + g * g) >= Kn ? !0 : void 0;
        },
        positionModifiers: [en],
        onStart: () => {
          n(++r);
        },
      }),
      l = cn(a),
      f = (c) => {
        ((e = c), i(c));
      };
    return (() => {
      var c = Un();
      return (
        Rt(f, c),
        kt(c, 'draggable', !1),
        J(
          (h) => {
            var g = `card draggable ${l() ? 'dragging' : ''}`,
              y = t();
            return (g !== h.e && It(c, (h.e = g)), y !== h.t && Lt(c, 'z-index', (h.t = y)), h);
          },
          { e: void 0, t: void 0 },
        ),
        c
      );
    })();
  }
  function Zn() {
    return Me(Qn, {});
  }
  var fn = document.getElementById('root');
  if (!fn) throw new Error('Failed to find the root element');
  At(() => Me(Zn, {}), fn);
})();
