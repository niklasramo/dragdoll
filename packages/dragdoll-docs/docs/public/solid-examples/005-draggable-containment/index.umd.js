'use strict';
var SolidExample_005_draggable_containment = (() => {
  var wn = Object.defineProperty;
  var En = (e, t, n) =>
    t in e ? wn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => En(e, typeof t != 'symbol' ? t + '' : t, n);
  var x = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return _t(this.context.count);
    },
    getNextContextId() {
      return _t(this.context.count++);
    },
  };
  function _t(e) {
    let t = String(e),
      n = t.length - 1;
    return x.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Xe(e) {
    x.context = e;
  }
  function Dn() {
    return { ...x.context, id: x.getNextContextId(), count: 0 };
  }
  var Cn = !1,
    Mn = (e, t) => e === t;
  var ke = { equals: Mn },
    bt = null,
    Et = Tt,
    R = 1,
    me = 2,
    Dt = { owned: null, cleanups: null, context: null, owner: null };
  var g = null,
    f = null,
    pe = null,
    ce = null,
    S = null,
    w = null,
    O = null,
    Te = 0;
  function Ct(e, t) {
    let n = S,
      r = g,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? Dt : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => I(() => Z(o)));
    ((g = o), (S = null));
    try {
      return z(a, !0);
    } finally {
      ((S = n), (g = r));
    }
  }
  function F(e, t) {
    t = t ? Object.assign({}, ke, t) : ke;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (f && f.running && f.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Pt(n, s)
      );
    return [kt.bind(n), r];
  }
  function ee(e, t, n) {
    let r = ze(e, t, !1, R);
    pe && f && f.running ? w.push(r) : ye(r);
  }
  function P(e, t, n) {
    Et = An;
    let r = ze(e, t, !1, R),
      s = qe && Ue(qe);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), O ? O.push(r) : ye(r));
  }
  function E(e, t, n) {
    n = n ? Object.assign({}, ke, n) : ke;
    let r = ze(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      pe && f && f.running ? ((r.tState = R), w.push(r)) : ye(r),
      kt.bind(r)
    );
  }
  function Mt(e) {
    return z(e, !1);
  }
  function I(e) {
    if (!ce && S === null) return e();
    let t = S;
    S = null;
    try {
      return ce ? ce.untrack(e) : e();
    } finally {
      S = t;
    }
  }
  function K(e) {
    return (g === null || (g.cleanups === null ? (g.cleanups = [e]) : g.cleanups.push(e)), e);
  }
  function On(e) {
    if (f && f.running) return (e(), f.done);
    let t = S,
      n = g;
    return Promise.resolve().then(() => {
      ((S = t), (g = n));
      let r;
      return (
        (pe || qe) &&
          ((r =
            f ||
            (f = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          r.done || (r.done = new Promise((s) => (r.resolve = s))),
          (r.running = !0)),
        z(e, !1),
        (S = g = null),
        r ? r.done : void 0
      );
    });
  }
  var [ur, St] = F(!1);
  function Ot(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: In(n), defaultValue: e };
  }
  function Ue(e) {
    let t;
    return g && g.context && (t = g.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function kn(e) {
    let t = E(e),
      n = E(() => We(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var qe;
  function kt() {
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === R) ye(this);
      else {
        let t = w;
        ((w = null), z(() => Pe(this), !1), (w = t));
      }
    if (S) {
      let t = this.observers ? this.observers.length : 0;
      (S.sources
        ? (S.sources.push(this), S.sourceSlots.push(t))
        : ((S.sources = [this]), (S.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(S), this.observerSlots.push(S.sources.length - 1))
          : ((this.observers = [S]), (this.observerSlots = [S.sources.length - 1])));
    }
    return e && f.sources.has(this) ? this.tValue : this.value;
  }
  function Pt(e, t, n) {
    let r = f && f.running && f.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (f) {
        let s = f.running;
        ((s || (!n && f.sources.has(e))) && (f.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        z(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = f && f.running;
            (o && f.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? w.push(i) : O.push(i), i.observers && At(i)),
              o ? (i.tState = R) : (i.state = R));
          }
          if (w.length > 1e6) throw ((w = []), new Error());
        }, !1);
    }
    return t;
  }
  function ye(e) {
    if (!e.fn) return;
    Z(e);
    let t = Te;
    (xt(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          z(() => {
            (f && (f.running = !0), (S = g = e), xt(e, e.tValue, t), (S = g = null));
          }, !1);
        }));
  }
  function xt(e, t, n) {
    let r,
      s = g,
      i = S;
    S = g = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = R), e.tOwned && e.tOwned.forEach(Z), (e.tOwned = void 0))
            : ((e.state = R), e.owned && e.owned.forEach(Z), (e.owned = null))),
        (e.updatedAt = n + 1),
        Ge(o)
      );
    } finally {
      ((S = i), (g = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Pt(e, r, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = r), f.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function ze(e, t, n, r = R, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: g,
      context: g ? g.context : null,
      pure: n,
    };
    if (
      (f && f.running && ((i.state = 0), (i.tState = r)),
      g === null ||
        (g !== Dt &&
          (f && f.running && g.pure
            ? g.tOwned
              ? g.tOwned.push(i)
              : (g.tOwned = [i])
            : g.owned
              ? g.owned.push(i)
              : (g.owned = [i]))),
      ce && i.fn)
    ) {
      let o = i.fn,
        [a, l] = F(void 0, { equals: !1 }),
        u = ce.factory(o, l);
      K(() => u.dispose());
      let c,
        h = () =>
          On(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (m) => (a(), f && f.running ? (c || (c = ce.factory(o, h)), c.track(m)) : u.track(m));
    }
    return i;
  }
  function ge(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === me) return Pe(e);
    if (e.suspense && I(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Te); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (f.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === R) ye(e);
      else if ((t ? e.tState : e.state) === me) {
        let s = w;
        ((w = null), z(() => Pe(e, n[0]), !1), (w = s));
      }
    }
  }
  function z(e, t) {
    if (w) return e();
    let n = !1;
    (t || (w = []), O ? (n = !0) : (O = []), Te++);
    try {
      let r = e();
      return (Pn(n), r);
    } catch (r) {
      (n || (O = null), (w = null), Ge(r));
    }
  }
  function Pn(e) {
    if ((w && (pe && f && f.running ? Tn(w) : Tt(w), (w = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let r = f.sources,
          s = f.disposed;
        (O.push.apply(O, f.effects), (t = f.resolve));
        for (let i of O) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((f = null),
          z(() => {
            for (let i of s) Z(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) Z(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            St(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, O), (O = null), St(!0));
        return;
      }
    }
    let n = O;
    ((O = null), n.length && z(() => Et(n), !1), t && t());
  }
  function Tt(e) {
    for (let t = 0; t < e.length; t++) ge(e[t]);
  }
  function Tn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = f.queue;
      r.has(n) ||
        (r.add(n),
        pe(() => {
          (r.delete(n),
            z(() => {
              ((f.running = !0), ge(n));
            }, !1),
            f && (f.running = !1));
        }));
    }
  }
  function An(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : ge(r);
    }
    if (x.context) {
      if (x.count) {
        (x.effects || (x.effects = []), x.effects.push(...e.slice(0, n)));
        return;
      }
      Xe();
    }
    for (
      x.effects &&
        (x.done || !x.count) &&
        ((e = [...x.effects, ...e]), (n += x.effects.length), delete x.effects),
        t = 0;
      t < n;
      t++
    )
      ge(e[t]);
  }
  function Pe(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === R ? s !== t && (!s.updatedAt || s.updatedAt < Te) && ge(s) : i === me && Pe(s, t);
      }
    }
  }
  function At(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = me) : (r.state = me),
        r.pure ? w.push(r) : O.push(r),
        r.observers && At(r));
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
    if (f && f.running && e.pure) Lt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) Z(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    f && f.running ? (e.tState = 0) : (e.state = 0);
  }
  function Lt(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Lt(e.owned[n]);
  }
  function Ln(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function wt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      Ge(r, (n && n.owner) || null);
    }
  }
  function Ge(e, t = g) {
    let n = bt && t && t.context && t.context[bt],
      r = Ln(e);
    if (!n) throw r;
    O
      ? O.push({
          fn() {
            wt(r, n, t);
          },
          state: R,
        })
      : wt(r, n, t);
  }
  function We(e) {
    if (typeof e == 'function' && !e.length) return We(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = We(e[n]);
        Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
      }
      return t;
    }
    return e;
  }
  function In(e, t) {
    return function (r) {
      let s;
      return (
        ee(
          () => (s = I(() => ((g.context = { ...g.context, [e]: r.value }), kn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Rn = !1;
  function Ae(e, t) {
    if (Rn && x.context) {
      let n = x.context;
      Xe(Dn());
      let r = I(() => e(t || {}));
      return (Xe(n), r);
    }
    return I(() => e(t || {}));
  }
  var Kn = [
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
    Cr = new Set([
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
      ...Kn,
    ]);
  function $n(e, t, n) {
    let r = n.length,
      s = t.length,
      i = r,
      o = 0,
      a = 0,
      l = t[s - 1].nextSibling,
      u = null;
    for (; o < s || a < i; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[s - 1] === n[i - 1]; ) (s--, i--);
      if (s === o) {
        let c = i < r ? (a ? n[a - 1].nextSibling : n[i - a]) : l;
        for (; a < i; ) e.insertBefore(n[a++], c);
      } else if (i === a) for (; o < s; ) ((!u || !u.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[i - 1] && n[a] === t[s - 1]) {
        let c = t[--s].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--i], c), (t[s] = n[i]));
      } else {
        if (!u) {
          u = new Map();
          let h = a;
          for (; h < i; ) u.set(n[h], h++);
        }
        let c = u.get(t[o]);
        if (c != null)
          if (a < c && c < i) {
            let h = o,
              m = 1,
              p;
            for (; ++h < s && h < i && !((p = u.get(t[h])) == null || p !== c + m); ) m++;
            if (m > c - a) {
              let _ = t[o];
              for (; a < c; ) e.insertBefore(n[a++], _);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function Rt(e, t, n, r = {}) {
    let s;
    return (
      Ct((i) => {
        ((s = i), t === document ? e() : Nn(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function Ft(e, t, n, r) {
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
        ? () => I(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function Kt(e, t) {
    Nt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function $t(e, t, n) {
    return I(() => e(t, n));
  }
  function Nn(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Le(e, t, r, n);
    ee((s) => Le(e, t(), s, n), r);
  }
  function Nt(e) {
    return !!x.context && !x.done && (!e || e.isConnected);
  }
  function Le(e, t, n, r, s) {
    let i = Nt(e);
    if (i) {
      !n && (n = [...e.childNodes]);
      let l = [];
      for (let u = 0; u < n.length; u++) {
        let c = n[u];
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
          (n = de(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = de(e, n, r);
    } else {
      if (o === 'function')
        return (
          ee(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Le(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          u = n && Array.isArray(n);
        if (Qe(l, t, n, s)) return (ee(() => (n = Le(e, l, n, r, !0))), () => n);
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
          if (((n = de(e, n, r)), a)) return n;
        } else u ? (n.length === 0 ? It(e, l, r) : $n(e, n, l)) : (n && de(e), It(e, l));
        n = l;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = de(e, n, r, t));
          de(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Qe(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        u;
      if (!(a == null || a === !0 || a === !1))
        if ((u = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Qe(e, a, l) || s;
        else if (u === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Qe(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
          } else (e.push(a), (s = !0));
        else {
          let c = String(a);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return s;
  }
  function It(e, t, n = null) {
    for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
  }
  function de(e, t, n, r) {
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
  var ue = !1;
  var ve = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    te = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || ve.ADD),
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
            case ve.THROW:
              throw Error('Eventti: duplicate listener id!');
            case ve.IGNORE:
              return n;
            case ve.UPDATE:
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
  var Bn = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new te({ getId: r, dedupe: n })),
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
  function Je(e = 60) {
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
  var Bt = class extends Bn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Je(), ...s } = e;
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
  var D = { read: Symbol(), write: Symbol() },
    C = new Bt({
      phases: [D.read, D.write],
      requestFrame: typeof window < 'u' ? Je() : () => () => {},
    });
  function _e(e, t = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
    return (
      e &&
        ((t.width = e.width),
        (t.height = e.height),
        (t.x = e.x),
        (t.y = e.y),
        (t.left = e.x),
        (t.top = e.y),
        (t.right = e.x + e.width),
        (t.bottom = e.y + e.height)),
      t
    );
  }
  var Ht = new WeakMap();
  function $(e) {
    let t = Ht.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Ht.set(e, new WeakRef(t))), t);
  }
  var Hn = typeof window < 'u' && window.document !== void 0,
    Ze = !!(
      Hn &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    be = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Br = {
      [be.content]: !1,
      [be.padding]: !1,
      [be.scrollbar]: !0,
      [be.border]: !0,
      [be.margin]: !0,
    };
  var Hr = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function Vt(e) {
    return e instanceof Window;
  }
  var jt = new WeakMap();
  function q(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = jt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), jt.set(e, new WeakRef(n))), n);
  }
  function Yt(e) {
    return e instanceof HTMLHtmlElement;
  }
  var Q = typeof window < 'u' && window.document !== void 0,
    Xt = Q && 'ontouchstart' in window,
    qt = Q && !!window.PointerEvent;
  Q &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var v = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function Wt(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Vn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function jn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Ut(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function zt(e) {
    return e === 'auto' || e === void 0 ? (qt ? 'pointer' : Xt ? 'touch' : 'mouse') : e;
  }
  var ne = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    re = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    oe = class {
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
          listenerOptions: n = re.listenerOptions,
          sourceEvents: r = re.sourceEvents,
          startPredicate: s = re.startPredicate,
          cancelOnVisibilityChange: i = re.cancelOnVisibilityChange,
          cancelOnEscape: o = re.cancelOnEscape,
          preventNativeDrag: a = re.preventNativeDrag,
          preventContextMenu: l = re.preventContextMenu,
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
          (this._listenerOptions = Ut(n)),
          (this._sourceEvents = zt(r)),
          (this._emitter = new te()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(ne[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? Wt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Vn(e);
        if (t === null) return;
        let n = Wt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: jn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: v.Start, srcEvent: e, target: n.target }),
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
          (n.type = v.Move),
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
          (n.type = v.Cancel),
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
          (n.type = v.End),
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
        let { move: e, end: t, cancel: n } = ne[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = ne[this._sourceEvents];
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
          ((this._eventData.type = v.Cancel),
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
            ne[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(ne[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          u = Ut(t);
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
            (this._listenerOptions.capture !== u.capture ||
              this._listenerOptions.passive !== u.passive)) ||
            (n && this._sourceEvents !== l)) &&
            (this.element.removeEventListener(
              ne[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && u && (this._listenerOptions = u),
            this.element.addEventListener(
              ne[this._sourceEvents].start,
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
          this._emitter.emit(v.Destroy, { type: v.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            ne[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Yn(e) {
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
  function Xn(e) {
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
  function ae(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = $(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', u] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Xn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Yn(e)}px`),
        u ? (o += `translate3d(${a},${l},${u})`) : (o += `translate(${a},${l})`));
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
  function Se(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function et(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var le = Q ? new DOMMatrix() : null;
  function xe(e, t = new DOMMatrix()) {
    let n = e;
    for (Se(t); n; ) {
      let r = ae(n);
      if (r && (le.setMatrixValue(r), !le.isIdentity)) {
        let { transformOrigin: s } = $(n),
          { x: i, y: o, z: a } = et(s);
        (a === 0
          ? le.setMatrixValue(`translate(${i}px,${o}px) ${le} translate(${i * -1}px,${o * -1}px)`)
          : le.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${le} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(le));
      }
      n = n.parentElement;
    }
    return t;
  }
  function Ie(e) {
    switch (q(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function Re(e) {
    let t = q(e);
    if (!Ze) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: u } = t;
      if (u && u !== 'none') return !0;
      let { willChange: c } = t;
      if (c && (c.indexOf('filter') > -1 || c.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Ie(e);
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
      ) || !!(Ze && a && a.indexOf('filter') > -1)
    );
  }
  function Gt(e) {
    return q(e).position !== 'static' || Re(e);
  }
  function tt(e, t = {}) {
    if (Yt(e)) return e.ownerDocument.defaultView;
    let n = t.position || q(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = Ie(i);
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
          let a = i ? Re(o) : Gt(o);
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
  function nt(e, t = {}) {
    let n = q(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || q(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return tt(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = tt(e, { container: o, position: s, skipDisplayNone: i });
        return Vt(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function qn(e, t) {
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
  function rt(e) {
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
  function Qt(e, t, n = null) {
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
  function Fe(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Jt = class {
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
    tn = class {
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
          (this._matrixCache = new Jt()),
          (this._clientOffsetCache = new Jt()));
      }
    };
  function Wn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function Un() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Wn(
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
  function Ee(e, t = { x: 0, y: 0 }) {
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
  function Zt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var zn = { x: 0, y: 0 },
    Gn = { x: 0, y: 0 };
  function Qn(e, t, n = { x: 0, y: 0 }) {
    let r = Zt(e) ? e : Ee(e, zn),
      s = Zt(t) ? t : Ee(t, Gn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Ke = Q ? Un() : null,
    nn = class {
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
          i = ae(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = et(r.transformOrigin)),
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
        let u = nt(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = l === o ? u : nt(e, { container: l })));
        {
          let { width: h, height: m, x: p, y: _ } = s;
          this.clientRect = { width: h, height: m, x: p, y: _ };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let c = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(c))
          if (c.length) {
            let h = {};
            for (let m of c) h[m] = r[m];
            this.frozenStyles = h;
          } else this.frozenStyles = null;
        else this.frozenStyles = c;
        if (this.frozenStyles) {
          let h = {};
          for (let m in this.frozenStyles) h[m] = e.style[m];
          this.unfrozenStyles = h;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, r] = t;
            (xe(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
          ].map(([u, c]) => {
            let h = i.get(c) || { x: 0, y: 0 };
            if (!i.isValid(c)) {
              let m = o.get(u);
              c instanceof HTMLElement && m && !m[0].isIdentity
                ? rt(m[0])
                  ? (Ke.style.setProperty('transform', m[1].toString(), 'important'),
                    c.append(Ke),
                    Ee(Ke, h),
                    Ke.remove())
                  : (Ee(c, h), (h.x -= m[0].m41), (h.y -= m[0].m42))
                : Ee(c, h);
            }
            return (i.set(c, h), h);
          });
          Qn(a, l, s);
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
    en = { capture: !0, passive: !0 },
    Jn = { x: 0, y: 0 },
    W = Q ? new DOMMatrix() : null,
    $e = Q ? new DOMMatrix() : null,
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
    B = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(B || {}),
    we = { Start: 'start', Move: 'move', End: 'end' },
    De = { Immediate: 'immediate', Sampled: 'sampled' },
    J = {
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
    rn = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === J.End || t === J.EndAlign,
          [r, s] = e.getContainerMatrix(),
          [i, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: u,
            elementTransformMatrix: c,
            elementTransformOrigin: h,
            elementOffsetMatrix: m,
          } = e,
          { x: p, y: _, z: k } = h,
          T = !c.isIdentity && (p !== 0 || _ !== 0 || k !== 0),
          j = a.x + l.x + u.x,
          G = a.y + l.y + u.y;
        (Se(W),
          T && (k === 0 ? W.translateSelf(-p, -_) : W.translateSelf(-p, -_, -k)),
          n ? s.isIdentity || W.multiplySelf(s) : o.isIdentity || W.multiplySelf(o),
          Se($e).translateSelf(j, G),
          W.multiplySelf($e),
          r.isIdentity || W.multiplySelf(r),
          T && (Se($e).translateSelf(p, _, k), W.multiplySelf($e)),
          c.isIdentity || W.multiplySelf(c),
          m.isIdentity || W.preMultiplySelf(m),
          (e.element.style.transform = `${W}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: De.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    st = class {
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
          (this._emitter = new te()),
          (this._startPhase = N.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: we.Start }),
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
          predicateState: B.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(v.Start, t, t), e.on(v.Move, t, t), e.on(v.Cancel, n, n), e.on(v.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(v.Start, n),
          e.off(v.Move, n),
          e.off(v.Cancel, r),
          e.off(v.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = rn) {
        let {
          container: n = t.container,
          startPredicate: r = t.startPredicate,
          elements: s = t.elements,
          frozenStyles: i = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: m = t.preventTextSelection,
          capturePointer: p = t.capturePointer,
          onPrepareStart: _ = t.onPrepareStart,
          onStart: k = t.onStart,
          onPrepareMove: T = t.onPrepareMove,
          onMove: j = t.onMove,
          onEnd: G = t.onEnd,
          onDestroy: ie = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: s,
          frozenStyles: i,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: l,
          sensorProcessingMode: u,
          dndGroups: c,
          preventClickOnEnd: h,
          preventTextSelection: m,
          capturePointer: p,
          onPrepareStart: _,
          onStart: k,
          onPrepareMove: T,
          onMove: j,
          onEnd: G,
          onDestroy: ie,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case B.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case B.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === De.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (C.once(D.read, this._prepareMove, this._moveId),
                    C.once(D.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === B.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = B.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = B.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== N.Init ||
          ((this._startPhase = N.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new nn(t, this),
          )),
          this._applyModifiers(we.Start, 0, 0),
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
            if (t instanceof oe && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Qt(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: J.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (qn(n, r) || (!rt(n) && !rt(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Fe(t.clientRect.x - s.x, 3)), (i.y += Fe(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: J.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, en),
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
          (this._applyModifiers(we.Move, r, s),
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
              this.settings.applyPosition({ phase: J.Move, draggable: this, drag: e, item: t }));
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
              this.settings.applyPosition({ phase: J.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let s = this.settings.positionModifiers,
          i = this._modifierData;
        i.drag = r;
        for (let o of r.items) {
          let a = Jn;
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
        n.predicateState === B.Pending &&
          r &&
          ((this._startPhase = N.Init),
          (n.predicateState = B.Resolved),
          (n.predicateEvent = null),
          (this.drag = new tn(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = B.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === De.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (C.once(D.read, this._prepareStart, this._startId),
              C.once(D.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === B.Pending &&
          ((t.predicateState = B.Rejected), (t.predicateEvent = null));
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
          C.off(D.read, this._startId),
          C.off(D.write, this._startId),
          C.off(D.read, this._moveId),
          C.off(D.write, this._moveId),
          C.off(D.read, this._alignId),
          C.off(D.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, en),
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
        this._applyModifiers(we.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Qt(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: J.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = Fe(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = Fe(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: J.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(A.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === De.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (C.once(D.read, this._prepareAlign, this._alignId),
              C.once(D.write, this._applyAlign, this._alignId)));
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
  var Zn = _e(),
    er = _e(),
    se = { change: 0, drift: 0 };
  function Ne(e, t, n, r, s, i, o) {
    let a = i,
      l = s;
    if (i > 0) {
      if (((a = Math.min(Math.max(r - t, 0), i)), o))
        if (s < 0) {
          let u = Math.min(-s, i);
          ((l = s + u), (a = Math.max(0, a - u)));
        } else l = s + (i - a);
    } else if (i < 0 && ((a = Math.max(Math.min(n - e, 0), i)), o))
      if (s > 0) {
        let u = Math.max(-s, i);
        ((l = s + u), (a = Math.min(0, a - u)));
      } else l = s + (i - a);
    ((se.change = a), (se.drift = l));
  }
  function sn(e, t, n) {
    let r = n - t,
      s = Math.abs(r);
    if (s >= e) {
      let i = s % e,
        o = r > 0 ? r - i : r + i;
      return Math.round(o / e) * e;
    }
    return 0;
  }
  function it(e, t) {
    let n = t?.trackSensorDrift ?? (({ drag: i }) => i.sensor instanceof oe),
      r = t?.snapX || 0,
      s = t?.snapY || 0;
    return function (i, o) {
      let a = _e(e(o), Zn),
        l = _e(o.item.clientRect, er),
        u = o.item.data,
        c = u.__containment__ || {
          drift: { x: 0, y: 0 },
          trackDrift: !1,
          snapX: 0,
          snapY: 0,
          sensorX: 0,
          sensorY: 0,
          startLeft: 0,
          startTop: 0,
          startRight: 0,
          startBottom: 0,
        };
      if (
        (u.__containment__ ||
          (u.__containment__ = ((c.trackDrift = typeof n == 'function' ? n(o) : n), c)),
        o.phase === 'start')
      )
        return (
          i.x && (i.x = (Ne(l.left, l.right, a.left, a.right, 0, i.x, !1), se.change)),
          i.y && (i.y = (Ne(l.top, l.bottom, a.top, a.bottom, 0, i.y, !1), se.change)),
          (r || s) &&
            ((c.startLeft = l.left + i.x),
            (c.startTop = l.top + i.y),
            (c.startRight = l.right + i.x),
            (c.startBottom = l.bottom + i.y)),
          i
        );
      if (r) {
        c.sensorX += i.x;
        let h = sn(r, c.snapX, c.sensorX),
          m = c.snapX + h,
          p = Math.ceil((a.left - c.startLeft) / r) * r,
          _ = Math.floor((a.right - c.startRight) / r) * r;
        ((m = Math.min(Math.max(m, p), _)), (i.x = m - c.snapX), (c.snapX = m));
      } else
        i.x &&
          (i.x =
            (Ne(l.left, l.right, a.left, a.right, c.drift.x, i.x, c.trackDrift),
            (c.drift.x = se.drift),
            se.change));
      if (s) {
        c.sensorY += i.y;
        let h = sn(s, c.snapY, c.sensorY),
          m = c.snapY + h,
          p = Math.ceil((a.top - c.startTop) / s) * s,
          _ = Math.floor((a.bottom - c.startBottom) / s) * s;
        ((m = Math.min(Math.max(m, p), _)), (i.y = m - c.snapY), (c.snapY = m));
      } else
        i.y &&
          (i.y =
            (Ne(l.top, l.bottom, a.top, a.bottom, c.drift.y, i.y, c.trackDrift),
            (c.drift.y = se.drift),
            se.change));
      return i;
    };
  }
  var on = class {
    constructor() {
      d(this, 'drag');
      d(this, 'isDestroyed');
      d(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new te()));
    }
    _createDragData(e) {
      return { x: e.x, y: e.y, startX: e.x, startY: e.y, deltaX: 0, deltaY: 0 };
    }
    _updateDragData(e) {
      this.drag &&
        ((this.drag.deltaX = e.x - this.drag.x),
        (this.drag.deltaY = e.y - this.drag.y),
        (this.drag.x = e.x),
        (this.drag.y = e.y));
    }
    _resetDragData() {
      this.drag = null;
    }
    _start(e) {
      if (this.isDestroyed || this.drag) return;
      let t = this._createDragData(e),
        n = e;
      ((n.startX = t.startX),
        (n.startY = t.startY),
        (n.deltaX = t.deltaX),
        (n.deltaY = t.deltaY),
        (this.drag = t),
        this._emitter.emit(v.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(v.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(v.End, t),
        this._resetDragData());
    }
    _cancel(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(v.Cancel, t),
        this._resetDragData());
    }
    on(e, t, n) {
      return this._emitter.on(e, t, n);
    }
    off(e, t) {
      this._emitter.off(e, t);
    }
    cancel() {
      this.drag &&
        this._cancel({
          type: v.Cancel,
          x: this.drag.x,
          y: this.drag.y,
          startX: this.drag.startX,
          startY: this.drag.startY,
          deltaX: this.drag.deltaX,
          deltaY: this.drag.deltaY,
        });
    }
    destroy() {
      this.isDestroyed ||
        ((this.isDestroyed = !0),
        this.cancel(),
        this._emitter.emit(v.Destroy, { type: v.Destroy }),
        this._emitter.off());
    }
  };
  var an = class extends on {
    constructor() {
      super();
      d(this, 'drag');
      d(this, '_direction');
      d(this, '_speed');
      d(this, '_tickEvent');
      d(this, '_moveEvent');
      ((this.drag = null),
        (this._direction = { x: 0, y: 0 }),
        (this._speed = 0),
        (this._tickEvent = { type: 'tick', time: 0, deltaTime: 0 }),
        (this._moveEvent = {
          type: v.Move,
          x: 0,
          y: 0,
          srcEvent: null,
          target: null,
          startX: 0,
          startY: 0,
          deltaX: 0,
          deltaY: 0,
        }),
        (this._tick = this._tick.bind(this)));
    }
    _createDragData(t) {
      return { ...super._createDragData(t), time: 0, deltaTime: 0 };
    }
    _start(t) {
      this.isDestroyed || this.drag || (super._start(t), C.on(D.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (C.off(D.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (C.off(D.read, this._tick), super._cancel(t));
    }
    _tick(t) {
      if (this.drag)
        if (t && this.drag.time) {
          ((this.drag.deltaTime = t - this.drag.time), (this.drag.time = t));
          let n = this._tickEvent;
          if (
            ((n.time = this.drag.time),
            (n.deltaTime = this.drag.deltaTime),
            this._emitter.emit('tick', n),
            !this.drag)
          )
            return;
          let r = this._speed * (this.drag.deltaTime / 1e3),
            s = this._direction.x * r,
            i = this._direction.y * r;
          if (s || i) {
            let o = this._moveEvent;
            ((o.x = this.drag.x + s), (o.y = this.drag.y + i), this._move(o));
          }
        } else ((this.drag.time = t), (this.drag.deltaTime = 0));
    }
  };
  var tr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Be(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let r of e) {
      let s = t.get(r);
      s !== void 0 && s < n && (n = s);
    }
    return n;
  }
  var U = {
      startKeys: [' ', 'Enter'],
      moveLeftKeys: ['ArrowLeft'],
      moveRightKeys: ['ArrowRight'],
      moveUpKeys: ['ArrowUp'],
      moveDownKeys: ['ArrowDown'],
      cancelKeys: ['Escape'],
      endKeys: [' ', 'Enter'],
      cancelOnBlur: !0,
      cancelOnVisibilityChange: !0,
      computeSpeed: () => 500,
      startPredicate: (e, t) => {
        if (t.element && document.activeElement === t.element) {
          let { left: n, top: r } = t.element.getBoundingClientRect();
          return { x: n, y: r };
        }
        return null;
      },
    },
    ln = class extends an {
      constructor(t, n = {}) {
        super();
        d(this, 'element');
        d(this, '_eventData', { type: '', x: 0, y: 0, srcEvent: null });
        d(this, '_moveKeys');
        d(this, '_moveKeyTimestamps');
        d(this, '_startKeys');
        d(this, '_moveLeftKeys');
        d(this, '_moveRightKeys');
        d(this, '_moveUpKeys');
        d(this, '_moveDownKeys');
        d(this, '_cancelKeys');
        d(this, '_endKeys');
        d(this, '_cancelOnBlur');
        d(this, '_cancelOnVisibilityChange');
        d(this, '_computeSpeed');
        d(this, '_startPredicate');
        let {
          startPredicate: r = U.startPredicate,
          computeSpeed: s = U.computeSpeed,
          cancelOnVisibilityChange: i = U.cancelOnVisibilityChange,
          cancelOnBlur: o = U.cancelOnBlur,
          startKeys: a = U.startKeys,
          moveLeftKeys: l = U.moveLeftKeys,
          moveRightKeys: u = U.moveRightKeys,
          moveUpKeys: c = U.moveUpKeys,
          moveDownKeys: h = U.moveDownKeys,
          cancelKeys: m = U.cancelKeys,
          endKeys: p = U.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(m)),
          (this._endKeys = new Set(p)),
          (this._moveLeftKeys = new Set(l)),
          (this._moveRightKeys = new Set(u)),
          (this._moveUpKeys = new Set(c)),
          (this._moveDownKeys = new Set(h)),
          (this._moveKeys = new Set([...l, ...u, ...c, ...h])),
          (this._moveKeyTimestamps = new Map()),
          (this._cancelOnBlur = o),
          (this._cancelOnVisibilityChange = i),
          (this._computeSpeed = s),
          (this._startPredicate = r),
          (this._onKeyDown = this._onKeyDown.bind(this)),
          (this._onKeyUp = this._onKeyUp.bind(this)),
          (this._onTick = this._onTick.bind(this)),
          (this._internalCancel = this._internalCancel.bind(this)),
          (this._blurCancelHandler = this._blurCancelHandler.bind(this)),
          this.on('tick', this._onTick, this._onTick),
          document.addEventListener('keydown', this._onKeyDown),
          document.addEventListener('keyup', this._onKeyUp),
          o && t?.addEventListener('blur', this._blurCancelHandler),
          i && document.addEventListener('visibilitychange', this._internalCancel));
      }
      _end(t) {
        this.drag &&
          (this._moveKeyTimestamps.clear(),
          (this._direction.x = 0),
          (this._direction.y = 0),
          super._end(t));
      }
      _cancel(t) {
        this.drag &&
          (this._moveKeyTimestamps.clear(),
          (this._direction.x = 0),
          (this._direction.y = 0),
          super._cancel(t));
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
        let t = Be(this._moveLeftKeys, this._moveKeyTimestamps),
          n = Be(this._moveRightKeys, this._moveKeyTimestamps),
          r = Be(this._moveUpKeys, this._moveKeyTimestamps),
          s = Be(this._moveDownKeys, this._moveKeyTimestamps),
          i = t === n ? 0 : t < n ? -1 : 1,
          o = r === s ? 0 : r < s ? -1 : 1;
        if (!(i === 0 || o === 0)) {
          let a = 1 / (Math.sqrt(i * i + o * o) || 1);
          ((i *= a), (o *= a));
        }
        ((this._direction.x = i), (this._direction.y = o));
      }
      _onTick() {
        this._speed = this._computeSpeed(this);
      }
      _onKeyUp(t) {
        this._moveKeyTimestamps.get(t.key) &&
          (this._moveKeyTimestamps.delete(t.key), this._updateDirection());
      }
      _onKeyDown(t) {
        if (!this.drag) {
          if (this._startKeys.has(t.key)) {
            let n = this._startPredicate(t, this);
            if (n) {
              t.preventDefault();
              let r = this._eventData;
              ((r.type = v.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
            }
          }
          return;
        }
        if (this._cancelKeys.has(t.key)) {
          (t.preventDefault(), this._internalCancel());
          return;
        }
        if (this._endKeys.has(t.key)) {
          t.preventDefault();
          let n = this._eventData;
          ((n.type = v.End),
            (n.x = this.drag.x),
            (n.y = this.drag.y),
            (n.srcEvent = t),
            this._end(n));
          return;
        }
        if (this._moveKeys.has(t.key)) {
          (t.preventDefault(),
            this._moveKeyTimestamps.get(t.key) ||
              (this._moveKeyTimestamps.set(t.key, Date.now()), this._updateDirection()));
          return;
        }
      }
      updateElement(t) {
        this.isDestroyed ||
          this.element === t ||
          (this._cancelOnBlur &&
            (this.element?.removeEventListener('blur', this._blurCancelHandler),
            t?.addEventListener('blur', this._blurCancelHandler)),
          (this.element = t));
      }
      updateSettings(t) {
        if (this.isDestroyed) return;
        let n = !1,
          { cancelOnBlur: r, cancelOnVisibilityChange: s, startPredicate: i, computeSpeed: o } = t;
        if (
          (r !== void 0 &&
            this._cancelOnBlur !== r &&
            ((this._cancelOnBlur = r),
            r
              ? this.element?.addEventListener('blur', this._blurCancelHandler)
              : this.element?.removeEventListener('blur', this._blurCancelHandler)),
          s !== void 0 &&
            this._cancelOnVisibilityChange !== s &&
            ((this._cancelOnVisibilityChange = s),
            s
              ? document.addEventListener('visibilitychange', this._internalCancel)
              : document.removeEventListener('visibilitychange', this._internalCancel)),
          i !== void 0 && (this._startPredicate = i),
          o !== void 0 && (this._computeSpeed = o),
          tr.forEach((a, l) => {
            let u = `${a}Keys`,
              c = t[u];
            c !== void 0 && ((this[`_${u}`] = new Set(c)), l >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((l, u) => a[u] === l)) ||
            ((this._moveKeys = new Set(a)),
            this._moveKeyTimestamps.clear(),
            this._updateDirection());
        }
      }
      destroy() {
        this.isDestroyed ||
          (super.destroy(),
          this.off('tick', this._onTick),
          document.removeEventListener('keydown', this._onKeyDown),
          document.removeEventListener('keyup', this._onKeyUp),
          this._cancelOnBlur && this.element?.removeEventListener('blur', this._blurCancelHandler),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._internalCancel));
      }
    };
  var nr = () => {},
    H = new Map(),
    at = new Set();
  function ot() {
    at.forEach((e) => e());
  }
  var Ce = {
    add(e, t, n) {
      ((H = new Map(H)), H.set(e, { sources: t, proxies: n, exiting: !1, done: nr }), ot());
    },
    startExiting(e, t) {
      let n = H.get(e);
      n && ((H = new Map(H)), H.set(e, { ...n, exiting: !0, done: t }), ot());
    },
    remove(e) {
      H.has(e) && ((H = new Map(H)), H.delete(e), ot());
    },
    subscribe(e) {
      return (at.add(e), () => at.delete(e));
    },
    getSnapshot() {
      return H;
    },
  };
  var rr = (e) => typeof e == 'function' && e.length === 0;
  function V(e, t) {
    return e === void 0 ? t : rr(e) ? e() : e;
  }
  function cn(e) {
    return e.map((t) => V(t));
  }
  var sr = () => null,
    dn = Ot(sr);
  function un() {
    return Ue(dn);
  }
  var ir = Object.prototype.hasOwnProperty,
    fn = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function He(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      r = Array.isArray(t);
    if (n || r) {
      if (!n || !r) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let u = 0; u < l; u++) if (!He(e[u], t[u])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!fn(e) || !fn(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let u = o[l];
      if (!ir.call(t, u) || !He(e[u], t[u])) return !1;
    }
    return !0;
  }
  var Ve = new Map(),
    je = [],
    lt = [],
    ct = [],
    dt = [],
    ut = [],
    ft = [],
    ht = [],
    mt = [];
  function hn() {
    (Ve.clear(),
      (je.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (dt.length = 0),
      (ut.length = 0),
      (ft.length = 0),
      (ht.length = 0),
      (mt.length = 0));
  }
  function mn(e) {
    let t = [];
    hn();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = $(r),
        a = ae(r),
        l = a ? o.transformOrigin : '',
        u,
        c;
      if (r instanceof SVGSVGElement) ((u = `${i.width}px`), (c = `${i.height}px`));
      else {
        let p = parseFloat(o.width),
          _ = parseFloat(o.height);
        if (!(p >= 0) || !(_ >= 0)) ((u = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((u = o.width), (c = o.height));
        else {
          let k = parseFloat(o.paddingLeft) || 0,
            T = parseFloat(o.paddingRight) || 0,
            j = parseFloat(o.borderLeftWidth) || 0,
            G = parseFloat(o.borderRightWidth) || 0,
            ie = parseFloat(o.paddingTop) || 0,
            y = parseFloat(o.paddingBottom) || 0,
            b = parseFloat(o.borderTopWidth) || 0,
            Y = parseFloat(o.borderBottomWidth) || 0;
          ((u = `${p + k + T + j + G}px`), (c = `${_ + ie + y + b + Y}px`));
        }
      }
      let h = document.createElement('div'),
        m = h.style;
      ((m.position = 'absolute'),
        (m.left = '0px'),
        (m.top = '0px'),
        (m.margin = '0'),
        (m.padding = '0'),
        (m.boxSizing = 'border-box'),
        (m.pointerEvents = 'none'),
        (m.contain = 'layout'),
        (h.dataset.dragPreviewProxy = 'true'),
        (je[n] = s),
        (t[n] = h),
        (lt[n] = i),
        (ct[n] = a),
        (dt[n] = l),
        (ut[n] = u),
        (ft[n] = c),
        Ve.has(s) || Ve.set(s, xe(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = je[n],
        s = t[n],
        i = ct[n],
        o = dt[n],
        a = ut[n],
        l = ft[n],
        u = s.style;
      ((u.width = a),
        (u.height = l),
        i && ((u.transform = i), o && (u.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = je[n],
        s = t[n],
        i = lt[n],
        o = Ve.get(r),
        a = 0,
        l = 0,
        u = o.m11,
        c = o.m12,
        h = o.m21,
        m = o.m22,
        p = u * m - c * h,
        _ = s.getBoundingClientRect(),
        k = i.left - _.left,
        T = i.top - _.top;
      if (Math.abs(p) < 1e-10) ((a = k), (l = T));
      else {
        let j = 1 / p;
        ((a = (m * k - h * T) * j), (l = (-c * k + u * T) * j));
      }
      ((ht[n] = a), (mt[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = ht[n],
        i = mt[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (hn(), t);
  }
  function gn(e, t) {
    if (ue) return () => null;
    let n = E(() => (Array.isArray(e) ? cn(e) : (V(e) ?? [])).filter((y) => !!y)),
      r = E(() => V(t)),
      s = E(() => r()?.id),
      i = E(() => r()?.dndObserver),
      o = E(() => {
        let y = r();
        if (!y) return;
        let {
          dndObserver: b,
          id: Y,
          dragPreviewContainer: Me,
          dragPreviewExitTimeout: M,
          ...X
        } = y;
        return X;
      }),
      a = un(),
      l = E(() => {
        let y = i();
        return y === void 0 ? a() : y;
      }),
      [u, c] = F(null),
      h = null,
      m = s(),
      p = o(),
      _ = l(),
      k = o(),
      T = r()?.dragPreviewContainer,
      j = r()?.dragPreviewExitTimeout;
    P(() => {
      let y = r();
      ((k = o()), (T = y?.dragPreviewContainer), (j = y?.dragPreviewExitTimeout));
    });
    let G = () => {
        h && (h.destroy(), (h = null), (p = void 0), c(null));
      },
      ie = () => {
        Mt(() => {
          G();
          let y = I(n);
          if (!y.length) return;
          let b = I(o),
            Y = s(),
            Me = b?.dragPreview,
            M = new st(y, {
              id: Y,
              ...b,
              elements(L) {
                let gt = k,
                  fe = (gt?.elements || (() => null))(L);
                if (!gt?.dragPreview || !fe || fe.length === 0) return fe;
                let he = mn(fe);
                Ce.add(L.draggable, fe, he);
                let pt = () => {
                    let yt = j || 0;
                    if (yt > 0) {
                      for (let Ye of he) Ye.dataset.exiting = 'true';
                      let Oe = !1,
                        vt = () => {
                          Oe ||
                            ((Oe = !0),
                            clearTimeout(xn),
                            Ce.remove(L.draggable),
                            setTimeout(() => {
                              for (let Ye of he) Ye.remove();
                            }, 0));
                        },
                        xn = setTimeout(vt, yt);
                      Ce.startExiting(L.draggable, vt);
                    } else
                      (Ce.remove(L.draggable),
                        setTimeout(() => {
                          for (let Oe of he) Oe.remove();
                        }, 0));
                    (L.draggable.off('end', bn), L.draggable.off('destroy', Sn));
                  },
                  bn = L.draggable.on('end', pt),
                  Sn = L.draggable.on('destroy', pt);
                return he;
              },
              ...(Me
                ? {
                    container: () => {
                      let L = T;
                      return (typeof L == 'function' ? L() : L) || document.body;
                    },
                  }
                : {}),
            }),
            X = I(l);
          (X?.addDraggables([M]), (h = M), (m = Y), (p = b), (_ = X), c(M));
        });
      };
    return (
      P(() => {
        let y = n();
        if (!y.length) {
          G();
          return;
        }
        let b = h;
        if (!b) {
          ie();
          return;
        }
        (y.length !== b.sensors.length || y.some((Y) => !b.sensors.includes(Y))) && ie();
      }),
      P(() => {
        if (!h) return;
        let b = s();
        m !== b && ie();
      }),
      P(() => {
        let y = l();
        if (_ === y) return;
        let b = h;
        (b && (_?.removeDraggables([b]), y?.addDraggables([b])), (_ = y));
      }),
      P(() => {
        let y = h;
        if (!y) return;
        let b = o(),
          Y = !1;
        if (p) {
          let M = { ...p },
            X = { ...b };
          ((M.elements === X.elements || (M.dragPreview && X.dragPreview)) &&
            (delete M.elements, delete X.elements),
            (Y = !He(M, X)));
        } else Y = !0;
        if (!Y) return;
        let Me = y._parseSettings(b);
        if (
          (y.updateSettings({
            ...Me,
            ...(!b?.dragPreview && b?.elements ? { elements: b.elements } : {}),
            ...(b?.dragPreview
              ? {
                  container: () => {
                    let M = T;
                    return (typeof M == 'function' ? M() : M) || document.body;
                  },
                }
              : {}),
          }),
          p)
        ) {
          let M = b?.dndGroups !== p.dndGroups,
            X = b?.computeClientRect !== p.computeClientRect;
          (M && _?.clearTargets(y), (M || X) && _?.detectCollisions(y));
        }
        p = b;
      }),
      K(G),
      u
    );
  }
  function pn(e, t = !1) {
    let n = E(() => V(e)),
      [r, s] = F(null),
      [i, o] = F(0);
    return (
      P(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(A.Start, () => {
            s(a.drag || null);
          }),
          u = null;
        t &&
          (u = a.on(A.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(A.End, () => {
          s(null);
        });
        K(() => {
          (a.off(A.Start, l), u && a.off(A.Move, u), a.off(A.End, c));
        });
      }),
      E(() => (i(), r()))
    );
  }
  function yn(e = {}, t) {
    if (ue) return [() => null, () => {}];
    let n = E(() => V(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : V(t))),
      [s, i] = F(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        if (c === null) {
          a();
          return;
        }
        o?.destroy();
        let h = new ln(c, n());
        ((o = h), i(h));
      };
    (P(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      P(() => {
        let c = r();
        c !== void 0 && (l(c), K(a));
      }));
    let u = (c) => {
      if (t === void 0) {
        if (c === null) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (K(a), [s, u]);
  }
  function vn(e = {}, t) {
    if (ue) return [() => null, () => {}];
    let n = E(() => V(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : V(t))),
      [s, i] = F(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new oe(c, n());
        ((o = h), i(h));
      };
    (P(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      P(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), K(a));
        }
      }));
    let u = (c) => {
      if (t === void 0) {
        if (!c) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (K(a), [s, u]);
  }
  var or = Ft(
    '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
  );
  function ar() {
    let e = null,
      [t, n] = vn(),
      [r, s] = yn(),
      i = gn([t, r], {
        elements: () => (e ? [e] : []),
        positionModifiers: [
          it(() => ({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight })),
        ],
      }),
      o = pn(i),
      a = (l) => {
        ((e = l), n(l), s(l));
      };
    return (() => {
      var l = or();
      return ($t(a, l), ee(() => Kt(l, `card draggable ${o() ? 'dragging' : ''}`)), l);
    })();
  }
  function lr() {
    return Ae(ar, {});
  }
  var _n = document.getElementById('root');
  if (!_n) throw new Error('Failed to find the root element');
  Rt(() => Ae(lr, {}), _n);
})();
