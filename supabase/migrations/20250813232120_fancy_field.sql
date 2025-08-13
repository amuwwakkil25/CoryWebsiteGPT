/*
  # Create set_config function for session variables

  1. New Functions
    - `set_config` function to handle session variables for RLS policies
      - Allows setting PostgreSQL configuration variables
      - Supports both local (transaction-scoped) and global settings
      - Required for ROI calculator session management

  2. Database Changes
    - Add unique constraint on `session_id` column in `roi_calculations` table
    - This enables proper upsert operations for ROI calculations
*/

-- Create the set_config function for session variable management
CREATE OR REPLACE FUNCTION public.set_config(setting_name text, setting_value text, is_local boolean DEFAULT true)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF is_local THEN
    EXECUTE format('SET LOCAL %I = %L', setting_name, setting_value);
  ELSE
    EXECUTE format('SET %I = %L', setting_name, setting_value);
  END IF;
  RETURN setting_value;
END;
$function$;

-- Add unique constraint on session_id for proper upsert operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'roi_calculations' 
    AND constraint_name = 'unique_session_id'
    AND constraint_type = 'UNIQUE'
  ) THEN
    ALTER TABLE public.roi_calculations
    ADD CONSTRAINT unique_session_id UNIQUE (session_id);
  END IF;
END $$;