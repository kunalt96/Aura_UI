import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FAB, type FABColor, type FABSize } from '@aura/core';

const meta: Meta<typeof FAB> = {
  title: 'Components/FAB',
  component: FAB,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'regular', 'large'],
      description: 'M3 container size step',
    },
    color: {
      control: 'select',
      options: ['primary', 'surface', 'secondary', 'tertiary'],
      description: 'Semantic color mapping',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

export const Default: Story = {
  args: {
    icon: 'edit',
    'aria-label': 'Edit document',
    size: 'regular',
    color: 'primary',
    disabled: false,
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes: readonly FABSize[] = ['small', 'regular', 'large'];

    return (
      <div className="aura-docs-row" style={{ alignItems: 'center' }}>
        {sizes.map((size) => (
          <FAB
            key={size}
            size={size}
            icon="add"
            aria-label={`Add item (${size})`}
          />
        ))}
      </div>
    );
  },
};

export const ColorVariants: Story = {
  render: () => {
    const colors: readonly FABColor[] = ['primary', 'surface', 'secondary', 'tertiary'];

    return (
      <div className="aura-docs-stack">
        <div className="aura-docs-row" style={{ alignItems: 'center' }}>
          {colors.map((color) => (
            <FAB
              key={color}
              color={color}
              icon="palette"
              aria-label={`Palette (${color})`}
            />
          ))}
        </div>
        <div className="aura-docs-row" style={{ alignItems: 'center' }}>
          {colors.map((color) => (
            <FAB
              key={`disabled-${color}`}
              color={color}
              icon="palette"
              disabled
              aria-label={`Disabled palette (${color})`}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Extended: Story = {
  render: () => (
    <div className="aura-docs-row">
      <FAB icon="add" label="New Task" color="primary" />
      <FAB icon="navigation" label="Navigate" color="surface" />
      <FAB icon="edit" label="Compose Message" color="secondary" />
      <FAB icon="bookmark" label="Saved Items" color="tertiary" />
    </div>
  ),
};

function CollapsibleFABDemo() {
  const [extended, setExtended] = useState(true);

  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-row" style={{ alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setExtended((prev) => !prev);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--aura-sys-shape-full)',
            border: '1px solid var(--aura-sys-color-outline)',
            backgroundColor: 'var(--aura-sys-color-surface-container)',
            color: 'var(--aura-sys-color-on-surface)',
            cursor: 'pointer',
          }}
        >
          Toggle Extended State: {extended ? 'Expanded' : 'Collapsed'}
        </button>

        <FAB
          icon="add"
          label="Create Incident"
          extended={extended}
          aria-label="Create Incident"
        />
      </div>
    </div>
  );
}

export const CollapsibleExtendedFAB: Story = {
  render: () => <CollapsibleFABDemo />,
};

export const PolymorphicLinkFAB: Story = {
  render: () => (
    <div className="aura-docs-row">
      <FAB
        as="a"
        href="#compose"
        icon="send"
        label="Send Email"
        color="primary"
      />
      <FAB
        as="a"
        href="https://github.com/kunalt96/Aura_UI"
        target="_blank"
        rel="noreferrer"
        icon="code"
        aria-label="GitHub Repository"
        color="surface"
      />
    </div>
  ),
};
