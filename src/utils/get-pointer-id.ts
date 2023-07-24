export function getPointerId(e: PointerEvent | TouchEvent | MouseEvent) {
  // If we have pointer id available let's use it.
  if ('pointerId' in e) return e.pointerId;
  // For touch events let's get the first changed touch's identifier.
  if ('changedTouches' in e) return e.changedTouches[0] ? e.changedTouches[0].identifier : null;
  // For mouse/other events let's provide a static id. And let's make it a
  // negative number so it has it has not chance of clashing with touch/pointer
  // ids.
  return -1;
}
