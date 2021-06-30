import { RectExtended } from '../types';

import { AutoScrollItem } from './AutoScrollItem';

import { AutoScrollRequest } from './AutoScrollRequest';

import { AutoScrollAction } from './AutoScrollAction';

import { Emitter } from '../Emitter';

import { TickCallback } from '../Ticker';

import { Pool } from '../Pool';

import { readQueue, writeQueue } from '../singletons/ticker';

import { getIntersectionScore } from '../utils/getIntersectionScore';

import { getContentRect } from '../utils/getContentRect';

import { getScrollElement } from '../utils/getScrollElement';

import { getScrollLeft } from '../utils/getScrollLeft';

import { getScrollTop } from '../utils/getScrollTop';

import { getScrollLeftMax } from '../utils/getScrollLeftMax';

import { getScrollTopMax } from '../utils/getScrollTopMax';

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

export const AutoScrollAxis = {
  x: 1,
  y: 2,
} as const;

export type AutoScrollAxis = typeof AutoScrollAxis[keyof typeof AutoScrollAxis];

export const AutoScrollAxisDirection = {
  forward: 4,
  reverse: 8,
} as const;

export type AutoScrollAxisDirection =
  typeof AutoScrollAxisDirection[keyof typeof AutoScrollAxisDirection];

export const AutoScrollDirectionX = {
  none: 0,
  left: (AutoScrollAxis.x | AutoScrollAxisDirection.reverse) as 9,
  right: (AutoScrollAxis.x | AutoScrollAxisDirection.forward) as 5,
} as const;

export type AutoScrollDirectionX = typeof AutoScrollDirectionX[keyof typeof AutoScrollDirectionX];

export const AutoScrollDirectionY = {
  none: 0,
  up: (AutoScrollAxis.y | AutoScrollAxisDirection.reverse) as 10,
  down: (AutoScrollAxis.y | AutoScrollAxisDirection.forward) as 6,
} as const;

export type AutoScrollDirectionY = typeof AutoScrollDirectionY[keyof typeof AutoScrollDirectionY];

export const AutoScrollDirection = {
  ...AutoScrollDirectionX,
  ...AutoScrollDirectionY,
} as const;

export type AutoScrollDirection = typeof AutoScrollDirection[keyof typeof AutoScrollDirection];

export interface AutoScrollSettings {
  overlapCheckInterval: number;
  addReadOperation: (callback: TickCallback) => void;
  cancelReadOperation: (callback: TickCallback) => void;
  addWriteOperation: (callback: TickCallback) => void;
  cancelWriteOperation: (callback: TickCallback) => void;
}

export interface AutoScrollOptions extends Partial<AutoScrollSettings> {}

interface AutoScrollEventCallbacks {
  beforescroll(): void;
  afterscroll(): void;
}

function computeThreshold(idealThreshold: number, targetSize: number) {
  return Math.min(targetSize / 2, idealThreshold);
}

function computeEdgeOffset(
  threshold: number,
  safeZone: number,
  itemSize: number,
  targetSize: number
) {
  return Math.max(0, itemSize + threshold * 2 + targetSize * safeZone - targetSize) / 2;
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
    this.directionX = AutoScrollDirection.none;
    this.directionY = AutoScrollDirection.none;
    this.overlapCheckRequestTime = 0;
  }
}

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
    [AutoScrollAxis.x]: Map<AutoScrollItem, AutoScrollRequest>;
    [AutoScrollAxis.y]: Map<AutoScrollItem, AutoScrollRequest>;
  };
  protected _requestPool: Pool<AutoScrollRequest>;
  protected _actionPool: Pool<AutoScrollAction>;
  protected _emitter: Emitter;

  constructor(options: AutoScrollOptions = {}) {
    const {
      overlapCheckInterval = 150,
      addReadOperation = (callback) => readQueue.add(callback),
      cancelReadOperation = (callback) => readQueue.remove(callback),
      addWriteOperation = (callback) => writeQueue.add(callback),
      cancelWriteOperation = (callback) => writeQueue.remove(callback),
    } = options;

    this.items = [];
    this.settings = {
      overlapCheckInterval,
      addReadOperation,
      cancelReadOperation,
      addWriteOperation,
      cancelWriteOperation,
    };

    this._actions = [];
    this._isDestroyed = false;
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    this._requests = {
      [AutoScrollAxis.x]: new Map(),
      [AutoScrollAxis.y]: new Map(),
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

    this._readTick = this._readTick.bind(this);
    this._writeTick = this._writeTick.bind(this);
  }

  protected _readTick(time: number) {
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

  protected _writeTick() {
    if (this._isDestroyed) return;
    this._applyActions();
    this.settings.addReadOperation(this._readTick);
    this.settings.addWriteOperation(this._writeTick);
  }

  protected _startTicking() {
    this._isTicking = true;
    this.settings.addReadOperation(this._readTick);
    this.settings.addWriteOperation(this._writeTick);
  }

  protected _stopTicking() {
    this._isTicking = false;
    this._tickTime = 0;
    this._tickDeltaTime = 0;
    this.settings.cancelReadOperation(this._readTick);
    this.settings.cancelWriteOperation(this._writeTick);
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
    this._requestPool.drop(request);
    reqMap.delete(item);
  }

  protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean) {
    const { safeZone, targets } = item;
    if (!targets.length) {
      checkX && this._cancelItemScroll(item, AutoScrollAxis.x);
      checkY && this._cancelItemScroll(item, AutoScrollAxis.y);
      return;
    }

    const itemData = this._itemData.get(item) as AutoScrollItemData;
    const moveDirectionX = itemData.directionX;
    const moveDirectionY = itemData.directionY;
    if (!moveDirectionX && !moveDirectionY) {
      checkX && this._cancelItemScroll(item, AutoScrollAxis.x);
      checkY && this._cancelItemScroll(item, AutoScrollAxis.y);
      return;
    }

    const itemRect = this._getItemClientRect(item, R1);

    let xElement: Window | HTMLElement | null = null;
    let xPriority = -Infinity;
    let xThreshold = 0;
    let xScore = 0;
    let xDirection: AutoScrollDirectionX = AutoScrollDirectionX.none;
    let xDistance = 0;
    let xMaxScroll = 0;

    let yElement: Window | HTMLElement | null = null;
    let yPriority = -Infinity;
    let yThreshold = 0;
    let yScore = 0;
    let yDirection: AutoScrollDirectionY = AutoScrollDirectionY.none;
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
        let testDirection: AutoScrollDirectionX = AutoScrollDirectionX.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.width);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          safeZone,
          itemRect.width,
          testRect.width
        );

        if (moveDirectionX === AutoScrollDirection.right) {
          testDistance = testRect.right + testEdgeOffset - itemRect.right;
          if (testDistance <= testThreshold && getScrollLeft(testElement) < testMaxScrollX) {
            testDirection = AutoScrollDirection.right;
          }
        } else if (moveDirectionX === AutoScrollDirection.left) {
          testDistance = itemRect.left - (testRect.left - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollLeft(testElement) > 0) {
            testDirection = AutoScrollDirection.left;
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
        let testDirection: AutoScrollDirectionY = AutoScrollDirectionY.none;
        const testThreshold = computeThreshold(targetThreshold, testRect.height);
        const testEdgeOffset = computeEdgeOffset(
          testThreshold,
          safeZone,
          itemRect.height,
          testRect.height
        );

        if (moveDirectionY === AutoScrollDirection.down) {
          testDistance = testRect.bottom + testEdgeOffset - itemRect.bottom;
          if (testDistance <= testThreshold && getScrollTop(testElement) < testMaxScrollY) {
            testDirection = AutoScrollDirection.down;
          }
        } else if (moveDirectionY === AutoScrollDirection.up) {
          testDistance = itemRect.top - (testRect.top - testEdgeOffset);
          if (testDistance <= testThreshold && getScrollTop(testElement) > 0) {
            testDirection = AutoScrollDirection.up;
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
          AutoScrollAxis.x,
          xElement,
          xDirection,
          xThreshold,
          xDistance,
          xMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AutoScrollAxis.x);
      }
    }

    // Request or cancel y-axis scroll.
    if (checkY) {
      if (yElement && yDirection) {
        this._requestItemScroll(
          item,
          AutoScrollAxis.y,
          yElement,
          yDirection,
          yThreshold,
          yDistance,
          yMaxScroll
        );
      } else {
        this._cancelItemScroll(item, AutoScrollAxis.y);
      }
    }
  }

  protected _updateScrollRequest(scrollRequest: AutoScrollRequest) {
    const item = scrollRequest.item as AutoScrollItem;
    const { safeZone, smoothStop, targets } = item;
    const itemRect = this._getItemClientRect(item, R1);
    let hasReachedEnd = null;

    let i = 0;
    for (; i < targets.length; i++) {
      const target = targets[i];

      // Make sure we have a matching element.
      const testElement = getScrollElement(target.element || target);
      if (testElement !== scrollRequest.element) continue;

      // Make sure we have a matching axis.
      const testIsAxisX = !!(AutoScrollAxis.x & scrollRequest.direction);
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
        safeZone,
        testIsAxisX ? itemRect.width : itemRect.height,
        testIsAxisX ? testRect.width : testRect.height
      );

      // Compute distance (based on current direction).
      let testDistance = 0;
      if (scrollRequest.direction === AutoScrollDirection.left) {
        testDistance = itemRect.left - (testRect.left - testEdgeOffset);
      } else if (scrollRequest.direction === AutoScrollDirection.right) {
        testDistance = testRect.right + testEdgeOffset - itemRect.right;
      } else if (scrollRequest.direction === AutoScrollDirection.up) {
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
        AutoScrollAxisDirection.forward & scrollRequest.direction
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
          ? AutoScrollDirection.right
          : x < prevX
          ? AutoScrollDirection.left
          : itemData.directionX;

      // Update direction y.
      itemData.directionY =
        y > prevY
          ? AutoScrollDirection.down
          : y < prevY
          ? AutoScrollDirection.up
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
    const requestsX = this._requests[AutoScrollAxis.x];
    const requestsY = this._requests[AutoScrollAxis.y];

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
          this._cancelItemScroll(item, AutoScrollAxis.x);
        }
      }

      let checkY = true;
      const reqY = requestsY.get(item);
      if (reqY && reqY.isActive) {
        checkY = !this._updateScrollRequest(reqY);
        if (checkY) {
          needsCheck = true;
          this._cancelItemScroll(item, AutoScrollAxis.y);
        }
      }

      if (needsCheck) {
        itemData.overlapCheckRequestTime = 0;
        this._checkItemOverlap(item, checkX, checkY);
      }
    }
  }

  protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis) {
    const isAxisX = axis === AutoScrollAxis.x;
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
      const reqX = this._requests[AutoScrollAxis.x].get(item);
      const reqY = this._requests[AutoScrollAxis.y].get(item);
      if (reqX) this._requestAction(reqX, AutoScrollAxis.x);
      if (reqY) this._requestAction(reqY, AutoScrollAxis.y);
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
      this._actionPool.drop(this._actions[i]);
    }

    // Reset actions.
    this._actions.length = 0;

    // Call after scroll callbacks for all items that were scrolled.
    let item: AutoScrollItem;
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item.onPrepareAfterScrollEffect) {
        item.onPrepareAfterScrollEffect();
      }
    }
    for (i = 0; i < this.items.length; i++) {
      item = this.items[i];
      if (item.onApplyAfterScrollEffect) {
        item.onApplyAfterScrollEffect();
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
    event: T,
    listener: AutoScrollEventCallbacks[T]
  ): void {
    this._emitter.on(event, listener);
  }

  /**
   * Unbind a listener.
   */
  off<T extends keyof AutoScrollEventCallbacks>(
    event: T,
    listener: AutoScrollEventCallbacks[T]
  ): void {
    this._emitter.off(event, listener);
  }

  addItem(item: AutoScrollItem) {
    if (this._isDestroyed || this._itemData.has(item)) return;

    const { x, y } = item.position;
    const itemData = new AutoScrollItemData();

    itemData.positionX = x;
    itemData.positionY = y;
    itemData.directionX = AutoScrollDirectionX.none;
    itemData.directionY = AutoScrollDirection.none;
    itemData.overlapCheckRequestTime = this._tickTime;

    this._itemData.set(item, itemData);
    this.items.push(item);
    if (!this._isTicking) this._startTicking();
  }

  removeItem(item: AutoScrollItem) {
    if (this._isDestroyed) return;

    const index = this.items.indexOf(item);
    if (index === -1) return;

    if (this._requests[AutoScrollAxis.x].get(item)) {
      this._cancelItemScroll(item, AutoScrollAxis.x);
      this._requests[AutoScrollAxis.x].delete(item);
    }

    if (this._requests[AutoScrollAxis.y].get(item)) {
      this._cancelItemScroll(item, AutoScrollAxis.y);
      this._requests[AutoScrollAxis.y].delete(item);
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
    return !!this._requests[AutoScrollAxis.x].get(item)?.isActive;
  }

  isItemScrollingY(item: AutoScrollItem) {
    return !!this._requests[AutoScrollAxis.y].get(item)?.isActive;
  }

  isItemScrolling(item: AutoScrollItem) {
    return this.isItemScrollingX(item) || this.isItemScrollingY(item);
  }

  updateSettings(options: AutoScrollOptions = {}) {
    const {
      overlapCheckInterval = this.settings.overlapCheckInterval,
      addReadOperation = this.settings.addReadOperation,
      cancelReadOperation = this.settings.cancelReadOperation,
      addWriteOperation = this.settings.addWriteOperation,
      cancelWriteOperation = this.settings.cancelWriteOperation,
    } = options;

    this.settings.overlapCheckInterval = overlapCheckInterval;
    this.settings.addReadOperation = addReadOperation;
    this.settings.cancelReadOperation = cancelReadOperation;
    this.settings.addWriteOperation = addWriteOperation;
    this.settings.cancelWriteOperation = cancelWriteOperation;
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

    this._isDestroyed = true;
  }
}
