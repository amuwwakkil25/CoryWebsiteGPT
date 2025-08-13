/*
  # Fix analytics RLS policy for anonymous users

  1. Security Changes
    - Drop existing restrictive policies on website_analytics table
    - Add new policy to allow anonymous users to insert analytics data
    - Maintain read restrictions for authenticated users only

  This resolves the "new row violates row-level security policy" error
  by allowing anonymous visitors to track page views and interactions.
*/

-- Drop existing policies that might be blocking anonymous inserts
DROP POLICY IF EXISTS "Allow anon insert analytics" ON public.website_analytics;
DROP POLICY IF EXISTS "Allow authenticated insert analytics" ON public.website_analytics;
DROP POLICY IF EXISTS "Allow authenticated read analytics" ON public.website_analytics;

-- Create new policy to allow anonymous users to insert analytics data
CREATE POLICY "Allow anon insert for analytics" 
  ON public.website_analytics 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Allow authenticated users to insert analytics data
CREATE POLICY "Allow authenticated insert for analytics" 
  ON public.website_analytics 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Only authenticated users can read analytics data
CREATE POLICY "Allow authenticated read analytics" 
  ON public.website_analytics 
  FOR SELECT 
  TO authenticated 
  USING (true);