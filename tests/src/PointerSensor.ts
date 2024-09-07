import { assert } from 'chai';
import { createTestElement } from './utils/create-test-element.js';
import { createFakeDrag } from './utils/create-fake-drag.js';
import { addDefaultPageStyles, removeDefaultPageStyles } from './utils/default-page-styles.js';
import {
  PointerSensor,
  PointerSensorCancelEvent,
  PointerSensorEndEvent,
  PointerSensorMoveEvent,
  PointerSensorStartEvent,
} from '../../src/index.js';

describe('PointerSensor', () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  describe('drag property', () => {
    it(`should be null on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.drag, null);
      s.destroy();
    });
  });

  describe('isDestroyed property', () => {
    it(`should be false on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
  });

  describe('target element parameter', () => {
    it('should accept document.documentElement', function () {
      const s = new PointerSensor(document.documentElement, { sourceEvents: 'mouse' });
      document.documentElement.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      s.destroy();
    });

    it('should accept document.body', function () {
      const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      s.destroy();
    });

    it('should accept a descendant of document.body', function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      el.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      el.remove();
      s.destroy();
    });
  });

  describe('sourceEvents option', () => {
    it('should listen to mouse/pointer/touch events when set to "mouse"/"pointer"/"touch"', function () {
      const mouseSensor = new PointerSensor(document.body, { sourceEvents: 'mouse' });
      const pointerSensor = new PointerSensor(document.body, { sourceEvents: 'pointer' });
      const touchSensor = new PointerSensor(document.body, { sourceEvents: 'touch' });

      const mouseList: string[] = [];
      const pointerList: string[] = [];
      const touchList: string[] = [];

      mouseSensor.on('start', (e) => mouseList.push(e.type));
      mouseSensor.on('move', (e) => mouseList.push(e.type));
      mouseSensor.on('end', (e) => mouseList.push(e.type));

      pointerSensor.on('start', (e) => pointerList.push(e.type));
      pointerSensor.on('move', (e) => pointerList.push(e.type));
      pointerSensor.on('end', (e) => pointerList.push(e.type));

      touchSensor.on('start', (e) => touchList.push(e.type));
      touchSensor.on('move', (e) => touchList.push(e.type));
      touchSensor.on('end', (e) => touchList.push(e.type));

      // Simulate mouse events...
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
        },
      );

      // ...which should trigger only mouse sensor events.
      assert.deepEqual(mouseList, ['start', 'move', 'end']);
      assert.deepEqual(pointerList, []);
      assert.deepEqual(touchList, []);

      // Reset mouse list.
      mouseList.length = 0;

      // Simulate pointer events...
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
        },
      );

      // ...which should trigger only pointer sensor events.
      assert.deepEqual(mouseList, []);
      assert.deepEqual(pointerList, ['start', 'move', 'end']);
      assert.deepEqual(touchList, []);

      // Reset pointer list.
      pointerList.length = 0;

      // Simulate touch events...
      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
        },
      );

      // ...which should trigger only touch sensor events.
      assert.deepEqual(mouseList, []);
      assert.deepEqual(pointerList, []);
      assert.deepEqual(touchList, ['start', 'move', 'end']);

      mouseSensor.destroy();
      pointerSensor.destroy();
      touchSensor.destroy();
    });
  });

  describe('startPredicate option', () => {
    it('should allow start only when e.button is 0 by default', function () {
      const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
      assert.equal(s.drag, null);

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      assert.notEqual(s.drag, null);

      s.destroy();
    });

    it('should allow start when true is returned and prevent start when false is returned', function () {
      const s1 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => true,
      });
      const s2 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s1.drag, null);
      assert.equal(s2.drag, null);

      s1.destroy();
      s2.destroy();
    });
  });

  describe('updateSettings method', () => {
    it(`should update startPredicate setting`, function () {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.equal(s.drag, null);

      s.updateSettings({ startPredicate: () => true });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
    });

    it(`should update sourceEvents setting`, function () {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'pointer',
        startPredicate: () => true,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.equal(s.drag, null);

      s.updateSettings({ sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
    });
  });

  describe('start event', () => {
    it(`should be triggered correctly on mousedown`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail('start event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'mousedown') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(startEvent, {
        type: 'start',
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: 'mouse',
        x: 1,
        y: 1,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on pointerdown`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail('start event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'pointerdown') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(startEvent, {
        type: 'start',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 1,
        y: 1,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchstart`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail('start event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'touchstart') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(startEvent, {
        type: 'start',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        x: 1,
        y: 1,
      });

      s.destroy();
      el.remove();
    });
  });

  describe('move event', () => {
    it(`should be triggered correctly on mousemove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('move event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'mousemove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: 'mouse',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on pointermove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('move event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'pointermove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchmove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('start event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'touchmove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });
  });

  describe('end event', () => {
    it(`should be triggered correctly on mouseup`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'mouseup') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: 'mouse',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on pointerup`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'pointerup') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchend`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'touchend') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });
  });

  describe('cancel event', () => {
    it(`should be triggered correctly on pointercancel`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEvent: PointerSensorCancelEvent | null = null;
      let sourceEvent: any;

      s.on('cancel', (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          assert.fail('cancel event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === 'pointercancel') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(cancelEvent, {
        type: 'cancel',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchcancel`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let cancelEvent: PointerSensorCancelEvent | null = null;
      let sourceEvent: any;

      s.on('cancel', (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          assert.fail('cancel event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === 'touchcancel') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(cancelEvent, {
        type: 'cancel',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });
  });
});
