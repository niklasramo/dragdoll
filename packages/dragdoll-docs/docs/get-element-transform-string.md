# getElementTransformString

A utility function that reads an element's computed CSS transform properties (`translate`, `rotate`, `scale`, `transform`) and returns a single coalesced transform string.

## Usage

```ts
import { getElementTransformString } from 'dragdoll';

const element = document.querySelector('.my-element') as HTMLElement;

// Get the full transform string (all CSS transform properties coalesced).
const transformString = getElementTransformString(element);
// e.g. "translate(10px,20px) rotate(45deg) scale(1.5) matrix(1, 0, 0, 1, 0, 0)"

// Get the transform string without the `transform` property.
const withoutTransform = getElementTransformString(element, true);
// e.g. "translate(10px,20px) rotate(45deg) scale(1.5)"
```

## Signature

```ts
function getElementTransformString(
  el: HTMLElement | SVGSVGElement,
  ignoreNormalTransform?: boolean,
): string;
```

## Parameters

### el

The element whose computed transform properties to read.

### ignoreNormalTransform

If `true`, excludes the `transform` CSS property from the result. Only `translate`, `rotate`, and `scale` shorthand properties are included. Useful when you want to read only the individual shorthand transforms without the legacy `transform` property.

- Optional.
- Default is `false`.

## Return Value

A string containing all non-trivial CSS transforms coalesced in the order: `translate`, `rotate`, `scale`, `transform`. Returns an empty string if the element has no transforms.

## How It Works

Modern CSS has four transform-related properties: `translate`, `rotate`, `scale`, and `transform`. Browsers apply them in that order per the spec. This function reads all four from the element's computed style (via [`getStyle`](/get-style)) and concatenates their values into a single string, converting percentage-based `translate` values to pixels using the element's intrinsic dimensions.

This is the string representation used internally by [`getWorldTransformMatrix`](/get-world-transform-matrix) when computing an element's world transform.

## Exports

```ts
// Main entry
import { getElementTransformString } from 'dragdoll';

// Sub-path entry
import { getElementTransformString } from 'dragdoll/utils/get-element-transform-string';
```
