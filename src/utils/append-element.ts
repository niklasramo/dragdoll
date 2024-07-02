// A special append method which doesn't lose focus when appending an element.
export function appendElement(
  element: HTMLElement | SVGSVGElement,
  container: HTMLElement,
  innerContainer?: HTMLElement | null,
) {
  const focusedElement = document.activeElement;
  const containsFocus = element.contains(focusedElement);
  if (innerContainer) innerContainer.append(element);
  container.append(innerContainer || element);
  if (containsFocus && document.activeElement !== focusedElement) {
    (focusedElement as HTMLElement).focus({ preventScroll: true });
  }
}
