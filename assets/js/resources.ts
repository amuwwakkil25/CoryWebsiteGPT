import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_Bolt_Database_URL;
const supabaseKey = import.meta.env.VITE_Bolt_Database_ANON_KEY;

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

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content_type: string;
  is_featured?: boolean;
  featured_image_url?: string;
  tags?: string[];
  reading_time_minutes?: number;
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
          <div class="featured-card">
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
        <div class="resource-card">
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
