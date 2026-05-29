import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/TW_lab6/',
  plugins: [
    tailwindcss(),
  ],
})