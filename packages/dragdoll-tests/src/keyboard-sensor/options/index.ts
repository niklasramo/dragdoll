import cancelOnBlur from './cancel-on-blur.js';
import cancelPredicate from './cancel-predicate.js';
import endPredicate from './end-predicate.js';
import moveDistance from './move-distance.js';
import movePredicate from './move-predicate.js';
import startPredicate from './start-predicate.js';

export default () => {
  describe('options', () => {
    cancelOnBlur();
    cancelPredicate();
    endPredicate();
    moveDistance();
    movePredicate();
    startPredicate();
  });
};
