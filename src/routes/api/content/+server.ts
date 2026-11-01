import { json } from '@sveltejs/kit';
import { SHEETS_SPREADSHEET_URL } from '$app/env/private';
import { createSheetsSource } from '#lib/server/sheets-source.ts';
import { demoContent } from '#lib/content.ts';
import { FRESH_MS } from '#lib/content-schema.ts';
export const prerender = false;
const readSheets = createSheetsSource();
export async function GET() {
  try {
    const result = SHEETS_SPREADSHEET_URL ? await readSheets(SHEETS_SPREADSHEET_URL) : {data:demoContent,stale:false};
    const age = result.data.checkedAt ? Date.now()-Date.parse(result.data.checkedAt) : 0;
    const ttl=Math.max(0,Math.floor((FRESH_MS-age)/1000));
    return json(result,{headers:{'Cache-Control':result.stale?'no-store':`public, max-age=0, s-maxage=${ttl}`,'X-Content-Type-Options':'nosniff'}});
  } catch(error) {
    console.error('Sheets content update failed:',error instanceof Error?error.message:'Unknown error');
    return json({error:'CONTENT_UNAVAILABLE'},{status:503,headers:{'Cache-Control':'no-store','Retry-After':'60'}});
  }
}
