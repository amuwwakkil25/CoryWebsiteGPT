import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey || supabaseUrl.trim() === '' || supabaseKey.trim() === '') {
  console.error('Missing or invalid Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlValid: supabaseUrl && supabaseUrl.includes('supabase.co'),
    keyValid: supabaseKey && supabaseKey.startsWith('eyJ')
  })
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Export types for use throughout the application
export type Database = {
  public: {
    Tables: {
      content_items: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          content_type: 'blog' | 'case_study' | 'ebook' | 'guide' | 'webinar'
          featured_image_url?: string
          author_name: string
          author_title: string
          reading_time_minutes?: number
          tags: string[]
          category: string
          is_featured: boolean
          is_published: boolean
          published_at: string
          seo_title?: string
          seo_description?: string
          download_url?: string
          external_url?: string
          metrics: Record<string, any>
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content?: string
          content_type: 'blog' | 'case_study' | 'ebook' | 'guide' | 'webinar'
          featured_image_url?: string
          author_name?: string
          author_title?: string
          reading_time_minutes?: number
          tags?: string[]
          category?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          seo_title?: string
          seo_description?: string
          download_url?: string
          external_url?: string
          metrics?: Record<string, any>
          view_count?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          content_type?: 'blog' | 'case_study' | 'ebook' | 'guide' | 'webinar'
          featured_image_url?: string
          author_name?: string
          author_title?: string
          reading_time_minutes?: number
          tags?: string[]
          category?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          seo_title?: string
          seo_description?: string
          download_url?: string
          external_url?: string
          metrics?: Record<string, any>
          view_count?: number
          updated_at?: string
        }
      }
      website_pages: {
        Row: {
          id: string
          slug: string
          title: string
          meta_description?: string
          hero_title?: string
          hero_subtitle?: string
          content?: Record<string, any>
          seo_data?: Record<string, any>
          is_published: boolean
          sort_order: number
          created_by?: string
          created_at: string
          updated_at: string
        }
      }
      website_features: {
        Row: {
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
      }
      website_testimonials: {
        Row: {
          id: string
          customer_name: string
          customer_title?: string
          customer_organization: string
          testimonial_text: string
          metrics?: Record<string, any>
          case_study_data?: Record<string, any>
          avatar_url?: string
          is_featured: boolean
          is_case_study: boolean
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      website_resources: {
        Row: {
          id: string
          title: string
          description: string
          content?: string
          resource_type: string
          topic: string
          reading_time_minutes?: number
          download_url?: string
          thumbnail_url?: string
          is_lead_magnet: boolean
          is_featured: boolean
          tags: string[]
          seo_data?: Record<string, any>
          is_published: boolean
          published_at?: string
          created_at: string
          updated_at: string
        }
      }
      website_faq: {
        Row: {
          id: string
          question: string
          answer: string
          category: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      website_pricing_plans: {
        Row: {
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
      }
      website_lead_magnets: {
        Row: {
          id: string
          title: string
          description: string
          resource_type: string
          download_url?: string
          thumbnail_url?: string
          features: string[]
          form_fields?: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      website_demo_requests: {
        Row: {
          id: string
          request_type: string
          name: string
          email?: string
          phone?: string
          organization?: string
          role?: string
          crm_system?: string
          monthly_inquiries?: string
          message?: string
          resource_id?: string
          metadata?: Record<string, any>
          status: string
          follow_up_requested: boolean
          created_at: string
          updated_at: string
        }
      }
      website_analytics: {
        Row: {
          id: string
          page_slug: string
          event_type: string
          event_data?: Record<string, any>
          user_agent?: string
          ip_address?: string
          referrer?: string
          session_id?: string
          created_at: string
        }
      }
      website_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Record<string, any>
          description?: string
          is_public: boolean
          updated_by?: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export type WebsitePage = Database['public']['Tables']['website_pages']['Row']
export type WebsiteFeature = Database['public']['Tables']['website_features']['Row']
export type WebsiteTestimonial = Database['public']['Tables']['website_testimonials']['Row']
export type WebsiteResource = Database['public']['Tables']['website_resources']['Row']
export type WebsiteFAQ = Database['public']['Tables']['website_faq']['Row']
export type WebsitePricingPlan = Database['public']['Tables']['website_pricing_plans']['Row']
export type WebsiteLeadMagnet = Database['public']['Tables']['website_lead_magnets']['Row']
export type WebsiteDemoRequest = Database['public']['Tables']['website_demo_requests']['Row']
export type WebsiteAnalytics = Database['public']['Tables']['website_analytics']['Row']
export type WebsiteSettings = Database['public']['Tables']['website_settings']['Row']