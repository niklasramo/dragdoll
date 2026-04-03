const IDENTITY_2D = 'scale(1)';

export function resetMatrix(m: DOMMatrix) {
  return m.setMatrixValue(IDENTITY_2D);
}
