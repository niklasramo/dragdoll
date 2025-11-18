# useKeyboardSensor

A React hook that creates a [`KeyboardSensor`](/keyboard-sensor) instance for handling keyboard events.

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { useKeyboardSensor, useDraggable } from 'dragdoll-react';

function DraggableItem() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [keyboardSensor, setKeyboardSensorElementRef] = useKeyboardSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([keyboardSensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setKeyboardSensorElementRef(node);
    },
    [setKeyboardSensorElementRef],
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
function useKeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>(
  settings?: Partial<KeyboardSensorSettings<E>>,
  element?: Element | null,
): readonly [KeyboardSensor<E> | null, (node: Element | null) => void];
```

## Parameters

### settings

```ts
type settings = Partial<KeyboardSensorSettings<E>>;
```

Configuration settings for the keyboard sensor. See core [KeyboardSensor settings](/keyboard-sensor#settings) for all available settings.

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
type returnValue = readonly [KeyboardSensor<E> | null, (node: Element | null) => void];
```

Returns a read-only array with two elements:

1. **keyboardSensor**
   - The [`KeyboardSensor`](/keyboard-sensor) instance, or `null` if not yet initialized.
2. **setKeyboardSensorElementRef**
   - A ref callback to attach sensor to an element. This is the recommended way to attach the sensor to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Notes

- The sensor instance is automatically destroyed when the component unmounts.
- Settings can be updated dynamically and will be applied to the sensor.
- If the element changes, the sensor is recreated with the new element.
- The sensor will be `null` initially until an element is attached.
- Make sure the element is focusable (e.g. with `tabIndex={0}`).
