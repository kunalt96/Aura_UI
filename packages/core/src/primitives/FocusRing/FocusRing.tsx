import { forwardRef } from 'react';
import { cx, prefixedClass } from '../../utils/cx';

export interface FocusRingProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Controlled visibility override. When omitted, reacts to parent `:focus-visible` or `[data-focus-visible]`. */
  readonly visible?: boolean | undefined;
  /** Places the ring inside the container bounds instead of outward. */
  readonly inward?: boolean | undefined;
}

/**
 * Keyboard `:focus-visible` indicator matching M3 3px secondary outline specification.
 */
export const FocusRing = forwardRef<HTMLSpanElement, FocusRingProps>(function FocusRing(
  { visible, inward = false, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(prefixedClass('focus-ring'), className)}
      data-visible={visible}
      data-inward={inward || undefined}
      {...rest}
    />
  );
});

FocusRing.displayName = 'FocusRing';
