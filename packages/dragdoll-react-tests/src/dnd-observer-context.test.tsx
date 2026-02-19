import { DndObserver } from 'dragdoll/dnd-observer';
import { DndObserverContext } from 'dragdoll-react';
import { useContext } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from 'vitest-browser-react';

describe('DndObserverContext', () => {
  const observers: DndObserver[] = [];

  afterEach(() => {
    observers.forEach((o) => o.destroy());
    observers.length = 0;
  });

  it('should have null as default value', async () => {
    const { result } = await renderHook(() => useContext(DndObserverContext));
    expect(result.current).toBe(null);
  });

  it('should provide a DndObserver instance', async () => {
    const observer = new DndObserver();
    observers.push(observer);

    const { result } = await renderHook(() => useContext(DndObserverContext), {
      wrapper: ({ children }) => (
        <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>
      ),
    });

    expect(result.current).toBe(observer);
  });

  it('should allow nested providers where inner overrides outer', async () => {
    const outerObserver = new DndObserver();
    const innerObserver = new DndObserver();
    observers.push(outerObserver, innerObserver);

    const { result } = await renderHook(() => useContext(DndObserverContext), {
      wrapper: ({ children }) => (
        <DndObserverContext.Provider value={outerObserver}>
          <DndObserverContext.Provider value={innerObserver}>
            {children}
          </DndObserverContext.Provider>
        </DndObserverContext.Provider>
      ),
    });

    expect(result.current).toBe(innerObserver);
  });
});
