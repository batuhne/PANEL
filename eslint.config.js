import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_'
      }],
      // Accessibility rules for clean code compliance
      'jsx-a11y/aria-role': ['error', {
        'allowedInvalidRoles': ['text'],
        'ignoreNonDOM': true
      }],
      'jsx-a11y/no-autofocus': ['error', {
        'ignoreNonDOM': true
      }],
      'jsx-a11y/control-has-associated-label': ['error', {
        'labelAttributes': ['label'],
        'controlComponents': ['Button', 'Input'],
        'ignoreElements': [
          'audio', 'canvas', 'embed', 'input', 
          'textarea', 'tr', 'video'
        ],
        'depth': 3
      }]
    },
  },
  // Test file configuration
  {
    files: ['**/*.test.{js,jsx}', '**/tests/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        process: 'readonly'
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_'
      }],
    },
  },
])
