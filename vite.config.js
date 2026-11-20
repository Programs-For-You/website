import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Every page is prerendered to plain HTML, so the site still deploys to Netlify as static files.
      adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html', strict: false })
    })
  ]
});
