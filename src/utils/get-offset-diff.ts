import { getOffset } from 'mezr';

/**
 * Calculate the offset difference two elements.
 */
export function getOffsetDiff(
  elemA: Element | Window | Document,
  elemB: Element | Window | Document,
  result: { left: number; top: number } = { left: 0, top: 0 },
) {
  result.left = 0;
  result.top = 0;

  // If elements are same let's return early.
  if (elemA === elemB) return result;

  // Finally, let's calculate the offset diff.
  const offsetA = getOffset([elemA, 'padding']);
  const offsetB = getOffset([elemB, 'padding']);
  result.left = offsetB.left - offsetA.left;
  result.top = offsetB.top - offsetA.top;

  return result;
}
