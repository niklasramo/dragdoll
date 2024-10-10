import { optionSourceEvents } from './source-events.js';
import { optionStartPredicate } from './start-predicate.js';

export function options() {
  describe('options', () => {
    optionSourceEvents();
    optionStartPredicate();
  });
}
