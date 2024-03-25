import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
    },
    // optimizeDeps: {
    //   include: ['react', 'formik', '@mui/material', '@mui/system'],
    // },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      nodePolyfills(),
    ],
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
      },
    },
  };
});
