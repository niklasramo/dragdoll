'use strict';
var SolidExample_001_draggable_basic = (() => {
  var Vt = Object.defineProperty;
  var qt = (e, t, n) =>
    t in e ? Vt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => qt(e, typeof t != 'symbol' ? t + '' : t, n);
  var S = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return Ye(this.context.count);
    },
    getNextContextId() {
      return Ye(this.context.count++);
    },
  };
  function Ye(e) {
    let t = String(e),
      n = t.length - 1;
    return S.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Oe(e) {
    S.context = e;
  }
  function jt() {
    return { ...S.context, id: S.getNextContextId(), count: 0 };
  }
  var Ht = !1,
    Wt = (e, t) => e === t,
    Mn = Symbol('solid-proxy');
  var zt = Symbol('solid-track'),
    Pn = Symbol('solid-dev-component'),
    me = { equals: Wt },
    Xe = null,
    tt = ot,
    F = 1,
    ie = 2,
    nt = { owned: null, cleanups: null, context: null, owner: null };
  var g = null,
    h = null,
    se = null,
    J = null,
    v = null,
    C = null,
    k = null,
    ge = 0;
  function ne(e, t) {
    let n = v,
      i = g,
      r = e.length === 0,
      s = t === void 0 ? i : t,
      o = r ? nt : { owned: null, cleanups: null, context: s ? s.context : null, owner: s },
      a = r ? e : () => e(() => H(() => U(o)));
    ((g = o), (v = null));
    try {
      return W(a, !0);
    } finally {
      ((v = n), (g = i));
    }
  }
  function P(e, t) {
    t = t ? Object.assign({}, me, t) : me;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      i = (r) => (
        typeof r == 'function' &&
          (h && h.running && h.sources.has(n) ? (r = r(n.tValue)) : (r = r(n.value))),
        st(n, r)
      );
    return [rt.bind(n), i];
  }
  function G(e, t, n) {
    let i = Ae(e, t, !1, F);
    se && h && h.running ? C.push(i) : oe(i);
  }
  function A(e, t, n) {
    tt = Qt;
    let i = Ae(e, t, !1, F),
      r = ke && Pe(ke);
    (r && (i.suspense = r), (!n || !n.render) && (i.user = !0), k ? k.push(i) : oe(i));
  }
  function x(e, t, n) {
    n = n ? Object.assign({}, me, n) : me;
    let i = Ae(e, t, !0, 0);
    return (
      (i.observers = null),
      (i.observerSlots = null),
      (i.comparator = n.equals || void 0),
      se && h && h.running ? ((i.tState = F), C.push(i)) : oe(i),
      rt.bind(i)
    );
  }
  function H(e) {
    if (!J && v === null) return e();
    let t = v;
    v = null;
    try {
      return J ? J.untrack(e) : e();
    } finally {
      v = t;
    }
  }
  function L(e) {
    return (g === null || (g.cleanups === null ? (g.cleanups = [e]) : g.cleanups.push(e)), e);
  }
  function Ut(e) {
    if (h && h.running) return (e(), h.done);
    let t = v,
      n = g;
    return Promise.resolve().then(() => {
      ((v = t), (g = n));
      let i;
      return (
        (se || ke) &&
          ((i =
            h ||
            (h = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          i.done || (i.done = new Promise((r) => (i.resolve = r))),
          (i.running = !0)),
        W(e, !1),
        (v = g = null),
        i ? i.done : void 0
      );
    });
  }
  var [An, Qe] = P(!1);
  function it(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Jt(n), defaultValue: e };
  }
  function Pe(e) {
    let t;
    return g && g.context && (t = g.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function Gt(e) {
    let t = x(e),
      n = x(() => Me(t()));
    return (
      (n.toArray = () => {
        let i = n();
        return Array.isArray(i) ? i : i != null ? [i] : [];
      }),
      n
    );
  }
  var ke;
  function rt() {
    let e = h && h.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === F) oe(this);
      else {
        let t = C;
        ((C = null), W(() => pe(this), !1), (C = t));
      }
    if (v) {
      let t = this.observers ? this.observers.length : 0;
      (v.sources
        ? (v.sources.push(this), v.sourceSlots.push(t))
        : ((v.sources = [this]), (v.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(v), this.observerSlots.push(v.sources.length - 1))
          : ((this.observers = [v]), (this.observerSlots = [v.sources.length - 1])));
    }
    return e && h.sources.has(this) ? this.tValue : this.value;
  }
  function st(e, t, n) {
    let i = h && h.running && h.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(i, t)) {
      if (h) {
        let r = h.running;
        ((r || (!n && h.sources.has(e))) && (h.sources.add(e), (e.tValue = t)), r || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        W(() => {
          for (let r = 0; r < e.observers.length; r += 1) {
            let s = e.observers[r],
              o = h && h.running;
            (o && h.disposed.has(s)) ||
              ((o ? !s.tState : !s.state) && (s.pure ? C.push(s) : k.push(s), s.observers && at(s)),
              o ? (s.tState = F) : (s.state = F));
          }
          if (C.length > 1e6) throw ((C = []), new Error());
        }, !1);
    }
    return t;
  }
  function oe(e) {
    if (!e.fn) return;
    U(e);
    let t = ge;
    (Ze(e, h && h.running && h.sources.has(e) ? e.tValue : e.value, t),
      h &&
        !h.running &&
        h.sources.has(e) &&
        queueMicrotask(() => {
          W(() => {
            (h && (h.running = !0), (v = g = e), Ze(e, e.tValue, t), (v = g = null));
          }, !1);
        }));
  }
  function Ze(e, t, n) {
    let i,
      r = g,
      s = v;
    v = g = e;
    try {
      i = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (h && h.running
            ? ((e.tState = F), e.tOwned && e.tOwned.forEach(U), (e.tOwned = void 0))
            : ((e.state = F), e.owned && e.owned.forEach(U), (e.owned = null))),
        (e.updatedAt = n + 1),
        Te(o)
      );
    } finally {
      ((v = s), (g = r));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? st(e, i, !0)
        : h && h.running && e.pure
          ? (h.sources.add(e), (e.tValue = i))
          : (e.value = i),
      (e.updatedAt = n));
  }
  function Ae(e, t, n, i = F, r) {
    let s = {
      fn: e,
      state: i,
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
      (h && h.running && ((s.state = 0), (s.tState = i)),
      g === null ||
        (g !== nt &&
          (h && h.running && g.pure
            ? g.tOwned
              ? g.tOwned.push(s)
              : (g.tOwned = [s])
            : g.owned
              ? g.owned.push(s)
              : (g.owned = [s]))),
      J && s.fn)
    ) {
      let [o, a] = P(void 0, { equals: !1 }),
        l = J.factory(s.fn, a);
      L(() => l.dispose());
      let c = () => Ut(a).then(() => f.dispose()),
        f = J.factory(s.fn, c);
      s.fn = (u) => (o(), h && h.running ? f.track(u) : l.track(u));
    }
    return s;
  }
  function re(e) {
    let t = h && h.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === ie) return pe(e);
    if (e.suspense && H(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ge); ) {
      if (t && h.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let i = n.length - 1; i >= 0; i--) {
      if (((e = n[i]), t)) {
        let r = e,
          s = n[i + 1];
        for (; (r = r.owner) && r !== s; ) if (h.disposed.has(r)) return;
      }
      if ((t ? e.tState : e.state) === F) oe(e);
      else if ((t ? e.tState : e.state) === ie) {
        let r = C;
        ((C = null), W(() => pe(e, n[0]), !1), (C = r));
      }
    }
  }
  function W(e, t) {
    if (C) return e();
    let n = !1;
    (t || (C = []), k ? (n = !0) : (k = []), ge++);
    try {
      let i = e();
      return (Yt(n), i);
    } catch (i) {
      (n || (k = null), (C = null), Te(i));
    }
  }
  function Yt(e) {
    if ((C && (se && h && h.running ? Xt(C) : ot(C), (C = null)), e)) return;
    let t;
    if (h) {
      if (!h.promises.size && !h.queue.size) {
        let i = h.sources,
          r = h.disposed;
        (k.push.apply(k, h.effects), (t = h.resolve));
        for (let s of k) ('tState' in s && (s.state = s.tState), delete s.tState);
        ((h = null),
          W(() => {
            for (let s of r) U(s);
            for (let s of i) {
              if (((s.value = s.tValue), s.owned))
                for (let o = 0, a = s.owned.length; o < a; o++) U(s.owned[o]);
              (s.tOwned && (s.owned = s.tOwned), delete s.tValue, delete s.tOwned, (s.tState = 0));
            }
            Qe(!1);
          }, !1));
      } else if (h.running) {
        ((h.running = !1), h.effects.push.apply(h.effects, k), (k = null), Qe(!0));
        return;
      }
    }
    let n = k;
    ((k = null), n.length && W(() => tt(n), !1), t && t());
  }
  function ot(e) {
    for (let t = 0; t < e.length; t++) re(e[t]);
  }
  function Xt(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        i = h.queue;
      i.has(n) ||
        (i.add(n),
        se(() => {
          (i.delete(n),
            W(() => {
              ((h.running = !0), re(n));
            }, !1),
            h && (h.running = !1));
        }));
    }
  }
  function Qt(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let i = e[t];
      i.user ? (e[n++] = i) : re(i);
    }
    if (S.context) {
      if (S.count) {
        (S.effects || (S.effects = []), S.effects.push(...e.slice(0, n)));
        return;
      }
      Oe();
    }
    for (
      S.effects &&
        (S.done || !S.count) &&
        ((e = [...S.effects, ...e]), (n += S.effects.length), delete S.effects),
        t = 0;
      t < n;
      t++
    )
      re(e[t]);
  }
  function pe(e, t) {
    let n = h && h.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let i = 0; i < e.sources.length; i += 1) {
      let r = e.sources[i];
      if (r.sources) {
        let s = n ? r.tState : r.state;
        s === F ? r !== t && (!r.updatedAt || r.updatedAt < ge) && re(r) : s === ie && pe(r, t);
      }
    }
  }
  function at(e) {
    let t = h && h.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let i = e.observers[n];
      (t ? !i.tState : !i.state) &&
        (t ? (i.tState = ie) : (i.state = ie),
        i.pure ? C.push(i) : k.push(i),
        i.observers && at(i));
    }
  }
  function U(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) U(e.tOwned[t]);
      delete e.tOwned;
    }
    if (h && h.running && e.pure) lt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) U(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    h && h.running ? (e.tState = 0) : (e.state = 0);
  }
  function lt(e, t) {
    if ((t || ((e.tState = 0), h.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) lt(e.owned[n]);
  }
  function Zt(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function Je(e, t, n) {
    try {
      for (let i of t) i(e);
    } catch (i) {
      Te(i, (n && n.owner) || null);
    }
  }
  function Te(e, t = g) {
    let n = Xe && t && t.context && t.context[Xe],
      i = Zt(e);
    if (!n) throw i;
    k
      ? k.push({
          fn() {
            Je(i, n, t);
          },
          state: F,
        })
      : Je(i, n, t);
  }
  function Me(e) {
    if (typeof e == 'function' && !e.length) return Me(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let i = Me(e[n]);
        Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
      }
      return t;
    }
    return e;
  }
  function Jt(e, t) {
    return function (i) {
      let r;
      return (
        G(
          () => (r = H(() => ((g.context = { ...g.context, [e]: i.value }), Gt(() => i.children)))),
          void 0,
        ),
        r
      );
    };
  }
  var en = Symbol('fallback');
  function et(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function tn(e, t, n = {}) {
    let i = [],
      r = [],
      s = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      L(() => et(s)),
      () => {
        let l = e() || [],
          c = l.length,
          f,
          u;
        return (
          l[zt],
          H(() => {
            let _, w, E, I, j, p, b, M, R;
            if (c === 0)
              (o !== 0 && (et(s), (s = []), (i = []), (r = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((i = [en]), (r[0] = ne((he) => ((s[0] = he), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (r = new Array(c), u = 0; u < c; u++) ((i[u] = l[u]), (r[u] = ne(m)));
              o = c;
            } else {
              for (
                E = new Array(c),
                  I = new Array(c),
                  a && (j = new Array(c)),
                  p = 0,
                  b = Math.min(o, c);
                p < b && i[p] === l[p];
                p++
              );
              for (b = o - 1, M = c - 1; b >= p && M >= p && i[b] === l[M]; b--, M--)
                ((E[M] = r[b]), (I[M] = s[b]), a && (j[M] = a[b]));
              for (_ = new Map(), w = new Array(M + 1), u = M; u >= p; u--)
                ((R = l[u]), (f = _.get(R)), (w[u] = f === void 0 ? -1 : f), _.set(R, u));
              for (f = p; f <= b; f++)
                ((R = i[f]),
                  (u = _.get(R)),
                  u !== void 0 && u !== -1
                    ? ((E[u] = r[f]), (I[u] = s[f]), a && (j[u] = a[f]), (u = w[u]), _.set(R, u))
                    : s[f]());
              for (u = p; u < c; u++)
                u in E
                  ? ((r[u] = E[u]), (s[u] = I[u]), a && ((a[u] = j[u]), a[u](u)))
                  : (r[u] = ne(m));
              ((r = r.slice(0, (o = c))), (i = l.slice(0)));
            }
            return r;
          })
        );
        function m(_) {
          if (((s[u] = _), a)) {
            let [w, E] = P(u);
            return ((a[u] = E), t(l[u], w));
          }
          return t(l[u]);
        }
      }
    );
  }
  var nn = !1;
  function ae(e, t) {
    if (nn && S.context) {
      let n = S.context;
      Oe(jt());
      let i = H(() => e(t || {}));
      return (Oe(n), i);
    }
    return H(() => e(t || {}));
  }
  function Ie(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return x(tn(() => e.each, e.children, t || void 0));
  }
  var sn = [
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
    Wn = new Set([
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
      ...sn,
    ]);
  function on(e, t, n) {
    let i = n.length,
      r = t.length,
      s = i,
      o = 0,
      a = 0,
      l = t[r - 1].nextSibling,
      c = null;
    for (; o < r || a < s; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[r - 1] === n[s - 1]; ) (r--, s--);
      if (r === o) {
        let f = s < i ? (a ? n[a - 1].nextSibling : n[s - a]) : l;
        for (; a < s; ) e.insertBefore(n[a++], f);
      } else if (s === a) for (; o < r; ) ((!c || !c.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[s - 1] && n[a] === t[r - 1]) {
        let f = t[--r].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--s], f), (t[r] = n[s]));
      } else {
        if (!c) {
          c = new Map();
          let u = a;
          for (; u < s; ) c.set(n[u], u++);
        }
        let f = c.get(t[o]);
        if (f != null)
          if (a < f && f < s) {
            let u = o,
              m = 1,
              _;
            for (; ++u < r && u < s && !((_ = c.get(t[u])) == null || _ !== f + m); ) m++;
            if (m > f - a) {
              let w = t[o];
              for (; a < f; ) e.insertBefore(n[a++], w);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function ut(e, t, n, i = {}) {
    let r;
    return (
      ne((s) => {
        ((r = s), t === document ? e() : Fe(t, e(), t.firstChild ? null : void 0, n));
      }, i.owner),
      () => {
        (r(), (t.textContent = ''));
      }
    );
  }
  function Re(e, t, n, i) {
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
  function ft(e, t) {
    mt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function dt(e, t, n) {
    n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
  }
  function ht(e, t, n) {
    return H(() => e(t, n));
  }
  function Fe(e, t, n, i) {
    if ((n !== void 0 && !i && (i = []), typeof t != 'function')) return ye(e, t, i, n);
    G((r) => ye(e, t(), r, n), i);
  }
  function mt(e) {
    return !!S.context && !S.done && (!e || e.isConnected);
  }
  function ye(e, t, n, i, r) {
    let s = mt(e);
    if (s) {
      !n && (n = [...e.childNodes]);
      let l = [];
      for (let c = 0; c < n.length; c++) {
        let f = n[c];
        f.nodeType === 8 && f.data.slice(0, 2) === '!$' ? f.remove() : l.push(f);
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
          (n = ee(e, n, i, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (s) return n;
      n = ee(e, n, i);
    } else {
      if (o === 'function')
        return (
          G(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = ye(e, l, n, i);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          c = n && Array.isArray(n);
        if (Le(l, t, n, r)) return (G(() => (n = ye(e, l, n, i, !0))), () => n);
        if (s) {
          if (!l.length) return n;
          if (i === void 0) return (n = [...e.childNodes]);
          let f = l[0];
          if (f.parentNode !== e) return n;
          let u = [f];
          for (; (f = f.nextSibling) !== i; ) u.push(f);
          return (n = u);
        }
        if (l.length === 0) {
          if (((n = ee(e, n, i)), a)) return n;
        } else c ? (n.length === 0 ? ct(e, l, i) : on(e, n, l)) : (n && ee(e), ct(e, l));
        n = l;
      } else if (t.nodeType) {
        if (s && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = ee(e, n, i, t));
          ee(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Le(e, t, n, i) {
    let r = !1;
    for (let s = 0, o = t.length; s < o; s++) {
      let a = t[s],
        l = n && n[e.length],
        c;
      if (!(a == null || a === !0 || a === !1))
        if ((c = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) r = Le(e, a, l) || r;
        else if (c === 'function')
          if (i) {
            for (; typeof a == 'function'; ) a = a();
            r = Le(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || r;
          } else (e.push(a), (r = !0));
        else {
          let f = String(a);
          l && l.nodeType === 3 && l.data === f ? e.push(l) : e.push(document.createTextNode(f));
        }
    }
    return r;
  }
  function ct(e, t, n = null) {
    for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
  }
  function ee(e, t, n, i) {
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
  var zn = Symbol();
  var pt = it(() => null);
  function B(e, t) {
    return e === void 0 ? t : typeof e == 'function' ? e() : e;
  }
  var ce = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    le,
    Y = class {
      constructor(e = {}) {
        ((this.dedupe = e.dedupe || ce.ADD),
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
        if (((n = n === le ? this.getId(t) : n), s.has(n)))
          switch (this.dedupe) {
            case ce.THROW:
              throw new Error('Eventti: duplicate listener id!');
            case ce.IGNORE:
              return n;
            case ce.UPDATE: {
              r.l = null;
              break;
            }
            default:
              (s.delete(n), (r.l = null));
          }
        return (s.set(n, t), r.l?.push(t), n);
      }
      once(e, t, n) {
        let i = 0;
        return (
          (n = n === le ? this.getId(t) : n),
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
        if (e === le) {
          this._events.clear();
          return;
        }
        if (t === le) {
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
        if (e === le) {
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
  var an = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: i } = e;
      ((this._phases = t),
        (this._emitter = new Y({ getId: i, dedupe: n })),
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
  function $e(e = 60) {
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
  var gt = class extends an {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: i = $e(), ...r } = e;
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
  var D = { read: Symbol(), write: Symbol() },
    O = new gt({
      phases: [D.read, D.write],
      requestFrame: typeof window < 'u' ? $e() : () => () => {},
    });
  var yt = new WeakMap();
  function Q(e) {
    let t = yt.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), yt.set(e, new WeakRef(t))), t);
  }
  var X = typeof window < 'u' && window.document !== void 0,
    _t = X && 'ontouchstart' in window,
    bt = X && !!window.PointerEvent;
  X &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var y = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  var vt = new WeakMap();
  function V(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = vt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), vt.set(e, new WeakRef(n))), n);
  }
  var ln = typeof window < 'u' && window.document !== void 0,
    Ke = !!(
      ln &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    ue = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    ui = {
      [ue.content]: !1,
      [ue.padding]: !1,
      [ue.scrollbar]: !0,
      [ue.border]: !0,
      [ue.margin]: !0,
    };
  var fi = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function _e(e) {
    switch (V(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function be(e) {
    let t = V(e);
    if (!Ke) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: c } = t;
      if (c && c !== 'none') return !0;
      let { willChange: f } = t;
      if (f && (f.indexOf('filter') > -1 || f.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = _e(e);
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
      ) || !!(Ke && a && a.indexOf('filter') > -1)
    );
  }
  function wt(e) {
    return V(e).position !== 'static' || be(e);
  }
  function xt(e) {
    return e instanceof HTMLHtmlElement;
  }
  function Ne(e, t = {}) {
    if (xt(e)) return e.ownerDocument.defaultView;
    let n = t.position || V(e).position,
      { skipDisplayNone: i, container: r } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let s = r || e.parentElement;
        for (; s; ) {
          let o = _e(s);
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
          let a = s ? be(o) : wt(o);
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
  function St(e) {
    return e instanceof Window;
  }
  function Be(e, t = {}) {
    let n = V(e),
      { display: i } = n;
    if (i === 'none' || i === 'contents') return null;
    let r = t.position || V(e).position,
      { skipDisplayNone: s, container: o } = t;
    switch (r) {
      case 'relative':
        return e;
      case 'fixed':
        return Ne(e, { container: o, position: r, skipDisplayNone: s });
      case 'absolute': {
        let a = Ne(e, { container: o, position: r, skipDisplayNone: s });
        return St(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function cn(e, t) {
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
  function Ve(e) {
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
  function Et(e, t, n = null) {
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
  function Se(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function ve(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Ct = class {
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
    kt = class {
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
          (this.startEvent = t),
          (this.prevMoveEvent = t),
          (this.moveEvent = t),
          (this.endEvent = null),
          (this.items = []),
          (this.isEnded = !1),
          (this._matrixCache = new Ct()),
          (this._clientOffsetCache = new Ct()));
      }
    };
  function un(e, t, n = !1) {
    let { style: i } = e;
    for (let r in t) i.setProperty(r, t[r], n ? 'important' : '');
  }
  function fn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      un(
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
  function fe(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: i } = e.getBoundingClientRect(),
      r = Q(e);
    return (
      (t.x = n + (parseFloat(r.borderLeftWidth) || 0)),
      (t.y = i + (parseFloat(r.borderTopWidth) || 0)),
      t
    );
  }
  function dn(e) {
    let t = Q(e),
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
  function hn(e) {
    let t = Q(e),
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
  function Mt(e, t = !1) {
    let { translate: n, rotate: i, scale: r, transform: s } = Q(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', c] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * hn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * dn(e)}px`),
        c ? (o += `translate3d(${a},${l},${c})`) : (o += `translate(${a},${l})`));
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
  function Dt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var mn = { x: 0, y: 0 },
    pn = { x: 0, y: 0 };
  function gn(e, t, n = { x: 0, y: 0 }) {
    let i = Dt(e) ? e : fe(e, mn),
      r = Dt(t) ? t : fe(t, pn);
    return ((n.x = r.x - i.x), (n.y = r.y - i.y), n);
  }
  function Pt(e) {
    let t = e.split(' '),
      n = '',
      i = '',
      r = '';
    return (
      t.length === 1 ? (n = i = t[0]) : t.length === 2 ? ([n, i] = t) : ([n, i, r] = t),
      { x: parseFloat(n) || 0, y: parseFloat(i) || 0, z: parseFloat(r) || 0 }
    );
  }
  var Z = X ? new DOMMatrix() : null;
  function yn(e, t = new DOMMatrix()) {
    let n = e;
    for (Se(t); n; ) {
      let i = Mt(n);
      if (i && (Z.setMatrixValue(i), !Z.isIdentity)) {
        let { transformOrigin: r } = Q(n),
          { x: s, y: o, z: a } = Pt(r);
        (a === 0
          ? Z.setMatrixValue(`translate(${s}px,${o}px) ${Z} translate(${s * -1}px,${o * -1}px)`)
          : Z.setMatrixValue(
              `translate3d(${s}px,${o}px,${a}px) ${Z} translate3d(${s * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(Z));
      }
      n = n.parentElement;
    }
    return t;
  }
  var we = X ? fn() : null,
    At = class {
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
        let i = Q(e),
          r = e.getBoundingClientRect(),
          s = Mt(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Pt(i.transformOrigin)),
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
          let { position: u } = i;
          if (u !== 'fixed' && u !== 'absolute')
            throw Error(
              `Dragged element has "${u}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let c = Be(e) || e;
        ((this.elementOffsetContainer = c),
          (this.dragOffsetContainer = l === o ? c : Be(e, { container: l })));
        {
          let { width: u, height: m, x: _, y: w } = r;
          this.clientRect = { width: u, height: m, x: _, y: w };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let f = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: i });
        if (Array.isArray(f))
          if (f.length) {
            let u = {};
            for (let m of f) u[m] = i[m];
            this.frozenStyles = u;
          } else this.frozenStyles = null;
        else this.frozenStyles = f;
        if (this.frozenStyles) {
          let u = {};
          for (let m in this.frozenStyles) u[m] = e.style[m];
          this.unfrozenStyles = u;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, i] = t;
            (yn(e, n), i.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
          ].map(([c, f]) => {
            let u = s.get(f) || { x: 0, y: 0 };
            if (!s.isValid(f)) {
              let m = o.get(c);
              f instanceof HTMLElement && m && !m[0].isIdentity
                ? Ve(m[0])
                  ? (we.style.setProperty('transform', m[1].toString(), 'important'),
                    f.append(we),
                    fe(we, u),
                    we.remove())
                  : (fe(f, u), (u.x -= m[0].m41), (u.y -= m[0].m42))
                : fe(f, u);
            }
            return (s.set(f, u), u);
          });
          gn(a, l, r);
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
    Ot = { capture: !0, passive: !0 },
    _n = { x: 0, y: 0 },
    q = X ? new DOMMatrix() : null,
    xe = X ? new DOMMatrix() : null,
    $ = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })($ || {}),
    K = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(K || {}),
    Ee = { Start: 'start', Move: 'move', End: 'end' },
    de = { Immediate: 'immediate', Sampled: 'sampled' },
    z = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    T = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    Tt = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === z.End || t === z.EndAlign,
          [i, r] = e.getContainerMatrix(),
          [s, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: c,
            elementTransformMatrix: f,
            elementTransformOrigin: u,
            elementOffsetMatrix: m,
          } = e,
          { x: _, y: w, z: E } = u,
          I = !f.isIdentity && (_ !== 0 || w !== 0 || E !== 0),
          j = a.x + l.x + c.x,
          p = a.y + l.y + c.y;
        (Se(q),
          I && (E === 0 ? q.translateSelf(-_, -w) : q.translateSelf(-_, -w, -E)),
          n ? r.isIdentity || q.multiplySelf(r) : o.isIdentity || q.multiplySelf(o),
          Se(xe).translateSelf(j, p),
          q.multiplySelf(xe),
          i.isIdentity || q.multiplySelf(i),
          I && (Se(xe).translateSelf(_, w, E), q.multiplySelf(xe)),
          f.isIdentity || q.multiplySelf(f),
          m.isIdentity || q.preMultiplySelf(m),
          (e.element.style.transform = `${q}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: de.Sampled,
      dndGroups: new Set(),
    },
    qe = class {
      constructor(e, t = {}) {
        d(this, 'id');
        d(this, 'sensors');
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
        let { id: n = Symbol(), ...i } = t;
        ((this.id = n),
          (this.sensors = e),
          (this.settings = this._parseSettings(i)),
          (this.plugins = {}),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._sensorData = new Map()),
          (this._emitter = new Y()),
          (this._startPhase = $.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._onMove = this._onMove.bind(this)),
          (this._onScroll = this._onScroll.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          (this._prepareStart = this._prepareStart.bind(this)),
          (this._applyStart = this._applyStart.bind(this)),
          (this._prepareMove = this._prepareMove.bind(this)),
          (this._applyMove = this._applyMove.bind(this)),
          (this._prepareAlign = this._prepareAlign.bind(this)),
          (this._applyAlign = this._applyAlign.bind(this)),
          this.sensors.forEach((r) => {
            this._sensorData.set(r, {
              predicateState: K.Pending,
              predicateEvent: null,
              onMove: (a) => this._onMove(a, r),
              onEnd: (a) => this._onEnd(a, r),
            });
            let { onMove: s, onEnd: o } = this._sensorData.get(r);
            (r.on(y.Start, s, s),
              r.on(y.Move, s, s),
              r.on(y.Cancel, o, o),
              r.on(y.End, o, o),
              r.on(y.Destroy, o, o));
          }));
      }
      _parseSettings(e, t = Tt) {
        let {
          container: n = t.container,
          startPredicate: i = t.startPredicate,
          elements: r = t.elements,
          frozenStyles: s = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: c = t.sensorProcessingMode,
          dndGroups: f = t.dndGroups,
          onPrepareStart: u = t.onPrepareStart,
          onStart: m = t.onStart,
          onPrepareMove: _ = t.onPrepareMove,
          onMove: w = t.onMove,
          onEnd: E = t.onEnd,
          onDestroy: I = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: i,
          elements: r,
          frozenStyles: s,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: l,
          sensorProcessingMode: c,
          dndGroups: f,
          onPrepareStart: u,
          onStart: m,
          onPrepareMove: _,
          onMove: w,
          onEnd: E,
          onDestroy: I,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case K.Pending: {
              n.predicateEvent = e;
              let i = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              i === !0 ? this.resolveStartPredicate(t) : i === !1 && this.rejectStartPredicate(t);
              break;
            }
            case K.Resolved:
              this.drag &&
                ((this.drag.moveEvent = e),
                this.settings.sensorProcessingMode === de.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (O.once(D.read, this._prepareMove, this._moveId),
                    O.once(D.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === K.Resolved &&
              ((this.drag.endEvent = e),
              this._sensorData.forEach((i) => {
                ((i.predicateState = K.Pending), (i.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = K.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== $.Init ||
          ((this._startPhase = $.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new At(t, this),
          )),
          this._applyModifiers(Ee.Start, 0, 0),
          this._emit(T.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = $.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== $.FinishPrepare)) {
          this._startPhase = $.Apply;
          for (let t of e.items)
            (t.dragContainer !== t.elementContainer && Et(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: z.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              i = t.getDragContainerMatrix()[0];
            if (cn(n, i) || (!Ve(n) && !Ve(i))) continue;
            let r = t.element.getBoundingClientRect(),
              { alignmentOffset: s } = t;
            ((s.x += ve(t.clientRect.x - r.x, 3)), (s.y += ve(t.clientRect.y - r.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: z.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Ot),
            this._emit(T.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = $.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e;
        t !== n &&
          (this._applyModifiers(Ee.Move, t.x - n.x, t.y - n.y),
          this._emit(T.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && (e.prevMoveEvent = t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: z.Move, draggable: this, drag: e, item: t }));
          (this._emit(T.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: z.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: i } = this;
        if (!i) return;
        let { positionModifiers: r } = this.settings;
        for (let s of i.items) {
          let o = _n;
          ((o.x = t), (o.y = n));
          for (let a of r) o = a(o, { draggable: this, drag: i, item: s, phase: e });
          ((s.position.x += o.x),
            (s.position.y += o.y),
            (s.clientRect.x += o.x),
            (s.clientRect.y += o.y),
            e === 'move' && ((s._moveDiff.x += o.x), (s._moveDiff.y += o.y)));
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
        n.predicateState === K.Pending &&
          i &&
          ((this._startPhase = $.Init),
          (n.predicateState = K.Resolved),
          (n.predicateEvent = null),
          (this.drag = new kt(e, i)),
          this._sensorData.forEach((r, s) => {
            s !== e && ((r.predicateState = K.Rejected), (r.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === de.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (O.once(D.read, this._prepareStart, this._startId),
              O.once(D.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === K.Pending &&
          ((t.predicateState = K.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          if (this._startPhase === $.Prepare || this._startPhase === $.Apply)
            throw Error('Cannot stop drag start process at this point');
          ((e.isEnded = !0),
            this._prepareStart(),
            this._applyStart(),
            (this._startPhase = $.None),
            O.off(D.read, this._startId),
            O.off(D.write, this._startId),
            O.off(D.read, this._moveId),
            O.off(D.write, this._moveId),
            O.off(D.read, this._alignId),
            O.off(D.write, this._alignId),
            window.removeEventListener('scroll', this._onScroll, Ot),
            this._applyModifiers(Ee.End, 0, 0));
          for (let t of e.items) {
            if (
              (t.elementContainer !== t.dragContainer &&
                (Et(t.elementContainer, t.element),
                (t.alignmentOffset.x = 0),
                (t.alignmentOffset.y = 0),
                (t.containerOffset.x = 0),
                (t.containerOffset.y = 0)),
              t.unfrozenStyles)
            )
              for (let n in t.unfrozenStyles) t.element.style[n] = t.unfrozenStyles[n] || '';
            this.settings.applyPosition({ phase: z.End, draggable: this, drag: e, item: t });
          }
          for (let t of e.items)
            if (t.elementContainer !== t.dragContainer) {
              let n = t.element.getBoundingClientRect();
              ((t.alignmentOffset.x = ve(t.clientRect.x - n.x, 3)),
                (t.alignmentOffset.y = ve(t.clientRect.y - n.y, 3)));
            }
          for (let t of e.items)
            t.elementContainer !== t.dragContainer &&
              (t.alignmentOffset.x !== 0 || t.alignmentOffset.y !== 0) &&
              this.settings.applyPosition({ phase: z.EndAlign, draggable: this, drag: e, item: t });
          (this._emit(T.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        }
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === de.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (O.once(D.read, this._prepareAlign, this._alignId),
              O.once(D.write, this._applyAlign, this._alignId)));
      }
      getClientRect() {
        let { drag: e, settings: t } = this;
        return (e && t.computeClientRect?.({ draggable: this, drag: e })) || null;
      }
      updateSettings(e) {
        this.settings = this._parseSettings(e, this.settings);
      }
      use(e) {
        return e(this);
      }
      destroy() {
        this.isDestroyed ||
          ((this.isDestroyed = !0),
          this.stop(),
          this._sensorData.forEach(({ onMove: e, onEnd: t }, n) => {
            (n.off(y.Start, e),
              n.off(y.Move, e),
              n.off(y.Cancel, t),
              n.off(y.End, t),
              n.off(y.Destroy, t));
          }),
          this._sensorData.clear(),
          this._emit(T.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  function It() {
    return Pe(pt);
  }
  var bn = Object.prototype.hasOwnProperty,
    Lt = (e) => {
      if (typeof e != 'object' || !e) return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function Ce(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      i = Array.isArray(t);
    if (n || i) {
      if (!n || !i) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let c = 0; c < l; c++) if (!Ce(e[c], t[c])) return !1;
      return !0;
    }
    let r = e instanceof Set,
      s = t instanceof Set;
    if (r || s) {
      if (!r || !s || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!Lt(e) || !Lt(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let c = o[l];
      if (!bn.call(t, c) || !Ce(e[c], t[c])) return !1;
    }
    return !0;
  }
  function je(e, t) {
    let n = x(() => e.map((p) => B(p)).filter(Boolean)),
      i = x(() => B(t)),
      r = x(() => i()?.id),
      s = x(() => i()?.dndObserver),
      o = x(() => {
        let p = i();
        if (!p) return;
        let { dndObserver: b, id: M, ...R } = p;
        return R;
      }),
      a = x(() => o() || {}),
      l = It(),
      c = x(() => {
        let p = s();
        return p === void 0 ? l() : p;
      }),
      [f, u] = P(null),
      m = null,
      _ = r(),
      w = a(),
      E = c(),
      I = () => {
        m && (m.destroy(), (m = null), u(null));
      },
      j = () => {
        I();
        let p = n();
        if (!p.length) return;
        let b = a(),
          M = r(),
          R = new qe(p, { id: M, ...b }),
          he = c();
        (he?.addDraggables([R]), (m = R), (_ = M), (w = b), (E = he), u(R));
      };
    return (
      A(() => {
        let p = n();
        if (!p.length) {
          I();
          return;
        }
        let b = m;
        if (!b) {
          j();
          return;
        }
        (p.length !== b.sensors.length || p.some((M) => !b.sensors.includes(M))) && j();
      }),
      A(() => {
        if (!m) return;
        let p = r();
        _ !== p && j();
      }),
      A(() => {
        let p = c();
        if (E === p) return;
        let b = m;
        (b && (E?.removeDraggables([b]), p?.addDraggables([b])), (E = p));
      }),
      A(() => {
        let p = m;
        if (!p) return;
        let b = a();
        Ce(w, b) || (p.updateSettings(p._parseSettings(b)), (w = b));
      }),
      L(I),
      f
    );
  }
  function He(e, t = !1) {
    let n = x(() => B(e)),
      [i, r] = P(null),
      [s, o] = P(0);
    return (
      A(() => {
        let a = n();
        if ((r(a?.drag || null), !a)) return;
        let l = a.on(T.Start, () => {
            r(a.drag || null);
          }),
          c = null;
        t &&
          (c = a.on(T.Move, () => {
            a.drag && o((u) => (u + 1) % (2 ** 53 - 1));
          }));
        let f = a.on(T.End, () => {
          r(null);
        });
        L(() => {
          (a.off(T.Start, l), c && a.off(T.Move, c), a.off(T.End, f));
        });
      }),
      x(() => (s(), i()))
    );
  }
  var Rt = class {
    constructor() {
      d(this, 'drag');
      d(this, 'isDestroyed');
      d(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new Y()));
    }
    _createDragData(e) {
      return { x: e.x, y: e.y };
    }
    _updateDragData(e) {
      this.drag && ((this.drag.x = e.x), (this.drag.y = e.y));
    }
    _resetDragData() {
      this.drag = null;
    }
    _start(e) {
      this.isDestroyed ||
        this.drag ||
        ((this.drag = this._createDragData(e)), this._emitter.emit(y.Start, e));
    }
    _move(e) {
      this.drag && (this._updateDragData(e), this._emitter.emit(y.Move, e));
    }
    _end(e) {
      this.drag && (this._updateDragData(e), this._emitter.emit(y.End, e), this._resetDragData());
    }
    _cancel(e) {
      this.drag &&
        (this._updateDragData(e), this._emitter.emit(y.Cancel, e), this._resetDragData());
    }
    on(e, t, n) {
      return this._emitter.on(e, t, n);
    }
    off(e, t) {
      this._emitter.off(e, t);
    }
    cancel() {
      this.drag && this._cancel({ type: y.Cancel, x: this.drag.x, y: this.drag.y });
    }
    destroy() {
      this.isDestroyed ||
        ((this.isDestroyed = !0),
        this.cancel(),
        this._emitter.emit(y.Destroy, { type: y.Destroy }),
        this._emitter.off());
    }
  };
  var Ft = class extends Rt {
    constructor() {
      super();
      d(this, 'drag');
      d(this, '_direction');
      d(this, '_speed');
      ((this.drag = null),
        (this._direction = { x: 0, y: 0 }),
        (this._speed = 0),
        (this._tick = this._tick.bind(this)));
    }
    _createDragData(t) {
      return { ...super._createDragData(t), time: 0, deltaTime: 0 };
    }
    _start(t) {
      this.isDestroyed || this.drag || (super._start(t), O.on(D.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (O.off(D.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (O.off(D.read, this._tick), super._cancel(t));
    }
    _tick(t) {
      if (this.drag)
        if (t && this.drag.time) {
          ((this.drag.deltaTime = t - this.drag.time), (this.drag.time = t));
          let n = { type: 'tick', time: this.drag.time, deltaTime: this.drag.deltaTime };
          if ((this._emitter.emit('tick', n), !this.drag)) return;
          let i = this._speed * (this.drag.deltaTime / 1e3),
            r = this._direction.x * i,
            s = this._direction.y * i;
          (r || s) && this._move({ type: y.Move, x: this.drag.x + r, y: this.drag.y + s });
        } else ((this.drag.time = t), (this.drag.deltaTime = 0));
    }
  };
  var vn = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function De(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let i of e) {
      let r = t.get(i);
      r !== void 0 && r < n && (n = r);
    }
    return n;
  }
  var N = {
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
    We = class extends Ft {
      constructor(t, n = {}) {
        super();
        d(this, 'element');
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
          startPredicate: i = N.startPredicate,
          computeSpeed: r = N.computeSpeed,
          cancelOnVisibilityChange: s = N.cancelOnVisibilityChange,
          cancelOnBlur: o = N.cancelOnBlur,
          startKeys: a = N.startKeys,
          moveLeftKeys: l = N.moveLeftKeys,
          moveRightKeys: c = N.moveRightKeys,
          moveUpKeys: f = N.moveUpKeys,
          moveDownKeys: u = N.moveDownKeys,
          cancelKeys: m = N.cancelKeys,
          endKeys: _ = N.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(m)),
          (this._endKeys = new Set(_)),
          (this._moveLeftKeys = new Set(l)),
          (this._moveRightKeys = new Set(c)),
          (this._moveUpKeys = new Set(f)),
          (this._moveDownKeys = new Set(u)),
          (this._moveKeys = new Set([...l, ...c, ...f, ...u])),
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
        let t = De(this._moveLeftKeys, this._moveKeyTimestamps),
          n = De(this._moveRightKeys, this._moveKeyTimestamps),
          i = De(this._moveUpKeys, this._moveKeyTimestamps),
          r = De(this._moveDownKeys, this._moveKeyTimestamps),
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
            n && (t.preventDefault(), this._start({ type: y.Start, x: n.x, y: n.y }));
          }
          return;
        }
        if (this._cancelKeys.has(t.key)) {
          (t.preventDefault(), this._internalCancel());
          return;
        }
        if (this._endKeys.has(t.key)) {
          (t.preventDefault(), this._end({ type: y.End, x: this.drag.x, y: this.drag.y }));
          return;
        }
        if (this._moveKeys.has(t.key)) {
          (t.preventDefault(),
            this._moveKeyTimestamps.get(t.key) ||
              (this._moveKeyTimestamps.set(t.key, Date.now()), this._updateDirection()));
          return;
        }
      }
      updateSettings(t) {
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
          vn.forEach((a, l) => {
            let c = `${a}Keys`,
              f = t[c];
            f !== void 0 && ((this[`_${c}`] = new Set(f)), l >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          [...this._moveKeys].every((l, c) => a[c] === l) ||
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
  function ze(e = {}, t) {
    let n = x(() => B(e, {}) || {}),
      i = x(() => (t === void 0 ? void 0 : B(t))),
      [r, s] = P(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (c) => {
        o?.destroy();
        let f = new We(c, n());
        ((o = f), s(f));
      };
    return (
      A(() => {
        let c = o;
        c && c.updateSettings(n());
      }),
      A(() => {
        let c = i();
        c !== void 0 && (l(c), L(a));
      }),
      L(a),
      [
        r,
        (c) => {
          if (t === void 0) {
            if (c === null) {
              a();
              return;
            }
            o?.element !== c && l(c);
          }
        },
      ]
    );
  }
  function $t(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function wn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function xn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Kt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function Nt(e) {
    return e === 'auto' || e === void 0 ? (bt ? 'pointer' : _t ? 'touch' : 'mouse') : e;
  }
  var te = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    Ue = class {
      constructor(e, t = {}) {
        d(this, 'element');
        d(this, 'drag');
        d(this, 'isDestroyed');
        d(this, '_startPredicate');
        d(this, '_listenerOptions');
        d(this, '_sourceEvents');
        d(this, '_areWindowListenersBound');
        d(this, '_emitter');
        let {
          listenerOptions: n = {},
          sourceEvents: i = 'auto',
          startPredicate: r = (s) => !('button' in s && s.button > 0),
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._startPredicate = r),
          (this._listenerOptions = Kt(n)),
          (this._sourceEvents = Nt(i)),
          (this._emitter = new Y()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(te[this._sourceEvents].start, this._onStart, this._listenerOptions));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? $t(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (this.isDestroyed || this.drag || !this._startPredicate(e)) return;
        let t = wn(e);
        if (t === null) return;
        let n = $t(e, t);
        if (n === null) return;
        let i = { pointerId: t, pointerType: xn(e), x: n.clientX, y: n.clientY };
        this.drag = i;
        let r = { ...i, type: y.Start, srcEvent: e, target: n.target };
        (this._emitter.emit(r.type, r), this.drag && this._bindWindowListeners());
      }
      _onMove(e) {
        if (!this.drag) return;
        let t = this._getTrackedPointerEventData(e);
        if (!t) return;
        ((this.drag.x = t.clientX), (this.drag.y = t.clientY));
        let n = { type: y.Move, srcEvent: e, target: t.target, ...this.drag };
        this._emitter.emit(n.type, n);
      }
      _onCancel(e) {
        if (!this.drag) return;
        let t = this._getTrackedPointerEventData(e);
        if (!t) return;
        ((this.drag.x = t.clientX), (this.drag.y = t.clientY));
        let n = { type: y.Cancel, srcEvent: e, target: t.target, ...this.drag };
        (this._emitter.emit(n.type, n), this._resetDrag());
      }
      _onEnd(e) {
        if (!this.drag) return;
        let t = this._getTrackedPointerEventData(e);
        if (!t) return;
        ((this.drag.x = t.clientX), (this.drag.y = t.clientY));
        let n = { type: y.End, srcEvent: e, target: t.target, ...this.drag };
        (this._emitter.emit(n.type, n), this._resetDrag());
      }
      _bindWindowListeners() {
        if (this._areWindowListenersBound) return;
        let { move: e, end: t, cancel: n } = te[this._sourceEvents];
        (window.addEventListener(e, this._onMove, this._listenerOptions),
          window.addEventListener(t, this._onEnd, this._listenerOptions),
          n && window.addEventListener(n, this._onCancel, this._listenerOptions),
          (this._areWindowListenersBound = !0));
      }
      _unbindWindowListeners() {
        if (this._areWindowListenersBound) {
          let { move: e, end: t, cancel: n } = te[this._sourceEvents];
          (window.removeEventListener(e, this._onMove, this._listenerOptions),
            window.removeEventListener(t, this._onEnd, this._listenerOptions),
            n && window.removeEventListener(n, this._onCancel, this._listenerOptions),
            (this._areWindowListenersBound = !1));
        }
      }
      _resetDrag() {
        ((this.drag = null), this._unbindWindowListeners());
      }
      cancel() {
        if (!this.drag) return;
        let e = { type: y.Cancel, srcEvent: null, target: null, ...this.drag };
        (this._emitter.emit(e.type, e), this._resetDrag());
      }
      updateSettings(e) {
        if (this.isDestroyed) return;
        let { listenerOptions: t, sourceEvents: n, startPredicate: i } = e,
          r = Nt(n),
          s = Kt(t);
        (i && this._startPredicate !== i && (this._startPredicate = i),
          ((t &&
            (this._listenerOptions.capture !== s.capture ||
              this._listenerOptions.passive === s.passive)) ||
            (n && this._sourceEvents !== r)) &&
            (this.element.removeEventListener(
              te[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = r),
            t && s && (this._listenerOptions = s),
            this.element.addEventListener(
              te[this._sourceEvents].start,
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
      destroy() {
        this.isDestroyed ||
          ((this.isDestroyed = !0),
          this.cancel(),
          this._emitter.emit(y.Destroy, { type: y.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            te[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ));
      }
    };
  function Ge(e = {}, t) {
    let n = x(() => B(e, {}) || {}),
      i = x(() => (t === void 0 ? void 0 : B(t))),
      [r, s] = P(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (c) => {
        o?.destroy();
        let f = new Ue(c, n());
        ((o = f), s(f));
      };
    return (
      A(() => {
        let c = o;
        c && c.updateSettings(n());
      }),
      A(() => {
        let c = i();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), L(a));
        }
      }),
      L(a),
      [
        r,
        (c) => {
          if (t === void 0) {
            if (!c) {
              a();
              return;
            }
            o?.element !== c && l(c);
          }
        },
      ]
    );
  }
  var Sn = Re(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    En = Re('<div class=card-grid>');
  function Cn(e) {
    let t = null,
      [n, i] = Ge(),
      [r, s] = ze(),
      [o, a] = P(1),
      l = je([n, r], () => ({
        elements: () => (t ? [t] : []),
        onStart: () => {
          a(e.nextZIndex());
        },
      })),
      c = He(l),
      f = (u) => {
        ((t = u), i(u), s(u));
      };
    return (() => {
      var u = Sn();
      return (
        ht(f, u),
        G(
          (m) => {
            var _ = `card draggable ${c() ? 'dragging' : ''}`,
              w = o();
            return (_ !== m.e && ft(u, (m.e = _)), w !== m.t && dt(u, 'z-index', (m.t = w)), m);
          },
          { e: void 0, t: void 0 },
        ),
        u
      );
    })();
  }
  var Dn = [0, 1, 2, 3];
  function On() {
    let e = 1,
      t = () => ++e;
    return (() => {
      var n = En();
      return (Fe(n, ae(Ie, { each: Dn, children: () => ae(Cn, { nextZIndex: t }) })), n);
    })();
  }
  var Bt = document.getElementById('root');
  if (!Bt) throw new Error('Failed to find the root element');
  ut(() => ae(On, {}), Bt);
})();
