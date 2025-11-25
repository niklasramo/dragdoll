import type { Accessor } from 'solid-js';

export type MaybeAccessor<T> = T | Accessor<T>;
export type MaybeAccessorValue<T> = T extends Accessor<infer V>
  ? V
  : T extends () => infer R
    ? R
    : T;

const isAccessor = <T>(value: unknown): value is Accessor<T> =>
  typeof value === 'function' && (value as Function).length === 0;

export function resolveMaybeAccessor<T>(value: MaybeAccessor<T>): T;
export function resolveMaybeAccessor<T>(value: MaybeAccessor<T> | undefined): T | undefined;
export function resolveMaybeAccessor<T>(value: MaybeAccessor<T> | undefined, fallback: T): T;
export function resolveMaybeAccessor<T>(value: MaybeAccessor<T> | undefined, fallback?: T) {
  if (value === undefined) return fallback;
  return isAccessor<T>(value) ? value() : value;
}

export function resolveMaybeAccessorArray<A extends MaybeAccessor<any>>(
  list: readonly A[],
): MaybeAccessorValue<A>[] {
  return list.map(item => resolveMaybeAccessor(item)) as MaybeAccessorValue<A>[];
}

