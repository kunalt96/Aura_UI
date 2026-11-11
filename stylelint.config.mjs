import auraTokensPlugin from './config/stylelint-aura-tokens.mjs';

export default {
  extends: ['stylelint-config-standard'],
  plugins: [auraTokensPlugin],
  ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', '**/src/styles/layers.css'],
  rules: {
    'aura/tokens-and-conventions': true,
    'custom-property-pattern': null,
    'selector-class-pattern': '^aura-[a-z][a-z0-9-]*$',
    'no-descending-specificity': null,
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['currentColor'],
      },
    ],
  },
};
