// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// El mismo build se publica en juanfrancisco.dev (Cloud Run) y en
// juannfrancisco.github.io (GitHub Pages). El canonical apunta siempre a .dev.
export default defineConfig({
  site: 'https://juanfrancisco.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
