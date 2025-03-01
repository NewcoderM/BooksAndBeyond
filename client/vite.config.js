import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },  
  preview: {
    allowedHosts: ["booksandbeyond-production.up.railway.app"] 
  },
  build: {
    outDir: 'build'
  }
});
