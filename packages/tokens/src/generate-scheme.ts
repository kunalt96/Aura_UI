import {
  Blend,
  Hct,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
  argbFromHex,
  hexFromArgb,
  type DynamicScheme,
  type TonalPalette,
} from '@material/material-color-utilities';

export type ColorMode = 'light' | 'dark';
export type ContrastLevel = 'standard' | 'medium' | 'high';
export type SchemeVariant =
  | 'tonal-spot'
  | 'vibrant'
  | 'expressive'
  | 'neutral'
  | 'monochrome'
  | 'fidelity';

export const TONE_STOPS = [
  0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100,
] as const;

export type ToneStop = (typeof TONE_STOPS)[number];

export const PALETTE_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'neutral-variant',
  'error',
] as const;

export type PaletteName = (typeof PALETTE_NAMES)[number];

export const M3_COLOR_ROLES = [
  'primary',
  'on-primary',
  'primary-container',
  'on-primary-container',
  'primary-fixed',
  'primary-fixed-dim',
  'on-primary-fixed',
  'on-primary-fixed-variant',
  'secondary',
  'on-secondary',
  'secondary-container',
  'on-secondary-container',
  'secondary-fixed',
  'secondary-fixed-dim',
  'on-secondary-fixed',
  'on-secondary-fixed-variant',
  'tertiary',
  'on-tertiary',
  'tertiary-container',
  'on-tertiary-container',
  'tertiary-fixed',
  'tertiary-fixed-dim',
  'on-tertiary-fixed',
  'on-tertiary-fixed-variant',
  'error',
  'on-error',
  'error-container',
  'on-error-container',
  'surface',
  'surface-dim',
  'surface-bright',
  'surface-container-lowest',
  'surface-container-low',
  'surface-container',
  'surface-container-high',
  'surface-container-highest',
  'on-surface',
  'on-surface-variant',
  'surface-variant',
  'outline',
  'outline-variant',
  'inverse-surface',
  'inverse-on-surface',
  'inverse-primary',
  'surface-tint',
  'scrim',
  'shadow',
] as const;

export const SEMANTIC_EXTRA_ROLES = [
  'success',
  'on-success',
  'success-container',
  'on-success-container',
  'warning',
  'on-warning',
  'warning-container',
  'on-warning-container',
  'info',
  'on-info',
  'info-container',
  'on-info-container',
] as const;

export const ALL_COLOR_ROLES = [...M3_COLOR_ROLES, ...SEMANTIC_EXTRA_ROLES] as const;

export type M3ColorRole = (typeof M3_COLOR_ROLES)[number];
export type SemanticExtraRole = (typeof SEMANTIC_EXTRA_ROLES)[number];
export type SystemColorRole = (typeof ALL_COLOR_ROLES)[number];

export interface SemanticSeedInput {
  readonly success?: string;
  readonly warning?: string;
  readonly info?: string;
}

export interface GenerateSchemeOptions {
  readonly seed: string;
  readonly mode?: ColorMode;
  readonly contrast?: ContrastLevel;
  readonly variant?: SchemeVariant;
  readonly semanticSeeds?: SemanticSeedInput;
}

export interface GeneratedColorScheme {
  readonly seed: string;
  readonly mode: ColorMode;
  readonly contrast: ContrastLevel;
  readonly variant: SchemeVariant;
  readonly colors: Record<SystemColorRole, string>;
  readonly palettes: Record<PaletteName, Record<ToneStop, string>>;
}

export interface GeneratedThemeSchemes {
  readonly seed: string;
  readonly variant: SchemeVariant;
  readonly palettes: Record<PaletteName, Record<ToneStop, string>>;
  readonly schemes: Record<ColorMode, Record<ContrastLevel, Record<SystemColorRole, string>>>;
}

export const DEFAULT_SEMANTIC_SEEDS: Required<SemanticSeedInput> = {
  success: '#2E7D32',
  warning: '#EAB308',
  info: '#0288D1',
};

const CONTRAST_MAP: Record<ContrastLevel, number> = {
  standard: 0,
  medium: 0.5,
  high: 1.0,
};

export function normalizeHex(input: string): string {
  const trimmed = input.trim();
  const shortMatch = /^#?([0-9a-fA-F]{3})$/.exec(trimmed);
  if (shortMatch?.[1]) {
    const shortHex = shortMatch[1];
    const r = shortHex.charAt(0);
    const g = shortHex.charAt(1);
    const b = shortHex.charAt(2);
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  const fullMatch = /^#?([0-9a-fA-F]{6})$/.exec(trimmed);
  if (fullMatch?.[1]) {
    return `#${fullMatch[1].toUpperCase()}`;
  }
  throw new Error(`Invalid hex color "${input}". Expected #RGB or #RRGGBB.`);
}

function createDynamicScheme(
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  variant: SchemeVariant,
): DynamicScheme {
  switch (variant) {
    case 'tonal-spot':
      return new SchemeTonalSpot(sourceColorHct, isDark, contrastLevel);
    case 'vibrant':
      return new SchemeVibrant(sourceColorHct, isDark, contrastLevel);
    case 'expressive':
      return new SchemeExpressive(sourceColorHct, isDark, contrastLevel);
    case 'neutral':
      return new SchemeNeutral(sourceColorHct, isDark, contrastLevel);
    case 'monochrome':
      return new SchemeMonochrome(sourceColorHct, isDark, contrastLevel);
    case 'fidelity':
      return new SchemeFidelity(sourceColorHct, isDark, contrastLevel);
  }
}

function extractPaletteTones(palette: TonalPalette): Record<ToneStop, string> {
  const result = {} as Record<ToneStop, string>;
  for (const tone of TONE_STOPS) {
    result[tone] = hexFromArgb(palette.tone(tone)).toUpperCase();
  }
  return result;
}

function extractPalettes(scheme: DynamicScheme): Record<PaletteName, Record<ToneStop, string>> {
  return {
    primary: extractPaletteTones(scheme.primaryPalette),
    secondary: extractPaletteTones(scheme.secondaryPalette),
    tertiary: extractPaletteTones(scheme.tertiaryPalette),
    neutral: extractPaletteTones(scheme.neutralPalette),
    'neutral-variant': extractPaletteTones(scheme.neutralVariantPalette),
    error: extractPaletteTones(scheme.errorPalette),
  };
}

function generateHarmonizedSemanticGroup(
  semanticHex: string,
  seedArgb: number,
  isDark: boolean,
  contrastValue: number,
): {
  base: string;
  onBase: string;
  container: string;
  onContainer: string;
} {
  const semanticArgb = argbFromHex(normalizeHex(semanticHex));
  const harmonizedArgb = Blend.harmonize(semanticArgb, seedArgb);
  const harmonizedScheme = new SchemeTonalSpot(Hct.fromInt(harmonizedArgb), isDark, contrastValue);

  return {
    base: hexFromArgb(harmonizedScheme.primary).toUpperCase(),
    onBase: hexFromArgb(harmonizedScheme.onPrimary).toUpperCase(),
    container: hexFromArgb(harmonizedScheme.primaryContainer).toUpperCase(),
    onContainer: hexFromArgb(harmonizedScheme.onPrimaryContainer).toUpperCase(),
  };
}

function extractSystemColors(
  scheme: DynamicScheme,
  seedArgb: number,
  isDark: boolean,
  contrastValue: number,
  semanticSeeds: Required<SemanticSeedInput>,
): Record<SystemColorRole, string> {
  const success = generateHarmonizedSemanticGroup(
    semanticSeeds.success,
    seedArgb,
    isDark,
    contrastValue,
  );
  const warning = generateHarmonizedSemanticGroup(
    semanticSeeds.warning,
    seedArgb,
    isDark,
    contrastValue,
  );
  const info = generateHarmonizedSemanticGroup(
    semanticSeeds.info,
    seedArgb,
    isDark,
    contrastValue,
  );

  return {
    primary: hexFromArgb(scheme.primary).toUpperCase(),
    'on-primary': hexFromArgb(scheme.onPrimary).toUpperCase(),
    'primary-container': hexFromArgb(scheme.primaryContainer).toUpperCase(),
    'on-primary-container': hexFromArgb(scheme.onPrimaryContainer).toUpperCase(),
    'primary-fixed': hexFromArgb(scheme.primaryFixed).toUpperCase(),
    'primary-fixed-dim': hexFromArgb(scheme.primaryFixedDim).toUpperCase(),
    'on-primary-fixed': hexFromArgb(scheme.onPrimaryFixed).toUpperCase(),
    'on-primary-fixed-variant': hexFromArgb(scheme.onPrimaryFixedVariant).toUpperCase(),

    secondary: hexFromArgb(scheme.secondary).toUpperCase(),
    'on-secondary': hexFromArgb(scheme.onSecondary).toUpperCase(),
    'secondary-container': hexFromArgb(scheme.secondaryContainer).toUpperCase(),
    'on-secondary-container': hexFromArgb(scheme.onSecondaryContainer).toUpperCase(),
    'secondary-fixed': hexFromArgb(scheme.secondaryFixed).toUpperCase(),
    'secondary-fixed-dim': hexFromArgb(scheme.secondaryFixedDim).toUpperCase(),
    'on-secondary-fixed': hexFromArgb(scheme.onSecondaryFixed).toUpperCase(),
    'on-secondary-fixed-variant': hexFromArgb(scheme.onSecondaryFixedVariant).toUpperCase(),

    tertiary: hexFromArgb(scheme.tertiary).toUpperCase(),
    'on-tertiary': hexFromArgb(scheme.onTertiary).toUpperCase(),
    'tertiary-container': hexFromArgb(scheme.tertiaryContainer).toUpperCase(),
    'on-tertiary-container': hexFromArgb(scheme.onTertiaryContainer).toUpperCase(),
    'tertiary-fixed': hexFromArgb(scheme.tertiaryFixed).toUpperCase(),
    'tertiary-fixed-dim': hexFromArgb(scheme.tertiaryFixedDim).toUpperCase(),
    'on-tertiary-fixed': hexFromArgb(scheme.onTertiaryFixed).toUpperCase(),
    'on-tertiary-fixed-variant': hexFromArgb(scheme.onTertiaryFixedVariant).toUpperCase(),

    error: hexFromArgb(scheme.error).toUpperCase(),
    'on-error': hexFromArgb(scheme.onError).toUpperCase(),
    'error-container': hexFromArgb(scheme.errorContainer).toUpperCase(),
    'on-error-container': hexFromArgb(scheme.onErrorContainer).toUpperCase(),

    surface: hexFromArgb(scheme.surface).toUpperCase(),
    'surface-dim': hexFromArgb(scheme.surfaceDim).toUpperCase(),
    'surface-bright': hexFromArgb(scheme.surfaceBright).toUpperCase(),
    'surface-container-lowest': hexFromArgb(scheme.surfaceContainerLowest).toUpperCase(),
    'surface-container-low': hexFromArgb(scheme.surfaceContainerLow).toUpperCase(),
    'surface-container': hexFromArgb(scheme.surfaceContainer).toUpperCase(),
    'surface-container-high': hexFromArgb(scheme.surfaceContainerHigh).toUpperCase(),
    'surface-container-highest': hexFromArgb(scheme.surfaceContainerHighest).toUpperCase(),
    'on-surface': hexFromArgb(scheme.onSurface).toUpperCase(),
    'on-surface-variant': hexFromArgb(scheme.onSurfaceVariant).toUpperCase(),
    'surface-variant': hexFromArgb(scheme.surfaceVariant).toUpperCase(),

    outline: hexFromArgb(scheme.outline).toUpperCase(),
    'outline-variant': hexFromArgb(scheme.outlineVariant).toUpperCase(),
    'inverse-surface': hexFromArgb(scheme.inverseSurface).toUpperCase(),
    'inverse-on-surface': hexFromArgb(scheme.inverseOnSurface).toUpperCase(),
    'inverse-primary': hexFromArgb(scheme.inversePrimary).toUpperCase(),
    'surface-tint': hexFromArgb(scheme.surfaceTint).toUpperCase(),
    scrim: hexFromArgb(scheme.scrim).toUpperCase(),
    shadow: hexFromArgb(scheme.shadow).toUpperCase(),

    success: success.base,
    'on-success': success.onBase,
    'success-container': success.container,
    'on-success-container': success.onContainer,

    warning: warning.base,
    'on-warning': warning.onBase,
    'warning-container': warning.container,
    'on-warning-container': warning.onContainer,

    info: info.base,
    'on-info': info.onBase,
    'info-container': info.container,
    'on-info-container': info.onContainer,
  };
}

/**
 * Generates Material Design 3 tonal palettes and system color roles for a single
 * mode/contrast/variant combination from a seed hex color.
 */
export function generateColorScheme(options: GenerateSchemeOptions): GeneratedColorScheme {
  const normalizedSeed = normalizeHex(options.seed);
  const mode = options.mode ?? 'light';
  const contrast = options.contrast ?? 'standard';
  const variant = options.variant ?? 'tonal-spot';
  const semanticSeeds: Required<SemanticSeedInput> = {
    success: options.semanticSeeds?.success ?? DEFAULT_SEMANTIC_SEEDS.success,
    warning: options.semanticSeeds?.warning ?? DEFAULT_SEMANTIC_SEEDS.warning,
    info: options.semanticSeeds?.info ?? DEFAULT_SEMANTIC_SEEDS.info,
  };

  const seedArgb = argbFromHex(normalizedSeed);
  const seedHct = Hct.fromInt(seedArgb);
  const isDark = mode === 'dark';
  const contrastValue = CONTRAST_MAP[contrast];
  const scheme = createDynamicScheme(seedHct, isDark, contrastValue, variant);

  return {
    seed: normalizedSeed,
    mode,
    contrast,
    variant,
    colors: extractSystemColors(scheme, seedArgb, isDark, contrastValue, semanticSeeds),
    palettes: extractPalettes(scheme),
  };
}

/**
 * Generates tonal palettes and all 6 mode × contrast schemes (light/dark × standard/medium/high)
 * from a seed hex color.
 */
export function generateAllSchemes(
  options: Omit<GenerateSchemeOptions, 'mode' | 'contrast'>,
): GeneratedThemeSchemes {
  const normalizedSeed = normalizeHex(options.seed);
  const variant = options.variant ?? 'tonal-spot';
  const baseLight = generateColorScheme({ ...options, mode: 'light', contrast: 'standard' });

  const modes: readonly ColorMode[] = ['light', 'dark'];
  const contrasts: readonly ContrastLevel[] = ['standard', 'medium', 'high'];

  const schemes = {
    light: {} as Record<ContrastLevel, Record<SystemColorRole, string>>,
    dark: {} as Record<ContrastLevel, Record<SystemColorRole, string>>,
  };

  for (const mode of modes) {
    for (const contrast of contrasts) {
      schemes[mode][contrast] = generateColorScheme({
        ...options,
        mode,
        contrast,
      }).colors;
    }
  }

  return {
    seed: normalizedSeed,
    variant,
    palettes: baseLight.palettes,
    schemes,
  };
}
