# What is DragDoll?

DragDoll is a modular and highly extensible drag and drop system written in TypeScript. Originally based on [Muuri](https://muuri.dev/)'s internal drag system, it has been fully redesigned to serve as a general-purpose drag and drop system.

At its core, DragDoll is built on the concept of [_sensors_](/sensor), which are responsible for listening to user input events (or any events, for that matter) and emitting drag events based on those inputs. While DragDoll comes with a few built-in sensors, you can also create your own to listen to any kind of input events you desire.

To actually move elements around, DragDoll provides the [`Draggable`](/draggable) class. This class acts as an orchestrator for any number of sensors and moves DOM elements based on the drag events emitted by the provided sensors. The [`Draggable`](/draggable) class features a simple and functional API that allows you to control the drag process explicitly from start to finish.

For complete drag and drop experiences, DragDoll also provides [`DndObserver`](/dnd-observer) and [`Droppable`](/droppable) classes, which handle collision detection between draggable elements and drop targets. Together, these three classes create a powerful foundation for building sophisticated drag and drop interfaces.

## Features

📡 &nbsp; **Sweet Sensors**: Pointer, keyboard, or roll your own. Sensors normalize any input into unified drag events, giving you complete control over interactions.

🤏 &nbsp; **Dynamic Draggables**: A highly customizable Draggable system with autoscrolling superpowers, drag previews, and position modifiers. Complex scenarios made effortless.

🎯 &nbsp; **Classy Collisions**: An extendable, cache-optimized collision detection system you can build on. Ships with a visibility-aware detector that handles overflow clipping and scroll containers for you.

🔄 &nbsp; **True Transforms**: Finally, transformed elements can be dragged normally. Rotate, scale, skew to your heart's content.

😴 &nbsp; **Dreamy DX**: Smart defaults get you moving fast. Rich events and extension points give you full control when you need it.

⚡ &nbsp; **Snappy Swipes**: Pooled events, batched DOM reads/writes, cached measurements. Performance is built to the core.

💝 &nbsp; **Lovely License**: 100% MIT licensed, spread the love.