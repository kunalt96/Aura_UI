import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, type ButtonSize, type ButtonVariant } from '@aura/core';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'elevated', 'outlined', 'text'],
      description: 'Material Design 3 visual variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'M3 container height step',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Action Button',
    variant: 'filled',
    size: 'md',
    disabled: false,
    loading: false,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: readonly ButtonVariant[] = ['filled', 'tonal', 'elevated', 'outlined', 'text'];

    return (
      <div className="aura-docs-stack">
        <div className="aura-docs-row">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
        <div className="aura-docs-row">
          {variants.map((variant) => (
            <Button key={`disabled-${variant}`} variant={variant} disabled>
              Disabled {variant}
            </Button>
          ))}
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const sizes: readonly ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <div className="aura-docs-row" style={{ alignItems: 'center' }}>
        {sizes.map((size) => (
          <Button key={size} size={size} variant="filled" leadingIcon="star">
            Size {size.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        <Button variant="filled" leadingIcon="add">
          Leading Icon
        </Button>
        <Button variant="tonal" trailingIcon="arrow_forward">
          Trailing Icon
        </Button>
        <Button variant="elevated" leadingIcon="favorite" trailingIcon="expand_more">
          Both Icons
        </Button>
        <Button variant="outlined" leadingIcon="download">
          Download
        </Button>
        <Button variant="text" leadingIcon="share">
          Share
        </Button>
      </div>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="aura-docs-row">
      <Button variant="filled" loading>
        Saving Changes
      </Button>
      <Button variant="tonal" loading size="lg">
        Uploading Data
      </Button>
      <Button variant="outlined" loading size="sm">
        Processing
      </Button>
    </div>
  ),
};

function ToggleButtonDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="aura-docs-row">
      <Button
        variant="tonal"
        leadingIcon={selected ? 'check' : 'bookmark'}
        selected={selected}
        onClick={() => {
          setSelected((prev) => !prev);
        }}
      >
        {selected ? 'Bookmarked' : 'Add Bookmark'}
      </Button>

      <Button
        variant="outlined"
        selected={selected}
        leadingIcon={selected ? 'done' : 'filter_list'}
        onClick={() => {
          setSelected((prev) => !prev);
        }}
      >
        Filter Active: {selected ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
}

export const ToggleButton: Story = {
  render: () => <ToggleButtonDemo />,
};

export const PolymorphicLinkButton: Story = {
  render: () => (
    <div className="aura-docs-row">
      <Button as="a" href="#demo" variant="filled" leadingIcon="open_in_new">
        Link Element Button
      </Button>
      <Button as="a" href="#tonal" variant="outlined" trailingIcon="launch">
        Outlined Link
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ inlineSize: '360px', display: 'grid', gap: '12px' }}>
      <Button variant="filled" fullWidth leadingIcon="shopping_cart">
        Proceed to Checkout
      </Button>
      <Button variant="outlined" fullWidth>
        Save for Later
      </Button>
    </div>
  ),
};
