import { methodOff } from './off.js';
import { methodOn } from './on.js';
import { methodUpdateSettings } from './update-settings.js';

export function methods() {
  describe('methods', () => {
    methodOff();
    methodOn();
    methodUpdateSettings();
  });
}
