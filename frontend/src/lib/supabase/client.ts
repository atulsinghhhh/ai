import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 
  (typeof process !== 'undefined' && process.env.BUN_PUBLIC_SUPABASE_URL) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.BUN_PUBLIC_SUPABASE_URL) || 
  "";

const supabasePublishableKey = 
  (typeof process !== 'undefined' && process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
  "";

console.log("BUN_PUBLIC_SUPABASE_URL from config:", supabaseUrl);
console.log("BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY from config:", supabasePublishableKey);

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);