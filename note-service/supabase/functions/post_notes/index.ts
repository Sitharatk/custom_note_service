
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js' // Vite-compatible import

serve(async (req) => {
  // Initialize Supabase client with auth header
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    { global: { headers: { Authorization: req.headers.get('Authorization') } } }
  )

  // Verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  // Validate required fields
  const { title, content, is_public } = await req.json()
  if (!title) return new Response(JSON.stringify({ error: 'Title required' }), { status: 400 })

  // Insert note with user context
  const { data, error } = await supabase
    .from('notes')
    .insert({ 
      user_id: user.id,
      title,
      content: content || null,
      is_public: is_public || false
    })
    .select()

  // Handle errors and return response
  if (error) throw error
  return new Response(JSON.stringify(data[0]), { status: 201 })
})