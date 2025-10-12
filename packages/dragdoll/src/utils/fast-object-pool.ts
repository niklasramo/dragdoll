export class FastObjectPool<Item extends NonNullable<any>, ItemArgs extends any[]> {
  protected _items: Item[];
  protected _index: number;
  protected _getItem: (item?: Item, ...args: ItemArgs) => Item;

  constructor(getItem: (item?: Item, ...args: ItemArgs) => Item) {
    this._items = [];
    this._index = 0;
    this._getItem = getItem;
  }

  get(...args: ItemArgs): Item {
    if (this._index >= this._items.length) {
      return (this._items[this._index++] = this._getItem(undefined, ...args));
    }
    return this._getItem(this._items[this._index++], ...args);
  }

  resetPointer(): void {
    this._index = 0;
  }

  resetItems(maxLength = 0): void {
    const newItemCount = Math.max(0, Math.min(maxLength, this._items.length));
    this._index = Math.min(this._index, newItemCount);
    this._items.length = newItemCount;
  }
}
