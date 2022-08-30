export function getPointerEventData(
  e: PointerEvent | TouchEvent | MouseEvent,
  id: number
): PointerEvent | MouseEvent | Touch | null {
  // If we have a pointer event return the whole event if there's a match, and
  // null otherwise.
  if ('pointerId' in e) {
    return e.pointerId === id ? e : null;
  }

  // For touch events let's check if there's a changed touch object that matches
  // the pointerId in which case return the touch object.
  if ('changedTouches' in e) {
    let i = 0;
    for (; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === id) {
        return e.changedTouches[i];
      }
    }
    return null;
  }

  // For mouse/other events let's assume there's only one pointer and just
  // return the event.
  return e;
}
