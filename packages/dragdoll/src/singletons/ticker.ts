import type { FrameCallback, Phase } from 'tikki';
import { AutoTicker } from 'tikki';

export const tickerPhases = {
  read: Symbol(),
  write: Symbol(),
};

export let ticker = new AutoTicker<Phase>({
  phases: [tickerPhases.read, tickerPhases.write],
});

export function setTicker(
  newTicker: AutoTicker<Phase, FrameCallback>,
  phases: typeof tickerPhases,
) {
  ticker = newTicker;
  Object.assign(tickerPhases, phases);
}
