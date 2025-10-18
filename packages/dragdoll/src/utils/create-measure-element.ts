import { setStyles } from './set-styles.js';

export function createMeasureElement() {
  const el = document.createElement('div');
  el.classList.add('dragdoll-measure');
  setStyles(
    el,
    {
      display: 'block',
      position: 'absolute',
      inset: '0px',
      padding: '0px',
      margin: '0px',
      border: 'none',
      opacity: '0',
      transform: 'none',
      'transform-origin': '0 0',
      transition: 'none',
      animation: 'none',
      'pointer-events': 'none',
    },
    true,
  );
  return el;
}
