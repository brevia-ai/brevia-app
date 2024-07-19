// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const customeRules = {
  'vue/no-v-html': ['off'],
  '@typescript-eslint/no-explicit-any': ['off'],
  'vue/no-multiple-template-root': ['off'],
};

const config = {
  ...eslintPluginPrettierRecommended,
  rules: { ...eslintPluginPrettierRecommended.rules, ...customeRules },
};

export default withNuxt(config);
