import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'src/templates/**', 'test-react-extension/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/templates/**'],
    },
    testTimeout: 30000,
  },
});
