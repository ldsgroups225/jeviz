import antfu from '@antfu/eslint-config';

export default antfu({
  // Basic TypeScript support only
  typescript: true,

  // Configuration preferences
  lessOpinionated: true,
  isInEditor: false,

  // Code style
  stylistic: {
    semi: true,
  },

  // Ignored paths for monorepo
  ignores: [
    'node_modules',
    'dist',
    'build',
    '.next',
    '.wrangler',
    '**/*.d.ts',
    'coverage',
    'temp',
    '.tmp',
    '.claude/**',
    '**/*.md',
    '**/*.json',
    '**/*.yaml',
    '**/*.yml',
    '**/snapshot.json',
    '**/_journal.json',
    '**/routeTree.gen.ts',
    '**/*.gen.ts',
  ],

  // Global rule overrides
  rules: {
    'antfu/no-top-level-await': 'off',
    'ts/consistent-type-definitions': ['error', 'type'],
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'style/max-statements-per-line': 'off',
  },
});
