import { Ticker, FrameCallback } from 'tikki';
import { EventName } from 'eventti';

export let tickerReadPhase: EventName = Symbol();

export let tickerWritePhase: EventName = Symbol();

export let ticker = new Ticker<EventName>({ phases: [tickerReadPhase, tickerWritePhase] });

export function setTicker(
  newTicker: Ticker<EventName, FrameCallback>,
  readPhase: EventName,
  writePhase: EventName
) {
  tickerReadPhase = readPhase;
  tickerWritePhase = writePhase;
  ticker = newTicker;
}
