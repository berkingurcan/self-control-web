import type { Handle } from '@sveltejs/kit/hooks';

// Cloudflare's _headers rules cover static files; dynamic responses need their own headers.
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', /\/en(?:\/|$)/.test(event.url.pathname) ? 'en' : 'tr')
  });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
  if (response.headers.get('Content-Type')?.startsWith('text/html')) response.headers.set('Cache-Control', 'no-cache');
  if (event.url.hostname.endsWith('.pages.dev') || event.url.hostname.endsWith('.workers.dev')) response.headers.set('X-Robots-Tag', 'noindex');
  return response;
};
