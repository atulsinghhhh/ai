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

export const BACKEND_URL = getEnv("BUN_PUBLIC_BACKEND_URL") || "https://ai-hj37.onrender.com";

// console.log("BACKEND URL:", BACKEND_URL);