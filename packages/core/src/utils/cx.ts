import { TOKEN_PREFIX } from '@aura/tokens';

/**
 * Joins truthy CSS class names into a single space-delimited string.
 */
export function cx(...classes: ReadonlyArray<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Builds a brand-prefixed CSS class name (e.g., `aura-surface`).
 */
export function prefixedClass(name: string): string {
  return `${TOKEN_PREFIX}-${name}`;
}

/**
 * Builds a brand-prefixed `data-*` attribute name (e.g., `data-aura-theme`).
 */
export function dataAttr(name: string): `data-${string}` {
  return `data-${TOKEN_PREFIX}-${name}`;
}
