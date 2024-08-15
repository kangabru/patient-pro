import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@/common": "/src/common/",
      "@/components": "/src/components/",
      "@/pages": "/src/pages/",
      "@/api": "/src/api/",
    },
  },
})
