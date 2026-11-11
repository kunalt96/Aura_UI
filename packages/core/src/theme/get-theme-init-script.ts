import { BRAND_CONFIG, TOKEN_PREFIX } from '@aura/tokens';
import type { ThemeInitScriptOptions } from './theme-types';

/**
 * Returns a minified inline `<script>` string for SSR `<head>` placement to apply
 * initial theme, contrast, and motion attributes before first paint (no FOUC).
 */
export function getThemeInitScript(options: ThemeInitScriptOptions = {}): string {
  const storageKey = JSON.stringify(options.storageKey ?? BRAND_CONFIG.storageKey);
  const defaultMode = JSON.stringify(options.defaultMode ?? 'system');
  const defaultContrast = JSON.stringify(options.defaultContrast ?? 'standard');
  const defaultMotion = JSON.stringify(options.defaultMotion ?? 'standard');
  const themeAttr = JSON.stringify(`data-${TOKEN_PREFIX}-theme`);
  const contrastAttr = JSON.stringify(`data-${TOKEN_PREFIX}-contrast`);
  const motionAttr = JSON.stringify(`data-${TOKEN_PREFIX}-motion`);

  return `(function(){try{var d=document.documentElement;var s=localStorage.getItem(${storageKey});var p=s?JSON.parse(s):null;var m=(p&&p.mode)||${defaultMode};var c=(p&&p.contrast)||${defaultContrast};var mo=(p&&p.motion)||${defaultMotion};var r=m==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;d.setAttribute(${themeAttr},r);d.setAttribute(${contrastAttr},c);d.setAttribute(${motionAttr},mo);}catch(e){}})();`;
}
