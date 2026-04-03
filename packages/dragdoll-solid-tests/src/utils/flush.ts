// Flush Solid.js effects that are queued inside createRoot.
// createEffect runs after the synchronous computation phase,
// so we need a tick to let them execute. We use setTimeout(0)
// rather than queueMicrotask because Solid may batch signal
// updates across microtasks.
export const flush = () => new Promise<void>((r) => setTimeout(r, 0));
