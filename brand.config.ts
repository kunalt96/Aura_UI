export interface BrandFontFamily {
  readonly brand: readonly string[];
  readonly plain: readonly string[];
  readonly mono: readonly string[];
}

export interface SemanticSourceColors {
  readonly success: `#${string}`;
  readonly warning: `#${string}`;
  readonly info: `#${string}`;
}

export interface BrandConfig {
  readonly name: string;
  readonly packageScope: string;
  readonly prefix: string;
  readonly defaultSeed: `#${string}`;
  readonly semanticSeeds: SemanticSourceColors;
  readonly defaultFontFamily: BrandFontFamily;
  readonly storageKey: string;
}

export const brandConfig: BrandConfig = {
  name: 'Aura UI',
  packageScope: '@aura',
  prefix: 'aura',
  defaultSeed: '#6750A4',
  semanticSeeds: {
    success: '#2E7D32',
    warning: '#EAB308',
    info: '#0288D1',
  },
  defaultFontFamily: {
    brand: ['Roboto Flex', 'Roboto Flex Variable', 'Roboto', 'system-ui', 'sans-serif'],
    plain: ['Roboto Flex', 'Roboto Flex Variable', 'Roboto', 'system-ui', 'sans-serif'],
    mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
  },
  storageKey: 'aura-theme',
} as const;
