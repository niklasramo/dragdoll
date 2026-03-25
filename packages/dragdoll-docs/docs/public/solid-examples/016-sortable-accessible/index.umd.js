'use strict';
var SolidExample_016_sortable_accessible = (() => {
  var Qr = Object.defineProperty;
  var Jr = (e, t, n) =>
    t in e ? Qr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => Jr(e, typeof t != 'symbol' ? t + '' : t, n);
  var z = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return xn(this.context.count);
    },
    getNextContextId() {
      return xn(this.context.count++);
    },
  };
  function xn(e) {
    let t = String(e),
      n = t.length - 1;
    return z.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Nt(e) {
    z.context = e;
  }
  function Zr() {
    return { ...z.context, id: z.getNextContextId(), count: 0 };
  }
  var ei = !1,
    ti = (e, t) => e === t;
  var ni = Symbol('solid-track');
  var vt = { equals: ti },
    wn = null,
    On = In,
    oe = 1,
    Qe = 2,
    An = { owned: null, cleanups: null, context: null, owner: null };
  var T = null,
    p = null,
    Ze = null,
    We = null,
    q = null,
    j = null,
    Q = null,
    xt = 0;
  function Re(e, t) {
    let n = q,
      r = T,
      i = e.length === 0,
      s = t === void 0 ? r : t,
      o = i ? An : { owned: null, cleanups: null, context: s ? s.context : null, owner: s },
      a = i ? e : () => e(() => K(() => ve(o)));
    ((T = o), (q = null));
    try {
      return he(a, !0);
    } finally {
      ((q = n), (T = r));
    }
  }
  function W(e, t) {
    t = t ? Object.assign({}, vt, t) : vt;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (i) => (
        typeof i == 'function' &&
          (p && p.running && p.sources.has(n) ? (i = i(n.tValue)) : (i = i(n.value))),
        Rn(n, i)
      );
    return [Pn.bind(n), r];
  }
  function Se(e, t, n) {
    let r = Ht(e, t, !1, oe);
    Ze && p && p.running ? j.push(r) : et(r);
  }
  function O(e, t, n) {
    On = ai;
    let r = Ht(e, t, !1, oe),
      i = Vt && Wt(Vt);
    (i && (r.suspense = i), (!n || !n.render) && (r.user = !0), Q ? Q.push(r) : et(r));
  }
  function E(e, t, n) {
    n = n ? Object.assign({}, vt, n) : vt;
    let r = Ht(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      Ze && p && p.running ? ((r.tState = oe), j.push(r)) : et(r),
      Pn.bind(r)
    );
  }
  function Tn(e) {
    return he(e, !1);
  }
  function K(e) {
    if (!We && q === null) return e();
    let t = q;
    q = null;
    try {
      return We ? We.untrack(e) : e();
    } finally {
      q = t;
    }
  }
  function N(e) {
    return (T === null || (T.cleanups === null ? (T.cleanups = [e]) : T.cleanups.push(e)), e);
  }
  function ri(e) {
    if (p && p.running) return (e(), p.done);
    let t = q,
      n = T;
    return Promise.resolve().then(() => {
      ((q = t), (T = n));
      let r;
      return (
        (Ze || Vt) &&
          ((r =
            p ||
            (p = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          r.done || (r.done = new Promise((i) => (r.resolve = i))),
          (r.running = !0)),
        he(e, !1),
        (q = T = null),
        r ? r.done : void 0
      );
    });
  }
  var [hs, Dn] = W(!1);
  function kn(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: ci(n), defaultValue: e };
  }
  function Wt(e) {
    let t;
    return T && T.context && (t = T.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function ii(e) {
    let t = E(e),
      n = E(() => Bt(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var Vt;
  function Pn() {
    let e = p && p.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === oe) et(this);
      else {
        let t = j;
        ((j = null), he(() => St(this), !1), (j = t));
      }
    if (q) {
      let t = this.observers ? this.observers.length : 0;
      (q.sources
        ? (q.sources.push(this), q.sourceSlots.push(t))
        : ((q.sources = [this]), (q.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(q), this.observerSlots.push(q.sources.length - 1))
          : ((this.observers = [q]), (this.observerSlots = [q.sources.length - 1])));
    }
    return e && p.sources.has(this) ? this.tValue : this.value;
  }
  function Rn(e, t, n) {
    let r = p && p.running && p.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (p) {
        let i = p.running;
        ((i || (!n && p.sources.has(e))) && (p.sources.add(e), (e.tValue = t)), i || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        he(() => {
          for (let i = 0; i < e.observers.length; i += 1) {
            let s = e.observers[i],
              o = p && p.running;
            (o && p.disposed.has(s)) ||
              ((o ? !s.tState : !s.state) && (s.pure ? j.push(s) : Q.push(s), s.observers && Ln(s)),
              o ? (s.tState = oe) : (s.state = oe));
          }
          if (j.length > 1e6) throw ((j = []), new Error());
        }, !1);
    }
    return t;
  }
  function et(e) {
    if (!e.fn) return;
    ve(e);
    let t = xt;
    (En(e, p && p.running && p.sources.has(e) ? e.tValue : e.value, t),
      p &&
        !p.running &&
        p.sources.has(e) &&
        queueMicrotask(() => {
          he(() => {
            (p && (p.running = !0), (q = T = e), En(e, e.tValue, t), (q = T = null));
          }, !1);
        }));
  }
  function En(e, t, n) {
    let r,
      i = T,
      s = q;
    q = T = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (p && p.running
            ? ((e.tState = oe), e.tOwned && e.tOwned.forEach(ve), (e.tOwned = void 0))
            : ((e.state = oe), e.owned && e.owned.forEach(ve), (e.owned = null))),
        (e.updatedAt = n + 1),
        zt(o)
      );
    } finally {
      ((q = s), (T = i));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Rn(e, r, !0)
        : p && p.running && e.pure
          ? (p.sources.has(e) || (e.value = r), p.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function Ht(e, t, n, r = oe, i) {
    let s = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: T,
      context: T ? T.context : null,
      pure: n,
    };
    if (
      (p && p.running && ((s.state = 0), (s.tState = r)),
      T === null ||
        (T !== An &&
          (p && p.running && T.pure
            ? T.tOwned
              ? T.tOwned.push(s)
              : (T.tOwned = [s])
            : T.owned
              ? T.owned.push(s)
              : (T.owned = [s]))),
      We && s.fn)
    ) {
      let o = s.fn,
        [a, l] = W(void 0, { equals: !1 }),
        f = We.factory(o, l);
      N(() => f.dispose());
      let c,
        u = () =>
          ri(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      s.fn = (h) => (a(), p && p.running ? (c || (c = We.factory(o, u)), c.track(h)) : f.track(h));
    }
    return s;
  }
  function Je(e) {
    let t = p && p.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === Qe) return St(e);
    if (e.suspense && K(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < xt); ) {
      if (t && p.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let i = e,
          s = n[r + 1];
        for (; (i = i.owner) && i !== s; ) if (p.disposed.has(i)) return;
      }
      if ((t ? e.tState : e.state) === oe) et(e);
      else if ((t ? e.tState : e.state) === Qe) {
        let i = j;
        ((j = null), he(() => St(e, n[0]), !1), (j = i));
      }
    }
  }
  function he(e, t) {
    if (j) return e();
    let n = !1;
    (t || (j = []), Q ? (n = !0) : (Q = []), xt++);
    try {
      let r = e();
      return (si(n), r);
    } catch (r) {
      (n || (Q = null), (j = null), zt(r));
    }
  }
  function si(e) {
    if ((j && (Ze && p && p.running ? oi(j) : In(j), (j = null)), e)) return;
    let t;
    if (p) {
      if (!p.promises.size && !p.queue.size) {
        let r = p.sources,
          i = p.disposed;
        (Q.push.apply(Q, p.effects), (t = p.resolve));
        for (let s of Q) ('tState' in s && (s.state = s.tState), delete s.tState);
        ((p = null),
          he(() => {
            for (let s of i) ve(s);
            for (let s of r) {
              if (((s.value = s.tValue), s.owned))
                for (let o = 0, a = s.owned.length; o < a; o++) ve(s.owned[o]);
              (s.tOwned && (s.owned = s.tOwned), delete s.tValue, delete s.tOwned, (s.tState = 0));
            }
            Dn(!1);
          }, !1));
      } else if (p.running) {
        ((p.running = !1), p.effects.push.apply(p.effects, Q), (Q = null), Dn(!0));
        return;
      }
    }
    let n = Q;
    ((Q = null), n.length && he(() => On(n), !1), t && t());
  }
  function In(e) {
    for (let t = 0; t < e.length; t++) Je(e[t]);
  }
  function oi(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = p.queue;
      r.has(n) ||
        (r.add(n),
        Ze(() => {
          (r.delete(n),
            he(() => {
              ((p.running = !0), Je(n));
            }, !1),
            p && (p.running = !1));
        }));
    }
  }
  function ai(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : Je(r);
    }
    if (z.context) {
      if (z.count) {
        (z.effects || (z.effects = []), z.effects.push(...e.slice(0, n)));
        return;
      }
      Nt();
    }
    for (
      z.effects &&
        (z.done || !z.count) &&
        ((e = [...z.effects, ...e]), (n += z.effects.length), delete z.effects),
        t = 0;
      t < n;
      t++
    )
      Je(e[t]);
  }
  function St(e, t) {
    let n = p && p.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let i = e.sources[r];
      if (i.sources) {
        let s = n ? i.tState : i.state;
        s === oe ? i !== t && (!i.updatedAt || i.updatedAt < xt) && Je(i) : s === Qe && St(i, t);
      }
    }
  }
  function Ln(e) {
    let t = p && p.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = Qe) : (r.state = Qe),
        r.pure ? j.push(r) : Q.push(r),
        r.observers && Ln(r));
    }
  }
  function ve(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        let n = e.sources.pop(),
          r = e.sourceSlots.pop(),
          i = n.observers;
        if (i && i.length) {
          let s = i.pop(),
            o = n.observerSlots.pop();
          r < i.length && ((s.sourceSlots[o] = r), (i[r] = s), (n.observerSlots[r] = o));
        }
      }
    if (e.tOwned) {
      for (t = e.tOwned.length - 1; t >= 0; t--) ve(e.tOwned[t]);
      delete e.tOwned;
    }
    if (p && p.running && e.pure) Fn(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) ve(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    p && p.running ? (e.tState = 0) : (e.state = 0);
  }
  function Fn(e, t) {
    if ((t || ((e.tState = 0), p.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Fn(e.owned[n]);
  }
  function li(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function Cn(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      zt(r, (n && n.owner) || null);
    }
  }
  function zt(e, t = T) {
    let n = wn && t && t.context && t.context[wn],
      r = li(e);
    if (!n) throw r;
    Q
      ? Q.push({
          fn() {
            Cn(r, n, t);
          },
          state: oe,
        })
      : Cn(r, n, t);
  }
  function Bt(e) {
    if (typeof e == 'function' && !e.length) return Bt(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = Bt(e[n]);
        Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
      }
      return t;
    }
    return e;
  }
  function ci(e, t) {
    return function (r) {
      let i;
      return (
        Se(
          () => (i = K(() => ((T.context = { ...T.context, [e]: r.value }), ii(() => r.children)))),
          void 0,
        ),
        i
      );
    };
  }
  var di = Symbol('fallback');
  function Mn(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function ui(e, t, n = {}) {
    let r = [],
      i = [],
      s = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      N(() => Mn(s)),
      () => {
        let l = e() || [],
          f = l.length,
          c,
          u;
        return (
          l[ni],
          K(() => {
            let m, y, b, M, I, _, C, v, w;
            if (f === 0)
              (o !== 0 && (Mn(s), (s = []), (r = []), (i = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((r = [di]), (i[0] = Re((B) => ((s[0] = B), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (i = new Array(f), u = 0; u < f; u++) ((r[u] = l[u]), (i[u] = Re(h)));
              o = f;
            } else {
              for (
                b = new Array(f),
                  M = new Array(f),
                  a && (I = new Array(f)),
                  _ = 0,
                  C = Math.min(o, f);
                _ < C && r[_] === l[_];
                _++
              );
              for (C = o - 1, v = f - 1; C >= _ && v >= _ && r[C] === l[v]; C--, v--)
                ((b[v] = i[C]), (M[v] = s[C]), a && (I[v] = a[C]));
              for (m = new Map(), y = new Array(v + 1), u = v; u >= _; u--)
                ((w = l[u]), (c = m.get(w)), (y[u] = c === void 0 ? -1 : c), m.set(w, u));
              for (c = _; c <= C; c++)
                ((w = r[c]),
                  (u = m.get(w)),
                  u !== void 0 && u !== -1
                    ? ((b[u] = i[c]), (M[u] = s[c]), a && (I[u] = a[c]), (u = y[u]), m.set(w, u))
                    : s[c]());
              for (u = _; u < f; u++)
                u in b
                  ? ((i[u] = b[u]), (s[u] = M[u]), a && ((a[u] = I[u]), a[u](u)))
                  : (i[u] = Re(h));
              ((i = i.slice(0, (o = f))), (r = l.slice(0)));
            }
            return i;
          })
        );
        function h(m) {
          if (((s[u] = m), a)) {
            let [y, b] = W(u);
            return ((a[u] = b), t(l[u], y));
          }
          return t(l[u]);
        }
      }
    );
  }
  var fi = !1;
  function Ie(e, t) {
    if (fi && z.context) {
      let n = z.context;
      Nt(Zr());
      let r = K(() => e(t || {}));
      return (Nt(n), r);
    }
    return K(() => e(t || {}));
  }
  function jt(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return E(ui(() => e.each, e.children, t || void 0));
  }
  var gi = [
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
    Ms = new Set([
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
      ...gi,
    ]);
  function pi(e, t, n) {
    let r = n.length,
      i = t.length,
      s = r,
      o = 0,
      a = 0,
      l = t[i - 1].nextSibling,
      f = null;
    for (; o < i || a < s; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[i - 1] === n[s - 1]; ) (i--, s--);
      if (i === o) {
        let c = s < r ? (a ? n[a - 1].nextSibling : n[s - a]) : l;
        for (; a < s; ) e.insertBefore(n[a++], c);
      } else if (s === a) for (; o < i; ) ((!f || !f.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[s - 1] && n[a] === t[i - 1]) {
        let c = t[--i].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--s], c), (t[i] = n[s]));
      } else {
        if (!f) {
          f = new Map();
          let u = a;
          for (; u < s; ) f.set(n[u], u++);
        }
        let c = f.get(t[o]);
        if (c != null)
          if (a < c && c < s) {
            let u = o,
              h = 1,
              m;
            for (; ++u < i && u < s && !((m = f.get(t[u])) == null || m !== c + h); ) h++;
            if (h > c - a) {
              let y = t[o];
              for (; a < c; ) e.insertBefore(n[a++], y);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function qn(e, t, n, r = {}) {
    let i;
    return (
      Re((s) => {
        ((i = s), t === document ? e() : Le(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (i(), (t.textContent = ''));
      }
    );
  }
  function ze(e, t, n, r) {
    let i,
      s = () => {
        let a = r
          ? document.createElementNS('http://www.w3.org/1998/Math/MathML', 'template')
          : document.createElement('template');
        return (
          (a.innerHTML = e),
          n ? a.content.firstChild.firstChild : r ? a.firstChild : a.content.firstChild
        );
      },
      o = t
        ? () => K(() => document.importNode(i || (i = s()), !0))
        : () => (i || (i = s())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function Nn(e, t, n) {
    Xt(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
  }
  function Vn(e, t) {
    Xt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function je(e, t, n) {
    return K(() => e(t, n));
  }
  function Le(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return wt(e, t, r, n);
    Se((i) => wt(e, t(), i, n), r);
  }
  function Xt(e) {
    return !!z.context && !z.done && (!e || e.isConnected);
  }
  function wt(e, t, n, r, i) {
    let s = Xt(e);
    if (s) {
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
      if (s || (o === 'number' && ((t = t.toString()), t === n))) return n;
      if (a) {
        let l = n[0];
        (l && l.nodeType === 3 ? l.data !== t && (l.data = t) : (l = document.createTextNode(t)),
          (n = He(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (s) return n;
      n = He(e, n, r);
    } else {
      if (o === 'function')
        return (
          Se(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = wt(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          f = n && Array.isArray(n);
        if (Yt(l, t, n, i)) return (Se(() => (n = wt(e, l, n, r, !0))), () => n);
        if (s) {
          if (!l.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let c = l[0];
          if (c.parentNode !== e) return n;
          let u = [c];
          for (; (c = c.nextSibling) !== r; ) u.push(c);
          return (n = u);
        }
        if (l.length === 0) {
          if (((n = He(e, n, r)), a)) return n;
        } else f ? (n.length === 0 ? $n(e, l, r) : pi(e, n, l)) : (n && He(e), $n(e, l));
        n = l;
      } else if (t.nodeType) {
        if (s && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = He(e, n, r, t));
          He(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Yt(e, t, n, r) {
    let i = !1;
    for (let s = 0, o = t.length; s < o; s++) {
      let a = t[s],
        l = n && n[e.length],
        f;
      if (!(a == null || a === !0 || a === !1))
        if ((f = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) i = Yt(e, a, l) || i;
        else if (f === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            i = Yt(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || i;
          } else (e.push(a), (i = !0));
        else {
          let c = String(a);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return i;
  }
  function $n(e, t, n = null) {
    for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
  }
  function He(e, t, n, r) {
    if (n === void 0) return (e.textContent = '');
    let i = r || document.createTextNode('');
    if (t.length) {
      let s = !1;
      for (let o = t.length - 1; o >= 0; o--) {
        let a = t[o];
        if (i !== a) {
          let l = a.parentNode === e;
          !s && !o ? (l ? e.replaceChild(i, a) : e.insertBefore(i, n)) : l && a.remove();
        } else s = !0;
      }
    } else e.insertBefore(i, n);
    return [i];
  }
  var xe = !1;
  var tt = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ge = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || tt.ADD),
          (this.getId = e.getId || (() => Symbol())),
          (this._events = new Map()));
      }
      _getListeners(e) {
        let t = this._events.get(e);
        return t ? t.l || (t.l = [...t.m.values()]) : null;
      }
      on(e, t, n) {
        let r = this._events,
          i = r.get(e);
        i || ((i = { m: new Map(), l: null }), r.set(e, i));
        let s = i.m;
        if (((n = n === void 0 ? this.getId(t) : n), s.has(n)))
          switch (this.dedupe) {
            case tt.THROW:
              throw Error('Eventti: duplicate listener id!');
            case tt.IGNORE:
              return n;
            case tt.UPDATE:
              i.l = null;
              break;
            default:
              (s.delete(n), (i.l = null));
          }
        return (s.set(n, t), i.l?.push(t), n);
      }
      once(e, t, n) {
        let r = 0;
        return (
          (n = n === void 0 ? this.getId(t) : n),
          this.on(
            e,
            (...i) => {
              r || ((r = 1), this.off(e, n), t(...i));
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
            i = 0;
          if (t.length) for (; i < r; i++) n[i](...t);
          else for (; i < r; i++) n[i]();
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
  var mi = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new ge({ getId: r, dedupe: n })),
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
        i = t.length,
        s;
      for (; r < i; r++) ((s = n(t[r])), s && e.push(s));
      return e;
    }
    _processQueue(...e) {
      let t = this._queue,
        n = t.length;
      if (!n) return;
      let r = 0,
        i = 0,
        s,
        o;
      for (; r < n; r++) for (s = t[r], i = 0, o = s.length; i < o; i++) s[i](...e);
      t.length = 0;
    }
  };
  function Ut(e = 60) {
    if (typeof requestAnimationFrame == 'function' && typeof cancelAnimationFrame == 'function')
      return (t) => {
        let n = requestAnimationFrame(t);
        return () => cancelAnimationFrame(n);
      };
    {
      let t = 1e3 / e,
        n = typeof performance > 'u' ? () => Date.now() : () => performance.now();
      return (r) => {
        let i = setTimeout(() => r(n()), t);
        return () => clearTimeout(i);
      };
    }
  }
  var Bn = class extends mi {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Ut(), ...i } = e;
      (super(i),
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
  var P = { read: Symbol(), write: Symbol() },
    F = new Bn({
      phases: [P.read, P.write],
      requestFrame: typeof window < 'u' ? Ut() : () => () => {},
    });
  function nt(e, t = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
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
  function we(e, t, n = { width: 0, height: 0, x: 0, y: 0 }) {
    let r = Math.max(e.x, t.x),
      i = Math.min(e.x + e.width, t.x + t.width);
    if (i <= r) return null;
    let s = Math.max(e.y, t.y),
      o = Math.min(e.y + e.height, t.y + t.height);
    return o <= s ? null : ((n.x = r), (n.y = s), (n.width = i - r), (n.height = o - s), n);
  }
  var _i = { width: 0, height: 0, x: 0, y: 0 };
  function Fe(e, t, n) {
    if ((n || (n = we(e, t, _i)), !n)) return 0;
    let r = n.width * n.height;
    return r ? (r / (Math.min(e.width, t.width) * Math.min(e.height, t.height))) * 100 : 0;
  }
  var Wn = new WeakMap();
  function J(e) {
    let t = Wn.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Wn.set(e, new WeakRef(t))), t);
  }
  function $e(e) {
    return e instanceof Window;
  }
  var Hn = new Set(['auto', 'scroll']);
  function Ye(e, t) {
    let n = t || { x: 0, y: 0, width: 0, height: 0 };
    if ($e(e))
      return ((n.x = 0), (n.y = 0), (n.width = e.innerWidth), (n.height = e.innerHeight), n);
    let r = e.getBoundingClientRect(),
      i = J(e),
      s = parseFloat(i.borderLeftWidth) || 0,
      o = parseFloat(i.borderRightWidth) || 0,
      a = parseFloat(i.borderTopWidth) || 0,
      l = parseFloat(i.borderBottomWidth) || 0;
    ((n.x = r.left + s), (n.y = r.top + a));
    let f = r.width - s - o,
      c = r.height - a - l,
      u = e;
    return (
      u !== u.ownerDocument.documentElement &&
        (Hn.has(i.overflowY) && (f -= Math.max(0, Math.round(f) - u.clientWidth)),
        Hn.has(i.overflowX) && (c -= Math.max(0, Math.round(c) - u.clientHeight))),
      (n.width = f),
      (n.height = c),
      n
    );
  }
  function zn(e, t) {
    return !(
      e.left + e.width <= t.left ||
      t.left + t.width <= e.left ||
      e.top + e.height <= t.top ||
      t.top + t.height <= e.top
    );
  }
  function rt(e, t, n, r) {
    return Math.sqrt(Math.pow(n - e, 2) + Math.pow(r - t, 2));
  }
  function jn(e, t) {
    if (zn(e, t)) return null;
    let n = e.left + e.width,
      r = e.top + e.height,
      i = t.left + t.width,
      s = t.top + t.height;
    return n <= t.left
      ? r <= t.top
        ? rt(n, r, t.left, t.top)
        : e.top >= s
          ? rt(n, e.top, t.left, s)
          : t.left - n
      : e.left >= i
        ? r <= t.top
          ? rt(e.left, r, i, t.top)
          : e.top >= s
            ? rt(e.left, e.top, i, s)
            : e.left - i
        : r <= t.top
          ? t.top - r
          : e.top - s;
  }
  var yi = typeof window < 'u' && window.document !== void 0,
    Gt = !!(
      yi &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    $ = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Dt = { [$.content]: !1, [$.padding]: !1, [$.scrollbar]: !0, [$.border]: !0, [$.margin]: !0 },
    Et = new Set(['auto', 'scroll']),
    Yn = (() => {
      try {
        return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
      } catch {
        return !1;
      }
    })();
  function De(e) {
    return e instanceof Window;
  }
  function Ee(e) {
    return e instanceof Document;
  }
  var Xn = new WeakMap();
  function Y(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Xn.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Xn.set(e, new WeakRef(n))), n);
  }
  var Un = new Map(),
    it = null,
    Ce = null,
    st = null;
  function bi(e, t) {
    let n = e.split('.'),
      r = Un.get(n[1]);
    return (
      r === void 0 &&
        (it || (it = document.createElement('style')),
        (it.innerHTML = `
      #mezr-scrollbar-test::-webkit-scrollbar {
        width: ${e} !important;
      }
    `),
        (Ce && st) ||
          ((Ce = document.createElement('div')),
          (st = document.createElement('div')),
          Ce.appendChild(st),
          (Ce.id = 'mezr-scrollbar-test'),
          (Ce.style.cssText = `
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
          (st.style.cssText = `
        all: unset !important;
        position: absolute !important;
        inset: 0 !important;
      `)),
        document.body.appendChild(it),
        document.body.appendChild(Ce),
        (r = Ce.getBoundingClientRect().width - st.getBoundingClientRect().width - t),
        Un.set(n[1], r),
        document.body.removeChild(Ce),
        document.body.removeChild(it)),
      t + r
    );
  }
  function Me(e, t, n) {
    if (n <= 0) return 0;
    if (Yn) {
      let r = Y(e, '::-webkit-scrollbar'),
        i = t === 'x' ? r.height : r.width,
        s = parseFloat(i);
      if (!Number.isNaN(s) && !Number.isInteger(s)) return bi(i, s);
    }
    return n;
  }
  function Gn(e, t = !1) {
    if (t) return e.innerWidth;
    let { innerWidth: n, document: r } = e,
      { documentElement: i } = r,
      { clientWidth: s } = i;
    return n - Me(i, 'y', n - s);
  }
  function Kn({ documentElement: e }) {
    return Math.max(e.scrollWidth, e.clientWidth, e.getBoundingClientRect().width);
  }
  function Xe(e) {
    return e instanceof HTMLHtmlElement;
  }
  function Qn(e, t = $.border) {
    let { width: n } = e.getBoundingClientRect();
    if (t === $.border) return n;
    let r = Y(e);
    return t === $.margin
      ? ((n += Math.max(0, parseFloat(r.marginLeft) || 0)),
        (n += Math.max(0, parseFloat(r.marginRight) || 0)),
        n)
      : ((n -= parseFloat(r.borderLeftWidth) || 0),
        (n -= parseFloat(r.borderRightWidth) || 0),
        t === $.scrollbar ||
          (!Xe(e) && Et.has(r.overflowY) && (n -= Me(e, 'y', Math.round(n) - e.clientWidth)),
          t === $.padding ||
            ((n -= parseFloat(r.paddingLeft) || 0), (n -= parseFloat(r.paddingRight) || 0))),
        n);
  }
  function Kt(e, t = $.border) {
    return De(e) ? Gn(e, Dt[t]) : Ee(e) ? Kn(e) : Qn(e, t);
  }
  function Jn(e, t = !1) {
    if (t) return e.innerHeight;
    let { innerHeight: n, document: r } = e,
      { documentElement: i } = r,
      { clientHeight: s } = i;
    return n - Me(i, 'x', n - s);
  }
  function Zn({ documentElement: e }) {
    return Math.max(e.scrollHeight, e.clientHeight, e.getBoundingClientRect().height);
  }
  function er(e, t = $.border) {
    let { height: n } = e.getBoundingClientRect();
    if (t === $.border) return n;
    let r = Y(e);
    return t === $.margin
      ? ((n += Math.max(0, parseFloat(r.marginTop) || 0)),
        (n += Math.max(0, parseFloat(r.marginBottom) || 0)),
        n)
      : ((n -= parseFloat(r.borderTopWidth) || 0),
        (n -= parseFloat(r.borderBottomWidth) || 0),
        t === $.scrollbar ||
          (!Xe(e) && Et.has(r.overflowX) && (n -= Me(e, 'x', Math.round(n) - e.clientHeight)),
          t === $.padding ||
            ((n -= parseFloat(r.paddingTop) || 0), (n -= parseFloat(r.paddingBottom) || 0))),
        n);
  }
  function Qt(e, t = $.border) {
    return De(e) ? Jn(e, Dt[t]) : Ee(e) ? Zn(e) : er(e, t);
  }
  function qe(e) {
    return e?.constructor === Object;
  }
  function ot(e, t = $.border) {
    let n = { left: 0, top: 0 };
    if (Ee(e)) return n;
    if (De(e)) return ((n.left += e.scrollX || 0), (n.top += e.scrollY || 0), n);
    let r = e.ownerDocument.defaultView;
    r && ((n.left += r.scrollX || 0), (n.top += r.scrollY || 0));
    let i = e.getBoundingClientRect();
    if (((n.left += i.left), (n.top += i.top), t === $.border)) return n;
    let s = Y(e);
    return t === $.margin
      ? ((n.left -= Math.max(0, parseFloat(s.marginLeft) || 0)),
        (n.top -= Math.max(0, parseFloat(s.marginTop) || 0)),
        n)
      : ((n.left += parseFloat(s.borderLeftWidth) || 0),
        (n.top += parseFloat(s.borderTopWidth) || 0),
        t === $.scrollbar ||
          t === $.padding ||
          ((n.left += parseFloat(s.paddingLeft) || 0), (n.top += parseFloat(s.paddingTop) || 0)),
        n);
  }
  function tr(e, t) {
    let n = qe(e) ? { left: e.left, top: e.top } : Array.isArray(e) ? ot(...e) : ot(e);
    if (t && !Ee(t)) {
      let r = qe(t) ? t : Array.isArray(t) ? ot(t[0], t[1]) : ot(t);
      ((n.left -= r.left), (n.top -= r.top));
    }
    return n;
  }
  function nr(e, t) {
    let n = 0,
      r = 0;
    qe(e)
      ? ((n = e.width), (r = e.height))
      : Array.isArray(e)
        ? ((n = Kt(...e)), (r = Qt(...e)))
        : ((n = Kt(e)), (r = Qt(e)));
    let i = tr(e, t);
    return { width: n, height: r, ...i, right: i.left + n, bottom: i.top + r };
  }
  function Jt(e) {
    return qe(e) ? e : nr(e);
  }
  function rr(e, t) {
    let n = Jt(e),
      r = Jt(t);
    return jn(n, r);
  }
  var vi = nt(),
    Si = nt();
  function xi(e, t) {
    return rr(nt(e, vi), nt(t, Si));
  }
  function ir(e) {
    return $e(e) || e === document.documentElement || e === document.body ? window : e;
  }
  function at(e) {
    return $e(e) ? e.scrollX : e.scrollLeft;
  }
  function sr(e) {
    return ($e(e) && (e = document.documentElement), e.scrollWidth - e.clientWidth);
  }
  function lt(e) {
    return $e(e) ? e.scrollY : e.scrollTop;
  }
  function or(e) {
    return ($e(e) && (e = document.documentElement), e.scrollHeight - e.clientHeight);
  }
  function ar(e, t) {
    return !(
      e.x + e.width <= t.x ||
      t.x + t.width <= e.x ||
      e.y + e.height <= t.y ||
      t.y + t.height <= e.y
    );
  }
  var lr = class {
      constructor(
        e,
        {
          batchSize: t = 100,
          minBatchCount: n = 0,
          maxBatchCount: r = 2 ** 53 - 1,
          initialBatchCount: i = 0,
          shrinkThreshold: s = 2,
          onRelease: o,
        } = {},
      ) {
        d(this, '_batchSize');
        d(this, '_maxSize');
        d(this, '_minSize');
        d(this, '_shrinkThreshold');
        d(this, '_data');
        d(this, '_index');
        d(this, '_getItem');
        d(this, '_onRelease');
        ((this._batchSize = Math.floor(Math.max(t, 1))),
          (this._minSize = Math.floor(Math.max(n, 0)) * this._batchSize),
          (this._maxSize = Math.floor(
            Math.min(Math.max(r * this._batchSize, this._batchSize), 2 ** 53 - 1),
          )),
          (this._shrinkThreshold = Math.floor(Math.max(s, 1) * this._batchSize)),
          (this._data = Array(Math.floor(Math.max(Math.max(i, n) * this._batchSize, 0)))),
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
    cr = { width: 0, height: 0, x: 0, y: 0 },
    dr = { width: 0, height: 0, x: 0, y: 0 },
    pe = {
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
    A = { x: 1, y: 2 },
    Ne = { forward: 4, reverse: 8 },
    Ct = { none: 0, left: A.x | Ne.reverse, right: A.x | Ne.forward },
    ct = { none: 0, up: A.y | Ne.reverse, down: A.y | Ne.forward },
    V = { ...Ct, ...ct };
  function Zt(e) {
    switch (e) {
      case Ct.none:
      case ct.none:
        return 'none';
      case Ct.left:
        return 'left';
      case Ct.right:
        return 'right';
      case ct.up:
        return 'up';
      case ct.down:
        return 'down';
      default:
        throw Error(`Unknown direction value: ${e}`);
    }
  }
  function ur(e, t, n) {
    let { left: r = 0, right: i = 0, top: s = 0, bottom: o = 0 } = t;
    return (
      (r = Math.max(0, r)),
      (i = Math.max(0, i)),
      (s = Math.max(0, s)),
      (o = Math.max(0, o)),
      (n.width = e.width + r + i),
      (n.height = e.height + s + o),
      (n.x = e.x - r),
      (n.y = e.y - s),
      n
    );
  }
  function Mt(e, t) {
    return Math.ceil(e) >= Math.floor(t);
  }
  function en(e, t) {
    return Math.min(t / 2, e);
  }
  function tn(e, t, n, r) {
    return Math.max(0, n + e * 2 + r * t - r) / 2;
  }
  var wi = class {
      constructor() {
        d(this, 'positionX');
        d(this, 'positionY');
        d(this, 'directionX');
        d(this, 'directionY');
        d(this, 'overlapCheckRequestTime');
        ((this.positionX = 0),
          (this.positionY = 0),
          (this.directionX = V.none),
          (this.directionY = V.none),
          (this.overlapCheckRequestTime = 0));
      }
    },
    Di = class {
      constructor() {
        d(this, 'element');
        d(this, 'requestX');
        d(this, 'requestY');
        d(this, 'scrollLeft');
        d(this, 'scrollTop');
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
        (A.x & e.direction
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
          ((this.scrollLeft = this.requestX ? this.requestX.value : at(this.element)),
          (this.scrollTop = this.requestY ? this.requestY.value : lt(this.element)));
      }
      scroll() {
        this.element &&
          (this.element.scrollTo
            ? this.element.scrollTo(this.scrollLeft, this.scrollTop)
            : ((this.element.scrollLeft = this.scrollLeft),
              (this.element.scrollTop = this.scrollTop)));
      }
    },
    Ei = class {
      constructor() {
        d(this, 'item');
        d(this, 'element');
        d(this, 'isActive');
        d(this, 'isEnding');
        d(this, 'direction');
        d(this, 'value');
        d(this, 'maxValue');
        d(this, 'threshold');
        d(this, 'distance');
        d(this, 'deltaTime');
        d(this, 'speed');
        d(this, 'duration');
        d(this, 'action');
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
        return Ne.forward & this.direction ? Mt(this.value, this.maxValue) : this.value <= 0;
      }
      computeCurrentScrollValue() {
        return this.element
          ? this.value === this.value
            ? Math.max(0, Math.min(this.value, this.maxValue))
            : A.x & this.direction
              ? at(this.element)
              : lt(this.element)
          : 0;
      }
      computeNextScrollValue() {
        let e = this.speed * (this.deltaTime / 1e3),
          t = Ne.forward & this.direction ? this.value + e : this.value - e;
        return Math.max(0, Math.min(t, this.maxValue));
      }
      computeSpeed() {
        if (!this.item || !this.element) return 0;
        let { speed: e } = this.item;
        return typeof e == 'function'
          ? ((pe.direction = Zt(this.direction)),
            (pe.threshold = this.threshold),
            (pe.distance = this.distance),
            (pe.value = this.value),
            (pe.maxValue = this.maxValue),
            (pe.duration = this.duration),
            (pe.speed = this.speed),
            (pe.deltaTime = this.deltaTime),
            (pe.isEnding = this.isEnding),
            e(this.element, pe))
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
        typeof e == 'function' && e(this.element, Zt(this.direction));
      }
      onStop() {
        if (!this.item || !this.element) return;
        let { onStop: e } = this.item;
        typeof e == 'function' && e(this.element, Zt(this.direction));
      }
    };
  function fr(e = 500, t = 0.5, n = 0.25) {
    let r = e * (t > 0 ? 1 / t : 1 / 0),
      i = e * (n > 0 ? 1 / n : 1 / 0);
    return function (s, o) {
      let a = 0;
      if (!o.isEnding)
        if (o.threshold > 0) {
          let f = o.threshold - Math.max(0, o.distance);
          a = (e / o.threshold) * f;
        } else a = e;
      let l = o.speed;
      if (l === a) return a;
      if (l < a) {
        let f = l + r * (o.deltaTime / 1e3);
        return Math.min(a, f);
      } else {
        let f = l - i * (o.deltaTime / 1e3);
        return Math.max(a, f);
      }
    };
  }
  var hr = class {
    constructor(e = {}) {
      d(this, 'items');
      d(this, 'settings');
      d(this, '_isDestroyed');
      d(this, '_isTicking');
      d(this, '_tickTime');
      d(this, '_tickDeltaTime');
      d(this, '_itemData');
      d(this, '_actions');
      d(this, '_requests');
      d(this, '_requestPool');
      d(this, '_actionPool');
      let { overlapCheckInterval: t = 150 } = e;
      ((this.items = []),
        (this.settings = { overlapCheckInterval: t }),
        (this._actions = []),
        (this._isDestroyed = !1),
        (this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        (this._requests = { [A.x]: new Map(), [A.y]: new Map() }),
        (this._itemData = new Map()),
        (this._requestPool = new lr((n) => n || new Ei(), {
          initialBatchCount: 1,
          minBatchCount: 1,
          onRelease: (n) => n.reset(),
        })),
        (this._actionPool = new lr((n) => n || new Di(), {
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
        F.on(P.read, this._frameRead, this._frameRead),
        F.on(P.write, this._frameWrite, this._frameWrite));
    }
    _stopTicking() {
      this._isTicking &&
        ((this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        F.off(P.read, this._frameRead),
        F.off(P.write, this._frameWrite));
    }
    _requestItemScroll(e, t, n, r, i, s, o) {
      let a = this._requests[t],
        l = a.get(e);
      (l
        ? (l.element !== n || l.direction !== r) && l.reset()
        : ((l = this._requestPool.get()), a.set(e, l)),
        (l.item = e),
        (l.element = n),
        (l.direction = r),
        (l.threshold = i),
        (l.distance = s),
        (l.maxValue = o));
    }
    _cancelItemScroll(e, t) {
      let n = this._requests[t],
        r = n.get(e);
      r && (r.action && r.action.removeRequest(r), this._requestPool.release(r), n.delete(e));
    }
    _checkItemOverlap(e, t, n) {
      let { inertAreaSize: r, targets: i, clientRect: s } = e;
      if (!i.length) {
        (t && this._cancelItemScroll(e, A.x), n && this._cancelItemScroll(e, A.y));
        return;
      }
      let o = this._itemData.get(e),
        a = o?.directionX,
        l = o?.directionY;
      if (!a && !l) {
        (t && this._cancelItemScroll(e, A.x), n && this._cancelItemScroll(e, A.y));
        return;
      }
      let f = null,
        c = -1 / 0,
        u = 0,
        h = -1 / 0,
        m = V.none,
        y = 0,
        b = 0,
        M = null,
        I = -1 / 0,
        _ = 0,
        C = -1 / 0,
        v = V.none,
        w = 0,
        B = 0,
        S = 0;
      for (; S < i.length; S++) {
        let g = i[S],
          x = typeof g.threshold == 'number' ? g.threshold : 50,
          D = !!(t && a && g.axis !== 'y'),
          H = !!(n && l && g.axis !== 'x'),
          G = g.priority || 0;
        if ((!D || G < c) && (!H || G < I)) continue;
        let L = ir(g.element || g),
          te = D ? sr(L) : -1,
          ue = H ? or(L) : -1;
        if (te <= 0 && ue <= 0) continue;
        let ee = Ye(L, dr),
          be = Fe(s, ee) || -1 / 0;
        if (be === -1 / 0)
          if (g.padding && ar(s, ur(ee, g.padding, cr))) be = -(xi(s, ee) || 0);
          else continue;
        if (D && G >= c && te > 0 && (G > c || be > h)) {
          let ne = 0,
            re = V.none,
            se = en(x, ee.width),
            Pe = tn(se, r, s.width, ee.width);
          (a === V.right
            ? ((ne = ee.x + ee.width + Pe - (s.x + s.width)),
              ne <= se && !Mt(at(L), te) && (re = V.right))
            : a === V.left && ((ne = s.x - (ee.x - Pe)), ne <= se && at(L) > 0 && (re = V.left)),
            re && ((f = L), (c = G), (u = se), (h = be), (m = re), (y = ne), (b = te)));
        }
        if (H && G >= I && ue > 0 && (G > I || be > C)) {
          let ne = 0,
            re = ct.none,
            se = en(x, ee.height),
            Pe = tn(se, r, s.height, ee.height);
          (l === V.down
            ? ((ne = ee.y + ee.height + Pe - (s.y + s.height)),
              ne <= se && !Mt(lt(L), ue) && (re = V.down))
            : l === V.up && ((ne = s.y - (ee.y - Pe)), ne <= se && lt(L) > 0 && (re = V.up)),
            re && ((M = L), (I = G), (_ = se), (C = be), (v = re), (w = ne), (B = ue)));
        }
      }
      (t &&
        (f && m ? this._requestItemScroll(e, A.x, f, m, u, y, b) : this._cancelItemScroll(e, A.x)),
        n &&
          (M && v
            ? this._requestItemScroll(e, A.y, M, v, _, w, B)
            : this._cancelItemScroll(e, A.y)));
    }
    _updateScrollRequest(e) {
      let { inertAreaSize: t, smoothStop: n, targets: r, clientRect: i } = e.item,
        s = null,
        o = 0;
      for (; o < r.length; o++) {
        let a = r[o],
          l = ir(a.element || a);
        if (l !== e.element) continue;
        let f = !!(A.x & e.direction);
        if (f) {
          if (a.axis === 'y') continue;
        } else if (a.axis === 'x') continue;
        let c = f ? sr(l) : or(l);
        if (c <= 0) break;
        let u = Ye(l, dr);
        if ((Fe(i, u) || -1 / 0) === -1 / 0) {
          let M = a.scrollPadding || a.padding;
          if (!(M && ar(i, ur(u, M, cr)))) break;
        }
        let h = en(typeof a.threshold == 'number' ? a.threshold : 50, f ? u.width : u.height),
          m = tn(h, t, f ? i.width : i.height, f ? u.width : u.height),
          y = 0;
        if (
          ((y =
            e.direction === V.left
              ? i.x - (u.x - m)
              : e.direction === V.right
                ? u.x + u.width + m - (i.x + i.width)
                : e.direction === V.up
                  ? i.y - (u.y - m)
                  : u.y + u.height + m - (i.y + i.height)),
          y > h)
        )
          break;
        let b = f ? at(l) : lt(l);
        if (((s = Ne.forward & e.direction ? Mt(b, c) : b <= 0), s)) break;
        return ((e.maxValue = c), (e.threshold = h), (e.distance = y), (e.isEnding = !1), !0);
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
          { x: r, y: i } = t.position,
          s = n.positionX,
          o = n.positionY;
        (r === s && i === o) ||
          ((n.directionX = r > s ? V.right : r < s ? V.left : n.directionX),
          (n.directionY = i > o ? V.down : i < o ? V.up : n.directionY),
          (n.positionX = r),
          (n.positionY = i),
          n.overlapCheckRequestTime === 0 && (n.overlapCheckRequestTime = this._tickTime));
      }
    }
    _updateRequests() {
      let e = this.items,
        t = this._requests[A.x],
        n = this._requests[A.y],
        r = 0;
      for (; r < e.length; r++) {
        let i = e[r],
          s = this._itemData.get(i),
          o = s.overlapCheckRequestTime,
          a = o > 0 && this._tickTime - o > this.settings.overlapCheckInterval,
          l = !0,
          f = t.get(i);
        f &&
          f.isActive &&
          ((l = !this._updateScrollRequest(f)), l && ((a = !0), this._cancelItemScroll(i, A.x)));
        let c = !0,
          u = n.get(i);
        (u &&
          u.isActive &&
          ((c = !this._updateScrollRequest(u)), c && ((a = !0), this._cancelItemScroll(i, A.y))),
          a && ((s.overlapCheckRequestTime = 0), this._checkItemOverlap(i, l, c)));
      }
    }
    _requestAction(e, t) {
      let n = t === A.x,
        r = null,
        i = 0;
      for (; i < this._actions.length; i++) {
        if (((r = this._actions[i]), e.element !== r.element)) {
          r = null;
          continue;
        }
        if (n ? r.requestX : r.requestY) {
          this._cancelItemScroll(e.item, t);
          return;
        }
        break;
      }
      (r || (r = this._actionPool.get()),
        (r.element = e.element),
        r.addRequest(e),
        e.tick(this._tickDeltaTime),
        this._actions.push(r));
    }
    _updateActions() {
      let e = 0;
      for (e = 0; e < this.items.length; e++) {
        let t = this.items[e],
          n = this._requests[A.x].get(t),
          r = this._requests[A.y].get(t);
        (n && this._requestAction(n, A.x), r && this._requestAction(r, A.y));
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
        r = new wi();
      ((r.positionX = t),
        (r.positionY = n),
        (r.directionX = V.none),
        (r.directionY = V.none),
        (r.overlapCheckRequestTime = this._tickTime),
        this._itemData.set(e, r),
        this.items.push(e),
        this._isTicking || this._startTicking());
    }
    removeItem(e) {
      if (this._isDestroyed) return;
      let t = this.items.indexOf(e);
      t !== -1 &&
        (this._requests[A.x].get(e) &&
          (this._cancelItemScroll(e, A.x), this._requests[A.x].delete(e)),
        this._requests[A.y].get(e) &&
          (this._cancelItemScroll(e, A.y), this._requests[A.y].delete(e)),
        this._itemData.delete(e),
        this.items.splice(t, 1),
        this._isTicking && !this.items.length && this._stopTicking());
    }
    isDestroyed() {
      return this._isDestroyed;
    }
    isItemScrollingX(e) {
      return !!this._requests[A.x].get(e)?.isActive;
    }
    isItemScrollingY(e) {
      return !!this._requests[A.y].get(e)?.isActive;
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
  function Z(e, t = { width: 0, height: 0, x: 0, y: 0 }) {
    return (e && ((t.width = e.width), (t.height = e.height), (t.x = e.x), (t.y = e.y)), t);
  }
  var Ci = class {
      constructor(e) {
        d(this, '_items');
        d(this, '_index');
        d(this, '_initItem');
        ((this._items = []), (this._index = 0), (this._initItem = e));
      }
      allocate(...e) {
        let t = this._index,
          n = this._items,
          r = this._initItem(n[t], ...e);
        return ((n[t] = r), ++this._index, r);
      }
      reset() {
        this._index = 0;
      }
      truncate(e = 0) {
        let t = Math.max(0, Math.min(e, this._items.length));
        ((this._index = Math.min(this._index, t)), (this._items.length = t));
      }
    },
    Mi = Symbol(),
    Ot = class {
      constructor(e) {
        d(this, '_listenerId');
        d(this, '_dndObserver');
        d(this, '_cdArenaPool');
        d(this, '_cdArenaMap');
        ((this._listenerId = Symbol()),
          (this._dndObserver = e),
          (this._cdArenaPool = []),
          (this._cdArenaMap = new Map()));
      }
      _checkCollision(e, t, n) {
        let r = e.getClientRect(),
          i = t.getClientRect();
        if (!r) return null;
        let s = we(r, i, n.intersectionRect);
        if (s === null) return null;
        let o = Fe(r, i, s);
        return o <= 0
          ? null
          : ((n.droppableId = t.id),
            Z(i, n.droppableRect),
            Z(r, n.draggableRect),
            (n.intersectionScore = o),
            n);
      }
      _sortCollisions(e, t) {
        return t.sort((n, r) => {
          let i = r.intersectionScore - n.intersectionScore;
          return i === 0
            ? n.droppableRect.width * n.droppableRect.height -
                r.droppableRect.width * r.droppableRect.height
            : i;
        });
      }
      _createCollisionData() {
        return {
          droppableId: Mi,
          droppableRect: Z(),
          draggableRect: Z(),
          intersectionRect: Z(),
          intersectionScore: 0,
        };
      }
      _getCollisionDataArena(e) {
        let t = this._cdArenaMap.get(e);
        return (
          t ||
            ((t = this._cdArenaPool.pop() || new Ci((n) => n || this._createCollisionData())),
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
        let r = this._getCollisionDataArena(e),
          i = null,
          s = t.values();
        for (let o of s)
          (i || (i = r.allocate()), this._checkCollision(e, o, i) && (n.push(i), (i = null)));
        (n.length > 1 && this._sortCollisions(e, n), r.reset());
      }
      destroy() {
        this._cdArenaMap.forEach((e) => {
          e.truncate();
        });
      }
    };
  function gr(e) {
    return e instanceof Document;
  }
  var pr = 'visible';
  function yr(e, t, n = []) {
    let r = t ? e : e?.parentNode;
    for (n.length = 0; r && !gr(r); )
      if (r instanceof Element) {
        let i = J(r);
        (i.overflowY === pr || i.overflowX === pr || n.push(r), (r = r.parentNode));
      } else r = r instanceof ShadowRoot ? r.host : r.parentNode;
    return (n.push(window), n);
  }
  var Ue,
    Oi = Z(),
    Ai = {
      width: 2 ** 53 - 1,
      height: 2 ** 53 - 1,
      x: (2 ** 53 - 1) * -0.5,
      y: (2 ** 53 - 1) * -0.5,
    },
    Ae = [],
    Oe = [],
    dt = [],
    ut = [],
    mr = Z();
  function Ti(e) {
    if (!Ae.length) {
      let t = e.drag?.items?.[0]?.dragContainer;
      t ? yr(t, !0, Ae) : Ae.push(window);
    }
  }
  function ki(e) {
    Oe.length || yr(e.element, !1, Oe);
  }
  function _r(e, t = Z()) {
    Z(e.length ? Ye(e[0], mr) : Ai, t);
    for (let n = 1; n < e.length; n++)
      if (!we(t, Ye(e[n], mr), t)) {
        Z(Oi, t);
        break;
      }
    return t;
  }
  var nn = class extends Ot {
    constructor(t, n) {
      super(t);
      d(this, '_dragStates');
      d(this, '_visibilityLogic');
      d(this, '_listenersAttached');
      d(this, '_clearCache');
      ((this._dragStates = new Map()),
        (this._visibilityLogic = n?.visibilityLogic || 'relative'),
        (this._listenersAttached = !1),
        (this._clearCache = () => this.clearCache()));
    }
    _checkCollision(t, n, r) {
      let i = this._dragStates.get(t);
      if (!i) return null;
      let s = t.getClientRect(),
        o = n.getClientRect();
      if (!s || !o) return null;
      let a = i.clipMaskKeyMap.get(n);
      if (!a) {
        let u = this._visibilityLogic === 'relative';
        if (
          ((Oe.length = 0),
          (dt.length = 0),
          (ut.length = 0),
          ki(n),
          (a = Oe[0] || window),
          i.clipMaskKeyMap.set(n, a),
          !i.clipMaskMap.has(a))
        ) {
          if ((Ti(t), u)) {
            let y = window;
            for (let b of Oe)
              if (Ae.includes(b)) {
                y = b;
                break;
              }
            for (let b of Ae) {
              if (b === y) break;
              dt.push(b);
            }
            for (let b of Oe) {
              if (b === y) break;
              ut.push(b);
            }
          } else (dt.push(...Ae), ut.push(...Oe));
          let h = u || !Ue ? _r(dt) : Z(Ue),
            m = _r(ut);
          (!u && !Ue && (Ue = h), i.clipMaskMap.set(a, [h, m]));
        }
        ((Oe.length = 0), (dt.length = 0), (ut.length = 0));
      }
      let [l, f] = i.clipMaskMap.get(a) || [];
      if (
        !l ||
        !f ||
        !we(s, l, r.draggableVisibleRect) ||
        !we(o, f, r.droppableVisibleRect) ||
        !we(r.draggableVisibleRect, r.droppableVisibleRect, r.intersectionRect)
      )
        return null;
      let c = Fe(r.draggableVisibleRect, r.droppableVisibleRect, r.intersectionRect);
      return c <= 0
        ? null
        : ((r.droppableId = n.id),
          Z(o, r.droppableRect),
          Z(s, r.draggableRect),
          (r.intersectionScore = c),
          r);
    }
    _sortCollisions(t, n) {
      return n.sort((r, i) => {
        let s = i.intersectionScore - r.intersectionScore;
        return s === 0
          ? r.droppableVisibleRect.width * r.droppableVisibleRect.height -
              i.droppableVisibleRect.width * i.droppableVisibleRect.height
          : s;
      });
    }
    _createCollisionData() {
      let t = super._createCollisionData();
      return ((t.droppableVisibleRect = Z()), (t.draggableVisibleRect = Z()), t);
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
    detectCollisions(t, n, r) {
      ((Ae.length = 0), (Ue = null));
      let i = this._getDragState(t);
      (i.cacheDirty && (i.cacheDirty = (i.clipMaskKeyMap.clear(), i.clipMaskMap.clear(), !1)),
        super.detectCollisions(t, n, r),
        (Ae.length = 0),
        (Ue = null));
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
  var me = typeof window < 'u' && window.document !== void 0,
    br = me && 'ontouchstart' in window,
    vr = me && !!window.PointerEvent;
  me &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var X = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function Sr(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Pi(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Ri(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function xr(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function wr(e) {
    return e === 'auto' || e === void 0 ? (vr ? 'pointer' : br ? 'touch' : 'mouse') : e;
  }
  var Te = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    ke = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    ft = class {
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
          listenerOptions: n = ke.listenerOptions,
          sourceEvents: r = ke.sourceEvents,
          startPredicate: i = ke.startPredicate,
          cancelOnVisibilityChange: s = ke.cancelOnVisibilityChange,
          cancelOnEscape: o = ke.cancelOnEscape,
          preventNativeDrag: a = ke.preventNativeDrag,
          preventContextMenu: l = ke.preventContextMenu,
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._cancelOnVisibilityChange = s ?? !0),
          (this._cancelOnEscape = o ?? !0),
          (this._preventNativeDrag = a ?? !0),
          (this._preventContextMenu = l ?? !1),
          (this._startPredicate = i),
          (this._listenerOptions = xr(n)),
          (this._sourceEvents = wr(r)),
          (this._emitter = new ge()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(Te[this._sourceEvents].start, this._onStart, this._listenerOptions),
          s && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? Sr(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Pi(e);
        if (t === null) return;
        let n = Sr(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Ri(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: X.Start, srcEvent: e, target: n.target }),
          this._emitter.emit(this._eventData.type, this._eventData),
          this.drag && this._bindWindowListeners());
      }
      _onMove(e) {
        let t = this.drag,
          n = this._eventData;
        if (!t || !n) return;
        let r = this._getTrackedPointerEventData(e);
        if (!r) return;
        let i = r.clientX,
          s = r.clientY;
        ((t.deltaX = i - t.x),
          (t.deltaY = s - t.y),
          (t.x = i),
          (t.y = s),
          (n.type = X.Move),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = i),
          (n.y = s),
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
        let i = r.clientX,
          s = r.clientY;
        ((t.deltaX = i - t.x),
          (t.deltaY = s - t.y),
          (t.x = i),
          (t.y = s),
          (n.type = X.Cancel),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = i),
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
        let r = this._getTrackedPointerEventData(e);
        if (!r) return;
        let i = r.clientX,
          s = r.clientY;
        ((t.deltaX = i - t.x),
          (t.deltaY = s - t.y),
          (t.x = i),
          (t.y = s),
          (n.type = X.End),
          (n.srcEvent = e),
          (n.target = r.target),
          (n.x = i),
          (n.y = s),
          (n.deltaX = t.deltaX),
          (n.deltaY = t.deltaY),
          this._emitter.emit(n.type, n),
          this._resetDrag());
      }
      _bindWindowListeners() {
        if (this._areWindowListenersBound) return;
        let { move: e, end: t, cancel: n } = Te[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = Te[this._sourceEvents];
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
          ((this._eventData.type = X.Cancel),
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
            Te[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(Te[this._sourceEvents].start, this._onStart, this._listenerOptions),
          (this.element = e));
      }
      updateSettings(e) {
        if (this.isDestroyed) return;
        let {
            listenerOptions: t,
            sourceEvents: n,
            startPredicate: r,
            cancelOnVisibilityChange: i,
            cancelOnEscape: s,
            preventNativeDrag: o,
            preventContextMenu: a,
          } = e,
          l = wr(n),
          f = xr(t);
        (r && this._startPredicate !== r && (this._startPredicate = r),
          i !== void 0 &&
            this._cancelOnVisibilityChange !== i &&
            ((this._cancelOnVisibilityChange = i),
            i
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
            (this._listenerOptions.capture !== f.capture ||
              this._listenerOptions.passive !== f.passive)) ||
            (n && this._sourceEvents !== l)) &&
            (this.element.removeEventListener(
              Te[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && f && (this._listenerOptions = f),
            this.element.addEventListener(
              Te[this._sourceEvents].start,
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
          this._emitter.emit(X.Destroy, { type: X.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            Te[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Ii(e) {
    let t = J(e),
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
  function Li(e) {
    let t = J(e),
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
  function Ve(e, t = !1) {
    let { translate: n, rotate: r, scale: i, transform: s } = J(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', f] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Li(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Ii(e)}px`),
        f ? (o += `translate3d(${a},${l},${f})`) : (o += `translate(${a},${l})`));
    }
    if (r && r !== 'none') {
      let a = r.split(' ');
      a.length > 1 ? (o += `rotate3d(${a.join(',')})`) : (o += `rotate(${a.join(',')})`);
    }
    if (i && i !== 'none') {
      let a = i.split(' ');
      a.length === 3 ? (o += `scale3d(${a.join(',')})`) : (o += `scale(${a.join(',')})`);
    }
    return (!t && s && s !== 'none' && (o += s), o);
  }
  function ht(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function rn(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      i = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, i] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(i) || 0 }
    );
  }
  var Be = me ? new DOMMatrix() : null;
  function gt(e, t = new DOMMatrix()) {
    let n = e;
    for (ht(t); n; ) {
      let r = Ve(n);
      if (r && (Be.setMatrixValue(r), !Be.isIdentity)) {
        let { transformOrigin: i } = J(n),
          { x: s, y: o, z: a } = rn(i);
        (a === 0
          ? Be.setMatrixValue(`translate(${s}px,${o}px) ${Be} translate(${s * -1}px,${o * -1}px)`)
          : Be.setMatrixValue(
              `translate3d(${s}px,${o}px,${a}px) ${Be} translate3d(${s * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(Be));
      }
      n = n.parentElement;
    }
    return t;
  }
  function At(e) {
    switch (Y(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function Tt(e) {
    let t = Y(e);
    if (!Gt) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: f } = t;
      if (f && f !== 'none') return !0;
      let { willChange: c } = t;
      if (c && (c.indexOf('filter') > -1 || c.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = At(e);
    if (!n) return n;
    let { transform: r } = t;
    if (r && r !== 'none') return !0;
    let { perspective: i } = t;
    if (i && i !== 'none') return !0;
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
      ) || !!(Gt && a && a.indexOf('filter') > -1)
    );
  }
  function Dr(e) {
    return Y(e).position !== 'static' || Tt(e);
  }
  function sn(e, t = {}) {
    if (Xe(e)) return e.ownerDocument.defaultView;
    let n = t.position || Y(e).position,
      { skipDisplayNone: r, container: i } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let s = i || e.parentElement;
        for (; s; ) {
          let o = At(s);
          if (o) return s;
          if (o === null && !r) return null;
          s = s.parentElement;
        }
        return e.ownerDocument.documentElement;
      }
      case 'absolute':
      case 'fixed': {
        let s = n === 'fixed',
          o = i || e.parentElement;
        for (; o; ) {
          let a = s ? Tt(o) : Dr(o);
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
  function on(e, t = {}) {
    let n = Y(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let i = t.position || Y(e).position,
      { skipDisplayNone: s, container: o } = t;
    switch (i) {
      case 'relative':
        return e;
      case 'fixed':
        return sn(e, { container: o, position: i, skipDisplayNone: s });
      case 'absolute': {
        let a = sn(e, { container: o, position: i, skipDisplayNone: s });
        return De(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Fi(e, t) {
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
  function an(e) {
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
  function Er(e, t, n = null) {
    if ('moveBefore' in e && e.isConnected === t.isConnected)
      try {
        e.moveBefore(t, n);
        return;
      } catch {}
    let r = document.activeElement,
      i = t.contains(r);
    (e.insertBefore(t, n),
      i &&
        document.activeElement !== r &&
        r instanceof HTMLElement &&
        r.focus({ preventScroll: !0 }));
  }
  function kt(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Cr = class {
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
    Ar = class {
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
          (this._matrixCache = new Cr()),
          (this._clientOffsetCache = new Cr()));
      }
    };
  function $i(e, t, n = !1) {
    let { style: r } = e;
    for (let i in t) r.setProperty(i, t[i], n ? 'important' : '');
  }
  function qi() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      $i(
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
  function mt(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      i = J(e);
    return (
      (t.x = n + (parseFloat(i.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(i.borderTopWidth) || 0)),
      t
    );
  }
  function Mr(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Ni = { x: 0, y: 0 },
    Vi = { x: 0, y: 0 };
  function Bi(e, t, n = { x: 0, y: 0 }) {
    let r = Mr(e) ? e : mt(e, Ni),
      i = Mr(t) ? t : mt(t, Vi);
    return ((n.x = i.x - r.x), (n.y = i.y - r.y), n);
  }
  var Pt = me ? qi() : null,
    Tr = class {
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
        let r = J(e),
          i = e.getBoundingClientRect(),
          s = Ve(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = rn(r.transformOrigin)),
          (this.elementTransformMatrix = new DOMMatrix().setMatrixValue(s + r.transform)),
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
          let { position: u } = r;
          if (u !== 'fixed' && u !== 'absolute')
            throw Error(
              `Dragged element has "${u}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let f = on(e) || e;
        ((this.elementOffsetContainer = f),
          (this.dragOffsetContainer = l === o ? f : on(e, { container: l })));
        {
          let { width: u, height: h, x: m, y } = i;
          this.clientRect = { width: u, height: h, x: m, y };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let c = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(c))
          if (c.length) {
            let u = {};
            for (let h of c) u[h] = r[h];
            this.frozenStyles = u;
          } else this.frozenStyles = null;
        else this.frozenStyles = c;
        if (this.frozenStyles) {
          let u = {};
          for (let h in this.frozenStyles) u[h] = e.style[h];
          this.unfrozenStyles = u;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, r] = t;
            (gt(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
          }
        });
      }
      _updateContainerOffset() {
        let {
          elementOffsetContainer: e,
          elementContainer: t,
          dragOffsetContainer: n,
          dragContainer: r,
          containerOffset: i,
          _clientOffsetCache: s,
          _matrixCache: o,
        } = this;
        if (e !== n) {
          let [a, l] = [
            [r, n],
            [t, e],
          ].map(([f, c]) => {
            let u = s.get(c) || { x: 0, y: 0 };
            if (!s.isValid(c)) {
              let h = o.get(f);
              c instanceof HTMLElement && h && !h[0].isIdentity
                ? an(h[0])
                  ? (Pt.style.setProperty('transform', h[1].toString(), 'important'),
                    c.append(Pt),
                    mt(Pt, u),
                    Pt.remove())
                  : (mt(c, u), (u.x -= h[0].m41), (u.y -= h[0].m42))
                : mt(c, u);
            }
            return (s.set(c, u), u);
          });
          Bi(a, l, i);
        } else ((i.x = 0), (i.y = 0));
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
    Or = { capture: !0, passive: !0 },
    Wi = { x: 0, y: 0 },
    fe = me ? new DOMMatrix() : null,
    Rt = me ? new DOMMatrix() : null,
    ae = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(ae || {}),
    le = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(le || {}),
    pt = { Start: 'start', Move: 'move', End: 'end' },
    _t = { Immediate: 'immediate', Sampled: 'sampled' },
    _e = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    R = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    kr = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === _e.End || t === _e.EndAlign,
          [r, i] = e.getContainerMatrix(),
          [s, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: f,
            elementTransformMatrix: c,
            elementTransformOrigin: u,
            elementOffsetMatrix: h,
          } = e,
          { x: m, y, z: b } = u,
          M = !c.isIdentity && (m !== 0 || y !== 0 || b !== 0),
          I = a.x + l.x + f.x,
          _ = a.y + l.y + f.y;
        (ht(fe),
          M && (b === 0 ? fe.translateSelf(-m, -y) : fe.translateSelf(-m, -y, -b)),
          n ? i.isIdentity || fe.multiplySelf(i) : o.isIdentity || fe.multiplySelf(o),
          ht(Rt).translateSelf(I, _),
          fe.multiplySelf(Rt),
          r.isIdentity || fe.multiplySelf(r),
          M && (ht(Rt).translateSelf(m, y, b), fe.multiplySelf(Rt)),
          c.isIdentity || fe.multiplySelf(c),
          h.isIdentity || fe.preMultiplySelf(h),
          (e.element.style.transform = `${fe}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: _t.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    ln = class {
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
          (this._emitter = new ge()),
          (this._startPhase = ae.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: pt.Start }),
          (this._onMove = this._onMove.bind(this)),
          (this._onScroll = this._onScroll.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          (this._prepareStart = this._prepareStart.bind(this)),
          (this._applyStart = this._applyStart.bind(this)),
          (this._prepareMove = this._prepareMove.bind(this)),
          (this._applyMove = this._applyMove.bind(this)),
          (this._prepareAlign = this._prepareAlign.bind(this)),
          (this._applyAlign = this._applyAlign.bind(this)),
          this._sensors.forEach((i) => {
            this._bindSensor(i);
          }));
      }
      get sensors() {
        return this._sensors;
      }
      set sensors(e) {
        let t = this._sensors;
        if (e === t) return;
        let n = t.filter((s) => !e.includes(s)),
          r = e.filter((s) => !t.includes(s));
        ((this._sensors = e),
          n.forEach((s) => {
            this._unbindSensor(s);
          }),
          r.forEach((s) => {
            this._bindSensor(s);
          }));
        let i = this.drag?.sensor;
        i && n.includes(i) && this.stop();
      }
      _bindSensor(e) {
        this._sensorData.set(e, {
          predicateState: le.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(X.Start, t, t), e.on(X.Move, t, t), e.on(X.Cancel, n, n), e.on(X.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(X.Start, n),
          e.off(X.Move, n),
          e.off(X.Cancel, r),
          e.off(X.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = kr) {
        let {
          container: n = t.container,
          startPredicate: r = t.startPredicate,
          elements: i = t.elements,
          frozenStyles: s = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: f = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: u = t.preventClickOnEnd,
          preventTextSelection: h = t.preventTextSelection,
          capturePointer: m = t.capturePointer,
          onPrepareStart: y = t.onPrepareStart,
          onStart: b = t.onStart,
          onPrepareMove: M = t.onPrepareMove,
          onMove: I = t.onMove,
          onEnd: _ = t.onEnd,
          onDestroy: C = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: i,
          frozenStyles: s,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: l,
          sensorProcessingMode: f,
          dndGroups: c,
          preventClickOnEnd: u,
          preventTextSelection: h,
          capturePointer: m,
          onPrepareStart: y,
          onStart: b,
          onPrepareMove: M,
          onMove: I,
          onEnd: _,
          onDestroy: C,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case le.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case le.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === _t.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (F.once(P.read, this._prepareMove, this._moveId),
                    F.once(P.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === le.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = le.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = le.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== ae.Init ||
          ((this._startPhase = ae.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Tr(t, this),
          )),
          this._applyModifiers(pt.Start, 0, 0),
          this._emit(R.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = ae.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== ae.FinishPrepare)) {
          if (((this._startPhase = ae.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof ft && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Er(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: _e.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Fi(n, r) || (!an(n) && !an(r))) continue;
            let i = t.element.getBoundingClientRect(),
              { alignmentOffset: s } = t;
            ((s.x += kt(t.clientRect.x - i.x, 3)), (s.y += kt(t.clientRect.y - i.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: _e.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Or),
            this._emit(R.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = ae.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          i = t.y - n.y;
        (!r && !i) ||
          (this._applyModifiers(pt.Move, r, i),
          this._emit(R.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: _e.Move, draggable: this, drag: e, item: t }));
          (this._emit(R.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
        }
      }
      _prepareAlign() {
        let { drag: e } = this;
        if (!(!e || e.isEnded))
          for (let t of e.items) {
            let { x: n, y: r } = t.element.getBoundingClientRect(),
              i = t.clientRect.x - t._moveDiff.x - n;
            ((t.alignmentOffset.x = t.alignmentOffset.x - t._alignDiff.x + i),
              (t._alignDiff.x = i));
            let s = t.clientRect.y - t._moveDiff.y - r;
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
              this.settings.applyPosition({ phase: _e.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let i = this.settings.positionModifiers,
          s = this._modifierData;
        s.drag = r;
        for (let o of r.items) {
          let a = Wi;
          ((a.x = t), (a.y = n), (s.item = o), (s.phase = e));
          for (let l of i) a = l(a, s);
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
        n.predicateState === le.Pending &&
          r &&
          ((this._startPhase = ae.Init),
          (n.predicateState = le.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Ar(e, r)),
          this._sensorData.forEach((i, s) => {
            s !== e && ((i.predicateState = le.Rejected), (i.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === _t.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (F.once(P.read, this._prepareStart, this._startId),
              F.once(P.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === le.Pending &&
          ((t.predicateState = le.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === ae.Prepare || this._startPhase === ae.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = ae.None),
          F.off(P.read, this._startId),
          F.off(P.write, this._startId),
          F.off(P.read, this._moveId),
          F.off(P.write, this._moveId),
          F.off(P.read, this._alignId),
          F.off(P.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Or),
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
        this._applyModifiers(pt.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Er(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: _e.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = kt(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = kt(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: _e.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(R.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === _t.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (F.once(P.read, this._prepareAlign, this._alignId),
              F.once(P.write, this._applyAlign, this._alignId)));
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
          this._emit(R.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  var yt = { Destroy: 'destroy' },
    Pr = {
      accept: () => !0,
      computeClientRect: (e) => e.element?.getBoundingClientRect() || e.getClientRect(),
    },
    Rr = class {
      constructor(e, t = {}) {
        d(this, 'id');
        d(this, 'element');
        d(this, 'isDestroyed');
        d(this, 'accept');
        d(this, 'data');
        d(this, 'computeClientRect');
        d(this, '_clientRect');
        d(this, '_emitter');
        let {
          id: n = Symbol(),
          accept: r = Pr.accept,
          data: i = {},
          computeClientRect: s = Pr.computeClientRect,
        } = t;
        ((this.id = n),
          (this.element = e),
          (this.isDestroyed = !1),
          (this.accept = r),
          (this.data = i),
          (this.computeClientRect = s),
          (this._clientRect = { x: 0, y: 0, width: 0, height: 0 }),
          (this._emitter = new ge()),
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
          ((this.isDestroyed = !0), this._emitter.emit(yt.Destroy), this._emitter.off());
      }
    };
  var ie = (function (e) {
      return (
        (e[(e.Idle = 0)] = 'Idle'),
        (e[(e.Computing = 1)] = 'Computing'),
        (e[(e.Computed = 2)] = 'Computed'),
        (e[(e.Emitting = 3)] = 'Emitting'),
        e
      );
    })(ie || {}),
    Ir = { capture: !0, passive: !0 },
    k = {
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
    cn = class {
      constructor(e = {}) {
        d(this, 'draggables');
        d(this, 'droppables');
        d(this, 'isDestroyed');
        d(this, '_drags');
        d(this, '_listenerId');
        d(this, '_collisionDetector');
        d(this, '_emitter');
        d(this, '_onScroll', () => {
          this._drags.size !== 0 &&
            (F.once(P.read, this.updateDroppableClientRects, this._listenerId),
            this.detectCollisions());
        });
        let { collisionDetector: t } = e;
        ((this.draggables = new Map()),
          (this.droppables = new Map()),
          (this.isDestroyed = !1),
          (this._drags = new Map()),
          (this._listenerId = Symbol()),
          (this._emitter = new ge()),
          (this._onScroll = this._onScroll.bind(this)),
          (this.updateDroppableClientRects = this.updateDroppableClientRects.bind(this)),
          (this._collisionDetector = t ? t(this) : new Ot(this)));
      }
      get drags() {
        return this._drags;
      }
      _isMatch(e, t) {
        let n = !1;
        if (typeof t.accept == 'function') n = t.accept(e);
        else {
          let r = e.settings.dndGroups,
            i = t.accept;
          if (!r || r.size === 0 || i.size === 0) return !1;
          let s = i.size < r.size,
            o = s ? i : r,
            a = s ? r : i;
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
        for (let r of this.droppables.values()) this._isMatch(e, r) && n.set(r.id, r);
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
                phase: ie.Idle,
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
            this._drags.size === 1 && window.addEventListener('scroll', this._onScroll, Ir)));
      }
      _onDragStart(e) {
        let t = this._drags.get(e);
        if (!(!t || t.isEnded)) {
          if (this._emitter.listenerCount(k.Start)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(k.Start, n));
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
          if (this._emitter.listenerCount(k.Move)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(k.Move, n));
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
        if (n._cd.phase === ie.Emitting)
          throw Error('Cannot stop dragging while collisions are being emitted.');
        ((n.isEnded = !0), this._computeCollisions(e, !0), this._emitCollisions(e, !0));
        let { targets: r, collisions: i, contacts: s } = n._cd;
        if (this._emitter.listenerCount(k.End)) {
          let o = n._events.end;
          ((o.canceled = t),
            (o.targets = r),
            (o.collisions = i),
            (o.contacts = s),
            this._emitter.emit(k.End, o));
        }
        (this._drags.delete(e),
          this._collisionDetector._removeCollisionDataArena(e),
          F.off(P.read, n._cd.tickerId),
          F.off(P.write, n._cd.tickerId),
          this._drags.size ||
            (F.off(P.read, this._listenerId),
            window.removeEventListener('scroll', this._onScroll, Ir)));
      }
      _computeCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let r = n._cd;
        switch (r.phase) {
          case ie.Computing:
            throw Error('Collisions are being computed.');
          case ie.Emitting:
            throw Error('Collisions are being emitted.');
          default:
            break;
        }
        ((r.phase = ie.Computing),
          (r.targets = this._getTargets(e)),
          this._collisionDetector.detectCollisions(e, r.targets, r.collisions),
          (r.phase = ie.Computed));
      }
      _emitCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let r = n._cd;
        switch (r.phase) {
          case ie.Computing:
            throw Error('Collisions are being computed.');
          case ie.Emitting:
            throw Error('Collisions are being emitted.');
          case ie.Idle:
            return;
          default:
            break;
        }
        r.phase = ie.Emitting;
        let i = this._emitter,
          s = r.collisions,
          o = r.targets,
          a = r.addedContacts,
          l = r.persistedContacts,
          f = r.contacts,
          c = r.prevContacts;
        ((r.prevContacts = f), (r.contacts = c));
        let u = f;
        (a.clear(), l.clear(), c.clear());
        for (let h of s) {
          let m = o.get(h.droppableId);
          m && (c.add(m), f.has(m) ? (l.add(m), f.delete(m)) : a.add(m));
        }
        if (f.size && i.listenerCount(k.Leave)) {
          let h = n._events.leave;
          ((h.targets = o),
            (h.collisions = s),
            (h.contacts = c),
            (h.removedContacts = u),
            i.emit(k.Leave, h));
        }
        if (a.size && i.listenerCount(k.Enter)) {
          let h = n._events.enter;
          ((h.targets = o),
            (h.collisions = s),
            (h.contacts = c),
            (h.addedContacts = a),
            i.emit(k.Enter, h));
        }
        if (i.listenerCount(k.Collide) && (c.size || u.size)) {
          let h = n._events.collide;
          ((h.targets = o),
            (h.collisions = s),
            (h.contacts = c),
            (h.addedContacts = a),
            (h.removedContacts = u),
            (h.persistedContacts = l),
            i.emit(k.Collide, h));
        }
        (a.clear(), l.clear(), f.clear(), (r.phase = ie.Idle));
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
            (F.once(P.read, t._cd._compute, t._cd.tickerId),
              F.once(P.write, t._cd._emit, t._cd.tickerId));
          } else
            for (let [, t] of this._drags)
              t.isEnded ||
                (F.once(P.read, t._cd._compute, t._cd.tickerId),
                F.once(P.write, t._cd._emit, t._cd.tickerId));
      }
      addDraggables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.draggables.has(n.id) ||
            (t.add(n),
            this.draggables.set(n.id, n),
            n.on(
              R.PrepareStart,
              () => {
                this._onDragPrepareStart(n);
              },
              this._listenerId,
            ),
            n.on(
              R.Start,
              () => {
                this._onDragStart(n);
              },
              this._listenerId,
            ),
            n.on(
              R.PrepareMove,
              () => {
                this._onDragPrepareMove(n);
              },
              this._listenerId,
            ),
            n.on(
              R.Move,
              () => {
                this._onDragMove(n);
              },
              this._listenerId,
            ),
            n.on(
              R.End,
              (r) => {
                r.endEvent?.type === X.End ? this._onDragEnd(n) : this._onDragCancel(n);
              },
              this._listenerId,
            ),
            n.on(
              R.Destroy,
              () => {
                this._onDraggableDestroy(n);
              },
              this._listenerId,
            ));
        if (t.size) {
          this._emitter.listenerCount(k.AddDraggables) &&
            this._emitter.emit(k.AddDraggables, { draggables: t });
          for (let n of t)
            if (!this.isDestroyed && n.drag && !n.drag.isEnded) {
              let r = n._startPhase;
              (r >= 2 && this._onDragPrepareStart(n), r >= 4 && this._onDragStart(n));
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
            n.off(R.PrepareStart, this._listenerId),
            n.off(R.Start, this._listenerId),
            n.off(R.PrepareMove, this._listenerId),
            n.off(R.Move, this._listenerId),
            n.off(R.End, this._listenerId),
            n.off(R.Destroy, this._listenerId));
        for (let n of t) this._stopDrag(n, !0);
        this._emitter.listenerCount(k.RemoveDraggables) &&
          this._emitter.emit(k.RemoveDraggables, { draggables: t });
      }
      addDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) ||
            (t.add(n),
            this.droppables.set(n.id, n),
            n.on(
              yt.Destroy,
              () => {
                this.removeDroppables([n]);
              },
              this._listenerId,
            ),
            this._drags.forEach(({ _targets: r }, i) => {
              r && this._isMatch(i, n) && (r.set(n.id, n), this.detectCollisions(i));
            }));
        t.size &&
          this._emitter.listenerCount(k.AddDroppables) &&
          this._emitter.emit(k.AddDroppables, { droppables: t });
      }
      removeDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) &&
            (this.droppables.delete(n.id),
            t.add(n),
            n.off(yt.Destroy, this._listenerId),
            this._drags.forEach(({ _targets: r }, i) => {
              r && r.has(n.id) && (r.delete(n.id), this.detectCollisions(i));
            }));
        t.size &&
          this._emitter.listenerCount(k.RemoveDroppables) &&
          this._emitter.emit(k.RemoveDroppables, { droppables: t });
      }
      destroy() {
        if (this.isDestroyed) return;
        if (Array.from(this._drags.values()).some((t) => t._cd.phase === ie.Emitting))
          throw Error('Cannot destroy the DndObserver while collisions are being emitted.');
        ((this.isDestroyed = !0),
          this.draggables.forEach((t) => {
            (t.off(R.PrepareStart, this._listenerId),
              t.off(R.Start, this._listenerId),
              t.off(R.PrepareMove, this._listenerId),
              t.off(R.Move, this._listenerId),
              t.off(R.End, this._listenerId),
              t.off(R.Destroy, this._listenerId));
          }),
          this.droppables.forEach((t) => {
            t.off(yt.Destroy, this._listenerId);
          }));
        let e = this._drags.keys();
        for (let t of e) this._stopDrag(t, !0);
        (this._emitter.emit(k.Destroy),
          this._emitter.off(),
          this._collisionDetector.destroy(),
          this.draggables.clear(),
          this.droppables.clear());
      }
    };
  var dn = new hr();
  var un = { x: 0, y: 0 },
    bt = { width: 0, height: 0, x: 0, y: 0 };
  function Hi() {
    return {
      targets: [],
      inertAreaSize: 0.2,
      speed: fr(),
      smoothStop: !1,
      getPosition: (e) => {
        let { drag: t } = e,
          n = t?.items[0];
        if (n) return n.position;
        let r = t && (t.moveEvent || t.startEvent);
        return ((un.x = r ? r.x : 0), (un.y = r ? r.y : 0), un);
      },
      getClientRect: (e) => {
        let { drag: t } = e,
          n = e.getClientRect();
        if (n) return n;
        let r = t && (t.moveEvent || t.startEvent);
        return (
          (bt.width = r ? 50 : 0),
          (bt.height = r ? 50 : 0),
          (bt.x = r ? r.x - 25 : 0),
          (bt.y = r ? r.y - 25 : 0),
          bt
        );
      },
      onStart: null,
      onStop: null,
    };
  }
  var zi = class {
      constructor(e, t) {
        d(this, '_draggableAutoScroll');
        d(this, '_draggable');
        d(this, '_position');
        d(this, '_clientRect');
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
    ji = class {
      constructor(e, t = {}) {
        d(this, 'name');
        d(this, 'version');
        d(this, 'settings');
        d(this, '_autoScrollProxy');
        ((this.name = 'autoscroll'),
          (this.version = '0.0.3'),
          (this.settings = this._parseSettings(t)),
          (this._autoScrollProxy = null),
          e.on(R.Start, () => {
            this._autoScrollProxy ||
              ((this._autoScrollProxy = new zi(this, e)), dn.addItem(this._autoScrollProxy));
          }),
          e.on(R.End, () => {
            this._autoScrollProxy &&
              (this._autoScrollProxy = (dn.removeItem(this._autoScrollProxy), null));
          }));
      }
      _parseSettings(e, t = Hi()) {
        let {
          targets: n = t.targets,
          inertAreaSize: r = t.inertAreaSize,
          speed: i = t.speed,
          smoothStop: s = t.smoothStop,
          getPosition: o = t.getPosition,
          getClientRect: a = t.getClientRect,
          onStart: l = t.onStart,
          onStop: f = t.onStop,
        } = e || {};
        return {
          targets: n,
          inertAreaSize: r,
          speed: i,
          smoothStop: s,
          getPosition: o,
          getClientRect: a,
          onStart: l,
          onStop: f,
        };
      }
      updateSettings(e = {}) {
        this.settings = this._parseSettings(e, this.settings);
      }
    };
  function Lr(e) {
    return (t) => {
      let n = new ji(t, e),
        r = t;
      return ((r.plugins[n.name] = n), r);
    };
  }
  var Fr = (e, { phase: t, drag: n }) => {
    if (t === 'start') {
      let r = n.sensor.drag?.startX ?? n.startEvent.startX,
        i = n.sensor.drag?.startY ?? n.startEvent.startY;
      r !== void 0 && i !== void 0 && ((e.x += n.startEvent.x - r), (e.y += n.startEvent.y - i));
    }
    return e;
  };
  var Yi = () => {},
    ce = new Map(),
    hn = new Set();
  function fn() {
    hn.forEach((e) => e());
  }
  var ye = {
    add(e, t, n) {
      ((ce = new Map(ce)), ce.set(e, { sources: t, proxies: n, exiting: !1, done: Yi }), fn());
    },
    startExiting(e, t) {
      let n = ce.get(e);
      n && ((ce = new Map(ce)), ce.set(e, { ...n, exiting: !0, done: t }), fn());
    },
    remove(e) {
      ce.has(e) && ((ce = new Map(ce)), ce.delete(e), fn());
    },
    subscribe(e) {
      return (hn.add(e), () => hn.delete(e));
    },
    getSnapshot() {
      return ce;
    },
  };
  var Xi = (e) => typeof e == 'function' && e.length === 0;
  function U(e, t) {
    return e === void 0 ? t : Xi(e) ? e() : e;
  }
  function $r(e) {
    return e.map((t) => U(t));
  }
  function qr(e) {
    let [t, n] = W(ye.getSnapshot());
    return (
      O(() => {
        let r = ye.subscribe(() => {
          n(ye.getSnapshot());
        });
        N(r);
      }),
      E(() => {
        let r = U(e),
          i = t();
        if (!r || !i.has(r)) return null;
        let s = i.get(r);
        return {
          draggable: r,
          sources: s.sources,
          proxies: s.proxies,
          exiting: s.exiting,
          done: s.done,
        };
      })
    );
  }
  function Nr(e) {
    let t = qr(e.draggable),
      n = [],
      r = () => {
        for (let i of n) i();
        n = [];
      };
    (O(() => {
      let i = t();
      if ((r(), !i || !i.proxies.length)) return;
      let { draggable: s, sources: o, proxies: a, exiting: l, done: f } = i;
      for (let c = 0; c < a.length; c++) {
        let u = a[c],
          h = c;
        Re((m) => {
          n.push(m);
          let y =
            typeof e.children == 'function'
              ? e.children({
                  draggable: s,
                  item: s.drag?.items?.[h] ?? null,
                  index: h,
                  sourceElement: o[h],
                  exiting: l,
                  done: f,
                })
              : e.children;
          Le(u, y);
        });
      }
    }),
      N(r));
  }
  var Ui = () => null,
    It = kn(Ui);
  function Ge() {
    return Wt(It);
  }
  function de(e, t, n) {
    let r = Ge(),
      i = E(() => (n === void 0 ? r() : U(n))),
      s,
      [o, a] = W(!1);
    (O(() => {
      ((s = U(t)), a(!!s));
    }),
      O(() => {
        let l = i();
        if (!l || !o()) return;
        let f = (...u) => {
            s?.(...u);
          },
          c = l.on(e, f);
        N(() => l.off(e, c));
      }));
  }
  function Vr(e = void 0) {
    if (xe) return () => null;
    let t = E(() => U(e)),
      n = E(() => t()?.collisionDetector),
      r = new cn({ collisionDetector: K(n) }),
      [i, s] = W(r),
      o = K(n);
    return (
      O(() => {
        let a = n();
        a !== o && ((o = a), r.destroy(), (r = new cn({ collisionDetector: a })), s(r));
      }),
      N(() => {
        r.destroy();
      }),
      de(
        k.Start,
        E(() => t()?.onStart),
        i,
      ),
      de(
        k.Move,
        E(() => t()?.onMove),
        i,
      ),
      de(
        k.Enter,
        E(() => t()?.onEnter),
        i,
      ),
      de(
        k.Leave,
        E(() => t()?.onLeave),
        i,
      ),
      de(
        k.Collide,
        E(() => t()?.onCollide),
        i,
      ),
      de(
        k.End,
        E(() => t()?.onEnd),
        i,
      ),
      de(
        k.AddDraggables,
        E(() => t()?.onAddDraggables),
        i,
      ),
      de(
        k.RemoveDraggables,
        E(() => t()?.onRemoveDraggables),
        i,
      ),
      de(
        k.AddDroppables,
        E(() => t()?.onAddDroppables),
        i,
      ),
      de(
        k.RemoveDroppables,
        E(() => t()?.onRemoveDroppables),
        i,
      ),
      de(
        k.Destroy,
        E(() => t()?.onDestroy),
        i,
      ),
      i
    );
  }
  var Gi = Object.prototype.hasOwnProperty,
    Br = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function Ke(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      r = Array.isArray(t);
    if (n || r) {
      if (!n || !r) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let f = 0; f < l; f++) if (!Ke(e[f], t[f])) return !1;
      return !0;
    }
    let i = e instanceof Set,
      s = t instanceof Set;
    if (i || s) {
      if (!i || !s || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!Br(e) || !Br(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let f = o[l];
      if (!Gi.call(t, f) || !Ke(e[f], t[f])) return !1;
    }
    return !0;
  }
  var Lt = new Map(),
    Ft = [],
    gn = [],
    pn = [],
    mn = [],
    _n = [],
    yn = [],
    bn = [],
    vn = [];
  function Wr() {
    (Lt.clear(),
      (Ft.length = 0),
      (gn.length = 0),
      (pn.length = 0),
      (mn.length = 0),
      (_n.length = 0),
      (yn.length = 0),
      (bn.length = 0),
      (vn.length = 0));
  }
  function Hr(e) {
    let t = [];
    Wr();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        i = r.parentElement;
      if (!i) throw new Error('Source element must have a parent element.');
      let s = r.getBoundingClientRect(),
        o = J(r),
        a = Ve(r),
        l = a ? o.transformOrigin : '',
        f,
        c;
      if (r instanceof SVGSVGElement) ((f = `${s.width}px`), (c = `${s.height}px`));
      else {
        let m = parseFloat(o.width),
          y = parseFloat(o.height);
        if (!(m >= 0) || !(y >= 0)) ((f = `${s.width}px`), (c = `${s.height}px`));
        else if (o.boxSizing === 'border-box') ((f = o.width), (c = o.height));
        else {
          let b = parseFloat(o.paddingLeft) || 0,
            M = parseFloat(o.paddingRight) || 0,
            I = parseFloat(o.borderLeftWidth) || 0,
            _ = parseFloat(o.borderRightWidth) || 0,
            C = parseFloat(o.paddingTop) || 0,
            v = parseFloat(o.paddingBottom) || 0,
            w = parseFloat(o.borderTopWidth) || 0,
            B = parseFloat(o.borderBottomWidth) || 0;
          ((f = `${m + b + M + I + _}px`), (c = `${y + C + v + w + B}px`));
        }
      }
      let u = document.createElement('div'),
        h = u.style;
      ((h.position = 'absolute'),
        (h.left = '0px'),
        (h.top = '0px'),
        (h.margin = '0'),
        (h.padding = '0'),
        (h.boxSizing = 'border-box'),
        (h.pointerEvents = 'none'),
        (h.contain = 'layout'),
        (u.dataset.dragPreviewProxy = 'true'),
        (Ft[n] = i),
        (t[n] = u),
        (gn[n] = s),
        (pn[n] = a),
        (mn[n] = l),
        (_n[n] = f),
        (yn[n] = c),
        Lt.has(i) || Lt.set(i, gt(i)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ft[n],
        i = t[n],
        s = pn[n],
        o = mn[n],
        a = _n[n],
        l = yn[n],
        f = i.style;
      ((f.width = a),
        (f.height = l),
        s && ((f.transform = s), o && (f.transformOrigin = o)),
        r.appendChild(i));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ft[n],
        i = t[n],
        s = gn[n],
        o = Lt.get(r),
        a = 0,
        l = 0,
        f = o.m11,
        c = o.m12,
        u = o.m21,
        h = o.m22,
        m = f * h - c * u,
        y = i.getBoundingClientRect(),
        b = s.left - y.left,
        M = s.top - y.top;
      if (Math.abs(m) < 1e-10) ((a = b), (l = M));
      else {
        let I = 1 / m;
        ((a = (h * b - u * M) * I), (l = (-c * b + f * M) * I));
      }
      ((bn[n] = a), (vn[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        i = bn[n],
        s = vn[n];
      ((r.left = `${i}px`), (r.top = `${s}px`));
    }
    return (Wr(), t);
  }
  function zr(e, t) {
    if (xe) return () => null;
    let n = E(() => (Array.isArray(e) ? $r(e) : (U(e) ?? [])).filter((v) => !!v)),
      r = E(() => U(t)),
      i = E(() => r()?.id),
      s = E(() => r()?.dndObserver),
      o = E(() => {
        let v = r();
        if (!v) return;
        let { dndObserver: w, id: B, dragPreviewContainer: S, dragPreviewExitTimeout: g, ...x } = v;
        return x;
      }),
      a = Ge(),
      l = E(() => {
        let v = s();
        return v === void 0 ? a() : v;
      }),
      [f, c] = W(null),
      u = null,
      h = i(),
      m = o(),
      y = l(),
      b = o(),
      M = r()?.dragPreviewContainer,
      I = r()?.dragPreviewExitTimeout;
    O(() => {
      let v = r();
      ((b = o()), (M = v?.dragPreviewContainer), (I = v?.dragPreviewExitTimeout));
    });
    let _ = () => {
        u && (u.destroy(), (u = null), (m = void 0), c(null));
      },
      C = () => {
        Tn(() => {
          _();
          let v = K(n);
          if (!v.length) return;
          let w = K(o),
            B = i(),
            S = w?.dragPreview,
            g = new ln(v, {
              id: B,
              ...w,
              elements(D) {
                let H = b,
                  L = (H?.elements || (() => null))(D);
                if (!H?.dragPreview || !L || L.length === 0) return L;
                let te = Hr(L);
                ye.add(D.draggable, L, te);
                let ue = () => {
                    let ne = I || 0;
                    if (ne > 0) {
                      for (let qt of te) qt.dataset.exiting = 'true';
                      let re = !1,
                        se = () => {
                          re ||
                            ((re = !0),
                            clearTimeout(Pe),
                            ye.remove(D.draggable),
                            setTimeout(() => {
                              for (let qt of te) qt.remove();
                            }, 0));
                        },
                        Pe = setTimeout(se, ne);
                      ye.startExiting(D.draggable, se);
                    } else
                      (ye.remove(D.draggable),
                        setTimeout(() => {
                          for (let re of te) re.remove();
                        }, 0));
                    (D.draggable.off('end', ee), D.draggable.off('destroy', be));
                  },
                  ee = D.draggable.on('end', ue),
                  be = D.draggable.on('destroy', ue);
                return te;
              },
              ...(S
                ? {
                    container: () => {
                      let D = M;
                      return (typeof D == 'function' ? D() : D) || document.body;
                    },
                  }
                : {}),
            }),
            x = K(l);
          (x?.addDraggables([g]), (u = g), (h = B), (m = w), (y = x), c(g));
        });
      };
    return (
      O(() => {
        let v = n();
        if (!v.length) {
          _();
          return;
        }
        let w = u;
        if (!w) {
          C();
          return;
        }
        (v.length !== w.sensors.length || v.some((B) => !w.sensors.includes(B))) && C();
      }),
      O(() => {
        if (!u) return;
        let w = i();
        h !== w && C();
      }),
      O(() => {
        let v = l();
        if (y === v) return;
        let w = u;
        (w && (y?.removeDraggables([w]), v?.addDraggables([w])), (y = v));
      }),
      O(() => {
        let v = u;
        if (!v) return;
        let w = o(),
          B = !1;
        if (m) {
          let g = { ...m },
            x = { ...w };
          ((g.elements === x.elements || (g.dragPreview && x.dragPreview)) &&
            (delete g.elements, delete x.elements),
            (B = !Ke(g, x)));
        } else B = !0;
        if (!B) return;
        let S = v._parseSettings(w);
        if (
          (v.updateSettings({
            ...S,
            ...(!w?.dragPreview && w?.elements ? { elements: w.elements } : {}),
            ...(w?.dragPreview
              ? {
                  container: () => {
                    let g = M;
                    return (typeof g == 'function' ? g() : g) || document.body;
                  },
                }
              : {}),
          }),
          m)
        ) {
          let g = w?.dndGroups !== m.dndGroups,
            x = w?.computeClientRect !== m.computeClientRect;
          (g && y?.clearTargets(v), (g || x) && y?.detectCollisions(v));
        }
        m = w;
      }),
      N(_),
      f
    );
  }
  function jr(e, t) {
    let n = E(() => U(e)),
      r = E(() => U(t)),
      i = r();
    return (
      O(() => {
        let s = n();
        if (s) {
          if (s.plugins.autoscroll) {
            i = r();
            return;
          }
          (s.use(Lr(r())), (i = r()));
        }
      }),
      O(() => {
        let o = n()?.plugins.autoscroll;
        if (!o) return;
        let a = r();
        Ke(i, a) || (o.updateSettings(o._parseSettings(a)), (i = a));
      }),
      n
    );
  }
  function Yr(e) {
    if (xe) return [() => null, () => {}];
    let t = E(() => U(e)),
      n = E(() => t()?.element),
      r = E(() => t()?.dndObserver),
      i = E(() => t()?.id),
      s = E(() => t()?.accept),
      o = E(() => t()?.data),
      a = E(() => t()?.computeClientRect),
      l = Ge(),
      f = E(() => {
        let _ = r();
        return _ === void 0 ? l() : _;
      }),
      [c, u] = W(null),
      h = null,
      m = i(),
      y = f(),
      b = () => {
        h && (h.destroy(), (h = null), u(null));
      },
      M = (_) => {
        b();
        let C = { id: i(), accept: s(), data: o() },
          v = new Rr(_, C);
        ((h = v), (m = C.id));
        let w = f();
        (w && w.addDroppables([v]), (y = w), u(v));
      },
      I = (_) => {
        if (n() === void 0) {
          if (_ === null) {
            b();
            return;
          }
          h?.element !== _ && M(_);
        }
      };
    return (
      O(() => {
        let _ = n();
        if (_ !== void 0) {
          if (_ === null) {
            b();
            return;
          }
          (M(_), N(b));
        }
      }),
      O(() => {
        let _ = h;
        if (!_) return;
        let C = i();
        m !== C && _.element && M(_.element);
      }),
      O(() => {
        let _ = f();
        if (y === _) return;
        let C = h;
        (C && (y?.removeDroppables([C]), _?.addDroppables([C])), (y = _));
      }),
      O(() => {
        let _ = h;
        if (!_) return;
        let C = s() || (() => !0);
        ((_.accept = C), y?.detectCollisions());
      }),
      O(() => {
        let _ = h;
        _ && (_.data = o() || {});
      }),
      O(() => {
        let _ = h;
        if (!_) return;
        let C = a();
        (C && (_.computeClientRect = C), y?.detectCollisions());
      }),
      N(b),
      [c, I]
    );
  }
  function Xr(e = {}, t) {
    if (xe) return [() => null, () => {}];
    let n = E(() => U(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : U(t))),
      [i, s] = W(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (c) => {
        o?.destroy();
        let u = new ft(c, n());
        ((o = u), s(u));
      };
    (O(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      O(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), N(a));
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
    return (N(a), [i, f]);
  }
  var Ki = ze(
      '<li><a href=https://muuri.dev target=_blank rel="noopener noreferrer"aria-roledescription="sortable item"aria-describedby=dnd-instructions>',
    ),
    Qi = ze('<div class="sortable-item drag-preview"aria-hidden=true><a>'),
    Ji = ze(
      '<div id=dnd-instructions class=sr-only>Press Shift plus Space or Shift plus Enter to reorder. Use arrow keys to move. Press Space or Enter to drop, or Escape to cancel.',
    ),
    Zi = ze('<div id=dnd-live-region class=sr-only aria-live=assertive aria-atomic=true>'),
    es = ze('<ul id=sortable-list role=list aria-label="Sortable items">'),
    ts = 100,
    ns = 64,
    Ur = 150,
    rs = 150,
    $t = 200,
    is = 51,
    ss = $t + 50;
  function os(e, t, n, r, i) {
    let s = e - n,
      o = t - r;
    return s * s + o * o >= i;
  }
  function Sn(e, t) {
    e && (e.textContent = t);
  }
  function as(e, t, n, r, i, s) {
    for (let o of i) {
      let a = e.get(o);
      if (!a) continue;
      let l = t.findIndex((h) => h.id === o),
        c = (n.indexOf(o) - l) * r,
        u = parseFloat(a.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
      if (u !== c && ((a.style.transform = c === 0 ? '' : `translateY(${c}px)`), s)) {
        let h = a.getAnimations();
        for (let m = 0; m < h.length; m++) h[m].cancel();
        a.animate(
          [
            { transform: `translateY(${u}px)` },
            { transform: c === 0 ? 'translateY(0px)' : `translateY(${c}px)` },
          ],
          { duration: Ur, easing: 'ease' },
        );
      }
    }
  }
  function ls(e) {
    for (let t of e.values()) {
      let n = t.getAnimations();
      for (let r = 0; r < n.length; r++) n[r].cancel();
      t.style.transform = '';
    }
  }
  function Gr(e, t) {
    for (let n of e.values()) {
      let r = n.style.transform;
      if (!r || r === 'translateY(0px)') continue;
      let i = n.getAnimations();
      for (let s = 0; s < i.length; s++) i[s].cancel();
      ((n.style.transform = ''),
        n.animate([{ transform: r }, { transform: 'translateY(0px)' }], {
          duration: t,
          easing: 'ease',
        }));
    }
  }
  var cs = (e) => new nn(e);
  function ds(e) {
    let t = null;
    O(() => {
      let l = t;
      (l && e.itemElements.set(e.item.id, l),
        N(() => {
          e.itemElements.delete(e.item.id);
        }));
    });
    let [n, r] = Xr(),
      [, i] = Yr({
        data: { itemId: e.item.id },
        computeClientRect: () => {
          let l = e.listEl,
            f = e.itemStride.current;
          if (!l || !e.items.length || !f) return { x: 0, y: 0, width: 0, height: 0 };
          let c = e.virtualOrder.current,
            u = c ? c.indexOf(e.item.id) : e.items.findIndex((b) => b.id === e.item.id);
          if (u < 0) return { x: 0, y: 0, width: 0, height: 0 };
          let h = l.getBoundingClientRect(),
            m = e.itemElements.get(e.item.id),
            y = m ? m.getBoundingClientRect().height : f;
          return { x: h.left, y: h.top + u * f, width: h.width, height: y };
        },
      });
    function s() {
      e.dndObserver.current?.updateDroppableClientRects();
    }
    let o = jr(
        zr([n], {
          elements: () => {
            let l = t;
            return l ? [l] : [];
          },
          dragPreview: !0,
          dragPreviewExitTimeout: ss,
          startPredicate: ({ event: l }) =>
            e.a11yDrag ? !1 : os(l.x, l.y, l.startX, l.startY, ns) ? !0 : void 0,
          positionModifiers: [Fr, (l) => ((l.x = 0), l)],
          computeClientRect: ({ drag: l }) => {
            let f = l.items[0]?.element;
            if (!f) return null;
            let c = f.getBoundingClientRect();
            return { x: c.x, y: c.y, width: c.width, height: c.height };
          },
          onStart: () => {
            let l = t;
            l &&
              ((e.virtualOrder.current = e.items.map((f) => f.id)),
              l.classList.add('placeholder'),
              (e.lastSwapFromIdx.current = -1),
              e.setPointerDrag({
                itemId: e.item.id,
                originalIndex: e.items.findIndex((f) => f.id === e.item.id),
                cancelled: !1,
              }),
              e.listEl?.classList.add('is-dragging'),
              window.addEventListener('scroll', s));
          },
          onMove: () => {
            e.lastSwapFromIdx.current = -1;
          },
          onEnd: ({ endEvent: l }) => {
            window.removeEventListener('scroll', s);
            let f = e.pointerDrag;
            if (!f) return;
            let c = l?.type === 'cancel';
            (e.setPointerDrag({ ...f, cancelled: c }),
              c && (Gr(e.itemElements, $t), (e.virtualOrder.current = null)),
              e.listEl?.classList.remove('is-dragging'));
          },
        }),
        { targets: [{ element: window, axis: 'y', padding: { top: 1 / 0, bottom: 1 / 0 } }] },
      ),
      a = () =>
        `sortable-item${e.isDragging ? ' placeholder' : ''}${e.isA11yDragging ? ' a11y-dragging' : ''}`;
    return [
      (() => {
        var l = Ki(),
          f = l.firstChild;
        return (
          je((c) => {
            ((t = c), i(c));
          }, l),
          je((c) => {
            r(c);
          }, f),
          Nn(f, 'draggable', !1),
          Le(f, () => e.item.label),
          Se(() => Vn(l, a())),
          l
        );
      })(),
      Ie(Nr, {
        draggable: o,
        children: ({ sourceElement: l, exiting: f, done: c }) => {
          let u = null;
          return (
            f &&
              u &&
              queueMicrotask(() => {
                if (!u) return;
                let h = u.parentElement,
                  m = l,
                  y = e.pointerDrag,
                  b = m.getAnimations();
                for (let S = 0; S < b.length; S++) b[S].finish();
                let M = h.getBoundingClientRect(),
                  I = m.getBoundingClientRect(),
                  _ = I.left - M.left,
                  C = I.top - M.top,
                  v = y?.cancelled ? $t : rs,
                  w = () => {
                    (m.classList.remove('placeholder'),
                      y?.cancelled || e.onPointerDrop.current(),
                      e.setPointerDrag(null),
                      c());
                  };
                if (Math.abs(_) < 0.5 && Math.abs(C) < 0.5) {
                  w();
                  return;
                }
                let B = h.animate([{ translate: '0px 0px' }, { translate: `${_}px ${C}px` }], {
                  duration: v,
                  easing: 'ease',
                  fill: 'forwards',
                  composite: 'add',
                });
                B.onfinish = w;
              }),
            (() => {
              var h = Qi(),
                m = h.firstChild;
              return (je((y) => (u = y), h), Le(m, () => e.item.label), h);
            })()
          );
        },
      }),
    ];
  }
  function us() {
    let [e, t] = W(
        Array.from({ length: ts }, (S, g) => ({ id: `item-${g}`, label: `Item ${g + 1}` })),
      ),
      n = null,
      r = null,
      i = new Map(),
      s = { current: 0 },
      o = { current: null },
      a = { current: -1 },
      l = !1,
      [f, c] = W(null),
      [u, h] = W(null),
      [m, y] = W(null);
    (O(() => {
      let S = e();
      if (i.size < 2) return;
      let g = Array.from(i.keys()),
        x = i.get(g[0]),
        D = i.get(g[1]);
      x && D && (s.current = D.getBoundingClientRect().top - x.getBoundingClientRect().top);
    }),
      O(() => {
        (e(), ls(i));
      }));
    let b = (S, g) => {
        let x = o.current;
        if (!x || S === g) return;
        let D = Math.min(S, g),
          H = Math.max(S, g),
          G = x.slice(D, H + 1),
          [L] = x.splice(S, 1);
        (x.splice(g, 0, L),
          (l = !0),
          setTimeout(() => {
            l = !1;
          }, Ur),
          as(i, e(), x, s.current, G, !0));
      },
      M = () => {
        let S = o.current;
        S && ((o.current = null), t((g) => S.map((x) => g.find((D) => D.id === x))));
      },
      I = { current: M },
      _ = { current: null },
      C = Vr({
        collisionDetector: cs,
        onCollide: ({ collisions: S }) => {
          let g = f(),
            x = o.current;
          if (!g || !x || l) return;
          let D = _.current;
          for (let H of S) {
            if (H.intersectionScore < is) break;
            let G = D?.droppables.get(H.droppableId);
            if (!G) continue;
            let L = G.data.itemId;
            if (L === g.itemId) continue;
            let te = x.indexOf(g.itemId),
              ue = x.indexOf(L);
            if (!(te === ue || ue === a.current)) {
              ((a.current = te), b(te, ue), D?.updateDroppableClientRects());
              break;
            }
          }
        },
      });
    (O(() => {
      _.current = C();
    }),
      O(() => {
        let S = C();
        if (!S) return;
        let g = S.on('start', () => {
            let D = f();
            D && y(D.itemId);
          }),
          x = S.on('end', () => {
            y(null);
          });
        N(() => {
          (S.off('start', g), S.off('end', x));
        });
      }));
    let v = (S) => {
        let g = e(),
          x = g.findIndex((H) => H.id === S);
        if (x < 0) return;
        let D = g[x];
        ((o.current = g.map((H) => H.id)),
          h({ itemId: S, originalIndex: x, currentIndex: x }),
          Sn(
            r,
            `Picked up ${D.label}. Position ${x + 1} of ${g.length}. Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
          ));
      },
      w = (S) => {
        let g = u(),
          x = o.current;
        if (!g || !x) return;
        let D = g.currentIndex + S;
        if (D < 0 || D >= x.length) return;
        b(g.currentIndex, D);
        let H = { ...g, currentIndex: D };
        (h(H),
          requestAnimationFrame(() => {
            let L = i.get(g.itemId);
            L && L.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }));
        let G = e().find((L) => L.id === g.itemId);
        Sn(r, `${G?.label || ''}, position ${D + 1} of ${x.length}.`);
      },
      B = (S) => {
        let g = u();
        if (!g) return;
        h(null);
        let x = e(),
          D = x.find((L) => L.id === g.itemId);
        (S ? (Gr(i, $t), (o.current = null)) : M(),
          Sn(
            r,
            S
              ? `${D?.label || ''} reorder cancelled. Returned to position ${g.originalIndex + 1}.`
              : `${D?.label || ''} dropped at position ${g.currentIndex + 1} of ${x.length}.`,
          ),
          i.get(g.itemId)?.querySelector('a')?.focus({ preventScroll: !0 }));
      };
    return (
      O(() => {
        let S = (g) => {
          if (u()) {
            switch (g.key) {
              case 'ArrowUp':
                return (g.preventDefault(), w(-1));
              case 'ArrowDown':
                return (g.preventDefault(), w(1));
              case ' ':
              case 'Enter':
                return (g.preventDefault(), B(!1));
              case 'Escape':
                return (g.preventDefault(), B(!0));
            }
            return;
          }
          if (g.shiftKey && (g.key === ' ' || g.key === 'Enter')) {
            let x = g.target.closest('.sortable-item');
            if (!x) return;
            let D = Array.from(i.entries()).find(([, H]) => H === x)?.[0];
            D && (g.preventDefault(), v(D));
          }
        };
        (document.addEventListener('keydown', S),
          N(() => document.removeEventListener('keydown', S)));
      }),
      Ie(It.Provider, {
        value: C,
        get children() {
          return [
            Ji(),
            (() => {
              var S = Zi();
              return (je((g) => (r = g), S), S);
            })(),
            (() => {
              var S = es();
              return (
                je((g) => (n = g), S),
                Le(
                  S,
                  Ie(jt, {
                    get each() {
                      return e();
                    },
                    children: (g) =>
                      Ie(ds, {
                        item: g,
                        get isDragging() {
                          return m() === g.id;
                        },
                        get isA11yDragging() {
                          return u()?.itemId === g.id;
                        },
                        get pointerDrag() {
                          return f();
                        },
                        setPointerDrag: c,
                        lastSwapFromIdx: a,
                        get a11yDrag() {
                          return u();
                        },
                        listEl: n,
                        itemElements: i,
                        get items() {
                          return e();
                        },
                        virtualOrder: o,
                        dndObserver: _,
                        itemStride: s,
                        onPointerDrop: I,
                        virtualSwap: b,
                      }),
                  }),
                ),
                S
              );
            })(),
          ];
        },
      })
    );
  }
  var Kr = document.getElementById('root');
  if (!Kr) throw new Error('Failed to find the root element');
  qn(() => Ie(us, {}), Kr);
})();
