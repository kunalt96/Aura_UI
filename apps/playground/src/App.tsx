import { useState, type ReactElement } from 'react';
import { BRAND_CONFIG } from '@aura/tokens';
import {
  Elevation,
  FocusRing,
  Icon,
  Presence,
  Ripple,
  StateLayer,
  Surface,
  Text,
  ThemeProvider,
  VisuallyHidden,
  useTheme,
  useWindowSizeClass,
  type ThemeContrast,
  type ThemeMode,
  type ThemeVariant,
} from '@aura/core';

const CONTRASTS: readonly ThemeContrast[] = ['standard', 'medium', 'high'];
const SCHEME_VARIANTS: readonly ThemeVariant[] = [
  'tonal-spot',
  'vibrant',
  'expressive',
  'neutral',
  'monochrome',
  'fidelity',
];

interface ActionButtonProps {
  readonly label: string;
  readonly iconName: string;
  readonly selected?: boolean;
  readonly onClick: () => void;
}

function ActionButton({ label, iconName, selected = false, onClick }: ActionButtonProps): ReactElement {
  return (
    <button
      type="button"
      className="aura-playground-action"
      data-selected={selected}
      aria-pressed={selected}
      onClick={onClick}
    >
      <StateLayer />
      <Ripple />
      <FocusRing />
      <Icon name={iconName} size="dense" decorative />
      <span>{label}</span>
    </button>
  );
}

interface PlaygroundContentProps {
  readonly dir: 'ltr' | 'rtl';
  readonly onToggleDir: () => void;
}

function PlaygroundContent({ dir, onToggleDir }: PlaygroundContentProps): ReactElement {
  const { seed, mode, resolvedMode, contrast, variant, motion, setSeed, setMode, setContrast, setVariant, setMotion } =
    useTheme();
  const sizeClass = useWindowSizeClass();
  const [showPresenceBanner, setShowPresenceBanner] = useState(true);

  const cycleMode = (): void => {
    const order: readonly ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(mode);
    const next = order[(currentIndex + 1) % order.length] ?? 'light';
    setMode(next);
  };

  const cycleContrast = (): void => {
    const currentIndex = CONTRASTS.indexOf(contrast);
    const next = CONTRASTS[(currentIndex + 1) % CONTRASTS.length] ?? 'standard';
    setContrast(next);
  };

  const cycleVariant = (): void => {
    const currentIndex = SCHEME_VARIANTS.indexOf(variant);
    const next: ThemeVariant = SCHEME_VARIANTS[(currentIndex + 1) % SCHEME_VARIANTS.length] ?? 'tonal-spot';
    setVariant(next);
  };

  const cycleMotion = (): void => {
    const next = motion === 'standard' ? 'expressive' : motion === 'expressive' ? 'reduced' : 'standard';
    setMotion(next);
  };

  return (
    <Surface as="main" color="surface" className="aura-playground-shell">
      <div className="aura-playground-inner">
        <header className="aura-playground-header">
          <div>
            <Text role="headline-medium" emphasized>
              {BRAND_CONFIG.name} — M0 Playground
            </Text>
            <Text role="body-medium" color="on-surface-variant">
              Seed {seed} · Mode {mode} ({resolvedMode}) · Contrast {contrast} · Variant {variant} · Motion {motion} ·
              Window {sizeClass} · Direction {dir.toUpperCase()}
            </Text>
          </div>

          <div className="aura-playground-controls">
            <label htmlFor="playground-seed-picker" className="aura-playground-row">
              <VisuallyHidden>Brand seed color</VisuallyHidden>
              <input
                id="playground-seed-picker"
                type="color"
                aria-label="Brand seed color"
                className="aura-playground-seed-input"
                value={seed}
                onChange={(event) => {
                  setSeed(event.target.value);
                }}
              />
            </label>
            <ActionButton
              label={`Mode: ${mode}`}
              iconName={resolvedMode === 'dark' ? 'dark_mode' : 'light_mode'}
              onClick={cycleMode}
            />
            <ActionButton label={`Contrast: ${contrast}`} iconName="contrast" onClick={cycleContrast} />
            <ActionButton label={`Variant: ${variant}`} iconName="palette" onClick={cycleVariant} />
            <ActionButton label={`Motion: ${motion}`} iconName="animation" onClick={cycleMotion} />
            <ActionButton
              label={`Dir: ${dir.toUpperCase()}`}
              iconName="format_textdirection_r_to_l"
              selected={dir === 'rtl'}
              onClick={onToggleDir}
            />
          </div>
        </header>

        <section aria-label="Surface and color roles" className="aura-playground-grid">
          <Surface color="primary-container" shape="large" elevation={1} className="aura-playground-card">
            <Elevation level={1} />
            <Text role="title-medium" emphasized>
              Primary Container
            </Text>
            <Text role="body-medium">Dynamic HCT palette generated live from the active seed color.</Text>
          </Surface>

          <Surface color="secondary-container" shape="large" elevation={2} className="aura-playground-card">
            <Text role="title-medium" emphasized>
              Secondary Container
            </Text>
            <Text role="body-medium">Supports light/dark, standard/medium/high contrast, and 6 scheme variants.</Text>
          </Surface>

          <Surface color="tertiary-container" shape="large" elevation={3} className="aura-playground-card">
            <Text role="title-medium" emphasized>
              Tertiary Container
            </Text>
            <Text role="body-medium">Contrast pairs stay legible across every Material tone step.</Text>
          </Surface>

          <Surface color="surface-container-high" shape="large" outlined className="aura-playground-card">
            <Text role="title-medium" emphasized>
              Harmonized Semantics
            </Text>
            <div className="aura-playground-row">
              <Surface color="success-container" shape="small" className="aura-playground-card">
                <Text role="label-medium">Success</Text>
              </Surface>
              <Surface color="warning-container" shape="small" className="aura-playground-card">
                <Text role="label-medium">Warning</Text>
              </Surface>
              <Surface color="info-container" shape="small" className="aura-playground-card">
                <Text role="label-medium">Info</Text>
              </Surface>
              <Surface color="error-container" shape="small" className="aura-playground-card">
                <Text role="label-medium">Error</Text>
              </Surface>
            </div>
          </Surface>
        </section>

        <section aria-label="Interactive primitives smoke test" className="aura-playground-card">
          <div className="aura-playground-row">
            <ActionButton
              label={showPresenceBanner ? 'Hide Presence Banner' : 'Show Presence Banner'}
              iconName="visibility"
              selected={showPresenceBanner}
              onClick={() => {
                setShowPresenceBanner((prev) => !prev);
              }}
            />
          </div>

          <Presence present={showPresenceBanner}>
            <Surface color="surface-container" shape="medium" outlined className="aura-playground-card">
              <Text role="title-small">Presence & Reduced Motion Check</Text>
              <Text role="body-small" color="on-surface-variant">
                Keyboard Tab onto controls to verify the 3px FocusRing and click for radial Ripple.
              </Text>
            </Surface>
          </Presence>
        </section>
      </div>
    </Surface>
  );
}

export function App(): ReactElement {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  return (
    <ThemeProvider global dir={dir}>
      <PlaygroundContent
        dir={dir}
        onToggleDir={() => {
          setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'));
        }}
      />
    </ThemeProvider>
  );
}
