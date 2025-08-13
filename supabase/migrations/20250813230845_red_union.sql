/*
  # ROI Calculator Database Schema

  1. New Tables
    - `roi_calculations`
      - `id` (uuid, primary key)
      - `session_id` (text, for anonymous users)
      - `user_inputs` (jsonb, stores all input values)
      - `calculated_results` (jsonb, stores calculated outputs)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `roi_calculations` table
    - Add policy for anonymous users to manage their own calculations
    - Add policy for authenticated users to manage their calculations

  3. Indexes
    - Index on session_id for fast lookups
    - Index on created_at for cleanup operations
*/

CREATE TABLE IF NOT EXISTS roi_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_inputs jsonb DEFAULT '{}'::jsonb,
  calculated_results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE roi_calculations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to manage calculations by session ID
CREATE POLICY "Users can manage own ROI calculations by session"
  ON roi_calculations
  FOR ALL
  TO anon, authenticated
  USING (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR session_id = current_setting('app.session_id', true))
  WITH CHECK (session_id = current_setting('request.jwt.claims', true)::json->>'session_id' OR session_id = current_setting('app.session_id', true));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_roi_calculations_session_id ON roi_calculations(session_id);
CREATE INDEX IF NOT EXISTS idx_roi_calculations_created_at ON roi_calculations(created_at);

-- Function to clean up old calculations (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_roi_calculations()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM roi_calculations 
  WHERE created_at < now() - interval '30 days';
END;
$$;