import { methodProtectedCancel } from './_cancel.js';
import { methodProtectedEnd } from './_end.js';
import { methodProtectedMove } from './_move.js';
import { methodProtectedStart } from './_start.js';
import { methodCancel } from './cancel.js';
import { methodDestroy } from './destroy.js';
import { methodOff } from './off.js';
import { methodOn } from './on.js';

export function methods() {
  describe('methods', () => {
    methodProtectedCancel();
    methodProtectedEnd();
    methodProtectedMove();
    methodProtectedStart();
    methodCancel();
    methodDestroy();
    methodOff();
    methodOn();
  });
}
