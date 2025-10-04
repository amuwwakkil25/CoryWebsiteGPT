# Supabase Setup Instructions

## Issue: Expired Anon Key

Your Supabase anon key has **expired** (expired on Sept 26, 2025). This is why the resources page shows "Error loading resources" in production.

## How to Fix

### Step 1: Get New Credentials from Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `0ec90b57d6e95fcbda19832f`
3. Navigate to: **Settings** → **API**
4. Copy these values:
   - **Project URL** (should be: `https://0ec90b57d6e95fcbda19832f.supabase.co`)
   - **anon/public key** (the long JWT token starting with `eyJ...`)

### Step 2: Update Local Environment

Update `.env` file:
```bash
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=<paste your new anon key here>
```

### Step 3: Update Netlify Production Environment

**Option A: Via Netlify Dashboard (Recommended)**
1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Update or add these variables:
   - `VITE_SUPABASE_URL` = `https://0ec90b57d6e95fcbda19832f.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `<your new anon key>`
4. Trigger a new deployment: **Deploys** → **Trigger deploy** → **Deploy site**

**Option B: Via netlify.toml**
1. Update `netlify.toml` with the new key
2. Commit and push changes (Note: this exposes the key in git history)

### Step 4: Test

After deployment:
1. Visit your production site
2. Go to the Resources page
3. Open browser console (F12)
4. You should see resources loading successfully

## Current Database Status

✅ Database has **16 content items** loaded
✅ **3 featured items**: 847% ROI, Multi-Channel Outreach, Win Back Students
✅ RLS policies configured correctly (public can read published content)

The database is ready - you just need valid credentials to access it!

## Quick Test Command

To verify your new credentials work:
```bash
curl "https://0ec90b57d6e95fcbda19832f.supabase.co/rest/v1/content_items?select=count" \
  -H "apikey: YOUR_NEW_ANON_KEY" \
  -H "Authorization: Bearer YOUR_NEW_ANON_KEY"
```

Should return: `[{"count":16}]`
