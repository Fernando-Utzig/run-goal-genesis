
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = 'https://running-app.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
