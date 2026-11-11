import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  sourcemap: false,
  fixedExtension: true,
  platform: 'neutral',
  treeshake: true,
  deps: {
    // Bundle @material/material-color-utilities so consumers in native Node ESM
    // do not hit its internal extensionless import bug in v0.4.0.
    alwaysBundle: ['@material/material-color-utilities'],
    onlyBundle: false,
  },
});
