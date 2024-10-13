import { methodCancel } from './cancel.js';
import { methodDestroy } from './destroy.js';
import { methodOff } from './off.js';
import { methodOn } from './on.js';
import { methodUpdateSettings } from './update-settings.js';

export function methods() {
  describe('methods', () => {
    methodCancel();
    methodDestroy();
    methodOff();
    methodOn();
    methodUpdateSettings();
  });
}
