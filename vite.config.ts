import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  build: {
    target: 'es2015',
    minify: 'esbuild',
    outDir: '.',
    emptyOutDir: false,
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Nomes genéricos — sem revelar tecnologia nos nomes dos chunks
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-a';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-b';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/sonner/')) {
            return 'vendor-c';
          }
          if (id.includes('node_modules/html2canvas/') || id.includes('node_modules/jspdf/')) {
            return 'vendor-d';
          }
          if (id.includes('node_modules/zod/') || id.includes('node_modules/@hookform/')) {
            return 'vendor-e';
          }
        },
      },
    },
  },
  esbuild: {
    // Strip console.log/error/warn em produção
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
  server: {
    port: 3000,
    host: true,
  },
});
