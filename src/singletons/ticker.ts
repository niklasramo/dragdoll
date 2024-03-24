import { AutoTicker, Phase, FrameCallback } from 'tikki';

export let tickerReadPhase: Phase = Symbol();

export let tickerWritePhase: Phase = Symbol();

export let ticker = new AutoTicker<Phase>({ phases: [tickerReadPhase, tickerWritePhase] });

export function setTicker(
  newTicker: AutoTicker<Phase, FrameCallback>,
  readPhase: Phase,
  writePhase: Phase,
) {
  tickerReadPhase = readPhase;
  tickerWritePhase = writePhase;
  ticker = newTicker;
}
