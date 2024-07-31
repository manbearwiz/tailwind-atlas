import type { UserConfig } from 'vitest/config';

export default {
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/cli.ts',
      name: 'cli',
    },
    rollupOptions: {
      external: ['tailwindcss', '@tailwindcss/oxide'],
    },
    sourcemap: true,
  },
  test: {
    environment: 'happy-dom',
  },
} satisfies UserConfig;
