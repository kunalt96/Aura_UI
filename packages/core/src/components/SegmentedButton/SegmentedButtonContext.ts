export type SegmentedButtonSelectionMode = 'single' | 'multi';

export interface SegmentedButtonContextValue {
  readonly selectionMode: SegmentedButtonSelectionMode;
  readonly isSelected: (value: string) => boolean;
  readonly selectValue: (value: string) => void;
  readonly disabled?: boolean | undefined;
  readonly density?: 'default' | 'dense' | undefined;
  readonly fullWidth?: boolean | undefined;
}

import { createContext, useContext } from 'react';

export const SegmentedButtonContext = createContext<SegmentedButtonContextValue | null>(null);

export function useSegmentedButtonContext(): SegmentedButtonContextValue | null {
  return useContext(SegmentedButtonContext);
}
