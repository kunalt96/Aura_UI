import { Surface, Text } from '@aura/core';
import { SHAPES, type AuraShapeToken } from '@aura/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const SHAPE_ENTRIES = Object.entries(SHAPES) as Array<[AuraShapeToken, string]>;

function ShapeScaleDemo() {
  return (
    <div className="aura-docs-grid">
      {SHAPE_ENTRIES.map(([name, value]) => (
        <Surface
          key={name}
          color="primary-container"
          shape={name}
          outlined
          style={{
            padding: '24px',
            minBlockSize: '120px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Text role="title-medium" as="div">
            {name}
          </Text>
          <span className="aura-docs-mono">--aura-sys-shape-{name}: {value}</span>
        </Surface>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Shape',
};

export default meta;

type Story = StoryObj;

export const CornerScale: Story = {
  render: () => <ShapeScaleDemo />,
};
