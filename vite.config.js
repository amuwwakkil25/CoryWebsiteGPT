import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  },
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
        'partnership-program': 'partnership-program.html',
        'ai-admissions-guide': 'ai-admissions-guide.html',
        'double-conversion-strategies': 'double-conversion-strategies.html',
        'psychology-fast-response-times': 'psychology-fast-response-times.html',
        'crm-integration-best-practices': 'crm-integration-best-practices.html'
      }
    }
  }
});