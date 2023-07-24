import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { ListenerOptions } from '../types.js';

export function parseListenerOptions(options: ListenerOptions = {}): ListenerOptions {
  const { capture = true, passive = true } = options;
  if (HAS_PASSIVE_EVENTS) {
    return { capture, passive };
  } else {
    return { capture };
  }
}
