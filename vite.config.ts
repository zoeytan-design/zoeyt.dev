import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static build: output goes to dist/ for Cloudflare static hosting.
export default defineConfig({
  plugins: [react()],
});
