import { getOffsetContainer } from 'mezr/getOffsetContainer';
import { IS_BROWSER } from '../constants.js';
import type { Sensor } from '../sensors/sensor.js';
import type { CSSProperties, Point, Rect } from '../types.js';
import { createMeasureElement } from '../utils/create-measure-element.js';
import { getClientOffset } from '../utils/get-client-offset.js';
import { getElementTransformString } from '../utils/get-element-transform-string.js';
import { getOffsetDiff } from '../utils/get-offset-diff.js';
import { getStyle } from '../utils/get-style.js';
import { getWorldTransformMatrix } from '../utils/get-world-transform-matrix.js';
import { isMatrixWarped } from '../utils/is-matrix-warped.js';
import type { ObjectCache } from '../utils/object-cache.js';
import { parseTransformOrigin } from '../utils/parse-transform-origin.js';
import type { Draggable } from './draggable.js';

const MEASURE_ELEMENT = IS_BROWSER ? createMeasureElement() : null;

export class DraggableDragItem<S extends Sensor = Sensor> {
  data: { [key: string]: any };
  readonly element: HTMLElement | SVGSVGElement;
  readonly elementContainer: HTMLElement;
  readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly dragContainer: HTMLElement;
  readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly elementTransformOrigin: { x: number; y: number; z: number };
  readonly elementTransformMatrix: DOMMatrix;
  readonly elementOffsetMatrix: DOMMatrix;
  readonly frozenStyles: CSSProperties | null;
  readonly unfrozenStyles: CSSProperties | null;
  readonly clientRect: Rect;
  readonly position: Point;
  readonly containerOffset: Point;
  readonly alignmentOffset: Point;
  protected _moveDiff: Point;
  protected _alignDiff: Point;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S>) {
    // Make sure the element is in DOM.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
    if (!element.isConnected) {
      throw new Error('Element is not connected');
    }

    // Make sure drag is defined.
    const { drag } = draggable;
    if (!drag) {
      throw new Error('Drag is not defined');
    }

    const style = getStyle(element);
    const clientRect = element.getBoundingClientRect();
    const individualTransforms = getElementTransformString(element, true);

    this.data = {};
    this.element = element;
    this.elementTransformOrigin = parseTransformOrigin(style.transformOrigin);
    this.elementTransformMatrix = new DOMMatrix().setMatrixValue(
      individualTransforms + style.transform,
    );
    this.elementOffsetMatrix = new DOMMatrix(individualTransforms).invertSelf();
    this.frozenStyles = null;
    this.unfrozenStyles = null;
    this.position = { x: 0, y: 0 };
    this.containerOffset = { x: 0, y: 0 };
    this.alignmentOffset = { x: 0, y: 0 };
    this._moveDiff = { x: 0, y: 0 };
    this._alignDiff = { x: 0, y: 0 };
    this._matrixCache = drag['_matrixCache'];
    this._clientOffsetCache = drag['_clientOffsetCache'];

    // Use element's parent element as the element container.
    const elementContainer = element.parentElement;
    if (!elementContainer) {
      throw new Error('Dragged element does not have a parent element.');
    }
    this.elementContainer = elementContainer;

    // Get element's drag parent, default to element's parent element.
    const containerSetting = draggable.settings.container;
    const dragContainer =
      (typeof containerSetting === 'function'
        ? containerSetting({ draggable, drag, element })
        : containerSetting) || elementContainer;
    this.dragContainer = dragContainer;

    // Make sure that the element is fixed or absolute positioned if there
    // is a drag container.
    if (elementContainer !== dragContainer) {
      const { position } = style;
      if (position !== 'fixed' && position !== 'absolute') {
        throw new Error(
          `Dragged element has "${position}" position, but only "fixed" or "absolute" are allowed when using a custom drag container.`,
        );
      }
    }

    // Compute element's offset container.
    const elementOffsetContainer = getOffsetContainer(element) || element;
    this.elementOffsetContainer = elementOffsetContainer;

    // Get drag container's offset container.
    const dragOffsetContainer =
      dragContainer === elementContainer
        ? elementOffsetContainer
        : getOffsetContainer(element, { container: dragContainer })!;
    this.dragOffsetContainer = dragOffsetContainer;

    // Compute element's client rect.
    {
      const { width, height, x, y } = clientRect;
      this.clientRect = { width, height, x, y };
    }

    // Compute container matrices and offset.
    this._updateContainerMatrices();
    this._updateContainerOffset();

    // Get element's frozen props.
    const frozenStyles = draggable.settings.frozenStyles({
      draggable,
      drag,
      item: this,
      style,
    });
    if (Array.isArray(frozenStyles)) {
      if (frozenStyles.length) {
        const props: CSSProperties = {};
        for (const prop of frozenStyles) {
          props[prop] = style[prop];
        }
        this.frozenStyles = props;
      } else {
        this.frozenStyles = null;
      }
    } else {
      this.frozenStyles = frozenStyles;
    }

    // Lastly, let's compute the unfrozen props. We store the current inline
    // style values for all frozen props so that we can restore them after the
    // drag process is over.
    if (this.frozenStyles) {
      const unfrozenStyles: CSSProperties = {};
      for (const key in this.frozenStyles) {
        unfrozenStyles[key as keyof CSSProperties] = element.style[key as keyof CSSProperties];
      }
      this.unfrozenStyles = unfrozenStyles;
    }
  }

  protected _updateContainerMatrices() {
    [this.elementContainer, this.dragContainer].forEach((container) => {
      if (!this._matrixCache.isValid(container)) {
        const matrices = this._matrixCache.get(container) || [new DOMMatrix(), new DOMMatrix()];
        const [matrix, inverseMatrix] = matrices;
        getWorldTransformMatrix(container, matrix);
        inverseMatrix.setMatrixValue(matrix.toString()).invertSelf();
        this._matrixCache.set(container, matrices);
      }
    });
  }

  protected _updateContainerOffset() {
    const {
      elementOffsetContainer,
      elementContainer,
      dragOffsetContainer,
      dragContainer,
      containerOffset,
      _clientOffsetCache,
      _matrixCache,
    } = this;

    // If element's offset container is different than drag container's
    // offset container let's compute the offset between the offset containers.
    if (elementOffsetContainer !== dragOffsetContainer) {
      // Get the client offsets for the element and drag containers.
      const [dragOffset, elementOffset] = (
        [
          [dragContainer, dragOffsetContainer],
          [elementContainer, elementOffsetContainer],
        ] as const
      ).map(([container, offsetContainer]) => {
        // Get the client offset from the cache or create a new one.
        const offset = _clientOffsetCache.get(offsetContainer) || { x: 0, y: 0 };

        // If the client offset is not cached let's compute it.
        if (!_clientOffsetCache.isValid(offsetContainer)) {
          // Get the world transform matrices.
          const matrices = _matrixCache.get(container);

          // If the offset container is a valid HTMLElement and the matrix is
          // not an identity matrix we need to do some extra work.
          if (offsetContainer instanceof HTMLElement && matrices && !matrices[0].isIdentity) {
            // If the matrix is scaled, rotated, skewed or 3d translated we
            // (unfortunately) need to add a temporary measure element to
            // compute the untransformed offset from the window's top-left
            // corner. If there was a way to compute the offset without
            // manipulating the DOM, we would definitely do that, but
            // unfortunately, there seems to be no way to do that accurately
            // with subpixel precision.
            if (isMatrixWarped(matrices[0])) {
              MEASURE_ELEMENT!.style.setProperty('transform', matrices[1].toString(), 'important');
              offsetContainer.append(MEASURE_ELEMENT!);
              getClientOffset(MEASURE_ELEMENT!, offset);
              MEASURE_ELEMENT!.remove();
            }
            // If the matrix only contains a 2d translation we can compute the
            // client offset normally and subtract the translation values from
            // the offset.
            else {
              getClientOffset(offsetContainer, offset);
              offset.x -= matrices[0].m41;
              offset.y -= matrices[0].m42;
            }
          }
          // In all other cases, let's compute the client offset normally.
          else {
            getClientOffset(offsetContainer, offset);
          }
        }

        // Cache the client offset.
        _clientOffsetCache.set(offsetContainer, offset);

        return offset;
      });

      getOffsetDiff(dragOffset, elementOffset, containerOffset);
    } else {
      containerOffset.x = 0;
      containerOffset.y = 0;
    }
  }

  getContainerMatrix() {
    return this._matrixCache.get(this.elementContainer)!;
  }

  getDragContainerMatrix() {
    return this._matrixCache.get(this.dragContainer)!;
  }

  updateSize(dimensions?: { width: number; height: number }) {
    if (dimensions) {
      this.clientRect.width = dimensions.width;
      this.clientRect.height = dimensions.height;
    } else {
      const { width, height } = this.element.getBoundingClientRect();
      this.clientRect.width = width;
      this.clientRect.height = height;
    }
  }
}
