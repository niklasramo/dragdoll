import { ListenerOptions } from '../types.js';

export function parseListenerOptions(options: ListenerOptions = {}): ListenerOptions {
  const { capture = true, passive = true } = options;
  return { capture, passive };
}
