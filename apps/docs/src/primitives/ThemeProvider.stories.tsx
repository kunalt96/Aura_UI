import { Surface, Text, ThemeProvider } from '@aura/core';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Primitives/ThemeProvider',
};

export default meta;
type Story = StoryObj;

export const NestedSubtreeTheming: Story = {
  render: () => (
    <div className="aura-docs-grid">
      <Surface color="surface-container" shape="large" style={{ padding: '20px' }}>
        <Text role="title-medium">Outer Inherited Theme</Text>
        <Text role="body-medium" color="on-surface-variant">
          Uses the toolbar mode, contrast, and seed color.
        </Text>
      </Surface>

      <ThemeProvider seed="#0061A4" mode="dark" contrast="high">
        <Surface color="primary-container" shape="large" style={{ padding: '20px' }}>
          <Text role="title-medium">Nested Ocean Dark (High Contrast)</Text>
          <Text role="body-medium">
            Isolated subtree override via nested ThemeProvider.
          </Text>
        </Surface>
      </ThemeProvider>

      <ThemeProvider seed="#146C2E" mode="light" variant="vibrant">
        <Surface color="primary-container" shape="large" style={{ padding: '20px' }}>
          <Text role="title-medium">Nested Emerald Light (Vibrant)</Text>
          <Text role="body-medium">
            Coexists alongside dark subtrees cleanly.
          </Text>
        </Surface>
      </ThemeProvider>
    </div>
  ),
};
