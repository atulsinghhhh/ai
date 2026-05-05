import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.BUN_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabasePublishableKey ? "Present" : "Missing");

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);