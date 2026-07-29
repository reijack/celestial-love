import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmprqkkryhsixrvgqtwz.supabase.co'
const supabaseAnonKey = 'sb_publishable_FS6u_YVvuBiyKslQLKliAA_6KgpTGsr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
