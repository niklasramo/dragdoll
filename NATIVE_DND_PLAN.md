# Dragdoll Native (`dragdoll/native`) Implementation Plan

## 1. Overview

The goal is to introduce HTML5 Native Drag-and-Drop capabilities to the `dragdoll` ecosystem via a **fully independent, standalone sub-module** (`dragdoll/native`).

Native browser DnD operates on a fundamentally different paradigm from the core library (hit-testing via `event.target` and `dataTransfer` payloads vs. pointer sensors + geometric collision detection). To ensure maximum performance and maintain the stability of the core's physics engine, this sub-module will:

- Completely bypass `DndObserver` and the core's geometric math.
- Rely 100% on native browser event delegation.
- Provide clean abstractions over notoriously buggy HTML5 DnD APIs.
- Support cross-window dragging and OS file dropping out-of-the-box.
- Expose a framework-agnostic API that serves as a solid foundation for `dragdoll-react` and `dragdoll-solid` wrapper hooks.

---

## 2. Pain Points Solved

1. **Nested Element Flicker:** Hovering over children of a drop zone fires `dragleave` on the parent, causing UI states to violently flicker. The global lifecycle manager absorbs this noise.
2. **`preventDefault` Boilerplate:** You *must* call `e.preventDefault()` on `dragover` simply to allow a drop. `nativeDroppable` handles this automatically based on `accept` rules.
3. **Data Passing Limitations:** Native `dataTransfer` only accepts strings. `nativeDraggable` keeps rich JS objects in memory for same-window drags while mapping string fallbacks for external drops.
4. **Drag Preview Pain:** Default browser ghosts are ugly and inconsistent. We provide a render-callback API with placement helpers.
5. **Unhandled Drop Navigation:** Dropping files outside a registered droppable navigates the browser to that file. `preventUnhandled` stops this.
6. **Cross-Browser Inconsistencies:** Android/iOS require sentinel data, Firefox `drag` events lack coordinates, Chrome's final `dragleave` reports wrong coordinates. All handled transparently.

---

## 3. API Design

### 3.1 Core Functions

| Export | Purpose |
|:---|:---|
| `nativeDraggable(config)` | Register a draggable element. Returns cleanup function. |
| `nativeDroppable(config)` | Register a drop target element. Returns cleanup function. |
| `nativeMonitor(config)` | Observe drag events globally (not tied to a DOM element). Returns cleanup function. |
| `combine(...cleanups)` | Merge cleanup functions into one. |
| `preventUnhandled` | `.start()` / `.stop()` — prevent browser default on unhandled drops. |

### 3.2 Drag Preview Helpers

| Export | Purpose |
|:---|:---|
| `setCustomDragPreview(config)` | Render custom DOM into the drag ghost during `onGeneratePreview`. |
| `disableDragPreview(config)` | Disable the native ghost entirely (for custom overlay rendering). |
| `centerUnderPointer()` | Placement: center ghost under cursor. |
| `preserveOffsetOnSource()` | Placement: maintain cursor offset relative to source element. |
| `offsetFromPointer({ x, y })` | Placement: explicit pixel offset from cursor. |

---

## 4. API Signatures & Examples

### 4.1 `nativeDraggable`

```ts
interface NativeDraggableConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  /** The draggable DOM element. */
  element: HTMLElement;

  /** Optional drag handle — only this sub-element triggers dragging. */
  dragHandle?: HTMLElement;

  /**
   * Rich data for same-window drags. Called once on dragstart.
   * This data is kept in memory and never touches dataTransfer.
   */
  getData?: () => T;

  /**
   * String data for cross-window / cross-app drops.
   * Maps MIME types to string values. Set into dataTransfer on dragstart.
   */
  getExternalData?: () => Record<string, string>;

  /** Conditionally prevent a drag from starting. */
  canDrag?: (args: { input: Input }) => boolean;

  /**
   * Called synchronously during dragstart — the ONLY time setDragImage works.
   * Use setCustomDragPreview() or disableDragPreview() inside this callback.
   */
  onGeneratePreview?: (args: { nativeSetDragImage: DataTransfer['setDragImage'] }) => void;

  /** Drag has begun. */
  onStart?: (args: DraggableStartEvent<T>) => void;

  /** Pointer moved during drag (fires on dragover). */
  onMove?: (args: DraggableEvent<T>) => void;

  /** Drag ended (cancelled or dropped). Always fires. Cleanup goes here. */
  onEnd?: (args: DraggableEndEvent<T>) => void;
}

// Returns a cleanup function.
function nativeDraggable<T>(config: NativeDraggableConfig<T>): () => void;
```

**Example: Same-Window Drag**
```ts
import { nativeDraggable, nativeDroppable, nativeMonitor, combine } from 'dragdoll/native';

const cleanup = combine(
  nativeDraggable({
    element: document.getElementById('card')!,
    dragHandle: document.getElementById('card-grip')!,
    getData: () => ({ id: 123, instance: new ComplexClass() }),
    canDrag: () => !isLocked,
    onStart: () => card.classList.add('is-dragging'),
    onEnd: () => card.classList.remove('is-dragging'),
  }),

  nativeDroppable({
    element: document.getElementById('drop-zone')!,
    onDragEnter: () => dropZone.classList.add('is-hovered'),
    onDragLeave: () => dropZone.classList.remove('is-hovered'),
    onDrop: ({ source }) => {
      dropZone.classList.remove('is-hovered');
      console.log('Dropped item ID:', source.data.id);
    },
  }),
);

// Later: cleanup() tears down everything.
```

### 4.2 `nativeDroppable`

```ts
interface NativeDroppableConfig<T extends Record<string, unknown> = Record<string, unknown>> {
  /** The drop target DOM element. */
  element: HTMLElement;

  /**
   * Dynamic data — called on every dragover. Enables edge detection,
   * insertion indicators, and other pointer-position-aware behaviors.
   */
  getData?: (args: { input: Input; element: HTMLElement }) => T;

  /** Filter which drags this target accepts. */
  accept?: (args: { source: DragSource }) => boolean;

  /** Cursor icon when hovering. Automatically set on dataTransfer. */
  dropEffect?: 'copy' | 'move' | 'link' | 'none';

  /**
   * When true, keeps this target "active" even when the pointer
   * briefly leaves (e.g., between gap areas in a sortable list).
   */
  getIsSticky?: () => boolean;

  // --- Lifecycle events ---
  onDragEnter?: (args: DroppableEvent) => void;
  onDrag?: (args: DroppableEvent) => void;
  onDragLeave?: (args: DroppableEvent) => void;
  onDrop?: (args: DroppableDropEvent) => void;
}

function nativeDroppable<T>(config: NativeDroppableConfig<T>): () => void;
```

**Example: Edge Detection with Dynamic `getData`**
```ts
nativeDroppable({
  element: listItemEl,
  getData: ({ input, element }) => {
    const rect = element.getBoundingClientRect();
    const relativeY = (input.clientY - rect.top) / rect.height;
    return {
      itemId: 'item-1',
      closestEdge: relativeY < 0.5 ? 'top' : 'bottom',
    };
  },
  onDrop: ({ source, self, dropTargets }) => {
    // self.data.closestEdge tells us where to insert
    // dropTargets gives the full nesting hierarchy
  },
});
```

### 4.3 `nativeMonitor`

```ts
interface NativeMonitorConfig {
  /** Optional filter — only monitor matching drags. */
  canMonitor?: (args: { source: DragSource }) => boolean;

  onStart?: (args: MonitorStartEvent) => void;
  onMove?: (args: MonitorEvent) => void;
  onTargetChange?: (args: MonitorEvent) => void;
  onDrop?: (args: MonitorDropEvent) => void;
  onEnd?: (args: MonitorEndEvent) => void;
}

function nativeMonitor(config: NativeMonitorConfig): () => void;
```

**Example: Global Reorder Logic**
```ts
import { nativeMonitor, preventUnhandled } from 'dragdoll/native';

nativeMonitor({
  canMonitor: ({ source }) => source.type === 'internal' && source.data.kind === 'card',
  onStart: () => preventUnhandled.start(),
  onDrop: ({ source, dropTargets }) => {
    const [innermost] = dropTargets;
    if (innermost) {
      reorderCards(source.data.id, innermost.data.columnId, innermost.data.closestEdge);
    }
  },
  // onEnd always fires — cleanup goes here
  onEnd: () => preventUnhandled.stop(),
});
```

### 4.4 Cross-Window & File Drops

**App A: Providing Cross-Window Payload**
```ts
nativeDraggable({
  element: document.getElementById('card')!,
  getData: () => ({ id: 123, title: 'Card 1' }),
  getExternalData: () => ({
    'text/plain': 'https://my-app.com/issues/123',
    'application/vnd.my-app.card': JSON.stringify({ id: 123, title: 'Card 1' }),
  }),
});
```

**App B: Receiving Cross-Window or File Drops**
```ts
nativeDroppable({
  element: document.getElementById('drop-zone')!,
  accept: ({ source }) => {
    // Unified: works for internal, cross-window, AND OS file drops
    if (source.type === 'internal') return source.data.kind === 'card';
    if (source.type === 'external') return source.types.includes('Files');
    return false;
  },
  onDrop: ({ source }) => {
    if (source.type === 'external') {
      const files = source.getFiles();
      if (files.length) {
        console.log(`Dropped ${files.length} files`);
      } else {
        const raw = source.getData('application/vnd.my-app.card');
        console.log('Cross-window:', JSON.parse(raw!));
      }
    }
  },
});
```

### 4.5 Drag Preview

```ts
import {
  nativeDraggable,
  setCustomDragPreview,
  disableDragPreview,
  centerUnderPointer,
  preserveOffsetOnSource,
} from 'dragdoll/native';

nativeDraggable({
  element: cardEl,
  onGeneratePreview: ({ nativeSetDragImage }) => {
    // Option A: Custom rendered preview
    setCustomDragPreview({
      nativeSetDragImage,
      render({ container }) {
        const preview = document.createElement('div');
        preview.className = 'drag-preview';
        preview.textContent = 'Dragging card...';
        container.appendChild(preview);
      },
      placement: centerUnderPointer(),
    });

    // Option B: Disable native ghost entirely (for custom overlay rendering)
    // disableDragPreview({ nativeSetDragImage });
  },
});
```

---

## 5. Shared Types

### 5.1 Input

Normalized from the native event. Available on all lifecycle events.

```ts
interface Input {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  button: number;
}
```

### 5.2 DragSource

Represents the thing being dragged. Discriminated union based on source origin.

```ts
// Internal drag (same window, via nativeDraggable)
interface InternalDragSource<T = Record<string, unknown>> {
  type: 'internal';
  element: HTMLElement;
  data: T;
}

// External drag (cross-window, OS file drop, text selection)
interface ExternalDragSource {
  type: 'external';
  types: readonly string[];
  getData: (mimeType: string) => string | null;
  getFiles: () => File[];
}

type DragSource<T = Record<string, unknown>> = InternalDragSource<T> | ExternalDragSource;
```

### 5.3 DropTarget

Represents a matched droppable in the hierarchy.

```ts
interface DropTarget<T = Record<string, unknown>> {
  element: HTMLElement;
  data: T;
  dropEffect: 'copy' | 'move' | 'link' | 'none';
}
```

### 5.4 Event Payloads

All events include `source` and `input`. Drop target events additionally include `self` (this target's data) and `dropTargets` (full hierarchy, innermost first).

```ts
// Draggable events
interface DraggableStartEvent<T> { source: InternalDragSource<T>; input: Input; }
interface DraggableEvent<T> { source: InternalDragSource<T>; input: Input; }
interface DraggableEndEvent<T> { source: InternalDragSource<T>; input: Input; }

// Droppable events
interface DroppableEvent {
  source: DragSource;
  self: DropTarget;
  dropTargets: DropTarget[];
  input: Input;
}
interface DroppableDropEvent extends DroppableEvent {}

// Monitor events
interface MonitorStartEvent { source: DragSource; input: Input; }
interface MonitorEvent { source: DragSource; dropTargets: DropTarget[]; input: Input; }
interface MonitorDropEvent extends MonitorEvent {}
interface MonitorEndEvent { source: DragSource; input: Input; }
```

---

## 6. Event Lifecycle

### 6.1 Full Lifecycle

```
onGeneratePreview  →  Synchronous during dragstart. Only time setDragImage works.
onStart            →  Drag has begun. Fires on draggable + monitors.
onMove             →  Pointer moved. Fires on active droppables + monitors.
onTargetChange     →  The set of hovered drop targets changed (monitors only).
onDrop             →  Successful drop on valid target. Fires on droppable + monitors.
onEnd              →  Drag ended (dropped OR cancelled). Always fires. Cleanup goes here.
```

### 6.2 Per-Droppable Lifecycle

```
onDragEnter   →  Pointer entered this drop target's bounds.
onDrag        →  Pointer is moving while over this target.
onDragLeave   →  Pointer left this drop target.
onDrop        →  Drop occurred on this target.
```

### 6.3 `onEnd` Always Fires

Whether the drag was dropped successfully or cancelled (Escape, broken drag, etc.), `onEnd` fires on the draggable and all monitors. This makes cleanup predictable — you never need to handle both `onDrop` and `onCancel`.

---

## 7. Architecture

### 7.1 Module Structure (`packages/dragdoll/src/native/`)

```
native/
├── index.ts                    # Public API exports
├── native-lifecycle-manager.ts # Singleton: window listeners, state machine
├── native-draggable.ts         # nativeDraggable() factory
├── native-droppable.ts         # nativeDroppable() factory
├── native-monitor.ts           # nativeMonitor() factory
├── native-auto-scroll.ts       # Auto-scroll integration adapter
├── registry.ts                 # WeakMap<Element, Entry> registries
├── drag-preview.ts             # setCustomDragPreview, disableDragPreview, placement helpers
├── prevent-unhandled.ts        # preventUnhandled.start() / .stop()
├── combine.ts                  # combine() utility
├── input.ts                    # Input normalization (with Firefox/Chrome workarounds)
├── types.ts                    # All shared types
└── platform.ts                 # Platform edge case detection & workarounds
```

### 7.2 Lifecycle Manager (Singleton)

The `NativeLifecycleManager` is the heart of the module. It:

1. **Lazily binds window listeners** — only attaches `dragstart`, `dragenter`, `dragover`, `dragleave`, `drop`, `dragend` when at least one draggable or droppable is registered (usage ledger pattern).
2. **Manages a drag state machine** — tracks the active drag source, current drop targets, and stickiness state.
3. **Resolves drop target hierarchy** — on every `dragover`, walks up from `event.target` using the `WeakMap<Element, DroppableEntry>` registry and builds a `dropTargets[]` array (innermost first).
4. **Dispatches lifecycle events** — calls the appropriate callbacks on droppables and monitors.
5. **Handles the flicker fix** — when the pointer transitions between a parent drop zone and its DOM children, the manager compares the new target hierarchy against the previous one and suppresses spurious `dragleave`/`dragenter` noise.

```ts
// Core registry — O(1) lookup, auto-GC when elements are removed from DOM
const droppableRegistry = new WeakMap<Element, DroppableEntry>();
const draggableRegistry = new WeakMap<Element, DraggableEntry>();

// Drop target resolution (called on every dragover)
function getDropTargetsOver(target: EventTarget | null): DroppableEntry[] {
  const result: DroppableEntry[] = [];
  let current = target instanceof Element ? target : null;
  while (current) {
    const entry = droppableRegistry.get(current);
    if (entry && (!entry.config.accept || entry.config.accept({ source: activeDragSource }))) {
      result.push(entry);
    }
    current = current.parentElement;
  }
  return result; // innermost first
}
```

### 7.3 Singleton vs Instance

The lifecycle manager is a **true singleton** — there can only be one active drag at a time in the browser. However, multiple monitors can be registered simultaneously (each filtering via `canMonitor`). Window event listeners are bound only when registrations exist and unbound when the last registration is removed.

### 7.4 `dropEffect` Management

On every `dragover`, the lifecycle manager reads the `dropEffect` from the innermost matched drop target and sets it on `event.dataTransfer.dropEffect`. This controls the cursor icon without consumers touching the native API.

### 7.5 Stickiness

When a droppable's `getIsSticky()` returns `true`, the lifecycle manager keeps it in the active `dropTargets` array even if the pointer temporarily leaves its bounds. This prevents rapid enter/leave flashing when moving between items in a sortable list or hovering over gaps.

### 7.6 Drag Handle

On `dragstart`, the draggable entry checks if the event originated within the `dragHandle` element (if specified) using `dragHandle.contains(event.target)`. If not, the drag is cancelled via `event.preventDefault()`.

---

## 8. Platform Edge Cases

The lifecycle manager must handle these known browser bugs transparently:

| Issue | Workaround |
|:---|:---|
| **Android Chrome requires data** | On dragstart, always set at least `text/plain` with a sentinel value if no `getExternalData` is provided. |
| **iOS 15 requires data** | Same as Android — must set at least one data item. |
| **Firefox `drag` event has `clientX/Y = 0`** | Use `dragover` as the primary "move" event (it provides coordinates). Never read coordinates from `drag` events. |
| **Chrome `dragleave` has `clientX/Y = 0`** | The final `dragleave` when leaving the window reports default coordinates. Do not update Input from this event. |
| **Text selection vs element drag** | When text inside a draggable is selected, `dragstart` may fire for a text selection drag. Detect and disambiguate using `event.dataTransfer.types`. |
| **Broken drags** | Drags can break mid-operation (Escape, alert dialogs, etc.). Implement recovery detection to ensure `onEnd` always fires. |
| **`setDragImage` cross-browser** | Windows Chrome applies extra transparency; Safari renders differently; offset calculations vary. Preview helpers abstract this. |

---

## 9. Auto-Scroll Integration

The existing `AutoScroll` class (`packages/dragdoll/src/auto-scroll/auto-scroll.ts`) is a generic, framework-agnostic auto-scroll engine that works with any rect + position input. We reuse it directly via a thin adapter.

### 9.1 Adapter Design

```ts
import { AutoScroll } from 'dragdoll/auto-scroll';

interface NativeAutoScrollConfig {
  /** Scrollable containers to auto-scroll. */
  targets: AutoScrollItemTarget[];
  /** Speed configuration. Defaults to autoScrollSmoothSpeed(). */
  speed?: number | AutoScrollItemSpeedCallback;
  /** Size of the inert area (center of the scroll container where scrolling doesn't trigger). */
  inertAreaSize?: number;
  /** Enable smooth deceleration when the pointer leaves the threshold zone. */
  smoothStop?: boolean;
  /** Optional filter — only auto-scroll for matching drags. */
  canScroll?: (args: { source: DragSource }) => boolean;
}

/**
 * Register auto-scrolling for native drags. Internally creates a nativeMonitor
 * that feeds pointer position into the existing AutoScroll engine.
 *
 * Returns a cleanup function.
 */
function nativeAutoScroll(config: NativeAutoScrollConfig): () => void;
```

### 9.2 Implementation

The adapter:
1. Creates a `nativeMonitor` internally.
2. On `onStart`, creates an `AutoScroll` instance and adds a single `AutoScrollItem` with the configured targets.
3. On `onMove`, updates the item's `clientRect` (a 1x1 rect at the pointer position) and `position`.
4. On `onEnd`, removes the item and destroys the `AutoScroll` instance.

This reuses all the existing auto-scroll logic (threshold computation, smooth speed, overlap checking, multi-target priority, axis configuration) without duplication.

### 9.3 Example

```ts
import { nativeAutoScroll, autoScrollSmoothSpeed } from 'dragdoll/native';

nativeAutoScroll({
  targets: [
    { element: scrollableList, axis: 'y', threshold: 60 },
    { element: window, axis: 'y', priority: -1 },
  ],
  speed: autoScrollSmoothSpeed(600, 0.4, 0.2),
  canScroll: ({ source }) => source.type === 'internal',
});
```

---

## 10. Framework Wrapper Design

The core API is designed so that React and Solid wrappers can be **thin hooks** that piggyback on the core implementation, following the same pattern as `useDraggable` / `useDroppable` wrap the core `Draggable` / `Droppable` classes.

### 10.1 Design Principles for Wrappers

1. **Cleanup functions → `useEffect` return values.** Every core function returns `() => void`. React/Solid hooks call the core inside an effect and return the cleanup.
2. **Configs via refs.** Wrappers store callbacks (`onDrop`, `getData`, etc.) in refs to avoid re-registrations on every render. The core is called once; the wrapper's internal callbacks read from refs.
3. **Reactivity from monitors.** Global state (e.g., "is anything dragging?", "what's being dragged?") comes from `nativeMonitor` — wrappers create an internal monitor and expose its state as reactive signals/state.
4. **No parallel API.** Wrappers don't duplicate core logic. They call `nativeDraggable()`, `nativeDroppable()`, `nativeMonitor()` directly.

### 10.2 Projected React API

```tsx
// React wrapper hooks (in dragdoll-react)
import { useNativeDraggable, useNativeDroppable, useNativeMonitor } from 'dragdoll-react';

function Card({ id, title }: { id: number; title: string }) {
  const dragRef = useNativeDraggable({
    getData: () => ({ id, title }),
    dragHandle: gripRef,
  });
  return <div ref={dragRef}>...</div>;
}

function Column() {
  const [dropRef, { isOver }] = useNativeDroppable({
    accept: ({ source }) => source.type === 'internal',
    getData: ({ input, element }) => {
      const rect = element.getBoundingClientRect();
      return { closestEdge: (input.clientY - rect.top) / rect.height < 0.5 ? 'top' : 'bottom' };
    },
  });
  return <div ref={dropRef} className={isOver ? 'highlight' : ''}>...</div>;
}

function Board() {
  useNativeMonitor({
    onDrop: ({ source, dropTargets }) => {
      // Reorder logic lives here, decoupled from any DOM element
    },
  });
  return <div>...</div>;
}
```

### 10.3 What the Core Must Provide for Wrappers

| Core feature | Enables in wrappers |
|:---|:---|
| Cleanup functions | Effect teardown |
| `nativeMonitor` with `onTargetChange` | Reactive `isOver` / `isDragging` state |
| `dropTargets[]` hierarchy | Shallow vs deep `isOver` detection |
| `accept` filtering | Conditional highlighting |
| `getData` dynamic calling | Edge detection without wrapper logic |
| Typed generics on configs | End-to-end type safety in hooks |
| `preventUnhandled` as standalone API | Hook-level auto-configuration |

---

## 11. Entry Points & Build

### 11.1 Source Entry Point

```
packages/dragdoll/src/native/index.ts
```

### 11.2 tsdown Entry

In `packages/dragdoll/tsdown.config.ts`:
```ts
{
  native: 'src/native/index.ts',
}
```

### 11.3 package.json Export

In `packages/dragdoll/package.json`:
```json
{
  "./native": "./dist/native.js"
}
```

### 11.4 Consumer Import

```ts
import { nativeDraggable, nativeDroppable, nativeMonitor } from 'dragdoll/native';
```

---

## 12. Exported API Summary

```ts
// Core factories
export function nativeDraggable<T>(config: NativeDraggableConfig<T>): () => void;
export function nativeDroppable<T>(config: NativeDroppableConfig<T>): () => void;
export function nativeMonitor(config: NativeMonitorConfig): () => void;
export function nativeAutoScroll(config: NativeAutoScrollConfig): () => void;

// Drag preview
export function setCustomDragPreview(config: CustomDragPreviewConfig): void;
export function disableDragPreview(config: DisableDragPreviewConfig): void;
export function centerUnderPointer(): DragPreviewPlacement;
export function preserveOffsetOnSource(): DragPreviewPlacement;
export function offsetFromPointer(offset: { x: number; y: number }): DragPreviewPlacement;

// Utilities
export function combine(...cleanups: (() => void)[]): () => void;
export const preventUnhandled: { start(): void; stop(): void };

// Types (re-exported for consumers)
export type {
  NativeDraggableConfig,
  NativeDroppableConfig,
  NativeMonitorConfig,
  NativeAutoScrollConfig,
  Input,
  DragSource,
  InternalDragSource,
  ExternalDragSource,
  DropTarget,
  DragPreviewPlacement,
  // ... all event payload types
};
```

---

## 13. Execution Roadmap

### Phase 1: Core Infrastructure
- [ ] Create `packages/dragdoll/src/native/` directory structure.
- [ ] Implement `types.ts` — all shared types, `Input`, `DragSource`, `DropTarget`, event payloads.
- [ ] Implement `input.ts` — Input normalization with Firefox/Chrome workarounds.
- [ ] Implement `platform.ts` — platform detection and edge case constants.
- [ ] Implement `registry.ts` — `WeakMap` registries for draggables and droppables.
- [ ] Implement `combine.ts` — trivial cleanup merger.
- [ ] Implement `prevent-unhandled.ts` — window-level drop prevention.

### Phase 2: Lifecycle Manager
- [ ] Implement `native-lifecycle-manager.ts` — the singleton state machine:
  - Lazy window listener binding/unbinding (usage ledger).
  - Drag state tracking (active source, current targets).
  - Drop target hierarchy resolution (DOM walk + `WeakMap` lookup).
  - Flicker suppression (compare previous vs new target set).
  - Stickiness support (`getIsSticky` per target).
  - `dropEffect` management (innermost target wins).
  - Broken drag recovery.
  - Platform edge case handling (Android/iOS sentinel data, Firefox coordinates).

### Phase 3: Public API Factories
- [ ] Implement `native-draggable.ts` — `nativeDraggable()`:
  - Sets `draggable="true"` on element.
  - Registers with lifecycle manager.
  - Handles `dragHandle` via `contains()` check on `dragstart`.
  - Wires `canDrag` guard.
  - Calls `getData()` + `getExternalData()` on dragstart.
  - Dispatches `onGeneratePreview`, `onStart`, `onMove`, `onEnd`.
- [ ] Implement `native-droppable.ts` — `nativeDroppable()`:
  - Registers element in `WeakMap` registry.
  - Wires `accept` filter, `getData` (dynamic), `dropEffect`, `getIsSticky`.
  - Receives `onDragEnter`, `onDrag`, `onDragLeave`, `onDrop` from lifecycle manager.
- [ ] Implement `native-monitor.ts` — `nativeMonitor()`:
  - Registers with lifecycle manager (no element).
  - Wires `canMonitor` filter.
  - Receives `onStart`, `onMove`, `onTargetChange`, `onDrop`, `onEnd`.
- [ ] Implement `drag-preview.ts` — preview helpers:
  - `setCustomDragPreview`: creates off-screen container, calls render callback, uses `setDragImage`.
  - `disableDragPreview`: creates 1x1 transparent image, uses `setDragImage`.
  - Placement helpers: compute x/y offsets for `setDragImage`.
- [ ] Implement `index.ts` — all public exports.

### Phase 4: Auto-Scroll
- [ ] Implement `native-auto-scroll.ts` — adapter between native monitors and `AutoScroll` class.
- [ ] Wire `autoScrollSmoothSpeed` re-export.

### Phase 5: Build Integration
- [ ] Add `native` entry to `tsdown.config.ts`.
- [ ] Add `./native` export to `package.json`.
- [ ] Verify `npm run build` succeeds.
- [ ] Verify tree-shaking: importing only `nativeDraggable` should not bundle auto-scroll or preview code.

### Phase 6: Verification
- [ ] Build a local test page demonstrating:
  - Internal drag & drop (same window).
  - Cross-window drag & drop.
  - OS file drops.
  - Nested drop targets with hierarchy.
  - Stickiness between list items.
  - Custom drag previews.
  - Auto-scroll in a scrollable container.
  - `combine()` and `preventUnhandled` usage.
- [ ] Verify all platform edge cases in Chrome, Firefox, and Safari.

---

## 14. Verification Plan

### Automated
- `npm run build` — must succeed with no errors.
- `npm run lint` — must pass TypeScript, ESLint, and Prettier checks.
- Tree-shaking verification: bundle size analysis to ensure modular imports work.

### Manual
- Local test page covering all examples from Section 4.
- Cross-browser testing in Chrome, Firefox, Safari (macOS).
- Mobile testing on Android Chrome and iOS Safari for sentinel data workarounds.
- Cross-window drag testing between two browser tabs.
- OS file drop testing from Finder/desktop.
