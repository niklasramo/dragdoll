import { Point } from 'types.js';
import { getClientOffset } from './get-client-offset.js';
import { isPoint } from './is-point.js';

const OFFSET_A = { x: 0, y: 0 };
const OFFSET_B = { x: 0, y: 0 };

/**
 * Calculate the offset difference two elements.
 */
export function getOffsetDiff(
  elemA: HTMLElement | SVGSVGElement | Window | Document | Point,
  elemB: HTMLElement | SVGSVGElement | Window | Document | Point,
  result: Point = { x: 0, y: 0 },
) {
  const offsetA = isPoint(elemA) ? elemA : getClientOffset(elemA, OFFSET_A);
  const offsetB = isPoint(elemB) ? elemB : getClientOffset(elemB, OFFSET_B);
  result.x = offsetB.x - offsetA.x;
  result.y = offsetB.y - offsetA.y;
  return result;
}
