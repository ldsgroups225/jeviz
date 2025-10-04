import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/build/**',
        '.next/**',
        '.wrangler/**',
        '**/*.stories.*',
        '**/.claude/**',
      ],
    },
    include: [
      'apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/',
      '**/node_modules/',
      'dist/',
      'build/',
      '.next/',
      '.wrangler/',
      '**/*.d.ts',
      '**/*.config.*',
    ],
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/apps': resolve(__dirname, './apps'),
      '@/packages': resolve(__dirname, './packages'),
      '@/user-application': resolve(__dirname, './apps/user-application'),
      '@/data-service': resolve(__dirname, './apps/data-service'),
      '@/data-ops': resolve(__dirname, './packages/data-ops'),
    },
  },
});
