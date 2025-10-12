const e=new WeakMap;function t(t){let n=e.get(t)?.deref();return n||(n=window.getComputedStyle(t,null),e.set(t,new WeakRef(n))),n}export{t as getStyle};
//# sourceMappingURL=get-style-e3zfxW9-.js.map