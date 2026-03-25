'use strict';
var SolidExample_003_draggable_locked_axis = (() => {
  var Sn = Object.defineProperty;
  var xn = (e, t, n) =>
    t in e ? Sn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
  var d = (e, t, n) => xn(e, typeof t != 'symbol' ? t + '' : t, n);
  var w = {
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
    return w.context.id + (n ? String.fromCharCode(96 + n) : '') + t;
  }
  function Ve(e) {
    w.context = e;
  }
  function wn() {
    return { ...w.context, id: w.getNextContextId(), count: 0 };
  }
  var En = !1,
    Dn = (e, t) => e === t;
  var Me = { equals: Dn },
    vt = null,
    xt = Pt,
    $ = 1,
    fe = 2,
    wt = { owned: null, cleanups: null, context: null, owner: null };
  var p = null,
    f = null,
    ge = null,
    ae = null,
    x = null,
    E = null,
    k = null,
    ke = 0;
  function Et(e, t) {
    let n = x,
      r = p,
      s = e.length === 0,
      i = t === void 0 ? r : t,
      o = s ? wt : { owned: null, cleanups: null, context: i ? i.context : null, owner: i },
      a = s ? e : () => e(() => K(() => ee(o)));
    ((p = o), (x = null));
    try {
      return Q(a, !0);
    } finally {
      ((x = n), (p = r));
    }
  }
  function L(e, t) {
    t = t ? Object.assign({}, Me, t) : Me;
    let n = { value: e, observers: null, observerSlots: null, comparator: t.equals || void 0 },
      r = (s) => (
        typeof s == 'function' &&
          (f && f.running && f.sources.has(n) ? (s = s(n.tValue)) : (s = s(n.value))),
        Mt(n, s)
      );
    return [Ot.bind(n), r];
  }
  function te(e, t, n) {
    let r = Xe(e, t, !1, $);
    ge && f && f.running ? E.push(r) : me(r);
  }
  function A(e, t, n) {
    xt = kn;
    let r = Xe(e, t, !1, $),
      s = je && Ye(je);
    (s && (r.suspense = s), (!n || !n.render) && (r.user = !0), k ? k.push(r) : me(r));
  }
  function D(e, t, n) {
    n = n ? Object.assign({}, Me, n) : Me;
    let r = Xe(e, t, !0, 0);
    return (
      (r.observers = null),
      (r.observerSlots = null),
      (r.comparator = n.equals || void 0),
      ge && f && f.running ? ((r.tState = $), E.push(r)) : me(r),
      Ot.bind(r)
    );
  }
  function Dt(e) {
    return Q(e, !1);
  }
  function K(e) {
    if (!ae && x === null) return e();
    let t = x;
    x = null;
    try {
      return ae ? ae.untrack(e) : e();
    } finally {
      x = t;
    }
  }
  function N(e) {
    return (p === null || (p.cleanups === null ? (p.cleanups = [e]) : p.cleanups.push(e)), e);
  }
  function Cn(e) {
    if (f && f.running) return (e(), f.done);
    let t = x,
      n = p;
    return Promise.resolve().then(() => {
      ((x = t), (p = n));
      let r;
      return (
        (ge || je) &&
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
        Q(e, !1),
        (x = p = null),
        r ? r.done : void 0
      );
    });
  }
  var [or, _t] = L(!1);
  function Ct(e, t) {
    let n = Symbol('context');
    return { id: n, Provider: An(n), defaultValue: e };
  }
  function Ye(e) {
    let t;
    return p && p.context && (t = p.context[e.id]) !== void 0 ? t : e.defaultValue;
  }
  function On(e) {
    let t = D(e),
      n = D(() => qe(t()));
    return (
      (n.toArray = () => {
        let r = n();
        return Array.isArray(r) ? r : r != null ? [r] : [];
      }),
      n
    );
  }
  var je;
  function Ot() {
    let e = f && f.running;
    if (this.sources && (e ? this.tState : this.state))
      if ((e ? this.tState : this.state) === $) me(this);
      else {
        let t = E;
        ((E = null), Q(() => Pe(this), !1), (E = t));
      }
    if (x) {
      let t = this.observers ? this.observers.length : 0;
      (x.sources
        ? (x.sources.push(this), x.sourceSlots.push(t))
        : ((x.sources = [this]), (x.sourceSlots = [t])),
        this.observers
          ? (this.observers.push(x), this.observerSlots.push(x.sources.length - 1))
          : ((this.observers = [x]), (this.observerSlots = [x.sources.length - 1])));
    }
    return e && f.sources.has(this) ? this.tValue : this.value;
  }
  function Mt(e, t, n) {
    let r = f && f.running && f.sources.has(e) ? e.tValue : e.value;
    if (!e.comparator || !e.comparator(r, t)) {
      if (f) {
        let s = f.running;
        ((s || (!n && f.sources.has(e))) && (f.sources.add(e), (e.tValue = t)), s || (e.value = t));
      } else e.value = t;
      e.observers &&
        e.observers.length &&
        Q(() => {
          for (let s = 0; s < e.observers.length; s += 1) {
            let i = e.observers[s],
              o = f && f.running;
            (o && f.disposed.has(i)) ||
              ((o ? !i.tState : !i.state) && (i.pure ? E.push(i) : k.push(i), i.observers && kt(i)),
              o ? (i.tState = $) : (i.state = $));
          }
          if (E.length > 1e6) throw ((E = []), new Error());
        }, !1);
    }
    return t;
  }
  function me(e) {
    if (!e.fn) return;
    ee(e);
    let t = ke;
    (bt(e, f && f.running && f.sources.has(e) ? e.tValue : e.value, t),
      f &&
        !f.running &&
        f.sources.has(e) &&
        queueMicrotask(() => {
          Q(() => {
            (f && (f.running = !0), (x = p = e), bt(e, e.tValue, t), (x = p = null));
          }, !1);
        }));
  }
  function bt(e, t, n) {
    let r,
      s = p,
      i = x;
    x = p = e;
    try {
      r = e.fn(t);
    } catch (o) {
      return (
        e.pure &&
          (f && f.running
            ? ((e.tState = $), e.tOwned && e.tOwned.forEach(ee), (e.tOwned = void 0))
            : ((e.state = $), e.owned && e.owned.forEach(ee), (e.owned = null))),
        (e.updatedAt = n + 1),
        We(o)
      );
    } finally {
      ((x = i), (p = s));
    }
    (!e.updatedAt || e.updatedAt <= n) &&
      (e.updatedAt != null && 'observers' in e
        ? Mt(e, r, !0)
        : f && f.running && e.pure
          ? (f.sources.has(e) || (e.value = r), f.sources.add(e), (e.tValue = r))
          : (e.value = r),
      (e.updatedAt = n));
  }
  function Xe(e, t, n, r = $, s) {
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
      (f && f.running && ((i.state = 0), (i.tState = r)),
      p === null ||
        (p !== wt &&
          (f && f.running && p.pure
            ? p.tOwned
              ? p.tOwned.push(i)
              : (p.tOwned = [i])
            : p.owned
              ? p.owned.push(i)
              : (p.owned = [i]))),
      ae && i.fn)
    ) {
      let o = i.fn,
        [a, l] = L(void 0, { equals: !1 }),
        u = ae.factory(o, l);
      N(() => u.dispose());
      let c,
        h = () =>
          Cn(l).then(() => {
            c && (c.dispose(), (c = void 0));
          });
      i.fn = (g) => (a(), f && f.running ? (c || (c = ae.factory(o, h)), c.track(g)) : u.track(g));
    }
    return i;
  }
  function he(e) {
    let t = f && f.running;
    if ((t ? e.tState : e.state) === 0) return;
    if ((t ? e.tState : e.state) === fe) return Pe(e);
    if (e.suspense && K(e.suspense.inFallback)) return e.suspense.effects.push(e);
    let n = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ke); ) {
      if (t && f.disposed.has(e)) return;
      (t ? e.tState : e.state) && n.push(e);
    }
    for (let r = n.length - 1; r >= 0; r--) {
      if (((e = n[r]), t)) {
        let s = e,
          i = n[r + 1];
        for (; (s = s.owner) && s !== i; ) if (f.disposed.has(s)) return;
      }
      if ((t ? e.tState : e.state) === $) me(e);
      else if ((t ? e.tState : e.state) === fe) {
        let s = E;
        ((E = null), Q(() => Pe(e, n[0]), !1), (E = s));
      }
    }
  }
  function Q(e, t) {
    if (E) return e();
    let n = !1;
    (t || (E = []), k ? (n = !0) : (k = []), ke++);
    try {
      let r = e();
      return (Mn(n), r);
    } catch (r) {
      (n || (k = null), (E = null), We(r));
    }
  }
  function Mn(e) {
    if ((E && (ge && f && f.running ? Pn(E) : Pt(E), (E = null)), e)) return;
    let t;
    if (f) {
      if (!f.promises.size && !f.queue.size) {
        let r = f.sources,
          s = f.disposed;
        (k.push.apply(k, f.effects), (t = f.resolve));
        for (let i of k) ('tState' in i && (i.state = i.tState), delete i.tState);
        ((f = null),
          Q(() => {
            for (let i of s) ee(i);
            for (let i of r) {
              if (((i.value = i.tValue), i.owned))
                for (let o = 0, a = i.owned.length; o < a; o++) ee(i.owned[o]);
              (i.tOwned && (i.owned = i.tOwned), delete i.tValue, delete i.tOwned, (i.tState = 0));
            }
            _t(!1);
          }, !1));
      } else if (f.running) {
        ((f.running = !1), f.effects.push.apply(f.effects, k), (k = null), _t(!0));
        return;
      }
    }
    let n = k;
    ((k = null), n.length && Q(() => xt(n), !1), t && t());
  }
  function Pt(e) {
    for (let t = 0; t < e.length; t++) he(e[t]);
  }
  function Pn(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t],
        r = f.queue;
      r.has(n) ||
        (r.add(n),
        ge(() => {
          (r.delete(n),
            Q(() => {
              ((f.running = !0), he(n));
            }, !1),
            f && (f.running = !1));
        }));
    }
  }
  function kn(e) {
    let t,
      n = 0;
    for (t = 0; t < e.length; t++) {
      let r = e[t];
      r.user ? (e[n++] = r) : he(r);
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
      he(e[t]);
  }
  function Pe(e, t) {
    let n = f && f.running;
    n ? (e.tState = 0) : (e.state = 0);
    for (let r = 0; r < e.sources.length; r += 1) {
      let s = e.sources[r];
      if (s.sources) {
        let i = n ? s.tState : s.state;
        i === $ ? s !== t && (!s.updatedAt || s.updatedAt < ke) && he(s) : i === fe && Pe(s, t);
      }
    }
  }
  function kt(e) {
    let t = f && f.running;
    for (let n = 0; n < e.observers.length; n += 1) {
      let r = e.observers[n];
      (t ? !r.tState : !r.state) &&
        (t ? (r.tState = fe) : (r.state = fe),
        r.pure ? E.push(r) : k.push(r),
        r.observers && kt(r));
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
    if (f && f.running && e.pure) Tt(e, !0);
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
  function Tt(e, t) {
    if ((t || ((e.tState = 0), f.disposed.add(e)), e.owned))
      for (let n = 0; n < e.owned.length; n++) Tt(e.owned[n]);
  }
  function Tn(e) {
    return e instanceof Error
      ? e
      : new Error(typeof e == 'string' ? e : 'Unknown error', { cause: e });
  }
  function St(e, t, n) {
    try {
      for (let r of t) r(e);
    } catch (r) {
      We(r, (n && n.owner) || null);
    }
  }
  function We(e, t = p) {
    let n = vt && t && t.context && t.context[vt],
      r = Tn(e);
    if (!n) throw r;
    k
      ? k.push({
          fn() {
            St(r, n, t);
          },
          state: $,
        })
      : St(r, n, t);
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
  function An(e, t) {
    return function (r) {
      let s;
      return (
        te(
          () => (s = K(() => ((p.context = { ...p.context, [e]: r.value }), On(() => r.children)))),
          void 0,
        ),
        s
      );
    };
  }
  var Ln = !1;
  function pe(e, t) {
    if (Ln && w.context) {
      let n = w.context;
      Ve(wn());
      let r = K(() => e(t || {}));
      return (Ve(n), r);
    }
    return K(() => e(t || {}));
  }
  var Rn = [
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
    Sr = new Set([
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
      ...Rn,
    ]);
  function Fn(e, t, n) {
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
              y;
            for (; ++h < s && h < i && !((y = u.get(t[h])) == null || y !== c + g); ) g++;
            if (g > c - a) {
              let S = t[o];
              for (; a < c; ) e.insertBefore(n[a++], S);
            } else e.replaceChild(n[a++], t[o++]);
          } else o++;
        else t[o++].remove();
      }
    }
  }
  function Lt(e, t, n, r = {}) {
    let s;
    return (
      Et((i) => {
        ((s = i), t === document ? e() : Kn(t, e(), t.firstChild ? null : void 0, n));
      }, r.owner),
      () => {
        (s(), (t.textContent = ''));
      }
    );
  }
  function It(e, t, n, r) {
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
        ? () => K(() => document.importNode(s || (s = i()), !0))
        : () => (s || (s = i())).cloneNode(!0);
    return ((o.cloneNode = o), o);
  }
  function Ue(e, t, n) {
    Ge(e) || (n == null ? e.removeAttribute(t) : e.setAttribute(t, n));
  }
  function Rt(e, t) {
    Ge(e) || (t == null ? e.removeAttribute('class') : (e.className = t));
  }
  function Ft(e, t, n) {
    n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
  }
  function Kt(e, t, n) {
    return K(() => e(t, n));
  }
  function Kn(e, t, n, r) {
    if ((n !== void 0 && !r && (r = []), typeof t != 'function')) return Te(e, t, r, n);
    te((s) => Te(e, t(), s, n), r);
  }
  function Ge(e) {
    return !!w.context && !w.done && (!e || e.isConnected);
  }
  function Te(e, t, n, r, s) {
    let i = Ge(e);
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
          (n = le(e, n, r, l)));
      } else
        n !== '' && typeof n == 'string' ? (n = e.firstChild.data = t) : (n = e.textContent = t);
    } else if (t == null || o === 'boolean') {
      if (i) return n;
      n = le(e, n, r);
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
        if (ze(l, t, n, s)) return (te(() => (n = Te(e, l, n, r, !0))), () => n);
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
        } else u ? (n.length === 0 ? At(e, l, r) : Fn(e, n, l)) : (n && le(e), At(e, l));
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
  function ze(e, t, n, r) {
    let s = !1;
    for (let i = 0, o = t.length; i < o; i++) {
      let a = t[i],
        l = n && n[e.length],
        u;
      if (!(a == null || a === !0 || a === !1))
        if ((u = typeof a) == 'object' && a.nodeType) e.push(a);
        else if (Array.isArray(a)) s = ze(e, a, l) || s;
        else if (u === 'function')
          if (r) {
            for (; typeof a == 'function'; ) a = a();
            s = ze(e, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
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
  var $n = () => {},
    B = new Map(),
    Ze = new Set();
  function Qe() {
    Ze.forEach((e) => e());
  }
  var ye = {
    add(e, t, n) {
      ((B = new Map(B)), B.set(e, { sources: t, proxies: n, exiting: !1, done: $n }), Qe());
    },
    startExiting(e, t) {
      let n = B.get(e);
      n && ((B = new Map(B)), B.set(e, { ...n, exiting: !0, done: t }), Qe());
    },
    remove(e) {
      B.has(e) && ((B = new Map(B)), B.delete(e), Qe());
    },
    subscribe(e) {
      return (Ze.add(e), () => Ze.delete(e));
    },
    getSnapshot() {
      return B;
    },
  };
  var Nn = (e) => typeof e == 'function' && e.length === 0;
  function H(e, t) {
    return e === void 0 ? t : Nn(e) ? e() : e;
  }
  function $t(e) {
    return e.map((t) => H(t));
  }
  var Bn = () => null,
    Nt = Ct(Bn);
  var ve = { ADD: 'add', UPDATE: 'update', IGNORE: 'ignore', THROW: 'throw' },
    ne = class {
      constructor(e = {}) {
        d(this, 'dedupe');
        d(this, 'getId');
        d(this, '_events');
        ((this.dedupe = e.dedupe || ve.ADD),
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
            case ve.THROW:
              throw Error('Eventti: duplicate listener id!');
            case ve.IGNORE:
              return n;
            case ve.UPDATE:
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
  var Hn = class {
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
  function Je(e = 60) {
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
  var Bt = class extends Hn {
    constructor(e = {}) {
      let { paused: t = !1, onDemand: n = !1, requestFrame: r = Je(), ...s } = e;
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
  var C = { read: Symbol(), write: Symbol() },
    M = new Bt({
      phases: [C.read, C.write],
      requestFrame: typeof window < 'u' ? Je() : () => () => {},
    });
  var v = { Start: 'start', Move: 'move', Cancel: 'cancel', End: 'end', Destroy: 'destroy' };
  var Ht = new WeakMap();
  function V(e) {
    let t = Ht.get(e)?.deref();
    return (t || ((t = window.getComputedStyle(e, null)), Ht.set(e, new WeakRef(t))), t);
  }
  var Z = typeof window < 'u' && window.document !== void 0,
    Vt = Z && 'ontouchstart' in window,
    jt = Z && !!window.PointerEvent;
  Z &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS');
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
  function Vn(e) {
    return 'pointerId' in e
      ? e.pointerId
      : 'changedTouches' in e
        ? e.changedTouches[0]
          ? e.changedTouches[0].identifier
          : null
        : -1;
  }
  function jn(e) {
    return 'pointerType' in e ? e.pointerType : 'touches' in e ? 'touch' : 'mouse';
  }
  function Yt(e = {}) {
    let { capture: t = !0, passive: n = !0 } = e;
    return { capture: t, passive: n };
  }
  function Xt(e) {
    return e === 'auto' || e === void 0 ? (jt ? 'pointer' : Vt ? 'touch' : 'mouse') : e;
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
    se = {
      listenerOptions: {},
      sourceEvents: 'auto',
      startPredicate: (e) => !('button' in e && e.button > 0),
      cancelOnVisibilityChange: !0,
      cancelOnEscape: !0,
      preventNativeDrag: !0,
      preventContextMenu: !1,
    },
    _e = class {
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
          listenerOptions: n = se.listenerOptions,
          sourceEvents: r = se.sourceEvents,
          startPredicate: s = se.startPredicate,
          cancelOnVisibilityChange: i = se.cancelOnVisibilityChange,
          cancelOnEscape: o = se.cancelOnEscape,
          preventNativeDrag: a = se.preventNativeDrag,
          preventContextMenu: l = se.preventContextMenu,
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
          (this._listenerOptions = Yt(n)),
          (this._sourceEvents = Xt(r)),
          (this._emitter = new ne()),
          (this._onStart = this._onStart.bind(this)),
          (this._onMove = this._onMove.bind(this)),
          (this._onCancel = this._onCancel.bind(this)),
          (this._onEnd = this._onEnd.bind(this)),
          e.addEventListener(re[this._sourceEvents].start, this._onStart, this._listenerOptions),
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
        let t = Vn(e);
        if (t === null) return;
        let n = qt(e, t);
        if (n === null) return;
        let r = {
          pointerId: t,
          pointerType: jn(e),
          startX: n.clientX,
          startY: n.clientY,
          x: n.clientX,
          y: n.clientY,
          deltaX: 0,
          deltaY: 0,
        };
        ((this.drag = r),
          (this._eventData = { ...r, type: v.Start, srcEvent: e, target: n.target }),
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
          (n.type = v.Move),
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
          (n.type = v.Cancel),
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
          (n.type = v.End),
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
          ((this._eventData.type = v.Cancel),
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
          l = Xt(n),
          u = Yt(t);
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
          this._emitter.emit(v.Destroy, { type: v.Destroy }),
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
  function qn(e) {
    let t = V(e),
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
  function Yn(e) {
    let t = V(e),
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
  function ie(e, t = !1) {
    let { translate: n, rotate: r, scale: s, transform: i } = V(e),
      o = '';
    if (n && n !== 'none') {
      let [a = '0px', l = '0px', u] = n.split(' ');
      (a.includes('%') && (a = `${(parseFloat(a) / 100) * Yn(e)}px`),
        l.includes('%') && (l = `${(parseFloat(l) / 100) * qn(e)}px`),
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
  function be(e) {
    return e.setMatrixValue('scale(1, 1)');
  }
  function et(e) {
    let t = e.split(' '),
      n = '',
      r = '',
      s = '';
    return (
      t.length === 1 ? (n = r = t[0]) : t.length === 2 ? ([n, r] = t) : ([n, r, s] = t),
      { x: parseFloat(n) || 0, y: parseFloat(r) || 0, z: parseFloat(s) || 0 }
    );
  }
  var oe = Z ? new DOMMatrix() : null;
  function Se(e, t = new DOMMatrix()) {
    let n = e;
    for (be(t); n; ) {
      let r = ie(n);
      if (r && (oe.setMatrixValue(r), !oe.isIdentity)) {
        let { transformOrigin: s } = V(n),
          { x: i, y: o, z: a } = et(s);
        (a === 0
          ? oe.setMatrixValue(`translate(${i}px,${o}px) ${oe} translate(${i * -1}px,${o * -1}px)`)
          : oe.setMatrixValue(
              `translate3d(${i}px,${o}px,${a}px) ${oe} translate3d(${i * -1}px,${o * -1}px,${a * -1}px)`,
            ),
          t.preMultiplySelf(oe));
      }
      n = n.parentElement;
    }
    return t;
  }
  var Wt = new WeakMap();
  function W(e, t) {
    if (t) return window.getComputedStyle(e, t);
    let n = Wt.get(e)?.deref();
    return (n || ((n = window.getComputedStyle(e, null)), Wt.set(e, new WeakRef(n))), n);
  }
  var Xn = typeof window < 'u' && window.document !== void 0,
    tt = !!(
      Xn &&
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
    Jr = {
      [xe.content]: !1,
      [xe.padding]: !1,
      [xe.scrollbar]: !0,
      [xe.border]: !0,
      [xe.margin]: !0,
    };
  var es = (() => {
    try {
      return window.navigator.userAgentData.brands.some(({ brand: e }) => e === 'Chromium');
    } catch {
      return !1;
    }
  })();
  function Ae(e) {
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
  function Le(e) {
    let t = W(e);
    if (!tt) {
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
      ) || !!(tt && a && a.indexOf('filter') > -1)
    );
  }
  function zt(e) {
    return W(e).position !== 'static' || Le(e);
  }
  function Ut(e) {
    return e instanceof HTMLHtmlElement;
  }
  function nt(e, t = {}) {
    if (Ut(e)) return e.ownerDocument.defaultView;
    let n = t.position || W(e).position,
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
          let a = i ? Le(o) : zt(o);
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
  function Gt(e) {
    return e instanceof Window;
  }
  function rt(e, t = {}) {
    let n = W(e),
      { display: r } = n;
    if (r === 'none' || r === 'contents') return null;
    let s = t.position || W(e).position,
      { skipDisplayNone: i, container: o } = t;
    switch (s) {
      case 'relative':
        return e;
      case 'fixed':
        return nt(e, { container: o, position: s, skipDisplayNone: i });
      case 'absolute': {
        let a = nt(e, { container: o, position: s, skipDisplayNone: i });
        return Gt(a) ? e.ownerDocument : a;
      }
      default:
        return null;
    }
  }
  function Wn(e, t) {
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
  function st(e) {
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
  function Ie(e, t = 0) {
    let n = 10 ** t;
    return Math.round((e + 2 ** -52) * n) / n;
  }
  var Zt = class {
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
    tn = class {
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
          (this._matrixCache = new Zt()),
          (this._clientOffsetCache = new Zt()));
      }
    };
  function zn(e, t, n = !1) {
    let { style: r } = e;
    for (let s in t) r.setProperty(s, t[s], n ? 'important' : '');
  }
  function Un() {
    let e = document.createElement('div');
    return (
      e.classList.add('dragdoll-measure'),
      zn(
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
  function Ee(e, t = { x: 0, y: 0 }) {
    if (((t.x = 0), (t.y = 0), e instanceof Window)) return t;
    if (e instanceof Document) return ((t.x = window.scrollX * -1), (t.y = window.scrollY * -1), t);
    let { x: n, y: r } = e.getBoundingClientRect(),
      s = V(e);
    return (
      (t.x = n + (parseFloat(s.borderLeftWidth) || 0)),
      (t.y = r + (parseFloat(s.borderTopWidth) || 0)),
      t
    );
  }
  function Jt(e) {
    return typeof e == 'object' && !!e && 'x' in e && 'y' in e;
  }
  var Gn = { x: 0, y: 0 },
    Qn = { x: 0, y: 0 };
  function Zn(e, t, n = { x: 0, y: 0 }) {
    let r = Jt(e) ? e : Ee(e, Gn),
      s = Jt(t) ? t : Ee(t, Qn);
    return ((n.x = s.x - r.x), (n.y = s.y - r.y), n);
  }
  var Re = Z ? Un() : null,
    nn = class {
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
        let r = V(e),
          s = e.getBoundingClientRect(),
          i = ie(e, !0);
        ((this.data = {}),
          (this.element = e),
          (this.elementTransformOrigin = et(r.transformOrigin)),
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
        let u = rt(e) || e;
        ((this.elementOffsetContainer = u),
          (this.dragOffsetContainer = l === o ? u : rt(e, { container: l })));
        {
          let { width: h, height: g, x: y, y: S } = s;
          this.clientRect = { width: h, height: g, x: y, y: S };
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
            (Se(e, n), r.setMatrixValue(n.toString()).invertSelf(), this._matrixCache.set(e, t));
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
                ? st(g[0])
                  ? (Re.style.setProperty('transform', g[1].toString(), 'important'),
                    c.append(Re),
                    Ee(Re, h),
                    Re.remove())
                  : (Ee(c, h), (h.x -= g[0].m41), (h.y -= g[0].m42))
                : Ee(c, h);
            }
            return (i.set(c, h), h);
          });
          Zn(a, l, s);
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
    Jn = { x: 0, y: 0 },
    z = Z ? new DOMMatrix() : null,
    Fe = Z ? new DOMMatrix() : null,
    j = (function (e) {
      return (
        (e[(e.None = 0)] = 'None'),
        (e[(e.Init = 1)] = 'Init'),
        (e[(e.Prepare = 2)] = 'Prepare'),
        (e[(e.FinishPrepare = 3)] = 'FinishPrepare'),
        (e[(e.Apply = 4)] = 'Apply'),
        (e[(e.FinishApply = 5)] = 'FinishApply'),
        e
      );
    })(j || {}),
    q = (function (e) {
      return (
        (e[(e.Pending = 0)] = 'Pending'),
        (e[(e.Resolved = 1)] = 'Resolved'),
        (e[(e.Rejected = 2)] = 'Rejected'),
        e
      );
    })(q || {}),
    we = { Start: 'start', Move: 'move', End: 'end' },
    De = { Immediate: 'immediate', Sampled: 'sampled' },
    J = {
      Start: 'start',
      StartAlign: 'start-align',
      Move: 'move',
      Align: 'align',
      End: 'end',
      EndAlign: 'end-align',
    },
    I = {
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
        let n = t === J.End || t === J.EndAlign,
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
          { x: y, y: S, z: _ } = h,
          O = !c.isIdentity && (y !== 0 || S !== 0 || _ !== 0),
          R = a.x + l.x + u.x,
          T = a.y + l.y + u.y;
        (be(z),
          O && (_ === 0 ? z.translateSelf(-y, -S) : z.translateSelf(-y, -S, -_)),
          n ? s.isIdentity || z.multiplySelf(s) : o.isIdentity || z.multiplySelf(o),
          be(Fe).translateSelf(R, T),
          z.multiplySelf(Fe),
          r.isIdentity || z.multiplySelf(r),
          O && (be(Fe).translateSelf(y, S, _), z.multiplySelf(Fe)),
          c.isIdentity || z.multiplySelf(c),
          g.isIdentity || z.preMultiplySelf(g),
          (e.element.style.transform = `${z}`));
      },
      computeClientRect: ({ drag: e }) => e.items[0].clientRect || null,
      positionModifiers: [],
      sensorProcessingMode: De.Sampled,
      dndGroups: void 0,
      preventClickOnEnd: !0,
      preventTextSelection: !0,
      capturePointer: !0,
    },
    it = class {
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
          (this._startPhase = j.None),
          (this._startId = Symbol()),
          (this._moveId = Symbol()),
          (this._alignId = Symbol()),
          (this._modifierData = { draggable: this, drag: null, item: null, phase: we.Start }),
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
          predicateState: q.Pending,
          predicateEvent: null,
          onMove: (r) => this._onMove(r, e),
          onEnd: (r) => this._onEnd(r, e),
        });
        let { onMove: t, onEnd: n } = this._sensorData.get(e);
        (e.on(v.Start, t, t), e.on(v.Move, t, t), e.on(v.Cancel, n, n), e.on(v.End, n, n));
      }
      _unbindSensor(e) {
        let t = this._sensorData.get(e);
        if (!t) return;
        let { onMove: n, onEnd: r } = t;
        (e.off(v.Start, n),
          e.off(v.Move, n),
          e.off(v.Cancel, r),
          e.off(v.End, r),
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
          computeClientRect: l = t.computeClientRect,
          sensorProcessingMode: u = t.sensorProcessingMode,
          dndGroups: c = t.dndGroups,
          preventClickOnEnd: h = t.preventClickOnEnd,
          preventTextSelection: g = t.preventTextSelection,
          capturePointer: y = t.capturePointer,
          onPrepareStart: S = t.onPrepareStart,
          onStart: _ = t.onStart,
          onPrepareMove: O = t.onPrepareMove,
          onMove: R = t.onMove,
          onEnd: T = t.onEnd,
          onDestroy: G = t.onDestroy,
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
          capturePointer: y,
          onPrepareStart: S,
          onStart: _,
          onPrepareMove: O,
          onMove: R,
          onEnd: T,
          onDestroy: G,
        };
      }
      _emit(e, ...t) {
        this._emitter.emit(e, ...t);
      }
      _onMove(e, t) {
        let n = this._sensorData.get(t);
        if (n)
          switch (n.predicateState) {
            case q.Pending: {
              n.predicateEvent = e;
              let r = this.settings.startPredicate({ draggable: this, sensor: t, event: e });
              r === !0 ? this.resolveStartPredicate(t) : r === !1 && this.rejectStartPredicate(t);
              break;
            }
            case q.Resolved:
              this.drag &&
                (Object.assign(this.drag.moveEvent, e),
                this.settings.sensorProcessingMode === De.Immediate
                  ? (this._prepareMove(), this._applyMove())
                  : (M.once(C.read, this._prepareMove, this._moveId),
                    M.once(C.write, this._applyMove, this._moveId)));
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
            ? n.predicateState === q.Resolved &&
              ((this.drag.endEvent = { ...e }),
              this._sensorData.forEach((r) => {
                ((r.predicateState = q.Pending), (r.predicateEvent = null));
              }),
              this.stop())
            : ((n.predicateState = q.Pending), (n.predicateEvent = null)));
      }
      _prepareStart() {
        let e = this.drag;
        !e ||
          this._startPhase !== j.Init ||
          ((this._startPhase = j.Prepare),
          (e.items = (this.settings.elements({ draggable: this, drag: e }) || []).map(
            (t) => new nn(t, this),
          )),
          this._applyModifiers(we.Start, 0, 0),
          this._emit(I.PrepareStart, e, this),
          this.settings.onPrepareStart?.(e, this),
          (this._startPhase = j.FinishPrepare));
      }
      _applyStart() {
        let e = this.drag;
        if (!(!e || this._startPhase !== j.FinishPrepare)) {
          if (((this._startPhase = j.Apply), this.settings.preventClickOnEnd)) {
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
            if (t instanceof _e && t.drag) {
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
              this.settings.applyPosition({ phase: J.Start, draggable: this, drag: e, item: t }));
          for (let t of e.items) {
            let n = t.getContainerMatrix()[0],
              r = t.getDragContainerMatrix()[0];
            if (Wn(n, r) || (!st(n) && !st(r))) continue;
            let s = t.element.getBoundingClientRect(),
              { alignmentOffset: i } = t;
            ((i.x += Ie(t.clientRect.x - s.x, 3)), (i.y += Ie(t.clientRect.y - s.y, 3)));
          }
          for (let t of e.items) {
            let { alignmentOffset: n } = t;
            (n.x !== 0 || n.y !== 0) &&
              this.settings.applyPosition({
                phase: J.StartAlign,
                draggable: this,
                drag: e,
                item: t,
              });
          }
          (window.addEventListener('scroll', this._onScroll, en),
            this._emit(I.Start, e, this),
            this.settings.onStart?.(e, this),
            (this._startPhase = j.FinishApply));
        }
      }
      _prepareMove() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        let { moveEvent: t, prevMoveEvent: n } = e,
          r = t.x - n.x,
          s = t.y - n.y;
        (!r && !s) ||
          (this._applyModifiers(we.Move, r, s),
          this._emit(I.PrepareMove, e, this),
          !e.isEnded &&
            (this.settings.onPrepareMove?.(e, this), !e.isEnded && Object.assign(n, t)));
      }
      _applyMove() {
        let e = this.drag;
        if (!(!e || e.isEnded)) {
          for (let t of e.items)
            ((t._moveDiff.x = 0),
              (t._moveDiff.y = 0),
              this.settings.applyPosition({ phase: J.Move, draggable: this, drag: e, item: t }));
          (this._emit(I.Move, e, this), !e.isEnded && this.settings.onMove?.(e, this));
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
              this.settings.applyPosition({ phase: J.Align, draggable: this, drag: e, item: t }));
      }
      _applyModifiers(e, t, n) {
        let { drag: r } = this;
        if (!r) return;
        let s = this.settings.positionModifiers,
          i = this._modifierData;
        i.drag = r;
        for (let o of r.items) {
          let a = Jn;
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
        n.predicateState === q.Pending &&
          r &&
          ((this._startPhase = j.Init),
          (n.predicateState = q.Resolved),
          (n.predicateEvent = null),
          (this.drag = new tn(e, r)),
          this._sensorData.forEach((s, i) => {
            i !== e && ((s.predicateState = q.Rejected), (s.predicateEvent = null));
          }),
          this.settings.sensorProcessingMode === De.Immediate
            ? (this._prepareStart(), this._applyStart())
            : (M.once(C.read, this._prepareStart, this._startId),
              M.once(C.write, this._applyStart, this._startId)));
      }
      rejectStartPredicate(e) {
        let t = this._sensorData.get(e);
        t?.predicateState === q.Pending &&
          ((t.predicateState = q.Rejected), (t.predicateEvent = null));
      }
      stop() {
        let e = this.drag;
        if (!e || e.isEnded) return;
        if (this._startPhase === j.Prepare || this._startPhase === j.Apply)
          throw Error('Cannot stop drag start process at this point');
        if (
          ((e.isEnded = !0),
          this._prepareStart(),
          this._applyStart(),
          (this._startPhase = j.None),
          M.off(C.read, this._startId),
          M.off(C.write, this._startId),
          M.off(C.read, this._moveId),
          M.off(C.write, this._moveId),
          M.off(C.read, this._alignId),
          M.off(C.write, this._alignId),
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
        this._applyModifiers(we.End, 0, 0);
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
          this.settings.applyPosition({ phase: J.End, draggable: this, drag: e, item: n });
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
            this.settings.applyPosition({ phase: J.EndAlign, draggable: this, drag: e, item: n });
        (this._emit(I.End, e, this), this.settings.onEnd?.(e, this), (this.drag = null));
        let t = this._modifierData;
        ((t.drag = null), (t.item = null));
      }
      align(e = !1) {
        !this.drag ||
          this.drag.isEnded ||
          (e || this.settings.sensorProcessingMode === De.Immediate
            ? (this._prepareAlign(), this._applyAlign())
            : (M.once(C.read, this._prepareAlign, this._alignId),
              M.once(C.write, this._applyAlign, this._alignId)));
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
          this._emit(I.Destroy),
          this.settings.onDestroy?.(this),
          this._emitter.off());
      }
    };
  function sn() {
    return Ye(Nt);
  }
  var er = Object.prototype.hasOwnProperty,
    on = (e) => {
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
      for (let u = 0; u < l; u++) if (!Ke(e[u], t[u])) return !1;
      return !0;
    }
    let s = e instanceof Set,
      i = t instanceof Set;
    if (s || i) {
      if (!s || !i || e.size !== t.size) return !1;
      for (let l of e) if (!t.has(l)) return !1;
      return !0;
    }
    if (!on(e) || !on(t)) return !1;
    let o = Object.keys(e),
      a = Object.keys(t);
    if (o.length !== a.length) return !1;
    for (let l = 0; l < o.length; l++) {
      let u = o[l];
      if (!er.call(t, u) || !Ke(e[u], t[u])) return !1;
    }
    return !0;
  }
  var an = class {
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
        this._emitter.emit(v.Start, n));
    }
    _move(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(v.Move, t));
    }
    _end(e) {
      if (!this.drag) return;
      this._updateDragData(e);
      let t = e;
      ((t.startX = this.drag.startX),
        (t.startY = this.drag.startY),
        (t.deltaX = this.drag.deltaX),
        (t.deltaY = this.drag.deltaY),
        this._emitter.emit(v.End, t),
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
        this._emitter.emit(v.Cancel, t),
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
          type: v.Cancel,
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
        this._emitter.emit(v.Destroy, { type: v.Destroy }),
        this._emitter.off());
    }
  };
  var ln = class extends an {
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
          type: v.Move,
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
      this.isDestroyed || this.drag || (super._start(t), M.on(C.read, this._tick, this._tick));
    }
    _end(t) {
      this.drag && (M.off(C.read, this._tick), super._end(t));
    }
    _cancel(t) {
      this.drag && (M.off(C.read, this._tick), super._cancel(t));
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
  var tr = ['start', 'cancel', 'end', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
  function $e(e, t) {
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
    cn = class extends ln {
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
          endKeys: y = U.endKeys,
        } = n;
        ((this.element = t),
          (this._startKeys = new Set(a)),
          (this._cancelKeys = new Set(g)),
          (this._endKeys = new Set(y)),
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
        let t = $e(this._moveLeftKeys, this._moveKeyTimestamps),
          n = $e(this._moveRightKeys, this._moveKeyTimestamps),
          r = $e(this._moveUpKeys, this._moveKeyTimestamps),
          s = $e(this._moveDownKeys, this._moveKeyTimestamps),
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
              ((r.type = v.Start), (r.x = n.x), (r.y = n.y), (r.srcEvent = t), this._start(r));
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
          ((n.type = v.End),
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
          tr.forEach((a, l) => {
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
  var Ne = new Map(),
    Be = [],
    ot = [],
    at = [],
    lt = [],
    ct = [],
    dt = [],
    ut = [],
    ft = [];
  function dn() {
    (Ne.clear(),
      (Be.length = 0),
      (ot.length = 0),
      (at.length = 0),
      (lt.length = 0),
      (ct.length = 0),
      (dt.length = 0),
      (ut.length = 0),
      (ft.length = 0));
  }
  function un(e) {
    let t = [];
    dn();
    for (let n = 0; n < e.length; n++) {
      let r = e[n],
        s = r.parentElement;
      if (!s) throw new Error('Source element must have a parent element.');
      let i = r.getBoundingClientRect(),
        o = V(r),
        a = ie(r),
        l = a ? o.transformOrigin : '',
        u,
        c;
      if (r instanceof SVGSVGElement) ((u = `${i.width}px`), (c = `${i.height}px`));
      else {
        let y = parseFloat(o.width),
          S = parseFloat(o.height);
        if (!(y >= 0) || !(S >= 0)) ((u = `${i.width}px`), (c = `${i.height}px`));
        else if (o.boxSizing === 'border-box') ((u = o.width), (c = o.height));
        else {
          let _ = parseFloat(o.paddingLeft) || 0,
            O = parseFloat(o.paddingRight) || 0,
            R = parseFloat(o.borderLeftWidth) || 0,
            T = parseFloat(o.borderRightWidth) || 0,
            G = parseFloat(o.paddingTop) || 0,
            m = parseFloat(o.paddingBottom) || 0,
            b = parseFloat(o.borderTopWidth) || 0,
            Y = parseFloat(o.borderBottomWidth) || 0;
          ((u = `${y + _ + O + R + T}px`), (c = `${S + G + m + b + Y}px`));
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
        (ot[n] = i),
        (at[n] = a),
        (lt[n] = l),
        (ct[n] = u),
        (dt[n] = c),
        Ne.has(s) || Ne.set(s, Se(s)));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Be[n],
        s = t[n],
        i = at[n],
        o = lt[n],
        a = ct[n],
        l = dt[n],
        u = s.style;
      ((u.width = a),
        (u.height = l),
        i && ((u.transform = i), o && (u.transformOrigin = o)),
        r.appendChild(s));
    }
    for (let n = 0; n < e.length; n++) {
      let r = Be[n],
        s = t[n],
        i = ot[n],
        o = Ne.get(r),
        a = 0,
        l = 0,
        u = o.m11,
        c = o.m12,
        h = o.m21,
        g = o.m22,
        y = u * g - c * h,
        S = s.getBoundingClientRect(),
        _ = i.left - S.left,
        O = i.top - S.top;
      if (Math.abs(y) < 1e-10) ((a = _), (l = O));
      else {
        let R = 1 / y;
        ((a = (g * _ - h * O) * R), (l = (-c * _ + u * O) * R));
      }
      ((ut[n] = a), (ft[n] = l));
    }
    for (let n = 0; n < e.length; n++) {
      let r = t[n].style,
        s = ut[n],
        i = ft[n];
      ((r.left = `${s}px`), (r.top = `${i}px`));
    }
    return (dn(), t);
  }
  function fn(e, t) {
    if (ce) return () => null;
    let n = D(() => (Array.isArray(e) ? $t(e) : (H(e) ?? [])).filter((m) => !!m)),
      r = D(() => H(t)),
      s = D(() => r()?.id),
      i = D(() => r()?.dndObserver),
      o = D(() => {
        let m = r();
        if (!m) return;
        let {
          dndObserver: b,
          id: Y,
          dragPreviewContainer: Ce,
          dragPreviewExitTimeout: P,
          ...X
        } = m;
        return X;
      }),
      a = sn(),
      l = D(() => {
        let m = i();
        return m === void 0 ? a() : m;
      }),
      [u, c] = L(null),
      h = null,
      g = s(),
      y = o(),
      S = l(),
      _ = o(),
      O = r()?.dragPreviewContainer,
      R = r()?.dragPreviewExitTimeout;
    A(() => {
      let m = r();
      ((_ = o()), (O = m?.dragPreviewContainer), (R = m?.dragPreviewExitTimeout));
    });
    let T = () => {
        h && (h.destroy(), (h = null), (y = void 0), c(null));
      },
      G = () => {
        Dt(() => {
          T();
          let m = K(n);
          if (!m.length) return;
          let b = K(o),
            Y = s(),
            Ce = b?.dragPreview,
            P = new it(m, {
              id: Y,
              ...b,
              elements(F) {
                let ht = _,
                  de = (ht?.elements || (() => null))(F);
                if (!ht?.dragPreview || !de || de.length === 0) return de;
                let ue = un(de);
                ye.add(F.draggable, de, ue);
                let gt = () => {
                    let mt = R || 0;
                    if (mt > 0) {
                      for (let He of ue) He.dataset.exiting = 'true';
                      let Oe = !1,
                        pt = () => {
                          Oe ||
                            ((Oe = !0),
                            clearTimeout(bn),
                            ye.remove(F.draggable),
                            setTimeout(() => {
                              for (let He of ue) He.remove();
                            }, 0));
                        },
                        bn = setTimeout(pt, mt);
                      ye.startExiting(F.draggable, pt);
                    } else
                      (ye.remove(F.draggable),
                        setTimeout(() => {
                          for (let Oe of ue) Oe.remove();
                        }, 0));
                    (F.draggable.off('end', vn), F.draggable.off('destroy', _n));
                  },
                  vn = F.draggable.on('end', gt),
                  _n = F.draggable.on('destroy', gt);
                return ue;
              },
              ...(Ce
                ? {
                    container: () => {
                      let F = O;
                      return (typeof F == 'function' ? F() : F) || document.body;
                    },
                  }
                : {}),
            }),
            X = K(l);
          (X?.addDraggables([P]), (h = P), (g = Y), (y = b), (S = X), c(P));
        });
      };
    return (
      A(() => {
        let m = n();
        if (!m.length) {
          T();
          return;
        }
        let b = h;
        if (!b) {
          G();
          return;
        }
        (m.length !== b.sensors.length || m.some((Y) => !b.sensors.includes(Y))) && G();
      }),
      A(() => {
        if (!h) return;
        let b = s();
        g !== b && G();
      }),
      A(() => {
        let m = l();
        if (S === m) return;
        let b = h;
        (b && (S?.removeDraggables([b]), m?.addDraggables([b])), (S = m));
      }),
      A(() => {
        let m = h;
        if (!m) return;
        let b = o(),
          Y = !1;
        if (y) {
          let P = { ...y },
            X = { ...b };
          ((P.elements === X.elements || (P.dragPreview && X.dragPreview)) &&
            (delete P.elements, delete X.elements),
            (Y = !Ke(P, X)));
        } else Y = !0;
        if (!Y) return;
        let Ce = m._parseSettings(b);
        if (
          (m.updateSettings({
            ...Ce,
            ...(!b?.dragPreview && b?.elements ? { elements: b.elements } : {}),
            ...(b?.dragPreview
              ? {
                  container: () => {
                    let P = O;
                    return (typeof P == 'function' ? P() : P) || document.body;
                  },
                }
              : {}),
          }),
          y)
        ) {
          let P = b?.dndGroups !== y.dndGroups,
            X = b?.computeClientRect !== y.computeClientRect;
          (P && S?.clearTargets(m), (P || X) && S?.detectCollisions(m));
        }
        y = b;
      }),
      N(T),
      u
    );
  }
  function hn(e, t = !1) {
    let n = D(() => H(e)),
      [r, s] = L(null),
      [i, o] = L(0);
    return (
      A(() => {
        let a = n();
        if ((s(a?.drag || null), !a)) return;
        let l = a.on(I.Start, () => {
            s(a.drag || null);
          }),
          u = null;
        t &&
          (u = a.on(I.Move, () => {
            a.drag && o((h) => (h + 1) % Number.MAX_SAFE_INTEGER);
          }));
        let c = a.on(I.End, () => {
          s(null);
        });
        N(() => {
          (a.off(I.Start, l), u && a.off(I.Move, u), a.off(I.End, c));
        });
      }),
      D(() => (i(), r()))
    );
  }
  function gn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = D(() => H(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : H(t))),
      [s, i] = L(null),
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
        let h = new cn(c, n());
        ((o = h), i(h));
      };
    (A(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      A(() => {
        let c = r();
        c !== void 0 && (l(c), N(a));
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
    return (N(a), [s, u]);
  }
  function mn(e = {}, t) {
    if (ce) return [() => null, () => {}];
    let n = D(() => H(e, {}) || {}),
      r = D(() => (t === void 0 ? void 0 : H(t))),
      [s, i] = L(null),
      o = null,
      a = () => {
        o && (o.destroy(), (o = null), i(null));
      },
      l = (c) => {
        o?.destroy();
        let h = new _e(c, n());
        ((o = h), i(h));
      };
    (A(() => {
      let c = o;
      c && c.updateSettings(n());
    }),
      A(() => {
        let c = r();
        if (c !== void 0) {
          if (c === null) {
            a();
            return;
          }
          (l(c), N(a));
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
    return (N(a), [s, u]);
  }
  var nr = It('<div tabindex=0><svg xmlns=http://www.w3.org/2000/svg><path>');
  function pn(e) {
    let t = null,
      [n, r] = L(1),
      [s, i] = mn(),
      [o, a] = gn(),
      u = fn([s, o], {
        elements: () => (t ? [t] : []),
        positionModifiers: [(_) => (e.axis === 'x' ? (_.y = 0) : (_.x = 0), _)],
        onStart: () => {
          r(e.nextZIndex());
        },
      }),
      c = hn(u),
      h = (_) => {
        ((t = _), i(_), a(_));
      },
      g = e.axis === 'x' ? 'axis-x' : 'axis-y',
      y =
        e.axis === 'x'
          ? 'M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z'
          : 'M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z',
      S = e.axis === 'x' ? '0 0 512 512' : '0 0 320 512';
    return (() => {
      var _ = nr(),
        O = _.firstChild,
        R = O.firstChild;
      return (
        Kt(h, _),
        Ue(O, 'viewBox', S),
        Ue(R, 'd', y),
        te(
          (T) => {
            var G = `card draggable ${g} ${c() ? 'dragging' : ''}`,
              m = n();
            return (G !== T.e && Rt(_, (T.e = G)), m !== T.t && Ft(_, 'z-index', (T.t = m)), T);
          },
          { e: void 0, t: void 0 },
        ),
        _
      );
    })();
  }
  function rr() {
    let e = 1,
      t = () => ++e;
    return [pe(pn, { axis: 'x', nextZIndex: t }), pe(pn, { axis: 'y', nextZIndex: t })];
  }
  var yn = document.getElementById('root');
  if (!yn) throw new Error('Failed to find the root element');
  Lt(() => pe(rr, {}), yn);
})();
