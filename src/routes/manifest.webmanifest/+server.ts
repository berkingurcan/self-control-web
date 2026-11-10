import { siteForHostname, siteName } from '#lib/site.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const site = siteForHostname(url.hostname);
  const academy = site === 'academy';
  const name = academy ? 'Self Control Fight Academy' : `Self Control ${siteName(site, 'tr')}`;
  const icons = [
    { src: `/icons/${site}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `/icons/${site}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `/icons/${site}/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ];
  return new Response(JSON.stringify({
    id: '/', name, short_name: academy ? 'Self Control' : `SC ${siteName(site, 'tr')}`, lang: 'tr',
    description: 'Denizli’de kick boks, MMA ve Muay Thai antrenmanları — Self Control Fight Academy',
    start_url: '/', scope: '/', display: 'standalone',
    background_color: academy ? '#ffffff' : '#080808', theme_color: academy ? '#ffffff' : '#080808',
    orientation: 'any', icons,
    shortcuts: [
      { name: 'Antrenmanlar', url: '/#training' },
      { name: 'Ders programı', url: '/#schedule' },
      { name: 'İletişim', url: '/#start' }
    ]
  }), { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'no-cache' } });
};
