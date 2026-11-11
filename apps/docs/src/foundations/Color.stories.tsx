import { Surface, Text, useTheme } from '@aura/core';
import {
  PALETTE_NAMES,
  TONE_STOPS,
  generateColorScheme,
} from '@aura/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const ROLE_PAIRS: ReadonlyArray<{
  readonly title: string;
  readonly items: ReadonlyArray<{
    readonly name: string;
    readonly bgVar: string;
    readonly fgVar: string;
  }>;
}> = [
  {
    title: 'Accent & Fixed Roles',
    items: [
      { name: 'primary / on-primary', bgVar: '--aura-sys-color-primary', fgVar: '--aura-sys-color-on-primary' },
      { name: 'primary-container / on-primary-container', bgVar: '--aura-sys-color-primary-container', fgVar: '--aura-sys-color-on-primary-container' },
      { name: 'primary-fixed / on-primary-fixed', bgVar: '--aura-sys-color-primary-fixed', fgVar: '--aura-sys-color-on-primary-fixed' },
      { name: 'primary-fixed-dim / on-primary-fixed-variant', bgVar: '--aura-sys-color-primary-fixed-dim', fgVar: '--aura-sys-color-on-primary-fixed-variant' },
      { name: 'secondary / on-secondary', bgVar: '--aura-sys-color-secondary', fgVar: '--aura-sys-color-on-secondary' },
      { name: 'secondary-container / on-secondary-container', bgVar: '--aura-sys-color-secondary-container', fgVar: '--aura-sys-color-on-secondary-container' },
      { name: 'tertiary / on-tertiary', bgVar: '--aura-sys-color-tertiary', fgVar: '--aura-sys-color-on-tertiary' },
      { name: 'tertiary-container / on-tertiary-container', bgVar: '--aura-sys-color-tertiary-container', fgVar: '--aura-sys-color-on-tertiary-container' },
    ],
  },
  {
    title: 'Surfaces & Outlines',
    items: [
      { name: 'surface / on-surface', bgVar: '--aura-sys-color-surface', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-dim / on-surface', bgVar: '--aura-sys-color-surface-dim', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-bright / on-surface', bgVar: '--aura-sys-color-surface-bright', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-container-lowest', bgVar: '--aura-sys-color-surface-container-lowest', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-container-low', bgVar: '--aura-sys-color-surface-container-low', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-container', bgVar: '--aura-sys-color-surface-container', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-container-high', bgVar: '--aura-sys-color-surface-container-high', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-container-highest', bgVar: '--aura-sys-color-surface-container-highest', fgVar: '--aura-sys-color-on-surface' },
      { name: 'surface-variant / on-surface-variant', bgVar: '--aura-sys-color-surface-variant', fgVar: '--aura-sys-color-on-surface-variant' },
      { name: 'inverse-surface / inverse-on-surface', bgVar: '--aura-sys-color-inverse-surface', fgVar: '--aura-sys-color-inverse-on-surface' },
    ],
  },
  {
    title: 'Semantic & Harmonized Roles',
    items: [
      { name: 'error / on-error', bgVar: '--aura-sys-color-error', fgVar: '--aura-sys-color-on-error' },
      { name: 'error-container / on-error-container', bgVar: '--aura-sys-color-error-container', fgVar: '--aura-sys-color-on-error-container' },
      { name: 'success / on-success', bgVar: '--aura-sys-color-success', fgVar: '--aura-sys-color-on-success' },
      { name: 'success-container / on-success-container', bgVar: '--aura-sys-color-success-container', fgVar: '--aura-sys-color-on-success-container' },
      { name: 'warning / on-warning', bgVar: '--aura-sys-color-warning', fgVar: '--aura-sys-color-on-warning' },
      { name: 'warning-container / on-warning-container', bgVar: '--aura-sys-color-warning-container', fgVar: '--aura-sys-color-on-warning-container' },
      { name: 'info / on-info', bgVar: '--aura-sys-color-info', fgVar: '--aura-sys-color-on-info' },
      { name: 'info-container / on-info-container', bgVar: '--aura-sys-color-info-container', fgVar: '--aura-sys-color-on-info-container' },
    ],
  },
];

function SystemRolesDemo() {
  const { seed, resolvedMode, contrast, variant } = useTheme();
  return (
    <div className="aura-docs-stack">
      <Surface color="surface-container-low" shape="medium" outlined style={{ padding: '16px' }}>
        <Text role="title-medium">Active HCT Scheme</Text>
        <Text role="body-medium" color="on-surface-variant">
          Seed: {seed} · Mode: {resolvedMode} · Contrast: {contrast} · Variant: {variant}
        </Text>
      </Surface>

      {ROLE_PAIRS.map((group) => (
        <section key={group.title} className="aura-docs-stack" style={{ gap: '12px' }}>
          <Text role="title-large" as="h2">
            {group.title}
          </Text>
          <div className="aura-docs-grid">
            {group.items.map((item) => (
              <div
                key={item.name}
                className="aura-docs-swatch"
                style={{
                  backgroundColor: `var(${item.bgVar})`,
                  color: `var(${item.fgVar})`,
                  border: '1px solid var(--aura-sys-color-outline-variant)',
                }}
              >
                <Text role="label-large" as="span">
                  {item.name}
                </Text>
                <span className="aura-docs-mono">{item.bgVar}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TonalPalettesDemo() {
  const { seed, resolvedMode, contrast, variant } = useTheme();
  const scheme = generateColorScheme({ seed, mode: resolvedMode, contrast, variant });

  return (
    <div className="aura-docs-stack">
      {PALETTE_NAMES.map((paletteName) => (
        <div key={paletteName} className="aura-docs-stack" style={{ gap: '8px' }}>
          <Text role="title-medium" as="h3">
            {paletteName}
          </Text>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(44px, 1fr))', gap: '4px' }}>
            {TONE_STOPS.map((tone) => {
              const hex = scheme.palettes[paletteName][tone];
              const textColor = tone <= 40 ? '#FFFFFF' : '#111111';
              return (
                <div
                  key={tone}
                  style={{
                    backgroundColor: hex,
                    color: textColor,
                    padding: '8px 4px',
                    borderRadius: 'var(--aura-sys-shape-extra-small)',
                    textAlign: 'center',
                    border: '1px solid var(--aura-sys-color-outline-variant)',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600 }}>{tone}</div>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--aura-ref-typeface-mono)' }}>{hex}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Color',
};

export default meta;

type Story = StoryObj;

export const SystemRoles: Story = {
  render: () => <SystemRolesDemo />,
};

export const TonalPalettes: Story = {
  render: () => <TonalPalettesDemo />,
};
