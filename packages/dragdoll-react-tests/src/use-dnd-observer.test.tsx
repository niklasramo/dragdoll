import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import { useDndObserver } from 'dragdoll-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';

// Helper to emit events on observer's internal emitter.
function emitObserverEvent(observer: DndObserver, type: string, ...args: any[]) {
  (observer as any)._emitter.emit(type, ...args);
}

describe('useDndObserver', () => {
  const cleanups: (() => void)[] = [];

  afterEach(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });

  describe('lifecycle', () => {
    it('should create a DndObserver instance on mount', async () => {
      const { result } = await renderHook(() => useDndObserver());

      expect(result.current).toBeInstanceOf(DndObserver);
      expect(result.current!.isDestroyed).toBe(false);
    });

    it('should destroy the DndObserver on unmount', async () => {
      const { result, unmount } = await renderHook(() => useDndObserver());

      const observer = result.current!;
      unmount();
      expect(observer.isDestroyed).toBe(true);
    });

    it('should create observer without collisionDetector', async () => {
      const { result } = await renderHook(() => useDndObserver({}));

      expect(result.current).toBeInstanceOf(DndObserver);
      expect(result.current!.isDestroyed).toBe(false);
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback', async () => {
      const onStart = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onStart }));

      emitObserverEvent(result.current!, DndObserverEventType.Start, {});
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onMove callback', async () => {
      const onMove = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onMove }));

      emitObserverEvent(result.current!, DndObserverEventType.Move, {});
      expect(onMove).toHaveBeenCalledTimes(1);
    });

    it('should call onEnter callback', async () => {
      const onEnter = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onEnter }));

      emitObserverEvent(result.current!, DndObserverEventType.Enter, {});
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should call onLeave callback', async () => {
      const onLeave = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onLeave }));

      emitObserverEvent(result.current!, DndObserverEventType.Leave, {});
      expect(onLeave).toHaveBeenCalledTimes(1);
    });

    it('should call onCollide callback', async () => {
      const onCollide = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onCollide }));

      emitObserverEvent(result.current!, DndObserverEventType.Collide, {});
      expect(onCollide).toHaveBeenCalledTimes(1);
    });

    it('should call onEnd callback', async () => {
      const onEnd = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onEnd }));

      emitObserverEvent(result.current!, DndObserverEventType.End, {});
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('should call onAddDraggables callback', async () => {
      const onAddDraggables = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onAddDraggables }));

      emitObserverEvent(result.current!, DndObserverEventType.AddDraggables, {});
      expect(onAddDraggables).toHaveBeenCalledTimes(1);
    });

    it('should call onRemoveDraggables callback', async () => {
      const onRemoveDraggables = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onRemoveDraggables }));

      emitObserverEvent(result.current!, DndObserverEventType.RemoveDraggables, {});
      expect(onRemoveDraggables).toHaveBeenCalledTimes(1);
    });

    it('should call onAddDroppables callback', async () => {
      const onAddDroppables = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onAddDroppables }));

      emitObserverEvent(result.current!, DndObserverEventType.AddDroppables, {});
      expect(onAddDroppables).toHaveBeenCalledTimes(1);
    });

    it('should call onRemoveDroppables callback', async () => {
      const onRemoveDroppables = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onRemoveDroppables }));

      emitObserverEvent(result.current!, DndObserverEventType.RemoveDroppables, {});
      expect(onRemoveDroppables).toHaveBeenCalledTimes(1);
    });

    it('should call onDestroy callback', async () => {
      const onDestroy = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onDestroy }));

      emitObserverEvent(result.current!, DndObserverEventType.Destroy);
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('callback stability', () => {
    it('should use latest callback without re-subscribing', async () => {
      const onStart1 = vi.fn();
      const onStart2 = vi.fn();

      const { result, rerender } = await renderHook(({ onStart }) => useDndObserver({ onStart }), {
        initialProps: { onStart: onStart1 },
      });

      await rerender({ onStart: onStart2 });
      emitObserverEvent(result.current!, DndObserverEventType.Start, {});

      expect(onStart1).not.toHaveBeenCalled();
      expect(onStart2).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined callbacks gracefully', async () => {
      const { result } = await renderHook(() => useDndObserver());

      expect(() => {
        emitObserverEvent(result.current!, DndObserverEventType.Start, {});
        emitObserverEvent(result.current!, DndObserverEventType.Move, {});
        emitObserverEvent(result.current!, DndObserverEventType.End, {});
      }).not.toThrow();
    });

    it('should not throw when emitting all events with only partial callbacks', async () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();
      const { result } = await renderHook(() => useDndObserver({ onStart, onEnd }));

      const observer = result.current!;
      expect(() => {
        emitObserverEvent(observer, DndObserverEventType.Start, {});
        emitObserverEvent(observer, DndObserverEventType.Move, {});
        emitObserverEvent(observer, DndObserverEventType.Enter, {});
        emitObserverEvent(observer, DndObserverEventType.Leave, {});
        emitObserverEvent(observer, DndObserverEventType.Collide, {});
        emitObserverEvent(observer, DndObserverEventType.End, {});
        emitObserverEvent(observer, DndObserverEventType.AddDraggables, {});
        emitObserverEvent(observer, DndObserverEventType.RemoveDraggables, {});
        emitObserverEvent(observer, DndObserverEventType.AddDroppables, {});
        emitObserverEvent(observer, DndObserverEventType.RemoveDroppables, {});
        emitObserverEvent(observer, DndObserverEventType.Destroy);
      }).not.toThrow();

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledTimes(1);
    });
  });
});
