import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx, prefixedClass } from '../../utils/cx';

export type PresenceStatus = 'entering' | 'entered' | 'exiting' | 'exited';

export interface PresenceRenderState {
  readonly status: PresenceStatus;
  readonly present: boolean;
}

export interface PresenceProps {
  /** Controls whether the children are mounted/entering (`true`) or exiting/unmounted (`false`). */
  readonly present: boolean;
  /** Keeps children in the DOM when `exited`. */
  readonly keepMounted?: boolean | undefined;
  /** Invoked after the exit animation/transition finishes. */
  readonly onExitComplete?: (() => void) | undefined;
  /** Optional className on the presence wrapper (uses `display: contents`). */
  readonly className?: string | undefined;
  readonly children: React.ReactNode | ((state: PresenceRenderState) => React.ReactNode);
}

function parseCssTimeMs(value: string): number {
  const parts = value.split(',').map((part) => part.trim());
  let maxMs = 0;
  for (const part of parts) {
    if (!part) continue;
    if (part.endsWith('ms')) {
      const n = Number.parseFloat(part.slice(0, -2));
      if (Number.isFinite(n)) maxMs = Math.max(maxMs, n);
    } else if (part.endsWith('s')) {
      const n = Number.parseFloat(part.slice(0, -1));
      if (Number.isFinite(n)) maxMs = Math.max(maxMs, n * 1000);
    }
  }
  return maxMs;
}

function getMaxElementDurationMs(container: HTMLElement | null): number {
  if (!container || typeof window === 'undefined') {
    return 0;
  }
  const target = (container.firstElementChild as HTMLElement | null) ?? container;
  const style = window.getComputedStyle(target);
  const animMs = parseCssTimeMs(style.animationDuration) + parseCssTimeMs(style.animationDelay);
  const transMs = parseCssTimeMs(style.transitionDuration) + parseCssTimeMs(style.transitionDelay);
  return Math.max(animMs, transMs);
}

/**
 * Mount/unmount animation lifecycle wrapper tracking enter and exit CSS transitions/animations.
 * Unmounts immediately when reduced motion is preferred or no exit animation is active.
 */
export function Presence({
  present,
  keepMounted = false,
  onExitComplete,
  className,
  children,
}: PresenceProps): React.JSX.Element | null {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [status, setStatus] = useState<PresenceStatus>(() => (present ? 'entered' : 'exited'));

  const prevPresentRef = useRef(present);

  useEffect(() => {
    const wasPresent = prevPresentRef.current;
    prevPresentRef.current = present;

    if (present && !wasPresent) {
      setStatus('entering');
      if (reducedMotion) {
        setStatus('entered');
        return undefined;
      }
      const raf = window.requestAnimationFrame(() => {
        setStatus('entered');
      });
      return () => {
        window.cancelAnimationFrame(raf);
      };
    }

    if (!present && wasPresent) {
      if (reducedMotion) {
        setStatus('exited');
        onExitComplete?.();
        return undefined;
      }

      setStatus('exiting');
      return undefined;
    }

    return undefined;
  }, [present, reducedMotion, onExitComplete]);

  useEffect(() => {
    if (status !== 'exiting') {
      return undefined;
    }

    const node = wrapperRef.current;
    if (!node) {
      setStatus('exited');
      onExitComplete?.();
      return undefined;
    }

    let finished = false;
    const finishExit = () => {
      if (finished) return;
      finished = true;
      setStatus('exited');
      onExitComplete?.();
    };

    const onEnd = (event: Event) => {
      const firstChild = node.firstElementChild;
      if (event.target === node || event.target === firstChild) {
        finishExit();
      }
    };

    node.addEventListener('animationend', onEnd);
    node.addEventListener('transitionend', onEnd);

    // Measure after style flush on next frame; fallback timeout prevents stuck exits.
    let timeoutId: number | undefined;
    const raf = window.requestAnimationFrame(() => {
      const durationMs = getMaxElementDurationMs(node);
      if (durationMs <= 0) {
        finishExit();
      } else {
        timeoutId = window.setTimeout(finishExit, durationMs + 34);
      }
    });

    return () => {
      window.cancelAnimationFrame(raf);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      node.removeEventListener('animationend', onEnd);
      node.removeEventListener('transitionend', onEnd);
    };
  }, [status, onExitComplete]);

  if (status === 'exited' && !keepMounted && !present) {
    return null;
  }

  const content = typeof children === 'function' ? children({ status, present }) : children;

  return (
    <span
      ref={wrapperRef}
      className={cx(prefixedClass('presence'), className)}
      data-state={status}
      hidden={status === 'exited' && keepMounted ? true : undefined}
    >
      {content}
    </span>
  );
}

Presence.displayName = 'Presence';
