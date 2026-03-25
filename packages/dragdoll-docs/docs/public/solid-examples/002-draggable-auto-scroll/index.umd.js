'use strict';
var SolidExample_002_draggable_auto_scroll = (() => {
  var Ei = Object.defineProperty;
  var Di = (e, t, n) =>
    t in e ? Ei(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var c = (e, t, n) => Di(e, typeof t != 'symbol' ? t + '' : t, n);
  var P = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return tn(this.context.count);
    },
    getNextContextId() {
      return tn(this.context.count++);
    },
  };
  function tn(e) {
    let t = String(e),
      n = t.length - 1;
    return P.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function bt(e) {
    P.context = e;
  }
  function Ci() {
    return { ...P.context, id: P.getNextContextId(), count: 0 };
  }
  var Mi = !1,
    Oi = (e, t) => e === t;
  var nt = { equals: Oi },
    nn = null,
    an = mn,
    G = 1,
    Le = 2,
    ln = { owned: null, cleanups: null, context: null, owner: null };
  var _ = null,
    f = null,
    qe = null,
    ke = null,
    E = null,
    A = null,
    B = null,
    rt = 0;
  function cn(e, t) {
    let n = E,
      i = _,
      r = e.length === 0,
      s = t === void 0 ? i : t,
      o = r ? ln : { owned: null, cleanups: null, context: s ? s.context : null, owner: s },
      a = r ? e : () => e(() => j(() => fe(o)));
    ((_ = o), (E = null));
    try {
      return oe(a, !0);
    } finally {
      ((E = n), (_ = i));
    }
  }
  function Q(e, t) {
    t = t ? Object.assign({}, nt, t) : nt;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      i = (r) => (
        typeof r == 'function' &&
          (f && f.running && f.sources.has(n) ? (r = r(n.tValue)) : (r = r(n.value))),
        fn(n, r)
      );
    return [hn.bind(n), i];
  }
  function me(e, t, n) {
    let i = Et(e, t, !1, G);
    qe && f && f.running ? A.push(i) : Be(i);
  }
  function I(e, t, n) {
    an = Ri;
    let i = Et(e, t, !1, G),
      r = St && wt(St);
    (r && (i.suspense = r), (!n || !n.render) && (i.user = !0), B ? B.push(i) : Be(i));
  }
  function C(e, t, n) {
    n = n ? Object.assign({}, nt, n) : nt;
    let i = Et(e, t, !0, 0);
    return (
      (i.observers = null),
      (i.observerSlots = null),
      (i.comparator = n.equals || void 0),
      qe && f && f.running ? ((i.tState = G), A.push(i)) : Be(i),
      hn.bind(i)
    );
  }
  function un(e) {
    return oe(e, !1);
  }
  function j(e) {
    if (!ke && E === null) return e();
    let t = E;
    E = null;
    try {
      return ke ? ke.untrack(e) : e();
    } finally {
      E = t;
    }
  }
  function J(e) {
    return (_ === null || (_.cleanups === null ? (_.cleanups = [e]) : _.cleanups.push(e)), e);
  }
  function Ti(e) {
    if (f && f.running) return (e(), f.done);
    let t = E,
      n = _;
    return Promise.resolve().then(() => {
      ((E = t), (_ = n));
      let i;
      return (
        (qe || St) &&
          ((i =
            f ||
            (f = {
              sources: new Set(),
              effects: [],
              promises: new Set(),
              disposed: new Set(),
              queue: new Set(),
              running: !0,
            })),
          i.done || (i.done = new Promise((r) => (i.resolve = r))),
          (i.running = !0)),
        oe(e, !1),
        (E = _ = null),
        i ? i.done : void 0
      );
    });
  }
  var [Sr, rn] = Q(!1);
  function dn(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Li(n), defaultValue: e };
  }
  function wt(e) {
    let t;
    return _ && _.context && (t = _.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function ki(e) {
    let t = C(e),
      n = C(() => xt(t()));
    return (
      (n.toArray = () => {
        let i = n();
        return Array.isArray(i) ? i : i != null ? [i] : [];
      }),
      n
    );
  }
  var St;
  function hn() {
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === G) Be(this);
      else {
        let t = A;
        ((A = null), oe(() => it(this), !1), (A = t));
      }
    if (E) {
      let t = this.observers ? this.observers.length : 0;
      (E.sources
        ? (E.sources.push(this), E.sourceSlots.push(t))
        : ((E.sources = [this]), (E.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(E), this.observerSlots.push(E.sources.length - 1))
          : ((this.observers = [E]), (this.observerSlots = [E.sources.length - 1])));
    }
    return e && f.sources.has(this) ? this.tValue : this.value;
  }
  function fn(e, t, n) {
    let i = f && f.running && f.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(i, t)) {
      if (f) {
        let r = f.running;
        ((r || (!n && f.sources.has(e))) && (f.sources.add(e), (e.tValue = t)), r || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        oe(() => {
          for (let r = 0; r < e.observers.length; r += 1) {
            let s = e.observers[r],
              o = f && f.running;
            (o && f.disposed.has(s)) ||
              ((o ? !s.tState : !s.state) && (s.pure ? A.push(s) : B.push(s), s.observers && gn(s)),
              o ? (s.tState = G) : (s.state = G));
          }
          if (A.length > 1e6) throw ((A = []), new Error());
        }, !1);
    }
    return t;
  }
  function Be(e) {
    if (!e.fn) return;
    fe(e);
    let t = rt;
    (sn(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          oe(() => {
            (f && (f.running = !0), (E = _ = e), sn(e, e.tValue, t), (E = _ = null));
          }, !1);
        }));
  }
  function sn(e, t, n) {
    let i,
      r = _,
      s = E;
    E = _ = e;
    try {
      i = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = G), e.tOwned && e.tOwned.forEach(fe), (e.tOwned = void 0))
            : ((e.state = G), e.owned && e.owned.forEach(fe), (e.owned = null))),
        (e.updatedAt = n + 1),
        Dt(o)
      );
    } finally {
      ((E = s), (_ = r));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? fn(e, i, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = i), f.sources.add(e), (e.tValue = i))
          : (e.value = i),
      (e.updatedAt = n));
  }
  function Et(e, t, n, i = G, r) {
    let s = {
      fn: e,
      state: i,
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
      (f && f.running && ((s.state = 0), (s.tState = i)),
      _ === null ||
        (_ !== ln &&
          (f && f.running && _.pure
            ? _.tOwned
              ? _.tOwned.push(s)
              : (_.tOwned = [s])
            : _.owned
              ? _.owned.push(s)
              : (_.owned = [s]))),
      ke && s.fn)
    ) {
      let o = s.fn,
        [a, l] = Q(void 0, { equals: !1 }),
        d = ke.factory(o, l);
      J(() => d.dispose());
      let u,
        h = () =>
          Ti(l).then(() => {
            u && (u.dispose(), (u = void 0));
          });
      s.fn = (m) => (a(), f && f.running ? (u || (u = ke.factory(o, h)), u.track(m)) : d.track(m));
    }
    return s;
  }
  function Fe(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === Le) return it(e);
    if (e.suspense && j(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < rt); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let i = n.length - 1; i >= 0; i--) {
      if (((e = n[i]), t)) {
        let r = e,
          s = n[i + 1];
        for (; (r = r.owner) && r !== s; ) if (f.disposed.has(r)) return;
      }
      if ((t ? e.tState : e.state) === G) Be(e);
      else if ((t ? e.tState : e.state) === Le) {
        let r = A;
        ((A = null), oe(() => it(e, n[0]), !1), (A = r));
      }
    }
  }
  function oe(e, t) {
    if (A) return e();
    let n = !1;
    (t || (A = []), B ? (n = !0) : (B = []), rt++);
    try {
      let i = e();
      return (Pi(n), i);
    } catch (i) {
      (n || (B = null), (A = null), Dt(i));
    }
  }
  function Pi(e) {
    if ((A && (qe && f && f.running ? Ai(A) : mn(A), (A = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let i = f.sources,
          r = f.disposed;
        (B.push.apply(B, f.effects), (t = f.resolve));
        for (let s of B) ('tState' in s && (s.state = s.tState), delete s.tState);
        ((f = null),
          oe(() => {
            for (let s of r) fe(s);
            for (let s of i) {
              if (((s.value = s.tValue), s.owned))
                for (let o = 0, a = s.owned.length; o < a; o++) fe(s.owned[o]);
              (s.tOwned && (s.owned = s.tOwned), delete s.tValue, delete s.tOwned, (s.tState = 0));
            }
            rn(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, B), (B = null), rn(!0));
        return;
      }
    }
    let n = B;
    ((B = null), n.length && oe(() => an(n), !1), t && t());
  }
  function mn(e) {
    for (let t = 0; t < e.length; t++) Fe(e[t]);
  }
  function Ai(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        i = f.queue;
      i.has(n) ||
        (i.add(n),
        qe(() => {
          (i.delete(n),
            oe(() => {
              ((f.running = !0), Fe(n));
            }, !1),
            f && (f.running = !1));
        }));
    }
  }
  function Ri(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let i = e[t];
      i.user ? (e[n++] = i) : Fe(i);
    }
    if (P.context) {
      if (P.count) {
        (P.effects || (P.effects = []), P.effects.push(...e.slice(0, n)));
        return;
      }
      bt();
    }
    for (
      P.effects &&
        (P.done || !P.count) &&
        ((e = [...P.effects, ...e]), (n += P.effects.length), delete P.effects),
        t = 0;
      t < n;
      t++
    )
      Fe(e[t]);
  }
  function it(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let i = 0; i < e.sources.length; i += 1) {
      let r = e.sources[i];
      if (r.sources) {
        let s = n ? r.tState : r.state;
        s === G ? r !== t && (!r.updatedAt || r.updatedAt < rt) && Fe(r) : s === Le && it(r, t);
      }
    }
  }
  function gn(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let i = e.observers[n];
      (t ? !i.tState : !i.state) &&
        (t ? (i.tState = Le) : (i.state = Le),
        i.pure ? A.push(i) : B.push(i),
        i.observers && gn(i));
    }
  }
  function fe(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) fe(e.tOwned[t]);
      delete e.tOwned;
    }
    if (f && f.running && e.pure) pn(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) fe(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    f && f.running ? (e.tState = 0) : (e.state = 0);
  }
  function pn(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) pn(e.owned[n]);
  }
  function Ii(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function on(e, t, n) {
    try {
      for (let i of t) i(e);
    } catch (i) {
      Dt(i, (n && n.owner) || null);
    }
  }
  function Dt(e, t = _) {
    let n = nn && t && t.context && t.context[nn],
      i = Ii(e);
    if (!n) throw i;
    B
      ? B.push({
          fn() {
            on(i, n, t);
          },
          state: G,
        })
      : on(i, n, t);
  }
  function xt(e) {
    if (typeof e == 'function' && !e.length) return xt(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let i = xt(e[n]);
        Array.isArray(i) ? t.push.apply(t, i) : t.push(i);
      }
      return t;
    }
    return e;
  }
  function Li(e, t) {
    return function (i) {
      let r;
      return (
        me(
          () => (r = j(() => ((_.context = { ..._.context, [e]: i.value }), ki(() => i.children)))),
          void 0,
        ),
        r
      );
    };
  }
  var Fi = !1;
  function st(e, t) {
    if (Fi && P.context) {
      let n = P.context;
      bt(Ci());
      let i = j(() => e(t || {}));
      return (bt(n), i);
    }
    return j(() => e(t || {}));
  }
  var Bi = [
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
    Fr = new Set([
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
      ...Bi,
    ]);
  function Ni(e, t, n) {
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
              m = 1,
              g;
            for (; ++h < r && h < s && !((g = d.get(t[h])) == null || g !== u + m); ) m++;
            if (m > u - a) {
              let v = t[o];
              for (; a < u; ) e.insertBefore(n[a++], v);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function _n(e, t, n, i = {}) {
    let r;
    return (
      cn((s) => {
        ((r = s), t === document ? e() : Ot(t, e(), t.firstChild ? null : void 0, n));
      }, i.owner),
      () => {
        (r(), (t.textContent = ''));
      }
    );
  }
  function Mt(e, t, n, i) {
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
        ? () => j(() => document.importNode(r || (r = s()), !0))
        : () => (r || (r = s())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function vn(e, t) {
    Sn(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function bn(e, t, n) {
    return j(() => e(t, n));
  }
  function Ot(e, t, n, i) {
    if ((n !== void 0 && !i && (i = []), typeof t != 'function')) return ot(e, t, i, n);
    me((r) => ot(e, t(), r, n), i);
  }
  function Sn(e) {
    return !!P.context && !P.done && (!e || e.isConnected);
  }
  function ot(e, t, n, i, r) {
    let s = Sn(e);
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
          (n = Pe(e, n, i, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (s) return n;
      n = Pe(e, n, i);
    } else {
      if (o === 'function')
        return (
          me(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = ot(e, l, n, i);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          d = n && Array.isArray(n);
        if (Ct(l, t, n, r)) return (me(() => (n = ot(e, l, n, i, !0))), () => n);
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
          if (((n = Pe(e, n, i)), a)) return n;
        } else d ? (n.length === 0 ? yn(e, l, i) : Ni(e, n, l)) : (n && Pe(e), yn(e, l));
        n = l;
      } else if (t.nodeType) {
        if (s && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = Pe(e, n, i, t));
          Pe(e, n, null, t);
        } else
          n == null || n === '' || !e.firstChild
            ? e.appendChild(t)
            : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Ct(e, t, n, i) {
    let r = !1;
    for (let s = 0, o = t.length; s < o; s++) {
      let a = t[s],
        l = n && n[e.length],
        d;
      if (!(a == null || a === !0 || a === !1))
        if ((d = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) r = Ct(e, a, l) || r;
        else if (d === 'function')
          if (i) {
            for (; typeof a == 'function'; ) a = a();
            r = Ct(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || r;
          } else (e.push(a), (r = !0));
        else {
          let u = String(a);
          l && l.nodeType === 3 && l.data === u ? e.push(l) : e.push(document.createTextNode(u));
        }
    }
    return r;
  }
  function yn(e, t, n = null) {
    for (let i = 0, r = t.length; i < r; i++) e.insertBefore(t[i], n);
  }
  function Pe(e, t, n, i) {
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
  var Ae = !1;
  var Ki = () => {},
    Z = new Map(),
    kt = new Set();
  function Tt() {
    kt.forEach((e) => e());
  }
  var Ne = {
    add(e, t, n) {
      ((Z = new Map(Z)), Z.set(e, { sources: t, proxies: n, exiting: !1, done: Ki }), Tt());
    },
    startExiting(e, t) {
      let n = Z.get(e);
      n && ((Z = new Map(Z)), Z.set(e, { ...n, exiting: !0, done: t }), Tt());
    },
    remove(e) {
      Z.has(e) && ((Z = new Map(Z)), Z.delete(e), Tt());
    },
    subscribe(e) {
      return (kt.add(e), () => kt.delete(e));
    },
    getSnapshot() {
      return Z;
    },
  };
  var $i = (e) => typeof e == 'function' && e.length === 0;
  function $(e, t) {
    return e === void 0 ? t : $i(e) ? e() : e;
  }
  function xn(e) {
    return e.map((t) => $(t));
  }
  var Wi = () => null,
    wn = dn(Wi);
  var Ke = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ge = class {
      constructor(e = {}) {
        c(this, 'dedupe');
        c(this, 'getId');
        c(this, '_events');
        ((this.dedupe = e.dedupe || Ke.ADD),
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
            case Ke.THROW:
              throw Error('Eventti: duplicate listener id!');
            case Ke.IGNORE:
              return n;
            case Ke.UPDATE:
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
  var Hi = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: i } = e;
      ((this._phases = t),
        (this._emitter = new ge({ getId: i, dedupe: n })),
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
  function Pt(e = 60) {
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
  var En = class extends Hi {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: i = Pt(), ...r } = e;
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
    M = new En({
      phases: [D.read, D.write],
      requestFrame: typeof window < 'u' ? Pt() : () => () => {},
    });
  function Vi(e, t, n = { width: 0, height: 0, x: 0, y: 0 }) {
    let i = Math.max(e.x, t.x),
      r = Math.min(e.x + e.width, t.x + t.width);
    if (r <= i) return null;
    let s = Math.max(e.y, t.y),
      o = Math.min(e.y + e.height, t.y + t.height);
    return o <= s ? null : ((n.x = i), (n.y = s), (n.width = r - i), (n.height = o - s), n);
  }
  var Xi = { width: 0, height: 0, x: 0, y: 0 };
  function At(e, t, n) {
    if ((n || (n = Vi(e, t, Xi)), !n)) return 0;
    let i = n.width * n.height;
    return i ? (i / (Math.min(e.width, t.width) * Math.min(e.height, t.height))) * 100 : 0;
  }
  var b = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  var Dn = new WeakMap();
  function Y(e) {
    let t = Dn.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Dn.set(e, new WeakRef(t))), t);
  }
  var ce = typeof window < 'u' && window.document !== void 0,
    Cn = ce && 'ontouchstart' in window,
    Mn = ce && !!window.PointerEvent;
  ce &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  function On(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Yi(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function ji(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Tn(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function kn(e) {
    return e === 'auto' || e === void 0 ? (Mn ? 'pointer' : Cn ? 'touch' : 'mouse') : e;
  }
  var pe = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    ye = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    $e = class {
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
          listenerOptions: n = ye.listenerOptions,
          sourceEvents: i = ye.sourceEvents,
          startPredicate: r = ye.startPredicate,
          cancelOnVisibilityChange: s = ye.cancelOnVisibilityChange,
          cancelOnEscape: o = ye.cancelOnEscape,
          preventNativeDrag: a = ye.preventNativeDrag,
          preventContextMenu: l = ye.preventContextMenu,
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
          (this._listenerOptions = Tn(n)),
          (this._sourceEvents = kn(i)),
          (this._emitter = new ge()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(pe[this._sourceEvents].start, this._onStart, this._listenerOptions),
          s && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? On(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Yi(e);
        if (t === null) return;
        let n = On(e, t);
        if (n === null) return;
        let i = {
          pointerId: t,
          pointerType: ji(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = i),
          (this._eventData = { ...i, type: b.Start, srcEvent: e, target: n.target }),
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
          (n.type = b.Move),
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
          (n.type = b.Cancel),
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
          (n.type = b.End),
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
        let { move: e, end: t, cancel: n } = pe[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = pe[this._sourceEvents];
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
            pe[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(pe[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          l = kn(n),
          d = Tn(t);
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
              pe[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && d && (this._listenerOptions = d),
            this.element.addEventListener(
              pe[this._sourceEvents].start,
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
            pe[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function zi(e) {
    let t = Y(e),
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
  function Ui(e) {
    let t = Y(e),
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
  function Ee(e, t = !1) {
    let { translate: n, rotate: i, scale: r, transform: s } = Y(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', d] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Ui(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * zi(e)}px`),
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
  function We(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function Rt(e) {
    let t = e.split(' '),
      n = '',
      i = '',
      r = '';
    return (
      t.length === 1 ? (n = i = t[0]) : t.length === 2 ? ([n, i] = t) : ([n, i, r] = t),
      { x: parseFloat(n) || 0, y: parseFloat(i) || 0, z: parseFloat(r) || 0 }
    );
  }
  var De = ce ? new DOMMatrix() : null;
  function He(e, t = new DOMMatrix()) {
    let n = e;
    for (We(t); n; ) {
      let i = Ee(n);
      if (i && (De.setMatrixValue(i), !De.isIdentity)) {
        let { transformOrigin: r } = Y(n),
          { x: s, y: o, z: a } = Rt(r);
        (a === 0
          ? De.setMatrixValue(`translate(${s}px,${o}px) ${De} translate(${s * -1}px,${o * -1}px)`)
          : De.setMatrixValue(
              `translate3d(${s}px,${o}px,${a}px) ${De} translate3d(${s * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(De));
      }
      n = n.parentElement;
    }
    return t;
  }
  var Pn = new WeakMap();
  function R(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Pn.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Pn.set(e, new WeakRef(n))), n);
  }
  var Gi = typeof window < 'u' && window.document !== void 0,
    It = !!(
      Gi &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    x = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    at = { [x.content]: !1, [x.padding]: !1, [x.scrollbar]: !0, [x.border]: !0, [x.margin]: !0 },
    lt = new Set(['auto', 'scroll']),
    An = (() => {
      try {
        return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
      } catch {
        return !1;
      }
    })();
  function ct(e) {
    switch (R(e).display) {
      case 'none':
        return null;
      case 'inline':
      case 'contents':
        return !1;
      default:
        return !0;
    }
  }
  function ut(e) {
    let t = R(e);
    if (!It) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: d } = t;
      if (d && d !== 'none') return !0;
      let { willChange: u } = t;
      if (u && (u.indexOf('filter') > -1 || u.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = ct(e);
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
      ) || !!(It && a && a.indexOf('filter') > -1)
    );
  }
  function Rn(e) {
    return R(e).position !== 'static' || ut(e);
  }
  function Re(e) {
    return e instanceof HTMLHtmlElement;
  }
  function Lt(e, t = {}) {
    if (Re(e)) return e.ownerDocument.defaultView;
    let n = t.position || R(e).position,
      { skipDisplayNone: i, container: r } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let s = r || e.parentElement;
        for (; s; ) {
          let o = ct(s);
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
          let a = s ? ut(o) : Rn(o);
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
  function _e(e) {
    return e instanceof Window;
  }
  function Ft(e, t = {}) {
    let n = R(e),
      { display: i } = n;
    if (i === 'none' || i === 'contents') return null;
    let r = t.position || R(e).position,
      { skipDisplayNone: s, container: o } = t;
    switch (r) {
      case 'relative':
        return e;
      case 'fixed':
        return Lt(e, { container: o, position: r, skipDisplayNone: s });
      case 'absolute': {
        let a = Lt(e, { container: o, position: r, skipDisplayNone: s });
        return _e(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Qi(e, t) {
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
  function qt(e) {
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
  function In(e, t, n = null) {
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
  function dt(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Ln = class {
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
    Bn = class {
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
          (this._matrixCache = new Ln()),
          (this._clientOffsetCache = new Ln()));
      }
    };
  function Ji(e, t, n = !1) {
    let { style: i } = e;
    for (let r in t) i.setProperty(r, t[r], n ? 'important' : '');
  }
  function Zi() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Ji(
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
  function Xe(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: i } = e.getBoundingClientRect(),
      r = Y(e);
    return (
      (t.x = n + (parseFloat(r.borderLeftWidth) || 0)),
      (t.y = i + (parseFloat(r.borderTopWidth) || 0)),
      t
    );
  }
  function Fn(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var er = { x: 0, y: 0 },
    tr = { x: 0, y: 0 };
  function nr(e, t, n = { x: 0, y: 0 }) {
    let i = Fn(e) ? e : Xe(e, er),
      r = Fn(t) ? t : Xe(t, tr);
    return ((n.x = r.x - i.x), (n.y = r.y - i.y), n);
  }
  var ht = ce ? Zi() : null,
    Nn = class {
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
        let i = Y(e),
          r = e.getBoundingClientRect(),
          s = Ee(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Rt(i.transformOrigin)),
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
        let d = Ft(e) || e;
        ((this.elementOffsetContainer = d),
          (this.dragOffsetContainer = l === o ? d : Ft(e, { container: l })));
        {
          let { width: h, height: m, x: g, y: v } = r;
          this.clientRect = { width: h, height: m, x: g, y: v };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let u = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: i });
        if (Array.isArray(u))
          if (u.length) {
            let h = {};
            for (let m of u) h[m] = i[m];
            this.frozenStyles = h;
          } else this.frozenStyles = null;
        else this.frozenStyles = u;
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
              [n, i] = t;
            (He(e, n), i.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
              let m = o.get(d);
              u instanceof HTMLElement && m && !m[0].isIdentity
                ? qt(m[0])
                  ? (ht.style.setProperty('transform', m[1].toString(), 'important'),
                    u.append(ht),
                    Xe(ht, h),
                    ht.remove())
                  : (Xe(u, h), (h.x -= m[0].m41), (h.y -= m[0].m42))
                : Xe(u, h);
            }
            return (s.set(u, h), h);
          });
          nr(a, l, r);
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
    qn = { capture: !0, passive: !0 },
    ir = { x: 0, y: 0 },
    ne = ce ? new DOMMatrix() : null,
    ft = ce ? new DOMMatrix() : null,
    ee = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(ee || {}),
    te = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(te || {}),
    Ve = { Start: 'start', Move: 'move', End: 'end' },
    Ye = { Immediate: 'immediate', Sampled: 'sampled' },
    ue = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    F = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    Kn = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === ue.End || t === ue.EndAlign,
          [i, r] = e.getContainerMatrix(),
          [s, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: d,
            elementTransformMatrix: u,
            elementTransformOrigin: h,
            elementOffsetMatrix: m,
          } = e,
          { x: g, y: v, z: T } = h,
          k = !u.isIdentity && (g !== 0 || v !== 0 || T !== 0),
          q = a.x + l.x + d.x,
          z = a.y + l.y + d.y;
        (We(ne),
          k && (T === 0 ? ne.translateSelf(-g, -v) : ne.translateSelf(-g, -v, -T)),
          n ? r.isIdentity || ne.multiplySelf(r) : o.isIdentity || ne.multiplySelf(o),
          We(ft).translateSelf(q, z),
          ne.multiplySelf(ft),
          i.isIdentity || ne.multiplySelf(i),
          k && (We(ft).translateSelf(g, v, T), ne.multiplySelf(ft)),
          u.isIdentity || ne.multiplySelf(u),
          m.isIdentity || ne.preMultiplySelf(m),
          (e.element.style.transform = `${ne}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Ye.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    Bt = class {
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
          (this._emitter = new ge()),
          (this._startPhase = ee.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: Ve.Start }),
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
          predicateState: te.Pending,
          predicateEvent: null,
          onMove: (i) => this._onMove(i, e),
          onEnd: (i) => this._onEnd(i, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(b.Start, t, t), e.on(b.Move, t, t), e.on(b.Cancel, n, n), e.on(b.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: i } = t;
        (e.off(b.Start, n),
          e.off(b.Move, n),
          e.off(b.Cancel, i),
          e.off(b.End, i),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = Kn) {
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
          preventTextSelection: m = t.preventTextSelection,
          capturePointer: g = t.capturePointer,
          onPrepareStart: v = t.onPrepareStart,
          onStart: T = t.onStart,
          onPrepareMove: k = t.onPrepareMove,
          onMove: q = t.onMove,
          onEnd: z = t.onEnd,
          onDestroy: re = t.onDestroy,
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
          preventTextSelection: m,
          capturePointer: g,
          onPrepareStart: v,
          onStart: T,
          onPrepareMove: k,
          onMove: q,
          onEnd: z,
          onDestroy: re,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case te.Pending: {
              n.predicateEvent = e;
              let i = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              i === !0 ? this.resolveStartPredicate(t) : i === !1 && this.rejectStartPredicate(t);
              break;
            }
            case te.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Ye.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (M.once(D.read, this._prepareMove, this._moveId),
                    M.once(D.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === te.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((i) => {
                ((i.predicateState = te.Pending), (i.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = te.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== ee.Init ||
          ((this._startPhase = ee.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Nn(t, this),
          )),
          this._applyModifiers(Ve.Start, 0, 0),
          this._emit(F.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = ee.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== ee.FinishPrepare)) {
          if (((this._startPhase = ee.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof $e && t.drag) {
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
            (t.dragContainer !== t.elementContainer && In(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: ue.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              i = t.getDragContainerMatrix()[0];
            if (Qi(n, i) || (!qt(n) && !qt(i))) continue;
            let r = t.element.getBoundingClientRect(),
              { alignmentOffset: s } = t;
            ((s.x += dt(t.clientRect.x - r.x, 3)), (s.y += dt(t.clientRect.y - r.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: ue.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, qn),
            this._emit(F.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = ee.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          i = t.x - n.x,
          r = t.y - n.y;
        (!i && !r) ||
          (this._applyModifiers(Ve.Move, i, r),
          this._emit(F.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: ue.Move, draggable: this, drag: e, item: t }));
          (this._emit(F.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: ue.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: i } = this;
        if (!i) return;
        let r = this.settings.positionModifiers,
          s = this._modifierData;
        s.drag = i;
        for (let o of i.items) {
          let a = ir;
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
        n.predicateState === te.Pending &&
          i &&
          ((this._startPhase = ee.Init),
          (n.predicateState = te.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Bn(e, i)),
          this._sensorData.forEach((r, s) => {
            s !== e && ((r.predicateState = te.Rejected), (r.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Ye.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (M.once(D.read, this._prepareStart, this._startId),
              M.once(D.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === te.Pending &&
          ((t.predicateState = te.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === ee.Prepare || this._startPhase === ee.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = ee.None),
          M.off(D.read, this._startId),
          M.off(D.write, this._startId),
          M.off(D.read, this._moveId),
          M.off(D.write, this._moveId),
          M.off(D.read, this._alignId),
          M.off(D.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, qn),
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
        this._applyModifiers(Ve.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (In(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let i in n.unfrozenStyles) n.element.style[i] = n.unfrozenStyles[i] || '';
          this.settings.applyPosition({ phase: ue.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let i = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = dt(n.clientRect.x - i.x, 3)),
              (n.alignmentOffset.y = dt(n.clientRect.y - i.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: ue.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(F.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Ye.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (M.once(D.read, this._prepareAlign, this._alignId),
              M.once(D.write, this._applyAlign, this._alignId)));
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
          this._emit(F.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  function $n() {
    return wt(wn);
  }
  var rr = Object.prototype.hasOwnProperty,
    Wn = (e) => {
      if (e === null || typeof e != 'object') return !1;
      let t = Object.getPrototypeOf(e);
      return t === Object.prototype || t === null;
    };
  function Ie(e, t) {
    if (Object.is(e, t)) return !0;
    if (e === null || t === null || typeof e != 'object' || typeof t != 'object') return !1;
    let n = Array.isArray(e),
      i = Array.isArray(t);
    if (n || i) {
      if (!n || !i) return !1;
      let l = e.length;
      if (l !== t.length) return !1;
      for (let d = 0; d < l; d++) if (!Ie(e[d], t[d])) return !1;
      return !0;
    }
    let r = e instanceof Set,
      s = t instanceof Set;
    if (r || s) {
      if (!r || !s || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!Wn(e) || !Wn(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let d = o[l];
      if (!rr.call(t, d) || !Ie(e[d], t[d])) return !1;
    }
    return !0;
  }
  function je(e, t = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
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
  function Ce(e) {
    return e instanceof Window;
  }
  var Hn = new Set(['auto', 'scroll']);
  function Nt(e, t) {
    let n = t || { x: 0, y: 0, width: 0, height: 0 };
    if (Ce(e))
      return ((n.x = 0), (n.y = 0), (n.width = e.innerWidth), (n.height = e.innerHeight), n);
    let i = e.getBoundingClientRect(),
      r = Y(e),
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
        (Hn.has(r.overflowY) && (d -= Math.max(0, Math.round(d) - h.clientWidth)),
        Hn.has(r.overflowX) && (u -= Math.max(0, Math.round(u) - h.clientHeight))),
      (n.width = d),
      (n.height = u),
      n
    );
  }
  function Vn(e, t) {
    return !(
      e.left + e.width <= t.left ||
      t.left + t.width <= e.left ||
      e.top + e.height <= t.top ||
      t.top + t.height <= e.top
    );
  }
  function ze(e, t, n, i) {
    return Math.sqrt(Math.pow(n - e, 2) + Math.pow(i - t, 2));
  }
  function Xn(e, t) {
    if (Vn(e, t)) return null;
    let n = e.left + e.width,
      i = e.top + e.height,
      r = t.left + t.width,
      s = t.top + t.height;
    return n <= t.left
      ? i <= t.top
        ? ze(n, i, t.left, t.top)
        : e.top >= s
          ? ze(n, e.top, t.left, s)
          : t.left - n
      : e.left >= r
        ? i <= t.top
          ? ze(e.left, i, r, t.top)
          : e.top >= s
            ? ze(e.left, e.top, r, s)
            : e.left - r
        : i <= t.top
          ? t.top - i
          : e.top - s;
  }
  function ve(e) {
    return e instanceof Document;
  }
  var Yn = new Map(),
    Ue = null,
    be = null,
    Ge = null;
  function sr(e, t) {
    let n = e.split('.'),
      i = Yn.get(n[1]);
    return (
      i === void 0 &&
        (Ue || (Ue = document.createElement('style')),
        (Ue.innerHTML = `
      #mezr-scrollbar-test::-webkit-scrollbar {
        width: ${e} !important;
      }
    `),
        (be && Ge) ||
          ((be = document.createElement('div')),
          (Ge = document.createElement('div')),
          be.appendChild(Ge),
          (be.id = 'mezr-scrollbar-test'),
          (be.style.cssText = `
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
          (Ge.style.cssText = `
        all: unset !important;
        position: absolute !important;
        inset: 0 !important;
      `)),
        document.body.appendChild(Ue),
        document.body.appendChild(be),
        (i = be.getBoundingClientRect().width - Ge.getBoundingClientRect().width - t),
        Yn.set(n[1], i),
        document.body.removeChild(be),
        document.body.removeChild(Ue)),
      t + i
    );
  }
  function Se(e, t, n) {
    if (n <= 0) return 0;
    if (An) {
      let i = R(e, '::-webkit-scrollbar'),
        r = t === 'x' ? i.height : i.width,
        s = parseFloat(r);
      if (!Number.isNaN(s) && !Number.isInteger(s)) return sr(r, s);
    }
    return n;
  }
  function jn(e, t = !1) {
    if (t) return e.innerWidth;
    let { innerWidth: n, document: i } = e,
      { documentElement: r } = i,
      { clientWidth: s } = r;
    return n - Se(r, 'y', n - s);
  }
  function zn({ documentElement: e }) {
    return Math.max(e.scrollWidth, e.clientWidth, e.getBoundingClientRect().width);
  }
  function Un(e, t = x.border) {
    let { width: n } = e.getBoundingClientRect();
    if (t === x.border) return n;
    let i = R(e);
    return t === x.margin
      ? ((n += Math.max(0, parseFloat(i.marginLeft) || 0)),
        (n += Math.max(0, parseFloat(i.marginRight) || 0)),
        n)
      : ((n -= parseFloat(i.borderLeftWidth) || 0),
        (n -= parseFloat(i.borderRightWidth) || 0),
        t === x.scrollbar ||
          (!Re(e) && lt.has(i.overflowY) && (n -= Se(e, 'y', Math.round(n) - e.clientWidth)),
          t === x.padding ||
            ((n -= parseFloat(i.paddingLeft) || 0), (n -= parseFloat(i.paddingRight) || 0))),
        n);
  }
  function Kt(e, t = x.border) {
    return _e(e) ? jn(e, at[t]) : ve(e) ? zn(e) : Un(e, t);
  }
  function Gn(e, t = !1) {
    if (t) return e.innerHeight;
    let { innerHeight: n, document: i } = e,
      { documentElement: r } = i,
      { clientHeight: s } = r;
    return n - Se(r, 'x', n - s);
  }
  function Qn({ documentElement: e }) {
    return Math.max(e.scrollHeight, e.clientHeight, e.getBoundingClientRect().height);
  }
  function Jn(e, t = x.border) {
    let { height: n } = e.getBoundingClientRect();
    if (t === x.border) return n;
    let i = R(e);
    return t === x.margin
      ? ((n += Math.max(0, parseFloat(i.marginTop) || 0)),
        (n += Math.max(0, parseFloat(i.marginBottom) || 0)),
        n)
      : ((n -= parseFloat(i.borderTopWidth) || 0),
        (n -= parseFloat(i.borderBottomWidth) || 0),
        t === x.scrollbar ||
          (!Re(e) && lt.has(i.overflowX) && (n -= Se(e, 'x', Math.round(n) - e.clientHeight)),
          t === x.padding ||
            ((n -= parseFloat(i.paddingTop) || 0), (n -= parseFloat(i.paddingBottom) || 0))),
        n);
  }
  function $t(e, t = x.border) {
    return _e(e) ? Gn(e, at[t]) : ve(e) ? Qn(e) : Jn(e, t);
  }
  function Me(e) {
    return e?.constructor === Object;
  }
  function Qe(e, t = x.border) {
    let n = { left: 0, top: 0 };
    if (ve(e)) return n;
    if (_e(e)) return ((n.left += e.scrollX || 0), (n.top += e.scrollY || 0), n);
    let i = e.ownerDocument.defaultView;
    i && ((n.left += i.scrollX || 0), (n.top += i.scrollY || 0));
    let r = e.getBoundingClientRect();
    if (((n.left += r.left), (n.top += r.top), t === x.border)) return n;
    let s = R(e);
    return t === x.margin
      ? ((n.left -= Math.max(0, parseFloat(s.marginLeft) || 0)),
        (n.top -= Math.max(0, parseFloat(s.marginTop) || 0)),
        n)
      : ((n.left += parseFloat(s.borderLeftWidth) || 0),
        (n.top += parseFloat(s.borderTopWidth) || 0),
        t === x.scrollbar ||
          t === x.padding ||
          ((n.left += parseFloat(s.paddingLeft) || 0), (n.top += parseFloat(s.paddingTop) || 0)),
        n);
  }
  function Zn(e, t) {
    let n = Me(e) ? { left: e.left, top: e.top } : Array.isArray(e) ? Qe(...e) : Qe(e);
    if (t && !ve(t)) {
      let i = Me(t) ? t : Array.isArray(t) ? Qe(t[0], t[1]) : Qe(t);
      ((n.left -= i.left), (n.top -= i.top));
    }
    return n;
  }
  function ei(e, t) {
    let n = 0,
      i = 0;
    Me(e)
      ? ((n = e.width), (i = e.height))
      : Array.isArray(e)
        ? ((n = Kt(...e)), (i = $t(...e)))
        : ((n = Kt(e)), (i = $t(e)));
    let r = Zn(e, t);
    return { width: n, height: i, ...r, right: r.left + n, bottom: r.top + i };
  }
  function Wt(e) {
    return Me(e) ? e : ei(e);
  }
  function ti(e, t) {
    let n = Wt(e),
      i = Wt(t);
    return Xn(n, i);
  }
  var or = je(),
    ar = je();
  function lr(e, t) {
    return ti(je(e, or), je(t, ar));
  }
  function ni(e) {
    return Ce(e) || e === document.documentElement || e === document.body ? window : e;
  }
  function Je(e) {
    return Ce(e) ? e.scrollX : e.scrollLeft;
  }
  function ii(e) {
    return (Ce(e) && (e = document.documentElement), e.scrollWidth - e.clientWidth);
  }
  function Ze(e) {
    return Ce(e) ? e.scrollY : e.scrollTop;
  }
  function ri(e) {
    return (Ce(e) && (e = document.documentElement), e.scrollHeight - e.clientHeight);
  }
  function si(e, t) {
    return !(
      e.x + e.width <= t.x ||
      t.x + t.width <= e.x ||
      e.y + e.height <= t.y ||
      t.y + t.height <= e.y
    );
  }
  var oi = class {
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
    ai = { width: 0, height: 0, x: 0, y: 0 },
    li = { width: 0, height: 0, x: 0, y: 0 },
    ae = {
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
    y = { x: 1, y: 2 },
    Oe = { forward: 4, reverse: 8 },
    mt = { none: 0, left: y.x | Oe.reverse, right: y.x | Oe.forward },
    et = { none: 0, up: y.y | Oe.reverse, down: y.y | Oe.forward },
    O = { ...mt, ...et };
  function Ht(e) {
    switch (e) {
      case mt.none:
      case et.none:
        return 'none';
      case mt.left:
        return 'left';
      case mt.right:
        return 'right';
      case et.up:
        return 'up';
      case et.down:
        return 'down';
      default:
        throw Error(`Unknown direction value: ${e}`);
    }
  }
  function ci(e, t, n) {
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
  function gt(e, t) {
    return Math.ceil(e) >= Math.floor(t);
  }
  function Vt(e, t) {
    return Math.min(t / 2, e);
  }
  function Xt(e, t, n, i) {
    return Math.max(0, n + e * 2 + i * t - i) / 2;
  }
  var cr = class {
      constructor() {
        c(this, 'positionX');
        c(this, 'positionY');
        c(this, 'directionX');
        c(this, 'directionY');
        c(this, 'overlapCheckRequestTime');
        ((this.positionX = 0),
          (this.positionY = 0),
          (this.directionX = O.none),
          (this.directionY = O.none),
          (this.overlapCheckRequestTime = 0));
      }
    },
    ur = class {
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
        (y.x & e.direction
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
          ((this.scrollLeft = this.requestX ? this.requestX.value : Je(this.element)),
          (this.scrollTop = this.requestY ? this.requestY.value : Ze(this.element)));
      }
      scroll() {
        this.element &&
          (this.element.scrollTo
            ? this.element.scrollTo(this.scrollLeft, this.scrollTop)
            : ((this.element.scrollLeft = this.scrollLeft),
              (this.element.scrollTop = this.scrollTop)));
      }
    },
    dr = class {
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
        return Oe.forward & this.direction ? gt(this.value, this.maxValue) : this.value <= 0;
      }
      computeCurrentScrollValue() {
        return this.element
          ? this.value === this.value
            ? Math.max(0, Math.min(this.value, this.maxValue))
            : y.x & this.direction
              ? Je(this.element)
              : Ze(this.element)
          : 0;
      }
      computeNextScrollValue() {
        let e = this.speed * (this.deltaTime / 1e3),
          t = Oe.forward & this.direction ? this.value + e : this.value - e;
        return Math.max(0, Math.min(t, this.maxValue));
      }
      computeSpeed() {
        if (!this.item || !this.element) return 0;
        let { speed: e } = this.item;
        return typeof e == 'function'
          ? ((ae.direction = Ht(this.direction)),
            (ae.threshold = this.threshold),
            (ae.distance = this.distance),
            (ae.value = this.value),
            (ae.maxValue = this.maxValue),
            (ae.duration = this.duration),
            (ae.speed = this.speed),
            (ae.deltaTime = this.deltaTime),
            (ae.isEnding = this.isEnding),
            e(this.element, ae))
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
        typeof e == 'function' && e(this.element, Ht(this.direction));
      }
      onStop() {
        if (!this.item || !this.element) return;
        let { onStop: e } = this.item;
        typeof e == 'function' && e(this.element, Ht(this.direction));
      }
    };
  function ui(e = 500, t = 0.5, n = 0.25) {
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
  var di = class {
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
        (this._requests = { [y.x]: new Map(), [y.y]: new Map() }),
        (this._itemData = new Map()),
        (this._requestPool = new oi((n) => n || new dr(), {
          initialBatchCount: 1,
          minBatchCount: 1,
          onRelease: (n) => n.reset(),
        })),
        (this._actionPool = new oi((n) => n || new ur(), {
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
        M.on(D.read, this._frameRead, this._frameRead),
        M.on(D.write, this._frameWrite, this._frameWrite));
    }
    _stopTicking() {
      this._isTicking &&
        ((this._isTicking = !1),
        (this._tickTime = 0),
        (this._tickDeltaTime = 0),
        M.off(D.read, this._frameRead),
        M.off(D.write, this._frameWrite));
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
        (t && this._cancelItemScroll(e, y.x), n && this._cancelItemScroll(e, y.y));
        return;
      }
      let o = this._itemData.get(e),
        a = o?.directionX,
        l = o?.directionY;
      if (!a && !l) {
        (t && this._cancelItemScroll(e, y.x), n && this._cancelItemScroll(e, y.y));
        return;
      }
      let d = null,
        u = -1 / 0,
        h = 0,
        m = -1 / 0,
        g = O.none,
        v = 0,
        T = 0,
        k = null,
        q = -1 / 0,
        z = 0,
        re = -1 / 0,
        p = O.none,
        S = 0,
        W = 0,
        de = 0;
      for (; de < r.length; de++) {
        let w = r[de],
          H = typeof w.threshold == 'number' ? w.threshold : 50,
          L = !!(t && a && w.axis !== 'y'),
          Te = !!(n && l && w.axis !== 'x'),
          le = w.priority || 0;
        if ((!L || le < u) && (!Te || le < q)) continue;
        let N = ni(w.element || w),
          se = L ? ii(N) : -1,
          xe = Te ? ri(N) : -1;
        if (se <= 0 && xe <= 0) continue;
        let K = Nt(N, li),
          he = At(s, K) || -1 / 0;
        if (he === -1 / 0)
          if (w.padding && si(s, ci(K, w.padding, ai))) he = -(lr(s, K) || 0);
          else continue;
        if (L && le >= u && se > 0 && (le > u || he > m)) {
          let V = 0,
            X = O.none,
            U = Vt(H, K.width),
            we = Xt(U, i, s.width, K.width);
          (a === O.right
            ? ((V = K.x + K.width + we - (s.x + s.width)),
              V <= U && !gt(Je(N), se) && (X = O.right))
            : a === O.left && ((V = s.x - (K.x - we)), V <= U && Je(N) > 0 && (X = O.left)),
            X && ((d = N), (u = le), (h = U), (m = he), (g = X), (v = V), (T = se)));
        }
        if (Te && le >= q && xe > 0 && (le > q || he > re)) {
          let V = 0,
            X = et.none,
            U = Vt(H, K.height),
            we = Xt(U, i, s.height, K.height);
          (l === O.down
            ? ((V = K.y + K.height + we - (s.y + s.height)),
              V <= U && !gt(Ze(N), xe) && (X = O.down))
            : l === O.up && ((V = s.y - (K.y - we)), V <= U && Ze(N) > 0 && (X = O.up)),
            X && ((k = N), (q = le), (z = U), (re = he), (p = X), (S = V), (W = xe)));
        }
      }
      (t &&
        (d && g ? this._requestItemScroll(e, y.x, d, g, h, v, T) : this._cancelItemScroll(e, y.x)),
        n &&
          (k && p
            ? this._requestItemScroll(e, y.y, k, p, z, S, W)
            : this._cancelItemScroll(e, y.y)));
    }
    _updateScrollRequest(e) {
      let { inertAreaSize: t, smoothStop: n, targets: i, clientRect: r } = e.item,
        s = null,
        o = 0;
      for (; o < i.length; o++) {
        let a = i[o],
          l = ni(a.element || a);
        if (l !== e.element) continue;
        let d = !!(y.x & e.direction);
        if (d) {
          if (a.axis === 'y') continue;
        } else if (a.axis === 'x') continue;
        let u = d ? ii(l) : ri(l);
        if (u <= 0) break;
        let h = Nt(l, li);
        if ((At(r, h) || -1 / 0) === -1 / 0) {
          let k = a.scrollPadding || a.padding;
          if (!(k && si(r, ci(h, k, ai)))) break;
        }
        let m = Vt(typeof a.threshold == 'number' ? a.threshold : 50, d ? h.width : h.height),
          g = Xt(m, t, d ? r.width : r.height, d ? h.width : h.height),
          v = 0;
        if (
          ((v =
            e.direction === O.left
              ? r.x - (h.x - g)
              : e.direction === O.right
                ? h.x + h.width + g - (r.x + r.width)
                : e.direction === O.up
                  ? r.y - (h.y - g)
                  : h.y + h.height + g - (r.y + r.height)),
          v > m)
        )
          break;
        let T = d ? Je(l) : Ze(l);
        if (((s = Oe.forward & e.direction ? gt(T, u) : T <= 0), s)) break;
        return ((e.maxValue = u), (e.threshold = m), (e.distance = v), (e.isEnding = !1), !0);
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
          ((n.directionX = i > s ? O.right : i < s ? O.left : n.directionX),
          (n.directionY = r > o ? O.down : r < o ? O.up : n.directionY),
          (n.positionX = i),
          (n.positionY = r),
          n.overlapCheckRequestTime === 0 && (n.overlapCheckRequestTime = this._tickTime));
      }
    }
    _updateRequests() {
      let e = this.items,
        t = this._requests[y.x],
        n = this._requests[y.y],
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
          ((l = !this._updateScrollRequest(d)), l && ((a = !0), this._cancelItemScroll(r, y.x)));
        let u = !0,
          h = n.get(r);
        (h &&
          h.isActive &&
          ((u = !this._updateScrollRequest(h)), u && ((a = !0), this._cancelItemScroll(r, y.y))),
          a && ((s.overlapCheckRequestTime = 0), this._checkItemOverlap(r, l, u)));
      }
    }
    _requestAction(e, t) {
      let n = t === y.x,
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
          n = this._requests[y.x].get(t),
          i = this._requests[y.y].get(t);
        (n && this._requestAction(n, y.x), i && this._requestAction(i, y.y));
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
        i = new cr();
      ((i.positionX = t),
        (i.positionY = n),
        (i.directionX = O.none),
        (i.directionY = O.none),
        (i.overlapCheckRequestTime = this._tickTime),
        this._itemData.set(e, i),
        this.items.push(e),
        this._isTicking || this._startTicking());
    }
    removeItem(e) {
      if (this._isDestroyed) return;
      let t = this.items.indexOf(e);
      t !== -1 &&
        (this._requests[y.x].get(e) &&
          (this._cancelItemScroll(e, y.x), this._requests[y.x].delete(e)),
        this._requests[y.y].get(e) &&
          (this._cancelItemScroll(e, y.y), this._requests[y.y].delete(e)),
        this._itemData.delete(e),
        this.items.splice(t, 1),
        this._isTicking && !this.items.length && this._stopTicking());
    }
    isDestroyed() {
      return this._isDestroyed;
    }
    isItemScrollingX(e) {
      return !!this._requests[y.x].get(e)?.isActive;
    }
    isItemScrollingY(e) {
      return !!this._requests[y.y].get(e)?.isActive;
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
  var Yt = new di();
  var jt = { x: 0, y: 0 },
    tt = { width: 0, height: 0, x: 0, y: 0 };
  function hr() {
    return {
      targets: [],
      inertAreaSize: 0.2,
      speed: ui(),
      smoothStop: !1,
      getPosition: (e) => {
        let { drag: t } = e,
          n = t?.items[0];
        if (n) return n.position;
        let i = t && (t.moveEvent || t.startEvent);
        return ((jt.x = i ? i.x : 0), (jt.y = i ? i.y : 0), jt);
      },
      getClientRect: (e) => {
        let { drag: t } = e,
          n = e.getClientRect();
        if (n) return n;
        let i = t && (t.moveEvent || t.startEvent);
        return (
          (tt.width = i ? 50 : 0),
          (tt.height = i ? 50 : 0),
          (tt.x = i ? i.x - 25 : 0),
          (tt.y = i ? i.y - 25 : 0),
          tt
        );
      },
      onStart: null,
      onStop: null,
    };
  }
  var fr = class {
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
    mr = class {
      constructor(e, t = {}) {
        c(this, 'name');
        c(this, 'version');
        c(this, 'settings');
        c(this, '_autoScrollProxy');
        ((this.name = 'autoscroll'),
          (this.version = '0.0.3'),
          (this.settings = this._parseSettings(t)),
          (this._autoScrollProxy = null),
          e.on(F.Start, () => {
            this._autoScrollProxy ||
              ((this._autoScrollProxy = new fr(this, e)), Yt.addItem(this._autoScrollProxy));
          }),
          e.on(F.End, () => {
            this._autoScrollProxy &&
              (this._autoScrollProxy = (Yt.removeItem(this._autoScrollProxy), null));
          }));
      }
      _parseSettings(e, t = hr()) {
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
  function hi(e) {
    return (t) => {
      let n = new mr(t, e),
        i = t;
      return ((i.plugins[n.name] = n), i);
    };
  }
  var fi = class {
    constructor() {
      c(this, 'drag');
      c(this, 'isDestroyed');
      c(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new ge()));
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
  var mi = class extends fi {
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
      this.isDestroyed || this.drag || (super._start(t), M.on(D.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (M.off(D.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (M.off(D.read, this._tick), super._cancel(t));
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
  var gr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function pt(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let i of e) {
      let r = t.get(i);
      r !== void 0 && r < n && (n = r);
    }
    return n;
  }
  var ie = {
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
    gi = class extends mi {
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
          startPredicate: i = ie.startPredicate,
          computeSpeed: r = ie.computeSpeed,
          cancelOnVisibilityChange: s = ie.cancelOnVisibilityChange,
          cancelOnBlur: o = ie.cancelOnBlur,
          startKeys: a = ie.startKeys,
          moveLeftKeys: l = ie.moveLeftKeys,
          moveRightKeys: d = ie.moveRightKeys,
          moveUpKeys: u = ie.moveUpKeys,
          moveDownKeys: h = ie.moveDownKeys,
          cancelKeys: m = ie.cancelKeys,
          endKeys: g = ie.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(m)),
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
        let t = pt(this._moveLeftKeys, this._moveKeyTimestamps),
          n = pt(this._moveRightKeys, this._moveKeyTimestamps),
          i = pt(this._moveUpKeys, this._moveKeyTimestamps),
          r = pt(this._moveDownKeys, this._moveKeyTimestamps),
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
              ((i.type = b.Start), (i.x = n.x), (i.y = n.y), (i.srcEvent = t), this._start(i));
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
          gr.forEach((a, l) => {
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
  var yt = new Map(),
    _t = [],
    zt = [],
    Ut = [],
    Gt = [],
    Qt = [],
    Jt = [],
    Zt = [],
    en = [];
  function pi() {
    (yt.clear(),
      (_t.length = 0),
      (zt.length = 0),
      (Ut.length = 0),
      (Gt.length = 0),
      (Qt.length = 0),
      (Jt.length = 0),
      (Zt.length = 0),
      (en.length = 0));
  }
  function yi(e) {
    let t = [];
    pi();
    for (let n = 0; n < e.length; n++) {
      let i = e[n],
        r = i.parentElement;
      if (!r) throw new Error('Source element must have a parent element.');
      let s = i.getBoundingClientRect(),
        o = Y(i),
        a = Ee(i),
        l = a ? o.transformOrigin : '',
        d,
        u;
      if (i instanceof SVGSVGElement) ((d = `${s.width}px`), (u = `${s.height}px`));
      else {
        let g = parseFloat(o.width),
          v = parseFloat(o.height);
        if (!(g >= 0) || !(v >= 0)) ((d = `${s.width}px`), (u = `${s.height}px`));
        else if (o.boxSizing === 'border-box') ((d = o.width), (u = o.height));
        else {
          let T = parseFloat(o.paddingLeft) || 0,
            k = parseFloat(o.paddingRight) || 0,
            q = parseFloat(o.borderLeftWidth) || 0,
            z = parseFloat(o.borderRightWidth) || 0,
            re = parseFloat(o.paddingTop) || 0,
            p = parseFloat(o.paddingBottom) || 0,
            S = parseFloat(o.borderTopWidth) || 0,
            W = parseFloat(o.borderBottomWidth) || 0;
          ((d = `${g + T + k + q + z}px`), (u = `${v + re + p + S + W}px`));
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
        (_t[n] = r),
        (t[n] = h),
        (zt[n] = s),
        (Ut[n] = a),
        (Gt[n] = l),
        (Qt[n] = d),
        (Jt[n] = u),
        yt.has(r) || yt.set(r, He(r)));
    }
    for (let n = 0; n < e.length; n++) {
      let i = _t[n],
        r = t[n],
        s = Ut[n],
        o = Gt[n],
        a = Qt[n],
        l = Jt[n],
        d = r.style;
      ((d.width = a),
        (d.height = l),
        s && ((d.transform = s), o && (d.transformOrigin = o)),
        i.appendChild(r));
    }
    for (let n = 0; n < e.length; n++) {
      let i = _t[n],
        r = t[n],
        s = zt[n],
        o = yt.get(i),
        a = 0,
        l = 0,
        d = o.m11,
        u = o.m12,
        h = o.m21,
        m = o.m22,
        g = d * m - u * h,
        v = r.getBoundingClientRect(),
        T = s.left - v.left,
        k = s.top - v.top;
      if (Math.abs(g) < 1e-10) ((a = T), (l = k));
      else {
        let q = 1 / g;
        ((a = (m * T - h * k) * q), (l = (-u * T + d * k) * q));
      }
      ((Zt[n] = a), (en[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let i = t[n].style,
        r = Zt[n],
        s = en[n];
      ((i.left = `${r}px`), (i.top = `${s}px`));
    }
    return (pi(), t);
  }
  function _i(e, t) {
    if (Ae) return () => null;
    let n = C(() => (Array.isArray(e) ? xn(e) : ($(e) ?? [])).filter((p) => !!p)),
      i = C(() => $(t)),
      r = C(() => i()?.id),
      s = C(() => i()?.dndObserver),
      o = C(() => {
        let p = i();
        if (!p) return;
        let {
          dndObserver: S,
          id: W,
          dragPreviewContainer: de,
          dragPreviewExitTimeout: w,
          ...H
        } = p;
        return H;
      }),
      a = $n(),
      l = C(() => {
        let p = s();
        return p === void 0 ? a() : p;
      }),
      [d, u] = Q(null),
      h = null,
      m = r(),
      g = o(),
      v = l(),
      T = o(),
      k = i()?.dragPreviewContainer,
      q = i()?.dragPreviewExitTimeout;
    I(() => {
      let p = i();
      ((T = o()), (k = p?.dragPreviewContainer), (q = p?.dragPreviewExitTimeout));
    });
    let z = () => {
        h && (h.destroy(), (h = null), (g = void 0), u(null));
      },
      re = () => {
        un(() => {
          z();
          let p = j(n);
          if (!p.length) return;
          let S = j(o),
            W = r(),
            de = S?.dragPreview,
            w = new Bt(p, {
              id: W,
              ...S,
              elements(L) {
                let Te = T,
                  N = (Te?.elements || (() => null))(L);
                if (!Te?.dragPreview || !N || N.length === 0) return N;
                let se = yi(N);
                Ne.add(L.draggable, N, se);
                let xe = () => {
                    let V = q || 0;
                    if (V > 0) {
                      for (let vt of se) vt.dataset.exiting = 'true';
                      let X = !1,
                        U = () => {
                          X ||
                            ((X = !0),
                            clearTimeout(we),
                            Ne.remove(L.draggable),
                            setTimeout(() => {
                              for (let vt of se) vt.remove();
                            }, 0));
                        },
                        we = setTimeout(U, V);
                      Ne.startExiting(L.draggable, U);
                    } else
                      (Ne.remove(L.draggable),
                        setTimeout(() => {
                          for (let X of se) X.remove();
                        }, 0));
                    (L.draggable.off('end', K), L.draggable.off('destroy', he));
                  },
                  K = L.draggable.on('end', xe),
                  he = L.draggable.on('destroy', xe);
                return se;
              },
              ...(de
                ? {
                    container: () => {
                      let L = k;
                      return (typeof L == 'function' ? L() : L) || document.body;
                    },
                  }
                : {}),
            }),
            H = j(l);
          (H?.addDraggables([w]), (h = w), (m = W), (g = S), (v = H), u(w));
        });
      };
    return (
      I(() => {
        let p = n();
        if (!p.length) {
          z();
          return;
        }
        let S = h;
        if (!S) {
          re();
          return;
        }
        (p.length !== S.sensors.length || p.some((W) => !S.sensors.includes(W))) && re();
      }),
      I(() => {
        if (!h) return;
        let S = r();
        m !== S && re();
      }),
      I(() => {
        let p = l();
        if (v === p) return;
        let S = h;
        (S && (v?.removeDraggables([S]), p?.addDraggables([S])), (v = p));
      }),
      I(() => {
        let p = h;
        if (!p) return;
        let S = o(),
          W = !1;
        if (g) {
          let w = { ...g },
            H = { ...S };
          ((w.elements === H.elements || (w.dragPreview && H.dragPreview)) &&
            (delete w.elements, delete H.elements),
            (W = !Ie(w, H)));
        } else W = !0;
        if (!W) return;
        let de = p._parseSettings(S);
        if (
          (p.updateSettings({
            ...de,
            ...(!S?.dragPreview && S?.elements ? { elements: S.elements } : {}),
            ...(S?.dragPreview
              ? {
                  container: () => {
                    let w = k;
                    return (typeof w == 'function' ? w() : w) || document.body;
                  },
                }
              : {}),
          }),
          g)
        ) {
          let w = S?.dndGroups !== g.dndGroups,
            H = S?.computeClientRect !== g.computeClientRect;
          (w && v?.clearTargets(p), (w || H) && v?.detectCollisions(p));
        }
        g = S;
      }),
      J(z),
      d
    );
  }
  function vi(e, t) {
    let n = C(() => $(e)),
      i = C(() => $(t)),
      r = i();
    return (
      I(() => {
        let s = n();
        if (s) {
          if (s.plugins.autoscroll) {
            r = i();
            return;
          }
          (s.use(hi(i())), (r = i()));
        }
      }),
      I(() => {
        let o = n()?.plugins.autoscroll;
        if (!o) return;
        let a = i();
        Ie(r, a) || (o.updateSettings(o._parseSettings(a)), (r = a));
      }),
      n
    );
  }
  function bi(e, t = !1) {
    let n = C(() => $(e)),
      [i, r] = Q(null),
      [s, o] = Q(0);
    return (
      I(() => {
        let a = n();
        if ((r(a?.drag || null), !a)) return;
        let l = a.on(F.Start, () => {
            r(a.drag || null);
          }),
          d = null;
        t &&
          (d = a.on(F.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let u = a.on(F.End, () => {
          r(null);
        });
        J(() => {
          (a.off(F.Start, l), d && a.off(F.Move, d), a.off(F.End, u));
        });
      }),
      C(() => (s(), i()))
    );
  }
  function Si(e = {}, t) {
    if (Ae) return [() => null, () => {}];
    let n = C(() => $(e, {}) || {}),
      i = C(() => (t === void 0 ? void 0 : $(t))),
      [r, s] = Q(null),
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
        let h = new gi(u, n());
        ((o = h), s(h));
      };
    (I(() => {
      let u = o;
      u && u.updateSettings(n());
    }),
      I(() => {
        let u = i();
        u !== void 0 && (l(u), J(a));
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
    return (J(a), [r, d]);
  }
  function xi(e = {}, t) {
    if (Ae) return [() => null, () => {}];
    let n = C(() => $(e, {}) || {}),
      i = C(() => (t === void 0 ? void 0 : $(t))),
      [r, s] = Q(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), s(null));
      },
      l = (u) => {
        o?.destroy();
        let h = new $e(u, n());
        ((o = h), s(h));
      };
    (I(() => {
      let u = o;
      u && u.updateSettings(n());
    }),
      I(() => {
        let u = i();
        if (u !== void 0) {
          if (u === null) {
            a();
            return;
          }
          (l(u), J(a));
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
    return (J(a), [r, d]);
  }
  var pr = Mt(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    yr = Mt('<div class=card-container-outer><div class=card-container>');
  function _r() {
    let e = null,
      [t, n] = xi(),
      [i, r] = Si({ computeSpeed: () => 100 }),
      s = vi(
        _i([t, i], () => ({ elements: () => (e ? [e] : []) })),
        { targets: [{ element: window, axis: 'y', padding: { top: 1 / 0, bottom: 1 / 0 } }] },
      ),
      o = bi(s),
      a = (l) => {
        ((e = l), n(l), r(l));
      };
    return (() => {
      var l = pr();
      return (bn(a, l), me(() => vn(l, `card draggable ${o() ? 'dragging' : ''}`)), l);
    })();
  }
  function vr() {
    return (() => {
      var e = yr(),
        t = e.firstChild;
      return (Ot(t, st(_r, {})), e);
    })();
  }
  var wi = document.getElementById('root');
  if (!wi) throw new Error('Failed to find the root element');
  _n(() => st(vr, {}), wi);
})();
