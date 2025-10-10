import * as eventti0 from "eventti";
import * as tikki0 from "tikki";
import { AutoTicker, FrameCallback, Phase } from "tikki";

//#region src/singletons/ticker.d.ts
declare const tickerPhases: {
  read: symbol;
  write: symbol;
};
declare let ticker: AutoTicker<eventti0.EventName, tikki0.AutoTickerDefaultFrameCallback>;
declare function setTicker(newTicker: AutoTicker<Phase, FrameCallback>, phases: typeof tickerPhases): void;
//#endregion
export { setTicker, ticker, tickerPhases };
//# sourceMappingURL=ticker.d.ts.map