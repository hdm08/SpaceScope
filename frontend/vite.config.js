import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["space-scope-liard.vercel.app", "localhost:5173"], 
  },
  build: {
    outDir: 'dist', 
    emptyOutDir: true, 
  },
});