import { getElementTransformString } from 'dragdoll';
import { defaultSetup } from './utils/default-setup.js';
import { expectWithContext } from './utils/expect-with-context.js';

function parseTranslatePixels(transformString: string): { x: number; y: number } | null {
  const match = transformString.match(/translate\(([^,]+),([^)]+)\)/);
  if (!match) return null;
  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
  };
}

export default () => {
  describe('getElementTransformString', () => {
    defaultSetup();

    it('should resolve translate percentages with border-box sizing', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.boxSizing = 'border-box';
      el.style.width = '200px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = '5px solid black';
      el.style.translate = '50% 50%';
      document.body.appendChild(el);

      const result = getElementTransformString(el);
      const translate = parseTranslatePixels(result);

      // border-box: intrinsic size = style.width/height directly.
      expectWithContext(translate !== null, 'translate should be parsed').toBe(true);
      expectWithContext(Math.abs(translate!.x - 100) < 0.5, 'x should be ~100 (200/2)').toBe(true);
      expectWithContext(Math.abs(translate!.y - 50) < 0.5, 'y should be ~50 (100/2)').toBe(true);

      el.remove();
    });

    it('should resolve translate percentages with content-box sizing and borders', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.boxSizing = 'content-box';
      el.style.width = '100px';
      el.style.height = '80px';
      el.style.padding = '10px';
      el.style.border = '5px solid black';
      el.style.translate = '50% 50%';
      document.body.appendChild(el);

      const result = getElementTransformString(el);
      const translate = parseTranslatePixels(result);

      // content-box: intrinsic width = 100 + 20(padding) + 10(border) = 130.
      // intrinsic height = 80 + 20 + 10 = 110.
      expectWithContext(translate !== null, 'translate should be parsed').toBe(true);
      expectWithContext(Math.abs(translate!.x - 65) < 0.5, 'x should be ~65 (130/2)').toBe(true);
      expectWithContext(Math.abs(translate!.y - 55) < 0.5, 'y should be ~55 (110/2)').toBe(true);

      el.remove();
    });

    it('should not double-count borders when element has scrollbar (content-box)', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.boxSizing = 'content-box';
      el.style.width = '100px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = '5px solid black';
      el.style.overflow = 'scroll';
      el.style.translate = '50% 50%';
      document.body.appendChild(el);

      // Oversized child to force scrollbars.
      const child = document.createElement('div');
      child.style.width = '500px';
      child.style.height = '500px';
      el.appendChild(child);

      // Compute actual scrollbar sizes from the DOM.
      // offsetWidth - clientWidth = border + scrollbar.
      const borderH = 10; // 5 + 5
      const borderV = 10; // 5 + 5
      const scrollbarWidth = el.offsetWidth - el.clientWidth - borderH;
      const scrollbarHeight = el.offsetHeight - el.clientHeight - borderV;

      const result = getElementTransformString(el);
      const translate = parseTranslatePixels(result);

      // content-box: width(100) + padding(20) + border(10) + scrollbar.
      // The bug (before fix) would double-count border here.
      const expectedX = (100 + 20 + 10 + scrollbarWidth) / 2;
      const expectedY = (100 + 20 + 10 + scrollbarHeight) / 2;

      expectWithContext(translate !== null, 'translate should be parsed').toBe(true);
      expectWithContext(
        Math.abs(translate!.x - expectedX) < 1,
        `x should be ~${expectedX} (border not double-counted)`,
      ).toBe(true);
      expectWithContext(
        Math.abs(translate!.y - expectedY) < 1,
        `y should be ~${expectedY} (border not double-counted)`,
      ).toBe(true);

      el.remove();
    });

    it('should include scrollbar in content-box intrinsic size (no border)', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.boxSizing = 'content-box';
      el.style.width = '100px';
      el.style.height = '100px';
      el.style.padding = '0px';
      el.style.border = '0px';
      el.style.overflow = 'scroll';
      el.style.translate = '50% 50%';
      document.body.appendChild(el);

      // Oversized child to force scrollbars.
      const child = document.createElement('div');
      child.style.width = '500px';
      child.style.height = '500px';
      el.appendChild(child);

      // With no border, offsetWidth - clientWidth = scrollbar only.
      const scrollbarWidth = el.offsetWidth - el.clientWidth;
      const scrollbarHeight = el.offsetHeight - el.clientHeight;

      const result = getElementTransformString(el);
      const translate = parseTranslatePixels(result);

      const expectedX = (100 + scrollbarWidth) / 2;
      const expectedY = (100 + scrollbarHeight) / 2;

      expectWithContext(translate !== null, 'translate should be parsed').toBe(true);
      expectWithContext(
        Math.abs(translate!.x - expectedX) < 1,
        `x should be ~${expectedX} (includes scrollbar)`,
      ).toBe(true);
      expectWithContext(
        Math.abs(translate!.y - expectedY) < 1,
        `y should be ~${expectedY} (includes scrollbar)`,
      ).toBe(true);

      el.remove();
    });

    it('should pass through pixel translate values unchanged', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.width = '100px';
      el.style.height = '100px';
      el.style.translate = '10px 20px';
      document.body.appendChild(el);

      const result = getElementTransformString(el);
      const translate = parseTranslatePixels(result);

      expectWithContext(translate !== null, 'translate should be parsed').toBe(true);
      expectWithContext(Math.abs(translate!.x - 10) < 0.01, 'x should be 10px').toBe(true);
      expectWithContext(Math.abs(translate!.y - 20) < 0.01, 'y should be 20px').toBe(true);

      el.remove();
    });

    it('should return empty string when element has no transforms', () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.width = '100px';
      el.style.height = '100px';
      document.body.appendChild(el);

      const result = getElementTransformString(el);

      expectWithContext(result, 'should be empty string').toBe('');

      el.remove();
    });
  });
};
