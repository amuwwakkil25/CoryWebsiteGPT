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
        terms: 'terms.html',
        'voice-demo': 'voice-demo.html',
        'roi-and-case-studies': 'roi-and-case-studies.html',
        'content-template': 'content/[slug].html'
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})