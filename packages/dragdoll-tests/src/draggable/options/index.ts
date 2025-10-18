import { optionApplyPosition } from './apply-position.js';
import { optionCallbacks } from './callbacks.js';
import { optionContainer } from './container.js';
import { optionElements } from './elements.js';
import { optionFrozenStyles } from './frozen-styles.js';
import { optionPositionModifiers } from './position-modifiers.js';
import { optionSensorProcessingMode } from './sensor-processing-mode.js';
import { optionStartPredicate } from './start-predicate.js';

export function options() {
  describe('options', () => {
    optionApplyPosition();
    optionCallbacks();
    optionContainer();
    optionElements();
    optionFrozenStyles();
    optionPositionModifiers();
    optionStartPredicate();
    optionSensorProcessingMode();
  });
}
