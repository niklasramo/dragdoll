import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'dnd-observer-context': 'src/contexts/dnd-observer-context.ts',
    'use-dnd-observer': 'src/hooks/use-dnd-observer.ts',
    'use-dnd-observer-callback': 'src/hooks/use-dnd-observer-callback.ts',
    'use-dnd-observer-context': 'src/hooks/use-dnd-observer-context.ts',
    'use-draggable': 'src/hooks/use-draggable.ts',
    'use-draggable-auto-scroll': 'src/hooks/use-draggable-auto-scroll.ts',
    'use-draggable-callback': 'src/hooks/use-draggable-callback.ts',
    'use-draggable-drag': 'src/hooks/use-draggable-drag.ts',
    'use-droppable': 'src/hooks/use-droppable.ts',
    'use-keyboard-motion-sensor': 'src/hooks/use-keyboard-motion-sensor.ts',
    'use-keyboard-sensor': 'src/hooks/use-keyboard-sensor.ts',
    'use-pointer-sensor': 'src/hooks/use-pointer-sensor.ts',
  },
  outDir: './dist',
  format: 'esm',
  target: false,
  minify: true,
  sourcemap: true,
  dts: true,
});
