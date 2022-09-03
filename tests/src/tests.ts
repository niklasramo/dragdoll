import { assert } from 'chai';
import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
} from '../../src/index';

describe('foo', () => {
  it(`bar`, () => {
    const pointerSensor = new PointerSensor(document.createElement('div'));
    const keyboardSensor = new KeyboardSensor();
    const draggable = new Draggable([keyboardSensor, pointerSensor], {
      getPositionChange: (_element, _startEvent, _prevEvent, _nextEvent) => {
        return { x: 0, y: 0 };
      },
      startPredicate: createPointerSensorStartPredicate(),
    });
    console.log(PointerSensor, Draggable, draggable);
    assert.equal(1, 1);
  });
});
