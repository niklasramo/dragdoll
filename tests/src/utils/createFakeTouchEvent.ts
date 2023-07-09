import {
  FakeTouch,
  FakeTouchOptions,
  FakeTouchEvent,
  FakeTouchEventType,
  FakeTouchEventOptions,
} from './FakeTouch';

export function createFakeTouchEvent(
  type: FakeTouchEventType,
  options: FakeTouchOptions &
    Omit<FakeTouchEventOptions, 'touches' | 'targetTouches' | 'changedTouches'> = {},
) {
  const {
    identifier,
    target,
    clientX,
    clientY,
    screenX,
    screenY,
    radiusX,
    radiusY,
    rotationAngle,
    force,
    ...eventOptions
  } = options;

  const touch = new FakeTouch({
    identifier,
    target,
    clientX,
    clientY,
    screenX,
    screenY,
    radiusX,
    radiusY,
    rotationAngle,
    force,
  });

  const touchEvent = new FakeTouchEvent(type, {
    ...eventOptions,
    touches: [touch],
    changedTouches: [touch],
    targetTouches: [touch],
  });

  return touchEvent;
}
