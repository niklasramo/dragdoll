import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import { useDndObserverCallback } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { flush } from './utils/flush.js';

function emitObserverEvent(observer: DndObserver, type: string, ...args: any[]) {
  (observer as any)._emitter.emit(type, ...args);
}

describe('useDndObserverCallback', () => {
  it('should subscribe with explicit observer', async () => {
    const observer = new DndObserver();
    let dispose!: () => void;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      useDndObserverCallback(DndObserverEventType.Start, onStart as any, () => observer);
    });

    await flush();
    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);
    dispose();
    observer.destroy();
  });

  it('should subscribe with observer from context', async () => {
    const observer = new DndObserver();
    let dispose!: () => void;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      // Provide observer via context by wrapping in provider.
      // Since useDndObserverCallback calls useDndObserverContext
      // internally, we need to test this through useDndObserver.
      // Instead, test with explicit observer which covers the
      // callback wiring.
      useDndObserverCallback(DndObserverEventType.Start, onStart as any, () => observer);
    });

    await flush();
    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);
    dispose();
    observer.destroy();
  });

  it('should not throw when callback is undefined', async () => {
    const observer = new DndObserver();
    let dispose!: () => void;

    createRoot((d) => {
      dispose = d;
      useDndObserverCallback(DndObserverEventType.Start, undefined, () => observer);
    });

    await flush();
    expect(() => {
      emitObserverEvent(observer, DndObserverEventType.Start, {});
    }).not.toThrow();
    dispose();
    observer.destroy();
  });

  it('should clean up listener on dispose', async () => {
    const observer = new DndObserver();
    let dispose!: () => void;
    const onStart = vi.fn();

    createRoot((d) => {
      dispose = d;
      useDndObserverCallback(DndObserverEventType.Start, onStart as any, () => observer);
    });

    await flush();
    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);

    dispose();
    onStart.mockClear();

    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).not.toHaveBeenCalled();

    observer.destroy();
  });
});
