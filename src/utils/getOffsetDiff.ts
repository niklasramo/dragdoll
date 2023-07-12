import { getOffset } from './getOffset';

const offsetA = { left: 0, top: 0 };
const offsetB = { left: 0, top: 0 };

/**
 * Calculate the offset difference two elements.
 */
export function getOffsetDiff(
  elemA: Element | Document,
  elemB: Element | Document,
  result: { left: number; top: number } = { left: 0, top: 0 },
) {
  result.left = 0;
  result.top = 0;

  // If elements are same let's return early.
  if (elemA === elemB) return result;

  // Finally, let's calculate the offset diff.
  getOffset(elemA, offsetA);
  getOffset(elemB, offsetB);
  result.left = offsetB.left - offsetA.left;
  result.top = offsetB.top - offsetA.top;

  return result;
}
