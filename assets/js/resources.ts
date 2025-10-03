import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_type: string;
  featured_image_url?: string;
  author_name?: string;
  author_title?: string;
  reading_time_minutes?: number;
  tags?: string[];
  category?: string;
  is_featured?: boolean;
  is_published?: boolean;
  published_at?: string;
  download_url?: string;
  external_url?: string;
  view_count?: number;
}

class ResourcesManager {
  private allResources: ContentItem[] = [];
  private filteredResources: ContentItem[] = [];

  constructor() {
    this.init();
  }

  async init() {
    await this.loadResources();
    this.setupEventListeners();
    this.render();
  }

  async loadResources() {
    try {
      console.log('Loading resources from Supabase...');
      console.log('Supabase URL:', supabaseUrl);

      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Loaded resources:', data?.length || 0);
      this.allResources = data || [];
      this.filteredResources = this.allResources;
    } catch (error) {
      console.error('Error loading resources:', error);
      this.showError();
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('resource-search') as HTMLInputElement;
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
    const clearButton = document.getElementById('clear-filters');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.applyFilters());
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', () => this.applyFilters());
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.applyFilters());
    }

    if (clearButton) {
      clearButton.addEventListener('click', () => this.clearFilters());
    }
  }

  applyFilters() {
    const searchInput = document.getElementById('resource-search') as HTMLInputElement;
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;

    const searchTerm = searchInput?.value.toLowerCase() || '';
    const selectedType = typeFilter?.value || 'all';
    const selectedCategory = categoryFilter?.value || 'all';

    this.filteredResources = this.allResources.filter(resource => {
      const matchesSearch = !searchTerm ||
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.excerpt.toLowerCase().includes(searchTerm) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesType = selectedType === 'all' || resource.content_type === selectedType;
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

    this.render();
  }

  clearFilters() {
    const searchInput = document.getElementById('resource-search') as HTMLInputElement;
    const typeFilter = document.getElementById('type-filter') as HTMLSelectElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;

    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';

    this.filteredResources = this.allResources;
    this.render();
  }

  render() {
    this.renderFeatured();
    this.renderAllResources();
  }

  renderFeatured() {
    const featuredContainer = document.getElementById('featured-content');
    if (!featuredContainer) return;

    const featuredResources = this.filteredResources.filter(r => r.is_featured).slice(0, 3);

    if (featuredResources.length === 0) {
      featuredContainer.innerHTML = '<p class="no-results">No featured resources available.</p>';
      return;
    }

    featuredContainer.innerHTML = featuredResources.map(resource =>
      this.createResourceCard(resource, 'featured')
    ).join('');
  }

  renderAllResources() {
    const allContainer = document.getElementById('resources-content');
    if (!allContainer) return;

    const regularResources = this.filteredResources.filter(r => !r.is_featured);

    if (regularResources.length === 0) {
      allContainer.innerHTML = '<p class="no-results">No resources match your criteria.</p>';
      return;
    }

    allContainer.innerHTML = regularResources.map(resource =>
      this.createResourceCard(resource, 'regular')
    ).join('');
  }

  createResourceCard(resource: ContentItem, type: 'featured' | 'regular'): string {
    const cardClass = type === 'featured' ? 'featured-card' : 'resource-card';
    const imageUrl = resource.featured_image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800';

    const typeLabel = this.getTypeLabel(resource.content_type);
    const categoryLabel = resource.category || 'General';
    const readingTime = resource.reading_time_minutes ? `${resource.reading_time_minutes} min read` : '';
    const author = resource.author_name || 'Agent Cory Team';

    const ctaButton = resource.download_url
      ? `<a href="${resource.download_url}" class="btn btn-primary" download>
          <i data-lucide="download"></i> Download
        </a>`
      : resource.external_url
        ? `<a href="${resource.external_url}" class="btn btn-primary" target="_blank" rel="noopener">
            <i data-lucide="external-link"></i> Read More
          </a>`
        : `<a href="/content/${resource.slug}.html" class="btn btn-primary">
            <i data-lucide="arrow-right"></i> Read More
          </a>`;

    return `
      <article class="${cardClass}">
        <div class="resource-image">
          <img src="${imageUrl}" alt="${resource.title}" loading="lazy" />
          <div class="resource-badges">
            <span class="badge badge-type">${typeLabel}</span>
            ${resource.category ? `<span class="badge badge-category">${categoryLabel}</span>` : ''}
          </div>
        </div>
        <div class="resource-content">
          <div class="resource-meta">
            <span class="resource-author">${author}</span>
            ${readingTime ? `<span class="resource-time">${readingTime}</span>` : ''}
          </div>
          <h3 class="resource-title">${resource.title}</h3>
          <p class="resource-excerpt">${resource.excerpt}</p>
          ${resource.tags && resource.tags.length > 0 ? `
            <div class="resource-tags">
              ${resource.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
          <div class="resource-actions">
            ${ctaButton}
          </div>
        </div>
      </article>
    `;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'blog': 'Blog Post',
      'case_study': 'Case Study',
      'guide': 'Guide',
      'ebook': 'eBook',
      'webinar': 'Webinar',
      'whitepaper': 'Whitepaper'
    };
    return labels[type] || type;
  }

  showError() {
    const featuredContainer = document.getElementById('featured-content');
    const allContainer = document.getElementById('resources-content');

    const errorMessage = '<p class="error-message">Unable to load resources. Please try again later.</p>';

    if (featuredContainer) featuredContainer.innerHTML = errorMessage;
    if (allContainer) allContainer.innerHTML = errorMessage;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ResourcesManager();

  if (typeof (window as any).lucide !== 'undefined') {
    (window as any).lucide.createIcons();
  }
});
