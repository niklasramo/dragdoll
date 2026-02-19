import { useDraggable, useDraggableDrag, usePointerSensor } from 'dragdoll-react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

function DraggableBox() {
  const [sensor, sensorRef] = usePointerSensor();
  const draggable = useDraggable([sensor], { id: 'box' });
  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={sensorRef}
      data-testid="draggable-box"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        background: drag ? 'blue' : 'red',
      }}
    >
      {drag ? 'Dragging' : 'Idle'}
    </div>
  );
}

describe('Integration: Draggable Basic', () => {
  it('should render a draggable component', async () => {
    const screen = await render(<DraggableBox />);
    await expect.element(screen.getByTestId('draggable-box')).toBeVisible();
    await expect.element(screen.getByText('Idle')).toBeVisible();
  });

  it('should create sensor and draggable on mount', async () => {
    const screen = await render(<DraggableBox />);
    const box = screen.getByTestId('draggable-box');
    await expect.element(box).toBeVisible();
  });
});
