export const BACKEND_URL = 
  (import.meta as any).env?.BACKEND_URL || 
  (typeof process !== "undefined" ? process.env?.BACKEND_URL : undefined) || 
  "http://localhost:3001"