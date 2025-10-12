export function blurElement(element: HTMLElement) {
  if (element === document.activeElement) {
    element.blur();
    element.dispatchEvent(new FocusEvent('blur'));
  }
}
