import { error, redirect } from '@sveltejs/kit';
import { parsePath, href, siteForHostname } from '#lib/site.ts';

// A prerendered "/" would be shared by every hostname attached to this Worker.
export const prerender = false;

export function load({ url }: { url: URL }) {
  const site = siteForHostname(url.hostname);
  const legacy = url.pathname.match(/^(.*)\/(bas-antrenor|head-trainer)\/?$/);
  if (legacy) {
    const target = `${legacy[1]}/gokhandenizli`;
    const profile = parsePath(target, site);
    if (profile?.site === 'academy') redirect(308, `${target}${url.search}${url.hash}`);
  }
  const result = parsePath(url.pathname, site);
  if (!result) error(404, 'Page not found');
  if (result.page === 'coach' && result.site !== 'academy') error(404, 'Page not found');
  if (result.page !== 'home' && result.page !== 'coach') redirect(308, href(result.page === 'about' && result.site !== 'academy' ? 'home' : result.page, result.lang, result.prefix));
  return result;
}
