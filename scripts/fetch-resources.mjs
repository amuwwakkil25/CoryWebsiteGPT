import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "data");
const outFile = path.join(outDir, "resources.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("[build] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(0); // do not fail the build; runtime fallbacks will handle it
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

(async () => {
  try {
    const { data, error } = await supabase
      .from("content_items")
      .select("id,title,slug,excerpt as summary,featured_image_url as cover_image,reading_time_minutes as reading_minutes,tags,is_published as published,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    fs.mkdirSync(outDir, { recursive: true });
    const payload = {
      ok: true,
      generated_at: new Date().toISOString(),
      count: data?.length ?? 0,
      items: data ?? [],
    };
    fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), "utf8");
    console.log(`[build] Wrote ${outFile} with ${payload.count} items`);
  } catch (e) {
    console.error("[build] Failed to prefetch resources:", e?.message || e);
    // Do not throw; let runtime fallback handle it.
  }
})();