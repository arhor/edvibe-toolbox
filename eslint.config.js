import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import betterMutation from 'eslint-plugin-better-mutation';
import { configs as litConfigs } from 'eslint-plugin-lit';
import perfectionist from 'eslint-plugin-perfectionist';
import { configs as wcConfigs } from 'eslint-plugin-wc';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['dist/']),
    {
        name: 'javascript baseline',
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.webextensions,
            }
        },
        plugins: {
            '@stylistic': stylistic,
            'better-mutation': betterMutation,
            perfectionist
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        },
        rules: {
            curly: ['error', 'all'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'no-param-reassign': ['error', {
                props: true,
                ignorePropertyModificationsFor: [
                    'captured',
                    'event',
                    'featureApi',
                    'request',
                    'rootObject',
                    'row',
                    'target',
                    'transaction'
                ]
            }],
            'perfectionist/sort-imports': ['error', {
                internalPattern: ['^#src/'],
                order: 'asc',
                type: 'natural'
            }]
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
                ...globals.browser,
                ...globals.webextensions,
                ...globals.node,
            }
        }
    },
    {
        name: 'shared runtime boundary',
        files: [
            'src/shared/**/*.js',
        ],
        rules: {
            'better-mutation/no-mutating-functions': 'error',
            'better-mutation/no-mutating-methods': 'error',
            'better-mutation/no-mutation': 'error',
            'no-restricted-imports': ['error', {
                patterns: [{
                    group: [
                        '#src/content/**',
                        '#src/popup/**'
                    ],
                    message: 'Shared modules cannot depend on runtime-owned implementations.'
                }]
            }]
        }
    },
    // MAIN direction: composition/runtime -> features, infrastructure, application;
    // features -> runtime/application capabilities; infrastructure -> application/shared;
    // application -> shared.
    {
        name: 'MAIN application boundary',
        files: [
            'src/content/main/application/**/*.js',
        ],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [{
                    group: [
                        '#src/content/main/components/**',
                        '#src/content/main/features/**',
                        '#src/content/main/infrastructure/**'
                    ],
                    message: 'MAIN application primitives cannot depend on UI, feature, or infrastructure implementations.'
                }]
            }]
        }
    },
    {
        name: 'MAIN infrastructure boundary',
        files: [
            'src/content/main/infrastructure/**/*.js',
        ],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [{
                    group: [
                        '#src/content/main/components/**',
                        '#src/content/main/features/**'
                    ],
                    message: 'MAIN infrastructure cannot depend on UI or feature implementations.'
                }]
            }]
        }
    },
    {
        ...litConfigs['flat/recommended'],
        name: 'Lit Components',
        files: [
            'src/content/main/components/**/*.js',
            'src/content/main/features/**/*-dialog.js',
            'src/popup/components/**/*.js',
        ],
    },
    {
        ...wcConfigs['flat/recommended'],
        name: 'Web Components',
        files: [
            'src/content/main/components/**/*.js',
            'src/content/main/features/**/*-dialog.js',
            'src/popup/components/**/*.js',
        ],
    }
]);
