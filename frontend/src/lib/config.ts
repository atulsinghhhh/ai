export const BACKEND_URL = 
  (import.meta as any).env?.BACKEND_URL || 
  (typeof process !== "undefined" ? process.env?.BACKEND_URL : undefined) || 
  "https://ai-hj37.onrender.com";