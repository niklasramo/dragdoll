import type { Sensor } from '../../sensors/sensor.js';

import type { DraggableModifier, DraggableModifierData } from '../../draggable/draggable.js';

import type { Rect } from '../../types.js';

import { PointerSensor } from '../../sensors/pointer-sensor.js';

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

export function createContainmentModifier<S extends Sensor[], E extends S[number]['_events_type']>(
  getContainerRect: (data: DraggableModifierData<S, E>) => Rect,
  trackSensorDrift: boolean | ((data: DraggableModifierData<S, E>) => boolean) = ({ drag }) => {
    return drag.sensor instanceof PointerSensor;
  },
) {
  return function containmentModifier(change, data) {
    const containerRect = createFullRect(getContainerRect(data), TEMP_RECT_1);
    const itemRect = createFullRect(data.item.clientRect, TEMP_RECT_2);
    const itemData = data.item.data;
    const containmentState = itemData.__containment__ || {
      drift: { x: 0, y: 0 },
      trackDrift: false,
    };

    // On first move, store the containment state. Item data will be kept alive
    // for the duration of the drag, but it will be removed once the drag ends.
    if (!itemData.__containment__) {
      containmentState.trackDrift =
        typeof trackSensorDrift === 'function' ? trackSensorDrift(data) : trackSensorDrift;
      itemData.__containment__ = containmentState;
    }

    const { drift, trackDrift } = containmentState;

    if (change.x) {
      adjustAxisChange(
        itemRect.left,
        itemRect.right,
        containerRect.left,
        containerRect.right,
        drift.x,
        change.x,
        trackDrift,
      );
      drift.x = ADJUSTMENT_DATA.drift;
      change.x = ADJUSTMENT_DATA.change;
    }

    if (change.y) {
      adjustAxisChange(
        itemRect.top,
        itemRect.bottom,
        containerRect.top,
        containerRect.bottom,
        drift.y,
        change.y,
        trackDrift,
      );
      drift.y = ADJUSTMENT_DATA.drift;
      change.y = ADJUSTMENT_DATA.change;
    }

    return change;
  } as DraggableModifier<S, E>;
}
