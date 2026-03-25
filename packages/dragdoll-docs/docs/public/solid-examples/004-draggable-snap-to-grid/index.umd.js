'use strict';
var SolidExample_004_draggable_snap_to_grid = (() => {
  var _n = Object.defineProperty;
  var xn = (e, t, n) =>
    t in e ? _n(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var u = (e, t, n) => xn(e, typeof t != 'symbol' ? t + '' : t, n);
  var S = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return pt(this.context.count);
    },
    getNextContextId() {
      return pt(this.context.count++);
    },
  };
  function pt(e) {
    let t = String(e),
      n = t.length - 1;
    return S.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Ve(e) {
    S.context = e;
  }
  function Sn() {
    return { ...S.context, id: S.getNextContextId(), count: 0 };
  }
  var wn = !1,
    En = (e, t) => e === t;
  var Oe = { equals: En },
    mt = null,
    _t = Ot,
    R = 1,
    fe = 2,
    xt = { owned: null, cleanups: null, context: null, owner: null };
  var p = null,
    d = null,
    ge = null,
    ae = null,
    _ = null,
    w = null,
    C = null,
    Me = 0;
  function St(e, t) {
    let n = _,
      r = p,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? xt : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => I(() => J(o)));
    ((p = o), (_ = null));
    try {
      return z(a, !0);
    } finally {
      ((_ = n), (p = r));
    }
  }
  function F(e, t) {
    t = t ? Object.assign({}, Oe, t) : Oe;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (d && d.running && d.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Ct(n, s)
      );
    return [Dt.bind(n), r];
  }
  function Z(e, t, n) {
    let r = qe(e, t, !1, R);
    ge && d && d.running ? w.push(r) : pe(r);
  }
  function P(e, t, n) {
    _t = Mn;
    let r = qe(e, t, !1, R),
      s = je && Xe(je);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), C ? C.push(r) : pe(r));
  }
  function E(e, t, n) {
    n = n ? Object.assign({}, Oe, n) : Oe;
    let r = qe(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      ge && d && d.running ? ((r.tState = R), w.push(r)) : pe(r),
      Dt.bind(r)
    );
  }
  function wt(e) {
    return z(e, !1);
  }
  function I(e) {
    if (!ae && _ === null) return e();
    let t = _;
    _ = null;
    try {
      return ae ? ae.untrack(e) : e();
    } finally {
      _ = t;
    }
  }
  function $(e) {
    return (p === null || (p.cleanups === null ? (p.cleanups = [e]) : p.cleanups.push(e)), e);
  }
  function Dn(e) {
    if (d && d.running) return (e(), d.done);
    let t = _,
      n = p;
    return Promise.resolve().then(() => {
      ((_ = t), (p = n));
      let r;
      return (
        (ge || je) &&
          ((r =
            d ||
            (d = {
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
        (_ = p = null),
        r ? r.done : void 0
      );
    });
  }
  var [or, yt] = F(!1);
  function Et(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: kn(n), defaultValue: e };
  }
  function Xe(e) {
    let t;
    return p && p.context && (t = p.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function Cn(e) {
    let t = E(e),
      n = E(() => Ye(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var je;
  function Dt() {
    let e = d && d.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === R) pe(this);
      else {
        let t = w;
        ((w = null), z(() => Pe(this), !1), (w = t));
      }
    if (_) {
      let t = this.observers ? this.observers.length : 0;
      (_.sources
        ? (_.sources.push(this), _.sourceSlots.push(t))
        : ((_.sources = [this]), (_.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(_), this.observerSlots.push(_.sources.length - 1))
          : ((this.observers = [_]), (this.observerSlots = [_.sources.length - 1])));
    }
    return e && d.sources.has(this) ? this.tValue : this.value;
  }
  function Ct(e, t, n) {
    let r = d && d.running && d.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (d) {
        let s = d.running;
        ((s || (!n && d.sources.has(e))) && (d.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        z(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = d && d.running;
            (o && d.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? w.push(i) : C.push(i), i.observers && Pt(i)),
              o ? (i.tState = R) : (i.state = R));
          }
          if (w.length > 1e6) throw ((w = []), new Error());
        }, !1);
    }
    return t;
  }
  function pe(e) {
    if (!e.fn) return;
    J(e);
    let t = Me;
    (vt(e, d && d.running && d.sources.has(e) ? e.tValue : e.value, t),
      d &&
        !d.running &&
        d.sources.has(e) &&
        queueMicrotask(() => {
          z(() => {
            (d && (d.running = !0), (_ = p = e), vt(e, e.tValue, t), (_ = p = null));
          }, !1);
        }));
  }
  function vt(e, t, n) {
    let r,
      s = p,
      i = _;
    _ = p = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (d && d.running
            ? ((e.tState = R), e.tOwned && e.tOwned.forEach(J), (e.tOwned = void 0))
            : ((e.state = R), e.owned && e.owned.forEach(J), (e.owned = null))),
        (e.updatedAt = n + 1),
        We(o)
      );
    } finally {
      ((_ = i), (p = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Ct(e, r, !0)
        : d && d.running && e.pure
          ? (d.sources.has(e) || (e.value = r), d.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function qe(e, t, n, r = R, s) {
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
      (d && d.running && ((i.state = 0), (i.tState = r)),
      p === null ||
        (p !== xt &&
          (d && d.running && p.pure
            ? p.tOwned
              ? p.tOwned.push(i)
              : (p.tOwned = [i])
            : p.owned
              ? p.owned.push(i)
              : (p.owned = [i]))),
      ae && i.fn)
    ) {
      let o = i.fn,
        [a, l] = F(void 0, { equals: !1 }),
        f = ae.factory(o, l);
      $(() => f.dispose());
      let c,
        h = () =>
          Dn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (g) => (a(), d && d.running ? (c || (c = ae.factory(o, h)), c.track(g)) : f.track(g));
    }
    return i;
  }
  function he(e) {
    let t = d && d.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === fe) return Pe(e);
    if (e.suspense && I(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Me); ) {
      if (t && d.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (d.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === R) pe(e);
      else if ((t ? e.tState : e.state) === fe) {
        let s = w;
        ((w = null), z(() => Pe(e, n[0]), !1), (w = s));
      }
    }
  }
  function z(e, t) {
    if (w) return e();
    let n = !1;
    (t || (w = []), C ? (n = !0) : (C = []), Me++);
    try {
      let r = e();
      return (On(n), r);
    } catch (r) {
      (n || (C = null), (w = null), We(r));
    }
  }
  function On(e) {
    if ((w && (ge && d && d.running ? Pn(w) : Ot(w), (w = null)), e)) return;
    let t;
    if (d) {
      if (!d.promises.size && !d.queue.size) {
        let r = d.sources,
          s = d.disposed;
        (C.push.apply(C, d.effects), (t = d.resolve));
        for (let i of C) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((d = null),
          z(() => {
            for (let i of s) J(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) J(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            yt(!1);
          }, !1));
      } else if (d.running) {
        ((d.running = !1), d.effects.push.apply(d.effects, C), (C = null), yt(!0));
        return;
      }
    }
    let n = C;
    ((C = null), n.length && z(() => _t(n), !1), t && t());
  }
  function Ot(e) {
    for (let t = 0; t < e.length; t++) he(e[t]);
  }
  function Pn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = d.queue;
      r.has(n) ||
        (r.add(n),
        ge(() => {
          (r.delete(n),
            z(() => {
              ((d.running = !0), he(n));
            }, !1),
            d && (d.running = !1));
        }));
    }
  }
  function Mn(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : he(r);
    }
    if (S.context) {
      if (S.count) {
        (S.effects || (S.effects = []), S.effects.push(...e.slice(0, n)));
        return;
      }
      Ve();
    }
    for (
      S.effects &&
        (S.done || !S.count) &&
        ((e = [...S.effects, ...e]), (n += S.effects.length), delete S.effects),
        t = 0;
      t < n;
      t++
    )
      he(e[t]);
  }
  function Pe(e, t) {
    let n = d && d.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === R ? s !== t && (!s.updatedAt || s.updatedAt < Me) && he(s) : i === fe && Pe(s, t);
      }
    }
  }
  function Pt(e) {
    let t = d && d.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = fe) : (r.state = fe),
        r.pure ? w.push(r) : C.push(r),
        r.observers && Pt(r));
    }
  }
  function J(e) {
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
      for (t = e.tOwned.length - 1; t >= 0; t--) J(e.tOwned[t]);
      delete e.tOwned;
    }
    if (d && d.running && e.pure) Mt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) J(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    d && d.running ? (e.tState = 0) : (e.state = 0);
  }
  function Mt(e, t) {
    if ((t || ((e.tState = 0), d.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Mt(e.owned[n]);
  }
  function An(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function bt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      We(r, (n && n.owner) || null);
    }
  }
  function We(e, t = p) {
    let n = mt && t && t.context && t.context[mt],
      r = An(e);
    if (!n) throw r;
    C
      ? C.push({
          fn() {
            bt(r, n, t);
          },
          state: R,
        })
      : bt(r, n, t);
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
  function kn(e, t) {
    return function (r) {
      let s;
      return (
        Z(
          () => (s = I(() => ((p.context = { ...p.context, [e]: r.value }), Cn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Tn = !1;
  function Ae(e, t) {
    if (Tn && S.context) {
      let n = S.context;
      Ve(Sn());
      let r = I(() => e(t || {}));
      return (Ve(n), r);
    }
    return I(() => e(t || {}));
  }
  var Ln = [
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
    xr = new Set([
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
      ...Ln,
    ]);
  function Rn(e, t, n) {
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
              v;
            for (; ++h < s && h < i && !((v = f.get(t[h])) == null || v !== c + g); ) g++;
            if (g > c - a) {
              let x = t[o];
              for (; a < c; ) e.insertBefore(n[a++], x);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function kt(e, t, n, r = {}) {
    let s;
    return (
      St((i) => {
        ((s = i), t === document ? e() : Fn(t, e(), t.firstChild ? null : void 0, n));
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
        ? () => I(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function It(e, t) {
    Rt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Lt(e, t, n) {
    return I(() => e(t, n));
  }
  function Fn(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return ke(e, t, r, n);
    Z((s) => ke(e, t(), s, n), r);
  }
  function Rt(e) {
    return !!S.context && !S.done && (!e || e.isConnected);
  }
  function ke(e, t, n, r, s) {
    let i = Rt(e);
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
          Z(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = ke(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          f = n && Array.isArray(n);
        if (Ke(l, t, n, s)) return (Z(() => (n = ke(e, l, n, r, !0))), () => n);
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
          if (((n = le(e, n, r)), a)) return n;
        } else f ? (n.length === 0 ? At(e, l, r) : Rn(e, n, l)) : (n && le(e), At(e, l));
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
  function Ke(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        f;
      if (!(a == null || a === !0 || a === !1))
        if ((f = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Ke(e, a, l) || s;
        else if (f === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Ke(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
          } else (e.push(a), (s = !0));
        else {
          let c = String(a);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return s;
  }
  function At(e, t, n = null) {
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
  var me = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ee = class {
      constructor(e = {}) {
        u(this, 'dedupe');
        u(this, 'getId');
        u(this, '_events');
        ((this.dedupe = e.dedupe || me.ADD),
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
            case me.THROW:
              throw Error('Eventti: duplicate listener id!');
            case me.IGNORE:
              return n;
            case me.UPDATE:
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
  var $n = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new ee({ getId: r, dedupe: n })),
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
  function ze(e = 60) {
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
  var Ft = class extends $n {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = ze(), ...s } = e;
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
    L = new Ft({
      phases: [M.read, M.write],
      requestFrame: typeof window < 'u' ? ze() : () => () => {},
    });
  var $t = new WeakMap();
  function N(e) {
    let t = $t.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), $t.set(e, new WeakRef(t))), t);
  }
  var Nn = typeof window < 'u' && window.document !== void 0,
    Ge = !!(
      Nn &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    ye = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Lr = {
      [ye.content]: !1,
      [ye.padding]: !1,
      [ye.scrollbar]: !0,
      [ye.border]: !0,
      [ye.margin]: !0,
    };
  var Rr = (() => {
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
  var y = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function Yt(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Hn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Bn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Xt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function qt(e) {
    return e === 'auto' || e === void 0 ? (jt ? 'pointer' : Vt ? 'touch' : 'mouse') : e;
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
    ne = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    ve = class {
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
          listenerOptions: n = ne.listenerOptions,
          sourceEvents: r = ne.sourceEvents,
          startPredicate: s = ne.startPredicate,
          cancelOnVisibilityChange: i = ne.cancelOnVisibilityChange,
          cancelOnEscape: o = ne.cancelOnEscape,
          preventNativeDrag: a = ne.preventNativeDrag,
          preventContextMenu: l = ne.preventContextMenu,
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
          (this._listenerOptions = Xt(n)),
          (this._sourceEvents = qt(r)),
          (this._emitter = new ee()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(te[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? Yt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Hn(e);
        if (t === null) return;
        let n = Yt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Bn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: y.Start, srcEvent: e, target: n.target }),
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
          (n.type = y.Move),
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
          (n.type = y.Cancel),
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
          (n.type = y.End),
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
        let { move: e, end: t, cancel: n } = te[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = te[this._sourceEvents];
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
          ((this._eventData.type = y.Cancel),
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
            te[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(te[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
          l = qt(n),
          f = Xt(t);
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
              te[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && f && (this._listenerOptions = f),
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
          this._emitter.emit(y.Destroy, { type: y.Destroy }),
          this._emitter.off(),
          this.element.removeEventListener(
            te[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Vn(e) {
    let t = N(e),
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
  function jn(e) {
    let t = N(e),
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
  function se(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = N(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', f] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * jn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Vn(e)}px`),
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
  function be(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function Ue(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var ie = U ? new DOMMatrix() : null;
  function _e(e, t = new DOMMatrix()) {
    let n = e;
    for (be(t); n; ) {
      let r = se(n);
      if (r && (ie.setMatrixValue(r), !ie.isIdentity)) {
        let { transformOrigin: s } = N(n),
          { x: i, y: o, z: a } = Ue(s);
        (a === 0
          ? ie.setMatrixValue(`translate(${i}px,${o}px) ${ie} translate(${i * -1}px,${o * -1}px)`)
          : ie.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${ie} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(ie));
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
  function Ie(e) {
    let t = W(e);
    if (!Ge) {
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
      ) || !!(Ge && a && a.indexOf('filter') > -1)
    );
  }
  function Wt(e) {
    return W(e).position !== 'static' || Ie(e);
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
          let a = i ? Ie(o) : Wt(o);
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
  function Je(e, t = {}) {
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
  function Yn(e, t) {
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
  function Ze(e) {
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
  function Kt(e, t, n = null) {
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
  function Le(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var zt = class {
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
    Qt = class {
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
          (this._matrixCache = new zt()),
          (this._clientOffsetCache = new zt()));
      }
    };
  function Xn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function qn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Xn(
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
  function Se(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = N(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function Gt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Wn = { x: 0, y: 0 },
    Kn = { x: 0, y: 0 };
  function zn(e, t, n = { x: 0, y: 0 }) {
    let r = Gt(e) ? e : Se(e, Wn),
      s = Gt(t) ? t : Se(t, Kn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Re = U ? qn() : null,
    Jt = class {
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
        let r = N(e),
          s = e.getBoundingClientRect(),
          i = se(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Ue(r.transformOrigin)),
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
        let f = Je(e) || e;
        ((this.elementOffsetContainer = f),
          (this.dragOffsetContainer = l === o ? f : Je(e, { container: l })));
        {
          let { width: h, height: g, x: v, y: x } = s;
          this.clientRect = { width: h, height: g, x: v, y: x };
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
            (_e(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
                ? Ze(g[0])
                  ? (Re.style.setProperty('transform', g[1].toString(), 'important'),
                    c.append(Re),
                    Se(Re, h),
                    Re.remove())
                  : (Se(c, h), (h.x -= g[0].m41), (h.y -= g[0].m42))
                : Se(c, h);
            }
            return (i.set(c, h), h);
          });
          zn(a, l, s);
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
    Ut = { capture: !0, passive: !0 },
    Gn = { x: 0, y: 0 },
    K = U ? new DOMMatrix() : null,
    Fe = U ? new DOMMatrix() : null,
    H = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(H || {}),
    B = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(B || {}),
    xe = { Start: 'start', Move: 'move', End: 'end' },
    we = { Immediate: 'immediate', Sampled: 'sampled' },
    Q = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    k = {
      PrepareStart: 'preparestart',
      Start: 'start',
      PrepareMove: 'preparemove',
      Move: 'move',
      End: 'end',
      Destroy: 'destroy',
    },
    Zt = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === Q.End || t === Q.EndAlign,
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
          { x: v, y: x, z: O } = h,
          A = !c.isIdentity && (v !== 0 || x !== 0 || O !== 0),
          Y = a.x + l.x + f.x,
          G = a.y + l.y + f.y;
        (be(K),
          A && (O === 0 ? K.translateSelf(-v, -x) : K.translateSelf(-v, -x, -O)),
          n ? s.isIdentity || K.multiplySelf(s) : o.isIdentity || K.multiplySelf(o),
          be(Fe).translateSelf(Y, G),
          K.multiplySelf(Fe),
          r.isIdentity || K.multiplySelf(r),
          A && (be(Fe).translateSelf(v, x, O), K.multiplySelf(Fe)),
          c.isIdentity || K.multiplySelf(c),
          g.isIdentity || K.preMultiplySelf(g),
          (e.element.style.transform = `${K}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: we.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    et = class {
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
          (this._emitter = new ee()),
          (this._startPhase = H.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: xe.Start }),
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
        (e.on(y.Start, t, t), e.on(y.Move, t, t), e.on(y.Cancel, n, n), e.on(y.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(y.Start, n),
          e.off(y.Move, n),
          e.off(y.Cancel, r),
          e.off(y.End, r),
          this._sensorData.delete(e));
      }
      _parseSettings(e, t = Zt) {
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
          capturePointer: v = t.capturePointer,
          onPrepareStart: x = t.onPrepareStart,
          onStart: O = t.onStart,
          onPrepareMove: A = t.onPrepareMove,
          onMove: Y = t.onMove,
          onEnd: G = t.onEnd,
          onDestroy: re = t.onDestroy,
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
          capturePointer: v,
          onPrepareStart: x,
          onStart: O,
          onPrepareMove: A,
          onMove: Y,
          onEnd: G,
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
            case B.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case B.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === we.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (L.once(M.read, this._prepareMove, this._moveId),
                    L.once(M.write, this._applyMove, this._moveId)));
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
          this._startPhase !== H.Init ||
          ((this._startPhase = H.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Jt(t, this),
          )),
          this._applyModifiers(xe.Start, 0, 0),
          this._emit(k.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = H.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== H.FinishPrepare)) {
          if (((this._startPhase = H.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof ve && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Kt(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: Q.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Yn(n, r) || (!Ze(n) && !Ze(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Le(t.clientRect.x - s.x, 3)), (i.y += Le(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: Q.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Ut),
            this._emit(k.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = H.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(xe.Move, r, s),
          this._emit(k.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: Q.Move, draggable: this, drag: e, item: t }));
          (this._emit(k.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: Q.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let s = this.settings.positionModifiers,
          i = this._modifierData;
        i.drag = r;
        for (let o of r.items) {
          let a = Gn;
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
          ((this._startPhase = H.Init),
          (n.predicateState = B.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Qt(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = B.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === we.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (L.once(M.read, this._prepareStart, this._startId),
              L.once(M.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === B.Pending &&
          ((t.predicateState = B.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === H.Prepare || this._startPhase === H.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = H.None),
          L.off(M.read, this._startId),
          L.off(M.write, this._startId),
          L.off(M.read, this._moveId),
          L.off(M.write, this._moveId),
          L.off(M.read, this._alignId),
          L.off(M.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Ut),
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
        this._applyModifiers(xe.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Kt(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: Q.End, draggable: this, drag: e, item: n });
        }
        for (let n of e.items)
          if (n.elementContainer !== n.dragContainer) {
            let r = n.element.getBoundingClientRect();
            ((n.alignmentOffset.x = Le(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = Le(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: Q.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(k.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === we.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (L.once(M.read, this._prepareAlign, this._alignId),
              L.once(M.write, this._applyAlign, this._alignId)));
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
          this._emit(k.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  function Un(e, t) {
    return Math.round(e / t) * t;
  }
  function en(e, t, n) {
    let r = n - t,
      s = Math.abs(r);
    if (s >= e) {
      let i = s % e;
      return Un(r > 0 ? r - i : r + i, e);
    }
    return 0;
  }
  function tt(e, t) {
    return function (n, { item: r }) {
      let s = r.data.__snap__ || (r.data.__snap__ = { snapX: 0, snapY: 0, sensorX: 0, sensorY: 0 });
      ((s.sensorX += n.x), (s.sensorY += n.y));
      let i = en(e, s.snapX, s.sensorX),
        o = en(t, s.snapY, s.sensorY);
      return ((s.snapX += i), (s.snapY += o), (n.x = i), (n.y = o), n);
    };
  }
  var tn = class {
    constructor() {
      u(this, 'drag');
      u(this, 'isDestroyed');
      u(this, '_emitter');
      ((this.drag = null), (this.isDestroyed = !1), (this._emitter = new ee()));
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
        this._emitter.emit(y.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(y.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(y.End, t),
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
        this._emitter.emit(y.Cancel, t),
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
          type: y.Cancel,
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
        this._emitter.emit(y.Destroy, { type: y.Destroy }),
        this._emitter.off());
    }
  };
  var oe = {
      moveDistance: 25,
      cancelOnBlur: !0,
      cancelOnVisibilityChange: !0,
      startPredicate: (e, t) => {
        if (
          t.element &&
          (e.key === 'Enter' || e.key === ' ') &&
          document.activeElement === t.element
        ) {
          let { x: n, y: r } = t.element.getBoundingClientRect();
          return { x: n, y: r };
        }
        return null;
      },
      movePredicate: (e, t) => {
        if (!t.drag) return null;
        switch (e.key) {
          case 'ArrowLeft':
            return { x: t.drag.x - t.moveDistance.x, y: t.drag.y };
          case 'ArrowRight':
            return { x: t.drag.x + t.moveDistance.x, y: t.drag.y };
          case 'ArrowUp':
            return { x: t.drag.x, y: t.drag.y - t.moveDistance.y };
          case 'ArrowDown':
            return { x: t.drag.x, y: t.drag.y + t.moveDistance.y };
          default:
            return null;
        }
      },
      cancelPredicate: (e, t) => {
        if (t.drag && e.key === 'Escape') {
          let { x: n, y: r } = t.drag;
          return { x: n, y: r };
        }
        return null;
      },
      endPredicate: (e, t) => {
        if (t.drag && (e.key === 'Enter' || e.key === ' ')) {
          let { x: n, y: r } = t.drag;
          return { x: n, y: r };
        }
        return null;
      },
    },
    nn = class extends tn {
      constructor(t, n = {}) {
        super();
        u(this, 'element');
        u(this, 'moveDistance');
        u(this, '_cancelOnBlur');
        u(this, '_cancelOnVisibilityChange');
        u(this, '_startPredicate');
        u(this, '_movePredicate');
        u(this, '_cancelPredicate');
        u(this, '_endPredicate');
        u(this, '_eventData', null);
        let {
          moveDistance: r = oe.moveDistance,
          cancelOnBlur: s = oe.cancelOnBlur,
          cancelOnVisibilityChange: i = oe.cancelOnVisibilityChange,
          startPredicate: o = oe.startPredicate,
          movePredicate: a = oe.movePredicate,
          cancelPredicate: l = oe.cancelPredicate,
          endPredicate: f = oe.endPredicate,
        } = n;
        ((this.element = t),
          (this.moveDistance = typeof r == 'number' ? { x: r, y: r } : { ...r }),
          (this._cancelOnBlur = s),
          (this._cancelOnVisibilityChange = i),
          (this._startPredicate = o),
          (this._movePredicate = a),
          (this._cancelPredicate = l),
          (this._endPredicate = f),
          (this._onKeyDown = this._onKeyDown.bind(this)),
          (this._internalCancel = this._internalCancel.bind(this)),
          (this._blurCancelHandler = this._blurCancelHandler.bind(this)),
          document.addEventListener('keydown', this._onKeyDown),
          s && t?.addEventListener('blur', this._blurCancelHandler),
          i && document.addEventListener('visibilitychange', this._internalCancel));
      }
      _internalCancel() {
        this.cancel();
      }
      _blurCancelHandler() {
        queueMicrotask(() => {
          document.activeElement !== this.element && this.cancel();
        });
      }
      _onKeyDown(t) {
        let n = this._eventData;
        if (!this.drag) {
          let o = this._startPredicate(t, this);
          o &&
            (t.preventDefault(),
            (this._eventData = { type: y.Start, x: o.x, y: o.y, srcEvent: t }),
            this._start(this._eventData));
          return;
        }
        let r = this._cancelPredicate(t, this);
        if (r) {
          (t.preventDefault(),
            (n.type = y.Cancel),
            (n.x = r.x),
            (n.y = r.y),
            (n.srcEvent = t),
            this._cancel(n));
          return;
        }
        let s = this._endPredicate(t, this);
        if (s) {
          (t.preventDefault(),
            (n.type = y.End),
            (n.x = s.x),
            (n.y = s.y),
            (n.srcEvent = t),
            this._end(n));
          return;
        }
        let i = this._movePredicate(t, this);
        if (i) {
          (t.preventDefault(),
            (n.type = y.Move),
            (n.x = i.x),
            (n.y = i.y),
            (n.srcEvent = t),
            this._move(n));
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
        let {
          moveDistance: n,
          cancelOnBlur: r,
          cancelOnVisibilityChange: s,
          startPredicate: i,
          movePredicate: o,
          cancelPredicate: a,
          endPredicate: l,
        } = t;
        (n !== void 0 &&
          (typeof n == 'number'
            ? (this.moveDistance.x = this.moveDistance.y = n)
            : ((this.moveDistance.x = n.x), (this.moveDistance.y = n.y))),
          r !== void 0 &&
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
          i && (this._startPredicate = i),
          o && (this._movePredicate = o),
          a && (this._cancelPredicate = a),
          l && (this._endPredicate = l));
      }
      destroy() {
        this.isDestroyed ||
          (super.destroy(),
          document.removeEventListener('keydown', this._onKeyDown),
          this._cancelOnBlur && this.element?.removeEventListener('blur', this._blurCancelHandler),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._internalCancel));
      }
    };
  var Qn = () => {},
    V = new Map(),
    rt = new Set();
  function nt() {
    rt.forEach((e) => e());
  }
  var Ee = {
    add(e, t, n) {
      ((V = new Map(V)), V.set(e, { sources: t, proxies: n, exiting: !1, done: Qn }), nt());
    },
    startExiting(e, t) {
      let n = V.get(e);
      n && ((V = new Map(V)), V.set(e, { ...n, exiting: !0, done: t }), nt());
    },
    remove(e) {
      V.has(e) && ((V = new Map(V)), V.delete(e), nt());
    },
    subscribe(e) {
      return (rt.add(e), () => rt.delete(e));
    },
    getSnapshot() {
      return V;
    },
  };
  var Jn = (e) => typeof e == 'function' && e.length === 0;
  function j(e, t) {
    return e === void 0 ? t : Jn(e) ? e() : e;
  }
  function rn(e) {
    return e.map((t) => j(t));
  }
  var Zn = () => null,
    sn = Et(Zn);
  function on() {
    return Xe(sn);
  }
  var er = Object.prototype.hasOwnProperty,
    an = (e) => {
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
    if (!an(e) || !an(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let f = o[l];
      if (!er.call(t, f) || !$e(e[f], t[f])) return !1;
    }
    return !0;
  }
  var Ne = new Map(),
    He = [],
    st = [],
    it = [],
    ot = [],
    at = [],
    lt = [],
    ct = [],
    ut = [];
  function ln() {
    (Ne.clear(),
      (He.length = 0),
      (st.length = 0),
      (it.length = 0),
      (ot.length = 0),
      (at.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (ut.length = 0));
  }
  function cn(e) {
    let t = [];
    ln();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = N(r),
        a = se(r),
        l = a ? o.transformOrigin : '',
        f,
        c;
      if (r instanceof SVGSVGElement) ((f = `${i.width}px`), (c = `${i.height}px`));
      else {
        let v = parseFloat(o.width),
          x = parseFloat(o.height);
        if (!(v >= 0) || !(x >= 0)) ((f = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((f = o.width), (c = o.height));
        else {
          let O = parseFloat(o.paddingLeft) || 0,
            A = parseFloat(o.paddingRight) || 0,
            Y = parseFloat(o.borderLeftWidth) || 0,
            G = parseFloat(o.borderRightWidth) || 0,
            re = parseFloat(o.paddingTop) || 0,
            m = parseFloat(o.paddingBottom) || 0,
            b = parseFloat(o.borderTopWidth) || 0,
            X = parseFloat(o.borderBottomWidth) || 0;
          ((f = `${v + O + A + Y + G}px`), (c = `${x + re + m + b + X}px`));
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
        (He[n] = s),
        (t[n] = h),
        (st[n] = i),
        (it[n] = a),
        (ot[n] = l),
        (at[n] = f),
        (lt[n] = c),
        Ne.has(s) || Ne.set(s, _e(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = He[n],
        s = t[n],
        i = it[n],
        o = ot[n],
        a = at[n],
        l = lt[n],
        f = s.style;
      ((f.width = a),
        (f.height = l),
        i && ((f.transform = i), o && (f.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = He[n],
        s = t[n],
        i = st[n],
        o = Ne.get(r),
        a = 0,
        l = 0,
        f = o.m11,
        c = o.m12,
        h = o.m21,
        g = o.m22,
        v = f * g - c * h,
        x = s.getBoundingClientRect(),
        O = i.left - x.left,
        A = i.top - x.top;
      if (Math.abs(v) < 1e-10) ((a = O), (l = A));
      else {
        let Y = 1 / v;
        ((a = (g * O - h * A) * Y), (l = (-c * O + f * A) * Y));
      }
      ((ct[n] = a), (ut[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = ct[n],
        i = ut[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (ln(), t);
  }
  function un(e, t) {
    if (ce) return () => null;
    let n = E(() => (Array.isArray(e) ? rn(e) : (j(e) ?? [])).filter((m) => !!m)),
      r = E(() => j(t)),
      s = E(() => r()?.id),
      i = E(() => r()?.dndObserver),
      o = E(() => {
        let m = r();
        if (!m) return;
        let {
          dndObserver: b,
          id: X,
          dragPreviewContainer: De,
          dragPreviewExitTimeout: D,
          ...q
        } = m;
        return q;
      }),
      a = on(),
      l = E(() => {
        let m = i();
        return m === void 0 ? a() : m;
      }),
      [f, c] = F(null),
      h = null,
      g = s(),
      v = o(),
      x = l(),
      O = o(),
      A = r()?.dragPreviewContainer,
      Y = r()?.dragPreviewExitTimeout;
    P(() => {
      let m = r();
      ((O = o()), (A = m?.dragPreviewContainer), (Y = m?.dragPreviewExitTimeout));
    });
    let G = () => {
        h && (h.destroy(), (h = null), (v = void 0), c(null));
      },
      re = () => {
        wt(() => {
          G();
          let m = I(n);
          if (!m.length) return;
          let b = I(o),
            X = s(),
            De = b?.dragPreview,
            D = new et(m, {
              id: X,
              ...b,
              elements(T) {
                let dt = O,
                  ue = (dt?.elements || (() => null))(T);
                if (!dt?.dragPreview || !ue || ue.length === 0) return ue;
                let de = cn(ue);
                Ee.add(T.draggable, ue, de);
                let ft = () => {
                    let ht = Y || 0;
                    if (ht > 0) {
                      for (let Be of de) Be.dataset.exiting = 'true';
                      let Ce = !1,
                        gt = () => {
                          Ce ||
                            ((Ce = !0),
                            clearTimeout(bn),
                            Ee.remove(T.draggable),
                            setTimeout(() => {
                              for (let Be of de) Be.remove();
                            }, 0));
                        },
                        bn = setTimeout(gt, ht);
                      Ee.startExiting(T.draggable, gt);
                    } else
                      (Ee.remove(T.draggable),
                        setTimeout(() => {
                          for (let Ce of de) Ce.remove();
                        }, 0));
                    (T.draggable.off('end', yn), T.draggable.off('destroy', vn));
                  },
                  yn = T.draggable.on('end', ft),
                  vn = T.draggable.on('destroy', ft);
                return de;
              },
              ...(De
                ? {
                    container: () => {
                      let T = A;
                      return (typeof T == 'function' ? T() : T) || document.body;
                    },
                  }
                : {}),
            }),
            q = I(l);
          (q?.addDraggables([D]), (h = D), (g = X), (v = b), (x = q), c(D));
        });
      };
    return (
      P(() => {
        let m = n();
        if (!m.length) {
          G();
          return;
        }
        let b = h;
        if (!b) {
          re();
          return;
        }
        (m.length !== b.sensors.length || m.some((X) => !b.sensors.includes(X))) && re();
      }),
      P(() => {
        if (!h) return;
        let b = s();
        g !== b && re();
      }),
      P(() => {
        let m = l();
        if (x === m) return;
        let b = h;
        (b && (x?.removeDraggables([b]), m?.addDraggables([b])), (x = m));
      }),
      P(() => {
        let m = h;
        if (!m) return;
        let b = o(),
          X = !1;
        if (v) {
          let D = { ...v },
            q = { ...b };
          ((D.elements === q.elements || (D.dragPreview && q.dragPreview)) &&
            (delete D.elements, delete q.elements),
            (X = !$e(D, q)));
        } else X = !0;
        if (!X) return;
        let De = m._parseSettings(b);
        if (
          (m.updateSettings({
            ...De,
            ...(!b?.dragPreview && b?.elements ? { elements: b.elements } : {}),
            ...(b?.dragPreview
              ? {
                  container: () => {
                    let D = A;
                    return (typeof D == 'function' ? D() : D) || document.body;
                  },
                }
              : {}),
          }),
          v)
        ) {
          let D = b?.dndGroups !== v.dndGroups,
            q = b?.computeClientRect !== v.computeClientRect;
          (D && x?.clearTargets(m), (D || q) && x?.detectCollisions(m));
        }
        v = b;
      }),
      $(G),
      f
    );
  }
  function dn(e, t = !1) {
    let n = E(() => j(e)),
      [r, s] = F(null),
      [i, o] = F(0);
    return (
      P(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(k.Start, () => {
            s(a.drag || null);
          }),
          f = null;
        t &&
          (f = a.on(k.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(k.End, () => {
          s(null);
        });
        $(() => {
          (a.off(k.Start, l), f && a.off(k.Move, f), a.off(k.End, c));
        });
      }),
      E(() => (i(), r()))
    );
  }
  function fn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = E(() => j(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : j(t))),
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
        let h = new nn(c, n());
        ((o = h), i(h));
      };
    (P(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      P(() => {
        let c = r();
        c !== void 0 && (l(c), $(a));
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
    return ($(a), [s, f]);
  }
  function hn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = E(() => j(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : j(t))),
      [s, i] = F(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new ve(c, n());
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
          (l(c), $(a));
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
    return ($(a), [s, f]);
  }
  var tr = Tt(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    gn = 40,
    pn = 40;
  function nr() {
    let e = null,
      [t, n] = hn(),
      [r, s] = fn({ moveDistance: { x: gn, y: pn } }),
      i = un([t, r], { elements: () => (e ? [e] : []), positionModifiers: [tt(gn, pn)] }),
      o = dn(i),
      a = (l) => {
        ((e = l), n(l), s(l));
      };
    return (() => {
      var l = tr();
      return (Lt(a, l), Z(() => It(l, `card draggable ${o() ? 'dragging' : ''}`)), l);
    })();
  }
  function rr() {
    return Ae(nr, {});
  }
  var mn = document.getElementById('root');
  if (!mn) throw new Error('Failed to find the root element');
  kt(() => Ae(rr, {}), mn);
})();
