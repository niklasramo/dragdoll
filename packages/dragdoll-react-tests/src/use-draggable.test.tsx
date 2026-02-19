import { DndObserver } from 'dragdoll/dnd-observer';
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { DndObserverContext, useDraggable } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

describe('useDraggable', () => {
  let testEl: HTMLElement;
  let sensor: PointerSensor;
  const cleanups: (() => void)[] = [];

  beforeEach(() => {
    testEl = createTestElement();
    sensor = new PointerSensor(testEl);
    cleanups.push(() => {
      sensor.destroy();
      testEl.remove();
    });
  });

  afterEach(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  describe('lifecycle', () => {
    it('should create a Draggable instance on mount', async () => {
      const { result } = await renderHook(() => useDraggable([sensor]));

      expect(result.current).toBeInstanceOf(Draggable);
      expect(result.current!.isDestroyed).toBe(false);
    });

    it('should destroy the Draggable on unmount', async () => {
      const { result, unmount } = await renderHook(() => useDraggable([sensor]));

      const draggable = result.current!;
      unmount();
      expect(draggable.isDestroyed).toBe(true);
    });

    it('should auto-generate an id when not provided', async () => {
      const { result } = await renderHook(() => useDraggable([sensor]));

      expect(typeof result.current!.id).toBe('symbol');
    });

    it('should use the provided id', async () => {
      const { result } = await renderHook(() => useDraggable([sensor], { id: 'test-id' }));

      expect(result.current!.id).toBe('test-id');
    });
  });

  describe('id change', () => {
    it('should recreate Draggable when id changes', async () => {
      const { result, rerender } = await renderHook(({ id }) => useDraggable([sensor], { id }), {
        initialProps: { id: 'id-1' as string },
      });

      const first = result.current!;
      expect(first.id).toBe('id-1');

      await rerender({ id: 'id-2' });

      const second = result.current!;
      expect(second.id).toBe('id-2');
      expect(first.isDestroyed).toBe(true);
      expect(second).not.toBe(first);
    });
  });

  describe('sensors', () => {
    it('should set sensors on the Draggable', async () => {
      const { result } = await renderHook(() => useDraggable([sensor]));

      expect(result.current!.sensors).toContain(sensor);
    });

    it('should filter out null sensors', async () => {
      const { result } = await renderHook(() => useDraggable([null, sensor, null]));

      expect(result.current!.sensors).toHaveLength(1);
      expect(result.current!.sensors[0]).toBe(sensor);
    });

    it('should update sensors when they change', async () => {
      const el2 = createTestElement({ left: '200px' });
      const sensor2 = new PointerSensor(el2);
      cleanups.push(() => {
        sensor2.destroy();
        el2.remove();
      });

      const { result, rerender } = await renderHook(({ sensors }) => useDraggable(sensors), {
        initialProps: { sensors: [sensor] as (PointerSensor | null)[] },
      });

      expect(result.current!.sensors).toHaveLength(1);

      await rerender({ sensors: [sensor, sensor2] });

      expect(result.current!.sensors).toHaveLength(2);
    });
  });

  describe('DndObserver integration', () => {
    it('should add draggable to explicit dndObserver', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result } = await renderHook(() => useDraggable([sensor], { dndObserver: observer }));

      expect(observer.draggables.has(result.current!.id)).toBe(true);
    });

    it('should remove draggable from observer on unmount', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result, unmount } = await renderHook(() =>
        useDraggable([sensor], { dndObserver: observer }),
      );

      const id = result.current!.id;
      expect(observer.draggables.has(id)).toBe(true);

      unmount();
      expect(observer.draggables.has(id)).toBe(false);
    });

    it('should use DndObserverContext when no explicit observer', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result } = await renderHook(() => useDraggable([sensor]), {
        wrapper: ({ children }) => (
          <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>
        ),
      });

      expect(observer.draggables.has(result.current!.id)).toBe(true);
    });

    it('should prefer explicit observer over context', async () => {
      const contextObserver = new DndObserver();
      const explicitObserver = new DndObserver();
      cleanups.push(() => {
        contextObserver.destroy();
        explicitObserver.destroy();
      });

      const { result } = await renderHook(
        () => useDraggable([sensor], { dndObserver: explicitObserver }),
        {
          wrapper: ({ children }) => (
            <DndObserverContext.Provider value={contextObserver}>
              {children}
            </DndObserverContext.Provider>
          ),
        },
      );

      expect(explicitObserver.draggables.has(result.current!.id)).toBe(true);
      expect(contextObserver.draggables.has(result.current!.id)).toBe(false);
    });
  });

  describe('settings', () => {
    it('should not call updateSettings when settings are stable', async () => {
      const settings = { id: 'test' as string };
      const { result, rerender } = await renderHook(() => useDraggable([sensor], settings));

      const draggable = result.current!;
      const updateSpy = vi.spyOn(draggable, 'updateSettings');

      await rerender({});

      expect(updateSpy).not.toHaveBeenCalled();
    });
  });

  describe('settings edge cases', () => {
    it('should call clearTargets when dndGroups changes', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());
      const clearSpy = vi.spyOn(observer, 'clearTargets');

      const { rerender } = await renderHook(
        ({ dndGroups }) =>
          useDraggable([sensor], {
            id: 'test',
            dndObserver: observer,
            dndGroups,
          }),
        { initialProps: { dndGroups: new Set(['group1']) as Set<string> } },
      );

      await rerender({ dndGroups: new Set(['group2']) });

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should not call updateSettings when settings are deeply equal', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => useDraggable([sensor], settings),
        { initialProps: { settings: { id: 'test', dndGroups: new Set(['g1']) } } },
      );

      const draggable = result.current!;
      const updateSpy = vi.spyOn(draggable, 'updateSettings');

      // New object reference with same values.
      await rerender({ settings: { id: 'test', dndGroups: new Set(['g1']) } });

      expect(updateSpy).not.toHaveBeenCalled();
    });

    it('should handle sensors and settings changing in the same render', async () => {
      const el2 = createTestElement({ left: '200px' });
      const sensor2 = new PointerSensor(el2);
      cleanups.push(() => {
        sensor2.destroy();
        el2.remove();
      });

      const { result, rerender } = await renderHook(
        ({ sensors, dndGroups }) => useDraggable(sensors, { id: 'test', dndGroups }),
        {
          initialProps: {
            sensors: [sensor] as (PointerSensor | null)[],
            dndGroups: new Set(['a']) as Set<string>,
          },
        },
      );

      const draggable = result.current!;

      await rerender({
        sensors: [sensor, sensor2],
        dndGroups: new Set(['b']),
      });

      // Both should have updated on the same draggable instance.
      expect(result.current).toBe(draggable);
      expect(result.current!.sensors).toHaveLength(2);
    });
  });

  describe('destruction safety', () => {
    it('should handle double destroy safely', async () => {
      const { result, unmount } = await renderHook(() => useDraggable([sensor]));

      const draggable = result.current!;

      // Manually destroy before unmount.
      draggable.destroy();
      expect(draggable.isDestroyed).toBe(true);

      // Unmount should not throw even though draggable is already destroyed.
      expect(() => unmount()).not.toThrow();
    });

    it('should properly transfer observer registration on id change', async () => {
      const observer = new DndObserver();
      cleanups.push(() => observer.destroy());

      const { result, rerender } = await renderHook(
        ({ id }) => useDraggable([sensor], { id, dndObserver: observer }),
        { initialProps: { id: 'id-1' as string } },
      );

      expect(observer.draggables.has('id-1')).toBe(true);

      await rerender({ id: 'id-2' });

      // Old id should be removed, new id should be registered.
      expect(observer.draggables.has('id-1')).toBe(false);
      expect(observer.draggables.has('id-2')).toBe(true);
      expect(result.current!.id).toBe('id-2');
    });
  });
});
