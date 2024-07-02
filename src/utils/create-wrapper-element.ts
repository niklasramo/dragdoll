import { setStyles } from './set-styles.js';

export function createWrapperElement(isMeasureElement = false) {
  const el = document.createElement('div');

  setStyles(
    el,
    Object.assign<{}, {}>(
      {
        display: 'block',
        position: 'absolute',
        padding: '0px',
        margin: '0px',
        border: 'none',
        transform: 'none',
        'transform-origin': '0 0',
        transition: 'none',
        animation: 'none',
      },
      isMeasureElement
        ? {
            inset: '0px',
            opacity: '0',
            'pointer-events': 'none',
          }
        : {
            width: '0px',
            height: '0px',
            left: '0px',
            top: '0px',
          },
    ),
    true,
  );

  if (isMeasureElement) {
    el.classList.add('dragdoll-measure');
  } else {
    el.classList.add('dragdoll-container');
  }

  return el;
}
