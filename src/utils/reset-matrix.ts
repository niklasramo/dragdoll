const RESET_TRANSFORM = 'scale(1, 1)';

export function resetMatrix(m: DOMMatrix | null) {
  if (!m) {
    return;
  }

  return m.setMatrixValue(RESET_TRANSFORM);
}
