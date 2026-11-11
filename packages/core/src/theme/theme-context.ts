import { createContext, useContext } from 'react';
import type { ThemeContextValue } from './theme-types';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Returns the nearest ThemeProvider state and setters.
 * Throws if called outside a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return ctx;
}
