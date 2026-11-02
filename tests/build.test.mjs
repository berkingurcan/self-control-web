import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
const ids=['academy','muaythai','kickbox','mma'];
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())out.push(...await walk(path));else out.push(path)}return out}
for(const id of ids){
 test(`${id}: production output shows a head coach only on academy and retains its own PWA identity`,async()=>{
  const root=`builds/${id}/cloudflare`;
  const files=await walk(root); const html=files.filter(f=>f.endsWith('.html')&&!f.endsWith('/offline.html')&&!f.endsWith('/404.html'));
  await access(`${root}/_worker.js`);
  await access(`builds/${id}/cloudflare-tmp/server.js`);
  await access(`builds/${id}/output/server/index.js`);
  const server=await readFile(`builds/${id}/cloudflare-tmp/server.js`,'utf8');
  assert(server.includes('id: "/api/content"'));
  assert(server.includes('id: "/[...path]"'), 'legacy redirects must stay reachable on the Worker');
  const ignoredAssets=await readFile(`${root}/.assetsignore`,'utf8');
  for (const file of ['_worker.js','_routes.json','_headers','_redirects']) assert(ignoredAssets.split('\n').includes(file));
  const headers=await readFile(`${root}/_headers`,'utf8');
  assert(headers.includes("frame-ancestors 'none'"));
  assert(headers.includes('/service-worker.js\n  Cache-Control: no-cache'));
  assert.equal(html.length,id === 'academy' ? 4 : 2); assert(!html.some(f=>f.includes('/preview/')));
  const home=await readFile(`${root}/index.html`,'utf8');const english=await readFile(`${root}/en.html`,'utf8');
  assert(home.includes('lang="tr"'));assert(english.includes('lang="en"'));
  assert(home.includes(`data-identity="${id}"`));assert(home.includes('noindex,nofollow'));
  const manifest=JSON.parse(await readFile(`${root}/manifest.webmanifest`,'utf8'));
  assert.equal(manifest.display,'standalone');assert.equal(manifest.lang,'tr');
  assert(manifest.name.includes(id==='academy'?'Fight Academy':id==='muaythai'?'Muay Thai':id==='kickbox'?'Kick Boks':'MMA'));
  for(const icon of manifest.icons)await access(`${root}${icon.src}`);
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
   for (const discipline of ['muaythai','kickbox','mma']) assert(!page.includes(`/images/trainer-${discipline}-`));
   assert.equal(page.includes('/images/trainer-head-'), id === 'academy');
   assert.equal(page.includes('href="/bas-antrenor"') || page.includes('href="/en/head-trainer"'), id === 'academy');
  }
  const sitemap=await readFile(`${root}/sitemap.xml`,'utf8');
  const worker=await readFile(`${root}/service-worker.js`,'utf8');
  for (const path of ['/bas-antrenor', '/en/head-trainer']) {
   assert.equal(sitemap.includes(path), id === 'academy');
   assert.equal(worker.includes(`"${path}"`), id === 'academy');
  }
  if (id === 'academy') {
  const trainer=await readFile(`${root}/bas-antrenor.html`,'utf8');
  const trainerEn=await readFile(`${root}/en/head-trainer.html`,'utf8');
  assert(home.includes('href="/bas-antrenor"'));assert(english.includes('href="/en/head-trainer"'));
  for(const profile of [trainer,trainerEn]){
   for(const anchor of ['top','biography','coaching','journal'])assert(profile.includes(`id="${anchor}"`));
   assert.equal((profile.match(/class="bento-tile /g)||[]).length,6,'six bento photographs');
   assert(profile.includes('profile-lightbox'));assert(profile.includes('data-profile='));assert(!profile.includes('#team'));
  }
  assert(trainer.includes('href="/en/head-trainer"'));assert(trainerEn.includes('href="/bas-antrenor"'));
  assert(trainer.includes('href="/#trainers"'));assert(trainerEn.includes('href="/en#trainers"'));
  } else {
   assert(!files.includes(`${root}/bas-antrenor.html`));
   assert(!files.includes(`${root}/en/head-trainer.html`));
   assert(home.includes('03 / DERS PROGRAMI'));
   assert(home.includes('04 / İLETİŞİM'));
   assert(english.includes('03 / CLASS TIMETABLE'));
   assert(english.includes('04 / CONTACT'));
  }

  for(const file of html){
   const text=await readFile(file,'utf8');assert(!/<form[\s>]/.test(text), `${file}: enquiry form must be absent`);assert.equal((text.match(/<h1[\s>]/g)||[]).length,1,file);
   for(const match of text.matchAll(/href="#([^"]+)"/g)) assert(text.includes(`id="${match[1]}"`), `${file}: missing anchor ${match[1]}`);
   for(const match of text.matchAll(/href="(\/[^"?#]*)"/g)){
    const path=match[1];if(path.startsWith('//'))continue;
    const target=path==='/'?'index.html':path.slice(1);
    const exists=files.includes(`${root}/${target}`)||files.includes(`${root}/${target}.html`);
    assert(exists,`${file}: missing local target ${path}`);
   }
  }
 });
}
