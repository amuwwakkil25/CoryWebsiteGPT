      // Simple Netlify function for resources
export default async function handler(req, res) {
  return new Response(JSON.stringify({
    ok: true,
    items: []
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}