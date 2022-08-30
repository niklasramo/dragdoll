export class DraggableItem {
  element: HTMLElement | null;
  rootParent: HTMLElement | null;
  rootContainingBlock: HTMLElement | Document | null;
  dragParent: HTMLElement | null;
  dragContainingBlock: HTMLElement | Document | null;
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  syncDiffX: number;
  syncDiffY: number;
  moveDiffX: number;
  moveDiffY: number;
  containerDiffX: number;
  containerDiffY: number;

  constructor() {
    this.element = null;
    this.rootParent = null;
    this.rootContainingBlock = null;
    this.dragParent = null;
    this.dragContainingBlock = null;
    this.x = 0;
    this.y = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.syncDiffX = 0;
    this.syncDiffY = 0;
    this.moveDiffX = 0;
    this.moveDiffY = 0;
    this.containerDiffX = 0;
    this.containerDiffY = 0;
  }
}
