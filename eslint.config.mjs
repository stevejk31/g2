import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'airbnb',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/recommended',
      'plugin:eslint-comments/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    rules: {
      /* Typescript rules */
      // Prefer `interface` until `type` features are necessary.
      // https://typescript-eslint.io/rules/consistent-type-definitions/
      '@typescript-eslint/consistent-type-definitions': 'error',

      // Use "@ts-expect-error" instead of "@ts-ignore", as "@ts-ignore" will do
      // nothing if the following line is error free.
      // https://typescript-eslint.io/rules/ban-ts-comment/
      '@typescript-eslint/ban-ts-comment': ['error',
        {
          'ts-ignore': true,
          'ts-expect-error': { descriptionFormat: '^: TS\\d+ because .+$' },
        },
      ],

      /* React rules */
      // Default is "both" which requires inputs to both have an assigned label and be nested within it
      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
      'jsx-a11y/label-has-associated-control': [2, { required: 'some' }],

      // With the use of component libraries, spread operation is essential for
      // extending existing components.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
      'react/jsx-props-no-spreading': 'off',

      // Allow JSX syntax in TSX files.
      // https://typescript-eslint.io/rules/consistent-type-definitions/
      'react/jsx-filename-extension': 'off',

      // Require default props as default arguments in functional components rather than
      // as 'defaultProps' objects.
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
      'react/require-default-props': [2, { functions: 'defaultArguments' }],

      /* Generic rules */
      // This is traditionally a warning to prevent premature optimization.
      //
      // ex.
      // import someUtil from '@/app/lib/someUtil'
      // instead of
      // import { someUtil } from '@/lib/utils'
      //
      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
      'import/prefer-default-export': 'warn',

      'import/extensions': ['warn', {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        jsx: 'never',
      }],

      // Ignore casing from 3rd party libraries.
      // https://eslint.org/docs/latest/rules/camelcase
      camelcase: ['warn',
        // Ignore column names
        {
          ignoreImports: true,
          allow: ['color_id', 'yoyo_name', 'img_src'],
        },
      ],
      'max-len': ['error', { code: 120 }],

      'no-plusplus': 'off',

      /** Next specific rules */
      '@next/next/no-img-element': 'off',
    },
  }),
];

export default eslintConfig;
