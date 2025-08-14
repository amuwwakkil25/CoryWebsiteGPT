import { supabase } from '../lib/supabase'

export interface DemoRequest {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  institution: string
  occupation: string
  interest_area?: string
  request_type: 'demo' | 'custom_ai'
  status?: 'new' | 'contacted' | 'scheduled' | 'completed'
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export class DemoService {
  static async createDemoRequest(request: Omit<DemoRequest, 'id' | 'created_at' | 'updated_at'>): Promise<DemoRequest> {
    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        ...request,
        status: 'new',
        metadata: request.metadata || {}
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating demo request:', error)
      throw error
    }
    
    return data as DemoRequest
  }

  static async getDemoRequests(filters?: {
    status?: string
    request_type?: string
    limit?: number
  }): Promise<DemoRequest[]> {
    let query = supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.request_type) {
      query = query.eq('request_type', filters.request_type)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching demo requests:', error)
      throw error
    }
    
    return data as DemoRequest[]
  }

  static async updateDemoRequest(id: string, updates: Partial<DemoRequest>): Promise<DemoRequest> {
    const { data, error } = await supabase
      .from('demo_requests')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating demo request:', error)
      throw error
    }
    
    return data as DemoRequest
  }
}