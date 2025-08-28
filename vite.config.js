import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'how-it-works': resolve(__dirname, 'how-it-works.html'),
        features: resolve(__dirname, 'features.html'),
        'roi-and-case-studies': resolve(__dirname, 'roi-and-case-studies.html'),
        'demo-and-pricing': resolve(__dirname, 'demo-and-pricing.html'),
        resources: resolve(__dirname, 'resources.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'voice-demo': resolve(__dirname, 'voice-demo.html'),
        terms: resolve(__dirname, 'terms.html')
        terms: resolve(__dirname, 'terms.html')
      }
    }
  }
})