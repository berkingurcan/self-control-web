import { FRESH_MS, MAX_AGE_MS, parseSheetContent, sheetHeaders, type ContentSnapshot, type CsvSheets, type SheetName } from '../content-schema.ts';
export function spreadsheetId(value: string) {
  const url = new URL(value);
  const match = /^\/spreadsheets\/(?:u\/\d+\/)?d\/([\w-]+)(?:\/|$)/.exec(url.pathname);
  if(url.protocol!=='https:'||url.hostname!=='docs.google.com'||!match||match[1]==='e'||url.username||url.password) throw new Error('SHEETS_SPREADSHEET_URL: standart Google E-Tablolar görüntüleme bağlantısı gerekli.');
  return match[1];
}
function allowed(url: URL) { return url.protocol==='https:' && (url.hostname==='docs.google.com'||url.hostname.endsWith('.googleusercontent.com')); }
async function readCsv(url: URL, fetcher: typeof fetch, signal: AbortSignal): Promise<string> {
  for(let redirect=0;redirect<4;redirect++) {
    if(!allowed(url)) throw new Error('Google dışındaki veri adresi reddedildi.');
    const response=await fetcher(url,{redirect:'manual',signal,headers:{Accept:'text/csv'}});
    if([301,302,303,307,308].includes(response.status)) { const next=response.headers.get('location'); if(!next) throw new Error('Geçersiz yönlendirme.'); url=new URL(next,url); continue; }
    if(!response.ok||!response.body||response.headers.get('content-type')?.includes('text/html')) throw new Error(`E-Tablolar okunamadı (${response.status}). Görüntüleme iznini kontrol edin.`);
    const reader=response.body.getReader(), chunks:Uint8Array[]=[]; let size=0;
    try { while(true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>2_000_000) throw new Error('CSV yanıtı çok büyük.'); chunks.push(value); } } finally { await reader.cancel(); }
    const bytes=new Uint8Array(size); let offset=0; for(const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
    return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  }
  throw new Error('Çok fazla Google yönlendirmesi.');
}
/** Warm-instance cache is an optimization; cold-start failures return unavailable. */
export function createSheetsSource(fetcher: typeof fetch = fetch, clock:()=>number = Date.now) {
  let saved:{id:string;data:ContentSnapshot}|null=null, pending:{id:string;promise:Promise<ContentSnapshot>}|null=null;
  let failure:{id:string;retryAt:number;error:unknown}|null=null;
  return async (link:string) => {
    const id=spreadsheetId(link), now=clock();
    if(saved?.id===id && now-Date.parse(saved.data.checkedAt!)<FRESH_MS) return {data:saved.data,stale:false};
    try {
      if(failure?.id===id && now<failure.retryAt) throw failure.error;
      if(pending?.id!==id) {
        const promise=(async()=>{
          const entries=await Promise.all((Object.keys(sheetHeaders) as SheetName[]).map(async name=>{
            const url=new URL(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq`);
            url.search=new URLSearchParams({sheet:name,headers:'1',tqx:'out:csv',tq:'select * limit 1001'}).toString();
            return [name,await readCsv(url,fetcher,AbortSignal.timeout(8000))];
          }));
          const data=parseSheetContent(Object.fromEntries(entries) as CsvSheets,new Date(clock()).toISOString()); saved={id,data}; failure=null; return data;
        })();
        pending={id,promise};
      }
      const active=pending;
      try { return {data:await active.promise,stale:false}; } finally { if(pending===active) pending=null; }
    } catch(error) {
      if(failure?.id!==id || now>=failure.retryAt) failure={id,retryAt:now+60_000,error};
      if(saved?.id===id && clock()-Date.parse(saved.data.checkedAt!)<MAX_AGE_MS) return {data:saved.data,stale:true};
      throw error;
    }
  };
}
