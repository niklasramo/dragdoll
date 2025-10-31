import type { CollisionData, DndContextEventCallbacks, SensorEventListenerId } from 'dragdoll';
import { DndContext, DndContextEventType } from 'dragdoll';
import { createContext, useEffect, useRef, useState } from 'react';
import type { DndContextProviderProps } from '../types.js';
import type { UseDndContextValue } from '../types.js';

const DndContextContext = createContext<UseDndContextValue<any> | null>(null);

export function DndContextProvider<T extends CollisionData = CollisionData>({
  children,
  options,
  onStart,
  onMove,
  onEnter,
  onLeave,
  onCollide,
  onEnd,
}: DndContextProviderProps<T>) {
  const contextRef = useRef<DndContext<T> | null>(null);
  const [contextValue, setContextValue] = useState<UseDndContextValue<any> | null>(null);

  useEffect(() => {
    const context = new DndContext<T>(options);
    contextRef.current = context;
    setContextValue({ context: context as any });

    return () => {
      if (contextRef.current) {
        contextRef.current.destroy();
        contextRef.current = null;
      }
    };
  }, [options]);

  useEffect(() => {
    if (!contextRef.current) return;

    const listeners: Array<{ type: DndContextEventType; id: SensorEventListenerId }> = [];

    if (onStart) {
      const id = contextRef.current.on(
        DndContextEventType.Start,
        onStart as DndContextEventCallbacks<T>['start'],
      );
      listeners.push({ type: DndContextEventType.Start, id });
    }

    if (onMove) {
      const id = contextRef.current.on(
        DndContextEventType.Move,
        onMove as DndContextEventCallbacks<T>['move'],
      );
      listeners.push({ type: DndContextEventType.Move, id });
    }

    if (onEnter) {
      const id = contextRef.current.on(
        DndContextEventType.Enter,
        onEnter as DndContextEventCallbacks<T>['enter'],
      );
      listeners.push({ type: DndContextEventType.Enter, id });
    }

    if (onLeave) {
      const id = contextRef.current.on(
        DndContextEventType.Leave,
        onLeave as DndContextEventCallbacks<T>['leave'],
      );
      listeners.push({ type: DndContextEventType.Leave, id });
    }

    if (onCollide) {
      const id = contextRef.current.on(
        DndContextEventType.Collide,
        onCollide as DndContextEventCallbacks<T>['collide'],
      );
      listeners.push({ type: DndContextEventType.Collide, id });
    }

    if (onEnd) {
      const id = contextRef.current.on(
        DndContextEventType.End,
        onEnd as DndContextEventCallbacks<T>['end'],
      );
      listeners.push({ type: DndContextEventType.End, id });
    }

    return () => {
      if (contextRef.current) {
        for (const { type, id } of listeners) {
          contextRef.current.off(type, id);
        }
      }
    };
  }, [onStart, onMove, onEnter, onLeave, onCollide, onEnd]);

  if (!contextValue) {
    return null;
  }

  return <DndContextContext.Provider value={contextValue}>{children}</DndContextContext.Provider>;
}

export { DndContextContext };
