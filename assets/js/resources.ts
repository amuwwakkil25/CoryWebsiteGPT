import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('ENV CHECK:', {
  url: supabaseUrl,
  urlType: typeof supabaseUrl,
  hasKey: !!supabaseKey,
  keyType: typeof supabaseKey,
  keyLength: supabaseKey?.length
});

if (!supabaseUrl || !supabaseKey) {
  console.error('MISSING ENV VARS:', { supabaseUrl, supabaseKey });
  throw new Error('Supabase configuration is missing. Please check environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function createModal(item: ContentItem) {
  const modal = document.createElement('div');
  modal.className = 'content-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-header">
        <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}">
        <span class="content-badge ${item.content_type}">${item.content_type}</span>
      </div>
      <div class="modal-body">
        <h2>${item.title}</h2>
        <div class="modal-meta">
          ${item.author_name ? `<span>By ${item.author_name}</span>` : ''}
          <span>${item.reading_time_minutes || 5} min read</span>
        </div>
        ${item.podcast_url ? `
          <a href="${item.podcast_url}" target="_blank" rel="noopener noreferrer" class="modal-media-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Watch Video/Podcast</span>
          </a>
        ` : ''}
        <div class="modal-text">${item.content || item.excerpt || '<p>Content not available.</p>'}</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  setTimeout(() => modal.classList.add('active'), 10);

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  };

  modal.querySelector('.modal-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });
  modal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
}

function attachClickHandlers(items: ContentItem[]) {
  const cards = document.querySelectorAll('.resource-card, .featured-card');
  cards.forEach(card => {
    const itemId = card.getAttribute('data-id');
    const itemType = card.getAttribute('data-type');

    if (itemType === 'blog' || itemType === 'case_study') {
      card.addEventListener('click', () => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          createModal(item);
        }
      });
    }
  });
}

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  content_type: string;
  is_featured?: boolean;
  featured_image_url?: string;
  tags?: string[];
  reading_time_minutes?: number;
  author_name?: string;
  published_at?: string;
  podcast_url?: string;
}

async function loadAndDisplayResources() {
  console.log('STARTING TO LOAD RESOURCES...');

  const featuredContainer = document.getElementById('featured-content');
  const allContainer = document.getElementById('resources-content');

  if (featuredContainer) {
    featuredContainer.innerHTML = '<div class="loading-placeholder"><p>Loading...</p></div>';
  }
  if (allContainer) {
    allContainer.innerHTML = '<div class="loading-placeholder"><p>Loading...</p></div>';
  }

  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    console.log('SUPABASE RESPONSE:', { data, error });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      if (featuredContainer) {
        featuredContainer.innerHTML = '<p>No resources found.</p>';
      }
      if (allContainer) {
        allContainer.innerHTML = '<p>No resources found.</p>';
      }
      return;
    }

    console.log('LOADED', data.length, 'RESOURCES');

    const featured = data.filter(item => item.is_featured);
    const all = data;

    if (featuredContainer) {
      if (featured.length === 0) {
        featuredContainer.innerHTML = '<p>No featured resources.</p>';
      } else {
        featuredContainer.innerHTML = featured.map(item => `
          <div class="featured-card" data-id="${item.id}" data-type="${item.content_type}" style="cursor: pointer;">
            <div class="featured-image">
              <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}">
              <span class="content-badge ${item.content_type}">${item.content_type}</span>
            </div>
            <div class="featured-content">
              <h3>${item.title}</h3>
              <p>${item.excerpt}</p>
              <div class="content-meta">
                <span class="meta-item">${item.reading_time_minutes || 5} min read</span>
              </div>
            </div>
          </div>
        `).join('');

        attachClickHandlers(data);
      }
    }

    if (allContainer) {
      allContainer.innerHTML = all.map(item => `
        <div class="resource-card" data-id="${item.id}" data-type="${item.content_type}" style="cursor: pointer;">
          <div class="resource-image">
            <img src="${item.featured_image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}" alt="${item.title}">
            <span class="content-badge ${item.content_type}">${item.content_type}</span>
          </div>
          <div class="resource-content">
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <div class="resource-footer">
              <span class="read-time">${item.reading_time_minutes || 5} min read</span>
            </div>
          </div>
        </div>
      `).join('');

      attachClickHandlers(data);
    }

    console.log('RENDERING COMPLETE');

  } catch (error) {
    console.error('ERROR LOADING RESOURCES:', error);
    if (featuredContainer) {
      featuredContainer.innerHTML = '<p style="color: red;">Error loading resources. Check console.</p>';
    }
    if (allContainer) {
      allContainer.innerHTML = '<p style="color: red;">Error loading resources. Check console.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM LOADED - INITIALIZING RESOURCES PAGE');
  loadAndDisplayResources();
});
