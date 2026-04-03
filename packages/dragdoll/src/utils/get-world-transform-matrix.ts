import { IS_BROWSER } from '../constants.js';
import { getElementTransformString } from './get-element-transform-string.js';
import { getStyle } from './get-style.js';
import { parseTransformOrigin } from './parse-transform-origin.js';
import { resetMatrix } from './reset-matrix.js';

const MATRIX = IS_BROWSER ? new DOMMatrix() : null;
const ORIGIN_MATRIX = IS_BROWSER ? new DOMMatrix() : null;
const ORIGIN: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

export function getWorldTransformMatrix(
  el: HTMLElement | SVGSVGElement,
  result = new DOMMatrix(),
): DOMMatrix {
  let currentElement: HTMLElement | SVGSVGElement | null = el;

  // Reset the result matrix to identity.
  resetMatrix(result);

  while (currentElement) {
    const transformString = getElementTransformString(currentElement);
    if (transformString) {
      MATRIX!.setMatrixValue(transformString);
      if (!MATRIX!.isIdentity) {
        const { transformOrigin } = getStyle(currentElement);
        parseTransformOrigin(transformOrigin, ORIGIN);
        const { x, y, z } = ORIGIN;

        // Apply transform-origin: T(origin) * M * T(-origin)
        if (z === 0) {
          MATRIX!.translateSelf(-x, -y);
          resetMatrix(ORIGIN_MATRIX!).translateSelf(x, y);
        } else {
          MATRIX!.translateSelf(-x, -y, -z);
          resetMatrix(ORIGIN_MATRIX!).translateSelf(x, y, z);
        }
        MATRIX!.preMultiplySelf(ORIGIN_MATRIX!);

        result.preMultiplySelf(MATRIX!);
      }
    }
    currentElement = currentElement.parentElement;
  }

  return result;
}
