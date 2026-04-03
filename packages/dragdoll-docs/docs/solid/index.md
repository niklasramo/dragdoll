# What is DragDoll Solid?

DragDoll Solid is a thin and performant SolidJS wrapper for the [DragDoll](/) drag and drop library. It provides hook-style helpers that give you access to the full DragDoll API while leveraging Solid's fine-grained reactivity for excellent performance.

## Features

🎯 &nbsp; **Thin Wrapper**: Minimal overhead, direct access to vanilla DragDoll API.

🚀 &nbsp; **High Performance**: Leverages Solid's fine-grained reactivity with zero additional abstractions.

💪 &nbsp; **Type Safe**: Full TypeScript support with excellent type inference.

🍦 &nbsp; **Vanilla Underneath**: Full access to the underlying DragDoll API when you need it.

💝 &nbsp; **Free & Open Source**: 100% MIT licensed.

## Caveats

Being a wrapper over a vanilla JS library often comes with a few caveats, and such is the case with this wrapper also. The [`container`](/draggable#container) option of the [`Draggable`](/draggable) class is only _partially_ supported because it will make the core library move DOM nodes under a different node for the duration of the drag. Solid has it's own API ([`Portal`](https://docs.solidjs.com/concepts/control-flow/portal#portal)) for moving DOM nodes around, which is very tricky to support in a wrapper library. Read more about this in the [`useDraggable`](/solid/use-draggable#container) docs.
