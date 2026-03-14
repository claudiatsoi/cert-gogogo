import { createClient } from '@supabase/supabase-js'

// Fallback to placeholder values to prevent build errors if env vars are missing
// Note: The app will still need valid keys to function correctly at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('CRITICAL ERROR: Supabase URL is missing! Check your Environment Variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
