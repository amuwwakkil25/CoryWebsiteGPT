/*
  # Add podcast column to content_items table

  1. New Columns
    - `podcast_url` (text, nullable) - URL to podcast episode

  2. Changes
    - Add podcast_url column to content_items table
    - Allow null values for content that doesn't have podcasts
*/

-- Add podcast_url column to content_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'content_items' AND column_name = 'podcast_url'
  ) THEN
    ALTER TABLE content_items ADD COLUMN podcast_url text;
  END IF;
END $$;

-- Update the existing blog post with the podcast URL
UPDATE content_items 
SET podcast_url = 'https://www.buzzsprout.com/2456315/episodes/17795319-winning-back-vanished-students-with-ai-re-engagement-5th-sep-2025'
WHERE title ILIKE '%win back students%' OR title ILIKE '%vanish%' OR slug ILIKE '%win-back%';