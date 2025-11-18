const hasOwnProperty = Object.prototype.hasOwnProperty;

const isPlainObject = (v: any): v is Record<string, unknown> => {
  if (v === null || typeof v !== 'object') return false;
  const p = Object.getPrototypeOf(v);
  return p === Object.prototype || p === null;
};

// This is a tailor-made deep equal function for comparing config objects
// in DragDoll's context. it should cover all the cases of options objects
// used in DragDoll.
export function areConfigsEqual(a: any, b: any): boolean {
  // Primitives / NaN / ±0.
  if (Object.is(a, b)) return true;

  // Must both be non-null objects from here on.
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  // Handle arrays. There are nested arrays in some DragDoll options so  we
  // need to handle them deeply.
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

  // Handle Sets. We only do shallow comparison of sets as we have only
  // primitive values in sets in DragDoll options. Note that the only option
  // which can be set is the Draggable's dndGroups and Droppable's accept. In
  // both of those cases it does not matter in which order the values are in the
  // set so we can use the isSubsetOf method to check for equality.
  const aSet = a instanceof Set;
  const bSet = b instanceof Set;
  if (aSet || bSet) {
    if (!aSet || !bSet) return false;
    if (a.size !== b.size) return false;
    return a.isSubsetOf(b);
  }

  // Plain objects only from this point on, which we have to also handle deeply.
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
