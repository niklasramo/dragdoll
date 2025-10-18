# What is DragDoll?

DragDoll is a modular and highly extensible drag and drop system written in TypeScript. Originally based on [Muuri](https://muuri.dev/)'s internal drag system, it has been fully redesigned to serve as a general-purpose drag and drop system.

At its core, DragDoll is built on the concept of [_sensors_](/sensor), which are responsible for listening to user input events (or any events, for that matter) and emitting drag events based on those inputs. While DragDoll comes with a few built-in sensors, you can also create your own to listen to any kind of input events you desire.

To actually move elements around, DragDoll provides the [`Draggable`](/draggable) class. This class acts as an orchestrator for any number of sensors and moves DOM elements based on the drag events emitted by the provided sensors. The [`Draggable`](/draggable) class features a simple and functional API that allows you to control the drag process explicitly from start to finish.

For complete drag and drop experiences, DragDoll also provides [`DndContext`](/dnd-context) and [`Droppable`](/droppable) classes, which handle collision detection between draggable elements and drop targets. Together, these three classes create a powerful foundation for building sophisticated drag and drop interfaces.

## Features

📡 &nbsp; **Sweet Sensors**: A well-documented and extendable Sensor system that normalizes any input into unified drag events, giving you complete control over user interactions.

🤏 &nbsp; **Dynamic Draggables**: A highly customizable and pluggable Draggable system with autoscrolling superpowers, making complex drag-and-drop scenarios effortless.

🎯 &nbsp; **Precise Collisions**: Advanced collision detection system that efficiently determines drop targets and provides rich interaction data for creating intuitive drag and drop experiences.

🪄 &nbsp; **Magical Transforms**: Finally, transformed (2D) elements can be dragged normally. Rotate, scale, skew, and translate to your heart's content without limitations.

🧘 &nbsp; **Blissful DX**: Experience a seamless developer experience with strong typing, smart defaults, and pre-baked solutions for common use cases.

🍦 &nbsp; **Vanilla Flavour**: No frameworks were abused while writing this library. It's all vanilla framework-free TypeScript down to the core.

💝 &nbsp; **Free & Open Source**: 100% MIT licensed, spread the love.

## Roadmap

- **Utilizing Native Drag and Drop**: By not using the native HTML Drag and Drop API, DragDoll misses out on crucial features like file drag-and-drop and dragging items between different windows. It's still a bit unclear how to integrate the native API with DragDoll in a clear and ergonomic way, but figuring this out is a high priority for us.

- **Support for other Frameworks**: Expect support for frontend frameworks like React, Vue, Svelte, etc. in the future.
