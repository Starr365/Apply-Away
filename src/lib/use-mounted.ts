import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hydration-safe hook that returns true only after the component has mounted on the client.
 * Uses useSyncExternalStore to avoid setState in useEffect cascading render warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
