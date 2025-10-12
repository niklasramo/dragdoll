import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    sensors: 'src/sensors/sensor.ts',
    'sensors/base': 'src/sensors/base-sensor.ts',
    'sensors/base-motion': 'src/sensors/base-motion-sensor.ts',
    'sensors/pointer': 'src/sensors/pointer-sensor.ts',
    'sensors/keyboard': 'src/sensors/keyboard-sensor.ts',
    'sensors/keyboard-motion': 'src/sensors/keyboard-motion-sensor.ts',
    draggable: 'src/draggable/index.ts',
    'draggable/helpers/create-touch-delay-predicate':
      'src/draggable/helpers/create-touch-delay-predicate.ts',
    'draggable/modifiers/snap': 'src/draggable/modifiers/create-snap-modifier.ts',
    'draggable/modifiers/containment': 'src/draggable/modifiers/create-containment-modifier.ts',
    'draggable/plugins/auto-scroll': 'src/draggable/plugins/auto-scroll-plugin.ts',
    'dnd-context': 'src/dnd-context/dnd-context.ts',
    'dnd-context/collision-detector': 'src/dnd-context/collision-detector.ts',
    'dnd-context/advanced-collision-detector': 'src/dnd-context/advanced-collision-detector.ts',
    droppable: 'src/droppable/droppable.ts',
    'auto-scroll': 'src/auto-scroll/auto-scroll.ts',
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
