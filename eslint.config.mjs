import js from '@eslint/js';
import globals from 'globals';
import { configs as litConfigs } from 'eslint-plugin-lit';
import { configs as wcConfigs } from 'eslint-plugin-wc';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const browserGlobals = {
    ...globals.browser,
    ...globals.webextensions
};

const nodeGlobals = globals.node;
const componentFiles = [
    'src/components/**/*.js',
    'src/component-tests/**/*.js'
];
const unusedOptions = {
    argsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
    varsIgnorePattern: '^_'
};

export default defineConfig([
    globalIgnores(['dist/']),
    {
        name: 'javascript baseline',
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: browserGlobals
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        rules: {
            'no-unused-vars': ['error', unusedOptions]
        }
    },
    {
        name: 'node scripts and tests',
        files: [
            '**/*.test.js',
            '**/*test-fixtures.js',
            'scripts/**/*.{js,mjs,cjs}',
            'vite.config.mjs',
            'eslint.config.mjs'
        ],
        languageOptions: {
            globals: {
                ...browserGlobals,
                ...nodeGlobals
            }
        }
    },
    {
        name: 'typescript baseline',
        files: ['**/*.ts'],
        extends: [tseslint.configs.recommended],
        languageOptions: {
            globals: {
                ...browserGlobals,
                ...nodeGlobals
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', unusedOptions]
        }
    },
    {
        ...litConfigs['flat/recommended'],
        name: 'Lit components',
        files: componentFiles
    },
    {
        ...wcConfigs['flat/recommended'],
        name: 'Web Components',
        files: componentFiles
    }
]);