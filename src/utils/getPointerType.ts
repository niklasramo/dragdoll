import { PointerType } from '../types';

export function getPointerType(e: PointerEvent | TouchEvent | MouseEvent): PointerType {
  return 'pointerType' in e ? (e.pointerType as PointerType) : 'touches' in e ? 'touch' : 'mouse';
}
