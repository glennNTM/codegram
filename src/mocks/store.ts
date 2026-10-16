import { useSyncExternalStore } from "react";

// Tiny in-memory store for mock state shared across screens (messages, activity, comments…).
// Each one is replaced by Convex queries + mutations when the backend lands.
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get: () => state,
    set(update: T | ((prev: T) => T)) {
      state = typeof update === "function" ? (update as (prev: T) => T)(state) : update;
      listeners.forEach((l) => l());
    },
    use: () => useSyncExternalStore(subscribe, () => state),
  };
}
