import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx, prefixedClass } from '../../utils/cx';
import { useControllableState } from '../../hooks/useControllableState';
import { SegmentedButtonContext } from './SegmentedButtonContext';

export interface SegmentedButtonGroupSingleProps {
  readonly selectionMode?: 'single' | undefined;
  readonly value?: string | undefined;
  readonly defaultValue?: string | undefined;
  readonly onChange?: ((value: string) => void) | undefined;
}

export interface SegmentedButtonGroupMultiProps {
  readonly selectionMode: 'multi';
  readonly value?: readonly string[] | undefined;
  readonly defaultValue?: readonly string[] | undefined;
  readonly onChange?: ((value: readonly string[]) => void) | undefined;
}

export type SegmentedButtonGroupSelectionProps =
  | SegmentedButtonGroupSingleProps
  | SegmentedButtonGroupMultiProps;

export interface SegmentedButtonGroupBaseProps {
  /** Disables all segments within the group. */
  readonly disabled?: boolean | undefined;
  /** Density variant per M3 spec (dense: 32px height). */
  readonly density?: 'default' | 'dense' | undefined;
  /** Stretches segments evenly across the full width of container. */
  readonly fullWidth?: boolean | undefined;
  /** Accessible label for the group or radiogroup. */
  readonly 'aria-label'?: string | undefined;
  /** ID of element labeling the group. */
  readonly 'aria-labelledby'?: string | undefined;
  /** Segment children. */
  readonly children?: ReactNode | undefined;
  /** Additional CSS class names. */
  readonly className?: string | undefined;
}

export type SegmentedButtonGroupProps = SegmentedButtonGroupBaseProps &
  SegmentedButtonGroupSelectionProps;

export const SegmentedButtonGroup = forwardRef<HTMLDivElement, SegmentedButtonGroupProps>(
  function SegmentedButtonGroup(props, ref) {
    const {
      disabled = false,
      density = 'default',
      fullWidth = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className,
      selectionMode = 'single',
    } = props;

    const groupRef = useRef<HTMLDivElement | null>(null);

    // Single select state
    const singleProps = props as SegmentedButtonGroupSingleProps;
    const [singleValue, setSingleValue] = useControllableState<string>({
      value: singleProps.value,
      defaultValue: singleProps.defaultValue ?? '',
      onChange: singleProps.onChange,
    });

    // Multi select state
    const multiProps = props as SegmentedButtonGroupMultiProps;
    const [multiValue, setMultiValue] = useControllableState<readonly string[]>({
      value: multiProps.value,
      defaultValue: multiProps.defaultValue ?? [],
      onChange: multiProps.onChange,
    });

    const isSelected = useCallback(
      (val: string): boolean => {
        if (selectionMode === 'single') {
          return singleValue === val;
        }
        return multiValue.includes(val);
      },
      [selectionMode, singleValue, multiValue],
    );

    const selectValue = useCallback(
      (val: string) => {
        if (disabled) return;

        if (selectionMode === 'single') {
          setSingleValue(val);
        } else {
          setMultiValue((prev) => {
            if (prev.includes(val)) {
              return prev.filter((item) => item !== val);
            }
            return [...prev, val];
          });
        }
      },
      [disabled, selectionMode, setSingleValue, setMultiValue],
    );

    // Keyboard navigation for single-select (roving focus in radiogroup)
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (selectionMode !== 'single') return;

        const container = groupRef.current;
        if (!container) return;

        const buttons = Array.from(
          container.querySelectorAll<HTMLButtonElement>(
            '.aura-segmented-button:not([disabled]):not([aria-disabled="true"])',
          ),
        );
        if (buttons.length === 0) return;

        const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (currentIndex === -1) return;

        let targetIndex = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (currentIndex + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        }

        if (targetIndex >= 0) {
          const targetBtn = buttons[targetIndex];
          if (targetBtn) {
            targetBtn.focus();
            targetBtn.click();
          }
        }
      },
      [selectionMode],
    );

    const contextValue = useMemo(
      () => ({
        selectionMode,
        isSelected,
        selectValue,
        disabled,
        density,
        fullWidth,
      }),
      [selectionMode, isSelected, selectValue, disabled, density, fullWidth],
    );

    const setMergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        groupRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && 'current' in ref) {
          (ref as { current: HTMLDivElement | null }).current = node;
        }
      },
      [ref],
    );

    const sharedProps = {
      ref: setMergedRef,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-disabled': disabled ? ('true' as const) : undefined,
      'data-full-width': fullWidth ? 'true' : 'false',
      'data-density': density,
      className: cx(prefixedClass('segmented-button-group'), className),
    };

    if (selectionMode === 'multi') {
      return (
        <div role="group" {...sharedProps}>
          <SegmentedButtonContext.Provider value={contextValue}>
            {children}
          </SegmentedButtonContext.Provider>
        </div>
      );
    }

    return (
      <div role="radiogroup" tabIndex={-1} onKeyDown={handleKeyDown} {...sharedProps}>
        <SegmentedButtonContext.Provider value={contextValue}>
          {children}
        </SegmentedButtonContext.Provider>
      </div>
    );
  },
);

SegmentedButtonGroup.displayName = 'SegmentedButtonGroup';
