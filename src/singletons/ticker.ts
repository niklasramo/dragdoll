import { AutoTicker, Phase, FrameCallback } from 'tikki';

export const tickerPhases = {
  preRead: Symbol(),
  preWrite: Symbol(),
  read: Symbol(),
  write: Symbol(),
};

export let ticker = new AutoTicker<Phase>({
  phases: [tickerPhases.preRead, tickerPhases.preWrite, tickerPhases.read, tickerPhases.write],
});

export function setTicker(
  newTicker: AutoTicker<Phase, FrameCallback>,
  phases: typeof tickerPhases,
) {
  ticker = newTicker;
  Object.assign(tickerPhases, phases);
}
