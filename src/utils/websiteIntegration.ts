import { ContentManager } from '../components/ContentManager'
import { WebsiteService } from '../services/websiteService'

export class WebsiteIntegration {
  private contentManager: ContentManager
  private isInitialized = false

  constructor() {
    this.contentManager = ContentManager.getInstance()
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Track page view
      await this.contentManager.trackPageView()

      // Load and render dynamic content
      const currentPage = this.getCurrentPageSlug()
      await this.loadPageContent(currentPage)

      // Enhance existing forms with database integration
      this.enhanceFormsWithDatabase()

      // Add analytics tracking to existing buttons
      this.addAnalyticsTracking()

      this.isInitialized = true
      console.log('Website database integration initialized')
    } catch (error) {
      console.error('Failed to initialize website integration:', error)
    }
  }

  private getCurrentPageSlug(): string {
    const path = window.location.pathname
    if (path === '/') return 'home'
    return path.replace('/', '').replace('.html', '')
  }

  private async loadPageContent(slug: string): Promise<void> {
    try {
      // Load page-specific content from database
      await this.contentManager.renderPageContent(slug, 'main')
    } catch (error) {
      console.error(`Error loading content for page ${slug}:`, error)
    }
  }

  private enhanceFormsWithDatabase(): void {
    // Enhance demo request form
    const demoForm = document.getElementById('demo-request-form') as HTMLFormElement
    if (demoForm) {
      demoForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
          const formData = new FormData(demoForm)
          await this.contentManager.submitDemoRequest(formData)
          
          // Show success message
          demoForm.style.display = 'none'
          const successDiv = document.getElementById('demo-success')
          if (successDiv) {
            successDiv.style.display = 'block'
          }
        } catch (error) {
          console.error('Demo request submission error:', error)
          this.showErrorMessage('Failed to submit demo request. Please try again.')
        }
      })
    }

    // Enhance call demo form
    const callForm = document.getElementById('call-demo-form') as HTMLFormElement
    if (callForm) {
      callForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
          const formData = new FormData(callForm)
          await this.contentManager.submitCallRequest(formData)
          
          callForm.style.display = 'none'
          const successDiv = document.getElementById('call-success')
          if (successDiv) {
            successDiv.style.display = 'block'
          }
        } catch (error) {
          console.error('Call request submission error:', error)
          this.showErrorMessage('Failed to submit call request. Please try again.')
        }
      })
    }

    // Enhance lead magnet form
    const magnetForm = document.getElementById('lead-magnet-form') as HTMLFormElement
    if (magnetForm) {
      magnetForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
          const formData = new FormData(magnetForm)
          await this.contentManager.submitLeadMagnetRequest(formData)
          
          magnetForm.style.display = 'none'
          const successDiv = document.getElementById('magnet-success')
          if (successDiv) {
            successDiv.style.display = 'block'
          }
        } catch (error) {
          console.error('Lead magnet submission error:', error)
          this.showErrorMessage('Failed to submit request. Please try again.')
        }
      })
    }
  }

  private addAnalyticsTracking(): void {
    // Track button clicks
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      
      if (target.matches('.btn, button')) {
        const buttonText = target.textContent?.trim() || ''
        const buttonId = target.id || ''
        
        await this.contentManager.trackEvent('button_click', {
          button_text: buttonText,
          button_id: buttonId,
          button_class: target.className
        })
      }
    })

    // Track chat widget opens
    const chatToggle = document.getElementById('chat-toggle')
    if (chatToggle) {
      chatToggle.addEventListener('click', async () => {
        await this.contentManager.trackEvent('chat_open', {})
      })
    }

    // Track resource downloads
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      
      if (target.matches('[data-resource-id]')) {
        const resourceId = target.dataset.resourceId
        await this.contentManager.trackEvent('download', {
          resource_id: resourceId,
          resource_type: 'lead_magnet'
        })
      }
    })
  }

  private showErrorMessage(message: string): void {
    const toast = document.createElement('div')
    toast.className = 'toast toast-error'
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--error);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out'
      setTimeout(() => toast.remove(), 300)
    }, 5000)
  }

  // Public methods for external use
  async refreshContent(): Promise<void> {
    this.contentManager.clearCache()
    const currentPage = this.getCurrentPageSlug()
    await this.loadPageContent(currentPage)
  }

  async getPageData(slug: string): Promise<any> {
    return WebsiteService.getPageData(slug)
  }

  async updatePageContent(slug: string, updates: Partial<any>): Promise<void> {
    // This would be used by an admin interface
    this.contentManager.invalidateCache(`page:${slug}`)
  }
}