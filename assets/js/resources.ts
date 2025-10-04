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

function createLeadCaptureModal(item: ContentItem) {
  const modal = document.createElement('div');
  modal.className = 'content-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-body" style="padding: 3rem 2rem;">
        <h2 style="margin-bottom: 1rem; font-size: 1.75rem;">Get Your Free ${item.content_type === 'guide' ? 'Guide' : 'eBook'}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">${item.title}</p>
        <form id="lead-capture-form" class="lead-form">
          <div class="form-group">
            <label for="first_name">First Name *</label>
            <input type="text" id="first_name" name="first_name" required />
          </div>
          <div class="form-group">
            <label for="last_name">Last Name *</label>
            <input type="text" id="last_name" name="last_name" required />
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone" />
          </div>
          <div class="form-group">
            <label for="institution">Institution/Organization</label>
            <input type="text" id="institution" name="institution" />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Download Now</button>
          <div id="form-message" style="margin-top: 1rem; display: none;"></div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  setTimeout(() => modal.classList.add('active'), 10);

  const form = modal.querySelector('#lead-capture-form') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      institution: formData.get('institution'),
      content_item_id: item.id,
      content_title: item.title
    };

    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const messageDiv = form.querySelector('#form-message') as HTMLDivElement;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const { error } = await supabase
        .from('lead_captures')
        .insert([data]);

      if (error) throw error;

      messageDiv.style.display = 'block';
      messageDiv.style.color = 'var(--success)';
      messageDiv.textContent = 'Success! Check your email for the download link.';

      form.reset();

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      messageDiv.style.display = 'block';
      messageDiv.style.color = 'var(--error)';
      messageDiv.textContent = 'Something went wrong. Please try again.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Download Now';
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  };

  modal.querySelector('.modal-close')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  modal.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      closeModal();
    }
  });
}

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
        ${item.video_podcast_url ? `
          <a href="${item.video_podcast_url}" target="_blank" rel="noopener noreferrer" class="modal-media-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Watch Video/Podcast</span>
          </a>
        ` : ''}
        ${item.podcast_url ? `
          <a href="${item.podcast_url}" target="_blank" rel="noopener noreferrer" class="modal-media-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <span>Listen to Audio Podcast</span>
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
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });

  modal.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      closeModal();
    }
  });
}

function attachClickHandlers(items: ContentItem[]) {
  const cards = document.querySelectorAll('.resource-card, .featured-card');
  cards.forEach(card => {
    const itemId = card.getAttribute('data-id');
    const itemType = card.getAttribute('data-type');

    card.addEventListener('click', () => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        if (itemType === 'guide' || itemType === 'ebook') {
          createLeadCaptureModal(item);
        } else if (itemType === 'blog' || itemType === 'case_study') {
          createModal(item);
        }
      }
    });
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
  video_podcast_url?: string;
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
    }

    attachClickHandlers(data);

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
