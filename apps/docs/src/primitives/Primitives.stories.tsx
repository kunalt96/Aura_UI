import { useState } from 'react';
import {
  Elevation,
  FocusRing,
  Icon,
  Portal,
  Presence,
  Ripple,
  StateLayer,
  Surface,
  Text,
  VisuallyHidden,
  useWindowSizeClass,
} from '@aura/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Primitives/Overview',
};

export default meta;
type Story = StoryObj;

export const SurfaceVariants: Story = {
  render: () => (
    <div className="aura-docs-grid">
      <Surface color="surface-container-low" shape="medium" elevation={1} style={{ padding: '20px' }}>
        <Text role="title-medium">Elevated Surface</Text>
        <Text role="body-small" color="on-surface-variant">
          surface-container-low · level 1
        </Text>
      </Surface>
      <Surface color="surface-container-highest" shape="medium" style={{ padding: '20px' }}>
        <Text role="title-medium">Filled Surface</Text>
        <Text role="body-small" color="on-surface-variant">
          surface-container-highest
        </Text>
      </Surface>
      <Surface color="surface" shape="medium" outlined style={{ padding: '20px' }}>
        <Text role="title-medium">Outlined Surface</Text>
        <Text role="body-small" color="on-surface-variant">
          surface + outline-variant
        </Text>
      </Surface>
      <Surface color="primary-container" shape="large" elevation={2} style={{ padding: '20px' }}>
        <Text role="title-medium">Primary Container</Text>
        <Text role="body-small">Auto-paired on-primary-container</Text>
      </Surface>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="aura-docs-stack">
      <div className="aura-docs-row">
        <Icon name="home" size="dense" aria-label="Home dense" />
        <Icon name="home" size="default" aria-label="Home default" />
        <Icon name="home" size="large" aria-label="Home large" />
        <Icon name="home" size="xlarge" aria-label="Home extra large" />
        <Icon name="home" size="xxlarge" aria-label="Home double extra large" />
      </div>
      <div className="aura-docs-row">
        <Icon name="favorite" filled aria-label="Filled heart" />
        <Icon name="favorite" filled={false} aria-label="Unfilled heart" />
        <Icon name="settings" variant="outlined" aria-label="Outlined settings" />
        <Icon name="star" weight={500} filled aria-label="Bold star" />
      </div>
    </div>
  ),
};

export const StandaloneElevationAndFocus: Story = {
  render: () => (
    <div className="aura-docs-row">
      <div
        style={{
          position: 'relative',
          padding: '20px 28px',
          borderRadius: 'var(--aura-sys-shape-large)',
          backgroundColor: 'var(--aura-sys-color-surface)',
        }}
      >
        <Elevation level={3} />
        <Text role="title-medium" as="span" style={{ position: 'relative' }}>
          Standalone Elevation Overlay (Level 3)
        </Text>
      </div>

      <button type="button" className="aura-docs-interactive-btn">
        <StateLayer />
        <Ripple />
        <FocusRing inward />
        Inward FocusRing Button
      </button>
    </div>
  ),
};

function PresenceAndPortalDemo() {
  const [open, setOpen] = useState(false);
  const [portaledOpen, setPortaledOpen] = useState(false);
  const sizeClass = useWindowSizeClass();

  return (
    <div className="aura-docs-stack">
      <Text role="body-medium" color="on-surface-variant">
        Current window size class: <strong>{sizeClass}</strong>
      </Text>

      <div className="aura-docs-row">
        <button
          type="button"
          className="aura-docs-interactive-btn"
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          <StateLayer />
          <Ripple />
          <FocusRing />
          {open ? 'Unmount Presence' : 'Mount Presence'}
        </button>

        <button
          type="button"
          className="aura-docs-interactive-btn"
          onClick={() => {
            setPortaledOpen((prev) => !prev);
          }}
        >
          <StateLayer />
          <Ripple />
          <FocusRing />
          {portaledOpen ? 'Hide Portal Banner' : 'Show Portal Banner'}
        </button>

        <VisuallyHidden as="a" href="#skip-target" focusable>
          Skip to demo target
        </VisuallyHidden>
      </div>

      <Presence present={open}>
        {({ status }) => (
          <Surface
            color="tertiary-container"
            shape="medium"
            elevation={2}
            style={{
              padding: '16px 20px',
              opacity: status === 'exiting' ? 0 : 1,
              transform: status === 'exiting' ? 'translateY(8px)' : 'translateY(0)',
              transitionProperty: 'opacity, transform',
              transitionDuration: 'var(--aura-sys-motion-duration-medium2)',
              transitionTimingFunction: 'var(--aura-sys-motion-easing-emphasized)',
            }}
          >
            <Text role="title-small">Presence state: {status}</Text>
          </Surface>
        )}
      </Presence>

      {portaledOpen ? (
        <Portal>
          <Surface
            color="inverse-surface"
            shape="extra-small"
            elevation={3}
            style={{
              position: 'fixed',
              insetBlockEnd: 'var(--aura-sys-space-6)',
              insetInlineEnd: 'var(--aura-sys-space-6)',
              padding: '12px 16px',
              zIndex: 'var(--aura-sys-z-index-snackbar)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Text role="body-medium">Rendered via Portal (inherits ThemeProvider attributes)</Text>
            <button
              type="button"
              className="aura-docs-interactive-btn"
              onClick={() => {
                setPortaledOpen(false);
              }}
            >
              <StateLayer />
              <FocusRing />
              Dismiss
            </button>
          </Surface>
        </Portal>
      ) : null}

      <div id="skip-target" tabIndex={-1}>
        <Text role="body-small" color="on-surface-variant">
          Skip link target region (tab to reveal VisuallyHidden focusable skip link above).
        </Text>
      </div>
    </div>
  );
}

export const PresencePortalAndVisuallyHidden: Story = {
  render: () => <PresenceAndPortalDemo />,
};
