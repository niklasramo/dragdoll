import { methodAlign } from './align.js';
import { methodDestroy } from './destroy.js';
import { methodOff } from './off.js';
import { methodOn } from './on.js';
import { methodStop } from './stop.js';
import { methodUpdateSettings } from './update-settings.js';
import { methodUse } from './use.js';

export function methods() {
  describe('methods', () => {
    methodAlign();
    methodDestroy();
    methodOff();
    methodOn();
    methodStop();
    methodUpdateSettings();
    methodUse();
  });
}
