[Draggable](/docs/draggable) →

# DraggableDrag

DraggableDrag class instance holds all the information about the current drag process. It's available via the Draggable instance's [`drag`](/docs/draggable#drag) property.

## Properties

All the properties are read-only.

### sensor

```ts
type sensor = Sensor;
```

The sensor that is tracked for this drag process. Read-only.

### isEnded

```ts
type isEnded = boolean;
```

A boolean that indicates whether the drag process has ended. Read-only.

### startEvent

```ts
type startEvent = SensorStartEvent | SensorMoveEvent;
```

The sensor event that initiated the drag. Read-only.

### event

```ts
type event = SensorStartEvent | SensorMoveEvent;
```

The current sensor move event. Read-only.

### prevEvent

```ts
type prevEvent = SensorStartEvent | SensorMoveEvent;
```

The previous sensor move event. Read-only.

### endEvent

```ts
type endEvent = SensorEndEvent | SensorCancelEvent | SensorDestroyEvent;
```

The sensor event that ended the drag. Read-only.

### items

```ts
type items = DraggableDragItem[];
```

An array of DraggableDragItem instances, which correspond to the drag elements as provided via the [`getElements`](/docs/draggable#getelements) option. Read-only.
