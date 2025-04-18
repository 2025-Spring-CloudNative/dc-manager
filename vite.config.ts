import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwind from "tailwindcss";
import { fileURLToPath } from 'url';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: "./static",
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind],
    },
  },
})
