// Debug logger for troubleshooting
class DiagnosticLogger {
  static log(message, data = null) {
    console.log(`🔍 [Resources Debug] ${message}`, data || '');
    
    // Create debug div if it doesn't exist
    const debugDiv = document.getElementById('debug-info') || this.createDebugDiv();
    const logEntry = document.createElement('div');
    logEntry.style.cssText = 'padding: 0.5rem; border-bottom: 1px solid #eee; font-family: monospace; font-size: 0.75rem;';
    logEntry.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong>: ${message}`;
    
    if (data) {
      logEntry.innerHTML += `<br><pre style="margin: 0.25rem 0; color: #666;">${JSON.stringify(data, null, 2)}</pre>`;
    }
    
    debugDiv.appendChild(logEntry);
    debugDiv.scrollTop = debugDiv.scrollHeight;
  }
  
  static createDebugDiv() {
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-info';
    debugDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 300px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: none;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = 'background: #333; color: white; padding: 0.5rem; font-weight: bold; position: sticky; top: 0;';
    header.innerHTML = 'Debug Log <button onclick="this.parentElement.parentElement.style.display=\'none\'" style="float: right; background: none; border: none; color: white; cursor: pointer;">×</button> <button onclick="this.parentElement.parentElement.style.display=this.parentElement.parentElement.style.display===\'none\'?\'block\':\'none\'" style="float: right; margin-right: 10px; background: none; border: none; color: white; cursor: pointer;">👁</button>';
    
    debugDiv.appendChild(header);
    document.body.appendChild(debugDiv);
    return debugDiv;
  }
}

// Static fallback content for development
const staticContent = [
  {
    id: "ai-guide-static",
    title: "The Complete Guide to AI in Admissions",
    slug: "ai-admissions-guide",
    excerpt: "Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",
    content: `# The Complete Guide to AI in Admissions

This comprehensive guide covers everything you need to know about implementing AI in your admissions process...`,
    content_type: "guide",
    featured_image_url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Agent Cory Team",
    author_title: "AI Admissions Experts",
    reading_time_minutes: 25,
    tags: ["AI", "Implementation", "Best Practices"],
    category: "ai",
    is_featured: true,
    is_published: true,
    published_at: new Date().toISOString(),
    seo_title: "Complete Guide to AI in Admissions - Agent Cory",
    seo_description: "Learn how to implement AI in your admissions process with this comprehensive guide.",
    download_url: "/downloads/ai-admissions-guide.pdf",
    metrics: { downloads: 1250, rating: 4.8 },
    view_count: 3420
  },
  {
    id: "conversion-webinar-static",
    title: "5 Strategies to Double Your Lead Conversion Rate",
    slug: "double-conversion-strategies",
    excerpt: "Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.",
    content: `# 5 Strategies to Double Your Lead Conversion Rate

## Strategy 1: Speed of Response

The faster you respond...`,
    content_type: "webinar",
    featured_image_url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Agent Cory Team",
    author_title: "AI Admissions Experts",
    reading_time_minutes: 45,
    tags: ["Webinar", "Conversion", "Strategy"],
    category: "conversion",
    is_featured: true,
    is_published: true,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    external_url: "https://zoom.us/webinar/register/example",
    metrics: { registrations: 450, attendees: 320 },
    view_count: 1890
  },
  {
    id: "metro-case-study-static",
    title: "Case Study: Metro State University - 847% ROI in 12 Months",
    slug: "metro-state-case-study",
    excerpt: "How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.",
    content: `# Metro State University Case Study

## The Challenge

Metro State University was struggling with low contact rates and slow response times...`,
    content_type: "case_study",
    featured_image_url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Dr. Sarah Johnson",
    author_title: "Director of Admissions, Metro State University",
    reading_time_minutes: 12,
    tags: ["Case Study", "ROI", "University"],
    category: "admissions",
    is_featured: false,
    is_published: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: { roi_percentage: 847, additional_revenue: 2100000, time_saved_hours: 2100 },
    view_count: 2890
  },
  {
    id: "benchmarks-report-static",
    title: "2024 Admissions Benchmarks Report",
    slug: "admissions-benchmarks-2024",
    excerpt: "Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.",
    content: `# 2024 Admissions Benchmarks Report

## Executive Summary

This comprehensive report analyzes data from over 500 educational institutions...`,
    content_type: "ebook",
    featured_image_url: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Agent Cory Research Team",
    author_title: "Industry Analysts",
    reading_time_minutes: 30,
    tags: ["Benchmarks", "Industry Data", "Research"],
    category: "roi",
    is_featured: true,
    is_published: true,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    download_url: "/downloads/benchmarks-2024.pdf",
    metrics: { downloads: 1850, institutions_surveyed: 500 },
    view_count: 2650
  },
  {
    id: "response-time-blog-static",
    title: "The Psychology of Fast Response Times in Admissions",
    slug: "psychology-fast-response-times",
    excerpt: "Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.",
    content: `# The Psychology of Fast Response Times

## Why Speed Matters

In the world of admissions, timing is everything...`,
    content_type: "blog",
    featured_image_url: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Agent Cory Team",
    author_title: "AI Admissions Experts",
    reading_time_minutes: 8,
    tags: ["Psychology", "Response Time", "Conversion"],
    category: "admissions",
    is_featured: false,
    is_published: true,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: { shares: 245, comments: 18 },
    view_count: 1560
  },
  {
    id: "crm-integration-guide-static",
    title: "CRM Integration Best Practices for Higher Ed",
    slug: "crm-integration-best-practices",
    excerpt: "Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.",
    content: `# CRM Integration Best Practices

## Getting Started

Integrating your CRM with AI automation requires careful planning...`,
    content_type: "guide",
    featured_image_url: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
    author_name: "Agent Cory Team",
    author_title: "Integration Specialists",
    reading_time_minutes: 20,
    tags: ["CRM", "Integration", "Automation"],
    category: "crm",
    is_featured: false,
    is_published: true,
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    metrics: { downloads: 890, implementations: 120 },
    view_count: 1340
  }
];

// Database service with fallback
class DatabaseService {
  static async testConnection() {
    try {
      DiagnosticLogger.log('Testing database connection...');
      
      const supabaseUrl = 'https://wjtmdrjuheclgdzwprku.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG1kcmp1aGVjbGdkendwcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjM5NTUsImV4cCI6MjA2OTc5OTk1NX0.Yk4ZCqbZ45Of7fmxDitJfDroBtCUK0D_PS7LWhmM26c';
      
      DiagnosticLogger.log('Environment check', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing',
        keyPreview: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'missing'
      });
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      DiagnosticLogger.log('Connection test result', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      return response.ok;
    } catch (error) {
      DiagnosticLogger.log('Connection test failed', {
        error: error.message,
        stack: error.stack
      });
      return false;
    }
  }
  
  static async getContent() {
    try {
      DiagnosticLogger.log('Starting database content fetch...');
      
      const supabaseUrl = 'https://wjtmdrjuheclgdzwprku.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdG1kcmp1aGVjbGdkendwcmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjM5NTUsImV4cCI6MjA2OTc5OTk1NX0.Yk4ZCqbZ45Of7fmxDitJfDroBtCUK0D_PS7LWhmM26c';
      
      const url = `${supabaseUrl}/rest/v1/content_items?is_published=eq.true&order=published_at.desc`;
      DiagnosticLogger.log('Fetching from URL', { url });
      
      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Range': '0-99'
        }
      });
      
      DiagnosticLogger.log('Database response', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        DiagnosticLogger.log('Database error response', { errorText });
        throw new Error(`Database request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      DiagnosticLogger.log('Database query success', {
        itemCount: data.length,
        firstItem: data[0] ? { title: data[0].title, type: data[0].content_type } : 'none'
      });
      
      return data;
    } catch (error) {
      DiagnosticLogger.log('Database fetch error', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

// Content loader with fallback strategy
class ContentLoader {
  static async loadContent() {
    DiagnosticLogger.log('🚀 Starting content loading process...');
    
    try {
      // Test database connection first
      DiagnosticLogger.log('Testing database connection...');
      const isConnected = await DatabaseService.testConnection();
      
      if (isConnected) {
        DiagnosticLogger.log('✅ Database connection successful, fetching content...');
        const content = await DatabaseService.getContent();
        
        if (content && content.length > 0) {
          DiagnosticLogger.log('✅ Database content loaded successfully', { count: content.length });
          return content;
        } else {
          DiagnosticLogger.log('⚠️ Database is empty, using static content');
        }
      } else {
        DiagnosticLogger.log('❌ Database connection failed, using static content');
      }
    } catch (error) {
      DiagnosticLogger.log('❌ Database error, using static content', { error: error.message });
    }
    
    // Fallback to static content
    DiagnosticLogger.log('📦 Using static fallback content');
    return staticContent;
  }
}

// Resources page manager
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
    DiagnosticLogger.log('🚀 Initializing Resources Page Manager...');
    
    try {
      this.showLoadingState();
      
      this.allContent = await ContentLoader.loadContent();
      this.filteredContent = [...this.allContent];
      
      DiagnosticLogger.log('Content loaded', {
        total: this.allContent.length,
        featured: this.allContent.filter(item => item.is_featured).length
      });
      
      this.bindEvents();
      this.renderFeaturedContent();
      this.renderAllContent();
      
      DiagnosticLogger.log('✅ Resources page initialized successfully');
    } catch (error) {
      DiagnosticLogger.log('❌ Critical initialization error', { error: error.message });
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
    
    DiagnosticLogger.log('Rendering featured content', { count: featuredItems.length });
    
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
    
    DiagnosticLogger.log('Rendering all content', { 
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
    DiagnosticLogger.log('Opening content modal', { title: item.title, type: item.content_type });
    
    // Check if it's a downloadable resource
    if (item.content_type === 'ebook' || item.download_url) {
      this.openLeadMagnetModal(item);
      return;
    }
    
    // Check if it's an external resource
    if (item.external_url) {
      window.open(item.external_url, '_blank');
      return;
    }
    
    // Navigate to individual content page using the slug directly
    window.location.href = `/${item.slug}.html`;
  }

  showContentModal(item) {
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('content-modal-title');
    const body = document.getElementById('content-modal-body');
    
    if (!modal || !title || !body) return;

    title.textContent = item.title;
    
    const contentHTML = this.convertToHTML(item.content);
    
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
        ${contentHTML}
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
    const resourceId = document.getElementById('magnet-resource-id');
    
    if (!modal || !title || !description || !resourceId) return;

    title.textContent = `Download: ${item.title}`;
    description.innerHTML = `
      <p>${item.excerpt}</p>
      ${item.content_type === 'ebook' ? '<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>' : ''}
    `;
    resourceId.value = item.id;

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

    DiagnosticLogger.log('📝 Lead magnet request submitted', {
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

    DiagnosticLogger.log('📧 Newsletter signup', { email });
    
    this.showToast('Successfully subscribed to newsletter!', 'success');
    form.reset();
  }

  convertToHTML(content) {
    return content
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      
      // Lists
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      
      // Clean up
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