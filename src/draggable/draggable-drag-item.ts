export class DraggableDragItem {
  readonly element: HTMLElement | SVGElement;
  readonly elementContainer: Element;
  readonly elementOffsetContainer: Element | Window | Document;
  readonly dragContainer: Element;
  readonly dragOffsetContainer: Element | Window | Document;
  readonly x: number;
  readonly y: number;
  readonly pX: number;
  readonly pY: number;
  readonly _updateDiffX: number;
  readonly _updateDiffY: number;
  readonly _moveDiffX: number;
  readonly _moveDiffY: number;
  readonly _containerDiffX: number;
  readonly _containerDiffY: number;
  readonly _transform: string;

  constructor(
    element: HTMLElement | SVGElement,
    elementContainer: Element,
    elementOffsetContainer: Element | Window | Document,
    dragContainer: Element,
    dragOffsetContainer: Element | Window | Document,
  ) {
    this.element = element;
    this.elementContainer = elementContainer;
    this.elementOffsetContainer = elementOffsetContainer;
    this.dragContainer = dragContainer;
    this.dragOffsetContainer = dragOffsetContainer;
    this.x = 0;
    this.y = 0;
    this.pX = 0;
    this.pY = 0;
    this._updateDiffX = 0;
    this._updateDiffY = 0;
    this._moveDiffX = 0;
    this._moveDiffY = 0;
    this._containerDiffX = 0;
    this._containerDiffY = 0;
    this._transform = '';
  }
}
