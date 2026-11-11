import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'primitives/index': 'src/primitives/index.ts',
    'theme/index': 'src/theme/index.ts',
    'hooks/index': 'src/hooks/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  fixedExtension: true,
  platform: 'neutral',
  treeshake: true,
  css: false,
  deps: {
    neverBundle: ['react', 'react-dom', 'react/jsx-runtime', 'react-aria-components'],
  },
});
