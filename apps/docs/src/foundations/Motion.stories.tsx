import { useState } from 'react';
import { FocusRing, Ripple, StateLayer, Surface, Text } from '@aura/core';
import { MOTION_DURATIONS, MOTION_EASINGS } from '@aura/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const EASING_ENTRIES = Object.entries(MOTION_EASINGS);
const DURATION_ENTRIES = Object.entries(MOTION_DURATIONS);

function MotionPlayground() {
  const [active, setActive] = useState(false);

  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        <button
          type="button"
          className="aura-docs-interactive-btn"
          style={{
            backgroundColor: 'var(--aura-sys-color-primary)',
            color: 'var(--aura-sys-color-on-primary)',
            borderColor: 'transparent',
          }}
          onClick={() => {
            setActive((prev) => !prev);
          }}
        >
          <StateLayer />
          <Ripple />
          <FocusRing />
          {active ? 'Reset tracks' : 'Play easing comparison'}
        </button>
      </div>

      <div className="aura-docs-stack" style={{ gap: '12px' }}>
        <Text role="title-large" as="h2">
          Easing Curves (500ms)
        </Text>
        {EASING_ENTRIES.map(([name, value]) => (
          <Surface
            key={name}
            color="surface-container-low"
            shape="medium"
            outlined
            style={{ padding: '12px 16px', display: 'grid', gap: '8px' }}
          >
            <div className="aura-docs-row" style={{ justifyContent: 'space-between' }}>
              <Text role="label-large" as="span">
                {name}
              </Text>
              <span className="aura-docs-mono" style={{ maxInlineSize: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </div>
            <div
              style={{
                backgroundColor: 'var(--aura-sys-color-surface-container-highest)',
                borderRadius: 'var(--aura-sys-shape-full)',
                padding: '4px',
              }}
            >
              <div
                style={{
                  inlineSize: '48px',
                  blockSize: '20px',
                  borderRadius: 'var(--aura-sys-shape-full)',
                  backgroundColor: 'var(--aura-sys-color-primary)',
                  transform: active ? 'translateX(260px)' : 'translateX(0)',
                  transitionProperty: 'transform',
                  transitionDuration: 'var(--aura-sys-motion-duration-long2)',
                  transitionTimingFunction: `var(--aura-sys-motion-easing-${name})`,
                }}
              />
            </div>
          </Surface>
        ))}
      </div>

      <div className="aura-docs-stack" style={{ gap: '12px' }}>
        <Text role="title-large" as="h2">
          Duration Scale
        </Text>
        <div className="aura-docs-grid">
          {DURATION_ENTRIES.map(([name, value]) => (
            <Surface
              key={name}
              color="surface-container-low"
              shape="small"
              outlined
              style={{ padding: '12px 16px' }}
            >
              <Text role="label-large" as="div">
                {name}
              </Text>
              <span className="aura-docs-mono">
                {value} · --aura-sys-motion-duration-{name}
              </span>
            </Surface>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Motion',
};

export default meta;

type Story = StoryObj;

export const EasingAndDurations: Story = {
  render: () => <MotionPlayground />,
};
