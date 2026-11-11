import { forwardRef } from 'react';
import type { AuraIconSizeToken } from '@aura/tokens';
import { cx, prefixedClass } from '../../utils/cx';

export type IconVariant = 'rounded' | 'outlined';
export type IconWeight = 300 | 400 | 500;
export type IconGrade = -25 | 0 | 200;
export type IconOpticalSize = 20 | 24 | 40 | 48;

interface IconBaseProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Material Symbols ligature name (e.g. `"home"`, `"search"`, `"settings"`). */
  readonly name?: string | undefined;
  /** Material Symbols style (Rounded default, Outlined option). */
  readonly variant?: IconVariant | undefined;
  /** Semantic icon size token. */
  readonly size?: AuraIconSizeToken | undefined;
  /** Variable font FILL axis (`true` = 1, `false` = 0). */
  readonly filled?: boolean | undefined;
  /** Variable font wght axis (300–500). */
  readonly weight?: IconWeight | undefined;
  /** Variable font GRAD axis. */
  readonly grade?: IconGrade | undefined;
  /** Variable font opsz axis. */
  readonly opsz?: IconOpticalSize | undefined;
  /** Optional custom SVG or icon node when not using Material Symbols ligatures. */
  readonly children?: React.ReactNode;
}

type IconA11yProps =
  | {
      readonly decorative?: true | undefined;
      readonly 'aria-label'?: undefined;
      readonly 'aria-labelledby'?: undefined;
    }
  | {
      readonly decorative?: false | undefined;
      readonly 'aria-label': string;
      readonly 'aria-labelledby'?: undefined;
    }
  | {
      readonly decorative?: false | undefined;
      readonly 'aria-label'?: undefined;
      readonly 'aria-labelledby': string;
    };

export type IconProps = IconBaseProps & IconA11yProps;

const DEFAULT_OPSZ_BY_SIZE: Record<AuraIconSizeToken, IconOpticalSize> = {
  dense: 20,
  default: 24,
  large: 40,
  xlarge: 40,
  xxlarge: 48,
};

/**
 * Material Symbols icon wrapper supporting variable font axes (`FILL`, `wght`, `GRAD`, `opsz`)
 * and custom inline SVGs, with TypeScript-enforced accessible naming for non-decorative icons.
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    name,
    variant = 'rounded',
    size = 'default',
    filled = false,
    weight = 400,
    grade = 0,
    opsz,
    decorative,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const isAccessible = Boolean(ariaLabel ?? ariaLabelledby) && decorative !== true;
  const resolvedOpsz = opsz ?? DEFAULT_OPSZ_BY_SIZE[size];

  const variableAxesStyle = {
    '--_icon-fill': filled ? 1 : 0,
    '--_icon-weight': weight,
    '--_icon-grade': grade,
    '--_icon-opsz': resolvedOpsz,
    ...style,
  } as React.CSSProperties;

  return (
    <span
      ref={ref}
      className={cx(prefixedClass('icon'), className)}
      data-variant={children ? undefined : variant}
      data-size={size}
      style={variableAxesStyle}
      role={isAccessible ? 'img' : undefined}
      aria-label={isAccessible ? ariaLabel : undefined}
      aria-labelledby={isAccessible ? ariaLabelledby : undefined}
      aria-hidden={isAccessible ? undefined : true}
      {...rest}
    >
      {children ?? name}
    </span>
  );
});

Icon.displayName = 'Icon';
