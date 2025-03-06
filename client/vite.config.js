import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Allows access from any host
    proxy: {
      '/api': 'https://booksandbeyond-server.onrender.com', // Add proxy if you're calling API in production
    },
    allowedHosts: ["booksandbeyond.onrender.com"] 
  },
  build: {
    outDir: 'build', // Specifies the output directory for your production build
  },
  preview: {
    // For local preview only, but it's fine to keep it here as fallback
    allowedHosts: ["booksandbeyond.onrender.com"]
  }
});
