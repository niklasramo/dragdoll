import { getElementTransformString, getStyle, getWorldTransformMatrix } from 'dragdoll';

const worldMatrixMap: Map<HTMLElement, DOMMatrix> = new Map();
const parents: HTMLElement[] = [];
const sourceRects: DOMRect[] = [];
const transformStrings: string[] = [];
const transformOrigins: string[] = [];
const widths: string[] = [];
const heights: string[] = [];
const xOffsets: number[] = [];
const yOffsets: number[] = [];

function resetTempData() {
  worldMatrixMap.clear();
  parents.length = 0;
  sourceRects.length = 0;
  transformStrings.length = 0;
  transformOrigins.length = 0;
  widths.length = 0;
  heights.length = 0;
  xOffsets.length = 0;
  yOffsets.length = 0;
}

/**
 * Creates a proxy element that visually matches the source element and appends
 * it to the DOM.
 *
 * @param sources The source elements to align to.
 */
export function createDragPreviewProxies(
  sources: readonly (HTMLElement | SVGSVGElement)[],
): HTMLElement[] {
  const proxies: HTMLElement[] = [];

  resetTempData();

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const parent = source.parentElement;
    if (!parent) throw new Error('Source element must have a parent element.');

    // Read styles from the source element.
    const sourceRect = source.getBoundingClientRect();
    const sourceComputedStyle = getStyle(source);
    const transformString = getElementTransformString(source);
    const transformOrigin = transformString ? sourceComputedStyle.transformOrigin : '';

    //
    // Compute the width and height of the proxy element.
    //

    let width: string;
    let height: string;
    if (source instanceof SVGSVGElement) {
      width = `${sourceRect.width}px`;
      height = `${sourceRect.height}px`;
    } else {
      const computedWidth = parseFloat(sourceComputedStyle.width);
      const computedHeight = parseFloat(sourceComputedStyle.height);

      if (!(computedWidth >= 0) || !(computedHeight >= 0)) {
        width = `${sourceRect.width}px`;
        height = `${sourceRect.height}px`;
      } else if (sourceComputedStyle.boxSizing === 'border-box') {
        width = sourceComputedStyle.width;
        height = sourceComputedStyle.height;
      } else {
        const pl = parseFloat(sourceComputedStyle.paddingLeft) || 0;
        const pr = parseFloat(sourceComputedStyle.paddingRight) || 0;
        const bl = parseFloat(sourceComputedStyle.borderLeftWidth) || 0;
        const br = parseFloat(sourceComputedStyle.borderRightWidth) || 0;
        const pt = parseFloat(sourceComputedStyle.paddingTop) || 0;
        const pb = parseFloat(sourceComputedStyle.paddingBottom) || 0;
        const bt = parseFloat(sourceComputedStyle.borderTopWidth) || 0;
        const bb = parseFloat(sourceComputedStyle.borderBottomWidth) || 0;
        width = `${computedWidth + pl + pr + bl + br}px`;
        height = `${computedHeight + pt + pb + bt + bb}px`;
      }
    }

    // Create the proxy element.
    const proxy = document.createElement('div');

    // Apply basic styles to the proxy element.
    const proxyStyle = proxy.style;

    if (sourceComputedStyle.position === 'fixed') {
      proxyStyle.position = 'fixed';
    } else {
      proxyStyle.position = 'absolute';
    }
    proxyStyle.left = '0px';
    proxyStyle.top = '0px';
    proxyStyle.margin = '0';
    proxyStyle.padding = '0';
    proxyStyle.boxSizing = 'border-box';
    proxyStyle.pointerEvents = 'none';
    proxyStyle.contain = 'layout';

    // Add a data attribute to identify the proxy element.
    proxy.dataset.dragPreviewProxy = 'true';

    // Save the computed data.
    parents[i] = parent;
    proxies[i] = proxy;
    sourceRects[i] = sourceRect;
    transformStrings[i] = transformString;
    transformOrigins[i] = transformOrigin;
    widths[i] = width;
    heights[i] = height;

    // Save the world transform matrix for the parent element if it's not
    // already saved.
    if (!worldMatrixMap.has(parent)) {
      worldMatrixMap.set(parent, getWorldTransformMatrix(parent));
    }
  }

  // Apply dimensions and transform to the proxy, and append it to the parent.
  for (let i = 0; i < sources.length; i++) {
    const parent = parents[i];
    const proxy = proxies[i];
    const transformString = transformStrings[i];
    const transformOrigin = transformOrigins[i];
    const width = widths[i];
    const height = heights[i];

    // Apply dimensions and transform to the proxy.
    const proxyStyle = proxy.style;
    proxyStyle.width = width;
    proxyStyle.height = height;
    if (transformString) {
      proxyStyle.transform = transformString;
      if (transformOrigin) {
        proxyStyle.transformOrigin = transformOrigin;
      }
    }

    parent.appendChild(proxy);
  }

  // Compute the offset between the proxy and the source.
  for (let i = 0; i < sources.length; i++) {
    const parent = parents[i];
    const proxy = proxies[i];
    const sourceRect = sourceRects[i];
    const worldMatrix = worldMatrixMap.get(parent)!;

    // The offset between the proxy and the source.
    let offsetX = 0;
    let offsetY = 0;

    // Extract the 2x2 linear subpart — this IS the Jacobian that maps
    // CSS offset deltas to viewport position deltas.
    const m11 = worldMatrix.m11;
    const m12 = worldMatrix.m12;
    const m21 = worldMatrix.m21;
    const m22 = worldMatrix.m22;

    // Invert the 2x2 Jacobian to convert viewport delta to CSS offset delta.
    const det = m11 * m22 - m12 * m21;

    // Measure the element's current viewport position.
    const proxyRect = proxy.getBoundingClientRect();
    const dx = sourceRect.left - proxyRect.left;
    const dy = sourceRect.top - proxyRect.top;

    if (Math.abs(det) < 1e-10) {
      // Degenerate matrix (collapsed container). Fall back to simple delta.
      offsetX = dx;
      offsetY = dy;
    } else {
      const invDet = 1 / det;
      offsetX = (m22 * dx - m21 * dy) * invDet;
      offsetY = (-m12 * dx + m11 * dy) * invDet;
    }

    // Store the computed offset.
    xOffsets[i] = offsetX;
    yOffsets[i] = offsetY;
  }

  // Position the proxy so its getBoundingClientRect() matches the original's.
  // Uses the parent's world transform matrix to account for arbitrary ancestor
  // transforms (scale, skew, rotation).
  for (let i = 0; i < sources.length; i++) {
    const proxyStyle = proxies[i].style;
    const offsetX = xOffsets[i];
    const offsetY = yOffsets[i];
    proxyStyle.left = `${offsetX}px`;
    proxyStyle.top = `${offsetY}px`;
  }

  resetTempData();

  return proxies;
}
