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

export type FABSize = 'small' | 'regular' | 'large';
export type FABColor = 'primary' | 'surface' | 'secondary' | 'tertiary';

export interface FABBaseProps {
  /** Size step per M3 spec (small: 40px, regular: 56px, large: 96px). Defaults to 'regular'. */
  readonly size?: FABSize | undefined;
  /** Semantic color role. Defaults to 'primary'. */
  readonly color?: FABColor | undefined;
  /** Material Symbols ligature name or custom icon node. */
  readonly icon?: ReactNode | string | undefined;
  /** Text label for Extended FAB. When present, renders as Extended FAB. */
  readonly label?: ReactNode | undefined;
  /** Whether the Extended FAB is currently expanded with label visible. Defaults to true if label is provided. */
  readonly extended?: boolean | undefined;
  /** Disables interactions and applies disabled styling. */
  readonly disabled?: boolean | undefined;
  /** Custom children (e.g. label node or icon) if not using props. */
  readonly children?: ReactNode | undefined;
}

export type FABA11yProps =
  | {
      readonly label: ReactNode;
      readonly 'aria-label'?: string | undefined;
      readonly 'aria-labelledby'?: string | undefined;
    }
  | {
      readonly label?: undefined;
      readonly 'aria-label': string;
      readonly 'aria-labelledby'?: undefined;
    }
  | {
      readonly label?: undefined;
      readonly 'aria-label'?: undefined;
      readonly 'aria-labelledby': string;
    };

export type FABOwnProps = FABBaseProps & FABA11yProps;

export type FABProps<C extends ElementType = 'button'> = PolymorphicPropsWithRef<
  C,
  FABOwnProps
>;

function renderIcon(icon: ReactNode | string | undefined): ReactElement | null {
  if (typeof icon === 'string') {
    return (
      <span className={prefixedClass('fab-icon')} aria-hidden="true">
        <Icon name={icon} decorative />
      </span>
    );
  }
  if (isValidElement(icon)) {
    return (
      <span className={prefixedClass('fab-icon')} aria-hidden="true">
        {icon}
      </span>
    );
  }
  if (icon !== undefined && icon !== null) {
    return (
      <span className={prefixedClass('fab-icon')} aria-hidden="true">
        {icon}
      </span>
    );
  }
  return null;
}

function FABInner<C extends ElementType = 'button'>(
  {
    as,
    size = 'regular',
    color = 'primary',
    icon,
    label,
    extended,
    disabled = false,
    className,
    children,
    ...rest
  }: FABProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? 'button';
  const isNativeButton = Component === 'button';
  const labelContent = label ?? children;
  const isExtended = labelContent !== undefined && (extended ?? true);
  const isInteractive = !disabled;

  return (
    <Component
      ref={ref}
      type={isNativeButton ? 'button' : undefined}
      disabled={isNativeButton ? disabled : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      data-size={size}
      data-color={color}
      data-extended={isExtended ? 'true' : undefined}
      data-disabled={disabled || undefined}
      className={cx(prefixedClass('fab'), className)}
      {...rest}
    >
      <Elevation level={3} shadow tonal={false} className={prefixedClass('fab-elevation')} />
      <StateLayer disabled={!isInteractive} />
      <Ripple disabled={!isInteractive} centered={!isExtended} />
      <FocusRing />

      {renderIcon(icon)}

      {labelContent !== undefined && labelContent !== null && (
        <span className={prefixedClass('fab-label')}>{labelContent}</span>
      )}
    </Component>
  );
}

/**
 * Material Design 3 Floating Action Button (FAB).
 * Represents the primary action on a screen.
 * Supports Small (40px), Regular (56px), Large (96px), and Extended FAB (icon + label).
 */
export const FAB = forwardRef(
  FABInner as unknown as React.ForwardRefRenderFunction<HTMLElement, FABOwnProps>,
) as unknown as PolymorphicComponent<'button', FABOwnProps>;

FAB.displayName = 'FAB';

