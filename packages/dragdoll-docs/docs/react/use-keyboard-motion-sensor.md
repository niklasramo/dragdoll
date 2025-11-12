# useKeyboardMotionSensor

A React hook that creates a [`KeyboardMotionSensor`](/keyboard-motion-sensor) instance for handling keyboard-based motion events with continuous movement.

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { useKeyboardMotionSensor, useDraggable } from 'dragdoll-react';

function DraggableItem() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [keyboardMotionSensor, setKeyboardMotionSensorElementRef] = useKeyboardMotionSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([keyboardMotionSensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setKeyboardMotionSensorElementRef(node);
    },
    [setKeyboardMotionSensorElementRef],
  );

  return (
    <div ref={setRefs} tabIndex={0} style={{ position: 'relative' }}>
      Content
    </div>
  );
}
```

## Signature

```ts
function useKeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>(
  settings?: Partial<KeyboardMotionSensorSettings<E>>,
  element?: Element | null,
): readonly [KeyboardMotionSensor<E> | null, (node: Element | null) => void];
```

## Parameters

### settings

```ts
type settings = Partial<KeyboardMotionSensorSettings<E>>;
```

Configuration settings for the keyboard motion sensor. See core [KeyboardMotionSensor settings](/keyboard-motion-sensor#settings) for all available settings.

- Optional.
- Default: `{}`.

### element

```ts
type element = Element | null;
```

The element to attach the sensor to. If you want to attach the sensor to an element that is not managed by React, you can provide the element as the second parameter to the hook. In other cases it's recommended to always use the callback ref which is returned from the hook as the second value in the array.

- Optional.
- Default: `undefined`.

## Return Value

```ts
type returnValue = readonly [KeyboardMotionSensor<E> | null, (node: Element | null) => void];
```

Returns a read-only array with two elements:

1. **keyboardMotionSensor**
   - The [`KeyboardMotionSensor`](/keyboard-motion-sensor) instance, or `null` if not yet initialized.
2. **setKeyboardMotionSensorElementRef**
   - A ref callback to attach sensor to an element. This is the recommended way to attach the sensor to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Notes

- The sensor instance is automatically destroyed when the component unmounts.
- Settings can be updated dynamically and will be applied to the sensor.
- If the element changes, the sensor is recreated with the new element.
- The sensor will be `null` initially until an element is attached.
- Make sure the element is focusable (e.g., with `tabIndex={0}`).
