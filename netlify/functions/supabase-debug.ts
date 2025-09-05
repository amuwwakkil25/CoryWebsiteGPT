import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  const details = {
    has_SUPABASE_URL: !!process.env.SUPABASE_URL,
    has_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    runtime: "netlify",
    timestamp: new Date().toISOString(),
  };
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(details, null, 2),
  };
};