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
        privacy: 'privacy.html',
        'voice-demo': 'voice-demo.html',
        terms: 'terms.html',
        'ai-admissions-guide': 'ai-admissions-guide.html',
        'double-conversion-strategies': 'double-conversion-strategies.html',
        'psychology-fast-response-times': 'psychology-fast-response-times.html',
        'crm-integration-best-practices': 'crm-integration-best-practices.html'
      }
    }
  }
});