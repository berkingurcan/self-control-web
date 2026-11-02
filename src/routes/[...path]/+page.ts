import { error, redirect } from '@sveltejs/kit';
import { parsePath, ids, href, selectedSite } from '#lib/site.ts';
import { config as env } from '#lib/config.ts';
// Prerender listed home/profile pages, while keeping legacy redirects and 404s on the Worker.
export const prerender = 'auto';
export function entries() {
  const prefixes = env.PUBLIC_ENABLE_PREVIEWS === 'true' ? ['', ...ids.map(id => `/preview/${id}`)] : [''];
  return prefixes.flatMap(prefix => {
    const site = parsePath(prefix || '/')!.site;
    const pages = site === 'academy' ? ['home', 'coach'] as const : ['home'] as const;
    return (['tr', 'en'] as const).flatMap(lang => pages.map(page => ({ path: href(page, lang, prefix).replace(/^\//, '') })));
  });
}
export function load({ url }: { url: URL }) {
  const result = parsePath(url.pathname);
  if (!result) error(404, 'Page not found');
  if (result.page === 'coach' && result.site !== 'academy') error(404, 'Page not found');
  if (result.page !== 'home' && result.page !== 'coach') redirect(308, href(result.page === 'about' && result.site !== 'academy' ? 'home' : result.page, result.lang, result.prefix));
  return { ...result, deploymentSite: selectedSite };
}
