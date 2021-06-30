export type EmitterEvent = string;

export type EmitterListener = Function;

export class Emitter {
  protected _events: { [event: string]: EmitterListener[] } | null;
  protected _queue: EmitterListener[];
  protected _counter: number;

  constructor() {
    this._events = {};
    this._queue = [];
    this._counter = 0;
  }

  on(event: EmitterEvent, listener: EmitterListener): void {
    if (!this._events) return;

    // Get listeners queue and create it if it does not exist.
    const listeners = this._events[event] || [];
    this._events[event] = listeners;

    // Add the listener to the queue.
    listeners.push(listener);
  }

  off(event: EmitterEvent, listener: EmitterListener): void {
    if (!this._events) return;

    // Get listeners and return immediately if none is found.
    const listeners = this._events[event];
    if (!listeners || !listeners.length) return;

    // Remove all matching listeners.
    let index = 0;
    while ((index = listeners.indexOf(listener)) !== -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event: EmitterEvent, ...args: any[]): void {
    if (!this._events) return;

    // Get event listeners and quit early if there's no listeners.
    const listeners = this._events[event];
    if (!listeners || !listeners.length) return;

    const queue = this._queue;
    const startIndex = queue.length;

    // Add the current listeners to the callback queue before we process them.
    // This is necessary to guarantee that all of the listeners are called in
    // correct order even if new event listeners are removed/added during
    // processing and/or events are emitted during processing.
    queue.push(...listeners);

    // Increment queue counter. This is needed for the scenarios where emit is
    // triggered while the queue is already processing. We need to keep track of
    // how many "queue processors" there are active so that we can safely reset
    // the queue in the end when the last queue processor is finished.
    ++this._counter;

    // Process the queue (the specific part of it for this emit).
    let i = startIndex;
    const endIndex = queue.length;
    for (; i < endIndex; i++) {
      queue[i](...args);
      // Stop processing if the emitter is destroyed.
      if (!this._events) return;
    }

    // Decrement queue process counter.
    --this._counter;

    // Reset the queue if there are no more queue processes running.
    if (!this._counter) queue.length = 0;
  }

  destroy(): void {
    if (!this._events) return;
    this._queue.length = this._counter = 0;
    this._events = null;
  }
}
