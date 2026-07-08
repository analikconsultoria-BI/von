import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [{
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      const cssAsset = Object.keys(bundle).find(key => key.endsWith('.css'));
      if (!cssAsset) return;
      const cssCode = bundle[cssAsset].source;

      for (const key of Object.keys(bundle)) {
        if (key.endsWith('.html')) {
          let html = bundle[key].source;
          // Substituir o link externo pelo style inline para evitar bloqueio de renderização
          html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*\.css"[^>]*>/i, `<style>${cssCode}</style>`);
          bundle[key].source = html;
        }
      }
      delete bundle[cssAsset]; // Delete the external CSS file so it's not emitted
    }
  }],
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
