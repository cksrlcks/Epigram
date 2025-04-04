import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
      },
    },
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),

  {
    plugins: {
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'prettier/prettier': 'off',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-warning-comments': [
        'error',
        {
          terms: [
            '✨',
            '✅',
            '🔧',
            '🚀',
            '💡',
            '❗',
            '🔍',
            '🔥',
            '⭕',
            '🔵',
            '⚪',
            '🟢',
            '🔴',
            '🟡',
            '🟠',
            '📝',
            '🚧',
            '⚙️',
            '💾',
            '📌',
            '📍',
            '🔗',
          ],
          location: 'anywhere',
        },
      ],
    },
  },
];

export default eslintConfig;
