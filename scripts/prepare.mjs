import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const ids = ['academy', 'muaythai', 'kickbox', 'mma'];
const id = process.env.PUBLIC_SITE_ID || 'academy';
if (!ids.includes(id)) throw new Error(`Unknown PUBLIC_SITE_ID: ${id}`);
const names = { academy: 'Self Control Fight Academy', muaythai: 'Self Control Muay Thai', kickbox: 'Self Control Kick Boks', mma: 'Self Control MMA' };
const colors = { academy: '#ffffff', muaythai: '#B7D19C', kickbox: '#AAC6E6', mma: '#E0A097' };
await mkdir('static/icons', { recursive: true });
for (const name of ['icon-192', 'icon-512', 'maskable-512', 'apple-touch-icon']) await copyFile(`static/icons/${id}/${name}.png`, `static/icons/${name}.png`);
const mark = await readFile('static/brand/mark.svg', 'utf8');
const inner = mark.replace(/<svg[^>]*>/, '').replace('</svg>', '');
await writeFile('static/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#080808"/><g transform="translate(86 132) scale(.85) translate(-300 -355)" fill="${colors[id]}">${inner}</g></svg>`);
await writeFile('static/manifest.webmanifest', JSON.stringify({
  id: '/', name: names[id], short_name: id === 'academy' ? 'Self Control' : names[id].replace('Self Control ', 'SC '), lang: 'tr', description: 'Denizli’de Muay Thai, kick boks ve MMA antrenmanları — Self Control Fight Academy',
  start_url: '/', scope: '/', display: 'standalone', background_color: id === 'academy' ? '#ffffff' : '#080808', theme_color: id === 'academy' ? '#ffffff' : '#080808', orientation: 'any',
  icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }],
  shortcuts: [{ name: 'Antrenmanlar', url: '/#training' }, { name: 'Ders programı', url: '/#schedule' }, { name: 'İletişim', url: '/#start' }]
}, null, 2));
const indexable = process.env.PUBLIC_INDEXABLE === 'true';
const domain = `${id === 'academy' ? '' : `${id}.`}selfcontrolfightacademy.com`;
await writeFile('static/robots.txt', `User-agent: *\n${indexable ? 'Allow: /\nDisallow: /preview/' : 'Disallow: /'}\n${indexable ? `Sitemap: https://${domain}/sitemap.xml\n` : ''}`);
const tr = ['', '/bas-antrenor'];
const en = ['/en', '/en/head-trainer'];
await writeFile('static/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...tr, ...en].map(path => `<url><loc>https://${domain}${path || '/'}</loc></url>`).join('')}</urlset>`);
const revision = createHash('sha256').update(`${Date.now()}-${id}`).digest('hex').slice(0, 12);
const sw = `const CACHE='self-control-${id}-${revision}';
const SHELL=['/offline.html','/brand/mark.svg','/brand/wordmark.svg','/icons/icon-192.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('self-control-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request; const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('__data')||url.search||url.pathname.startsWith('/api/'))return;
 const isPublic=request.mode==='navigate'||url.pathname.startsWith('/_app/immutable/')||url.pathname.startsWith('/fonts/')||url.pathname.startsWith('/brand/')||url.pathname.startsWith('/images/');
 if(!isPublic)return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   if(request.mode==='navigate'){
     try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response}
     catch{return(await cache.match(request))||(await cache.match('/offline.html'))}
   }
   const saved=await cache.match(request);if(saved)return saved;
   try{const response=await fetch(request);if(response.ok){await cache.put(request,response.clone());const keys=await cache.keys();if(keys.length>100)await cache.delete(keys[SHELL.length])}return response}
   catch{return Response.error()}
 })())
});`;
await writeFile('static/service-worker.js', sw);
console.log(`Prepared ${names[id]} — indexing ${indexable ? 'enabled' : 'disabled'}`);
