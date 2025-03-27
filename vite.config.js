import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    port: 3000, // Change port if needed
    open: true, // Automatically opens the browser when the server starts
  },
  build: {
    outDir: 'dist', // Output directory for production build
  },
})
