export function waitNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      resolve(undefined);
    });
  });
}
