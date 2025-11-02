import sourceEvents from './source-events.js';
import startPredicate from './start-predicate.js';

export default () => {
  describe('options', () => {
    sourceEvents();
    startPredicate();
  });
};
