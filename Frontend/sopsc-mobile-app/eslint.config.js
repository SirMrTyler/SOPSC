const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');

module.exports = [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['.yarn/**', 'android/**', 'assets/**', 'Example Files/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {}
  }
];