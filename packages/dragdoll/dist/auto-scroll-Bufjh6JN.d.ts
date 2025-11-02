import { a as Rect, r as Point } from "./types-BaIRuLz3.js";

//#region src/utils/object-pool.d.ts
declare class ObjectPool<Item extends NonNullable<any>, ItemArgs extends any[] = []> {
  protected _batchSize: number;
  protected _maxSize: number;
  protected _minSize: number;
  protected _shrinkThreshold: number;
  protected _data: Item[];
  protected _index: number;
  protected _getItem: (item?: Item, ...args: ItemArgs) => Item;
  protected _onRelease: ((item: Item) => void) | undefined;
  constructor(getItem: (item?: Item, ...args: ItemArgs) => Item, {
    batchSize,
    minBatchCount,
    maxBatchCount,
    initialBatchCount,
    shrinkThreshold,
    onRelease
  }?: {
    batchSize?: number;
    minBatchCount?: number;
    maxBatchCount?: number;
    initialBatchCount?: number;
    shrinkThreshold?: number;
    onRelease?: (object: Item) => void;
  });
  get(...args: ItemArgs): Item;
  release(object: Item): void;
  destroy(): void;
}
//#endregion
//#region src/auto-scroll/auto-scroll.d.ts
declare const AUTO_SCROLL_AXIS: {
  readonly x: 1;
  readonly y: 2;
};
declare const AUTO_SCROLL_AXIS_DIRECTION: {
  readonly forward: 4;
  readonly reverse: 8;
};
declare const AUTO_SCROLL_DIRECTION_X: {
  readonly none: 0;
  readonly left: 9;
  readonly right: 5;
};
declare const AUTO_SCROLL_DIRECTION_Y: {
  readonly none: 0;
  readonly up: 10;
  readonly down: 6;
};
declare const AUTO_SCROLL_DIRECTION: {
  readonly none: 0;
  readonly up: 10;
  readonly down: 6;
  readonly left: 9;
  readonly right: 5;
};
declare function getDirectionAsString(direction: number): "none" | "left" | "right" | "up" | "down";
type AutoScrollAxis = (typeof AUTO_SCROLL_AXIS)[keyof typeof AUTO_SCROLL_AXIS];
type AutoScrollDirectionX = (typeof AUTO_SCROLL_DIRECTION_X)[keyof typeof AUTO_SCROLL_DIRECTION_X];
type AutoScrollDirectionY = (typeof AUTO_SCROLL_DIRECTION_Y)[keyof typeof AUTO_SCROLL_DIRECTION_Y];
type AutoScrollDirection = (typeof AUTO_SCROLL_DIRECTION)[keyof typeof AUTO_SCROLL_DIRECTION];
interface AutoScrollSpeedData {
  direction: ReturnType<typeof getDirectionAsString>;
  threshold: number;
  distance: number;
  value: number;
  maxValue: number;
  duration: number;
  speed: number;
  deltaTime: number;
  isEnding: boolean;
}
type AutoScrollTargetPadding = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};
interface AutoScrollItem {
  readonly targets: AutoScrollItemTarget[];
  readonly clientRect: Rect;
  readonly position: Point;
  readonly inertAreaSize: number;
  readonly smoothStop: boolean;
  readonly speed: number | AutoScrollItemSpeedCallback;
  readonly onStart?: AutoScrollItemEventCallback | null;
  readonly onStop?: AutoScrollItemEventCallback | null;
}
interface AutoScrollSettings {
  overlapCheckInterval: number;
}
interface AutoScrollOptions extends Partial<AutoScrollSettings> {}
interface AutoScrollItemTarget {
  element: Window | Element;
  axis?: 'x' | 'y' | 'xy';
  priority?: number;
  threshold?: number;
  padding?: AutoScrollTargetPadding;
  scrollPadding?: AutoScrollTargetPadding;
}
type AutoScrollItemEventCallback = (scrollElement: Window | Element, scrollDirection: ReturnType<typeof getDirectionAsString>) => void;
type AutoScrollItemEffectCallback = () => void;
type AutoScrollItemSpeedCallback = (scrollElement: Window | Element, scrollData: AutoScrollSpeedData) => number;
declare class AutoScrollItemData {
  positionX: number;
  positionY: number;
  directionX: AutoScrollDirectionX;
  directionY: AutoScrollDirectionY;
  overlapCheckRequestTime: number;
  constructor();
}
declare class AutoScrollAction {
  element: Element | Window | null;
  requestX: AutoScrollRequest | null;
  requestY: AutoScrollRequest | null;
  scrollLeft: number;
  scrollTop: number;
  constructor();
  reset(): void;
  addRequest(request: AutoScrollRequest): void;
  removeRequest(request: AutoScrollRequest): void;
  computeScrollValues(): void;
  scroll(): void;
}
declare class AutoScrollRequest {
  item: AutoScrollItem | null;
  element: Element | Window | null;
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
  constructor();
  reset(): void;
  hasReachedEnd(): boolean;
  computeCurrentScrollValue(): number;
  computeNextScrollValue(): number;
  computeSpeed(): number;
  tick(deltaTime: number): number;
  onStart(): void;
  onStop(): void;
}
declare function autoScrollSmoothSpeed(maxSpeed?: number, accelerationFactor?: number, decelerationFactor?: number): AutoScrollItemSpeedCallback;
declare class AutoScroll {
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
  protected _requestPool: ObjectPool<AutoScrollRequest>;
  protected _actionPool: ObjectPool<AutoScrollAction>;
  constructor(options?: AutoScrollOptions);
  protected _frameRead(time: number): void;
  protected _frameWrite(): void;
  protected _startTicking(): void;
  protected _stopTicking(): void;
  protected _requestItemScroll(item: AutoScrollItem, axis: AutoScrollAxis, element: Window | Element, direction: AutoScrollDirection, threshold: number, distance: number, maxValue: number): void;
  protected _cancelItemScroll(item: AutoScrollItem, axis: AutoScrollAxis): void;
  protected _checkItemOverlap(item: AutoScrollItem, checkX: boolean, checkY: boolean): void;
  protected _updateScrollRequest(scrollRequest: AutoScrollRequest): boolean;
  protected _updateItems(): void;
  protected _updateRequests(): void;
  protected _requestAction(request: AutoScrollRequest, axis: AutoScrollAxis): void;
  protected _updateActions(): void;
  protected _applyActions(): void;
  addItem(item: AutoScrollItem): void;
  removeItem(item: AutoScrollItem): void;
  isDestroyed(): boolean;
  isItemScrollingX(item: AutoScrollItem): boolean;
  isItemScrollingY(item: AutoScrollItem): boolean;
  isItemScrolling(item: AutoScrollItem): boolean;
  updateSettings(options?: AutoScrollOptions): void;
  destroy(): void;
}
//#endregion
export { AutoScrollItem as a, AutoScrollItemSpeedCallback as c, AutoScrollSettings as d, autoScrollSmoothSpeed as f, AutoScroll as i, AutoScrollItemTarget as l, AUTO_SCROLL_AXIS_DIRECTION as n, AutoScrollItemEffectCallback as o, AUTO_SCROLL_DIRECTION as r, AutoScrollItemEventCallback as s, AUTO_SCROLL_AXIS as t, AutoScrollOptions as u };
//# sourceMappingURL=auto-scroll-Bufjh6JN.d.ts.map