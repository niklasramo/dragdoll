import { Point } from 'types.js';

export function isPoint(value: any): value is Point {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}
