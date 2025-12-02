[Draggable](/draggable) →

# DraggableDrag

DraggableDrag class instance holds all the information about the current drag process. It's available via the Draggable instance's [`drag`](/draggable#drag) property.

## Class

```ts
export class DraggableDrag<S extends Sensor> {
  constructor(sensor: S, startEvent: S['_events_type']['start'] | S['_events_type']['move']) {}
}
```

The DraggableDrag class is a generic that accepts the following type variables:

1. **S** - A union type representing the sensor types that the DraggableDrag will use as inputs for moving the provided elements around.

The constructor accepts the following arguments:

1. **sensor**
   - The sensor instance that is tracked for this drag process.
2. **startEvent**
   - The sensor event that initiated the drag.

## Properties

All the properties are read-only.

### sensor

```ts
type sensor = S;
```

The sensor that is tracked for this drag process. Read-only.

### startEvent

```ts
type startEvent = S['_events_type']['start'] | S['_events_type']['move'];
```

The sensor event that initiated the drag. Read-only.

### prevMoveEvent

```ts
type prevMoveEvent = S['_events_type']['start'] | S['_events_type']['move'];
```

The previous sensor move event. When drag starts this will be the start event. Read-only.

### moveEvent

```ts
type moveEvent = S['_events_type']['start'] | S['_events_type']['move'];
```

The current sensor move event. When drag starts this will be the start event. Read-only.

### endEvent

```ts
type endEvent =
  | S['_events_type']['end']
  | S['_events_type']['cancel']
  | S['_events_type']['destroy']
  | null;
```

The sensor event that ended the drag. This will stay `null` (even when drag ends) if [`draggable.stop()`](/draggable#stop) is called manually, because there is no specific event to link the ending to. Read-only.

### items

```ts
type items = DraggableDragItem<S>[];
```

An array of [`DraggableDragItem`](/draggable-drag-item) instances, which correspond to the drag elements as provided via the [`elements`](/draggable#elements) option. Read-only.

### isEnded

```ts
type isEnded = boolean;
```

A boolean that indicates whether the drag process has ended. Read-only.
