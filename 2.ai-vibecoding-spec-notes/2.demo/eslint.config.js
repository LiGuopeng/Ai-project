const eslint = require('@eslint/js')
const prettier = require('eslint-plugin-prettier')
const reactHooks = require('eslint-plugin-react-hooks')
const reactRefresh = require('eslint-plugin-react-refresh')
const tseslint = require('typescript-eslint')
const globals = require('globals')

module.exports = tseslint.config(
    {
        ignores: ['**/.next/**', '**/dist/**', '**/build/**', '**/*.d.ts'],
    },
    {
        ignores: ['**/.next/**', '**/dist/**', '**/build/**', '**/*.d.ts', 'eslint.config.js'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['apps/frontend/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'no-console': 'error',
        },
    }
)
