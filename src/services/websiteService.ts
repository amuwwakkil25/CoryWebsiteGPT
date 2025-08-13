import { supabase } from '../lib/supabase'
import type {
  WebsitePage,
  WebsiteFeature,
  WebsiteTestimonial,
  WebsiteResource,
  WebsiteFAQ,
  WebsitePricingPlan,
  WebsiteLeadMagnet,
  WebsiteDemoRequest,
  WebsiteAnalytics,
  WebsiteSettings
} from '../lib/supabase'

export class WebsiteService {
  // Pages
  static async getPages() {
    const { data, error } = await supabase
      .from('Website_Pages')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsitePage[]
  }

  static async getPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from('Website_Pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    if (error) throw error
    return data as WebsitePage
  }

  // Features
  static async getFeatures(category?: string) {
    let query = supabase
      .from('Website_Features')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteFeature[]
  }

  static async getFeaturedFeatures() {
    const { data, error } = await supabase
      .from('Website_Features')
      .select('*')
      .eq('is_active', true)
      .eq('is_highlighted', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsiteFeature[]
  }

  // Testimonials
  static async getTestimonials() {
    const { data, error } = await supabase
      .from('Website_Testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsiteTestimonial[]
  }

  static async getFeaturedTestimonials() {
    const { data, error } = await supabase
      .from('Website_Testimonials')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsiteTestimonial[]
  }

  static async getCaseStudies() {
    const { data, error } = await supabase
      .from('Website_Testimonials')
      .select('*')
      .eq('is_active', true)
      .eq('is_case_study', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsiteTestimonial[]
  }

  // Resources
  static async getResources(filters?: {
    type?: string
    topic?: string
    featured?: boolean
  }) {
    let query = supabase
      .from('Website_Resources')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    if (filters?.type) {
      query = query.eq('resource_type', filters.type)
    }
    
    if (filters?.topic) {
      query = query.eq('topic', filters.topic)
    }
    
    if (filters?.featured) {
      query = query.eq('is_featured', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteResource[]
  }

  // FAQ
  static async getFAQs(category?: string) {
    let query = supabase
      .from('Website_FAQ')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteFAQ[]
  }

  // Pricing Plans
  static async getPricingPlans() {
    const { data, error } = await supabase
      .from('Website_Pricing_Plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (error) throw error
    return data as WebsitePricingPlan[]
  }

  // Lead Magnets
  static async getLeadMagnets() {
    const { data, error } = await supabase
      .from('Website_Lead_Magnets')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    return data as WebsiteLeadMagnet[]
  }

  static async getLeadMagnetById(id: string) {
    const { data, error } = await supabase
      .from('Website_Lead_Magnets')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data as WebsiteLeadMagnet
  }

  // Demo Requests
  static async createDemoRequest(request: Omit<WebsiteDemoRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('Website_Demo_Requests')
      .insert(request)
      .select()
      .single()
    
    if (error) throw error
    return data as WebsiteDemoRequest
  }

  static async getDemoRequests(status?: string) {
    let query = supabase
      .from('Website_Demo_Requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteDemoRequest[]
  }

  // Analytics
  static async trackEvent(event: Omit<WebsiteAnalytics, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('Website_Analytics')
      .insert(event)
      .select()
      .single()
    
    if (error) throw error
    return data as WebsiteAnalytics
  }

  static async getAnalytics(filters?: {
    page_slug?: string
    event_type?: string
    start_date?: string
    end_date?: string
  }) {
    let query = supabase
      .from('Website_Analytics')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.page_slug) {
      query = query.eq('page_slug', filters.page_slug)
    }
    
    if (filters?.event_type) {
      query = query.eq('event_type', filters.event_type)
    }
    
    if (filters?.start_date) {
      query = query.gte('created_at', filters.start_date)
    }
    
    if (filters?.end_date) {
      query = query.lte('created_at', filters.end_date)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteAnalytics[]
  }

  // Settings
  static async getSettings(publicOnly = true) {
    let query = supabase
      .from('Website_Settings')
      .select('*')
    
    if (publicOnly) {
      query = query.eq('is_public', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as WebsiteSettings[]
  }

  static async getSetting(key: string) {
    const { data, error } = await supabase
      .from('Website_Settings')
      .select('*')
      .eq('setting_key', key)
      .single()
    
    if (error) throw error
    return data as WebsiteSettings
  }

  static async updateSetting(key: string, value: any, description?: string) {
    const { data, error } = await supabase
      .from('Website_Settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        description,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data as WebsiteSettings
  }

  // Utility methods
  static async getPageData(slug: string) {
    const [page, features, testimonials, faqs, pricingPlans, resources] = await Promise.all([
      this.getPageBySlug(slug),
      this.getFeaturedFeatures(),
      this.getFeaturedTestimonials(),
      this.getFAQs(),
      this.getPricingPlans(),
      this.getResources({ featured: true })
    ])

    return {
      page,
      features,
      testimonials,
      faqs,
      pricingPlans,
      resources
    }
  }

  static async getHomePageData() {
    const [page, features, testimonials, resources, settings] = await Promise.all([
      this.getPageBySlug('home'),
      this.getFeaturedFeatures(),
      this.getFeaturedTestimonials(),
      this.getResources({ featured: true }),
      this.getSettings(true)
    ])

    return {
      page,
      features,
      testimonials,
      resources,
      settings: settings.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value
        return acc
      }, {} as Record<string, any>)
    }
  }
}