import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-cloudflare';

export default defineConfig({
  envPrefix: ['VITE_', 'PUBLIC_'],
  server: { watch: { ignored: ['**/builds/**', '**/.wrangler/**'] } },
  plugins: [sveltekit({ adapter: adapter(), prerender: { handleHttpError: 'fail' } })]
});
