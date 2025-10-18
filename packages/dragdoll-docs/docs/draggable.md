# Draggable

Draggable class acts as an orchestrator for any amount of sensors and moves DOM elements based on drag events emitted by sensors.

## Example

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
});
```

## Constructor

```ts
class Draggable {
  constructor(sensors: Sensor[], options?: Partial<DraggableSettings> & { id?: DraggableId }) {}
}
```

### Parameters

1. **sensors**
   - An array of [sensors](/sensor) that the Draggable will use as inputs for moving the provided elements around. The sensors are required and can't be changed after instantiation.

2. **options**
   - An optional [`DraggableSettings`](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method. You only need to provide the options you want to change, the rest will be left as default.
   - You can also provide an `id` option, which is the unique identifier for the draggable. A string, number, or symbol. Defaults to a unique symbol. Note that you can't change the id after instantiation, but you can read it anytime from the `draggable.id` property.

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

A function that should apply the current [`position`](/draggable-drag-item#position) to a dragged [`element`](/draggable-drag-item#element).

Default is a (very involved) function that applies the position, container offset, alignment offset and matrix transform offsets the element's transform property, while respecting the element's original transform and transform origin.

Also note that the `phase` argument is provided to the function to help you determine what phase of the drag process you are in:

- `start`: Called when the drag starts.
- `start-align`: Called during the start process after `start` phase if the element is moved within a drag container AND the drag container and the element container have different world matrices.
- `move`: Called on every "move" event emitted by the currently tracked sensor during the drag.
- `align`: Called when the element's position is realigned (via [`align`](#align) method).
- `end`: Called when the drag ends.
- `end-align`: Called after the `end` phase if the element was moved back to the original container from the drag container AND the element's position needs to be realigned to match the current client position.

### computeClientRect

```ts
type computeClientRect = (data: {
  draggable: Draggable;
  drag: DraggableDrag;
}) => Readonly<Rect> | null;
```

A function that should return the current bounding client rectangle of the draggable during drag operations. This rectangle is used for collision detection, auto-scrolling, and other features that need to know the draggable's current bounds.

The returned rectangle should have the following properties:

- `x`: The x-coordinate of the rectangle's left edge
- `y`: The y-coordinate of the rectangle's top edge
- `width`: The width of the rectangle
- `height`: The height of the rectangle

**When to customize:** You might want to customize this function when:

- You're dragging multiple elements and want to use a specific element's bounds
- You want to use a custom bounding area (e.g., smaller or larger than the actual element)
- You're implementing custom collision detection logic
- You need to account for transforms or scaling that affect the visual bounds

**Example:**

```ts
const draggable = new Draggable([pointerSensor], {
  elements: () => [element1, element2, element3],
  // Use the bounds of the second element instead of the first
  computeClientRect: ({ drag }) => {
    const secondItem = drag.items[1];
    return secondItem?.clientRect || null;
  },
});

// The draggable's client rect can be accessed anytime during drag
draggable.on('move', () => {
  const rect = draggable.getClientRect();
  console.log('Current draggable bounds:', rect);
});
```

**Default behavior:** By default, this returns the [`clientRect`](/draggable-drag-item#clientrect) of the first drag item, or `null` if no items exist.

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

An array of position modifier functions that should return the position change of a dragged element. Checkout the [Draggable Modifiers](/draggable-modifiers) page for detailed information.

### sensorProcessingMode

```ts
type DraggableSensorProcessingMode = 'sampled' | 'immediate';

type sensorProcessingMode = DraggableSensorProcessingMode;
```

Defines how the sensor events should be processed.

- `'sampled'`: Upon receiving a "start" or "move" event from a sensor, the Draggable will schedule a task to process the event during the next tick. If another "start" or "move" event is received before the next tick Draggable will discard the previous event and process the latest event instead during the next tick. This method of "sampling" the sensor events is highly useful to avoid redundant work and layout thrashing, but there may be edge cases where you might want to use the immediate mode instead.
- `'immediate'`: The sensor events are processed immediately (synchronously) as they are emitted. This might cause performance issues (layout thrashing to be specific) if the sensor events are emitted too frequently.

Default is `'sampled'`.

### dndGroups

```ts
type DraggableDndGroup = string | number | symbol;
type dndGroups = Set<DraggableDndGroup>;
```

A set of identifiers used by [`DndContext`](/dnd-context) when matching a `Draggable` to [`Droppable`](/droppable).

If a `Droppable` includes any of these identifiers in its [`accept`](/droppable#accept) set, the `Draggable` will be matched to the `Droppable` and there will be collision detection enabled between the two.

Default is an empty set.

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

### id

```ts
type id = string | number | symbol;
```

The unique identifier for this draggable. Defaults to a unique symbol. Read-only.

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

Check out the [events](#events) section for more information.

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

Forcibly stops the draggable's current drag process.

> [!IMPORTANT]  
> You can't call this method within the `preparestart` or `start` event listeners nor within the `onPrepareStart` or `onStart` callbacks. An error will be thrown if you try to do so. The reason for this is that the drag start process can't be interrupted during the prepare/apply phases. You can call this method before, after and between those phases though.

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

### getClientRect

```ts
// Type
type getClientRect = () => Readonly<Rect> | null;

// Usage
const rect = draggable.getClientRect();
if (rect) {
  console.log(`Draggable is at ${rect.x}, ${rect.y} with size ${rect.width}x${rect.height}`);
}
```

Returns the current bounding client rectangle of the draggable during drag operations, or `null` if no drag is active. This method uses the [`computeClientRect`](#computeclientrect) setting to determine the rectangle.

This method is commonly used by:

- Collision detection systems
- Auto-scroll plugins
- Custom drag logic that needs to know the draggable's current bounds

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<DraggableSettings>) => void;

// Usage
draggable.updateSettings({
  startPredicate: () => Math.random() > 0.5,
});
```

Updates the the draggable's settings. Accepts [`DraggableSettings`](#settings) as the first argument, only the options you provide will be updated. Note that you only need to provide the options you want to change, the rest will be left as default.

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

Check out the [plugin guide](/draggable-plugins) to learn how to build custom plugins.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
draggable.destroy();
```

Destroy the draggable. Disposes all allocated memory and removes all bound event listeners.

## Events

These are all the events that the Draggable instance can emit via the [`on`](#on) method.

The listener functions receive the sensor event that triggered the Draggable event. See the [Sensor](/sensor) docs for the exact event shapes.

### preparestart

```ts
// Type
type preparestart = (event: SensorStartEvent | SensorMoveEvent) => void;
```

Emitted at the end of the drag start preparation phase, just before the [`onPrepareStart`](#onpreparestart) callback is called.

The start preparation phase is called during the write phase of the ticker and it's intended for doing all the necessary DOM reads and computations for the drag start. You should avoid doing any DOM writes in this phase as that would cause layout thrashing.

- **Event Data**:
  - `event` — Sensor event that resolved the start predicate (`'start'` or `'move'`)

### start

```ts
// Type
type start = (event: SensorStartEvent | SensorMoveEvent) => void;
```

Emitted at the end of the drag start apply phase, just before the [`onStart`](#onstart) callback is called.

The start apply phase is called during the write phase of the ticker and it's intended for applying the initial positions to the dragged elements, applying the frozen styles and other initial setup that require writing to the DOM. You should avoid doing any DOM reads in this phase as that would cause layout thrashing.

- **Event Data**:
  - `event` — Sensor event that initiated the drag (`'start'` or `'move'`)

### preparemove

```ts
// Type
type preparemove = (event: SensorMoveEvent) => void;
```

Emitted at the end of the drag move preparation phase, just before the [`onPrepareMove`](#onpreparemove) callback is called.

The move preparation phase is called during the read phase of the ticker and it's intended for computing the new position of the dragged elements based on the sensor data. You should avoid doing any DOM writes in this phase as that would cause layout thrashing.

- **Event Data**:
  - `event` — Sensor move event

### move

```ts
// Type
type move = (event: SensorMoveEvent) => void;
```

Emitted at the end of the drag move apply phase, just before the [`onMove`](#onmove) callback is called.

The move apply phase is called during the write phase of the ticker and it's intended for applying the new positions to the dragged elements. You should avoid doing any DOM reads in this phase as that would cause layout thrashing.

- **Event Data**:
  - `event` — Sensor move event

### end

```ts
// Type
type end = (event: SensorEndEvent | SensorCancelEvent | SensorDestroyEvent | null) => void;
```

Emitted at the end of the drag end procedure, just before the [`onEnd`](#onend) callback is called.

The end procedure is called synchronously after the drag ends and it's intended for doing all the necessary cleanup after the drag ends. It's not bound to any phase of the ticker and it's called immediately after the drag ends.

- **Event Data**:
  - `event` — Sensor end/cancel/destroy event. The only time the `event` argument will be `null` is if the drag was stopped programmatically using [`stop`](#stop) method without a sensor event.

### destroy

```ts
// Type
type destroy = () => void;
```

Emitted when the Draggable instance is destroyed via [`destroy`](#destroy) method.
