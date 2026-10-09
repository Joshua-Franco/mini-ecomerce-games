import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Activa React y Tailwind CSS en el servidor y el proceso de compilación de Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5475,
    strictPort: true,
  },
  preview: {
    host: 'localhost',
    port: 5475,
    strictPort: true,
  },
})
