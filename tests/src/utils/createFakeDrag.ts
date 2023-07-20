import { createFakeTouchEvent } from './createFakeTouchEvent.js';
import { FakeTouchEvent } from './FakeTouch.js';

type FakeDragStep = { x: number; y: number };
type FakeDragStepList = [FakeDragStep, FakeDragStep, ...FakeDragStep[]];
type FakeDragOptions = {
  eventType?: 'mouse' | 'touch' | 'pointer';
  stepDuration?: number;
  extraSteps?: number;
  cancelAtEnd?: boolean;
  pointerId?: number;
  pointerType?: 'mouse' | 'pen' | 'touch';
  onAfterStep?: (event: MouseEvent | PointerEvent | FakeTouchEvent) => void;
};

let idCounter = 100;

export async function createFakeDrag(steps: FakeDragStepList, options: FakeDragOptions) {
  const {
    eventType = 'mouse',
    stepDuration = 16,
    extraSteps = 0,
    cancelAtEnd = false,
    pointerId = ++idCounter,
    pointerType = 'touch',
    onAfterStep,
  } = options;

  // Clone the steps into finalSteps as we may need to modify the array.
  const finalSteps: FakeDragStepList = [...steps];

  // Add extra steps dynamically between the last step and the second last
  // step. Let's linearly translate the coordinates on each step towards the
  // end step.
  if (extraSteps > 0) {
    const stepTo = finalSteps.pop()!;
    const stepFrom = finalSteps.pop()!;
    finalSteps.push(stepFrom);
    for (let i = 0; i < extraSteps; i++) {
      // https://threejs.org/docs/#api/en/math/Vector2.lerpVectors
      const alpha = (i + 1) / (extraSteps + 1);
      const x = stepFrom.x + (stepTo.x - stepFrom.x) * alpha;
      const y = stepFrom.y + (stepTo.y - stepFrom.y) * alpha;
      finalSteps.push({
        x: Math.round(x),
        y: Math.round(y),
      });
    }
    finalSteps.push(stepTo);
  }

  // Process steps.
  for (let i = 0; i < finalSteps.length; i++) {
    const isStart = i === 0;
    const isEnd = i === finalSteps.length - 1;
    const { x, y } = finalSteps[i];

    // If this is a move event let's make sure clientX or clientY has changed
    // from previous step.
    if (!isStart && !isEnd) {
      const prevStep = finalSteps[i - 1];
      if (prevStep.x === x && prevStep.y === y) {
        continue;
      }
    }

    // If this is not the start step, let's delay the triggering of the event.
    if (!isStart && stepDuration > 0) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    // Compute target element based on the coordinates.
    const target = document.elementFromPoint(x, y);
    if (!target) throw new Error('No event target found!');

    // Handle event creation and dispatching based on the event type.
    switch (eventType) {
      case 'mouse': {
        const eventName = isStart ? 'mousedown' : isEnd ? 'mouseup' : 'mousemove';
        const event = new MouseEvent(eventName, {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          view: window,
        });
        target.dispatchEvent(event);
        if (onAfterStep) onAfterStep(event);
        break;
      }
      case 'touch': {
        const eventName = isStart
          ? 'touchstart'
          : isEnd
          ? cancelAtEnd
            ? 'touchcancel'
            : 'touchend'
          : 'touchmove';
        const event = createFakeTouchEvent(eventName, {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
          view: window,
          target,
          identifier: pointerId,
        });
        target.dispatchEvent(event);
        if (onAfterStep) onAfterStep(event);
        break;
      }
      case 'pointer': {
        const eventName = isStart
          ? 'pointerdown'
          : isEnd
          ? cancelAtEnd
            ? 'pointercancel'
            : 'pointerup'
          : 'pointermove';
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
        if (onAfterStep) onAfterStep(event);
        break;
      }
    }
  }
}
