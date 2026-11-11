import {
  forwardRef,
  isValidElement,
  useCallback,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx, prefixedClass } from '../../utils/cx';
import { Icon } from '../../primitives/Icon';
import { Ripple } from '../../primitives/Ripple';
import { StateLayer } from '../../primitives/StateLayer';
import { useSegmentedButtonContext } from './SegmentedButtonContext';

export interface SegmentedButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'> {
  /** The unique value for this segment. */
  readonly value: string;
  /** Direct selected state (overridden when inside SegmentedButtonGroup). */
  readonly selected?: boolean | undefined;
  /** Leading icon (Material Symbols ligature string or React element). */
  readonly icon?: ReactNode | string | undefined;
  /** Whether to show a checkmark icon when selected per M3 spec. Defaults to true. */
  readonly showSelectedCheck?: boolean | undefined;
  /** Optional label node (or pass children). */
  readonly label?: ReactNode | undefined;
  /** Child content, typically the text label. */
  readonly children?: ReactNode | undefined;
  /** Disables interactions and applies disabled styling. */
  readonly disabled?: boolean | undefined;
}

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

export const SegmentedButton = forwardRef<HTMLButtonElement, SegmentedButtonProps>(
  function SegmentedButton(props, ref) {
    const {
      value,
      selected: explicitSelected,
      icon,
      showSelectedCheck = true,
      label,
      children,
      disabled: explicitDisabled = false,
      onClick,
      className,
      ...rest
    } = props;

    const groupContext = useSegmentedButtonContext();

    const isSelected = groupContext
      ? groupContext.isSelected(value)
      : Boolean(explicitSelected);

    const isDisabled = explicitDisabled || Boolean(groupContext?.disabled);
    const isSingle = groupContext ? groupContext.selectionMode === 'single' : false;

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        groupContext?.selectValue(value);
        onClick?.(e);
      },
      [isDisabled, groupContext, value, onClick],
    );

    // M3 icon behavior: when selected and showSelectedCheck is true, display checkmark
    const showCheck = isSelected && showSelectedCheck;
    const content = label ?? children;

    // Accessibility attributes
    const role = isSingle ? 'radio' : undefined;
    const ariaChecked = isSingle ? (isSelected ? 'true' : 'false') : undefined;
    const ariaPressed = !isSingle ? (isSelected ? 'true' : 'false') : undefined;
    const tabIndex = isSingle ? (isSelected ? 0 : -1) : 0;

    return (
      <button
        ref={ref}
        type="button"
        role={role}
        aria-checked={ariaChecked}
        aria-pressed={ariaPressed}
        aria-disabled={isDisabled ? 'true' : undefined}
        disabled={isDisabled}
        tabIndex={isDisabled ? -1 : tabIndex}
        data-selected={isSelected ? 'true' : 'false'}
        data-disabled={isDisabled ? 'true' : 'false'}
        data-density={groupContext?.density}
        className={cx(prefixedClass('segmented-button'), className)}
        onClick={handleClick}
        {...rest}
      >
        <StateLayer color="currentColor" />
        <Ripple disabled={isDisabled} />

        {showCheck ? (
          <span className={prefixedClass('segmented-button-check')} aria-hidden="true">
            <Icon name="check" decorative />
          </span>
        ) : icon ? (
          renderIconSlot(icon, prefixedClass('segmented-button-icon'))
        ) : null}

        {content !== undefined && content !== null ? (
          <span className={prefixedClass('segmented-button-label')}>{content}</span>
        ) : null}
      </button>
    );
  },
);

SegmentedButton.displayName = 'SegmentedButton';

