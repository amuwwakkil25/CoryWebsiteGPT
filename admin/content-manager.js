// Content Management System for Agent Cory Marketing Team
import { ContentService } from '../src/services/contentService.ts';

class ContentManager {
  constructor() {
    this.allContent = [];
    this.filteredContent = [];
    this.currentTags = [];
    this.isEditing = false;
    this.editingId = null;
    this.init();
  }

  async init() {
    try {
      await this.checkConnection();
      await this.loadContent();
      this.bindEvents();
      this.updateStats();
    } catch (error) {
      console.error('Failed to initialize content manager:', error);
      this.showToast('Failed to connect to database', 'error');
    }
  }

  async checkConnection() {
    const statusEl = document.getElementById('connection-status');
    try {
      // Test connection by trying to fetch content
      await ContentService.getAllContent();
      statusEl.innerHTML = '<i data-lucide="wifi"></i><span>Connected</span>';
      statusEl.style.color = '#10b981';
    } catch (error) {
      statusEl.innerHTML = '<i data-lucide="wifi-off"></i><span>Disconnected</span>';
      statusEl.style.color = '#ef4444';
      throw error;
    }
  }

  async loadContent() {
    try {
      this.showLoading(true);
      this.allContent = await ContentService.getAllContent();
      this.filteredContent = [...this.allContent];
      this.renderContent();
      this.showLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      this.showToast('Error loading content from database', 'error');
      this.showLoading(false);
    }
  }

  bindEvents() {
    // Add content button
    document.getElementById('add-content-btn').addEventListener('click', () => {
      this.openContentModal();
    });

    // Search and filters
    document.getElementById('search-content').addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    document.getElementById('filter-type').addEventListener('change', () => {
      this.applyFilters();
    });

    document.getElementById('filter-status').addEventListener('change', () => {
      this.applyFilters();
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.loadContent();
    });

    // Modal events
    document.getElementById('modal-close').addEventListener('click', () => {
      this.closeModal('content-modal');
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.closeModal('content-modal');
    });

    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveContent();
    });

    // Delete modal events
    document.getElementById('delete-modal-close').addEventListener('click', () => {
      this.closeModal('delete-modal');
    });

    document.getElementById('delete-cancel-btn').addEventListener('click', () => {
      this.closeModal('delete-modal');
    });

    document.getElementById('delete-confirm-btn').addEventListener('click', () => {
      this.confirmDelete();
    });

    // Form events
    this.bindFormEvents();

    // Close modals on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('admin-modal')) {
        this.closeModal(e.target.id);
      }
    });
  }

  bindFormEvents() {
    // Auto-generate slug from title
    document.getElementById('content-title').addEventListener('input', (e) => {
      if (!this.isEditing) {
        // Auto-generate SEO title if not set
        const seoTitle = document.getElementById('seo-title');
        if (!seoTitle.value) {
          seoTitle.value = `${e.target.value} - Agent Cory`;
        }
      }
    });

    // Auto-generate SEO description from excerpt
    document.getElementById('content-excerpt').addEventListener('input', (e) => {
      const seoDesc = document.getElementById('seo-description');
      if (!seoDesc.value) {
        seoDesc.value = e.target.value.substring(0, 160);
      }
    });

    // Image preview
    document.getElementById('featured-image').addEventListener('input', (e) => {
      const preview = document.getElementById('image-preview');
      if (e.target.value) {
        preview.src = e.target.value;
        preview.style.display = 'block';
        preview.onerror = () => {
          preview.style.display = 'none';
        };
      } else {
        preview.style.display = 'none';
      }
    });

    // Tag input
    const tagInput = document.getElementById('tag-input');
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        this.addTag(tagInput.value.trim());
        tagInput.value = '';
      }
    });

    // Markdown toolbar
    document.querySelectorAll('.markdown-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        if (action) {
          this.insertMarkdown(action);
        }
      });
    });

    // Preview button
    document.getElementById('preview-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.togglePreview();
    });

    // Auto-save reading time
    document.getElementById('content-body').addEventListener('input', (e) => {
      const readingTimeInput = document.getElementById('reading-time');
      if (!readingTimeInput.value) {
        const estimatedTime = ContentService.estimateReadingTime(e.target.value);
        readingTimeInput.value = estimatedTime;
      }
    });
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      this.filteredContent = [...this.allContent];
    } else {
      this.filteredContent = this.allContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.author_name.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    this.renderContent();
  }

  applyFilters() {
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    this.filteredContent = this.allContent.filter(item => {
      const typeMatch = typeFilter === 'all' || item.content_type === typeFilter;
      
      let statusMatch = true;
      if (statusFilter === 'published') {
        statusMatch = item.is_published;
      } else if (statusFilter === 'draft') {
        statusMatch = !item.is_published;
      } else if (statusFilter === 'featured') {
        statusMatch = item.is_featured;
      }
      
      return typeMatch && statusMatch;
    });
    
    this.renderContent();
  }

  renderContent() {
    const container = document.getElementById('content-grid');
    
    if (this.filteredContent.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i data-lucide="file-text"></i>
          <h3>No content found</h3>
          <p>Try adjusting your search or filters, or add new content.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.filteredContent.map(item => this.createContentCard(item)).join('');
    
    // Bind action buttons
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.editContent(id);
      });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.deleteContent(id);
      });
    });

    container.querySelectorAll('.toggle-published-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.togglePublished(id);
      });
    });

    container.querySelectorAll('.toggle-featured-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.toggleFeatured(id);
      });
    });

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  createContentCard(item) {
    const publishedDate = new Date(item.published_at).toLocaleDateString();
    const createdDate = new Date(item.created_at).toLocaleDateString();
    
    return `
      <div class="content-item" data-id="${item.id}">
        <div class="content-image">
          <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}" alt="${item.title}" />
          <div class="content-badge badge-${item.content_type}">${this.formatContentType(item.content_type)}</div>
        </div>
        
        <div class="content-body">
          <h3 class="content-title">${item.title}</h3>
          <p class="content-excerpt">${item.excerpt}</p>
          
          <div class="content-meta">
            <div class="meta-item">
              <i data-lucide="user"></i>
              <span>${item.author_name}</span>
            </div>
            <div class="meta-item">
              <i data-lucide="calendar"></i>
              <span>${item.is_published ? publishedDate : createdDate}</span>
            </div>
            <div class="meta-item">
              <i data-lucide="eye"></i>
              <span>${item.view_count || 0} views</span>
            </div>
            ${item.reading_time_minutes ? `
              <div class="meta-item">
                <i data-lucide="clock"></i>
                <span>${item.reading_time_minutes} min</span>
              </div>
            ` : ''}
          </div>
          
          <div class="content-tags">
            ${item.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
            ${item.tags.length > 3 ? `<span class="tag">+${item.tags.length - 3} more</span>` : ''}
          </div>
          
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
            <span class="status-indicator ${item.is_published ? 'status-published' : 'status-draft'}">
              <i data-lucide="${item.is_published ? 'check-circle' : 'clock'}"></i>
              ${item.is_published ? 'Published' : 'Draft'}
            </span>
            ${item.is_featured ? '<span class="status-indicator status-featured"><i data-lucide="star"></i>Featured</span>' : ''}
          </div>
          
          <div class="content-actions">
            <button class="btn-admin btn-sm btn-secondary edit-btn" data-id="${item.id}">
              <i data-lucide="edit"></i>
              Edit
            </button>
            <button class="btn-admin btn-sm ${item.is_published ? 'btn-secondary' : 'btn-success'} toggle-published-btn" data-id="${item.id}">
              <i data-lucide="${item.is_published ? 'eye-off' : 'eye'}"></i>
              ${item.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <button class="btn-admin btn-sm ${item.is_featured ? 'btn-secondary' : 'btn-primary'} toggle-featured-btn" data-id="${item.id}">
              <i data-lucide="star"></i>
              ${item.is_featured ? 'Unfeature' : 'Feature'}
            </button>
            <button class="btn-admin btn-sm btn-danger delete-btn" data-id="${item.id}">
              <i data-lucide="trash-2"></i>
              Delete
            </button>
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

  openContentModal(item = null) {
    this.isEditing = !!item;
    this.editingId = item?.id || null;
    
    const modal = document.getElementById('content-modal');
    const title = document.getElementById('modal-title');
    
    title.textContent = this.isEditing ? 'Edit Content' : 'Add New Content';
    
    if (item) {
      this.populateForm(item);
    } else {
      this.resetForm();
    }
    
    this.openModal('content-modal');
  }

  populateForm(item) {
    document.getElementById('content-id').value = item.id;
    document.getElementById('content-title').value = item.title;
    document.getElementById('content-type').value = item.content_type;
    document.getElementById('content-category').value = item.category;
    document.getElementById('content-excerpt').value = item.excerpt;
    document.getElementById('content-body').value = item.content || '';
    document.getElementById('featured-image').value = item.featured_image_url || '';
    document.getElementById('author-name').value = item.author_name;
    document.getElementById('author-title').value = item.author_title;
    document.getElementById('reading-time').value = item.reading_time_minutes || '';
    document.getElementById('download-url').value = item.download_url || '';
    document.getElementById('external-url').value = item.external_url || '';
    document.getElementById('seo-title').value = item.seo_title || '';
    document.getElementById('seo-description').value = item.seo_description || '';
    document.getElementById('is-published').checked = item.is_published;
    document.getElementById('is-featured').checked = item.is_featured;
    
    if (item.published_at) {
      const date = new Date(item.published_at);
      document.getElementById('published-date').value = date.toISOString().slice(0, 16);
    }

    // Set tags
    this.currentTags = [...item.tags];
    this.renderTags();

    // Show image preview
    if (item.featured_image_url) {
      const preview = document.getElementById('image-preview');
      preview.src = item.featured_image_url;
      preview.style.display = 'block';
    }
  }

  resetForm() {
    document.getElementById('content-form').reset();
    document.getElementById('content-id').value = '';
    document.getElementById('author-name').value = 'Agent Cory Team';
    document.getElementById('author-title').value = 'AI Admissions Experts';
    document.getElementById('published-date').value = new Date().toISOString().slice(0, 16);
    this.currentTags = [];
    this.renderTags();
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('content-preview').style.display = 'none';
  }

  addTag(tagText) {
    if (!tagText || this.currentTags.includes(tagText)) return;
    
    this.currentTags.push(tagText);
    this.renderTags();
  }

  removeTag(tagText) {
    this.currentTags = this.currentTags.filter(tag => tag !== tagText);
    this.renderTags();
  }

  renderTags() {
    const container = document.getElementById('tag-container');
    const input = document.getElementById('tag-input');
    
    // Clear existing tags (except input)
    container.querySelectorAll('.tag-item').forEach(tag => tag.remove());
    
    // Add current tags
    this.currentTags.forEach(tag => {
      const tagEl = document.createElement('div');
      tagEl.className = 'tag-item';
      tagEl.innerHTML = `
        <span>${tag}</span>
        <button type="button" class="tag-remove" onclick="contentManager.removeTag('${tag}')">×</button>
      `;
      container.insertBefore(tagEl, input);
    });
  }

  insertMarkdown(action) {
    const textarea = document.getElementById('content-body');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    
    switch (action) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        replacement = `- ${selectedText || 'List item'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](url)`;
        break;
    }
    
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + replacement.length, start + replacement.length);
  }

  togglePreview() {
    const preview = document.getElementById('content-preview');
    const textarea = document.getElementById('content-body');
    const btn = document.getElementById('preview-btn');
    
    if (preview.style.display === 'none') {
      const content = textarea.value;
      const html = this.convertMarkdownToHTML(content);
      preview.querySelector('.preview-content').innerHTML = html;
      preview.style.display = 'block';
      btn.innerHTML = '<i data-lucide="edit"></i> Edit';
    } else {
      preview.style.display = 'none';
      btn.innerHTML = '<i data-lucide="eye"></i> Preview';
    }
  }

  convertMarkdownToHTML(content) {
    return content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<\/ul>\s*<ul>/g, '');
  }

  async saveContent() {
    try {
      const formData = this.getFormData();
      
      if (!this.validateForm(formData)) {
        return;
      }

      this.showLoading(true);

      if (this.isEditing) {
        await ContentService.updateContent(this.editingId, formData);
        this.showToast('Content updated successfully!', 'success');
      } else {
        await ContentService.createContent(formData);
        this.showToast('Content created successfully!', 'success');
      }

      this.closeModal('content-modal');
      await this.loadContent();
      this.updateStats();
      this.showLoading(false);
    } catch (error) {
      console.error('Error saving content:', error);
      this.showToast('Error saving content. Please try again.', 'error');
      this.showLoading(false);
    }
  }

  getFormData() {
    const title = document.getElementById('content-title').value;
    
    return {
      title,
      slug: ContentService.generateSlug(title),
      excerpt: document.getElementById('content-excerpt').value,
      content: document.getElementById('content-body').value,
      content_type: document.getElementById('content-type').value,
      category: document.getElementById('content-category').value,
      featured_image_url: document.getElementById('featured-image').value || null,
      author_name: document.getElementById('author-name').value,
      author_title: document.getElementById('author-title').value,
      reading_time_minutes: parseInt(document.getElementById('reading-time').value) || null,
      download_url: document.getElementById('download-url').value || null,
      external_url: document.getElementById('external-url').value || null,
      seo_title: document.getElementById('seo-title').value || null,
      seo_description: document.getElementById('seo-description').value || null,
      tags: this.currentTags,
      is_published: document.getElementById('is-published').checked,
      is_featured: document.getElementById('is-featured').checked,
      published_at: document.getElementById('published-date').value ? 
        new Date(document.getElementById('published-date').value).toISOString() : 
        new Date().toISOString(),
      metrics: {}
    };
  }

  validateForm(data) {
    const errors = [];
    
    if (!data.title.trim()) errors.push('Title is required');
    if (!data.excerpt.trim()) errors.push('Excerpt is required');
    if (!data.content.trim()) errors.push('Content is required');
    if (!data.content_type) errors.push('Content type is required');
    if (!data.category) errors.push('Category is required');
    
    if (errors.length > 0) {
      this.showToast(errors.join(', '), 'error');
      return false;
    }
    
    return true;
  }

  editContent(id) {
    const item = this.allContent.find(content => content.id === id);
    if (item) {
      this.openContentModal(item);
    }
  }

  deleteContent(id) {
    const item = this.allContent.find(content => content.id === id);
    if (item) {
      document.getElementById('delete-content-title').textContent = item.title;
      this.deleteId = id;
      this.openModal('delete-modal');
    }
  }

  async confirmDelete() {
    try {
      this.showLoading(true);
      await ContentService.deleteContent(this.deleteId);
      this.showToast('Content deleted successfully!', 'success');
      this.closeModal('delete-modal');
      await this.loadContent();
      this.updateStats();
      this.showLoading(false);
    } catch (error) {
      console.error('Error deleting content:', error);
      this.showToast('Error deleting content. Please try again.', 'error');
      this.showLoading(false);
    }
  }

  async togglePublished(id) {
    try {
      const item = this.allContent.find(content => content.id === id);
      if (!item) return;

      await ContentService.updateContent(id, {
        is_published: !item.is_published,
        published_at: !item.is_published ? new Date().toISOString() : item.published_at
      });

      this.showToast(`Content ${!item.is_published ? 'published' : 'unpublished'} successfully!`, 'success');
      await this.loadContent();
      this.updateStats();
    } catch (error) {
      console.error('Error toggling published status:', error);
      this.showToast('Error updating content. Please try again.', 'error');
    }
  }

  async toggleFeatured(id) {
    try {
      const item = this.allContent.find(content => content.id === id);
      if (!item) return;

      await ContentService.updateContent(id, {
        is_featured: !item.is_featured
      });

      this.showToast(`Content ${!item.is_featured ? 'featured' : 'unfeatured'} successfully!`, 'success');
      await this.loadContent();
      this.updateStats();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      this.showToast('Error updating content. Please try again.', 'error');
    }
  }

  updateStats() {
    const total = this.allContent.length;
    const published = this.allContent.filter(item => item.is_published).length;
    const featured = this.allContent.filter(item => item.is_featured).length;
    const totalViews = this.allContent.reduce((sum, item) => sum + (item.view_count || 0), 0);

    document.getElementById('total-content').textContent = total;
    document.getElementById('published-content').textContent = published;
    document.getElementById('featured-content').textContent = featured;
    document.getElementById('total-views').textContent = totalViews.toLocaleString();
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    if (modalId === 'content-modal') {
      this.resetForm();
    }
  }

  showLoading(show) {
    const overlay = document.querySelector('.loading-overlay');
    if (show) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contentManager = new ContentManager();
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});