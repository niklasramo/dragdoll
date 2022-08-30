import { Sensor } from '../Sensors/Sensor';

import { Draggable } from '../Draggable/Draggable';

import { PointerSensor, PointerSensorEvents } from '../Sensors/PointerSensor';

import { getScrollableAncestors } from './getScrollableAncestors';

import { isScrollable } from './isScrollable';

function getScrollables(element: HTMLElement) {
  const scrollables: (HTMLElement | Window)[] = [];

  if (isScrollable(element)) {
    scrollables.push(element);
  }

  getScrollableAncestors(element, scrollables);

  return scrollables;
}

export function createPointerSensorStartPredicate<
  S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[],
  D extends Draggable<S> = Draggable<S>
>(
  options: {
    timeout?: number;
    fallback?: D['settings']['startPredicate'];
  } = {}
) {
  let dragAllowed: boolean | undefined = undefined;

  let startTimeStamp: number = 0;

  let targetElement: HTMLElement | null = null;

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

  const pointerSensorStartPredicate: D['settings']['startPredicate'] = (e, sensor, draggable) => {
    if (!(sensor instanceof PointerSensor)) {
      return fallback(e, sensor, draggable);
    }

    const _e = e as PointerSensorEvents['start'] | PointerSensorEvents['move'];
    if (_e.pointerType === 'touch') {
      // On first event (touchstart/pointerdown) we need to store the drag start
      // data and bind listeners for touchmove and contextmenu.
      if (
        _e.type === 'start' &&
        (_e.srcEvent.type === 'pointerdown' || _e.srcEvent.type === 'touchstart')
      ) {
        // Prevent potentially scrollable nodes from scrolling to make sure
        // native scrolling does not interfere with dragging.
        targetElement = _e.target as HTMLElement | null;
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
        startTimeStamp = _e.srcEvent.timeStamp;

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
    if (_e.type === 'start' && !(_e.srcEvent as MouseEvent | PointerEvent).button) {
      return true;
    } else {
      return false;
    }
  };

  return pointerSensorStartPredicate;
}
