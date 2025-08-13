/*
  # Fix website analytics RLS policy for anonymous users

  1. Security Changes
    - Drop existing conflicting policies on website_analytics table
    - Create new policy allowing anonymous users to insert analytics data
    - Maintain read restrictions for authenticated users only

  This resolves the "new row violates row-level security policy" error
  by explicitly allowing the 'anon' role to insert analytics events.
*/

-- First, ensure RLS is enabled on the table
ALTER TABLE website_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow anon insert for analytics" ON website_analytics;
DROP POLICY IF EXISTS "Allow authenticated insert for analytics" ON website_analytics;
DROP POLICY IF EXISTS "Allow authenticated read analytics" ON website_analytics;

-- Create a comprehensive policy for anonymous inserts
CREATE POLICY "Enable anonymous analytics tracking"
  ON website_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated user inserts
CREATE POLICY "Enable authenticated analytics tracking"
  ON website_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to read analytics
CREATE POLICY "Enable authenticated analytics reading"
  ON website_analytics
  FOR SELECT
  TO authenticated
  USING (true);