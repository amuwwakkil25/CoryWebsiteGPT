import type { Resource } from "../../src/types/resource";
import { supabase } from "../../src/lib/supabaseClient";

const useClient = (import.meta.env.VITE_USE_CLIENT_SUPABASE ?? "false") === "true";

async function tryStatic(): Promise<Resource[] | null> {
  try {
    const bust = Date.now(); // avoid stale CDN edge during debug
    const res = await fetch(`/data/resources.json?b=${bust}`, { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.ok || !Array.isArray(json.items)) return null;
    console.info("[resources] static ok:", json.items.length, "generated_at:", json.generated_at);
    return json.items as Resource[];
  } catch {
    return null;
  }
}

async function tryFunction(): Promise<Resource[] | null> {
  try {
    const res = await fetch("/.netlify/functions/resources", { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.ok || !Array.isArray(json.items)) return null;
    console.info("[resources] function ok:", json.items.length);
    return json.items as Resource[];
  } catch {
    return null;
  }
}

async function tryClient(): Promise<Resource[] | null> {
  try {
    const { data, error } = await supabase
      .from("content_items")
      .select("id,title,slug,excerpt as summary,featured_image_url as cover_image,reading_time_minutes as reading_minutes,tags,is_published as published,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return null;
    console.info("[resources] client ok:", data?.length ?? 0);
    return (data ?? []) as Resource[];
  } catch {
    return null;
  }
}

export async function fetchResources(): Promise<Resource[]> {
  console.time("[resources] load");
  try {
    // 1) Prefer static JSON in production (fast & robust)
    const a = await tryStatic();
    if (a && a.length >= 0) return a;

    // 2) Then Netlify function
    const b = await tryFunction();
    if (b && b.length >= 0) return b;

    // 3) Finally, client-side (only if flag enabled or others failed)
    if (useClient) {
      const c = await tryClient();
      if (c && c.length >= 0) return c;
    }

    throw new Error("No data available from any source");
  } finally {
    console.timeEnd("[resources] load");
  }
}

// Static fallback content for development
const staticFallback: Resource[] = [
  {
    id: "ai-guide-static",
    title: "The Complete Guide to AI in Admissions",
    slug: "ai-admissions-guide",
    summary: "Comprehensive 40-page guide covering implementation strategies, best practices, and ROI measurement for AI-powered admissions automation.",
    cover_image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 25,
    tags: ["AI", "Implementation", "Best Practices"],
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "conversion-webinar-static",
    title: "5 Strategies to Double Your Lead Conversion Rate",
    slug: "double-conversion-strategies",
    summary: "Join our upcoming webinar to learn proven tactics that top-performing institutions use to convert more inquiries into enrolled students.",
    cover_image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 45,
    tags: ["Webinar", "Conversion", "Strategy"],
    published: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "metro-case-study-static",
    title: "Case Study: Metro State University - 847% ROI in 12 Months",
    slug: "metro-state-case-study",
    summary: "How Metro State University transformed their admissions process and achieved record-breaking results with Agent Cory.",
    cover_image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 12,
    tags: ["Case Study", "ROI", "University"],
    published: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "benchmarks-report-static",
    title: "2024 Admissions Benchmarks Report",
    slug: "admissions-benchmarks-2024",
    summary: "Comprehensive industry data including response times, conversion rates, and ROI metrics from 500+ institutions.",
    cover_image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 30,
    tags: ["Benchmarks", "Industry Data", "Research"],
    published: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "response-time-blog-static",
    title: "The Psychology of Fast Response Times in Admissions",
    slug: "psychology-fast-response-times",
    summary: "Research-backed insights into why speed matters so much in admissions and how to leverage it for better conversion rates.",
    cover_image: "https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 8,
    tags: ["Psychology", "Response Time", "Conversion"],
    published: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "crm-integration-guide-static",
    title: "CRM Integration Best Practices for Higher Ed",
    slug: "crm-integration-best-practices",
    summary: "Step-by-step guide for seamless CRM integration, data mapping, and workflow automation setup.",
    cover_image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
    reading_minutes: 20,
    tags: ["CRM", "Integration", "Automation"],
    published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

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
    try {
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
      
      console.log('Environment check:', {
        allEnvVars: envVars,
        urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
        keyPreview: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING',
        urlValid: supabaseUrl && supabaseUrl.includes('supabase.co'),
        keyValid: supabaseKey && supabaseKey.startsWith('eyJ'),
        buildMode: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD
      });
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`);
      }
      
      if (!supabaseUrl.includes('supabase.co')) {
        throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
      }
      
      if (!supabaseKey.startsWith('eyJ')) {
        throw new Error(`Invalid Supabase key format: ${supabaseKey.substring(0, 10)}...`);
      }
      
      // Test connection
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
      
      this.showLoadingState();
      
      // Try the new fallback system
      this.allContent = await fetchResources();
      
      if (this.allContent.length === 0) {
        console.log('✅ Content loaded successfully', { count: this.allContent.length });
      } else {
        console.warn('All data sources failed, using static fallback:', error.message);
        this.allContent = staticFallback;
      }
      
      this.filteredContent = [...this.allContent];
      
      // Bind event listeners
      this.bindEvents();
      
      // Render content
      this.renderFeaturedContent();
      this.renderAllContent();
      
      console.log('✅ Resources page initialized successfully');
    } catch (error) {
      console.error('❌ Critical initialization error', { error: error.message });
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
        (item.summary && item.summary.toLowerCase().includes(searchTerm)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
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
      // For now, we'll use basic filtering since the Resource type doesn't have content_type/category
      // This can be enhanced when the database schema is updated
      return true; // Show all items for now
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

    // For now, show first 3 items as featured
    const featuredItems = this.allContent.slice(0, 3);
    
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
          <img src="${item.cover_image || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}" />
          <div class="content-badge guide">Resource</div>
        </div>
        <div class="featured-content">
          <h3>${item.title}</h3>
          <p>${item.summary || 'No description available'}</p>
          <div class="content-meta">
            <div class="meta-item">
              <i data-lucide="user" class="meta-icon"></i>
              <span>Agent Cory Team</span>
            </div>
            ${item.reading_minutes ? `
              <div class="meta-item">
                <i data-lucide="clock" class="meta-icon"></i>
                <span>${item.reading_minutes} min read</span>
              </div>
            ` : ''}
            <div class="meta-item">
              <i data-lucide="calendar" class="meta-icon"></i>
              <span>${this.formatDate(item.created_at)}</span>
            </div>
          </div>
          <div class="content-tags">
            ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  createResourceCard(item) {
    return `
      <div class="resource-card" data-id="${item.id}">
        <div class="resource-image">
          <img src="${item.cover_image || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}" />
          <div class="content-badge guide">Resource</div>
        </div>
        <div class="resource-content">
          <h3>${item.title}</h3>
          <p>${item.summary || 'No description available'}</p>
          <div class="resource-footer">
            <div class="read-time">
              <i data-lucide="clock"></i>
              <span>${item.reading_minutes || 5} min read</span>
            </div>
            <div class="resource-action">
              <span>View Resource</span>
              <i data-lucide="arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    `;
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
    console.log('Opening content modal', { title: item.title });
    
    // For now, just show a simple modal with the item info
    this.showContentModal(item);
  }

  showContentModal(item) {
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('content-modal-title');
    const body = document.getElementById('content-modal-body');
    
    if (!modal || !title || !body) return;

    title.textContent = item.title;
    
    body.innerHTML = `
      <div class="content-header">
        <div class="content-meta">
          <span class="content-type-badge guide">Resource</span>
          <span class="content-author">By Agent Cory Team</span>
          <span class="content-date">${this.formatDate(item.created_at)}</span>
          ${item.reading_minutes ? `<span class="content-time">${item.reading_minutes} min read</span>` : ''}
        </div>
        ${item.cover_image ? `
          <img src="${item.cover_image}" alt="${item.title}" class="content-featured-image" />
        ` : ''}
      </div>
      <div class="content-body">
        <p>${item.summary || 'No content available'}</p>
      </div>
      <div class="content-footer">
        <div class="content-tags">
          ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
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
      console.error('Copy failed:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
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