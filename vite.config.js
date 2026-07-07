import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        sites: 'sites.html',
        ecommerce: 'ecommerce.html',
        aplicativos: 'aplicativos.html',
        workana: 'workana.html',
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  }
})

