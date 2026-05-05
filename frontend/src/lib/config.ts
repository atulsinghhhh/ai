export const BACKEND_URL = 
  (typeof process !== 'undefined' && process.env.BUN_PUBLIC_BACKEND_URL) || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.BUN_PUBLIC_BACKEND_URL) || 
  "https://ai-hj37.onrender.com";