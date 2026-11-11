import { useId as useReactId } from 'react';
import { TOKEN_PREFIX } from '@aura/tokens';

/**
 * Returns a deterministic, brand-prefixed unique DOM id, or the consumer-provided id.
 */
export function useId(providedId?: string): string {
  const reactId = useReactId();
  return providedId ?? `${TOKEN_PREFIX}-${reactId}`;
}
