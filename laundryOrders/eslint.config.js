import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'prettier': eslintPluginPrettier
    },
    extends: [
      js.configs.recommended,
      'plugin:prettier/recommended'
    ],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'error'
    }
  },
  eslintConfigPrettier
]);