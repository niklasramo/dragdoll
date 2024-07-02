export class ObjectCache<Key extends any, Value extends any> {
  private cache: Map<Key, Value> = new Map();
  private validation: Map<Key, undefined> = new Map();

  constructor() {
    this.cache = new Map();
    this.validation = new Map();
  }

  set(key: Key, value: Value) {
    this.cache.set(key, value);
    this.validation.set(key, undefined);
  }

  get(key: Key): Value | undefined {
    return this.cache.get(key);
  }

  has(key: Key): boolean {
    return this.cache.has(key);
  }

  delete(key: Key) {
    this.cache.delete(key);
    this.validation.delete(key);
  }

  isValid(key: Key): boolean {
    return this.validation.has(key);
  }

  invalidate(key?: Key) {
    if (key === undefined) {
      this.validation.clear();
    } else {
      this.validation.delete(key);
    }
  }

  clear() {
    this.cache.clear();
    this.validation.clear();
  }
}
