// A bump allocation arena implementation.
export class ObjectArena<Item extends object, ItemArgs extends unknown[] = []> {
  protected _items: Item[];
  protected _index: number;
  protected _initItem: (item?: Item, ...args: ItemArgs) => Item;

  // The initItem function is used to initialize a new item or an existing item.
  // If the item is undefined it means that a new item needs to be created and
  // returned. If the item is not undefined it means that an existing item needs
  // to be initialized (e.g. reset the object keys to initial values) and
  // returned.
  constructor(initItem: (item?: Item, ...args: ItemArgs) => Item) {
    this._items = [];
    this._index = 0;
    this._initItem = initItem;
  }

  allocate(...args: ItemArgs): Item {
    const index = this._index;
    const items = this._items;
    const nextItem = this._initItem(items[index], ...args);
    items[index] = nextItem;
    ++this._index;
    return nextItem;
  }

  reset(): void {
    this._index = 0;
  }

  truncate(maxLength = 0): void {
    const newItemCount = Math.max(0, Math.min(maxLength, this._items.length));
    this._index = Math.min(this._index, newItemCount);
    this._items.length = newItemCount;
  }
}
