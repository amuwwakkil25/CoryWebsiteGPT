import { ContentService } from '../services/contentService'
import { ContentHelpers } from '../utils/contentHelpers'
import { FormHelpers } from '../utils/formHelpers'
import { ModalHelpers } from '../utils/modalHelpers'

export class ResourcesManager {
  private allContent: any[] = []
  private filteredContent: any[] = []
  private currentView: 'grid' | 'list' = 'grid'
  private currentPage: number = 1
  private readonly itemsPerPage: number = 12
  private isLoading: boolean = false

  constructor() {
    this.init()
  }

  async init(): Promise<void> {
    try {
      this.showLoadingState()
      
      // Load content from database
      this.allContent = await ContentService.getAllContent()
      this.filteredContent = [...this.allContent]
      
      // Bind all events
      this.bindEvents()
      
      // Render content
      this.renderFeaturedContent()
      this.renderAllContent()
      
      console.log('✅ Resources page initialized successfully')
    } catch (error) {
      console.error('❌ Error initializing resources page:', error)
      this.showErrorState()
    }
  }

  private bindEvents(): void {
    this.bindSearchEvents()
    this.bindFilterEvents()
    this.bindViewEvents()
    this.bindFormEvents()
    ModalHelpers.bindModalEvents()
  }

  private bindSearchEvents(): void {
    const searchInput = document.getElementById('resource-search') as HTMLInputElement
    if (searchInput) {
      let searchTimeout: NodeJS.Timeout
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          this.handleSearch(searchInput.value)
        }, 300)
      })
    }
  }

  private bindFilterEvents(): void {
    const typeFilter = document.getElementById('type-filter')
    const categoryFilter = document.getElementById('category-filter')
    const clearFilters = document.getElementById('clear-filters')

    typeFilter?.addEventListener('change', () => this.applyFilters())
    categoryFilter?.addEventListener('change', () => this.applyFilters())
    clearFilters?.addEventListener('click', () => this.clearAllFilters())
  }

  private bindViewEvents(): void {
    const viewButtons = document.querySelectorAll('.view-btn')
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement
        const view = target.dataset.view as 'grid' | 'list'
        this.toggleView(view)
      })
    })

    const loadMoreBtn = document.getElementById('load-more')
    loadMoreBtn?.addEventListener('click', () => this.loadMoreContent())
  }

  private bindFormEvents(): void {
    const newsletterForm = document.getElementById('newsletter-form')
    newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterSignup(e))

    const magnetForm = document.getElementById('lead-magnet-form')
    magnetForm?.addEventListener('submit', (e) => this.handleLeadMagnetForm(e))
  }

  private handleSearch(query: string): void {
    const searchTerm = query.toLowerCase().trim()
    
    if (!searchTerm) {
      this.filteredContent = [...this.allContent]
    } else {
      this.filteredContent = this.allContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
        item.category.toLowerCase().includes(searchTerm)
      )
    }
    
    this.currentPage = 1
    this.renderAllContent()
  }

  private applyFilters(): void {
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement
    
    const selectedType = typeFilter?.value || 'all'
    const selectedCategory = categoryFilter?.value || 'all'
    
    this.filteredContent = this.allContent.filter(item => {
      const typeMatch = selectedType === 'all' || item.content_type === selectedType
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      return typeMatch && categoryMatch
    })
    
    this.currentPage = 1
    this.renderAllContent()
  }

  private clearAllFilters(): void {
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement
    const searchInput = document.getElementById('resource-search') as HTMLInputElement
    
    if (typeFilter) typeFilter.value = 'all'
    if (categoryFilter) categoryFilter.value = 'all'
    if (searchInput) searchInput.value = ''
    
    this.filteredContent = [...this.allContent]
    this.currentPage = 1
    this.renderAllContent()
  }

  private toggleView(view: 'grid' | 'list'): void {
    this.currentView = view
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active')
      if ((btn as HTMLElement).dataset.view === view) {
        btn.classList.add('active')
      }
    })
    
    // Update grid class
    const resourcesGrid = document.getElementById('resources-content')
    if (resourcesGrid) {
      resourcesGrid.className = view === 'list' ? 'resources-grid list-view' : 'resources-grid'
    }
  }

  private renderFeaturedContent(): void {
    const container = document.getElementById('featured-content')
    if (!container) return

    const featuredItems = this.allContent.filter(item => item.is_featured)
    
    if (featuredItems.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No featured resources available.</p></div>'
      return
    }

    container.innerHTML = featuredItems.map(item => 
      ContentHelpers.createContentCard(item, 'featured')
    ).join('')
    
    // Bind click events
    container.querySelectorAll('.featured-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.navigateToContent(featuredItems[index])
      })
    })
  }

  private renderAllContent(): void {
    const container = document.getElementById('resources-content')
    if (!container) return

    const startIndex = 0
    const endIndex = this.currentPage * this.itemsPerPage
    const itemsToShow = this.filteredContent.slice(startIndex, endIndex)
    
    if (itemsToShow.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="search"></i>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `
      return
    }

    container.innerHTML = itemsToShow.map(item => 
      ContentHelpers.createContentCard(item, 'resource')
    ).join('')
    
    // Bind click events
    container.querySelectorAll('.resource-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.navigateToContent(itemsToShow[index])
      })
    })

    this.updateLoadMoreButton()
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons()
    }
  }

  private navigateToContent(item: any): void {
    // Check if it's a downloadable resource
    if (item.content_type === 'ebook' || item.download_url) {
      this.openLeadMagnetModal(item)
      return
    }
    
    // Check if it's an external resource
    if (item.external_url) {
      window.open(item.external_url, '_blank')
      return
    }
    
    // Navigate to content page
    window.location.href = `/content/${item.slug}.html`
  }

  private openLeadMagnetModal(item: any): void {
    const modal = document.getElementById('lead-magnet-modal') as HTMLElement
    const title = document.getElementById('magnet-modal-title') as HTMLElement
    const description = document.getElementById('magnet-modal-description') as HTMLElement
    const resourceId = document.getElementById('magnet-resource-id') as HTMLInputElement
    
    if (!modal || !title || !description || !resourceId) return

    title.textContent = `Download: ${item.title}`
    description.innerHTML = `
      <p>${item.excerpt}</p>
      ${item.content_type === 'ebook' ? '<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>' : ''}
    `
    resourceId.value = item.id

    ModalHelpers.openModal(modal)
  }

  private handleLeadMagnetForm(e: Event): void {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    if (FormHelpers.checkHoneypot(formData)) return
    if (!FormHelpers.validateForm(form)) return

    const data = Object.fromEntries(formData.entries())
    
    console.log('📝 Lead magnet request submitted', {
      name: data.name,
      email: data.email,
      organization: data.organization,
      resource_id: data.resourceId
    })

    form.style.display = 'none'
    const successDiv = document.getElementById('magnet-success') as HTMLElement
    if (successDiv) {
      successDiv.style.display = 'block'
    }

    FormHelpers.showToast('Resource request submitted successfully!', 'success')
  }

  private handleNewsletterSignup(e: Event): void {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get('email')

    console.log('📧 Newsletter signup', { email })
    
    FormHelpers.showToast('Successfully subscribed to newsletter!', 'success')
    form.reset()
  }

  private updateLoadMoreButton(): void {
    const loadMoreBtn = document.getElementById('load-more') as HTMLElement
    if (!loadMoreBtn) return

    const hasMore = this.filteredContent.length > this.currentPage * this.itemsPerPage
    loadMoreBtn.style.display = hasMore ? 'block' : 'none'
  }

  private loadMoreContent(): void {
    this.currentPage++
    this.renderAllContent()
  }

  private showLoadingState(): void {
    const containers = ['featured-content', 'resources-content']
    containers.forEach(id => {
      const container = document.getElementById(id)
      if (container) {
        container.innerHTML = `
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        `
      }
    })
  }

  private showErrorState(): void {
    const containers = ['featured-content', 'resources-content']
    containers.forEach(id => {
      const container = document.getElementById(id)
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page or contact support.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `
      }
    })
  }

  // Public methods
  shareContent(title: string, url: string): void {
    FormHelpers.copyToClipboard(url, `Link copied to clipboard: ${title}`)
  }
}