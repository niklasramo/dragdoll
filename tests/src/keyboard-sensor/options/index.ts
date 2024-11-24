import { optionCancelOnBlur } from './cancel-on-blur.js';
import { optionCancelPredicate } from './cancel-predicate.js';
import { optionEndPredicate } from './end-predicate.js';
import { optionMoveDistance } from './move-distance.js';
import { optionMovePredicate } from './move-predicate.js';
import { optionStartPredicate } from './start-predicate.js';

export function options() {
  describe('options', () => {
    optionCancelOnBlur();
    optionCancelPredicate();
    optionEndPredicate();
    optionMoveDistance();
    optionMovePredicate();
    optionStartPredicate();
  });
}
