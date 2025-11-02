export class ObjectPool<Item extends NonNullable<any>, ItemArgs extends any[] = []> {
  protected _batchSize: number;
  protected _maxSize: number;
  protected _minSize: number;
  protected _shrinkThreshold: number;
  protected _data: Item[];
  protected _index: number;
  protected _getItem: (item?: Item, ...args: ItemArgs) => Item;
  protected _onRelease: ((item: Item) => void) | undefined;

  constructor(
    getItem: (item?: Item, ...args: ItemArgs) => Item,
    {
      batchSize = 100,
      minBatchCount = 0,
      maxBatchCount = Number.MAX_SAFE_INTEGER,
      initialBatchCount = 0,
      shrinkThreshold = 2,
      onRelease,
    }: {
      batchSize?: number;
      minBatchCount?: number;
      maxBatchCount?: number;
      initialBatchCount?: number;
      shrinkThreshold?: number;
      onRelease?: (object: Item) => void;
    } = {},
  ) {
    this._batchSize = Math.floor(Math.max(batchSize, 1));
    this._minSize = Math.floor(Math.max(minBatchCount, 0)) * this._batchSize;
    this._maxSize = Math.floor(
      Math.min(Math.max(maxBatchCount * this._batchSize, this._batchSize), Number.MAX_SAFE_INTEGER),
    );
    this._shrinkThreshold = Math.floor(Math.max(shrinkThreshold, 1) * this._batchSize);
    this._data = new Array(
      Math.floor(Math.max(Math.max(initialBatchCount, minBatchCount) * this._batchSize, 0)),
    );
    this._index = 0;
    this._getItem = getItem;
    this._onRelease = onRelease;
  }

  get(...args: ItemArgs): Item {
    // Return existing object from the pool, if available.
    if (this._index > 0) {
      return this._getItem(this._data[--this._index], ...args);
    }

    // Check if we need to grow the array because we're out of objects. Grow by
    // batchSize (capped at maxSize).
    if (this._index === 0) {
      const currentCapacity = this._data.length;
      const growBy = Math.min(this._batchSize, this._maxSize - currentCapacity);
      if (growBy > 0) {
        this._data.length = currentCapacity + growBy;
      }
    }

    // Create a new object when pool is empty.
    return this._getItem(undefined, ...args);
  }

  release(object: Item): void {
    // Only add to pool if below max size.
    if (this._index < this._maxSize) {
      if (this._onRelease) {
        this._onRelease(object);
      }

      // Store at current index, then increment.
      this._data[this._index++] = object;

      // Check if we should shrink after adding object.
      if (this._index >= this._shrinkThreshold) {
        // Only shrink if it wouldn't bring us below the minimum capacity
        const newCapacity = this._data.length - this._batchSize;
        if (newCapacity >= this._minSize) {
          this._data.length = newCapacity;
          this._index -= this._batchSize;
        }
      }
    }
  }

  destroy(): void {
    this._data.length = 0;
    this._index = 0;
  }
}
