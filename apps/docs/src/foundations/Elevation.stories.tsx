import { Surface, Text } from '@aura/core';
import { ELEVATIONS, type AuraElevationLevel } from '@aura/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const LEVELS: readonly AuraElevationLevel[] = [0, 1, 2, 3, 4, 5];
const DP_MAP: Record<AuraElevationLevel, number> = {
  0: 0,
  1: 1,
  2: 3,
  3: 6,
  4: 8,
  5: 12,
};

function ElevationLevelsDemo() {
  return (
    <div className="aura-docs-grid">
      {LEVELS.map((level) => {
        const key = `level${level}` as const;
        const spec = ELEVATIONS[key];
        return (
          <Surface
            key={level}
            color="surface"
            shape="large"
            elevation={level}
            style={{
              padding: '24px',
              minBlockSize: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Text role="title-medium" as="div">
                Level {level} ({DP_MAP[level]}dp)
              </Text>
              <Text role="body-small" color="on-surface-variant">
                Surface-tint overlay: {Math.round(Number.parseFloat(spec.tint) * 100)}%
              </Text>
            </div>
            <span className="aura-docs-mono">--aura-sys-elevation-{key}</span>
          </Surface>
        );
      })}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Elevation',
};

export default meta;

type Story = StoryObj;

export const Levels: Story = {
  render: () => <ElevationLevelsDemo />,
};
