/**
 * SUPABASE CLIENT — Legend Multibiz
 * ─────────────────────────────────────────────────────────────────────────
 * Single shared Supabase client instance used across the whole app.
 * Reads connection details from .env.local (never hardcode keys here).
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
