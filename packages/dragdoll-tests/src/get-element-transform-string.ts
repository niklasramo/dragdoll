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

// Shared scaffolding for translate-50% tests: builds an element with
// the given box model, measures the intrinsic size the library returns
// (indirectly, via the parsed translate), and compares it against the
// `expected*` functions — which receive the live element so they can
// read `offsetWidth`/`clientWidth` at test time. This keeps expectations
// robust across scrollbar-width differences (classic vs overlay, Windows
// vs macOS Firefox vs Chrome on Linux, etc.).
function assertTranslate50(opts: {
  label: string;
  boxSizing: 'content-box' | 'border-box';
  width: number;
  height: number;
  padding?: string;
  border?: string;
  scrollbar?: boolean;
  expectedWidth: (el: HTMLElement) => number;
  expectedHeight: (el: HTMLElement) => number;
  tolerance?: number;
}) {
  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.boxSizing = opts.boxSizing;
  el.style.width = `${opts.width}px`;
  el.style.height = `${opts.height}px`;
  el.style.padding = opts.padding ?? '0px';
  el.style.border = opts.border ?? '0 solid black';
  if (opts.scrollbar) el.style.overflow = 'scroll';
  el.style.translate = '50% 50%';
  document.body.appendChild(el);

  if (opts.scrollbar) {
    const child = document.createElement('div');
    child.style.width = `${opts.width * 5}px`;
    child.style.height = `${opts.height * 5}px`;
    el.appendChild(child);
  }

  const intrinsicWidth = opts.expectedWidth(el);
  const intrinsicHeight = opts.expectedHeight(el);
  const expectedX = intrinsicWidth / 2;
  const expectedY = intrinsicHeight / 2;
  const tolerance = opts.tolerance ?? 1;

  const result = getElementTransformString(el);
  const translate = parseTranslatePixels(result);

  expectWithContext(translate !== null, `${opts.label}: translate parsed`).toBe(true);
  expectWithContext(
    Math.abs(translate!.x - expectedX) < tolerance,
    `${opts.label}: x should be ~${expectedX}, got ${translate!.x}`,
  ).toBe(true);
  expectWithContext(
    Math.abs(translate!.y - expectedY) < tolerance,
    `${opts.label}: y should be ~${expectedY}, got ${translate!.y}`,
  ).toBe(true);

  el.remove();
}

export default () => {
  describe('getElementTransformString', () => {
    defaultSetup();

    // --- border-box: intrinsic = style.width, regardless of pad/border/scrollbar ---

    it('border-box minimal (no padding, no border, no scroll)', () => {
      assertTranslate50({
        label: 'border-box minimal',
        boxSizing: 'border-box',
        width: 100,
        height: 100,
        expectedWidth: () => 100,
        expectedHeight: () => 100,
      });
    });

    it('border-box with padding and border (no scroll)', () => {
      assertTranslate50({
        label: 'border-box pad+border',
        boxSizing: 'border-box',
        width: 200,
        height: 100,
        padding: '10px',
        border: '5px solid black',
        expectedWidth: () => 200,
        expectedHeight: () => 100,
      });
    });

    it('border-box minimal + scrollbar', () => {
      assertTranslate50({
        label: 'border-box minimal + scroll',
        boxSizing: 'border-box',
        width: 100,
        height: 100,
        scrollbar: true,
        // border-box: library returns style.width regardless of scrollbar.
        expectedWidth: () => 100,
        expectedHeight: () => 100,
      });
    });

    it('border-box with padding + border + scrollbar', () => {
      assertTranslate50({
        label: 'border-box pad+border+scroll',
        boxSizing: 'border-box',
        width: 200,
        height: 200,
        padding: '10px',
        border: '5px solid black',
        scrollbar: true,
        expectedWidth: () => 200,
        expectedHeight: () => 200,
      });
    });

    // --- content-box: intrinsic = content + padding + border + scrollbar ---

    it('content-box minimal (no padding, no border, no scroll)', () => {
      assertTranslate50({
        label: 'content-box minimal',
        boxSizing: 'content-box',
        width: 100,
        height: 100,
        expectedWidth: () => 100,
        expectedHeight: () => 100,
      });
    });

    it('content-box subpixel (no padding, no border, no scroll)', () => {
      assertTranslate50({
        label: 'content-box subpixel',
        boxSizing: 'content-box',
        width: 100.5,
        height: 100.5,
        expectedWidth: () => 100.5,
        expectedHeight: () => 100.5,
        tolerance: 0.05,
      });
    });

    it('content-box with padding only (no border, no scroll)', () => {
      assertTranslate50({
        label: 'content-box padding-only',
        boxSizing: 'content-box',
        width: 100,
        height: 80,
        padding: '15px',
        expectedWidth: () => 100 + 30,
        expectedHeight: () => 80 + 30,
      });
    });

    it('content-box with border only (no padding, no scroll)', () => {
      assertTranslate50({
        label: 'content-box border-only',
        boxSizing: 'content-box',
        width: 100,
        height: 80,
        border: '8px solid black',
        expectedWidth: () => 100 + 16,
        expectedHeight: () => 80 + 16,
      });
    });

    it('content-box with padding + border (no scroll)', () => {
      assertTranslate50({
        label: 'content-box pad+border',
        boxSizing: 'content-box',
        width: 100,
        height: 80,
        padding: '10px',
        border: '5px solid black',
        expectedWidth: () => 100 + 20 + 10,
        expectedHeight: () => 80 + 20 + 10,
      });
    });

    it('content-box with scrollbar (no padding, no border)', () => {
      assertTranslate50({
        label: 'content-box scroll',
        boxSizing: 'content-box',
        width: 100,
        height: 100,
        scrollbar: true,
        // offsetWidth - clientWidth = scrollbar (no border).
        expectedWidth: (el) => 100 + (el.offsetWidth - el.clientWidth),
        expectedHeight: (el) => 100 + (el.offsetHeight - el.clientHeight),
      });
    });

    it('content-box with padding + scrollbar (no border)', () => {
      assertTranslate50({
        label: 'content-box padding+scroll',
        boxSizing: 'content-box',
        width: 100,
        height: 100,
        padding: '15px',
        scrollbar: true,
        expectedWidth: (el) => 100 + 30 + (el.offsetWidth - el.clientWidth),
        expectedHeight: (el) => 100 + 30 + (el.offsetHeight - el.clientHeight),
      });
    });

    it('content-box with border + scrollbar (no padding)', () => {
      assertTranslate50({
        label: 'content-box border+scroll',
        boxSizing: 'content-box',
        width: 100,
        height: 100,
        border: '8px solid black',
        scrollbar: true,
        // offsetWidth - clientWidth = border (16) + scrollbar.
        expectedWidth: (el) => 100 + 16 + (el.offsetWidth - el.clientWidth - 16),
        expectedHeight: (el) => 100 + 16 + (el.offsetHeight - el.clientHeight - 16),
      });
    });

    it('content-box with padding + border + scrollbar (no double-count)', () => {
      assertTranslate50({
        label: 'content-box pad+border+scroll',
        boxSizing: 'content-box',
        width: 100,
        height: 100,
        padding: '10px',
        border: '5px solid black',
        scrollbar: true,
        // offsetWidth - clientWidth = border (10) + scrollbar.
        expectedWidth: (el) => 100 + 20 + 10 + (el.offsetWidth - el.clientWidth - 10),
        expectedHeight: (el) => 100 + 20 + 10 + (el.offsetHeight - el.clientHeight - 10),
      });
    });

    it('content-box subpixel + scrollbar (preserves subpixel on border-box)', () => {
      // The quirk path runs here on Chrome — we want the subpixel part
      // of `style.width` to survive through the scrollbar-compensation
      // math. Tolerance is 1px because the scrollbar term itself is
      // integer-precision.
      assertTranslate50({
        label: 'content-box subpixel+scroll',
        boxSizing: 'content-box',
        width: 100.5,
        height: 100.5,
        scrollbar: true,
        expectedWidth: (el) => 100.5 + (el.offsetWidth - el.clientWidth),
        expectedHeight: (el) => 100.5 + (el.offsetHeight - el.clientHeight),
        tolerance: 1,
      });
    });

    // --- miscellaneous (non-intrinsic) ---

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
