module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    //'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/next',
    'next',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'next'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
}
