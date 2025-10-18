import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function methodDestroy() {
  describe('destroy', () => {
    it(`should (if drag is active):
       1. set isDestroyed property to true
       2. emit "cancel" event with the current x/y coordinates
       3. reset drag data
       4. emit "destroy" event
       5. remove all listeners from the internal emitter`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      const msgs: string[] = [];
      s.on('cancel', () => void msgs.push('cancel'));
      s.on('destroy', () => void msgs.push('destroy'));
      s.destroy();
      assert.equal(s.isDestroyed, true);
      assert.equal(s.drag, null);
      assert.deepEqual(msgs, ['cancel', 'destroy']);
    });

    it(`should (if drag is not active):
       1. set isDestroyed property to true
       2. emit "destroy" event
       3. remove all listeners from the internal emitter`, () => {
      const s = new BaseSensor();
      const msgs: string[] = [];
      s.on('cancel', () => void msgs.push('cancel'));
      s.on('destroy', () => void msgs.push('destroy'));
      s.destroy();
      assert.equal(s.isDestroyed, true);
      assert.equal(s.drag, null);
      assert.deepEqual(msgs, ['destroy']);
    });

    it(`should not do anything if the sensor is already destroyed`, () => {
      const s = new BaseSensor();
      s.destroy();
      const { drag, isDestroyed } = s;
      s.destroy();
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
    });
  });
}
