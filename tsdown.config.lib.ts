import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'sensors/sensor': 'src/sensors/sensor.ts',
    'sensors/base-sensor': 'src/sensors/base-sensor.ts',
    'sensors/base-motion-sensor': 'src/sensors/base-motion-sensor.ts',
    'sensors/pointer-sensor': 'src/sensors/pointer-sensor.ts',
    'sensors/keyboard-sensor': 'src/sensors/keyboard-sensor.ts',
    'sensors/keyboard-motion-sensor': 'src/sensors/keyboard-motion-sensor.ts',
    'draggable/draggable': 'src/draggable/index.ts',
    'draggable/helpers/create-touch-delay-predicate':
      'src/draggable/helpers/create-touch-delay-predicate.ts',
    'draggable/modifiers/create-snap-modifier': 'src/draggable/modifiers/create-snap-modifier.ts',
    'draggable/modifiers/create-containment-modifier':
      'src/draggable/modifiers/create-containment-modifier.ts',
    'draggable/plugins/auto-scroll-plugin': 'src/draggable/plugins/auto-scroll-plugin.ts',
    'dnd-context/dnd-context': 'src/dnd-context/dnd-context.ts',
    'dnd-context/collision-detector': 'src/dnd-context/collision-detector.ts',
    'dnd-context/advanced-collision-detector': 'src/dnd-context/advanced-collision-detector.ts',
    'droppable/droppable': 'src/droppable/droppable.ts',
    'auto-scroll/auto-scroll': 'src/auto-scroll/auto-scroll.ts',
    'singletons/auto-scroll': 'src/singletons/auto-scroll.ts',
    'singletons/ticker': 'src/singletons/ticker.ts',
  },
  outDir: './dist',
  format: 'esm',
  target: false,
  minify: true,
  sourcemap: true,
  dts: true,
});
