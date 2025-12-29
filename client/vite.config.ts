import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootPath = path.dirname(__dirname);

export default defineConfig(({ mode }) => {
  const isDev =
    mode === 'development' || process.env.NODE_ENV === 'development';
  const isProd = !isDev;

  const env = loadEnv(mode, rootPath, '');

  const { API_BASE_URL } = env;

  // eslint-disable-next-line no-console
  console.log('[client/vite.config.ts] Launching', {
    mode,
    isDev,
    API_BASE_URL,
    rootPath,
  });

  return {
    envDir: rootPath,
    define: {
      // Stringify the value for it to be injected as a constant in the code
      // @see `client/src/vite-env.d.ts`
      NODE_ENV: JSON.stringify(mode),
      // IS_DEV: JSON.stringify(IS_DEV),
      API_BASE_URL: JSON.stringify(API_BASE_URL),
    },
    plugins: [
      react(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          // Принудительно обновляем кэш при каждом деплое
          skipWaiting: true,
          clientsClaim: true,
          // Очищаем старый кэш
          cleanupOutdatedCaches: true,
          // Стратегия кэширования для JS файлов
          runtimeCaching: [
            {
              urlPattern: /\.(js|css)$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 часа
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Telegram Mini App',
          short_name: 'MiniApp',
          theme_color: '#17212b',
          background_color: '#17212b',
          display: 'standalone',
          icons: [
            {
              src: '/logo.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: isProd,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      exclude: ['@telegram-apps/sdk-react'],
    },
  };
});
