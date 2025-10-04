/*
  # Create Lead Captures Table

  1. New Tables
    - `lead_captures`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, required) - User's email address
      - `first_name` (text, optional) - User's first name
      - `last_name` (text, optional) - User's last name
      - `phone` (text, optional) - User's phone number
      - `institution` (text, optional) - User's institution/organization
      - `content_item_id` (uuid, optional) - Reference to content item that triggered the form
      - `content_title` (text, optional) - Title of content for reference
      - `created_at` (timestamptz) - Timestamp of submission
      
  2. Security
    - Enable RLS on `lead_captures` table
    - No public read access (admin only)
    - No public write access (will use edge function for submissions)
    
  3. Indexes
    - Index on email for lookups
    - Index on created_at for reporting
*/

CREATE TABLE IF NOT EXISTS lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text,
  last_name text,
  phone text,
  institution text,
  content_item_id uuid,
  content_title text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON lead_captures(created_at DESC);