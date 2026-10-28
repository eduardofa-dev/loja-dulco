import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (instance) return instance;
  instance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } },
  );
  return instance;
}
