import { defineConfig } from 'vite'

// Plugin: converte CSS link blocking em async preload (elimina render-blocking)
function asyncCssPlugin() {
  return {
    name: 'async-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        (_, href) =>
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">`
          + `<noscript><link rel="stylesheet" href="${href}"></noscript>`
      )
    }
  }
}

export default defineConfig({
  plugins: [asyncCssPlugin()],
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
