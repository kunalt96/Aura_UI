import {
  forwardRef,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx, prefixedClass } from '../../utils/cx';
import type {
  PolymorphicComponent,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from '../../utils/polymorphic';
import { Elevation } from '../../primitives/Elevation';
import { FocusRing } from '../../primitives/FocusRing';
import { Icon } from '../../primitives/Icon';
import { Ripple } from '../../primitives/Ripple';
import { StateLayer } from '../../primitives/StateLayer';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';

export type ButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonOwnProps {
  /** Visual variant per M3 spec. Defaults to 'filled'. */
  readonly variant?: ButtonVariant | undefined;
  /** Size step per M3 spec (xs: 32px, sm: 40px, md: 40px, lg: 56px, xl: 96px). Defaults to 'md'. */
  readonly size?: ButtonSize | undefined;
  /** Leading icon (Material Symbols ligature string or custom icon node). */
  readonly leadingIcon?: ReactNode | string | undefined;
  /** Trailing icon (Material Symbols ligature string or custom icon node). */
  readonly trailingIcon?: ReactNode | string | undefined;
  /** Whether the button is in a loading state. Replaces leading icon with circular spinner. */
  readonly loading?: boolean | undefined;
  /** Screen-reader announcement text while loading. Defaults to 'Loading...'. */
  readonly loadingLabel?: string | undefined;
  /** Toggle button selected state. Sets aria-pressed when provided. */
  readonly selected?: boolean | undefined;
  /** Disables interactions and applies disabled styling. */
  readonly disabled?: boolean | undefined;
  /** Expands button to fill full container width. */
  readonly fullWidth?: boolean | undefined;
  /** Label content. */
  readonly children?: ReactNode | undefined;
}

export type ButtonProps<C extends ElementType = 'button'> = PolymorphicPropsWithRef<
  C,
  ButtonOwnProps
>;

function renderIconSlot(icon: ReactNode | string, className: string): ReactElement {
  if (typeof icon === 'string') {
    return (
      <span className={className} aria-hidden="true">
        <Icon name={icon} decorative />
      </span>
    );
  }
  if (isValidElement(icon)) {
    return (
      <span className={className} aria-hidden="true">
        {icon}
      </span>
    );
  }
  return (
    <span className={className} aria-hidden="true">
      {icon}
    </span>
  );
}

function LoadingSpinner(): ReactElement {
  return (
    <span className={prefixedClass('button-spinner')} aria-hidden="true">
      <svg
        className={prefixedClass('button-spinner-svg')}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={prefixedClass('button-spinner-circle')}
          cx="24"
          cy="24"
          r="18"
          strokeWidth="4"
        />
      </svg>
    </span>
  );
}

function ButtonInner<C extends ElementType = 'button'>(
  {
    as,
    variant = 'filled',
    size = 'md',
    leadingIcon,
    trailingIcon,
    loading = false,
    loadingLabel = 'Loading...',
    selected,
    disabled = false,
    fullWidth = false,
    className,
    children,
    ...rest
  }: ButtonProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? 'button';
  const isNativeButton = Component === 'button';
  const hasLeading = Boolean(leadingIcon) || loading;
  const hasTrailing = Boolean(trailingIcon);
  const isInteractive = !disabled && !loading;

  // Resting elevation levels
  const elevationLevel = variant === 'elevated' ? 1 : 0;
  const hasElevation = variant === 'elevated' || variant === 'filled' || variant === 'tonal';

  return (
    <Component
      ref={ref}
      type={isNativeButton ? 'button' : undefined}
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-disabled={disabled || loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      aria-pressed={selected !== undefined ? selected : undefined}
      data-variant={variant}
      data-size={size}
      data-selected={selected !== undefined ? String(selected) : undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-has-leading={hasLeading || undefined}
      data-has-trailing={hasTrailing || undefined}
      data-full-width={fullWidth || undefined}
      className={cx(prefixedClass('button'), className)}
      {...rest}
    >
      {hasElevation && (
        <Elevation
          level={elevationLevel}
          shadow
          tonal={false}
          className={prefixedClass('button-elevation')}
        />
      )}
      <StateLayer disabled={!isInteractive} />
      <Ripple disabled={!isInteractive} />
      <FocusRing />

      {loading ? (
        <LoadingSpinner />
      ) : leadingIcon ? (
        renderIconSlot(leadingIcon, prefixedClass('button-icon'))
      ) : null}

      {children !== undefined && children !== null && (
        <span className={prefixedClass('button-label')}>{children}</span>
      )}

      {!loading && trailingIcon ? (
        renderIconSlot(trailingIcon, prefixedClass('button-icon'))
      ) : null}

      {loading && <VisuallyHidden>{loadingLabel}</VisuallyHidden>}
    </Component>
  );
}

/**
 * Material Design 3 Button supporting 5 variants (`filled`, `tonal`, `elevated`, `outlined`, `text`),
 * 5 heights (`xs` 32, `sm` 40, `md` 40, `lg` 56, `xl` 96), icon slots, loading circular progress,
 * and toggle button selection.
 */
export const Button = forwardRef(
  ButtonInner as unknown as React.ForwardRefRenderFunction<HTMLElement, ButtonOwnProps>,
) as unknown as PolymorphicComponent<'button', ButtonOwnProps>;

Button.displayName = 'Button';

