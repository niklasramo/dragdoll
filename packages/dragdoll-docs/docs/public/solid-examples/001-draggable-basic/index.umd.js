'use strict';
var SolidExample_001_draggable_basic = (() => {
  var wn = Object.defineProperty;
  var xn = (e, t, n) =>
    t in e ? wn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var u = (e, t, n) => xn(e, typeof t != 'symbol' ? t + '' : t, n);
  var E = {
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
    return E.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function je(e) {
    E.context = e;
  }
  function En() {
    return { ...E.context, id: E.getNextContextId(), count: 0 };
  }
  var Dn = !1,
    Cn = (e, t) => e === t;
  var On = Symbol('solid-track');
  var Pe = { equals: Cn },
    bt = null,
    Dt = Tt,
    H = 1,
    he = 2,
    Ct = { owned: null, cleanups: null, context: null, owner: null };
  var v = null,
    h = null,
    ge = null,
    ae = null,
    S = null,
    O = null,
    L = null,
    Te = 0;
  function fe(e, t) {
    let n = S,
      r = v,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? Ct : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => F(() => ee(o)));
    ((v = o), (S = null));
    try {
      return Q(a, !0);
    } finally {
      ((S = n), (v = r));
    }
  }
  function I(e, t) {
    t = t ? Object.assign({}, Pe, t) : Pe;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (h && h.running && h.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        kt(n, s)
      );
    return [Pt.bind(n), r];
  }
  function te(e, t, n) {
    let r = We(e, t, !1, H);
    ge && h && h.running ? O.push(r) : pe(r);
  }
  function R(e, t, n) {
    Dt = An;
    let r = We(e, t, !1, H),
      s = qe && Xe(qe);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), L ? L.push(r) : pe(r));
  }
  function D(e, t, n) {
    n = n ? Object.assign({}, Pe, n) : Pe;
    let r = We(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      ge && h && h.running ? ((r.tState = H), O.push(r)) : pe(r),
      Pt.bind(r)
    );
  }
  function Ot(e) {
    return Q(e, !1);
  }
  function F(e) {
    if (!ae && S === null) return e();
    let t = S;
    S = null;
    try {
      return ae ? ae.untrack(e) : e();
    } finally {
      S = t;
    }
  }
  function B(e) {
    return (v === null || (v.cleanups === null ? (v.cleanups = [e]) : v.cleanups.push(e)), e);
  }
  function Mn(e) {
    if (h && h.running) return (e(), h.done);
    let t = S,
      n = v;
    return Promise.resolve().then(() => {
      ((S = t), (v = n));
      let r;
      return (
        (ge || qe) &&
          ((r =
            h ||
            (h = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          r.done || (r.done = new Promise((s) => (r.resolve = s))),
          (r.running = !0)),
        Q(e, !1),
        (S = v = null),
        r ? r.done : void 0
      );
    });
  }
  var [fr, St] = I(!1);
  function Mt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: In(n), defaultValue: e };
  }
  function Xe(e) {
    let t;
    return v && v.context && (t = v.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function Pn(e) {
    let t = D(e),
      n = D(() => Ye(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var qe;
  function Pt() {
    let e = h && h.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === H) pe(this);
      else {
        let t = O;
        ((O = null), Q(() => ke(this), !1), (O = t));
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
    return e && h.sources.has(this) ? this.tValue : this.value;
  }
  function kt(e, t, n) {
    let r = h && h.running && h.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (h) {
        let s = h.running;
        ((s || (!n && h.sources.has(e))) && (h.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        Q(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = h && h.running;
            (o && h.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? O.push(i) : L.push(i), i.observers && At(i)),
              o ? (i.tState = H) : (i.state = H));
          }
          if (O.length > 1e6) throw ((O = []), new Error());
        }, !1);
    }
    return t;
  }
  function pe(e) {
    if (!e.fn) return;
    ee(e);
    let t = Te;
    (wt(e, h && h.running && h.sources.has(e) ? e.tValue : e.value, t),
      h &&
        !h.running &&
        h.sources.has(e) &&
        queueMicrotask(() => {
          Q(() => {
            (h && (h.running = !0), (S = v = e), wt(e, e.tValue, t), (S = v = null));
          }, !1);
        }));
  }
  function wt(e, t, n) {
    let r,
      s = v,
      i = S;
    S = v = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (h && h.running
            ? ((e.tState = H), e.tOwned && e.tOwned.forEach(ee), (e.tOwned = void 0))
            : ((e.state = H), e.owned && e.owned.forEach(ee), (e.owned = null))),
        (e.updatedAt = n + 1),
        Ue(o)
      );
    } finally {
      ((S = i), (v = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? kt(e, r, !0)
        : h && h.running && e.pure
          ? (h.sources.has(e) || (e.value = r), h.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function We(e, t, n, r = H, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: v,
      context: v ? v.context : null,
      pure: n,
    };
    if (
      (h && h.running && ((i.state = 0), (i.tState = r)),
      v === null ||
        (v !== Ct &&
          (h && h.running && v.pure
            ? v.tOwned
              ? v.tOwned.push(i)
              : (v.tOwned = [i])
            : v.owned
              ? v.owned.push(i)
              : (v.owned = [i]))),
      ae && i.fn)
    ) {
      let o = i.fn,
        [a, l] = I(void 0, { equals: !1 }),
        f = ae.factory(o, l);
      B(() => f.dispose());
      let c,
        d = () =>
          Mn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (m) => (a(), h && h.running ? (c || (c = ae.factory(o, d)), c.track(m)) : f.track(m));
    }
    return i;
  }
  function me(e) {
    let t = h && h.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === he) return ke(e);
    if (e.suspense && F(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Te); ) {
      if (t && h.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (h.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === H) pe(e);
      else if ((t ? e.tState : e.state) === he) {
        let s = O;
        ((O = null), Q(() => ke(e, n[0]), !1), (O = s));
      }
    }
  }
  function Q(e, t) {
    if (O) return e();
    let n = !1;
    (t || (O = []), L ? (n = !0) : (L = []), Te++);
    try {
      let r = e();
      return (kn(n), r);
    } catch (r) {
      (n || (L = null), (O = null), Ue(r));
    }
  }
  function kn(e) {
    if ((O && (ge && h && h.running ? Tn(O) : Tt(O), (O = null)), e)) return;
    let t;
    if (h) {
      if (!h.promises.size && !h.queue.size) {
        let r = h.sources,
          s = h.disposed;
        (L.push.apply(L, h.effects), (t = h.resolve));
        for (let i of L) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((h = null),
          Q(() => {
            for (let i of s) ee(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) ee(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            St(!1);
          }, !1));
      } else if (h.running) {
        ((h.running = !1), h.effects.push.apply(h.effects, L), (L = null), St(!0));
        return;
      }
    }
    let n = L;
    ((L = null), n.length && Q(() => Dt(n), !1), t && t());
  }
  function Tt(e) {
    for (let t = 0; t < e.length; t++) me(e[t]);
  }
  function Tn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = h.queue;
      r.has(n) ||
        (r.add(n),
        ge(() => {
          (r.delete(n),
            Q(() => {
              ((h.running = !0), me(n));
            }, !1),
            h && (h.running = !1));
        }));
    }
  }
  function An(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : me(r);
    }
    if (E.context) {
      if (E.count) {
        (E.effects || (E.effects = []), E.effects.push(...e.slice(0, n)));
        return;
      }
      je();
    }
    for (
      E.effects &&
        (E.done || !E.count) &&
        ((e = [...E.effects, ...e]), (n += E.effects.length), delete E.effects),
        t = 0;
      t < n;
      t++
    )
      me(e[t]);
  }
  function ke(e, t) {
    let n = h && h.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === H ? s !== t && (!s.updatedAt || s.updatedAt < Te) && me(s) : i === he && ke(s, t);
      }
    }
  }
  function At(e) {
    let t = h && h.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = he) : (r.state = he),
        r.pure ? O.push(r) : L.push(r),
        r.observers && At(r));
    }
  }
  function ee(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) ee(e.tOwned[t]);
      delete e.tOwned;
    }
    if (h && h.running && e.pure) Lt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) ee(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    h && h.running ? (e.tState = 0) : (e.state = 0);
  }
  function Lt(e, t) {
    if ((t || ((e.tState = 0), h.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Lt(e.owned[n]);
  }
  function Ln(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function xt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      Ue(r, (n && n.owner) || null);
    }
  }
  function Ue(e, t = v) {
    let n = bt && t && t.context && t.context[bt],
      r = Ln(e);
    if (!n) throw r;
    L
      ? L.push({
          fn() {
            xt(r, n, t);
          },
          state: H,
        })
      : xt(r, n, t);
  }
  function Ye(e) {
    if (typeof e == 'function' && !e.length) return Ye(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = Ye(e[n]);
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
        te(
          () => (s = F(() => ((v.context = { ...v.context, [e]: r.value }), Pn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Rn = Symbol('fallback');
  function Et(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function Fn(e, t, n = {}) {
    let r = [],
      s = [],
      i = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      B(() => Et(i)),
      () => {
        let l = e() || [],
          f = l.length,
          c,
          d;
        return (
          l[On],
          F(() => {
            let p, _, w, C, T, x, P, g, y;
            if (f === 0)
              (o !== 0 && (Et(i), (i = []), (r = []), (s = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((r = [Rn]), (s[0] = fe(($) => ((i[0] = $), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (s = new Array(f), d = 0; d < f; d++) ((r[d] = l[d]), (s[d] = fe(m)));
              o = f;
            } else {
              for (
                w = new Array(f),
                  C = new Array(f),
                  a && (T = new Array(f)),
                  x = 0,
                  P = Math.min(o, f);
                x < P && r[x] === l[x];
                x++
              );
              for (P = o - 1, g = f - 1; P >= x && g >= x && r[P] === l[g]; P--, g--)
                ((w[g] = s[P]), (C[g] = i[P]), a && (T[g] = a[P]));
              for (p = new Map(), _ = new Array(g + 1), d = g; d >= x; d--)
                ((y = l[d]), (c = p.get(y)), (_[d] = c === void 0 ? -1 : c), p.set(y, d));
              for (c = x; c <= P; c++)
                ((y = r[c]),
                  (d = p.get(y)),
                  d !== void 0 && d !== -1
                    ? ((w[d] = s[c]), (C[d] = i[c]), a && (T[d] = a[c]), (d = _[d]), p.set(y, d))
                    : i[c]());
              for (d = x; d < f; d++)
                d in w
                  ? ((s[d] = w[d]), (i[d] = C[d]), a && ((a[d] = T[d]), a[d](d)))
                  : (s[d] = fe(m));
              ((s = s.slice(0, (o = f))), (r = l.slice(0)));
            }
            return s;
          })
        );
        function m(p) {
          if (((i[d] = p), a)) {
            let [_, w] = I(d);
            return ((a[d] = w), t(l[d], _));
          }
          return t(l[d]);
        }
      }
    );
  }
  var Kn = !1;
  function ye(e, t) {
    if (Kn && E.context) {
      let n = E.context;
      je(En());
      let r = F(() => e(t || {}));
      return (je(n), r);
    }
    return F(() => e(t || {}));
  }
  function ze(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return D(Fn(() => e.each, e.children, t || void 0));
  }
  var Nn = [
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
      ...Nn,
    ]);
  function Bn(e, t, n) {
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
          let d = a;
          for (; d < i; ) f.set(n[d], d++);
        }
        let c = f.get(t[o]);
        if (c != null)
          if (a < c && c < i) {
            let d = o,
              m = 1,
              p;
            for (; ++d < s && d < i && !((p = f.get(t[d])) == null || p !== c + m); ) m++;
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
      fe((i) => {
        ((s = i), t === document ? e() : Ze(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function Qe(e, t, n, r) {
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
        ? () => F(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function Ft(e, t) {
    Nt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Kt(e, t, n) {
    n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
  }
  function $t(e, t, n) {
    return F(() => e(t, n));
  }
  function Ze(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Ae(e, t, r, n);
    te((s) => Ae(e, t(), s, n), r);
  }
  function Nt(e) {
    return !!E.context && !E.done && (!e || e.isConnected);
  }
  function Ae(e, t, n, r, s) {
    let i = Nt(e);
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
          (n = le(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = le(e, n, r);
    } else {
      if (o === 'function')
        return (
          te(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Ae(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          f = n && Array.isArray(n);
        if (Ge(l, t, n, s)) return (te(() => (n = Ae(e, l, n, r, !0))), () => n);
        if (i) {
          if (!l.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let c = l[0];
          if (c.parentNode !== e) return n;
          let d = [c];
          for (; (c = c.nextSibling) !== r; ) d.push(c);
          return (n = d);
        }
        if (l.length === 0) {
          if (((n = le(e, n, r)), a)) return n;
        } else f ? (n.length === 0 ? It(e, l, r) : Bn(e, n, l)) : (n && le(e), It(e, l));
        n = l;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = le(e, n, r, t));
          le(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Ge(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        f;
      if (!(a == null || a === !0 || a === !1))
        if ((f = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Ge(e, a, l) || s;
        else if (f === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Ge(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
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
  function le(e, t, n, r) {
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
  var ce = !1;
  var Hn = () => {},
    V = new Map(),
    et = new Set();
  function Je() {
    et.forEach((e) => e());
  }
  var ve = {
    add(e, t, n) {
      ((V = new Map(V)), V.set(e, { sources: t, proxies: n, exiting: !1, done: Hn }), Je());
    },
    startExiting(e, t) {
      let n = V.get(e);
      n && ((V = new Map(V)), V.set(e, { ...n, exiting: !0, done: t }), Je());
    },
    remove(e) {
      V.has(e) && ((V = new Map(V)), V.delete(e), Je());
    },
    subscribe(e) {
      return (et.add(e), () => et.delete(e));
    },
    getSnapshot() {
      return V;
    },
  };
  var Vn = (e) => typeof e == 'function' && e.length === 0;
  function j(e, t) {
    return e === void 0 ? t : Vn(e) ? e() : e;
  }
  function Bt(e) {
    return e.map((t) => j(t));
  }
  var jn = () => null,
    Ht = Mt(jn);
  var _e = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ne = class {
      constructor(e = {}) {
        u(this, 'dedupe');
        u(this, 'getId');
        u(this, '_events');
        ((this.dedupe = e.dedupe || _e.ADD),
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
            case _e.THROW:
              throw Error('Eventti: duplicate listener id!');
            case _e.IGNORE:
              return n;
            case _e.UPDATE:
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
  var qn = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new ne({ getId: r, dedupe: n })),
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
  function tt(e = 60) {
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
  var Vt = class extends qn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = tt(), ...s } = e;
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
    k = new Vt({
      phases: [M.read, M.write],
      requestFrame: typeof window < 'u' ? tt() : () => () => {},
    });
  var b = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  var jt = new WeakMap();
  function q(e) {
    let t = jt.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), jt.set(e, new WeakRef(t))), t);
  }
  var Z = typeof window < 'u' && window.document !== void 0,
    qt = Z && 'ontouchstart' in window,
    Yt = Z && !!window.PointerEvent;
  Z &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  function Xt(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Yn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Xn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Wt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function Ut(e) {
    return e === 'auto' || e === void 0 ? (Yt ? 'pointer' : qt ? 'touch' : 'mouse') : e;
  }
  var re = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    se = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    be = class {
      constructor(e, t = {}) {
        u(this, 'element');
        u(this, 'drag');
        u(this, 'isDestroyed');
        u(this, '_startPredicate');
        u(this, '_listenerOptions');
        u(this, '_sourceEvents');
        u(this, '_areWindowListenersBound');
        u(this, '_emitter');
        u(this, '_eventData', null);
        u(this, '_removeClickBlocker', null);
        u(this, '_cancelOnVisibilityChange');
        u(this, '_cancelOnEscape');
        u(this, '_preventNativeDrag');
        u(this, '_preventContextMenu');
        u(this, '_preventNativeDragHandler', (e) => e.preventDefault());
        u(this, '_preventContextMenuHandler', (e) => e.preventDefault());
        u(this, '_visibilityChangeHandler', () => {
          this.cancel();
        });
        u(this, '_onKeyDown', (e) => {
          e.key === 'Escape' && this.drag && (e.preventDefault(), this.cancel());
        });
        let {
          listenerOptions: n = se.listenerOptions,
          sourceEvents: r = se.sourceEvents,
          startPredicate: s = se.startPredicate,
          cancelOnVisibilityChange: i = se.cancelOnVisibilityChange,
          cancelOnEscape: o = se.cancelOnEscape,
          preventNativeDrag: a = se.preventNativeDrag,
          preventContextMenu: l = se.preventContextMenu,
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
          (this._sourceEvents = Ut(r)),
          (this._emitter = new ne()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(re[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? Xt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Yn(e);
        if (t === null) return;
        let n = Xt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Xn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: b.Start, srcEvent: e, target: n.target }),
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
          (n.type = b.Move),
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
          (n.type = b.Cancel),
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
          (n.type = b.End),
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
        let { move: e, end: t, cancel: n } = re[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = re[this._sourceEvents];
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
          ((this._eventData.type = b.Cancel),
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
            re[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(re[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          l = Ut(n),
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
              re[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && f && (this._listenerOptions = f),
            this.element.addEventListener(
              re[this._sourceEvents].start,
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
          this._emitter.emit(b.Destroy, { type: b.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            re[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Wn(e) {
    let t = q(e),
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
  function Un(e) {
    let t = q(e),
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
  function ie(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = q(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', f] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Un(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Wn(e)}px`),
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
  function Se(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function nt(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var oe = Z ? new DOMMatrix() : null;
  function we(e, t = new DOMMatrix()) {
    let n = e;
    for (Se(t); n; ) {
      let r = ie(n);
      if (r && (oe.setMatrixValue(r), !oe.isIdentity)) {
        let { transformOrigin: s } = q(n),
          { x: i, y: o, z: a } = nt(s);
        (a === 0
          ? oe.setMatrixValue(`translate(${i}px,${o}px) ${oe} translate(${i * -1}px,${o * -1}px)`)
          : oe.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${oe} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(oe));
      }
      n = n.parentElement;
    }
    return t;
  }
  var zt = new WeakMap();
  function U(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = zt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), zt.set(e, new WeakRef(n))), n);
  }
  var zn = typeof window < 'u' && window.document !== void 0,
    rt = !!(
      zn &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    xe = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    ss = {
      [xe.content]: !1,
      [xe.padding]: !1,
      [xe.scrollbar]: !0,
      [xe.border]: !0,
      [xe.margin]: !0,
    };
  var is = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function Le(e) {
    switch (U(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function Ie(e) {
    let t = U(e);
    if (!rt) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: f } = t;
      if (f && f !== 'none') return !0;
      let { willChange: c } = t;
      if (c && (c.indexOf('filter') > -1 || c.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Le(e);
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
      ) || !!(rt && a && a.indexOf('filter') > -1)
    );
  }
  function Gt(e) {
    return U(e).position !== 'static' || Ie(e);
  }
  function Qt(e) {
    return e instanceof HTMLHtmlElement;
  }
  function st(e, t = {}) {
    if (Qt(e)) return e.ownerDocument.defaultView;
    let n = t.position || U(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = Le(i);
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
          let a = i ? Ie(o) : Gt(o);
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
  function Zt(e) {
    return e instanceof Window;
  }
  function it(e, t = {}) {
    let n = U(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || U(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return st(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = st(e, { container: o, position: s, skipDisplayNone: i });
        return Zt(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Gn(e, t) {
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
  function ot(e) {
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
  function Jt(e, t, n = null) {
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
  function Re(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var en = class {
      constructor() {
        u(this, '_cache');
        u(this, '_validation');
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
    rn = class {
      constructor(e, t) {
        u(this, 'sensor');
        u(this, 'startEvent');
        u(this, 'prevMoveEvent');
        u(this, 'moveEvent');
        u(this, 'endEvent');
        u(this, 'items');
        u(this, 'isEnded');
        u(this, '_matrixCache');
        u(this, '_clientOffsetCache');
        ((this.sensor = e),
          (this.startEvent = { ...t }),
          (this.prevMoveEvent = { ...t }),
          (this.moveEvent = { ...t }),
          (this.endEvent = null),
          (this.items = []),
          (this.isEnded = !1),
          (this._matrixCache = new en()),
          (this._clientOffsetCache = new en()));
      }
    };
  function Qn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function Zn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Qn(
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
  function De(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = q(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function tn(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Jn = { x: 0, y: 0 },
    er = { x: 0, y: 0 };
  function tr(e, t, n = { x: 0, y: 0 }) {
    let r = tn(e) ? e : De(e, Jn),
      s = tn(t) ? t : De(t, er);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Fe = Z ? Zn() : null,
    sn = class {
      constructor(e, t) {
        u(this, 'data');
        u(this, 'element');
        u(this, 'elementContainer');
        u(this, 'elementOffsetContainer');
        u(this, 'dragContainer');
        u(this, 'dragOffsetContainer');
        u(this, 'elementTransformOrigin');
        u(this, 'elementTransformMatrix');
        u(this, 'elementOffsetMatrix');
        u(this, 'frozenStyles');
        u(this, 'unfrozenStyles');
        u(this, 'clientRect');
        u(this, 'position');
        u(this, 'containerOffset');
        u(this, 'alignmentOffset');
        u(this, '_moveDiff');
        u(this, '_alignDiff');
        u(this, '_matrixCache');
        u(this, '_clientOffsetCache');
        if (!e.isConnected) throw Error('Element is not connected');
        let { drag: n } = t;
        if (!n) throw Error('Drag is not defined');
        let r = q(e),
          s = e.getBoundingClientRect(),
          i = ie(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = nt(r.transformOrigin)),
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
          let { position: d } = r;
          if (d !== 'fixed' && d !== 'absolute')
            throw Error(
              `Dragged element has "${d}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let f = it(e) || e;
        ((this.elementOffsetContainer = f),
          (this.dragOffsetContainer = l === o ? f : it(e, { container: l })));
        {
          let { width: d, height: m, x: p, y: _ } = s;
          this.clientRect = { width: d, height: m, x: p, y: _ };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let c = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(c))
          if (c.length) {
            let d = {};
            for (let m of c) d[m] = r[m];
            this.frozenStyles = d;
          } else this.frozenStyles = null;
        else this.frozenStyles = c;
        if (this.frozenStyles) {
          let d = {};
          for (let m in this.frozenStyles) d[m] = e.style[m];
          this.unfrozenStyles = d;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, r] = t;
            (we(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
            let d = i.get(c) || { x: 0, y: 0 };
            if (!i.isValid(c)) {
              let m = o.get(f);
              c instanceof HTMLElement && m && !m[0].isIdentity
                ? ot(m[0])
                  ? (Fe.style.setProperty('transform', m[1].toString(), 'important'),
                    c.append(Fe),
                    De(Fe, d),
                    Fe.remove())
                  : (De(c, d), (d.x -= m[0].m41), (d.y -= m[0].m42))
                : De(c, d);
            }
            return (i.set(c, d), d);
          });
          tr(a, l, s);
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
    nn = { capture: !0, passive: !0 },
    nr = { x: 0, y: 0 },
    z = Z ? new DOMMatrix() : null,
    Ke = Z ? new DOMMatrix() : null,
    Y = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(Y || {}),
    X = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(X || {}),
    Ee = { Start: 'start', Move: 'move', End: 'end' },
    Ce = { Immediate: 'immediate', Sampled: 'sampled' },
    J = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    K = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    on = {
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
            containerOffset: f,
            elementTransformMatrix: c,
            elementTransformOrigin: d,
            elementOffsetMatrix: m,
          } = e,
          { x: p, y: _, z: w } = d,
          C = !c.isIdentity && (p !== 0 || _ !== 0 || w !== 0),
          T = a.x + l.x + f.x,
          x = a.y + l.y + f.y;
        (Se(z),
          C && (w === 0 ? z.translateSelf(-p, -_) : z.translateSelf(-p, -_, -w)),
          n ? s.isIdentity || z.multiplySelf(s) : o.isIdentity || z.multiplySelf(o),
          Se(Ke).translateSelf(T, x),
          z.multiplySelf(Ke),
          r.isIdentity || z.multiplySelf(r),
          C && (Se(Ke).translateSelf(p, _, w), z.multiplySelf(Ke)),
          c.isIdentity || z.multiplySelf(c),
          m.isIdentity || z.preMultiplySelf(m),
          (e.element.style.transform = `${z}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Ce.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    at = class {
      constructor(e, t = {}) {
        u(this, 'id');
        u(this, '_sensors');
        u(this, 'settings');
        u(this, 'plugins');
        u(this, 'drag');
        u(this, 'isDestroyed');
        u(this, '_sensorData');
        u(this, '_emitter');
        u(this, '_startPhase');
        u(this, '_startId');
        u(this, '_moveId');
        u(this, '_alignId');
        u(this, '_modifierData');
        u(this, '_selectionChangeHandler', null);
        u(this, '_pointerCaptureTarget', null);
        u(this, '_pointerCapturePointerId', null);
        let { id: n = Symbol(), ...r } = t;
        ((this.id = n),
          (this._sensors = e),
          (this.settings = this._parseSettings(r)),
          (this.plugins = {}),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._sensorData = new Map()),
          (this._emitter = new ne()),
          (this._startPhase = Y.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: Ee.Start }),
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
          predicateState: X.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(b.Start, t, t), e.on(b.Move, t, t), e.on(b.Cancel, n, n), e.on(b.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(b.Start, n),
          e.off(b.Move, n),
          e.off(b.Cancel, r),
          e.off(b.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = on) {
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
          preventClickOnEnd: d = t.preventClickOnEnd,
          preventTextSelection: m = t.preventTextSelection,
          capturePointer: p = t.capturePointer,
          onPrepareStart: _ = t.onPrepareStart,
          onStart: w = t.onStart,
          onPrepareMove: C = t.onPrepareMove,
          onMove: T = t.onMove,
          onEnd: x = t.onEnd,
          onDestroy: P = t.onDestroy,
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
          preventClickOnEnd: d,
          preventTextSelection: m,
          capturePointer: p,
          onPrepareStart: _,
          onStart: w,
          onPrepareMove: C,
          onMove: T,
          onEnd: x,
          onDestroy: P,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case X.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case X.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Ce.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (k.once(M.read, this._prepareMove, this._moveId),
                    k.once(M.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === X.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = X.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = X.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== Y.Init ||
          ((this._startPhase = Y.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new sn(t, this),
          )),
          this._applyModifiers(Ee.Start, 0, 0),
          this._emit(K.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = Y.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== Y.FinishPrepare)) {
          if (((this._startPhase = Y.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof be && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Jt(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: J.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Gn(n, r) || (!ot(n) && !ot(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Re(t.clientRect.x - s.x, 3)), (i.y += Re(t.clientRect.y - s.y, 3)));
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
          (window.addEventListener('scroll', this._onScroll, nn),
            this._emit(K.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = Y.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(Ee.Move, r, s),
          this._emit(K.PrepareMove, e, this),
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
          (this._emit(K.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
          let a = nr;
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
        n.predicateState === X.Pending &&
          r &&
          ((this._startPhase = Y.Init),
          (n.predicateState = X.Resolved),
          (n.predicateEvent = null),
          (this.drag = new rn(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = X.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Ce.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (k.once(M.read, this._prepareStart, this._startId),
              k.once(M.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === X.Pending &&
          ((t.predicateState = X.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === Y.Prepare || this._startPhase === Y.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = Y.None),
          k.off(M.read, this._startId),
          k.off(M.write, this._startId),
          k.off(M.read, this._moveId),
          k.off(M.write, this._moveId),
          k.off(M.read, this._alignId),
          k.off(M.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, nn),
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
        this._applyModifiers(Ee.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Jt(n.elementContainer, n.element),
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
            ((n.alignmentOffset.x = Re(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = Re(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: J.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(K.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Ce.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (k.once(M.read, this._prepareAlign, this._alignId),
              k.once(M.write, this._applyAlign, this._alignId)));
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
          this._emit(K.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  function an() {
    return Xe(Ht);
  }
  var rr = Object.prototype.hasOwnProperty,
    ln = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function $e(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      r = Array.isArray(t);
    if (n || r) {
      if (!n || !r) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let f = 0; f < l; f++) if (!$e(e[f], t[f])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!ln(e) || !ln(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let f = o[l];
      if (!rr.call(t, f) || !$e(e[f], t[f])) return !1;
    }
    return !0;
  }
  var cn = class {
    constructor() {
      u(this, 'drag');
      u(this, 'isDestroyed');
      u(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new ne()));
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
        this._emitter.emit(b.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(b.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(b.End, t),
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
        this._emitter.emit(b.Cancel, t),
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
          type: b.Cancel,
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
        this._emitter.emit(b.Destroy, { type: b.Destroy }),
        this._emitter.off());
    }
  };
  var dn = class extends cn {
    constructor() {
      super();
      u(this, 'drag');
      u(this, '_direction');
      u(this, '_speed');
      u(this, '_tickEvent');
      u(this, '_moveEvent');
      ((this.drag = null),
        (this._direction = { x: 0, y: 0 }),
        (this._speed = 0),
        (this._tickEvent = { type: 'tick', time: 0, deltaTime: 0 }),
        (this._moveEvent = {
          type: b.Move,
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
      this.isDestroyed || this.drag || (super._start(t), k.on(M.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (k.off(M.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (k.off(M.read, this._tick), super._cancel(t));
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
  var sr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Ne(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let r of e) {
      let s = t.get(r);
      s !== void 0 && s < n && (n = s);
    }
    return n;
  }
  var G = {
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
    un = class extends dn {
      constructor(t, n = {}) {
        super();
        u(this, 'element');
        u(this, '_eventData', { type: '', x: 0, y: 0, srcEvent: null });
        u(this, '_moveKeys');
        u(this, '_moveKeyTimestamps');
        u(this, '_startKeys');
        u(this, '_moveLeftKeys');
        u(this, '_moveRightKeys');
        u(this, '_moveUpKeys');
        u(this, '_moveDownKeys');
        u(this, '_cancelKeys');
        u(this, '_endKeys');
        u(this, '_cancelOnBlur');
        u(this, '_cancelOnVisibilityChange');
        u(this, '_computeSpeed');
        u(this, '_startPredicate');
        let {
          startPredicate: r = G.startPredicate,
          computeSpeed: s = G.computeSpeed,
          cancelOnVisibilityChange: i = G.cancelOnVisibilityChange,
          cancelOnBlur: o = G.cancelOnBlur,
          startKeys: a = G.startKeys,
          moveLeftKeys: l = G.moveLeftKeys,
          moveRightKeys: f = G.moveRightKeys,
          moveUpKeys: c = G.moveUpKeys,
          moveDownKeys: d = G.moveDownKeys,
          cancelKeys: m = G.cancelKeys,
          endKeys: p = G.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(m)),
          (this._endKeys = new Set(p)),
          (this._moveLeftKeys = new Set(l)),
          (this._moveRightKeys = new Set(f)),
          (this._moveUpKeys = new Set(c)),
          (this._moveDownKeys = new Set(d)),
          (this._moveKeys = new Set([...l, ...f, ...c, ...d])),
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
        let t = Ne(this._moveLeftKeys, this._moveKeyTimestamps),
          n = Ne(this._moveRightKeys, this._moveKeyTimestamps),
          r = Ne(this._moveUpKeys, this._moveKeyTimestamps),
          s = Ne(this._moveDownKeys, this._moveKeyTimestamps),
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
              ((r.type = b.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
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
          ((n.type = b.End),
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
          sr.forEach((a, l) => {
            let f = `${a}Keys`,
              c = t[f];
            c !== void 0 && ((this[`_${f}`] = new Set(c)), l >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((l, f) => a[f] === l)) ||
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
  var Be = new Map(),
    He = [],
    lt = [],
    ct = [],
    dt = [],
    ut = [],
    ft = [],
    ht = [],
    mt = [];
  function fn() {
    (Be.clear(),
      (He.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (dt.length = 0),
      (ut.length = 0),
      (ft.length = 0),
      (ht.length = 0),
      (mt.length = 0));
  }
  function hn(e) {
    let t = [];
    fn();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = q(r),
        a = ie(r),
        l = a ? o.transformOrigin : '',
        f,
        c;
      if (r instanceof SVGSVGElement) ((f = `${i.width}px`), (c = `${i.height}px`));
      else {
        let p = parseFloat(o.width),
          _ = parseFloat(o.height);
        if (!(p >= 0) || !(_ >= 0)) ((f = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((f = o.width), (c = o.height));
        else {
          let w = parseFloat(o.paddingLeft) || 0,
            C = parseFloat(o.paddingRight) || 0,
            T = parseFloat(o.borderLeftWidth) || 0,
            x = parseFloat(o.borderRightWidth) || 0,
            P = parseFloat(o.paddingTop) || 0,
            g = parseFloat(o.paddingBottom) || 0,
            y = parseFloat(o.borderTopWidth) || 0,
            $ = parseFloat(o.borderBottomWidth) || 0;
          ((f = `${p + w + C + T + x}px`), (c = `${_ + P + g + y + $}px`));
        }
      }
      let d = document.createElement('div'),
        m = d.style;
      ((m.position = 'absolute'),
        (m.left = '0px'),
        (m.top = '0px'),
        (m.margin = '0'),
        (m.padding = '0'),
        (m.boxSizing = 'border-box'),
        (m.pointerEvents = 'none'),
        (m.contain = 'layout'),
        (d.dataset.dragPreviewProxy = 'true'),
        (He[n] = s),
        (t[n] = d),
        (lt[n] = i),
        (ct[n] = a),
        (dt[n] = l),
        (ut[n] = f),
        (ft[n] = c),
        Be.has(s) || Be.set(s, we(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = He[n],
        s = t[n],
        i = ct[n],
        o = dt[n],
        a = ut[n],
        l = ft[n],
        f = s.style;
      ((f.width = a),
        (f.height = l),
        i && ((f.transform = i), o && (f.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = He[n],
        s = t[n],
        i = lt[n],
        o = Be.get(r),
        a = 0,
        l = 0,
        f = o.m11,
        c = o.m12,
        d = o.m21,
        m = o.m22,
        p = f * m - c * d,
        _ = s.getBoundingClientRect(),
        w = i.left - _.left,
        C = i.top - _.top;
      if (Math.abs(p) < 1e-10) ((a = w), (l = C));
      else {
        let T = 1 / p;
        ((a = (m * w - d * C) * T), (l = (-c * w + f * C) * T));
      }
      ((ht[n] = a), (mt[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = ht[n],
        i = mt[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (fn(), t);
  }
  function mn(e, t) {
    if (ce) return () => null;
    let n = D(() => (Array.isArray(e) ? Bt(e) : (j(e) ?? [])).filter((g) => !!g)),
      r = D(() => j(t)),
      s = D(() => r()?.id),
      i = D(() => r()?.dndObserver),
      o = D(() => {
        let g = r();
        if (!g) return;
        let {
          dndObserver: y,
          id: $,
          dragPreviewContainer: Oe,
          dragPreviewExitTimeout: A,
          ...W
        } = g;
        return W;
      }),
      a = an(),
      l = D(() => {
        let g = i();
        return g === void 0 ? a() : g;
      }),
      [f, c] = I(null),
      d = null,
      m = s(),
      p = o(),
      _ = l(),
      w = o(),
      C = r()?.dragPreviewContainer,
      T = r()?.dragPreviewExitTimeout;
    R(() => {
      let g = r();
      ((w = o()), (C = g?.dragPreviewContainer), (T = g?.dragPreviewExitTimeout));
    });
    let x = () => {
        d && (d.destroy(), (d = null), (p = void 0), c(null));
      },
      P = () => {
        Ot(() => {
          x();
          let g = F(n);
          if (!g.length) return;
          let y = F(o),
            $ = s(),
            Oe = y?.dragPreview,
            A = new at(g, {
              id: $,
              ...y,
              elements(N) {
                let gt = w,
                  de = (gt?.elements || (() => null))(N);
                if (!gt?.dragPreview || !de || de.length === 0) return de;
                let ue = hn(de);
                ve.add(N.draggable, de, ue);
                let pt = () => {
                    let yt = T || 0;
                    if (yt > 0) {
                      for (let Ve of ue) Ve.dataset.exiting = 'true';
                      let Me = !1,
                        vt = () => {
                          Me ||
                            ((Me = !0),
                            clearTimeout(Sn),
                            ve.remove(N.draggable),
                            setTimeout(() => {
                              for (let Ve of ue) Ve.remove();
                            }, 0));
                        },
                        Sn = setTimeout(vt, yt);
                      ve.startExiting(N.draggable, vt);
                    } else
                      (ve.remove(N.draggable),
                        setTimeout(() => {
                          for (let Me of ue) Me.remove();
                        }, 0));
                    (N.draggable.off('end', _n), N.draggable.off('destroy', bn));
                  },
                  _n = N.draggable.on('end', pt),
                  bn = N.draggable.on('destroy', pt);
                return ue;
              },
              ...(Oe
                ? {
                    container: () => {
                      let N = C;
                      return (typeof N == 'function' ? N() : N) || document.body;
                    },
                  }
                : {}),
            }),
            W = F(l);
          (W?.addDraggables([A]), (d = A), (m = $), (p = y), (_ = W), c(A));
        });
      };
    return (
      R(() => {
        let g = n();
        if (!g.length) {
          x();
          return;
        }
        let y = d;
        if (!y) {
          P();
          return;
        }
        (g.length !== y.sensors.length || g.some(($) => !y.sensors.includes($))) && P();
      }),
      R(() => {
        if (!d) return;
        let y = s();
        m !== y && P();
      }),
      R(() => {
        let g = l();
        if (_ === g) return;
        let y = d;
        (y && (_?.removeDraggables([y]), g?.addDraggables([y])), (_ = g));
      }),
      R(() => {
        let g = d;
        if (!g) return;
        let y = o(),
          $ = !1;
        if (p) {
          let A = { ...p },
            W = { ...y };
          ((A.elements === W.elements || (A.dragPreview && W.dragPreview)) &&
            (delete A.elements, delete W.elements),
            ($ = !$e(A, W)));
        } else $ = !0;
        if (!$) return;
        let Oe = g._parseSettings(y);
        if (
          (g.updateSettings({
            ...Oe,
            ...(!y?.dragPreview && y?.elements ? { elements: y.elements } : {}),
            ...(y?.dragPreview
              ? {
                  container: () => {
                    let A = C;
                    return (typeof A == 'function' ? A() : A) || document.body;
                  },
                }
              : {}),
          }),
          p)
        ) {
          let A = y?.dndGroups !== p.dndGroups,
            W = y?.computeClientRect !== p.computeClientRect;
          (A && _?.clearTargets(g), (A || W) && _?.detectCollisions(g));
        }
        p = y;
      }),
      B(x),
      f
    );
  }
  function gn(e, t = !1) {
    let n = D(() => j(e)),
      [r, s] = I(null),
      [i, o] = I(0);
    return (
      R(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(K.Start, () => {
            s(a.drag || null);
          }),
          f = null;
        t &&
          (f = a.on(K.Move, () => {
            a.drag && o((d) => (d + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(K.End, () => {
          s(null);
        });
        B(() => {
          (a.off(K.Start, l), f && a.off(K.Move, f), a.off(K.End, c));
        });
      }),
      D(() => (i(), r()))
    );
  }
  function pn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = D(() => j(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : j(t))),
      [s, i] = I(null),
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
        let d = new un(c, n());
        ((o = d), i(d));
      };
    (R(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      R(() => {
        let c = r();
        c !== void 0 && (l(c), B(a));
      }));
    let f = (c) => {
      if (t === void 0) {
        if (c === null) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (B(a), [s, f]);
  }
  function yn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = D(() => j(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : j(t))),
      [s, i] = I(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let d = new be(c, n());
        ((o = d), i(d));
      };
    (R(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      R(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), B(a));
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
    return (B(a), [s, f]);
  }
  var ir = Qe(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    or = Qe('<div class=card-grid>');
  function ar(e) {
    let t = null,
      [n, r] = yn(),
      [s, i] = pn(),
      [o, a] = I(1),
      l = mn([n, s], () => ({
        elements: () => (t ? [t] : []),
        onStart: () => {
          a(e.nextZIndex());
        },
      })),
      f = gn(l),
      c = (d) => {
        ((t = d), r(d), i(d));
      };
    return (() => {
      var d = ir();
      return (
        $t(c, d),
        te(
          (m) => {
            var p = `card draggable ${f() ? 'dragging' : ''}`,
              _ = o();
            return (p !== m.e && Ft(d, (m.e = p)), _ !== m.t && Kt(d, 'z-index', (m.t = _)), m);
          },
          { e: void 0, t: void 0 },
        ),
        d
      );
    })();
  }
  var lr = [0, 1, 2, 3];
  function cr() {
    let e = 1,
      t = () => ++e;
    return (() => {
      var n = or();
      return (Ze(n, ye(ze, { each: lr, children: () => ye(ar, { nextZIndex: t }) })), n);
    })();
  }
  var vn = document.getElementById('root');
  if (!vn) throw new Error('Failed to find the root element');
  Rt(() => ye(cr, {}), vn);
})();
