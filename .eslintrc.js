module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['src/api/generatedTypes.ts'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        useTabs: false, // ＼(￣▽￣)／
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      },
    ],
    // We don't use prop types in React, TypeScript interfaces is enough
    'react/prop-types': 0,

    // allows unused vars when declared in arguments
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'none' },
    ],
    // disables case checks for class/interface/type
    '@typescript-eslint/class-name-casing': 0,
    // disables case checks for properties
    '@typescript-eslint/camelcase': 0,
    // allows 'any' typehint
    '@typescript-eslint/no-explicit-any': 0,
    // we rely on this heavily, knowing data will be returned by the API
    // TODO: review the code that requires this rule to be turned off for now
    '@typescript-eslint/no-non-null-asserted-optional-chain': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
  },
  settings: {
    react: {
      // Settings for eslint-plugin-react
      pragma: 'React',
      version: 'detect',
    },
  },
};
