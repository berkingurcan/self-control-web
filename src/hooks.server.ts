import type { Handle } from '@sveltejs/kit/hooks';

// Pages' _headers rules cover static files; Functions need their own headers.
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', /\/en(?:\/|$)/.test(event.url.pathname) ? 'en' : 'tr')
  });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
  if (event.url.hostname.endsWith('.pages.dev')) response.headers.set('X-Robots-Tag', 'noindex');
  return response;
};
