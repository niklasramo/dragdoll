import { base } from './base.js';
import { events } from './events.js';
import { optionApplyPosition } from './option-apply-position.js';
import { optionCallbacks } from './option-callbacks.js';
import { optionContainer } from './option-container.js';
import { optionElements } from './option-elements.js';
import { optionFrozenStyles } from './option-frozen-styles.js';
import { optionPositionModifiers } from './option-position-modifiers.js';
import { optionStartPredicate } from './option-start-predicate.js';

describe('Draggable', () => {
  base();
  events();
  optionApplyPosition();
  optionCallbacks();
  optionContainer();
  optionElements();
  optionFrozenStyles();
  optionPositionModifiers();
  optionStartPredicate();
});
