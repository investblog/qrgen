import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@qr': path.resolve(__dirname, 'src/qr'),
    },
  },
  test: {
    globals: false,
  },
});
