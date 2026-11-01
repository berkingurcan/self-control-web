import { FRESH_MS, MAX_AGE_MS, isContentSnapshot, type ContentSnapshot, type ContentState } from './content-schema.ts';
export const CONTENT_CACHE_KEY = 'self-control-confirmed-content-v1';
type StorageLike = Pick<Storage,'getItem'|'setItem'|'removeItem'>;
function usable(data: ContentSnapshot, now: number) { const age=now-Date.parse(data.checkedAt ?? ''); return data.source==='sheets' && age>=-60_000 && age<MAX_AGE_MS; }
export async function loadContent(fetcher: typeof fetch, storage: StorageLike | null, fallback: ContentSnapshot, now = Date.now()): Promise<ContentState> {
  try {
    const response=await fetcher('/api/content',{credentials:'omit',signal:AbortSignal.timeout(12_000)});
    if(!response.ok) throw new Error('Content unavailable');
    const body=await response.json();
    if(!isContentSnapshot(body.data) || (body.data.source==='sheets' && !usable(body.data,now))) throw new Error('Invalid content');
    const data:ContentSnapshot=body.data;
    try { if(data.source==='sheets') storage?.setItem(CONTENT_CACHE_KEY,JSON.stringify(data)); else storage?.removeItem(CONTENT_CACHE_KEY); } catch { /* Storage is optional. */ }
    return {data,phase:body.stale || (data.source==='sheets' && now-Date.parse(data.checkedAt!)>FRESH_MS)?'stale':'ready'};
  } catch {
    try {
      const raw=storage?.getItem(CONTENT_CACHE_KEY);
      const data=raw && raw.length<=2_000_000?JSON.parse(raw):null;
      if(isContentSnapshot(data)&&usable(data,now)) return {data,phase:'stale'};
      storage?.removeItem(CONTENT_CACHE_KEY);
    } catch { /* Ignore invalid or unavailable browser storage. */ }
    return {data:fallback,phase:'unavailable'};
  }
}
