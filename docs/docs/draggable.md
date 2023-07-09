# Draggable

Draggable class acts as an orchestrator for any amount of sensors and moves DOM elements based on drag events emitted by sensors.

## Example

```ts
import {
  PointerSensor,
  KeyboardSensor,
  Draggable,
  createPointerSensorStartPredicate,
} from 'dragdoll';

const dragElement = document.querySelector('.dragElement');
const pointerSensor = new PointerSensor(dragElement);
const keyboardSensor = new KeyboardSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [dragElement],
  startPredicate: createPointerSensorStartPredicate(),
});
```

## Constructor

```ts
class Draggable {
  constructor(sensors: Sensor[], options?: Partial<DraggableSettings>) {}
}
```

The constuctor accepts two arguments: `sensors` and `options`. The first argument is an array of sensors that the Draggable will use as inputs for moving the draggable elements around. The sensors are required and can't be changed after Draggable instantiation. The second argument is an optional [DraggableSettings](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

Draggable settings is an object with the following properties.

### container

```ts
type container = HTMLElement | null;
```

The element the dragged elements should be appended to for the duration of the drag. If set to `null` the element's current parent element is used.

Default is `null`.

### startPredicate

```ts
type startPredicate = (data: {
  draggable: Draggable;
  sensor: Sensor;
  event: SensorStartEvent | SensorMoveEvent;
}) => boolean | undefined;
```

A function that determines if drag should start or not. An important thing to note is that each sensor attached to the draggable has their own start predicate state. So if you reject the predicate for sensorA then sensorB can still keep trying to resolve its start predicate. However, once any sensor's start predicate is resolved the other sensors' start predicates are automatically rejected.

Return:

- `true` to resolve the predicate and start drag.
- `false` to reject the predicate and prevent drag from starting during the sensor's current drag process.
- `undefined` to keep the predicate in pending state and try resolving it again after the next "move" event from the sensor.

Default is `() => true`.

### getElements

```ts
type getElements = (data: {
  draggable: Draggable;
  sensor: Sensor;
  startEvent: SensorStartEvent | SensorMoveEvent;
}) => HTMLElement[] | null;
```

A function that should return all the elements you want to move during the drag.

Default is `() => null`.

### releaseElements

```ts
type releaseElements = (data: {
  draggable: Draggable;
  sensor: Sensor;
  elements: HTMLElement[];
}) => void;
```

A clean up function that should handle disposing the dragged elements, if necessary. This function is called when drag ends.

Default is `() => {}`.

### getStartPosition

```ts
type getStartPosition = (data: {
  draggable: Draggable;
  sensor: Sensor;
  item: DraggableDragItem;
}) => {
  x: number;
  y: number;
};
```

A function that should return a dragged element's initial drag position. The value is stored to drag data and updated on sensor's events. Any container offsets, when the element is appended to drag container, are automatically added to the drag position. The drag position is provided to [`setPosition`](#setposition) function where you can apply the position to the element. In short, this function's return value is relative to your custom logic and only meaningful in the context of [`setPosition`](#setposition).

Default is a function that stores the element's current computed transform and returns `{ x: 0, y: 0 }`.

### setPosition

```ts
type setPosition = (data: {
  draggable: Draggable;
  sensor: Sensor;
  phase: 'start' | 'move' | 'end';
  item: DraggableDragItem;
  x: number;
  y: number;
}) => void;
```

A function that should apply the current drag position (`x` and `y` coordinates) to the provided dragged element. Note that you can build custom behaviour here and e.g. update the element's "left" and "top" CSS properties instead of the default "transform".

Default is a function that applies the `x` and `y` coordinates to the element's transform, while respecting the element's original transform value.

### getPositionChange

```ts
type getPositionChange = (data: {
  draggable: Draggable;
  sensor: Sensor;
  item: DraggableDragItem;
  event: SensorMoveEvent;
  prevEvent: SensorStartEvent | SensorMoveEvent;
  startEvent: SensorStartEvent | SensorMoveEvent;
}) => { x: number; y: number };
```

A function that should return the position change of a dragged element. This function is called on every "move" event emitted by the currently tracked sensor during drag. Note that you can get creative here and build any kind of custom logic (e.g. snap to grid) you might need.

Default is a function that returns the diff between (client) x and y coordinates of `event` and `prevEvent`.

## Properties

### sensors

```ts
type sensors = Sensor[];
```

An array of all the sensors attached to the Draggable instance. Read-only.

### settings

```ts
type settings = DraggableSettings;
```

Current settings ([DraggableSettings](#settings)) of the Draggable instance. Read-only.

### drag

```ts
type drag = DraggableDrag | null;

type DraggableDrag = {
  // The sensor that is tracked for this drag process.
  readonly sensor: Sensor | null;
  // Has drag started?
  readonly isStarted: boolean;
  // Has drag ended?
  readonly isEnded: boolean;
  // The sensor event that initiated drag.
  readonly startEvent: SensorStartEvent | SensorMoveEvent | null;
  // The next/current sensor move event.
  readonly nextMoveEvent: SensorMoveEvent | null;
  // Previous sensor move event.
  readonly prevMoveEvent: SensorMoveEvent | null;
  // The sensor event that ended drag.
  readonly endEvent: SensorEndEvent | SensorCancelEvent | SensorDestroyEvent | null;
  // Drag items constructed from the drag elements as provided via getElements
  // option.
  readonly items: DraggableDragItem[];
};

type DraggableDragItem = {
  // Drag element.
  readonly element: HTMLElement;
  // Element's original parent node before the drag starts.
  readonly rootParent: HTMLElement;
  // rootParent's containing block.
  readonly rootContainingBlock: HTMLElement | Document;
  // Element's parent node during the drag.
  readonly dragParent: HTMLElement;
  // dragParent's containing block.
  readonly dragContainingBlock: HTMLElement | Document;
  // Element's current position relative to the viewport (a.k.a. client position).
  readonly x: number;
  readonly y: number;
  // Element's internal position during the drag. By default this reflects the
  // element's translate position.
  readonly pX: number;
  readonly pY: number;
};
```

Current drag data or `null` if drag is not active.

### plugins

```ts
type plugins = Record<
  string,
  {
    name: string;
    version: string;
  }
>;
```

An object containing all of the Draggable instance's plugins.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Is the Draggable instance destroyed or not?

## Methods

### on

```ts
// Type
type on = (
  eventName: 'beforestart' | 'start' | 'beforemove' | 'move' | 'beforeend' | 'end' | 'destroy',
  listener: (e: SensorEvent | null | undefined) => void,
  listenerId?: string | number | symbol,
) => string | number | symbol;

// Usage
draggable.on('start', (e) => {
  console.log('start', e);
});
```

Adds an event listener to the Draggable instance.

The listener function receives sensor event as it's argument based on the sensor event that instigated this event. For some events the listener might receive `null` or `undefined` as argument.

The last optional argument is the listener id, which is normally created automatically, but can be provided here manually too.

The method returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = (
  eventName: 'beforestart' | 'start' | 'beforemove' | 'move' | 'beforeend' | 'end' | 'destroy',
  target: Function | string | number | symbol,
) => void;

// Usage
const id = draggable.on('start', (e) => console.log('start', e));
draggable.off('start', id);
```

Removes a listener (based on listener or listener id) from an event. The first argument is the event name and the second argument is either the listener function or listener id.

### stop

```ts
// Type
type stop = () => void;

// Usage
draggable.stop();
```

Forcefully stops the draggable's current drag process.

### updatePosition

```ts
// Type
type updatePosition = (instant = false) => void;

// Usage: update asynchronously on the next animation frame (no extra reflows, jank-free).
draggable.updatePosition();

// Usage: update instantly (causes extra reflows which may cause jank).
draggable.updatePosition(true);
```

Forcefully recomputes the positions and offsets of all dragged elements. This should be called if the positions/offsets of the dragged elements or any of their ancestors change during drag. Draggable is smart enough to call this automatically when scrolling occurs during dragging, but if you manually change dimensions or positions of any element that affects the position/size of a dragged element you should call this manually.

By default the synchronization happens asynchronously in the next frame, but you can force it to happen instantly by providing `true` as the first argument. Note that there might be performance implications if you update instantly (in the form of extra reflows).

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<DraggableSettings>) => void;

// Usage
draggable.updateSettings({
  startPredicate: () => Math.random() > 0.5,
});
```

Updates the the draggable's settings. Accepts [DraggableSettings](#settings) as the first argument, only the options you provide will be updated.

### use

```ts
// Type
type use = (plugin: (draggable: Draggable) => Draggable) => Draggable;

// Usage
const draggable = new Draggable(
  [
    // Sensors here...
  ],
  {
    // Options here...
  },
)
  // Plugins here...
  .use(myPlugin)
  .use(myOtherlugin);
```

Registers a plugin to the Draggable instance. Returns the Draggable instance so you can chain the method and get updated typings for the instance based on how the plugin(s) extend the Draggable type.

The plugin system is designed to be used so that you register the plugins right away when you instantiate the Draggable. This way you'll get the correct typings to the variable holding the instance. Also, there's no mechanism to unregister a plugin because there really should be no need for that.

Check out the [plugin guide](#creating-plugins) to learn how to build custom plugins.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
draggable.destroy();
```

Destroy the draggable. Disposes all allocated memory and removes all bound event listeners.

## Creating Plugins

Draggable has a very simple plugin system, which allows you to extend the default functionality. Plugins are added to a Draggable instance via [`use`](#use) method, one by one, preferably at the same time when instantiating the Draggable.

Note that you can't remove a plugin from a Draggable instance and can't add a plugin with the same name twice. If your plugin depends on a specific version of a specific plugin you need to do the checking manually yourself during plugin instantiation and e.g. throw and error if conditions are not met. All the plugins are added to [draggable.plugins](#plugins) property, which you can use to do such checking.

Let's build an example plugin, which logs draggable events based on options we provide it:

```ts
import { Draggable, KeyboardSensor, Sensor } from 'dragdoll';

const DRAGGABLE_EVENTS = [
  'beforestart',
  'start',
  'beforemove',
  'move',
  'beforeend',
  'end',
  'destroy',
] as const;

type LoggerPluginOptions = {
  events?: (typeof DRAGGABLE_EVENTS)[number][];
};

// The actual plugin is wrapped in a function via which we can pass user
// options to the plugin.
function loggerPlugin<S extends Sensor[], E extends S[number]['events']>(
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
    events.forEach((eventName) => {
      draggable.on(eventName, (e: any) => console.log(e));
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
const dragElement = document.querySelector('.dragElement');
const keyboardSensor = new KeyboardSensor();
const draggable = new Draggable([keyboardSensor], {
  getElements: () => [dragElement],
}).use(loggerPlugin({ events: ['start', 'end'] }));

// You can also access the logger plugin instance any time you want.
console.log(draggable.plugins.logger.name);
```
