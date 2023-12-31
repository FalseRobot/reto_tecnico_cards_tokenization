module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    project: './tsconfig.json', // Path to your tsconfig.json file
  },
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off"
  }
};