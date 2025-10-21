import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appEnvEntries = Object.entries(env).filter(([key]) =>
    key.startsWith('VITE_') || key.startsWith('REACT_APP_'),
  );
  const appEnv = Object.fromEntries(appEnvEntries);

  return {
    plugins: [
      react(),
      nodePolyfills({
        protocolImports: true,
      }),
    ],
    envPrefix: ['VITE_', 'REACT_APP_'],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        process: 'process/browser',
        stream: 'stream-browserify',
        util: 'util',
        buffer: 'buffer',
      },
    },
    define: {
      'process.env': JSON.stringify({
        NODE_ENV: mode,
        MODE: mode,
        DEV: mode === 'development',
        PROD: mode === 'production',
        ...appEnv,
      }),
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    optimizeDeps: {
      include: ['buffer', 'process', 'stream-browserify', 'util'],
    },
  };
});
