import { Properties } from 'csstype';

const defaultStyles: Properties = {
  display: 'block',
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '100px',
  height: '100px',
  padding: '0px',
  margin: '0px',
  boxSizing: 'border-box',
  backgroundColor: 'red',
};

export function createTestElement(styles: Properties = {}) {
  const el = document.createElement('div');
  el.tabIndex = 0;
  Object.assign(el.style, { ...defaultStyles, ...styles });
  document.body.appendChild(el);
  return el;
}
