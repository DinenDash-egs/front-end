import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['grupo8-egs.deti.ua.pt'],
  },
  base: '/client',
  plugins: [react(), tailwindcss()],
})
