export function preventDefault(e: Event) {
  if (e.preventDefault && e.cancelable !== false) e.preventDefault();
}
