/*
  # Fix analytics RLS policy for anonymous users

  1. Security Changes
    - Drop existing restrictive policies on website_analytics table
    - Create new policy allowing anonymous (anon) users to INSERT analytics events
    - Create policy allowing authenticated users to INSERT analytics events
    - Maintain SELECT restrictions for authenticated users only

  This fixes the "new row violates row-level security policy" error by properly
  allowing anonymous website visitors to track page views and interactions.
*/

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Anonymous users can insert analytics events" ON website_analytics;
DROP POLICY IF EXISTS "Authenticated users can insert analytics events" ON website_analytics;
DROP POLICY IF EXISTS "Public can insert analytics events" ON website_analytics;
DROP POLICY IF EXISTS "Authenticated users can read analytics" ON website_analytics;

-- Create new policy allowing anonymous users to insert analytics data
CREATE POLICY "Allow anon insert analytics"
  ON website_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy allowing authenticated users to insert analytics data
CREATE POLICY "Allow authenticated insert analytics"
  ON website_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy allowing authenticated users to read analytics data
CREATE POLICY "Allow authenticated read analytics"
  ON website_analytics
  FOR SELECT
  TO authenticated
  USING (true);