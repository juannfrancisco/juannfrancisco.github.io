// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// El mismo build se publica en juanfrancisco.dev (Cloud Run) y en
// juannfrancisco.github.io (GitHub Pages). El canonical apunta siempre a .dev.
export default defineConfig({
  site: 'https://juanfrancisco.dev',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  image: {
    dangerouslyProcessSVG: true,
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
