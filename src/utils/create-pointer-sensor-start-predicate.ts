import { Sensor } from '../sensors/sensor.js';

import { Draggable } from '../draggable/draggable.js';

import { PointerSensor, PointerSensorEvents } from '../sensors/pointer-sensor.js';

import { getScrollableAncestors } from './get-scrollable-ancestors.js';

import { isScrollable } from './is-scrollable.js';

function getScrollables(element: Element) {
  const scrollables: (Element | Window)[] = [];

  if (isScrollable(element)) {
    scrollables.push(element);
  }

  getScrollableAncestors(element, scrollables);

  return scrollables;
}

export function createPointerSensorStartPredicate<
  S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[],
  D extends Draggable<S> = Draggable<S>,
>(
  options: {
    timeout?: number;
    fallback?: D['settings']['startPredicate'];
  } = {},
) {
  let dragAllowed: boolean | undefined = undefined;

  let startTimeStamp: number = 0;

  let targetElement: Element | null = null;

  let timer: number | undefined = undefined;

  const { timeout = 250, fallback = () => true } = options;

  const onContextMenu = (e: Event) => e.preventDefault();

  const onTouchMove = (e: TouchEvent) => {
    if (!startTimeStamp) return;

    if (dragAllowed) {
      e.cancelable && e.preventDefault();
      return;
    }

    if (dragAllowed === undefined) {
      if (e.cancelable && e.timeStamp - startTimeStamp > timeout) {
        dragAllowed = true;
        e.preventDefault();
      } else {
        dragAllowed = false;
      }
    }
  };

  const pointerSensorStartPredicate: D['settings']['startPredicate'] = (data) => {
    if (!(data.sensor instanceof PointerSensor)) {
      return fallback(data);
    }

    const { draggable, sensor, event } = data;
    const e = event as PointerSensorEvents['start'] | PointerSensorEvents['move'];

    if (e.pointerType === 'touch') {
      // On first event (touchstart/pointerdown) we need to store the drag start
      // data and bind listeners for touchmove and contextmenu.
      if (
        e.type === 'start' &&
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
          draggable.off('beforeend', dragEndListener);
          draggable.sensors.forEach((sensor) => {
            if (sensor instanceof PointerSensor) {
              sensor.off('end', dragEndListener);
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

        // Reset data on drag end.
        draggable.on('beforeend', dragEndListener);
        draggable.sensors.forEach((sensor) => {
          if (sensor instanceof PointerSensor) {
            sensor.off('end', dragEndListener);
          }
        });

        // If we have timeout defined, let's set a timer that force starts
        // the drag process after the timeout.
        // TODO: This will start drag sometimes when it's not actually possible
        // to prevent the native scrolling on touch devices. We'd need a way
        // to check if the first touchstart/touchmove is cancelable. Needs
        // testing on real devices. The funky thing is that we seem to need to
        // get one touchmove event to check if we can prevent native scrolling
        // but that is kind of too late already.. let's see if we can detect
        // that earlier somehow.
        if (timeout > 0) {
          timer = window.setTimeout(() => {
            draggable.resolveStartPredicate(sensor);
            dragAllowed = true;
            timer = undefined;
          }, timeout);
        }
      }

      return dragAllowed;
    }

    // On mouse/pen let's allow starting drag immediately if mouse's left button
    // is pressed down.
    if (e.type === 'start' && !(e.srcEvent as MouseEvent | PointerEvent).button) {
      return true;
    } else {
      return false;
    }
  };

  return pointerSensorStartPredicate;
}
