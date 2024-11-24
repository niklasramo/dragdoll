import { eventCancel } from './cancel.js';
import { eventDestroy } from './destroy.js';
import { eventEnd } from './end.js';
import { eventMove } from './move.js';
import { eventStart } from './start.js';

export function events() {
  describe('events', () => {
    eventCancel();
    eventDestroy();
    eventEnd();
    eventMove();
    eventStart();
  });
}
