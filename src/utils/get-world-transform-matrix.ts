import { getStyle } from './get-style.js';

const ELEMENT_MATRIX = new DOMMatrix();
const ORIGIN_MATRIX = new DOMMatrix();

function parseTransformOrigin(transformOrigin: string): { x: number; y: number; z: number } {
  const values = transformOrigin.split(' ');
  let originX = '';
  let originY = '';
  let originZ = '';

  if (values.length === 1) {
    originX = originY = values[0];
  } else if (values.length === 2) {
    [originX, originY] = values;
  } else {
    [originX, originY, originZ] = values;
  }

  return {
    x: parseFloat(originX) || 0,
    y: parseFloat(originY) || 0,
    z: parseFloat(originZ) || 0,
  };
}

export function getWorldTransformMatrix(
  el: HTMLElement | SVGSVGElement,
  result = new DOMMatrix(),
): DOMMatrix {
  let currentElement: HTMLElement | SVGSVGElement | null = el;

  // Reset the result matrix to identity.
  result.setMatrixValue('');

  while (currentElement) {
    const { transform, transformOrigin } = getStyle(currentElement);
    if (transform && transform !== 'none') {
      ELEMENT_MATRIX.setMatrixValue(transform);
      if (!ELEMENT_MATRIX.isIdentity) {
        result.preMultiplySelf(ELEMENT_MATRIX);
        const { x, y, z } = parseTransformOrigin(transformOrigin);
        ORIGIN_MATRIX.setMatrixValue('').translateSelf(x, y, z);
        if (!ORIGIN_MATRIX.isIdentity) {
          result.preMultiplySelf(ORIGIN_MATRIX);
        }
      }
    }
    currentElement = currentElement.parentElement;
  }

  return result;
}
