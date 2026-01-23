import applyPosition from './apply-position.js';
import callbacks from './callbacks.js';
import container from './container.js';
import elements from './elements.js';
import frozenStyles from './frozen-styles.js';
import positionModifiers from './position-modifiers.js';
import preventTextSelection from './prevent-text-selection.js';
import sensorProcessingMode from './sensor-processing-mode.js';
import startPredicate from './start-predicate.js';

export default () => {
  describe('options', () => {
    applyPosition();
    callbacks();
    container();
    elements();
    frozenStyles();
    positionModifiers();
    preventTextSelection();
    sensorProcessingMode();
    startPredicate();
  });
};
