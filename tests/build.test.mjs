import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
const ids=['academy','muaythai','kickbox','mma'];
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())out.push(...await walk(path));else out.push(path)}return out}
for(const id of ids){
 test(`${id}: production output has localized home and trainer pages with its own PWA identity`,async()=>{
  const root=`builds/${id}/output/static`;
  const files=await walk(root); const html=files.filter(f=>f.endsWith('.html')&&!f.endsWith('/offline.html'));
  assert.equal(html.length,4); assert(!html.some(f=>f.includes('/preview/')));
  const home=await readFile(`${root}/index.html`,'utf8');const english=await readFile(`${root}/en.html`,'utf8');
  assert(home.includes('lang="tr"'));assert(english.includes('lang="en"'));
  assert(home.includes(`data-identity="${id}"`));assert(home.includes('noindex,nofollow'));
  const manifest=JSON.parse(await readFile(`${root}/manifest.webmanifest`,'utf8'));
  assert.equal(manifest.display,'standalone');assert.equal(manifest.lang,'tr');
  assert(manifest.name.includes(id==='academy'?'Fight Academy':id==='muaythai'?'Muay Thai':id==='kickbox'?'Kick Box':'MMA'));
  for(const icon of manifest.icons)await access(`${root}${icon.src}`);
  for(const section of ['top','training',...(id === 'academy' ? ['academy'] : []),'space','trainers','schedule','start']) assert(home.includes(`id="${section}"`), `${id}: missing ${section}`);
  assert.equal(home.includes('id="academy"'), id === 'academy');
  assert(home.includes('gallery-dialog')); assert(home.includes('coach-dialog'));
  const trainer=await readFile(`${root}/bas-antrenor.html`,'utf8');
  const trainerEn=await readFile(`${root}/en/head-trainer.html`,'utf8');
  assert(home.includes('href="/bas-antrenor"'));assert(english.includes('href="/en/head-trainer"'));
  for(const profile of [trainer,trainerEn]){
   for(const anchor of ['top','biography','coaching','journal'])assert(profile.includes(`id="${anchor}"`));
   assert.equal((profile.match(/class="bento-tile /g)||[]).length,6,'six bento photographs');
   assert(profile.includes('profile-lightbox'));assert(profile.includes('data-profile='));
  }
  assert(trainer.includes('href="/en/head-trainer"'));assert(trainerEn.includes('href="/bas-antrenor"'));
  assert(trainer.includes('href="/#trainers"'));assert(trainerEn.includes('href="/en#trainers"'));
  const sitemap=await readFile(`${root}/sitemap.xml`,'utf8');assert(sitemap.includes('/bas-antrenor'));assert(sitemap.includes('/en/head-trainer'));

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
