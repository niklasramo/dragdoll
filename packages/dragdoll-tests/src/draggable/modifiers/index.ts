import containmentModifier from './containment-modifier.js';
import snapModifier from './snap-modifier.js';
import startOffsetModifier from './start-offset-modifier.js';

export default () => {
  describe('modifiers', () => {
    startOffsetModifier();
    snapModifier();
    containmentModifier();
  });
};
