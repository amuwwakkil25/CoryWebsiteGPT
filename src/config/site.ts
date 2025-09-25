// Site configuration and constants
export const SITE_CONFIG = {
  name: 'Agent Cory',
  description: 'AI-powered admissions assistant that boosts conversions with lightning-fast, multi-channel outreach',
  url: 'https://agentcory.ai',
  contact: {
    phone: '1-888-465-1991',
    email: 'cory@agentcory.ai',
    address: {
      street: '200 Chisholm Pl',
      city: 'Plano',
      state: 'TX',
      zip: '75075'
    }
  },
  social: {
    linkedin: 'https://linkedin.com/company/108149003',
    twitter: 'https://x.com/AgentCoryAI',
    youtube: 'https://www.youtube.com/channel/UCw6XtSZQNiFcftHKEYNc3_A',
    instagram: 'https://www.instagram.com/agentcory.ai',
    facebook: 'https://www.facebook.com/profile.php?id=61579324469233'
  },
  analytics: {
    gtag: 'G-XXXXXXX'
  },
  chat: {
    widgetId: '68b077f85dff15aa9384c4e9'
  }
}

export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'How It Works', href: '/how-it-works.html', id: 'how-it-works' },
  { label: 'Features', href: '/features.html', id: 'features' },
  { label: 'ROI & Cases', href: '/roi-and-case-studies.html', id: 'roi-cases' },
  { label: 'Demo', href: '/demo-and-pricing.html', id: 'demo' },
  { label: 'Resources', href: '/resources.html', id: 'resources' },
  { label: 'Professional Services', href: '/partnership-program.html', id: 'professional-services' }
]

export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/features.html' },
    { label: 'How It Works', href: '/how-it-works.html' },
    { label: 'Demo', href: '/demo-and-pricing.html' },
    { label: 'Case Studies', href: '/roi-and-case-studies.html' }
  ],
  resources: [
    { label: 'Blog', href: '/resources.html' },
    { label: 'Guides', href: '/resources.html' },
    { label: 'Webinars', href: '/resources.html' },
    { label: 'Help Center', href: '#' }
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Privacy Policy', href: '/privacy.html' },
    { label: 'Terms of Service', href: '/terms.html' }
  ]
}

export const CONTENT_TYPES = {
  blog: { label: 'Blog Post', color: 'var(--warm-coral)' },
  case_study: { label: 'Case Study', color: 'var(--fresh-lime)' },
  guide: { label: 'Guide', color: 'var(--sky-gradient-start)' },
  ebook: { label: 'eBook', color: 'var(--midnight-navy)' },
  webinar: { label: 'Webinar', color: 'var(--success)' }
}

export const ROI_DEFAULTS = {
  monthlyInquiries: 500,
  contactRate: 45,
  conversionRate: 25,
  avgTuition: 25000,
  staffCost: 35,
  touchesPerLead: 8,
  coryContactRate: 92,
  responseUplift: 25,
  automationCoverage: 85,
  platformCost: 36000
}