import { DndObserver } from 'dragdoll/dnd-observer';
import { Droppable } from 'dragdoll/droppable';
import { DndObserverContext, useDroppable } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

describe('useDroppable', () => {
  let testEl: HTMLElement;
  const cleanups: (() => void)[] = [];

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  describe('lifecycle', () => {
    it('should return [null, setRef] initially', async () => {
      const { result } = await renderHook(() => useDroppable());
      const [droppable, setRef] = result.current;
      expect(droppable).toBe(null);
      expect(typeof setRef).toBe('function');
    });

    it('should create droppable via ref callback', async () => {
      const { result, act } = await renderHook(() => useDroppable());

      await act(() => {
        result.current[1](testEl);
      });

      expect(result.current[0]).toBeInstanceOf(Droppable);
      expect(result.current[0]!.element).toBe(testEl);
    });

    it('should destroy droppable when ref is set to null', async () => {
      const { result, act } = await renderHook(() => useDroppable());

      await act(() => {
        result.current[1](testEl);
      });

      const droppable = result.current[0];

      await act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBe(null);
      expect(droppable!.isDestroyed).toBe(true);
    });

    it('should destroy droppable on unmount', async () => {
      const { result, act, unmount } = await renderHook(() => useDroppable());

      await act(() => {
        result.current[1](testEl);
      });

      const droppable = result.current[0];
      unmount();
      expect(droppable!.isDestroyed).toBe(true);
    });
  });

  describe('explicit element', () => {
    it('should create droppable with explicit element', async () => {
      const { result } = await renderHook(() => useDroppable({ element: testEl }));

      expect(result.current[0]).toBeInstanceOf(Droppable);
      expect(result.current[0]!.element).toBe(testEl);
    });

    it('should ignore ref callback when explicit element is provided', async () => {
      const el2 = createTestElement({ left: '200px' });
      cleanups.push(() => el2.remove());

      const { result, act } = await renderHook(() => useDroppable({ element: testEl }));

      const droppable = result.current[0];

      await act(() => {
        result.current[1](el2);
      });

      expect(result.current[0]).toBe(droppable);
      expect(result.current[0]!.element).toBe(testEl);
    });
  });

  describe('id', () => {
    it('should use provided id', async () => {
      const { result } = await renderHook(() => useDroppable({ id: 'drop-1', element: testEl }));

      expect(result.current[0]!.id).toBe('drop-1');
    });

    it('should recreate droppable when id changes', async () => {
      const { result, rerender } = await renderHook(
        ({ id }) => useDroppable({ id, element: testEl }),
        { initialProps: { id: 'drop-1' as string } },
      );

      const first = result.current[0]!;

      await rerender({ id: 'drop-2' });

      const second = result.current[0]!;
      expect(first.isDestroyed).toBe(true);
      expect(second.id).toBe('drop-2');
      expect(second).not.toBe(first);
    });
  });

  describe('DndObserver integration', () => {
    it('should add droppable to explicit observer', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result } = await renderHook(() =>
        useDroppable({ element: testEl, dndObserver: observer }),
      );

      expect(observer.droppables.has(result.current[0]!.id)).toBe(true);
    });

    it('should remove droppable from observer on unmount', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result, unmount } = await renderHook(() =>
        useDroppable({ element: testEl, dndObserver: observer }),
      );

      const id = result.current[0]!.id;
      unmount();
      expect(observer.droppables.has(id)).toBe(false);
    });

    it('should use DndObserverContext when no explicit observer', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result } = await renderHook(() => useDroppable({ element: testEl }), {
        wrapper: ({ children }) => (
          <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>
        ),
      });

      expect(observer.droppables.has(result.current[0]!.id)).toBe(true);
    });
  });

  describe('settings updates', () => {
    it('should update accept', async () => {
      const accept1 = new Set(['group1']);
      const accept2 = new Set(['group2']);

      const { result, rerender } = await renderHook(
        ({ accept }) => useDroppable({ element: testEl, accept }),
        { initialProps: { accept: accept1 as Set<string> } },
      );

      expect(result.current[0]!.accept).toBe(accept1);

      await rerender({ accept: accept2 });

      expect(result.current[0]!.accept).toBe(accept2);
    });

    it('should update data', async () => {
      const { result, rerender } = await renderHook(
        ({ data }) => useDroppable({ element: testEl, data }),
        { initialProps: { data: { key: 'value1' } } },
      );

      expect(result.current[0]!.data).toEqual({ key: 'value1' });

      await rerender({ data: { key: 'value2' } });

      expect(result.current[0]!.data).toEqual({ key: 'value2' });
    });
  });

  describe('settings side effects', () => {
    it('should call clearTargets when accept changes', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());
      const clearSpy = vi.spyOn(observer, 'clearTargets');

      const { rerender } = await renderHook(
        ({ accept }) => useDroppable({ element: testEl, dndObserver: observer, accept }),
        { initialProps: { accept: new Set(['group1']) as Set<string> } },
      );

      await rerender({ accept: new Set(['group2']) });

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should call updateClientRect and detectCollisions when computeClientRect changes', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());
      const detectSpy = vi.spyOn(observer, 'detectCollisions');

      const computeA = () => ({ left: 0, top: 0, width: 100, height: 100 });
      const computeB = () => ({ left: 10, top: 10, width: 80, height: 80 });

      const { result, rerender } = await renderHook(
        ({ computeClientRect }) =>
          useDroppable({ element: testEl, dndObserver: observer, computeClientRect }),
        { initialProps: { computeClientRect: computeA as any } },
      );

      const droppable = result.current[0]!;
      const updateRectSpy = vi.spyOn(droppable, 'updateClientRect');

      await rerender({ computeClientRect: computeB as any });

      expect(updateRectSpy).toHaveBeenCalled();
      expect(detectSpy).toHaveBeenCalled();
    });

    it('should not call clearTargets or detectCollisions when only data changes', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());
      const clearSpy = vi.spyOn(observer, 'clearTargets');
      const detectSpy = vi.spyOn(observer, 'detectCollisions');

      const { result, rerender } = await renderHook(
        ({ data }) => useDroppable({ element: testEl, dndObserver: observer, data }),
        { initialProps: { data: { key: 'v1' } } },
      );

      // Reset spies after initial setup (creation may trigger calls).
      clearSpy.mockClear();
      detectSpy.mockClear();

      const droppable = result.current[0]!;
      const updateRectSpy = vi.spyOn(droppable, 'updateClientRect');

      await rerender({ data: { key: 'v2' } });

      expect(clearSpy).not.toHaveBeenCalled();
      expect(detectSpy).not.toHaveBeenCalled();
      expect(updateRectSpy).not.toHaveBeenCalled();
      expect(result.current[0]!.data).toEqual({ key: 'v2' });
    });

    it('should trigger all side effects when multiple settings change', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());
      const clearSpy = vi.spyOn(observer, 'clearTargets');
      const detectSpy = vi.spyOn(observer, 'detectCollisions');

      const computeA = () => ({ left: 0, top: 0, width: 100, height: 100 });
      const computeB = () => ({ left: 10, top: 10, width: 80, height: 80 });

      const { result, rerender } = await renderHook(
        ({ accept, data, computeClientRect }) =>
          useDroppable({ element: testEl, dndObserver: observer, accept, data, computeClientRect }),
        {
          initialProps: {
            accept: new Set(['g1']) as Set<string>,
            data: { k: 'v1' },
            computeClientRect: computeA as any,
          },
        },
      );

      clearSpy.mockClear();
      detectSpy.mockClear();

      const droppable = result.current[0]!;
      const updateRectSpy = vi.spyOn(droppable, 'updateClientRect');

      // Change accept, data, and computeClientRect all at once.
      await rerender({
        accept: new Set(['g2']),
        data: { k: 'v2' },
        computeClientRect: computeB as any,
      });

      expect(clearSpy).toHaveBeenCalled();
      expect(updateRectSpy).toHaveBeenCalled();
      expect(detectSpy).toHaveBeenCalled();
      expect(result.current[0]!.data).toEqual({ k: 'v2' });
    });
  });
});
