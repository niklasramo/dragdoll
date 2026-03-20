# Accessibility

DragDoll is a pointer-based drag-and-drop library. It does **not** provide any accessible patterns, utilities, ARIA helpers, or screen reader modules out of the box. Even the keyboard sensors are purely visual movement tools — they are not accessible by default.

What DragDoll _does_ provide are building blocks you can use to implement whatever accessibility pattern your application needs.

## What DragDoll Provides

**Built-in:**

- **Lifecycle events** (`start`, `move`, `end`) on both [`Draggable`](/draggable) and [`DndObserver`](/dnd-observer) — use these as integration points to wire your own accessible logic. Cancellation is indicated by a `canceled` flag on the `end` event.
- **Collision data** via [`DndObserver`](/dnd-observer) — know which droppables are in contact during a drag.
- **Focus restoration** — when elements are reparented during drag (via the [`container`](/draggable#container) option), focus is automatically restored without scrolling the page.
- **Keyboard sensors** — for visual pixel-based keyboard movement (see [Keyboard Sensors](#keyboard-sensors) below). These are not accessible by default — you must add ARIA attributes, announcements, and instructions yourself.

**Not built-in (you must implement):**

- ARIA attributes (`aria-roledescription`, `aria-describedby`, etc.)
- Screen reader announcements (live regions)
- Keyboard interaction instructions
- Accessible reordering / sorting logic
- Any keyboard flow beyond visual pixel movement

## Keyboard Interaction Patterns

For pointer and touch users, drag and drop is always a visual interaction: picking an element up, moving it, and dropping it. For keyboard and assistive technology users, the equivalent interaction depends entirely on what you're building.

There is no single "accessible drag" pattern. The right approach varies by use case:

1. **Visual keyboard drag**: The keyboard directly moves elements on screen (e.g., placing items on a canvas, arranging elements in 2D space). DragDoll's keyboard sensors handle the movement, but you still need to add ARIA attributes and screen reader announcements to make it accessible.
2. **Semantic keyboard flow**: The interaction model differs from drag, but the result is the same. For a sortable list: pick up an item, use arrow keys to swap it with neighbors, and drop or cancel. This provides immediate visual feedback and screen reader announcements. See the [Sortable List - Accessible](/examples#sortable-list-accessible) example.
3. **Alternative UIs**: Sometimes the keyboard equivalent isn't drag at all. Moving a card between kanban columns might be a `<select>` dropdown. Deleting an item might be a context menu action instead of dragging to a trash can.

### Why Not Use Keyboard Sensors for Sorting?

Some drag-and-drop libraries repurpose their keyboard sensor for accessible sorting. The approach: replace the default per-keystroke movement with a custom coordinate getter that computes the position of the next or previous sortable item. The dragged element physically moves there, collision detection fires, and the same sort handler runs as for pointer drag.

While technically possible in DragDoll (via a custom `movePredicate` on `KeyboardSensor`), **we don't recommend it** for structured interactions like sorting:

**Pros:**

- Unified code path — the same collision handler works for both pointer and keyboard drag.
- Reuses existing `DndObserver` wiring with no additional sort logic.

**Cons:**

- **Roundabout.** You already know the item should go to index N±1, but instead you compute pixel coordinates → move the element → run collision detection → map the collision back to an index. A custom keyboard flow does the same thing in one step.
- **More code.** Building a custom keyboard flow that directly manipulates your data model is typically less code than the coordinate computation needed to repurpose a visual drag system for the same task. See the [Sortable List - Accessible](/examples#sortable-list-accessible) example.
- **Worse UX.** The dragged element visually slides to the target position, then collision detection triggers the reorder. With a custom flow, pressing an arrow key instantly reindexes the item with animation — the feedback is immediate.
- **Fragile.** The collision threshold (e.g., 51% overlap) must be hit precisely. If the computed coordinates are slightly off due to rounding, gaps, or scroll offsets, the collision may not fire or may fire for the wrong target. Direct index manipulation doesn't have this failure mode.
- **Still needs custom code.** Even with keyboard input routed through `DndObserver`, you still need custom code for live region announcements, cancel-to-restore logic, focus management after drop, and a custom start key. The collision pipeline doesn't provide any of these.
- **Not inherently accessible.** The keyboard sensor emits coordinate-based events, not semantic events. It has no concept of "moved to position 3 of 10" — only "moved to (x: 120, y: 340)." All accessibility semantics must still be built on top.

For structured keyboard interactions (sorting, kanban, tree views), build a [custom keyboard flow](/examples#sortable-list-accessible) that directly manipulates your data model. Reserve keyboard sensors for use cases where pixel-based movement is the natural interaction (canvas positioning, free-form layout editors).

## Keyboard Sensors

DragDoll ships two keyboard sensors designed for **visual movement** only. They emit coordinate-based events that move elements on screen via keypresses. They require DOM focus on the sensor element to start a drag and cancel on blur, but they do not set ARIA attributes, manage screen reader announcements, or communicate drag state to assistive technology. If you use them, you must add your own accessibility layer on top.

### Sensor Types

- **[`KeyboardSensor`](/keyboard-sensor)**: Moves the element in discrete steps on each keypress (default: 25px). Ideal for free-form positioning.
- **[`KeyboardMotionSensor`](/keyboard-motion-sensor)**: Moves the element continuously while arrow keys are held (default: 500px/s). Ideal for game-like interfaces or smooth continuous motion.

### Setup and Key Bindings

For keyboard sensors to work, the sensor's element must be natively focusable (`<button>`, `<a>`) or have `tabindex="0"`.

Both sensors share the same default bindings (which are fully customizable):

| Action     | Keys                                              |
| ---------- | ------------------------------------------------- |
| Start drag | `Space` or `Enter` (when element is focused)      |
| Move       | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| Drop       | `Space` or `Enter`                                |
| Cancel     | `Escape`                                          |

## Screen Reader Support

### ARIA Attributes

The right ARIA attributes depend on the element's role in your UI and which keyboard interaction pattern you've chosen. For drag-like keyboard flows (Patterns 1 and 2 above), two attributes are commonly useful:

- `aria-roledescription`: Overrides the screen reader's default role label. Use a value that describes the element in context (e.g., `"sortable item"`, `"draggable card"`) rather than the generic `"draggable"`.
- `aria-describedby`: Points to a visually hidden element containing keyboard instructions that match your actual keyboard flow.

For Pattern 3 (alternative UIs like context menus or dropdowns), drag-oriented ARIA attributes would be misleading — use standard ARIA patterns for the UI you've built instead.

Label drop zones so screen readers can identify them in announcements:

```html
<div class="drop-zone" aria-label="Drop zone 1"></div>
```

### Instructions Element

Provide a visually hidden element describing how to interact with draggable items. Screen readers read this when the user focuses a draggable element (via `aria-describedby`). Tailor the text to match whatever keyboard pattern you've implemented:

```html
<div id="dnd-instructions" class="sr-only">
  Press Space to pick up. Arrow keys to move. Space to drop. Escape to cancel.
</div>
```

### Announcements (Live Regions)

Screen reader users need announcements to understand what's happening during a drag or keyboard reorder. Create a visually hidden live region and update its text content at each stage of the interaction (pick up, move, drop, cancel):

```html
<div
  id="dnd-live-region"
  class="sr-only"
  role="status"
  aria-live="assertive"
  aria-atomic="true"
></div>
```

- `aria-live="assertive"` — screen reader interrupts to read the update immediately.
- `aria-atomic="true"` — reads the entire element content, not just the diff.

Wire announcements to DragDoll's lifecycle events (`start`, `move`, `end`) on [`Draggable`](/draggable) or [`DndObserver`](/dnd-observer), or to your own custom keyboard flow. See the [Sortable List - Accessible](/examples#sortable-list-accessible) example for a full implementation.

### Visually Hidden CSS

Use a utility class like `.sr-only` to visually hide instruction and announcement elements while keeping them accessible:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(100%);
  border: 0;
  white-space: nowrap;
}
```

## Focus Management

When DragDoll reparents elements during drag (via the [`container`](/draggable#container) option), focus is automatically restored without scrolling the page. For keyboard-driven drags, the element retains focus throughout the drag and after dropping.

For custom focus behavior after a drop (e.g., moving focus to the drop target), use the `onEnd` callback on [`Draggable`](/draggable) or [`DndObserver`](/dnd-observer).
