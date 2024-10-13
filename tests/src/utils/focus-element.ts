export function focusElement(element: HTMLElement) {
  if (document.activeElement !== element) {
    element.focus();
    element.dispatchEvent(
      new FocusEvent('focus', {
        bubbles: false,
        cancelable: true,
      }),
    );
  }
}
