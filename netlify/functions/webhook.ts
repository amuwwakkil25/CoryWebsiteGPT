// Netlify Function to proxy webhook requests to Zapier
// This avoids CORS issues when calling external webhooks from the browser

export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  try {
    // Get the webhook URL from environment variable
    const webhookUrl = process.env.VITE_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/2937706/ukqlrbi/';

    // Parse the request body
    const body = await req.json();

    // Forward the request to Zapier
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    // Get the response from Zapier
    const data = await response.json();

    // Return success response
    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Webhook proxy error:', error);

    return new Response(JSON.stringify({
      error: 'Failed to send webhook',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export const config = {
  path: "/api/webhook"
};
