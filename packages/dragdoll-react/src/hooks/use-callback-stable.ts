import { useMemoStable } from './use-memo-stable.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useCallbackStable<T extends Function>(callback: T, deps: readonly unknown[]): T {
  return useMemoStable(() => callback, deps);
}
