import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Swagger UI lives at /docs on FastAPI (default docs_url).
      // The frontend also has a /docs route, so we expose the Swagger UI
      // via /api/docs and rewrite the path before forwarding to the backend.
      "/api/docs": {
        target: "http://localhost:8000",
        rewrite: (path) => path.replace(/^\/api\/docs/, "/docs"),
      },
      "/api/redoc": {
        target: "http://localhost:8000",
        rewrite: (path) => path.replace(/^\/api\/redoc/, "/redoc"),
      },
      // Forward all other /api/* requests to FastAPI (routes include /api prefix).
      "/api": { target: "http://localhost:8000" },
      // FastAPI's openapi.json is at /openapi.json on the backend.
      "/openapi.json": { target: "http://localhost:8000" },
      // FastAPI OAuth2 redirect (swagger UI try-it auth flow).
      "/docs/oauth2-redirect": { target: "http://localhost:8000" },
      "/v1":      { target: "http://localhost:8000" },
      "/healthz": { target: "http://localhost:8000" },
    },
  },

  build: {
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react":  ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-charts": ["recharts"],
        },
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
  },
});
