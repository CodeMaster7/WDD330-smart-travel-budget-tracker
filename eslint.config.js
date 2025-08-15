import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';

// ESLint v9 flat config
// - Exports an array of config objects
// - Plugins are real objects (not strings)
// - "env" becomes languageOptions.globals
// - .eslintignore is replaced with an `ignores` object
export default [
    // Ignore output and editor/system folders so ESLint stays fast and quiet
    {
        ignores: [
            'node_modules',
            'dist',
            'dist-ssr',
            'web_modules',
            '.cache',
            '**/*.local',
            'logs',
            '**/*.log',
            'pnpm-debug.log*',
            'yarn-debug.log*',
            'yarn-error.log*',
            'npm-debug.log*',
            '.vscode/**',
            '.idea',
            '.DS_Store',
            '*.suo',
            '*.ntvs*',
            '*.njsproj',
            '*.sln',
            '*.sw?',
        ],
    },

    // Base recommended rules from ESLint core
    js.configs.recommended,

    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],

        // Language + env
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            // Common browser + Node globals so `no-undef` doesn't complain
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                FormData: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                URLSearchParams: 'readonly',
                module: 'readonly',
                require: 'readonly',
                process: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
            },
        },

        // Register plugins in flat config
        plugins: {
            import: importPlugin,
        },

        // Your rules (migrated as-is where valid)
        rules: {
            'no-unused-vars': [
                1,
                {
                    argsIgnorePattern: 'res|next|^err',
                },
            ],
            'arrow-body-style': [2, 'as-needed'],
            'no-param-reassign': [
                2,
                {
                    props: false,
                },
            ],
            'no-console': 1,
            quotes: ['error', 'single', { allowTemplateLiterals: true }],
            // Note: removed invalid rule "space-unary-ops" (doesn't exist in ESLint v9)
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'comma-dangle': 0,
            'max-len': 0,
            'import/extensions': 0,
            'no-underscore-dangle': 0,
            'consistent-return': 0,
            radix: 0,
            'no-shadow': [
                2,
                {
                    hoist: 'all',
                    allow: [
                        'resolve',
                        'reject',
                        'done',
                        'next',
                        'err',
                        'error',
                    ],
                },
            ],
            'no-unused-expressions': 'off',
        },
    },

    // Disable rules that conflict with Prettier formatting
    prettier,
];
