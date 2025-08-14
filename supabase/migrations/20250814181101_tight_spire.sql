/*
  # Create demo requests table for Agent Cory

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `institution` (text)
      - `occupation` (text)
      - `interest_area` (text, optional)
      - `request_type` (text - 'demo' or 'custom_ai')
      - `status` (text - 'new', 'contacted', 'scheduled', 'completed')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `demo_requests` table
    - Add policy for authenticated users to manage requests
    - Add policy for anonymous users to insert requests
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  occupation text NOT NULL,
  interest_area text DEFAULT NULL,
  request_type text NOT NULL DEFAULT 'demo',
  status text NOT NULL DEFAULT 'new',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert demo requests
CREATE POLICY "Allow anonymous demo requests"
  ON demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to manage all demo requests
CREATE POLICY "Authenticated users can manage demo requests"
  ON demo_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_type ON demo_requests(request_type, created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);