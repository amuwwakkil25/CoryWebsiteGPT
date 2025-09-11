import { ContentService } from '../services/contentService'
import { ContentHelpers } from '../utils/contentHelpers'
import { FormHelpers } from '../utils/formHelpers'

export class ContentPageManager {
  private content: any | null = null
  private relatedContent: any[] = []

  constructor() {
    this.init()
  }

  async init(): Promise<void> {
    try {
      const slug = this.getSlugFromURL()
      if (!slug) {
        this.showErrorState()
        return
      }

      await this.loadContent(slug)
      
      if (this.content) {
        await this.loadRelatedContent()
        this.renderContent()
        this.updateSEO()
        await this.trackView()
      } else {
        this.showErrorState()
      }
    } catch (error) {
      console.error('Error initializing content page:', error)
      this.showErrorState()
    }
  }

  private getSlugFromURL(): string | null {
    const pathParts = window.location.pathname.split('/')
    return pathParts[pathParts.length - 1]?.replace('.html', '') || null
  }

  private async loadContent(slug: string): Promise<void> {
    try {
      this.content = await ContentService.getContentBySlug(slug)
    } catch (error) {
      console.error('Error loading content:', error)
      this.content = null
    }
  }

  private async loadRelatedContent(): Promise<void> {
    if (!this.content) return

    try {
      this.relatedContent = await ContentService.getRelatedContent(this.content, 3)
    } catch (error) {
      console.error('Error loading related content:', error)
      this.relatedContent = []
    }
  }

  private renderContent(): void {
    if (!this.content) return

    const container = document.getElementById('content-container')
    const loadingState = document.getElementById('loading-state')
    
    if (!container || !loadingState) return

    // Hide loading state
    loadingState.style.display = 'none'
    
    // Render content
    container.innerHTML = this.createContentHTML()
    container.style.display = 'block'

    // Bind events
    this.bindContentEvents()

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons()
    }
  }

  private createContentHTML(): string {
    if (!this.content) return ''

    const isDownloadable = this.content.content_type === 'ebook' || this.content.download_url
    const isExternal = this.content.content_type === 'webinar' && this.content.external_url

    return `
      <!-- Content Hero -->
      <section class="content-hero">
        <div class="container">
          <div class="content-breadcrumb">
            <a href="/resources.html">Resources</a> / 
            <a href="/resources.html?type=${this.content.content_type}">${ContentHelpers.formatContentType(this.content.content_type)}</a> / 
            <span>${this.content.title}</span>
          </div>
          
          <div class="content-badge ${this.content.content_type}">${ContentHelpers.formatContentType(this.content.content_type)}</div>
          <h1>${this.content.title}</h1>
          <p class="lead">${this.content.excerpt}</p>
          
          <div class="content-meta-hero">
            <div class="meta-item-hero">
              <i data-lucide="user"></i>
              <span>${this.content.author_name}</span>
            </div>
            <div class="meta-item-hero">
              <i data-lucide="calendar"></i>
              <span>${ContentHelpers.formatDateLong(this.content.published_at)}</span>
            </div>
            ${this.content.reading_time_minutes ? `
              <div class="meta-item-hero">
                <i data-lucide="clock"></i>
                <span>${this.content.reading_time_minutes} min read</span>
              </div>
            ` : ''}
            <div class="meta-item-hero">
              <i data-lucide="eye"></i>
              <span>${this.content.view_count} views</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Main -->
      <section class="content-main">
        <div class="container">
          <div class="content-layout">
            <article class="content-article">
              ${this.content.featured_image_url ? `
                <img src="${this.content.featured_image_url}" alt="${this.content.title}" class="article-featured-image" />
              ` : ''}
              
              ${isDownloadable ? this.createDownloadSection() : ''}
              ${isExternal ? this.createExternalSection() : ''}
              
              <div class="article-content">
                ${ContentHelpers.convertMarkdownToHTML(this.content.content)}
              </div>
              
              ${this.content.content_type === 'case_study' ? this.createMetricsSection() : ''}
              
              <div class="article-footer">
                <div class="article-tags">
                  ${this.content.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                </div>
                
                <div class="article-actions">
                  <button class="btn btn-secondary" onclick="window.print()">
                    <i data-lucide="printer"></i>
                    Print Article
                  </button>
                  <button class="btn btn-secondary" onclick="this.shareContent()">
                    <i data-lucide="share-2"></i>
                    Share
                  </button>
                  <a href="/demo-and-pricing.html" class="btn btn-primary">
                    <i data-lucide="arrow-right"></i>
                    Get Started with Cory
                  </a>
                </div>
              </div>
            </article>
            
            <aside class="content-sidebar">
              ${this.createAuthorCard()}
              ${this.createTableOfContents()}
              ${this.createRelatedContent()}
              ${this.createCTACard()}
            </aside>
          </div>
        </div>
      </section>

      <!-- Related Posts Section -->
      ${this.createRelatedPostsSection()}
    `
  }

  private createDownloadSection(): string {
    return `
      <div class="download-section">
        <div class="download-card">
          <div class="download-icon">
            <i data-lucide="download"></i>
          </div>
          <div class="download-content">
            <h3>Download This ${ContentHelpers.formatContentType(this.content!.content_type)}</h3>
            <p>Get the complete ${this.content!.content_type} as a PDF for offline reading and sharing.</p>
            <button class="btn btn-primary btn-lg" id="download-content-btn">
              <i data-lucide="download"></i>
              Download Now
            </button>
          </div>
        </div>
      </div>
    `
  }

  private createExternalSection(): string {
    return `
      <div class="external-section">
        <div class="external-card">
          <div class="external-icon">
            <i data-lucide="external-link"></i>
          </div>
          <div class="external-content">
            <h3>Watch This ${ContentHelpers.formatContentType(this.content!.content_type)}</h3>
            <p>Join us for this live presentation and Q&A session.</p>
            <a href="${this.content!.external_url}" target="_blank" class="btn btn-primary btn-lg">
              <i data-lucide="play"></i>
              Watch Now
            </a>
          </div>
        </div>
      </div>
    `
  }

  private createMetricsSection(): string {
    if (!this.content?.metrics || Object.keys(this.content.metrics).length === 0) {
      return ''
    }

    const metricsHTML = Object.entries(this.content.metrics).map(([key, value]) => `
      <div class="metric-item">
        <div class="metric-value">${value}</div>
        <div class="metric-label">${this.formatMetricLabel(key)}</div>
      </div>
    `).join('')

    return `
      <div class="case-study-metrics">
        <h3>Key Results</h3>
        <div class="metrics-grid">
          ${metricsHTML}
        </div>
      </div>
    `
  }

  private createAuthorCard(): string {
    return `
      <div class="sidebar-card author-card">
        <h4>About the Author</h4>
        <div class="author-info">
          <div class="author-avatar">
            <i data-lucide="user"></i>
          </div>
          <div class="author-details">
            <h5>${this.content!.author_name}</h5>
            <p>${this.content!.author_title}</p>
          </div>
        </div>
      </div>
    `
  }

  private createTableOfContents(): string {
    if (!this.content?.content) return ''

    const headings = this.content.content.match(/^#{2,4}\s(.+)$/gm) || []
    
    if (headings.length === 0) return ''

    const tocItems = headings.map((heading: string) => {
      const level = heading.match(/^#{2,4}/)?.[0].length || 2
      const text = heading.replace(/^#{2,4}\s/, '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      return `<li class="toc-item level-${level}"><a href="#${id}">${text}</a></li>`
    }).join('')

    return `
      <div class="sidebar-card toc-card">
        <h4>Table of Contents</h4>
        <ul class="table-of-contents">
          ${tocItems}
        </ul>
      </div>
    `
  }

  private createRelatedContent(): string {
    if (this.relatedContent.length === 0) return ''

    const relatedHTML = this.relatedContent.map(item => `
      <div class="related-content-item" data-slug="${item.slug}">
        <div class="related-image">
          <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200'}" alt="${item.title}" />
        </div>
        <div class="related-content-info">
          <h5>${item.title}</h5>
          <p>${ContentHelpers.formatContentType(item.content_type)} • ${item.reading_time_minutes || 5} min read</p>
        </div>
      </div>
    `).join('')

    return `
      <div class="sidebar-card related-card">
        <h4>Related Content</h4>
        <div class="related-content-list">
          ${relatedHTML}
        </div>
      </div>
    `
  }

  private createCTACard(): string {
    return `
      <div class="sidebar-card cta-card">
        <div class="cta-content">
          <div class="cta-icon">
            <i data-lucide="zap"></i>
          </div>
          <h4>Ready to Get Started?</h4>
          <p>See how Agent Cory can transform your admissions process in just 30 minutes.</p>
          <a href="/demo-and-pricing.html" class="btn btn-primary btn-full">
            <i data-lucide="calendar"></i>
            Book Demo
          </a>
        </div>
      </div>
    `
  }

  private createRelatedPostsSection(): string {
    if (this.relatedContent.length === 0) return ''

    const relatedPostsHTML = this.relatedContent.map(item => `
      <div class="related-post-card" onclick="window.location.href='/${item.slug}.html'">
        <div class="related-post-image">
          <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}" />
          <div class="related-post-overlay">
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
          </div>
        </div>
        <div class="related-post-content">
          <div class="related-post-meta">
            <span class="post-author">AGENT CORY</span>
          </div>
          <h4>${item.title}</h4>
        </div>
      </div>
    `).join('')

    return `
      <!-- Related Posts Section -->
      <section class="related-posts-section section bg-light">
        <div class="container">
          <h2 class="section-title">Related posts</h2>
          <div class="related-posts-grid">
            ${relatedPostsHTML}
          </div>
        </div>
      </section>
    `
  }

  private bindContentEvents(): void {
    // Download button
    const downloadBtn = document.getElementById('download-content-btn')
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.handleDownload())
    }

    // Related content clicks
    document.querySelectorAll('.related-content-item').forEach(item => {
      item.addEventListener('click', () => {
        const slug = item.getAttribute('data-slug')
        if (slug) {
          window.location.href = `/${slug}.html`
        }
      })
    })

    // Table of contents smooth scrolling
    document.querySelectorAll('.table-of-contents a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1)
        const targetElement = document.getElementById(targetId || '')
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })
  }

  private async handleDownload(): Promise<void> {
    if (!this.content) return

    if (this.content.download_url) {
      window.open(this.content.download_url, '_blank')
      return
    }

    console.log('Opening lead magnet form for:', this.content.title)
  }

  private updateSEO(): void {
    if (!this.content) return

    document.title = this.content.seo_title || `${this.content.title} - Agent Cory`
    
    const metaDesc = document.getElementById('page-description')
    if (metaDesc) {
      metaDesc.setAttribute('content', this.content.seo_description || this.content.excerpt)
    }

    const ogTitle = document.getElementById('og-title')
    const ogDescription = document.getElementById('og-description')
    const ogImage = document.getElementById('og-image')
    const ogUrl = document.getElementById('og-url')

    if (ogTitle) ogTitle.setAttribute('content', this.content.title)
    if (ogDescription) ogDescription.setAttribute('content', this.content.excerpt)
    if (ogImage && this.content.featured_image_url) {
      ogImage.setAttribute('content', this.content.featured_image_url)
    }
    if (ogUrl) ogUrl.setAttribute('content', window.location.href)
  }

  private async trackView(): Promise<void> {
    if (!this.content) return

    try {
      await ContentService.incrementViewCount(this.content.id)
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  private formatMetricLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  private showErrorState(): void {
    const loadingState = document.getElementById('loading-state')
    const errorState = document.getElementById('error-state')
    
    if (loadingState) loadingState.style.display = 'none'
    if (errorState) errorState.style.display = 'block'
  }

  // Public methods
  shareContent(): void {
    if (!this.content) return

    if (navigator.share) {
      navigator.share({
        title: this.content.title,
        text: this.content.excerpt,
        url: window.location.href
      })
    } else {
      FormHelpers.copyToClipboard(window.location.href, 'Link copied to clipboard!')
    }
  }
}