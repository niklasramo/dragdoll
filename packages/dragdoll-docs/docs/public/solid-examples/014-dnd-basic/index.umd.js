'use strict';
var SolidExample_014_dnd_basic = (() => {
  var Fn = Object.defineProperty;
  var Kn = (e, t, n) =>
    t in e ? Fn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => Kn(e, typeof t != 'symbol' ? t + '' : t, n);
  var I = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return kt(this.context.count);
    },
    getNextContextId() {
      return kt(this.context.count++);
    },
  };
  function kt(e) {
    let t = String(e),
      n = t.length - 1;
    return I.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Je(e) {
    I.context = e;
  }
  function $n() {
    return { ...I.context, id: I.getNextContextId(), count: 0 };
  }
  var Nn = !1,
    Bn = (e, t) => e === t;
  var Hn = Symbol('solid-track');
  var Fe = { equals: Bn },
    Tt = null,
    Lt = Ht,
    z = 1,
    ve = 2,
    Ft = { owned: null, cleanups: null, context: null, owner: null };
  var S = null,
    p = null,
    be = null,
    fe = null,
    T = null,
    L = null,
    B = null,
    $e = 0;
  function ye(e, t) {
    let n = T,
      r = S,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? Ft : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => $(() => ie(o)));
    ((S = o), (T = null));
    try {
      return te(a, !0);
    } finally {
      ((T = n), (S = r));
    }
  }
  function P(e, t) {
    t = t ? Object.assign({}, Fe, t) : Fe;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (p && p.running && p.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Bt(n, s)
      );
    return [Nt.bind(n), r];
  }
  function oe(e, t, n) {
    let r = rt(e, t, !1, z);
    be && p && p.running ? L.push(r) : Se(r);
  }
  function M(e, t, n) {
    Lt = Yn;
    let r = rt(e, t, !1, z),
      s = et && nt(et);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), B ? B.push(r) : Se(r));
  }
  function y(e, t, n) {
    n = n ? Object.assign({}, Fe, n) : Fe;
    let r = rt(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      be && p && p.running ? ((r.tState = z), L.push(r)) : Se(r),
      Nt.bind(r)
    );
  }
  function Kt(e) {
    return te(e, !1);
  }
  function $(e) {
    if (!fe && T === null) return e();
    let t = T;
    T = null;
    try {
      return fe ? fe.untrack(e) : e();
    } finally {
      T = t;
    }
  }
  function R(e) {
    return (S === null || (S.cleanups === null ? (S.cleanups = [e]) : S.cleanups.push(e)), e);
  }
  function Vn(e) {
    if (p && p.running) return (e(), p.done);
    let t = T,
      n = S;
    return Promise.resolve().then(() => {
      ((T = t), (S = n));
      let r;
      return (
        (be || et) &&
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
          r.done || (r.done = new Promise((s) => (r.resolve = s))),
          (r.running = !0)),
        te(e, !1),
        (T = S = null),
        r ? r.done : void 0
      );
    });
  }
  var [Rr, At] = P(!1);
  function $t(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Wn(n), defaultValue: e };
  }
  function nt(e) {
    let t;
    return S && S.context && (t = S.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function jn(e) {
    let t = y(e),
      n = y(() => tt(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var et;
  function Nt() {
    let e = p && p.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === z) Se(this);
      else {
        let t = L;
        ((L = null), te(() => Ke(this), !1), (L = t));
      }
    if (T) {
      let t = this.observers ? this.observers.length : 0;
      (T.sources
        ? (T.sources.push(this), T.sourceSlots.push(t))
        : ((T.sources = [this]), (T.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(T), this.observerSlots.push(T.sources.length - 1))
          : ((this.observers = [T]), (this.observerSlots = [T.sources.length - 1])));
    }
    return e && p.sources.has(this) ? this.tValue : this.value;
  }
  function Bt(e, t, n) {
    let r = p && p.running && p.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (p) {
        let s = p.running;
        ((s || (!n && p.sources.has(e))) && (p.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        te(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = p && p.running;
            (o && p.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? L.push(i) : B.push(i), i.observers && Vt(i)),
              o ? (i.tState = z) : (i.state = z));
          }
          if (L.length > 1e6) throw ((L = []), new Error());
        }, !1);
    }
    return t;
  }
  function Se(e) {
    if (!e.fn) return;
    ie(e);
    let t = $e;
    (Pt(e, p && p.running && p.sources.has(e) ? e.tValue : e.value, t),
      p &&
        !p.running &&
        p.sources.has(e) &&
        queueMicrotask(() => {
          te(() => {
            (p && (p.running = !0), (T = S = e), Pt(e, e.tValue, t), (T = S = null));
          }, !1);
        }));
  }
  function Pt(e, t, n) {
    let r,
      s = S,
      i = T;
    T = S = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (p && p.running
            ? ((e.tState = z), e.tOwned && e.tOwned.forEach(ie), (e.tOwned = void 0))
            : ((e.state = z), e.owned && e.owned.forEach(ie), (e.owned = null))),
        (e.updatedAt = n + 1),
        st(o)
      );
    } finally {
      ((T = i), (S = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Bt(e, r, !0)
        : p && p.running && e.pure
          ? (p.sources.has(e) || (e.value = r), p.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function rt(e, t, n, r = z, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: S,
      context: S ? S.context : null,
      pure: n,
    };
    if (
      (p && p.running && ((i.state = 0), (i.tState = r)),
      S === null ||
        (S !== Ft &&
          (p && p.running && S.pure
            ? S.tOwned
              ? S.tOwned.push(i)
              : (S.tOwned = [i])
            : S.owned
              ? S.owned.push(i)
              : (S.owned = [i]))),
      fe && i.fn)
    ) {
      let o = i.fn,
        [a, c] = P(void 0, { equals: !1 }),
        f = fe.factory(o, c);
      R(() => f.dispose());
      let l,
        u = () =>
          Vn(c).then(() => {
            l && (l.dispose(), (l = void 0));
          });
      i.fn = (h) => (a(), p && p.running ? (l || (l = fe.factory(o, u)), l.track(h)) : f.track(h));
    }
    return i;
  }
  function _e(e) {
    let t = p && p.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === ve) return Ke(e);
    if (e.suspense && $(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < $e); ) {
      if (t && p.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (p.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === z) Se(e);
      else if ((t ? e.tState : e.state) === ve) {
        let s = L;
        ((L = null), te(() => Ke(e, n[0]), !1), (L = s));
      }
    }
  }
  function te(e, t) {
    if (L) return e();
    let n = !1;
    (t || (L = []), B ? (n = !0) : (B = []), $e++);
    try {
      let r = e();
      return (zn(n), r);
    } catch (r) {
      (n || (B = null), (L = null), st(r));
    }
  }
  function zn(e) {
    if ((L && (be && p && p.running ? qn(L) : Ht(L), (L = null)), e)) return;
    let t;
    if (p) {
      if (!p.promises.size && !p.queue.size) {
        let r = p.sources,
          s = p.disposed;
        (B.push.apply(B, p.effects), (t = p.resolve));
        for (let i of B) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((p = null),
          te(() => {
            for (let i of s) ie(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) ie(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            At(!1);
          }, !1));
      } else if (p.running) {
        ((p.running = !1), p.effects.push.apply(p.effects, B), (B = null), At(!0));
        return;
      }
    }
    let n = B;
    ((B = null), n.length && te(() => Lt(n), !1), t && t());
  }
  function Ht(e) {
    for (let t = 0; t < e.length; t++) _e(e[t]);
  }
  function qn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = p.queue;
      r.has(n) ||
        (r.add(n),
        be(() => {
          (r.delete(n),
            te(() => {
              ((p.running = !0), _e(n));
            }, !1),
            p && (p.running = !1));
        }));
    }
  }
  function Yn(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : _e(r);
    }
    if (I.context) {
      if (I.count) {
        (I.effects || (I.effects = []), I.effects.push(...e.slice(0, n)));
        return;
      }
      Je();
    }
    for (
      I.effects &&
        (I.done || !I.count) &&
        ((e = [...I.effects, ...e]), (n += I.effects.length), delete I.effects),
        t = 0;
      t < n;
      t++
    )
      _e(e[t]);
  }
  function Ke(e, t) {
    let n = p && p.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === z ? s !== t && (!s.updatedAt || s.updatedAt < $e) && _e(s) : i === ve && Ke(s, t);
      }
    }
  }
  function Vt(e) {
    let t = p && p.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = ve) : (r.state = ve),
        r.pure ? L.push(r) : B.push(r),
        r.observers && Vt(r));
    }
  }
  function ie(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) ie(e.tOwned[t]);
      delete e.tOwned;
    }
    if (p && p.running && e.pure) jt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) ie(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    p && p.running ? (e.tState = 0) : (e.state = 0);
  }
  function jt(e, t) {
    if ((t || ((e.tState = 0), p.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) jt(e.owned[n]);
  }
  function Xn(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function It(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      st(r, (n && n.owner) || null);
    }
  }
  function st(e, t = S) {
    let n = Tt && t && t.context && t.context[Tt],
      r = Xn(e);
    if (!n) throw r;
    B
      ? B.push({
          fn() {
            It(r, n, t);
          },
          state: z,
        })
      : It(r, n, t);
  }
  function tt(e) {
    if (typeof e == 'function' && !e.length) return tt(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = tt(e[n]);
        Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
      }
      return t;
    }
    return e;
  }
  function Wn(e, t) {
    return function (r) {
      let s;
      return (
        oe(
          () => (s = $(() => ((S.context = { ...S.context, [e]: r.value }), jn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Un = Symbol('fallback');
  function Rt(e) {
    for (let t = 0; t < e.length; t++) e[t]();
  }
  function Gn(e, t, n = {}) {
    let r = [],
      s = [],
      i = [],
      o = 0,
      a = t.length > 1 ? [] : null;
    return (
      R(() => Rt(i)),
      () => {
        let c = e() || [],
          f = c.length,
          l,
          u;
        return (
          c[Hn],
          $(() => {
            let m, b, C, A, K, g, x, v, _;
            if (f === 0)
              (o !== 0 && (Rt(i), (i = []), (r = []), (s = []), (o = 0), a && (a = [])),
                n.fallback &&
                  ((r = [Un]), (s[0] = ye((H) => ((i[0] = H), n.fallback()))), (o = 1)));
            else if (o === 0) {
              for (s = new Array(f), u = 0; u < f; u++) ((r[u] = c[u]), (s[u] = ye(h)));
              o = f;
            } else {
              for (
                C = new Array(f),
                  A = new Array(f),
                  a && (K = new Array(f)),
                  g = 0,
                  x = Math.min(o, f);
                g < x && r[g] === c[g];
                g++
              );
              for (x = o - 1, v = f - 1; x >= g && v >= g && r[x] === c[v]; x--, v--)
                ((C[v] = s[x]), (A[v] = i[x]), a && (K[v] = a[x]));
              for (m = new Map(), b = new Array(v + 1), u = v; u >= g; u--)
                ((_ = c[u]), (l = m.get(_)), (b[u] = l === void 0 ? -1 : l), m.set(_, u));
              for (l = g; l <= x; l++)
                ((_ = r[l]),
                  (u = m.get(_)),
                  u !== void 0 && u !== -1
                    ? ((C[u] = s[l]), (A[u] = i[l]), a && (K[u] = a[l]), (u = b[u]), m.set(_, u))
                    : i[l]());
              for (u = g; u < f; u++)
                u in C
                  ? ((s[u] = C[u]), (i[u] = A[u]), a && ((a[u] = K[u]), a[u](u)))
                  : (s[u] = ye(h));
              ((s = s.slice(0, (o = f))), (r = c.slice(0)));
            }
            return s;
          })
        );
        function h(m) {
          if (((i[u] = m), a)) {
            let [b, C] = P(u);
            return ((a[u] = C), t(c[u], b));
          }
          return t(c[u]);
        }
      }
    );
  }
  var Qn = !1;
  function ae(e, t) {
    if (Qn && I.context) {
      let n = I.context;
      Je($n());
      let r = $(() => e(t || {}));
      return (Je(n), r);
    }
    return $(() => e(t || {}));
  }
  function Ne(e) {
    let t = 'fallback' in e && { fallback: () => e.fallback };
    return y(Gn(() => e.each, e.children, t || void 0));
  }
  var Jn = [
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
    Wr = new Set([
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
      ...Jn,
    ]);
  function er(e, t, n) {
    let r = n.length,
      s = t.length,
      i = r,
      o = 0,
      a = 0,
      c = t[s - 1].nextSibling,
      f = null;
    for (; o < s || a < i; ) {
      if (t[o] === n[a]) {
        (o++, a++);
        continue;
      }
      for (; t[s - 1] === n[i - 1]; ) (s--, i--);
      if (s === o) {
        let l = i < r ? (a ? n[a - 1].nextSibling : n[i - a]) : c;
        for (; a < i; ) e.insertBefore(n[a++], l);
      } else if (i === a) for (; o < s; ) ((!f || !f.has(t[o])) && t[o].remove(), o++);
      else if (t[o] === n[i - 1] && n[a] === t[s - 1]) {
        let l = t[--s].nextSibling;
        (e.insertBefore(n[a++], t[o++].nextSibling), e.insertBefore(n[--i], l), (t[s] = n[i]));
      } else {
        if (!f) {
          f = new Map();
          let u = a;
          for (; u < i; ) f.set(n[u], u++);
        }
        let l = f.get(t[o]);
        if (l != null)
          if (a < l && l < i) {
            let u = o,
              h = 1,
              m;
            for (; ++u < s && u < i && !((m = f.get(t[u])) == null || m !== l + h); ) h++;
            if (h > l - a) {
              let b = t[o];
              for (; a < l; ) e.insertBefore(n[a++], b);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function qt(e, t, n, r = {}) {
    let s;
    return (
      ye((i) => {
        ((s = i), t === document ? e() : He(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function De(e, t, n, r) {
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
  function Yt(e, t) {
    Wt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Xt(e, t, n) {
    n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
  }
  function ot(e, t, n) {
    return $(() => e(t, n));
  }
  function He(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Be(e, t, r, n);
    oe((s) => Be(e, t(), s, n), r);
  }
  function Wt(e) {
    return !!I.context && !I.done && (!e || e.isConnected);
  }
  function Be(e, t, n, r, s) {
    let i = Wt(e);
    if (i) {
      !n && (n = [...e.childNodes]);
      let c = [];
      for (let f = 0; f < n.length; f++) {
        let l = n[f];
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
          oe(() => {
            let c = t();
            for (; typeof c == 'function'; ) c = c();
            n = Be(e, c, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let c = [],
          f = n && Array.isArray(n);
        if (it(c, t, n, s)) return (oe(() => (n = Be(e, c, n, r, !0))), () => n);
        if (i) {
          if (!c.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let l = c[0];
          if (l.parentNode !== e) return n;
          let u = [l];
          for (; (l = l.nextSibling) !== r; ) u.push(l);
          return (n = u);
        }
        if (c.length === 0) {
          if (((n = he(e, n, r)), a)) return n;
        } else f ? (n.length === 0 ? zt(e, c, r) : er(e, n, c)) : (n && he(e), zt(e, c));
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
  function it(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        c = n && n[e.length],
        f;
      if (!(a == null || a === !0 || a === !1))
        if ((f = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = it(e, a, c) || s;
        else if (f === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = it(e, Array.isArray(a) ? a : [a], Array.isArray(c) ? c : [c]) || s;
          } else (e.push(a), (s = !0));
        else {
          let l = String(a);
          c && c.nodeType === 3 && c.data === l ? e.push(c) : e.push(document.createTextNode(l));
        }
    }
    return s;
  }
  function zt(e, t, n = null) {
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
  var ne = !1;
  var tr = () => {},
    q = new Map(),
    lt = new Set();
  function at() {
    lt.forEach((e) => e());
  }
  var we = {
    add(e, t, n) {
      ((q = new Map(q)), q.set(e, { sources: t, proxies: n, exiting: !1, done: tr }), at());
    },
    startExiting(e, t) {
      let n = q.get(e);
      n && ((q = new Map(q)), q.set(e, { ...n, exiting: !0, done: t }), at());
    },
    remove(e) {
      q.has(e) && ((q = new Map(q)), q.delete(e), at());
    },
    subscribe(e) {
      return (lt.add(e), () => lt.delete(e));
    },
    getSnapshot() {
      return q;
    },
  };
  var nr = (e) => typeof e == 'function' && e.length === 0;
  function F(e, t) {
    return e === void 0 ? t : nr(e) ? e() : e;
  }
  function Ut(e) {
    return e.map((t) => F(t));
  }
  var rr = () => null,
    Ve = $t(rr);
  var xe = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    Y = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || xe.ADD),
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
            case xe.THROW:
              throw Error('Eventti: duplicate listener id!');
            case xe.IGNORE:
              return n;
            case xe.UPDATE:
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
  var sr = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new Y({ getId: r, dedupe: n })),
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
  function ct(e = 60) {
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
  var Gt = class extends sr {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = ct(), ...s } = e;
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
  var O = { read: Symbol(), write: Symbol() },
    k = new Gt({
      phases: [O.read, O.write],
      requestFrame: typeof window < 'u' ? ct() : () => () => {},
    });
  function dt(e, t, n = { width: 0, height: 0, x: 0, y: 0 }) {
    let r = Math.max(e.x, t.x),
      s = Math.min(e.x + e.width, t.x + t.width);
    if (s <= r) return null;
    let i = Math.max(e.y, t.y),
      o = Math.min(e.y + e.height, t.y + t.height);
    return o <= i ? null : ((n.x = r), (n.y = i), (n.width = s - r), (n.height = o - i), n);
  }
  var ir = { width: 0, height: 0, x: 0, y: 0 };
  function Qt(e, t, n) {
    if ((n || (n = dt(e, t, ir)), !n)) return 0;
    let r = n.width * n.height;
    return r ? (r / (Math.min(e.width, t.width) * Math.min(e.height, t.height))) * 100 : 0;
  }
  function Ee(e, t = { width: 0, height: 0, x: 0, y: 0 }) {
    return (e && ((t.width = e.width), (t.height = e.height), (t.x = e.x), (t.y = e.y)), t);
  }
  var or = class {
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
    ar = Symbol(),
    Zt = class {
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
          s = t.getClientRect();
        if (!r) return null;
        let i = dt(r, s, n.intersectionRect);
        if (i === null) return null;
        let o = Qt(r, s, i);
        return o <= 0
          ? null
          : ((n.droppableId = t.id),
            Ee(s, n.droppableRect),
            Ee(r, n.draggableRect),
            (n.intersectionScore = o),
            n);
      }
      _sortCollisions(e, t) {
        return t.sort((n, r) => {
          let s = r.intersectionScore - n.intersectionScore;
          return s === 0
            ? n.droppableRect.width * n.droppableRect.height -
                r.droppableRect.width * r.droppableRect.height
            : s;
        });
      }
      _createCollisionData() {
        return {
          droppableId: ar,
          droppableRect: Ee(),
          draggableRect: Ee(),
          intersectionRect: Ee(),
          intersectionScore: 0,
        };
      }
      _getCollisionDataArena(e) {
        let t = this._cdArenaMap.get(e);
        return (
          t ||
            ((t = this._cdArenaPool.pop() || new or((n) => n || this._createCollisionData())),
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
          s = null,
          i = t.values();
        for (let o of i)
          (s || (s = r.allocate()), this._checkCollision(e, o, s) && (n.push(s), (s = null)));
        (n.length > 1 && this._sortCollisions(e, n), r.reset());
      }
      destroy() {
        this._cdArenaMap.forEach((e) => {
          e.truncate();
        });
      }
    };
  var E = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  var Jt = new WeakMap();
  function X(e) {
    let t = Jt.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Jt.set(e, new WeakRef(t))), t);
  }
  var re = typeof window < 'u' && window.document !== void 0,
    en = re && 'ontouchstart' in window,
    tn = re && !!window.PointerEvent;
  re &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  function nn(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function lr(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function cr(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function rn(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function sn(e) {
    return e === 'auto' || e === void 0 ? (tn ? 'pointer' : en ? 'touch' : 'mouse') : e;
  }
  var le = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    ce = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    Ce = class {
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
          listenerOptions: n = ce.listenerOptions,
          sourceEvents: r = ce.sourceEvents,
          startPredicate: s = ce.startPredicate,
          cancelOnVisibilityChange: i = ce.cancelOnVisibilityChange,
          cancelOnEscape: o = ce.cancelOnEscape,
          preventNativeDrag: a = ce.preventNativeDrag,
          preventContextMenu: c = ce.preventContextMenu,
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
          (this._listenerOptions = rn(n)),
          (this._sourceEvents = sn(r)),
          (this._emitter = new Y()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(le[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? nn(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = lr(e);
        if (t === null) return;
        let n = nn(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: cr(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: E.Start, srcEvent: e, target: n.target }),
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
          (n.type = E.Move),
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
          (n.type = E.Cancel),
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
          (n.type = E.End),
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
        let { move: e, end: t, cancel: n } = le[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = le[this._sourceEvents];
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
          ((this._eventData.type = E.Cancel),
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
            le[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(le[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          c = sn(n),
          f = rn(t);
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
            (n && this._sourceEvents !== c)) &&
            (this.element.removeEventListener(
              le[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = c),
            t && f && (this._listenerOptions = f),
            this.element.addEventListener(
              le[this._sourceEvents].start,
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
          this._emitter.emit(E.Destroy, { type: E.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            le[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function dr(e) {
    let t = X(e),
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
  function ur(e) {
    let t = X(e),
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
  function de(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = X(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', c = '0px', f] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * ur(e)}px`),
        c.includes('%') && (c = `${(parseFloat(c) / 100) * dr(e)}px`),
        f ? (o += `translate3d(${a},${c},${f})`) : (o += `translate(${a},${c})`));
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
  function Oe(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function ut(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var ue = re ? new DOMMatrix() : null;
  function Me(e, t = new DOMMatrix()) {
    let n = e;
    for (Oe(t); n; ) {
      let r = de(n);
      if (r && (ue.setMatrixValue(r), !ue.isIdentity)) {
        let { transformOrigin: s } = X(n),
          { x: i, y: o, z: a } = ut(s);
        (a === 0
          ? ue.setMatrixValue(`translate(${i}px,${o}px) ${ue} translate(${i * -1}px,${o * -1}px)`)
          : ue.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${ue} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(ue));
      }
      n = n.parentElement;
    }
    return t;
  }
  var on = new WeakMap();
  function Z(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = on.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), on.set(e, new WeakRef(n))), n);
  }
  var fr = typeof window < 'u' && window.document !== void 0,
    ft = !!(
      fr &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    ke = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Ps = {
      [ke.content]: !1,
      [ke.padding]: !1,
      [ke.scrollbar]: !0,
      [ke.border]: !0,
      [ke.margin]: !0,
    };
  var Is = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function je(e) {
    switch (Z(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function ze(e) {
    let t = Z(e);
    if (!ft) {
      let { filter: c } = t;
      if (c && c !== 'none') return !0;
      let { backdropFilter: f } = t;
      if (f && f !== 'none') return !0;
      let { willChange: l } = t;
      if (l && (l.indexOf('filter') > -1 || l.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = je(e);
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
      ) || !!(ft && a && a.indexOf('filter') > -1)
    );
  }
  function an(e) {
    return Z(e).position !== 'static' || ze(e);
  }
  function ln(e) {
    return e instanceof HTMLHtmlElement;
  }
  function ht(e, t = {}) {
    if (ln(e)) return e.ownerDocument.defaultView;
    let n = t.position || Z(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = je(i);
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
          let a = i ? ze(o) : an(o);
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
  function cn(e) {
    return e instanceof Window;
  }
  function pt(e, t = {}) {
    let n = Z(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || Z(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return ht(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = ht(e, { container: o, position: s, skipDisplayNone: i });
        return cn(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function hr(e, t) {
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
  function gt(e) {
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
  function dn(e, t, n = null) {
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
  function qe(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var un = class {
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
    pn = class {
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
          (this._matrixCache = new un()),
          (this._clientOffsetCache = new un()));
      }
    };
  function pr(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function gr() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      pr(
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
  function Ae(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = X(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function fn(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var mr = { x: 0, y: 0 },
    yr = { x: 0, y: 0 };
  function vr(e, t, n = { x: 0, y: 0 }) {
    let r = fn(e) ? e : Ae(e, mr),
      s = fn(t) ? t : Ae(t, yr);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Ye = re ? gr() : null,
    gn = class {
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
        let r = X(e),
          s = e.getBoundingClientRect(),
          i = de(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = ut(r.transformOrigin)),
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
          let { position: u } = r;
          if (u !== 'fixed' && u !== 'absolute')
            throw Error(
              `Dragged element has "${u}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let f = pt(e) || e;
        ((this.elementOffsetContainer = f),
          (this.dragOffsetContainer = c === o ? f : pt(e, { container: c })));
        {
          let { width: u, height: h, x: m, y: b } = s;
          this.clientRect = { width: u, height: h, x: m, y: b };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let l = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(l))
          if (l.length) {
            let u = {};
            for (let h of l) u[h] = r[h];
            this.frozenStyles = u;
          } else this.frozenStyles = null;
        else this.frozenStyles = l;
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
            (Me(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
          ].map(([f, l]) => {
            let u = i.get(l) || { x: 0, y: 0 };
            if (!i.isValid(l)) {
              let h = o.get(f);
              l instanceof HTMLElement && h && !h[0].isIdentity
                ? gt(h[0])
                  ? (Ye.style.setProperty('transform', h[1].toString(), 'important'),
                    l.append(Ye),
                    Ae(Ye, u),
                    Ye.remove())
                  : (Ae(l, u), (u.x -= h[0].m41), (u.y -= h[0].m42))
                : Ae(l, u);
            }
            return (i.set(l, u), u);
          });
          vr(a, c, s);
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
    hn = { capture: !0, passive: !0 },
    _r = { x: 0, y: 0 },
    J = re ? new DOMMatrix() : null,
    Xe = re ? new DOMMatrix() : null,
    W = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(W || {}),
    U = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(U || {}),
    Te = { Start: 'start', Move: 'move', End: 'end' },
    Pe = { Immediate: 'immediate', Sampled: 'sampled' },
    se = {
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
    mn = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === se.End || t === se.EndAlign,
          [r, s] = e.getContainerMatrix(),
          [i, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: c,
            containerOffset: f,
            elementTransformMatrix: l,
            elementTransformOrigin: u,
            elementOffsetMatrix: h,
          } = e,
          { x: m, y: b, z: C } = u,
          A = !l.isIdentity && (m !== 0 || b !== 0 || C !== 0),
          K = a.x + c.x + f.x,
          g = a.y + c.y + f.y;
        (Oe(J),
          A && (C === 0 ? J.translateSelf(-m, -b) : J.translateSelf(-m, -b, -C)),
          n ? s.isIdentity || J.multiplySelf(s) : o.isIdentity || J.multiplySelf(o),
          Oe(Xe).translateSelf(K, g),
          J.multiplySelf(Xe),
          r.isIdentity || J.multiplySelf(r),
          A && (Oe(Xe).translateSelf(m, b, C), J.multiplySelf(Xe)),
          l.isIdentity || J.multiplySelf(l),
          h.isIdentity || J.preMultiplySelf(h),
          (e.element.style.transform = `${J}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Pe.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    mt = class {
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
          (this._emitter = new Y()),
          (this._startPhase = W.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: Te.Start }),
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
          predicateState: U.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(E.Start, t, t), e.on(E.Move, t, t), e.on(E.Cancel, n, n), e.on(E.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(E.Start, n),
          e.off(E.Move, n),
          e.off(E.Cancel, r),
          e.off(E.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = mn) {
        let {
          container: n = t.container,
          startPredicate: r = t.startPredicate,
          elements: s = t.elements,
          frozenStyles: i = t.frozenStyles,
          positionModifiers: o = t.positionModifiers,
          applyPosition: a = t.applyPosition,
          computeClientRect: c = t.computeClientRect,
          sensorProcessingMode: f = t.sensorProcessingMode,
          dndGroups: l = t.dndGroups,
          preventClickOnEnd: u = t.preventClickOnEnd,
          preventTextSelection: h = t.preventTextSelection,
          capturePointer: m = t.capturePointer,
          onPrepareStart: b = t.onPrepareStart,
          onStart: C = t.onStart,
          onPrepareMove: A = t.onPrepareMove,
          onMove: K = t.onMove,
          onEnd: g = t.onEnd,
          onDestroy: x = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: s,
          frozenStyles: i,
          positionModifiers: o,
          applyPosition: a,
          computeClientRect: c,
          sensorProcessingMode: f,
          dndGroups: l,
          preventClickOnEnd: u,
          preventTextSelection: h,
          capturePointer: m,
          onPrepareStart: b,
          onStart: C,
          onPrepareMove: A,
          onMove: K,
          onEnd: g,
          onDestroy: x,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case U.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case U.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Pe.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (k.once(O.read, this._prepareMove, this._moveId),
                    k.once(O.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === U.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = U.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = U.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== W.Init ||
          ((this._startPhase = W.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new gn(t, this),
          )),
          this._applyModifiers(Te.Start, 0, 0),
          this._emit(D.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = W.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== W.FinishPrepare)) {
          if (((this._startPhase = W.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof Ce && t.drag) {
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
            (t.dragContainer !== t.elementContainer && dn(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: se.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (hr(n, r) || (!gt(n) && !gt(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += qe(t.clientRect.x - s.x, 3)), (i.y += qe(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: se.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, hn),
            this._emit(D.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = W.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(Te.Move, r, s),
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
              this.settings.applyPosition({ phase: se.Move, draggable: this, drag: e, item: t }));
          (this._emit(D.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: se.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let s = this.settings.positionModifiers,
          i = this._modifierData;
        i.drag = r;
        for (let o of r.items) {
          let a = _r;
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
        n.predicateState === U.Pending &&
          r &&
          ((this._startPhase = W.Init),
          (n.predicateState = U.Resolved),
          (n.predicateEvent = null),
          (this.drag = new pn(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = U.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Pe.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (k.once(O.read, this._prepareStart, this._startId),
              k.once(O.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === U.Pending &&
          ((t.predicateState = U.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === W.Prepare || this._startPhase === W.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = W.None),
          k.off(O.read, this._startId),
          k.off(O.write, this._startId),
          k.off(O.read, this._moveId),
          k.off(O.write, this._moveId),
          k.off(O.read, this._alignId),
          k.off(O.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, hn),
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
        this._applyModifiers(Te.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (dn(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: se.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = qe(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = qe(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: se.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(D.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Pe.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (k.once(O.read, this._prepareAlign, this._alignId),
              k.once(O.write, this._applyAlign, this._alignId)));
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
  var Ie = { Destroy: 'destroy' },
    yn = {
      accept: () => !0,
      computeClientRect: (e) => e.element?.getBoundingClientRect() || e.getClientRect(),
    },
    vn = class {
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
          accept: r = yn.accept,
          data: s = {},
          computeClientRect: i = yn.computeClientRect,
        } = t;
        ((this.id = n),
          (this.element = e),
          (this.isDestroyed = !1),
          (this.accept = r),
          (this.data = s),
          (this.computeClientRect = i),
          (this._clientRect = { x: 0, y: 0, width: 0, height: 0 }),
          (this._emitter = new Y()),
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
          ((this.isDestroyed = !0), this._emitter.emit(Ie.Destroy), this._emitter.off());
      }
    };
  var j = (function (e) {
      return (
        (e[(e.Idle = 0)] = 'Idle'),
        (e[(e.Computing = 1)] = 'Computing'),
        (e[(e.Computed = 2)] = 'Computed'),
        (e[(e.Emitting = 3)] = 'Emitting'),
        e
      );
    })(j || {}),
    _n = { capture: !0, passive: !0 },
    w = {
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
    yt = class {
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
            (k.once(O.read, this.updateDroppableClientRects, this._listenerId),
            this.detectCollisions());
        });
        let { collisionDetector: t } = e;
        ((this.draggables = new Map()),
          (this.droppables = new Map()),
          (this.isDestroyed = !1),
          (this._drags = new Map()),
          (this._listenerId = Symbol()),
          (this._emitter = new Y()),
          (this._onScroll = this._onScroll.bind(this)),
          (this.updateDroppableClientRects = this.updateDroppableClientRects.bind(this)),
          (this._collisionDetector = t ? t(this) : new Zt(this)));
      }
      get drags() {
        return this._drags;
      }
      _isMatch(e, t) {
        let n = !1;
        if (typeof t.accept == 'function') n = t.accept(e);
        else {
          let r = e.settings.dndGroups,
            s = t.accept;
          if (!r || r.size === 0 || s.size === 0) return !1;
          let i = s.size < r.size,
            o = i ? s : r,
            a = i ? r : s;
          for (let c of o)
            if (a.has(c)) {
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
                phase: j.Idle,
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
            this._drags.size === 1 && window.addEventListener('scroll', this._onScroll, _n)));
      }
      _onDragStart(e) {
        let t = this._drags.get(e);
        if (!(!t || t.isEnded)) {
          if (this._emitter.listenerCount(w.Start)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(w.Start, n));
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
          if (this._emitter.listenerCount(w.Move)) {
            let n = t._events.base;
            ((n.targets = this._getTargets(e)), this._emitter.emit(w.Move, n));
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
        if (n._cd.phase === j.Emitting)
          throw Error('Cannot stop dragging while collisions are being emitted.');
        ((n.isEnded = !0), this._computeCollisions(e, !0), this._emitCollisions(e, !0));
        let { targets: r, collisions: s, contacts: i } = n._cd;
        if (this._emitter.listenerCount(w.End)) {
          let o = n._events.end;
          ((o.canceled = t),
            (o.targets = r),
            (o.collisions = s),
            (o.contacts = i),
            this._emitter.emit(w.End, o));
        }
        (this._drags.delete(e),
          this._collisionDetector._removeCollisionDataArena(e),
          k.off(O.read, n._cd.tickerId),
          k.off(O.write, n._cd.tickerId),
          this._drags.size ||
            (k.off(O.read, this._listenerId),
            window.removeEventListener('scroll', this._onScroll, _n)));
      }
      _computeCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let r = n._cd;
        switch (r.phase) {
          case j.Computing:
            throw Error('Collisions are being computed.');
          case j.Emitting:
            throw Error('Collisions are being emitted.');
          default:
            break;
        }
        ((r.phase = j.Computing),
          (r.targets = this._getTargets(e)),
          this._collisionDetector.detectCollisions(e, r.targets, r.collisions),
          (r.phase = j.Computed));
      }
      _emitCollisions(e, t = !1) {
        let n = this._drags.get(e);
        if (!n || (!t && n.isEnded)) return;
        let r = n._cd;
        switch (r.phase) {
          case j.Computing:
            throw Error('Collisions are being computed.');
          case j.Emitting:
            throw Error('Collisions are being emitted.');
          case j.Idle:
            return;
          default:
            break;
        }
        r.phase = j.Emitting;
        let s = this._emitter,
          i = r.collisions,
          o = r.targets,
          a = r.addedContacts,
          c = r.persistedContacts,
          f = r.contacts,
          l = r.prevContacts;
        ((r.prevContacts = f), (r.contacts = l));
        let u = f;
        (a.clear(), c.clear(), l.clear());
        for (let h of i) {
          let m = o.get(h.droppableId);
          m && (l.add(m), f.has(m) ? (c.add(m), f.delete(m)) : a.add(m));
        }
        if (f.size && s.listenerCount(w.Leave)) {
          let h = n._events.leave;
          ((h.targets = o),
            (h.collisions = i),
            (h.contacts = l),
            (h.removedContacts = u),
            s.emit(w.Leave, h));
        }
        if (a.size && s.listenerCount(w.Enter)) {
          let h = n._events.enter;
          ((h.targets = o),
            (h.collisions = i),
            (h.contacts = l),
            (h.addedContacts = a),
            s.emit(w.Enter, h));
        }
        if (s.listenerCount(w.Collide) && (l.size || u.size)) {
          let h = n._events.collide;
          ((h.targets = o),
            (h.collisions = i),
            (h.contacts = l),
            (h.addedContacts = a),
            (h.removedContacts = u),
            (h.persistedContacts = c),
            s.emit(w.Collide, h));
        }
        (a.clear(), c.clear(), f.clear(), (r.phase = j.Idle));
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
            (k.once(O.read, t._cd._compute, t._cd.tickerId),
              k.once(O.write, t._cd._emit, t._cd.tickerId));
          } else
            for (let [, t] of this._drags)
              t.isEnded ||
                (k.once(O.read, t._cd._compute, t._cd.tickerId),
                k.once(O.write, t._cd._emit, t._cd.tickerId));
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
              (r) => {
                r.endEvent?.type === E.End ? this._onDragEnd(n) : this._onDragCancel(n);
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
          this._emitter.listenerCount(w.AddDraggables) &&
            this._emitter.emit(w.AddDraggables, { draggables: t });
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
            n.off(D.PrepareStart, this._listenerId),
            n.off(D.Start, this._listenerId),
            n.off(D.PrepareMove, this._listenerId),
            n.off(D.Move, this._listenerId),
            n.off(D.End, this._listenerId),
            n.off(D.Destroy, this._listenerId));
        for (let n of t) this._stopDrag(n, !0);
        this._emitter.listenerCount(w.RemoveDraggables) &&
          this._emitter.emit(w.RemoveDraggables, { draggables: t });
      }
      addDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) ||
            (t.add(n),
            this.droppables.set(n.id, n),
            n.on(
              Ie.Destroy,
              () => {
                this.removeDroppables([n]);
              },
              this._listenerId,
            ),
            this._drags.forEach(({ _targets: r }, s) => {
              r && this._isMatch(s, n) && (r.set(n.id, n), this.detectCollisions(s));
            }));
        t.size &&
          this._emitter.listenerCount(w.AddDroppables) &&
          this._emitter.emit(w.AddDroppables, { droppables: t });
      }
      removeDroppables(e) {
        if (this.isDestroyed) return;
        let t = new Set();
        for (let n of e)
          this.droppables.has(n.id) &&
            (this.droppables.delete(n.id),
            t.add(n),
            n.off(Ie.Destroy, this._listenerId),
            this._drags.forEach(({ _targets: r }, s) => {
              r && r.has(n.id) && (r.delete(n.id), this.detectCollisions(s));
            }));
        t.size &&
          this._emitter.listenerCount(w.RemoveDroppables) &&
          this._emitter.emit(w.RemoveDroppables, { droppables: t });
      }
      destroy() {
        if (this.isDestroyed) return;
        if (Array.from(this._drags.values()).some((t) => t._cd.phase === j.Emitting))
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
            t.off(Ie.Destroy, this._listenerId);
          }));
        let e = this._drags.keys();
        for (let t of e) this._stopDrag(t, !0);
        (this._emitter.emit(w.Destroy),
          this._emitter.off(),
          this._collisionDetector.destroy(),
          this.draggables.clear(),
          this.droppables.clear());
      }
    };
  function pe() {
    return nt(Ve);
  }
  function G(e, t, n) {
    let r = pe(),
      s = y(() => (n === void 0 ? r() : F(n))),
      i,
      [o, a] = P(!1);
    (M(() => {
      ((i = F(t)), a(!!i));
    }),
      M(() => {
        let c = s();
        if (!c || !o()) return;
        let f = (...u) => {
            i?.(...u);
          },
          l = c.on(e, f);
        R(() => c.off(e, l));
      }));
  }
  function bn(e = void 0) {
    if (ne) return () => null;
    let t = y(() => F(e)),
      n = y(() => t()?.collisionDetector),
      r = new yt({ collisionDetector: $(n) }),
      [s, i] = P(r),
      o = $(n);
    return (
      M(() => {
        let a = n();
        a !== o && ((o = a), r.destroy(), (r = new yt({ collisionDetector: a })), i(r));
      }),
      R(() => {
        r.destroy();
      }),
      G(
        w.Start,
        y(() => t()?.onStart),
        s,
      ),
      G(
        w.Move,
        y(() => t()?.onMove),
        s,
      ),
      G(
        w.Enter,
        y(() => t()?.onEnter),
        s,
      ),
      G(
        w.Leave,
        y(() => t()?.onLeave),
        s,
      ),
      G(
        w.Collide,
        y(() => t()?.onCollide),
        s,
      ),
      G(
        w.End,
        y(() => t()?.onEnd),
        s,
      ),
      G(
        w.AddDraggables,
        y(() => t()?.onAddDraggables),
        s,
      ),
      G(
        w.RemoveDraggables,
        y(() => t()?.onRemoveDraggables),
        s,
      ),
      G(
        w.AddDroppables,
        y(() => t()?.onAddDroppables),
        s,
      ),
      G(
        w.RemoveDroppables,
        y(() => t()?.onRemoveDroppables),
        s,
      ),
      G(
        w.Destroy,
        y(() => t()?.onDestroy),
        s,
      ),
      s
    );
  }
  var br = Object.prototype.hasOwnProperty,
    Sn = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function We(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      r = Array.isArray(t);
    if (n || r) {
      if (!n || !r) return !1;
      let c = e.length;
      if (c !== t.length) return !1;
      for (let f = 0; f < c; f++) if (!We(e[f], t[f])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let c of e) if (!t.has(c)) return !1;
      return !0;
    }
    if (!Sn(e) || !Sn(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let c = 0; c < o.length; c++) {
      let f = o[c];
      if (!br.call(t, f) || !We(e[f], t[f])) return !1;
    }
    return !0;
  }
  var Dn = class {
    constructor() {
      d(this, 'drag');
      d(this, 'isDestroyed');
      d(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new Y()));
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
        this._emitter.emit(E.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(E.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(E.End, t),
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
        this._emitter.emit(E.Cancel, t),
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
          type: E.Cancel,
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
        this._emitter.emit(E.Destroy, { type: E.Destroy }),
        this._emitter.off());
    }
  };
  var wn = class extends Dn {
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
          type: E.Move,
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
      this.isDestroyed || this.drag || (super._start(t), k.on(O.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (k.off(O.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (k.off(O.read, this._tick), super._cancel(t));
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
  var Sr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Ue(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let r of e) {
      let s = t.get(r);
      s !== void 0 && s < n && (n = s);
    }
    return n;
  }
  var ee = {
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
    xn = class extends wn {
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
          startPredicate: r = ee.startPredicate,
          computeSpeed: s = ee.computeSpeed,
          cancelOnVisibilityChange: i = ee.cancelOnVisibilityChange,
          cancelOnBlur: o = ee.cancelOnBlur,
          startKeys: a = ee.startKeys,
          moveLeftKeys: c = ee.moveLeftKeys,
          moveRightKeys: f = ee.moveRightKeys,
          moveUpKeys: l = ee.moveUpKeys,
          moveDownKeys: u = ee.moveDownKeys,
          cancelKeys: h = ee.cancelKeys,
          endKeys: m = ee.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(h)),
          (this._endKeys = new Set(m)),
          (this._moveLeftKeys = new Set(c)),
          (this._moveRightKeys = new Set(f)),
          (this._moveUpKeys = new Set(l)),
          (this._moveDownKeys = new Set(u)),
          (this._moveKeys = new Set([...c, ...f, ...l, ...u])),
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
        let t = Ue(this._moveLeftKeys, this._moveKeyTimestamps),
          n = Ue(this._moveRightKeys, this._moveKeyTimestamps),
          r = Ue(this._moveUpKeys, this._moveKeyTimestamps),
          s = Ue(this._moveDownKeys, this._moveKeyTimestamps),
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
              ((r.type = E.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
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
          ((n.type = E.End),
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
          Sr.forEach((a, c) => {
            let f = `${a}Keys`,
              l = t[f];
            l !== void 0 && ((this[`_${f}`] = new Set(l)), c >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((c, f) => a[f] === c)) ||
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
  var Ge = new Map(),
    Qe = [],
    vt = [],
    _t = [],
    bt = [],
    St = [],
    Dt = [],
    wt = [],
    xt = [];
  function En() {
    (Ge.clear(),
      (Qe.length = 0),
      (vt.length = 0),
      (_t.length = 0),
      (bt.length = 0),
      (St.length = 0),
      (Dt.length = 0),
      (wt.length = 0),
      (xt.length = 0));
  }
  function Cn(e) {
    let t = [];
    En();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = X(r),
        a = de(r),
        c = a ? o.transformOrigin : '',
        f,
        l;
      if (r instanceof SVGSVGElement) ((f = `${i.width}px`), (l = `${i.height}px`));
      else {
        let m = parseFloat(o.width),
          b = parseFloat(o.height);
        if (!(m >= 0) || !(b >= 0)) ((f = `${i.width}px`), (l = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((f = o.width), (l = o.height));
        else {
          let C = parseFloat(o.paddingLeft) || 0,
            A = parseFloat(o.paddingRight) || 0,
            K = parseFloat(o.borderLeftWidth) || 0,
            g = parseFloat(o.borderRightWidth) || 0,
            x = parseFloat(o.paddingTop) || 0,
            v = parseFloat(o.paddingBottom) || 0,
            _ = parseFloat(o.borderTopWidth) || 0,
            H = parseFloat(o.borderBottomWidth) || 0;
          ((f = `${m + C + A + K + g}px`), (l = `${b + x + v + _ + H}px`));
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
        (Qe[n] = s),
        (t[n] = u),
        (vt[n] = i),
        (_t[n] = a),
        (bt[n] = c),
        (St[n] = f),
        (Dt[n] = l),
        Ge.has(s) || Ge.set(s, Me(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Qe[n],
        s = t[n],
        i = _t[n],
        o = bt[n],
        a = St[n],
        c = Dt[n],
        f = s.style;
      ((f.width = a),
        (f.height = c),
        i && ((f.transform = i), o && (f.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Qe[n],
        s = t[n],
        i = vt[n],
        o = Ge.get(r),
        a = 0,
        c = 0,
        f = o.m11,
        l = o.m12,
        u = o.m21,
        h = o.m22,
        m = f * h - l * u,
        b = s.getBoundingClientRect(),
        C = i.left - b.left,
        A = i.top - b.top;
      if (Math.abs(m) < 1e-10) ((a = C), (c = A));
      else {
        let K = 1 / m;
        ((a = (h * C - u * A) * K), (c = (-l * C + f * A) * K));
      }
      ((wt[n] = a), (xt[n] = c));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = wt[n],
        i = xt[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (En(), t);
  }
  function On(e, t) {
    if (ne) return () => null;
    let n = y(() => (Array.isArray(e) ? Ut(e) : (F(e) ?? [])).filter((v) => !!v)),
      r = y(() => F(t)),
      s = y(() => r()?.id),
      i = y(() => r()?.dndObserver),
      o = y(() => {
        let v = r();
        if (!v) return;
        let {
          dndObserver: _,
          id: H,
          dragPreviewContainer: Re,
          dragPreviewExitTimeout: N,
          ...Q
        } = v;
        return Q;
      }),
      a = pe(),
      c = y(() => {
        let v = i();
        return v === void 0 ? a() : v;
      }),
      [f, l] = P(null),
      u = null,
      h = s(),
      m = o(),
      b = c(),
      C = o(),
      A = r()?.dragPreviewContainer,
      K = r()?.dragPreviewExitTimeout;
    M(() => {
      let v = r();
      ((C = o()), (A = v?.dragPreviewContainer), (K = v?.dragPreviewExitTimeout));
    });
    let g = () => {
        u && (u.destroy(), (u = null), (m = void 0), l(null));
      },
      x = () => {
        Kt(() => {
          g();
          let v = $(n);
          if (!v.length) return;
          let _ = $(o),
            H = s(),
            Re = _?.dragPreview,
            N = new mt(v, {
              id: H,
              ..._,
              elements(V) {
                let Et = C,
                  ge = (Et?.elements || (() => null))(V);
                if (!Et?.dragPreview || !ge || ge.length === 0) return ge;
                let me = Cn(ge);
                we.add(V.draggable, ge, me);
                let Ct = () => {
                    let Ot = K || 0;
                    if (Ot > 0) {
                      for (let Ze of me) Ze.dataset.exiting = 'true';
                      let Le = !1,
                        Mt = () => {
                          Le ||
                            ((Le = !0),
                            clearTimeout(Ln),
                            we.remove(V.draggable),
                            setTimeout(() => {
                              for (let Ze of me) Ze.remove();
                            }, 0));
                        },
                        Ln = setTimeout(Mt, Ot);
                      we.startExiting(V.draggable, Mt);
                    } else
                      (we.remove(V.draggable),
                        setTimeout(() => {
                          for (let Le of me) Le.remove();
                        }, 0));
                    (V.draggable.off('end', In), V.draggable.off('destroy', Rn));
                  },
                  In = V.draggable.on('end', Ct),
                  Rn = V.draggable.on('destroy', Ct);
                return me;
              },
              ...(Re
                ? {
                    container: () => {
                      let V = A;
                      return (typeof V == 'function' ? V() : V) || document.body;
                    },
                  }
                : {}),
            }),
            Q = $(c);
          (Q?.addDraggables([N]), (u = N), (h = H), (m = _), (b = Q), l(N));
        });
      };
    return (
      M(() => {
        let v = n();
        if (!v.length) {
          g();
          return;
        }
        let _ = u;
        if (!_) {
          x();
          return;
        }
        (v.length !== _.sensors.length || v.some((H) => !_.sensors.includes(H))) && x();
      }),
      M(() => {
        if (!u) return;
        let _ = s();
        h !== _ && x();
      }),
      M(() => {
        let v = c();
        if (b === v) return;
        let _ = u;
        (_ && (b?.removeDraggables([_]), v?.addDraggables([_])), (b = v));
      }),
      M(() => {
        let v = u;
        if (!v) return;
        let _ = o(),
          H = !1;
        if (m) {
          let N = { ...m },
            Q = { ..._ };
          ((N.elements === Q.elements || (N.dragPreview && Q.dragPreview)) &&
            (delete N.elements, delete Q.elements),
            (H = !We(N, Q)));
        } else H = !0;
        if (!H) return;
        let Re = v._parseSettings(_);
        if (
          (v.updateSettings({
            ...Re,
            ...(!_?.dragPreview && _?.elements ? { elements: _.elements } : {}),
            ...(_?.dragPreview
              ? {
                  container: () => {
                    let N = A;
                    return (typeof N == 'function' ? N() : N) || document.body;
                  },
                }
              : {}),
          }),
          m)
        ) {
          let N = _?.dndGroups !== m.dndGroups,
            Q = _?.computeClientRect !== m.computeClientRect;
          (N && b?.clearTargets(v), (N || Q) && b?.detectCollisions(v));
        }
        m = _;
      }),
      R(g),
      f
    );
  }
  function Mn(e, t = !1) {
    let n = y(() => F(e)),
      [r, s] = P(null),
      [i, o] = P(0);
    return (
      M(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let c = a.on(D.Start, () => {
            s(a.drag || null);
          }),
          f = null;
        t &&
          (f = a.on(D.Move, () => {
            a.drag && o((u) => (u + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let l = a.on(D.End, () => {
          s(null);
        });
        R(() => {
          (a.off(D.Start, c), f && a.off(D.Move, f), a.off(D.End, l));
        });
      }),
      y(() => (i(), r()))
    );
  }
  function kn(e) {
    if (ne) return [() => null, () => {}];
    let t = y(() => F(e)),
      n = y(() => t()?.element),
      r = y(() => t()?.dndObserver),
      s = y(() => t()?.id),
      i = y(() => t()?.accept),
      o = y(() => t()?.data),
      a = y(() => t()?.computeClientRect),
      c = pe(),
      f = y(() => {
        let g = r();
        return g === void 0 ? c() : g;
      }),
      [l, u] = P(null),
      h = null,
      m = s(),
      b = f(),
      C = () => {
        h && (h.destroy(), (h = null), u(null));
      },
      A = (g) => {
        C();
        let x = { id: s(), accept: i(), data: o() },
          v = new vn(g, x);
        ((h = v), (m = x.id));
        let _ = f();
        (_ && _.addDroppables([v]), (b = _), u(v));
      },
      K = (g) => {
        if (n() === void 0) {
          if (g === null) {
            C();
            return;
          }
          h?.element !== g && A(g);
        }
      };
    return (
      M(() => {
        let g = n();
        if (g !== void 0) {
          if (g === null) {
            C();
            return;
          }
          (A(g), R(C));
        }
      }),
      M(() => {
        let g = h;
        if (!g) return;
        let x = s();
        m !== x && g.element && A(g.element);
      }),
      M(() => {
        let g = f();
        if (b === g) return;
        let x = h;
        (x && (b?.removeDroppables([x]), g?.addDroppables([x])), (b = g));
      }),
      M(() => {
        let g = h;
        if (!g) return;
        let x = i() || (() => !0);
        ((g.accept = x), b?.detectCollisions());
      }),
      M(() => {
        let g = h;
        g && (g.data = o() || {});
      }),
      M(() => {
        let g = h;
        if (!g) return;
        let x = a();
        (x && (g.computeClientRect = x), b?.detectCollisions());
      }),
      R(C),
      [l, K]
    );
  }
  function Tn(e = {}, t) {
    if (ne) return [() => null, () => {}];
    let n = y(() => F(e, {}) || {}),
      r = y(() => (t === void 0 ? void 0 : F(t))),
      [s, i] = P(null),
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
        let u = new xn(l, n());
        ((o = u), i(u));
      };
    (M(() => {
      let l = o;
      l && l.updateSettings(n());
    }),
      M(() => {
        let l = r();
        l !== void 0 && (c(l), R(a));
      }));
    let f = (l) => {
      if (t === void 0) {
        if (l === null) {
          a();
          return;
        }
        o?.element !== l && c(l);
      }
    };
    return (R(a), [s, f]);
  }
  function An(e = {}, t) {
    if (ne) return [() => null, () => {}];
    let n = y(() => F(e, {}) || {}),
      r = y(() => (t === void 0 ? void 0 : F(t))),
      [s, i] = P(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      c = (l) => {
        o?.destroy();
        let u = new Ce(l, n());
        ((o = u), i(u));
      };
    (M(() => {
      let l = o;
      l && l.updateSettings(n());
    }),
      M(() => {
        let l = r();
        if (l !== void 0) {
          if (l === null) {
            a();
            return;
          }
          (c(l), R(a));
        }
      }));
    let f = (l) => {
      if (t === void 0) {
        if (!l) {
          a();
          return;
        }
        o?.element !== l && c(l);
      }
    };
    return (R(a), [s, f]);
  }
  var Dr = De(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    wr = De('<div class=droppable>'),
    xr = De('<div class=draggables>'),
    Er = De('<div class=droppables>'),
    Cr = 1;
  function Or() {
    let e = null,
      [t, n] = P(1),
      [r, s] = An(),
      [i, o] = Tn(),
      a = On([r, i], {
        elements: () => (e ? [e] : []),
        startPredicate: () => !e?.classList.contains('dragging'),
        onStart: () => {
          n(++Cr);
        },
      }),
      c = Mn(a);
    return (() => {
      var f = Dr();
      return (
        ot((l) => {
          ((e = l), s(l), o(l));
        }, f),
        oe(
          (l) => {
            var u = `card draggable ${c() ? 'dragging' : ''}`,
              h = t();
            return (u !== l.e && Yt(f, (l.e = u)), h !== l.t && Xt(f, 'z-index', (l.t = h)), l);
          },
          { e: void 0, t: void 0 },
        ),
        f
      );
    })();
  }
  function Mr() {
    let [e, t] = kn({ data: { overIds: new Set(), droppedIds: new Set() } });
    return (() => {
      var n = wr();
      return (ot(t, n), n);
    })();
  }
  var kr = [0, 1, 2, 3],
    Tr = [0, 1, 2, 3];
  function Ar() {
    let e = bn({
      onStart: (t) => {
        let { draggable: n, targets: r } = t;
        r.forEach((s) => {
          (s.data.droppedIds.delete(n.id),
            s.data.droppedIds.size === 0 && s.element?.classList.remove('draggable-dropped'));
        });
      },
      onCollide: (t) => {
        let { draggable: n, contacts: r, removedContacts: s } = t;
        s.forEach((o) => {
          (o.data.overIds.delete(n.id),
            o.data.overIds.size === 0 && o.element?.classList.remove('draggable-over'));
        });
        let i = 0;
        for (let o of r)
          (i === 0
            ? (o.data.overIds.add(n.id), o.element?.classList.add('draggable-over'))
            : (o.data.overIds.delete(n.id),
              o.data.overIds.size === 0 && o.element?.classList.remove('draggable-over')),
            ++i);
      },
      onEnd: (t) => {
        let { draggable: n, contacts: r } = t;
        for (let s of r) {
          (s.data.droppedIds.add(n.id),
            s.element?.classList.add('draggable-dropped'),
            s.data.overIds.delete(n.id),
            s.data.overIds.size === 0 && s.element?.classList.remove('draggable-over'));
          return;
        }
      },
    });
    return ae(Ve.Provider, {
      value: e,
      get children() {
        return [
          (() => {
            var t = xr();
            return (He(t, ae(Ne, { each: kr, children: () => ae(Or, {}) })), t);
          })(),
          (() => {
            var t = Er();
            return (He(t, ae(Ne, { each: Tr, children: () => ae(Mr, {}) })), t);
          })(),
        ];
      },
    });
  }
  var Pn = document.getElementById('root');
  if (!Pn) throw new Error('Failed to find the root element');
  qt(() => ae(Ar, {}), Pn);
})();
