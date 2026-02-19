import type { DndObserver } from 'dragdoll/dnd-observer';
import { DndObserverContext } from 'dragdoll-react';
import type { ReactNode } from 'react';

export function DndProvider({
  observer,
  children,
}: {
  observer: DndObserver<any>;
  children: ReactNode;
}) {
  return <DndObserverContext.Provider value={observer}>{children}</DndObserverContext.Provider>;
}
