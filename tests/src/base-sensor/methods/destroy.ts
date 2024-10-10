import { assert } from 'chai';
import { BaseSensor } from '../../../../src/index.js';

export function methodDestroy() {
  describe('destroy', () => {
    it(`should (if drag is active):
          1. set isDestroyed property to true
          2. emit "cancel" event with the current x/y coordinates
          3. reset drag data
          4. emit "destroy" event
          5. remove all listeners from the internal emitter
       `, () => {
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
       `, () => {
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
}
