import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseServiceKey 
      })
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { content_id } = await req.json()
    
    if (!content_id) {
      return new Response(
        JSON.stringify({ error: 'content_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // First check if the content item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('content_items')
      .select('id, view_count')
      .eq('id', content_id)
      .single()

    if (checkError || !existingItem) {
      console.error('Content item not found:', checkError)
      return new Response(
        JSON.stringify({ error: 'Content item not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Increment view count
    const newViewCount = (existingItem.view_count || 0) + 1
    
    const { data, error } = await supabase
      .from('content_items')
      .update({ 
        view_count: newViewCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', content_id)
      .select('view_count')
      .single()

    if (error) {
      console.error('Error incrementing view count:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to increment view count', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, view_count: data.view_count }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})