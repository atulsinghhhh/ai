import { createClient } from "@supabase/supabase-js";

// @ts-ignore
const supabaseUrl = import.meta.env?.BUN_PUBLIC_SUPABASE_URL || process.env.BUN_PUBLIC_SUPABASE_URL;
// @ts-ignore
const supabasePublishableKey = import.meta.env?.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabasePublishableKey ? "Defined" : "Undefined");

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);