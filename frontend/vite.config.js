import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Определяем base динамически (для размещения в подпапке, например /uga-buga_dictionary/)
function resolveBase(mode, env) {
  // Приоритет: переменная окружения VITE_BASE_PATH, затем VITE_BASE, затем PROD_SUBDIR, иначе '/'
  const folder = env.VITE_BASE_PATH || env.VITE_BASE || env.PROD_SUBDIR || ''
  if (!folder || folder === '/') return '/'
  // Гарантируем ведущий и закрывающий слеш
  return `/${folder.replace(/^\/+|\/+$/g, '')}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = resolveBase(mode, env)

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@context': path.resolve(__dirname, 'src/context')
      }
    },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      host: true,
      open: false,
      proxy: {
        // Локально можно ходить на /api -> backend (порт 8080 в docker-compose)
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
            changeOrigin: true,
            rewrite: p => p.replace(/^\/api/, '/api')
        }
      }
    },
    preview: {
      port: 8081,
      host: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom']
          },
          assetFileNames: (chunkInfo) => {
            if (/\.css$/i.test(chunkInfo.name || '')) return 'assets/css/[name]-[hash][extname]'
            return 'assets/[name]-[hash][extname]'
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    envPrefix: ['VITE_', 'APP_']
  }
})
