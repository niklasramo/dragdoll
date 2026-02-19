import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import { DndObserverContext, useDndObserverCallback } from 'dragdoll-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

function emitObserverEvent(observer: DndObserver, type: string, ...args: any[]) {
  (observer as any)._emitter.emit(type, ...args);
}

describe('useDndObserverCallback', () => {
  const cleanups: (() => void)[] = [];

  afterEach(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  it('should subscribe with explicit observer', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    const onStart = vi.fn();
    await renderHook(() =>
      useDndObserverCallback(DndObserverEventType.Start, onStart as any, observer),
    );

    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should subscribe with observer from context', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    const onStart = vi.fn();
    await renderHook(() => useDndObserverCallback(DndObserverEventType.Start, onStart as any), {
      wrapper: ({ children }) => (
        <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>
      ),
    });

    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should prefer explicit observer over context', async () => {
    const contextObserver = new DndObserver();
    const explicitObserver = new DndObserver();
    cleanups.push(() => {
      contextObserver.destroy();
      explicitObserver.destroy();
    });

    const onStart = vi.fn();
    await renderHook(
      () => useDndObserverCallback(DndObserverEventType.Start, onStart as any, explicitObserver),
      {
        wrapper: ({ children }) => (
          <DndObserverContext.Provider value={contextObserver}>
            {children}
          </DndObserverContext.Provider>
        ),
      },
    );

    // Emit on context observer — should NOT fire.
    emitObserverEvent(contextObserver, DndObserverEventType.Start, {});
    expect(onStart).not.toHaveBeenCalled();

    // Emit on explicit observer — should fire.
    emitObserverEvent(explicitObserver, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('should not subscribe when callback is undefined', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    await renderHook(() => useDndObserverCallback(DndObserverEventType.Start, undefined, observer));

    expect(() => {
      emitObserverEvent(observer, DndObserverEventType.Start, {});
    }).not.toThrow();
  });

  it('should unsubscribe on unmount', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    const onStart = vi.fn();
    const { unmount } = await renderHook(() =>
      useDndObserverCallback(DndObserverEventType.Start, onStart as any, observer),
    );

    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).toHaveBeenCalledTimes(1);

    unmount();
    onStart.mockClear();

    emitObserverEvent(observer, DndObserverEventType.Start, {});
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should use latest callback via ref pattern', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    const cb1 = vi.fn();
    const cb2 = vi.fn();

    const { rerender } = await renderHook(
      ({ cb }) => useDndObserverCallback(DndObserverEventType.Start, cb as any, observer),
      { initialProps: { cb: cb1 } },
    );

    await rerender({ cb: cb2 });
    emitObserverEvent(observer, DndObserverEventType.Start, {});

    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledTimes(1);
  });
});
