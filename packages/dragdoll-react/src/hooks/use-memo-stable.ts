import { useRef } from 'react';

function areDepsEqual(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}

export function useMemoStable<T>(factory: () => T, deps: readonly unknown[]): T {
  const entryRef = useRef<{
    deps: readonly unknown[];
    value: T;
  } | null>(null);

  const current = entryRef.current || { deps, value: factory() };
  if (!entryRef.current) {
    entryRef.current = current;
  } else if (!areDepsEqual(deps, current.deps)) {
    current.deps = deps;
    current.value = factory();
  }

  return current.value;
}
