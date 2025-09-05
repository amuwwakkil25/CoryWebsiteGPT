import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// Server-side keys (no VITE_ prefix)
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export const handler: Handler = async () => {
  try {
    const { data, error } = await supabase
      .from("content_items")
      .select("id,title,slug,excerpt,featured_image_url,reading_time_minutes,tags,is_published,published_at,content_type,author_name,category,is_featured")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Supabase error:", error);
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, items: data ?? [] }),
    };
  } catch (err: any) {
    console.error("Unhandled:", err);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};