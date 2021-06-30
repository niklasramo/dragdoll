import { Ticker, TickerQueue } from '../Ticker';

export const ticker = new Ticker();

export const readQueue = new TickerQueue(ticker);

export const writeQueue = new TickerQueue(ticker);
