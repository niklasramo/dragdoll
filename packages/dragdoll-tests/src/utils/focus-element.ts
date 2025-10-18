export function focusElement(element: HTMLElement) {
  if (document.activeElement !== element) {
    element.focus({ preventScroll: true });
    element.dispatchEvent(
      new FocusEvent('focus', {
        bubbles: false,
        cancelable: true,
      }),
    );
  }
}
