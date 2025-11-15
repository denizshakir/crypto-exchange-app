import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {
      '/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/binance/, ''),
      },
      '/kraken': {
        target: 'https://api.kraken.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kraken/, ''),
      },
      '/huobi': {
        target: 'https://api.huobi.pro',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/huobi/, ''),
      },
      '/bitfinex': {
        target: 'https://api-pub.bitfinex.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/bitfinex/, ''),
      },
    },
  },
});
