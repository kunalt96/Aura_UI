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
import { FocusRing } from '../../primitives/FocusRing';
import { Icon } from '../../primitives/Icon';
import { Ripple } from '../../primitives/Ripple';
import { StateLayer } from '../../primitives/StateLayer';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

export interface IconButtonBaseProps {
  /** Visual variant per M3 spec. Defaults to 'standard'. */
  readonly variant?: IconButtonVariant | undefined;
  /** Material Symbols ligature name or custom icon node. */
  readonly icon?: ReactNode | string | undefined;
  /** Material Symbols ligature name or custom icon node when `selected` is true. */
  readonly selectedIcon?: ReactNode | string | undefined;
  /** Whether the variable font FILL axis should be active when selected. Defaults to true. */
  readonly filledOnSelect?: boolean | undefined;
  /** Toggle button selected state. Adds aria-pressed when provided. */
  readonly selected?: boolean | undefined;
  /** Disables interactions and applies disabled styling. */
  readonly disabled?: boolean | undefined;
  /** Whether the icon button is in a loading state. */
  readonly loading?: boolean | undefined;
  /** Custom icon content when not using `icon` prop. */
  readonly children?: ReactNode | undefined;
}

export type IconButtonA11yProps =
  | {
      readonly 'aria-label': string;
      readonly 'aria-labelledby'?: undefined;
    }
  | {
      readonly 'aria-label'?: undefined;
      readonly 'aria-labelledby': string;
    };

export type IconButtonOwnProps = IconButtonBaseProps & IconButtonA11yProps;

export type IconButtonProps<C extends ElementType = 'button'> = PolymorphicPropsWithRef<
  C,
  IconButtonOwnProps
>;

function IconButtonSpinner(): ReactElement {
  return (
    <span className={prefixedClass('icon-button-spinner')} aria-hidden="true">
      <svg
        className={prefixedClass('icon-button-spinner-svg')}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={prefixedClass('icon-button-spinner-circle')}
          cx="24"
          cy="24"
          r="18"
          strokeWidth="4"
        />
      </svg>
    </span>
  );
}

function renderContent(
  icon: ReactNode | string | undefined,
  selectedIcon: ReactNode | string | undefined,
  selected: boolean | undefined,
  filledOnSelect: boolean,
  children: ReactNode | undefined,
): ReactElement | null {
  const isSelected = Boolean(selected);
  const activeIcon = isSelected && selectedIcon !== undefined ? selectedIcon : icon;

  if (typeof activeIcon === 'string') {
    return (
      <span className={prefixedClass('icon-button-content')} aria-hidden="true">
        <Icon name={activeIcon} filled={isSelected ? filledOnSelect : false} decorative />
      </span>
    );
  }

  if (isValidElement(activeIcon)) {
    return (
      <span className={prefixedClass('icon-button-content')} aria-hidden="true">
        {activeIcon}
      </span>
    );
  }

  if (children !== undefined && children !== null) {
    return (
      <span className={prefixedClass('icon-button-content')} aria-hidden="true">
        {children}
      </span>
    );
  }

  return null;
}

function IconButtonInner<C extends ElementType = 'button'>(
  {
    as,
    variant = 'standard',
    icon,
    selectedIcon,
    filledOnSelect = true,
    selected,
    disabled = false,
    loading = false,
    className,
    children,
    ...rest
  }: IconButtonProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? 'button';
  const isNativeButton = Component === 'button';
  const isToggle = selected !== undefined;
  const isInteractive = !disabled && !loading;

  return (
    <Component
      ref={ref}
      type={isNativeButton ? 'button' : undefined}
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-disabled={disabled || loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      aria-pressed={isToggle ? selected : undefined}
      data-variant={variant}
      data-toggle={isToggle || undefined}
      data-selected={isToggle ? String(selected) : undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      className={cx(prefixedClass('icon-button'), className)}
      {...rest}
    >
      <StateLayer disabled={!isInteractive} />
      <Ripple disabled={!isInteractive} centered />
      <FocusRing />

      {loading
        ? <IconButtonSpinner />
        : renderContent(icon, selectedIcon, selected, filledOnSelect, children)}
    </Component>
  );
}

/**
 * Material Design 3 Icon Button: 40x40 container with a 24px icon and 48px touch target.
 * Supports 4 variants (`standard`, `filled`, `tonal`, `outlined`), toggle states, and enforces
 * accessible names via TypeScript (`aria-label` or `aria-labelledby`).
 */
export const IconButton = forwardRef(
  IconButtonInner as unknown as React.ForwardRefRenderFunction<HTMLElement, IconButtonOwnProps>,
) as unknown as PolymorphicComponent<'button', IconButtonOwnProps>;

IconButton.displayName = 'IconButton';

