import { useContext } from 'react';
import { ThemeContext } from '../theme/theme-context';
import { useMediaQuery } from './useMediaQuery';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Returns `true` when the OS prefers reduced motion or when the nearest
 * ThemeProvider sets `motion="reduced"`.
 */
export function useReducedMotion(): boolean {
  const osReduced = useMediaQuery(REDUCED_MOTION_QUERY, false);
  const theme = useContext(ThemeContext);
  return osReduced || theme?.motion === 'reduced';
}
