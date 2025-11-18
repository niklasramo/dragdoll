import type { DndObserver } from 'dragdoll/dnd-observer';
import { createContext } from 'react';

export const DndObserverContext = createContext<DndObserver<any> | null>(null);
