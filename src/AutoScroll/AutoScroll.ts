import { Emitter, EventListenerId } from 'eventti';

import { Rect, RectExtended } from '../types';

import { Pool } from '../Pool';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { getIntersectionScore } from '../utils/getIntersectionScore';

import { getContentRect } from '../utils/getContentRect';

import { getScrollElement } from '../utils/getScrollElement';

import { getScrollLeft } from '../utils/getScrollLeft';

import { getScrollTop } from '../utils/getScrollTop';

import { getScrollLeftMax } from '../utils/getScrollLeftMax';

import { getScrollTopMax } from '../utils/getScrollTopMax';

//
// CONSTANTS
//

const R1: RectExtended = {
  width: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const R2: RectExtended = { ...R1 };

const DEFAULT_THRESHOLD = 50;

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

export const AUTO_SCROLL_AXIS = {
  x: 1,
  y: 2,
} as const;

export const AUTO_SCROLL_AXIS_DIRECTION = {
  forward: 4,
  reverse: 8,
} as const;

const AUTO_SCROLL_DIRECTION_X = {
  none: 0,
  left: (AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.reverse) as 9,
  right: (AUTO_SCROLL_AXIS.x | AUTO_SCROLL_AXIS_DIRECTION.forward) as 5,
} as const;

const AUTO_SCROLL_DIRECTION_Y = {
  none: 0,
  up: (AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.reverse) as 10,
  down: (AUTO_SCROLL_AXIS.y | AUTO_SCROLL_AXIS_DIRECTION.forward) as 6,
} as const;

export const AUTO_SCROLL_DIRECTION = {
  ...AUTO_SCROLL_DIRECTION_X,
  ...AUTO_SCROLL_DIRECTION_Y,
} as const;

//
// PRIVATE TYPES
//

type AutoScrollAxis = typeof AUTO_SCROLL_AXIS[keyof typeof AUTO_SCROLL_AXIS];

type AutoScrollDirectionX = typeof AUTO_SCROLL_DIRECTION_X[keyof typeof AUTO_SCROLL_DIRECTION_X];

type AutoScrollDirectionY = typeof AUTO_SCROLL_DIRECTION_Y[keyof typeof AUTO_SCROLL_DIRECTION_Y];

type AutoScrollDirection = typeof AUTO_SCROLL_DIRECTION[keyof typeof AUTO_SCROLL_DIRECTION];

interface AutoScrollSpeedData {
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

//
// PUBLIC TYPES
//

export interface AutoScrollItem {
  readonly targets: AutoScrollItemTarget[];
  readonly clientRect: Rect;
  readonly position: { x: number; y: number };
  readonly staticAreaSize: number;
  readonly smoothStop: boolean;
  readonly speed: number | AutoScrollItemSpeedCallback;
  readonly onStart?: AutoScrollItemEventCallback | null;
  readonly onStop?: AutoScrollItemEventCallback | null;
  readonly onPrepareScrollEffect?: AutoScrollItemEffectCallback | null;
  readonly onApplyScrollEffect?: AutoScrollItemEffectCallback | null;
}

export interface AutoScrollSettings {
  overlapCheckInterval: number;
}

export interface AutoScrollOptions extends Partial<AutoScrollSettings> {}

export interface AutoScrollEventCallbacks {
  beforescroll(): void;
  afterscroll(): void;
}

export interface AutoScrollItemTarget {
  element: Window | HTMLElement;
  axis?: 'x' | 'y' | 'xy';
  priority?: number;
  threshold?: number;
}

export type AutoScrollItemEventCallback = (
  scrollElement: Window | HTMLElement,
  scrollDirection: AutoScrollDirection
) => void;

export type AutoScrollItemEffectCallback = () => void;

export type AutoScrollItemSpeedCallback = (
  scrollElement: Window | HTMLElement,
  scrollData: AutoScrollSpeedData
) => number;

//
// PRIVATE UTILS
//

function computeThreshold(idealThreshold: number, targetSize: number) {
  return Math.min(targetSize / 2, idealThreshold);
}

function computeEdgeOffset(
  threshold: number,
  staticAreaSize: number,
  itemSize: number,
  targetSize: number
) {
  return Math.max(0, itemSize + threshold * 2 + targetSize * staticAreaSize - targetSize) / 2;
}

class AutoScrollItemData {
  positionX: number;
  positionY: number;
  directionX: AutoScrollDirectionX;
  directionY: AutoScrollDirectionY;
  overlapCheckRequestTime: number;

  constructor() {
    this.positionX = 0;
    this.positionY = 0;
    this.directionX = AUTO_SCROLL_DIRECTION.none;
    this.directionY = AUTO_SCROLL_DIRECTION.none;
    this.overlapCheckRequestTime = 0;
  }
}

class AutoScrollAction {
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
    if (AUTO_SCROLL_AXIS.x & request.direction) {
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

class AutoScrollRequest {
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
    return AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction
      ? this.value >= this.maxValue
      : this.value <= 0;
  }

  computeCurrentScrollValue() {
    if (!this.element) return 0;

    if (this.value !== this.value) {
      return AUTO_SCROLL_AXIS.x & this.direction
        ? getScrollLeft(this.element)
        : getScrollTop(this.element);
    }

    return Math.max(0, Math.min(this.value, this.maxValue));
  }

  computeNextScrollValue() {
    const delta = this.speed * (this.deltaTime / 1000);
    const nextValue =
      AUTO_SCROLL_AXIS_DIRECTION.forward & this.direction ? this.value + delta : this.value - delta;
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

//
// PUBLIC UTILS
//

export function autoScrollSmoothSpeed(
  // Pixels per second.
  maxSpeed = 500,
  // Time in seconds, how long it will take to accelerate from 0 to maxSpeed.
  accelerationFactor = 0.5,
  // Time in seconds, how long it will take to decelerate maxSpeed to 0.
  decelerationFactor = 0.25
): AutoScrollItemSpeedCallback {
  const acceleration = maxSpeed * (accelerationFactor > 0 ? 1 / accelerationFactor : Infinity);
  const deceleration = maxSpeed * (decelerationFactor > 0 ? 1 / decelerationFactor : Infinity);
  return function (_element, data) {
    let targetSpeed = 0;
    if (!data.isEnding) {
      if (data.threshold > 0) {
        const factor = data.threshold - Math.max(0, data.distance);
        targetSpeed = (maxSpeed / data.threshold) * factor;
      } else {
        targetSpeed = maxSpeed;
      }
    }

    const currentSpeed = data.speed;
    if (currentSpeed === targetSpeed) return targetSpeed;

    let nextSpeed = targetSpeed;
    if (currentSpeed < targetSpeed) {
      nextSpeed = currentSpeed + acceleration * (data.deltaTime / 1000);
      return Math.min(targetSpeed, nextSpeed);
    } else {
      nextSpeed = currentSpeed - deceleration * (data.deltaTime / 1000);
      return Math.max(targetSpeed, nextSpeed);
    }
  };
}

//
// AUTOSCROLL MAIN CLASS
//

export class AutoScroll {
  readonly items: AutoScrollItem[];
  readonly settings: AutoScrollSettings;
  protected _isDestroyed: boolean;
  protected _isTicking: boolean;
  protected _tickTime: number;
  protected _tickDeltaTime: number;
  protected _itemData: Map<AutoScrollItem, AutoScrollItemData>;
  protected _actions: AutoScrollAction[];
  protected _requests: {
    [AUTO_SCROLL_AXIS.x]: Map<AutoScrollItem, AutoScrollRequest>;
    [AUTO_SCROLL_AXIS.y]: Map<AutoScrollItem, AutoScrollRequest>;
  };
  protected _requestPool: Pool<AutoScrollRequest>;
  protected _actionPool: Pool<AutoScrollAction>;
  protected _emitter: Emitter<{
    beforescroll: () => void;
    afterscroll: () => void;
  }>;

  constructor(options: AutoScrollOptions = {}) {
    const { overlapCheckInterval = 150 } = options;

    this.items = [];
    this.settings = {
      overlapCheckInterval,
    };

    this._actions = [];
    this._isDestroyed = false;
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    this._requests = {
      [AUTO_SCROLL_AXIS.x]: new Map(),
      [AUTO_SCROLL_AXIS.y]: new Map(),
    };
    this._itemData = new Map();
    this._requestPool = new Pool<AutoScrollRequest>(
      () => new AutoScrollRequest(),
      (request) => request.reset()
    );
    this._actionPool = new Pool<AutoScrollAction>(
      () => new AutoScrollAction(),
      (action) => action.reset()
    );

    this._emitter = new Emitter();

    this._frameRead = this._frameRead.bind(this);
    this._frameWrite = this._frameWrite.bind(this);
  }

  protected _frameRead(time: number) {
    if (this._isDestroyed) return;
    if (time && this._tickTime) {
      this._tickDeltaTime = time - this._tickTime;
      this._tickTime = time;
      this._updateItems();
      this._updateRequests();
      this._updateActions();
    } else {
      this._tickTime = time;
      this._tickDeltaTime = 0;
    }
  }

  protected _frameWrite() {
    if (this._isDestroyed) return;
    this._applyActions();
  }

  protected _startTicking() {
    if (this._isTicking) return;
    this._isTicking = true;
    ticker.on(tickerReadPhase, this._frameRead);
    ticker.on(tickerWritePhase, this._frameWrite);
  }

  protected _stopTicking() {
    if (!this._isTicking) return;
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    ticker.off(tickerReadPhase, this._frameRead);
    ticker.off(tickerWritePhase, this._frameWrite);
  }

  protected _getItemClientRect(
    item: AutoScrollItem,
    result: RectExtended = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }
  ) {
    const { clientRect } = item;
    result.left = clientRect.left;
    result.top = clientRect.top;
    result.width = clientRect.width;
    result.height = clientRect.height;
    result.right = clientRect.left + clientRect.width;
    result.bottom = clientRect.top + clientRect.height;
    return result;
  }

  protected _requestItemScroll(
    item: AutoScrollItem,
    axis: AutoScrollAxis,
    element: Window | HTMLElement,
    direction: AutoScrollDirection,
    threshold: number,
    distance: number,
    maxValue: number
  ) {
    const reqMap = this._requests[axis];
    let request = reqMap.get(item);

    if (request) {
      if (request.element !== element || request.direction !== direction) {
        request.reset();
      }
    } else {
      request = this._requestPool.pick();
      reqMap.set(item, request);
    }

    request.item = item;
    request.element = element;
    request.direction = direction;
    request.threshold = threshold;
    request.distance = distance;
    request.maxValue = maxValue;
  }

  protected _cancelItemScroll(item: AutoScrollItem, axis: AutoScrollAxis) {
    const reqMap = this._requests[axis];
    const request = reqMap.get(item);
    if (!request) return;

    if (request.action) request.action.removeRequest(request);
    this._requestPool.put(request);
    reqMap.delete(item);
  }

  protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean) {
    const { staticAreaSize, targets } = item;
    if (!targets.length) {
      checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      return;
    }

    const itemData = this._itemData.get(item) as AutoScrollItemData;
    const moveDirectionX = itemData.directionX;
    const moveDirectionY = itemData.directionY;
    if (!moveDirectionX && !moveDirectionY) {
      checkX && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      checkY && this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      return;
    }

    const itemRect = this._getItemClientRect(item, R1);

    let xElement: Window | HTMLElement | null = null;
    let xPriority = -Infinity;
    let xThreshold = 0;
    let xScore = 0;
    let xDirection: AutoScrollDirectionX = AUTO_SCROLL_DIRECTION.none;
    let xDistance = 0;
    let xMaxScroll = 0;

    let yElement: Window | HTMLElement | null = null;
    let yPriority = -Infinity;
    let yThreshold = 0;
    let yScore = 0;
    let yDirection: AutoScrollDirectionY = AUTO_SCROLL_DIRECTION.none;
    let yDistance = 0;
    let yMaxScroll = 0;

    let i = 0;
    for (; i < targets.length; i++) {
      const target = targets[i];
      const targetThreshold =
        typeof target.threshold === 'number' ? target.threshold : DEFAULT_THRESHOLD;
      const testAxisX = !!(checkX && moveDirectionX && target.axis !== 'y');
      const testAxisY = !!(checkY && moveDirectionY && target.axis !== 'x');
      const testPriority = target.priority || 0;

      // Ignore this item if it's x-axis and y-axis priority is lower than
      // the currently matching item's.
      if ((!testAxisX || testPriority < xPriority) && (!testAxisY || testPriority < yPriority)) {
        continue;
      }

      const testElement = getScrollElement(target.element || target);
      const testMaxScrollX = testAxisX ? getScrollLeftMax(testElement) : -1;
      const testMaxScrollY = testAxisY ? getScrollTopMax(testElement) : -1;

      // Ignore this item if there is no possibility to scroll.
      if (!testMaxScrollX && !testMaxScrollY) continue;

      const testRect = getContentRect(testElement, R2);
      const testScore = getIntersectionScore(itemRect, testRect);

      // Ignore this item if it's not overlapping at all with the dragged item.
      if (testScore <= 0) continue;

      // Test x-axis.
      if (
        testAxisX &&
        testPriority >= xPriority &&
        testMaxScrollX > 0 &&
        (testPriority > xPriority || testScore > xScore)
      ) {
        let testDistance = 0;
        let testDirection: AutoScrollDirectionX = AUTO_SCROLL_DIRECTION.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.width);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          staticAreaSize,
          itemRect.width,
          testRect.width
        );

        if (moveDirectionX === AUTO_SCROLL_DIRECTION.right) {
          testDistance = testRect.right + testEdgeOffset - itemRect.right;
          if (testDistance <= testThreshold && getScrollLeft(testElement) < testMaxScrollX) {
            testDirection = AUTO_SCROLL_DIRECTION.right;
          }
        } else if (moveDirectionX === AUTO_SCROLL_DIRECTION.left) {
          testDistance = itemRect.left - (testRect.left - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollLeft(testElement) > 0) {
            testDirection = AUTO_SCROLL_DIRECTION.left;
          }
        }

        if (testDirection) {
          xElement = testElement;
          xPriority = testPriority;
          xThreshold = testThreshold;
          xScore = testScore;
          xDirection = testDirection;
          xDistance = testDistance;
          xMaxScroll = testMaxScrollX;
        }
      }

      // Test y-axis.
      if (
        testAxisY &&
        testPriority >= yPriority &&
        testMaxScrollY > 0 &&
        (testPriority > yPriority || testScore > yScore)
      ) {
        let testDistance = 0;
        let testDirection: AutoScrollDirectionY = AUTO_SCROLL_DIRECTION_Y.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.height);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          staticAreaSize,
          itemRect.height,
          testRect.height
        );

        if (moveDirectionY === AUTO_SCROLL_DIRECTION.down) {
          testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
          if (testDistance <= testThreshold && getScrollTop(testElement) < testMaxScrollY) {
            testDirection = AUTO_SCROLL_DIRECTION.down;
          }
        } else if (moveDirectionY === AUTO_SCROLL_DIRECTION.up) {
          testDistance = itemRect.top - (testRect.top - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollTop(testElement) > 0) {
            testDirection = AUTO_SCROLL_DIRECTION.up;
          }
        }

        if (testDirection) {
          yElement = testElement;
          yPriority = testPriority;
          yThreshold = testThreshold;
          yScore = testScore;
          yDirection = testDirection;
          yDistance = testDistance;
          yMaxScroll = testMaxScrollY;
        }
      }
    }

    // Request or cancel x-axis scroll.
    if (checkX) {
      if (xElement && xDirection) {
        this._requestItemScroll(
          item,
          AUTO_SCROLL_AXIS.x,
          xElement,
          xDirection,
          xThreshold,
          xDistance,
          xMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      }
    }

    // Request or cancel y-axis scroll.
    if (checkY) {
      if (yElement && yDirection) {
        this._requestItemScroll(
          item,
          AUTO_SCROLL_AXIS.y,
          yElement,
          yDirection,
          yThreshold,
          yDistance,
          yMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      }
    }
  }

  protected _updateScrollRequest(scrollRequest: AutoScrollRequest) {
    const item = scrollRequest.item as AutoScrollItem;
    const { staticAreaSize, smoothStop, targets } = item;
    const itemRect = this._getItemClientRect(item, R1);
    let hasReachedEnd = null;

    let i = 0;
    for (; i < targets.length; i++) {
      const target = targets[i];

      // Make sure we have a matching element.
      const testElement = getScrollElement(target.element || target);
      if (testElement !== scrollRequest.element) continue;

      // Make sure we have a matching axis.
      const testIsAxisX = !!(AUTO_SCROLL_AXIS.x & scrollRequest.direction);
      if (testIsAxisX) {
        if (target.axis === 'y') continue;
      } else {
        if (target.axis === 'x') continue;
      }

      // Stop scrolling if there is no room to scroll anymore.
      const testMaxScroll = testIsAxisX
        ? getScrollLeftMax(testElement)
        : getScrollTopMax(testElement);
      if (testMaxScroll <= 0) {
        break;
      }

      const testRect = getContentRect(testElement, R2);
      const testScore = getIntersectionScore(itemRect, testRect);

      // Stop scrolling if dragged item is not overlapping with the scroll
      // element anymore.
      if (testScore <= 0) {
        break;
      }

      // Compute threshold.
      const targetThreshold =
        typeof target.threshold === 'number' ? target.threshold : DEFAULT_THRESHOLD;
      const testThreshold = computeThreshold(
        targetThreshold,
        testIsAxisX ? testRect.width : testRect.height
      );

      // Compute edge offset.
      const testEdgeOffset = computeEdgeOffset(
        testThreshold,
        staticAreaSize,
        testIsAxisX ? itemRect.width : itemRect.height,
        testIsAxisX ? testRect.width : testRect.height
      );

      // Compute distance (based on current direction).
      let testDistance = 0;
      if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.left) {
        testDistance = itemRect.left - (testRect.left - testEdgeOffset);
      } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.right) {
        testDistance = testRect.right + testEdgeOffset - itemRect.right;
      } else if (scrollRequest.direction === AUTO_SCROLL_DIRECTION.up) {
        testDistance = itemRect.top - (testRect.top - testEdgeOffset);
      } else {
        testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
      }

      // Stop scrolling if threshold is not exceeded.
      if (testDistance > testThreshold) {
        break;
      }

      // Stop scrolling if we have reached the end of the scroll value.
      const testScroll = testIsAxisX ? getScrollLeft(testElement) : getScrollTop(testElement);
      hasReachedEnd =
        AUTO_SCROLL_AXIS_DIRECTION.forward & scrollRequest.direction
          ? testScroll >= testMaxScroll
          : testScroll <= 0;
      if (hasReachedEnd) {
        break;
      }

      // Scrolling can continue, let's update the values.
      scrollRequest.maxValue = testMaxScroll;
      scrollRequest.threshold = testThreshold;
      scrollRequest.distance = testDistance;
      scrollRequest.isEnding = false;
      return true;
    }

    // Before we end the request, let's see if we need to stop the scrolling
    // smoothly or immediately.
    if (smoothStop === true && scrollRequest.speed > 0) {
      if (hasReachedEnd === null) hasReachedEnd = scrollRequest.hasReachedEnd();
      scrollRequest.isEnding = hasReachedEnd ? false : true;
    } else {
      scrollRequest.isEnding = false;
    }

    return scrollRequest.isEnding;
  }

  protected _updateItems() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const itemData = this._itemData.get(item) as AutoScrollItemData;
      const { x, y } = item.position;
      const prevX = itemData.positionX;
      const prevY = itemData.positionY;

      // If there is no change in position -> skip.
      if (x === prevX && y === prevY) {
        continue;
      }

      // Update direction x.
      itemData.directionX =
        x > prevX
          ? AUTO_SCROLL_DIRECTION.right
          : x < prevX
          ? AUTO_SCROLL_DIRECTION.left
          : itemData.directionX;

      // Update direction y.
      itemData.directionY =
        y > prevY
          ? AUTO_SCROLL_DIRECTION.down
          : y < prevY
          ? AUTO_SCROLL_DIRECTION.up
          : itemData.directionY;

      // Update positions.
      itemData.positionX = x;
      itemData.positionY = y;

      // Request overlap check (if not already requested).
      if (itemData.overlapCheckRequestTime === 0) {
        itemData.overlapCheckRequestTime = this._tickTime;
      }
    }
  }

  protected _updateRequests() {
    const items = this.items;
    const requestsX = this._requests[AUTO_SCROLL_AXIS.x];
    const requestsY = this._requests[AUTO_SCROLL_AXIS.y];

    let i = 0;
    for (; i < items.length; i++) {
      const item = items[i];
      const itemData = this._itemData.get(item) as AutoScrollItemData;
      const checkTime = itemData.overlapCheckRequestTime;
      let needsCheck =
        checkTime > 0 && this._tickTime - checkTime > this.settings.overlapCheckInterval;

      let checkX = true;
      const reqX = requestsX.get(item);
      if (reqX && reqX.isActive) {
        checkX = !this._updateScrollRequest(reqX);
        if (checkX) {
          needsCheck = true;
          this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
        }
      }

      let checkY = true;
      const reqY = requestsY.get(item);
      if (reqY && reqY.isActive) {
        checkY = !this._updateScrollRequest(reqY);
        if (checkY) {
          needsCheck = true;
          this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
        }
      }

      if (needsCheck) {
        itemData.overlapCheckRequestTime = 0;
        this._checkItemOverlap(item, checkX, checkY);
      }
    }
  }

  protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis) {
    const isAxisX = axis === AUTO_SCROLL_AXIS.x;
    let action: AutoScrollAction | null = null;

    let i = 0;
    for (; i < this._actions.length; i++) {
      action = this._actions[i];

      // If the action's request does not match the request's -> skip.
      if (request.element !== action.element) {
        action = null;
        continue;
      }

      // If the request and action share the same element, but the request slot
      // for the requested axis is already reserved let's ignore and cancel this
      // request.
      if (isAxisX ? action.requestX : action.requestY) {
        this._cancelItemScroll(request.item as AutoScrollItem, axis);
        return;
      }

      // Seems like we have found our action, let's break the loop.
      break;
    }

    if (!action) action = this._actionPool.pick();
    action.element = request.element;
    action.addRequest(request);

    request.tick(this._tickDeltaTime);
    this._actions.push(action);
  }

  protected _updateActions() {
    let i = 0;

    // Generate actions.
    for (i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const reqX = this._requests[AUTO_SCROLL_AXIS.x].get(item);
      const reqY = this._requests[AUTO_SCROLL_AXIS.y].get(item);
      if (reqX) this._requestAction(reqX, AUTO_SCROLL_AXIS.x);
      if (reqY) this._requestAction(reqY, AUTO_SCROLL_AXIS.y);
    }

    // Compute scroll values.
    for (i = 0; i < this._actions.length; i++) {
      this._actions[i].computeScrollValues();
    }
  }

  protected _applyActions() {
    // No actions -> no scrolling.
    if (!this._actions.length) return;

    // TODO: Would be nice to emit also the elements that will be scrolled,
    // to which direction they will be scrolled and how much they will be
    // scrolled.
    this._emitter.emit('beforescroll');

    let i = 0;

    // Scroll all the required elements.
    for (i = 0; i < this._actions.length; i++) {
      this._actions[i].scroll();
      this._actionPool.put(this._actions[i]);
    }

    // Reset actions.
    this._actions.length = 0;

    // Call after scroll callbacks for all items that were scrolled.
    let item: AutoScrollItem;
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item.onPrepareScrollEffect) {
        item.onPrepareScrollEffect();
      }
    }
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item.onApplyScrollEffect) {
        item.onApplyScrollEffect();
      }
    }

    // TODO: Would be nice to emit also the elements that were scrolled,
    // to which direction they were scrolled and how much they were scrolled.
    this._emitter.emit('afterscroll');
  }

  /**
   * Bind a listener.
   */
  on<T extends keyof AutoScrollEventCallbacks>(
    eventName: T,
    listener: AutoScrollEventCallbacks[T]
  ): EventListenerId {
    return this._emitter.on(eventName, listener);
  }

  /**
   * Unbind a listener.
   */
  off<T extends keyof AutoScrollEventCallbacks>(
    eventName: T,
    listener: AutoScrollEventCallbacks[T] | EventListenerId
  ): void {
    this._emitter.off(eventName, listener);
  }

  addItem(item: AutoScrollItem) {
    if (this._isDestroyed || this._itemData.has(item)) return;

    const { x, y } = item.position;
    const itemData = new AutoScrollItemData();

    itemData.positionX = x;
    itemData.positionY = y;
    itemData.directionX = AUTO_SCROLL_DIRECTION.none;
    itemData.directionY = AUTO_SCROLL_DIRECTION.none;
    itemData.overlapCheckRequestTime = this._tickTime;

    this._itemData.set(item, itemData);
    this.items.push(item);
    if (!this._isTicking) this._startTicking();
  }

  removeItem(item: AutoScrollItem) {
    if (this._isDestroyed) return;

    const index = this.items.indexOf(item);
    if (index === -1) return;

    if (this._requests[AUTO_SCROLL_AXIS.x].get(item)) {
      this._cancelItemScroll(item, AUTO_SCROLL_AXIS.x);
      this._requests[AUTO_SCROLL_AXIS.x].delete(item);
    }

    if (this._requests[AUTO_SCROLL_AXIS.y].get(item)) {
      this._cancelItemScroll(item, AUTO_SCROLL_AXIS.y);
      this._requests[AUTO_SCROLL_AXIS.y].delete(item);
    }

    this._itemData.delete(item);
    this.items.splice(index, 1);

    if (this._isTicking && !this.items.length) {
      this._stopTicking();
    }
  }

  isDestroyed() {
    return this._isDestroyed;
  }

  isItemScrollingX(item: AutoScrollItem) {
    return !!this._requests[AUTO_SCROLL_AXIS.x].get(item)?.isActive;
  }

  isItemScrollingY(item: AutoScrollItem) {
    return !!this._requests[AUTO_SCROLL_AXIS.y].get(item)?.isActive;
  }

  isItemScrolling(item: AutoScrollItem) {
    return this.isItemScrollingX(item) || this.isItemScrollingY(item);
  }

  updateSettings(options: AutoScrollOptions = {}) {
    const { overlapCheckInterval = this.settings.overlapCheckInterval } = options;
    this.settings.overlapCheckInterval = overlapCheckInterval;
  }

  destroy() {
    if (this._isDestroyed) return;

    const items = this.items.slice(0);
    let i = 0;
    for (; i < items.length; i++) {
      this.removeItem(items[i]);
    }

    this._actions.length = 0;
    this._requestPool.reset();
    this._actionPool.reset();
    this._emitter.off();

    this._isDestroyed = true;
  }
}
