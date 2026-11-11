export {
  SegmentedButton,
  type SegmentedButtonProps,
} from './SegmentedButton';

export {
  SegmentedButtonGroup,
  type SegmentedButtonGroupProps,
  type SegmentedButtonGroupSingleProps,
  type SegmentedButtonGroupMultiProps,
  type SegmentedButtonGroupBaseProps,
  type SegmentedButtonGroupSelectionProps,
} from './SegmentedButtonGroup';

export {
  SegmentedButtonContext,
  useSegmentedButtonContext,
  type SegmentedButtonContextValue,
  type SegmentedButtonSelectionMode,
} from './SegmentedButtonContext';

// Also export ButtonGroup as an alias for SegmentedButtonGroup per COMPONENTS.md §1
export { SegmentedButtonGroup as ButtonGroup } from './SegmentedButtonGroup';
export type { SegmentedButtonGroupProps as ButtonGroupProps } from './SegmentedButtonGroup';
