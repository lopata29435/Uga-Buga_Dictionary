import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function normalizeFolder(v) {
  return `/${v.replace(/^\/+|\/+$/g,'')}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const explicit = env.VITE_BASE_PATH || env.VITE_BASE || env.PROD_SUBDIR
  // Если указана подпапка – абсолютный base, иначе в продакшене делаем относительные ссылки './'
  const base = explicit ? normalizeFolder(explicit) : (mode === 'production' ? './' : '/')

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
    define: { __BUILD_TIME__: JSON.stringify(new Date().toISOString()) },
    server: {
      port: Number(env.VITE_DEV_PORT) || 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: p => p
        }
      }
    },
    preview: { port: 8081, host: true },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: { react: ['react','react-dom'] },
          assetFileNames: (info) => /\.css$/i.test(info.name||'') ? 'assets/css/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js'
        }
      }
    },
    optimizeDeps: { include: ['react','react-dom'] },
    envPrefix: ['VITE_','APP_']
  }
})
