import align from './align.js';
import destroy from './destroy.js';
import off from './off.js';
import on from './on.js';
import stop from './stop.js';
import updateSettings from './update-settings.js';
import use from './use.js';

export default () => {
  describe('methods', () => {
    align();
    destroy();
    off();
    on();
    stop();
    updateSettings();
    use();
  });
};
