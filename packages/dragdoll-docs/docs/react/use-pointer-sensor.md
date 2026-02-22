# usePointerSensor

A React hook that creates a [`PointerSensor`](/pointer-sensor) instance for handling pointer, touch, and mouse events.

## Usage

```tsx
import { useMemo, useRef, useCallback } from 'react';
import { useDraggable, usePointerSensor } from 'dragdoll-react';

function DraggableItem() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [pointerSensor, setPointerSensorElementRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([pointerSensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorElementRef(node);
    },
    [setPointerSensorElementRef],
  );

  return (
    <div ref={setRefs} style={{ position: 'relative' }}>
      Drag me
    </div>
  );
}
```

## Signature

```ts
function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings?: Partial<PointerSensorSettings>,
  element?: Element | Window,
): readonly [PointerSensor<E> | null, (node: Element | null) => void];
```

## Parameters

### settings

```ts
type settings = Partial<PointerSensorSettings>;
```

Configuration settings for the pointer sensor. See core [PointerSensor settings](/pointer-sensor#settings) for all available settings.

> [!WARNING]
> You **MUST** memoize the settings object (e.g. with `useMemo`) to prevent unnecessary re-evaluations and performance issues.

In addition to the core settings, the following event callback props are supported:

#### onStart

```ts
type onStart = (e: PointerSensorEvents['start']) => void;
```

A callback function that is called when the sensor starts. Optional.

#### onMove

```ts
type onMove = (e: PointerSensorEvents['move']) => void;
```

A callback function that is called when the sensor moves. Optional.

#### onCancel

```ts
type onCancel = (e: PointerSensorEvents['cancel']) => void;
```

A callback function that is called when the sensor is cancelled. Optional.

#### onEnd

```ts
type onEnd = (e: PointerSensorEvents['end']) => void;
```

A callback function that is called when the sensor ends. Optional.

#### onDestroy

```ts
type onDestroy = (e: PointerSensorEvents['destroy']) => void;
```

A callback function that is called when the sensor is destroyed. Optional.

> [!IMPORTANT]
> The callbacks do not have to be memoized, you can pass new functions every time. Internally, the hook will store the latest callback in a ref and bind a proxy callback to the event listener, which in turn will call the latest callback.

- Optional.
- Default: `{}`.

### element

```ts
type element = Element | Window;
```

The element to attach the sensor to. If you want to attach the sensor to an element that is not managed by React, you can provide the element as the second parameter to the hook. In other cases it's recommended to always use the callback ref which is returned from the hook as the second value in the array.

- Optional.
- Default: `undefined`.

## Return Value

```ts
type returnValue = readonly [PointerSensor<E> | null, (node: Element | null) => void];
```

Returns a read-only array with two elements:

1. **pointerSensor**
   - The [`PointerSensor`](/pointer-sensor) instance, or `null` if not yet initialized.

2. **setPointerSensorElementRef**
   - A ref callback to attach sensor to an element. This is the recommended way to attach the sensor to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Notes

- The sensor instance is automatically destroyed when the component unmounts.
- Settings can be updated dynamically and will be applied to the sensor.
- If the element changes, the sensor is recreated with the new element.
- The sensor will be `null` initially until an element is attached.

## Types

### UsePointerSensorSettings

```ts
// Import
import type { UsePointerSensorSettings } from 'dragdoll-react';

// Interface
interface UsePointerSensorSettings extends Partial<PointerSensorSettings> {
  onStart?: (e: PointerSensorEvents['start']) => void;
  onMove?: (e: PointerSensorEvents['move']) => void;
  onCancel?: (e: PointerSensorEvents['cancel']) => void;
  onEnd?: (e: PointerSensorEvents['end']) => void;
  onDestroy?: (e: PointerSensorEvents['destroy']) => void;
}
```
