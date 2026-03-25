'use strict';
var SolidExample_013_draggable_multi_drag_preview = (() => {
  var Dn = Object.defineProperty;
  var Cn = (e, t, n) =>
    t in e ? Dn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var f = (e, t, n) => Cn(e, typeof t != 'symbol' ? t + '' : t, n);
  var C = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return St(this.context.count);
    },
    getNextContextId() {
      return St(this.context.count++);
    },
  };
  function St(e) {
    let t = String(e),
      n = t.length - 1;
    return C.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Ye(e) {
    C.context = e;
  }
  function On() {
    return { ...C.context, id: C.getNextContextId(), count: 0 };
  }
  var Mn = !1,
    Pn = (e, t) => e === t;
  var kn = Symbol('solid-track');
  var ke = { equals: Pn },
    xt = null,
    Ot = Lt,
    V = 1,
    ye = 2,
    Mt = { owned: null, cleanups: null, context: null, owner: null };
  var _ = null,
    h = null,
    _e = null,
    ue = null,
    w = null,
    M = null,
    R = null,
    Ae = 0;
  function oe(e, t) {
    let n = w,
      r = _,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? Mt : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => $(() => te(o)));
    ((_ = o), (w = null));
    try {
      return Q(a, !0);
    } finally {
      ((w = n), (_ = r));
    }
  }
  function F(e, t) {
    t = t ? Object.assign({}, ke, t) : ke;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (h && h.running && h.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        At(n, s)
      );
    return [Tt.bind(n), r];
  }
  function ne(e, t, n) {
    let r = ze(e, t, !1, V);
    _e && h && h.running ? M.push(r) : be(r);
  }
  function P(e, t, n) {
    Ot = Rn;
    let r = ze(e, t, !1, V),
      s = Xe && Ue(Xe);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), R ? R.push(r) : be(r));
  }
  function E(e, t, n) {
    n = n ? Object.assign({}, ke, n) : ke;
    let r = ze(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      _e && h && h.running ? ((r.tState = V), M.push(r)) : be(r),
      Tt.bind(r)
    );
  }
  function Pt(e) {
    return Q(e, !1);
  }
  function $(e) {
    if (!ue && w === null) return e();
    let t = w;
    w = null;
    try {
      return ue ? ue.untrack(e) : e();
    } finally {
      w = t;
    }
  }
  function A(e) {
    return (_ === null || (_.cleanups === null ? (_.cleanups = [e]) : _.cleanups.push(e)), e);
  }
  function Tn(e) {
    if (h && h.running) return (e(), h.done);
    let t = w,
      n = _;
    return Promise.resolve().then(() => {
      ((w = t), (_ = n));
      let r;
      return (
        (_e || Xe) &&
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
        (w = _ = null),
        r ? r.done : void 0
      );
    });
  }
  var [pr, wt] = F(!1);
  function kt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: $n(n), defaultValue: e };
  }
  function Ue(e) {
    let t;
    return _ && _.context && (t = _.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function An(e) {
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
  var Xe;
  function Tt() {
    let e = h && h.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === V) be(this);
      else {
        let t = M;
        ((M = null), Q(() => Te(this), !1), (M = t));
      }
    if (w) {
      let t = this.observers ? this.observers.length : 0;
      (w.sources
        ? (w.sources.push(this), w.sourceSlots.push(t))
        : ((w.sources = [this]), (w.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(w), this.observerSlots.push(w.sources.length - 1))
          : ((this.observers = [w]), (this.observerSlots = [w.sources.length - 1])));
    }
    return e && h.sources.has(this) ? this.tValue : this.value;
  }
  function At(e, t, n) {
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
              ((o ? !i.tState : !i.state) && (i.pure ? M.push(i) : R.push(i), i.observers && It(i)),
              o ? (i.tState = V) : (i.state = V));
          }
          if (M.length > 1e6) throw ((M = []), new Error());
        }, !1);
    }
    return t;
  }
  function be(e) {
    if (!e.fn) return;
    te(e);
    let t = Ae;
    (Et(e, h && h.running && h.sources.has(e) ? e.tValue : e.value, t),
      h &&
        !h.running &&
        h.sources.has(e) &&
        queueMicrotask(() => {
          Q(() => {
            (h && (h.running = !0), (w = _ = e), Et(e, e.tValue, t), (w = _ = null));
          }, !1);
        }));
  }
  function Et(e, t, n) {
    let r,
      s = _,
      i = w;
    w = _ = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (h && h.running
            ? ((e.tState = V), e.tOwned && e.tOwned.forEach(te), (e.tOwned = void 0))
            : ((e.state = V), e.owned && e.owned.forEach(te), (e.owned = null))),
        (e.updatedAt = n + 1),
        Ge(o)
      );
    } finally {
      ((w = i), (_ = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? At(e, r, !0)
        : h && h.running && e.pure
          ? (h.sources.has(e) || (e.value = r), h.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function ze(e, t, n, r = V, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: _,
      context: _ ? _.context : null,
      pure: n,
    };
    if (
      (h && h.running && ((i.state = 0), (i.tState = r)),
      _ === null ||
        (_ !== Mt &&
          (h && h.running && _.pure
            ? _.tOwned
              ? _.tOwned.push(i)
              : (_.tOwned = [i])
            : _.owned
              ? _.owned.push(i)
              : (_.owned = [i]))),
      ue && i.fn)
    ) {
      let o = i.fn,
        [a, c] = F(void 0, { equals: !1 }),
        u = ue.factory(o, c);
      A(() => u.dispose());
      let l,
        d = () =>
          Tn(c).then(() => {
            l && (l.dispose(), (l = void 0));
          });
      i.fn = (g) => (a(), h && h.running ? (l || (l = ue.factory(o, d)), l.track(g)) : u.track(g));
    }
    return i;
  }
  function ve(e) {
    let t = h && h.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === ye) return Te(e);
    if (e.suspense && $(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Ae); ) {
      if (t && h.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (h.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === V) be(e);
      else if ((t ? e.tState : e.state) === ye) {
        let s = M;
        ((M = null), Q(() => Te(e, n[0]), !1), (M = s));
      }
    }
  }
  function Q(e, t) {
    if (M) return e();
    let n = !1;
    (t || (M = []), R ? (n = !0) : (R = []), Ae++);
    try {
      let r = e();
      return (Ln(n), r);
    } catch (r) {
      (n || (R = null), (M = null), Ge(r));
    }
  }
  function Ln(e) {
    if ((M && (_e && h && h.running ? In(M) : Lt(M), (M = null)), e)) return;
    let t;
    if (h) {
      if (!h.promises.size && !h.queue.size) {
        let r = h.sources,
          s = h.disposed;
        (R.push.apply(R, h.effects), (t = h.resolve));
        for (let i of R) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((h = null),
          Q(() => {
            for (let i of s) te(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) te(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            wt(!1);
          }, !1));
      } else if (h.running) {
        ((h.running = !1), h.effects.push.apply(h.effects, R), (R = null), wt(!0));
        return;
      }
    }
    let n = R;
    ((R = null), n.length && Q(() => Ot(n), !1), t && t());
  }
  function Lt(e) {
    for (let t = 0; t < e.length; t++) ve(e[t]);
  }
  function In(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = h.queue;
      r.has(n) ||
        (r.add(n),
        _e(() => {
          (r.delete(n),
            Q(() => {
              ((h.running = !0), ve(n));
            }, !1),
            h && (h.running = !1));
        }));
    }
  }
  function Rn(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : ve(r);
    }
    if (C.context) {
      if (C.count) {
        (C.effects || (C.effects = []), C.effects.push(...e.slice(0, n)));
        return;
      }
      Ye();
    }
    for (
      C.effects &&
        (C.done || !C.count) &&
        ((e = [...C.effects, ...e]), (n += C.effects.length), delete C.effects),
        t = 0;
      t < n;
      t++
    )
      ve(e[t]);
  }
  function Te(e, t) {
    let n = h && h.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === V ? s !== t && (!s.updatedAt || s.updatedAt < Ae) && ve(s) : i === ye && Te(s, t);
      }
    }
  }
  function It(e) {
    let t = h && h.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = ye) : (r.state = ye),
        r.pure ? M.push(r) : R.push(r),
        r.observers && It(r));
    }
  }
  function te(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) te(e.tOwned[t]);
      delete e.tOwned;
    }
    if (h && h.running && e.pure) Rt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) te(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    h && h.running ? (e.tState = 0) : (e.state = 0);
  }
  function Rt(e, t) {
    if ((t || ((e.tState = 0), h.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Rt(e.owned[n]);
  }
  function Fn(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function Dt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      Ge(r, (n && n.owner) || null);
    }
  }
  function Ge(e, t = _) {
    let n = xt && t && t.context && t.context[xt],
      r = Fn(e);
    if (!n) throw r;
    R
      ? R.push({
          fn() {
            Dt(r, n, t);
          },
          state: V,
        })
      : Dt(r, n, t);
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
  function $n(e, t) {
    return function (r) {
      let s;
      return (
        ne(
          () => (s = $(() => ((_.context = { ..._.context, [e]: r.value }), An(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Kn = Symbol('fallback');
  function Ct(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function Nn(e, t, n = {}) {
    let r = [],
      s = [],
      i = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      A(() => Ct(i)),
      () => {
        let c = e() || [],
          u = c.length,
          l,
          d;
        return (
          c[kn],
          $(() => {
            let m, p, b, x, O, D, T, y, v;
            if (u === 0)
              (o !== 0 && (Ct(i), (i = []), (r = []), (s = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((r = [Kn]), (s[0] = oe((B) => ((i[0] = B), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (s = new Array(u), d = 0; d < u; d++) ((r[d] = c[d]), (s[d] = oe(g)));
              o = u;
            } else {
              for (
                b = new Array(u),
                  x = new Array(u),
                  a && (O = new Array(u)),
                  D = 0,
                  T = Math.min(o, u);
                D < T && r[D] === c[D];
                D++
              );
              for (T = o - 1, y = u - 1; T >= D && y >= D && r[T] === c[y]; T--, y--)
                ((b[y] = s[T]), (x[y] = i[T]), a && (O[y] = a[T]));
              for (m = new Map(), p = new Array(y + 1), d = y; d >= D; d--)
                ((v = c[d]), (l = m.get(v)), (p[d] = l === void 0 ? -1 : l), m.set(v, d));
              for (l = D; l <= T; l++)
                ((v = r[l]),
                  (d = m.get(v)),
                  d !== void 0 && d !== -1
                    ? ((b[d] = s[l]), (x[d] = i[l]), a && (O[d] = a[l]), (d = p[d]), m.set(v, d))
                    : i[l]());
              for (d = D; d < u; d++)
                d in b
                  ? ((s[d] = b[d]), (i[d] = x[d]), a && ((a[d] = O[d]), a[d](d)))
                  : (s[d] = oe(g));
              ((s = s.slice(0, (o = u))), (r = c.slice(0)));
            }
            return s;
          })
        );
        function g(m) {
          if (((i[d] = m), a)) {
            let [p, b] = F(d);
            return ((a[d] = b), t(c[d], p));
          }
          return t(c[d]);
        }
      }
    );
  }
  var Bn = !1;
  function fe(e, t) {
    if (Bn && C.context) {
      let n = C.context;
      Ye(On());
      let r = $(() => e(t || {}));
      return (Ye(n), r);
    }
    return $(() => e(t || {}));
  }
  function Qe(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return E(Nn(() => e.each, e.children, t || void 0));
  }
  var Vn = [
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
    kr = new Set([
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
      ...Vn,
    ]);
  function jn(e, t, n) {
    let r = n.length,
      s = t.length,
      i = r,
      o = 0,
      a = 0,
      c = t[s - 1].nextSibling,
      u = null;
    for (; o < s || a < i; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[s - 1] === n[i - 1]; ) (s--, i--);
      if (s === o) {
        let l = i < r ? (a ? n[a - 1].nextSibling : n[i - a]) : c;
        for (; a < i; ) e.insertBefore(n[a++], l);
      } else if (i === a) for (; o < s; ) ((!u || !u.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[i - 1] && n[a] === t[s - 1]) {
        let l = t[--s].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--i], l), (t[s] = n[i]));
      } else {
        if (!u) {
          u = new Map();
          let d = a;
          for (; d < i; ) u.set(n[d], d++);
        }
        let l = u.get(t[o]);
        if (l != null)
          if (a < l && l < i) {
            let d = o,
              g = 1,
              m;
            for (; ++d < s && d < i && !((m = u.get(t[d])) == null || m !== l + g); ) g++;
            if (g > l - a) {
              let p = t[o];
              for (; a < l; ) e.insertBefore(n[a++], p);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function $t(e, t, n, r = {}) {
    let s;
    return (
      oe((i) => {
        ((s = i), t === document ? e() : ae(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function Ie(e, t, n, r) {
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
        ? () => $(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function Kt(e, t) {
    Nt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Ze(e, t, n) {
    return $(() => e(t, n));
  }
  function ae(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Le(e, t, r, n);
    ne((s) => Le(e, t(), s, n), r);
  }
  function Nt(e) {
    return !!C.context && !C.done && (!e || e.isConnected);
  }
  function Le(e, t, n, r, s) {
    let i = Nt(e);
    if (i) {
      !n && (n = [...e.childNodes]);
      let c = [];
      for (let u = 0; u < n.length; u++) {
        let l = n[u];
        l.nodeType === 8 && l.data.slice(0, 2) === '!$' ? l.remove() : c.push(l);
      }
      n = c;
    }
    for (; typeof n == 'function'; ) n = n();
    if (t === n) return n;
    let o = typeof t,
      a = r !== void 0;
    if (((e = (a && n[0] && n[0].parentNode) || e), o === 'string' || o === 'number')) {
      if (i || (o === 'number' && ((t = t.toString()), t === n))) return n;
      if (a) {
        let c = n[0];
        (c && c.nodeType === 3 ? c.data !== t && (c.data = t) : (c = document.createTextNode(t)),
          (n = he(e, n, r, c)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = he(e, n, r);
    } else {
      if (o === 'function')
        return (
          ne(() => {
            let c = t();
            for (; typeof c == 'function'; ) c = c();
            n = Le(e, c, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let c = [],
          u = n && Array.isArray(n);
        if (Je(c, t, n, s)) return (ne(() => (n = Le(e, c, n, r, !0))), () => n);
        if (i) {
          if (!c.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let l = c[0];
          if (l.parentNode !== e) return n;
          let d = [l];
          for (; (l = l.nextSibling) !== r; ) d.push(l);
          return (n = d);
        }
        if (c.length === 0) {
          if (((n = he(e, n, r)), a)) return n;
        } else u ? (n.length === 0 ? Ft(e, c, r) : jn(e, n, c)) : (n && he(e), Ft(e, c));
        n = c;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = he(e, n, r, t));
          he(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Je(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        c = n && n[e.length],
        u;
      if (!(a == null || a === !0 || a === !1))
        if ((u = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Je(e, a, c) || s;
        else if (u === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Je(e, Array.isArray(a) ? a : [a], Array.isArray(c) ? c : [c]) || s;
          } else (e.push(a), (s = !0));
        else {
          let l = String(a);
          c && c.nodeType === 3 && c.data === l ? e.push(c) : e.push(document.createTextNode(l));
        }
    }
    return s;
  }
  function Ft(e, t, n = null) {
    for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
  }
  function he(e, t, n, r) {
    if (n === void 0) return (e.textContent = '');
    let s = r || document.createTextNode('');
    if (t.length) {
      let i = !1;
      for (let o = t.length - 1; o >= 0; o--) {
        let a = t[o];
        if (s !== a) {
          let c = a.parentNode === e;
          !i && !o ? (c ? e.replaceChild(s, a) : e.insertBefore(s, n)) : c && a.remove();
        } else i = !0;
      }
    } else e.insertBefore(s, n);
    return [s];
  }
  var ge = !1;
  var Se = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    re = class {
      constructor(e = {}) {
        f(this, 'dedupe');
        f(this, 'getId');
        f(this, '_events');
        ((this.dedupe = e.dedupe || Se.ADD),
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
            case Se.THROW:
              throw Error('Eventti: duplicate listener id!');
            case Se.IGNORE:
              return n;
            case Se.UPDATE:
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
        (this._emitter = new re({ getId: r, dedupe: n })),
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
  function et(e = 60) {
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
  var Bt = class extends qn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = et(), ...s } = e;
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
  var k = { read: Symbol(), write: Symbol() },
    L = new Bt({
      phases: [k.read, k.write],
      requestFrame: typeof window < 'u' ? et() : () => () => {},
    });
  var Ht = new WeakMap();
  function j(e) {
    let t = Ht.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Ht.set(e, new WeakRef(t))), t);
  }
  var Yn = typeof window < 'u' && window.document !== void 0,
    tt = !!(
      Yn &&
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
    jr = {
      [xe.content]: !1,
      [xe.padding]: !1,
      [xe.scrollbar]: !0,
      [xe.border]: !0,
      [xe.margin]: !0,
    };
  var qr = (() => {
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
  function U(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = jt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), jt.set(e, new WeakRef(n))), n);
  }
  function qt(e) {
    return e instanceof HTMLHtmlElement;
  }
  var J = typeof window < 'u' && window.document !== void 0,
    Yt = J && 'ontouchstart' in window,
    Xt = J && !!window.PointerEvent;
  J &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var S = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
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
  function Xn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Wn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Ut(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function zt(e) {
    return e === 'auto' || e === void 0 ? (Xt ? 'pointer' : Yt ? 'touch' : 'mouse') : e;
  }
  var se = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    ie = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    we = class {
      constructor(e, t = {}) {
        f(this, 'element');
        f(this, 'drag');
        f(this, 'isDestroyed');
        f(this, '_startPredicate');
        f(this, '_listenerOptions');
        f(this, '_sourceEvents');
        f(this, '_areWindowListenersBound');
        f(this, '_emitter');
        f(this, '_eventData', null);
        f(this, '_removeClickBlocker', null);
        f(this, '_cancelOnVisibilityChange');
        f(this, '_cancelOnEscape');
        f(this, '_preventNativeDrag');
        f(this, '_preventContextMenu');
        f(this, '_preventNativeDragHandler', (e) => e.preventDefault());
        f(this, '_preventContextMenuHandler', (e) => e.preventDefault());
        f(this, '_visibilityChangeHandler', () => {
          this.cancel();
        });
        f(this, '_onKeyDown', (e) => {
          e.key === 'Escape' && this.drag && (e.preventDefault(), this.cancel());
        });
        let {
          listenerOptions: n = ie.listenerOptions,
          sourceEvents: r = ie.sourceEvents,
          startPredicate: s = ie.startPredicate,
          cancelOnVisibilityChange: i = ie.cancelOnVisibilityChange,
          cancelOnEscape: o = ie.cancelOnEscape,
          preventNativeDrag: a = ie.preventNativeDrag,
          preventContextMenu: c = ie.preventContextMenu,
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._cancelOnVisibilityChange = i ?? !0),
          (this._cancelOnEscape = o ?? !0),
          (this._preventNativeDrag = a ?? !0),
          (this._preventContextMenu = c ?? !1),
          (this._startPredicate = s),
          (this._listenerOptions = Ut(n)),
          (this._sourceEvents = zt(r)),
          (this._emitter = new re()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(se[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
        let t = Xn(e);
        if (t === null) return;
        let n = Wt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Wn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: S.Start, srcEvent: e, target: n.target }),
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
          (n.type = S.Move),
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
          (n.type = S.Cancel),
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
          (n.type = S.End),
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
        let { move: e, end: t, cancel: n } = se[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = se[this._sourceEvents];
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
          ((this._eventData.type = S.Cancel),
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
            se[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(se[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          c = zt(n),
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
            (n && this._sourceEvents !== c)) &&
            (this.element.removeEventListener(
              se[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = c),
            t && u && (this._listenerOptions = u),
            this.element.addEventListener(
              se[this._sourceEvents].start,
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
          this._emitter.emit(S.Destroy, { type: S.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            se[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Un(e) {
    let t = j(e),
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
  function zn(e) {
    let t = j(e),
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
  function le(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = j(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', c = '0px', u] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * zn(e)}px`),
        c.includes('%') && (c = `${(parseFloat(c) / 100) * Un(e)}px`),
        u ? (o += `translate3d(${a},${c},${u})`) : (o += `translate(${a},${c})`));
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
  function Ee(e) {
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
  var ce = J ? new DOMMatrix() : null;
  function de(e, t = new DOMMatrix()) {
    let n = e;
    for (Ee(t); n; ) {
      let r = le(n);
      if (r && (ce.setMatrixValue(r), !ce.isIdentity)) {
        let { transformOrigin: s } = j(n),
          { x: i, y: o, z: a } = nt(s);
        (a === 0
          ? ce.setMatrixValue(`translate(${i}px,${o}px) ${ce} translate(${i * -1}px,${o * -1}px)`)
          : ce.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${ce} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(ce));
      }
      n = n.parentElement;
    }
    return t;
  }
  function Re(e) {
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
  function Fe(e) {
    let t = U(e);
    if (!tt) {
      let { filter: c } = t;
      if (c && c !== 'none') return !0;
      let { backdropFilter: u } = t;
      if (u && u !== 'none') return !0;
      let { willChange: l } = t;
      if (l && (l.indexOf('filter') > -1 || l.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Re(e);
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
      ) || !!(tt && a && a.indexOf('filter') > -1)
    );
  }
  function Gt(e) {
    return U(e).position !== 'static' || Fe(e);
  }
  function rt(e, t = {}) {
    if (qt(e)) return e.ownerDocument.defaultView;
    let n = t.position || U(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = Re(i);
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
          let a = i ? Fe(o) : Gt(o);
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
  function st(e, t = {}) {
    let n = U(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || U(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return rt(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = rt(e, { container: o, position: s, skipDisplayNone: i });
        return Vt(a) ? e.ownerDocument : a;
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
  function it(e) {
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
  function $e(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Jt = class {
      constructor() {
        f(this, '_cache');
        f(this, '_validation');
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
        f(this, 'sensor');
        f(this, 'startEvent');
        f(this, 'prevMoveEvent');
        f(this, 'moveEvent');
        f(this, 'endEvent');
        f(this, 'items');
        f(this, 'isEnded');
        f(this, '_matrixCache');
        f(this, '_clientOffsetCache');
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
  function Qn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function Jn() {
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
  function Ce(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = j(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function Zt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Zn = { x: 0, y: 0 },
    er = { x: 0, y: 0 };
  function tr(e, t, n = { x: 0, y: 0 }) {
    let r = Zt(e) ? e : Ce(e, Zn),
      s = Zt(t) ? t : Ce(t, er);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Ke = J ? Jn() : null,
    nn = class {
      constructor(e, t) {
        f(this, 'data');
        f(this, 'element');
        f(this, 'elementContainer');
        f(this, 'elementOffsetContainer');
        f(this, 'dragContainer');
        f(this, 'dragOffsetContainer');
        f(this, 'elementTransformOrigin');
        f(this, 'elementTransformMatrix');
        f(this, 'elementOffsetMatrix');
        f(this, 'frozenStyles');
        f(this, 'unfrozenStyles');
        f(this, 'clientRect');
        f(this, 'position');
        f(this, 'containerOffset');
        f(this, 'alignmentOffset');
        f(this, '_moveDiff');
        f(this, '_alignDiff');
        f(this, '_matrixCache');
        f(this, '_clientOffsetCache');
        if (!e.isConnected) throw Error('Element is not connected');
        let { drag: n } = t;
        if (!n) throw Error('Drag is not defined');
        let r = j(e),
          s = e.getBoundingClientRect(),
          i = le(e, !0);
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
          c = (typeof a == 'function' ? a({ draggable: t, drag: n, element: e }) : a) || o;
        if (((this.dragContainer = c), o !== c)) {
          let { position: d } = r;
          if (d !== 'fixed' && d !== 'absolute')
            throw Error(
              `Dragged element has "${d}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let u = st(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = c === o ? u : st(e, { container: c })));
        {
          let { width: d, height: g, x: m, y: p } = s;
          this.clientRect = { width: d, height: g, x: m, y: p };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let l = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(l))
          if (l.length) {
            let d = {};
            for (let g of l) d[g] = r[g];
            this.frozenStyles = d;
          } else this.frozenStyles = null;
        else this.frozenStyles = l;
        if (this.frozenStyles) {
          let d = {};
          for (let g in this.frozenStyles) d[g] = e.style[g];
          this.unfrozenStyles = d;
        }
      }
      _updateContainerMatrices() {
        [this.elementContainer, this.dragContainer].forEach((e) => {
          if (!this._matrixCache.isValid(e)) {
            let t = this._matrixCache.get(e) || [new DOMMatrix(), new DOMMatrix()],
              [n, r] = t;
            (de(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
          let [a, c] = [
            [r, n],
            [t, e],
          ].map(([u, l]) => {
            let d = i.get(l) || { x: 0, y: 0 };
            if (!i.isValid(l)) {
              let g = o.get(u);
              l instanceof HTMLElement && g && !g[0].isIdentity
                ? it(g[0])
                  ? (Ke.style.setProperty('transform', g[1].toString(), 'important'),
                    l.append(Ke),
                    Ce(Ke, d),
                    Ke.remove())
                  : (Ce(l, d), (d.x -= g[0].m41), (d.y -= g[0].m42))
                : Ce(l, d);
            }
            return (i.set(l, d), d);
          });
          tr(a, c, s);
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
    nr = { x: 0, y: 0 },
    z = J ? new DOMMatrix() : null,
    Ne = J ? new DOMMatrix() : null,
    q = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(q || {}),
    Y = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(Y || {}),
    De = { Start: 'start', Move: 'move', End: 'end' },
    Oe = { Immediate: 'immediate', Sampled: 'sampled' },
    Z = {
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
    rn = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === Z.End || t === Z.EndAlign,
          [r, s] = e.getContainerMatrix(),
          [i, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: c,
            containerOffset: u,
            elementTransformMatrix: l,
            elementTransformOrigin: d,
            elementOffsetMatrix: g,
          } = e,
          { x: m, y: p, z: b } = d,
          x = !l.isIdentity && (m !== 0 || p !== 0 || b !== 0),
          O = a.x + c.x + u.x,
          D = a.y + c.y + u.y;
        (Ee(z),
          x && (b === 0 ? z.translateSelf(-m, -p) : z.translateSelf(-m, -p, -b)),
          n ? s.isIdentity || z.multiplySelf(s) : o.isIdentity || z.multiplySelf(o),
          Ee(Ne).translateSelf(O, D),
          z.multiplySelf(Ne),
          r.isIdentity || z.multiplySelf(r),
          x && (Ee(Ne).translateSelf(m, p, b), z.multiplySelf(Ne)),
          l.isIdentity || z.multiplySelf(l),
          g.isIdentity || z.preMultiplySelf(g),
          (e.element.style.transform = `${z}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Oe.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    ot = class {
      constructor(e, t = {}) {
        f(this, 'id');
        f(this, '_sensors');
        f(this, 'settings');
        f(this, 'plugins');
        f(this, 'drag');
        f(this, 'isDestroyed');
        f(this, '_sensorData');
        f(this, '_emitter');
        f(this, '_startPhase');
        f(this, '_startId');
        f(this, '_moveId');
        f(this, '_alignId');
        f(this, '_modifierData');
        f(this, '_selectionChangeHandler', null);
        f(this, '_pointerCaptureTarget', null);
        f(this, '_pointerCapturePointerId', null);
        let { id: n = Symbol(), ...r } = t;
        ((this.id = n),
          (this._sensors = e),
          (this.settings = this._parseSettings(r)),
          (this.plugins = {}),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._sensorData = new Map()),
          (this._emitter = new re()),
          (this._startPhase = q.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: De.Start }),
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
          predicateState: Y.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(S.Start, t, t), e.on(S.Move, t, t), e.on(S.Cancel, n, n), e.on(S.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(S.Start, n),
          e.off(S.Move, n),
          e.off(S.Cancel, r),
          e.off(S.End, r),
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
          computeClientRect: c = t.computeClientRect,
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: l = t.dndGroups,
          preventClickOnEnd: d = t.preventClickOnEnd,
          preventTextSelection: g = t.preventTextSelection,
          capturePointer: m = t.capturePointer,
          onPrepareStart: p = t.onPrepareStart,
          onStart: b = t.onStart,
          onPrepareMove: x = t.onPrepareMove,
          onMove: O = t.onMove,
          onEnd: D = t.onEnd,
          onDestroy: T = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: s,
          frozenStyles: i,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: c,
          sensorProcessingMode: u,
          dndGroups: l,
          preventClickOnEnd: d,
          preventTextSelection: g,
          capturePointer: m,
          onPrepareStart: p,
          onStart: b,
          onPrepareMove: x,
          onMove: O,
          onEnd: D,
          onDestroy: T,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case Y.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case Y.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Oe.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (L.once(k.read, this._prepareMove, this._moveId),
                    L.once(k.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === Y.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = Y.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = Y.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== q.Init ||
          ((this._startPhase = q.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new nn(t, this),
          )),
          this._applyModifiers(De.Start, 0, 0),
          this._emit(K.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = q.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== q.FinishPrepare)) {
          if (((this._startPhase = q.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof we && t.drag) {
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
              this.settings.applyPosition({ phase: Z.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Gn(n, r) || (!it(n) && !it(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += $e(t.clientRect.x - s.x, 3)), (i.y += $e(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: Z.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, en),
            this._emit(K.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = q.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(De.Move, r, s),
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
              this.settings.applyPosition({ phase: Z.Move, draggable: this, drag: e, item: t }));
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
              this.settings.applyPosition({ phase: Z.Align, draggable: this, drag: e, item: t }));
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
          for (let c of s) a = c(a, i);
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
        n.predicateState === Y.Pending &&
          r &&
          ((this._startPhase = q.Init),
          (n.predicateState = Y.Resolved),
          (n.predicateEvent = null),
          (this.drag = new tn(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = Y.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Oe.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (L.once(k.read, this._prepareStart, this._startId),
              L.once(k.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === Y.Pending &&
          ((t.predicateState = Y.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === q.Prepare || this._startPhase === q.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = q.None),
          L.off(k.read, this._startId),
          L.off(k.write, this._startId),
          L.off(k.read, this._moveId),
          L.off(k.write, this._moveId),
          L.off(k.read, this._alignId),
          L.off(k.write, this._alignId),
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
        this._applyModifiers(De.End, 0, 0);
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
          this.settings.applyPosition({ phase: Z.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = $e(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = $e(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: Z.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(K.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Oe.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (L.once(k.read, this._prepareAlign, this._alignId),
              L.once(k.write, this._applyAlign, this._alignId)));
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
  var sn = class {
    constructor() {
      f(this, 'drag');
      f(this, 'isDestroyed');
      f(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new re()));
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
        this._emitter.emit(S.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(S.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(S.End, t),
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
        this._emitter.emit(S.Cancel, t),
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
          type: S.Cancel,
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
        this._emitter.emit(S.Destroy, { type: S.Destroy }),
        this._emitter.off());
    }
  };
  var on = class extends sn {
    constructor() {
      super();
      f(this, 'drag');
      f(this, '_direction');
      f(this, '_speed');
      f(this, '_tickEvent');
      f(this, '_moveEvent');
      ((this.drag = null),
        (this._direction = { x: 0, y: 0 }),
        (this._speed = 0),
        (this._tickEvent = { type: 'tick', time: 0, deltaTime: 0 }),
        (this._moveEvent = {
          type: S.Move,
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
      this.isDestroyed || this.drag || (super._start(t), L.on(k.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (L.off(k.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (L.off(k.read, this._tick), super._cancel(t));
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
  var rr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Be(e, t) {
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
    an = class extends on {
      constructor(t, n = {}) {
        super();
        f(this, 'element');
        f(this, '_eventData', { type: '', x: 0, y: 0, srcEvent: null });
        f(this, '_moveKeys');
        f(this, '_moveKeyTimestamps');
        f(this, '_startKeys');
        f(this, '_moveLeftKeys');
        f(this, '_moveRightKeys');
        f(this, '_moveUpKeys');
        f(this, '_moveDownKeys');
        f(this, '_cancelKeys');
        f(this, '_endKeys');
        f(this, '_cancelOnBlur');
        f(this, '_cancelOnVisibilityChange');
        f(this, '_computeSpeed');
        f(this, '_startPredicate');
        let {
          startPredicate: r = G.startPredicate,
          computeSpeed: s = G.computeSpeed,
          cancelOnVisibilityChange: i = G.cancelOnVisibilityChange,
          cancelOnBlur: o = G.cancelOnBlur,
          startKeys: a = G.startKeys,
          moveLeftKeys: c = G.moveLeftKeys,
          moveRightKeys: u = G.moveRightKeys,
          moveUpKeys: l = G.moveUpKeys,
          moveDownKeys: d = G.moveDownKeys,
          cancelKeys: g = G.cancelKeys,
          endKeys: m = G.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(g)),
          (this._endKeys = new Set(m)),
          (this._moveLeftKeys = new Set(c)),
          (this._moveRightKeys = new Set(u)),
          (this._moveUpKeys = new Set(l)),
          (this._moveDownKeys = new Set(d)),
          (this._moveKeys = new Set([...c, ...u, ...l, ...d])),
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
              ((r.type = S.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
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
          ((n.type = S.End),
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
          rr.forEach((a, c) => {
            let u = `${a}Keys`,
              l = t[u];
            l !== void 0 && ((this[`_${u}`] = new Set(l)), c >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((c, u) => a[u] === c)) ||
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
  function at(e, t, n, r) {
    let s = e.parentElement,
      i = r || { x: 0, y: 0 };
    if (!s) {
      let x = e.getBoundingClientRect();
      return ((i.x = t - x.left), (i.y = n - x.top), i);
    }
    let o = de(s),
      a = o.m11,
      c = o.m12,
      u = o.m21,
      l = o.m22,
      d = e.getBoundingClientRect(),
      g = t - d.left,
      m = n - d.top,
      p = a * l - c * u;
    if (Math.abs(p) < 1e-10) return ((i.x = g), (i.y = m), i);
    let b = 1 / p;
    return ((i.x = (l * g - u * m) * b), (i.y = (-c * g + a * m) * b), i);
  }
  var sr = () => {},
    X = new Map(),
    ct = new Set();
  function lt() {
    ct.forEach((e) => e());
  }
  var ee = {
    add(e, t, n) {
      ((X = new Map(X)), X.set(e, { sources: t, proxies: n, exiting: !1, done: sr }), lt());
    },
    startExiting(e, t) {
      let n = X.get(e);
      n && ((X = new Map(X)), X.set(e, { ...n, exiting: !0, done: t }), lt());
    },
    remove(e) {
      X.has(e) && ((X = new Map(X)), X.delete(e), lt());
    },
    subscribe(e) {
      return (ct.add(e), () => ct.delete(e));
    },
    getSnapshot() {
      return X;
    },
  };
  var ir = (e) => typeof e == 'function' && e.length === 0;
  function N(e, t) {
    return e === void 0 ? t : ir(e) ? e() : e;
  }
  function ln(e) {
    return e.map((t) => N(t));
  }
  function cn(e) {
    let [t, n] = F(ee.getSnapshot());
    return (
      P(() => {
        let r = ee.subscribe(() => {
          n(ee.getSnapshot());
        });
        A(r);
      }),
      E(() => {
        let r = N(e),
          s = t();
        if (!r || !s.has(r)) return null;
        let i = s.get(r);
        return {
          draggable: r,
          sources: i.sources,
          proxies: i.proxies,
          exiting: i.exiting,
          done: i.done,
        };
      })
    );
  }
  function dn(e) {
    let t = cn(e.draggable),
      n = [],
      r = () => {
        for (let s of n) s();
        n = [];
      };
    (P(() => {
      let s = t();
      if ((r(), !s || !s.proxies.length)) return;
      let { draggable: i, sources: o, proxies: a, exiting: c, done: u } = s;
      for (let l = 0; l < a.length; l++) {
        let d = a[l],
          g = l;
        oe((m) => {
          n.push(m);
          let p =
            typeof e.children == 'function'
              ? e.children({
                  draggable: i,
                  item: i.drag?.items?.[g] ?? null,
                  index: g,
                  sourceElement: o[g],
                  exiting: c,
                  done: u,
                })
              : e.children;
          ae(d, p);
        });
      }
    }),
      A(r));
  }
  var or = () => null,
    un = kt(or);
  function fn() {
    return Ue(un);
  }
  var ar = Object.prototype.hasOwnProperty,
    hn = (e) => {
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
      let c = e.length;
      if (c !== t.length) return !1;
      for (let u = 0; u < c; u++) if (!He(e[u], t[u])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let c of e) if (!t.has(c)) return !1;
      return !0;
    }
    if (!hn(e) || !hn(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let c = 0; c < o.length; c++) {
      let u = o[c];
      if (!ar.call(t, u) || !He(e[u], t[u])) return !1;
    }
    return !0;
  }
  var Ve = new Map(),
    je = [],
    dt = [],
    ut = [],
    ft = [],
    ht = [],
    gt = [],
    mt = [],
    pt = [];
  function gn() {
    (Ve.clear(),
      (je.length = 0),
      (dt.length = 0),
      (ut.length = 0),
      (ft.length = 0),
      (ht.length = 0),
      (gt.length = 0),
      (mt.length = 0),
      (pt.length = 0));
  }
  function mn(e) {
    let t = [];
    gn();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = j(r),
        a = le(r),
        c = a ? o.transformOrigin : '',
        u,
        l;
      if (r instanceof SVGSVGElement) ((u = `${i.width}px`), (l = `${i.height}px`));
      else {
        let m = parseFloat(o.width),
          p = parseFloat(o.height);
        if (!(m >= 0) || !(p >= 0)) ((u = `${i.width}px`), (l = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((u = o.width), (l = o.height));
        else {
          let b = parseFloat(o.paddingLeft) || 0,
            x = parseFloat(o.paddingRight) || 0,
            O = parseFloat(o.borderLeftWidth) || 0,
            D = parseFloat(o.borderRightWidth) || 0,
            T = parseFloat(o.paddingTop) || 0,
            y = parseFloat(o.paddingBottom) || 0,
            v = parseFloat(o.borderTopWidth) || 0,
            B = parseFloat(o.borderBottomWidth) || 0;
          ((u = `${m + b + x + O + D}px`), (l = `${p + T + y + v + B}px`));
        }
      }
      let d = document.createElement('div'),
        g = d.style;
      ((g.position = 'absolute'),
        (g.left = '0px'),
        (g.top = '0px'),
        (g.margin = '0'),
        (g.padding = '0'),
        (g.boxSizing = 'border-box'),
        (g.pointerEvents = 'none'),
        (g.contain = 'layout'),
        (d.dataset.dragPreviewProxy = 'true'),
        (je[n] = s),
        (t[n] = d),
        (dt[n] = i),
        (ut[n] = a),
        (ft[n] = c),
        (ht[n] = u),
        (gt[n] = l),
        Ve.has(s) || Ve.set(s, de(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = je[n],
        s = t[n],
        i = ut[n],
        o = ft[n],
        a = ht[n],
        c = gt[n],
        u = s.style;
      ((u.width = a),
        (u.height = c),
        i && ((u.transform = i), o && (u.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = je[n],
        s = t[n],
        i = dt[n],
        o = Ve.get(r),
        a = 0,
        c = 0,
        u = o.m11,
        l = o.m12,
        d = o.m21,
        g = o.m22,
        m = u * g - l * d,
        p = s.getBoundingClientRect(),
        b = i.left - p.left,
        x = i.top - p.top;
      if (Math.abs(m) < 1e-10) ((a = b), (c = x));
      else {
        let O = 1 / m;
        ((a = (g * b - d * x) * O), (c = (-l * b + u * x) * O));
      }
      ((mt[n] = a), (pt[n] = c));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = mt[n],
        i = pt[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (gn(), t);
  }
  function pn(e, t) {
    if (ge) return () => null;
    let n = E(() => (Array.isArray(e) ? ln(e) : (N(e) ?? [])).filter((y) => !!y)),
      r = E(() => N(t)),
      s = E(() => r()?.id),
      i = E(() => r()?.dndObserver),
      o = E(() => {
        let y = r();
        if (!y) return;
        let {
          dndObserver: v,
          id: B,
          dragPreviewContainer: Me,
          dragPreviewExitTimeout: I,
          ...W
        } = y;
        return W;
      }),
      a = fn(),
      c = E(() => {
        let y = i();
        return y === void 0 ? a() : y;
      }),
      [u, l] = F(null),
      d = null,
      g = s(),
      m = o(),
      p = c(),
      b = o(),
      x = r()?.dragPreviewContainer,
      O = r()?.dragPreviewExitTimeout;
    P(() => {
      let y = r();
      ((b = o()), (x = y?.dragPreviewContainer), (O = y?.dragPreviewExitTimeout));
    });
    let D = () => {
        d && (d.destroy(), (d = null), (m = void 0), l(null));
      },
      T = () => {
        Pt(() => {
          D();
          let y = $(n);
          if (!y.length) return;
          let v = $(o),
            B = s(),
            Me = v?.dragPreview,
            I = new ot(y, {
              id: B,
              ...v,
              elements(H) {
                let yt = b,
                  me = (yt?.elements || (() => null))(H);
                if (!yt?.dragPreview || !me || me.length === 0) return me;
                let pe = mn(me);
                ee.add(H.draggable, me, pe);
                let vt = () => {
                    let _t = O || 0;
                    if (_t > 0) {
                      for (let qe of pe) qe.dataset.exiting = 'true';
                      let Pe = !1,
                        bt = () => {
                          Pe ||
                            ((Pe = !0),
                            clearTimeout(En),
                            ee.remove(H.draggable),
                            setTimeout(() => {
                              for (let qe of pe) qe.remove();
                            }, 0));
                        },
                        En = setTimeout(bt, _t);
                      ee.startExiting(H.draggable, bt);
                    } else
                      (ee.remove(H.draggable),
                        setTimeout(() => {
                          for (let Pe of pe) Pe.remove();
                        }, 0));
                    (H.draggable.off('end', xn), H.draggable.off('destroy', wn));
                  },
                  xn = H.draggable.on('end', vt),
                  wn = H.draggable.on('destroy', vt);
                return pe;
              },
              ...(Me
                ? {
                    container: () => {
                      let H = x;
                      return (typeof H == 'function' ? H() : H) || document.body;
                    },
                  }
                : {}),
            }),
            W = $(c);
          (W?.addDraggables([I]), (d = I), (g = B), (m = v), (p = W), l(I));
        });
      };
    return (
      P(() => {
        let y = n();
        if (!y.length) {
          D();
          return;
        }
        let v = d;
        if (!v) {
          T();
          return;
        }
        (y.length !== v.sensors.length || y.some((B) => !v.sensors.includes(B))) && T();
      }),
      P(() => {
        if (!d) return;
        let v = s();
        g !== v && T();
      }),
      P(() => {
        let y = c();
        if (p === y) return;
        let v = d;
        (v && (p?.removeDraggables([v]), y?.addDraggables([v])), (p = y));
      }),
      P(() => {
        let y = d;
        if (!y) return;
        let v = o(),
          B = !1;
        if (m) {
          let I = { ...m },
            W = { ...v };
          ((I.elements === W.elements || (I.dragPreview && W.dragPreview)) &&
            (delete I.elements, delete W.elements),
            (B = !He(I, W)));
        } else B = !0;
        if (!B) return;
        let Me = y._parseSettings(v);
        if (
          (y.updateSettings({
            ...Me,
            ...(!v?.dragPreview && v?.elements ? { elements: v.elements } : {}),
            ...(v?.dragPreview
              ? {
                  container: () => {
                    let I = x;
                    return (typeof I == 'function' ? I() : I) || document.body;
                  },
                }
              : {}),
          }),
          m)
        ) {
          let I = v?.dndGroups !== m.dndGroups,
            W = v?.computeClientRect !== m.computeClientRect;
          (I && p?.clearTargets(y), (I || W) && p?.detectCollisions(y));
        }
        m = v;
      }),
      A(D),
      u
    );
  }
  function yn(e, t = !1) {
    let n = E(() => N(e)),
      [r, s] = F(null),
      [i, o] = F(0);
    return (
      P(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let c = a.on(K.Start, () => {
            s(a.drag || null);
          }),
          u = null;
        t &&
          (u = a.on(K.Move, () => {
            a.drag && o((d) => (d + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let l = a.on(K.End, () => {
          s(null);
        });
        A(() => {
          (a.off(K.Start, c), u && a.off(K.Move, u), a.off(K.End, l));
        });
      }),
      E(() => (i(), r()))
    );
  }
  function vn(e = {}, t) {
    if (ge) return [() => null, () => {}];
    let n = E(() => N(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : N(t))),
      [s, i] = F(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      c = (l) => {
        if (l === null) {
          a();
          return;
        }
        o?.destroy();
        let d = new an(l, n());
        ((o = d), i(d));
      };
    (P(() => {
      let l = o;
      l && l.updateSettings(n());
    }),
      P(() => {
        let l = r();
        l !== void 0 && (c(l), A(a));
      }));
    let u = (l) => {
      if (t === void 0) {
        if (l === null) {
          a();
          return;
        }
        o?.element !== l && c(l);
      }
    };
    return (A(a), [s, u]);
  }
  function _n(e = {}, t) {
    if (ge) return [() => null, () => {}];
    let n = E(() => N(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : N(t))),
      [s, i] = F(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      c = (l) => {
        o?.destroy();
        let d = new we(l, n());
        ((o = d), i(d));
      };
    (P(() => {
      let l = o;
      l && l.updateSettings(n());
    }),
      P(() => {
        let l = r();
        if (l !== void 0) {
          if (l === null) {
            a();
            return;
          }
          (c(l), A(a));
        }
      }));
    let u = (l) => {
      if (t === void 0) {
        if (!l) {
          a();
          return;
        }
        o?.element !== l && c(l);
      }
    };
    return (A(a), [s, u]);
  }
  var lr = Ie(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    cr = Ie('<div class=container><div class=container-inner></div><div class=container-label>'),
    dr = Ie('<div class=preview-content>ITEM '),
    ur = ['skew(-8deg)', 'rotate(12deg)', 'skew(5deg) rotate(-6deg)'],
    bn = 3;
  function fr(e) {
    return (() => {
      var t = lr();
      return (
        Ze((n) => {
          e.elementRefs[e.id] = n;
        }, t),
        ne(() => Kt(t, `card draggable ${e.isDragging ? 'dragging' : ''}`)),
        t
      );
    })();
  }
  function hr() {
    let e = new Array(bn).fill(null),
      t = new Array(bn).fill(null),
      n = {
        startPredicate: (u) => {
          if ('button' in u && u.button > 0) return !1;
          let l = u.target;
          return l ? t.some((d) => d?.contains(l)) : !1;
        },
      },
      r = {
        startPredicate: () => {
          let u = document.activeElement;
          if (!u) return null;
          let l = e.find((m) => m?.contains(u));
          if (!l) return null;
          let { left: d, top: g } = l.getBoundingClientRect();
          return { x: d, y: g };
        },
      },
      [s] = _n(n, window),
      [i] = vn(r, null),
      a = pn([s, i], {
        dragPreview: !0,
        elements: () => e.filter((u) => !!u),
        onEnd: (u) => {
          let l = u.items,
            d = [],
            g = [];
          for (let m = 0; m < l.length; m++) {
            let p = e[m],
              b = l[m];
            if (!p || !b) continue;
            let x = at(p, b.clientRect.x, b.clientRect.y),
              O = (getComputedStyle(p).translate || '').split(' ');
            ((d[m] = (parseFloat(O[0]) || 0) + x.x), (g[m] = (parseFloat(O[1]) || 0) + x.y));
          }
          for (let m = 0; m < l.length; m++) {
            let p = e[m];
            p && (p.style.translate = `${d[m]}px ${g[m]}px`);
          }
        },
      }),
      c = yn(a);
    return [
      fe(Qe, {
        each: [0, 1, 2],
        children: (u) =>
          (() => {
            var l = cr(),
              d = l.firstChild,
              g = d.nextSibling;
            return (
              Ze((m) => (t[u] = m), l),
              ae(
                d,
                fe(fr, {
                  id: u,
                  elementRefs: e,
                  get isDragging() {
                    return !!c();
                  },
                }),
              ),
              ae(g, () => ur[u]),
              l
            );
          })(),
      }),
      fe(dn, {
        draggable: a,
        children: ({ index: u }) =>
          (() => {
            var l = dr(),
              d = l.firstChild;
            return (ae(l, u + 1, null), l);
          })(),
      }),
    ];
  }
  var Sn = document.getElementById('root');
  if (!Sn) throw new Error('Failed to find the root element');
  $t(() => fe(hr, {}), Sn);
})();
