import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts']
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2019',
        module: 'CommonJS'
      }
    }
  }
});
