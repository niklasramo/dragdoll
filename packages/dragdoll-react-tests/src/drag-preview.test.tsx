import { DndObserver } from 'dragdoll/dnd-observer';
import { DndObserverContext, DragPreview, useDraggable, usePointerSensor } from 'dragdoll-react';
import { useCallback, useMemo, useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('DragPreview', () => {
  it('renders a DragPreview portal seamlessly using a proxy element', async () => {
    const dndObserver = new DndObserver();

    function TestComponent() {
      const elementRef = useRef<HTMLDivElement | null>(null);
      const [pointerSensor, setPointerSensorRef] = usePointerSensor();

      const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
          elementRef.current = node;
          setPointerSensorRef(node);
        },
        [setPointerSensorRef],
      );

      const draggableSettings = useMemo(
        () => ({
          elements: () => (elementRef.current ? [elementRef.current] : []),
          dragPreview: true,
          dndObserver,
        }),
        [],
      );

      const draggable = useDraggable([pointerSensor], draggableSettings);

      return (
        <>
          <div
            data-testid="drag-source"
            ref={setRefs}
            style={{ position: 'fixed', left: 0, top: 0, width: '100px', height: '100px' }}
          >
            Source
          </div>
          <DragPreview draggable={draggable}>
            <div data-testid="drag-preview">Preview Content</div>
          </DragPreview>
        </>
      );
    }

    const screen = await render(
      <DndObserverContext.Provider value={dndObserver}>
        <TestComponent />
      </DndObserverContext.Provider>,
    );

    // Ensure preview does NOT exist initially
    await expect.element(screen.getByTestId('drag-preview')).not.toBeInTheDocument();

    // Ensure the proxy div does NOT exist initially
    expect(document.querySelector('[data-drag-preview-proxy]')).toBeNull();

    // Start dragging without ending it (no pointerup)
    const sourceEl = document.querySelector('[data-testid="drag-source"]')!;
    const pointerId = 999;
    sourceEl.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );
    sourceEl.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    // Ensure the preview DOES exist inside the proxy div
    await expect.element(screen.getByTestId('drag-preview')).toBeInTheDocument();

    // After drag starts the core reparents the proxy to document.body.
    const proxy = document.querySelector('[data-drag-preview-proxy]') as HTMLElement;
    expect(proxy).toBeDefined();
    expect(proxy.parentElement).toBe(document.body);
    expect(proxy.style.position).toBe('absolute');
    expect(proxy.style.pointerEvents).toBe('none');

    // The proxy element itself should contain the preview
    expect(proxy.textContent).toContain('Preview Content');

    // End drag via pointerup on window (where the sensor listens)
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    // Preview portal should be gone after drag ends
    await expect.element(screen.getByTestId('drag-preview')).not.toBeInTheDocument();

    // Proxy div should be removed from DOM after setTimeout(0) fires
    await delay(50);
    expect(document.querySelector('[data-drag-preview-proxy]')).toBeNull();

    dndObserver.destroy();
  });

  it('copies coalesced transform and transform-origin from source to proxy', async () => {
    const dndObserver = new DndObserver();

    function TestComponent() {
      const elementRef = useRef<HTMLDivElement | null>(null);
      const [pointerSensor, setPointerSensorRef] = usePointerSensor();

      const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
          elementRef.current = node;
          setPointerSensorRef(node);
        },
        [setPointerSensorRef],
      );

      const draggableSettings = useMemo(
        () => ({
          elements: () => (elementRef.current ? [elementRef.current] : []),
          dragPreview: true,
          dndObserver,
        }),
        [],
      );

      const draggable = useDraggable([pointerSensor], draggableSettings);

      return (
        <>
          <div
            data-testid="drag-source"
            ref={setRefs}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '100px',
              height: '100px',
              transform: 'rotate(45deg)',
              transformOrigin: '0px 0px',
            }}
          >
            Source
          </div>
          <DragPreview draggable={draggable}>
            <div data-testid="drag-preview">Preview</div>
          </DragPreview>
        </>
      );
    }

    const screen = await render(
      <DndObserverContext.Provider value={dndObserver}>
        <TestComponent />
      </DndObserverContext.Provider>,
    );

    // Start drag
    const sourceEl = document.querySelector('[data-testid="drag-source"]')!;
    const pointerId = 998;
    sourceEl.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );
    sourceEl.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await expect.element(screen.getByTestId('drag-preview')).toBeInTheDocument();

    const proxy = document.querySelector('[data-drag-preview-proxy]') as HTMLElement;
    expect(proxy).toBeDefined();

    // The proxy's computed transform should include the source's rotation.
    const proxyTransform = getComputedStyle(proxy).transform;
    expect(proxyTransform).not.toBe('none');
    expect(proxyTransform).not.toBe('');

    // The proxy's transform-origin should match the source's.
    const proxyOrigin = getComputedStyle(proxy).transformOrigin;
    expect(proxyOrigin).toContain('0');

    // End drag
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await delay(50);
    dndObserver.destroy();
  });

  it('skips transform copy when source has no transform', async () => {
    const dndObserver = new DndObserver();

    function TestComponent() {
      const elementRef = useRef<HTMLDivElement | null>(null);
      const [pointerSensor, setPointerSensorRef] = usePointerSensor();

      const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
          elementRef.current = node;
          setPointerSensorRef(node);
        },
        [setPointerSensorRef],
      );

      const draggableSettings = useMemo(
        () => ({
          elements: () => (elementRef.current ? [elementRef.current] : []),
          dragPreview: true,
          dndObserver,
        }),
        [],
      );

      const draggable = useDraggable([pointerSensor], draggableSettings);

      return (
        <>
          <div
            data-testid="drag-source"
            ref={setRefs}
            style={{ position: 'fixed', left: 0, top: 0, width: '80px', height: '80px' }}
          >
            Source
          </div>
          <DragPreview draggable={draggable}>
            <div data-testid="drag-preview">Preview</div>
          </DragPreview>
        </>
      );
    }

    const screen = await render(
      <DndObserverContext.Provider value={dndObserver}>
        <TestComponent />
      </DndObserverContext.Provider>,
    );

    // Start drag
    const sourceEl = document.querySelector('[data-testid="drag-source"]')!;
    const pointerId = 997;
    sourceEl.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: 40,
        clientY: 40,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );
    sourceEl.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: 90,
        clientY: 90,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await expect.element(screen.getByTestId('drag-preview')).toBeInTheDocument();

    // The proxy should have the core's drag transform (from reparenting),
    // but the element's own inline transform-origin should NOT have been set
    // since the source has no CSS transform.
    const proxy = document.querySelector('[data-drag-preview-proxy]') as HTMLElement;
    expect(proxy).toBeDefined();
    expect(proxy.style.transformOrigin).toBe('');

    // End drag
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: 90,
        clientY: 90,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await delay(50);
    dndObserver.destroy();
  });

  it('aligns proxy in a transformed parent', async () => {
    const dndObserver = new DndObserver();

    function TestComponent() {
      const elementRef = useRef<HTMLDivElement | null>(null);
      const [pointerSensor, setPointerSensorRef] = usePointerSensor();

      const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
          elementRef.current = node;
          setPointerSensorRef(node);
        },
        [setPointerSensorRef],
      );

      const draggableSettings = useMemo(
        () => ({
          elements: () => (elementRef.current ? [elementRef.current] : []),
          dragPreview: true,
          dndObserver,
        }),
        [],
      );

      const draggable = useDraggable([pointerSensor], draggableSettings);

      return (
        <>
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: '400px',
              height: '400px',
              transform: 'scale(0.5)',
              transformOrigin: '0px 0px',
            }}
          >
            <div
              data-testid="drag-source"
              ref={setRefs}
              style={{ width: '100px', height: '100px' }}
            >
              Source
            </div>
          </div>
          <DragPreview draggable={draggable}>
            <div data-testid="drag-preview">Preview</div>
          </DragPreview>
        </>
      );
    }

    const screen = await render(
      <DndObserverContext.Provider value={dndObserver}>
        <TestComponent />
      </DndObserverContext.Provider>,
    );

    // Get source's viewport rect before drag
    const sourceEl = document.querySelector('[data-testid="drag-source"]')!;
    const sourceRect = sourceEl.getBoundingClientRect();

    // Start drag
    const pointerId = 996;
    sourceEl.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: sourceRect.left + 25,
        clientY: sourceRect.top + 25,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );
    sourceEl.dispatchEvent(
      new PointerEvent('pointermove', {
        clientX: sourceRect.left + 75,
        clientY: sourceRect.top + 75,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await expect.element(screen.getByTestId('drag-preview')).toBeInTheDocument();

    // The proxy should be reparented to document.body and visually match
    // the source's viewport position (within a few pixels of tolerance,
    // accounting for the parent's scale(0.5) transform).
    const proxy = document.querySelector('[data-drag-preview-proxy]') as HTMLElement;
    expect(proxy).toBeDefined();
    expect(proxy.parentElement).toBe(document.body);

    // End drag
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        clientX: sourceRect.left + 75,
        clientY: sourceRect.top + 75,
        bubbles: true,
        pointerId,
        isPrimary: true,
      }),
    );

    await delay(50);
    dndObserver.destroy();
  });
});
