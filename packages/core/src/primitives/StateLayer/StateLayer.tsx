import { forwardRef } from 'react';
import { cx, prefixedClass } from '../../utils/cx';

export interface StateLayerProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Controlled hover state override. */
  readonly hovered?: boolean | undefined;
  /** Controlled focus state override. */
  readonly focused?: boolean | undefined;
  /** Controlled pressed state override. */
  readonly pressed?: boolean | undefined;
  /** Controlled dragged state override. */
  readonly dragged?: boolean | undefined;
  /** Suppresses state layer when disabled. */
  readonly disabled?: boolean | undefined;
}

/**
 * Inert hover/focus/pressed/dragged opacity overlay matching M3 state layer tokens.
 */
export const StateLayer = forwardRef<HTMLSpanElement, StateLayerProps>(function StateLayer(
  { hovered, focused, pressed, dragged, disabled, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(prefixedClass('state-layer'), className)}
      data-hovered={hovered}
      data-focused={focused}
      data-pressed={pressed}
      data-dragged={dragged}
      data-disabled={disabled}
      {...rest}
    />
  );
});

StateLayer.displayName = 'StateLayer';
