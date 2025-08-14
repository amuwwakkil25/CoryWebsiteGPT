/*
  # Fix RLS policy for ROI calculations

  1. Security Changes
    - Drop existing restrictive RLS policy on `roi_calculations` table
    - Create new policy that allows session-based access for anonymous and authenticated users
    - Policy allows users to manage ROI calculations based on session_id matching app.session_id setting

  2. Notes
    - This enables the ROI calculator to work for both anonymous visitors and logged-in users
    - Session-based access ensures data isolation while allowing functionality
*/

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can manage own ROI calculations by session" ON roi_calculations;

-- Create new policy that allows session-based access
CREATE POLICY "Allow session to manage own roi_calculations"
  ON roi_calculations
  FOR ALL
  TO anon, authenticated
  USING (session_id = current_setting('app.session_id', true)::text)
  WITH CHECK (session_id = current_setting('app.session_id', true)::text);