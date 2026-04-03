import { useDndObserverContext } from 'dragdoll-solid';
import { createRoot } from 'solid-js';
import { describe, expect, it } from 'vitest';

describe('useDndObserverContext', () => {
  it('should return null when no provider', () => {
    createRoot((dispose) => {
      const observer = useDndObserverContext();
      expect(observer()).toBe(null);
      dispose();
    });
  });
});

describe('DndObserverContext', () => {
  it('should have null accessor as default value', () => {
    createRoot((dispose) => {
      const observer = useDndObserverContext();
      expect(observer()).toBe(null);
      dispose();
    });
  });
});
