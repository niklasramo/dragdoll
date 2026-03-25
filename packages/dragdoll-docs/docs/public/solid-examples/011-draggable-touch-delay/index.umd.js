'use strict';
var SolidExample_011_draggable_touch_delay = (() => {
  var yn = Object.defineProperty;
  var vn = (e, t, n) =>
    t in e ? yn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => vn(e, typeof t != 'symbol' ? t + '' : t, n);
  var E = {
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
    return E.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Be(e) {
    E.context = e;
  }
  function bn() {
    return { ...E.context, id: E.getNextContextId(), count: 0 };
  }
  var _n = !1,
    Sn = (e, t) => e === t;
  var De = { equals: Sn },
    gt = null,
    bt = Ct,
    R = 1,
    fe = 2,
    _t = { owned: null, cleanups: null, context: null, owner: null };
  var m = null,
    f = null,
    he = null,
    oe = null,
    _ = null,
    D = null,
    M = null,
    Oe = 0;
  function St(e, t) {
    let n = _,
      r = m,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? _t : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => I(() => Z(o)));
    ((m = o), (_ = null));
    try {
      return z(a, !0);
    } finally {
      ((_ = n), (m = r));
    }
  }
  function Y(e, t) {
    t = t ? Object.assign({}, De, t) : De;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (f && f.running && f.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Dt(n, s)
      );
    return [Et.bind(n), r];
  }
  function ee(e, t, n) {
    let r = We(e, t, !1, R);
    he && f && f.running ? D.push(r) : pe(r);
  }
  function F(e, t, n) {
    bt = Cn;
    let r = We(e, t, !1, R),
      s = Ve && qe(Ve);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), M ? M.push(r) : pe(r));
  }
  function P(e, t, n) {
    n = n ? Object.assign({}, De, n) : De;
    let r = We(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      he && f && f.running ? ((r.tState = R), D.push(r)) : pe(r),
      Et.bind(r)
    );
  }
  function wt(e) {
    return z(e, !1);
  }
  function I(e) {
    if (!oe && _ === null) return e();
    let t = _;
    _ = null;
    try {
      return oe ? oe.untrack(e) : e();
    } finally {
      _ = t;
    }
  }
  function G(e) {
    return (m === null || (m.cleanups === null ? (m.cleanups = [e]) : m.cleanups.push(e)), e);
  }
  function wn(e) {
    if (f && f.running) return (e(), f.done);
    let t = _,
      n = m;
    return Promise.resolve().then(() => {
      ((_ = t), (m = n));
      let r;
      return (
        (he || Ve) &&
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
        (_ = m = null),
        r ? r.done : void 0
      );
    });
  }
  var [sr, mt] = Y(!1);
  function xt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Mn(n), defaultValue: e };
  }
  function qe(e) {
    let t;
    return m && m.context && (t = m.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function xn(e) {
    let t = P(e),
      n = P(() => je(t()));
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
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === R) pe(this);
      else {
        let t = D;
        ((D = null), z(() => Ce(this), !1), (D = t));
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
    return e && f.sources.has(this) ? this.tValue : this.value;
  }
  function Dt(e, t, n) {
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
              ((o ? !i.tState : !i.state) && (i.pure ? D.push(i) : M.push(i), i.observers && Ot(i)),
              o ? (i.tState = R) : (i.state = R));
          }
          if (D.length > 1e6) throw ((D = []), new Error());
        }, !1);
    }
    return t;
  }
  function pe(e) {
    if (!e.fn) return;
    Z(e);
    let t = Oe;
    (yt(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          z(() => {
            (f && (f.running = !0), (_ = m = e), yt(e, e.tValue, t), (_ = m = null));
          }, !1);
        }));
  }
  function yt(e, t, n) {
    let r,
      s = m,
      i = _;
    _ = m = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = R), e.tOwned && e.tOwned.forEach(Z), (e.tOwned = void 0))
            : ((e.state = R), e.owned && e.owned.forEach(Z), (e.owned = null))),
        (e.updatedAt = n + 1),
        ze(o)
      );
    } finally {
      ((_ = i), (m = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Dt(e, r, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = r), f.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function We(e, t, n, r = R, s) {
    let i = {
      fn: e,
      state: r,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: m,
      context: m ? m.context : null,
      pure: n,
    };
    if (
      (f && f.running && ((i.state = 0), (i.tState = r)),
      m === null ||
        (m !== _t &&
          (f && f.running && m.pure
            ? m.tOwned
              ? m.tOwned.push(i)
              : (m.tOwned = [i])
            : m.owned
              ? m.owned.push(i)
              : (m.owned = [i]))),
      oe && i.fn)
    ) {
      let o = i.fn,
        [a, l] = Y(void 0, { equals: !1 }),
        u = oe.factory(o, l);
      G(() => u.dispose());
      let c,
        h = () =>
          wn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (p) => (a(), f && f.running ? (c || (c = oe.factory(o, h)), c.track(p)) : u.track(p));
    }
    return i;
  }
  function de(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === fe) return Ce(e);
    if (e.suspense && I(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Oe); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (f.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === R) pe(e);
      else if ((t ? e.tState : e.state) === fe) {
        let s = D;
        ((D = null), z(() => Ce(e, n[0]), !1), (D = s));
      }
    }
  }
  function z(e, t) {
    if (D) return e();
    let n = !1;
    (t || (D = []), M ? (n = !0) : (M = []), Oe++);
    try {
      let r = e();
      return (En(n), r);
    } catch (r) {
      (n || (M = null), (D = null), ze(r));
    }
  }
  function En(e) {
    if ((D && (he && f && f.running ? Dn(D) : Ct(D), (D = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let r = f.sources,
          s = f.disposed;
        (M.push.apply(M, f.effects), (t = f.resolve));
        for (let i of M) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((f = null),
          z(() => {
            for (let i of s) Z(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) Z(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            mt(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, M), (M = null), mt(!0));
        return;
      }
    }
    let n = M;
    ((M = null), n.length && z(() => bt(n), !1), t && t());
  }
  function Ct(e) {
    for (let t = 0; t < e.length; t++) de(e[t]);
  }
  function Dn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = f.queue;
      r.has(n) ||
        (r.add(n),
        he(() => {
          (r.delete(n),
            z(() => {
              ((f.running = !0), de(n));
            }, !1),
            f && (f.running = !1));
        }));
    }
  }
  function Cn(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : de(r);
    }
    if (E.context) {
      if (E.count) {
        (E.effects || (E.effects = []), E.effects.push(...e.slice(0, n)));
        return;
      }
      Be();
    }
    for (
      E.effects &&
        (E.done || !E.count) &&
        ((e = [...E.effects, ...e]), (n += E.effects.length), delete E.effects),
        t = 0;
      t < n;
      t++
    )
      de(e[t]);
  }
  function Ce(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === R ? s !== t && (!s.updatedAt || s.updatedAt < Oe) && de(s) : i === fe && Ce(s, t);
      }
    }
  }
  function Ot(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = fe) : (r.state = fe),
        r.pure ? D.push(r) : M.push(r),
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
    if (f && f.running && e.pure) Mt(e, !0);
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
  function Mt(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Mt(e.owned[n]);
  }
  function On(e) {
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
  function ze(e, t = m) {
    let n = gt && t && t.context && t.context[gt],
      r = On(e);
    if (!n) throw r;
    M
      ? M.push({
          fn() {
            vt(r, n, t);
          },
          state: R,
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
  function Mn(e, t) {
    return function (r) {
      let s;
      return (
        ee(
          () => (s = I(() => ((m.context = { ...m.context, [e]: r.value }), xn(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Pn = !1;
  function Me(e, t) {
    if (Pn && E.context) {
      let n = E.context;
      Be(bn());
      let r = I(() => e(t || {}));
      return (Be(n), r);
    }
    return I(() => e(t || {}));
  }
  var Tn = [
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
    br = new Set([
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
      ...Tn,
    ]);
  function kn(e, t, n) {
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
              p = 1,
              g;
            for (; ++h < s && h < i && !((g = u.get(t[h])) == null || g !== c + p); ) p++;
            if (p > c - a) {
              let v = t[o];
              for (; a < c; ) e.insertBefore(n[a++], v);
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
        ((s = i), t === document ? e() : In(t, e(), t.firstChild ? null : void 0, n));
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
  function kt(e, t) {
    Lt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function It(e, t, n) {
    return I(() => e(t, n));
  }
  function In(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Pe(e, t, r, n);
    ee((s) => Pe(e, t(), s, n), r);
  }
  function Lt(e) {
    return !!E.context && !E.done && (!e || e.isConnected);
  }
  function Pe(e, t, n, r, s) {
    let i = Lt(e);
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
          (n = ae(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = ae(e, n, r);
    } else {
      if (o === 'function')
        return (
          ee(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Pe(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          u = n && Array.isArray(n);
        if (Ye(l, t, n, s)) return (ee(() => (n = Pe(e, l, n, r, !0))), () => n);
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
          if (((n = ae(e, n, r)), a)) return n;
        } else u ? (n.length === 0 ? Pt(e, l, r) : kn(e, n, l)) : (n && ae(e), Pt(e, l));
        n = l;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = ae(e, n, r, t));
          ae(e, n, null, t);
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
        u;
      if (!(a == null || a === !0 || a === !1))
        if ((u = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Ye(e, a, l) || s;
        else if (u === 'function')
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
  function ae(e, t, n, r) {
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
    le = class {
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
  var Ln = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new le({ getId: r, dedupe: n })),
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
  function Xe(e = 60) {
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
  var Rt = class extends Ln {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Xe(), ...s } = e;
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
  var A = { read: Symbol(), write: Symbol() },
    L = new Rt({
      phases: [A.read, A.write],
      requestFrame: typeof window < 'u' ? Xe() : () => () => {},
    });
  var Ft = new WeakMap();
  function T(e) {
    let t = Ft.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Ft.set(e, new WeakRef(t))), t);
  }
  var Rn = typeof window < 'u' && window.document !== void 0,
    Ge = !!(
      Rn &&
      navigator.vendor &&
      navigator.vendor.indexOf('Apple') > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf('CriOS') == -1 &&
      navigator.userAgent.indexOf('FxiOS') == -1
    ),
    me = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    kr = {
      [me.content]: !1,
      [me.padding]: !1,
      [me.scrollbar]: !0,
      [me.border]: !0,
      [me.margin]: !0,
    };
  var Ir = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function $t(e) {
    return e instanceof Window;
  }
  var Nt = new WeakMap();
  function q(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Nt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Nt.set(e, new WeakRef(n))), n);
  }
  function Ht(e) {
    return e instanceof HTMLHtmlElement;
  }
  function Bt(e) {
    return e instanceof Document;
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
  var w = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
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
  function Fn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function $n(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Wt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function zt(e) {
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
    K = class {
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
          (this._listenerOptions = Wt(n)),
          (this._sourceEvents = zt(r)),
          (this._emitter = new le()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(te[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
        let t = Fn(e);
        if (t === null) return;
        let n = qt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: $n(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: w.Start, srcEvent: e, target: n.target }),
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
          (n.type = w.Move),
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
          (n.type = w.Cancel),
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
          (n.type = w.End),
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
          ((this._eventData.type = w.Cancel),
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
          l = zt(n),
          u = Wt(t);
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
              te[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && u && (this._listenerOptions = u),
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
          this._emitter.emit(w.Destroy, { type: w.Destroy }),
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
  function Nn(e) {
    let t = T(e),
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
  function Hn(e) {
    let t = T(e),
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
    let { translate: n, rotate: r, scale: s, transform: i } = T(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', u] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Hn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Nn(e)}px`),
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
  function ye(e) {
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
  function ve(e, t = new DOMMatrix()) {
    let n = e;
    for (ye(t); n; ) {
      let r = se(n);
      if (r && (ie.setMatrixValue(r), !ie.isIdentity)) {
        let { transformOrigin: s } = T(n),
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
  function ke(e) {
    let t = q(e);
    if (!Ge) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: u } = t;
      if (u && u !== 'none') return !0;
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
  function Yt(e) {
    return q(e).position !== 'static' || ke(e);
  }
  function Ke(e, t = {}) {
    if (Ht(e)) return e.ownerDocument.defaultView;
    let n = t.position || q(e).position,
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
  function Qe(e, t = {}) {
    let n = q(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || q(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return Ke(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = Ke(e, { container: o, position: s, skipDisplayNone: i });
        return $t(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Bn(e, t) {
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
  function Vn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function jn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      Vn(
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
      s = T(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function Ut(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var qn = { x: 0, y: 0 },
    Wn = { x: 0, y: 0 };
  function zn(e, t, n = { x: 0, y: 0 }) {
    let r = Ut(e) ? e : _e(e, qn),
      s = Ut(t) ? t : _e(t, Wn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Le = U ? jn() : null,
    Jt = class {
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
        let r = T(e),
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
        let u = Qe(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = l === o ? u : Qe(e, { container: l })));
        {
          let { width: h, height: p, x: g, y: v } = s;
          this.clientRect = { width: h, height: p, x: g, y: v };
        }
        (this._updateContainerMatrices(), this._updateContainerOffset());
        let c = t.settings.frozenStyles({ draggable: t, drag: n, item: this, style: r });
        if (Array.isArray(c))
          if (c.length) {
            let h = {};
            for (let p of c) h[p] = r[p];
            this.frozenStyles = h;
          } else this.frozenStyles = null;
        else this.frozenStyles = c;
        if (this.frozenStyles) {
          let h = {};
          for (let p in this.frozenStyles) h[p] = e.style[p];
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
          ].map(([u, c]) => {
            let h = i.get(c) || { x: 0, y: 0 };
            if (!i.isValid(c)) {
              let p = o.get(u);
              c instanceof HTMLElement && p && !p[0].isIdentity
                ? Je(p[0])
                  ? (Le.style.setProperty('transform', p[1].toString(), 'important'),
                    c.append(Le),
                    _e(Le, h),
                    Le.remove())
                  : (_e(c, h), (h.x -= p[0].m41), (h.y -= p[0].m42))
                : _e(c, h);
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
    Kt = { capture: !0, passive: !0 },
    Yn = { x: 0, y: 0 },
    W = U ? new DOMMatrix() : null,
    Re = U ? new DOMMatrix() : null,
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
    N = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(N || {}),
    be = { Start: 'start', Move: 'move', End: 'end' },
    Se = { Immediate: 'immediate', Sampled: 'sampled' },
    Q = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    C = {
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
            containerOffset: u,
            elementTransformMatrix: c,
            elementTransformOrigin: h,
            elementOffsetMatrix: p,
          } = e,
          { x: g, y: v, z: x } = h,
          S = !c.isIdentity && (g !== 0 || v !== 0 || x !== 0),
          B = a.x + l.x + u.x,
          X = a.y + l.y + u.y;
        (ye(W),
          S && (x === 0 ? W.translateSelf(-g, -v) : W.translateSelf(-g, -v, -x)),
          n ? s.isIdentity || W.multiplySelf(s) : o.isIdentity || W.multiplySelf(o),
          ye(Re).translateSelf(B, X),
          W.multiplySelf(Re),
          r.isIdentity || W.multiplySelf(r),
          S && (ye(Re).translateSelf(g, v, x), W.multiplySelf(Re)),
          c.isIdentity || W.multiplySelf(c),
          p.isIdentity || W.preMultiplySelf(p),
          (e.element.style.transform = `${W}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: Se.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    Ze = class {
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
          (this._emitter = new le()),
          (this._startPhase = $.None),
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
          predicateState: N.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(w.Start, t, t), e.on(w.Move, t, t), e.on(w.Cancel, n, n), e.on(w.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(w.Start, n),
          e.off(w.Move, n),
          e.off(w.Cancel, r),
          e.off(w.End, r),
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
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: p = t.preventTextSelection,
          capturePointer: g = t.capturePointer,
          onPrepareStart: v = t.onPrepareStart,
          onStart: x = t.onStart,
          onPrepareMove: S = t.onPrepareMove,
          onMove: B = t.onMove,
          onEnd: X = t.onEnd,
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
          sensorProcessingMode: u,
          dndGroups: c,
          preventClickOnEnd: h,
          preventTextSelection: p,
          capturePointer: g,
          onPrepareStart: v,
          onStart: x,
          onPrepareMove: S,
          onMove: B,
          onEnd: X,
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
            case N.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case N.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === Se.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (L.once(A.read, this._prepareMove, this._moveId),
                    L.once(A.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === N.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = N.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = N.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== $.Init ||
          ((this._startPhase = $.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Jt(t, this),
          )),
          this._applyModifiers(be.Start, 0, 0),
          this._emit(C.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = $.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== $.FinishPrepare)) {
          if (((this._startPhase = $.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof K && t.drag) {
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
              this.settings.applyPosition({ phase: Q.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Bn(n, r) || (!Je(n) && !Je(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Ie(t.clientRect.x - s.x, 3)), (i.y += Ie(t.clientRect.y - s.y, 3)));
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
          (window.addEventListener('scroll', this._onScroll, Kt),
            this._emit(C.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = $.FinishApply));
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
          this._emit(C.PrepareMove, e, this),
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
          (this._emit(C.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
          let a = Yn;
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
        n.predicateState === N.Pending &&
          r &&
          ((this._startPhase = $.Init),
          (n.predicateState = N.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Qt(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = N.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (L.once(A.read, this._prepareStart, this._startId),
              L.once(A.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === N.Pending &&
          ((t.predicateState = N.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === $.Prepare || this._startPhase === $.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = $.None),
          L.off(A.read, this._startId),
          L.off(A.write, this._startId),
          L.off(A.read, this._moveId),
          L.off(A.write, this._moveId),
          L.off(A.read, this._alignId),
          L.off(A.write, this._alignId),
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
          this.settings.applyPosition({ phase: Q.End, draggable: this, drag: e, item: n });
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
            this.settings.applyPosition({ phase: Q.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(C.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (L.once(A.read, this._prepareAlign, this._alignId),
              L.once(A.write, this._applyAlign, this._alignId)));
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
          this._emit(C.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  var en = new Set(['auto', 'scroll', 'overlay']);
  function tn(e) {
    let t = T(e);
    return !!(en.has(t.overflowY) || en.has(t.overflowX));
  }
  function Xn(e, t = []) {
    let n = e?.parentNode;
    for (t.length = 0; n && !Bt(n); )
      n instanceof Element
        ? (tn(n) && t.push(n), (n = n.parentNode))
        : (n = n instanceof ShadowRoot ? n.host : n.parentNode);
    return (t.push(window), t);
  }
  function Gn(e) {
    let t = [];
    return (tn(e) && t.push(e), Xn(e, t), t);
  }
  function et(e = {}) {
    let t,
      n = 0,
      r = null,
      s,
      { touchDelay: i = 250, fallback: o = () => !0 } = e,
      a = (u) => u.preventDefault(),
      l = (u) => {
        if (n) {
          if (t) {
            u.cancelable && u.preventDefault();
            return;
          }
          t === void 0 &&
            (u.cancelable && u.timeStamp - n > i ? ((t = !0), u.preventDefault()) : (t = !1));
        }
      };
    return (u) => {
      if (!(u.sensor instanceof K)) return o(u);
      let { draggable: c, sensor: h, event: p } = u,
        g = p;
      if (g.pointerType === 'touch') {
        if (
          g.type === w.Start &&
          (g.srcEvent.type === 'pointerdown' || g.srcEvent.type === 'touchstart')
        ) {
          r = g.target;
          let v = r ? Gn(r) : [];
          v.forEach((S) => {
            S.addEventListener('touchmove', l, { passive: !1, capture: !0 });
          });
          let x = () => {
            n &&
              (c.off(C.End, x),
              c.sensors.forEach((S) => {
                S instanceof K && S.off(w.End, x);
              }),
              r?.removeEventListener('contextmenu', a),
              v.forEach((S) => {
                S.removeEventListener('touchmove', l, { capture: !0 });
              }),
              (n = 0),
              (t = void 0),
              (r = null),
              (s = void window.clearTimeout(s)));
          };
          ((t = void 0),
            (n = g.srcEvent.timeStamp),
            r?.addEventListener('contextmenu', a),
            c.on(C.End, x),
            c.sensors.forEach((S) => {
              S instanceof K && S.on(w.End, x);
            }),
            i > 0 &&
              (s = window.setTimeout(() => {
                (c.resolveStartPredicate(h), (t = !0), (s = void 0));
              }, i)));
        }
        return t;
      }
      return g.type === w.Start && !g.srcEvent.button;
    };
  }
  var nn = (e, { phase: t, drag: n }) => {
    if (t === 'start') {
      let r = n.sensor.drag?.startX ?? n.startEvent.startX,
        s = n.sensor.drag?.startY ?? n.startEvent.startY;
      r !== void 0 && s !== void 0 && ((e.x += n.startEvent.x - r), (e.y += n.startEvent.y - s));
    }
    return e;
  };
  var Un = () => {},
    H = new Map(),
    nt = new Set();
  function tt() {
    nt.forEach((e) => e());
  }
  var we = {
    add(e, t, n) {
      ((H = new Map(H)), H.set(e, { sources: t, proxies: n, exiting: !1, done: Un }), tt());
    },
    startExiting(e, t) {
      let n = H.get(e);
      n && ((H = new Map(H)), H.set(e, { ...n, exiting: !0, done: t }), tt());
    },
    remove(e) {
      H.has(e) && ((H = new Map(H)), H.delete(e), tt());
    },
    subscribe(e) {
      return (nt.add(e), () => nt.delete(e));
    },
    getSnapshot() {
      return H;
    },
  };
  var Kn = (e) => typeof e == 'function' && e.length === 0;
  function J(e, t) {
    return e === void 0 ? t : Kn(e) ? e() : e;
  }
  function rn(e) {
    return e.map((t) => J(t));
  }
  var Qn = () => null,
    sn = xt(Qn);
  function on() {
    return qe(sn);
  }
  var Jn = Object.prototype.hasOwnProperty,
    an = (e) => {
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
      for (let u = 0; u < l; u++) if (!Fe(e[u], t[u])) return !1;
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
      let u = o[l];
      if (!Jn.call(t, u) || !Fe(e[u], t[u])) return !1;
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
  function ln() {
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
  function cn(e) {
    let t = [];
    ln();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = T(r),
        a = se(r),
        l = a ? o.transformOrigin : '',
        u,
        c;
      if (r instanceof SVGSVGElement) ((u = `${i.width}px`), (c = `${i.height}px`));
      else {
        let g = parseFloat(o.width),
          v = parseFloat(o.height);
        if (!(g >= 0) || !(v >= 0)) ((u = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((u = o.width), (c = o.height));
        else {
          let x = parseFloat(o.paddingLeft) || 0,
            S = parseFloat(o.paddingRight) || 0,
            B = parseFloat(o.borderLeftWidth) || 0,
            X = parseFloat(o.borderRightWidth) || 0,
            re = parseFloat(o.paddingTop) || 0,
            y = parseFloat(o.paddingBottom) || 0,
            b = parseFloat(o.borderTopWidth) || 0,
            V = parseFloat(o.borderBottomWidth) || 0;
          ((u = `${g + x + S + B + X}px`), (c = `${v + re + y + b + V}px`));
        }
      }
      let h = document.createElement('div'),
        p = h.style;
      ((p.position = 'absolute'),
        (p.left = '0px'),
        (p.top = '0px'),
        (p.margin = '0'),
        (p.padding = '0'),
        (p.boxSizing = 'border-box'),
        (p.pointerEvents = 'none'),
        (p.contain = 'layout'),
        (h.dataset.dragPreviewProxy = 'true'),
        (Ne[n] = s),
        (t[n] = h),
        (rt[n] = i),
        (st[n] = a),
        (it[n] = l),
        (ot[n] = u),
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
        u = s.style;
      ((u.width = a),
        (u.height = l),
        i && ((u.transform = i), o && (u.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ne[n],
        s = t[n],
        i = rt[n],
        o = $e.get(r),
        a = 0,
        l = 0,
        u = o.m11,
        c = o.m12,
        h = o.m21,
        p = o.m22,
        g = u * p - c * h,
        v = s.getBoundingClientRect(),
        x = i.left - v.left,
        S = i.top - v.top;
      if (Math.abs(g) < 1e-10) ((a = x), (l = S));
      else {
        let B = 1 / g;
        ((a = (p * x - h * S) * B), (l = (-c * x + u * S) * B));
      }
      ((lt[n] = a), (ct[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = lt[n],
        i = ct[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (ln(), t);
  }
  function un(e, t) {
    if (Ae) return () => null;
    let n = P(() => (Array.isArray(e) ? rn(e) : (J(e) ?? [])).filter((y) => !!y)),
      r = P(() => J(t)),
      s = P(() => r()?.id),
      i = P(() => r()?.dndObserver),
      o = P(() => {
        let y = r();
        if (!y) return;
        let {
          dndObserver: b,
          id: V,
          dragPreviewContainer: xe,
          dragPreviewExitTimeout: O,
          ...j
        } = y;
        return j;
      }),
      a = on(),
      l = P(() => {
        let y = i();
        return y === void 0 ? a() : y;
      }),
      [u, c] = Y(null),
      h = null,
      p = s(),
      g = o(),
      v = l(),
      x = o(),
      S = r()?.dragPreviewContainer,
      B = r()?.dragPreviewExitTimeout;
    F(() => {
      let y = r();
      ((x = o()), (S = y?.dragPreviewContainer), (B = y?.dragPreviewExitTimeout));
    });
    let X = () => {
        h && (h.destroy(), (h = null), (g = void 0), c(null));
      },
      re = () => {
        wt(() => {
          X();
          let y = I(n);
          if (!y.length) return;
          let b = I(o),
            V = s(),
            xe = b?.dragPreview,
            O = new Ze(y, {
              id: V,
              ...b,
              elements(k) {
                let ut = x,
                  ce = (ut?.elements || (() => null))(k);
                if (!ut?.dragPreview || !ce || ce.length === 0) return ce;
                let ue = cn(ce);
                we.add(k.draggable, ce, ue);
                let ft = () => {
                    let dt = B || 0;
                    if (dt > 0) {
                      for (let He of ue) He.dataset.exiting = 'true';
                      let Ee = !1,
                        ht = () => {
                          Ee ||
                            ((Ee = !0),
                            clearTimeout(mn),
                            we.remove(k.draggable),
                            setTimeout(() => {
                              for (let He of ue) He.remove();
                            }, 0));
                        },
                        mn = setTimeout(ht, dt);
                      we.startExiting(k.draggable, ht);
                    } else
                      (we.remove(k.draggable),
                        setTimeout(() => {
                          for (let Ee of ue) Ee.remove();
                        }, 0));
                    (k.draggable.off('end', pn), k.draggable.off('destroy', gn));
                  },
                  pn = k.draggable.on('end', ft),
                  gn = k.draggable.on('destroy', ft);
                return ue;
              },
              ...(xe
                ? {
                    container: () => {
                      let k = S;
                      return (typeof k == 'function' ? k() : k) || document.body;
                    },
                  }
                : {}),
            }),
            j = I(l);
          (j?.addDraggables([O]), (h = O), (p = V), (g = b), (v = j), c(O));
        });
      };
    return (
      F(() => {
        let y = n();
        if (!y.length) {
          X();
          return;
        }
        let b = h;
        if (!b) {
          re();
          return;
        }
        (y.length !== b.sensors.length || y.some((V) => !b.sensors.includes(V))) && re();
      }),
      F(() => {
        if (!h) return;
        let b = s();
        p !== b && re();
      }),
      F(() => {
        let y = l();
        if (v === y) return;
        let b = h;
        (b && (v?.removeDraggables([b]), y?.addDraggables([b])), (v = y));
      }),
      F(() => {
        let y = h;
        if (!y) return;
        let b = o(),
          V = !1;
        if (g) {
          let O = { ...g },
            j = { ...b };
          ((O.elements === j.elements || (O.dragPreview && j.dragPreview)) &&
            (delete O.elements, delete j.elements),
            (V = !Fe(O, j)));
        } else V = !0;
        if (!V) return;
        let xe = y._parseSettings(b);
        if (
          (y.updateSettings({
            ...xe,
            ...(!b?.dragPreview && b?.elements ? { elements: b.elements } : {}),
            ...(b?.dragPreview
              ? {
                  container: () => {
                    let O = S;
                    return (typeof O == 'function' ? O() : O) || document.body;
                  },
                }
              : {}),
          }),
          g)
        ) {
          let O = b?.dndGroups !== g.dndGroups,
            j = b?.computeClientRect !== g.computeClientRect;
          (O && v?.clearTargets(y), (O || j) && v?.detectCollisions(y));
        }
        g = b;
      }),
      G(X),
      u
    );
  }
  function fn(e, t = !1) {
    let n = P(() => J(e)),
      [r, s] = Y(null),
      [i, o] = Y(0);
    return (
      F(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(C.Start, () => {
            s(a.drag || null);
          }),
          u = null;
        t &&
          (u = a.on(C.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(C.End, () => {
          s(null);
        });
        G(() => {
          (a.off(C.Start, l), u && a.off(C.Move, u), a.off(C.End, c));
        });
      }),
      P(() => (i(), r()))
    );
  }
  function dn(e = {}, t) {
    if (Ae) return [() => null, () => {}];
    let n = P(() => J(e, {}) || {}),
      r = P(() => (t === void 0 ? void 0 : J(t))),
      [s, i] = Y(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new K(c, n());
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
    let u = (c) => {
      if (t === void 0) {
        if (!c) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (G(a), [s, u]);
  }
  var Zn = Tt(
    '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
  );
  function er() {
    let e = null,
      [t, n] = dn(),
      r = {
        elements: () => (e ? [e] : []),
        startPredicate: et({ touchDelay: 1e3 }),
        positionModifiers: [nn],
      },
      s = un([t], r),
      i = fn(s),
      o = (a) => {
        ((e = a), n(a));
      };
    return (() => {
      var a = Zn();
      return (It(o, a), ee(() => kt(a, `card draggable ${i() ? 'dragging' : ''}`)), a);
    })();
  }
  function tr() {
    return Me(er, {});
  }
  var hn = document.getElementById('root');
  if (!hn) throw new Error('Failed to find the root element');
  At(() => Me(tr, {}), hn);
})();
