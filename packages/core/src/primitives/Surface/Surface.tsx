import { forwardRef, type ElementType, type ReactElement } from 'react';
import type { AuraElevationLevel, AuraShapeToken } from '@aura/tokens';
import { cx, prefixedClass } from '../../utils/cx';
import type {
  PolymorphicComponent,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from '../../utils/polymorphic';

export type SurfaceColorRole =
  | 'surface'
  | 'surface-dim'
  | 'surface-bright'
  | 'surface-container-lowest'
  | 'surface-container-low'
  | 'surface-container'
  | 'surface-container-high'
  | 'surface-container-highest'
  | 'surface-variant'
  | 'primary'
  | 'primary-container'
  | 'secondary'
  | 'secondary-container'
  | 'tertiary'
  | 'tertiary-container'
  | 'error'
  | 'error-container'
  | 'success'
  | 'success-container'
  | 'warning'
  | 'warning-container'
  | 'info'
  | 'info-container'
  | 'inverse-surface';

export interface SurfaceOwnProps {
  /** Surface background color role; automatically pairs matching `on-*` foreground text. */
  readonly color?: SurfaceColorRole | undefined;
  /** Corner radius shape token. */
  readonly shape?: AuraShapeToken | undefined;
  /** M3 elevation level (0–5). */
  readonly elevation?: AuraElevationLevel | undefined;
  /** Whether to mix surface-tint tonal overlay with the background color. */
  readonly tonalElevation?: boolean | undefined;
  /** Adds a 1px outline-variant border. */
  readonly outlined?: boolean | undefined;
}

export type SurfaceProps<C extends ElementType = 'div'> = PolymorphicPropsWithRef<
  C,
  SurfaceOwnProps
>;

function SurfaceInner<C extends ElementType = 'div'>(
  {
    as,
    color = 'surface',
    shape = 'none',
    elevation = 0,
    tonalElevation = true,
    outlined = false,
    className,
    children,
    ...rest
  }: SurfaceProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? 'div';
  const applyTonal = tonalElevation && color.startsWith('surface');

  return (
    <Component
      ref={ref}
      className={cx(prefixedClass('surface'), className)}
      data-color={color}
      data-shape={shape}
      data-elevation={elevation}
      data-tonal={applyTonal}
      data-outlined={outlined || undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Container primitive pairing M3 color roles, shape tokens, elevation, and tonal overlays.
 */
export const Surface = forwardRef(
  SurfaceInner as unknown as React.ForwardRefRenderFunction<HTMLElement, SurfaceOwnProps>,
) as unknown as PolymorphicComponent<'div', SurfaceOwnProps>;

Surface.displayName = 'Surface';
