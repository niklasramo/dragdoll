import type { DraggableModifier, DraggableModifierData } from '../../draggable/draggable.js';
import { PointerSensor } from '../../sensors/pointer-sensor.js';
import type { Sensor } from '../../sensors/sensor.js';
import type { Rect } from '../../types.js';
import { createFullRect } from '../../utils/create-full-rect.js';

const TEMP_RECT_1 = createFullRect();

const TEMP_RECT_2 = createFullRect();

const ADJUSTMENT_DATA = { change: 0, drift: 0 };

function adjustAxisChange(
  itemStartX: number,
  itemEndX: number,
  containerStartX: number,
  containerEndX: number,
  drift: number,
  change: number,
  trackDrift: boolean,
) {
  let nextChange = change;
  let nextDrift = drift;

  if (change > 0) {
    nextChange = Math.min(Math.max(containerEndX - itemEndX, 0), change);
    if (trackDrift) {
      if (drift < 0) {
        const driftChange = Math.min(-drift, change);
        nextDrift = drift + driftChange;
        nextChange = Math.max(0, nextChange - driftChange);
      } else {
        nextDrift = drift + (change - nextChange);
      }
    }
  } else if (change < 0) {
    nextChange = Math.max(Math.min(containerStartX - itemStartX, 0), change);
    if (trackDrift) {
      if (drift > 0) {
        const driftChange = Math.max(-drift, change);
        nextDrift = drift + driftChange;
        nextChange = Math.min(0, nextChange - driftChange);
      } else {
        nextDrift = drift + (change - nextChange);
      }
    }
  }

  ADJUSTMENT_DATA.change = nextChange;
  ADJUSTMENT_DATA.drift = nextDrift;
}

function getAxisSnapChange(cellSize: number, snapPos: number, sensorPos: number) {
  const change = sensorPos - snapPos;
  const changeAbs = Math.abs(change);
  if (changeAbs >= cellSize) {
    const overflow = changeAbs % cellSize;
    const snapped = change > 0 ? change - overflow : change + overflow;
    return Math.round(snapped / cellSize) * cellSize;
  }
  return 0;
}

export type ContainmentModifierOptions<S extends Sensor> = {
  trackSensorDrift?: boolean | ((data: DraggableModifierData<S>) => boolean);
  snapX?: number;
  snapY?: number;
};

export function createContainmentModifier<S extends Sensor>(
  getContainerRect: (data: DraggableModifierData<S>) => Rect,
  options?: ContainmentModifierOptions<S>,
) {
  const trackSensorDrift: ContainmentModifierOptions<S>['trackSensorDrift'] =
    options?.trackSensorDrift ?? (({ drag }) => drag.sensor instanceof PointerSensor);
  const snapX = options?.snapX || 0;
  const snapY = options?.snapY || 0;

  return function containmentModifier(change, data) {
    const containerRect = createFullRect(getContainerRect(data), TEMP_RECT_1);
    const itemRect = createFullRect(data.item.clientRect, TEMP_RECT_2);
    const itemData = data.item.data;
    const state = itemData.__containment__ || {
      drift: { x: 0, y: 0 },
      trackDrift: false,
      snapX: 0,
      snapY: 0,
      sensorX: 0,
      sensorY: 0,
      startLeft: 0,
      startTop: 0,
      startRight: 0,
      startBottom: 0,
    };

    if (!itemData.__containment__) {
      state.trackDrift =
        typeof trackSensorDrift === 'function' ? trackSensorDrift(data) : trackSensorDrift;
      itemData.__containment__ = state;
    }

    // Start phase: apply regular containment to start offset and capture
    // start rect for grid-aligned bounds calculation.
    if (data.phase === 'start') {
      if (change.x) {
        adjustAxisChange(
          itemRect.left,
          itemRect.right,
          containerRect.left,
          containerRect.right,
          0,
          change.x,
          false,
        );
        change.x = ADJUSTMENT_DATA.change;
      }
      if (change.y) {
        adjustAxisChange(
          itemRect.top,
          itemRect.bottom,
          containerRect.top,
          containerRect.bottom,
          0,
          change.y,
          false,
        );
        change.y = ADJUSTMENT_DATA.change;
      }
      if (snapX || snapY) {
        state.startLeft = itemRect.left + change.x;
        state.startTop = itemRect.top + change.y;
        state.startRight = itemRect.right + change.x;
        state.startBottom = itemRect.bottom + change.y;
      }
      return change;
    }

    // Move/end phase: handle X axis.
    if (snapX) {
      state.sensorX += change.x;
      const snapChangeX = getAxisSnapChange(snapX, state.snapX, state.sensorX);
      let idealSnapX = state.snapX + snapChangeX;
      const minSnapX = Math.ceil((containerRect.left - state.startLeft) / snapX) * snapX;
      const maxSnapX = Math.floor((containerRect.right - state.startRight) / snapX) * snapX;
      idealSnapX = Math.min(Math.max(idealSnapX, minSnapX), maxSnapX);
      change.x = idealSnapX - state.snapX;
      state.snapX = idealSnapX;
    } else if (change.x) {
      adjustAxisChange(
        itemRect.left,
        itemRect.right,
        containerRect.left,
        containerRect.right,
        state.drift.x,
        change.x,
        state.trackDrift,
      );
      state.drift.x = ADJUSTMENT_DATA.drift;
      change.x = ADJUSTMENT_DATA.change;
    }

    // Move/end phase: handle Y axis.
    if (snapY) {
      state.sensorY += change.y;
      const snapChangeY = getAxisSnapChange(snapY, state.snapY, state.sensorY);
      let idealSnapY = state.snapY + snapChangeY;
      const minSnapY = Math.ceil((containerRect.top - state.startTop) / snapY) * snapY;
      const maxSnapY = Math.floor((containerRect.bottom - state.startBottom) / snapY) * snapY;
      idealSnapY = Math.min(Math.max(idealSnapY, minSnapY), maxSnapY);
      change.y = idealSnapY - state.snapY;
      state.snapY = idealSnapY;
    } else if (change.y) {
      adjustAxisChange(
        itemRect.top,
        itemRect.bottom,
        containerRect.top,
        containerRect.bottom,
        state.drift.y,
        change.y,
        state.trackDrift,
      );
      state.drift.y = ADJUSTMENT_DATA.drift;
      change.y = ADJUSTMENT_DATA.change;
    }

    return change;
  } as DraggableModifier<S>;
}
