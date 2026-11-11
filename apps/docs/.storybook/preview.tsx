import { useEffect } from 'react';
import {
  ThemeProvider,
  type ThemeContrast,
  type ThemeMode,
  type ThemeMotion,
  type ThemeVariant,
} from '@aura/core';
import { BRAND_CONFIG, TOKEN_PREFIX } from '@aura/tokens';
import '@fontsource-variable/roboto-flex/index.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import 'material-symbols/rounded.css';
import 'material-symbols/outlined.css';
import '@aura/core/styles.css';
import '../src/docs.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  globalTypes: {
    mode: {
      description: 'Color scheme mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
    contrast: {
      description: 'Contrast level',
      toolbar: {
        title: 'Contrast',
        icon: 'contrast',
        items: [
          { value: 'standard', title: 'Standard (0)' },
          { value: 'medium', title: 'Medium (0.5)' },
          { value: 'high', title: 'High (1.0)' },
        ],
        dynamicTitle: true,
      },
    },
    seed: {
      description: 'HCT seed color',
      toolbar: {
        title: 'Seed',
        icon: 'paintbrush',
        items: [
          { value: '#6750A4', title: 'M3 Baseline (#6750A4)' },
          { value: '#0061A4', title: 'Ocean Blue (#0061A4)' },
          { value: '#146C2E', title: 'Forest Green (#146C2E)' },
          { value: '#9C4146', title: 'Terracotta (#9C4146)' },
          { value: '#8C5000', title: 'Warm Amber (#8C5000)' },
        ],
        dynamicTitle: true,
      },
    },
    variant: {
      description: 'M3 scheme variant',
      toolbar: {
        title: 'Scheme',
        icon: 'component',
        items: [
          { value: 'tonal-spot', title: 'Tonal Spot' },
          { value: 'vibrant', title: 'Vibrant' },
          { value: 'expressive', title: 'Expressive' },
          { value: 'neutral', title: 'Neutral' },
          { value: 'monochrome', title: 'Monochrome' },
          { value: 'fidelity', title: 'Fidelity' },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: 'Motion scheme',
      toolbar: {
        title: 'Motion',
        icon: 'play',
        items: [
          { value: 'standard', title: 'Standard' },
          { value: 'expressive', title: 'Expressive (Spring)' },
          { value: 'reduced', title: 'Reduced' },
        ],
        dynamicTitle: true,
      },
    },
    dir: {
      description: 'Reading direction',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    mode: 'light',
    contrast: 'standard',
    seed: BRAND_CONFIG.defaultSeed,
    variant: 'tonal-spot',
    motion: 'standard',
    dir: 'ltr',
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
    a11y: {
      test: 'error',
    },
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals['mode'] as ThemeMode | undefined) ?? 'light';
      const contrast = (context.globals['contrast'] as ThemeContrast | undefined) ?? 'standard';
      const seed = (context.globals['seed'] as string | undefined) ?? BRAND_CONFIG.defaultSeed;
      const variant = (context.globals['variant'] as ThemeVariant | undefined) ?? 'tonal-spot';
      const motion = (context.globals['motion'] as ThemeMotion | undefined) ?? 'standard';
      const dir = (context.globals['dir'] as 'ltr' | 'rtl' | undefined) ?? 'ltr';

      useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute(`data-${TOKEN_PREFIX}-motion`, motion);
      }, [dir, motion]);

      return (
        <ThemeProvider
          mode={mode}
          contrast={contrast}
          seed={seed}
          variant={variant}
          motion={motion}
          dir={dir}
          className="aura-docs-stage"
        >
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
