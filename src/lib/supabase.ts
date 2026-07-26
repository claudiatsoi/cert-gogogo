import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
export const isSupabaseConfigured = Boolean(rawSupabaseUrl && rawSupabaseAnonKey)

if (!isSupabaseConfigured && process.env.NODE_ENV !== 'production') {
  console.warn('Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.')
}

// Keep fallback values so Next.js build succeeds even before env is configured.
const supabaseUrl = rawSupabaseUrl || 'https://placeholder.supabase.co'
const supabaseAnonKey = rawSupabaseAnonKey || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
