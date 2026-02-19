import { useKeyboardMotionSensor, usePointerSensor } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from '../utils/create-test-element.js';

describe('Integration: Settings Reactivity', () => {
  let testEl: HTMLElement;

  beforeEach(() => {
    testEl = createTestElement();
  });

  afterEach(() => {
    testEl.remove();
  });

  describe('usePointerSensor', () => {
    it('should fire updateSettings when settings actually change', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => usePointerSensor(settings, testEl),
        { initialProps: { settings: { sourceEvents: 'pointer' as const } } },
      );

      const sensor = result.current[0]!;
      const updateSpy = vi.spyOn(sensor, 'updateSettings');

      await rerender({ settings: { sourceEvents: 'mouse' as const } });

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('useKeyboardMotionSensor', () => {
    it('should fire updateSettings when settings actually change', async () => {
      const { result, rerender } = await renderHook(
        ({ settings }) => useKeyboardMotionSensor(settings, testEl),
        { initialProps: { settings: { cancelOnBlur: true } } },
      );

      const sensor = result.current[0]!;
      const updateSpy = vi.spyOn(sensor, 'updateSettings');

      await rerender({ settings: { cancelOnBlur: false } });

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
