import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { useDraggableAutoScroll } from 'dragdoll-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { createTestElement } from './utils/create-test-element.js';

describe('useDraggableAutoScroll', () => {
  let testEl: HTMLElement;
  let sensor: PointerSensor;
  let draggable: Draggable;

  beforeEach(() => {
    testEl = createTestElement();
    sensor = new PointerSensor(testEl);
    draggable = new Draggable([sensor], { id: 'test' });
  });

  afterEach(() => {
    draggable.destroy();
    sensor.destroy();
    testEl.remove();
  });

  it('should register autoscroll plugin on draggable', async () => {
    await renderHook(() => useDraggableAutoScroll(draggable));
    expect(draggable.plugins.autoscroll).toBeTruthy();
  });

  it('should not register plugin twice on re-render', async () => {
    const { rerender } = await renderHook(() => useDraggableAutoScroll(draggable));

    const plugin = draggable.plugins.autoscroll;
    expect(plugin).toBeTruthy();

    await rerender({});

    // Same plugin instance should remain.
    expect(draggable.plugins.autoscroll).toBe(plugin);
  });

  it('should handle null draggable', async () => {
    const { result } = await renderHook(() => useDraggableAutoScroll(null));
    expect(result.current).toBe(null);
  });

  it('should return the draggable with autoscroll plugin type', async () => {
    const { result } = await renderHook(() => useDraggableAutoScroll(draggable));
    expect(result.current).toBeTruthy();
    expect(result.current!.plugins.autoscroll).toBeTruthy();
  });

  it('should call updateSettings when settings change after registration', async () => {
    const { rerender } = await renderHook(
      ({ settings }) => useDraggableAutoScroll(draggable, settings),
      { initialProps: { settings: { speed: 10 } as any } },
    );

    const plugin = draggable.plugins.autoscroll as any;
    expect(plugin).toBeTruthy();

    const updateSpy = vi.spyOn(plugin, 'updateSettings');

    await rerender({ settings: { speed: 20 } as any });

    expect(updateSpy).toHaveBeenCalled();
  });

  it('should not call updateSettings when settings are deeply equal', async () => {
    const { rerender } = await renderHook(
      ({ settings }) => useDraggableAutoScroll(draggable, settings),
      { initialProps: { settings: undefined as any } },
    );

    const plugin = draggable.plugins.autoscroll as any;
    expect(plugin).toBeTruthy();

    const updateSpy = vi.spyOn(plugin, 'updateSettings');

    // Rerender with undefined again — deeply equal.
    await rerender({ settings: undefined as any });

    expect(updateSpy).not.toHaveBeenCalled();
  });
});
