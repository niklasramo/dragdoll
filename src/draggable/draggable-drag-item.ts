import { CSSProperties } from '../types.js';

export class DraggableDragItem {
  readonly element: HTMLElement | SVGSVGElement;
  readonly elementContainer: HTMLElement;
  readonly elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly dragContainer: HTMLElement;
  readonly dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document;
  readonly initialTransform: string;
  readonly frozenProps: CSSProperties | null;
  readonly unfrozenProps: CSSProperties | null;
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

  constructor(
    element: HTMLElement | SVGSVGElement,
    elementContainer: HTMLElement,
    elementOffsetContainer: HTMLElement | SVGSVGElement | Window | Document,
    dragContainer: HTMLElement,
    dragOffsetContainer: HTMLElement | SVGSVGElement | Window | Document,
  ) {
    this.element = element;
    this.elementContainer = elementContainer;
    this.elementOffsetContainer = elementOffsetContainer;
    this.dragContainer = dragContainer;
    this.dragOffsetContainer = dragOffsetContainer;
    this.initialTransform = '';
    this.frozenProps = null;
    this.unfrozenProps = null;
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
  }
}
