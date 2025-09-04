// Resources Page - Using ContentService for proper Supabase integration
import { ContentService } from '../../src/services/contentService.ts';

class ResourcesPageManager {
  constructor() {
    this.allContent = [];
    this.filteredContent = [];
    this.currentView = 'grid';
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.isLoading = false;
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Resources Page Manager...');
    
    try {
      // Show loading state briefly
      // Check environment variables with detailed logging
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Log all available environment variables (safely)
      const envVars = {};
      for (const key in import.meta.env) {
        if (key.startsWith('VITE_')) {
          envVars[key] = key.includes('KEY') || key.includes('SECRET') 
            ? `${import.meta.env[key]?.substring(0, 10)}...` 
            : import.meta.env[key];
        }
      }
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`);
      }
      
      if (!supabaseUrl.includes('supabase.co')) {
        throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
      }
      
      if (!supabaseKey.startsWith('eyJ')) {
        throw new Error(`Invalid Supabase key format: ${supabaseKey.substring(0, 10)}...`);
      }
      
      const testUrl = `${supabaseUrl}/rest/v1/`;
      console.log('Testing connection to:', { testUrl });
      
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
      
      console.log('Connection test result:', {
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Connection test failed with response:', { errorText });
      }
      
      this.allContent = await ContentService.getAllContent();
      this.filteredContent = [...this.allContent];
      
      console.log('Content loaded', { 
        urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
        keyPreview: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
        urlValid: supabaseUrl && supabaseUrl.includes('supabase.co'),
        keyValid: supabaseKey && supabaseKey.startsWith('eyJ'),
        buildMode: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD,
        allEnvVars: envVars
      });
      
      // Bind event listeners
      this.bindEvents();
      
      // Render content immediately
      this.renderFeaturedContent();
      this.renderAllContent();
      
      console.log('✅ Resources page initialized successfully');
    } catch (error) {
      console.error('❌ Critical initialization error', error);
      this.showErrorState();
    }
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById('resource-search');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(searchInput.value);
        }, 300);
      });
    }

    // Filter controls
    const typeFilter = document.getElementById('type-filter');
    const categoryFilter = document.getElementById('category-filter');
    const clearFilters = document.getElementById('clear-filters');

    if (typeFilter) {
      typeFilter.addEventListener('change', () => this.applyFilters());
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.applyFilters());
    }

    if (clearFilters) {
      clearFilters.addEventListener('click', () => this.clearAllFilters());
    }

    // View toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const view = target.dataset.view;
        this.toggleView(view);
      });
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => this.loadMoreContent());
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSignup(e));
    }

    // Bind modal events
    this.bindModalEvents();
  }

  bindModalEvents() {
    // Close modal events
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target);
      }
    });

    // Lead magnet form
    const magnetForm = document.getElementById('lead-magnet-form');
    if (magnetForm) {
      magnetForm.addEventListener('submit', (e) => this.handleLeadMagnetForm(e));
    }
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredContent = [...this.allContent];
    } else {
      this.filteredContent = this.allContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }
    
    this.currentPage = 1;
    this.renderAllContent();
  }

  applyFilters() {
    const typeFilter = document.getElementById('type-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    const selectedType = typeFilter?.value || 'all';
    const selectedCategory = categoryFilter?.value || 'all';
    
    this.filteredContent = this.allContent.filter(item => {
      const typeMatch = selectedType === 'all' || item.content_type === selectedType;
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      return typeMatch && categoryMatch;
    });
    
    this.currentPage = 1;
    this.renderAllContent();
  }

  clearAllFilters() {
    const typeFilter = document.getElementById('type-filter');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('resource-search');
    
    if (typeFilter) typeFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    this.filteredContent = [...this.allContent];
    this.currentPage = 1;
    this.renderAllContent();
  }

  toggleView(view) {
    this.currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      }
    });
    
    // Update grid class
    const resourcesGrid = document.getElementById('resources-content');
    if (resourcesGrid) {
      resourcesGrid.className = view === 'list' ? 'resources-grid list-view' : 'resources-grid';
    }
  }

  renderFeaturedContent() {
    const container = document.getElementById('featured-content');
    if (!container) return;

    const featuredItems = this.allContent.filter(item => item.is_featured);
    
    console.log('Rendering featured content', { count: featuredItems.length });
    
    if (featuredItems.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No featured resources available.</p></div>';
      return;
    }

    container.innerHTML = featuredItems.map(item => this.createFeaturedCard(item)).join('');
    
    // Bind click events
    container.querySelectorAll('.featured-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.openContentModal(featuredItems[index]);
      });
    });
  }

  renderAllContent() {
    const container = document.getElementById('resources-content');
    if (!container) return;

    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    const itemsToShow = this.filteredContent.slice(startIndex, endIndex);
    
    console.log('Rendering all content', { 
      total: this.filteredContent.length,
      showing: itemsToShow.length,
      page: this.currentPage
    });
    
    if (itemsToShow.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="search"></i>
          <h3>No resources found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = itemsToShow.map(item => this.createResourceCard(item)).join('');
    
    // Bind click events
    container.querySelectorAll('.resource-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.openContentModal(itemsToShow[index]);
      });
    });

    // Update load more button
    this.updateLoadMoreButton();
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  createFeaturedCard(item) {
    return `
      <div class="featured-card" data-id="${item.id}">
        <div class="featured-image">
          <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}" />
          <div class="content-badge ${item.content_type}">${this.formatContentType(item.content_type)}</div>
        </div>
        <div class="featured-content">
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
          <div class="content-meta">
            <div class="meta-item">
              <i data-lucide="user" class="meta-icon"></i>
              <span>${item.author_name}</span>
            </div>
            ${item.reading_time_minutes ? `
              <div class="meta-item">
                <i data-lucide="clock" class="meta-icon"></i>
                <span>${item.reading_time_minutes} min read</span>
              </div>
            ` : ''}
            <div class="meta-item">
              <i data-lucide="calendar" class="meta-icon"></i>
              <span>${this.formatDate(item.published_at)}</span>
            </div>
          </div>
          <div class="content-tags">
            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  createResourceCard(item) {
    return `
      <div class="resource-card" data-id="${item.id}">
        <div class="resource-image">
          <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}" />
          <div class="content-badge ${item.content_type}">${this.formatContentType(item.content_type)}</div>
        </div>
        <div class="resource-content">
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
          <div class="resource-footer">
            <div class="read-time">
              <i data-lucide="clock"></i>
              <span>${item.reading_time_minutes || 5} min read</span>
            </div>
            <div class="resource-action">
              <span>${this.getActionText(item.content_type)}</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  formatContentType(type) {
    const typeMap = {
      blog: 'Blog Post',
      case_study: 'Case Study',
      guide: 'Guide',
      ebook: 'eBook',
      webinar: 'Webinar'
    };
    return typeMap[type] || type;
  }

  getActionText(type) {
    const actionMap = {
      blog: 'Read Article',
      case_study: 'View Case Study',
      guide: 'Read Guide',
      ebook: 'Download eBook',
      webinar: 'Watch Webinar'
    };
    return actionMap[type] || 'View Content';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;

    const hasMore = this.filteredContent.length > this.currentPage * this.itemsPerPage;
    loadMoreBtn.style.display = hasMore ? 'block' : 'none';
  }

  loadMoreContent() {
    this.currentPage++;
    this.renderAllContent();
  }

  openContentModal(item) {
    console.log('Opening content modal', { title: item.title, type: item.content_type });
    
    // For downloadable content, show lead magnet form
    if (item.content_type === 'ebook' || item.download_url) {
      this.openLeadMagnetModal(item);
      return;
    }

    // For external content, open in new tab
    if (item.external_url) {
      window.open(item.external_url, '_blank');
      return;
    }

    // For full articles (blog, guide, case_study), redirect to dedicated content page
    if (['blog', 'guide', 'case_study'].includes(item.content_type)) {
      window.location.href = `/content/${item.slug}.html`;
      return;
    }

    // For other content, show in modal
    this.showContentModal(item);
  }

  showContentModal(item) {
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('content-modal-title');
    const body = document.getElementById('content-modal-body');
    
    if (!modal || !title || !body) return;

    title.textContent = item.title;
    
    const htmlContent = this.convertToHTML(item.content);
    body.innerHTML = `
      <div class="content-header">
        <div class="content-meta">
          <span class="content-type-badge ${item.content_type}">${this.formatContentType(item.content_type)}</span>
          <span class="content-author">By ${item.author_name}</span>
          <span class="content-date">${this.formatDate(item.published_at)}</span>
          ${item.reading_time_minutes ? `<span class="content-time">${item.reading_time_minutes} min read</span>` : ''}
        </div>
        ${item.featured_image_url ? `
          <img src="${item.featured_image_url}" alt="${item.title}" class="content-featured-image" />
        ` : ''}
      </div>
      <div class="content-body">
        ${htmlContent}
      </div>
      <div class="content-footer">
        <div class="content-tags">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="content-actions">
          <button class="btn btn-secondary" onclick="window.print()">
            <i data-lucide="printer"></i>
            Print
          </button>
          <button class="btn btn-primary" onclick="window.resourcesManager.shareContent('${item.title}', window.location.href)">
            <i data-lucide="share-2"></i>
            Share
          </button>
        </div>
      </div>
    `;

    this.openModal(modal);
  }

  openLeadMagnetModal(item) {
    const modal = document.getElementById('lead-magnet-modal');
    const title = document.getElementById('magnet-modal-title');
    const description = document.getElementById('magnet-modal-description');
    const resourceIdInput = document.getElementById('magnet-resource-id');
    
    if (!modal || !title || !description || !resourceIdInput) return;

    title.textContent = `Download: ${item.title}`;
    description.innerHTML = `
      <p>${item.excerpt}</p>
      ${item.content_type === 'ebook' ? '<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>' : ''}
    `;
    resourceIdInput.value = item.id;

    this.openModal(modal);
  }

  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    const successDivs = modal.querySelectorAll('[id$="-success"]');
    successDivs.forEach(div => div.style.display = 'none');
    
    const formDivs = modal.querySelectorAll('form');
    formDivs.forEach(div => div.style.display = 'block');
  }

  handleLeadMagnetForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (data.website) return;

    console.log('📝 Lead magnet request submitted', {
      name: data.name,
      email: data.email,
      organization: data.organization,
      resource_id: data.resourceId
    });

    form.style.display = 'none';
    const successDiv = document.getElementById('magnet-success');
    if (successDiv) {
      successDiv.style.display = 'block';
    }

    this.showToast('Resource request submitted successfully!', 'success');
  }

  handleNewsletterSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');

    console.log('📧 Newsletter signup', { email });
    
    this.showToast('Successfully subscribed to newsletter!', 'success');
    form.reset();
  }

  convertToHTML(content) {
    return content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>');
  }

  shareContent(title, url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast(`Link copied to clipboard: ${title}`, 'success');
      }).catch(() => {
        this.fallbackCopyToClipboard(url, title);
      });
    } else {
      this.fallbackCopyToClipboard(url, title);
    }
  }

  fallbackCopyToClipboard(url, title) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showToast(`Link copied to clipboard: ${title}`, 'success');
    } catch (err) {
      this.showToast('Unable to copy link. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  showLoadingState() {
    const containers = ['featured-content', 'resources-content'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `
          <div class="loading-placeholder">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
          </div>
        `;
      }
    });
  }

  showErrorState() {
    const containers = ['featured-content', 'resources-content'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page or contact support.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `;
      }
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;
    
    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      info: 'var(--sky-gradient-start)'
    };
    toast.style.background = colors[type];
    toast.style.color = 'white';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.resourcesManager = new ResourcesPageManager();
});