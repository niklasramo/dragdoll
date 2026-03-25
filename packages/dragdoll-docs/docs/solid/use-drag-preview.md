# useDragPreview

A Solid hook that tracks the active drag preview state for a specific [`Draggable`](/draggable) instance. Returns the proxy elements, source elements, and exit animation controls when a drag preview is active.

> [!NOTE]
> This hook is used internally by the [`<DragPreview>`](/solid/drag-preview) component. It is exposed for advanced custom portal implementations where you need direct access to the proxy elements and exit animation state.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { Show } from 'solid-js';
import { useDragPreview } from 'dragdoll-solid';

function CustomPreview(props: { draggable: Accessor<AnyDraggable | null> }) {
  const state = useDragPreview(props.draggable);

  return (
    <Show when={state()}>
      {(s) => (
        <div>
          Dragging {s().sources.length} element(s)
          {s().exiting && ' (animating out...)'}
        </div>
      )}
    </Show>
  );
}
```

## Signature

```ts
function useDragPreview(
  draggable: MaybeAccessor<AnyDraggable | null>,
): Accessor<DragPreviewState | null>;
```

## Parameters

### draggable

The [`Draggable`](/draggable) instance to track. Pass the accessor returned by [`useDraggable`](/solid/use-draggable). Accepts either an accessor or a raw value via `MaybeAccessor`. When `null`, the hook always returns `null`.

## Return Value

`Accessor<DragPreviewState | null>` — an accessor that resolves to a `DragPreviewState` object when the provided draggable has an active drag preview (i.e. `dragPreview: true` is enabled and a drag is in progress or exiting), otherwise `null`.

## Types

### DragPreviewState

```ts
// Import
import type { DragPreviewState } from 'dragdoll-solid';

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

The original source elements that were passed to the [`elements`](/solid/use-draggable#elements) setting. These are the elements that stay in place while their proxies move.

#### proxies

The proxy DOM elements that receive drag movements. These are created automatically when `dragPreview: true` is set and are appended to the drag preview container (`document.body` by default).

#### exiting

`true` when the drag has ended but the proxy is still alive for exit animation (requires [`dragPreviewExitTimeout`](/solid/use-draggable#dragpreviewexittimeout) to be set). `false` during active drag.

#### done

A callback to signal that exit animation is complete. Call this when your exit animation finishes to remove the proxy elements. Only meaningful when `exiting` is `true`. If not called within the configured [`dragPreviewExitTimeout`](/solid/use-draggable#dragpreviewexittimeout), cleanup happens automatically.

## How It Works

Internally, the hook bridges the external drag preview store into Solid's reactivity system using `createSignal` and `createEffect`. It subscribes to the shared `dragPreviewStore`, and whenever the store updates, it pushes a new snapshot into a Solid signal. A `createMemo` then derives the `DragPreviewState` for the specific draggable, so your component only re-renders when the relevant state changes.
