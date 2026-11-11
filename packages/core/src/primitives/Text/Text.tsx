import { forwardRef, type ElementType, type ReactElement } from 'react';
import type { AuraTypescaleRole } from '@aura/tokens';
import { cx, prefixedClass } from '../../utils/cx';
import type {
  PolymorphicComponent,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from '../../utils/polymorphic';

export type TextColorRole =
  | 'inherit'
  | 'on-surface'
  | 'on-surface-variant'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'on-primary'
  | 'inverse-on-surface';

export interface TextOwnProps {
  /** M3 typescale role (`display-*`, `headline-*`, `title-*`, `body-*`, `label-*`). */
  readonly role?: AuraTypescaleRole | undefined;
  /** Uses M3 Expressive emphasized font weight for the selected role. */
  readonly emphasized?: boolean | undefined;
  /** Semantic text color role; defaults to inheriting from parent Surface. */
  readonly color?: TextColorRole | undefined;
  /** Logical text alignment. */
  readonly align?: 'start' | 'center' | 'end' | undefined;
  /** Truncates text with an ellipsis on a single line. */
  readonly truncate?: boolean | undefined;
}

export type TextProps<C extends ElementType = 'p'> = PolymorphicPropsWithRef<C, TextOwnProps>;

function getDefaultElement(role: AuraTypescaleRole): ElementType {
  if (role.startsWith('display-')) return 'h1';
  if (role.startsWith('headline-')) return 'h2';
  if (role.startsWith('title-')) return 'h3';
  if (role.startsWith('body-')) return 'p';
  return 'span';
}

function TextInner<C extends ElementType = 'p'>(
  {
    as,
    role = 'body-medium',
    emphasized = false,
    color = 'inherit',
    align,
    truncate = false,
    className,
    children,
    ...rest
  }: TextProps<C>,
  ref: PolymorphicRef<C>,
): ReactElement {
  const Component: ElementType = as ?? getDefaultElement(role);

  return (
    <Component
      ref={ref}
      className={cx(prefixedClass('text'), className)}
      data-role={role}
      data-emphasized={emphasized || undefined}
      data-color={color !== 'inherit' ? color : undefined}
      data-align={align}
      data-truncate={truncate || undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Polymorphic typography primitive mapping M3 typescale roles and semantic text colors.
 */
export const Text = forwardRef(
  TextInner as unknown as React.ForwardRefRenderFunction<HTMLElement, TextOwnProps>,
) as unknown as PolymorphicComponent<'p', TextOwnProps>;

Text.displayName = 'Text';

/** Alias for `Text` matching `COMPONENTS.md` naming. */
export const Typography = Text;
