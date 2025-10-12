import { focusElement } from './focus-element.js';
import { waitNextFrame } from './wait-next-frame.js';

export const press = (key: string) => document.dispatchEvent(new KeyboardEvent('keydown', { key }));

export const startDrag = async (el: HTMLElement) => {
  focusElement(el);
  press('Enter');
  await waitNextFrame();
};

export const endDrag = async () => {
  press('Enter');
  await waitNextFrame();
};

export const cancelDrag = async () => {
  press('Escape');
  await waitNextFrame();
};

export const move = async (direction: 'Left' | 'Right' | 'Up' | 'Down', times = 1) => {
  for (let i = 0; i < times; i++) {
    press(`Arrow${direction}`);
    await waitNextFrame();
  }
};
