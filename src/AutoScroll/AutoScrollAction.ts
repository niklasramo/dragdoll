import { AutoScrollRequest } from './AutoScrollRequest';

import { AutoScrollAxis } from './AutoScroll';

import { getScrollLeft } from '../utils/getScrollLeft';

import { getScrollTop } from '../utils/getScrollTop';

export class AutoScrollAction {
  element: HTMLElement | Window | null;
  requestX: AutoScrollRequest | null;
  requestY: AutoScrollRequest | null;
  scrollLeft: number;
  scrollTop: number;

  constructor() {
    this.element = null;
    this.requestX = null;
    this.requestY = null;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }

  reset() {
    if (this.requestX) this.requestX.action = null;
    if (this.requestY) this.requestY.action = null;
    this.element = null;
    this.requestX = null;
    this.requestY = null;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }

  addRequest(request: AutoScrollRequest) {
    if (AutoScrollAxis.x & request.direction) {
      this.requestX && this.removeRequest(this.requestX);
      this.requestX = request;
    } else {
      this.requestY && this.removeRequest(this.requestY);
      this.requestY = request;
    }
    request.action = this;
  }

  removeRequest(request: AutoScrollRequest) {
    if (this.requestX === request) {
      this.requestX = null;
      request.action = null;
    } else if (this.requestY === request) {
      this.requestY = null;
      request.action = null;
    }
  }

  computeScrollValues() {
    if (!this.element) return;
    this.scrollLeft = this.requestX ? this.requestX.value : getScrollLeft(this.element);
    this.scrollTop = this.requestY ? this.requestY.value : getScrollTop(this.element);
  }

  scroll() {
    if (!this.element) return;

    if (this.element.scrollTo) {
      this.element.scrollTo(this.scrollLeft, this.scrollTop);
    } else {
      (this.element as HTMLElement).scrollLeft = this.scrollLeft;
      (this.element as HTMLElement).scrollTop = this.scrollTop;
    }
  }
}
