// Fetch all notes for authenticated user - using RLS for security filtering
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

  // Fetch notes sorted by creation date
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Handle errors and return response
  if (error) throw error
  return new Response(JSON.stringify(data), { status: 200 })
})