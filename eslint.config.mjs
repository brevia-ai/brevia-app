// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const customRules = {
  'vue/no-v-html': ['off'],
  '@typescript-eslint/no-explicit-any': ['off'],
  'vue/no-multiple-template-root': ['off'],
};

const config = {
  ...eslintPluginPrettierRecommended,
  rules: { ...eslintPluginPrettierRecommended.rules, ...customRules },
};

export default withNuxt(config);
