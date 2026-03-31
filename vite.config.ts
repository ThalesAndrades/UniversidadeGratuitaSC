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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix-vendor';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/sonner/')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/html2canvas/') || id.includes('node_modules/jspdf/')) {
            return 'pdf-vendor';
          }
          if (id.includes('node_modules/zod/') || id.includes('node_modules/@hookform/')) {
            return 'validation-vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
