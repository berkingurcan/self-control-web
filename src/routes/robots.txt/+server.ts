import { text } from '@sveltejs/kit';
import { config } from '#lib/config.ts';
import { siteForHostname } from '#lib/site.ts';
import { siteDomains } from '#lib/site-domains.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const site = siteForHostname(url.hostname);
  const rules = config.PUBLIC_INDEXABLE === 'true'
    ? `Allow: /\nDisallow: /preview/\nSitemap: https://${siteDomains[site]}/sitemap.xml\n`
    : 'Disallow: /\n';
  return text(`User-agent: *\n${rules}`, { headers: { 'Cache-Control': 'no-cache' } });
};
