export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const HAS_PASSIVE_EVENTS = (() => {
  let isPassiveEventsSupported = false;
  try {
    const passiveOpts = Object.defineProperty({}, 'passive', {
      get: function () {
        isPassiveEventsSupported = true;
      },
    });
    // @ts-ignore
    window.addEventListener('testPassive', null, passiveOpts);
    // @ts-ignore
    window.removeEventListener('testPassive', null, passiveOpts);
  } catch (e) {}
  return isPassiveEventsSupported;
})();

export const HAS_TOUCH_EVENTS = IS_BROWSER && 'ontouchstart' in window;

export const HAS_POINTER_EVENTS = IS_BROWSER && !!window.PointerEvent;

export const IS_SAFARI = !!(
  IS_BROWSER &&
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1
);
