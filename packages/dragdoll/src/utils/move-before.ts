// A special append method which doesn't lose focus when appending an element.
export function moveBefore(container: Node, node: Node, refNode: Node | null = null) {
  // Use experimental moveBefore method if it's available.
  if ('moveBefore' in container && container.isConnected === node.isConnected) {
    try {
      // @ts-ignore - moveBefore method is experimental.
      container.moveBefore(node, refNode);
      return;
    } catch {
      // Ignore the error. This is an optimization, not a critical path.
    }
  }

  // Get the focused element and check if the node contains the focused element.
  const focusedElement = document.activeElement;
  const containsFocus = node.contains(focusedElement);

  // Insert the node before the reference node.
  container.insertBefore(node, refNode);

  // Restore focus if needed.
  if (
    containsFocus &&
    document.activeElement !== focusedElement &&
    focusedElement instanceof HTMLElement
  ) {
    focusedElement.focus({ preventScroll: true });
  }
}
