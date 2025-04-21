
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = 'https://vjnbnxwrirxumverxnnx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbmJueHdyaXJ4dW12ZXJ4bm54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDE0ODQ4OSwiZXhwIjoyMDU5NzI0NDg5fQ.4SGVp_KIJhfUDD2yjV3kytfIabTzTVo4YOemq5zHjls'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
