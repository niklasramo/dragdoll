import { Draggable } from 'dragdoll/draggable';
import { Sensor } from 'dragdoll/sensors';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('use', () => {
    defaultSetup();

    it('should register a plugin', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      function testPlugin<S extends Sensor[]>() {
        return (_draggable: Draggable<S>) => {
          // Create the plugin instance.
          const pluginInstance = {
            name: 'test',
            version: '1.0.0',
          } as const;

          // Extend the Draggable instance's type to include this plugin in it.
          const extendedDraggable = _draggable as typeof _draggable & {
            plugins: { [pluginInstance.name]: typeof pluginInstance };
          };

          // Add the plugin to the Draggable instance.
          extendedDraggable.plugins[pluginInstance.name] = pluginInstance;

          // Finally, return the extended Draggable instance.
          return extendedDraggable;
        };
      }

      const draggableWithPlugin = draggable.use(testPlugin());

      expect(draggableWithPlugin.plugins.test.name).toBe('test');
      expect(draggableWithPlugin.plugins.test.version).toBe('1.0.0');

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
