import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export const handler: Handler = async () => {
  try {
    const { data, error } = await supabase
      .from("content_items")
      .select("id,title,slug,excerpt as summary,featured_image_url as cover_image,reading_time_minutes as reading_minutes,tags,is_published as published,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, items: data ?? [] }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: e?.message || String(e) }),
    };
  }
};