import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { siteDomains, sitesByHostname, sitePagePaths } from '../src/lib/site-domains.ts';

const ids = Object.keys(siteDomains);
const id = process.env.PUBLIC_SITE_ID || 'academy';
if (!ids.includes(id)) throw new Error(`Unknown PUBLIC_SITE_ID: ${id}`);
const names = { academy: 'Self Control Fight Academy', muaythai: 'Self Control Muay Thai', kickbox: 'Self Control Kick Boks', mma: 'Self Control MMA' };
await mkdir('static/icons', { recursive: true });
for (const name of ['icon-192', 'icon-512', 'maskable-512', 'apple-touch-icon']) await copyFile(`static/icons/${id}/${name}.png`, `static/icons/${name}.png`);
await copyFile(`static/icons/${id}/favicon.svg`, 'static/icon.svg');
const indexable = process.env.PUBLIC_INDEXABLE === 'true';
const previewPages = process.env.PUBLIC_ENABLE_PREVIEWS === 'true'
  ? ids.flatMap(site => sitePagePaths(site).map(path => `/preview/${site}${path === '/' ? '' : path}`))
  : [];
const pagesBySite = Object.fromEntries(ids.map(site => [site, [...sitePagePaths(site), ...previewPages]]));
const revision = createHash('sha256').update(`${Date.now()}-${id}`).digest('hex').slice(0, 12);
const sw = `const hostname=new URL(self.location.origin).hostname.replace(/\\.$/,'');
const site=new Map(${JSON.stringify([...sitesByHostname])}).get(hostname)||'${id}';
const CACHE='self-control-'+site+'-${revision}';
const PUBLIC_PAGES=${JSON.stringify(pagesBySite)}[site];
const SHELL=['/offline.html','/brand/mark.svg','/brand/wordmark.svg','/icons/icon-192.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...SHELL,...PUBLIC_PAGES])))});
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
   try{const response=await fetch(request);if(response.ok){await cache.put(request,response.clone());const keys=await cache.keys();if(keys.length>100)await cache.delete(keys[SHELL.length+PUBLIC_PAGES.length])}return response}
   catch{return Response.error()}
 })())
});`;
await writeFile('static/service-worker.js', sw);
console.log(`Prepared ${names[id]} — indexing ${indexable ? 'enabled' : 'disabled'}`);
