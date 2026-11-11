import { useCallback, useState } from 'react';

export interface UseControllableStateOptions<T> {
  readonly value?: T | undefined;
  readonly defaultValue: T;
  readonly onChange?: ((value: T) => void) | undefined;
}

/**
 * Manages a state value that can be either controlled (`value` prop) or uncontrolled (`defaultValue`).
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): readonly [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(currentValue) : next;
      if (!isControlled) {
        setUncontrolledValue(resolved);
      }
      onChange?.(resolved);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}
