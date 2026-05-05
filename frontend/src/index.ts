import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html with injected environment variables for development.
    "/*": async () => {
      const html = await index.text();
      const injectedHtml = html.replace(
        "<head>",
        `<head>
    <script>
      window.process = { 
        env: { 
          BUN_PUBLIC_SUPABASE_URL: ${JSON.stringify(process.env.BUN_PUBLIC_SUPABASE_URL)},
          BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${JSON.stringify(process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY)},
          BUN_PUBLIC_BACKEND_URL: ${JSON.stringify(process.env.BUN_PUBLIC_BACKEND_URL)}
        } 
      };
    </script>`
      );
      return new Response(injectedHtml, {
        headers: { "Content-Type": "text/html" },
      });
    },

    "/api/hello": {
      async GET(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(_req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
