import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages typically deploys to the root domain, 
  // so we remove the base path used for GitHub Pages.
  base: '/',
})
