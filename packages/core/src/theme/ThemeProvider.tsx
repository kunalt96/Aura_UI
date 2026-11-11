import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ALL_COLOR_ROLES,
  BRAND_CONFIG,
  PALETTE_NAMES,
  TOKEN_PREFIX,
  TONE_STOPS,
  generateColorScheme,
} from '@aura/tokens';
import { useControllableState } from '../hooks/useControllableState';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cx, dataAttr, prefixedClass } from '../utils/cx';
import { ThemeContext } from './theme-context';
import type {
  ResolvedThemeMode,
  ThemeContextValue,
  ThemeMotion,
  ThemeProviderProps,
  ThemeVariant,
} from './theme-types';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const THEME_ATTR = dataAttr('theme');
const CONTRAST_ATTR = dataAttr('contrast');
const MOTION_ATTR = dataAttr('motion');

function buildStyleTagContent(vars: Record<string, string>): string {
  const entries = Object.entries(vars);
  if (entries.length === 0) {
    return '';
  }
  const declarations = entries.map(([key, value]) => `${key}:${value};`).join('');
  return `:root{${declarations}}`;
}

/**
 * Provides Material Design 3 theme context, dynamic seed color generation,
 * contrast levels, and motion schemes to a subtree or the global document root.
 */
export function ThemeProvider({
  seed,
  mode,
  defaultMode,
  onModeChange,
  contrast,
  defaultContrast,
  onContrastChange,
  variant,
  motion,
  semanticSeeds,
  tokensOverride,
  global = false,
  dir,
  className,
  style,
  children,
}: ThemeProviderProps): React.JSX.Element {
  const parentTheme = useContext(ThemeContext);
  const prefersDark = useMediaQuery(DARK_SCHEME_QUERY, false);

  const [internalSeed, setInternalSeed] = useState<string>(
    () => parentTheme?.seed ?? BRAND_CONFIG.defaultSeed,
  );
  const [internalVariant, setInternalVariant] = useState<ThemeVariant>(
    () => parentTheme?.variant ?? 'tonal-spot',
  );
  const [internalMotion, setInternalMotion] = useState<ThemeMotion>(
    () => parentTheme?.motion ?? 'standard',
  );

  const [resolvedInputMode, setMode] = useControllableState({
    value: mode,
    defaultValue: defaultMode ?? parentTheme?.mode ?? 'system',
    onChange: onModeChange,
  });

  const [resolvedContrast, setContrast] = useControllableState({
    value: contrast,
    defaultValue: defaultContrast ?? parentTheme?.contrast ?? 'standard',
    onChange: onContrastChange,
  });

  const activeSeed = seed ?? internalSeed;
  const activeVariant = variant ?? internalVariant;
  const activeMotion = motion ?? internalMotion;

  const resolvedMode: ResolvedThemeMode =
    resolvedInputMode === 'system' ? (prefersDark ? 'dark' : 'light') : resolvedInputMode;

  const setSeed = useCallback((nextSeed: string) => {
    setInternalSeed(nextSeed);
  }, []);

  const setVariant = useCallback((nextVariant: ThemeVariant) => {
    setInternalVariant(nextVariant);
  }, []);

  const setMotion = useCallback((nextMotion: ThemeMotion) => {
    setInternalMotion(nextMotion);
  }, []);

  const dynamicCssVars = useMemo(() => {
    const vars: Record<string, string> = {};
    const needsDynamicScheme =
      activeSeed.toUpperCase() !== BRAND_CONFIG.defaultSeed.toUpperCase() ||
      activeVariant !== 'tonal-spot' ||
      semanticSeeds !== undefined;

    if (needsDynamicScheme) {
      const scheme = generateColorScheme({
        seed: activeSeed,
        mode: resolvedMode,
        contrast: resolvedContrast,
        variant: activeVariant,
        ...(semanticSeeds ? { semanticSeeds } : {}),
      });

      for (const paletteName of PALETTE_NAMES) {
        const tones = scheme.palettes[paletteName];
        for (const tone of TONE_STOPS) {
          vars[`--${TOKEN_PREFIX}-ref-palette-${paletteName}-${tone}`] = tones[tone];
        }
      }

      for (const role of ALL_COLOR_ROLES) {
        vars[`--${TOKEN_PREFIX}-sys-color-${role}`] = scheme.colors[role];
      }
    }

    if (tokensOverride) {
      for (const [tokenName, tokenValue] of Object.entries(tokensOverride)) {
        vars[tokenName] = tokenValue;
      }
    }

    return vars;
  }, [activeSeed, activeVariant, resolvedContrast, resolvedMode, semanticSeeds, tokensOverride]);

  const appliedGlobalVarsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!global || typeof document === 'undefined') {
      return undefined;
    }

    const rootEl = document.documentElement;
    rootEl.setAttribute(THEME_ATTR, resolvedMode);
    rootEl.setAttribute(CONTRAST_ATTR, resolvedContrast);
    rootEl.setAttribute(MOTION_ATTR, activeMotion);
    if (dir) {
      rootEl.setAttribute('dir', dir);
    }

    for (const prevKey of appliedGlobalVarsRef.current) {
      if (!(prevKey in dynamicCssVars)) {
        rootEl.style.removeProperty(prevKey);
      }
    }

    const keys = Object.keys(dynamicCssVars);
    for (const key of keys) {
      const val = dynamicCssVars[key];
      if (val !== undefined) {
        rootEl.style.setProperty(key, val);
      }
    }
    appliedGlobalVarsRef.current = keys;

    return () => {
      for (const key of appliedGlobalVarsRef.current) {
        rootEl.style.removeProperty(key);
      }
      appliedGlobalVarsRef.current = [];
    };
  }, [global, resolvedMode, resolvedContrast, activeMotion, dir, dynamicCssVars]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      seed: activeSeed,
      mode: resolvedInputMode,
      resolvedMode,
      contrast: resolvedContrast,
      variant: activeVariant,
      motion: activeMotion,
      setMode,
      setContrast,
      setVariant,
      setMotion,
      setSeed,
    }),
    [
      activeSeed,
      resolvedInputMode,
      resolvedMode,
      resolvedContrast,
      activeVariant,
      activeMotion,
      setMode,
      setContrast,
      setVariant,
      setMotion,
      setSeed,
    ],
  );

  if (global) {
    const cssText = buildStyleTagContent(dynamicCssVars);
    const styleAttr = { [dataAttr('theme-vars')]: '' };
    return (
      <ThemeContext.Provider value={contextValue}>
        {cssText ? <style {...styleAttr}>{cssText}</style> : null}
        {children}
      </ThemeContext.Provider>
    );
  }

  const wrapperProps: Record<string, unknown> = {
    [THEME_ATTR]: resolvedMode,
    [CONTRAST_ATTR]: resolvedContrast,
    [MOTION_ATTR]: activeMotion,
  };

  const mergedStyle: React.CSSProperties = {
    ...(dynamicCssVars as React.CSSProperties),
    ...style,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={cx(prefixedClass('theme'), className)}
        dir={dir}
        style={mergedStyle}
        {...wrapperProps}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
