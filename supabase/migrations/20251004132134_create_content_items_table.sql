/*
  # Create content_items table for Resources Page

  ## Description
  This migration creates the content_items table to store all resources (blog posts, case studies, guides, ebooks, webinars) displayed on the resources page.

  ## New Tables
    - `content_items`
      - `id` (uuid, primary key) - Unique identifier for each content item
      - `title` (text, required) - Title of the resource
      - `slug` (text, unique, required) - URL-friendly version of the title
      - `excerpt` (text) - Short description/summary
      - `content` (text) - Full content (HTML/Markdown)
      - `content_type` (text, required) - Type of content: blog, case_study, guide, ebook, webinar
      - `is_featured` (boolean, default false) - Whether to feature on the page
      - `is_published` (boolean, default false) - Whether the content is live
      - `featured_image_url` (text) - URL to the featured image
      - `tags` (text array) - Array of tags for categorization
      - `reading_time_minutes` (integer) - Estimated reading time
      - `author_name` (text) - Author's name
      - `published_at` (timestamptz) - Publication date
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - Enable RLS on `content_items` table
    - Add policy for public SELECT access to published content
    - Add policy for authenticated users to manage content (for admin panel)

  ## Important Notes
    1. Public users can only view published content (is_published = true)
    2. Only authenticated users can create/update/delete content items
    3. The slug field must be unique to ensure clean URLs
    4. Tags are stored as a text array for flexible categorization
*/

CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  content_type text NOT NULL CHECK (content_type IN ('blog', 'case_study', 'guide', 'ebook', 'webinar')),
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT false,
  featured_image_url text,
  tags text[],
  reading_time_minutes integer DEFAULT 5,
  author_name text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content"
  ON content_items
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can insert content"
  ON content_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content"
  ON content_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content"
  ON content_items
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_content_items_published ON content_items(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_featured ON content_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(content_type);
CREATE INDEX IF NOT EXISTS idx_content_items_slug ON content_items(slug);
