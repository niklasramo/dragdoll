import { DndObserver } from 'dragdoll/dnd-observer';
import {
  DndObserverContext,
  useDraggable,
  useDraggableDrag,
  useDroppable,
  usePointerSensor,
} from 'dragdoll-react';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

function useDndObserverStable() {
  const ref = useRef<DndObserver | null>(null);
  if (!ref.current) {
    ref.current = new DndObserver();
  }
  return ref.current;
}

function DndProvider({ children }: { children: ReactNode }) {
  const observer = useDndObserverStable();
  return <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>;
}

function DraggableItem() {
  const [sensor, sensorRef] = usePointerSensor();
  const draggable = useDraggable([sensor], { id: 'drag-1' });
  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={sensorRef}
      data-testid="draggable"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 50,
        height: 50,
        background: drag ? 'blue' : 'green',
      }}
    >
      {drag ? 'Dragging' : 'Ready'}
    </div>
  );
}

function DroppableTarget() {
  const [, droppableRef] = useDroppable({ id: 'drop-1' });

  return (
    <div
      ref={droppableRef}
      data-testid="droppable"
      style={{
        position: 'absolute',
        left: 200,
        top: 0,
        width: 100,
        height: 100,
        background: 'gray',
      }}
    >
      Drop Here
    </div>
  );
}

describe('Integration: DnD Basic', () => {
  it('should render DnD components with provider', async () => {
    const screen = await render(
      <DndProvider>
        <DraggableItem />
        <DroppableTarget />
      </DndProvider>,
    );

    await expect.element(screen.getByTestId('draggable')).toBeVisible();
    await expect.element(screen.getByTestId('droppable')).toBeVisible();
    await expect.element(screen.getByText('Ready')).toBeVisible();
    await expect.element(screen.getByText('Drop Here')).toBeVisible();
  });

  it('should register draggable and droppable in the observer', async () => {
    let capturedObserver: DndObserver | null = null;

    function ObserverCapture({ children }: { children: ReactNode }) {
      const ref = useRef<DndObserver | null>(null);
      if (!ref.current) {
        ref.current = new DndObserver();
      }
      capturedObserver = ref.current;
      return (
        <DndObserverContext.Provider value={ref.current}>{children}</DndObserverContext.Provider>
      );
    }

    await render(
      <ObserverCapture>
        <DraggableItem />
        <DroppableTarget />
      </ObserverCapture>,
    );

    expect(capturedObserver).toBeTruthy();
    expect(capturedObserver!.draggables.size).toBe(1);
    expect(capturedObserver!.droppables.size).toBe(1);
    expect(capturedObserver!.draggables.has('drag-1')).toBe(true);
    expect(capturedObserver!.droppables.has('drop-1')).toBe(true);
  });
});
