import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseCsv,parseSheetContent,privateGroups,isContentSnapshot,FRESH_MS,MAX_AGE_MS} from '../src/lib/content-schema.ts';
import {createSheetsSource,spreadsheetId} from '../src/lib/server/sheets-source.ts';
import {loadContent,CONTENT_CACHE_KEY} from '../src/lib/content-client.ts';
import {initialSelection,selectedOffer,restoreSelection,enquiryMessage} from '../src/lib/selection.ts';
import {zonedClock,mondayIndex} from '../src/lib/schedule.ts';
const csv=JSON.parse(await readFile(new URL('fixtures/sheets.json',import.meta.url),'utf8'));
const stamp=Date.parse('2026-11-01T12:00:00Z');
const snapshot=()=>parseSheetContent(csv,new Date(stamp).toISOString());
const encode=rows=>rows.map(row=>row.map(value=>`"${String(value??'').replaceAll('"','""')}"`).join(',')).join('\r\n');
function edit(name,fn){const copy={...csv};const rows=parseCsv(copy[name]);fn(rows);copy[name]=encode(rows);return copy;}
const link='https://docs.google.com/spreadsheets/d/public-test-id/edit#gid=0';
function store(){const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};}

test('Turkish template matches the content model, prices remain per person',()=>{
 const data=snapshot();assert(isContentSnapshot(data));assert.equal(data.sessions.length,18);assert.equal(data.catalog.groupLessons.kickbox[1].price,12000);
 for(const id of ['academy','muaythai','kickbox','mma'])assert.equal(privateGroups(data.catalog,id).length,4);
 const selection={...initialSelection('kickbox'),type:'private',participants:2,lessons:16};
 assert.equal(selectedOffer(selection,data.catalog).price,22000);assert.equal(selectedOffer(selection,data.catalog).unitPrice,1375);
 assert(enquiryMessage(selection,'tr',data.catalog,'Kick Box').includes('₺22.000 / kişi'));
});
test('CSV parses quoted commas, escaped quotes, CRLF and newlines; rejects malformed CSV',()=>{
 assert.deepEqual(parseCsv('\uFEFFA,B\r\n"a,b","a""b\nc"\r\n'),[['A','B'],['a,b','a"b\nc']]);
 assert.throws(()=>parseCsv('A\n"unclosed'));
 const modified=edit('Program',rows=>{rows[1][5]='Teknik, denge\nve "kontrol"';rows[1][6]='';});
 assert.equal(parseSheetContent(modified).sessions[0].title.en,'Teknik, denge\nve "kontrol"');
});
test('changed headers, duplicate IDs, invalid days, invalid prices and inconsistent groups are rejected',()=>{
 for(const broken of [edit('Program',r=>r[0][2]='Tarih'),edit('Program',r=>r[2][0]=r[1][0]),edit('Program',r=>r[1][2]='Yarın'),edit('Program',r=>r[1][3]='24:00'),edit('Grup Paketleri',r=>r[1][3]='bedava'),edit('Özel Dersler',r=>r[2][4]='90')])assert.throws(()=>parseSheetContent(broken));
});
test('inactive draft rows are skipped; empty offerings are intentional, not demo fallback',()=>{
 const changed=edit('Grup Paketleri',rows=>rows.slice(1).forEach(row=>{if(row[1]==='Kick Box'){row[4]='Hayır';row[3]='draft';}}));
 const data=parseSheetContent(changed);assert.equal(data.catalog.groupLessons.kickbox.length,0);assert.equal(selectedOffer(initialSelection('kickbox'),data.catalog),null);
 const empty=edit('Özel Dersler',rows=>rows.slice(1).forEach(row=>row[7]='Hayır'));
 assert.equal(privateGroups(parseSheetContent(empty).catalog,'mma').length,0);
});
test('Turkish and English numeric formats parse; branch-specific private prices stay isolated',()=>{
 const changed=edit('Özel Dersler',rows=>{rows.find(row=>row[0]==='OZEL-kickbox-2-16')[6]='22.500,50';});
 const data=parseSheetContent(changed);assert.equal(privateGroups(data.catalog,'kickbox')[1].packages[1].price,22500.5);assert.equal(privateGroups(data.catalog,'mma')[1].packages[1].price,22000);
 const other=edit('Grup Paketleri',rows=>rows[1][3]='4,500.25');assert.equal(parseSheetContent(other).catalog.groupLessons.academy[0].price,4500.25);
});
test('selection normalizes unavailable group durations and arbitrary lesson counts',()=>{
 const changed=edit('Özel Dersler',rows=>{for(const row of rows.slice(1)){if(row[0]==='OZEL-kickbox-1-1')row[3]='4';else if(row[1]==='Kick Box')row[7]='Hayır';}});
 const data=parseSheetContent(changed), selection=restoreSelection(new URLSearchParams('plan=private&people=4&lessons=24'),'kickbox',data.catalog);
 assert.equal(selection.participants,1);assert.equal(selection.lessons,4);assert.equal(selectedOffer(selection,data.catalog).price,3000);
});
test('server batches four tabs, shares concurrent fetches and reuses its fresh cache',async()=>{
 let calls=0,now=stamp;
 const source=createSheetsSource(async url=>{calls++;assert.equal(url.hostname,'docs.google.com');assert.equal(url.searchParams.get('headers'),'1');return new Response(csv[url.searchParams.get('sheet')],{headers:{'Content-Type':'text/csv'}});},()=>now);
 const [one,two]=await Promise.all([source(link),source(link)]);assert.equal(calls,4);assert.deepEqual(one,two);
 now+=FRESH_MS-1;await source(link);assert.equal(calls,4);
});
test('failed refresh uses bounded last good data and cold starts never invent live data',async()=>{
 let now=stamp,fail=false,calls=0;
 const fetcher=async url=>{calls++;if(fail)throw new Error('Google unavailable');return new Response(csv[url.searchParams.get('sheet')]);};
 const source=createSheetsSource(fetcher,()=>now);await source(link);fail=true;now+=FRESH_MS+1;
 assert.equal((await source(link)).stale,true);const attempts=calls;await source(link);assert.equal(calls,attempts,'back off failed requests');
 now+=MAX_AGE_MS;await assert.rejects(source(link));await assert.rejects(createSheetsSource(fetcher,()=>now)(link));
});
test('upstream redirects and spreadsheet configuration are restricted to Google',async()=>{
 for(const bad of ['http://docs.google.com/spreadsheets/d/id/edit','https://evil.test/spreadsheets/d/id','https://docs.google.com/spreadsheets/d/e/published/pubhtml'])assert.throws(()=>spreadsheetId(bad));
 let calls=0;const source=createSheetsSource(async()=>{calls++;return new Response(null,{status:302,headers:{location:'http://127.0.0.1/private'}});});await assert.rejects(source(link));assert.equal(calls,4);
});
test('client persists only validated live snapshots; offline uses bounded data with stale status',async()=>{
 const storage=store(),data=snapshot(),fallback={...data,source:'demo',checkedAt:null};
 let result=await loadContent(async()=>Response.json({data,stale:false}),storage,fallback,stamp);assert.equal(result.phase,'ready');assert(storage.getItem(CONTENT_CACHE_KEY));
 result=await loadContent(async()=>{throw new Error('offline');},storage,fallback,stamp+FRESH_MS+1);assert.equal(result.phase,'stale');assert.equal(result.data.checkedAt,data.checkedAt);
 result=await loadContent(async()=>{throw new Error('offline');},storage,fallback,stamp+MAX_AGE_MS+1);assert.equal(result.phase,'unavailable');assert.equal(storage.getItem(CONTENT_CACHE_KEY),null);
 await loadContent(async()=>Response.json({data,stale:false}),storage,fallback,stamp);
 await loadContent(async()=>Response.json({data:fallback,stale:false}),storage,fallback,stamp);assert.equal(storage.getItem(CONTENT_CACHE_KEY),null);
});
test('invalid browser snapshots and denied storage do not crash the page',async()=>{
 const fallback=snapshot(),storage=store();storage.setItem(CONTENT_CACHE_KEY,'{"bad":true}');
 assert.equal((await loadContent(async()=>new Response('',{status:503}),storage,fallback,stamp)).phase,'unavailable');
 const denied={getItem(){throw new Error('denied');},setItem(){throw new Error('denied');},removeItem(){throw new Error('denied');}};
 assert.equal((await loadContent(async()=>Response.json({data:fallback,stale:false}),denied,fallback,stamp)).phase,'ready');
 assert.equal(isContentSnapshot({...fallback,catalog:{}}),false);
});
test('current training day follows the gym timezone rather than the visitor timezone',()=>{
 const clock=zonedClock(new Date('2026-11-01T22:30:00Z'),'Europe/Istanbul');assert.equal(mondayIndex(clock),0);assert.equal(clock.hour,1);assert.equal(clock.minute,30);
});
