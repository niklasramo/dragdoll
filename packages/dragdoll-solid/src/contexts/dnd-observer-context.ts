import type { DndObserver } from 'dragdoll/dnd-observer';
import type { Accessor } from 'solid-js';
import { createContext } from 'solid-js';

// `<any>` is deliberate: consumers call `useDndObserverContext<T>()` with
// their own `CollisionData` subtype, and the single cast at that call
// site needs `any` here to bridge arbitrary `T`s without `as unknown as`.
const defaultObserverAccessor: Accessor<DndObserver<any> | null> = () => null;

export const DndObserverContext =
  createContext<Accessor<DndObserver<any> | null>>(defaultObserverAccessor);
