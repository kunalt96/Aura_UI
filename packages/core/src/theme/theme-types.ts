import type {
  AuraToken,
  ColorMode,
  ContrastLevel,
  SchemeVariant,
  SemanticSeedInput,
} from '@aura/tokens';

export type ThemeMode = ColorMode | 'system';
export type ResolvedThemeMode = ColorMode;
export type ThemeContrast = ContrastLevel;
export type ThemeVariant = SchemeVariant;
export type ThemeMotion = 'standard' | 'expressive' | 'reduced';
export type ThemeTokensOverride = Partial<Record<AuraToken, string>>;

export interface ThemeContextValue {
  readonly seed: string;
  readonly mode: ThemeMode;
  readonly resolvedMode: ResolvedThemeMode;
  readonly contrast: ThemeContrast;
  readonly variant: ThemeVariant;
  readonly motion: ThemeMotion;
  readonly setMode: (mode: ThemeMode) => void;
  readonly setContrast: (contrast: ThemeContrast) => void;
  readonly setVariant: (variant: ThemeVariant) => void;
  readonly setMotion: (motion: ThemeMotion) => void;
  readonly setSeed: (seed: string) => void;
}

export interface ThemeInitScriptOptions {
  readonly storageKey?: string | undefined;
  readonly defaultMode?: ThemeMode | undefined;
  readonly defaultContrast?: ThemeContrast | undefined;
  readonly defaultMotion?: ThemeMotion | undefined;
}

export interface ThemeProviderProps {
  readonly seed?: string | undefined;
  readonly mode?: ThemeMode | undefined;
  readonly defaultMode?: ThemeMode | undefined;
  readonly onModeChange?: ((mode: ThemeMode) => void) | undefined;
  readonly contrast?: ThemeContrast | undefined;
  readonly defaultContrast?: ThemeContrast | undefined;
  readonly onContrastChange?: ((contrast: ThemeContrast) => void) | undefined;
  readonly variant?: ThemeVariant | undefined;
  readonly motion?: ThemeMotion | undefined;
  readonly semanticSeeds?: SemanticSeedInput | undefined;
  readonly tokensOverride?: ThemeTokensOverride | undefined;
  readonly global?: boolean | undefined;
  readonly dir?: 'ltr' | 'rtl' | undefined;
  readonly className?: string | undefined;
  readonly style?: React.CSSProperties | undefined;
  readonly children?: React.ReactNode;
}
