import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        features: 'features.html',
        'how-it-works': 'how-it-works.html',
        'demo-and-pricing': 'demo-and-pricing.html',
        resources: 'resources.html',
        'voice-demo': 'voice-demo.html',
        privacy: 'privacy.html',
        terms: 'terms.html',
        'content-slug': 'content/[slug].html',
        'admin': 'admin/index.html'
      }
    }
  }
})