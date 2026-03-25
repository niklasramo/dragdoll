import { DndObserver } from 'dragdoll/dnd-observer';
import { useDndObserver } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';

describe('useDndObserver', () => {
  describe('lifecycle', () => {
    it('should return null accessor when no settings are provided', () => {
      createRoot((dispose) => {
        const observer = useDndObserver();
        expect(observer()).toBeInstanceOf(DndObserver);
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
  });

  describe('event callbacks', () => {
    it('should call onStart callback', () => {
      createRoot((dispose) => {
        const onStart = vi.fn();
        const observer = useDndObserver({ onStart });
        (observer() as any)._emitter.emit('start', { type: 'start' });
        expect(onStart).toHaveBeenCalledTimes(1);
        dispose();
      });
    });

    it('should call onEnd callback', () => {
      createRoot((dispose) => {
        const onEnd = vi.fn();
        const observer = useDndObserver({ onEnd });
        (observer() as any)._emitter.emit('end', { type: 'end' });
        expect(onEnd).toHaveBeenCalledTimes(1);
        dispose();
      });
    });
  });
});
