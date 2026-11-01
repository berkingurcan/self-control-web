import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const worker = await readFile('static/service-worker.js', 'utf8');
function harness() {
 const handlers = {}; const stores = new Map(); let online = true;
 const key = request => typeof request === 'string' ? request : new URL(request.url).pathname;
 const caches = {
  async open(name) {
   if(!stores.has(name)) stores.set(name,new Map()); const store=stores.get(name);
   return { async addAll(urls){for(const url of urls)store.set(url,new Response(`cached:${url}`))}, async match(req){return store.get(key(req))?.clone()}, async put(req,res){store.set(key(req),res)}, async keys(){return [...store.keys()]}, async delete(req){return store.delete(key(req))} };
  }, async keys(){return [...stores.keys()]}, async delete(name){return stores.delete(name)}
 };
 vm.runInNewContext(worker, {self:{location:{origin:'https://example.test'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn},caches,URL,Response,fetch:async()=>{if(!online)throw new Error('offline');return new Response('network')}});
 return {handlers,stores,offline(){online=false},async install(){let done;handlers.install({waitUntil:p=>done=p});await done},async request(path,options={}){let response;handlers.fetch({request:{method:'GET',mode:'navigate',url:`https://example.test${path}`,...options},respondWith:p=>response=p});return response?await response:undefined}};
}

test('a cached public page remains available offline',async()=>{const h=harness();await h.install();await h.request('/antrenmanlar');h.offline();assert.equal(await (await h.request('/antrenmanlar')).text(),'network')});
test('unknown pages receive the bilingual offline fallback',async()=>{const h=harness();await h.install();h.offline();assert.equal(await(await h.request('/not-visited')).text(),'cached:/offline.html')});
test('private, cross-origin, query and non-GET requests bypass caching',async()=>{const h=harness();await h.install();for(const [path,options] of [['/api/enquiry',{}],['/basla?message=private',{}],['/basla',{method:'POST'}],['/x',{url:'https://other.test/x'}]])assert.equal(await h.request(path,options),undefined)});
test('activation removes only Self Control caches',async()=>{const h=harness();await h.install();h.stores.set('self-control-old',new Map());h.stores.set('another-app',new Map());let done;h.handlers.activate({waitUntil:p=>done=p});await done;assert(!h.stores.has('self-control-old'));assert(h.stores.has('another-app'))});
