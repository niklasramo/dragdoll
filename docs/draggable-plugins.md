[Draggable](/draggable) →

# Draggable Plugins

Draggable has a very simple plugin system, which allows you to extend the default functionality. Plugins are added to a Draggable instance via [`use`](/draggable#use) method, one by one, preferably at the same time when instantiating the Draggable.

Note that you can't remove a plugin from a Draggable instance and can't add a plugin with the same name twice. If your plugin depends on a specific version of a specific plugin you need to do the checking manually yourself during plugin instantiation and e.g. throw and error if conditions are not met. All the plugins are added to [`draggable.plugins`](/draggable#plugins) property, which you can use to do such checking.

Let's build an example plugin, which logs draggable events based on options we provide it:

```ts
import { Draggable, KeyboardSensor, Sensor } from 'dragdoll';

const DRAGGABLE_EVENTS = [
  'preparestart',
  'start',
  'preparemove',
  'move',
  'end',
  'destroy',
] as const;

type LoggerPluginOptions = {
  events?: (typeof DRAGGABLE_EVENTS)[number][];
};

// The actual plugin is wrapped in a function via which we can pass user
// options to the plugin.
function loggerPlugin<S extends Sensor[], E extends S[number]['_events_type']>(
  options: LoggerPluginOptions = {},
) {
  // This is the actual Draggable plugin, a function which:
  // 1. Receives the Draggable instance as it's argument.
  // 2. Creates the plugin instance and adds it to the draggable.plugins
  //    object.
  // 3. Listens to Draggable instance's events and does whatever else it needs
  //    to implement the plugin functionality.
  // 4. Extends the Draggable instance's type in any way that's needed.
  // 5. Returns the extended Draggable instance.
  return (draggable: Draggable<S, E>) => {
    // Create the plugin instance.
    const pluginInstance = {
      name: 'logger',
      version: '1.0.0',
    } as const;

    // In case our plugin depended on some other plugin we could check it's
    // existence here.
    /*
    const fooPlugin = draggable.plugins['foo'];
    if (!fooplugin || fooPlugin.version < '1.0.0') {
      throw new Error('logger plugin requires foo plugin v1.0.0 or newer');
    }
    */

    // Let's listen to the provided events and log the event object.
    const { events = [] } = options;
    events.forEach((eventType) => {
      draggable.on(eventType, (e: any) => console.log(e));
    });

    // If you need to dispose anything when e.g. the Draggable is destroyed
    // you can do it via the events. Note that Draggable automatically removes
    // all listeners on destroy so you don't have to do that explicitly.
    draggable.on('destroy', () => {
      // Dispose anything you need.
    });

    // Extend the Draggable instance's type to include this plugin in it.
    // Note that you can extend the Draggable type in other ways too here, e.g.
    // add new properties or whatever your is needed for your plugin.
    const extendedDraggable = draggable as typeof draggable & {
      plugins: { [pluginInstance.name]: typeof pluginInstance };
    };

    // Add the plugin to the Draggable instance.
    extendedDraggable.plugins[pluginInstance.name] = pluginInstance;

    // Finally, return the extended Draggable instance.
    return extendedDraggable;
  };
}

// Now let's put the plugin to use.
const element = document.querySelector('.draggable') as HTMLElement;
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable([keyboardSensor], {
  elements: () => [element],
}).use(loggerPlugin({ events: ['start', 'end'] }));

// You can also access the logger plugin instance any time you want.
console.log(draggable.plugins.logger.name);
```
