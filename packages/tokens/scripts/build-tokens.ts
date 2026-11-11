import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brandConfig } from '../../../brand.config';
import {
  ALL_COLOR_ROLES,
  PALETTE_NAMES,
  TONE_STOPS,
  generateAllSchemes,
  type ColorMode,
  type ContrastLevel,
  type SystemColorRole,
} from '../src/generate-scheme';

interface TypescaleEntry {
  size: string;
  line: string;
  weight: number;
  emphasizedWeight?: number;
  tracking: string;
  family?: 'brand' | 'plain' | 'mono';
}

interface ElevationEntry {
  shadow: string;
  tint: string;
}

interface SpringEntry {
  stiffness: number;
  damping: number;
}

interface TokensJson {
  $description?: string;
  meta: {
    prefix: string;
    seed: string;
    version: string;
  };
  ref: {
    typeface: Record<string, { $type: string; $value: string[] }>;
    palette: Record<string, unknown>;
  };
  sys: {
    color: {
      light: Record<string, string>;
      dark: Record<string, string>;
      'semantic-extra': {
        roles: string[];
        seeds?: Record<string, string>;
      };
    };
    typescale: Record<string, TypescaleEntry>;
    shape: Record<string, string>;
    elevation: Record<string, ElevationEntry>;
    state: {
      'hover-opacity': number;
      'focus-opacity': number;
      'pressed-opacity': number;
      'dragged-opacity': number;
      'disabled-content-opacity': number;
      'disabled-container-opacity': number;
      'focus-ring': {
        width: string;
        offset: string;
        color: string;
      };
    };
    motion: {
      easing: Record<string, string>;
      duration: Record<string, string>;
      spring: {
        spatial: SpringEntry;
        effects: SpringEntry;
      };
    };
    space: Record<string, string>;
    breakpoint: Record<string, string>;
    icon: {
      size: Record<string, string>;
      symbols: Record<string, number>;
    };
    'touch-target': string;
    'scrim-opacity': number;
    'z-index': Record<string, number>;
  };
  comp: Record<string, unknown>;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const srcDir = path.join(pkgRoot, 'src');
const generatedDir = path.join(srcDir, 'generated');
const distDir = path.join(pkgRoot, 'dist');

const prefix = brandConfig.prefix;

function formatFontFamily(families: readonly string[]): string {
  return families
    .map((f) => (/[\s]/.test(f) && !f.startsWith('"') && !f.startsWith("'") ? `"${f}"` : f))
    .join(', ');
}

/**
 * Resolves DTCG token references like `{sys.color.secondary}` or `{sys.elevation.level3}`
 * into CSS `var(--<prefix>-...)` declarations.
 */
function resolveTokenRef(raw: unknown): string {
  if (typeof raw === 'number') {
    return String(raw);
  }
  if (typeof raw !== 'string') {
    throw new Error(`Unsupported token leaf value: ${String(raw)}`);
  }
  const match = /^\{([^}]+)\}$/.exec(raw.trim());
  if (!match?.[1]) {
    return raw;
  }
  const refPath = match[1];
  if (refPath.startsWith('sys.elevation.')) {
    return `var(--${prefix}-${refPath.replaceAll('.', '-')}-shadow)`;
  }
  return `var(--${prefix}-${refPath.replaceAll('.', '-')})`;
}

/**
 * Generates a CSS `linear()` approximation for a damped spring oscillator
 * (unit step response from 0 to 1) per DESIGN.md §8.3.
 */
function buildSpringLinearEasing(stiffness: number, dampingRatio: number, samples = 24): string {
  const omega0 = Math.sqrt(stiffness);
  const zeta = dampingRatio;
  // Duration when envelope decays below 0.002 (or 1.0s cap)
  const settledTime =
    zeta < 1
      ? Math.min(1.2, Math.log(1 / 0.002) / (zeta * omega0))
      : Math.min(1.0, 6 / omega0);

  const values: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const progress = i / samples;
    const t = progress * settledTime;
    let displacement: number;
    if (zeta < 1) {
      const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
      const envelope = Math.exp(-zeta * omega0 * t);
      displacement =
        1 -
        envelope *
          (Math.cos(omegaD * t) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * t));
    } else if (Math.abs(zeta - 1) < 1e-4) {
      const envelope = Math.exp(-omega0 * t);
      displacement = 1 - envelope * (1 + omega0 * t);
    } else {
      const s = Math.sqrt(zeta * zeta - 1);
      const r1 = -omega0 * (zeta - s);
      const r2 = -omega0 * (zeta + s);
      displacement = 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    }
    if (i === 0) displacement = 0;
    if (i === samples) displacement = 1;
    values.push(displacement.toFixed(4).replace(/\.?0+$/, ''));
  }

  return `linear(${values.join(', ')})`;
}

function flattenEntries(
  obj: Record<string, unknown>,
  parentParts: string[],
  out: Array<{ name: string; value: string }>,
): void {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) {
      continue;
    }
    const nextParts = [...parentParts, key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      flattenEntries(val as Record<string, unknown>, nextParts, out);
    } else {
      out.push({
        name: `--${prefix}-${nextParts.join('-')}`,
        value: resolveTokenRef(val),
      });
    }
  }
}

function formatBlock(selector: string, declarations: Array<{ name: string; value: string }>): string {
  const lines = declarations.map((d) => `  ${d.name}: ${d.value};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

function main(): void {
  const rawJson = readFileSync(path.join(srcDir, 'tokens.json'), 'utf8');
  const tokens = JSON.parse(rawJson) as TokensJson;

  const generated = generateAllSchemes({
    seed: brandConfig.defaultSeed,
    variant: 'tonal-spot',
    semanticSeeds: brandConfig.semanticSeeds,
  });

  const refEntries: Array<{ name: string; value: string }> = [];
  const sysEntries: Array<{ name: string; value: string }> = [];
  const compEntries: Array<{ name: string; value: string }> = [];

  // 1. Reference typefaces
  const typefaces: Record<string, readonly string[]> = {
    brand: brandConfig.defaultFontFamily.brand,
    plain: brandConfig.defaultFontFamily.plain,
    mono: brandConfig.defaultFontFamily.mono,
  };
  for (const [role, familyList] of Object.entries(typefaces)) {
    refEntries.push({
      name: `--${prefix}-ref-typeface-${role}`,
      value: formatFontFamily(familyList),
    });
  }

  // 2. Reference tonal palettes
  for (const paletteName of PALETTE_NAMES) {
    const palette = generated.palettes[paletteName];
    for (const tone of TONE_STOPS) {
      refEntries.push({
        name: `--${prefix}-ref-palette-${paletteName}-${tone}`,
        value: palette[tone],
      });
    }
  }

  // 3. System baseline (light standard) colors
  const sysColorNames: string[] = [];
  for (const role of ALL_COLOR_ROLES) {
    const varName = `--${prefix}-sys-color-${role}`;
    sysColorNames.push(varName);
    sysEntries.push({
      name: varName,
      value: generated.schemes.light.standard[role],
    });
  }

  // 4. System typescale (both shorthand + individual props + emphasized)
  for (const [role, spec] of Object.entries(tokens.sys.typescale)) {
    const familyKey = spec.family ?? (role.startsWith('display-') || role.startsWith('headline-') ? 'brand' : 'plain');
    const familyVar = `var(--${prefix}-ref-typeface-${familyKey})`;
    const emphasizedWeight = spec.emphasizedWeight ?? (spec.weight >= 500 ? 700 : 500);

    const familyName = `--${prefix}-sys-typescale-${role}-font-family`;
    const sizeName = `--${prefix}-sys-typescale-${role}-size`;
    const lineName = `--${prefix}-sys-typescale-${role}-line-height`;
    const weightName = `--${prefix}-sys-typescale-${role}-weight`;
    const trackingName = `--${prefix}-sys-typescale-${role}-tracking`;
    const shorthandName = `--${prefix}-sys-typescale-${role}`;
    const empWeightName = `--${prefix}-sys-typescale-${role}-emphasized-weight`;
    const empShorthandName = `--${prefix}-sys-typescale-${role}-emphasized`;

    sysEntries.push(
      { name: familyName, value: familyVar },
      { name: sizeName, value: spec.size },
      { name: lineName, value: spec.line },
      { name: weightName, value: String(spec.weight) },
      { name: trackingName, value: spec.tracking },
      {
        name: shorthandName,
        value: `var(${weightName}) var(${sizeName})/var(${lineName}) var(${familyName})`,
      },
      { name: empWeightName, value: String(emphasizedWeight) },
      {
        name: empShorthandName,
        value: `var(${empWeightName}) var(${sizeName})/var(${lineName}) var(${familyName})`,
      },
    );
  }

  // 5. System shape
  for (const [shapeName, shapeValue] of Object.entries(tokens.sys.shape)) {
    sysEntries.push({
      name: `--${prefix}-sys-shape-${shapeName}`,
      value: shapeValue,
    });
  }

  // 6. System elevation
  for (const [level, spec] of Object.entries(tokens.sys.elevation)) {
    const tintNum = Number.parseFloat(spec.tint);
    const tintPercent = Number.isFinite(tintNum) ? `${Math.round(tintNum * 100)}%` : '0%';
    sysEntries.push(
      { name: `--${prefix}-sys-elevation-${level}-shadow`, value: spec.shadow },
      { name: `--${prefix}-sys-elevation-${level}-tint`, value: tintPercent },
    );
  }

  // 7. System state
  sysEntries.push(
    { name: `--${prefix}-sys-state-hover-opacity`, value: String(tokens.sys.state['hover-opacity']) },
    { name: `--${prefix}-sys-state-focus-opacity`, value: String(tokens.sys.state['focus-opacity']) },
    { name: `--${prefix}-sys-state-pressed-opacity`, value: String(tokens.sys.state['pressed-opacity']) },
    { name: `--${prefix}-sys-state-dragged-opacity`, value: String(tokens.sys.state['dragged-opacity']) },
    {
      name: `--${prefix}-sys-state-disabled-content-opacity`,
      value: String(tokens.sys.state['disabled-content-opacity']),
    },
    {
      name: `--${prefix}-sys-state-disabled-container-opacity`,
      value: String(tokens.sys.state['disabled-container-opacity']),
    },
    {
      name: `--${prefix}-sys-state-focus-ring-width`,
      value: tokens.sys.state['focus-ring'].width,
    },
    {
      name: `--${prefix}-sys-state-focus-ring-offset`,
      value: tokens.sys.state['focus-ring'].offset,
    },
    {
      name: `--${prefix}-sys-state-focus-ring-color`,
      value: resolveTokenRef(tokens.sys.state['focus-ring'].color),
    },
  );

  // 8. System motion (easing, duration, spring)
  for (const [easingName, easingValue] of Object.entries(tokens.sys.motion.easing)) {
    sysEntries.push({
      name: `--${prefix}-sys-motion-easing-${easingName}`,
      value: easingValue,
    });
  }
  const spatialLinear = buildSpringLinearEasing(
    tokens.sys.motion.spring.spatial.stiffness,
    tokens.sys.motion.spring.spatial.damping,
  );
  const effectsLinear = buildSpringLinearEasing(
    tokens.sys.motion.spring.effects.stiffness,
    tokens.sys.motion.spring.effects.damping,
  );
  sysEntries.push(
    { name: `--${prefix}-sys-motion-easing-spring-spatial`, value: spatialLinear },
    { name: `--${prefix}-sys-motion-easing-spring-effects`, value: effectsLinear },
    {
      name: `--${prefix}-sys-motion-spring-spatial-stiffness`,
      value: String(tokens.sys.motion.spring.spatial.stiffness),
    },
    {
      name: `--${prefix}-sys-motion-spring-spatial-damping`,
      value: String(tokens.sys.motion.spring.spatial.damping),
    },
    {
      name: `--${prefix}-sys-motion-spring-effects-stiffness`,
      value: String(tokens.sys.motion.spring.effects.stiffness),
    },
    {
      name: `--${prefix}-sys-motion-spring-effects-damping`,
      value: String(tokens.sys.motion.spring.effects.damping),
    },
  );

  const durationNames = Object.keys(tokens.sys.motion.duration);
  for (const [durationName, durationValue] of Object.entries(tokens.sys.motion.duration)) {
    sysEntries.push({
      name: `--${prefix}-sys-motion-duration-${durationName}`,
      value: durationValue,
    });
  }

  // 9. Space, breakpoints, icons, touch-target, scrim-opacity, z-index
  for (const [spaceKey, spaceVal] of Object.entries(tokens.sys.space)) {
    sysEntries.push({ name: `--${prefix}-sys-space-${spaceKey}`, value: spaceVal });
  }
  for (const [bpKey, bpVal] of Object.entries(tokens.sys.breakpoint)) {
    sysEntries.push({ name: `--${prefix}-sys-breakpoint-${bpKey}`, value: bpVal });
  }
  for (const [iconKey, iconVal] of Object.entries(tokens.sys.icon.size)) {
    sysEntries.push({ name: `--${prefix}-sys-icon-size-${iconKey}`, value: iconVal });
  }
  for (const [symKey, symVal] of Object.entries(tokens.sys.icon.symbols)) {
    sysEntries.push({ name: `--${prefix}-sys-icon-symbols-${symKey}`, value: String(symVal) });
  }
  sysEntries.push(
    { name: `--${prefix}-sys-touch-target`, value: tokens.sys['touch-target'] },
    { name: `--${prefix}-sys-scrim-opacity`, value: String(tokens.sys['scrim-opacity']) },
  );
  for (const [zKey, zVal] of Object.entries(tokens.sys['z-index'])) {
    sysEntries.push({ name: `--${prefix}-sys-z-index-${zKey}`, value: String(zVal) });
  }

  // 10. Component tokens
  flattenEntries(tokens.comp, ['comp'], compEntries);

  // Build scheme selector blocks
  const schemeDecl = (mode: ColorMode, contrast: ContrastLevel) =>
    ALL_COLOR_ROLES.map((role: SystemColorRole) => ({
      name: `--${prefix}-sys-color-${role}`,
      value: generated.schemes[mode][contrast][role],
    }));

  const reducedDurationDecls = durationNames.map((name) => ({
    name: `--${prefix}-sys-motion-duration-${name}`,
    value: name.startsWith('short') ? '0ms' : '50ms',
  }));
  const standardEasing =
    tokens.sys.motion.easing['standard'] ?? 'cubic-bezier(0.2, 0, 0, 1)';
  const reducedMotionDecls = [
    ...reducedDurationDecls,
    {
      name: `--${prefix}-sys-motion-easing-spring-spatial`,
      value: standardEasing,
    },
    {
      name: `--${prefix}-sys-motion-easing-spring-effects`,
      value: standardEasing,
    },
  ];

  const cssSections = [
    `/* Generated by @aura/tokens build-tokens.ts — do not edit directly. */`,
    `@layer ${prefix}.tokens {`,
    formatBlock(`:root,\n[data-${prefix}-theme="light"]`, [...refEntries, ...sysEntries, ...compEntries]),
    formatBlock(
      `[data-${prefix}-theme="light"][data-${prefix}-contrast="standard"]`,
      schemeDecl('light', 'standard'),
    ),
    formatBlock(
      `[data-${prefix}-contrast="medium"],\n[data-${prefix}-theme="light"][data-${prefix}-contrast="medium"]`,
      schemeDecl('light', 'medium'),
    ),
    formatBlock(
      `[data-${prefix}-contrast="high"],\n[data-${prefix}-theme="light"][data-${prefix}-contrast="high"]`,
      schemeDecl('light', 'high'),
    ),
    formatBlock(
      `[data-${prefix}-theme="dark"],\n[data-${prefix}-theme="dark"][data-${prefix}-contrast="standard"]`,
      schemeDecl('dark', 'standard'),
    ),
    formatBlock(
      `[data-${prefix}-theme="dark"][data-${prefix}-contrast="medium"]`,
      schemeDecl('dark', 'medium'),
    ),
    formatBlock(
      `[data-${prefix}-theme="dark"][data-${prefix}-contrast="high"]`,
      schemeDecl('dark', 'high'),
    ),
    formatBlock(
      `[data-${prefix}-motion="expressive"]`,
      [
        { name: `--${prefix}-sys-motion-easing-emphasized`, value: spatialLinear },
        { name: `--${prefix}-sys-motion-easing-standard`, value: effectsLinear },
      ],
    ),
    formatBlock(`[data-${prefix}-motion="reduced"]`, reducedMotionDecls),
    `@media (prefers-reduced-motion: reduce) {\n${formatBlock(':root', reducedMotionDecls)
      .split('\n')
      .map((l) => `  ${l}`)
      .join('\n')}\n}`,
    `}`,
  ];

  // Clean dist & generated dirs before writing
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });
  mkdirSync(generatedDir, { recursive: true });

  writeFileSync(path.join(distDir, 'tokens.css'), `${cssSections.join('\n\n')}\n`, 'utf8');

  // Emit resolved W3C DTCG JSON
  const resolvedTokensJson = {
    ...tokens,
    meta: {
      ...tokens.meta,
      prefix: brandConfig.prefix,
      seed: brandConfig.defaultSeed,
    },
    ref: {
      typeface: {
        brand: { $type: 'fontFamily', $value: brandConfig.defaultFontFamily.brand },
        plain: { $type: 'fontFamily', $value: brandConfig.defaultFontFamily.plain },
        mono: { $type: 'fontFamily', $value: brandConfig.defaultFontFamily.mono },
      },
      palette: generated.palettes,
    },
    sys: {
      ...tokens.sys,
      color: {
        light: generated.schemes.light.standard,
        'light-medium': generated.schemes.light.medium,
        'light-high': generated.schemes.light.high,
        dark: generated.schemes.dark.standard,
        'dark-medium': generated.schemes.dark.medium,
        'dark-high': generated.schemes.dark.high,
        'semantic-extra': tokens.sys.color['semantic-extra'],
      },
    },
  };
  writeFileSync(
    path.join(distDir, 'tokens.json'),
    `${JSON.stringify(resolvedTokensJson, null, 2)}\n`,
    'utf8',
  );

  // Emit typed TS token definitions
  const refNames = refEntries.map((d) => d.name);
  const sysNames = sysEntries.map((d) => d.name);
  const compNames = compEntries.map((d) => d.name);

  const toUnion = (names: readonly string[]) =>
    names.length === 0 ? 'never' : names.map((n) => `  | '${n}'`).join('\n');

  const toConstArray = (names: readonly string[]) =>
    `[\n${names.map((n) => `  '${n}',`).join('\n')}\n] as const`;

  const tsOutput = `/* Generated by @aura/tokens build-tokens.ts — do not edit directly. */

export const BRAND_CONFIG = ${JSON.stringify(brandConfig, null, 2)} as const;

export const TOKEN_PREFIX = '${prefix}' as const;

export const REF_TOKEN_NAMES = ${toConstArray(refNames)};

export const SYS_COLOR_TOKEN_NAMES = ${toConstArray(sysColorNames)};

export const SYS_TOKEN_NAMES = ${toConstArray(sysNames)};

export const COMP_TOKEN_NAMES = ${toConstArray(compNames)};

export type AuraRefToken =
${toUnion(refNames)};

export type AuraSysColorToken =
${toUnion(sysColorNames)};

export type AuraSysToken =
${toUnion(sysNames)};

export type AuraCompToken =
${toUnion(compNames)};

export type AuraToken = AuraRefToken | AuraSysToken | AuraCompToken;

export type AuraTypescaleRole =
${toUnion(Object.keys(tokens.sys.typescale))};

export type AuraShapeToken =
${toUnion(Object.keys(tokens.sys.shape))};

export type AuraElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type AuraMotionEasingToken =
${toUnion([...Object.keys(tokens.sys.motion.easing), 'spring-spatial', 'spring-effects'])};

export type AuraMotionDurationToken =
${toUnion(Object.keys(tokens.sys.motion.duration))};

export type AuraSpaceToken =
${toUnion(Object.keys(tokens.sys.space))};

export type AuraBreakpointToken =
${toUnion(Object.keys(tokens.sys.breakpoint))};

export type AuraIconSizeToken =
${toUnion(Object.keys(tokens.sys.icon.size))};

export const TYPESCALES = ${JSON.stringify(tokens.sys.typescale, null, 2)} as const;
export const SHAPES = ${JSON.stringify(tokens.sys.shape, null, 2)} as const;
export const ELEVATIONS = ${JSON.stringify(tokens.sys.elevation, null, 2)} as const;
export const MOTION_EASINGS = ${JSON.stringify(
    {
      ...tokens.sys.motion.easing,
      'spring-spatial': spatialLinear,
      'spring-effects': effectsLinear,
    },
    null,
    2,
  )} as const;
export const MOTION_DURATIONS = ${JSON.stringify(tokens.sys.motion.duration, null, 2)} as const;
export const SPACES = ${JSON.stringify(tokens.sys.space, null, 2)} as const;
export const BREAKPOINTS = ${JSON.stringify(tokens.sys.breakpoint, null, 2)} as const;

export function tokenVar<T extends AuraToken>(token: T): \`var(\${T})\` {
  return \`var(\${token})\`;
}
`;

  writeFileSync(path.join(generatedDir, 'tokens.ts'), tsOutput, 'utf8');
  console.log(
    `Built tokens (${refNames.length} ref, ${sysNames.length} sys, ${compNames.length} comp) for prefix "${prefix}".`,
  );
}

main();
