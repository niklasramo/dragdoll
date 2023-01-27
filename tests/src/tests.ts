import { assert } from 'chai';
import { BaseSensor } from '../../src/index';

// BaseSensor

describe('BaseSensor', () => {
  describe('isActive property', () => {
    it(`should be false on init`, function () {
      const s = new BaseSensor();
      assert.equal(s.isActive, false);
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

  describe('clientX property', () => {
    it(`should be 0 on init`, function () {
      const s = new BaseSensor();
      assert.equal(s.clientX, 0);
      s.destroy();
    });
  });

  describe('clientY property', () => {
    it(`should be 0 on init`, function () {
      const s = new BaseSensor();
      assert.equal(s.clientY, 0);
      s.destroy();
    });
  });

  describe('_emitter', () => {
    it('should allow duplicate listeners by default', () => {
      const s = new BaseSensor();
      assert.equal(s['_emitter'].allowDuplicateListeners, true);
    });

    it('should replace event listeners with duplicate ids by default', () => {
      const s = new BaseSensor();
      assert.equal(s['_emitter'].idDedupeMode, 'replace');
    });
  });

  describe('_start method', () => {
    it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.clientX, 1);
      assert.equal(s.clientY, 2);
      s.destroy();
    });

    it(`should set isActive property to true`, function () {
      const s = new BaseSensor();
      assert.equal(s.isActive, false);
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isActive, true);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "start" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const startArgs = { type: 'start', clientX: 1, clientY: 2 } as const;
      let emitCount = 0;
      s.on('start', (data) => {
        assert.equal(s.clientX, data.clientX);
        assert.equal(s.clientY, data.clientY);
        assert.equal(s.isActive, true);
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, startArgs);
        ++emitCount;
      });
      s['_start'](startArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is already active (isActive is true)`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      const { clientX, clientY, isActive, isDestroyed } = s;
      s['_start']({ type: 'start', clientX: 3, clientY: 4 });
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if instance is destroyed (isDestroyed is true)`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s.destroy();
      const { clientX, clientY, isActive, isDestroyed } = s;
      s['_start']({ type: 'start', clientX: 3, clientY: 4 });
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_move method', () => {
    it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_move']({ type: 'move', clientX: 3, clientY: 4 });
      assert.equal(s.clientX, 3);
      assert.equal(s.clientY, 4);
      s.destroy();
    });

    it(`should not modify isActive/isDestroyed properties`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isActive, true);
      assert.equal(s.isDestroyed, false);
      s['_move']({ type: 'move', clientX: 3, clientY: 4 });
      assert.equal(s.isActive, true);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "move" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const moveArgs = { type: 'move', clientX: 3, clientY: 4 } as const;
      let emitCount = 0;
      s.on('move', (data) => {
        assert.equal(s.clientX, data.clientX);
        assert.equal(s.clientY, data.clientY);
        assert.equal(s.isActive, true);
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, moveArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_move'](moveArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { clientX, clientY, isActive, isDestroyed } = s;
      let emitCount = 0;
      s.on('move', () => void ++emitCount);
      s['_move']({ type: 'move', clientX: 3, clientY: 4 });
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_cancel method', () => {
    it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
      assert.equal(s.clientX, 5);
      assert.equal(s.clientY, 6);
      s.destroy();
    });

    it(`should set isActive property to false`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isActive, true);
      s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
      assert.equal(s.isActive, false);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isDestroyed, false);
      s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const cancelArgs = { type: 'cancel', clientX: 5, clientY: 6 } as const;
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.equal(s.clientX, data.clientX);
        assert.equal(s.clientY, data.clientY);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, cancelArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_cancel'](cancelArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { clientX, clientY, isActive, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s['_cancel']({ type: 'cancel', clientX: 5, clientY: 6 });
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('_end method', () => {
    it(`should update clientX/Y properties to reflect the provided coordinates`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_end']({ type: 'end', clientX: 5, clientY: 6 });
      assert.equal(s.clientX, 5);
      assert.equal(s.clientY, 6);
      s.destroy();
    });

    it(`should set isActive property to false`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isActive, true);
      s['_end']({ type: 'end', clientX: 5, clientY: 6 });
      assert.equal(s.isActive, false);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isDestroyed, false);
      s['_end']({ type: 'end', clientX: 5, clientY: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "end" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      const endArgs = { type: 'end', clientX: 5, clientY: 6 } as const;
      let emitCount = 0;
      s.on('end', (data) => {
        assert.equal(s.clientX, data.clientX);
        assert.equal(s.clientY, data.clientY);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, endArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s['_end'](endArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { clientX, clientY, isActive, isDestroyed } = s;
      let emitCount = 0;
      s.on('end', () => void ++emitCount);
      s['_end']({ type: 'end', clientX: 5, clientY: 6 });
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });

  describe('cancel method', () => {
    it(`should not update clientX/clientY/isDestroyed properties`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.clientX, 1);
      assert.equal(s.clientY, 2);
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.clientX, 1);
      assert.equal(s.clientY, 2);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should set isActive property to false`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isActive, true);
      s.cancel();
      assert.equal(s.isActive, false);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, function () {
      const s = new BaseSensor();
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, function () {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.equal(s.clientX, data.clientX);
        assert.equal(s.clientY, data.clientY);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, {
          type: 'cancel',
          clientX: 1,
          clientY: 2,
        } as const);
        ++emitCount;
      });
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      s.cancel();
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, function () {
      const s = new BaseSensor();
      const { clientX, clientY, isActive, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s.cancel();
      assert.equal(s.clientX, clientX);
      assert.equal(s.clientY, clientY);
      assert.equal(s.isActive, isActive);
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
        idA
      );

      const idB = 1;
      assert.equal(
        s.on('start', () => {}, idB),
        idB
      );

      const idC = 'foo';
      assert.equal(
        s.on('start', () => {}, idC),
        idC
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
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
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
      s['_start']({ type: 'start', clientX: 1, clientY: 2 });
      assert.equal(msg, 'bb');
    });
  });

  describe('destroy method', () => {
    it(`should (if drag is active):
          1. set isDestroyed property to true
          2. set isActive property to false
          3. emit "cancel" event with the current clientX/Y coordinates
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, function () {
      const s = new BaseSensor();
      const startArgs = { type: 'start', clientX: 1, clientY: 2 } as const;
      let events: string[] = [];
      s['_start'](startArgs);
      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('cancel', (data) => {
        assert.equal(s.clientX, startArgs.clientX);
        assert.equal(s.clientY, startArgs.clientY);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'cancel',
          clientX: startArgs.clientX,
          clientY: startArgs.clientY,
        } as const);
        events.push(data.type);
      });
      s.on('destroy', (data) => {
        assert.equal(s.clientX, startArgs.clientX);
        assert.equal(s.clientY, startArgs.clientY);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'destroy',
        } as const);
        events.push(data.type);
      });
      assert.equal(s['_emitter'].listenerCount(), 5);
      s.destroy();
      assert.equal(s.clientX, startArgs.clientX);
      assert.equal(s.clientY, startArgs.clientY);
      assert.equal(s.isActive, false);
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
        assert.equal(s.clientX, 0);
        assert.equal(s.clientY, 0);
        assert.equal(s.isActive, false);
        assert.equal(s.isDestroyed, true);
        assert.deepEqual(data, {
          type: 'destroy',
        } as const);
        events.push(data.type);
      });
      assert.equal(s['_emitter'].listenerCount(), 5);
      s.destroy();
      assert.equal(s.clientX, 0);
      assert.equal(s.clientY, 0);
      assert.equal(s.isActive, false);
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
      assert.equal(s.clientX, 0);
      assert.equal(s.clientY, 0);
      assert.equal(s.isActive, false);
      assert.equal(s.isDestroyed, true);
      assert.deepEqual(events, []);
    });
  });
});
