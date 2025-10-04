export class ObjectCache<Key extends any, Value extends any> {
  protected _cache: Map<Key, Value>;
  protected _validation: Map<Key, undefined>;

  constructor() {
    this._cache = new Map();
    this._validation = new Map();
  }

  set(key: Key, value: Value) {
    this._cache.set(key, value);
    this._validation.set(key, undefined);
  }

  get(key: Key): Value | undefined {
    return this._cache.get(key);
  }

  has(key: Key): boolean {
    return this._cache.has(key);
  }

  delete(key: Key) {
    this._cache.delete(key);
    this._validation.delete(key);
  }

  isValid(key: Key): boolean {
    return this._validation.has(key);
  }

  invalidate(key?: Key) {
    if (key === undefined) {
      this._validation.clear();
    } else {
      this._validation.delete(key);
    }
  }

  clear() {
    this._cache.clear();
    this._validation.clear();
  }
}
