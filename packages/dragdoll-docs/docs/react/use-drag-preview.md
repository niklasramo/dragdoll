# useDragPreview

A React hook that tracks the active drag preview state for a specific [`Draggable`](/draggable) instance. Returns the proxy elements, source elements, and exit animation controls when a drag preview is active.

> [!NOTE]
> This hook is used internally by the [`<DragPreview>`](/react/drag-preview) component. It is exposed for advanced custom portal implementations where you need direct access to the proxy elements and exit animation state.

## Usage

```tsx
import { useDragPreview } from 'dragdoll-react';

function CustomPreview({ draggable }) {
  const state = useDragPreview(draggable);

  if (!state) return null;

  return (
    <div>
      Dragging {state.sources.length} element(s)
      {state.exiting && ' (animating out...)'}
    </div>
  );
}
```

## Signature

```ts
function useDragPreview(draggable: AnyDraggable | null): DragPreviewState | null;
```

## Parameters

### draggable

The [`Draggable`](/draggable) instance to track. Pass the instance returned by [`useDraggable`](/react/use-draggable). When `null`, the hook always returns `null`.

## Return Value

Returns a `DragPreviewState` object when the provided draggable has an active drag preview (i.e. `dragPreview: true` is enabled and a drag is in progress or exiting), otherwise `null`.

## Types

### DragPreviewState

```ts
// Import
import type { DragPreviewState } from 'dragdoll-react';

// Interface
interface DragPreviewState {
  draggable: AnyDraggable;
  sources: readonly (HTMLElement | SVGSVGElement)[];
  proxies: readonly HTMLElement[];
  exiting: boolean;
  done: () => void;
}
```

#### draggable

The active [`Draggable`](/draggable) instance that owns the drag preview.

#### sources

The original source elements that were passed to the [`elements`](/react/use-draggable#elements) setting. These are the elements that stay in place while their proxies move.

#### proxies

The proxy DOM elements that receive drag movements. These are created automatically when `dragPreview: true` is set and are appended to the drag preview container (`document.body` by default).

#### exiting

`true` when the drag has ended but the proxy is still alive for exit animation (requires [`dragPreviewExitTimeout`](/react/use-draggable#dragpreviewexittimeout) to be set). `false` during active drag.

#### done

A callback to signal that exit animation is complete. Call this when your exit animation finishes to remove the proxy elements. Only meaningful when `exiting` is `true`. If not called within the configured [`dragPreviewExitTimeout`](/react/use-draggable#dragpreviewexittimeout), cleanup happens automatically.
