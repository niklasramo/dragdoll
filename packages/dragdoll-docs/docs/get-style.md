# getStyle

A utility function that returns an element's `CSSStyleDeclaration` (computed styles), with a `WeakMap`-based cache for faster repeated access.

## Usage

```ts
import { getStyle } from 'dragdoll';

const element = document.querySelector('.my-element') as HTMLElement;

const style = getStyle(element);
console.log(style.transform); // e.g. "matrix(1, 0, 0, 1, 50, 100)"
console.log(style.width); // e.g. "200px"
```

## Signature

```ts
function getStyle(element: Element): CSSStyleDeclaration;
```

## Parameters

### element

The DOM element whose computed style to retrieve.

## Return Value

The element's live `CSSStyleDeclaration` object, the same object returned by `window.getComputedStyle(element, null)`.

## How It Works

Calling `window.getComputedStyle()` is not expensive per se — browsers return a live style object — but the lookup itself has overhead when called on the same element many times in a tight loop. `getStyle` caches the returned `CSSStyleDeclaration` in a `WeakMap` keyed by the element (using `WeakRef` so the style declaration can be garbage-collected if the browser reclaims it). Subsequent calls for the same element return the cached reference without calling `getComputedStyle` again.

Since `CSSStyleDeclaration` is a **live** object, the cached reference always reflects the element's current computed styles — no invalidation is needed.

## Exports

```ts
// Main entry
import { getStyle } from 'dragdoll';

// Sub-path entry
import { getStyle } from 'dragdoll/utils/get-style';
```
