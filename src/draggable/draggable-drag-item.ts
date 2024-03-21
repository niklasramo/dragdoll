import { getOffsetContainer } from 'mezr';
import { Sensor } from '../sensors/sensor.js';
import type { Draggable } from './draggable.js';
import { CSSProperties, Rect } from '../types.js';
import { getStyle } from 'utils/get-style.js';
import { getOffsetDiff } from 'utils/get-offset-diff.js';

const OFFSET_DIFF = { left: 0, top: 0 };

const IDENTITY_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)';

const IDENTITY_MATRIX_3D = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

export class DraggableDragItem<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events'],
> {
  data: { [key: string]: any };
  readonly element: HTMLElement | SVGSVGElement;
  readonly elementContainer: HTMLElement;
  readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly dragContainer: HTMLElement;
  readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly initialTransform: string;
  readonly frozenProps: CSSProperties | null;
  readonly unfrozenProps: CSSProperties | null;
  readonly clientRect: Rect;
  readonly position: { x: number; y: number };
  readonly _updateDiff: { x: number; y: number };
  readonly _moveDiff: { x: number; y: number };
  readonly _containerDiff: { x: number; y: number };

  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S, E>) {
    // Make sure the element is in DOM.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
    if (!element.isConnected) {
      throw new Error('Element is not connected');
    }

    // Make sure sensor is defined.
    const sensor = draggable.drag?.sensor;
    if (!sensor) {
      throw new Error('Sensor is not defined');
    }

    const item = this;
    const style = getStyle(element);
    const clientRect = element.getBoundingClientRect();

    this.data = {};
    this.element = element;
    this.frozenProps = null;
    this.unfrozenProps = null;
    this.position = { x: 0, y: 0 };
    this._updateDiff = { x: 0, y: 0 };
    this._moveDiff = { x: 0, y: 0 };
    this._containerDiff = { x: 0, y: 0 };

    // Use element's parent element as the element container.
    const elementContainer = element.parentElement;
    if (!elementContainer) {
      throw new Error('Element does not have a parent element.');
    }
    this.elementContainer = elementContainer;

    // Compute element's offset container.
    const elementOffsetContainer = getOffsetContainer(element);
    if (!elementOffsetContainer) {
      throw new Error('Offset container could not be computed for the element!');
    }
    this.elementOffsetContainer = elementOffsetContainer;

    // Get element's drag parent, default to element's parent element.
    const dragContainer = draggable.settings.container || elementContainer;
    this.dragContainer = dragContainer;

    // Get drag container's offset container.
    const dragOffsetContainer =
      dragContainer === elementContainer
        ? elementOffsetContainer
        : getOffsetContainer(element, { container: dragContainer });
    if (!dragOffsetContainer) {
      throw new Error('Drag offset container could not be computed for the element!');
    }
    this.dragOffsetContainer = dragOffsetContainer;

    // Store element's client rect.
    {
      const { left, top, width, height } = clientRect;
      this.clientRect = { left, top, width, height };
    }

    // If element's offset container is different than drag container's
    // offset container let's compute the offset between the offset containers.
    if (elementOffsetContainer !== dragOffsetContainer) {
      const { left, top } = getOffsetDiff(dragOffsetContainer, elementOffsetContainer, OFFSET_DIFF);
      this._containerDiff.x = left;
      this._containerDiff.y = top;
    }

    // Store element's initial transform.
    const { transform } = style;
    if (
      transform &&
      transform !== 'none' &&
      transform !== IDENTITY_MATRIX &&
      transform !== IDENTITY_MATRIX_3D
    ) {
      this.initialTransform = transform;
    } else {
      this.initialTransform = '';
    }

    // Get element's initial position. This position is relative to the
    // properties the user is using to move the element. For example, if the
    // user is using the `translate` transform to move the element then the
    // initial position will be relative to the `translate` transform and the
    // position here should reflect the transform value delta.
    const { x, y } = draggable.settings.getStartPosition({
      draggable,
      sensor,
      item,
      style,
    });
    this.position.x = x;
    this.position.y = y;

    // Get element's frozen props.
    const frozenProps = draggable.settings.getFrozenProps({
      draggable,
      sensor,
      item,
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

  updateSize(dimensions?: { width: number; height: number }) {
    if (dimensions) {
      this.clientRect.width = dimensions.width;
      this.clientRect.height = dimensions.height;
    } else {
      const rect = this.element.getBoundingClientRect();
      this.clientRect.width = rect.width;
      this.clientRect.height = rect.height;
    }
  }
}
