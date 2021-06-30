export type TickId = string | number | object | Function | Symbol;

export type TickCallback = (time: number) => void;

export class Ticker {
  readonly queues: TickerQueue[];
  protected _rafId: number | null;
  protected _stepQueue: TickId[];
  protected _stepCallbacks: Map<TickId, TickCallback>;

  constructor() {
    this.queues = [];
    this._rafId = null;
    this._stepQueue = [];
    this._stepCallbacks = new Map();
    this._step = this._step.bind(this);
  }

  protected _step(time: number) {
    const { queues, _stepQueue, _stepCallbacks } = this;
    let i = 0;

    this._rafId = null;

    for (i = 0; i < queues.length; i++) {
      queues[i].extract(_stepQueue, _stepCallbacks);
    }

    for (i = 0; i < _stepQueue.length; i++) {
      (_stepCallbacks.get(_stepQueue[i]) as TickCallback)(time);
    }

    _stepQueue.length = 0;
    _stepCallbacks.clear();
  }

  requestStep() {
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(this._step);
    }
  }
}

export class TickerQueue {
  protected _queue: (TickId | undefined)[];
  protected _indices: Map<TickId, number>;
  protected _callbacks: Map<TickId, TickCallback>;
  protected _ticker: Ticker;

  constructor(ticker: Ticker) {
    this._queue = [];
    this._indices = new Map();
    this._callbacks = new Map();
    this._ticker = ticker;
    ticker.queues.push(this);
  }

  add(callback: TickCallback, id?: TickId) {
    if (id === undefined) {
      id = callback;
    }

    const { _queue, _indices, _callbacks, _ticker } = this;
    const index = _indices.get(id);

    if (index !== undefined) {
      _queue[index] = undefined;
    }

    _queue.push(id);
    _callbacks.set(id, callback);
    _indices.set(id, _queue.length - 1);

    _ticker.requestStep();
  }

  remove(id: TickId) {
    const { _queue, _indices, _callbacks } = this;
    const index = _indices.get(id);

    if (index === undefined) {
      return;
    }

    _queue[index] = undefined;
    _callbacks.delete(id);
    _indices.delete(id);
  }

  extract(targetQueue: TickId[], targetCallbacks: Map<TickId, TickCallback>) {
    const { _queue, _callbacks, _indices } = this;
    let id: TickId | undefined;

    let i = 0;
    for (; i < _queue.length; i++) {
      id = _queue[i];

      if (id === undefined || targetCallbacks.has(id)) {
        continue;
      }

      targetQueue.push(id);
      targetCallbacks.set(id, _callbacks.get(id) as TickCallback);
    }

    _queue.length = 0;
    _callbacks.clear();
    _indices.clear();
  }
}
