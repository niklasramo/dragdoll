export type FakeTouchOptions = {
  identifier?: number;
  target?: EventTarget;
  clientX?: number;
  clientY?: number;
  screenX?: number;
  screenY?: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
  force?: number;
};

export class FakeTouch {
  readonly identifier: number;
  readonly target: EventTarget;
  readonly clientX: number;
  readonly clientY: number;
  readonly screenX: number;
  readonly screenY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly radiusX: number;
  readonly radiusY: number;
  readonly rotationAngle: number;
  readonly force: number;
  constructor(options: FakeTouchOptions = {}) {
    const {
      identifier = 0,
      target = null,
      clientX = 0,
      clientY = 0,
      screenX = 0,
      screenY = 0,
      radiusX = 0,
      radiusY = 0,
      rotationAngle = 0,
      force = 0,
    } = options;

    const mouseEvent = new MouseEvent('mousedown', { clientX, clientY, screenX, screenY });

    this.identifier = identifier;
    this.target =
      target ||
      document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY) ||
      document.documentElement;
    this.clientX = mouseEvent.clientX;
    this.clientY = mouseEvent.clientY;
    this.screenX = mouseEvent.screenX;
    this.screenY = mouseEvent.screenY;
    this.pageX = mouseEvent.pageX;
    this.pageY = mouseEvent.pageY;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.rotationAngle = rotationAngle;
    this.force = force;
  }
}

export type FakeTouchList = FakeTouch[];

export type FakeTouchEventType = 'touchstart' | 'touchmove' | 'touchcancel' | 'touchend';

export type FakeTouchEventOptions = {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  touches?: FakeTouch[];
  targetTouches?: FakeTouch[];
  changedTouches?: FakeTouch[];
} & UIEventInit;

export class FakeTouchEvent extends UIEvent {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  touches: FakeTouchList;
  targetTouches: FakeTouchList;
  changedTouches: FakeTouchList;
  constructor(type: FakeTouchEventType, options: FakeTouchEventOptions = {}) {
    const {
      altKey = false,
      ctrlKey = false,
      metaKey = false,
      shiftKey = false,
      touches = [],
      targetTouches = [],
      changedTouches = [],
      ...parentOptions
    } = options;

    super(type, parentOptions);

    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.metaKey = metaKey;
    this.shiftKey = shiftKey;
    this.touches = touches;
    this.targetTouches = targetTouches;
    this.changedTouches = changedTouches;
  }
}
