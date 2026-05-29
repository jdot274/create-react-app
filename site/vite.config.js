import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // './' base so Electron can load built files from disk (file:// protocol)
  base: './',
  build: { outDir: 'dist' },
});
