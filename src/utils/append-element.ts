// A special append method which doesn't lose focus when appending an element.
export function appendElement(element: HTMLElement | SVGSVGElement, container: HTMLElement) {
  const focusedElement = document.activeElement;
  const containsFocus = element.contains(focusedElement);
  container.append(element);
  if (containsFocus && document.activeElement !== focusedElement) {
    (focusedElement as HTMLElement).focus({ preventScroll: true });
  }
}
