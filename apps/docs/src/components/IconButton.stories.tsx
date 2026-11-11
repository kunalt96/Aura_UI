import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton, type IconButtonVariant } from '@aura/core';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'filled', 'tonal', 'outlined'],
      description: 'M3 visual variant',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    icon: 'settings',
    'aria-label': 'Settings',
    variant: 'standard',
    disabled: false,
    loading: false,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: readonly IconButtonVariant[] = ['standard', 'filled', 'tonal', 'outlined'];

    return (
      <div className="aura-docs-stack">
        <div className="aura-docs-row">
          {variants.map((variant) => (
            <IconButton
              key={variant}
              variant={variant}
              icon="favorite"
              aria-label={`Favorite (${variant})`}
            />
          ))}
        </div>
        <div className="aura-docs-row">
          {variants.map((variant) => (
            <IconButton
              key={`disabled-${variant}`}
              variant={variant}
              icon="favorite"
              disabled
              aria-label={`Disabled favorite (${variant})`}
            />
          ))}
        </div>
      </div>
    );
  },
};

function ToggleIconButtonDemo() {
  const [favorite, setFavorite] = useState(false);
  const [bookmarked, setBookmarked] = useState(true);

  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        <IconButton
          variant="standard"
          icon="favorite"
          selected={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => {
            setFavorite((prev) => !prev);
          }}
        />

        <IconButton
          variant="filled"
          icon="bookmark"
          selected={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onClick={() => {
            setBookmarked((prev) => !prev);
          }}
        />

        <IconButton
          variant="tonal"
          icon="star"
          selected={favorite}
          aria-label={favorite ? 'Unstar item' : 'Star item'}
          onClick={() => {
            setFavorite((prev) => !prev);
          }}
        />

        <IconButton
          variant="outlined"
          icon="notifications"
          selectedIcon="notifications_active"
          selected={bookmarked}
          aria-label={bookmarked ? 'Mute notifications' : 'Enable notifications'}
          onClick={() => {
            setBookmarked((prev) => !prev);
          }}
        />
      </div>
    </div>
  );
}

export const ToggleButton: Story = {
  render: () => <ToggleIconButtonDemo />,
};

export const LoadingStates: Story = {
  render: () => (
    <div className="aura-docs-row">
      <IconButton variant="standard" loading aria-label="Loading actions" />
      <IconButton variant="filled" loading aria-label="Loading submission" />
      <IconButton variant="tonal" loading aria-label="Loading refresh" />
      <IconButton variant="outlined" loading aria-label="Loading search" />
    </div>
  ),
};

export const NavigationToolbar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        backgroundColor: 'var(--aura-sys-color-surface-container)',
        borderRadius: 'var(--aura-sys-shape-medium)',
        inlineSize: '360px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <IconButton icon="arrow_back" aria-label="Go back" />
        <IconButton icon="menu" aria-label="Open menu" />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <IconButton icon="search" aria-label="Search" />
        <IconButton icon="more_vert" aria-label="More options" />
      </div>
    </div>
  ),
};

export const PolymorphicLinkIconButton: Story = {
  render: () => (
    <div className="aura-docs-row">
      <IconButton
        as="a"
        href="https://github.com/kunalt96/Aura_UI"
        target="_blank"
        rel="noreferrer"
        variant="tonal"
        icon="code"
        aria-label="View source code on GitHub"
      />
      <IconButton
        as="a"
        href="#external"
        variant="outlined"
        icon="open_in_new"
        aria-label="Open external resource"
      />
    </div>
  ),
};

