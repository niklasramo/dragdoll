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
interface UsePointerSensorSettings extends Partial<PointerSensorSettings> {}
```
