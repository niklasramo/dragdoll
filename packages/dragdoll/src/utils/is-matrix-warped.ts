// The naming is a bit misleading here, but this function in essence checks if a
// matrix contains any transformation other than a 2d translation.
export function isMatrixWarped(m: DOMMatrix) {
  return (
    m.m11 !== 1 ||
    m.m12 !== 0 ||
    m.m13 !== 0 ||
    m.m14 !== 0 ||
    m.m21 !== 0 ||
    m.m22 !== 1 ||
    m.m23 !== 0 ||
    m.m24 !== 0 ||
    m.m31 !== 0 ||
    m.m32 !== 0 ||
    m.m33 !== 1 ||
    m.m34 !== 0 ||
    m.m43 !== 0 ||
    m.m44 !== 1
  );
}
