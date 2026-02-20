# Dragdoll Drag and Drop Library

## Your Role

You are a senior full-stack developer. One of those rare 10x developers that has incredible knowledge on all things frontend, backend, and devops. You are especially good at writing high-performing modern TypeScript code. And have a deep knowledge of drag and drop techniques and libraries. You have a burning passion to make the best drag and drop library for the web, ever.

## Project Context

This is a vanilla TypeScript library for drag and drop functionality called "dragdoll". The library uses a modular architecture with sensors, draggables, and droppables. Documentation is built with VitePress.

## React Integration

The library has a React integration package called "dragdoll-react". The React integration package is a wrapper around the core library that provides React hooks for the core library. The React integration package is built with tsdown.

## Architecture

- Sensors: Handle input events (pointer, keyboard, etc.) and emit events when user interactions occur.
- Draggable: Manages draggable elements and their movement (listen to sensors and move elements).
- Droppable: Defines drop targets (areas/elements where elements can be dropped).
- DndObserver: Orchestrates interactions between draggables and droppables (manages collision detection and event propagation).

## Core Principles

- Performance is the top priority - optimize for speed and minimal DOM operations.
- Accessibility compliance is essential.
- Support both mouse and touch interactions.
- Cross-browser compatibility for modern browsers.
- Minimal dependencies, vanilla implementation.

## Coding Guidelines

- Performance is top priority. It's okay to sacrifice readability for performance.
- Less code is better. Lines of code = Debt.
- Use early returns to avoid nested conditions and improve readability.
- Use descriptive names for variables and functions. Prefix event handler functions with "on" (e.g., onClick, onKeyDown).
- Focus on writing correct, best practice, DRY (Don't Repeat Yourself) code.
- Only modify sections of the code related to the task at hand. Avoid modifying unrelated pieces of code.
- Alias class properties (e.g., `const drag = this.drag;`) locally if it makes the code cleaner to read AND improves performance (even if just a little bit). However, do NOT apply this pattern if it's used for only one instance, in which case the pattern actually degrades performance.
- Order functions with those that are composing other functions appearing earlier in the file.
- If you encounter a bug in existing code, add comments starting with "TODO:" outlining the problems.

## Code Style

- Use 2-space indentation.
- Prefer single quotes for strings.
- Use semicolons at the end of statements.
- Maximum line length is 100 characters for code files (including comments).
- In Markdown files do not limit line length or comment length, unless it's a code block.
- Use TypeScript for type safety.
- Use PascalCase for class names, interfaces, and types.
- Use camelCase for variables, functions, and methods.
- Use UPPER_SNAKE_CASE for constants.
- Use kebab-case for file names.

## Monorepo Structure

- `packages/dragdoll/` - Core library.
  - `src/` - Source code.
    - `sensors/` - Input event handlers
    - `draggable/` - Draggable implementation
      - `modifiers/` - Position modifier functions
      - `plugins/` - Draggable plugins (e.g., snap, scroll)
      - `helpers/` - Internal helper utilities
    - `droppable/` - Droppable implementation
    - `dnd-observer/` - DndObserver implementation
    - `auto-scroll/` - Auto-scroll functionality during drag
    - `singletons/` - Shared singleton instances
    - `utils/` - Utility functions
    - `types.ts` - Common type definitions
    - `constants.ts` - Shared constants
  - `dist/` - Built library files.
- `packages/dragdoll-react/` - React integration package.
  - `src/` - Source code.
    - `hooks/` - React hooks wrapping core library
    - `contexts/` - React context providers
    - `utils/` - React-specific utility functions
  - `dist/` - Built library files.
- `packages/dragdoll-docs/` - VitePress documentation site and examples.
  - `docs/` - VitePress docs content.
  - `docs/react/` - VitePress docs React integration content.
  - `docs/public/` - VitePress docs public assets.
  - `examples/` - Core library examples used in the docs.
  - `react-examples/` - React integration examples used in the docs.
  - `scripts/` - Docs/example build scripts.
- `packages/dragdoll-tests/` - Internal tests (WebDriver.io with Mocha).
  - `src/` - Test sources.
  - `dist/` - Bundled tests.
- `packages/dragdoll-react-tests/` - React integration tests (WebDriver.io with Mocha).
  - `src/` - Test sources.
  - `dist/` - Bundled tests.

## Root Commands

- `npm run build` - Runs format, builds `dragdoll` and `dragdoll-react` libraries, builds `dragdoll-docs` examples, then formats again.
- `npm run test:local` - Runs tests (from `dragdoll-tests`) locally in Chrome and Firefox.
- `npm run test:bs` - Runs tests (from `dragdoll-tests`) in BrowserStack.
- `npm run test:react:local` - Runs React integration tests (from `dragdoll-react-tests`) locally.
- `npm run test:react:bs` - Runs React integration tests (from `dragdoll-react-tests`) in BrowserStack.
- `npm run docs:dev` - Runs VitePress docs site in development mode.
- `npm run docs:build` - Builds VitePress docs site.
- `npm run docs:serve` - Serves VitePress docs site.
- `npm run ts:check` - Checks TypeScript types across workspaces.
- `npm run prettier:check` - Checks Prettier formatting across workspaces.
- `npm run prettier:write` - Formats Prettier formatting across workspaces.
- `npm run eslint:check` - Checks ESLint errors across workspaces.
- `npm run eslint:write` - Fixes ESLint errors across workspaces.
- `npm run lint` - Runs TypeScript checks, Prettier checks, and ESLint checks across workspaces.
- `npm run format` - Fixes ESLint errors and formats with Prettier across workspaces.

## Key Dependencies

- `eventti` - Event emitter library used for all event handling.
- `mezr` - DOM measurement library used for element offset containers and distance calculations.
- `tikki` - Animation ticker used for frame-based updates with read/write phase batching.

## Common Patterns

- Use the Emitter pattern (via `eventti`) for event handling.
- Leverage TypeScript for strong typing.
- Implement modifiers for customizing behavior (e.g., position modifiers are pure functions: `(position, data) => position`).
- Maintain separation of concerns between components.
- Use object pooling and caching to minimize allocations during drag operations.
- Batch DOM reads and writes using `tikki`'s read/write phases to avoid layout thrashing.
- Use the plugin architecture in Draggable for extensible functionality.

## Git

- Do NOT add `Co-Authored-By` lines in commit messages if the co-author is not a human.

## Testing

- Run tests from the repository root.
- ALWAYS use `npm run test:local` (core) and `npm run test:react:local` (React) for local runs; they're much faster than the `:bs` (BrowserStack) variants. Only use cloud tests when explicitly requested.
- Always run `npm run build` at the root before running tests to make sure the library and tests are built.

## Performance Patterns

The following patterns are actively used throughout the codebase. Always apply them when they are applicable.

---

### 1. Event Object Pooling

**Rule:** Never allocate a new event payload object in **hot paths** (e.g., `move` events, which fire 60–120× per second). Reuse a single object allocated earlier and **mutate it in place**. Listeners receive the same reference each tick so they must not hold onto it across async boundaries.

It is perfectly fine — and often preferred — to allocate a fresh object for **non-hot paths** (e.g., `start`, `end`, `destroy` events that fire at most once per interaction). Do not over-optimize these.

```ts
// ✅ CORRECT – fresh allocation on start (non-hot path, fine!)
protected _onStart(e: PointerEvent) {
  this._eventData = {
    type: SensorEventType.Start,
    x: e.clientX,
    y: e.clientY,
    srcEvent: e,
  };
  this._emitter.emit(this._eventData.type, this._eventData);
}

// ✅ CORRECT – mutate in place on move (HOT PATH – no allocation)
protected _onMove(e: PointerEvent) {
  const eventData = this._eventData;
  eventData.type = SensorEventType.Move;
  eventData.x = e.clientX;
  eventData.y = e.clientY;
  eventData.srcEvent = e;
  this._emitter.emit(eventData.type, eventData);
}

// ❌ WRONG – allocates a new object 120× per second at 120 Hz (hot path)
protected _onMove(e: PointerEvent) {
  this._emitter.emit('move', { ...this.drag, type: 'move', srcEvent: e });
}
```

> If `start` and `move` events have the same shape, the same object can be reused across both. If their shapes differ, allocate separate objects — one at start (fresh each drag), one reused per-move.

---

### 2. `Writeable<T>` Cast for Readonly Public Properties

**Rule:** Declare public state as `readonly` to enforce correct external usage. Internally bypass `readonly` via the `Writeable<T>` utility type (a mapped type that strips `readonly` from all keys). Never use `as any` for this purpose.

```ts
// types.ts
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// usage
class Foo {
  readonly isDestroyed: boolean = false;
  readonly drag: DragData | null = null;

  destroy() {
    (this as Writeable<this>).isDestroyed = true; // ✅
    (this.drag as Writeable<DragData>).x = 0; // ✅
  }
}
```

---

### 3. Bound Methods as Class Properties

**Rule:** For methods that are passed as event listener callbacks, declare them as arrow-function class properties _or_ bind them in the constructor. This avoids creating a new closure per `addEventListener` call and ensures correct `this`. Prefer binding in constructor to keep the class body readable; use arrow properties only for short inline handlers.

```ts
class PointerSensor {
  // Short inline handlers – arrow property is fine
  protected _preventNativeDragHandler = (e: Event) => e.preventDefault();
  protected _visibilityChangeHandler = () => this.cancel();

  constructor() {
    // Longer methods – bind in constructor
    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onEnd = this._onEnd.bind(this);
  }
}
```

---

### 4. Module-Level Pre-allocated Mutable Objects (Shared Scratchpads)

**Rule:** For computations that happen every frame (e.g., matrix math, position deltas, rects), pre-allocate a single module-level mutable object as a scratchpad instead of allocating a new one each call. The object is reused across calls. Never store references to such objects beyond the current synchronous call stack.

```ts
// Allocated once at module load time
const POSITION_CHANGE = { x: 0, y: 0 };
const ELEMENT_MATRIX = new DOMMatrix();
const TEMP_MATRIX = new DOMMatrix();

function applyPosition(item: DragItem) {
  // Reuse ELEMENT_MATRIX as a scratchpad – no allocation
  resetMatrix(ELEMENT_MATRIX);
  ELEMENT_MATRIX.translateSelf(item.position.x, item.position.y);
  ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
  item.element.style.transform = ELEMENT_MATRIX.toString();
}
```

---

### 5. `ObjectPool` – Grow-on-Demand, Shrink-on-Surplus

**Rule:** Use `ObjectPool` for objects that are frequently created and destroyed during drags (e.g., scroll requests, actions). The pool pre-warms a batch and returns existing items from a stack, calling the `getItem` factory only when the pool is exhausted.

```ts
import { ObjectPool } from '../utils/object-pool.js';

class AutoScroll {
  protected _requestPool = new ObjectPool<AutoScrollRequest>(
    (req) => req || new AutoScrollRequest(),
    { initialBatchCount: 1, minBatchCount: 1, onRelease: (r) => r.reset() },
  );

  protected _getRequest(item: AutoScrollItem): AutoScrollRequest {
    const req = this._requestPool.get(); // O(1), no allocation if pool has items
    req.item = item;
    return req;
  }

  protected _releaseRequest(req: AutoScrollRequest) {
    this._requestPool.release(req); // reset() called automatically via onRelease
  }
}
```

---

### 6. `ObjectArena` – Bump Allocator for Per-Frame Data

**Rule:** Use `ObjectArena` (bump-pointer allocator) for data that is wholly created and discarded within a single frame (e.g., collision data). Call `arena.allocate()` inside the frame loop and `arena.reset()` at the end—never `.pop()` or splice. This puts the GC completely out of the picture.

```ts
import { ObjectArena } from '../utils/object-arena.js';

class CollisionDetector {
  protected _cdArena = new ObjectArena<CollisionData>(
    (existing) => existing || { droppableId: null, score: 0, rect: createRect() },
  );

  detectCollisions(targets: Droppable[]) {
    const collisions: CollisionData[] = [];
    for (const droppable of targets) {
      const data = this._cdArena.allocate(); // reuses existing object if available
      if (this._checkCollision(droppable, data)) {
        collisions.push(data);
      }
    }
    this._cdArena.reset(); // O(1) – just resets the index pointer
    return collisions;
  }
}
```

---

### 7. `ObjectCache` – Validated Lazy Cache

**Rule:** Use `ObjectCache` for expensive DOM measurements (world-transform matrices, client offsets) that are computed once and reused. Mark entries invalid via `cache.invalidate()` when the underlying state changes (e.g., on scroll/resize), never delete and re-insert.

```ts
import { ObjectCache } from '../utils/object-cache.js';

class DraggableDragItem {
  protected _matrixCache = new ObjectCache<HTMLElement, [DOMMatrix, DOMMatrix]>();

  getContainerMatrix(): [DOMMatrix, DOMMatrix] {
    const el = this.elementContainer;
    if (this._matrixCache.isValid(el)) {
      return this._matrixCache.get(el)!;
    }
    const matrices: [DOMMatrix, DOMMatrix] = [computeMatrix(el), computeInverseMatrix(el)];
    this._matrixCache.set(el, matrices); // marks as valid
    return matrices;
  }

  onScroll() {
    this._matrixCache.invalidate(); // invalidate all – will be recomputed on next access
  }
}
```

---

### 8. Read / Write Phase Batching via `ticker`

**Rule:** All DOM reads should happen in `tickerPhases.read` and all DOM writes in `tickerPhases.write`. **Avoid interleaving reads and writes** — this causes forced synchronous layouts (layout thrashing).

**Exception:** Sometimes a forced reflow is intentional and necessary. For example, after reparenting elements back to their original container at drag end, a `getBoundingClientRect()` call is required to measure where the element actually landed so the alignment can be corrected. In those cases, batch all DOM writes first (in separate loops), then do all DOM reads (in a separate loop), then apply the resulting writes. The key is: **separate read loops from write loops**, even when you can't avoid the reflow entirely.

```ts
// ✅ PREFERRED – tick-phase-separated read and write
protected _prepareStart() {
  ticker.once(tickerPhases.read, () => {
    this._cachedRect = this.element.getBoundingClientRect();
  });
}
protected _applyStart() {
  ticker.once(tickerPhases.write, () => {
    this.element.style.transform = `translate(${this._cachedRect.x}px, ${this._cachedRect.y}px)`;
  });
}

// ✅ ACCEPTABLE – intentional forced reflow at drag end, reads batched separately
stop() {
  // Loop 1: DOM writes
  for (const item of drag.items) {
    moveBefore(item.elementContainer, item.element);       // write
    applyPosition({ phase: 'end', item });                 // write
  }
  // Loop 2: DOM reads (forced reflow – intentional, unavoidable)
  for (const item of drag.items) {
    const rect = item.element.getBoundingClientRect();     // read after writes
    item.alignmentOffset.x = item.clientRect.x - rect.x;
    item.alignmentOffset.y = item.clientRect.y - rect.y;
  }
  // Loop 3: DOM writes again with corrected alignment
  for (const item of drag.items) {
    applyPosition({ phase: 'end-align', item });           // write
  }
}

// ❌ WRONG – interleaved read/write per item causes N forced reflows
for (const item of drag.items) {
  applyPosition({ phase: 'end', item });                   // write
  const rect = item.element.getBoundingClientRect();       // read → forced reflow!
  applyPosition({ phase: 'end-align', item });             // write
}

// For persistent per-frame work (e.g., collision detection):
ticker.on(tickerPhases.read, this._onReadPhase, this._listenerId);
ticker.on(tickerPhases.write, this._onWritePhase, this._listenerId);
// Cleanup:
ticker.off(tickerPhases.read, this._listenerId);
ticker.off(tickerPhases.write, this._listenerId);
```

---

### 9. Local Variable Aliasing for Hot Paths

**Rule:** In methods that access the same property multiple times in a tight loop or hot path, alias the property to a local `const` first. This reduces repeated property lookups (prototype chain traversal) and is especially important for `this.*` accesses inside loops. Only do this when the local is used **at least twice** — a single-use alias is never worth it.

```ts
// ✅ CORRECT – alias when the property is accessed multiple times
protected _onMove(e: PointerEvent) {
  const drag = this.drag;         // alias – used 4 times below
  const eventData = this._eventData;
  if (!drag || !eventData) return;

  const x = e.clientX;
  const y = e.clientY;
  (drag.deltaX as Writeable<number>) = x - drag.x;
  (drag.deltaY as Writeable<number>) = y - drag.y;
  (drag.x as Writeable<number>) = x;
  (drag.y as Writeable<number>) = y;
  eventData.x = x;
  eventData.y = y;
  this._emitter.emit(eventData.type, eventData);
}

// ❌ WRONG – alias used only once, net overhead
protected _applyEnd() {
  const drag = this.drag;  // used only once – remove the alias
  drag?.items.forEach(item => item.reset());
}
```

---

### 10. `const` Object + Type Alias for Enums (Const Enum Pattern)

**Rule:** Prefer `const` object combined with a derived type alias over TypeScript `enum`s for public-facing named constants. This produces no runtime overhead (no IIFE like `enum` does), tree-shakes cleanly, and allows external consumers to use string literals directly without importing the enum.

```ts
// ✅ CORRECT – zero runtime overhead, tree-shakeable
export const DraggableApplyPositionPhase = {
  Start: 'start',
  Move: 'move',
  End: 'end',
} as const;

export type DraggableApplyPositionPhase =
  (typeof DraggableApplyPositionPhase)[keyof typeof DraggableApplyPositionPhase];

// Consumers can use literal strings directly: applyPosition('start')
// or the constant: applyPosition(DraggableApplyPositionPhase.Start)

// ❌ AVOID for public API – emits an IIFE, not tree-shakeable, leaks to runtime
enum DraggableApplyPositionPhase {
  Start = 'start',
  Move = 'move',
  End = 'end',
}
```

> Internal (non-exported) state machine enums (e.g., `DragStartPhase`, `DraggableStartPredicateState`) may use TypeScript `enum` for compactness since they are not part of the public API.

---

### 11. Destructuring — Case-by-Case (Minifiability + Performance)

**Rule:** Choose whichever pattern produces the **smallest output after minification** AND the **fewest CPU cycles** (property lookups). This is not a blanket rule — evaluate case-by-case.

**When to AVOID destructuring:** When the object reference is short and property names are multi-character. Aliasing the object first, then accessing properties from the alias, gives the minifier full freedom to rename both the alias and the property locals.

```ts
// ❌ AVOID – minifier must keep 'clientRect', 'width', 'height' verbatim
const { width, height } = item.clientRect;

// ✅ PREFER – minifier can rename clientRect → a, width → b, height → c
const clientRect = item.clientRect;
const width = clientRect.width;
const height = clientRect.height;
```

**When destructuring IS beneficial:** When destructuring `this` with **long property names** that are each used multiple times. The property name strings are locked in the output either way (`this.elementOffsetContainer` or `elementOffsetContainer` — same bytes for the property access). But destructuring gives you a **local alias** that the minifier _can_ shorten, saving `this.` for every subsequent reference.

```ts
// ✅ GOOD – property strings are locked either way, but locals are minifiable
const {
  elementOffsetContainer,
  elementContainer,
  dragOffsetContainer,
  dragContainer,
  containerOffset,
  _clientOffsetCache,
  _matrixCache,
} = this;
// Now `elementOffsetContainer` is used as-is, but in minified output it becomes `a`
// vs. `this.elementOffsetContainer` repeated N times (longer)

// ❌ WORSE – no byte savings, just more verbose
const elementOffsetContainer = this.elementOffsetContainer;
const elementContainer = this.elementContainer;
// ...same bytes for property names, but now you also wrote `this.` + `=` per line
```

> **Rule of thumb — three factors to weigh:**
>
> 1. **Property name length** — short names (e.g. `x`, `y`) can't be shortened further, so destructuring is fine. Long names benefit from a minifiable local alias.
> 2. **Object reference length** — if the object is `this`, destructuring saves repeating `this.` everywhere. If the object is already a short local like `r`, just use `r.width`.
> 3. **Usage count** — if a property is used **only once**, don't alias it at all (destructured or not) — the alias declaration is pure overhead. Only alias (via destructuring or explicit assignment) when the value is used **2+ times**.
