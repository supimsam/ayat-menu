import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://krpvgpjjxwxbqpthnpui.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GACAJdvM9YDAE8YKFnnAEg_bPk6CjYm'

export const supabase = createClient(supabaseUrl, supabaseKey)
