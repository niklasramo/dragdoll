import type { DndObserver } from 'dragdoll';
import { createContext } from 'react';

export const DndObserverContext = createContext<DndObserver<any> | null>(null);
