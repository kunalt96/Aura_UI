import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SegmentedButton,
  SegmentedButtonGroup,
} from '@aura/core';

const meta: Meta<typeof SegmentedButtonGroup> = {
  title: 'Components/SegmentedButton',
  component: SegmentedButtonGroup,
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['single', 'multi'],
      description: 'Single-select (radiogroup) or multi-select (group)',
    },
    density: {
      control: 'radio',
      options: ['default', 'dense'],
      description: 'Default (40px) or dense (32px) height',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedButtonGroup>;

function DefaultDemo() {
  const [selected, setSelected] = useState<string>('day');

  return (
    <div className="aura-docs-stack">
      <SegmentedButtonGroup
        aria-label="Calendar view selection"
        value={selected}
        onChange={setSelected}
      >
        <SegmentedButton value="day" label="Day" />
        <SegmentedButton value="week" label="Week" />
        <SegmentedButton value="month" label="Month" />
        <SegmentedButton value="year" label="Year" />
      </SegmentedButtonGroup>
      <p style={{ margin: 0, font: 'var(--aura-sys-typescale-body-small)', color: 'var(--aura-sys-color-on-surface-variant)' }}>
        Selected: {selected}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

function WithIconsDemo() {
  const [selected, setSelected] = useState<string>('list');

  return (
    <div className="aura-docs-stack">
      <SegmentedButtonGroup
        aria-label="View format"
        value={selected}
        onChange={setSelected}
      >
        <SegmentedButton value="list" icon="view_list" label="List" />
        <SegmentedButton value="grid" icon="grid_view" label="Grid" />
        <SegmentedButton value="gallery" icon="photo_library" label="Gallery" />
      </SegmentedButtonGroup>
      <p style={{ margin: 0, font: 'var(--aura-sys-typescale-body-small)', color: 'var(--aura-sys-color-on-surface-variant)' }}>
        Selected: {selected} (notice checkmark replaces icon when selected per M3)
      </p>
    </div>
  );
}

export const WithIcons: Story = {
  render: () => <WithIconsDemo />,
};

function IconsOnlyDemo() {
  const [align, setAlign] = useState<string>('left');

  return (
    <div className="aura-docs-stack">
      <SegmentedButtonGroup
        aria-label="Text alignment"
        value={align}
        onChange={setAlign}
      >
        <SegmentedButton value="left" icon="format_align_left" aria-label="Align left" />
        <SegmentedButton value="center" icon="format_align_center" aria-label="Align center" />
        <SegmentedButton value="right" icon="format_align_right" aria-label="Align right" />
        <SegmentedButton value="justify" icon="format_align_justify" aria-label="Justify text" />
      </SegmentedButtonGroup>
    </div>
  );
}

export const IconsOnly: Story = {
  render: () => <IconsOnlyDemo />,
};

function MultiSelectDemo() {
  const [selected, setSelected] = useState<readonly string[]>(['bold']);

  return (
    <div className="aura-docs-stack">
      <SegmentedButtonGroup
        selectionMode="multi"
        aria-label="Text styling"
        value={selected}
        onChange={setSelected}
      >
        <SegmentedButton value="bold" icon="format_bold" label="Bold" />
        <SegmentedButton value="italic" icon="format_italic" label="Italic" />
        <SegmentedButton value="underlined" icon="format_underlined" label="Underline" />
      </SegmentedButtonGroup>
      <p style={{ margin: 0, font: 'var(--aura-sys-typescale-body-small)', color: 'var(--aura-sys-color-on-surface-variant)' }}>
        Selected styles: {selected.length > 0 ? selected.join(', ') : 'None'}
      </p>
    </div>
  );
}

export const MultiSelect: Story = {
  render: () => <MultiSelectDemo />,
};

export const DensityComparison: Story = {
  render: () => (
    <div className="aura-docs-stack" style={{ gap: '24px' }}>
      <div>
        <p style={{ margin: '0 0 8px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Default Density (40px)</p>
        <SegmentedButtonGroup defaultValue="walk" aria-label="Travel mode">
          <SegmentedButton value="walk" icon="directions_walk" label="Walk" />
          <SegmentedButton value="transit" icon="directions_transit" label="Transit" />
          <SegmentedButton value="drive" icon="directions_car" label="Drive" />
        </SegmentedButtonGroup>
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Dense Density (32px)</p>
        <SegmentedButtonGroup density="dense" defaultValue="transit" aria-label="Dense travel mode">
          <SegmentedButton value="walk" icon="directions_walk" label="Walk" />
          <SegmentedButton value="transit" icon="directions_transit" label="Transit" />
          <SegmentedButton value="drive" icon="directions_car" label="Drive" />
        </SegmentedButtonGroup>
      </div>
    </div>
  ),
};

function FullWidthDemo() {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ inlineSize: '100%', maxWidth: '500px' }}>
      <SegmentedButtonGroup
        fullWidth
        value={filter}
        onChange={setFilter}
        aria-label="Filter status"
      >
        <SegmentedButton value="all" label="All" />
        <SegmentedButton value="unread" label="Unread" />
        <SegmentedButton value="archived" label="Archived" />
      </SegmentedButtonGroup>
    </div>
  );
}

export const FullWidth: Story = {
  render: () => <FullWidthDemo />,
};

export const DisabledStates: Story = {
  render: () => (
    <div className="aura-docs-stack" style={{ gap: '24px' }}>
      <div>
        <p style={{ margin: '0 0 8px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Individual Segment Disabled</p>
        <SegmentedButtonGroup defaultValue="first" aria-label="Partial disabled">
          <SegmentedButton value="first" label="Available" />
          <SegmentedButton value="second" label="Disabled" disabled />
          <SegmentedButton value="third" label="Available" />
        </SegmentedButtonGroup>
      </div>

      <div>
        <p style={{ margin: '0 0 8px 0', font: 'var(--aura-sys-typescale-title-small)' }}>Entire Group Disabled</p>
        <SegmentedButtonGroup disabled defaultValue="first" aria-label="Fully disabled">
          <SegmentedButton value="first" label="Option 1" />
          <SegmentedButton value="second" label="Option 2" />
          <SegmentedButton value="third" label="Option 3" />
        </SegmentedButtonGroup>
      </div>
    </div>
  ),
};
