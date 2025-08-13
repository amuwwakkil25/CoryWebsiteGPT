/*
  # Fix Website Analytics RLS Policy

  1. Security Updates
    - Update RLS policy for `website_analytics` table to allow public INSERT operations
    - This enables anonymous users to track page views and interactions
    - Maintains read restrictions for authenticated users only

  2. Changes
    - Drop existing restrictive INSERT policy
    - Create new policy allowing public analytics tracking
    - Keep SELECT policy restricted to authenticated users
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert analytics events" ON website_analytics;

-- Create new policy allowing public analytics tracking
CREATE POLICY "Public can insert analytics events"
  ON website_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the SELECT policy remains restricted to authenticated users
DROP POLICY IF EXISTS "Authenticated users can read analytics" ON website_analytics;

CREATE POLICY "Authenticated users can read analytics"
  ON website_analytics
  FOR SELECT
  TO authenticated
  USING (true);