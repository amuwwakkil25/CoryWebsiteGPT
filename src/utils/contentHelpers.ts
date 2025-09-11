import { CONTENT_TYPES } from '../config/site'

export class ContentHelpers {
  static formatContentType(type: string): string {
    return CONTENT_TYPES[type as keyof typeof CONTENT_TYPES]?.label || type
  }

  static getContentTypeColor(type: string): string {
    return CONTENT_TYPES[type as keyof typeof CONTENT_TYPES]?.color || 'var(--text-secondary)'
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  static formatDateLong(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  static estimateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  static extractExcerpt(content: string, maxLength = 160): string {
    const plainText = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    
    if (plainText.length <= maxLength) {
      return plainText
    }
    
    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  static convertMarkdownToHTML(content: string): string {
    return content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
  }

  static findRelatedContent(currentItem: any, allContent: any[], limit = 3): any[] {
    if (!currentItem.tags || !Array.isArray(currentItem.tags)) {
      return allContent
        .filter(item => item.id !== currentItem.id && item.category === currentItem.category)
        .slice(0, limit)
    }

    // Score content based on tag overlap
    const scoredContent = allContent
      .filter(item => item.id !== currentItem.id)
      .map(item => {
        let score = 0
        
        // Tag overlap scoring
        if (item.tags && Array.isArray(item.tags)) {
          const commonTags = item.tags.filter(tag => 
            currentItem.tags.includes(tag)
          )
          score += commonTags.length * 3
        }
        
        // Category match scoring
        if (item.category === currentItem.category) {
          score += 2
        }
        
        // Content type match scoring
        if (item.content_type === currentItem.content_type) {
          score += 1
        }
        
        return { ...item, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return scoredContent
  }

  static createContentCard(item: any, type: 'featured' | 'resource' | 'related' = 'resource'): string {
    switch (type) {
      case 'featured':
        return this.createFeaturedCard(item)
      case 'related':
        return this.createRelatedCard(item)
      default:
        return this.createResourceCard(item)
    }
  }

  private static createFeaturedCard(item: any): string {
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
            ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `
  }

  private static createResourceCard(item: any): string {
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
    `
  }

  private static createRelatedCard(item: any): string {
    return `
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
    `
  }

  private static getActionText(type: string): string {
    const actionMap = {
      blog: 'Read Article',
      case_study: 'View Case Study',
      guide: 'Read Guide',
      ebook: 'Download eBook',
      webinar: 'Watch Webinar'
    }
    return actionMap[type as keyof typeof actionMap] || 'View Content'
  }
}