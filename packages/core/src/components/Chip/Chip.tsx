import {
  forwardRef,
  isValidElement,
  useCallback,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx, prefixedClass } from '../../utils/cx';
import type {
  PolymorphicComponent,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from '../../utils/polymorphic';
import { Icon } from '../../primitives/Icon';
import { Ripple } from '../../primitives/Ripple';
import { StateLayer } from '../../primitives/StateLayer';

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipOwnProps {
  /** Visual variant per M3 spec (assist, filter, input, suggestion). Defaults to 'assist'. */
  readonly variant?: ChipVariant | undefined;
  /** Whether the chip uses an elevated surface (elevation level 1) instead of an outline. */
  readonly elevated?: boolean | undefined;
  /** Leading icon (Material Symbols ligature string or React element). */
  readonly leadingIcon?: ReactNode | string | undefined;
  /** Avatar element for Input Chip (e.g. <img> or Avatar component). */
  readonly avatar?: ReactNode | undefined;
  /** Trailing icon (Material Symbols ligature string or React element). */
  readonly trailingIcon?: ReactNode | string | undefined;
  /** Whether the chip is selected (primarily for filter chips). */
  readonly selected?: boolean | undefined;
  /** Callback invoked when the chip selection state toggles. */
  readonly onToggle?: ((selected: boolean) => void) | undefined;
  /** Callback invoked when the trailing dismiss/remove button is clicked (input chips). */
  readonly onRemove?: (() => void) | undefined;
  /** Accessible label for the remove button. Defaults to 'Remove'. */
  readonly removeLabel?: string | undefined;
  /** Disables interactions and applies disabled styling. */
  readonly disabled?: boolean | undefined;
  /** Label content. */
  readonly children?: ReactNode | undefined;
}

export type ChipProps<C extends ElementType = 'button'> = PolymorphicPropsWithRef<
  C,
  ChipOwnProps
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
  return <span className={className}>{icon}</span>;
}

function ChipInner<C extends ElementType = 'button'>(
  props: ChipProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const {
    as,
    variant = 'assist',
    elevated = false,
    leadingIcon,
    avatar,
    trailingIcon,
    selected = false,
    onToggle,
    onRemove,
    removeLabel = 'Remove',
    disabled = false,
    children,
    className,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  const Component: ElementType = as ?? 'button';
  const isButton = Component === 'button';
  const isFilter = variant === 'filter';
  const isInput = variant === 'input';
  const hasRemove = isInput && typeof onRemove === 'function';

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (isFilter) {
        onToggle?.(!selected);
      }
      (onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
    },
    [disabled, isFilter, onToggle, selected, onClick],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (hasRemove && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        onRemove();
        return;
      }
      (onKeyDown as ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined)?.(e);
    },
    [disabled, hasRemove, onRemove, onKeyDown],
  );

  const handleRemoveClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!disabled && onRemove) {
        onRemove();
      }
    },
    [disabled, onRemove],
  );

  // M3 Filter checkmark: when selected, show checkmark icon
  const showFilterCheck = isFilter && selected;
  const hasLeading = Boolean(leadingIcon) || showFilterCheck;
  const hasAvatar = Boolean(avatar);
  const hasTrailing = Boolean(trailingIcon);

  // Aria attributes
  const ariaPressed = isFilter ? (selected ? 'true' : 'false') : undefined;

  return (
    <Component
      ref={ref}
      type={isButton ? 'button' : undefined}
      aria-pressed={ariaPressed}
      aria-disabled={disabled ? 'true' : undefined}
      disabled={isButton ? disabled : undefined}
      data-variant={variant}
      data-elevated={elevated ? 'true' : 'false'}
      data-selected={selected ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-has-leading={hasLeading ? 'true' : 'false'}
      data-has-avatar={hasAvatar ? 'true' : 'false'}
      data-has-trailing={hasTrailing ? 'true' : 'false'}
      data-has-remove={hasRemove ? 'true' : 'false'}
      className={cx(prefixedClass('chip'), className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <StateLayer color="currentColor" />
      <Ripple disabled={disabled} />

      {/* Leading slot: Filter checkmark, avatar, or leading icon */}
      {showFilterCheck ? (
        <span className={prefixedClass('chip-check')} aria-hidden="true">
          <Icon name="check" decorative />
        </span>
      ) : avatar ? (
        <span className={prefixedClass('chip-avatar')} aria-hidden="true">
          {avatar}
        </span>
      ) : leadingIcon ? (
        renderIconSlot(leadingIcon, prefixedClass('chip-icon'))
      ) : null}

      {/* Label slot */}
      {children !== undefined && children !== null ? (
        <span className={prefixedClass('chip-label')}>{children}</span>
      ) : null}

      {/* Trailing slot: custom trailing icon */}
      {trailingIcon ? renderIconSlot(trailingIcon, prefixedClass('chip-icon')) : null}

      {/* Input Chip remove button */}
      {hasRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          disabled={disabled}
          tabIndex={-1}
          className={prefixedClass('chip-remove')}
          onClick={handleRemoveClick}
        >
          <Icon name="close" decorative />
        </button>
      ) : null}
    </Component>
  );
}

export const Chip = forwardRef(
  ChipInner as unknown as React.ForwardRefRenderFunction<HTMLElement, ChipOwnProps>,
) as unknown as PolymorphicComponent<'button', ChipOwnProps>;

Chip.displayName = 'Chip';
