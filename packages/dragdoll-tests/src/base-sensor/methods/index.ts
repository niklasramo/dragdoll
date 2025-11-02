import _cancel from './_cancel.js';
import _end from './_end.js';
import _move from './_move.js';
import _start from './_start.js';
import cancel from './cancel.js';
import destroy from './destroy.js';
import off from './off.js';
import on from './on.js';

export default () => {
  describe('methods', () => {
    _cancel();
    _end();
    _move();
    _start();
    cancel();
    destroy();
    off();
    on();
  });
};
