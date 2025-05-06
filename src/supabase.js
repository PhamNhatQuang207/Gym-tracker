import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hkzvnexparwppxflrwko.supabase.co'; // replace this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrenZuZXhwYXJ3cHB4Zmxyd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDM5MzUsImV4cCI6MjA2MjExOTkzNX0.XNq08SvYnRJZQoxwptwy1Vz0yhVFXZy4CnUKCiZiChg'; // replace this

export const supabase = createClient(supabaseUrl, supabaseKey);
