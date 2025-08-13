/*
  # Fix Analytics RLS Policy for Anonymous Users

  1. Security Updates
    - Drop existing restrictive INSERT policy on `website_analytics`
    - Create new policy allowing anonymous (anon) users to INSERT analytics events
    - Maintain existing SELECT policy for authenticated users only
    - Ensure public visitors can track page views and interactions

  2. Changes Made
    - Allow `anon` role to INSERT into `website_analytics` table
    - Keep SELECT operations restricted to authenticated users
    - Maintain data security while enabling analytics tracking
*/

-- Drop the existing INSERT policy that was too restrictive
DROP POLICY IF EXISTS "Public can insert analytics events" ON website_analytics;

-- Create a new policy that explicitly allows anon role to insert
CREATE POLICY "Anonymous users can insert analytics events"
  ON website_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure authenticated users can also insert analytics events
CREATE POLICY "Authenticated users can insert analytics events"
  ON website_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);