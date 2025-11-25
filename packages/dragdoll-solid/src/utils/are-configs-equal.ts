const hasOwnProperty = Object.prototype.hasOwnProperty;

const isPlainObject = (v: any): v is Record<string, unknown> => {
  if (v === null || typeof v !== 'object') return false;
  const p = Object.getPrototypeOf(v);
  return p === Object.prototype || p === null;
};

export function areConfigsEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const aArr = Array.isArray(a);
  const bArr = Array.isArray(b);
  if (aArr || bArr) {
    if (!aArr || !bArr) return false;
    const len = a.length;
    if (len !== b.length) return false;
    for (let i = 0; i < len; i++) {
      if (!areConfigsEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aSet = a instanceof Set;
  const bSet = b instanceof Set;
  if (aSet || bSet) {
    if (!aSet || !bSet) return false;
    if (a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) return false;
    }
    return true;
  }

  if (!isPlainObject(a) || !isPlainObject(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const k = keysA[i];
    if (!hasOwnProperty.call(b, k)) return false;
    if (!areConfigsEqual(a[k], b[k])) return false;
  }

  return true;
}
