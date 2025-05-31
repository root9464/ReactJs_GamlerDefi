import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
    svgr({
      include: '**/*.svg',

      svgoConfig: {
        floatPrecision: 2,
      },

      typescript: true,
      ref: true,
      memo: true,
      svgProps: {
        ref: 'ref',
      },
      prettierConfig: {
        parser: 'typescript',
      },
    }),
  ],

  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/web3': {
        target: 'http://127.0.0.1:6069',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/web3/, '/api'),
      },
      '/api/web2': {
        target: 'https://serv.gamler.atma-dev.ru',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/web2/, ''),
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
    },
  },
});
