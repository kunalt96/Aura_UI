import { useCallback, useSyncExternalStore } from 'react';

/**
 * SSR-safe hook that subscribes to a CSS media query via `useSyncExternalStore`.
 */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => undefined;
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => {
        mql.removeEventListener('change', onStoreChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return defaultMatches;
    }
    return window.matchMedia(query).matches;
  }, [query, defaultMatches]);

  const getServerSnapshot = useCallback(() => defaultMatches, [defaultMatches]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
