import cancel from './cancel.js';
import destroy from './destroy.js';
import off from './off.js';
import on from './on.js';
import updateSettings from './update-settings.js';

export default () => {
  describe('methods', () => {
    cancel();
    destroy();
    off();
    on();
    updateSettings();
  });
};
