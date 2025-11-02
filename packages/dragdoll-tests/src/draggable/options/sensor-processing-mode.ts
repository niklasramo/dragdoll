import { Draggable } from 'dragdoll/draggable';
import { BaseSensor } from 'dragdoll/sensors/base';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('sensorProcessingMode', () => {
    defaultSetup();

    class SyncSensor extends BaseSensor {
      run(x0 = 0, y0 = 0, x1 = 10, y1 = 10) {
        this._start({ type: 'start', x: x0, y: y0 });
        this._move({ type: 'move', x: x1, y: y1 });
        this._end({ type: 'end', x: x1, y: y1 });
      }
    }

    it('sampled: preparestart, start, end', () => {
      const el = createTestElement();
      const sensor = new SyncSensor();
      const events: string[] = [];
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        sensorProcessingMode: 'sampled',
      });

      draggable.on('preparestart', () => events.push('preparestart'));
      draggable.on('start', () => events.push('start'));
      draggable.on('preparemove', () => events.push('preparemove'));
      draggable.on('move', () => events.push('move'));
      draggable.on('end', () => events.push('end'));

      sensor.run();

      expect(events).toStrictEqual(['preparestart', 'start', 'end']);

      draggable.destroy();
      sensor.destroy();
      el.remove();
    });

    it('immediate: preparestart, start, preparemove, move, end', () => {
      const el = createTestElement();
      const sensor = new SyncSensor();
      const events: string[] = [];
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        sensorProcessingMode: 'immediate',
      });

      draggable.on('preparestart', () => events.push('preparestart'));
      draggable.on('start', () => events.push('start'));
      draggable.on('preparemove', () => events.push('preparemove'));
      draggable.on('move', () => events.push('move'));
      draggable.on('end', () => events.push('end'));

      sensor.run();

      expect(events).toStrictEqual(['preparestart', 'start', 'preparemove', 'move', 'end']);

      draggable.destroy();
      sensor.destroy();
      el.remove();
    });
  });
};
