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

## Class

```ts
class Draggable<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}> {
  constructor(sensors: S, options: DraggableOptions<S> = {}) {}
}
```

### Type Variables

1. **S**
   - The types of the sensors that the Draggable will use as inputs for moving the provided elements around.
   - This is inferred from the constructor's `sensors` argument, so you don't have to manually specify this, unless you use this as a type constraint.
   - Default: `Sensor[]`.
2. **P**
   - The types of the plugins that the Draggable will use.
   - This is mainly used for automatic type inference so you don't have to manually specify this, unless you use this as a type constraint.
   - Default: `{}`.

### Constructor Parameters

1. **sensors**
   - An array of [sensors](/sensor) that the Draggable will use as inputs for moving the provided elements around. The sensors are required and can't be changed after instantiation.
2. **options**
   - An optional [`DraggableOptions`](#draggableoptions) object. The provided options (except for `id`) will be merged with the default options and the result will be used as the draggable's [`settings`](#settings) property.
   - The `id` option is special as it's not part of the `settings` object unlike all the other options. It's a unique identifier for the draggable that is assigned as the draggable's [`id`](#id) property and _should not_ be changed after instantiation. Default is a unique symbol.
   - Default: `{}`.

## Settings

Here you can find a more in-depth explanation about the [`DraggableSettings`](#draggablesettings) object with all the available options.

### container

```ts
type container = Element | null;
```

The element the dragged elements should be appended to for the duration of the drag. If set to `null` the element's current parent element is used.

Default is `null`.

::: info
When using a custom container, the dragged element must be either `absolute` or `fixed` positioned. You can overcome this limitation by changing the element's CSS position to `absolute` or `fixed` just before the drag starts (e.g. using [`elements`](#elements)) and then back to the original position after the drag ends. Additionally you will need to offset the element's position to match the original position before the drag starts, e.g. by using `transform: translate(x, y)`.
:::

### startPredicate

```ts
type startPredicate = (data: {
  draggable: Draggable<S>;
  sensor: S[number];
  event: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
}) => boolean | undefined;
```

A function that determines if drag should start or not. An important thing to note is that each sensor attached to the draggable has their own start predicate state. So if you reject the predicate for sensorA then sensorB can still keep trying to resolve its start predicate. However, once any sensor's start predicate is resolved the other sensors' start predicates are automatically rejected.

Return:

- `true` to resolve the predicate and start drag.
- `false` to reject the predicate and prevent drag from starting during the sensor's current drag process.
- `undefined` to keep the predicate in pending state and try resolving it again after the next "move" event from the sensor.

Default is `() => true`.

### elements

```ts
type elements = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
}) => (HTMLElement | SVGSVGElement)[] | null;
```

A function that should return all the elements you want to move during the drag.

> [!IMPORTANT]
> This is the single most important setting to define! Unless you explicitly provide a function that returns an array of element(s), no elements will be moved during the drag, but the drag operation will still be carried out.

There are a few use cases where you might not want to move any elements during the drag:

1. You trigger auto-scrolling via the [`autoScrollPlugin`](/draggable-auto-scroll-plugin) without moving any elements.

2. You can define a _virtual_ box for the draggable using the [`computeClientRect`](#computeclientrect) setting without moving any elements. This might be handy if you want to use collision detection without moving any elements.

Default is `() => null`.

### frozenStyles

```ts
type frozenStyles = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  style: CSSStyleDeclaration;
}) => CSSProperties | (keyof CSSProperties)[] | null;
```

A function that should return an array of CSS properties that should be frozen during the drag. By "frozen" we mean that the current computed value of the property is stored and applied to the element's inline styles during the drag. This is usually only needed if you have a drag container and the dragged element has percentage based values for some of its properties. The frozen properties are automatically unfrozen (restored to the original values) when drag ends.

You can also return an object with key-value pairs where the key is the CSS property you want to freeze and the value is the explicit value you want it to be frozen to. This is useful if you want to freeze a property to a specific value instead of the current computed value.

By default nothing is frozen.

### applyPosition

```ts
type applyPosition = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  phase: DraggableApplyPositionPhase;
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
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
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
type positionModifiers = DraggableModifier<S>[];
```

An array of position modifier functions that should return the position change of a dragged element. Checkout the [Draggable Modifiers](/draggable-modifiers) page for detailed information.

### sensorProcessingMode

```ts
type sensorProcessingMode = DraggableSensorProcessingMode;
```

Defines how the sensor events should be processed.

- `'sampled'`: Upon receiving a "start" or "move" event from a sensor, the Draggable will schedule a task to process the event during the next tick. If another "start" or "move" event is received before the next tick Draggable will discard the previous event and process the latest event instead during the next tick. This method of "sampling" the sensor events is highly useful to avoid redundant work and layout thrashing, but there may be edge cases where you might want to use the immediate mode instead.
- `'immediate'`: The sensor events are processed immediately (synchronously) as they are emitted. This might cause performance issues (layout thrashing to be specific) if the sensor events are emitted too frequently.

Default is `'sampled'`.

### dndGroups

```ts
type dndGroups = Set<DraggableDndGroup>;
```

A set of [`DraggableDndGroup`](#draggabledndgroup) identifiers used by [`DndObserver`](/dnd-observer) when matching a `Draggable` to [`Droppable`](/droppable).

If a `Droppable` includes any of these identifiers in its [`accept`](/droppable#accept) set, the `Draggable` will be matched to the `Droppable` and there will be collision detection enabled between the two.

Default is an empty set.

### onPrepareStart

```ts
type onPrepareStart = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

A callback that is called at the end of drag start preparation phase. In this phase the draggable item instances are created and the initial position is computed. All the required DOM reading (for drag start) is also done in this phase.

This callback is called immediately after any `preparestart` events that are added via [`on`](#on) method.

### onStart

```ts
type onStart = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

A callback that is called at the end of drag start phase. This phase handles applying the initial positions to the dragged elements, setting up the frozen styles and any other initial setup that require writing to the DOM.

This callback is called immediately after any `start` events that are added via [`on`](#on) method.

### onPrepareMove

```ts
type onPrepareMove = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

A callback that is called at the end of drag move preparation phase. This phase handles computing the new position of the dragged elements based on the sensor data.

This callback is called immediately after any `preparemove` events that are added via [`on`](#on) method.

### onMove

```ts
type onMove = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

A callback that is called at the end of drag move phase. This phase applies the new positions to the dragged elements.

This callback is called immediately after any `move` events that are added via [`on`](#on) method.

### onEnd

```ts
type onEnd = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

A callback that is called at the very end of drag process after all the required cleanup has been done. You will still have access to the drag data when this callback is called, but it will be removed from the draggable instance right after this callback.

This callback is called immediately after any `end` events that are added via [`on`](#on) method.

### onDestroy

```ts
type onDestroy = (draggable: Draggable<S>) => void;
```

A callback that is called when the draggable is destroyed via [`destroy`](#destroy) method. This is the last callback that is called before the draggable instance is completely disposed. If there is an active drag when the draggable is destroyed, the [`onEnd`](#onend) callback will be called before this callback.

This callback is called immediately after any `destroy` events that are added via [`on`](#on) method.

## Properties

### id

```ts
type id = DraggableId;
```

The unique identifier for this draggable. Default is a unique symbol. Read-only.

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
type plugins = DraggablePluginMap;
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
type on<T extends keyof DraggableEventCallbacks<SensorsEventsType<S>>> = (
  type: T,
  listener: DraggableEventCallbacks<SensorsEventsType<S>>[T],
  listenerId?: SensorEventListenerId,
) => SensorEventListenerId;

// Usage
draggable.on('start', (e) => {
  console.log('start', e);
});
```

Adds a listener to a draggable event. Returns a [listener id](#sensoreventlistenerid), which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

Please check the [Events](#events) section for more information about the events and their payloads.

### off

```ts
type off<T extends keyof DraggableEventCallbacks<SensorsEventsType<S>>> = (
  type: T,
  listenerId: SensorEventListenerId,
) => void;

// Usage
const id = draggable.on('start', (e) => console.log('start', e));
draggable.off('start', id);
```

Removes a listener (based on [listener id](/sensor#sensoreventlistenerid)) from a draggable event.

### stop

```ts
type stop = () => void;

draggable.stop();
```

Forcibly stops the draggable's current drag process.

> [!IMPORTANT]  
> You can't call this method within the `preparestart` or `start` event listeners nor within the `onPrepareStart` or `onStart` callbacks. An error will be thrown if you try to do so. The reason for this is that the drag start process can't be interrupted during the prepare/apply phases. You can call this method before, after and between those phases though.

### align

```ts
type align = (instant?: boolean) => void;

// Usage: update asynchronously on the next animation frame.
draggable.align();

// Usage: update instantly. May cause extra reflows (jank).
draggable.align(true);
```

Recomputes the positions of all dragged elements if they have drifted due to e.g. scrolling. This should be called if a dragged element's position goes out of sync inadvertently. Draggable is smart enough to call this automatically when scrolling occurs during dragging, but if you need to realign the elements manually you can call this method.

### getClientRect

```ts
type getClientRect = () => Readonly<{ x: number; y: number; width: number; height: number }> | null;

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
type updateSettings = (options: Partial<DraggableSettings>) => void;

// Usage
draggable.updateSettings({
  startPredicate: () => Math.random() > 0.5,
});
```

Updates the draggable's settings. Accepts a partial [`DraggableSettings`](#draggablesettings) object as the first argument, only the options you provide will be updated. Note that you only need to provide the options you want to change, the rest will be left as default.

### use

```ts
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
  .use(myOtherPlugin);
```

Registers a plugin to the Draggable instance. Returns the Draggable instance so you can chain the method and get updated typings for the instance based on how the plugin(s) extend the Draggable type.

The plugin system is designed to be used so that you register the plugins right away when you instantiate the Draggable. This way you'll get the correct typings to the variable holding the instance. Also, there's no mechanism to unregister a plugin because there really should be no need for that.

Check out the [plugin guide](/draggable-plugins) to learn how to build custom plugins.

### destroy

```ts
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
type preparestart = DraggableEventCallbacks['preparestart'];
```

Emitted at the end of the drag start preparation phase, just before the [`onPrepareStart`](#onpreparestart) callback is called.

The start preparation phase is called during the read phase of the ticker and is intended for doing all the necessary DOM reads and computations for the drag start. You should avoid doing any DOM writes in this phase as that would cause layout thrashing.

**Parameters:**

1. **`event`**
   — Sensor event that resolved the start predicate (`'start'` or `'move'`).

### start

```ts
type start = DraggableEventCallbacks['start'];
```

Emitted at the end of the drag start apply phase, just before the [`onStart`](#onstart) callback is called.

The start apply phase is called during the write phase of the ticker and is intended for applying the initial positions to the dragged elements, applying the frozen styles and other initial setup that require writing to the DOM. You should avoid doing any DOM reads in this phase as that would cause layout thrashing.

**Parameters:**

1. **`event`**
   — Sensor event that initiated the drag (`'start'` or `'move'`).

### preparemove

```ts
type preparemove = DraggableEventCallbacks['preparemove'];
```

Emitted at the end of the drag move preparation phase, just before the [`onPrepareMove`](#onpreparemove) callback is called.

The move preparation phase is called during the read phase of the ticker and is intended for computing the new position of the dragged elements based on the sensor data. You should avoid doing any DOM writes in this phase as that would cause layout thrashing.

**Parameters:**

1. **`event`**
   — Sensor `move` event.

### move

```ts
type move = DraggableEventCallbacks['move'];
```

Emitted at the end of the drag move apply phase, just before the [`onMove`](#onmove) callback is called.

The move apply phase is called during the write phase of the ticker and is intended for applying the new positions to the dragged elements. You should avoid doing any DOM reads in this phase as that would cause layout thrashing.

**Parameters:**

1. **`event`**
   — Sensor `move` event.

### end

```ts
type end = DraggableEventCallbacks['end'];
```

Emitted at the end of the drag end procedure, just before the [`onEnd`](#onend) callback is called.

The end procedure is called synchronously after the drag ends and is intended for doing all the necessary cleanup after the drag ends. It is not bound to any phase of the ticker and is called immediately after the drag ends.

**Parameters:**

1. **`event`**
   — Sensor `end`, `cancel` or `destroy` event.
   - The only time the `event` argument will be `null` is if the drag was stopped programmatically using [`stop`](#stop) method without a sensor event.

### destroy

```ts
type destroy = DraggableEventCallbacks['destroy'];
```

Emitted when the Draggable instance is destroyed via [`destroy`](#destroy) method. The listener function receives no parameters.

## Exports

Here's a list of additional exports that are available in the `dragdoll/draggable` package.

### DraggableModifierPhase

```ts
// Import
import { DraggableModifierPhase } from 'dragdoll/draggable';

// Enum (object literal)
const DraggableModifierPhase = {
  Start: 'start',
  Move: 'move',
  End: 'end',
} as const;
```

### DraggableSensorProcessingMode

```ts
// Import
import { DraggableSensorProcessingMode } from 'dragdoll/draggable';

// Enum (object literal)
const DraggableSensorProcessingMode = {
  Immediate: 'immediate',
  Sampled: 'sampled',
} as const;
```

### DraggableApplyPositionPhase

```ts
// Import
import { DraggableApplyPositionPhase } from 'dragdoll/draggable';

// Enum (object literal)
const DraggableApplyPositionPhase = {
  Start: 'start',
  StartAlign: 'start-align',
  Move: 'move',
  Align: 'align',
  End: 'end',
  EndAlign: 'end-align',
} as const;
```

### DraggableEventType

```ts
// Import
import { DraggableEventType } from 'dragdoll/draggable';

// Enum (object literal)
const DraggableEventType = {
  PrepareStart: 'preparestart',
  Start: 'start',
  PrepareMove: 'preparemove',
  Move: 'move',
  End: 'end',
  Destroy: 'destroy',
} as const;
```

### DraggableDefaultSettings

```ts
// Import
import { DraggableDefaultSettings } from 'dragdoll/draggable';

// Constant
const DraggableDefaultSettings: DraggableSettings<any>;
```

## Types

### DraggableId

```ts
// Import
import type { DraggableId } from 'dragdoll/draggable';

// Type
type DraggableId = string | number | symbol;
```

### DraggableDndGroup

```ts
// Import
import type { DraggableDndGroup } from 'dragdoll/draggable';

// Type
type DraggableDndGroup = string | number | symbol;
```

### DraggableModifierPhase

```ts
// Import
import type { DraggableModifierPhase } from 'dragdoll/draggable';

// Type
type DraggableModifierPhase = 'start' | 'move' | 'end';
```

### DraggableSensorProcessingMode

```ts
// Import
import type { DraggableSensorProcessingMode } from 'dragdoll/draggable';

// Type
type DraggableSensorProcessingMode = 'sampled' | 'immediate';
```

### DraggableApplyPositionPhase

```ts
// Import
import type { DraggableApplyPositionPhase } from 'dragdoll/draggable';

// Type
type DraggableApplyPositionPhase = 'start' | 'start-align' | 'move' | 'align' | 'end' | 'end-align';
```

### DraggableModifierData

```ts
// Import
import type { DraggableModifierData } from 'dragdoll/draggable';

// Type
type DraggableModifierData<S extends Sensor[]> = {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  phase: DraggableModifierPhase;
};
```

### DraggableModifier

```ts
// Import
import type { DraggableModifier } from 'dragdoll/draggable';

// Type
type DraggableModifier<S extends Sensor[]> = (
  change: { x: number; y: number },
  data: DraggableModifierData<S>,
) => { x: number; y: number };
```

### DraggableSettings

```ts
// Import
import type { DraggableSettings } from 'dragdoll/draggable';

// Interface
export interface DraggableSettings<S extends Sensor[]> {
  container: HTMLElement | null;
  startPredicate: (data: {
    draggable: Draggable<S>;
    sensor: S[number];
    event: SensorsEventsType<S>['start'] | SensorsEventsType<S>['move'];
  }) => boolean | undefined;
  elements: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
  }) => (HTMLElement | SVGSVGElement)[] | null;
  frozenStyles: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
    item: DraggableDragItem<S>;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  positionModifiers: DraggableModifier<S>[];
  applyPosition: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
    item: DraggableDragItem<S>;
    phase: DraggableApplyPositionPhase;
  }) => void;
  computeClientRect?: (data: {
    draggable: Draggable<S>;
    drag: DraggableDrag<S>;
  }) => Readonly<Rect> | null;
  sensorProcessingMode?: DraggableSensorProcessingMode;
  dndGroups?: Set<DraggableDndGroup>;
  onPrepareStart?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onStart?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onPrepareMove?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onMove?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onEnd?: (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
  onDestroy?: (draggable: Draggable<S>) => void;
}
```

### DraggableOptions

```ts
// Import
import type { DraggableOptions } from 'dragdoll/draggable';

// Interface
export interface DraggableOptions<S extends Sensor[]> extends Partial<DraggableSettings<S>> {
  id?: DraggableId;
}
```

### DraggablePlugin

```ts
// Import
import type { DraggablePlugin } from 'dragdoll/draggable';

// Interface
interface DraggablePlugin {
  name: string;
  version: string;
}
```

### DraggablePluginMap

```ts
// Import
import type { DraggablePluginMap } from 'dragdoll/draggable';

// Type
type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;
```

### DraggableEventType

```ts
// Import
import type { DraggableEventType } from 'dragdoll/draggable';

// Type
type DraggableEventType = 'preparestart' | 'start' | 'preparemove' | 'move' | 'end' | 'destroy';
```

### DraggableEventCallbacks

```ts
// Import
import type { DraggableEventCallbacks } from 'dragdoll/draggable';

// Interface
interface DraggableEventCallbacks<E extends SensorEvents> {
  [DraggableEventType.PrepareStart]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.Start]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.PrepareMove]: (event: E['move']) => void;
  [DraggableEventType.Move]: (event: E['move']) => void;
  [DraggableEventType.End]: (event: E['end'] | E['cancel'] | E['destroy'] | null) => void;
  [DraggableEventType.Destroy]: () => void;
}
```

### DraggableEventCallback

```ts
// Import
import type { DraggableEventCallback } from 'dragdoll/draggable';

// Type
type DraggableEventCallback<
  S extends Sensor[],
  T extends keyof DraggableEventCallbacks<SensorsEventsType<S>>,
> = DraggableEventCallbacks<SensorsEventsType<S>>[T];
```
