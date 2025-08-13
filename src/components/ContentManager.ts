import { WebsiteService } from '../services/websiteService'
import type { WebsitePage, WebsiteFeature, WebsiteTestimonial, WebsiteResource } from '../lib/supabase'

export class ContentManager {
  private static instance: ContentManager
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager()
    }
    return ContentManager.instance
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    return expiry ? Date.now() < expiry : false
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION)
  }

  private async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) as T
    }

    const data = await fetcher()
    this.setCache(key, data)
    return data
  }

  // Page content methods
  async getPageContent(slug: string): Promise<WebsitePage> {
    return this.getCachedData(`page:${slug}`, () => WebsiteService.getPageBySlug(slug))
  }

  async getFeatures(category?: string): Promise<WebsiteFeature[]> {
    const key = category ? `features:${category}` : 'features:all'
    return this.getCachedData(key, () => WebsiteService.getFeatures(category))
  }

  async getTestimonials(): Promise<WebsiteTestimonial[]> {
    return this.getCachedData('testimonials', () => WebsiteService.getFeaturedTestimonials())
  }

  async getResources(filters?: { type?: string; topic?: string; featured?: boolean }): Promise<WebsiteResource[]> {
    const key = `resources:${JSON.stringify(filters || {})}`
    return this.getCachedData(key, () => WebsiteService.getResources(filters))
  }

  async getFAQs(category?: string): Promise<any[]> {
    const key = category ? `faq:${category}` : 'faq:all'
    return this.getCachedData(key, () => WebsiteService.getFAQs(category))
  }

  async getPricingPlans(): Promise<any[]> {
    return this.getCachedData('pricing', () => WebsiteService.getPricingPlans())
  }

  // Dynamic content rendering
  async renderPageContent(slug: string, containerId: string): Promise<void> {
    try {
      const pageData = await WebsiteService.getPageData(slug)
      const container = document.getElementById(containerId)
      
      if (!container) {
        console.error(`Container ${containerId} not found`)
        return
      }

      // Update page title and meta
      if (pageData.page.title) {
        document.title = pageData.page.title
      }

      if (pageData.page.meta_description) {
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
          metaDesc.setAttribute('content', pageData.page.meta_description)
        }
      }

      // Update hero content if elements exist
      const heroTitle = document.querySelector('.hero-title, .page-hero h1')
      const heroSubtitle = document.querySelector('.hero-subtitle, .page-hero .lead')
      
      if (heroTitle && pageData.page.hero_title) {
        heroTitle.textContent = pageData.page.hero_title
      }
      
      if (heroSubtitle && pageData.page.hero_subtitle) {
        heroSubtitle.textContent = pageData.page.hero_subtitle
      }

      // Render dynamic sections based on page content
      await this.renderFeatures(pageData.features)
      await this.renderTestimonials(pageData.testimonials)
      await this.renderFAQs(pageData.faqs)
      
      if (slug === 'demo-and-pricing') {
        await this.renderPricingPlans(pageData.pricingPlans)
      }

    } catch (error) {
      console.error('Error rendering page content:', error)
    }
  }

  private async renderFeatures(features: WebsiteFeature[]): Promise<void> {
    const featuresContainer = document.querySelector('.features-list, .benefits-grid')
    if (!featuresContainer || !features.length) return

    // Only update if we have a features container and it's not already populated with database content
    if (featuresContainer.dataset.source !== 'database') {
      featuresContainer.innerHTML = ''
      
      features.forEach((feature, index) => {
        const featureElement = this.createFeatureElement(feature, index % 2 === 1)
        featuresContainer.appendChild(featureElement)
      })
      
      featuresContainer.dataset.source = 'database'
    }
  }

  private createFeatureElement(feature: WebsiteFeature, reverse = false): HTMLElement {
    const div = document.createElement('div')
    div.className = `feature-row ${reverse ? 'reverse' : ''}`
    
    div.innerHTML = `
      <div class="feature-content">
        <div class="feature-icon">
          ${feature.icon_svg || '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>'}
        </div>
        <h2>${feature.name}</h2>
        <p>${feature.description}</p>
        <ul class="feature-bullets">
          ${feature.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      <div class="feature-visual">
        <div class="feature-mockup">
          <div class="mockup-header">${feature.name} Dashboard</div>
          <div class="mockup-body">
            <p>Interactive demo content for ${feature.name}</p>
          </div>
        </div>
      </div>
    `
    
    return div
  }

  private async renderTestimonials(testimonials: WebsiteTestimonial[]): Promise<void> {
    const testimonialsContainer = document.querySelector('.testimonials, .case-studies-grid')
    if (!testimonialsContainer || !testimonials.length) return

    if (testimonialsContainer.dataset.source !== 'database') {
      testimonialsContainer.innerHTML = ''
      
      testimonials.forEach(testimonial => {
        const testimonialElement = this.createTestimonialElement(testimonial)
        testimonialsContainer.appendChild(testimonialElement)
      })
      
      testimonialsContainer.dataset.source = 'database'
    }
  }

  private createTestimonialElement(testimonial: WebsiteTestimonial): HTMLElement {
    const div = document.createElement('div')
    div.className = testimonial.is_case_study ? 'case-study-card' : 'testimonial-card'
    
    const metricsHtml = Object.entries(testimonial.metrics).map(([key, value]) => {
      return `
        <div class="metric">
          <div class="metric-value">${value}</div>
          <div class="metric-label">${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
        </div>
      `
    }).join('')
    
    div.innerHTML = `
      ${testimonial.is_case_study ? `
        <div class="case-study-header">
          <div class="institution-logo">${testimonial.customer_organization}</div>
          <div class="case-study-metrics">
            ${metricsHtml}
          </div>
        </div>
        <div class="case-study-content">
      ` : `
        <div class="testimonial-stats">
          ${metricsHtml}
        </div>
      `}
        <blockquote>${testimonial.testimonial_text}</blockquote>
        <cite>
          <strong>${testimonial.customer_name}</strong>
          <span>${testimonial.customer_title}, ${testimonial.customer_organization}</span>
        </cite>
      ${testimonial.is_case_study ? '</div>' : ''}
    `
    
    return div
  }

  private async renderFAQs(faqs: any[]): Promise<void> {
    const faqContainer = document.querySelector('.faq-grid, .faq-column')
    if (!faqContainer || !faqs.length) return

    if (faqContainer.dataset.source !== 'database') {
      // Group FAQs by category or split into columns
      const faqColumns = this.groupFAQsIntoColumns(faqs)
      faqContainer.innerHTML = ''
      
      faqColumns.forEach(columnFAQs => {
        const column = document.createElement('div')
        column.className = 'faq-column'
        
        columnFAQs.forEach(faq => {
          const faqElement = this.createFAQElement(faq)
          column.appendChild(faqElement)
        })
        
        faqContainer.appendChild(column)
      })
      
      faqContainer.dataset.source = 'database'
    }
  }

  private groupFAQsIntoColumns(faqs: any[]): any[][] {
    const columns: any[][] = [[], []]
    faqs.forEach((faq, index) => {
      columns[index % 2].push(faq)
    })
    return columns
  }

  private createFAQElement(faq: any): HTMLElement {
    const div = document.createElement('div')
    div.className = 'faq-item'
    
    const faqId = `faq-${faq.id}`
    
    div.innerHTML = `
      <button class="faq-question" data-target="#${faqId}">
        <span>${faq.question}</span>
        <svg class="faq-icon" viewBox="0 0 24 24">
          <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
      <div id="${faqId}" class="faq-answer">
        <p>${faq.answer}</p>
      </div>
    `
    
    return div
  }

  private async renderPricingPlans(plans: any[]): Promise<void> {
    const pricingContainer = document.querySelector('.pricing-grid')
    if (!pricingContainer || !plans.length) return

    if (pricingContainer.dataset.source !== 'database') {
      pricingContainer.innerHTML = ''
      
      plans.forEach(plan => {
        const planElement = this.createPricingPlanElement(plan)
        pricingContainer.appendChild(planElement)
      })
      
      pricingContainer.dataset.source = 'database'
    }
  }

  private createPricingPlanElement(plan: any): HTMLElement {
    const div = document.createElement('div')
    div.className = `pricing-card ${plan.is_popular ? 'popular' : ''}`
    
    const monthlyPrice = plan.monthly_price ? `$${plan.monthly_price}` : 'Custom'
    const annualPrice = plan.annual_price ? `$${plan.annual_price}` : 'Custom'
    
    div.innerHTML = `
      ${plan.is_popular ? '<div class="pricing-badge">Most Popular</div>' : ''}
      <div class="pricing-header">
        <h3>${plan.name}</h3>
        <p class="pricing-description">${plan.description || ''}</p>
        <div class="pricing-price">
          <span class="price-amount monthly">${monthlyPrice}</span>
          <span class="price-amount annual" style="display: none;">${annualPrice}</span>
          <span class="price-period">${plan.is_custom ? 'pricing' : '/month'}</span>
        </div>
      </div>
      <div class="pricing-features">
        <div class="feature-group">
          <h4>${plan.name === 'Starter' ? 'Included Features' : `Everything in ${plan.name === 'Professional' ? 'Starter' : 'Professional'}, plus:`}</h4>
          <ul>
            ${plan.features.map((feature: string) => `<li><span class="check-icon">✓</span> ${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="pricing-footer">
        <button class="btn ${plan.is_popular ? 'btn-primary' : 'btn-secondary'} btn-full">
          ${plan.is_custom ? 'Contact Sales' : 'Start Free Trial'}
        </button>
        <p class="pricing-note">${plan.is_custom ? 'Custom implementation & pricing' : '14-day free trial, no credit card required'}</p>
      </div>
    `
    
    return div
  }

  // Form submission handlers
  async submitDemoRequest(formData: FormData): Promise<void> {
    const data = Object.fromEntries(formData.entries())
    
    // Check honeypot
    if (data.website) {
      return
    }

    const request = {
      request_type: 'demo' as const,
      name: data.name as string,
      email: data.email as string,
      phone: data.phone as string,
      organization: data.organization as string,
      crm_system: data.crm as string,
      monthly_inquiries: data.inquiries as string,
      metadata: {},
      status: 'new' as const,
      follow_up_requested: false
    }

    await WebsiteService.createDemoRequest(request)
    
    // Track analytics
    await this.trackEvent('form_submit', {
      form_type: 'demo_request',
      organization: request.organization
    })
  }

  async submitCallRequest(formData: FormData): Promise<void> {
    const data = Object.fromEntries(formData.entries())
    
    if (data.website) {
      return
    }

    const request = {
      request_type: 'call' as const,
      name: data.name as string,
      phone: data.phone as string,
      metadata: {
        call_time: data.callTime,
        consent: data.consent === 'on'
      },
      status: 'new' as const,
      follow_up_requested: false
    }

    await WebsiteService.createDemoRequest(request)
    
    await this.trackEvent('form_submit', {
      form_type: 'call_request',
      call_time: data.callTime
    })
  }

  async submitLeadMagnetRequest(formData: FormData): Promise<void> {
    const data = Object.fromEntries(formData.entries())
    
    if (data.website) {
      return
    }

    const request = {
      request_type: 'lead_magnet' as const,
      name: data.name as string,
      email: data.email as string,
      organization: data.organization as string,
      role: data.role as string,
      resource_id: data.resourceId as string,
      metadata: {},
      status: 'new' as const,
      follow_up_requested: data.followUp === 'on'
    }

    await WebsiteService.createDemoRequest(request)
    
    await this.trackEvent('form_submit', {
      form_type: 'lead_magnet',
      resource_id: data.resourceId
    })
  }

  // Analytics tracking
  async trackEvent(eventType: string, eventData: Record<string, any> = {}): Promise<void> {
    try {
      await WebsiteService.trackEvent({
        page_slug: window.location.pathname.replace('/', '') || 'home',
        event_type: eventType as any,
        event_data: eventData,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_id: this.getSessionId()
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  async trackPageView(): Promise<void> {
    await this.trackEvent('page_view', {
      title: document.title,
      url: window.location.href
    })
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('website_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('website_session_id', sessionId)
    }
    return sessionId
  }

  // Cache management
  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
          this.cacheExpiry.delete(key)
        }
      }
    } else {
      this.clearCache()
    }
  }
}