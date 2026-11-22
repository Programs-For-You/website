import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Pages are prerendered to plain HTML; only /api/* runs as a Worker, with the D1 database bound as platform.env.DB.
      adapter: adapter()
    })
  ]
});
