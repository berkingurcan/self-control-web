import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';

export default defineConfig({
  envPrefix: ['VITE_', 'PUBLIC_'],
  server: { watch: { ignored: ['**/builds/**', '**/.vercel/**'] } },
  plugins: [sveltekit({ adapter: adapter({ runtime: 'nodejs24.x' }), prerender: { handleHttpError: 'fail' } })]
});
