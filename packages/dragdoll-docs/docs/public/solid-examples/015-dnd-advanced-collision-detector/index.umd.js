'use strict';
var SolidExample_015_dnd_advanced_collision_detector = (() => {
  var dr = Object.defineProperty;
  var ur = (e, t, n) =>
    t in e ? dr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var c = (e, t, n) => ur(e, typeof t != 'symbol' ? t + '' : t, n);
  var L = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return An(this.context.count);
    },
    getNextContextId() {
      return An(this.context.count++);
    },
  };
  function An(e) {
    let t = String(e),
      n = t.length - 1;
    return L.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Wt(e) {
    L.context = e;
  }
  function hr() {
    return { ...L.context, id: L.getNextContextId(), count: 0 };
  }
  var fr = !1,
    gr = (e, t) => e === t,
    zt = Symbol('solid-proxy'),
    pr = typeof Proxy == 'function',
    mr = Symbol('solid-track');
  var Et = { equals: gr },
    kn = null,
    Fn = Vn,
    ie = 1,
    Je = 2,
    qn = { owned: null, cleanups: null, context: null, owner: null };
  var M = null,
    p = null,
    et = null,
    $e = null,
    F = null,
    V = null,
    j = null,
    Mt = 0;
  function Qe(e, t) {
    let n = F,
      i = M,
      r = e.length === 0,
      s = t === void 0 ? i : t,
      o = r ? qn : { owned: null, cleanups: null, context: s ? s.context : null, owner: s },
      a = r ? e : () => e(() => H(() => we(o)));
    ((M = o), (F = null));
    try {
      return pe(a, !0);
    } finally {
      ((F = n), (M = i));
    }
  }
  function q(e, t) {
    t = t ? Object.assign({}, Et, t) : Et;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      i = (r) => (
        typeof r == 'function' &&
          (p && p.running && p.sources.has(n) ? (r = r(n.tValue)) : (r = r(n.value))),
        Kn(n, r)
      );
    return [$n.bind(n), i];
  }
  function re(e, t, n) {
    let i = Ut(e, t, !1, ie);
    et && p && p.running ? V.push(i) : tt(i);
  }
  function R(e, t, n) {
    Fn = Sr;
    let i = Ut(e, t, !1, ie),
      r = Xt && jt(Xt);
    (r && (i.suspense = r), (!n || !n.render) && (i.user = !0), j ? j.push(i) : tt(i));
  }
  function b(e, t, n) {
    n = n ? Object.assign({}, Et, n) : Et;
    let i = Ut(e, t, !0, 0);
    return (
      (i.observers = null),
      (i.observerSlots = null),
      (i.comparator = n.equals || void 0),
      et && p && p.running ? ((i.tState = ie), V.push(i)) : tt(i),
      $n.bind(i)
    );
  }
  function Bn(e) {
    return pe(e, !1);
  }
  function H(e) {
    if (!$e && F === null) return e();
    let t = F;
    F = null;
    try {
      return $e ? $e.untrack(e) : e();
    } finally {
      F = t;
    }
  }
  function $(e) {
    return (M === null || (M.cleanups === null ? (M.cleanups = [e]) : M.cleanups.push(e)), e);
  }
  function _r(e) {
    if (p && p.running) return (e(), p.done);
    let t = F,
      n = M;
    return Promise.resolve().then(() => {
      ((F = t), (M = n));
      let i;
      return (
        (et || Xt) &&
          ((i =
            p ||
            (p = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          i.done || (i.done = new Promise((r) => (i.resolve = r))),
          (i.running = !0)),
        pe(e, !1),
        (F = M = null),
        i ? i.done : void 0
      );
    });
  }
  var [Vs, Pn] = q(!1);
  function Nn(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: wr(n), defaultValue: e };
  }
  function jt(e) {
    let t;
    return M && M.context && (t = M.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function yr(e) {
    let t = b(e),
      n = b(() => Yt(t()));
    return (
      (n.toArray = () => {
        let i = n();
        return Array.isArray(i) ? i : i != null ? [i] : [];
      }),
      n
    );
  }
  var Xt;
  function $n() {
    let e = p && p.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === ie) tt(this);
      else {
        let t = V;
        ((V = null), pe(() => Ct(this), !1), (V = t));
      }
    if (F) {
      let t = this.observers ? this.observers.length : 0;
      (F.sources
        ? (F.sources.push(this), F.sourceSlots.push(t))
        : ((F.sources = [this]), (F.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(F), this.observerSlots.push(F.sources.length - 1))
          : ((this.observers = [F]), (this.observerSlots = [F.sources.length - 1])));
    }
    return e && p.sources.has(this) ? this.tValue : this.value;
  }
  function Kn(e, t, n) {
    let i = p && p.running && p.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(i, t)) {
      if (p) {
        let r = p.running;
        ((r || (!n && p.sources.has(e))) && (p.sources.add(e), (e.tValue = t)), r || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        pe(() => {
          for (let r = 0; r < e.observers.length; r += 1) {
            let s = e.observers[r],
              o = p && p.running;
            (o && p.disposed.has(s)) ||
              ((o ? !s.tState : !s.state) && (s.pure ? V.push(s) : j.push(s), s.observers && Hn(s)),
              o ? (s.tState = ie) : (s.state = ie));
          }
          if (V.length > 1e6) throw ((V = []), new Error());
        }, !1);
    }
    return t;
  }
  function tt(e) {
    if (!e.fn) return;
    we(e);
    let t = Mt;
    (Rn(e, p && p.running && p.sources.has(e) ? e.tValue : e.value, t),
      p &&
        !p.running &&
        p.sources.has(e) &&
        queueMicrotask(() => {
          pe(() => {
            (p && (p.running = !0), (F = M = e), Rn(e, e.tValue, t), (F = M = null));
          }, !1);
        }));
  }
  function Rn(e, t, n) {
    let i,
      r = M,
      s = F;
    F = M = e;
    try {
      i = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (p && p.running
            ? ((e.tState = ie), e.tOwned && e.tOwned.forEach(we), (e.tOwned = void 0))
            : ((e.state = ie), e.owned && e.owned.forEach(we), (e.owned = null))),
        (e.updatedAt = n + 1),
        Gt(o)
      );
    } finally {
      ((F = s), (M = r));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Kn(e, i, !0)
        : p && p.running && e.pure
          ? (p.sources.has(e) || (e.value = i), p.sources.add(e), (e.tValue = i))
          : (e.value = i),
      (e.updatedAt = n));
  }
  function Ut(e, t, n, i = ie, r) {
    let s = {
      fn: e,
      state: i,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: M,
      context: M ? M.context : null,
      pure: n,
    };
    if (
      (p && p.running && ((s.state = 0), (s.tState = i)),
      M === null ||
        (M !== qn &&
          (p && p.running && M.pure
            ? M.tOwned
              ? M.tOwned.push(s)
              : (M.tOwned = [s])
            : M.owned
              ? M.owned.push(s)
              : (M.owned = [s]))),
      $e && s.fn)
    ) {
      let o = s.fn,
        [a, l] = q(void 0, { equals: !1 }),
        d = $e.factory(o, l);
      $(() => d.dispose());
      let u,
        h = () =>
          _r(l).then(() => {
            u && (u.dispose(), (u = void 0));
          });
      s.fn = (f) => (a(), p && p.running ? (u || (u = $e.factory(o, h)), u.track(f)) : d.track(f));
    }
    return s;
  }
  function Ze(e) {
    let t = p && p.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === Je) return Ct(e);
    if (e.suspense && H(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Mt); ) {
      if (t && p.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let i = n.length - 1; i >= 0; i--) {
      if (((e = n[i]), t)) {
        let r = e,
          s = n[i + 1];
        for (; (r = r.owner) && r !== s; ) if (p.disposed.has(r)) return;
      }
      if ((t ? e.tState : e.state) === ie) tt(e);
      else if ((t ? e.tState : e.state) === Je) {
        let r = V;
        ((V = null), pe(() => Ct(e, n[0]), !1), (V = r));
      }
    }
  }
  function pe(e, t) {
    if (V) return e();
    let n = !1;
    (t || (V = []), j ? (n = !0) : (j = []), Mt++);
    try {
      let i = e();
      return (br(n), i);
    } catch (i) {
      (n || (j = null), (V = null), Gt(i));
    }
  }
  function br(e) {
    if ((V && (et && p && p.running ? vr(V) : Vn(V), (V = null)), e)) return;
    let t;
    if (p) {
      if (!p.promises.size && !p.queue.size) {
        let i = p.sources,
          r = p.disposed;
        (j.push.apply(j, p.effects), (t = p.resolve));
        for (let s of j) ('tState' in s && (s.state = s.tState), delete s.tState);
        ((p = null),
          pe(() => {
            for (let s of r) we(s);
            for (let s of i) {
              if (((s.value = s.tValue), s.owned))
                for (let o = 0, a = s.owned.length; o < a; o++) we(s.owned[o]);
              (s.tOwned && (s.owned = s.tOwned), delete s.tValue, delete s.tOwned, (s.tState = 0));
            }
            Pn(!1);
          }, !1));
      } else if (p.running) {
        ((p.running = !1), p.effects.push.apply(p.effects, j), (j = null), Pn(!0));
        return;
      }
    }
    let n = j;
    ((j = null), n.length && pe(() => Fn(n), !1), t && t());
  }
  function Vn(e) {
    for (let t = 0; t < e.length; t++) Ze(e[t]);
  }
  function vr(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        i = p.queue;
      i.has(n) ||
        (i.add(n),
        et(() => {
          (i.delete(n),
            pe(() => {
              ((p.running = !0), Ze(n));
            }, !1),
            p && (p.running = !1));
        }));
    }
  }
  function Sr(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let i = e[t];
      i.user ? (e[n++] = i) : Ze(i);
    }
    if (L.context) {
      if (L.count) {
        (L.effects || (L.effects = []), L.effects.push(...e.slice(0, n)));
        return;
      }
      Wt();
    }
    for (
      L.effects &&
        (L.done || !L.count) &&
        ((e = [...L.effects, ...e]), (n += L.effects.length), delete L.effects),
        t = 0;
      t < n;
      t++
    )
      Ze(e[t]);
  }
  function Ct(e, t) {
    let n = p && p.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let i = 0; i < e.sources.length; i += 1) {
      let r = e.sources[i];
      if (r.sources) {
        let s = n ? r.tState : r.state;
        s === ie ? r !== t && (!r.updatedAt || r.updatedAt < Mt) && Ze(r) : s === Je && Ct(r, t);
      }
    }
  }
  function Hn(e) {
    let t = p && p.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let i = e.observers[n];
      (t ? !i.tState : !i.state) &&
        (t ? (i.tState = Je) : (i.state = Je),
        i.pure ? V.push(i) : j.push(i),
        i.observers && Hn(i));
    }
  }
  function we(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        let n = e.sources.pop(),
          i = e.sourceSlots.pop(),
          r = n.observers;
        if (r && r.length) {
          let s = r.pop(),
            o = n.observerSlots.pop();
          i < r.length && ((s.sourceSlots[o] = i), (r[i] = s), (n.observerSlots[i] = o));
        }
      }
    if (e.tOwned) {
      for (t = e.tOwned.length - 1; t >= 0; t--) we(e.tOwned[t]);
      delete e.tOwned;
    }
    if (p && p.running && e.pure) Wn(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) we(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    p && p.running ? (e.tState = 0) : (e.state = 0);
  }
  function Wn(e, t) {
    if ((t || ((e.tState = 0), p.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Wn(e.owned[n]);
  }
  function xr(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function In(e, t, n) {
    try {
      for (let i of t) i(e);
    } catch (i) {
      Gt(i, (n && n.owner) || null);
    }
  }
  function Gt(e, t = M) {
    let n = kn && t && t.context && t.context[kn],
      i = xr(e);
    if (!n) throw i;
    j
      ? j.push({
          fn() {
            In(i, n, t);
          },
          state: ie,
        })
      : In(i, n, t);
  }
  function Yt(e) {
    if (typeof e == 'function' && !e.length) return Yt(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let i = Yt(e[n]);
        Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
      }
      return t;
    }
    return e;
  }
  function wr(e, t) {
    return function (i) {
      let r;
      return (
        re(
          () => (r = H(() => ((M.context = { ...M.context, [e]: i.value }), yr(() => i.children)))),
          void 0,
        ),
        r
      );
    };
  }
  var Dr = Symbol('fallback');
  function Ln(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function Er(e, t, n = {}) {
    let i = [],
      r = [],
      s = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      $(() => Ln(s)),
      () => {
        let l = e() || [],
          d = l.length,
          u,
          h;
        return (
          l[mr],
          H(() => {
            let g, m, _, S, E, y, w, v, x;
            if (d === 0)
              (o !== 0 && (Ln(s), (s = []), (i = []), (r = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((i = [Dr]), (r[0] = Qe((z) => ((s[0] = z), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (r = new Array(d), h = 0; h < d; h++) ((i[h] = l[h]), (r[h] = Qe(f)));
              o = d;
            } else {
              for (
                _ = new Array(d),
                  S = new Array(d),
                  a && (E = new Array(d)),
                  y = 0,
                  w = Math.min(o, d);
                y < w && i[y] === l[y];
                y++
              );
              for (w = o - 1, v = d - 1; w >= y && v >= y && i[w] === l[v]; w--, v--)
                ((_[v] = r[w]), (S[v] = s[w]), a && (E[v] = a[w]));
              for (g = new Map(), m = new Array(v + 1), h = v; h >= y; h--)
                ((x = l[h]), (u = g.get(x)), (m[h] = u === void 0 ? -1 : u), g.set(x, h));
              for (u = y; u <= w; u++)
                ((x = i[u]),
                  (h = g.get(x)),
                  h !== void 0 && h !== -1
                    ? ((_[h] = r[u]), (S[h] = s[u]), a && (E[h] = a[u]), (h = m[h]), g.set(x, h))
                    : s[u]());
              for (h = y; h < d; h++)
                h in _
                  ? ((r[h] = _[h]), (s[h] = S[h]), a && ((a[h] = E[h]), a[h](h)))
                  : (r[h] = Qe(f));
              ((r = r.slice(0, (o = d))), (i = l.slice(0)));
            }
            return r;
          })
        );
        function f(g) {
          if (((s[h] = g), a)) {
            let [m, _] = q(h);
            return ((a[h] = _), t(l[h], m));
          }
          return t(l[h]);
        }
      }
    );
  }
  var Cr = !1;
  function me(e, t) {
    if (Cr && L.context) {
      let n = L.context;
      Wt(hr());
      let i = H(() => e(t || {}));
      return (Wt(n), i);
    }
    return H(() => e(t || {}));
  }
  function Dt() {
    return !0;
  }
  var Mr = {
    get(e, t, n) {
      return t === zt ? n : e.get(t);
    },
    has(e, t) {
      return t === zt ? !0 : e.has(t);
    },
    set: Dt,
    deleteProperty: Dt,
    getOwnPropertyDescriptor(e, t) {
      return {
        configurable: !0,
        enumerable: !0,
        get() {
          return e.get(t);
        },
        set: Dt,
        deleteProperty: Dt,
      };
    },
    ownKeys(e) {
      return e.keys();
    },
  };
  function Ht(e) {
    return (e = typeof e == 'function' ? e() : e) ? e : {};
  }
  function Or() {
    for (let e = 0, t = this.length; e < t; ++e) {
      let n = this[e]();
      if (n !== void 0) return n;
    }
  }
  function Qt(...e) {
    let t = !1;
    for (let o = 0; o < e.length; o++) {
      let a = e[o];
      ((t = t || (!!a && zt in a)), (e[o] = typeof a == 'function' ? ((t = !0), b(a)) : a));
    }
    if (pr && t)
      return new Proxy(
        {
          get(o) {
            for (let a = e.length - 1; a >= 0; a--) {
              let l = Ht(e[a])[o];
              if (l !== void 0) return l;
            }
          },
          has(o) {
            for (let a = e.length - 1; a >= 0; a--) if (o in Ht(e[a])) return !0;
            return !1;
          },
          keys() {
            let o = [];
            for (let a = 0; a < e.length; a++) o.push(...Object.keys(Ht(e[a])));
            return [...new Set(o)];
          },
        },
        Mr,
      );
    let n = {},
      i = Object.create(null);
    for (let o = e.length - 1; o >= 0; o--) {
      let a = e[o];
      if (!a) continue;
      let l = Object.getOwnPropertyNames(a);
      for (let d = l.length - 1; d >= 0; d--) {
        let u = l[d];
        if (u === '__proto__' || u === 'constructor') continue;
        let h = Object.getOwnPropertyDescriptor(a, u);
        if (!i[u])
          i[u] = h.get
            ? { enumerable: !0, configurable: !0, get: Or.bind((n[u] = [h.get.bind(a)])) }
            : h.value !== void 0
              ? h
              : void 0;
        else {
          let f = n[u];
          f && (h.get ? f.push(h.get.bind(a)) : h.value !== void 0 && f.push(() => h.value));
        }
      }
    }
    let r = {},
      s = Object.keys(i);
    for (let o = s.length - 1; o >= 0; o--) {
      let a = s[o],
        l = i[a];
      l && l.get ? Object.defineProperty(r, a, l) : (r[a] = l ? l.value : void 0);
    }
    return r;
  }
  var Tr = (e) => `Stale read from <${e}>.`;
  function Jt(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return b(Er(() => e.each, e.children, t || void 0));
  }
  function Zt(e) {
    let t = e.keyed,
      n = b(() => e.when, void 0, void 0),
      i = t ? n : b(n, void 0, { equals: (r, s) => !r == !s });
    return b(
      () => {
        let r = i();
        if (r) {
          let s = e.children;
          return typeof s == 'function' && s.length > 0
            ? H(() =>
                s(
                  t
                    ? r
                    : () => {
                        if (!H(i)) throw Tr('Show');
                        return n();
                      },
                ),
              )
            : s;
        }
        return e.fallback;
      },
      void 0,
      void 0,
    );
  }
  var kr = [
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
    Pr = new Set([
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
      ...kr,
    ]),
    Rr = new Set(['innerHTML', 'textContent', 'innerText', 'children']),
    Ir = Object.assign(Object.create(null), { className: 'class', htmlFor: 'for' }),
    Lr = Object.assign(Object.create(null), {
      class: 'className',
      novalidate: { $: 'noValidate', FORM: 1 },
      formnovalidate: { $: 'formNoValidate', BUTTON: 1, INPUT: 1 },
      ismap: { $: 'isMap', IMG: 1 },
      nomodule: { $: 'noModule', SCRIPT: 1 },
      playsinline: { $: 'playsInline', VIDEO: 1 },
      readonly: { $: 'readOnly', INPUT: 1, TEXTAREA: 1 },
      adauctionheaders: { $: 'adAuctionHeaders', IFRAME: 1 },
      allowfullscreen: { $: 'allowFullscreen', IFRAME: 1 },
      browsingtopics: { $: 'browsingTopics', IMG: 1 },
      defaultchecked: { $: 'defaultChecked', INPUT: 1 },
      defaultmuted: { $: 'defaultMuted', AUDIO: 1, VIDEO: 1 },
      defaultselected: { $: 'defaultSelected', OPTION: 1 },
      disablepictureinpicture: { $: 'disablePictureInPicture', VIDEO: 1 },
      disableremoteplayback: { $: 'disableRemotePlayback', AUDIO: 1, VIDEO: 1 },
      preservespitch: { $: 'preservesPitch', AUDIO: 1, VIDEO: 1 },
      shadowrootclonable: { $: 'shadowRootClonable', TEMPLATE: 1 },
      shadowrootdelegatesfocus: { $: 'shadowRootDelegatesFocus', TEMPLATE: 1 },
      shadowrootserializable: { $: 'shadowRootSerializable', TEMPLATE: 1 },
      sharedstoragewritable: { $: 'sharedStorageWritable', IFRAME: 1, IMG: 1 },
    });
  function Fr(e, t) {
    let n = Lr[e];
    return typeof n == 'object' ? (n[t] ? n.$ : void 0) : n;
  }
  var qr = new Set([
    'beforeinput',
    'click',
    'dblclick',
    'contextmenu',
    'focusin',
    'focusout',
    'input',
    'keydown',
    'keyup',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'pointerdown',
    'pointermove',
    'pointerout',
    'pointerover',
    'pointerup',
    'touchend',
    'touchmove',
    'touchstart',
  ]);
  var Br = { xlink: 'http://www.w3.org/1999/xlink', xml: 'http://www.w3.org/XML/1998/namespace' };
  function Nr(e, t, n) {
    let i = n.length,
      r = t.length,
      s = i,
      o = 0,
      a = 0,
      l = t[r - 1].nextSibling,
      d = null;
    for (; o < r || a < s; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[r - 1] === n[s - 1]; ) (r--, s--);
      if (r === o) {
        let u = s < i ? (a ? n[a - 1].nextSibling : n[s - a]) : l;
        for (; a < s; ) e.insertBefore(n[a++], u);
      } else if (s === a) for (; o < r; ) ((!d || !d.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[s - 1] && n[a] === t[r - 1]) {
        let u = t[--r].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--s], u), (t[r] = n[s]));
      } else {
        if (!d) {
          d = new Map();
          let h = a;
          for (; h < s; ) d.set(n[h], h++);
        }
        let u = d.get(t[o]);
        if (u != null)
          if (a < u && u < s) {
            let h = o,
              f = 1,
              g;
            for (; ++h < r && h < s && !((g = d.get(t[h])) == null || g !== u + f); ) f++;
            if (f > u - a) {
              let m = t[o];
              for (; a < u; ) e.insertBefore(n[a++], m);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  var zn = '_$DX_DELEGATE';
  function Un(e, t, n, i = {}) {
    let r;
    return (
      Qe((s) => {
        ((r = s), t === document ? e() : We(t, e(), t.firstChild ? null : void 0, n));
      }, i.owner),
      () => {
        (r(), (t.textContent = ''));
      }
    );
  }
  function nt(e, t, n, i) {
    let r,
      s = () => {
        let a = i
          ? document.createElementNS('http://www.w3.org/1998/Math/MathML', 'template')
          : document.createElement('template');
        return (
          (a.innerHTML = e),
          n ? a.content.firstChild.firstChild : i ? a.firstChild : a.content.firstChild
        );
      },
      o = t
        ? () => H(() => document.importNode(r || (r = s()), !0))
        : () => (r || (r = s())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function $r(e, t = window.document) {
    let n = t[zn] || (t[zn] = new Set());
    for (let i = 0, r = e.length; i < r; i++) {
      let s = e[i];
      n.has(s) || (n.add(s), t.addEventListener(s, jr));
    }
  }
  function Ve(e, t, n) {
    ze(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
  }
  function Kr(e, t, n, i) {
    ze(e) || (i == null ? e.removeAttributeNS(t, n) : e.setAttributeNS(t, n, i));
  }
  function Vr(e, t, n) {
    ze(e) || (n ? e.setAttribute(t, '') : e.removeAttribute(t));
  }
  function tn(e, t) {
    ze(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Hr(e, t, n, i) {
    if (i) Array.isArray(n) ? ((e[`$$${t}`] = n[0]), (e[`$$${t}Data`] = n[1])) : (e[`$$${t}`] = n);
    else if (Array.isArray(n)) {
      let r = n[0];
      e.addEventListener(t, (n[0] = (s) => r.call(e, n[1], s)));
    } else e.addEventListener(t, n, typeof n != 'function' && n);
  }
  function Wr(e, t, n = {}) {
    let i = Object.keys(t || {}),
      r = Object.keys(n),
      s,
      o;
    for (s = 0, o = r.length; s < o; s++) {
      let a = r[s];
      !a || a === 'undefined' || t[a] || (Xn(e, a, !1), delete n[a]);
    }
    for (s = 0, o = i.length; s < o; s++) {
      let a = i[s],
        l = !!t[a];
      !a || a === 'undefined' || n[a] === l || !l || (Xn(e, a, !0), (n[a] = l));
    }
    return n;
  }
  function zr(e, t, n) {
    if (!t) return n ? Ve(e, 'style') : t;
    let i = e.style;
    if (typeof t == 'string') return (i.cssText = t);
    (typeof n == 'string' && (i.cssText = n = void 0), n || (n = {}), t || (t = {}));
    let r, s;
    for (s in n) (t[s] == null && i.removeProperty(s), delete n[s]);
    for (s in t) ((r = t[s]), r !== n[s] && (i.setProperty(s, r), (n[s] = r)));
    return n;
  }
  function Gn(e, t = {}, n, i) {
    let r = {};
    return (
      i || re(() => (r.children = He(e, t.children, r.children))),
      re(() => typeof t.ref == 'function' && it(t.ref, e)),
      re(() => Xr(e, t, n, !0, r, !0)),
      r
    );
  }
  function it(e, t, n) {
    return H(() => e(t, n));
  }
  function We(e, t, n, i) {
    if ((n !== void 0 && !i && (i = []), typeof t != 'function')) return He(e, t, i, n);
    re((r) => He(e, t(), r, n), i);
  }
  function Xr(e, t, n, i, r = {}, s = !1) {
    t || (t = {});
    for (let o in r)
      if (!(o in t)) {
        if (o === 'children') continue;
        r[o] = Yn(e, o, null, r[o], n, s, t);
      }
    for (let o in t) {
      if (o === 'children') {
        i || He(e, t.children);
        continue;
      }
      let a = t[o];
      r[o] = Yn(e, o, a, r[o], n, s, t);
    }
  }
  function ze(e) {
    return !!L.context && !L.done && (!e || e.isConnected);
  }
  function Yr(e) {
    return e.toLowerCase().replace(/-([a-z])/g, (t, n) => n.toUpperCase());
  }
  function Xn(e, t, n) {
    let i = t.trim().split(/\s+/);
    for (let r = 0, s = i.length; r < s; r++) e.classList.toggle(i[r], n);
  }
  function Yn(e, t, n, i, r, s, o) {
    let a, l, d, u, h;
    if (t === 'style') return zr(e, n, i);
    if (t === 'classList') return Wr(e, n, i);
    if (n === i) return i;
    if (t === 'ref') s || n(e);
    else if (t.slice(0, 3) === 'on:') {
      let f = t.slice(3);
      (i && e.removeEventListener(f, i, typeof i != 'function' && i),
        n && e.addEventListener(f, n, typeof n != 'function' && n));
    } else if (t.slice(0, 10) === 'oncapture:') {
      let f = t.slice(10);
      (i && e.removeEventListener(f, i, !0), n && e.addEventListener(f, n, !0));
    } else if (t.slice(0, 2) === 'on') {
      let f = t.slice(2).toLowerCase(),
        g = qr.has(f);
      if (!g && i) {
        let m = Array.isArray(i) ? i[0] : i;
        e.removeEventListener(f, m);
      }
      (g || n) && (Hr(e, f, n, g), g && $r([f]));
    } else if (t.slice(0, 5) === 'attr:') Ve(e, t.slice(5), n);
    else if (t.slice(0, 5) === 'bool:') Vr(e, t.slice(5), n);
    else if (
      (h = t.slice(0, 5) === 'prop:') ||
      (d = Rr.has(t)) ||
      (!r && ((u = Fr(t, e.tagName)) || (l = Pr.has(t)))) ||
      (a = e.nodeName.includes('-') || 'is' in o)
    ) {
      if (h) ((t = t.slice(5)), (l = !0));
      else if (ze(e)) return n;
      t === 'class' || t === 'className'
        ? tn(e, n)
        : a && !l && !d
          ? (e[Yr(t)] = n)
          : (e[u || t] = n);
    } else {
      let f = r && t.indexOf(':') > -1 && Br[t.split(':')[0]];
      f ? Kr(e, f, t, n) : Ve(e, Ir[t] || t, n);
    }
    return n;
  }
  function jr(e) {
    if (L.registry && L.events && L.events.find(([l, d]) => d === e)) return;
    let t = e.target,
      n = `$$${e.type}`,
      i = e.target,
      r = e.currentTarget,
      s = (l) => Object.defineProperty(e, 'target', { configurable: !0, value: l }),
      o = () => {
        let l = t[n];
        if (l && !t.disabled) {
          let d = t[`${n}Data`];
          if ((d !== void 0 ? l.call(t, d, e) : l.call(t, e), e.cancelBubble)) return;
        }
        return (
          t.host &&
            typeof t.host != 'string' &&
            !t.host._$host &&
            t.contains(e.target) &&
            s(t.host),
          !0
        );
      },
      a = () => {
        for (; o() && (t = t._$host || t.parentNode || t.host); );
      };
    if (
      (Object.defineProperty(e, 'currentTarget', {
        configurable: !0,
        get() {
          return t || document;
        },
      }),
      L.registry && !L.done && (L.done = _$HY.done = !0),
      e.composedPath)
    ) {
      let l = e.composedPath();
      s(l[0]);
      for (let d = 0; d < l.length - 2 && ((t = l[d]), !!o()); d++) {
        if (t._$host) {
          ((t = t._$host), a());
          break;
        }
        if (t.parentNode === r) break;
      }
    } else a();
    s(i);
  }
  function He(e, t, n, i, r) {
    let s = ze(e);
    if (s) {
      !n && (n = [...e.childNodes]);
      let l = [];
      for (let d = 0; d < n.length; d++) {
        let u = n[d];
        u.nodeType === 8 && u.data.slice(0, 2) === '!$' ? u.remove() : l.push(u);
      }
      n = l;
    }
    for (; typeof n == 'function'; ) n = n();
    if (t === n) return n;
    let o = typeof t,
      a = i !== void 0;
    if (((e = (a && n[0] && n[0].parentNode) || e), o === 'string' || o === 'number')) {
      if (s || (o === 'number' && ((t = t.toString()), t === n))) return n;
      if (a) {
        let l = n[0];
        (l && l.nodeType === 3 ? l.data !== t && (l.data = t) : (l = document.createTextNode(t)),
          (n = Ke(e, n, i, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (s) return n;
      n = Ke(e, n, i);
    } else {
      if (o === 'function')
        return (
          re(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = He(e, l, n, i);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          d = n && Array.isArray(n);
        if (en(l, t, n, r)) return (re(() => (n = He(e, l, n, i, !0))), () => n);
        if (s) {
          if (!l.length) return n;
          if (i === void 0) return (n = [...e.childNodes]);
          let u = l[0];
          if (u.parentNode !== e) return n;
          let h = [u];
          for (; (u = u.nextSibling) !== i; ) h.push(u);
          return (n = h);
        }
        if (l.length === 0) {
          if (((n = Ke(e, n, i)), a)) return n;
        } else d ? (n.length === 0 ? jn(e, l, i) : Nr(e, n, l)) : (n && Ke(e), jn(e, l));
        n = l;
      } else if (t.nodeType) {
        if (s && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = Ke(e, n, i, t));
          Ke(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function en(e, t, n, i) {
    let r = !1;
    for (let s = 0, o = t.length; s < o; s++) {
      let a = t[s],
        l = n && n[e.length],
        d;
      if (!(a == null || a === !0 || a === !1))
        if ((d = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) r = en(e, a, l) || r;
        else if (d === 'function')
          if (i) {
            for (; typeof a == 'function'; ) a = a();
            r = en(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || r;
          } else (e.push(a), (r = !0));
        else {
          let u = String(a);
          l && l.nodeType === 3 && l.data === u ? e.push(l) : e.push(document.createTextNode(u));
        }
    }
    return r;
  }
  function jn(e, t, n = null) {
    for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
  }
  function Ke(e, t, n, i) {
    if (n === void 0) return (e.textContent = '');
    let r = i || document.createTextNode('');
    if (t.length) {
      let s = !1;
      for (let o = t.length - 1; o >= 0; o--) {
        let a = t[o];
        if (r !== a) {
          let l = a.parentNode === e;
          !s && !o ? (l ? e.replaceChild(r, a) : e.insertBefore(r, n)) : l && a.remove();
        } else s = !0;
      }
    } else e.insertBefore(r, n);
    return [r];
  }
  var _e = !1;
  var rt = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    se = class {
      constructor(e = {}) {
        c(this, 'dedupe');
        c(this, 'getId');
        c(this, '_events');
        ((this.dedupe = e.dedupe || rt.ADD),
          (this.getId = e.getId || (() => Symbol())),
          (this._events = new Map()));
      }
      _getListeners(e) {
        let t = this._events.get(e);
        return t ? t.l || (t.l = [...t.m.values()]) : null;
      }
      on(e, t, n) {
        let i = this._events,
          r = i.get(e);
        r || ((r = { m: new Map(), l: null }), i.set(e, r));
        let s = r.m;
        if (((n = n === void 0 ? this.getId(t) : n), s.has(n)))
          switch (this.dedupe) {
            case rt.THROW:
              throw Error('Eventti: duplicate listener id!');
            case rt.IGNORE:
              return n;
            case rt.UPDATE:
              r.l = null;
              break;
            default:
              (s.delete(n), (r.l = null));
          }
        return (s.set(n, t), r.l?.push(t), n);
      }
      once(e, t, n) {
        let i = 0;
        return (
          (n = n === void 0 ? this.getId(t) : n),
          this.on(
            e,
            (...r) => {
              i || ((i = 1), this.off(e, n), t(...r));
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
          let i = n.length,
            r = 0;
          if (t.length) for (; r < i; r++) n[r](...t);
          else for (; r < i; r++) n[r]();
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
  var Ur = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: i } = e;
      ((this._phases = t),
        (this._emitter = new se({ getId: i, dedupe: n })),
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
        i = 0,
        r = t.length,
        s;
      for (; i < r; i++) ((s = n(t[i])), s && e.push(s));
      return e;
    }
    _processQueue(...e) {
      let t = this._queue,
        n = t.length;
      if (!n) return;
      let i = 0,
        r = 0,
        s,
        o;
      for (; i < n; i++) for (s = t[i], r = 0, o = s.length; r < o; r++) s[r](...e);
      t.length = 0;
    }
  };
  function nn(e = 60) {
    if (typeof requestAnimationFrame == 'function' && typeof cancelAnimationFrame == 'function')
      return (t) => {
        let n = requestAnimationFrame(t);
        return () => cancelAnimationFrame(n);
      };
    {
      let t = 1e3 / e,
        n = typeof performance > 'u' ? () => Date.now() : () => performance.now();
      return (i) => {
        let r = setTimeout(() => i(n()), t);
        return () => clearTimeout(r);
      };
    }
  }
  var Qn = class extends Ur {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: i = nn(), ...r } = e;
      (super(r),
        (this._paused = t),
        (this._onDemand = n),
        (this._requestFrame = i),
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
      let i = super.on(e, t, n);
      return ((this._empty = !1), this._request(), i);
    }
    once(e, t, n) {
      let i = super.once(e, t, n);
      return ((this._empty = !1), this._request(), i);
    }
    _request() {
      this._paused || this._cancelFrame || (this._cancelFrame = this._requestFrame(this.tick));
    }
    _cancel() {
      this._cancelFrame && (this._cancelFrame(), (this._cancelFrame = null));
    }
  };
  var O = { read: Symbol(), write: Symbol() },
    P = new Qn({
      phases: [O.read, O.write],
      requestFrame: typeof window < 'u' ? nn() : () => () => {},
    });
  function st(e, t = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
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
  function De(e, t, n = { width: 0, height: 0, x: 0, y: 0 }) {
    let i = Math.max(e.x, t.x),
      r = Math.min(e.x + e.width, t.x + t.width);
    if (r <= i) return null;
    let s = Math.max(e.y, t.y),
      o = Math.min(e.y + e.height, t.y + t.height);
    return o <= s ? null : ((n.x = i), (n.y = s), (n.width = r - i), (n.height = o - s), n);
  }
  var Gr = { width: 0, height: 0, x: 0, y: 0 };
  function Ie(e, t, n) {
    if ((n || (n = De(e, t, Gr)), !n)) return 0;
    let i = n.width * n.height;
    return i ? (i / (Math.min(e.width, t.width) * Math.min(e.height, t.height))) * 100 : 0;
  }
  var Jn = new WeakMap();
  function U(e) {
    let t = Jn.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Jn.set(e, new WeakRef(t))), t);
  }
  function Le(e) {
    return e instanceof Window;
  }
  var Zn = new Set(['auto', 'scroll']);
  function Xe(e, t) {
    let n = t || { x: 0, y: 0, width: 0, height: 0 };
    if (Le(e))
      return ((n.x = 0), (n.y = 0), (n.width = e.innerWidth), (n.height = e.innerHeight), n);
    let i = e.getBoundingClientRect(),
      r = U(e),
      s = parseFloat(r.borderLeftWidth) || 0,
      o = parseFloat(r.borderRightWidth) || 0,
      a = parseFloat(r.borderTopWidth) || 0,
      l = parseFloat(r.borderBottomWidth) || 0;
    ((n.x = i.left + s), (n.y = i.top + a));
    let d = i.width - s - o,
      u = i.height - a - l,
      h = e;
    return (
      h !== h.ownerDocument.documentElement &&
        (Zn.has(r.overflowY) && (d -= Math.max(0, Math.round(d) - h.clientWidth)),
        Zn.has(r.overflowX) && (u -= Math.max(0, Math.round(u) - h.clientHeight))),
      (n.width = d),
      (n.height = u),
      n
    );
  }
  function ei(e, t) {
    return !(
      e.left + e.width <= t.left ||
      t.left + t.width <= e.left ||
      e.top + e.height <= t.top ||
      t.top + t.height <= e.top
    );
  }
  function ot(e, t, n, i) {
    return Math.sqrt(Math.pow(n - e, 2) + Math.pow(i - t, 2));
  }
  function ti(e, t) {
    if (ei(e, t)) return null;
    let n = e.left + e.width,
      i = e.top + e.height,
      r = t.left + t.width,
      s = t.top + t.height;
    return n <= t.left
      ? i <= t.top
        ? ot(n, i, t.left, t.top)
        : e.top >= s
          ? ot(n, e.top, t.left, s)
          : t.left - n
      : e.left >= r
        ? i <= t.top
          ? ot(e.left, i, r, t.top)
          : e.top >= s
            ? ot(e.left, e.top, r, s)
            : e.left - r
        : i <= t.top
          ? t.top - i
          : e.top - s;
  }
  var Qr = typeof window < 'u' && window.document !== void 0,
    rn = !!(
      Qr &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    I = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Ot = { [I.content]: !1, [I.padding]: !1, [I.scrollbar]: !0, [I.border]: !0, [I.margin]: !0 },
    Tt = new Set(['auto', 'scroll']),
    ni = (() => {
      try {
        return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
      } catch {
        return !1;
      }
    })();
  function Ee(e) {
    return e instanceof Window;
  }
  function Ce(e) {
    return e instanceof Document;
  }
  var ii = new WeakMap();
  function W(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = ii.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), ii.set(e, new WeakRef(n))), n);
  }
  var ri = new Map(),
    at = null,
    Me = null,
    lt = null;
  function Jr(e, t) {
    let n = e.split('.'),
      i = ri.get(n[1]);
    return (
      i === void 0 &&
        (at || (at = document.createElement('style')),
        (at.innerHTML = `
      #mezr-scrollbar-test::-webkit-scrollbar {
        width: ${e} !important;
      }
    `),
        (Me && lt) ||
          ((Me = document.createElement('div')),
          (lt = document.createElement('div')),
          Me.appendChild(lt),
          (Me.id = 'mezr-scrollbar-test'),
          (Me.style.cssText = `
        all: unset !important;
        position: fixed !important;
        top: -200px !important;
        left: 0px !important;
        width: 100px !important;
        height: 100px !important;
        overflow: scroll !important;
        pointer-events: none !important;
        visibility: hidden !important;
      `),
          (lt.style.cssText = `
        all: unset !important;
        position: absolute !important;
        inset: 0 !important;
      `)),
        document.body.appendChild(at),
        document.body.appendChild(Me),
        (i = Me.getBoundingClientRect().width - lt.getBoundingClientRect().width - t),
        ri.set(n[1], i),
        document.body.removeChild(Me),
        document.body.removeChild(at)),
      t + i
    );
  }
  function Oe(e, t, n) {
    if (n <= 0) return 0;
    if (ni) {
      let i = W(e, '::-webkit-scrollbar'),
        r = t === 'x' ? i.height : i.width,
        s = parseFloat(r);
      if (!Number.isNaN(s) && !Number.isInteger(s)) return Jr(r, s);
    }
    return n;
  }
  function si(e, t = !1) {
    if (t) return e.innerWidth;
    let { innerWidth: n, document: i } = e,
      { documentElement: r } = i,
      { clientWidth: s } = r;
    return n - Oe(r, 'y', n - s);
  }
  function oi({ documentElement: e }) {
    return Math.max(e.scrollWidth, e.clientWidth, e.getBoundingClientRect().width);
  }
  function Ye(e) {
    return e instanceof HTMLHtmlElement;
  }
  function ai(e, t = I.border) {
    let { width: n } = e.getBoundingClientRect();
    if (t === I.border) return n;
    let i = W(e);
    return t === I.margin
      ? ((n += Math.max(0, parseFloat(i.marginLeft) || 0)),
        (n += Math.max(0, parseFloat(i.marginRight) || 0)),
        n)
      : ((n -= parseFloat(i.borderLeftWidth) || 0),
        (n -= parseFloat(i.borderRightWidth) || 0),
        t === I.scrollbar ||
          (!Ye(e) && Tt.has(i.overflowY) && (n -= Oe(e, 'y', Math.round(n) - e.clientWidth)),
          t === I.padding ||
            ((n -= parseFloat(i.paddingLeft) || 0), (n -= parseFloat(i.paddingRight) || 0))),
        n);
  }
  function sn(e, t = I.border) {
    return Ee(e) ? si(e, Ot[t]) : Ce(e) ? oi(e) : ai(e, t);
  }
  function li(e, t = !1) {
    if (t) return e.innerHeight;
    let { innerHeight: n, document: i } = e,
      { documentElement: r } = i,
      { clientHeight: s } = r;
    return n - Oe(r, 'x', n - s);
  }
  function ci({ documentElement: e }) {
    return Math.max(e.scrollHeight, e.clientHeight, e.getBoundingClientRect().height);
  }
  function di(e, t = I.border) {
    let { height: n } = e.getBoundingClientRect();
    if (t === I.border) return n;
    let i = W(e);
    return t === I.margin
      ? ((n += Math.max(0, parseFloat(i.marginTop) || 0)),
        (n += Math.max(0, parseFloat(i.marginBottom) || 0)),
        n)
      : ((n -= parseFloat(i.borderTopWidth) || 0),
        (n -= parseFloat(i.borderBottomWidth) || 0),
        t === I.scrollbar ||
          (!Ye(e) && Tt.has(i.overflowX) && (n -= Oe(e, 'x', Math.round(n) - e.clientHeight)),
          t === I.padding ||
            ((n -= parseFloat(i.paddingTop) || 0), (n -= parseFloat(i.paddingBottom) || 0))),
        n);
  }
  function on(e, t = I.border) {
    return Ee(e) ? li(e, Ot[t]) : Ce(e) ? ci(e) : di(e, t);
  }
  function Fe(e) {
    return e?.constructor === Object;
  }
  function ct(e, t = I.border) {
    let n = { left: 0, top: 0 };
    if (Ce(e)) return n;
    if (Ee(e)) return ((n.left += e.scrollX || 0), (n.top += e.scrollY || 0), n);
    let i = e.ownerDocument.defaultView;
    i && ((n.left += i.scrollX || 0), (n.top += i.scrollY || 0));
    let r = e.getBoundingClientRect();
    if (((n.left += r.left), (n.top += r.top), t === I.border)) return n;
    let s = W(e);
    return t === I.margin
      ? ((n.left -= Math.max(0, parseFloat(s.marginLeft) || 0)),
        (n.top -= Math.max(0, parseFloat(s.marginTop) || 0)),
        n)
      : ((n.left += parseFloat(s.borderLeftWidth) || 0),
        (n.top += parseFloat(s.borderTopWidth) || 0),
        t === I.scrollbar ||
          t === I.padding ||
          ((n.left += parseFloat(s.paddingLeft) || 0), (n.top += parseFloat(s.paddingTop) || 0)),
        n);
  }
  function ui(e, t) {
    let n = Fe(e) ? { left: e.left, top: e.top } : Array.isArray(e) ? ct(...e) : ct(e);
    if (t && !Ce(t)) {
      let i = Fe(t) ? t : Array.isArray(t) ? ct(t[0], t[1]) : ct(t);
      ((n.left -= i.left), (n.top -= i.top));
    }
    return n;
  }
  function hi(e, t) {
    let n = 0,
      i = 0;
    Fe(e)
      ? ((n = e.width), (i = e.height))
      : Array.isArray(e)
        ? ((n = sn(...e)), (i = on(...e)))
        : ((n = sn(e)), (i = on(e)));
    let r = ui(e, t);
    return { width: n, height: i, ...r, right: r.left + n, bottom: r.top + i };
  }
  function an(e) {
    return Fe(e) ? e : hi(e);
  }
  function fi(e, t) {
    let n = an(e),
      i = an(t);
    return ti(n, i);
  }
  var Zr = st(),
    es = st();
  function ts(e, t) {
    return fi(st(e, Zr), st(t, es));
  }
  function gi(e) {
    return Le(e) || e === document.documentElement || e === document.body ? window : e;
  }
  function dt(e) {
    return Le(e) ? e.scrollX : e.scrollLeft;
  }
  function pi(e) {
    return (Le(e) && (e = document.documentElement), e.scrollWidth - e.clientWidth);
  }
  function ut(e) {
    return Le(e) ? e.scrollY : e.scrollTop;
  }
  function mi(e) {
    return (Le(e) && (e = document.documentElement), e.scrollHeight - e.clientHeight);
  }
  function _i(e, t) {
    return !(
      e.x + e.width <= t.x ||
      t.x + t.width <= e.x ||
      e.y + e.height <= t.y ||
      t.y + t.height <= e.y
    );
  }
  var yi = class {
      constructor(
        e,
        {
          batchSize: t = 100,
          minBatchCount: n = 0,
          maxBatchCount: i = 2 ** 53 - 1,
          initialBatchCount: r = 0,
          shrinkThreshold: s = 2,
          onRelease: o,
        } = {},
      ) {
        c(this, '_batchSize');
        c(this, '_maxSize');
        c(this, '_minSize');
        c(this, '_shrinkThreshold');
        c(this, '_data');
        c(this, '_index');
        c(this, '_getItem');
        c(this, '_onRelease');
        ((this._batchSize = Math.floor(Math.max(t, 1))),
          (this._minSize = Math.floor(Math.max(n, 0)) * this._batchSize),
          (this._maxSize = Math.floor(
            Math.min(Math.max(i * this._batchSize, this._batchSize), 2 ** 53 - 1),
          )),
          (this._shrinkThreshold = Math.floor(Math.max(s, 1) * this._batchSize)),
          (this._data = Array(Math.floor(Math.max(Math.max(r, n) * this._batchSize, 0)))),
          (this._index = 0),
          (this._getItem = e),
          (this._onRelease = o));
      }
      get(...e) {
        if (this._index > 0) return this._getItem(this._data[--this._index], ...e);
        if (this._index === 0) {
          let t = this._data.length,
            n = Math.min(this._batchSize, this._maxSize - t);
          n > 0 && (this._data.length = t + n);
        }
        return this._getItem(void 0, ...e);
      }
      release(e) {
        if (
          this._index < this._maxSize &&
          (this._onRelease && this._onRelease(e),
          (this._data[this._index++] = e),
          this._index >= this._shrinkThreshold)
        ) {
          let t = this._data.length - this._batchSize;
          t >= this._minSize && ((this._data.length = t), (this._index -= this._batchSize));
        }
      }
      destroy() {
        ((this._data.length = 0), (this._index = 0));
      }
    },
    bi = { width: 0, height: 0, x: 0, y: 0 },
    vi = { width: 0, height: 0, x: 0, y: 0 },
    ye = {
      direction: 'none',
      threshold: 0,
      distance: 0,
      value: 0,
      maxValue: 0,
      duration: 0,
      speed: 0,
      deltaTime: 0,
      isEnding: !1,
    },
    C = { x: 1, y: 2 },
    qe = { forward: 4, reverse: 8 },
    At = { none: 0, left: C.x | qe.reverse, right: C.x | qe.forward },
    ht = { none: 0, up: C.y | qe.reverse, down: C.y | qe.forward },
    B = { ...At, ...ht };
  function ln(e) {
    switch (e) {
      case At.none:
      case ht.none:
        return 'none';
      case At.left:
        return 'left';
      case At.right:
        return 'right';
      case ht.up:
        return 'up';
      case ht.down:
        return 'down';
      default:
        throw Error(`Unknown direction value: ${e}`);
    }
  }
  function Si(e, t, n) {
    let { left: i = 0, right: r = 0, top: s = 0, bottom: o = 0 } = t;
    return (
      (i = Math.max(0, i)),
      (r = Math.max(0, r)),
      (s = Math.max(0, s)),
      (o = Math.max(0, o)),
      (n.width = e.width + i + r),
      (n.height = e.height + s + o),
      (n.x = e.x - i),
      (n.y = e.y - s),
      n
    );
  }
  function kt(e, t) {
    return Math.ceil(e) >= Math.floor(t);
  }
  function cn(e, t) {
    return Math.min(t / 2, e);
  }
  function dn(e, t, n, i) {
    return Math.max(0, n + e * 2 + i * t - i) / 2;
  }
  var ns = class {
      constructor() {
        c(this, 'positionX');
        c(this, 'positionY');
        c(this, 'directionX');
        c(this, 'directionY');
        c(this, 'overlapCheckRequestTime');
        ((this.positionX = 0),
          (this.positionY = 0),
          (this.directionX = B.none),
          (this.directionY = B.none),
          (this.overlapCheckRequestTime = 0));
      }
    },
    is = class {
      constructor() {
        c(this, 'element');
        c(this, 'requestX');
        c(this, 'requestY');
        c(this, 'scrollLeft');
        c(this, 'scrollTop');
        ((this.element = null),
          (this.requestX = null),
          (this.requestY = null),
          (this.scrollLeft = 0),
          (this.scrollTop = 0));
      }
      reset() {
        (this.requestX && (this.requestX.action = null),
          this.requestY && (this.requestY.action = null),
          (this.element = null),
          (this.requestX = null),
          (this.requestY = null),
          (this.scrollLeft = 0),
          (this.scrollTop = 0));
      }
      addRequest(e) {
        (C.x & e.direction
          ? (this.requestX && this.removeRequest(this.requestX), (this.requestX = e))
          : (this.requestY && this.removeRequest(this.requestY), (this.requestY = e)),
          (e.action = this));
      }
      removeRequest(e) {
        this.requestX === e
          ? ((this.requestX = null), (e.action = null))
          : this.requestY === e && ((this.requestY = null), (e.action = null));
      }
      computeScrollValues() {
        this.element &&
          ((this.scrollLeft = this.requestX ? this.requestX.value : dt(this.element)),
          (this.scrollTop = this.requestY ? this.requestY.value : ut(this.element)));
      }
      scroll() {
        this.element &&
          (this.element.scrollTo
            ? this.element.scrollTo(this.scrollLeft, this.scrollTop)
            : ((this.element.scrollLeft = this.scrollLeft),
              (this.element.scrollTop = this.scrollTop)));
      }
    },
    rs = class {
      constructor() {
        c(this, 'item');
        c(this, 'element');
        c(this, 'isActive');
        c(this, 'isEnding');
        c(this, 'direction');
        c(this, 'value');
        c(this, 'maxValue');
        c(this, 'threshold');
        c(this, 'distance');
        c(this, 'deltaTime');
        c(this, 'speed');
        c(this, 'duration');
        c(this, 'action');
        ((this.item = null),
          (this.element = null),
          (this.isActive = !1),
          (this.isEnding = !1),
          (this.direction = 0),
          (this.value = NaN),
          (this.maxValue = 0),
          (this.threshold = 0),
          (this.distance = 0),
          (this.deltaTime = 0),
          (this.speed = 0),
          (this.duration = 0),
          (this.action = null));
      }
      reset() {
        (this.isActive && this.onStop(),
          (this.item = null),
          (this.element = null),
          (this.isActive = !1),
          (this.isEnding = !1),
          (this.direction = 0),
          (this.value = NaN),
          (this.maxValue = 0),
          (this.threshold = 0),
          (this.distance = 0),
          (this.deltaTime = 0),
          (this.speed = 0),
          (this.duration = 0),
          (this.action = null));
      }
      hasReachedEnd() {
        return qe.forward & this.direction ? kt(this.value, this.maxValue) : this.value <= 0;
      }
      computeCurrentScrollValue() {
        return this.element
          ? this.value === this.value
            ? Math.max(0, Math.min(this.value, this.maxValue))
            : C.x & this.direction
              ? dt(this.element)
              : ut(this.element)
          : 0;
      }
      computeNextScrollValue() {
        let e = this.speed * (this.deltaTime / 1e3),
          t = qe.forward & this.direction ? this.value + e : this.value - e;
        return Math.max(0, Math.min(t, this.maxValue));
      }
      computeSpeed() {
        if (!this.item || !this.element) return 0;
        let { speed: e } = this.item;
        return typeof e == 'function'
          ? ((ye.direction = ln(this.direction)),
            (ye.threshold = this.threshold),
            (ye.distance = this.distance),
            (ye.value = this.value),
            (ye.maxValue = this.maxValue),
            (ye.duration = this.duration),
            (ye.speed = this.speed),
            (ye.deltaTime = this.deltaTime),
            (ye.isEnding = this.isEnding),
            e(this.element, ye))
          : e;
      }
      tick(e) {
        return (
          this.isActive || ((this.isActive = !0), this.onStart()),
          (this.deltaTime = e),
          (this.value = this.computeCurrentScrollValue()),
          (this.speed = this.computeSpeed()),
          (this.value = this.computeNextScrollValue()),
          (this.duration += e),
          this.value
        );
      }
      onStart() {
        if (!this.item || !this.element) return;
        let { onStart: e } = this.item;
        typeof e == 'function' && e(this.element, ln(this.direction));
      }
      onStop() {
        if (!this.item || !this.element) return;
        let { onStop: e } = this.item;
        typeof e == 'function' && e(this.element, ln(this.direction));
      }
    };
  function xi(e = 500, t = 0.5, n = 0.25) {
    let i = e * (t > 0 ? 1 / t : 1 / 0),
      r = e * (n > 0 ? 1 / n : 1 / 0);
    return function (s, o) {
      let a = 0;
      if (!o.isEnding)
        if (o.threshold > 0) {
          let d = o.threshold - Math.max(0, o.distance);
          a = (e / o.threshold) * d;
        } else a = e;
      let l = o.speed;
      if (l === a) return a;
      if (l < a) {
        let d = l + i * (o.deltaTime / 1e3);
        return Math.min(a, d);
      } else {
        let d = l - r * (o.deltaTime / 1e3);
        return Math.max(a, d);
      }
    };
  }
  var wi = class {
    constructor(e = {}) {
      c(this, 'items');
      c(this, 'settings');
      c(this, '_isDestroyed');
      c(this, '_isTicking');
      c(this, '_tickTime');
      c(this, '_tickDeltaTime');
      c(this, '_itemData');
      c(this, '_actions');
      c(this, '_requests');
      c(this, '_requestPool');
      c(this, '_actionPool');
      let { overlapCheckInterval: t = 150 } = e;
      ((this.items = []),
        (this.settings = { overlapCheckInterval: t }),
        (this._actions = []),
        (this._isDestroyed = !1),
        (this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        (this._requests = { [C.x]: new Map(), [C.y]: new Map() }),
        (this._itemData = new Map()),
        (this._requestPool = new yi((n) => n || new rs(), {
          initialBatchCount: 1,
          minBatchCount: 1,
          onRelease: (n) => n.reset(),
        })),
        (this._actionPool = new yi((n) => n || new is(), {
          batchSize: 10,
          initialBatchCount: 1,
          minBatchCount: 1,
          onRelease: (n) => n.reset(),
        })),
        (this._frameRead = this._frameRead.bind(this)),
        (this._frameWrite = this._frameWrite.bind(this)));
    }
    _frameRead(e) {
      this._isDestroyed ||
        (e && this._tickTime
          ? ((this._tickDeltaTime = e - this._tickTime),
            (this._tickTime = e),
            this._updateItems(),
            this._updateRequests(),
            this._updateActions())
          : ((this._tickTime = e), (this._tickDeltaTime = 0)));
    }
    _frameWrite() {
      this._isDestroyed || this._applyActions();
    }
    _startTicking() {
      this._isTicking ||
        ((this._isTicking = !0),
        P.on(O.read, this._frameRead, this._frameRead),
        P.on(O.write, this._frameWrite, this._frameWrite));
    }
    _stopTicking() {
      this._isTicking &&
        ((this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        P.off(O.read, this._frameRead),
        P.off(O.write, this._frameWrite));
    }
    _requestItemScroll(e, t, n, i, r, s, o) {
      let a = this._requests[t],
        l = a.get(e);
      (l
        ? (l.element !== n || l.direction !== i) && l.reset()
        : ((l = this._requestPool.get()), a.set(e, l)),
        (l.item = e),
        (l.element = n),
        (l.direction = i),
        (l.threshold = r),
        (l.distance = s),
        (l.maxValue = o));
    }
    _cancelItemScroll(e, t) {
      let n = this._requests[t],
        i = n.get(e);
      i && (i.action && i.action.removeRequest(i), this._requestPool.release(i), n.delete(e));
    }
    _checkItemOverlap(e, t, n) {
      let { inertAreaSize: i, targets: r, clientRect: s } = e;
      if (!r.length) {
        (t && this._cancelItemScroll(e, C.x), n && this._cancelItemScroll(e, C.y));
        return;
      }
      let o = this._itemData.get(e),
        a = o?.directionX,
        l = o?.directionY;
      if (!a && !l) {
        (t && this._cancelItemScroll(e, C.x), n && this._cancelItemScroll(e, C.y));
        return;
      }
      let d = null,
        u = -1 / 0,
        h = 0,
        f = -1 / 0,
        g = B.none,
        m = 0,
        _ = 0,
        S = null,
        E = -1 / 0,
        y = 0,
        w = -1 / 0,
        v = B.none,
        x = 0,
        z = 0,
        fe = 0;
      for (; fe < r.length; fe++) {
        let k = r[fe],
          X = typeof k.threshold == 'number' ? k.threshold : 50,
          K = !!(t && a && k.axis !== 'y'),
          Se = !!(n && l && k.axis !== 'x'),
          de = k.priority || 0;
        if ((!K || de < u) && (!Se || de < E)) continue;
        let Y = gi(k.element || k),
          ee = K ? pi(Y) : -1,
          ge = Se ? mi(Y) : -1;
        if (ee <= 0 && ge <= 0) continue;
        let Q = Xe(Y, vi),
          xe = Ie(s, Q) || -1 / 0;
        if (xe === -1 / 0)
          if (k.padding && _i(s, Si(Q, k.padding, bi))) xe = -(ts(s, Q) || 0);
          else continue;
        if (K && de >= u && ee > 0 && (de > u || xe > f)) {
          let J = 0,
            Z = B.none,
            ne = cn(X, Q.width),
            Re = dn(ne, i, s.width, Q.width);
          (a === B.right
            ? ((J = Q.x + Q.width + Re - (s.x + s.width)),
              J <= ne && !kt(dt(Y), ee) && (Z = B.right))
            : a === B.left && ((J = s.x - (Q.x - Re)), J <= ne && dt(Y) > 0 && (Z = B.left)),
            Z && ((d = Y), (u = de), (h = ne), (f = xe), (g = Z), (m = J), (_ = ee)));
        }
        if (Se && de >= E && ge > 0 && (de > E || xe > w)) {
          let J = 0,
            Z = ht.none,
            ne = cn(X, Q.height),
            Re = dn(ne, i, s.height, Q.height);
          (l === B.down
            ? ((J = Q.y + Q.height + Re - (s.y + s.height)),
              J <= ne && !kt(ut(Y), ge) && (Z = B.down))
            : l === B.up && ((J = s.y - (Q.y - Re)), J <= ne && ut(Y) > 0 && (Z = B.up)),
            Z && ((S = Y), (E = de), (y = ne), (w = xe), (v = Z), (x = J), (z = ge)));
        }
      }
      (t &&
        (d && g ? this._requestItemScroll(e, C.x, d, g, h, m, _) : this._cancelItemScroll(e, C.x)),
        n &&
          (S && v
            ? this._requestItemScroll(e, C.y, S, v, y, x, z)
            : this._cancelItemScroll(e, C.y)));
    }
    _updateScrollRequest(e) {
      let { inertAreaSize: t, smoothStop: n, targets: i, clientRect: r } = e.item,
        s = null,
        o = 0;
      for (; o < i.length; o++) {
        let a = i[o],
          l = gi(a.element || a);
        if (l !== e.element) continue;
        let d = !!(C.x & e.direction);
        if (d) {
          if (a.axis === 'y') continue;
        } else if (a.axis === 'x') continue;
        let u = d ? pi(l) : mi(l);
        if (u <= 0) break;
        let h = Xe(l, vi);
        if ((Ie(r, h) || -1 / 0) === -1 / 0) {
          let S = a.scrollPadding || a.padding;
          if (!(S && _i(r, Si(h, S, bi)))) break;
        }
        let f = cn(typeof a.threshold == 'number' ? a.threshold : 50, d ? h.width : h.height),
          g = dn(f, t, d ? r.width : r.height, d ? h.width : h.height),
          m = 0;
        if (
          ((m =
            e.direction === B.left
              ? r.x - (h.x - g)
              : e.direction === B.right
                ? h.x + h.width + g - (r.x + r.width)
                : e.direction === B.up
                  ? r.y - (h.y - g)
                  : h.y + h.height + g - (r.y + r.height)),
          m > f)
        )
          break;
        let _ = d ? dt(l) : ut(l);
        if (((s = qe.forward & e.direction ? kt(_, u) : _ <= 0), s)) break;
        return ((e.maxValue = u), (e.threshold = f), (e.distance = m), (e.isEnding = !1), !0);
      }
      return (
        n === !0 && e.speed > 0
          ? (s === null && (s = e.hasReachedEnd()), (e.isEnding = !s))
          : (e.isEnding = !1),
        e.isEnding
      );
    }
    _updateItems() {
      for (let e = 0; e < this.items.length; e++) {
        let t = this.items[e],
          n = this._itemData.get(t),
          { x: i, y: r } = t.position,
          s = n.positionX,
          o = n.positionY;
        (i === s && r === o) ||
          ((n.directionX = i > s ? B.right : i < s ? B.left : n.directionX),
          (n.directionY = r > o ? B.down : r < o ? B.up : n.directionY),
          (n.positionX = i),
          (n.positionY = r),
          n.overlapCheckRequestTime === 0 && (n.overlapCheckRequestTime = this._tickTime));
      }
    }
    _updateRequests() {
      let e = this.items,
        t = this._requests[C.x],
        n = this._requests[C.y],
        i = 0;
      for (; i < e.length; i++) {
        let r = e[i],
          s = this._itemData.get(r),
          o = s.overlapCheckRequestTime,
          a = o > 0 && this._tickTime - o > this.settings.overlapCheckInterval,
          l = !0,
          d = t.get(r);
        d &&
          d.isActive &&
          ((l = !this._updateScrollRequest(d)), l && ((a = !0), this._cancelItemScroll(r, C.x)));
        let u = !0,
          h = n.get(r);
        (h &&
          h.isActive &&
          ((u = !this._updateScrollRequest(h)), u && ((a = !0), this._cancelItemScroll(r, C.y))),
          a && ((s.overlapCheckRequestTime = 0), this._checkItemOverlap(r, l, u)));
      }
    }
    _requestAction(e, t) {
      let n = t === C.x,
        i = null,
        r = 0;
      for (; r < this._actions.length; r++) {
        if (((i = this._actions[r]), e.element !== i.element)) {
          i = null;
          continue;
        }
        if (n ? i.requestX : i.requestY) {
          this._cancelItemScroll(e.item, t);
          return;
        }
        break;
      }
      (i || (i = this._actionPool.get()),
        (i.element = e.element),
        i.addRequest(e),
        e.tick(this._tickDeltaTime),
        this._actions.push(i));
    }
    _updateActions() {
      let e = 0;
      for (e = 0; e < this.items.length; e++) {
        let t = this.items[e],
          n = this._requests[C.x].get(t),
          i = this._requests[C.y].get(t);
        (n && this._requestAction(n, C.x), i && this._requestAction(i, C.y));
      }
      for (e = 0; e < this._actions.length; e++) this._actions[e].computeScrollValues();
    }
    _applyActions() {
      if (!this._actions.length) return;
      let e = 0;
      for (e = 0; e < this._actions.length; e++)
        (this._actions[e].scroll(), this._actionPool.release(this._actions[e]));
      this._actions.length = 0;
    }
    addItem(e) {
      if (this._isDestroyed || this._itemData.has(e)) return;
      let { x: t, y: n } = e.position,
        i = new ns();
      ((i.positionX = t),
        (i.positionY = n),
        (i.directionX = B.none),
        (i.directionY = B.none),
        (i.overlapCheckRequestTime = this._tickTime),
        this._itemData.set(e, i),
        this.items.push(e),
        this._isTicking || this._startTicking());
    }
    removeItem(e) {
      if (this._isDestroyed) return;
      let t = this.items.indexOf(e);
      t !== -1 &&
        (this._requests[C.x].get(e) &&
          (this._cancelItemScroll(e, C.x), this._requests[C.x].delete(e)),
        this._requests[C.y].get(e) &&
          (this._cancelItemScroll(e, C.y), this._requests[C.y].delete(e)),
        this._itemData.delete(e),
        this.items.splice(t, 1),
        this._isTicking && !this.items.length && this._stopTicking());
    }
    isDestroyed() {
      return this._isDestroyed;
    }
    isItemScrollingX(e) {
      return !!this._requests[C.x].get(e)?.isActive;
    }
    isItemScrollingY(e) {
      return !!this._requests[C.y].get(e)?.isActive;
    }
    isItemScrolling(e) {
      return this.isItemScrollingX(e) || this.isItemScrollingY(e);
    }
    updateSettings(e = {}) {
      let { overlapCheckInterval: t = this.settings.overlapCheckInterval } = e;
      this.settings.overlapCheckInterval = t;
    }
    destroy() {
      this._isDestroyed ||
        (this._isDestroyed =
          (this.items.forEach((e) => this.removeItem(e)),
          this._requestPool.destroy(),
          this._actionPool.destroy(),
          (this._actions.length = 0),
          !0));
    }
  };
  function G(e, t = { width: 0, height: 0, x: 0, y: 0 }) {
    return (e && ((t.width = e.width), (t.height = e.height), (t.x = e.x), (t.y = e.y)), t);
  }
  var ss = class {
      constructor(e) {
        c(this, '_items');
        c(this, '_index');
        c(this, '_initItem');
        ((this._items = []), (this._index = 0), (this._initItem = e));
      }
      allocate(...e) {
        let t = this._index,
          n = this._items,
          i = this._initItem(n[t], ...e);
        return ((n[t] = i), ++this._index, i);
      }
      reset() {
        this._index = 0;
      }
      truncate(e = 0) {
        let t = Math.max(0, Math.min(e, this._items.length));
        ((this._index = Math.min(this._index, t)), (this._items.length = t));
      }
    },
    os = Symbol(),
    Pt = class {
      constructor(e) {
        c(this, '_listenerId');
        c(this, '_dndObserver');
        c(this, '_cdArenaPool');
        c(this, '_cdArenaMap');
        ((this._listenerId = Symbol()),
          (this._dndObserver = e),
          (this._cdArenaPool = []),
          (this._cdArenaMap = new Map()));
      }
      _checkCollision(e, t, n) {
        let i = e.getClientRect(),
          r = t.getClientRect();
        if (!i) return null;
        let s = De(i, r, n.intersectionRect);
        if (s === null) return null;
        let o = Ie(i, r, s);
        return o <= 0
          ? null
          : ((n.droppableId = t.id),
            G(r, n.droppableRect),
            G(i, n.draggableRect),
            (n.intersectionScore = o),
            n);
      }
      _sortCollisions(e, t) {
        return t.sort((n, i) => {
          let r = i.intersectionScore - n.intersectionScore;
          return r === 0
            ? n.droppableRect.width * n.droppableRect.height -
                i.droppableRect.width * i.droppableRect.height
            : r;
        });
      }
      _createCollisionData() {
        return {
          droppableId: os,
          droppableRect: G(),
          draggableRect: G(),
          intersectionRect: G(),
          intersectionScore: 0,
        };
      }
      _getCollisionDataArena(e) {
        let t = this._cdArenaMap.get(e);
        return (
          t ||
            ((t = this._cdArenaPool.pop() || new ss((n) => n || this._createCollisionData())),
            this._cdArenaMap.set(e, t)),
          t
        );
      }
      _removeCollisionDataArena(e) {
        let t = this._cdArenaMap.get(e);
        t && (t.truncate(20), t.reset(), this._cdArenaPool.push(t), this._cdArenaMap.delete(e));
      }
      detectCollisions(e, t, n) {
        if (((n.length = 0), !t.size)) return;
        let i = this._getCollisionDataArena(e),
          r = null,
          s = t.values();
        for (let o of s)
          (r || (r = i.allocate()), this._checkCollision(e, o, r) && (n.push(r), (r = null)));
        (n.length > 1 && this._sortCollisions(e, n), i.reset());
      }
      destroy() {
        this._cdArenaMap.forEach((e) => {
          e.truncate();
        });
      }
    };
  function Di(e) {
    return e instanceof Document;
  }
  var Ei = 'visible';
  function Oi(e, t, n = []) {
    let i = t ? e : e?.parentNode;
    for (n.length = 0; i && !Di(i); )
      if (i instanceof Element) {
        let r = U(i);
        (r.overflowY === Ei || r.overflowX === Ei || n.push(i), (i = i.parentNode));
      } else i = i instanceof ShadowRoot ? i.host : i.parentNode;
    return (n.push(window), n);
  }
  var je,
    as = G(),
    ls = {
      width: 2 ** 53 - 1,
      height: 2 ** 53 - 1,
      x: (2 ** 53 - 1) * -0.5,
      y: (2 ** 53 - 1) * -0.5,
    },
    Ae = [],
    Te = [],
    ft = [],
    gt = [],
    Ci = G();
  function cs(e) {
    if (!Ae.length) {
      let t = e.drag?.items?.[0]?.dragContainer;
      t ? Oi(t, !0, Ae) : Ae.push(window);
    }
  }
  function ds(e) {
    Te.length || Oi(e.element, !1, Te);
  }
  function Mi(e, t = G()) {
    G(e.length ? Xe(e[0], Ci) : ls, t);
    for (let n = 1; n < e.length; n++)
      if (!De(t, Xe(e[n], Ci), t)) {
        G(as, t);
        break;
      }
    return t;
  }
  var un = class extends Pt {
    constructor(t, n) {
      super(t);
      c(this, '_dragStates');
      c(this, '_visibilityLogic');
      c(this, '_listenersAttached');
      c(this, '_clearCache');
      ((this._dragStates = new Map()),
        (this._visibilityLogic = n?.visibilityLogic || 'relative'),
        (this._listenersAttached = !1),
        (this._clearCache = () => this.clearCache()));
    }
    _checkCollision(t, n, i) {
      let r = this._dragStates.get(t);
      if (!r) return null;
      let s = t.getClientRect(),
        o = n.getClientRect();
      if (!s || !o) return null;
      let a = r.clipMaskKeyMap.get(n);
      if (!a) {
        let h = this._visibilityLogic === 'relative';
        if (
          ((Te.length = 0),
          (ft.length = 0),
          (gt.length = 0),
          ds(n),
          (a = Te[0] || window),
          r.clipMaskKeyMap.set(n, a),
          !r.clipMaskMap.has(a))
        ) {
          if ((cs(t), h)) {
            let m = window;
            for (let _ of Te)
              if (Ae.includes(_)) {
                m = _;
                break;
              }
            for (let _ of Ae) {
              if (_ === m) break;
              ft.push(_);
            }
            for (let _ of Te) {
              if (_ === m) break;
              gt.push(_);
            }
          } else (ft.push(...Ae), gt.push(...Te));
          let f = h || !je ? Mi(ft) : G(je),
            g = Mi(gt);
          (!h && !je && (je = f), r.clipMaskMap.set(a, [f, g]));
        }
        ((Te.length = 0), (ft.length = 0), (gt.length = 0));
      }
      let [l, d] = r.clipMaskMap.get(a) || [];
      if (
        !l ||
        !d ||
        !De(s, l, i.draggableVisibleRect) ||
        !De(o, d, i.droppableVisibleRect) ||
        !De(i.draggableVisibleRect, i.droppableVisibleRect, i.intersectionRect)
      )
        return null;
      let u = Ie(i.draggableVisibleRect, i.droppableVisibleRect, i.intersectionRect);
      return u <= 0
        ? null
        : ((i.droppableId = n.id),
          G(o, i.droppableRect),
          G(s, i.draggableRect),
          (i.intersectionScore = u),
          i);
    }
    _sortCollisions(t, n) {
      return n.sort((i, r) => {
        let s = r.intersectionScore - i.intersectionScore;
        return s === 0
          ? i.droppableVisibleRect.width * i.droppableVisibleRect.height -
              r.droppableVisibleRect.width * r.droppableVisibleRect.height
          : s;
      });
    }
    _createCollisionData() {
      let t = super._createCollisionData();
      return ((t.droppableVisibleRect = G()), (t.draggableVisibleRect = G()), t);
    }
    _getDragState(t) {
      let n = this._dragStates.get(t);
      return (
        n ||
        ((n = { clipMaskKeyMap: new Map(), clipMaskMap: new Map(), cacheDirty: !0 }),
        this._dragStates.set(t, n),
        this._listenersAttached ||
          (this._listenersAttached =
            (window.addEventListener('scroll', this._clearCache, { capture: !0, passive: !0 }),
            window.addEventListener('resize', this._clearCache, { passive: !0 }),
            !0)),
        n)
      );
    }
    _getCollisionDataArena(t) {
      return (this._getDragState(t), super._getCollisionDataArena(t));
    }
    _removeCollisionDataArena(t) {
      (this._dragStates.delete(t) &&
        this._dndObserver.drags.size <= 0 &&
        this._listenersAttached &&
        (this._listenersAttached =
          (window.removeEventListener('scroll', this._clearCache, { capture: !0 }),
          window.removeEventListener('resize', this._clearCache),
          !1)),
        super._removeCollisionDataArena(t));
    }
    detectCollisions(t, n, i) {
      ((Ae.length = 0), (je = null));
      let r = this._getDragState(t);
      (r.cacheDirty && (r.cacheDirty = (r.clipMaskKeyMap.clear(), r.clipMaskMap.clear(), !1)),
        super.detectCollisions(t, n, i),
        (Ae.length = 0),
        (je = null));
    }
    clearCache(t) {
      if (t) {
        let n = this._dragStates.get(t);
        n && (n.cacheDirty = !0);
      } else
        this._dragStates.forEach((n) => {
          n.cacheDirty = !0;
        });
    }
  };
  var be = typeof window < 'u' && window.document !== void 0,
    Ti = be && 'ontouchstart' in window,
    Ai = be && !!window.PointerEvent;
  be &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var A = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function ki(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function us(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function hs(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Pi(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function Ri(e) {
    return e === 'auto' || e === void 0 ? (Ai ? 'pointer' : Ti ? 'touch' : 'mouse') : e;
  }
  var ke = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    Pe = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    pt = class {
      constructor(e, t = {}) {
        c(this, 'element');
        c(this, 'drag');
        c(this, 'isDestroyed');
        c(this, '_startPredicate');
        c(this, '_listenerOptions');
        c(this, '_sourceEvents');
        c(this, '_areWindowListenersBound');
        c(this, '_emitter');
        c(this, '_eventData', null);
        c(this, '_removeClickBlocker', null);
        c(this, '_cancelOnVisibilityChange');
        c(this, '_cancelOnEscape');
        c(this, '_preventNativeDrag');
        c(this, '_preventContextMenu');
        c(this, '_preventNativeDragHandler', (e) => e.preventDefault());
        c(this, '_preventContextMenuHandler', (e) => e.preventDefault());
        c(this, '_visibilityChangeHandler', () => {
          this.cancel();
        });
        c(this, '_onKeyDown', (e) => {
          e.key === 'Escape' && this.drag && (e.preventDefault(), this.cancel());
        });
        let {
          listenerOptions: n = Pe.listenerOptions,
          sourceEvents: i = Pe.sourceEvents,
          startPredicate: r = Pe.startPredicate,
          cancelOnVisibilityChange: s = Pe.cancelOnVisibilityChange,
          cancelOnEscape: o = Pe.cancelOnEscape,
          preventNativeDrag: a = Pe.preventNativeDrag,
          preventContextMenu: l = Pe.preventContextMenu,
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._cancelOnVisibilityChange = s ?? !0),
          (this._cancelOnEscape = o ?? !0),
          (this._preventNativeDrag = a ?? !0),
          (this._preventContextMenu = l ?? !1),
          (this._startPredicate = r),
          (this._listenerOptions = Pi(n)),
          (this._sourceEvents = Ri(i)),
          (this._emitter = new se()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(ke[this._sourceEvents].start, this._onStart, this._listenerOptions),
          s && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? ki(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = us(e);
        if (t === null) return;
        let n = ki(e, t);
        if (n === null) return;
        let i = {
          pointerId: t,
          pointerType: hs(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = i),
          (this._eventData = { ...i, type: A.Start, srcEvent: e, target: n.target }),
          this._emitter.emit(this._eventData.type, this._eventData),
          this.drag && this._bindWindowListeners());
      }
      _onMove(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let i = this._getTrackedPointerEventData(e);
        if (!i) return;
        let r = i.clientX,
          s = i.clientY;
        ((t.deltaX = r - t.x),
          (t.deltaY = s - t.y),
          (t.x = r),
          (t.y = s),
          (n.type = A.Move),
          (n.srcEvent = e),
          (n.target = i.target),
          (n.x = r),
          (n.y = s),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n));
      }
      _onCancel(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let i = this._getTrackedPointerEventData(e);
        if (!i) return;
        let r = i.clientX,
          s = i.clientY;
        ((t.deltaX = r - t.x),
          (t.deltaY = s - t.y),
          (t.x = r),
          (t.y = s),
          (n.type = A.Cancel),
          (n.srcEvent = e),
          (n.target = i.target),
          (n.x = r),
          (n.y = s),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n),
          this._resetDrag());
      }
      _onEnd(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let i = this._getTrackedPointerEventData(e);
        if (!i) return;
        let r = i.clientX,
          s = i.clientY;
        ((t.deltaX = r - t.x),
          (t.deltaY = s - t.y),
          (t.x = r),
          (t.y = s),
          (n.type = A.End),
          (n.srcEvent = e),
          (n.target = i.target),
          (n.x = r),
          (n.y = s),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n),
          this._resetDrag());
      }
      _bindWindowListeners() {
        if (this._areWindowListenersBound) return;
        let { move: e, end: t, cancel: n } = ke[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = ke[this._sourceEvents];
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
          ((this._eventData.type = A.Cancel),
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
            ke[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(ke[this._sourceEvents].start, this._onStart, this._listenerOptions),
          (this.element = e));
      }
      updateSettings(e) {
        if (this.isDestroyed) return;
        let {
            listenerOptions: t,
            sourceEvents: n,
            startPredicate: i,
            cancelOnVisibilityChange: r,
            cancelOnEscape: s,
            preventNativeDrag: o,
            preventContextMenu: a,
          } = e,
          l = Ri(n),
          d = Pi(t);
        (i && this._startPredicate !== i && (this._startPredicate = i),
          r !== void 0 &&
            this._cancelOnVisibilityChange !== r &&
            ((this._cancelOnVisibilityChange = r),
            r
              ? document.addEventListener('visibilitychange', this._visibilityChangeHandler)
              : document.removeEventListener('visibilitychange', this._visibilityChangeHandler)),
          s !== void 0 &&
            this._cancelOnEscape !== s &&
            ((this._cancelOnEscape = s),
            this._areWindowListenersBound &&
              (s
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
            (this._listenerOptions.capture !== d.capture ||
              this._listenerOptions.passive !== d.passive)) ||
            (n && this._sourceEvents !== l)) &&
            (this.element.removeEventListener(
              ke[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && d && (this._listenerOptions = d),
            this.element.addEventListener(
              ke[this._sourceEvents].start,
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
          this._emitter.emit(A.Destroy, { type: A.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            ke[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function fs(e) {
    let t = U(e),
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
  function gs(e) {
    let t = U(e),
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
  function Be(e, t = !1) {
    let { translate: n, rotate: i, scale: r, transform: s } = U(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', d] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * gs(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * fs(e)}px`),
        d ? (o += `translate3d(${a},${l},${d})`) : (o += `translate(${a},${l})`));
    }
    if (i && i !== 'none') {
      let a = i.split(' ');
      a.length > 1 ? (o += `rotate3d(${a.join(',')})`) : (o += `rotate(${a.join(',')})`);
    }
    if (r && r !== 'none') {
      let a = r.split(' ');
      a.length === 3 ? (o += `scale3d(${a.join(',')})`) : (o += `scale(${a.join(',')})`);
    }
    return (!t && s && s !== 'none' && (o += s), o);
  }
  function mt(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function hn(e) {
    let t = e.split(' '),
      n = '',
      i = '',
      r = '';
    return (
      t.length === 1 ? (n = i = t[0]) : t.length === 2 ? ([n, i] = t) : ([n, i, r] = t),
      { x: parseFloat(n) || 0, y: parseFloat(i) || 0, z: parseFloat(r) || 0 }
    );
  }
  var Ne = be ? new DOMMatrix() : null;
  function _t(e, t = new DOMMatrix()) {
    let n = e;
    for (mt(t); n; ) {
      let i = Be(n);
      if (i && (Ne.setMatrixValue(i), !Ne.isIdentity)) {
        let { transformOrigin: r } = U(n),
          { x: s, y: o, z: a } = hn(r);
        (a === 0
          ? Ne.setMatrixValue(`translate(${s}px,${o}px) ${Ne} translate(${s * -1}px,${o * -1}px)`)
          : Ne.setMatrixValue(
              `translate3d(${s}px,${o}px,${a}px) ${Ne} translate3d(${s * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(Ne));
      }
      n = n.parentElement;
    }
    return t;
  }
  function Rt(e) {
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
  function It(e) {
    let t = W(e);
    if (!rn) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: d } = t;
      if (d && d !== 'none') return !0;
      let { willChange: u } = t;
      if (u && (u.indexOf('filter') > -1 || u.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Rt(e);
    if (!n) return n;
    let { transform: i } = t;
    if (i && i !== 'none') return !0;
    let { perspective: r } = t;
    if (r && r !== 'none') return !0;
    let { contentVisibility: s } = t;
    if (s && s === 'auto') return !0;
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
      ) || !!(rn && a && a.indexOf('filter') > -1)
    );
  }
  function Ii(e) {
    return W(e).position !== 'static' || It(e);
  }
  function fn(e, t = {}) {
    if (Ye(e)) return e.ownerDocument.defaultView;
    let n = t.position || W(e).position,
      { skipDisplayNone: i, container: r } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let s = r || e.parentElement;
        for (; s; ) {
          let o = Rt(s);
          if (o) return s;
          if (o === null && !i) return null;
          s = s.parentElement;
        }
        return e.ownerDocument.documentElement;
      }
      case 'absolute':
      case 'fixed': {
        let s = n === 'fixed',
          o = r || e.parentElement;
        for (; o; ) {
          let a = s ? It(o) : Ii(o);
          if (a === !0) return o;
          if (a === null && !i) return null;
          o = o.parentElement;
        }
        return e.ownerDocument.defaultView;
      }
      default:
        return null;
    }
  }
  function gn(e, t = {}) {
    let n = W(e),
      { display: i } = n;
    if (i === 'none' || i === 'contents') return null;
    let r = t.position || W(e).position,
      { skipDisplayNone: s, container: o } = t;
    switch (r) {
      case 'relative':
        return e;
      case 'fixed':
        return fn(e, { container: o, position: r, skipDisplayNone: s });
      case 'absolute': {
        let a = fn(e, { container: o, position: r, skipDisplayNone: s });
        return Ee(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function ps(e, t) {
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
  function pn(e) {
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
  function Li(e, t, n = null) {
    if ('moveBefore' in e && e.isConnected === t.isConnected)
      try {
        e.moveBefore(t, n);
        return;
      } catch {}
    let i = document.activeElement,
      r = t.contains(i);
    (e.insertBefore(t, n),
      r &&
        document.activeElement !== i &&
        i instanceof HTMLElement &&
        i.focus({ preventScroll: !0 }));
  }
  function Lt(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Fi = class {
      constructor() {
        c(this, '_cache');
        c(this, '_validation');
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
    Ni = class {
      constructor(e, t) {
        c(this, 'sensor');
        c(this, 'startEvent');
        c(this, 'prevMoveEvent');
        c(this, 'moveEvent');
        c(this, 'endEvent');
        c(this, 'items');
        c(this, 'isEnded');
        c(this, '_matrixCache');
        c(this, '_clientOffsetCache');
        ((this.sensor = e),
          (this.startEvent = { ...t }),
          (this.prevMoveEvent = { ...t }),
          (this.moveEvent = { ...t }),
          (this.endEvent = null),
          (this.items = []),
          (this.isEnded = !1),
          (this._matrixCache = new Fi()),
          (this._clientOffsetCache = new Fi()));
      }
    };
  function ms(e, t, n = !1) {
    let { style: i } = e;
    for (let r in t) i.setProperty(r, t[r], n ? 'important' : '');
  }
  function _s() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      ms(
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
  function bt(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: i } = e.getBoundingClientRect(),
      r = U(e);
    return (
      (t.x = n + (parseFloat(r.borderLeftWidth) || 0)),
      (t.y = i + (parseFloat(r.borderTopWidth) || 0)),
      t
    );
  }
  function qi(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var ys = { x: 0, y: 0 },
    bs = { x: 0, y: 0 };
  function vs(e, t, n = { x: 0, y: 0 }) {
    let i = qi(e) ? e : bt(e, ys),
      r = qi(t) ? t : bt(t, bs);
    return ((n.x = r.x - i.x), (n.y = r.y - i.y), n);
  }
  var Ft = be ? _s() : null,
    $i = class {
      constructor(e, t) {
        c(this, 'data');
        c(this, 'element');
        c(this, 'elementContainer');
        c(this, 'elementOffsetContainer');
        c(this, 'dragContainer');
        c(this, 'dragOffsetContainer');
        c(this, 'elementTransformOrigin');
        c(this, 'elementTransformMatrix');
        c(this, 'elementOffsetMatrix');
        c(this, 'frozenStyles');
        c(this, 'unfrozenStyles');
        c(this, 'clientRect');
        c(this, 'position');
        c(this, 'containerOffset');
        c(this, 'alignmentOffset');
        c(this, '_moveDiff');
        c(this, '_alignDiff');
        c(this, '_matrixCache');
        c(this, '_clientOffsetCache');
        if (!e.isConnected) throw Error('Element is not connected');
        let { drag: n } = t;
        if (!n) throw Error('Drag is not defined');
        let i = U(e),
          r = e.getBoundingClientRect(),
          s = Be(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = hn(i.transformOrigin)),
          (this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s + i.transform)),
          (this.elementOffsetMatrix = new DOMMatrix(s).invertSelf()),
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
          let { position: h } = i;
          if (h !== 'fixed' && h !== 'absolute')
            throw Error(
              `Dragged element has "${h}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let d = gn(e) || e;
        ((this.elementOffsetContainer = d),
          (this.dragOffsetContainer = l === o ? d : gn(e, { container: l })));
        {
          let { width: h, height: f, x: g, y: m } = r;
          this.clientRect = { width: h, height: f, x: g, y: m };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let u = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: i });
        if (Array.isArray(u))
          if (u.length) {
            let h = {};
            for (let f of u) h[f] = i[f];
            this.frozenStyles = h;
          } else this.frozenStyles = null;
        else this.frozenStyles = u;
        if (this.frozenStyles) {
          let h = {};
          for (let f in this.frozenStyles) h[f] = e.style[f];
          this.unfrozenStyles = h;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, i] = t;
            (_t(e, n), i.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
          }
        });
      }
      _updateContainerOffset() {
        let {
          elementOffsetContainer: e,
          elementContainer: t,
          dragOffsetContainer: n,
          dragContainer: i,
          containerOffset: r,
          _clientOffsetCache: s,
          _matrixCache: o,
        } = this;
        if (e !== n) {
          let [a, l] = [
            [i, n],
            [t, e],
          ].map(([d, u]) => {
            let h = s.get(u) || { x: 0, y: 0 };
            if (!s.isValid(u)) {
              let f = o.get(d);
              u instanceof HTMLElement && f && !f[0].isIdentity
                ? pn(f[0])
                  ? (Ft.style.setProperty('transform', f[1].toString(), 'important'),
                    u.append(Ft),
                    bt(Ft, h),
                    Ft.remove())
                  : (bt(u, h), (h.x -= f[0].m41), (h.y -= f[0].m42))
                : bt(u, h);
            }
            return (s.set(u, h), h);
          });
          vs(a, l, r);
        } else ((r.x = 0), (r.y = 0));
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
    Bi = { capture: !0, passive: !0 },
    Ss = { x: 0, y: 0 },
    ue = be ? new DOMMatrix() : null,
    qt = be ? new DOMMatrix() : null,
    oe = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(oe || {}),
    ae = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(ae || {}),
    yt = { Start: 'start', Move: 'move', End: 'end' },
    vt = { Immediate: 'immediate', Sampled: 'sampled' },
    ve = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    D = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    Ki = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === ve.End || t === ve.EndAlign,
          [i, r] = e.getContainerMatrix(),
          [s, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: d,
            elementTransformMatrix: u,
            elementTransformOrigin: h,
            elementOffsetMatrix: f,
          } = e,
          { x: g, y: m, z: _ } = h,
          S = !u.isIdentity && (g !== 0 || m !== 0 || _ !== 0),
          E = a.x + l.x + d.x,
          y = a.y + l.y + d.y;
        (mt(ue),
          S && (_ === 0 ? ue.translateSelf(-g, -m) : ue.translateSelf(-g, -m, -_)),
          n ? r.isIdentity || ue.multiplySelf(r) : o.isIdentity || ue.multiplySelf(o),
          mt(qt).translateSelf(E, y),
          ue.multiplySelf(qt),
          i.isIdentity || ue.multiplySelf(i),
          S && (mt(qt).translateSelf(g, m, _), ue.multiplySelf(qt)),
          u.isIdentity || ue.multiplySelf(u),
          f.isIdentity || ue.preMultiplySelf(f),
          (e.element.style.transform = `${ue}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: vt.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    mn = class {
      constructor(e, t = {}) {
        c(this, 'id');
        c(this, '_sensors');
        c(this, 'settings');
        c(this, 'plugins');
        c(this, 'drag');
        c(this, 'isDestroyed');
        c(this, '_sensorData');
        c(this, '_emitter');
        c(this, '_startPhase');
        c(this, '_startId');
        c(this, '_moveId');
        c(this, '_alignId');
        c(this, '_modifierData');
        c(this, '_selectionChangeHandler', null);
        c(this, '_pointerCaptureTarget', null);
        c(this, '_pointerCapturePointerId', null);
        let { id: n = Symbol(), ...i } = t;
        ((this.id = n),
          (this._sensors = e),
          (this.settings = this._parseSettings(i)),
          (this.plugins = {}),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._sensorData = new Map()),
          (this._emitter = new se()),
          (this._startPhase = oe.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: yt.Start }),
          (this._onMove = this._onMove.bind(this)),
          (this._onScroll = this._onScroll.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          (this._prepareStart = this._prepareStart.bind(this)),
          (this._applyStart = this._applyStart.bind(this)),
          (this._prepareMove = this._prepareMove.bind(this)),
          (this._applyMove = this._applyMove.bind(this)),
          (this._prepareAlign = this._prepareAlign.bind(this)),
          (this._applyAlign = this._applyAlign.bind(this)),
          this._sensors.forEach((r) => {
            this._bindSensor(r);
          }));
      }
      get sensors() {
        return this._sensors;
      }
      set sensors(e) {
        let t = this._sensors;
        if (e === t) return;
        let n = t.filter((s) => !e.includes(s)),
          i = e.filter((s) => !t.includes(s));
        ((this._sensors = e),
          n.forEach((s) => {
            this._unbindSensor(s);
          }),
          i.forEach((s) => {
            this._bindSensor(s);
          }));
        let r = this.drag?.sensor;
        r && n.includes(r) && this.stop();
      }
      _bindSensor(e) {
        this._sensorData.set(e, {
          predicateState: ae.Pending,
          predicateEvent: null,
          onMove: (i) => this._onMove(i, e),
          onEnd: (i) => this._onEnd(i, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(A.Start, t, t), e.on(A.Move, t, t), e.on(A.Cancel, n, n), e.on(A.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: i } = t;
        (e.off(A.Start, n),
          e.off(A.Move, n),
          e.off(A.Cancel, i),
          e.off(A.End, i),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = Ki) {
        let {
          container: n = t.container,
          startPredicate: i = t.startPredicate,
          elements: r = t.elements,
          frozenStyles: s = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: d = t.sensorProcessingMode,
          dndGroups: u = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: f = t.preventTextSelection,
          capturePointer: g = t.capturePointer,
          onPrepareStart: m = t.onPrepareStart,
          onStart: _ = t.onStart,
          onPrepareMove: S = t.onPrepareMove,
          onMove: E = t.onMove,
          onEnd: y = t.onEnd,
          onDestroy: w = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: i,
          elements: r,
          frozenStyles: s,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: l,
          sensorProcessingMode: d,
          dndGroups: u,
          preventClickOnEnd: h,
          preventTextSelection: f,
          capturePointer: g,
          onPrepareStart: m,
          onStart: _,
          onPrepareMove: S,
          onMove: E,
          onEnd: y,
          onDestroy: w,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case ae.Pending: {
              n.predicateEvent = e;
              let i = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              i === !0 ? this.resolveStartPredicate(t) : i === !1 && this.rejectStartPredicate(t);
              break;
            }
            case ae.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === vt.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (P.once(O.read, this._prepareMove, this._moveId),
                    P.once(O.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === ae.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((i) => {
                ((i.predicateState = ae.Pending), (i.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = ae.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== oe.Init ||
          ((this._startPhase = oe.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new $i(t, this),
          )),
          this._applyModifiers(yt.Start, 0, 0),
          this._emit(D.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = oe.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== oe.FinishPrepare)) {
          if (((this._startPhase = oe.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof pt && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Li(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: ve.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              i = t.getDragContainerMatrix()[0];
            if (ps(n, i) || (!pn(n) && !pn(i))) continue;
            let r = t.element.getBoundingClientRect(),
              { alignmentOffset: s } = t;
            ((s.x += Lt(t.clientRect.x - r.x, 3)), (s.y += Lt(t.clientRect.y - r.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: ve.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Bi),
            this._emit(D.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = oe.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          i = t.x - n.x,
          r = t.y - n.y;
        (!i && !r) ||
          (this._applyModifiers(yt.Move, i, r),
          this._emit(D.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: ve.Move, draggable: this, drag: e, item: t }));
          (this._emit(D.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
        }
      }
      _prepareAlign() {
        let { drag: e } = this;
        if (!(!e || e.isEnded))
          for (let t of e.items) {
            let { x: n, y: i } = t.element.getBoundingClientRect(),
              r = t.clientRect.x - t._moveDiff.x - n;
            ((t.alignmentOffset.x = t.alignmentOffset.x - t._alignDiff.x + r),
              (t._alignDiff.x = r));
            let s = t.clientRect.y - t._moveDiff.y - i;
            ((t.alignmentOffset.y = t.alignmentOffset.y - t._alignDiff.y + s),
              (t._alignDiff.y = s));
          }
      }
      _applyAlign() {
        let { drag: e } = this;
        if (!(!e || e.isEnded))
          for (let t of e.items)
            ((t._alignDiff.x = 0),
              (t._alignDiff.y = 0),
              this.settings.applyPosition({ phase: ve.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: i } = this;
        if (!i) return;
        let r = this.settings.positionModifiers,
          s = this._modifierData;
        s.drag = i;
        for (let o of i.items) {
          let a = Ss;
          ((a.x = t), (a.y = n), (s.item = o), (s.phase = e));
          for (let l of r) a = l(a, s);
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
        let i = t || n.predicateEvent;
        n.predicateState === ae.Pending &&
          i &&
          ((this._startPhase = oe.Init),
          (n.predicateState = ae.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Ni(e, i)),
          this._sensorData.forEach((r, s) => {
            s !== e && ((r.predicateState = ae.Rejected), (r.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === vt.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (P.once(O.read, this._prepareStart, this._startId),
              P.once(O.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === ae.Pending &&
          ((t.predicateState = ae.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === oe.Prepare || this._startPhase === oe.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = oe.None),
          P.off(O.read, this._startId),
          P.off(O.write, this._startId),
          P.off(O.read, this._moveId),
          P.off(O.write, this._moveId),
          P.off(O.read, this._alignId),
          P.off(O.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Bi),
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
        this._applyModifiers(yt.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Li(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let i in n.unfrozenStyles) n.element.style[i] = n.unfrozenStyles[i] || '';
          this.settings.applyPosition({ phase: ve.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let i = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = Lt(n.clientRect.x - i.x, 3)),
              (n.alignmentOffset.y = Lt(n.clientRect.y - i.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: ve.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(D.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === vt.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (P.once(O.read, this._prepareAlign, this._alignId),
              P.once(O.write, this._applyAlign, this._alignId)));
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
          this._emit(D.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  var St = { Destroy: 'destroy' },
    Vi = {
      accept: () => !0,
      computeClientRect: (e) => e.element?.getBoundingClientRect() || e.getClientRect(),
    },
    Hi = class {
      constructor(e, t = {}) {
        c(this, 'id');
        c(this, 'element');
        c(this, 'isDestroyed');
        c(this, 'accept');
        c(this, 'data');
        c(this, 'computeClientRect');
        c(this, '_clientRect');
        c(this, '_emitter');
        let {
          id: n = Symbol(),
          accept: i = Vi.accept,
          data: r = {},
          computeClientRect: s = Vi.computeClientRect,
        } = t;
        ((this.id = n),
          (this.element = e),
          (this.isDestroyed = !1),
          (this.accept = i),
          (this.data = r),
          (this.computeClientRect = s),
          (this._clientRect = { x: 0, y: 0, width: 0, height: 0 }),
          (this._emitter = new se()),
          this.updateClientRect());
      }
      on(e, t, n) {
        return this._emitter.on(e, t, n);
      }
      off(e, t) {
        this._emitter.off(e, t);
      }
      getClientRect() {
        return this._clientRect;
      }
      updateClientRect() {
        let e = this.computeClientRect(this),
          t = this._clientRect;
        ((t.x = e.x), (t.y = e.y), (t.width = e.width), (t.height = e.height));
      }
      destroy() {
        this.isDestroyed ||
          ((this.isDestroyed = !0), this._emitter.emit(St.Destroy), this._emitter.off());
      }
    };
  var te = (function (e) {
      return (
        (e[(e.Idle = 0)] = 'Idle'),
        (e[(e.Computing = 1)] = 'Computing'),
        (e[(e.Computed = 2)] = 'Computed'),
        (e[(e.Emitting = 3)] = 'Emitting'),
        e
      );
    })(te || {}),
    Wi = { capture: !0, passive: !0 },
    T = {
      Start: 'start',
      Move: 'move',
      Enter: 'enter',
      Leave: 'leave',
      Collide: 'collide',
      End: 'end',
      AddDraggables: 'addDraggables',
      RemoveDraggables: 'removeDraggables',
      AddDroppables: 'addDroppables',
      RemoveDroppables: 'removeDroppables',
      Destroy: 'destroy',
    },
    _n = class {
      constructor(e = {}) {
        c(this, 'draggables');
        c(this, 'droppables');
        c(this, 'isDestroyed');
        c(this, '_drags');
        c(this, '_listenerId');
        c(this, '_collisionDetector');
        c(this, '_emitter');
        c(this, '_onScroll', () => {
          this._drags.size !== 0 &&
            (P.once(O.read, this.updateDroppableClientRects, this._listenerId),
            this.detectCollisions());
        });
        let { collisionDetector: t } = e;
        ((this.draggables = new Map()),
          (this.droppables = new Map()),
          (this.isDestroyed = !1),
          (this._drags = new Map()),
          (this._listenerId = Symbol()),
          (this._emitter = new se()),
          (this._onScroll = this._onScroll.bind(this)),
          (this.updateDroppableClientRects = this.updateDroppableClientRects.bind(this)),
          (this._collisionDetector = t ? t(this) : new Pt(this)));
      }
      get drags() {
        return this._drags;
      }
      _isMatch(e, t) {
        let n = !1;
        if (typeof t.accept == 'function') n = t.accept(e);
        else {
          let i = e.settings.dndGroups,
            r = t.accept;
          if (!i || i.size === 0 || r.size === 0) return !1;
          let s = r.size < i.size,
            o = s ? r : i,
            a = s ? i : r;
          for (let l of o)
            if (a.has(l)) {
              n = !0;
              break;
            }
        }
        return n;
      }
      _getTargets(e) {
        let t = this._drags.get(e);
        if (t?._targets) return t._targets;
        let n = new Map();
        for (let i of this.droppables.values()) this._isMatch(e, i) && n.set(i.id, i);
        return (t && (t._targets = n), n);
      }
      _onDragPrepareStart(e) {
        this.draggables.has(e.id) &&
          (this._drags.get(e) ||
            (this._drags.set(e, {
              isEnded: !1,
              data: {},
              _targets: null,
              _cd: {
                phase: te.Idle,
                tickerId: Symbol(),
                targets: new Map(),
                collisions: [],
                contacts: new Set(),
                prevContacts: new Set(),
                addedContacts: new Set(),
                persistedContacts: new Set(),
                _compute: () => this._computeCollisions(e),
                _emit: () => this._emitCollisions(e),
              },
              _events: {
                base: { draggable: e, targets: null },
                enter: {
                  draggable: e,
                  targets: null,
                  collisions: null,
                  contacts: null,
                  addedContacts: null,
                },
                leave: {
                  draggable: e,
                  targets: null,
                  collisions: null,
                  contacts: null,
                  removedContacts: null,
                },
                collide: {
                  draggable: e,
                  targets: null,
                  collisions: null,
                  contacts: null,
                  addedContacts: null,
                  removedContacts: null,
                  persistedContacts: null,
                },
                end: {
                  canceled: !1,
                  draggable: e,
                  targets: null,
                  collisions: null,
                  contacts: null,
                },
              },
            }),
            this._drags.size === 1 && this.updateDroppableClientRects(),
            this._computeCollisions(e),
            this._drags.size === 1 && window.addEventListener('scroll', this._onScroll, Wi)));
      }
      _onDragStart(e) {
        let t = this._drags.get(e);
        if (!(!t || t.isEnded)) {
          if (this._emitter.listenerCount(T.Start)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(T.Start, n));
          }
          this._emitCollisions(e);
        }
      }
      _onDragPrepareMove(e) {
        let t = this._drags.get(e);
        !t || t.isEnded || this._computeCollisions(e);
      }
      _onDragMove(e) {
        let t = this._drags.get(e);
        if (!(!t || t.isEnded)) {
          if (this._emitter.listenerCount(T.Move)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(T.Move, n));
          }
          this._emitCollisions(e);
        }
      }
      _onDragEnd(e) {
        this._stopDrag(e);
      }
      _onDragCancel(e) {
        this._stopDrag(e, !0);
      }
      _onDraggableDestroy(e) {
        this.removeDraggables([e]);
      }
      _stopDrag(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || n.isEnded) return;
        if (n._cd.phase === te.Emitting)
          throw Error('Cannot stop dragging while collisions are being emitted.');
        ((n.isEnded = !0), this._computeCollisions(e, !0), this._emitCollisions(e, !0));
        let { targets: i, collisions: r, contacts: s } = n._cd;
        if (this._emitter.listenerCount(T.End)) {
          let o = n._events.end;
          ((o.canceled = t),
            (o.targets = i),
            (o.collisions = r),
            (o.contacts = s),
            this._emitter.emit(T.End, o));
        }
        (this._drags.delete(e),
          this._collisionDetector._removeCollisionDataArena(e),
          P.off(O.read, n._cd.tickerId),
          P.off(O.write, n._cd.tickerId),
          this._drags.size ||
            (P.off(O.read, this._listenerId),
            window.removeEventListener('scroll', this._onScroll, Wi)));
      }
      _computeCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let i = n._cd;
        switch (i.phase) {
          case te.Computing:
            throw Error('Collisions are being computed.');
          case te.Emitting:
            throw Error('Collisions are being emitted.');
          default:
            break;
        }
        ((i.phase = te.Computing),
          (i.targets = this._getTargets(e)),
          this._collisionDetector.detectCollisions(e, i.targets, i.collisions),
          (i.phase = te.Computed));
      }
      _emitCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let i = n._cd;
        switch (i.phase) {
          case te.Computing:
            throw Error('Collisions are being computed.');
          case te.Emitting:
            throw Error('Collisions are being emitted.');
          case te.Idle:
            return;
          default:
            break;
        }
        i.phase = te.Emitting;
        let r = this._emitter,
          s = i.collisions,
          o = i.targets,
          a = i.addedContacts,
          l = i.persistedContacts,
          d = i.contacts,
          u = i.prevContacts;
        ((i.prevContacts = d), (i.contacts = u));
        let h = d;
        (a.clear(), l.clear(), u.clear());
        for (let f of s) {
          let g = o.get(f.droppableId);
          g && (u.add(g), d.has(g) ? (l.add(g), d.delete(g)) : a.add(g));
        }
        if (d.size && r.listenerCount(T.Leave)) {
          let f = n._events.leave;
          ((f.targets = o),
            (f.collisions = s),
            (f.contacts = u),
            (f.removedContacts = h),
            r.emit(T.Leave, f));
        }
        if (a.size && r.listenerCount(T.Enter)) {
          let f = n._events.enter;
          ((f.targets = o),
            (f.collisions = s),
            (f.contacts = u),
            (f.addedContacts = a),
            r.emit(T.Enter, f));
        }
        if (r.listenerCount(T.Collide) && (u.size || h.size)) {
          let f = n._events.collide;
          ((f.targets = o),
            (f.collisions = s),
            (f.contacts = u),
            (f.addedContacts = a),
            (f.removedContacts = h),
            (f.persistedContacts = l),
            r.emit(T.Collide, f));
        }
        (a.clear(), l.clear(), d.clear(), (i.phase = te.Idle));
      }
      on(e, t, n) {
        return this._emitter.on(e, t, n);
      }
      off(e, t) {
        this._emitter.off(e, t);
      }
      updateDroppableClientRects() {
        for (let e of this.droppables.values()) e.updateClientRect();
      }
      clearTargets(e) {
        if (e) {
          let t = this._drags.get(e);
          t && (t._targets = null);
        } else for (let t of this._drags.values()) t._targets = null;
      }
      detectCollisions(e) {
        if (!this.isDestroyed)
          if (e) {
            let t = this._drags.get(e);
            if (!t || t.isEnded) return;
            (P.once(O.read, t._cd._compute, t._cd.tickerId),
              P.once(O.write, t._cd._emit, t._cd.tickerId));
          } else
            for (let [, t] of this._drags)
              t.isEnded ||
                (P.once(O.read, t._cd._compute, t._cd.tickerId),
                P.once(O.write, t._cd._emit, t._cd.tickerId));
      }
      addDraggables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.draggables.has(n.id) ||
            (t.add(n),
            this.draggables.set(n.id, n),
            n.on(
              D.PrepareStart,
              () => {
                this._onDragPrepareStart(n);
              },
              this._listenerId,
            ),
            n.on(
              D.Start,
              () => {
                this._onDragStart(n);
              },
              this._listenerId,
            ),
            n.on(
              D.PrepareMove,
              () => {
                this._onDragPrepareMove(n);
              },
              this._listenerId,
            ),
            n.on(
              D.Move,
              () => {
                this._onDragMove(n);
              },
              this._listenerId,
            ),
            n.on(
              D.End,
              (i) => {
                i.endEvent?.type === A.End ? this._onDragEnd(n) : this._onDragCancel(n);
              },
              this._listenerId,
            ),
            n.on(
              D.Destroy,
              () => {
                this._onDraggableDestroy(n);
              },
              this._listenerId,
            ));
        if (t.size) {
          this._emitter.listenerCount(T.AddDraggables) &&
            this._emitter.emit(T.AddDraggables, { draggables: t });
          for (let n of t)
            if (!this.isDestroyed && n.drag && !n.drag.isEnded) {
              let i = n._startPhase;
              (i >= 2 && this._onDragPrepareStart(n), i >= 4 && this._onDragStart(n));
            }
        }
      }
      removeDraggables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.draggables.has(n.id) &&
            (t.add(n),
            this.draggables.delete(n.id),
            n.off(D.PrepareStart, this._listenerId),
            n.off(D.Start, this._listenerId),
            n.off(D.PrepareMove, this._listenerId),
            n.off(D.Move, this._listenerId),
            n.off(D.End, this._listenerId),
            n.off(D.Destroy, this._listenerId));
        for (let n of t) this._stopDrag(n, !0);
        this._emitter.listenerCount(T.RemoveDraggables) &&
          this._emitter.emit(T.RemoveDraggables, { draggables: t });
      }
      addDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) ||
            (t.add(n),
            this.droppables.set(n.id, n),
            n.on(
              St.Destroy,
              () => {
                this.removeDroppables([n]);
              },
              this._listenerId,
            ),
            this._drags.forEach(({ _targets: i }, r) => {
              i && this._isMatch(r, n) && (i.set(n.id, n), this.detectCollisions(r));
            }));
        t.size &&
          this._emitter.listenerCount(T.AddDroppables) &&
          this._emitter.emit(T.AddDroppables, { droppables: t });
      }
      removeDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) &&
            (this.droppables.delete(n.id),
            t.add(n),
            n.off(St.Destroy, this._listenerId),
            this._drags.forEach(({ _targets: i }, r) => {
              i && i.has(n.id) && (i.delete(n.id), this.detectCollisions(r));
            }));
        t.size &&
          this._emitter.listenerCount(T.RemoveDroppables) &&
          this._emitter.emit(T.RemoveDroppables, { droppables: t });
      }
      destroy() {
        if (this.isDestroyed) return;
        if (Array.from(this._drags.values()).some((t) => t._cd.phase === te.Emitting))
          throw Error('Cannot destroy the DndObserver while collisions are being emitted.');
        ((this.isDestroyed = !0),
          this.draggables.forEach((t) => {
            (t.off(D.PrepareStart, this._listenerId),
              t.off(D.Start, this._listenerId),
              t.off(D.PrepareMove, this._listenerId),
              t.off(D.Move, this._listenerId),
              t.off(D.End, this._listenerId),
              t.off(D.Destroy, this._listenerId));
          }),
          this.droppables.forEach((t) => {
            t.off(St.Destroy, this._listenerId);
          }));
        let e = this._drags.keys();
        for (let t of e) this._stopDrag(t, !0);
        (this._emitter.emit(T.Destroy),
          this._emitter.off(),
          this._collisionDetector.destroy(),
          this.draggables.clear(),
          this.droppables.clear());
      }
    };
  var yn = new wi();
  var bn = { x: 0, y: 0 },
    xt = { width: 0, height: 0, x: 0, y: 0 };
  function xs() {
    return {
      targets: [],
      inertAreaSize: 0.2,
      speed: xi(),
      smoothStop: !1,
      getPosition: (e) => {
        let { drag: t } = e,
          n = t?.items[0];
        if (n) return n.position;
        let i = t && (t.moveEvent || t.startEvent);
        return ((bn.x = i ? i.x : 0), (bn.y = i ? i.y : 0), bn);
      },
      getClientRect: (e) => {
        let { drag: t } = e,
          n = e.getClientRect();
        if (n) return n;
        let i = t && (t.moveEvent || t.startEvent);
        return (
          (xt.width = i ? 50 : 0),
          (xt.height = i ? 50 : 0),
          (xt.x = i ? i.x - 25 : 0),
          (xt.y = i ? i.y - 25 : 0),
          xt
        );
      },
      onStart: null,
      onStop: null,
    };
  }
  var ws = class {
      constructor(e, t) {
        c(this, '_draggableAutoScroll');
        c(this, '_draggable');
        c(this, '_position');
        c(this, '_clientRect');
        ((this._draggableAutoScroll = e),
          (this._draggable = t),
          (this._position = { x: 0, y: 0 }),
          (this._clientRect = { width: 0, height: 0, x: 0, y: 0 }));
      }
      _getSettings() {
        return this._draggableAutoScroll.settings;
      }
      get targets() {
        let { targets: e } = this._getSettings();
        return (typeof e == 'function' && (e = e(this._draggable)), e);
      }
      get position() {
        let e = this._position,
          { getPosition: t } = this._getSettings();
        return (
          typeof t == 'function' ? Object.assign(e, t(this._draggable)) : ((e.x = 0), (e.y = 0)),
          e
        );
      }
      get clientRect() {
        let e = this._clientRect,
          { getClientRect: t } = this._getSettings();
        return (
          typeof t == 'function'
            ? Object.assign(e, t(this._draggable))
            : ((e.width = 0), (e.height = 0), (e.x = 0), (e.y = 0)),
          e
        );
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
    },
    Ds = class {
      constructor(e, t = {}) {
        c(this, 'name');
        c(this, 'version');
        c(this, 'settings');
        c(this, '_autoScrollProxy');
        ((this.name = 'autoscroll'),
          (this.version = '0.0.3'),
          (this.settings = this._parseSettings(t)),
          (this._autoScrollProxy = null),
          e.on(D.Start, () => {
            this._autoScrollProxy ||
              ((this._autoScrollProxy = new ws(this, e)), yn.addItem(this._autoScrollProxy));
          }),
          e.on(D.End, () => {
            this._autoScrollProxy &&
              (this._autoScrollProxy = (yn.removeItem(this._autoScrollProxy), null));
          }));
      }
      _parseSettings(e, t = xs()) {
        let {
          targets: n = t.targets,
          inertAreaSize: i = t.inertAreaSize,
          speed: r = t.speed,
          smoothStop: s = t.smoothStop,
          getPosition: o = t.getPosition,
          getClientRect: a = t.getClientRect,
          onStart: l = t.onStart,
          onStop: d = t.onStop,
        } = e || {};
        return {
          targets: n,
          inertAreaSize: i,
          speed: r,
          smoothStop: s,
          getPosition: o,
          getClientRect: a,
          onStart: l,
          onStop: d,
        };
      }
      updateSettings(e = {}) {
        this.settings = this._parseSettings(e, this.settings);
      }
    };
  function zi(e) {
    return (t) => {
      let n = new Ds(t, e),
        i = t;
      return ((i.plugins[n.name] = n), i);
    };
  }
  var Xi = class {
    constructor() {
      c(this, 'drag');
      c(this, 'isDestroyed');
      c(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new se()));
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
        this._emitter.emit(A.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(A.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(A.End, t),
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
        this._emitter.emit(A.Cancel, t),
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
          type: A.Cancel,
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
        this._emitter.emit(A.Destroy, { type: A.Destroy }),
        this._emitter.off());
    }
  };
  var Yi = class extends Xi {
    constructor() {
      super();
      c(this, 'drag');
      c(this, '_direction');
      c(this, '_speed');
      c(this, '_tickEvent');
      c(this, '_moveEvent');
      ((this.drag = null),
        (this._direction = { x: 0, y: 0 }),
        (this._speed = 0),
        (this._tickEvent = { type: 'tick', time: 0, deltaTime: 0 }),
        (this._moveEvent = {
          type: A.Move,
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
      this.isDestroyed || this.drag || (super._start(t), P.on(O.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (P.off(O.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (P.off(O.read, this._tick), super._cancel(t));
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
          let i = this._speed * (this.drag.deltaTime / 1e3),
            r = this._direction.x * i,
            s = this._direction.y * i;
          if (r || s) {
            let o = this._moveEvent;
            ((o.x = this.drag.x + r), (o.y = this.drag.y + s), this._move(o));
          }
        } else ((this.drag.time = t), (this.drag.deltaTime = 0));
    }
  };
  var Es = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Bt(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let i of e) {
      let r = t.get(i);
      r !== void 0 && r < n && (n = r);
    }
    return n;
  }
  var he = {
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
          let { left: n, top: i } = t.element.getBoundingClientRect();
          return { x: n, y: i };
        }
        return null;
      },
    },
    ji = class extends Yi {
      constructor(t, n = {}) {
        super();
        c(this, 'element');
        c(this, '_eventData', { type: '', x: 0, y: 0, srcEvent: null });
        c(this, '_moveKeys');
        c(this, '_moveKeyTimestamps');
        c(this, '_startKeys');
        c(this, '_moveLeftKeys');
        c(this, '_moveRightKeys');
        c(this, '_moveUpKeys');
        c(this, '_moveDownKeys');
        c(this, '_cancelKeys');
        c(this, '_endKeys');
        c(this, '_cancelOnBlur');
        c(this, '_cancelOnVisibilityChange');
        c(this, '_computeSpeed');
        c(this, '_startPredicate');
        let {
          startPredicate: i = he.startPredicate,
          computeSpeed: r = he.computeSpeed,
          cancelOnVisibilityChange: s = he.cancelOnVisibilityChange,
          cancelOnBlur: o = he.cancelOnBlur,
          startKeys: a = he.startKeys,
          moveLeftKeys: l = he.moveLeftKeys,
          moveRightKeys: d = he.moveRightKeys,
          moveUpKeys: u = he.moveUpKeys,
          moveDownKeys: h = he.moveDownKeys,
          cancelKeys: f = he.cancelKeys,
          endKeys: g = he.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(f)),
          (this._endKeys = new Set(g)),
          (this._moveLeftKeys = new Set(l)),
          (this._moveRightKeys = new Set(d)),
          (this._moveUpKeys = new Set(u)),
          (this._moveDownKeys = new Set(h)),
          (this._moveKeys = new Set([...l, ...d, ...u, ...h])),
          (this._moveKeyTimestamps = new Map()),
          (this._cancelOnBlur = o),
          (this._cancelOnVisibilityChange = s),
          (this._computeSpeed = r),
          (this._startPredicate = i),
          (this._onKeyDown = this._onKeyDown.bind(this)),
          (this._onKeyUp = this._onKeyUp.bind(this)),
          (this._onTick = this._onTick.bind(this)),
          (this._internalCancel = this._internalCancel.bind(this)),
          (this._blurCancelHandler = this._blurCancelHandler.bind(this)),
          this.on('tick', this._onTick, this._onTick),
          document.addEventListener('keydown', this._onKeyDown),
          document.addEventListener('keyup', this._onKeyUp),
          o && t?.addEventListener('blur', this._blurCancelHandler),
          s && document.addEventListener('visibilitychange', this._internalCancel));
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
        let t = Bt(this._moveLeftKeys, this._moveKeyTimestamps),
          n = Bt(this._moveRightKeys, this._moveKeyTimestamps),
          i = Bt(this._moveUpKeys, this._moveKeyTimestamps),
          r = Bt(this._moveDownKeys, this._moveKeyTimestamps),
          s = t === n ? 0 : t < n ? -1 : 1,
          o = i === r ? 0 : i < r ? -1 : 1;
        if (!(s === 0 || o === 0)) {
          let a = 1 / (Math.sqrt(s * s + o * o) || 1);
          ((s *= a), (o *= a));
        }
        ((this._direction.x = s), (this._direction.y = o));
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
              let i = this._eventData;
              ((i.type = A.Start), (i.x = n.x), (i.y = n.y), (i.srcEvent = t), this._start(i));
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
          ((n.type = A.End),
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
          { cancelOnBlur: i, cancelOnVisibilityChange: r, startPredicate: s, computeSpeed: o } = t;
        if (
          (i !== void 0 &&
            this._cancelOnBlur !== i &&
            ((this._cancelOnBlur = i),
            i
              ? this.element?.addEventListener('blur', this._blurCancelHandler)
              : this.element?.removeEventListener('blur', this._blurCancelHandler)),
          r !== void 0 &&
            this._cancelOnVisibilityChange !== r &&
            ((this._cancelOnVisibilityChange = r),
            r
              ? document.addEventListener('visibilitychange', this._internalCancel)
              : document.removeEventListener('visibilitychange', this._internalCancel)),
          s !== void 0 && (this._startPredicate = s),
          o !== void 0 && (this._computeSpeed = o),
          Es.forEach((a, l) => {
            let d = `${a}Keys`,
              u = t[d];
            u !== void 0 && ((this[`_${d}`] = new Set(u)), l >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((l, d) => a[d] === l)) ||
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
  var Cs = () => {},
    le = new Map(),
    Sn = new Set();
  function vn() {
    Sn.forEach((e) => e());
  }
  var wt = {
    add(e, t, n) {
      ((le = new Map(le)), le.set(e, { sources: t, proxies: n, exiting: !1, done: Cs }), vn());
    },
    startExiting(e, t) {
      let n = le.get(e);
      n && ((le = new Map(le)), le.set(e, { ...n, exiting: !0, done: t }), vn());
    },
    remove(e) {
      le.has(e) && ((le = new Map(le)), le.delete(e), vn());
    },
    subscribe(e) {
      return (Sn.add(e), () => Sn.delete(e));
    },
    getSnapshot() {
      return le;
    },
  };
  var Ms = (e) => typeof e == 'function' && e.length === 0;
  function N(e, t) {
    return e === void 0 ? t : Ms(e) ? e() : e;
  }
  function Ui(e) {
    return e.map((t) => N(t));
  }
  var Os = () => null,
    Nt = Nn(Os);
  function Ue() {
    return jt(Nt);
  }
  function ce(e, t, n) {
    let i = Ue(),
      r = b(() => (n === void 0 ? i() : N(n))),
      s,
      [o, a] = q(!1);
    (R(() => {
      ((s = N(t)), a(!!s));
    }),
      R(() => {
        let l = r();
        if (!l || !o()) return;
        let d = (...h) => {
            s?.(...h);
          },
          u = l.on(e, d);
        $(() => l.off(e, u));
      }));
  }
  function Gi(e = void 0) {
    if (_e) return () => null;
    let t = b(() => N(e)),
      n = b(() => t()?.collisionDetector),
      i = new _n({ collisionDetector: H(n) }),
      [r, s] = q(i),
      o = H(n);
    return (
      R(() => {
        let a = n();
        a !== o && ((o = a), i.destroy(), (i = new _n({ collisionDetector: a })), s(i));
      }),
      $(() => {
        i.destroy();
      }),
      ce(
        T.Start,
        b(() => t()?.onStart),
        r,
      ),
      ce(
        T.Move,
        b(() => t()?.onMove),
        r,
      ),
      ce(
        T.Enter,
        b(() => t()?.onEnter),
        r,
      ),
      ce(
        T.Leave,
        b(() => t()?.onLeave),
        r,
      ),
      ce(
        T.Collide,
        b(() => t()?.onCollide),
        r,
      ),
      ce(
        T.End,
        b(() => t()?.onEnd),
        r,
      ),
      ce(
        T.AddDraggables,
        b(() => t()?.onAddDraggables),
        r,
      ),
      ce(
        T.RemoveDraggables,
        b(() => t()?.onRemoveDraggables),
        r,
      ),
      ce(
        T.AddDroppables,
        b(() => t()?.onAddDroppables),
        r,
      ),
      ce(
        T.RemoveDroppables,
        b(() => t()?.onRemoveDroppables),
        r,
      ),
      ce(
        T.Destroy,
        b(() => t()?.onDestroy),
        r,
      ),
      r
    );
  }
  var Ts = Object.prototype.hasOwnProperty,
    Qi = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function Ge(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      i = Array.isArray(t);
    if (n || i) {
      if (!n || !i) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let d = 0; d < l; d++) if (!Ge(e[d], t[d])) return !1;
      return !0;
    }
    let r = e instanceof Set,
      s = t instanceof Set;
    if (r || s) {
      if (!r || !s || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!Qi(e) || !Qi(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let d = o[l];
      if (!Ts.call(t, d) || !Ge(e[d], t[d])) return !1;
    }
    return !0;
  }
  var $t = new Map(),
    Kt = [],
    xn = [],
    wn = [],
    Dn = [],
    En = [],
    Cn = [],
    Mn = [],
    On = [];
  function Ji() {
    ($t.clear(),
      (Kt.length = 0),
      (xn.length = 0),
      (wn.length = 0),
      (Dn.length = 0),
      (En.length = 0),
      (Cn.length = 0),
      (Mn.length = 0),
      (On.length = 0));
  }
  function Zi(e) {
    let t = [];
    Ji();
    for (let n = 0; n < e.length; n++) {
      let i = e[n],
        r = i.parentElement;
      if (!r) throw new Error('Source element must have a parent element.');
      let s = i.getBoundingClientRect(),
        o = U(i),
        a = Be(i),
        l = a ? o.transformOrigin : '',
        d,
        u;
      if (i instanceof SVGSVGElement) ((d = `${s.width}px`), (u = `${s.height}px`));
      else {
        let g = parseFloat(o.width),
          m = parseFloat(o.height);
        if (!(g >= 0) || !(m >= 0)) ((d = `${s.width}px`), (u = `${s.height}px`));
        else if (o.boxSizing === 'border-box') ((d = o.width), (u = o.height));
        else {
          let _ = parseFloat(o.paddingLeft) || 0,
            S = parseFloat(o.paddingRight) || 0,
            E = parseFloat(o.borderLeftWidth) || 0,
            y = parseFloat(o.borderRightWidth) || 0,
            w = parseFloat(o.paddingTop) || 0,
            v = parseFloat(o.paddingBottom) || 0,
            x = parseFloat(o.borderTopWidth) || 0,
            z = parseFloat(o.borderBottomWidth) || 0;
          ((d = `${g + _ + S + E + y}px`), (u = `${m + w + v + x + z}px`));
        }
      }
      let h = document.createElement('div'),
        f = h.style;
      ((f.position = 'absolute'),
        (f.left = '0px'),
        (f.top = '0px'),
        (f.margin = '0'),
        (f.padding = '0'),
        (f.boxSizing = 'border-box'),
        (f.pointerEvents = 'none'),
        (f.contain = 'layout'),
        (h.dataset.dragPreviewProxy = 'true'),
        (Kt[n] = r),
        (t[n] = h),
        (xn[n] = s),
        (wn[n] = a),
        (Dn[n] = l),
        (En[n] = d),
        (Cn[n] = u),
        $t.has(r) || $t.set(r, _t(r)));
    }
    for (let n = 0; n < e.length; n++) {
      let i = Kt[n],
        r = t[n],
        s = wn[n],
        o = Dn[n],
        a = En[n],
        l = Cn[n],
        d = r.style;
      ((d.width = a),
        (d.height = l),
        s && ((d.transform = s), o && (d.transformOrigin = o)),
        i.appendChild(r));
    }
    for (let n = 0; n < e.length; n++) {
      let i = Kt[n],
        r = t[n],
        s = xn[n],
        o = $t.get(i),
        a = 0,
        l = 0,
        d = o.m11,
        u = o.m12,
        h = o.m21,
        f = o.m22,
        g = d * f - u * h,
        m = r.getBoundingClientRect(),
        _ = s.left - m.left,
        S = s.top - m.top;
      if (Math.abs(g) < 1e-10) ((a = _), (l = S));
      else {
        let E = 1 / g;
        ((a = (f * _ - h * S) * E), (l = (-u * _ + d * S) * E));
      }
      ((Mn[n] = a), (On[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let i = t[n].style,
        r = Mn[n],
        s = On[n];
      ((i.left = `${r}px`), (i.top = `${s}px`));
    }
    return (Ji(), t);
  }
  function er(e, t) {
    if (_e) return () => null;
    let n = b(() => (Array.isArray(e) ? Ui(e) : (N(e) ?? [])).filter((v) => !!v)),
      i = b(() => N(t)),
      r = b(() => i()?.id),
      s = b(() => i()?.dndObserver),
      o = b(() => {
        let v = i();
        if (!v) return;
        let {
          dndObserver: x,
          id: z,
          dragPreviewContainer: fe,
          dragPreviewExitTimeout: k,
          ...X
        } = v;
        return X;
      }),
      a = Ue(),
      l = b(() => {
        let v = s();
        return v === void 0 ? a() : v;
      }),
      [d, u] = q(null),
      h = null,
      f = r(),
      g = o(),
      m = l(),
      _ = o(),
      S = i()?.dragPreviewContainer,
      E = i()?.dragPreviewExitTimeout;
    R(() => {
      let v = i();
      ((_ = o()), (S = v?.dragPreviewContainer), (E = v?.dragPreviewExitTimeout));
    });
    let y = () => {
        h && (h.destroy(), (h = null), (g = void 0), u(null));
      },
      w = () => {
        Bn(() => {
          y();
          let v = H(n);
          if (!v.length) return;
          let x = H(o),
            z = r(),
            fe = x?.dragPreview,
            k = new mn(v, {
              id: z,
              ...x,
              elements(K) {
                let Se = _,
                  Y = (Se?.elements || (() => null))(K);
                if (!Se?.dragPreview || !Y || Y.length === 0) return Y;
                let ee = Zi(Y);
                wt.add(K.draggable, Y, ee);
                let ge = () => {
                    let J = E || 0;
                    if (J > 0) {
                      for (let Vt of ee) Vt.dataset.exiting = 'true';
                      let Z = !1,
                        ne = () => {
                          Z ||
                            ((Z = !0),
                            clearTimeout(Re),
                            wt.remove(K.draggable),
                            setTimeout(() => {
                              for (let Vt of ee) Vt.remove();
                            }, 0));
                        },
                        Re = setTimeout(ne, J);
                      wt.startExiting(K.draggable, ne);
                    } else
                      (wt.remove(K.draggable),
                        setTimeout(() => {
                          for (let Z of ee) Z.remove();
                        }, 0));
                    (K.draggable.off('end', Q), K.draggable.off('destroy', xe));
                  },
                  Q = K.draggable.on('end', ge),
                  xe = K.draggable.on('destroy', ge);
                return ee;
              },
              ...(fe
                ? {
                    container: () => {
                      let K = S;
                      return (typeof K == 'function' ? K() : K) || document.body;
                    },
                  }
                : {}),
            }),
            X = H(l);
          (X?.addDraggables([k]), (h = k), (f = z), (g = x), (m = X), u(k));
        });
      };
    return (
      R(() => {
        let v = n();
        if (!v.length) {
          y();
          return;
        }
        let x = h;
        if (!x) {
          w();
          return;
        }
        (v.length !== x.sensors.length || v.some((z) => !x.sensors.includes(z))) && w();
      }),
      R(() => {
        if (!h) return;
        let x = r();
        f !== x && w();
      }),
      R(() => {
        let v = l();
        if (m === v) return;
        let x = h;
        (x && (m?.removeDraggables([x]), v?.addDraggables([x])), (m = v));
      }),
      R(() => {
        let v = h;
        if (!v) return;
        let x = o(),
          z = !1;
        if (g) {
          let k = { ...g },
            X = { ...x };
          ((k.elements === X.elements || (k.dragPreview && X.dragPreview)) &&
            (delete k.elements, delete X.elements),
            (z = !Ge(k, X)));
        } else z = !0;
        if (!z) return;
        let fe = v._parseSettings(x);
        if (
          (v.updateSettings({
            ...fe,
            ...(!x?.dragPreview && x?.elements ? { elements: x.elements } : {}),
            ...(x?.dragPreview
              ? {
                  container: () => {
                    let k = S;
                    return (typeof k == 'function' ? k() : k) || document.body;
                  },
                }
              : {}),
          }),
          g)
        ) {
          let k = x?.dndGroups !== g.dndGroups,
            X = x?.computeClientRect !== g.computeClientRect;
          (k && m?.clearTargets(v), (k || X) && m?.detectCollisions(v));
        }
        g = x;
      }),
      $(y),
      d
    );
  }
  function tr(e, t) {
    let n = b(() => N(e)),
      i = b(() => N(t)),
      r = i();
    return (
      R(() => {
        let s = n();
        if (s) {
          if (s.plugins.autoscroll) {
            r = i();
            return;
          }
          (s.use(zi(i())), (r = i()));
        }
      }),
      R(() => {
        let o = n()?.plugins.autoscroll;
        if (!o) return;
        let a = i();
        Ge(r, a) || (o.updateSettings(o._parseSettings(a)), (r = a));
      }),
      n
    );
  }
  function nr(e, t = !1) {
    let n = b(() => N(e)),
      [i, r] = q(null),
      [s, o] = q(0);
    return (
      R(() => {
        let a = n();
        if ((r(a?.drag || null), !a)) return;
        let l = a.on(D.Start, () => {
            r(a.drag || null);
          }),
          d = null;
        t &&
          (d = a.on(D.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let u = a.on(D.End, () => {
          r(null);
        });
        $(() => {
          (a.off(D.Start, l), d && a.off(D.Move, d), a.off(D.End, u));
        });
      }),
      b(() => (s(), i()))
    );
  }
  function ir(e) {
    if (_e) return [() => null, () => {}];
    let t = b(() => N(e)),
      n = b(() => t()?.element),
      i = b(() => t()?.dndObserver),
      r = b(() => t()?.id),
      s = b(() => t()?.accept),
      o = b(() => t()?.data),
      a = b(() => t()?.computeClientRect),
      l = Ue(),
      d = b(() => {
        let y = i();
        return y === void 0 ? l() : y;
      }),
      [u, h] = q(null),
      f = null,
      g = r(),
      m = d(),
      _ = () => {
        f && (f.destroy(), (f = null), h(null));
      },
      S = (y) => {
        _();
        let w = { id: r(), accept: s(), data: o() },
          v = new Hi(y, w);
        ((f = v), (g = w.id));
        let x = d();
        (x && x.addDroppables([v]), (m = x), h(v));
      },
      E = (y) => {
        if (n() === void 0) {
          if (y === null) {
            _();
            return;
          }
          f?.element !== y && S(y);
        }
      };
    return (
      R(() => {
        let y = n();
        if (y !== void 0) {
          if (y === null) {
            _();
            return;
          }
          (S(y), $(_));
        }
      }),
      R(() => {
        let y = f;
        if (!y) return;
        let w = r();
        g !== w && y.element && S(y.element);
      }),
      R(() => {
        let y = d();
        if (m === y) return;
        let w = f;
        (w && (m?.removeDroppables([w]), y?.addDroppables([w])), (m = y));
      }),
      R(() => {
        let y = f;
        if (!y) return;
        let w = s() || (() => !0);
        ((y.accept = w), m?.detectCollisions());
      }),
      R(() => {
        let y = f;
        y && (y.data = o() || {});
      }),
      R(() => {
        let y = f;
        if (!y) return;
        let w = a();
        (w && (y.computeClientRect = w), m?.detectCollisions());
      }),
      $(_),
      [u, E]
    );
  }
  function rr(e = {}, t) {
    if (_e) return [() => null, () => {}];
    let n = b(() => N(e, {}) || {}),
      i = b(() => (t === void 0 ? void 0 : N(t))),
      [r, s] = q(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (u) => {
        if (u === null) {
          a();
          return;
        }
        o?.destroy();
        let h = new ji(u, n());
        ((o = h), s(h));
      };
    (R(() => {
      let u = o;
      u && u.updateSettings(n());
    }),
      R(() => {
        let u = i();
        u !== void 0 && (l(u), $(a));
      }));
    let d = (u) => {
      if (t === void 0) {
        if (u === null) {
          a();
          return;
        }
        o?.element !== u && l(u);
      }
    };
    return ($(a), [r, d]);
  }
  function sr(e = {}, t) {
    if (_e) return [() => null, () => {}];
    let n = b(() => N(e, {}) || {}),
      i = b(() => (t === void 0 ? void 0 : N(t))),
      [r, s] = q(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (u) => {
        o?.destroy();
        let h = new pt(u, n());
        ((o = h), s(h));
      };
    (R(() => {
      let u = o;
      u && u.updateSettings(n());
    }),
      R(() => {
        let u = i();
        if (u !== void 0) {
          if (u === null) {
            a();
            return;
          }
          (l(u), $(a));
        }
      }));
    let d = (u) => {
      if (t === void 0) {
        if (!u) {
          a();
          return;
        }
        o?.element !== u && l(u);
      }
    };
    return ($(a), [r, d]);
  }
  var As = nt(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    ks = nt('<div class=droppable>'),
    Ps = nt('<div class=scroll-list>'),
    Rs = nt('<div class=container>');
  function or(e) {
    return {
      listId: e.getAttribute('data-list-id') || 'left',
      index: parseInt(e.getAttribute('data-index') || '0', 10),
    };
  }
  function Is(e, t) {
    let n = e.getBoundingClientRect(),
      i = e.cloneNode(!0);
    return (
      (i.style.position = 'fixed'),
      (i.style.width = `${n.width}px`),
      (i.style.height = `${n.height}px`),
      (i.style.left = `${n.left}px`),
      (i.style.top = `${n.top}px`),
      (i.style.transform = ''),
      i.classList.add('drag-preview', 'dragging'),
      i.setAttribute('data-id', t),
      document.body.appendChild(i),
      i
    );
  }
  function Tn(e, t, n, i, r, s, o, a = !1) {
    try {
      e?.remove();
    } catch {}
    (t && (t.classList.remove('dragging', 'hidden'), a && t.classList.remove('animate')),
      r((l) => {
        if (!l.has(n)) return l;
        let d = new Set(l);
        return (d.delete(n), d);
      }),
      i?.element?.removeAttribute('data-draggable-over'),
      s.delete(o));
  }
  function Ls(e, t) {
    for (let n of e) {
      let i = n.element?.getAttribute('data-draggable-contained') || '';
      if (i && i !== t) continue;
      let r = n.element?.getAttribute('data-draggable-over') || '';
      if (!(r && r !== t)) return n;
    }
    return null;
  }
  function Fs(e) {
    let t = e.getBoundingClientRect(),
      n = getComputedStyle(e),
      i = parseFloat(n.borderLeftWidth || '0') || 0,
      r = parseFloat(n.borderTopWidth || '0') || 0;
    return { left: t.left + i + 10, top: t.top + r + 10 };
  }
  var qs = (e) => new un(e),
    ar = 0.5;
  function Bs(e) {
    let t = null,
      [n, i] = sr(),
      [r, s] = rr(),
      o = tr(
        er([n, r], {
          elements: () => (t ? [Is(t, e.draggableId)] : []),
          frozenStyles: () => ['width', 'height'],
          startPredicate: () => !t?.classList.contains('animate'),
          onStart: () => {
            (t?.classList.add('dragging', 'hidden'), e.onDragStart(e.draggableId));
          },
        }),
        {
          targets: () =>
            e.scrollContainers.map((a) => ({
              element: a,
              axis: 'y',
              padding: { top: 0, bottom: 0 },
            })),
        },
      );
    return (
      nr(o),
      (() => {
        var a = As();
        return (
          it((l) => {
            ((t = l), i(l), s(l));
          }, a),
          re(
            (l) => {
              var d = `card draggable ${e.isHidden ? 'hidden' : ''}`,
                u = e.draggableId;
              return (d !== l.e && tn(a, (l.e = d)), u !== l.t && Ve(a, 'data-id', (l.t = u)), l);
            },
            { e: void 0, t: void 0 },
          ),
          a
        );
      })()
    );
  }
  function Ns(e) {
    let [t, n] = ir({ data: {} });
    return (() => {
      var i = ks();
      return (
        it(n, i),
        Gn(
          i,
          Qt(
            {
              get 'data-list-id'() {
                return e.listId;
              },
              get 'data-index'() {
                return e.index;
              },
            },
            () =>
              e.containedDraggableId ? { 'data-draggable-contained': e.containedDraggableId } : {},
          ),
          !1,
          !0,
        ),
        We(i, () => e.children),
        i
      );
    })();
  }
  function lr(e) {
    return (() => {
      var t = Ps();
      return (
        it((n) => {
          n && !e.scrollContainers.includes(n) && e.scrollContainers.push(n);
        }, t),
        We(
          t,
          me(Jt, {
            get each() {
              return e.slots;
            },
            children: (n, i) =>
              me(Ns, {
                get listId() {
                  return e.listId;
                },
                get index() {
                  return i();
                },
                containedDraggableId: n || void 0,
                get children() {
                  return me(Zt, {
                    when: n,
                    children: (r) =>
                      me(Bs, {
                        get draggableId() {
                          return r();
                        },
                        get scrollContainers() {
                          return e.scrollContainers;
                        },
                        get onDragStart() {
                          return e.onDragStart;
                        },
                        get isHidden() {
                          return e.hiddenIds.has(r());
                        },
                      }),
                  });
                },
              }),
          }),
        ),
        re(() => Ve(t, 'data-list-id', e.listId)),
        t
      );
    })();
  }
  function $s() {
    let e = [],
      t = new Map(),
      [n, i] = q(Array.from({ length: 16 }, (f, g) => (g === 0 ? '1' : null))),
      [r, s] = q(Array.from({ length: 16 }, (f, g) => (g === 0 ? '2' : null))),
      [o, a] = q(new Set()),
      l = (f) => {
        a((g) => {
          let m = new Set(g);
          return (m.add(f), m);
        });
      },
      d = (f, g, m) => {
        (f === 'left' ? i : s)((S) => {
          let E = [...S];
          return ((E[g] = m), E);
        });
      },
      u = (f, g, m, _, S) => {
        (g === _ && m === S) || (d(g, m, null), d(_, S, f));
      },
      h = Gi({
        collisionDetector: qs,
        onCollide: ({ draggable: f, contacts: g }) => {
          let m = f.drag?.items[0].element;
          if (!m) return;
          let _ = m.getAttribute('data-id') || '';
          if (!_) return;
          let S = Ls(g, _),
            E = t.get(f);
          S &&
            S !== E &&
            (E?.element?.removeAttribute('data-draggable-over'),
            S?.element?.setAttribute('data-draggable-over', _),
            t.set(f, S));
        },
        onEnd: ({ draggable: f, canceled: g }) => {
          let m = f.drag?.items[0].element;
          if (!m) return;
          let _ = m.getAttribute('data-id') || '';
          if (!_) return;
          let S = t.get(f) || null,
            E = document.querySelector(`.card.draggable[data-id="${_}"]`),
            y = E?.parentElement,
            w = !g && S ? S.element : y;
          if (!y || !w) {
            Tn(m, E, _, S, a, t, f);
            return;
          }
          let v = or(y),
            x = or(w);
          u(_, v.listId, v.index, x.listId, x.index);
          let z = parseFloat(m.style.left || '0'),
            fe = parseFloat(m.style.top || '0'),
            k = Fs(w),
            X = m.getBoundingClientRect(),
            K = k.left - X.left,
            Se = k.top - X.top;
          if (Math.abs(K) < ar && Math.abs(Se) < ar) {
            Tn(m, E, _, S, a, t, f);
            return;
          }
          let de = k.left - z,
            Y = k.top - fe;
          (m.classList.add('animating'),
            m.clientHeight,
            (m.style.transform = `translate(${de}px, ${Y}px)`));
          let ee = (ge) => {
            ge.target === m &&
              ge.propertyName === 'transform' &&
              (Tn(m, E, _, S, a, t, f, !0), document.body.removeEventListener('transitionend', ee));
          };
          document.body.addEventListener('transitionend', ee);
        },
      });
    return me(Nt.Provider, {
      value: h,
      get children() {
        var f = Rs();
        return (
          We(
            f,
            me(lr, {
              listId: 'left',
              get slots() {
                return n();
              },
              get hiddenIds() {
                return o();
              },
              onDragStart: l,
              scrollContainers: e,
            }),
            null,
          ),
          We(
            f,
            me(lr, {
              listId: 'right',
              get slots() {
                return r();
              },
              get hiddenIds() {
                return o();
              },
              onDragStart: l,
              scrollContainers: e,
            }),
            null,
          ),
          f
        );
      },
    });
  }
  var cr = document.getElementById('root');
  if (!cr) throw new Error('Failed to find the root element');
  Un(() => me($s, {}), cr);
})();
