import { getStyle } from './get-style.js';
import { parseTransformOrigin } from './parse-transform-origin.js';
import { resetMatrix } from './reset-matrix.js';

const MATRIX = new DOMMatrix();

export function getWorldTransformMatrix(
  el: HTMLElement | SVGSVGElement,
  result = new DOMMatrix(),
): DOMMatrix {
  let currentElement: HTMLElement | SVGSVGElement | null = el;

  // Reset the result matrix to identity.
  resetMatrix(result);

  while (currentElement) {
    const { transform, transformOrigin } = getStyle(currentElement);
    if (transform && transform !== 'none') {
      MATRIX.setMatrixValue(transform);
      if (!MATRIX.isIdentity) {
        const { x, y, z } = parseTransformOrigin(transformOrigin);
        if (z === 0) {
          MATRIX.setMatrixValue(
            `translate(${x}px, ${y}px) ${MATRIX} translate(${x * -1}px, ${y * -1}px)`,
          );
        } else {
          MATRIX.setMatrixValue(
            `translate3d(${x}px, ${y}px, ${z}px) ${MATRIX} translate3d(${x * -1}px, ${y * -1}px, ${z * -1}px)`,
          );
        }
        result.preMultiplySelf(MATRIX);
      }
    }
    currentElement = currentElement.parentElement;
  }

  return result;
}