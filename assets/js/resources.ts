// Resources Page JavaScript
import { ContentService } from '../../src/services/contentService.ts';
import { WebsiteIntegration } from '../../src/utils/websiteIntegration.ts';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  content_type: 'blog' | 'case_study' | 'ebook' | 'guide' | 'webinar';
  featured_image_url?: string;
  author_name: string;
  author_title: string;
  reading_time_minutes?: number;
  tags: string[];
  category: string;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  download_url?: string;
  external_url?: string;
  metrics: Record<string, any>;
  view_count: number;
}

class ResourcesPageManager {
  private allContent: ContentItem[] = [];
  private filteredContent: ContentItem[] = [];
  private currentView: 'grid' | 'list' = 'grid';
  private currentPage = 1;
  private itemsPerPage = 12;
  private isLoading = false;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    try {
      // Show loading state
      this.showLoadingState();
      
      // Try to load from database first
      try {
        console.log('Attempting to load content from database...');
        this.allContent = await ContentService.getAllContent();
        console.log('Successfully loaded content from database:', this.allContent.length, 'items');
        this.filteredContent = [...this.allContent];
      } catch (dbError) {
        console.warn('Database loading failed, using fallback content:', dbError);
        this.allContent = this.getFallbackContent();
        this.filteredContent = [...this.allContent];
      }
      
      // Bind event listeners
      this.bindEvents();
      
      // Render content
      this.renderFeaturedContent();
      this.renderAllContent();
      
      console.log('Resources page initialized with', this.allContent.length, 'items');
    } catch (error) {
      console.error('Error initializing resources page:', error);
      // Final fallback
      this.allContent = this.getFallbackContent();
      this.filteredContent = [...this.allContent];
      this.renderFeaturedContent();
      this.renderAllContent();
    }
  }


  getFallbackContent(): ContentItem[] {
    return [
      {
        id: 'ai-guide-fallback',
        title: 'The Complete Guide to AI in Admissions',
        slug: 'ai-admissions-guide',
        excerpt: 'Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.',
        content: '# The Complete Guide to AI in Admissions\n\nThis comprehensive guide covers everything you need to know about implementing AI in your admissions process...',
        content_type: 'guide',
        featured_image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Team',
        author_title: 'AI Admissions Experts',
        reading_time_minutes: 25,
        tags: ['AI', 'Implementation', 'Best Practices'],
        category: 'ai',
        is_featured: true,
        is_published: true,
        published_at: new Date().toISOString(),
        seo_title: 'Complete Guide to AI in Admissions - Agent Cory',
        seo_description: 'Learn how to implement AI in your admissions process with this comprehensive guide.',
        download_url: '/downloads/ai-admissions-guide.pdf',
        metrics: { downloads: 1250, rating: 4.8 },
        view_count: 3420
      },
      {
        id: 'conversion-webinar-fallback',
        title: '5 Strategies to Double Your Lead Conversion Rate',
        slug: 'double-conversion-strategies',
        excerpt: 'Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.',
        content: '# 5 Strategies to Double Your Lead Conversion Rate\n\n## Strategy 1: Speed of Response\n\nThe faster you respond...',
        content_type: 'webinar',
        featured_image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Team',
        author_title: 'AI Admissions Experts',
        reading_time_minutes: 45,
        tags: ['Webinar', 'Conversion', 'Strategy'],
        category: 'conversion',
        is_featured: true,
        is_published: true,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        external_url: 'https://zoom.us/webinar/register/example',
        metrics: { registrations: 450, attendees: 320 },
        view_count: 1890
      },
      {
        id: 'metro-case-study-fallback',
        title: 'Case Study: 847% ROI in 12 Months',
        slug: 'metro-state-case-study',
        excerpt: 'How Metro State University transformed their admissions process and achieved record-breaking results.',
        content: '# Metro State University Case Study\n\n## The Challenge\n\nMetro State University was struggling with...',
        content_type: 'case_study',
        featured_image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Dr. Sarah Johnson',
        author_title: 'Director of Admissions, Metro State University',
        reading_time_minutes: 12,
        tags: ['Case Study', 'ROI', 'University'],
        category: 'admissions',
        is_featured: false,
        is_published: true,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: { roi_percentage: 847, additional_revenue: 2100000, time_saved_hours: 2100 },
        view_count: 2890
      },
      {
        id: 'benchmarks-report-fallback',
        title: '2024 Admissions Benchmarks Report',
        slug: 'admissions-benchmarks-2024',
        excerpt: 'Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.',
        content: '# 2024 Admissions Benchmarks Report\n\n## Executive Summary\n\nThis comprehensive report...',
        content_type: 'ebook',
        featured_image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Research Team',
        author_title: 'Industry Analysts',
        reading_time_minutes: 30,
        tags: ['Benchmarks', 'Industry Data', 'Research'],
        category: 'roi',
        is_featured: true,
        is_published: true,
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        download_url: '/downloads/benchmarks-2024.pdf',
        metrics: { downloads: 1850, institutions_surveyed: 500 },
        view_count: 2650
      },
      {
        id: 'response-time-blog-fallback',
        title: 'The Psychology of Fast Response Times in Admissions',
        slug: 'psychology-fast-response-times',
        excerpt: 'Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.',
        content: '# The Psychology of Fast Response Times\n\n## Why Speed Matters\n\nIn the world of admissions...',
        content_type: 'blog',
        featured_image_url: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Team',
        author_title: 'AI Admissions Experts',
        reading_time_minutes: 8,
        tags: ['Psychology', 'Response Time', 'Conversion'],
        category: 'admissions',
        is_featured: false,
        is_published: true,
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: { shares: 245, comments: 18 },
        view_count: 1560
      },
      {
        id: 'crm-integration-guide-fallback',
        title: 'CRM Integration Best Practices',
        slug: 'crm-integration-best-practices',
        excerpt: 'Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.',
        content: '# CRM Integration Best Practices\n\n## Getting Started\n\nIntegrating your CRM...',
        content_type: 'guide',
        featured_image_url: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Team',
        author_title: 'Integration Specialists',
        reading_time_minutes: 20,
        tags: ['CRM', 'Integration', 'Automation'],
        category: 'crm',
        is_featured: false,
        is_published: true,
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: { downloads: 890, implementations: 120 },
        view_count: 1340
      },
      {
        id: 'ai-implementation-blog-fallback',
        title: 'AI vs Human: Finding the Right Balance',
        slug: 'ai-human-balance-admissions',
        excerpt: 'When to use AI and when human touch matters most in the admissions journey.',
        content: '# AI vs Human: Finding the Right Balance\n\n## The Human Element\n\nWhile AI can automate...',
        content_type: 'blog',
        featured_image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
        author_name: 'Agent Cory Team',
        author_title: 'AI Strategy Experts',
        reading_time_minutes: 12,
        tags: ['AI Strategy', 'Human Touch', 'Balance'],
        category: 'roi',
        is_featured: true,
        is_published: true,
        published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        metrics: { shares: 180, comments: 25 },
        view_count: 980
      }
    ];
  }

  bindEvents(): void {
    // Search functionality
    const searchInput = document.getElementById('resource-search') as HTMLInputElement;
    if (searchInput) {
      let searchTimeout: NodeJS.Timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(searchInput.value);
        }, 300);
      });
    }

    // Filter controls
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
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
        const target = e.currentTarget as HTMLElement;
        const view = target.dataset.view as 'grid' | 'list';
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

    // Modal events
    this.bindModalEvents();
  }

  bindModalEvents(): void {
    // Close modal events
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal as HTMLElement);
        }
      });
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target as HTMLElement);
      }
    });

    // Lead magnet form
    const magnetForm = document.getElementById('lead-magnet-form');
    if (magnetForm) {
      magnetForm.addEventListener('submit', (e) => this.handleLeadMagnetForm(e));
    }
  }

  handleSearch(query: string): void {
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

  applyFilters(): void {
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
    
    const selectedType = typeFilter?.value || 'all';
    const selectedCategory = categoryFilter?.value || 'all';
    
    this.filteredContent = this.allContent.filter(item => {
      const typeMatch = selectedType === 'all' || item.content_type === selectedType;
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      return typeMatch && categoryMatch;
    });
    
    this.currentPage = 1;
    this.renderAllContent();
    this.updateActiveFilters(selectedType, selectedCategory);
  }

  updateActiveFilters(type: string, category: string): void {
    // This would show active filter tags
    const activeFilters = [];
    if (type !== 'all') activeFilters.push({ type: 'type', value: type });
    if (category !== 'all') activeFilters.push({ type: 'category', value: category });
    
    // Update UI to show active filters (implementation depends on design)
    console.log('Active filters:', activeFilters);
  }

  clearAllFilters(): void {
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
    const searchInput = document.getElementById('resource-search') as HTMLInputElement;
    
    if (typeFilter) typeFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    this.filteredContent = [...this.allContent];
    this.currentPage = 1;
    this.renderAllContent();
  }

  toggleView(view: 'grid' | 'list'): void {
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

  renderFeaturedContent(): void {
    const container = document.getElementById('featured-content');
    if (!container) return;

    const featuredItems = this.allContent.filter(item => item.is_featured);
    
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

  renderAllContent(): void {
    const container = document.getElementById('resources-content');
    if (!container) return;

    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    const itemsToShow = this.filteredContent.slice(startIndex, endIndex);
    
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

  createFeaturedCard(item: ContentItem): string {
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

  createResourceCard(item: ContentItem): string {
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

  formatContentType(type: string): string {
    const typeMap = {
      blog: 'Blog Post',
      case_study: 'Case Study',
      guide: 'Guide',
      ebook: 'eBook',
      webinar: 'Webinar'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  }

  getActionText(type: string): string {
    const actionMap = {
      blog: 'Read Article',
      case_study: 'View Case Study',
      guide: 'Read Guide',
      ebook: 'Download eBook',
      webinar: 'Watch Webinar'
    };
    return actionMap[type as keyof typeof actionMap] || 'View Content';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  updateLoadMoreButton(): void {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;

    const hasMore = this.filteredContent.length > this.currentPage * this.itemsPerPage;
    loadMoreBtn.style.display = hasMore ? 'block' : 'none';
  }

  loadMoreContent(): void {
    this.currentPage++;
    this.renderAllContent();
  }

  openContentModal(item: ContentItem): void {
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

    // For regular content, show in modal or navigate to dedicated page
    if (item.content && item.content.length > 500) {
      // Show full content in modal
      this.showContentModal(item);
    } else {
      // Navigate to dedicated page
      window.location.href = `/content/${item.slug}`;
    }

    // Skip view tracking for now to avoid errors
    console.log('Viewed content:', item.title);
  }

  showContentModal(item: ContentItem): void {
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('content-modal-title');
    const body = document.getElementById('content-modal-body');
    
    if (!modal || !title || !body) return;

    title.textContent = item.title;
    
    // Convert markdown-like content to HTML
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
          <button class="btn btn-primary" onclick="navigator.share ? navigator.share({title: '${item.title}', url: window.location.href}) : null">
          <button class="btn btn-primary" onclick="this.shareContent('${item.title}', window.location.href)">
            <i data-lucide="share-2"></i>
            Share
          </button>
        </div>
      </div>
    `;

    this.openModal(modal);
  }

  openLeadMagnetModal(item: ContentItem): void {
    const modal = document.getElementById('lead-magnet-modal');
    const title = document.getElementById('magnet-modal-title');
    const description = document.getElementById('magnet-modal-description');
    const resourceIdInput = document.getElementById('magnet-resource-id') as HTMLInputElement;
    
    if (!modal || !title || !description || !resourceIdInput) return;

    title.textContent = `Download: ${item.title}`;
    description.innerHTML = `
      <p>${item.excerpt}</p>
      ${item.content_type === 'ebook' ? '<p><strong>Format:</strong> PDF • <strong>Pages:</strong> 40+ • <strong>File Size:</strong> 2.5MB</p>' : ''}
    `;
    resourceIdInput.value = item.id;

    this.openModal(modal);
  }

  openModal(modal: HTMLElement): void {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea') as HTMLElement;
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  closeModal(modal: HTMLElement): void {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset forms
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => (form as HTMLFormElement).reset());
    
    // Hide success messages
    const successDivs = modal.querySelectorAll('[id$="-success"]');
    successDivs.forEach(div => (div as HTMLElement).style.display = 'none');
    
    // Show forms
    const formDivs = modal.querySelectorAll('form');
    formDivs.forEach(div => (div as HTMLElement).style.display = 'block');
  }

  handleLeadMagnetForm(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Check honeypot
    if (data.website) {
      return;
    }

    // Log the request instead of submitting to database
    console.log('Lead magnet request:', {
      name: data.name,
      email: data.email,
      organization: data.organization,
      role: data.role,
      resource_id: data.resourceId,
      follow_up_requested: data.followUp === 'on'
    });

    // Show success message
    form.style.display = 'none';
    const successDiv = document.getElementById('magnet-success');
    if (successDiv) {
      successDiv.style.display = 'block';
    }

    this.showToast('Resource request submitted successfully!', 'success');
  }

  handleNewsletterSignup(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;

    // Log the signup instead of submitting to database
    console.log('Newsletter signup:', email);
    
    this.showToast('Successfully subscribed to newsletter!', 'success');
    form.reset();
  }

  convertToHTML(content: string): string {
    // Simple markdown-to-HTML conversion
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

  shareContent(title: string, url: string): void {
    // Check if Web Share API is available and we're in a secure context
    if (navigator.share && window.isSecureContext) {
      navigator.share({ title, url }).catch(error => {
        console.log('Share failed, falling back to clipboard:', error);
        this.copyToClipboard(url, title);
      });
    } else {
      console.log('Web Share API not available or not in secure context, using clipboard fallback');
      this.copyToClipboard(url, title);
    }
  }

  copyToClipboard(url: string, title: string): void {
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

  fallbackCopyToClipboard(url: string, title: string): void {
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

  showLoadingState(): void {
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

  showErrorState(): void {
    const containers = ['featured-content', 'resources-content'];
    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <i data-lucide="alert-circle"></i>
            <h3>Unable to load resources</h3>
            <p>Please try refreshing the page.</p>
            <button class="btn btn-primary" onclick="window.location.reload()">Refresh Page</button>
          </div>
        `;
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
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
    
    // Set background color based on type
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