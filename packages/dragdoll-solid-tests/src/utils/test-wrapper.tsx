import type { DndObserver } from 'dragdoll/dnd-observer';
import { DndObserverContext } from 'dragdoll-solid';
import type { JSX } from 'solid-js';

export function DndProvider(props: { observer: DndObserver<any>; children: JSX.Element }) {
  return (
    <DndObserverContext.Provider value={() => props.observer}>
      {props.children}
    </DndObserverContext.Provider>
  );
}
