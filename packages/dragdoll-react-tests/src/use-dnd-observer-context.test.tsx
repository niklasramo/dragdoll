import { DndObserver } from 'dragdoll/dnd-observer';
import { DndObserverContext, useDndObserverContext } from 'dragdoll-react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

describe('useDndObserverContext', () => {
  const cleanups: (() => void)[] = [];

  afterEach(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  it('should return null when no provider', async () => {
    const { result } = await renderHook(() => useDndObserverContext());
    expect(result.current).toBe(null);
  });

  it('should return the provided DndObserver', async () => {
    const observer = new DndObserver();
    cleanups.push(() => observer.destroy());

    const { result } = await renderHook(() => useDndObserverContext(), {
      wrapper: ({ children }) => (
        <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>
      ),
    });

    expect(result.current).toBe(observer);
  });

  it('should use inner provider in nested context', async () => {
    const outer = new DndObserver();
    const inner = new DndObserver();
    cleanups.push(() => {
      outer.destroy();
      inner.destroy();
    });

    const { result } = await renderHook(() => useDndObserverContext(), {
      wrapper: ({ children }) => (
        <DndObserverContext.Provider value={outer}>
          <DndObserverContext.Provider value={inner}>{children}</DndObserverContext.Provider>
        </DndObserverContext.Provider>
      ),
    });

    expect(result.current).toBe(inner);
  });
});
