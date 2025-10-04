[Draggable](/draggable) →

# DraggableDrag

DraggableDrag class instance holds all the information about the current drag process. It's available via the Draggable instance's [`drag`](/draggable#drag) property.

## Properties

All the properties are read-only.

### sensor

```ts
type sensor = Sensor;
```

The sensor that is tracked for this drag process. Read-only.

### startEvent

```ts
type startEvent = SensorStartEvent | SensorMoveEvent;
```

The sensor event that initiated the drag. Read-only.

### prevMoveEvent

```ts
type prevEvent = SensorStartEvent | SensorMoveEvent;
```

The previous sensor move event. When drag starts this will be the start event. Read-only.

### moveEvent

```ts
type event = SensorStartEvent | SensorMoveEvent;
```

The current sensor move event. When drag starts this will be the start event. drag Read-only.

### endEvent

```ts
type endEvent = SensorEndEvent | SensorCancelEvent | SensorDestroyEvent | null;
```

The sensor event that ended the drag. This will stay `null` (even when drag ends) if [`draggable.stop()`](/draggable#stop) is called manually, because there is no specific event to link the ending to. Read-only.

### items

```ts
type items = DraggableDragItem[];
```

An array of [`DraggableDragItem`](/draggable-drag-item) instances, which correspond to the drag elements as provided via the [`elements`](/draggable#elements) option. Read-only.

### isEnded

```ts
type isEnded = boolean;
```

A boolean that indicates whether the drag process has ended. Read-only.
