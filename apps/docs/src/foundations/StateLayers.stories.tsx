import { FocusRing, Ripple, StateLayer, Surface, Text } from '@aura/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const STATIC_STATES: ReadonlyArray<{
  readonly label: string;
  readonly token: string;
  readonly props: Record<string, boolean>;
}> = [
  { label: 'Resting (0%)', token: '0', props: {} },
  { label: 'Hover (8%)', token: '--aura-sys-state-hover-opacity', props: { hovered: true } },
  { label: 'Focus (10%)', token: '--aura-sys-state-focus-opacity', props: { focused: true } },
  { label: 'Pressed (10%)', token: '--aura-sys-state-pressed-opacity', props: { pressed: true } },
  { label: 'Dragged (16%)', token: '--aura-sys-state-dragged-opacity', props: { dragged: true } },
];

function StateLayersDemo() {
  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-stack" style={{ gap: '12px' }}>
        <Text role="title-large" as="h2">
          Interactive Surface (Hover, Tab for Focus Ring, Press for Ripple)
        </Text>
        <div className="aura-docs-row">
          <button
            type="button"
            className="aura-docs-interactive-btn"
            style={{
              backgroundColor: 'var(--aura-sys-color-primary)',
              color: 'var(--aura-sys-color-on-primary)',
              borderColor: 'transparent',
            }}
          >
            <StateLayer />
            <Ripple />
            <FocusRing />
            Primary interactive target
          </button>

          <button type="button" className="aura-docs-interactive-btn">
            <StateLayer />
            <Ripple />
            <FocusRing />
            Tonal / Outlined target
          </button>

          <button
            type="button"
            className="aura-docs-interactive-btn"
            disabled
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--aura-sys-color-on-surface) calc(var(--aura-sys-state-disabled-container-opacity) * 100%), transparent)',
              color:
                'color-mix(in srgb, var(--aura-sys-color-on-surface) calc(var(--aura-sys-state-disabled-content-opacity) * 100%), transparent)',
              cursor: 'not-allowed',
            }}
          >
            <StateLayer disabled />
            Disabled (12% container / 38% content)
          </button>
        </div>
      </div>

      <div className="aura-docs-stack" style={{ gap: '12px' }}>
        <Text role="title-large" as="h2">
          State Layer Opacity Tokens
        </Text>
        <div className="aura-docs-grid">
          {STATIC_STATES.map((item) => (
            <Surface
              key={item.label}
              color="secondary-container"
              shape="medium"
              style={{ padding: '20px', overflow: 'hidden' }}
            >
              <StateLayer {...item.props} />
              <div style={{ position: 'relative' }}>
                <Text role="title-medium" as="div">
                  {item.label}
                </Text>
                <span className="aura-docs-mono">{item.token}</span>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/State Layers',
};

export default meta;

type Story = StoryObj;

export const Showcase: Story = {
  render: () => <StateLayersDemo />,
};
