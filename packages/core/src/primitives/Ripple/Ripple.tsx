import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx, prefixedClass } from '../../utils/cx';
import { mergeRefs } from '../../utils/merge-refs';

export interface RippleHandle {
  readonly start: (pointer?: { clientX: number; clientY: number }) => void;
  readonly stop: () => void;
}

export interface RippleProps extends React.ComponentPropsWithoutRef<'span'> {
  /** Disables pointer ripple generation. */
  readonly disabled?: boolean | undefined;
  /** Allows ripple wave to extend past container border-radius. */
  readonly unbounded?: boolean | undefined;
  /** Always originates ripple from the geometric center. */
  readonly centered?: boolean | undefined;
  /** Optional ref to the interactive target element; defaults to parent element. */
  readonly forRef?: RefObject<HTMLElement | null> | undefined;
}

const EXPAND_DURATION_MS = 300;
const FADE_DURATION_MS = 150;
const PRESSED_OPACITY_FALLBACK = 0.1;

function getPressedOpacity(el: HTMLElement): number {
  if (typeof window === 'undefined') {
    return PRESSED_OPACITY_FALLBACK;
  }
  const raw = window.getComputedStyle(el).getPropertyValue('--aura-sys-state-pressed-opacity').trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : PRESSED_OPACITY_FALLBACK;
}

/**
 * Pointer-originated Material Design 3 radial ripple using WAAPI (transform + opacity only).
 * Automatically suppresses wave animations when reduced motion is preferred.
 */
export const Ripple = forwardRef<RippleHandle, RippleProps>(function Ripple(
  { disabled = false, unbounded = false, centered = false, forRef, className, ...rest },
  forwardedRef,
) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const activeWavesRef = useRef<Set<HTMLSpanElement>>(new Set());
  const reducedMotion = useReducedMotion();

  const stopWaves = useCallback(() => {
    for (const wave of activeWavesRef.current) {
      if (wave.dataset['fading'] === 'true') {
        continue;
      }
      wave.dataset['fading'] = 'true';

      const currentOpacity =
        typeof window !== 'undefined'
          ? Number.parseFloat(window.getComputedStyle(wave).opacity) || PRESSED_OPACITY_FALLBACK
          : PRESSED_OPACITY_FALLBACK;

      if (typeof wave.animate === 'function') {
        const anim = wave.animate(
          [{ opacity: currentOpacity }, { opacity: 0 }],
          {
            duration: FADE_DURATION_MS,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            fill: 'forwards',
          },
        );
        anim.onfinish = () => {
          wave.remove();
          activeWavesRef.current.delete(wave);
        };
      } else {
        wave.remove();
        activeWavesRef.current.delete(wave);
      }
    }
  }, []);

  const startWave = useCallback(
    (pointer?: { clientX: number; clientY: number }) => {
      if (disabled || reducedMotion) {
        return;
      }
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centered || !pointer ? 0 : pointer.clientX - centerX;
      const dy = centered || !pointer ? 0 : pointer.clientY - centerY;

      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const maxCornerDist = Math.max(
        Math.hypot(dx + halfW, dy + halfH),
        Math.hypot(dx - halfW, dy + halfH),
        Math.hypot(dx + halfW, dy - halfH),
        Math.hypot(dx - halfW, dy - halfH),
      );
      const diameter = Math.ceil(maxCornerDist * 2);
      const pressedOpacity = getPressedOpacity(container);

      const wave = document.createElement('span');
      wave.className = prefixedClass('ripple-wave');
      wave.style.inlineSize = `${diameter}px`;
      wave.style.blockSize = `${diameter}px`;
      wave.style.opacity = String(pressedOpacity);

      const fromTransform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.15)`;
      const toTransform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`;
      wave.style.transform = toTransform;

      container.appendChild(wave);
      activeWavesRef.current.add(wave);

      if (typeof wave.animate === 'function') {
        wave.animate(
          [
            { transform: fromTransform, opacity: 0 },
            { transform: fromTransform, opacity: pressedOpacity, offset: 0.25 },
            { transform: toTransform, opacity: pressedOpacity },
          ],
          {
            duration: EXPAND_DURATION_MS,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            fill: 'forwards',
          },
        );
      }
    },
    [centered, disabled, reducedMotion],
  );

  useImperativeHandle(
    forwardedRef,
    () => ({
      start: startWave,
      stop: stopWaves,
    }),
    [startWave, stopWaves],
  );

  useEffect(() => {
    const target = forRef?.current ?? containerRef.current?.parentElement;
    if (!target || disabled || reducedMotion) {
      return undefined;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') {
        return;
      }
      startWave({ clientX: event.clientX, clientY: event.clientY });
    };

    const onPointerEnd = () => {
      stopWaves();
    };

    target.addEventListener('pointerdown', onPointerDown);
    target.addEventListener('pointerup', onPointerEnd);
    target.addEventListener('pointercancel', onPointerEnd);
    target.addEventListener('pointerleave', onPointerEnd);

    return () => {
      target.removeEventListener('pointerdown', onPointerDown);
      target.removeEventListener('pointerup', onPointerEnd);
      target.removeEventListener('pointercancel', onPointerEnd);
      target.removeEventListener('pointerleave', onPointerEnd);
    };
  }, [disabled, forRef, reducedMotion, startWave, stopWaves]);

  useEffect(() => {
    const waves = activeWavesRef.current;
    return () => {
      for (const wave of waves) {
        wave.remove();
      }
      waves.clear();
    };
  }, []);

  const setContainerRef = mergeRefs<HTMLSpanElement>(containerRef);

  return (
    <span
      ref={setContainerRef}
      aria-hidden="true"
      className={cx(prefixedClass('ripple'), className)}
      data-unbounded={unbounded || undefined}
      {...rest}
    />
  );
});

Ripple.displayName = 'Ripple';
