import { forwardRef, type ElementType, type ReactElement } from 'react';
import { cx, prefixedClass } from '../../utils/cx';
import type {
  PolymorphicComponent,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from '../../utils/polymorphic';

export interface VisuallyHiddenOwnProps {
  /** Reveals content visually when focused (useful for skip links). */
  readonly focusable?: boolean | undefined;
}

export type VisuallyHiddenProps<C extends ElementType = 'span'> = PolymorphicPropsWithRef<
  C,
  VisuallyHiddenOwnProps
>;

function VisuallyHiddenInner<C extends ElementType = 'span'>(
  { as, focusable = false, className, children, ...rest }: VisuallyHiddenProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? 'span';

  return (
    <Component
      ref={ref}
      className={cx(prefixedClass('visually-hidden'), className)}
      data-focusable={focusable || undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Hides content visually while keeping it accessible to screen readers.
 */
export const VisuallyHidden = forwardRef(
  VisuallyHiddenInner as unknown as React.ForwardRefRenderFunction<
    HTMLElement,
    VisuallyHiddenOwnProps
  >,
) as unknown as PolymorphicComponent<'span', VisuallyHiddenOwnProps>;

VisuallyHidden.displayName = 'VisuallyHidden';
