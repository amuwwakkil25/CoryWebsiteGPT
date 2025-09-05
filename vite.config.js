import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'how-it-works': 'how-it-works.html',
        features: 'features.html',
        'demo-and-pricing': 'demo-and-pricing.html',
        resources: 'resources.html',
        'roi-and-case-studies': 'roi-and-case-studies.html',
        privacy: 'privacy.html',
        terms: 'terms.html',
        'voice-demo': 'voice-demo.html',
        'content-slug': 'content/[slug].html',
        'admin-content-manager': 'admin/content-manager.html',
        'admin-index': 'admin/index.html'
      }
    }
  }
});