import { createClient } from '@superbase/supabase-js'

const superbaseUrl = "YOUR_PROJECT_URL"
const superbaseKey = "YOUR_ANON_KEY"

export const supabase = createClient(superbaseUrl, superbaseKey)
