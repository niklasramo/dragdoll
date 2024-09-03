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
  elements: () => [dragElement],
  startPredicate: createPointerSensorStartPredicate(),
});
```

## Constructor

```ts
class Draggable {
  constructor(sensors: Sensor[], options?: Partial<DraggableSettings>) {}
}
```

The constuctor accepts two arguments: `sensors` and `options`. The first argument is an array of sensors that the Draggable will use as inputs for moving the draggable elements around. The sensors are required and can't be changed after Draggable instantiation. The second argument is an optional [`DraggableSettings`](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

Draggable settings is an object with the following properties.

### container

```ts
type container = HTMLElement | null;
```

The element the dragged elements should be appended to for the duration of the drag. If set to `null` the element's current parent element is used.

Default is `null`.

::: info
When using a custom container, the dragged element must be either `absolute` or `fixed` positioned. You can overcome this limitation by changing the element's CSS position to `absolute` or `fixed` just before the drag starts (e.g. using [`elements`](#elements)) and then back to the original position after the drag ends. Additionally you will need to offset the element's position to match the original position before the drag starts, e.g. by using `transform: translate(x, y)`.
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

### elements

<!-- prettier-ignore -->
```ts
type elements = (data: {
  draggable: Draggable;
  drag: DraggableDrag;
}) => HTMLElement[] | null;
```

A function that should return all the elements you want to move during the drag.

Default is `() => null`.

### frozenStyles

```ts
type frozenStyles: (data: {
    draggable: Draggable;
    drag: DraggableDrag;
    item: DraggableDragItem;
    style: CSSStyleDeclaration;
  }) =>  string[] | {[key: string]: string} | null;
```

A function that should return the an array of CSS properties that should be frozen during the drag. By "frozen" we mean that the current computed value of the property is stored and applied to the element's inline styles during the drag. This is usually only needed if you have a drag container and the dragged element has percentage based values for some of it's properties. The frozen properties are automatically unfrozen (restored to the original values) when drag ends.

You can also return an object with key-value pairs where the key is the CSS property you want to freeze and the value is the explicit value you want it to be frozen to. This is useful if you want to freeze a property to a specific value instead of the current computed value.

By default nothing is frozen.

### applyPosition

```ts
type applyPosition = (data: {
  draggable: Draggable;
  drag: DraggableDrag;
  item: DraggableDragItem;
  phase: 'start' | 'start-align' | 'move' | 'align' | 'end' | 'end-align';
}) => void;
```

A function that should apply the current [`position`](/docs/draggable-drag-item#position) to a dragged [`element`](/docs/draggable-drag-item#element).

Default is a (very involved) function that applies the position, container offset, alignment offset and matrix transform offsets the element's transform property, while respecting the element's original transform and transform origin.

Also note that the `phase` argument is provided to the function to help you determine what phase of the drag process you are in:

- `start`: Called when the drag starts.
- `start-align`: Called during the start process after `start` phase if the element is moved within a drag container AND the drag container and the element container have different world matrices.
- `move`: Called on every "move" event emitted by the currently tracked sensor during the drag.
- `align`: Called when the element's position is realigned (via [`align`](#align) method).
- `end`: Called when the drag ends.
- `end-align`: Called after the `end` phase if the element was moved back to the original container from the drag container AND the element's position needs to be realigned to match the current client position.

### positionModifiers

```ts
type DraggableModifier = (
  change: { x: number; y: number },
  data: {
    draggable: Draggable;
    drag: DraggableDrag;
    item: DraggableDragItem;
    phase: 'start' | 'move' | 'end';
  },
) => { x: number; y: number };

type positionModifiers = DraggableModifier[];
```

An array of position modifier functions that should return the position change of a dragged element. Checkout the [Draggable Modifiers](/docs/draggable-modifiers) page for detailed information.

### onPrepareStart

```ts
type onPrepareStart = (drag: DraggableDrag, draggable: Draggable) => void;
```

A callback that is called at the end of drag start preparation phase. In this phase the draggable item instances are created and the initial position is computed. All the required DOM reading (for drag start) is also done in this phase.

This callback is called immediately _after_ any `preparestart` events that are added via [`on`](#on) method.

### onStart

```ts
type onStart = (drag: DraggableDrag, draggable: Draggable) => void;
```

A callback that is called at the end of drag start phase. This phase handles applying the initial positions to the dragged elements, setting up the frozen styles and any other initial setup that require writing to the DOM.

This callback is called immediately _after_ any `start` events that are added via [`on`](#on) method.

### onPrepareMove

```ts
type onPrepareMove = (drag: DraggableDrag, draggable: Draggable) => void;
```

A callback that is called at the end of drag move preparation phase. This phase handles computing the new position of the dragged elements based on the sensor data.

This callback is called immediately _after_ any `preparemove` events that are added via [`on`](#on) method.

### onMove

```ts
type onMove = (drag: DraggableDrag, draggable: Draggable) => void;
```

A callback that is called at the end of drag move phase. This phase applies the new positions to the dragged elements.

This callback is called immediately _after_ any `move` events that are added via [`on`](#on) method.

### onEnd

```ts
type onEnd = (drag: DraggableDrag, draggable: Draggable) => void;
```

A callback that is called at the very end of drag process after all the required cleanup has been done. You will still have access to the drag data when this callback is called, but it will be removed from the draggable instance right after this callback.

This callback is called immediately _after_ any `end` events that are added via [`on`](#on) method.

### onDestroy

```ts
type onDestroy = (draggable: Draggable) => void;
```

A callback that is called when the draggable is destroyed via [`destroy`](#destroy) method. This is the last callback that is called before the draggable instance is completely disposed. If there is an active drag when the draggable is destroyed, the [`onEnd`](#onend) callback will be called before this callback.

This callback is called immediately _after_ any `destroy` events that are added via [`on`](#on) method.

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

Current [`settings`](#settings) of the Draggable instance. Read-only.

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

Updates the the draggable's settings. Accepts [`DraggableSettings`](#settings) as the first argument, only the options you provide will be updated.

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

Check out the [plugin guide](/docs/draggable-plugins) to learn how to build custom plugins.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
draggable.destroy();
```

Destroy the draggable. Disposes all allocated memory and removes all bound event listeners.
