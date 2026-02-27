import { getLocalOffset } from 'dragdoll';
import { defaultSetup } from './utils/default-setup.js';
import { expectWithContext } from './utils/expect-with-context.js';

export default () => {
  describe('getLocalOffset', () => {
    defaultSetup();

    it('should return zero delta when element is already at target', () => {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.left = '50px';
      el.style.top = '50px';
      el.style.width = '100px';
      el.style.height = '100px';
      document.body.appendChild(el);

      const rect = el.getBoundingClientRect();
      const offset = getLocalOffset(el, rect.left, rect.top);

      expectWithContext(Math.abs(offset.x) < 0.5, 'x should be near zero').toBe(true);
      expectWithContext(Math.abs(offset.y) < 0.5, 'y should be near zero').toBe(true);

      el.remove();
    });

    it('should compute correct offset without ancestor transforms', () => {
      const parent = document.createElement('div');
      parent.style.position = 'fixed';
      parent.style.left = '0px';
      parent.style.top = '0px';
      parent.style.width = '400px';
      parent.style.height = '400px';
      document.body.appendChild(parent);

      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = '50px';
      el.style.height = '50px';
      parent.appendChild(el);

      const rect = el.getBoundingClientRect();
      const offset = getLocalOffset(el, rect.left + 100, rect.top + 200);

      expectWithContext(Math.abs(offset.x - 100) < 0.5, 'x offset should be ~100').toBe(true);
      expectWithContext(Math.abs(offset.y - 200) < 0.5, 'y offset should be ~200').toBe(true);

      parent.remove();
    });

    it('should account for ancestor scale transform', () => {
      const parent = document.createElement('div');
      parent.style.position = 'fixed';
      parent.style.left = '0px';
      parent.style.top = '0px';
      parent.style.width = '400px';
      parent.style.height = '400px';
      parent.style.transform = 'scale(2)';
      parent.style.transformOrigin = '0px 0px';
      document.body.appendChild(parent);

      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = '50px';
      el.style.height = '50px';
      parent.appendChild(el);

      // With scale(2), 1 CSS px = 2 viewport px.
      // A viewport delta of 100px requires a CSS offset of 50px.
      const rect = el.getBoundingClientRect();
      const offset = getLocalOffset(el, rect.left + 100, rect.top + 100);

      expectWithContext(Math.abs(offset.x - 50) < 0.5, 'x offset should be ~50').toBe(true);
      expectWithContext(Math.abs(offset.y - 50) < 0.5, 'y offset should be ~50').toBe(true);

      parent.remove();
    });

    it('should handle degenerate matrix (collapsed container)', () => {
      const parent = document.createElement('div');
      parent.style.position = 'fixed';
      parent.style.left = '0px';
      parent.style.top = '0px';
      parent.style.width = '400px';
      parent.style.height = '400px';
      parent.style.transform = 'scale(0)';
      parent.style.transformOrigin = '0px 0px';
      document.body.appendChild(parent);

      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = '50px';
      el.style.height = '50px';
      parent.appendChild(el);

      // scale(0) collapses the matrix (det = 0). Should fall back to
      // simple viewport delta without throwing.
      const offset = getLocalOffset(el, 100, 100);

      expectWithContext(Number.isFinite(offset.x), 'x should be finite').toBe(true);
      expectWithContext(Number.isFinite(offset.y), 'y should be finite').toBe(true);

      parent.remove();
    });

    it('should handle element with no parent', () => {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.left = '10px';
      el.style.top = '20px';
      el.style.width = '50px';
      el.style.height = '50px';
      document.body.appendChild(el);

      const rect = el.getBoundingClientRect();

      // Remove from DOM so parentElement is null.
      el.remove();

      // Should not throw and should return a finite offset.
      const offset = getLocalOffset(el, rect.left + 30, rect.top + 40);
      expectWithContext(Number.isFinite(offset.x), 'x should be finite').toBe(true);
      expectWithContext(Number.isFinite(offset.y), 'y should be finite').toBe(true);
    });
  });
};
