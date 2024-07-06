import { getOffsetContainer } from 'mezr';

import { Sensor } from '../sensors/sensor.js';

import { CSSProperties, Point, Rect } from '../types.js';

import { getStyle } from 'utils/get-style.js';

import { getClientOffset } from 'utils/get-client-offset.js';

import { getOffsetDiff } from 'utils/get-offset-diff.js';

import { getWorldTransformMatrix } from 'utils/get-world-transform-matrix.js';

import { createWrapperElement } from 'utils/create-wrapper-element.js';

import { isMatrixWarped } from 'utils/is-matrix-warped.js';

import type { Draggable } from './draggable.js';

import type { ObjectCache } from 'utils/object-cache.js';

export class DraggableDragItem<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events'],
> {
  data: { [key: string]: any };
  readonly element: HTMLElement | SVGSVGElement;
  readonly elementContainer: HTMLElement;
  readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly dragContainer: HTMLElement;
  readonly dragInnerContainer: HTMLElement | null;
  readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly elementMatrix: DOMMatrix;
  readonly frozenProps: CSSProperties | null;
  readonly unfrozenProps: CSSProperties | null;
  readonly clientRect: Rect;
  readonly position: Point;
  readonly containerOffset: Point;
  protected _moveDiff: Point;
  protected _alignDiff: Point;
  protected _measureElements: Map<HTMLElement, HTMLElement>;
  protected _matrixCache: ObjectCache<HTMLElement | SVGSVGElement, [DOMMatrix, DOMMatrix]>;
  protected _clientOffsetCache: ObjectCache<HTMLElement | SVGSVGElement | Window | Document, Point>;

  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S, E>) {
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

    this.data = {};
    this.element = element;
    this.dragInnerContainer = null;
    this.elementMatrix = new DOMMatrix();
    this.frozenProps = null;
    this.unfrozenProps = null;
    this.position = { x: 0, y: 0 };
    this.containerOffset = { x: 0, y: 0 };
    this._moveDiff = { x: 0, y: 0 };
    this._alignDiff = { x: 0, y: 0 };
    this._measureElements = drag['_measureElements'];
    this._matrixCache = drag['_matrixCache'];
    this._clientOffsetCache = drag['_clientOffsetCache'];

    // Use element's parent element as the element container.
    const elementContainer = element.parentElement;
    if (!elementContainer) {
      throw new Error('Dragged element does not have a parent element.');
    }
    this.elementContainer = elementContainer;

    // Get element's drag parent, default to element's parent element.
    const dragContainer = draggable.settings.container || elementContainer;
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

    // Compute matrices and initial container diff.
    this.elementMatrix.setMatrixValue(style.transform);
    this.updateContainerMatrices();
    this.updateContainerOffset();

    // Get element's initial position. This position is relative to the
    // properties the user is using to move the element. For example, if the
    // user is using the `translate` transform to move the element then the
    // initial position will be relative to the `translate` transform and the
    // position here should reflect the transform value delta.
    const { x, y } = draggable.settings.getStartPosition({
      draggable,
      sensor: drag.sensor,
      item: this,
      style,
    });
    this.position.x = x;
    this.position.y = y;

    // Get element's frozen props.
    const frozenProps = draggable.settings.getFrozenProps({
      draggable,
      sensor: drag.sensor,
      item: this,
      style,
    });
    if (Array.isArray(frozenProps)) {
      if (frozenProps.length) {
        const props: CSSProperties = {};
        for (const prop of frozenProps) {
          props[prop] = style[prop];
        }
        this.frozenProps = props;
      } else {
        this.frozenProps = null;
      }
    } else {
      this.frozenProps = frozenProps;
    }

    // Lastly, let's compute the unfrozen props. We store the current inline
    // style values for all frozen props so that we can restore them after the
    // drag process is over.
    if (this.frozenProps) {
      const unfrozenProps: CSSProperties = {};
      for (const key in this.frozenProps) {
        if (this.frozenProps.hasOwnProperty(key)) {
          unfrozenProps[key] = element.style[key];
        }
      }
      this.unfrozenProps = unfrozenProps;
    }
  }

  protected _applyContainerOffset() {
    if (this.dragInnerContainer) {
      const { x, y } = this.containerOffset;
      const containerMatrix = this.getContainerMatrix()[0];
      const inverseDragContainerMatrix = this.getDragContainerMatrix()[1];
      this.dragInnerContainer.style.setProperty(
        'transform',
        `${inverseDragContainerMatrix} translate(${x}px, ${y}px) ${containerMatrix}`,
        'important',
      );
    }
  }

  getContainerMatrix() {
    return this._matrixCache.get(this.elementContainer)!;
  }

  getDragContainerMatrix() {
    return this._matrixCache.get(this.dragContainer)!;
  }

  updateContainerMatrices(force = false) {
    if (force) {
      this._matrixCache.invalidate(this.elementContainer);
      this._matrixCache.invalidate(this.dragContainer);
    }

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

  updateContainerOffset(force = false) {
    const {
      elementOffsetContainer,
      elementContainer,
      dragOffsetContainer,
      dragContainer,
      containerOffset,
      _clientOffsetCache,
      _matrixCache,
    } = this;

    // If force is true, invalidate the client offset cache.
    if (force) {
      _clientOffsetCache.invalidate(dragOffsetContainer);
      _clientOffsetCache.invalidate(elementOffsetContainer);
    }

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
              const measureElement =
                this._measureElements.get(offsetContainer) || createWrapperElement(true);
              measureElement.style.setProperty('transform', matrices[1].toString(), 'important');
              if (!measureElement.isConnected) {
                this._measureElements.set(offsetContainer, measureElement);
                offsetContainer.append(measureElement);
              }
              getClientOffset(measureElement, offset);
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
