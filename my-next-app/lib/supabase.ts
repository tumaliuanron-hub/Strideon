import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://spjgwdratogrkgzadaii.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_1KZwTKXsYJAl2nBUcUEgyQ_90U4rjGr";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  typeof window === "undefined" && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey
);
