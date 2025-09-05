import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'how-it-works': 'how-it-works.html',
        features: 'features.html',
        'demo-and-pricing': 'demo-and-pricing.html',
        resources: 'resources.html',
        privacy: 'privacy.html',
        'voice-demo': 'voice-demo.html',
        terms: 'terms.html',
        'content-slug': 'content/[slug].html',
        'admin-content-manager': 'admin/content-manager.html'
      }
    }
  }
})