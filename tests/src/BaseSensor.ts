import { assert } from 'chai';
import { BaseSensor } from '../../src/index.js';

describe('BaseSensor', () => {
  describe('drag property', () => {
    it(`should be null on init`, function () {
      const s = new BaseSensor();
      assert.equal(s.drag, null);
      s.destroy();
    });
  });

  describe('isDestroyed property', () => {
    it(`should be false on init`, function () {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
  });

  describe('_start method', () => {
    it(`should create drag data`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.deepEqual(s.drag, { x: 1, y: 2 });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "start" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const startArgs = { type: 'start', x: 1, y: 2 } as const;
      let emitCount = 0;
      s.on('start', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, startArgs);
        ++emitCount;
      });
      s['_start'](startArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is already active`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s['_start']({ type: 'start', x: 1, y: 2 });
      const isDestroyed = s.isDestroyed;
      const { drag } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if instance is destroyed (isDestroyed is true)`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s.destroy();
      const { drag, isDestroyed } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_move method', () => {
    it(`should update drag data to reflect the provided coordinates`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.deepEqual(s.drag, { x: 3, y: 4 });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "move" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const moveArgs = { type: 'move', x: 3, y: 4 } as const;
      let emitCount = 0;
      s.on('move', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, moveArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move'](moveArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('move', () => void ++emitCount);
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_cancel method', () => {
    it(`should reset drag data`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const cancelArgs = { type: 'cancel', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, cancelArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel'](cancelArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s['_cancel']({ type: 'cancel', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_end method', () => {
    it(`should reset drag data`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end']({ type: 'end', x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_end']({ type: 'end', x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "end" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const endArgs = { type: 'end', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('end', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, endArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end'](endArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('end', () => void ++emitCount);
      s['_end']({ type: 'end', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('cancel method', () => {
    it(`should reset drag data`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, {
          type: 'cancel',
          x: 1,
          y: 2,
        } as const);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s.cancel();
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('on method', () => {
    it('should return a symbol (by default) which acts as an id for removing the event listener', () => {
      const s = new BaseSensor();
      const idA = s.on('start', () => {});
      assert.equal(typeof idA, 'symbol');
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const s = new BaseSensor();

      const idA = Symbol();
      assert.equal(
        s.on('start', () => {}, idA),
        idA,
      );

      const idB = 1;
      assert.equal(
        s.on('start', () => {}, idB),
        idB,
      );

      const idC = 'foo';
      assert.equal(
        s.on('start', () => {}, idC),
        idC,
      );
    });
  });

  describe('off method', () => {
    it('should remove an event listener based on id', () => {
      const s = new BaseSensor();
      let msg = '';
      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(msg, 'b');
    });

    it('should remove event listeners based on the listener callback', () => {
      const s = new BaseSensor();
      let msg = '';
      const listenerA = () => void (msg += 'a');
      const listenerB = () => void (msg += 'b');
      s.on('start', listenerA);
      s.on('start', listenerB);
      s.on('start', listenerB);
      s.on('start', listenerA);
      s.off('start', listenerA);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(msg, 'bb');
    });
  });

  describe('destroy method', () => {
    it(`should (if drag is active):
          1. set isDestroyed property to true
          2. emit "cancel" event with the current x/y coordinates
          3. reset drag data
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, function () {
      const s = new BaseSensor();
      const startArgs = { type: 'start', x: 1, y: 2 } as const;
      let events: string[] = [];
      s['_start'](startArgs);
      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('cancel', (data) => {
        assert.deepEqual(s.drag, { x: startArgs.x, y: startArgs.y });
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'cancel',
          x: startArgs.x,
          y: startArgs.y,
        } as const);
        events.push(data.type);
      });
      s.on('destroy', (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'destroy',
        } as const);
        events.push(data.type);
      });
      assert.equal(s['_emitter'].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, ['cancel', 'destroy']);
      assert.equal(s['_emitter'].listenerCount(), 0);
    });

    it(`should (if drag is not active):
          1. set isDestroyed property to true
          2. emit "destroy" event
          3. remove all listeners from the internal emitter
       `, function () {
      const s = new BaseSensor();
      let events: string[] = [];
      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('cancel', (data) => void events.push(data.type));
      s.on('destroy', (data) => {
        assert.equal(s.drag, null);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'destroy',
        } as const);
        events.push(data.type);
      });
      assert.equal(s['_emitter'].listenerCount(), 5);
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, ['destroy']);
      assert.equal(s['_emitter'].listenerCount(), 0);
    });

    it('should not do anything if the sensor is already destroyed', () => {
      const s = new BaseSensor();
      s.destroy();
      let events: string[] = [];
      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('cancel', (data) => void events.push(data.type));
      s.on('destroy', (data) => void events.push(data.type));
      s.destroy();
      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, []);
    });
  });
});
