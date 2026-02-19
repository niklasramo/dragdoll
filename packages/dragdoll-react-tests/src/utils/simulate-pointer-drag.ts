type DragStep = { x: number; y: number };

let idCounter = 100;

export async function simulatePointerDrag(
  steps: [DragStep, DragStep, ...DragStep[]],
  options: {
    stepDuration?: number;
    pointerId?: number;
    pointerType?: 'mouse' | 'pen' | 'touch';
  } = {},
) {
  const { stepDuration = 16, pointerId = ++idCounter, pointerType = 'mouse' } = options;

  for (let i = 0; i < steps.length; i++) {
    const isStart = i === 0;
    const isEnd = i === steps.length - 1;
    const { x, y } = steps[i];

    if (!isStart && stepDuration > 0) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    const target = document.elementFromPoint(x, y);
    if (!target) throw new Error(`No event target found at (${x}, ${y})!`);

    const eventName = isStart ? 'pointerdown' : isEnd ? 'pointerup' : 'pointermove';
    const event = new PointerEvent(eventName, {
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
      view: window,
      pointerId,
      pointerType,
      isPrimary: true,
      width: 100,
      height: 100,
    });
    target.dispatchEvent(event);
  }
}
