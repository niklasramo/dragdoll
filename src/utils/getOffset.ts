import { getStyleAsFloat } from './getStyleAsFloat';

/**
 * Returns the element's document offset, which in practice means the vertical
 * and horizontal distance between the element's northwest corner and the
 * document's northwest corner. Note that this function always returns the same
 * object so be sure to read the data from it instead using it as a reference.
 */
export function getOffset(
  element: HTMLElement | Document | Window,
  result: { left: number; top: number } = { left: 0, top: 0 },
) {
  // Set up return data.
  result.left = 0;
  result.top = 0;

  // Document's offsets are always 0.
  if (element === document) return result;

  // Add viewport scroll left/top to the respective offsets.
  result.left = window.pageXOffset || 0;
  result.top = window.pageYOffset || 0;

  // Window's offsets are the viewport scroll left/top values.
  if ('self' in element && element.self === window.self) return result;

  // Add element's client rects to the offsets.
  const { left, top } = (element as HTMLElement).getBoundingClientRect();
  result.left += left;
  result.top += top;

  // Include element's borders into the offset since we care about the offset
  // fromt the document to the element's content area (including padding).
  result.left += getStyleAsFloat(element as HTMLElement, 'border-left-width');
  result.top += getStyleAsFloat(element as HTMLElement, 'border-top-width');

  return result;
}
