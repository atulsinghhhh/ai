import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string) => {
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv("BUN_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);