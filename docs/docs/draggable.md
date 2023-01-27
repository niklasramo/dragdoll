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

### getElementStartPosition

```ts
type getElementStartPosition = (data: {
  draggable: Draggable;
  sensor: Sensor;
  element: HTMLElement;
}) => {
  x: number;
  y: number;
};
```

A function that should return a dragged element's initial drag position. The value is stored to drag data and updated on sensor's events. Any container offsets, when the element is appended to drag container, are automatically added to the drag position. The drag position is provided to [`setElementPosition`](#setelementposition) function where you can apply the position to the element. In short, this function's return value is relative to your custom logic and only meaningful in the context of [`setElementPosition`](#setelementposition).

Default is a function that stores the element's current computed transform and returns `{ x: 0, y: 0 }`.

### setElementPosition

```ts
type setElementPosition = (data: {
  phase: 'start' | 'move' | 'end';
  draggable: Draggable;
  sensor: Sensor;
  element: HTMLElement;
  x: number;
  y: number;
}) => void;
```

A function that should apply the current drag position (`x` and `y` coordinates) to the provided dragged element. Note that you can build custom behaviour here and e.g. update the element's "left" and "top" CSS properties instead of the default "transform".

Default is a function that applies the `x` and `y` coordinates to the element's transform, while respecting the element's original transform value.

### getElementPositionChange

```ts
type getElementPositionChange = (data: {
  draggable: Draggable;
  sensor: Sensor;
  element: HTMLElement;
  event: SensorMoveEvent;
  prevEvent: SensorStartEvent | SensorMoveEvent;
  startEvent: SensorStartEvent | SensorMoveEvent;
}) => { x: number; y: number };
```

A function that should return the position change of a dragged element. This function is called on every "move" event emitted by the currently tracked sensor during drag. Note that you can get creative here and build any kind of custom logic (e.g. snap to grid) you might need.

Default is a function that returns the diff between event.clientX/Y and prevEvent.clientX/Y.

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
type drag = DraggableDragData | null;

type DraggableDragData = {
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
  // Custom data object you can use to store temporary data for the duration of
  // the drag.
  extraData: { [key: string]: any };
};

type DraggableDragItem = {
  // Drag element.
  readonly element: HTMLElement | null;
  // Element's original parent node before the drag starts.
  readonly rootParent: HTMLElement | null;
  // rootParent's containing block.
  readonly rootContainingBlock: HTMLElement | Document | null;
  // Element's parent node during the drag.
  readonly dragParent: HTMLElement | null;
  // dragParent's containing block.
  readonly dragContainingBlock: HTMLElement | Document | null;
  // Element's internal position during the drag.
  readonly x: number;
  readonly y: number;
  // Element's current position relative to the viewport.
  readonly clientX: number;
  readonly clientY: number;
  // Internal data you should not care about.
  readonly syncDiffX: number;
  readonly syncDiffY: number;
  readonly moveDiffX: number;
  readonly moveDiffY: number;
  readonly containerDiffX: number;
  readonly containerDiffY: number;
};
```

Current drag data or `null` if drag is not active.

### plugins

```ts
type plugins = Map<
  string,
  {
    name: string;
    version: string;
    [key: string]: any;
  }
>;
```

A map of Draggable instance's plugins.

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
  listenerId?: string | number | symbol
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
  target: Function | string | number | symbol
) => void;

// Usage
const id = draggable.on('start', (e) => console.log('start', e));
draggable.off('start', id);
```

Removes a listener (based on listener or listener id) from an event. The first argument is the event name and the second argument is either the listener function or listener id.

### synchronize

```ts
// Type
type synchronize = (syncImmediately?: boolean) => void;

// Usage: synchronize asynchronously.
draggable.synchronize();

// Usage: synchronize immediately.
draggable.synchronize(true);
```

Forcefully synchronizes the dragged elements' positions and offsets. This should be called if the dragged elements' positions/offsets might have been affected outside of the Draggable instance.

By default the synchronization happens asynchronously in the next frame, but you can force it to happen immediately by providing `true` as the first argument. Note that there might be performance implications if you synchronize immediately in the form of reflow.

### stop

```ts
// Type
type stop = () => void;

// Usage
draggable.stop();
```

Forcefully stops the draggable's current drag process.

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
type use = (plugin: DraggablePlugin) => Draggable;

type DraggablePlugin = (draggable: Draggable) => {
  name: string;
  version: string;
  [key: string]: any;
};

// Usage
draggable.use(myPlugin).use(myOtherlugin);
```

Registers a plugin to the Draggable instance. Returns the Draggable instance so you can chain the method. Check out the [plugin guide](#creating-plugins) to learn how to build custom plugins.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
draggable.destroy();
```

Destroy the draggable. Disposes all allocated memory and removes all bound event listeners.

## Creating Plugins

Draggable has a very simple plugin system, which allows you to extend the default functionality. Plugins are added to a Draggable instance via [`use`](#use) method, one by one.

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
  events?: typeof DRAGGABLE_EVENTS[number][];
};

// The actual plugin is wrapped in a function via which we can pass user
// options to the plugin.
function loggerPlugin<S extends Sensor[], E extends S[number]['events']>(
  options: LoggerPluginOptions = {}
) {
  // This is the actual Draggable plugin, a function that receives the
  // Draggable instance as it's argument, and which should return plugin data
  // object, which Draggable then uses to register in it's plugins list.
  return (draggable: Draggable<S, E>) => {
    // Here we can define the actual logic of the plugin. We now have access
    // to both the options and the Draggable instance, and can build our logic
    // based on the data.

    // In case our plugin depended on some other plugin we could check it's
    // existence here.
    /*
    const fooPlugin = draggable.plugins.get('foo');
    if (!fooplugin || fooPlugin.version < '1.0.0') {
      throw new Error('logger plugin requires foo plugin v1.0.0 or newer');
    }
    */

    // Let's listen to the provided events and log the event object.
    const { events = [] } = options;
    events.forEach((eventName) => {
      draggable.on(eventName, (e: any) => console.log(e));
    });

    // If you need to dispose anything when e.g. the draggable is destroyed
    // you can do it via the events. Note that Draggable automatically removes
    // all listeners on destroy so you don't have to do that explicitly.
    draggable.on('destroy', () => {
      // Dispose anything you need.
    });

    // Finally we return the minimum required data for the plugin so Draggable
    // can add it to the list of plugins. This object can have other properties
    // too or it can be a class instance, the choice is yours.
    return {
      name: 'logger',
      version: '1.0.0',
    };
  };
}

// Now let's put the plugin to use.
const dragElement = document.querySelector('.dragElement');
const keyboardSensor = new KeyboardSensor();
const draggable = new Draggable([keyboardSensor], {
  getElements: () => [dragElement],
}).use(loggerPlugin({ events: ['start', 'end'] }));
```
