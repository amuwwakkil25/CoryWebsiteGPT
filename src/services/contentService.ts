import { supabase } from '../lib/supabase'

export interface ContentItem {
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

export interface LeadMagnetRequest {
  name: string
  email: string
  organization: string
  role?: string
  resource_id: string
  follow_up_requested: boolean
}

export class ContentService {
  // Get all published content
  static async getAllContent(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching content:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Get featured content
  static async getFeaturedContent(): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching featured content:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Get content by type
  static async getContentByType(type: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .eq('content_type', type)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching content by type:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Get content by category
  static async getContentByCategory(category: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .eq('category', category)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching content by category:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Get content by slug
  static async getContentBySlug(slug: string): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    
    if (error) {
      console.error('Error fetching content by slug:', error)
      throw error
    }
    
    return data as ContentItem
  }

  // Search content
  static async searchContent(query: string): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error searching content:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Get related content
  static async getRelatedContent(item: ContentItem, limit = 3): Promise<ContentItem[]> {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .neq('id', item.id)
      .or(`category.eq.${item.category},content_type.eq.${item.content_type}`)
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching related content:', error)
      throw error
    }
    
    return data as ContentItem[]
  }

  // Increment view count
  static async incrementViewCount(id: string): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/increment-view-count`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_id: id })
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  // Submit lead magnet request
  static async submitLeadMagnetRequest(request: LeadMagnetRequest): Promise<void> {
    const { error } = await supabase
      .from('website_demo_requests')
      .insert({
        request_type: 'lead_magnet',
        name: request.name,
        email: request.email,
        organization: request.organization,
        role: request.role,
        resource_id: request.resource_id,
        follow_up_requested: request.follow_up_requested,
        metadata: {
          source: 'resources_page',
          timestamp: new Date().toISOString()
        }
      })
    
    if (error) {
      console.error('Error submitting lead magnet request:', error)
      throw error
    }
  }

  // Admin methods for content management
  static async createContent(content: Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .insert({
        ...content,
        view_count: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating content:', error)
      throw error
    }
    
    return data as ContentItem
  }

  static async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    const { data, error } = await supabase
      .from('content_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating content:', error)
      throw error
    }
    
    return data as ContentItem
  }

  static async deleteContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting content:', error)
      throw error
    }
  }

  // Utility methods
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  static extractExcerpt(content: string, maxLength = 160): string {
    // Remove markdown formatting
    const plainText = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    
    if (plainText.length <= maxLength) {
      return plainText
    }
    
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }
}