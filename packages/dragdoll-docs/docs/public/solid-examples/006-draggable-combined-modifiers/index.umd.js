'use strict';
var SolidExample_006_draggable_combined_modifiers = (() => {
  var bn = Object.defineProperty;
  var vn = (e, t, n) =>
    t in e ? bn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => vn(e, typeof t != 'symbol' ? t + '' : t, n);
  var x = {
    context: void 0,
    registry: void 0,
    effects: void 0,
    done: !1,
    getContextId() {
      return yt(this.context.count);
    },
    getNextContextId() {
      return yt(this.context.count++);
    },
  };
  function yt(e) {
    let t = String(e),
      n = t.length - 1;
    return x.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function qe(e) {
    x.context = e;
  }
  function _n() {
    return { ...x.context, id: x.getNextContextId(), count: 0 };
  }
  var xn = !1,
    wn = (e, t) => e === t;
  var Me = { equals: wn },
    bt = null,
    wt = Pt,
    L = 1,
    de = 2,
    St = { owned: null, cleanups: null, context: null, owner: null };
  var p = null,
    f = null,
    ge = null,
    ae = null,
    _ = null,
    w = null,
    C = null,
    Pe = 0;
  function Et(e, t) {
    let n = _,
      r = p,
      i = e.length === 0,
      s = t === void 0 ? r : t,
      a = i ? St : { owned: null, cleanups: null, context: s ? s.context : null, owner: s },
      o = i ? e : () => e(() => k(() => J(a)));
    ((p = a), (_ = null));
    try {
      return Y(o, !0);
    } finally {
      ((_ = n), (p = r));
    }
  }
  function X(e, t) {
    t = t ? Object.assign({}, Me, t) : Me;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (i) => (
        typeof i == 'function' &&
          (f && f.running && f.sources.has(n) ? (i = i(n.tValue)) : (i = i(n.value))),
        Ot(n, i)
      );
    return [Mt.bind(n), r];
  }
  function Z(e, t, n) {
    let r = ze(e, t, !1, L);
    ge && f && f.running ? w.push(r) : pe(r);
  }
  function R(e, t, n) {
    wt = Mn;
    let r = ze(e, t, !1, L),
      i = We && Xe(We);
    (i && (r.suspense = i), (!n || !n.render) && (r.user = !0), C ? C.push(r) : pe(r));
  }
  function D(e, t, n) {
    n = n ? Object.assign({}, Me, n) : Me;
    let r = ze(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      ge && f && f.running ? ((r.tState = L), w.push(r)) : pe(r),
      Mt.bind(r)
    );
  }
  function Ct(e) {
    return Y(e, !1);
  }
  function k(e) {
    if (!ae && _ === null) return e();
    let t = _;
    _ = null;
    try {
      return ae ? ae.untrack(e) : e();
    } finally {
      _ = t;
    }
  }
  function G(e) {
    return (p === null || (p.cleanups === null ? (p.cleanups = [e]) : p.cleanups.push(e)), e);
  }
  function Sn(e) {
    if (f && f.running) return (e(), f.done);
    let t = _,
      n = p;
    return Promise.resolve().then(() => {
      ((_ = t), (p = n));
      let r;
      return (
        (ge || We) &&
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
          r.done || (r.done = new Promise((i) => (r.resolve = i))),
          (r.running = !0)),
        Y(e, !1),
        (_ = p = null),
        r ? r.done : void 0
      );
    });
  }
  var [or, vt] = X(!1);
  function Dt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Pn(n), defaultValue: e };
  }
  function Xe(e) {
    let t;
    return p && p.context && (t = p.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function En(e) {
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
  var We;
  function Mt() {
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === L) pe(this);
      else {
        let t = w;
        ((w = null), Y(() => Oe(this), !1), (w = t));
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
  function Ot(e, t, n) {
    let r = f && f.running && f.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (f) {
        let i = f.running;
        ((i || (!n && f.sources.has(e))) && (f.sources.add(e), (e.tValue = t)), i || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        Y(() => {
          for (let i = 0; i < e.observers.length; i += 1) {
            let s = e.observers[i],
              a = f && f.running;
            (a && f.disposed.has(s)) ||
              ((a ? !s.tState : !s.state) && (s.pure ? w.push(s) : C.push(s), s.observers && At(s)),
              a ? (s.tState = L) : (s.state = L));
          }
          if (w.length > 1e6) throw ((w = []), new Error());
        }, !1);
    }
    return t;
  }
  function pe(e) {
    if (!e.fn) return;
    J(e);
    let t = Pe;
    (_t(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          Y(() => {
            (f && (f.running = !0), (_ = p = e), _t(e, e.tValue, t), (_ = p = null));
          }, !1);
        }));
  }
  function _t(e, t, n) {
    let r,
      i = p,
      s = _;
    _ = p = e;
    try {
      r = e.fn(t);
    } catch (a) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = L), e.tOwned && e.tOwned.forEach(J), (e.tOwned = void 0))
            : ((e.state = L), e.owned && e.owned.forEach(J), (e.owned = null))),
        (e.updatedAt = n + 1),
        Ge(a)
      );
    } finally {
      ((_ = s), (p = i));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Ot(e, r, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = r), f.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function ze(e, t, n, r = L, i) {
    let s = {
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
      (f && f.running && ((s.state = 0), (s.tState = r)),
      p === null ||
        (p !== St &&
          (f && f.running && p.pure
            ? p.tOwned
              ? p.tOwned.push(s)
              : (p.tOwned = [s])
            : p.owned
              ? p.owned.push(s)
              : (p.owned = [s]))),
      ae && s.fn)
    ) {
      let a = s.fn,
        [o, l] = X(void 0, { equals: !1 }),
        u = ae.factory(a, l);
      G(() => u.dispose());
      let c,
        h = () =>
          Sn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      s.fn = (g) => (o(), f && f.running ? (c || (c = ae.factory(a, h)), c.track(g)) : u.track(g));
    }
    return s;
  }
  function he(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === de) return Oe(e);
    if (e.suspense && k(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Pe); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let i = e,
          s = n[r + 1];
        for (; (i = i.owner) && i !== s; ) if (f.disposed.has(i)) return;
      }
      if ((t ? e.tState : e.state) === L) pe(e);
      else if ((t ? e.tState : e.state) === de) {
        let i = w;
        ((w = null), Y(() => Oe(e, n[0]), !1), (w = i));
      }
    }
  }
  function Y(e, t) {
    if (w) return e();
    let n = !1;
    (t || (w = []), C ? (n = !0) : (C = []), Pe++);
    try {
      let r = e();
      return (Cn(n), r);
    } catch (r) {
      (n || (C = null), (w = null), Ge(r));
    }
  }
  function Cn(e) {
    if ((w && (ge && f && f.running ? Dn(w) : Pt(w), (w = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let r = f.sources,
          i = f.disposed;
        (C.push.apply(C, f.effects), (t = f.resolve));
        for (let s of C) ('tState' in s && (s.state = s.tState), delete s.tState);
        ((f = null),
          Y(() => {
            for (let s of i) J(s);
            for (let s of r) {
              if (((s.value = s.tValue), s.owned))
                for (let a = 0, o = s.owned.length; a < o; a++) J(s.owned[a]);
              (s.tOwned && (s.owned = s.tOwned), delete s.tValue, delete s.tOwned, (s.tState = 0));
            }
            vt(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, C), (C = null), vt(!0));
        return;
      }
    }
    let n = C;
    ((C = null), n.length && Y(() => wt(n), !1), t && t());
  }
  function Pt(e) {
    for (let t = 0; t < e.length; t++) he(e[t]);
  }
  function Dn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = f.queue;
      r.has(n) ||
        (r.add(n),
        ge(() => {
          (r.delete(n),
            Y(() => {
              ((f.running = !0), he(n));
            }, !1),
            f && (f.running = !1));
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
    if (x.context) {
      if (x.count) {
        (x.effects || (x.effects = []), x.effects.push(...e.slice(0, n)));
        return;
      }
      qe();
    }
    for (
      x.effects &&
        (x.done || !x.count) &&
        ((e = [...x.effects, ...e]), (n += x.effects.length), delete x.effects),
        t = 0;
      t < n;
      t++
    )
      he(e[t]);
  }
  function Oe(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let i = e.sources[r];
      if (i.sources) {
        let s = n ? i.tState : i.state;
        s === L ? i !== t && (!i.updatedAt || i.updatedAt < Pe) && he(i) : s === de && Oe(i, t);
      }
    }
  }
  function At(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = de) : (r.state = de),
        r.pure ? w.push(r) : C.push(r),
        r.observers && At(r));
    }
  }
  function J(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        let n = e.sources.pop(),
          r = e.sourceSlots.pop(),
          i = n.observers;
        if (i && i.length) {
          let s = i.pop(),
            a = n.observerSlots.pop();
          r < i.length && ((s.sourceSlots[a] = r), (i[r] = s), (n.observerSlots[r] = a));
        }
      }
    if (e.tOwned) {
      for (t = e.tOwned.length - 1; t >= 0; t--) J(e.tOwned[t]);
      delete e.tOwned;
    }
    if (f && f.running && e.pure) Tt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) J(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    f && f.running ? (e.tState = 0) : (e.state = 0);
  }
  function Tt(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Tt(e.owned[n]);
  }
  function On(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function xt(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      Ge(r, (n && n.owner) || null);
    }
  }
  function Ge(e, t = p) {
    let n = bt && t && t.context && t.context[bt],
      r = On(e);
    if (!n) throw r;
    C
      ? C.push({
          fn() {
            xt(r, n, t);
          },
          state: L,
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
  function Pn(e, t) {
    return function (r) {
      let i;
      return (
        Z(
          () => (i = k(() => ((p.context = { ...p.context, [e]: r.value }), En(() => r.children)))),
          void 0,
        ),
        i
      );
    };
  }
  var An = !1;
  function Ae(e, t) {
    if (An && x.context) {
      let n = x.context;
      qe(_n());
      let r = k(() => e(t || {}));
      return (qe(n), r);
    }
    return k(() => e(t || {}));
  }
  var kn = [
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
      ...kn,
    ]);
  function In(e, t, n) {
    let r = n.length,
      i = t.length,
      s = r,
      a = 0,
      o = 0,
      l = t[i - 1].nextSibling,
      u = null;
    for (; a < i || o < s; ) {
      if (t[a] === n[o]) {
        (a++, o++);
        continue;
      }
      for (; t[i - 1] === n[s - 1]; ) (i--, s--);
      if (i === a) {
        let c = s < r ? (o ? n[o - 1].nextSibling : n[s - o]) : l;
        for (; o < s; ) e.insertBefore(n[o++], c);
      } else if (s === o) for (; a < i; ) ((!u || !u.has(t[a])) && t[a].remove(), a++);
      else if (t[a] === n[s - 1] && n[o] === t[i - 1]) {
        let c = t[--i].nextSibling;
        (e.insertBefore(n[o++], t[a++].nextSibling), e.insertBefore(n[--s], c), (t[i] = n[s]));
      } else {
        if (!u) {
          u = new Map();
          let h = o;
          for (; h < s; ) u.set(n[h], h++);
        }
        let c = u.get(t[a]);
        if (c != null)
          if (o < c && c < s) {
            let h = a,
              g = 1,
              m;
            for (; ++h < i && h < s && !((m = u.get(t[h])) == null || m !== c + g); ) g++;
            if (g > c - o) {
              let b = t[a];
              for (; o < c; ) e.insertBefore(n[o++], b);
            } else e.replaceChild(n[o++], t[a++]);
          } else a++;
        else t[a++].remove();
      }
    }
  }
  function It(e, t, n, r = {}) {
    let i;
    return (
      Et((s) => {
        ((i = s), t === document ? e() : Ln(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (i(), (t.textContent = ''));
      }
    );
  }
  function Lt(e, t, n, r) {
    let i,
      s = () => {
        let o = r
          ? document.createElementNS('http://www.w3.org/1998/Math/MathML', 'template')
          : document.createElement('template');
        return (
          (o.innerHTML = e),
          n ? o.content.firstChild.firstChild : r ? o.firstChild : o.content.firstChild
        );
      },
      a = t
        ? () => k(() => document.importNode(i || (i = s()), !0))
        : () => (i || (i = s())).cloneNode(!0);
    return ((a.cloneNode = a), a);
  }
  function Rt(e, t) {
    $t(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Ft(e, t, n) {
    return k(() => e(t, n));
  }
  function Ln(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Te(e, t, r, n);
    Z((i) => Te(e, t(), i, n), r);
  }
  function $t(e) {
    return !!x.context && !x.done && (!e || e.isConnected);
  }
  function Te(e, t, n, r, i) {
    let s = $t(e);
    if (s) {
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
    let a = typeof t,
      o = r !== void 0;
    if (((e = (o && n[0] && n[0].parentNode) || e), a === 'string' || a === 'number')) {
      if (s || (a === 'number' && ((t = t.toString()), t === n))) return n;
      if (o) {
        let l = n[0];
        (l && l.nodeType === 3 ? l.data !== t && (l.data = t) : (l = document.createTextNode(t)),
          (n = le(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || a === 'boolean') {
      if (s) return n;
      n = le(e, n, r);
    } else {
      if (a === 'function')
        return (
          Z(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Te(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          u = n && Array.isArray(n);
        if (Ue(l, t, n, i)) return (Z(() => (n = Te(e, l, n, r, !0))), () => n);
        if (s) {
          if (!l.length) return n;
          if (r === void 0) return (n = [...e.childNodes]);
          let c = l[0];
          if (c.parentNode !== e) return n;
          let h = [c];
          for (; (c = c.nextSibling) !== r; ) h.push(c);
          return (n = h);
        }
        if (l.length === 0) {
          if (((n = le(e, n, r)), o)) return n;
        } else u ? (n.length === 0 ? kt(e, l, r) : In(e, n, l)) : (n && le(e), kt(e, l));
        n = l;
      } else if (t.nodeType) {
        if (s && t.parentNode) return (n = o ? [t] : t);
        if (Array.isArray(n)) {
          if (o) return (n = le(e, n, r, t));
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
  function Ue(e, t, n, r) {
    let i = !1;
    for (let s = 0, a = t.length; s < a; s++) {
      let o = t[s],
        l = n && n[e.length],
        u;
      if (!(o == null || o === !0 || o === !1))
        if ((u = typeof o) == 'object' && o.nodeType) e.push(o);
        else if (Array.isArray(o)) i = Ue(e, o, l) || i;
        else if (u === 'function')
          if (r) {
            for (; typeof o == 'function'; ) o = o();
            i = Ue(e, Array.isArray(o) ? o : [o], Array.isArray(l) ? l : [l]) || i;
          } else (e.push(o), (i = !0));
        else {
          let c = String(o);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return i;
  }
  function kt(e, t, n = null) {
    for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
  }
  function le(e, t, n, r) {
    if (n === void 0) return (e.textContent = '');
    let i = r || document.createTextNode('');
    if (t.length) {
      let s = !1;
      for (let a = t.length - 1; a >= 0; a--) {
        let o = t[a];
        if (i !== o) {
          let l = o.parentNode === e;
          !s && !a ? (l ? e.replaceChild(i, o) : e.insertBefore(i, n)) : l && o.remove();
        } else s = !0;
      }
    } else e.insertBefore(i, n);
    return [i];
  }
  var ke = !1;
  var me = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ce = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
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
          i = r.get(e);
        i || ((i = { m: new Map(), l: null }), r.set(e, i));
        let s = i.m;
        if (((n = n === void 0 ? this.getId(t) : n), s.has(n)))
          switch (this.dedupe) {
            case me.THROW:
              throw Error('Eventti: duplicate listener id!');
            case me.IGNORE:
              return n;
            case me.UPDATE:
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
  var Rn = class {
    constructor(e = {}) {
      let { phases: t = [], dedupe: n, getId: r } = e;
      ((this._phases = t),
        (this._emitter = new ce({ getId: r, dedupe: n })),
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
        a;
      for (; r < n; r++) for (s = t[r], i = 0, a = s.length; i < a; i++) s[i](...e);
      t.length = 0;
    }
  };
  function Ke(e = 60) {
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
  var Nt = class extends Rn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Ke(), ...i } = e;
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
  var O = { read: Symbol(), write: Symbol() },
    I = new Nt({
      phases: [O.read, O.write],
      requestFrame: typeof window < 'u' ? Ke() : () => () => {},
    });
  function ye(e, t = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 }) {
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
  function F(e) {
    let t = Ht.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Ht.set(e, new WeakRef(t))), t);
  }
  var Fn = typeof window < 'u' && window.document !== void 0,
    Qe = !!(
      Fn &&
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
    Rr = {
      [be.content]: !1,
      [be.padding]: !1,
      [be.scrollbar]: !0,
      [be.border]: !0,
      [be.margin]: !0,
    };
  var Fr = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function Bt(e) {
    return e instanceof Window;
  }
  var Vt = new WeakMap();
  function q(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Vt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Vt.set(e, new WeakRef(n))), n);
  }
  function jt(e) {
    return e instanceof HTMLHtmlElement;
  }
  var U = typeof window < 'u' && window.document !== void 0,
    qt = U && 'ontouchstart' in window,
    Wt = U && !!window.PointerEvent;
  U &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var S = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
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
  function $n(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function Nn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Xt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function zt(e) {
    return e === 'auto' || e === void 0 ? (Wt ? 'pointer' : qt ? 'touch' : 'mouse') : e;
  }
  var ee = {
      pointer: {
        start: 'pointerdown',
        move: 'pointermove',
        cancel: 'pointercancel',
        end: 'pointerup',
      },
      touch: { start: 'touchstart', move: 'touchmove', cancel: 'touchcancel', end: 'touchend' },
      mouse: { start: 'mousedown', move: 'mousemove', cancel: '', end: 'mouseup' },
    },
    te = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    ie = class {
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
          listenerOptions: n = te.listenerOptions,
          sourceEvents: r = te.sourceEvents,
          startPredicate: i = te.startPredicate,
          cancelOnVisibilityChange: s = te.cancelOnVisibilityChange,
          cancelOnEscape: a = te.cancelOnEscape,
          preventNativeDrag: o = te.preventNativeDrag,
          preventContextMenu: l = te.preventContextMenu,
        } = t;
        ((this.element = e),
          (this.drag = null),
          (this.isDestroyed = !1),
          (this._areWindowListenersBound = !1),
          (this._cancelOnVisibilityChange = s ?? !0),
          (this._cancelOnEscape = a ?? !0),
          (this._preventNativeDrag = o ?? !0),
          (this._preventContextMenu = l ?? !1),
          (this._startPredicate = i),
          (this._listenerOptions = Xt(n)),
          (this._sourceEvents = zt(r)),
          (this._emitter = new ce()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(ee[this._sourceEvents].start, this._onStart, this._listenerOptions),
          s && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? Yt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = $n(e);
        if (t === null) return;
        let n = Yt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: Nn(e),
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
        let i = r.clientX,
          s = r.clientY;
        ((t.deltaX = i - t.x),
          (t.deltaY = s - t.y),
          (t.x = i),
          (t.y = s),
          (n.type = S.Move),
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
          (n.type = S.Cancel),
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
          (n.type = S.End),
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
        let { move: e, end: t, cancel: n } = ee[this._sourceEvents];
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
          let { move: e, end: t, cancel: n } = ee[this._sourceEvents];
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
            ee[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          e.addEventListener(ee[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
            preventNativeDrag: a,
            preventContextMenu: o,
          } = e,
          l = zt(n),
          u = Xt(t);
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
          a !== void 0 &&
            this._preventNativeDrag !== a &&
            ((this._preventNativeDrag = a),
            this._areWindowListenersBound &&
              (a
                ? window.addEventListener('dragstart', this._preventNativeDragHandler)
                : window.removeEventListener('dragstart', this._preventNativeDragHandler))),
          o !== void 0 &&
            this._preventContextMenu !== o &&
            ((this._preventContextMenu = o),
            this._areWindowListenersBound &&
              (o
                ? window.addEventListener('contextmenu', this._preventContextMenuHandler)
                : window.removeEventListener('contextmenu', this._preventContextMenuHandler))),
          ((t &&
            (this._listenerOptions.capture !== u.capture ||
              this._listenerOptions.passive !== u.passive)) ||
            (n && this._sourceEvents !== l)) &&
            (this.element.removeEventListener(
              ee[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && u && (this._listenerOptions = u),
            this.element.addEventListener(
              ee[this._sourceEvents].start,
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
            ee[this._sourceEvents].start,
            this._onStart,
            this._listenerOptions,
          ),
          this._cancelOnVisibilityChange &&
            document.removeEventListener('visibilitychange', this._visibilityChangeHandler));
      }
    };
  function Hn(e) {
    let t = F(e),
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
  function Bn(e) {
    let t = F(e),
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
    let { translate: n, rotate: r, scale: i, transform: s } = F(e),
      a = '';
    if (n && n !== 'none') {
      let [o = '0px', l = '0px', u] = n.split(' ');
      (o.includes('%') && (o = `${(parseFloat(o) / 100) * Bn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * Hn(e)}px`),
        u ? (a += `translate3d(${o},${l},${u})`) : (a += `translate(${o},${l})`));
    }
    if (r && r !== 'none') {
      let o = r.split(' ');
      o.length > 1 ? (a += `rotate3d(${o.join(',')})`) : (a += `rotate(${o.join(',')})`);
    }
    if (i && i !== 'none') {
      let o = i.split(' ');
      o.length === 3 ? (a += `scale3d(${o.join(',')})`) : (a += `scale(${o.join(',')})`);
    }
    return (!t && s && s !== 'none' && (a += s), a);
  }
  function ve(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function Je(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      i = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, i] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(i) || 0 }
    );
  }
  var oe = U ? new DOMMatrix() : null;
  function _e(e, t = new DOMMatrix()) {
    let n = e;
    for (ve(t); n; ) {
      let r = se(n);
      if (r && (oe.setMatrixValue(r), !oe.isIdentity)) {
        let { transformOrigin: i } = F(n),
          { x: s, y: a, z: o } = Je(i);
        (o === 0
          ? oe.setMatrixValue(`translate(${s}px,${a}px) ${oe} translate(${s * -1}px,${a * -1}px)`)
          : oe.setMatrixValue(
              `translate3d(${s}px,${a}px,${o}px) ${oe} translate3d(${s * -1}px,${a * -1}px,${o * -1}px)`,
            ),
          t.preMultiplySelf(oe));
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
  function Le(e) {
    let t = q(e);
    if (!Qe) {
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
    let { perspective: i } = t;
    if (i && i !== 'none') return !0;
    let { contentVisibility: s } = t;
    if (s && s === 'auto') return !0;
    let { contain: a } = t;
    if (
      a &&
      (a === 'strict' || a === 'content' || a.indexOf('paint') > -1 || a.indexOf('layout') > -1)
    )
      return !0;
    let { willChange: o } = t;
    return (
      !(
        !o ||
        !(o.indexOf('transform') > -1 || o.indexOf('perspective') > -1 || o.indexOf('contain') > -1)
      ) || !!(Qe && o && o.indexOf('filter') > -1)
    );
  }
  function Gt(e) {
    return q(e).position !== 'static' || Le(e);
  }
  function Ze(e, t = {}) {
    if (jt(e)) return e.ownerDocument.defaultView;
    let n = t.position || q(e).position,
      { skipDisplayNone: r, container: i } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let s = i || e.parentElement;
        for (; s; ) {
          let a = Ie(s);
          if (a) return s;
          if (a === null && !r) return null;
          s = s.parentElement;
        }
        return e.ownerDocument.documentElement;
      }
      case 'absolute':
      case 'fixed': {
        let s = n === 'fixed',
          a = i || e.parentElement;
        for (; a; ) {
          let o = s ? Le(a) : Gt(a);
          if (o === !0) return a;
          if (o === null && !r) return null;
          a = a.parentElement;
        }
        return e.ownerDocument.defaultView;
      }
      default:
        return null;
    }
  }
  function et(e, t = {}) {
    let n = q(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let i = t.position || q(e).position,
      { skipDisplayNone: s, container: a } = t;
    switch (i) {
      case 'relative':
        return e;
      case 'fixed':
        return Ze(e, { container: a, position: i, skipDisplayNone: s });
      case 'absolute': {
        let o = Ze(e, { container: a, position: i, skipDisplayNone: s });
        return Bt(o) ? e.ownerDocument : o;
      }
      default:
        return null;
    }
  }
  function Vn(e, t) {
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
  function tt(e) {
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
  function Ut(e, t, n = null) {
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
  function Re(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Kt = class {
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
    Zt = class {
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
          (this._matrixCache = new Kt()),
          (this._clientOffsetCache = new Kt()));
      }
    };
  function jn(e, t, n = !1) {
    let { style: r } = e;
    for (let i in t) r.setProperty(i, t[i], n ? 'important' : '');
  }
  function qn() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      jn(
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
  function we(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      i = F(e);
    return (
      (t.x = n + (parseFloat(i.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(i.borderTopWidth) || 0)),
      t
    );
  }
  function Qt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Wn = { x: 0, y: 0 },
    Yn = { x: 0, y: 0 };
  function Xn(e, t, n = { x: 0, y: 0 }) {
    let r = Qt(e) ? e : we(e, Wn),
      i = Qt(t) ? t : we(t, Yn);
    return ((n.x = i.x - r.x), (n.y = i.y - r.y), n);
  }
  var Fe = U ? qn() : null,
    en = class {
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
        let r = F(e),
          i = e.getBoundingClientRect(),
          s = se(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Je(r.transformOrigin)),
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
        let a = e.parentElement;
        if (!a) throw Error('Dragged element does not have a parent element.');
        this.elementContainer = a;
        let o = t.settings.container,
          l = (typeof o == 'function' ? o({ draggable: t, drag: n, element: e }) : o) || a;
        if (((this.dragContainer = l), a !== l)) {
          let { position: h } = r;
          if (h !== 'fixed' && h !== 'absolute')
            throw Error(
              `Dragged element has "${h}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
            );
        }
        let u = et(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = l === a ? u : et(e, { container: l })));
        {
          let { width: h, height: g, x: m, y: b } = i;
          this.clientRect = { width: h, height: g, x: m, y: b };
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
          containerOffset: i,
          _clientOffsetCache: s,
          _matrixCache: a,
        } = this;
        if (e !== n) {
          let [o, l] = [
            [r, n],
            [t, e],
          ].map(([u, c]) => {
            let h = s.get(c) || { x: 0, y: 0 };
            if (!s.isValid(c)) {
              let g = a.get(u);
              c instanceof HTMLElement && g && !g[0].isIdentity
                ? tt(g[0])
                  ? (Fe.style.setProperty('transform', g[1].toString(), 'important'),
                    c.append(Fe),
                    we(Fe, h),
                    Fe.remove())
                  : (we(c, h), (h.x -= g[0].m41), (h.y -= g[0].m42))
                : we(c, h);
            }
            return (s.set(c, h), h);
          });
          Xn(o, l, i);
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
    Jt = { capture: !0, passive: !0 },
    zn = { x: 0, y: 0 },
    W = U ? new DOMMatrix() : null,
    $e = U ? new DOMMatrix() : null,
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
    xe = { Start: 'start', Move: 'move', End: 'end' },
    Se = { Immediate: 'immediate', Sampled: 'sampled' },
    K = {
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
    tn = {
      container: null,
      startPredicate: () => !0,
      elements: () => null,
      frozenStyles: () => null,
      applyPosition: ({ item: e, phase: t }) => {
        let n = t === K.End || t === K.EndAlign,
          [r, i] = e.getContainerMatrix(),
          [s, a] = e.getDragContainerMatrix(),
          {
            position: o,
            alignmentOffset: l,
            containerOffset: u,
            elementTransformMatrix: c,
            elementTransformOrigin: h,
            elementOffsetMatrix: g,
          } = e,
          { x: m, y: b, z: M } = h,
          P = !c.isIdentity && (m !== 0 || b !== 0 || M !== 0),
          B = o.x + l.x + u.x,
          z = o.y + l.y + u.y;
        (ve(W),
          P && (M === 0 ? W.translateSelf(-m, -b) : W.translateSelf(-m, -b, -M)),
          n ? i.isIdentity || W.multiplySelf(i) : a.isIdentity || W.multiplySelf(a),
          ve($e).translateSelf(B, z),
          W.multiplySelf($e),
          r.isIdentity || W.multiplySelf(r),
          P && (ve($e).translateSelf(m, b, M), W.multiplySelf($e)),
          c.isIdentity || W.multiplySelf(c),
          g.isIdentity || W.preMultiplySelf(g),
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
    nt = class {
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
          (this._emitter = new ce()),
          (this._startPhase = $.None),
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
          predicateState: N.Pending,
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
      _parseSettings(e, t = tn) {
        let {
          container: n = t.container,
          startPredicate: r = t.startPredicate,
          elements: i = t.elements,
          frozenStyles: s = t.frozenStyles,
          positionModifiers: a = t.positionModifiers,
          applyPosition: o = t.applyPosition,
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: g = t.preventTextSelection,
          capturePointer: m = t.capturePointer,
          onPrepareStart: b = t.onPrepareStart,
          onStart: M = t.onStart,
          onPrepareMove: P = t.onPrepareMove,
          onMove: B = t.onMove,
          onEnd: z = t.onEnd,
          onDestroy: re = t.onDestroy,
        } = e || {};
        return {
          container: n,
          startPredicate: r,
          elements: i,
          frozenStyles: s,
          positionModifiers: a,
          applyPosition: o,
          computeClientRect: l,
          sensorProcessingMode: u,
          dndGroups: c,
          preventClickOnEnd: h,
          preventTextSelection: g,
          capturePointer: m,
          onPrepareStart: b,
          onStart: M,
          onPrepareMove: P,
          onMove: B,
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
                  : (I.once(O.read, this._prepareMove, this._moveId),
                    I.once(O.write, this._applyMove, this._moveId)));
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
            (t) => new en(t, this),
          )),
          this._applyModifiers(xe.Start, 0, 0),
          this._emit(A.PrepareStart, e, this),
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
            if (t instanceof ie && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Ut(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: K.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Vn(n, r) || (!tt(n) && !tt(r))) continue;
            let i = t.element.getBoundingClientRect(),
              { alignmentOffset: s } = t;
            ((s.x += Re(t.clientRect.x - i.x, 3)), (s.y += Re(t.clientRect.y - i.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: K.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, Jt),
            this._emit(A.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = $.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          i = t.y - n.y;
        (!r && !i) ||
          (this._applyModifiers(xe.Move, r, i),
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
              this.settings.applyPosition({ phase: K.Move, draggable: this, drag: e, item: t }));
          (this._emit(A.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: K.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let i = this.settings.positionModifiers,
          s = this._modifierData;
        s.drag = r;
        for (let a of r.items) {
          let o = zn;
          ((o.x = t), (o.y = n), (s.item = a), (s.phase = e));
          for (let l of i) o = l(o, s);
          ((a.position.x += o.x),
            (a.position.y += o.y),
            (a.clientRect.x += o.x),
            (a.clientRect.y += o.y),
            e === 'move' && ((a._moveDiff.x += o.x), (a._moveDiff.y += o.y)));
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
          (this.drag = new Zt(e, r)),
          this._sensorData.forEach((i, s) => {
            s !== e && ((i.predicateState = N.Rejected), (i.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (I.once(O.read, this._prepareStart, this._startId),
              I.once(O.write, this._applyStart, this._startId)));
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
          I.off(O.read, this._startId),
          I.off(O.write, this._startId),
          I.off(O.read, this._moveId),
          I.off(O.write, this._moveId),
          I.off(O.read, this._alignId),
          I.off(O.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Jt),
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
              (Ut(n.elementContainer, n.element),
              (n.alignmentOffset.x = 0),
              (n.alignmentOffset.y = 0),
              (n.containerOffset.x = 0),
              (n.containerOffset.y = 0)),
            n.unfrozenStyles)
          )
            for (let r in n.unfrozenStyles) n.element.style[r] = n.unfrozenStyles[r] || '';
          this.settings.applyPosition({ phase: K.End, draggable: this, drag: e, item: n });
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
            this.settings.applyPosition({ phase: K.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(A.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === Se.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (I.once(O.read, this._prepareAlign, this._alignId),
              I.once(O.write, this._applyAlign, this._alignId)));
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
  var Gn = ye(),
    Un = ye(),
    ne = { change: 0, drift: 0 };
  function Ne(e, t, n, r, i, s, a) {
    let o = s,
      l = i;
    if (s > 0) {
      if (((o = Math.min(Math.max(r - t, 0), s)), a))
        if (i < 0) {
          let u = Math.min(-i, s);
          ((l = i + u), (o = Math.max(0, o - u)));
        } else l = i + (s - o);
    } else if (s < 0 && ((o = Math.max(Math.min(n - e, 0), s)), a))
      if (i > 0) {
        let u = Math.max(-i, s);
        ((l = i + u), (o = Math.min(0, o - u)));
      } else l = i + (s - o);
    ((ne.change = o), (ne.drift = l));
  }
  function nn(e, t, n) {
    let r = n - t,
      i = Math.abs(r);
    if (i >= e) {
      let s = i % e,
        a = r > 0 ? r - s : r + s;
      return Math.round(a / e) * e;
    }
    return 0;
  }
  function rt(e, t) {
    let n = t?.trackSensorDrift ?? (({ drag: s }) => s.sensor instanceof ie),
      r = t?.snapX || 0,
      i = t?.snapY || 0;
    return function (s, a) {
      let o = ye(e(a), Gn),
        l = ye(a.item.clientRect, Un),
        u = a.item.data,
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
          (u.__containment__ = ((c.trackDrift = typeof n == 'function' ? n(a) : n), c)),
        a.phase === 'start')
      )
        return (
          s.x && (s.x = (Ne(l.left, l.right, o.left, o.right, 0, s.x, !1), ne.change)),
          s.y && (s.y = (Ne(l.top, l.bottom, o.top, o.bottom, 0, s.y, !1), ne.change)),
          (r || i) &&
            ((c.startLeft = l.left + s.x),
            (c.startTop = l.top + s.y),
            (c.startRight = l.right + s.x),
            (c.startBottom = l.bottom + s.y)),
          s
        );
      if (r) {
        c.sensorX += s.x;
        let h = nn(r, c.snapX, c.sensorX),
          g = c.snapX + h,
          m = Math.ceil((o.left - c.startLeft) / r) * r,
          b = Math.floor((o.right - c.startRight) / r) * r;
        ((g = Math.min(Math.max(g, m), b)), (s.x = g - c.snapX), (c.snapX = g));
      } else
        s.x &&
          (s.x =
            (Ne(l.left, l.right, o.left, o.right, c.drift.x, s.x, c.trackDrift),
            (c.drift.x = ne.drift),
            ne.change));
      if (i) {
        c.sensorY += s.y;
        let h = nn(i, c.snapY, c.sensorY),
          g = c.snapY + h,
          m = Math.ceil((o.top - c.startTop) / i) * i,
          b = Math.floor((o.bottom - c.startBottom) / i) * i;
        ((g = Math.min(Math.max(g, m), b)), (s.y = g - c.snapY), (c.snapY = g));
      } else
        s.y &&
          (s.y =
            (Ne(l.top, l.bottom, o.top, o.bottom, c.drift.y, s.y, c.trackDrift),
            (c.drift.y = ne.drift),
            ne.change));
      return s;
    };
  }
  var Kn = () => {},
    H = new Map(),
    st = new Set();
  function it() {
    st.forEach((e) => e());
  }
  var Ee = {
    add(e, t, n) {
      ((H = new Map(H)), H.set(e, { sources: t, proxies: n, exiting: !1, done: Kn }), it());
    },
    startExiting(e, t) {
      let n = H.get(e);
      n && ((H = new Map(H)), H.set(e, { ...n, exiting: !0, done: t }), it());
    },
    remove(e) {
      H.has(e) && ((H = new Map(H)), H.delete(e), it());
    },
    subscribe(e) {
      return (st.add(e), () => st.delete(e));
    },
    getSnapshot() {
      return H;
    },
  };
  var Qn = (e) => typeof e == 'function' && e.length === 0;
  function Q(e, t) {
    return e === void 0 ? t : Qn(e) ? e() : e;
  }
  function rn(e) {
    return e.map((t) => Q(t));
  }
  var Jn = () => null,
    sn = Dt(Jn);
  function on() {
    return Xe(sn);
  }
  var Zn = Object.prototype.hasOwnProperty,
    an = (e) => {
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
    let i = e instanceof Set,
      s = t instanceof Set;
    if (i || s) {
      if (!i || !s || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!an(e) || !an(t)) return !1;
    let a = Object.keys(e),
      o = Object.keys(t);
    if (a.length !== o.length) return !1;
    for (let l = 0; l < a.length; l++) {
      let u = a[l];
      if (!Zn.call(t, u) || !He(e[u], t[u])) return !1;
    }
    return !0;
  }
  var Be = new Map(),
    Ve = [],
    ot = [],
    at = [],
    lt = [],
    ct = [],
    ut = [],
    ft = [],
    dt = [];
  function ln() {
    (Be.clear(),
      (Ve.length = 0),
      (ot.length = 0),
      (at.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (ut.length = 0),
      (ft.length = 0),
      (dt.length = 0));
  }
  function cn(e) {
    let t = [];
    ln();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        i = r.parentElement;
      if (!i) throw new Error('Source element must have a parent element.');
      let s = r.getBoundingClientRect(),
        a = F(r),
        o = se(r),
        l = o ? a.transformOrigin : '',
        u,
        c;
      if (r instanceof SVGSVGElement) ((u = `${s.width}px`), (c = `${s.height}px`));
      else {
        let m = parseFloat(a.width),
          b = parseFloat(a.height);
        if (!(m >= 0) || !(b >= 0)) ((u = `${s.width}px`), (c = `${s.height}px`));
        else if (a.boxSizing === 'border-box') ((u = a.width), (c = a.height));
        else {
          let M = parseFloat(a.paddingLeft) || 0,
            P = parseFloat(a.paddingRight) || 0,
            B = parseFloat(a.borderLeftWidth) || 0,
            z = parseFloat(a.borderRightWidth) || 0,
            re = parseFloat(a.paddingTop) || 0,
            y = parseFloat(a.paddingBottom) || 0,
            v = parseFloat(a.borderTopWidth) || 0,
            V = parseFloat(a.borderBottomWidth) || 0;
          ((u = `${m + M + P + B + z}px`), (c = `${b + re + y + v + V}px`));
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
        (Ve[n] = i),
        (t[n] = h),
        (ot[n] = s),
        (at[n] = o),
        (lt[n] = l),
        (ct[n] = u),
        (ut[n] = c),
        Be.has(i) || Be.set(i, _e(i)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ve[n],
        i = t[n],
        s = at[n],
        a = lt[n],
        o = ct[n],
        l = ut[n],
        u = i.style;
      ((u.width = o),
        (u.height = l),
        s && ((u.transform = s), a && (u.transformOrigin = a)),
        r.appendChild(i));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Ve[n],
        i = t[n],
        s = ot[n],
        a = Be.get(r),
        o = 0,
        l = 0,
        u = a.m11,
        c = a.m12,
        h = a.m21,
        g = a.m22,
        m = u * g - c * h,
        b = i.getBoundingClientRect(),
        M = s.left - b.left,
        P = s.top - b.top;
      if (Math.abs(m) < 1e-10) ((o = M), (l = P));
      else {
        let B = 1 / m;
        ((o = (g * M - h * P) * B), (l = (-c * M + u * P) * B));
      }
      ((ft[n] = o), (dt[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        i = ft[n],
        s = dt[n];
      ((r.left = `${i}px`), (r.top = `${s}px`));
    }
    return (ln(), t);
  }
  function un(e, t) {
    if (ke) return () => null;
    let n = D(() => (Array.isArray(e) ? rn(e) : (Q(e) ?? [])).filter((y) => !!y)),
      r = D(() => Q(t)),
      i = D(() => r()?.id),
      s = D(() => r()?.dndObserver),
      a = D(() => {
        let y = r();
        if (!y) return;
        let {
          dndObserver: v,
          id: V,
          dragPreviewContainer: Ce,
          dragPreviewExitTimeout: E,
          ...j
        } = y;
        return j;
      }),
      o = on(),
      l = D(() => {
        let y = s();
        return y === void 0 ? o() : y;
      }),
      [u, c] = X(null),
      h = null,
      g = i(),
      m = a(),
      b = l(),
      M = a(),
      P = r()?.dragPreviewContainer,
      B = r()?.dragPreviewExitTimeout;
    R(() => {
      let y = r();
      ((M = a()), (P = y?.dragPreviewContainer), (B = y?.dragPreviewExitTimeout));
    });
    let z = () => {
        h && (h.destroy(), (h = null), (m = void 0), c(null));
      },
      re = () => {
        Ct(() => {
          z();
          let y = k(n);
          if (!y.length) return;
          let v = k(a),
            V = i(),
            Ce = v?.dragPreview,
            E = new nt(y, {
              id: V,
              ...v,
              elements(T) {
                let ht = M,
                  ue = (ht?.elements || (() => null))(T);
                if (!ht?.dragPreview || !ue || ue.length === 0) return ue;
                let fe = cn(ue);
                Ee.add(T.draggable, ue, fe);
                let gt = () => {
                    let pt = B || 0;
                    if (pt > 0) {
                      for (let je of fe) je.dataset.exiting = 'true';
                      let De = !1,
                        mt = () => {
                          De ||
                            ((De = !0),
                            clearTimeout(yn),
                            Ee.remove(T.draggable),
                            setTimeout(() => {
                              for (let je of fe) je.remove();
                            }, 0));
                        },
                        yn = setTimeout(mt, pt);
                      Ee.startExiting(T.draggable, mt);
                    } else
                      (Ee.remove(T.draggable),
                        setTimeout(() => {
                          for (let De of fe) De.remove();
                        }, 0));
                    (T.draggable.off('end', pn), T.draggable.off('destroy', mn));
                  },
                  pn = T.draggable.on('end', gt),
                  mn = T.draggable.on('destroy', gt);
                return fe;
              },
              ...(Ce
                ? {
                    container: () => {
                      let T = P;
                      return (typeof T == 'function' ? T() : T) || document.body;
                    },
                  }
                : {}),
            }),
            j = k(l);
          (j?.addDraggables([E]), (h = E), (g = V), (m = v), (b = j), c(E));
        });
      };
    return (
      R(() => {
        let y = n();
        if (!y.length) {
          z();
          return;
        }
        let v = h;
        if (!v) {
          re();
          return;
        }
        (y.length !== v.sensors.length || y.some((V) => !v.sensors.includes(V))) && re();
      }),
      R(() => {
        if (!h) return;
        let v = i();
        g !== v && re();
      }),
      R(() => {
        let y = l();
        if (b === y) return;
        let v = h;
        (v && (b?.removeDraggables([v]), y?.addDraggables([v])), (b = y));
      }),
      R(() => {
        let y = h;
        if (!y) return;
        let v = a(),
          V = !1;
        if (m) {
          let E = { ...m },
            j = { ...v };
          ((E.elements === j.elements || (E.dragPreview && j.dragPreview)) &&
            (delete E.elements, delete j.elements),
            (V = !He(E, j)));
        } else V = !0;
        if (!V) return;
        let Ce = y._parseSettings(v);
        if (
          (y.updateSettings({
            ...Ce,
            ...(!v?.dragPreview && v?.elements ? { elements: v.elements } : {}),
            ...(v?.dragPreview
              ? {
                  container: () => {
                    let E = P;
                    return (typeof E == 'function' ? E() : E) || document.body;
                  },
                }
              : {}),
          }),
          m)
        ) {
          let E = v?.dndGroups !== m.dndGroups,
            j = v?.computeClientRect !== m.computeClientRect;
          (E && b?.clearTargets(y), (E || j) && b?.detectCollisions(y));
        }
        m = v;
      }),
      G(z),
      u
    );
  }
  function fn(e, t = !1) {
    let n = D(() => Q(e)),
      [r, i] = X(null),
      [s, a] = X(0);
    return (
      R(() => {
        let o = n();
        if ((i(o?.drag || null), !o)) return;
        let l = o.on(A.Start, () => {
            i(o.drag || null);
          }),
          u = null;
        t &&
          (u = o.on(A.Move, () => {
            o.drag && a((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = o.on(A.End, () => {
          i(null);
        });
        G(() => {
          (o.off(A.Start, l), u && o.off(A.Move, u), o.off(A.End, c));
        });
      }),
      D(() => (s(), r()))
    );
  }
  function dn(e = {}, t) {
    if (ke) return [() => null, () => {}];
    let n = D(() => Q(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : Q(t))),
      [i, s] = X(null),
      a = null,
      o = () => {
        a && (a.destroy(), (a = null), s(null));
      },
      l = (c) => {
        a?.destroy();
        let h = new ie(c, n());
        ((a = h), s(h));
      };
    (R(() => {
      let c = a;
      c && c.updateSettings(n());
    }),
      R(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            o();
            return;
          }
          (l(c), G(o));
        }
      }));
    let u = (c) => {
      if (t === void 0) {
        if (!c) {
          o();
          return;
        }
        a?.element !== c && l(c);
      }
    };
    return (G(o), [i, u]);
  }
  var er = Lt(
      '<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
    ),
    tr = 5,
    hn = 40;
  function nr() {
    let e = null,
      [t, n] = dn(),
      r = {
        elements: () => (e ? [e] : []),
        startPredicate: ({ event: o }) => {
          let l = o.x - o.startX,
            u = o.y - o.startY;
          return Math.sqrt(l * l + u * u) >= tr ? !0 : void 0;
        },
        positionModifiers: [
          rt(() => ({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }), {
            snapX: hn,
            snapY: hn,
          }),
        ],
      },
      i = un([t], r),
      s = fn(i),
      a = (o) => {
        ((e = o), n(o));
      };
    return (() => {
      var o = er();
      return (Ft(a, o), Z(() => Rt(o, `card draggable ${s() ? 'dragging' : ''}`)), o);
    })();
  }
  function rr() {
    return Ae(nr, {});
  }
  var gn = document.getElementById('root');
  if (!gn) throw new Error('Failed to find the root element');
  It(() => Ae(rr, {}), gn);
})();
