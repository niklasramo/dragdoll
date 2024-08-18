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

::: info
When using a custom container, the dragged element must be either `absolute` or `fixed` positioned. You can overcome this limitation by changing the element's CSS position to `absolute` or `fixed` just before the drag starts ([`getElements`](#getelements)) and then back to the original position after the drag ends ([`releaseElements`](#releaseelements)). Additionally you will need to offset the element's position to match the original position before the drag starts, e.g. by using `transform: translate(x, y)`.
:::

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

### getFrozenProps

```ts
type getFrozenProps: (data: {
    draggable: Draggable;
    sensor: S[number];
    item: DraggableDragItem;
    style: CSSStyleDeclaration;
  }) =>  string[] | {[key: string]: string} | null;
```

A function that should return the an array of CSS properties that should be frozen during the drag. By "frozen" we mean that the current computed value of the property is stored and applied to the element's inline styles during the drag. This is usually only needed if you have a drag container and the dragged element has percentage based values for some of it's properties. The frozen properties are automatically unfrozen (restored to the original values) when drag ends.

You can also return an object with key-value pairs where the key is the CSS property you want to freeze and the value is the explicit value you want it to be frozen to. This is useful if you want to freeze a property to a specific value instead of the current computed value.

By default nothing is frozen.

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
  phase: 'start' | 'move' | 'end' | 'align' | 'start-align';
  item: DraggableDragItem;
  x: number;
  y: number;
}) => void;
```

A function that should apply the current drag position (`x` and `y` coordinates) to the provided dragged element. Note that you can build custom behaviour here and e.g. update the element's "left" and "top" CSS properties instead of the default "transform".

Default is a function that applies the `x` and `y` coordinates to the element's transform, while respecting the element's original transform value.

Also note that the `phase` argument is provided to the function to help you determine what phase of the drag process you are in:

- `start`: Called when the drag starts.
- `move`: Called on every "move" event emitted by the currently tracked sensor.
- `end`: Called when the drag ends.
- `align`: Called when the element's position is realigned via [`align`](#align) method.
- `start-align`: Called (if needed) during the drag start phase as an additional step after `start` phase.

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

Current [settings](#settings) of the Draggable instance. Read-only.

### drag

```ts
type drag = DraggableDrag | null;
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
  type: 'preparestart' | 'start' | 'preparemove' | 'move' | 'end' | 'destroy',
  listener: (e: SensorEvent | null | undefined) => void,
  listenerId?: ListenerId,
) => ListenerId;

type ListenerId = null | string | number | symbol | Function | Object;

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
  type: 'preparestart' | 'start' | 'preparemove' | 'move' | 'end' | 'destroy',
  listenerId: null | string | number | symbol | Function | Object,
) => void;

// Usage
const id = draggable.on('start', (e) => console.log('start', e));
draggable.off('start', id);
```

Removes a listener (based on listener id) from an event. The first argument is the event type and the second argument is the listener id.

### stop

```ts
// Type
type stop = () => void;

// Usage
draggable.stop();
```

Forcefully stops the draggable's current drag process.

### align

```ts
// Type
type align = (instant?: boolean) => void;

// Usage: update asynchronously on the next animation frame.
draggable.align();

// Usage: update instantly. May cause extra reflows (jank).
draggable.align(true);
```

Recomputes the positions of all dragged elements if they have drifted due to e.g. scrolling. This should be called if a dragged element's position goes out of sync inadvertently. Draggable is smart enough to call this automatically when scrolling occurs during dragging, but if you need to realign the elements manually you can call this method.

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
