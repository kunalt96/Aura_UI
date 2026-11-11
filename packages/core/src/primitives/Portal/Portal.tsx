import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ThemeContext } from '../../theme/theme-context';
import { cx, dataAttr, prefixedClass } from '../../utils/cx';

export interface PortalProps {
  /** Target DOM element to render into; defaults to `document.body` after hydration. */
  readonly container?: HTMLElement | null | undefined;
  /** Disables portaling and renders children inline. */
  readonly disabled?: boolean | undefined;
  /** Optional className on the portal theme-forwarding container. */
  readonly className?: string | undefined;
  readonly children: React.ReactNode;
}

const THEME_ATTR = dataAttr('theme');
const CONTRAST_ATTR = dataAttr('contrast');
const MOTION_ATTR = dataAttr('motion');

/**
 * SSR-safe portal that preserves nearest ThemeProvider attributes across `document.body` boundaries.
 */
export function Portal({
  container,
  disabled = false,
  className,
  children,
}: PortalProps): React.ReactNode {
  const [mounted, setMounted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled) {
    return children;
  }

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const target = container ?? document.body;
  const themeProps: Record<string, unknown> = theme
    ? {
        [THEME_ATTR]: theme.resolvedMode,
        [CONTRAST_ATTR]: theme.contrast,
        [MOTION_ATTR]: theme.motion,
      }
    : {};

  return createPortal(
    <div className={cx(prefixedClass('portal'), className)} {...themeProps}>
      {children}
    </div>,
    target,
  );
}

Portal.displayName = 'Portal';
