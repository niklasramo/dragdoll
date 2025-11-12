# What is DragDoll React?

DragDoll React is a thin and performant React (18+) wrapper for the [DragDoll](/) drag and drop library. It provides React hooks that give you access to the full DragDoll API while minimizing re-renders and maintaining excellent performance.

## Features

🎯 &nbsp; **Thin Wrapper**: Minimal overhead, direct access to vanilla DragDoll API.

🚀 &nbsp; **High Performance**: Optimized with stable references and minimal re-renders.

💪 &nbsp; **Type Safe**: Full TypeScript support with excellent type inference.

🍦 &nbsp; **Vanilla Underneath**: Full access to the underlying DragDoll API when you need it.

💝 &nbsp; **Free & Open Source**: 100% MIT licensed.

## Caveats

Being a wrapper over a vanilla JS library often comes with a few caveats, and such is the case with this wrapper also.

The [`container`](/draggable#container) option of the [`Draggable`](/draggable) class is not fully supported because it will make the core library move DOM nodes under a different node for the duration of the drag. React has it's own [portal API](https://react.dev/reference/react-dom/createPortal) for doing moving DOM nodes around, which is very hard to support in a wrapper library. It would require a full React specific rewrite of the Draggable class to support the `container` option fully, and even then it would _probably_ be a bit finicky.

However, all is not lost. The `container` option can be used to an extent. You can for example create a clone of the dragged element (outside React) and provide the clone as the dragged element for the [`useDraggable`](/react/use-draggable) hook. As for the `container`, you can use any element that is outside React's control (e.g. `document.body`) or even a React controlled element if you know for sure React won't be touching it during the drag.
