'use strict';
var SolidExample_008_draggable_drag_handle = (() => {
  var vn = Object.defineProperty;
  var _n = (e, t, n) =>
    t in e ? vn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => _n(e, typeof t != 'symbol' ? t + '' : t, n);
  var w = {
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
    return w.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Ve(e) {
    w.context = e;
  }
  function bn() {
    return { ...w.context, id: w.getNextContextId(), count: 0 };
  }
  var Sn = !1,
    wn = (e, t) => e === t;
  var Oe = { equals: wn },
    yt = null,
    St = Mt,
    F = 1,
    he = 2,
    wt = { owned: null, cleanups: null, context: null, owner: null };
  var m = null,
    f = null,
    me = null,
    le = null,
    b = null,
    x = null,
    M = null,
    Pe = 0;
  function xt(e, t) {
    let n = b,
      r = m,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? wt : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => R(() => ee(o)));
    ((m = o), (b = null));
    try {
      return z(a, !0);
    } finally {
      ((b = n), (m = r));
    }
  }
  function A(e, t) {
    t = t ? Object.assign({}, Oe, t) : Oe;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (f && f.running && f.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Ot(n, s)
      );
    return [Ct.bind(n), r];
  }
  function te(e, t, n) {
    let r = Xe(e, t, !1, F);
    me && f && f.running ? x.push(r) : pe(r);
  }
  function k(e, t, n) {
    St = On;
    let r = Xe(e, t, !1, F),
      s = je && Ye(je);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), M ? M.push(r) : pe(r));
  }
  function E(e, t, n) {
    n = n ? Object.assign({}, Oe, n) : Oe;
    let r = Xe(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      me && f && f.running ? ((r.tState = F), x.push(r)) : pe(r),
      Ct.bind(r)
    );
  }
  function Et(e) {
    return z(e, !1);
  }
  function R(e) {
    if (!le && b === null) return e();
    let t = b;
    b = null;
    try {
      return le ? le.untrack(e) : e();
    } finally {
      b = t;
    }
  }
  function K(e) {
    return (m === null || (m.cleanups === null ? (m.cleanups = [e]) : m.cleanups.push(e)), e);
  }
  function xn(e) {
    if (f && f.running) return (e(), f.done);
    let t = b,
      n = m;
    return Promise.resolve().then(() => {
      ((b = t), (m = n));
      let r;
      return (
        (me || je) &&
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
        (b = m = null),
        r ? r.done : void 0
      );
    });
  }
  var [sr, vt] = A(!1);
  function Dt(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: Pn(n), defaultValue: e };
  }
  function Ye(e) {
    let t;
    return m && m.context && (t = m.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function En(e) {
    let t = E(e),
      n = E(() => qe(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var je;
  function Ct() {
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === F) pe(this);
      else {
        let t = x;
        ((x = null), z(() => Me(this), !1), (x = t));
      }
    if (b) {
      let t = this.observers ? this.observers.length : 0;
      (b.sources
        ? (b.sources.push(this), b.sourceSlots.push(t))
        : ((b.sources = [this]), (b.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(b), this.observerSlots.push(b.sources.length - 1))
          : ((this.observers = [b]), (this.observerSlots = [b.sources.length - 1])));
    }
    return e && f.sources.has(this) ? this.tValue : this.value;
  }
  function Ot(e, t, n) {
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
              ((o ? !i.tState : !i.state) && (i.pure ? x.push(i) : M.push(i), i.observers && Pt(i)),
              o ? (i.tState = F) : (i.state = F));
          }
          if (x.length > 1e6) throw ((x = []), new Error());
        }, !1);
    }
    return t;
  }
  function pe(e) {
    if (!e.fn) return;
    ee(e);
    let t = Pe;
    (_t(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          z(() => {
            (f && (f.running = !0), (b = m = e), _t(e, e.tValue, t), (b = m = null));
          }, !1);
        }));
  }
  function _t(e, t, n) {
    let r,
      s = m,
      i = b;
    b = m = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = F), e.tOwned && e.tOwned.forEach(ee), (e.tOwned = void 0))
            : ((e.state = F), e.owned && e.owned.forEach(ee), (e.owned = null))),
        (e.updatedAt = n + 1),
        We(o)
      );
    } finally {
      ((b = i), (m = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Ot(e, r, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = r), f.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function Xe(e, t, n, r = F, s) {
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
        (m !== wt &&
          (f && f.running && m.pure
            ? m.tOwned
              ? m.tOwned.push(i)
              : (m.tOwned = [i])
            : m.owned
              ? m.owned.push(i)
              : (m.owned = [i]))),
      le && i.fn)
    ) {
      let o = i.fn,
        [a, l] = A(void 0, { equals: !1 }),
        u = le.factory(o, l);
      K(() => u.dispose());
      let c,
        h = () =>
          xn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (g) => (a(), f && f.running ? (c || (c = le.factory(o, h)), c.track(g)) : u.track(g));
    }
    return i;
  }
  function ge(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === he) return Me(e);
    if (e.suspense && R(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Pe); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (f.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === F) pe(e);
      else if ((t ? e.tState : e.state) === he) {
        let s = x;
        ((x = null), z(() => Me(e, n[0]), !1), (x = s));
      }
    }
  }
  function z(e, t) {
    if (x) return e();
    let n = !1;
    (t || (x = []), M ? (n = !0) : (M = []), Pe++);
    try {
      let r = e();
      return (Dn(n), r);
    } catch (r) {
      (n || (M = null), (x = null), We(r));
    }
  }
  function Dn(e) {
    if ((x && (me && f && f.running ? Cn(x) : Mt(x), (x = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let r = f.sources,
          s = f.disposed;
        (M.push.apply(M, f.effects), (t = f.resolve));
        for (let i of M) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((f = null),
          z(() => {
            for (let i of s) ee(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) ee(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            vt(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, M), (M = null), vt(!0));
        return;
      }
    }
    let n = M;
    ((M = null), n.length && z(() => St(n), !1), t && t());
  }
  function Mt(e) {
    for (let t = 0; t < e.length; t++) ge(e[t]);
  }
  function Cn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = f.queue;
      r.has(n) ||
        (r.add(n),
        me(() => {
          (r.delete(n),
            z(() => {
              ((f.running = !0), ge(n));
            }, !1),
            f && (f.running = !1));
        }));
    }
  }
  function On(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : ge(r);
    }
    if (w.context) {
      if (w.count) {
        (w.effects || (w.effects = []), w.effects.push(...e.slice(0, n)));
        return;
      }
      Ve();
    }
    for (
      w.effects &&
        (w.done || !w.count) &&
        ((e = [...w.effects, ...e]), (n += w.effects.length), delete w.effects),
        t = 0;
      t < n;
      t++
    )
      ge(e[t]);
  }
  function Me(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === F ? s !== t && (!s.updatedAt || s.updatedAt < Pe) && ge(s) : i === he && Me(s, t);
      }
    }
  }
  function Pt(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = he) : (r.state = he),
        r.pure ? x.push(r) : M.push(r),
        r.observers && Pt(r));
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
    if (f && f.running && e.pure) kt(e, !0);
    else if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) ee(e.owned[t]);
      e.owned = null;
    }
    if (e.cleanups) {
      for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
      e.cleanups = null;
    }
    f && f.running ? (e.tState = 0) : (e.state = 0);
  }
  function kt(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) kt(e.owned[n]);
  }
  function Mn(e) {
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
  function We(e, t = m) {
    let n = yt && t && t.context && t.context[yt],
      r = Mn(e);
    if (!n) throw r;
    M
      ? M.push({
          fn() {
            bt(r, n, t);
          },
          state: F,
        })
      : bt(r, n, t);
  }
  function qe(e) {
    if (typeof e == 'function' && !e.length) return qe(e());
    if (Array.isArray(e)) {
      let t = [];
      for (let n = 0; n < e.length; n++) {
        let r = qe(e[n]);
        Array.isArray(r) ? t.push.apply(t, r) : t.push(r);
      }
      return t;
    }
    return e;
  }
  function Pn(e, t) {
    return function (r) {
      let s;
      return (
        te(
          () => (s = R(() => ((m.context = { ...m.context, [e]: r.value }), En(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var kn = !1;
  function ke(e, t) {
    if (kn && w.context) {
      let n = w.context;
      Ve(bn());
      let r = R(() => e(t || {}));
      return (Ve(n), r);
    }
    return R(() => e(t || {}));
  }
  var An = [
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
    _r = new Set([
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
      ...An,
    ]);
  function Ln(e, t, n) {
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
              g = 1,
              v;
            for (; ++h < s && h < i && !((v = u.get(t[h])) == null || v !== c + g); ) g++;
            if (g > c - a) {
              let S = t[o];
              for (; a < c; ) e.insertBefore(n[a++], S);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function At(e, t, n, r = {}) {
    let s;
    return (
      xt((i) => {
        ((s = i), t === document ? e() : In(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function Lt(e, t, n, r) {
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
        ? () => R(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function It(e, t) {
    Rt(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function ze(e, t, n) {
    return R(() => e(t, n));
  }
  function In(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Te(e, t, r, n);
    te((s) => Te(e, t(), s, n), r);
  }
  function Rt(e) {
    return !!w.context && !w.done && (!e || e.isConnected);
  }
  function Te(e, t, n, r, s) {
    let i = Rt(e);
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
          (n = ce(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = ce(e, n, r);
    } else {
      if (o === 'function')
        return (
          te(() => {
            let l = t();
            for (; typeof l == 'function'; ) l = l();
            n = Te(e, l, n, r);
          }),
          () => n
        );
      if (Array.isArray(t)) {
        let l = [],
          u = n && Array.isArray(n);
        if (Ue(l, t, n, s)) return (te(() => (n = Te(e, l, n, r, !0))), () => n);
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
          if (((n = ce(e, n, r)), a)) return n;
        } else u ? (n.length === 0 ? Tt(e, l, r) : Ln(e, n, l)) : (n && ce(e), Tt(e, l));
        n = l;
      } else if (t.nodeType) {
        if (i && t.parentNode) return (n = a ? [t] : t);
        if (Array.isArray(n)) {
          if (a) return (n = ce(e, n, r, t));
          ce(e, n, null, t);
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
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        u;
      if (!(a == null || a === !0 || a === !1))
        if ((u = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = Ue(e, a, l) || s;
        else if (u === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = Ue(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
          } else (e.push(a), (s = !0));
        else {
          let c = String(a);
          l && l.nodeType === 3 && l.data === c ? e.push(l) : e.push(document.createTextNode(c));
        }
    }
    return s;
  }
  function Tt(e, t, n = null) {
    for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
  }
  function ce(e, t, n, r) {
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
  var de = !1;
  var ye = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ne = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || ye.ADD),
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
            case ye.THROW:
              throw Error('Eventti: duplicate listener id!');
            case ye.IGNORE:
              return n;
            case ye.UPDATE:
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
  var Rn = class {
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
  function Ge(e = 60) {
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
  var Ft = class extends Rn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Ge(), ...s } = e;
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
  var D = { read: Symbol(), write: Symbol() },
    C = new Ft({
      phases: [D.read, D.write],
      requestFrame: typeof window < 'u' ? Ge() : () => () => {},
    });
  var Kt = new WeakMap();
  function $(e) {
    let t = Kt.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Kt.set(e, new WeakRef(t))), t);
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
    ve = {
      content: 'content',
      padding: 'padding',
      scrollbar: 'scrollbar',
      border: 'border',
      margin: 'margin',
    },
    Ar = {
      [ve.content]: !1,
      [ve.padding]: !1,
      [ve.scrollbar]: !0,
      [ve.border]: !0,
      [ve.margin]: !0,
    };
  var Lr = (() => {
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
  function X(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Nt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Nt.set(e, new WeakRef(n))), n);
  }
  function Bt(e) {
    return e instanceof HTMLHtmlElement;
  }
  var Q = typeof window < 'u' && window.document !== void 0,
    Ht = Q && 'ontouchstart' in window,
    Vt = Q && !!window.PointerEvent;
  Q &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
  var y = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  function jt(e, t) {
    if ('pointerId' in e) return e.pointerId === t ? e : null;
    if ('changedTouches' in e) {
      let n = 0;
      for (; n < e.changedTouches.length; n++)
        if (e.changedTouches[n].identifier === t) return e.changedTouches[n];
      return null;
    }
    return e;
  }
  function Kn(e) {
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
  function qt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function Yt(e) {
    return e === 'auto' || e === void 0 ? (Vt ? 'pointer' : Ht ? 'touch' : 'mouse') : e;
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
    J = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    se = class {
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
          listenerOptions: n = J.listenerOptions,
          sourceEvents: r = J.sourceEvents,
          startPredicate: s = J.startPredicate,
          cancelOnVisibilityChange: i = J.cancelOnVisibilityChange,
          cancelOnEscape: o = J.cancelOnEscape,
          preventNativeDrag: a = J.preventNativeDrag,
          preventContextMenu: l = J.preventContextMenu,
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
          (this._listenerOptions = qt(n)),
          (this._sourceEvents = Yt(r)),
          (this._emitter = new ne()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(re[this._sourceEvents].start, this._onStart, this._listenerOptions),
          i && document.addEventListener('visibilitychange', this._visibilityChangeHandler));
      }
      _getTrackedPointerEventData(e) {
        return this.drag ? jt(e, this.drag.pointerId) : null;
      }
      _onStart(e) {
        if (
          (this._removeClickBlocker?.(), this.isDestroyed || this.drag || !this._startPredicate(e))
        )
          return;
        let t = Kn(e);
        if (t === null) return;
        let n = jt(e, t);
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
          l = Yt(n),
          u = qt(t);
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
              re[this._sourceEvents].start,
              this._onStart,
              this._listenerOptions,
            ),
            this._unbindWindowListeners(),
            this.cancel(),
            n && (this._sourceEvents = l),
            t && u && (this._listenerOptions = u),
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
          this._emitter.emit(y.Destroy, { type: y.Destroy }),
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
  function Nn(e) {
    let t = $(e),
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
    let t = $(e),
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
  function oe(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = $(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', u] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Bn(e)}px`),
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
  function _e(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function Je(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var ae = Q ? new DOMMatrix() : null;
  function be(e, t = new DOMMatrix()) {
    let n = e;
    for (_e(t); n; ) {
      let r = oe(n);
      if (r && (ae.setMatrixValue(r), !ae.isIdentity)) {
        let { transformOrigin: s } = $(n),
          { x: i, y: o, z: a } = Je(s);
        (a === 0
          ? ae.setMatrixValue(`translate(${i}px,${o}px) ${ae} translate(${i * -1}px,${o * -1}px)`)
          : ae.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${ae} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(ae));
      }
      n = n.parentElement;
    }
    return t;
  }
  function Ae(e) {
    switch (X(e).display) {
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
    let t = X(e);
    if (!Qe) {
      let { filter: l } = t;
      if (l && l !== 'none') return !0;
      let { backdropFilter: u } = t;
      if (u && u !== 'none') return !0;
      let { willChange: c } = t;
      if (c && (c.indexOf('filter') > -1 || c.indexOf('backdrop-filter') > -1)) return !0;
    }
    let n = Ae(e);
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
      ) || !!(Qe && a && a.indexOf('filter') > -1)
    );
  }
  function Xt(e) {
    return X(e).position !== 'static' || Le(e);
  }
  function Ze(e, t = {}) {
    if (Bt(e)) return e.ownerDocument.defaultView;
    let n = t.position || X(e).position,
      { skipDisplayNone: r, container: s } = t;
    switch (n) {
      case 'static':
      case 'relative':
      case 'sticky':
      case '-webkit-sticky': {
        let i = s || e.parentElement;
        for (; i; ) {
          let o = Ae(i);
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
          let a = i ? Le(o) : Xt(o);
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
  function et(e, t = {}) {
    let n = X(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || X(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return Ze(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = Ze(e, { container: o, position: s, skipDisplayNone: i });
        return $t(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Hn(e, t) {
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
  function Wt(e, t, n = null) {
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
  var Ut = class {
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
          (this._matrixCache = new Ut()),
          (this._clientOffsetCache = new Ut()));
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
  function we(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = $(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function zt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var qn = { x: 0, y: 0 },
    Yn = { x: 0, y: 0 };
  function Xn(e, t, n = { x: 0, y: 0 }) {
    let r = zt(e) ? e : we(e, qn),
      s = zt(t) ? t : we(t, Yn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Re = Q ? jn() : null,
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
        let r = $(e),
          s = e.getBoundingClientRect(),
          i = oe(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = Je(r.transformOrigin)),
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
        let u = et(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = l === o ? u : et(e, { container: l })));
        {
          let { width: h, height: g, x: v, y: S } = s;
          this.clientRect = { width: h, height: g, x: v, y: S };
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
            (be(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
              let g = o.get(u);
              c instanceof HTMLElement && g && !g[0].isIdentity
                ? tt(g[0])
                  ? (Re.style.setProperty('transform', g[1].toString(), 'important'),
                    c.append(Re),
                    we(Re, h),
                    Re.remove())
                  : (we(c, h), (h.x -= g[0].m41), (h.y -= g[0].m42))
                : we(c, h);
            }
            return (i.set(c, h), h);
          });
          Xn(a, l, s);
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
    Gt = { capture: !0, passive: !0 },
    Wn = { x: 0, y: 0 },
    W = Q ? new DOMMatrix() : null,
    Fe = Q ? new DOMMatrix() : null,
    N = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(N || {}),
    B = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(B || {}),
    Se = { Start: 'start', Move: 'move', End: 'end' },
    xe = { Immediate: 'immediate', Sampled: 'sampled' },
    Z = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    L = {
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
        let n = t === Z.End || t === Z.EndAlign,
          [r, s] = e.getContainerMatrix(),
          [i, o] = e.getDragContainerMatrix(),
          {
            position: a,
            alignmentOffset: l,
            containerOffset: u,
            elementTransformMatrix: c,
            elementTransformOrigin: h,
            elementOffsetMatrix: g,
          } = e,
          { x: v, y: S, z: P } = h,
          T = !c.isIdentity && (v !== 0 || S !== 0 || P !== 0),
          j = a.x + l.x + u.x,
          G = a.y + l.y + u.y;
        (_e(W),
          T && (P === 0 ? W.translateSelf(-v, -S) : W.translateSelf(-v, -S, -P)),
          n ? s.isIdentity || W.multiplySelf(s) : o.isIdentity || W.multiplySelf(o),
          _e(Fe).translateSelf(j, G),
          W.multiplySelf(Fe),
          r.isIdentity || W.multiplySelf(r),
          T && (_e(Fe).translateSelf(v, S, P), W.multiplySelf(Fe)),
          c.isIdentity || W.multiplySelf(c),
          g.isIdentity || W.preMultiplySelf(g),
          (e.element.style.transform = `${W}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: xe.Sampled,
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
          (this._emitter = new ne()),
          (this._startPhase = N.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: Se.Start }),
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
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: g = t.preventTextSelection,
          capturePointer: v = t.capturePointer,
          onPrepareStart: S = t.onPrepareStart,
          onStart: P = t.onStart,
          onPrepareMove: T = t.onPrepareMove,
          onMove: j = t.onMove,
          onEnd: G = t.onEnd,
          onDestroy: ie = t.onDestroy,
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
          preventTextSelection: g,
          capturePointer: v,
          onPrepareStart: S,
          onStart: P,
          onPrepareMove: T,
          onMove: j,
          onEnd: G,
          onDestroy: ie,
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
                this.settings.sensorProcessingMode === xe.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (C.once(D.read, this._prepareMove, this._moveId),
                    C.once(D.write, this._applyMove, this._moveId)));
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
          this._startPhase !== N.Init ||
          ((this._startPhase = N.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new Jt(t, this),
          )),
          this._applyModifiers(Se.Start, 0, 0),
          this._emit(L.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = N.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== N.FinishPrepare)) {
          if (((this._startPhase = N.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof se && t.drag) {
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
            (t.dragContainer !== t.elementContainer && Wt(t.dragContainer, t.element),
              t.frozenStyles && Object.assign(t.element.style, t.frozenStyles),
              this.settings.applyPosition({ phase: Z.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Hn(n, r) || (!tt(n) && !tt(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Ie(t.clientRect.x - s.x, 3)), (i.y += Ie(t.clientRect.y - s.y, 3)));
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
          (window.addEventListener('scroll', this._onScroll, Gt),
            this._emit(L.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = N.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(Se.Move, r, s),
          this._emit(L.PrepareMove, e, this),
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
          (this._emit(L.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
          let a = Wn;
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
          ((this._startPhase = N.Init),
          (n.predicateState = B.Resolved),
          (n.predicateEvent = null),
          (this.drag = new Qt(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = B.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === xe.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (C.once(D.read, this._prepareStart, this._startId),
              C.once(D.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === B.Pending &&
          ((t.predicateState = B.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === N.Prepare || this._startPhase === N.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = N.None),
          C.off(D.read, this._startId),
          C.off(D.write, this._startId),
          C.off(D.read, this._moveId),
          C.off(D.write, this._moveId),
          C.off(D.read, this._alignId),
          C.off(D.write, this._alignId),
          window.removeEventListener('scroll', this._onScroll, Gt),
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
        this._applyModifiers(Se.End, 0, 0);
        for (let n of e.items) {
          if (
            (n.elementContainer !== n.dragContainer &&
              (Wt(n.elementContainer, n.element),
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
            ((n.alignmentOffset.x = Ie(n.clientRect.x - r.x, 3)),
              (n.alignmentOffset.y = Ie(n.clientRect.y - r.y, 3)));
          }
        for (let n of e.items)
          n.elementContainer !== n.dragContainer &&
            (n.alignmentOffset.x !== 0 || n.alignmentOffset.y !== 0) &&
            this.settings.applyPosition({ phase: Z.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(L.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === xe.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (C.once(D.read, this._prepareAlign, this._alignId),
              C.once(D.write, this._applyAlign, this._alignId)));
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
          this._emit(L.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  var en = class {
    constructor() {
      d(this, 'drag');
      d(this, 'isDestroyed');
      d(this, '_emitter');
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
  var tn = class extends en {
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
          type: y.Move,
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
      this.isDestroyed || this.drag || (super._start(t), C.on(D.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (C.off(D.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (C.off(D.read, this._tick), super._cancel(t));
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
  var Un = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function Ke(e, t) {
    if (!e.size || !t.size) return 1 / 0;
    let n = 1 / 0;
    for (let r of e) {
      let s = t.get(r);
      s !== void 0 && s < n && (n = s);
    }
    return n;
  }
  var U = {
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
    nn = class extends tn {
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
          startPredicate: r = U.startPredicate,
          computeSpeed: s = U.computeSpeed,
          cancelOnVisibilityChange: i = U.cancelOnVisibilityChange,
          cancelOnBlur: o = U.cancelOnBlur,
          startKeys: a = U.startKeys,
          moveLeftKeys: l = U.moveLeftKeys,
          moveRightKeys: u = U.moveRightKeys,
          moveUpKeys: c = U.moveUpKeys,
          moveDownKeys: h = U.moveDownKeys,
          cancelKeys: g = U.cancelKeys,
          endKeys: v = U.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(g)),
          (this._endKeys = new Set(v)),
          (this._moveLeftKeys = new Set(l)),
          (this._moveRightKeys = new Set(u)),
          (this._moveUpKeys = new Set(c)),
          (this._moveDownKeys = new Set(h)),
          (this._moveKeys = new Set([...l, ...u, ...c, ...h])),
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
        let t = Ke(this._moveLeftKeys, this._moveKeyTimestamps),
          n = Ke(this._moveRightKeys, this._moveKeyTimestamps),
          r = Ke(this._moveUpKeys, this._moveKeyTimestamps),
          s = Ke(this._moveDownKeys, this._moveKeyTimestamps),
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
              ((r.type = y.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
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
          ((n.type = y.End),
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
          Un.forEach((a, l) => {
            let u = `${a}Keys`,
              c = t[u];
            c !== void 0 && ((this[`_${u}`] = new Set(c)), l >= 3 && (n = !0));
          }),
          n)
        ) {
          let a = [
            ...this._moveLeftKeys,
            ...this._moveRightKeys,
            ...this._moveUpKeys,
            ...this._moveDownKeys,
          ];
          (this._moveKeys.size === a.length && [...this._moveKeys].every((l, u) => a[u] === l)) ||
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
  var zn = () => {},
    H = new Map(),
    st = new Set();
  function rt() {
    st.forEach((e) => e());
  }
  var Ee = {
    add(e, t, n) {
      ((H = new Map(H)), H.set(e, { sources: t, proxies: n, exiting: !1, done: zn }), rt());
    },
    startExiting(e, t) {
      let n = H.get(e);
      n && ((H = new Map(H)), H.set(e, { ...n, exiting: !0, done: t }), rt());
    },
    remove(e) {
      H.has(e) && ((H = new Map(H)), H.delete(e), rt());
    },
    subscribe(e) {
      return (st.add(e), () => st.delete(e));
    },
    getSnapshot() {
      return H;
    },
  };
  var Gn = (e) => typeof e == 'function' && e.length === 0;
  function V(e, t) {
    return e === void 0 ? t : Gn(e) ? e() : e;
  }
  function rn(e) {
    return e.map((t) => V(t));
  }
  var Qn = () => null,
    sn = Dt(Qn);
  function on() {
    return Ye(sn);
  }
  var Jn = Object.prototype.hasOwnProperty,
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
      for (let u = 0; u < l; u++) if (!$e(e[u], t[u])) return !1;
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
      if (!Jn.call(t, u) || !$e(e[u], t[u])) return !1;
    }
    return !0;
  }
  var Ne = new Map(),
    Be = [],
    it = [],
    ot = [],
    at = [],
    lt = [],
    ct = [],
    dt = [],
    ut = [];
  function ln() {
    (Ne.clear(),
      (Be.length = 0),
      (it.length = 0),
      (ot.length = 0),
      (at.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (dt.length = 0),
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
        o = $(r),
        a = oe(r),
        l = a ? o.transformOrigin : '',
        u,
        c;
      if (r instanceof SVGSVGElement) ((u = `${i.width}px`), (c = `${i.height}px`));
      else {
        let v = parseFloat(o.width),
          S = parseFloat(o.height);
        if (!(v >= 0) || !(S >= 0)) ((u = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((u = o.width), (c = o.height));
        else {
          let P = parseFloat(o.paddingLeft) || 0,
            T = parseFloat(o.paddingRight) || 0,
            j = parseFloat(o.borderLeftWidth) || 0,
            G = parseFloat(o.borderRightWidth) || 0,
            ie = parseFloat(o.paddingTop) || 0,
            p = parseFloat(o.paddingBottom) || 0,
            _ = parseFloat(o.borderTopWidth) || 0,
            q = parseFloat(o.borderBottomWidth) || 0;
          ((u = `${v + P + T + j + G}px`), (c = `${S + ie + p + _ + q}px`));
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
        (Be[n] = s),
        (t[n] = h),
        (it[n] = i),
        (ot[n] = a),
        (at[n] = l),
        (lt[n] = u),
        (ct[n] = c),
        Ne.has(s) || Ne.set(s, be(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Be[n],
        s = t[n],
        i = ot[n],
        o = at[n],
        a = lt[n],
        l = ct[n],
        u = s.style;
      ((u.width = a),
        (u.height = l),
        i && ((u.transform = i), o && (u.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Be[n],
        s = t[n],
        i = it[n],
        o = Ne.get(r),
        a = 0,
        l = 0,
        u = o.m11,
        c = o.m12,
        h = o.m21,
        g = o.m22,
        v = u * g - c * h,
        S = s.getBoundingClientRect(),
        P = i.left - S.left,
        T = i.top - S.top;
      if (Math.abs(v) < 1e-10) ((a = P), (l = T));
      else {
        let j = 1 / v;
        ((a = (g * P - h * T) * j), (l = (-c * P + u * T) * j));
      }
      ((dt[n] = a), (ut[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = dt[n],
        i = ut[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (ln(), t);
  }
  function dn(e, t) {
    if (de) return () => null;
    let n = E(() => (Array.isArray(e) ? rn(e) : (V(e) ?? [])).filter((p) => !!p)),
      r = E(() => V(t)),
      s = E(() => r()?.id),
      i = E(() => r()?.dndObserver),
      o = E(() => {
        let p = r();
        if (!p) return;
        let {
          dndObserver: _,
          id: q,
          dragPreviewContainer: De,
          dragPreviewExitTimeout: O,
          ...Y
        } = p;
        return Y;
      }),
      a = on(),
      l = E(() => {
        let p = i();
        return p === void 0 ? a() : p;
      }),
      [u, c] = A(null),
      h = null,
      g = s(),
      v = o(),
      S = l(),
      P = o(),
      T = r()?.dragPreviewContainer,
      j = r()?.dragPreviewExitTimeout;
    k(() => {
      let p = r();
      ((P = o()), (T = p?.dragPreviewContainer), (j = p?.dragPreviewExitTimeout));
    });
    let G = () => {
        h && (h.destroy(), (h = null), (v = void 0), c(null));
      },
      ie = () => {
        Et(() => {
          G();
          let p = R(n);
          if (!p.length) return;
          let _ = R(o),
            q = s(),
            De = _?.dragPreview,
            O = new nt(p, {
              id: q,
              ..._,
              elements(I) {
                let ft = P,
                  ue = (ft?.elements || (() => null))(I);
                if (!ft?.dragPreview || !ue || ue.length === 0) return ue;
                let fe = cn(ue);
                Ee.add(I.draggable, ue, fe);
                let ht = () => {
                    let gt = j || 0;
                    if (gt > 0) {
                      for (let He of fe) He.dataset.exiting = 'true';
                      let Ce = !1,
                        mt = () => {
                          Ce ||
                            ((Ce = !0),
                            clearTimeout(yn),
                            Ee.remove(I.draggable),
                            setTimeout(() => {
                              for (let He of fe) He.remove();
                            }, 0));
                        },
                        yn = setTimeout(mt, gt);
                      Ee.startExiting(I.draggable, mt);
                    } else
                      (Ee.remove(I.draggable),
                        setTimeout(() => {
                          for (let Ce of fe) Ce.remove();
                        }, 0));
                    (I.draggable.off('end', mn), I.draggable.off('destroy', pn));
                  },
                  mn = I.draggable.on('end', ht),
                  pn = I.draggable.on('destroy', ht);
                return fe;
              },
              ...(De
                ? {
                    container: () => {
                      let I = T;
                      return (typeof I == 'function' ? I() : I) || document.body;
                    },
                  }
                : {}),
            }),
            Y = R(l);
          (Y?.addDraggables([O]), (h = O), (g = q), (v = _), (S = Y), c(O));
        });
      };
    return (
      k(() => {
        let p = n();
        if (!p.length) {
          G();
          return;
        }
        let _ = h;
        if (!_) {
          ie();
          return;
        }
        (p.length !== _.sensors.length || p.some((q) => !_.sensors.includes(q))) && ie();
      }),
      k(() => {
        if (!h) return;
        let _ = s();
        g !== _ && ie();
      }),
      k(() => {
        let p = l();
        if (S === p) return;
        let _ = h;
        (_ && (S?.removeDraggables([_]), p?.addDraggables([_])), (S = p));
      }),
      k(() => {
        let p = h;
        if (!p) return;
        let _ = o(),
          q = !1;
        if (v) {
          let O = { ...v },
            Y = { ..._ };
          ((O.elements === Y.elements || (O.dragPreview && Y.dragPreview)) &&
            (delete O.elements, delete Y.elements),
            (q = !$e(O, Y)));
        } else q = !0;
        if (!q) return;
        let De = p._parseSettings(_);
        if (
          (p.updateSettings({
            ...De,
            ...(!_?.dragPreview && _?.elements ? { elements: _.elements } : {}),
            ...(_?.dragPreview
              ? {
                  container: () => {
                    let O = T;
                    return (typeof O == 'function' ? O() : O) || document.body;
                  },
                }
              : {}),
          }),
          v)
        ) {
          let O = _?.dndGroups !== v.dndGroups,
            Y = _?.computeClientRect !== v.computeClientRect;
          (O && S?.clearTargets(p), (O || Y) && S?.detectCollisions(p));
        }
        v = _;
      }),
      K(G),
      u
    );
  }
  function un(e, t = !1) {
    let n = E(() => V(e)),
      [r, s] = A(null),
      [i, o] = A(0);
    return (
      k(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(L.Start, () => {
            s(a.drag || null);
          }),
          u = null;
        t &&
          (u = a.on(L.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(L.End, () => {
          s(null);
        });
        K(() => {
          (a.off(L.Start, l), u && a.off(L.Move, u), a.off(L.End, c));
        });
      }),
      E(() => (i(), r()))
    );
  }
  function fn(e = {}, t) {
    if (de) return [() => null, () => {}];
    let n = E(() => V(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : V(t))),
      [s, i] = A(null),
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
    (k(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      k(() => {
        let c = r();
        c !== void 0 && (l(c), K(a));
      }));
    let u = (c) => {
      if (t === void 0) {
        if (c === null) {
          a();
          return;
        }
        o?.element !== c && l(c);
      }
    };
    return (K(a), [s, u]);
  }
  function hn(e = {}, t) {
    if (de) return [() => null, () => {}];
    let n = E(() => V(e, {}) || {}),
      r = E(() => (t === void 0 ? void 0 : V(t))),
      [s, i] = A(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new se(c, n());
        ((o = h), i(h));
      };
    (k(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      k(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), K(a));
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
    return (K(a), [s, u]);
  }
  var Zn = Lt(
    '<div tabindex=0><div class=handle><svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 512 512"><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z">',
  );
  function er() {
    let e = null,
      [t, n] = hn(),
      [r, s] = fn(),
      [i, o] = A(null),
      l = dn([t, r], {
        elements: () => (e ? [e] : []),
        onStart: (h) => {
          o(h.sensor instanceof se ? 'pointer' : 'keyboard');
        },
        onEnd: () => {
          o(null);
        },
      }),
      u = un(l),
      c = (h) => {
        ((e = h), s(h));
      };
    return (() => {
      var h = Zn(),
        g = h.firstChild;
      return (
        ze(c, h),
        ze(n, g),
        te(() =>
          It(h, `card draggable ${u() ? 'dragging' : ''} ${u() && i() ? `${i()}-dragging` : ''}`),
        ),
        h
      );
    })();
  }
  function tr() {
    return ke(er, {});
  }
  var gn = document.getElementById('root');
  if (!gn) throw new Error('Failed to find the root element');
  At(() => ke(tr, {}), gn);
})();
