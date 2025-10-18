import type { FrameCallback, Phase } from 'tikki';
import { AutoTicker, createRequestFrame } from 'tikki';

export const tickerPhases = {
  read: Symbol(),
  write: Symbol(),
};

export let ticker = new AutoTicker<Phase>({
  phases: [tickerPhases.read, tickerPhases.write],
  // Let's do a no-op request frame for non-browser environments.
  requestFrame: typeof window !== 'undefined' ? createRequestFrame() : () => () => {},
});

export function setTicker(
  newTicker: AutoTicker<Phase, FrameCallback>,
  phases: typeof tickerPhases,
) {
  ticker = newTicker;
  Object.assign(tickerPhases, phases);
}
