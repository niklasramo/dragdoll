# What is DragDoll React?

DragDoll React is a thin and performant React (18+) wrapper for the [DragDoll](/) drag-and-drop system. It provides React hooks that give you access to the full DragDoll API while minimizing re-renders and maintaining excellent performance.

## Features

🎯 &nbsp; **Thin Wrapper**: Minimal overhead, direct access to vanilla DragDoll API.

🚀 &nbsp; **High Performance**: Optimized with stable references and minimal re-renders.

💪 &nbsp; **Type Safe**: Full TypeScript support with excellent type inference.

🍦 &nbsp; **Vanilla Underneath**: Full access to the underlying DragDoll API when you need it.

💝 &nbsp; **Free & Open Source**: 100% MIT licensed.

## Caveats

Being a wrapper over a vanilla JS library often comes with a few caveats, and such is the case with this wrapper also. The [`container`](/draggable#container) option of the [`Draggable`](/draggable) class is only _partially_ supported because it will make the core library move DOM nodes under a different node for the duration of the drag. React has its own API ([`createPortal`](https://react.dev/reference/react-dom/createPortal)) for moving DOM nodes around, which is very tricky to support in a wrapper. Read more about this in the [`useDraggable`](/react/use-draggable#container) docs.
