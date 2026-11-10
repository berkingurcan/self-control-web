import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { siteDomains, sitePagePaths } from '../src/lib/site-domains.ts';
const ids=['academy','muaythai','kickbox','mma'];
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())out.push(...await walk(path));else out.push(path)}return out}
for(const [index, id] of ids.entries()){
 test(`${id}: the request hostname controls the site and PWA identity`,async()=>{
  // Exercise every site using a build configured for a different identity.
  const fallback = ids[(index + 1) % ids.length];
  const build = `builds/${fallback}`;
  const root=`${build}/cloudflare`;
  const files=await walk(root);
  await access(`${root}/_worker.js`);
  assert.deepEqual(files.filter(file => file.endsWith('.html')), [`${root}/offline.html`]);
  for (const path of ['/manifest.webmanifest', '/sitemap.xml', '/robots.txt']) assert(!files.includes(root+path));
  const { server } = await import(`../${build}/cloudflare-tmp/server.js`);
  await server.init({ env: {}, read: file => Readable.toWeb(createReadStream(join(root, file))) });
  const request = (path, host = siteDomains[id]) =>
   server.respond(new Request(`https://${host}${path}`), { getClientAddress: () => '127.0.0.1' });
  const readPage = async path => {
   const response = await request(path);
   assert.equal(response.status, 200, path);
   return response.text();
  };
  const defaultPage = await request('/', 'test.example.workers.dev');
  assert.equal(defaultPage.headers.get('X-Robots-Tag'), 'noindex');
  assert((await defaultPage.text()).includes(`data-identity="${fallback}"`));
  const ignoredAssets=await readFile(`${root}/.assetsignore`,'utf8');
  for (const file of ['_worker.js','_routes.json','_headers','_redirects']) assert(ignoredAssets.split('\n').includes(file));
  const headers=await readFile(`${root}/_headers`,'utf8');
  assert(headers.includes("frame-ancestors 'none'"));
  assert(headers.includes('/service-worker.js\n  Cache-Control: no-cache'));
  assert.equal((await request('/preview/mma')).status,404);
  const home=await readPage('/');const english=await readPage('/en');
  assert(home.includes('lang="tr"'));assert(english.includes('lang="en"'));
  assert(home.includes(`data-identity="${id}"`));assert(home.includes('noindex,nofollow'));
  const manifest=await (await request('/manifest.webmanifest')).json();
  assert.equal(manifest.display,'standalone');assert.equal(manifest.lang,'tr');
  assert(manifest.name.includes(id==='academy'?'Fight Academy':id==='muaythai'?'Muay Thai':id==='kickbox'?'Kick Boks':'MMA'));
  for(const icon of manifest.icons){
   assert(icon.src.startsWith(`/icons/${id}/`));
   await access(`${root}${icon.src}`);
  }
  for(const section of ['top','training',...(id === 'academy' ? ['academy', 'trainers'] : []),'space','schedule','start']) assert(home.includes(`id="${section}"`), `${id}: missing ${section}`);
  assert.equal(home.includes('id="academy"'), id === 'academy');
  assert(home.includes('gallery-dialog'));
  for (const page of [home, english]) {
   assert.equal(page.includes('id="trainers"'), id === 'academy');
   assert.equal(page.includes('href="#trainers"'), id === 'academy');
   assert(!page.includes('id="team"'));
   assert(!page.includes('href="#team"'));
   assert(!page.includes('class="trainer-card"'));
   assert(!page.includes('class="coach-dialog"'));
   assert(page.includes(`href="/icons/${id}/favicon.svg"`));
   assert(page.includes(`rel="canonical" href="https://${siteDomains[id]}/`));
   for (const discipline of ['muaythai','kickbox','mma']) assert(!page.includes(`/images/trainer-${discipline}-`));
   assert.equal(page.includes('/images/gokhan/gokhan-denizli-'), id === 'academy');
   assert.equal(page.includes('href="/gokhandenizli"') || page.includes('href="/en/gokhandenizli"'), id === 'academy');
  }
  const sitemap=await (await request('/sitemap.xml')).text();
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]),
   sitePagePaths(id).map(path=>`https://${siteDomains[id]}${path}`));
  const legacy = await request('/antrenmanlar');
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get('Location'), '/#training');
  assert.equal((await request('/api/content')).status, 200);
  const html = [home, english];
  for (const path of ['/gokhandenizli', '/en/gokhandenizli']) {
   const response = await request(path);
   assert.equal(response.status, id === 'academy' ? 200 : 404);
   if (id === 'academy') html.push(await response.text());
  }
  if (id === 'academy') {
  const [, , trainer, trainerEn] = html;
  assert(home.includes('href="/gokhandenizli"'));assert(english.includes('href="/en/gokhandenizli"'));
  for(const profile of [trainer,trainerEn]){
   for(const anchor of ['top','biography','journal'])assert(profile.includes(`id="${anchor}"`));
   assert(!profile.includes('id="coaching"'));
   assert(!profile.includes('href="#coaching"'));
   assert.equal((profile.match(/class="bento-tile(?:\s|")/g)||[]).length,18,'eighteen original bento photographs');
   assert(profile.includes('profile-lightbox'));assert(profile.includes('data-profile='));assert(!profile.includes('#team'));
  }
  assert(trainer.includes('href="/en/gokhandenizli"'));assert(trainerEn.includes('href="/gokhandenizli"'));
  assert(trainer.includes('href="/#trainers"'));assert(trainerEn.includes('href="/en#trainers"'));
  } else {
   assert(home.includes('03 / DERS PROGRAMI'));
   assert(home.includes('04 / İLETİŞİM'));
   assert(english.includes('03 / CLASS TIMETABLE'));
   assert(english.includes('04 / CONTACT'));
  }

  for(const text of html){
   assert(!/<form[\s>]/.test(text), 'enquiry form must be absent');assert.equal((text.match(/<h1[\s>]/g)||[]).length,1);
   for(const match of text.matchAll(/href="#([^"]+)"/g)) assert(text.includes(`id="${match[1]}"`), `missing anchor ${match[1]}`);
   for(const match of text.matchAll(/href="(\/[^"?#]*)"/g)){
    const path=match[1];if(path.startsWith('//'))continue;
    const exists=files.includes(root+path)||sitePagePaths(id).includes(path)||path==='/manifest.webmanifest';
    assert(exists,`missing local target ${path}`);
   }
  }
 });
}
