import { DndObserver, DndObserverEventType } from 'dragdoll/dnd-observer';
import { useDndObserver } from 'dragdoll-solid';
import { type Accessor, createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import { flush } from './utils/flush.js';

function emitObserverEvent(observer: DndObserver, type: string, ...args: any[]) {
  (observer as any)._emitter.emit(type, ...args);
}

describe('useDndObserver', () => {
  describe('lifecycle', () => {
    it('should create a DndObserver instance on mount', () => {
      createRoot((dispose) => {
        const observer = useDndObserver();
        expect(observer()).toBeInstanceOf(DndObserver);
        expect(observer()!.isDestroyed).toBe(false);
        dispose();
      });
    });

    it('should destroy observer on dispose', () => {
      let instance: DndObserver | null = null;
      const dispose = createRoot((dispose) => {
        const observer = useDndObserver();
        instance = observer();
        expect(instance).toBeInstanceOf(DndObserver);
        return dispose;
      });

      dispose();
      expect(instance!.isDestroyed).toBe(true);
    });

    it('should create observer without collisionDetector', () => {
      createRoot((dispose) => {
        const observer = useDndObserver({});
        expect(observer()).toBeInstanceOf(DndObserver);
        expect(observer()!.isDestroyed).toBe(false);
        dispose();
      });
    });
  });

  describe('event callbacks', () => {
    it('should call onStart callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onStart = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onStart });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Start, {});
      expect(onStart).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onMove callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onMove = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onMove });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Move, {});
      expect(onMove).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onEnter callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onEnter = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onEnter });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Enter, {});
      expect(onEnter).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onLeave callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onLeave = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onLeave });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Leave, {});
      expect(onLeave).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onCollide callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onCollide = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onCollide });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Collide, {});
      expect(onCollide).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onEnd callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onEnd = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onEnd });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.End, {});
      expect(onEnd).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onAddDraggables callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onAddDraggables = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onAddDraggables });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.AddDraggables, {});
      expect(onAddDraggables).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onRemoveDraggables callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onRemoveDraggables = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onRemoveDraggables });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.RemoveDraggables, {});
      expect(onRemoveDraggables).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onAddDroppables callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onAddDroppables = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onAddDroppables });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.AddDroppables, {});
      expect(onAddDroppables).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onRemoveDroppables callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onRemoveDroppables = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onRemoveDroppables });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.RemoveDroppables, {});
      expect(onRemoveDroppables).toHaveBeenCalledTimes(1);
      dispose();
    });

    it('should call onDestroy callback', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onDestroy = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onDestroy });
      });

      await flush();
      emitObserverEvent(observer()!, DndObserverEventType.Destroy);
      expect(onDestroy).toHaveBeenCalledTimes(1);
      dispose();
    });
  });

  describe('callback stability', () => {
    it('should handle undefined callbacks gracefully', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver();
      });

      await flush();

      expect(() => {
        emitObserverEvent(observer()!, DndObserverEventType.Start, {});
        emitObserverEvent(observer()!, DndObserverEventType.Move, {});
        emitObserverEvent(observer()!, DndObserverEventType.End, {});
      }).not.toThrow();
      dispose();
    });

    it('should not throw when emitting all events with only partial callbacks', async () => {
      let dispose!: () => void;
      let observer!: Accessor<DndObserver | null>;
      const onStart = vi.fn();
      const onEnd = vi.fn();

      createRoot((d) => {
        dispose = d;
        observer = useDndObserver({ onStart, onEnd });
      });

      await flush();

      const obs = observer()!;
      expect(() => {
        emitObserverEvent(obs, DndObserverEventType.Start, {});
        emitObserverEvent(obs, DndObserverEventType.Move, {});
        emitObserverEvent(obs, DndObserverEventType.Enter, {});
        emitObserverEvent(obs, DndObserverEventType.Leave, {});
        emitObserverEvent(obs, DndObserverEventType.Collide, {});
        emitObserverEvent(obs, DndObserverEventType.End, {});
        emitObserverEvent(obs, DndObserverEventType.AddDraggables, {});
        emitObserverEvent(obs, DndObserverEventType.RemoveDraggables, {});
        emitObserverEvent(obs, DndObserverEventType.AddDroppables, {});
        emitObserverEvent(obs, DndObserverEventType.RemoveDroppables, {});
        emitObserverEvent(obs, DndObserverEventType.Destroy);
      }).not.toThrow();

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledTimes(1);
      dispose();
    });
  });
});
