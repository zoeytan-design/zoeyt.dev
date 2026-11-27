import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths: works on the custom domain and on the github.io project URL.
  base: './',
  server: { host: true, port: 5173 },
});
