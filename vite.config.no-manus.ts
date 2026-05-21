import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Check if we're building Terminal only (via VITE_BUILD_TARGET env var)
const buildTarget = process.env.VITE_BUILD_TARGET || "main";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: buildTarget === "terminal"
      ? path.resolve(import.meta.dirname, "dist/terminal")
      : path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: buildTarget === "terminal"
        ? path.resolve(import.meta.dirname, "client/terminal/index.html")
        : path.resolve(import.meta.dirname, "client/index.html"),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@trpc') || id.includes('node_modules/@tanstack')) {
            return 'vendor-trpc';
          }
          if (id.includes('node_modules/streamdown') || id.includes('node_modules/mermaid')) {
            return 'vendor-mermaid';
          }
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: "all",
  },
});
