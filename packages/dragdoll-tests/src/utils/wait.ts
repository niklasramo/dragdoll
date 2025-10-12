export function wait(time: number) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(undefined);
    }, time);
  });
}
