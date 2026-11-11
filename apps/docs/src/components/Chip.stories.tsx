import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip, type ChipVariant } from '@aura/core';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    variant: {
      control: 'select',
      options: ['assist', 'filter', 'input', 'suggestion'],
      description: 'Material Design 3 chip visual variant',
    },
    elevated: {
      control: 'boolean',
      description: 'Elevation level 1 instead of 1px outline',
    },
    selected: {
      control: 'boolean',
      description: 'Selected toggle state (filter / input chips)',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Assist Chip',
    variant: 'assist',
    elevated: false,
    leadingIcon: 'event',
    disabled: false,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants: readonly ChipVariant[] = ['assist', 'filter', 'input', 'suggestion'];

    return (
      <div className="aura-docs-stack" style={{ gap: '24px' }}>
        <div>
          <p style={{ margin: '0 0 12px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Flat (Outlined)</p>
          <div className="aura-docs-row">
            {variants.map((v) => (
              <Chip key={v} variant={v} leadingIcon={v === 'assist' ? 'schedule' : undefined}>
                {v.charAt(0).toUpperCase() + v.slice(1)} Chip
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p style={{ margin: '0 0 12px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Elevated (Surface-Container-Low + Shadow Level 1)</p>
          <div className="aura-docs-row">
            {variants.map((v) => (
              <Chip key={v} variant={v} elevated leadingIcon={v === 'assist' ? 'bookmark' : undefined}>
                Elevated {v.charAt(0).toUpperCase() + v.slice(1)}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

function FilterChipDemo() {
  const [filters, setFilters] = useState<Record<string, boolean>>({
    price: true,
    rating: false,
    shipping: false,
    brand: true,
  });

  const toggle = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        <Chip
          variant="filter"
          selected={filters.price}
          onToggle={() => { toggle('price'); }}
        >
          Under $50
        </Chip>

        <Chip
          variant="filter"
          selected={filters.rating}
          onToggle={() => { toggle('rating'); }}
        >
          4★ & above
        </Chip>

        <Chip
          variant="filter"
          elevated
          selected={filters.shipping}
          onToggle={() => { toggle('shipping'); }}
        >
          Free Shipping (Elevated)
        </Chip>

        <Chip
          variant="filter"
          selected={filters.brand}
          leadingIcon="verified"
          onToggle={() => { toggle('brand'); }}
        >
          Verified Brands
        </Chip>
      </div>

      <p style={{ margin: 0, font: 'var(--aura-sys-typescale-body-small)', color: 'var(--aura-sys-color-on-surface-variant)' }}>
        Active filters: {Object.entries(filters).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}
      </p>
    </div>
  );
}

export const FilterChips: Story = {
  render: () => <FilterChipDemo />,
};

function InputChipDemo() {
  const [chips, setChips] = useState<readonly string[]>([
    'Alex Morgan',
    'Jordan Smith',
    'Taylor Swift',
  ]);

  const removeChip = (name: string) => {
    setChips((prev) => prev.filter((c) => c !== name));
  };

  return (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        {chips.map((name) => (
          <Chip
            key={name}
            variant="input"
            leadingIcon="person"
            onRemove={() => { removeChip(name); }}
            removeLabel={`Remove ${name}`}
          >
            {name}
          </Chip>
        ))}

        {chips.length === 0 ? (
          <button
            type="button"
            style={{
              padding: '6px 12px',
              font: 'var(--aura-sys-typescale-label-medium)',
              color: 'var(--aura-sys-color-primary)',
              background: 'transparent',
              border: '1px dashed var(--aura-sys-color-outline)',
              borderRadius: 'var(--aura-sys-shape-small)',
              cursor: 'pointer',
            }}
            onClick={() => {
              setChips(['Alex Morgan', 'Jordan Smith', 'Taylor Swift']);
            }}
          >
            Reset Chips
          </button>
        ) : null}
      </div>
      <p style={{ margin: 0, font: 'var(--aura-sys-typescale-body-small)', color: 'var(--aura-sys-color-on-surface-variant)' }}>
        Try clicking the ✕ button or focusing a chip and pressing Backspace/Delete.
      </p>
    </div>
  );
}

export const InputChips: Story = {
  render: () => <InputChipDemo />,
};

export const SuggestionChips: Story = {
  render: () => {
    return (
      <div className="aura-docs-stack">
        <p style={{ margin: '0 0 8px 0', font: 'var(--aura-sys-typescale-body-medium)' }}>
          Quick Replies:
        </p>
        <div className="aura-docs-row">
          <Chip variant="suggestion" leadingIcon="thumb_up">Sounds good!</Chip>
          <Chip variant="suggestion" leadingIcon="schedule">Can we reschedule?</Chip>
          <Chip variant="suggestion" elevated leadingIcon="mail">Email me details</Chip>
        </div>
      </div>
    );
  },
};

export const DisabledStates: Story = {
  render: () => (
    <div className="aura-docs-row">
      <Chip variant="assist" disabled leadingIcon="event">Disabled Flat</Chip>
      <Chip variant="assist" elevated disabled leadingIcon="bookmark">Disabled Elevated</Chip>
      <Chip variant="filter" selected disabled>Disabled Selected</Chip>
      <Chip variant="input" disabled onRemove={() => {}}>Disabled Input</Chip>
    </div>
  ),
};

