import * as tikki0 from "tikki";
import { AutoTicker, FrameCallback, Phase } from "tikki";
import * as eventti0 from "eventti";

//#region src/singletons/ticker.d.ts
declare const tickerPhases: {
  read: symbol;
  write: symbol;
};
declare let ticker: AutoTicker<eventti0.EventName, tikki0.AutoTickerDefaultFrameCallback>;
declare function setTicker(newTicker: AutoTicker<Phase, FrameCallback>, phases: typeof tickerPhases): void;
//#endregion
export { ticker as n, tickerPhases as r, setTicker as t };
//# sourceMappingURL=ticker-BfHXoQJo.d.ts.map