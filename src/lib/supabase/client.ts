import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes dans .env.local.'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
