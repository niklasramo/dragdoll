export class Pool<T> {
  protected _pool: T[];
  protected _createObject: () => T;
  protected _onRelease: ((object: T) => void) | undefined;

  constructor(createObject: () => T, onRelease?: (object: T) => void) {
    this._pool = [];
    this._createObject = createObject;
    this._onRelease = onRelease;
  }

  pick() {
    return this._pool.pop() || this._createObject();
  }

  drop(object: T) {
    if (this._pool.indexOf(object) !== -1) return;
    this._onRelease && this._onRelease(object);
    this._pool.push(object);
  }

  reset() {
    this._pool.length = 0;
  }
}
