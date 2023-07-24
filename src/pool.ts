export class Pool<T> {
  protected _data: T[];
  protected _createObject: () => T;
  protected _onPut: ((object: T) => void) | undefined;

  constructor(createObject: () => T, onPut?: (object: T) => void) {
    this._data = [];
    this._createObject = createObject;
    this._onPut = onPut;
  }

  pick() {
    return this._data.length ? (this._data.pop() as T) : this._createObject();
  }

  put(object: T) {
    if (this._data.indexOf(object) === -1) {
      this._onPut && this._onPut(object);
      this._data.push(object);
    }
  }

  reset() {
    this._data.length = 0;
  }
}
