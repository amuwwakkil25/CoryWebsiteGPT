import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl && !supabaseUrl.includes('your_supabase_project_url_here'),
  keyValid: supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_public_key_here')
});

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url_here' || 
    supabaseAnonKey === 'your_supabase_anon_public_key_here') {
  console.error('Supabase configuration required: Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
  throw new Error('Missing or invalid Supabase environment variables. Please check your .env file and ensure you have set valid Supabase credentials.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// Database types
export interface WebsitePage {
  id: string
  slug: string
  title: string
  meta_description?: string
  hero_title?: string
  hero_subtitle?: string
  content: Record<string, any>
  seo_data: Record<string, any>
  is_published: boolean
  sort_order: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface WebsiteFeature {
  id: string
  name: string
  description: string
  icon_svg?: string
  benefits: string[]
  category: string
  is_highlighted: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteTestimonial {
  id: string
  customer_name: string
  customer_title?: string
  customer_organization: string
  testimonial_text: string
  metrics: Record<string, any>
  case_study_data: Record<string, any>
  avatar_url?: string
  is_featured: boolean
  is_case_study: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteResource {
  id: string
  title: string
  description: string
  content?: string
  resource_type: 'blog' | 'guide' | 'webinar' | 'case-study' | 'whitepaper'
  topic: string
  reading_time_minutes?: number
  download_url?: string
  thumbnail_url?: string
  is_lead_magnet: boolean
  is_featured: boolean
  tags: string[]
  seo_data: Record<string, any>
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export interface WebsiteFAQ {
  id: string
  question: string
  answer: string
  category: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsitePricingPlan {
  id: string
  name: string
  description?: string
  monthly_price?: number
  annual_price?: number
  features: string[]
  is_popular: boolean
  is_custom: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteLeadMagnet {
  id: string
  title: string
  description: string
  resource_type: string
  download_url?: string
  thumbnail_url?: string
  features: string[]
  form_fields: any[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteDemoRequest {
  id: string
  request_type: 'demo' | 'call' | 'consultation' | 'lead_magnet'
  name: string
  email?: string
  phone?: string
  organization?: string
  role?: string
  crm_system?: string
  monthly_inquiries?: string
  message?: string
  resource_id?: string
  metadata: Record<string, any>
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  follow_up_requested: boolean
  created_at: string
  updated_at: string
}

export interface WebsiteAnalytics {
  id: string
  page_slug: string
  event_type: 'page_view' | 'button_click' | 'form_submit' | 'download' | 'chat_open'
  event_data: Record<string, any>
  user_agent?: string
  ip_address?: string
  referrer?: string
  session_id?: string
  created_at: string
}

export interface WebsiteSettings {
  id: string
  setting_key: string
  setting_value: any
  description?: string
  is_public: boolean
  updated_by?: string
  created_at: string
  updated_at: string
}