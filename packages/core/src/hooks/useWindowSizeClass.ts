import { BREAKPOINTS, type AuraBreakpointToken } from '@aura/tokens';
import { useMediaQuery } from './useMediaQuery';

export type WindowSizeClass = AuraBreakpointToken;

/**
 * Returns the active Material Design 3 window size class (`compact` through `extra-large`).
 */
export function useWindowSizeClass(defaultClass: WindowSizeClass = 'compact'): WindowSizeClass {
  const isExtraLarge = useMediaQuery(
    `(min-width: ${BREAKPOINTS['extra-large']})`,
    defaultClass === 'extra-large',
  );
  const isLarge = useMediaQuery(`(min-width: ${BREAKPOINTS.large})`, defaultClass === 'large');
  const isExpanded = useMediaQuery(
    `(min-width: ${BREAKPOINTS.expanded})`,
    defaultClass === 'expanded',
  );
  const isMedium = useMediaQuery(`(min-width: ${BREAKPOINTS.medium})`, defaultClass === 'medium');

  if (isExtraLarge) return 'extra-large';
  if (isLarge) return 'large';
  if (isExpanded) return 'expanded';
  if (isMedium) return 'medium';
  return 'compact';
}
