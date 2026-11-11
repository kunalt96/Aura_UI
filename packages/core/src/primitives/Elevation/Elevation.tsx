import { forwardRef } from 'react';
import type { AuraElevationLevel } from '@aura/tokens';
import { cx, prefixedClass } from '../../utils/cx';

export interface ElevationProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Material Design 3 elevation level (0–5). */
  readonly level?: AuraElevationLevel | undefined;
  /** Whether to apply the surface-tint tonal overlay. */
  readonly tonal?: boolean | undefined;
  /** Whether to apply key + ambient box shadows. */
  readonly shadow?: boolean | undefined;
}

/**
 * Inert elevation overlay rendering M3 shadow + tonal surface-tint layers.
 */
export const Elevation = forwardRef<HTMLSpanElement, ElevationProps>(function Elevation(
  { level = 0, tonal = true, shadow = true, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(prefixedClass('elevation'), className)}
      data-level={level}
      data-tonal={tonal}
      data-shadow={shadow}
      {...rest}
    />
  );
});

Elevation.displayName = 'Elevation';
