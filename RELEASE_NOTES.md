# Release Notes: dragdoll v0.12.0 & dragdoll-react v0.2.0

## Overview

This release introduces significant API changes to improve type safety, flexibility, and performance. The main focus is on refactoring the sensor type system from array-based to union-based generics, enabling dynamic sensor updates, and improving React hook performance.

---

## Breaking Changes

### Core Library (dragdoll)

#### 1. Sensor Generic Type Change

**Changed:** The generic type parameter `S` in `Draggable` and related types has changed from `Sensor[]` to `Sensor` (union type).

**Before:**

```ts
class Draggable<S extends Sensor[] = Sensor[]>
```

**After:**

```ts
class Draggable<S extends Sensor = Sensor>
```

**Impact:**

- Type inference now works with union types instead of arrays
- Constructor still accepts an array: `new Draggable([sensor1, sensor2])`
- All related types (`DraggableDrag`, `DraggableDragItem`, `DraggableModifier`, etc.) have been updated accordingly

**Migration:**

```ts
// Before
const draggable = new Draggable<[PointerSensor, KeyboardSensor]>([pointerSensor, keyboardSensor]);

// After
const draggable = new Draggable<PointerSensor | KeyboardSensor>([pointerSensor, keyboardSensor]);
```

#### 2. Draggable.sensors Property is Now Mutable

**Changed:** The `sensors` property is now writable and can be updated after instantiation.

**Before:**

```ts
readonly sensors: S; // Array, readonly
```

**After:**

```ts
get sensors(): ReadonlyArray<S>;
set sensors(sensors: readonly S[]);
```

**Impact:**

- You can now dynamically add/remove sensors without recreating the draggable instance
- Setting sensors automatically unbinds removed sensors and binds new ones
- If an active drag's sensor is removed, the drag is automatically stopped

**Migration:**

```ts
// Before - had to recreate draggable
const draggable = new Draggable([sensor1]);
// ... later
draggable.destroy();
const newDraggable = new Draggable([sensor1, sensor2]);

// After - can update sensors directly
const draggable = new Draggable([sensor1]);
// ... later
draggable.sensors = [sensor1, sensor2];
```

#### 3. DraggableDefaultSettings.dndGroups Changed

**Changed:** Default value changed from `new Set()` to `undefined`.

**Before:**

```ts
dndGroups: new Set();
```

**After:**

```ts
dndGroups: undefined;
```

**Impact:**

- If you relied on the default being an empty Set, you'll need to explicitly provide one

**Migration:**

```ts
// If you need an empty Set, provide it explicitly
new Draggable(sensors, { dndGroups: new Set() });
```

#### 4. Droppable Constructor Now Accepts Null Element

**Changed:** The `element` parameter in `Droppable` constructor can now be `null`.

**Before:**

```ts
constructor(element: HTMLElement | SVGSVGElement, options?: DroppableOptions)
```

**After:**

```ts
constructor(element: HTMLElement | SVGSVGElement | null, options?: DroppableOptions)
```

**Impact:**

- Allows creating droppables without an element initially
- The `element` property is now `HTMLElement | SVGSVGElement | null`

#### 5. Droppable.updateClientRect() Signature Changed

**Changed:** Method no longer accepts a `rect` parameter.

**Before:**

```ts
updateClientRect(rect?: Rect): void
```

**After:**

```ts
updateClientRect(): void
```

**Impact:**

- The method now uses `computeClientRect` callback instead of accepting a parameter
- If you were passing a rect manually, you need to use `computeClientRect` option instead

**Migration:**

```ts
// Before
droppable.updateClientRect({ x: 0, y: 0, width: 100, height: 100 });

// After
const droppable = new Droppable(element, {
  computeClientRect: () => ({ x: 0, y: 0, width: 100, height: 100 }),
});
droppable.updateClientRect();
```

#### 6. DndObserver Implicit Filtering Removed

**Changed:** Removed automatic filtering that prevented draggables from colliding with droppables they contain.

**Before:**

- Draggables were automatically excluded from colliding with droppables if the draggable's element contained the droppable's element

**After:**

- No automatic filtering - all collisions are detected based on `accept` predicate only

**Impact:**

- If you relied on this implicit behavior, you'll need to add explicit filtering in your `accept` predicate

**Migration:**

```ts
// Before - implicit filtering
// Draggable would never collide with droppable if it contained it

// After - explicit filtering needed
const droppable = new Droppable(element, {
  accept: (draggable) => {
    // Explicitly check if draggable contains this droppable
    const items = draggable.drag?.items || [];
    return !items.some((item) => item.element.contains(element));
  },
});
```

#### 7. Removed SensorsEventsType Type

**Changed:** The `SensorsEventsType<S extends Sensor[]>` type has been removed.

**Before:**

```ts
import type { SensorsEventsType } from 'dragdoll/sensors/sensor';
type Events = SensorsEventsType<[PointerSensor, KeyboardSensor]>;
```

**After:**

- Use `S['_events_type']` directly where `S extends Sensor`

**Migration:**

```ts
// Before
type Events = SensorsEventsType<[PointerSensor, KeyboardSensor]>;

// After
type Events = (PointerSensor | KeyboardSensor)['_events_type'];
```

### React Integration (dragdoll-react)

#### 8. React Hook Sensor Type Changed

**Changed:** All React hooks now use `Sensor` union type instead of `Sensor[]`.

**Before:**

```ts
useDraggable<S extends Sensor[] = Sensor[]>(sensors: (S[number] | null)[])
```

**After:**

```ts
useDraggable<S extends Sensor = Sensor>(sensors: (S | null)[])
```

**Impact:**

- Type inference works with union types
- Same migration pattern as core library

**Migration:**

```ts
// Before
const draggable = useDraggable<[PointerSensor, KeyboardSensor]>([pointerSensor, keyboardSensor]);

// After
const draggable = useDraggable<PointerSensor | KeyboardSensor>([pointerSensor, keyboardSensor]);
```

#### 9. useDraggable Hook Behavior Changed

**Changed:** The hook no longer recreates the draggable instance when sensors change.

**Before:**

- Changing sensors array would destroy and recreate the draggable

**After:**

- Changing sensors array updates the existing draggable's sensors property
- Draggable is only recreated when `id` changes

**Impact:**

- Better performance - no unnecessary instance recreation
- State is preserved when sensors change
- If you relied on recreation behavior, you may need to adjust your code

#### 10. useDraggableDrag Callback Signature Changed

**Changed:** The `Start` event callback now receives the drag object directly.

**Before:**

```ts
useDraggableCallback(draggable, DraggableEventType.Start, () => {
  setDrag(draggable?.drag || null);
});
```

**After:**

```ts
useDraggableCallback(draggable, DraggableEventType.Start, (drag) => {
  setDrag(drag);
});
```

**Impact:**

- The callback signature matches the event payload structure
- More consistent with other event callbacks

#### 11. useDroppable Hook Improvements

**Changed:**

- `element` parameter can now be `null`
- Added `computeClientRect` option support
- Improved observer management

**Before:**

```ts
useDroppable({ element: HTMLElement });
```

**After:**

```ts
useDroppable({
  element: HTMLElement | SVGSVGElement | null,
  computeClientRect?: (droppable: Droppable) => Rect
})
```

**Impact:**

- More flexible element handling
- Can customize client rect calculation

#### 12. Sensor Hook Settings Parameters Now Optional

**Changed:** Settings parameters in sensor hooks are now optional instead of required with default empty object.

**Before:**

```ts
usePointerSensor({}, element);
useKeyboardSensor({}, element);
useKeyboardMotionSensor({}, element);
```

**After:**

```ts
usePointerSensor(undefined, element);
// or
usePointerSensor({ listenerOptions: {} }, element);
useKeyboardSensor(undefined, element);
useKeyboardMotionSensor(undefined, element);
```

**Impact:**

- More consistent API - settings are truly optional
- TypeScript will catch cases where you might have been relying on default empty object behavior

**Migration:**

```ts
// Before
const sensor = usePointerSensor({}, element);

// After - both are equivalent
const sensor = usePointerSensor(undefined, element);
const sensor = usePointerSensor({}, element);
```

#### 13. Default Settings Export Names Changed

**Changed:** Default settings exports renamed to follow PascalCase convention.

**Before:**

```ts
import { keyboardSensorDefaults, keyboardMotionSensorDefaults } from 'dragdoll/sensors/keyboard';
```

**After:**

```ts
import {
  KeyboardSensorDefaultSettings,
  KeyboardMotionSensorDefaultSettings,
  PointerSensorDefaultSettings,
  DroppableDefaultSettings,
} from 'dragdoll';
```

**Impact:**

- Breaking change if you imported the old default settings names
- More consistent naming convention

**Migration:**

```ts
// Before
import { keyboardSensorDefaults } from 'dragdoll/sensors/keyboard';
const settings = { ...keyboardSensorDefaults, moveDistance: 50 };

// After
import { KeyboardSensorDefaultSettings } from 'dragdoll/sensors/keyboard';
const settings = { ...KeyboardSensorDefaultSettings, moveDistance: 50 };
```

---

## New Features

### Core Library

#### 1. Dynamic Sensor Updates

Sensors can now be updated on `Draggable` instances without recreating them:

```ts
const draggable = new Draggable([pointerSensor]);

// Add a sensor
draggable.sensors = [...draggable.sensors, keyboardSensor];

// Remove a sensor
draggable.sensors = [pointerSensor];
```

#### 2. Sensor updateElement() Method

All sensor classes now have an `updateElement()` method to change the tracked element:

```ts
// PointerSensor
pointerSensor.updateElement(newElement);

// KeyboardSensor
keyboardSensor.updateElement(newElement);

// KeyboardMotionSensor
keyboardMotionSensor.updateElement(newElement);
```

#### 3. Droppable computeClientRect Option

New option to customize how client rect is calculated:

```ts
const droppable = new Droppable(element, {
  computeClientRect: (droppable) => {
    // Custom rect calculation
    return customRect;
  },
});
```

#### 4. Default Settings Exports

Default settings are now exported for easier access (note: renamed from previous versions):

```ts
import {
  KeyboardSensorDefaultSettings,
  KeyboardMotionSensorDefaultSettings,
  PointerSensorDefaultSettings,
  DroppableDefaultSettings,
} from 'dragdoll';
```

#### 5. Sensor updateSettings() Now Checks isDestroyed

**Changed:** All sensor `updateSettings()` methods now check if the sensor is destroyed before updating.

**Impact:**

- Prevents errors when trying to update settings on destroyed sensors
- More robust error handling

### React Integration

#### 6. Improved Sensor Hook Behavior

Sensor hooks (`usePointerSensor`, `useKeyboardSensor`, `useKeyboardMotionSensor`) now update the element instead of recreating the sensor:

```ts
const sensor = usePointerSensor({}, element);

// When element changes, sensor is updated instead of recreated
```

#### 7. Better Settings Handling in Sensor Hooks

Sensor hooks now properly merge default settings when updating, ensuring all settings are explicitly provided:

```ts
// Hooks now merge defaults when updating settings
usePointerSensor({ listenerOptions: { passive: true } }, element);
// Internally merges with PointerSensorDefaultSettings
```

#### 8. Exported Settings Interfaces for Sensor Hooks

New TypeScript interfaces exported for better type safety:

```ts
import {
  UsePointerSensorSettings,
  UseKeyboardSensorSettings,
  UseKeyboardMotionSensorSettings,
} from 'dragdoll-react';
```

---

## Functional Changes

### Core Library

1. **Sensor Management**: Improved sensor binding/unbinding logic with better cleanup
2. **DndObserver**: Removed implicit containment filtering for more predictable behavior
3. **Droppable**: Improved `updateClientRect()` to use `computeClientRect` callback
4. **Type Safety**: Better type inference with union types instead of array types

### React Integration

1. **Performance**: Reduced unnecessary draggable instance recreation
2. **State Management**: Better handling of sensor and settings updates
3. **Observer Management**: Improved DndObserver add/remove logic in hooks
4. **Collision Detection**: Hooks no longer automatically queue collision checks on every update - you must manually call `detectCollisions()` when needed

---

## Bug Fixes

1. Fixed issue where React hooks would recreate draggable instances unnecessarily
2. Fixed sensor cleanup when sensors are removed from draggable
3. Improved handling of active drags when sensors are removed
4. Fixed type inference issues with sensor arrays

---

## Migration Guide

### Quick Migration Checklist

1. ✅ Update `Draggable` generic type from `Sensor[]` to `Sensor` union
2. ✅ Update React hook generic types from `Sensor[]` to `Sensor` union
3. ✅ Replace `SensorsEventsType<S>` with `S['_events_type']`
4. ✅ Update `Droppable.updateClientRect()` calls if passing parameters
5. ✅ Add explicit filtering in `accept` predicate if relying on containment filtering
6. ✅ Update `dndGroups` default if relying on empty Set
7. ✅ Review React hook behavior - sensors now update instead of recreate
8. ✅ Update default settings imports if using old names (`keyboardSensorDefaults` → `KeyboardSensorDefaultSettings`)
9. ✅ Review sensor hook calls - settings parameter is now optional

### Example Migration

**Before:**

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor, KeyboardSensor } from 'dragdoll/sensors';
import type { SensorsEventsType } from 'dragdoll/sensors/sensor';

type MySensors = [PointerSensor, KeyboardSensor];
type MyEvents = SensorsEventsType<MySensors>;

const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable<MySensors>([pointerSensor, keyboardSensor]);

// Later, to add a sensor:
draggable.destroy();
const newDraggable = new Draggable<MySensors>([pointerSensor, keyboardSensor, newSensor]);
```

**After:**

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor, KeyboardSensor } from 'dragdoll/sensors';

type MySensors = PointerSensor | KeyboardSensor;
type MyEvents = MySensors['_events_type'];

const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable<MySensors>([pointerSensor, keyboardSensor]);

// Later, to add a sensor:
draggable.sensors = [pointerSensor, keyboardSensor, newSensor];
```

---

## Version Information

- **dragdoll**: `0.11.1` → `0.12.0`
- **dragdoll-react**: `0.1.1` → `0.2.0`

---

## Dependencies

No dependency changes in this release.

---

## Contributors

Thank you to all contributors who helped with this release!
