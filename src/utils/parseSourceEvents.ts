import { HAS_POINTER_EVENTS, HAS_TOUCH_EVENTS } from '../constants';

export function parseSourceEvents(
  sourceEvents: 'pointer' | 'touch' | 'mouse' | 'auto' | undefined
): 'pointer' | 'touch' | 'mouse' {
  return sourceEvents === 'auto' || sourceEvents === undefined
    ? HAS_POINTER_EVENTS
      ? 'pointer'
      : HAS_TOUCH_EVENTS
      ? 'touch'
      : 'mouse'
    : sourceEvents;
}
