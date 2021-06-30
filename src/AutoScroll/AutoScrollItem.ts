import { AutoScrollDirection } from './AutoScroll';

import { AutoScrollSpeedData } from './AutoScrollRequest';

import { Rect } from '../types';

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

export function smoothSpeed(
  maxSpeed: number,
  acceleration: number,
  deceleration: number
): AutoScrollItemSpeedCallback {
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

export interface AutoScrollItem {
  readonly targets: AutoScrollItemTarget[];
  readonly clientRect: Rect;
  readonly position: { x: number; y: number };
  readonly safeZone: number;
  readonly smoothStop: boolean;
  readonly speed: number | AutoScrollItemSpeedCallback;
  readonly onStart?: AutoScrollItemEventCallback | null;
  readonly onStop?: AutoScrollItemEventCallback | null;
  readonly onPrepareAfterScrollEffect?: AutoScrollItemEffectCallback | null;
  readonly onApplyAfterScrollEffect?: AutoScrollItemEffectCallback | null;
}
