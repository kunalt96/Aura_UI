import { Surface, Text } from '@aura/core';
import { TYPESCALES, type AuraTypescaleRole } from '@aura/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const ROLES = Object.keys(TYPESCALES) as AuraTypescaleRole[];

function TypographyScaleDemo({ emphasized = false }: { readonly emphasized?: boolean }) {
  return (
    <div className="aura-docs-stack">
      {ROLES.map((role) => {
        const spec = TYPESCALES[role];
        return (
          <Surface
            key={role}
            color="surface-container-low"
            shape="medium"
            outlined
            style={{ padding: '16px 20px', display: 'grid', gap: '8px' }}
          >
            <div className="aura-docs-row" style={{ justifyContent: 'space-between' }}>
              <Text role="label-medium" color="primary" as="span">
                {role}
                {emphasized ? ' (emphasized)' : ''}
              </Text>
              <span className="aura-docs-mono" style={{ color: 'var(--aura-sys-color-on-surface-variant)' }}>
                {spec.size} / {spec.line} · w{emphasized ? spec.emphasizedWeight : spec.weight} · tracking{' '}
                {spec.tracking}
              </span>
            </div>
            <Text role={role} emphasized={emphasized} as="div">
              Material Design 3 dynamic typography scale — Aa Bb Cc 0123
            </Text>
          </Surface>
        );
      })}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => <TypographyScaleDemo />,
};

export const EmphasizedScale: Story = {
  render: () => <TypographyScaleDemo emphasized />,
};
