<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

const GRID = 4;
const TOTAL = GRID * GRID;
const TILE = 68;
const GAP = 3;
const STEP = TILE + GAP;
const EMPTY = TOTAL - 1;
const GRID_SIZE = TILE * GRID + GAP * (GRID - 1);

const containerRef = ref(null);

// Game phases: 'init' -> 'shuffling' -> 'playing' -> 'solved' -> 'reveal' -> (loop)
const phase = ref('init');

// board[position] = tileIndex. Tile 15 is the empty space.
const board = reactive(Array.from({ length: TOTAL }, (_, i) => i));

const emptyPos = computed(() => board.indexOf(EMPTY));

const tiles = Array.from({ length: TOTAL - 1 }, (_, i) => i);

const toRow = (pos) => Math.floor(pos / GRID);
const toCol = (pos) => pos % GRID;

function isAdjacent(pos) {
  const ep = emptyPos.value;
  return (
    (toRow(pos) === toRow(ep) && Math.abs(toCol(pos) - toCol(ep)) === 1) ||
    (toCol(pos) === toCol(ep) && Math.abs(toRow(pos) - toRow(ep)) === 1)
  );
}

function swapWithEmpty(pos) {
  const ep = emptyPos.value;
  const tmp = board[pos];
  board[pos] = board[ep];
  board[ep] = tmp;
}

function getValidMoves(ep) {
  const moves = [];
  const r = toRow(ep);
  const c = toCol(ep);
  if (r > 0) moves.push(ep - GRID);
  if (r < GRID - 1) moves.push(ep + GRID);
  if (c > 0) moves.push(ep - 1);
  if (c < GRID - 1) moves.push(ep + 1);
  return moves;
}

function isSolved() {
  for (let i = 0; i < TOTAL; i++) {
    if (board[i] !== i) return false;
  }
  return true;
}

function tilePixelPos(tileIdx) {
  const pos = board.indexOf(tileIdx);
  return { x: toCol(pos) * STEP, y: toRow(pos) * STEP };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Reset board to solved state.
function resetBoard() {
  for (let i = 0; i < TOTAL; i++) board[i] = i;
}

// Shuffle with animated moves.
async function shuffle() {
  phase.value = 'shuffling';
  let lastEp = -1;
  for (let i = 0; i < 50; i++) {
    const ep = emptyPos.value;
    const moves = getValidMoves(ep).filter((p) => p !== lastEp);
    const chosen = moves[Math.floor(Math.random() * moves.length)];
    lastEp = ep;
    swapWithEmpty(chosen);
    await delay(35);
  }
  phase.value = 'playing';

  if (konamiPending) {
    konamiPending = false;
    resetBoard();
  }
}

// Reveal sequence: merge tiles, show full logo, then loop.
async function reveal() {
  phase.value = 'solved';
  await delay(600);
  phase.value = 'reveal';
  await delay(2500);

  // Unmerge: reset to solved, show tiles again briefly.
  phase.value = 'init';
  resetBoard();
  await delay(600);

  // Shuffle again.
  shuffle();
}

// Watch for solve during play.
watch(
  () => phase.value === 'playing' && isSolved(),
  (solved) => {
    if (solved) reveal();
  },
);

// Konami code: up up down down left left right right.
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
];
let konamiIdx = 0;
let konamiPending = false;

function onKonami(e) {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      if (phase.value === 'playing') {
        resetBoard();
      } else {
        // Queue it — will auto-solve once playing starts.
        konamiPending = true;
      }
    }
  } else {
    konamiIdx = e.key === KONAMI[0] ? 1 : 0;
  }
}

// Cached drag state.
let dragTilePos = -1;
let dragEmptyPos = -1;
let dragGridRect = { left: 0, top: 0 };

let cleanupFns = [];

onMounted(async () => {
  document.addEventListener('keydown', onKonami);

  const container = containerRef.value;
  if (!container) return;

  const gridEl = container.querySelector('.puzzle-grid');
  if (!gridEl) return;

  try {
    const { Draggable, PointerSensor, createContainmentModifier } = await import('dragdoll');

    const tileEls = container.querySelectorAll('.puzzle-tile');

    tileEls.forEach((el) => {
      const tileIdx = parseInt(el.dataset.tile);
      const sensor = new PointerSensor(el);

      const draggable = new Draggable([sensor], {
        elements: () => [el],
        startPredicate: () => {
          if (phase.value !== 'playing') return false;
          return isAdjacent(board.indexOf(tileIdx));
        },
        positionModifiers: [
          createContainmentModifier(() => {
            const tileX = dragGridRect.left + toCol(dragTilePos) * STEP;
            const tileY = dragGridRect.top + toRow(dragTilePos) * STEP;
            const emptyX = dragGridRect.left + toCol(dragEmptyPos) * STEP;
            const emptyY = dragGridRect.top + toRow(dragEmptyPos) * STEP;
            return {
              x: Math.min(tileX, emptyX),
              y: Math.min(tileY, emptyY),
              width: Math.abs(tileX - emptyX) + TILE,
              height: Math.abs(tileY - emptyY) + TILE,
            };
          }),
        ],
        applyPosition: ({ item, phase: p }) => {
          if (p === 'end' || p === 'end-align') return;
          el.style.transform = `translate(${item.position.x}px, ${item.position.y}px)`;
        },
        onStart: () => {
          dragTilePos = board.indexOf(tileIdx);
          dragEmptyPos = emptyPos.value;
          const r = gridEl.getBoundingClientRect();
          dragGridRect = { left: r.left, top: r.top };
          el.classList.add('dragging');
        },
        onEnd: (drag) => {
          const p = drag.items[0]?.position;
          const dist = Math.abs(p?.x || 0) + Math.abs(p?.y || 0);

          if (dist >= STEP * 0.35) {
            el.style.transition = 'none';
            el.style.transform = '';
            swapWithEmpty(dragTilePos);
            requestAnimationFrame(() => {
              el.style.transition = '';
              el.classList.remove('dragging');
            });
          } else {
            el.classList.remove('dragging');
            const cur = el.style.transform;
            el.style.transform = '';
            if (cur) {
              el.animate([{ transform: cur }, { transform: 'translate(0px,0px)' }], {
                duration: 150,
                easing: 'ease',
              });
            }
          }
        },
      });

      cleanupFns.push(() => {
        draggable.destroy();
        sensor.destroy();
      });
    });

    // Start the game loop.
    await delay(800);
    shuffle();
  } catch (e) {
    console.warn('Puzzle demo init error:', e);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKonami);
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
});
</script>

<template>
  <div ref="containerRef" class="puzzle-wrapper">
    <div class="puzzle-label" :class="{ visible: phase === 'playing', solved: phase === 'solved' }">
      {{ phase === 'solved' || phase === 'reveal' ? 'Nice work!' : 'Slide to solve' }}
    </div>
    <div class="puzzle-grid" :class="[phase]">
      <!-- Rotating glow behind the merged image -->
      <div class="reveal-glow" />

      <!-- Full mascot image shown during reveal (includes the missing 16th tile) -->
      <div class="reveal-image" />

      <!-- Puzzle tiles -->
      <div
        v-for="idx in tiles"
        :key="idx"
        :data-tile="idx"
        class="puzzle-tile"
        :style="{
          left: tilePixelPos(idx).x + 'px',
          top: tilePixelPos(idx).y + 'px',
          backgroundPosition: -(toCol(idx) * TILE) + 'px ' + -(toRow(idx) * TILE) + 'px',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.puzzle-wrapper {
  position: relative;
  margin: 0 auto;
  width: v-bind(GRID_SIZE + 'px');
  contain: layout;
}

.puzzle-label {
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
  letter-spacing: 0.3px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.puzzle-label.visible {
  opacity: 1;
}

.puzzle-label.solved {
  opacity: 1;
  color: var(--dd-c-success);
}

.puzzle-grid {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
}

/*
-----------
Reveal glow
-----------
*/

.reveal-glow {
  position: absolute;
  inset: -30px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  background: conic-gradient(
    from 0deg,
    rgba(255, 85, 85, 0.4),
    rgba(255, 149, 85, 0.3),
    rgba(219, 85, 255, 0.3),
    rgba(85, 255, 156, 0.3),
    rgba(255, 85, 85, 0.4)
  );
  filter: blur(25px);
  transition: opacity 0.5s ease;
}

.puzzle-grid.reveal .reveal-glow {
  opacity: 1;
  animation: glow-spin 2s linear infinite;
}

@keyframes glow-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*
-----------------
Reveal full image
-----------------
*/

.reveal-image {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background-image: url('/dragdoll-favicon.svg');
  background-size: v-bind(GRID_SIZE + 'px') v-bind(GRID_SIZE + 'px');
  background-repeat: no-repeat;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.puzzle-grid.reveal .reveal-image {
  opacity: 1;
}

/*
-----
Tiles
-----
*/

.puzzle-tile {
  position: absolute;
  left: 0;
  top: 0;
  width: v-bind(TILE + 'px');
  height: v-bind(TILE + 'px');
  border-radius: 5px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  transition:
    left 0.15s ease,
    top 0.15s ease,
    border-radius 0.4s ease,
    box-shadow 0.4s ease,
    opacity 0.4s ease;

  /* Mascot image. */
  background-image: url('/dragdoll-favicon.svg');
  background-size: v-bind(TILE * GRID + 'px') v-bind(TILE * GRID + 'px');
  background-repeat: no-repeat;

  /* Subtle border. */
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.4);
}

.puzzle-tile:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.5);
}

.puzzle-tile.dragging {
  cursor: grabbing;
  will-change: transform;
  transition: none;
  z-index: 10;
  box-shadow:
    inset 0 0 0 1px var(--vp-c-brand-1),
    0 6px 20px rgba(0, 0, 0, 0.6),
    0 0 15px rgba(255, 85, 85, 0.1);
}

/* Solved: tiles lose borders and merge. */
.puzzle-grid.solved .puzzle-tile,
.puzzle-grid.reveal .puzzle-tile {
  border-radius: 0;
  box-shadow: none;
}

/* Tiles fade out to show the full image. */
.puzzle-grid.reveal .puzzle-tile {
  opacity: 0;
}
</style>
