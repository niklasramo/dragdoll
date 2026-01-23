import cancelOnEscape from './cancel-on-escape.js';
import preventContextMenu from './prevent-context-menu.js';
import preventNativeDrag from './prevent-native-drag.js';
import sourceEvents from './source-events.js';
import startPredicate from './start-predicate.js';

export default () => {
  describe('options', () => {
    cancelOnEscape();
    preventContextMenu();
    preventNativeDrag();
    sourceEvents();
    startPredicate();
  });
};
