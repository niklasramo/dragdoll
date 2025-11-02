import cancel from './cancel.js';
import destroy from './destroy.js';
import end from './end.js';
import move from './move.js';
import start from './start.js';

export default () => {
  describe('events', () => {
    cancel();
    destroy();
    end();
    move();
    start();
  });
};
