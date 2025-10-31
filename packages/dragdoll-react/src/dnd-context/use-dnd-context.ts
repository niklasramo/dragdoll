import type {
  CollisionData,
  DndContextEventCallbacks,
  DndContextEventType,
  SensorEventListenerId,
} from 'dragdoll';
import { useContext, useEffect } from 'react';
import type { UseDndContextValue } from '../types.js';
import { DndContextContext } from './dnd-context-provider.js';

export function useDndContext<T extends CollisionData = CollisionData>(): UseDndContextValue<T> {
  const context = useContext(DndContextContext);
  if (!context) {
    throw new Error('useDndContext must be used within DndContextProvider');
  }
  return context as unknown as UseDndContextValue<T>;
}

export function useDndContextEvents<T extends CollisionData = CollisionData>(
  handlers: Partial<DndContextEventCallbacks<T>>,
): void {
  const { context } = useDndContext<T>();

  useEffect(() => {
    const listenerIds: Array<{ type: DndContextEventType; id: SensorEventListenerId }> = [];

    for (const [eventType, handler] of Object.entries(handlers) as [
      keyof DndContextEventCallbacks<T>,
      DndContextEventCallbacks<T>[keyof DndContextEventCallbacks<T>],
    ][]) {
      if (handler) {
        const id = context.on(eventType as DndContextEventType, handler);
        listenerIds.push({ type: eventType as DndContextEventType, id });
      }
    }

    return () => {
      for (const { type, id } of listenerIds) {
        context.off(type, id);
      }
    };
  }, [context, handlers]);
}
