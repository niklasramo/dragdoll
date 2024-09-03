export function areMatricesEqual(m1: DOMMatrix, m2: DOMMatrix) {
  if (m1.isIdentity && m2.isIdentity) return true;

  if (m1.is2D && m2.is2D) {
    return (
      m1.a === m2.a &&
      m1.b === m2.b &&
      m1.c === m2.c &&
      m1.d === m2.d &&
      m1.e === m2.e &&
      m1.f === m2.f
    );
  }

  return (
    m1.m11 === m2.m11 &&
    m1.m12 === m2.m12 &&
    m1.m13 === m2.m13 &&
    m1.m14 === m2.m14 &&
    m1.m21 === m2.m21 &&
    m1.m22 === m2.m22 &&
    m1.m23 === m2.m23 &&
    m1.m24 === m2.m24 &&
    m1.m31 === m2.m31 &&
    m1.m32 === m2.m32 &&
    m1.m33 === m2.m33 &&
    m1.m34 === m2.m34 &&
    m1.m41 === m2.m41 &&
    m1.m42 === m2.m42 &&
    m1.m43 === m2.m43 &&
    m1.m44 === m2.m44
  );
}
