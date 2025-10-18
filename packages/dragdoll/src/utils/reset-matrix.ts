const RESET_TRANSFORM = 'scale(1, 1)';

export function resetMatrix(m: DOMMatrix) {
  return m.setMatrixValue(RESET_TRANSFORM);
}
