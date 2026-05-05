import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string): string | undefined => {
  // 1. Try Bun/Vite style
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key];
  }
  // 2. Try Node/Bun global process style safely via globalThis
  const g = globalThis as any;
  if (g.process && g.process.env) {
    return g.process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv("BUN_PUBLIC_SUPABASE_URL");
const supabasePublishableKey = getEnv("BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabasePublishableKey ? "Defined" : "Undefined");

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);