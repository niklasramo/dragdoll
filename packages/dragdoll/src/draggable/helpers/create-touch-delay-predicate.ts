import { PointerSensor, PointerSensorEvents } from '../../sensors/pointer-sensor.js';
import type { Sensor } from '../../sensors/sensor.js';
import { SensorEventType } from '../../sensors/sensor.js';
import { getScrollableAncestors } from '../../utils/get-scrollable-ancestors.js';
import { isScrollable } from '../../utils/is-scrollable.js';
import type { Draggable } from '../draggable.js';
import { DraggableEventType } from '../draggable.js';

function getScrollables(element: Element) {
  const scrollables: (Element | Window)[] = [];

  if (isScrollable(element)) {
    scrollables.push(element);
  }

  getScrollableAncestors(element, scrollables);

  return scrollables;
}

export function createTouchDelayPredicate<
  S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[],
>(
  options: {
    touchDelay?: number;
    fallback?: Draggable<S>['settings']['startPredicate'];
  } = {},
) {
  let dragAllowed: boolean | undefined = undefined;

  let startTimeStamp: number = 0;

  let targetElement: Element | null = null;

  let timer: number | undefined = undefined;

  const { touchDelay = 250, fallback = () => true } = options;

  const onContextMenu = (e: Event) => e.preventDefault();

  const onTouchMove = (e: TouchEvent) => {
    if (!startTimeStamp) return;

    if (dragAllowed) {
      e.cancelable && e.preventDefault();
      return;
    }

    if (dragAllowed === undefined) {
      if (e.cancelable && e.timeStamp - startTimeStamp > touchDelay) {
        dragAllowed = true;
        e.preventDefault();
      } else {
        dragAllowed = false;
      }
    }
  };

  const pointerSensorStartPredicate: Draggable<S>['settings']['startPredicate'] = (data) => {
    if (!(data.sensor instanceof PointerSensor)) {
      return fallback(data);
    }

    const { draggable, sensor, event } = data;
    const e = event as PointerSensorEvents['start'] | PointerSensorEvents['move'];

    if (e.pointerType === 'touch') {
      // On first event (touchstart/pointerdown) we need to store the drag start
      // data and bind listeners for touchmove and contextmenu.
      if (
        e.type === SensorEventType.Start &&
        (e.srcEvent.type === 'pointerdown' || e.srcEvent.type === 'touchstart')
      ) {
        // Prevent potentially scrollable nodes from scrolling to make sure
        // native scrolling does not interfere with dragging.
        targetElement = e.target as Element | null;
        const scrollables = targetElement ? getScrollables(targetElement) : [];
        scrollables.forEach((scrollable) => {
          scrollable.addEventListener('touchmove', onTouchMove as EventListener, {
            passive: false,
            capture: true,
          });
        });

        const dragEndListener = () => {
          if (!startTimeStamp) return;

          // Unbind listeners.
          draggable.off(DraggableEventType.End, dragEndListener);
          draggable.sensors.forEach((sensor) => {
            if (sensor instanceof PointerSensor) {
              sensor.off(SensorEventType.End, dragEndListener);
            }
          });
          targetElement?.removeEventListener('contextmenu', onContextMenu);
          scrollables.forEach((scrollable) => {
            scrollable.removeEventListener('touchmove', onTouchMove as EventListener, {
              capture: true,
            });
          });

          // Reset state.
          startTimeStamp = 0;
          dragAllowed = undefined;
          targetElement = null;
          timer = void window.clearTimeout(timer);
        };

        // Set start state.
        dragAllowed = undefined;
        startTimeStamp = e.srcEvent.timeStamp;

        // Prevent context menu popping up.
        targetElement?.addEventListener('contextmenu', onContextMenu);

        // Reset data on drag end. We want to listen to all sensors as we don't
        // know yet which one will start the drag.
        draggable.on(DraggableEventType.End, dragEndListener);
        draggable.sensors.forEach((sensor) => {
          if (sensor instanceof PointerSensor) {
            sensor.on(SensorEventType.End, dragEndListener);
          }
        });

        // If we have touchDelay defined, let's set a timer that force starts
        // the drag process after the timeout.
        // TODO: This will start drag sometimes when it's not actually possible
        // to prevent the native scrolling on touch devices. We'd need a way
        // to check if the first touchstart/touchmove is cancelable. Needs
        // testing on real devices. The funky thing is that we seem to need to
        // get one touchmove event to check if we can prevent native scrolling
        // but that is kind of too late already.. let's see if we can detect
        // that earlier somehow.
        if (touchDelay > 0) {
          timer = window.setTimeout(() => {
            draggable.resolveStartPredicate(sensor);
            dragAllowed = true;
            timer = undefined;
          }, touchDelay);
        }
      }

      return dragAllowed;
    }

    // On mouse/pen let's allow starting drag immediately if mouse's left button
    // is pressed down.
    if (e.type === SensorEventType.Start && !(e.srcEvent as MouseEvent | PointerEvent).button) {
      return true;
    } else {
      return false;
    }
  };

  return pointerSensorStartPredicate;
}
