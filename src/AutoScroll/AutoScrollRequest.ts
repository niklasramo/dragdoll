import { AutoScrollAction } from './AutoScrollAction';

import { AutoScrollAxis, AutoScrollAxisDirection, AutoScrollDirection } from './AutoScroll';

import { AutoScrollItem } from './AutoScrollItem';

import { getScrollLeft } from '../utils/getScrollLeft';

import { getScrollTop } from '../utils/getScrollTop';

export interface AutoScrollSpeedData {
  direction: AutoScrollDirection;
  threshold: number;
  distance: number;
  value: number;
  maxValue: number;
  duration: number;
  speed: number;
  deltaTime: number;
  isEnding: boolean;
}

const SPEED_DATA: AutoScrollSpeedData = {
  direction: 0,
  threshold: 0,
  distance: 0,
  value: 0,
  maxValue: 0,
  duration: 0,
  speed: 0,
  deltaTime: 0,
  isEnding: false,
};

export class AutoScrollRequest {
  item: AutoScrollItem | null;
  element: HTMLElement | Window | null;
  isActive: boolean;
  isEnding: boolean;
  direction: AutoScrollDirection;
  value: number;
  maxValue: number;
  threshold: number;
  distance: number;
  deltaTime: number;
  speed: number;
  duration: number;
  action: AutoScrollAction | null;

  constructor() {
    this.item = null;
    this.element = null;
    this.isActive = false;
    this.isEnding = false;
    this.direction = 0;
    this.value = NaN;
    this.maxValue = 0;
    this.threshold = 0;
    this.distance = 0;
    this.deltaTime = 0;
    this.speed = 0;
    this.duration = 0;
    this.action = null;
  }

  reset() {
    if (this.isActive) this.onStop();
    this.item = null;
    this.element = null;
    this.isActive = false;
    this.isEnding = false;
    this.direction = 0;
    this.value = NaN;
    this.maxValue = 0;
    this.threshold = 0;
    this.distance = 0;
    this.deltaTime = 0;
    this.speed = 0;
    this.duration = 0;
    this.action = null;
  }

  hasReachedEnd() {
    return AutoScrollAxisDirection.forward & this.direction
      ? this.value >= this.maxValue
      : this.value <= 0;
  }

  computeCurrentScrollValue() {
    if (!this.element) return 0;

    if (this.value !== this.value) {
      return AutoScrollAxis.x & this.direction
        ? getScrollLeft(this.element)
        : getScrollTop(this.element);
    }

    return Math.max(0, Math.min(this.value, this.maxValue));
  }

  computeNextScrollValue() {
    const delta = this.speed * (this.deltaTime / 1000);
    const nextValue =
      AutoScrollAxisDirection.forward & this.direction ? this.value + delta : this.value - delta;
    return Math.max(0, Math.min(nextValue, this.maxValue));
  }

  computeSpeed() {
    if (!this.item || !this.element) return 0;
    const { speed } = this.item;
    if (typeof speed === 'function') {
      SPEED_DATA.direction = this.direction;
      SPEED_DATA.threshold = this.threshold;
      SPEED_DATA.distance = this.distance;
      SPEED_DATA.value = this.value;
      SPEED_DATA.maxValue = this.maxValue;
      SPEED_DATA.duration = this.duration;
      SPEED_DATA.speed = this.speed;
      SPEED_DATA.deltaTime = this.deltaTime;
      SPEED_DATA.isEnding = this.isEnding;
      return speed(this.element, SPEED_DATA);
    } else {
      return speed;
    }
  }

  tick(deltaTime: number) {
    if (!this.isActive) {
      this.isActive = true;
      this.onStart();
    }
    this.deltaTime = deltaTime;
    this.value = this.computeCurrentScrollValue();
    this.speed = this.computeSpeed();
    this.value = this.computeNextScrollValue();
    this.duration += deltaTime;
    return this.value;
  }

  onStart() {
    if (!this.item || !this.element) return;
    const { onStart } = this.item;
    if (typeof onStart === 'function') {
      onStart(this.element, this.direction);
    }
  }

  onStop() {
    if (!this.item || !this.element) return;
    const { onStop } = this.item;
    if (typeof onStop === 'function') {
      onStop(this.element, this.direction);
    }
  }
}
