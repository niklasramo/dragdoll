export function setStyles(el: HTMLElement, styles: Record<string, string>, important = false) {
  const { style } = el;
  for (const key in styles) {
    style.setProperty(key, styles[key], important ? 'important' : '');
  }
}
