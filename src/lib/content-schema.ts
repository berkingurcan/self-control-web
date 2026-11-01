import type { Session } from './demo.ts';
import type { MembershipCatalog, PrivateLessonGroup } from './memberships.ts';
import type { SiteId } from './site.ts';
export const contentKey = Symbol('academy-content');
export const FRESH_MS = 5 * 60_000;
export const MAX_AGE_MS = 60 * 60_000;
export type ContentSnapshot = { schemaVersion: 1; source: 'demo' | 'sheets'; checkedAt: string | null; timezone: string; catalog: MembershipCatalog; sessions: Session[] };
export type ContentState = { data: ContentSnapshot; phase: 'loading' | 'ready' | 'stale' | 'unavailable' };
export const siteIds: SiteId[] = ['academy','muaythai','kickbox','mma'];
export const sheetHeaders = {
  'Ayarlar': ['Ayar', 'Değer'],
  'Program': ['Ders kodu', 'Branş', 'Gün', 'Başlangıç saati', 'Süre (dk)', 'Ders adı', 'İngilizce ders adı', 'Seviye', 'Aktif'],
  'Grup Paketleri': ['Paket kodu', 'Kapsam', 'Süre (ay)', 'Paket ücreti (TL)', 'Aktif'],
  'Özel Dersler': ['Paket kodu', 'Kapsam', 'Kişi sayısı', 'Ders sayısı', 'Ders süresi (dk)', 'Kullanım süresi (ay)', 'Kişi başı paket ücreti (TL)', 'Aktif']
} as const;
export type SheetName = keyof typeof sheetHeaders;
export type CsvSheets = Record<SheetName, string>;
export function privateGroups(catalog: MembershipCatalog, site: SiteId): PrivateLessonGroup[] { return catalog.privateLessonsBySite?.[site] ?? catalog.privateLessons; }
const normal = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('tr-TR');
function fail(message: string): never { throw new Error(message); }
/** RFC 4180 quoting, escaped quotes, CRLF and quoted newlines; no split(','). */
export function parseCsv(text: string): string[][] {
  if (text.length > 2_000_000 || /^\s*</.test(text)) fail('CSV yanıtı geçersiz veya çok büyük.');
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) { if (ch === '"') { if (text[i+1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } } else cell += ch; continue; }
    if (ch === '"' && cell === '' && !closed) { quoted = true; continue; }
    if (ch === ',' || ch === '\n' || ch === '\r') {
      row.push(cell); cell = ''; closed = false;
      if (ch !== ',') { rows.push(row); row = []; if (ch === '\r' && text[i+1] === '\n') i++; }
    } else { if (closed && ch.trim()) fail('CSV tırnak biçimi geçersiz.'); if (!closed) cell += ch; }
  }
  if (quoted) fail('CSV içinde kapatılmamış tırnak var.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  if (rows.length > 1001) fail('Bir sekmede en fazla 1000 veri satırı kullanılabilir.');
  return rows;
}
function table(name: SheetName, text: string) {
  const [header, ...rows] = parseCsv(text);
  if (!header) fail(`${name}: başlık satırı eksik.`);
  const names = header.map(normal);
  if (new Set(names).size !== names.length) fail(`${name}: yinelenen sütun başlığı.`);
  for (const label of sheetHeaders[name]) if (!names.includes(normal(label))) fail(`${name}: ${label} sütunu eksik.`);
  const ids = new Set<string>();
  return rows.filter(row => row.some(value => value.trim())).map((row, index) => {
    const get = (key: string) => (row[names.indexOf(normal(key))] ?? '').trim();
    const text = (key: string, required = true) => { const value = get(key); if ((required && !value) || value.length > 200) fail(`${name}, satır ${index+2}: ${key} geçersiz.`); return value; };
    const number = (key: string, min: number, max: number, optional = false) => {
      let value = get(key).replace(/[₺\s]/g,'');
      if (!value && optional) return null;
      if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(value)) value = value.replaceAll('.','').replace(',','.');
      else if (/^\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(value)) value = value.replaceAll(',','');
      else if (/^\d+(,\d{1,2})?$/.test(value)) value = value.replace(',','.');
      if (!/^\d+(\.\d{1,2})?$/.test(value)) fail(`${name}, satır ${index+2}: ${key} sayı olmalı.`);
      const num = Number(value);
      if (!Number.isFinite(num) || num < min || num > max || (key !== 'Paket ücreti (TL)' && key !== 'Kişi başı paket ücreti (TL)' && !Number.isInteger(num))) fail(`${name}, satır ${index+2}: ${key} izin verilen aralıkta değil.`);
      return num;
    };
    const active = () => { const value = normal(get('Aktif')); if (['','hayır','false','yanlış'].includes(value)) return false; if (['evet','true','doğru'].includes(value)) return true; return fail(`${name}, satır ${index+2}: Aktif alanı Evet veya Hayır olmalı.`); };
    const id = (key: string) => { const value = text(key); if (ids.has(value)) fail(`${name}: ${value} kodu yineleniyor.`); ids.add(value); return value; };
    return { get, text, number, active, id };
  });
}
const scopes: Record<string, SiteId> = { 'akademi':'academy', 'muay thai':'muaythai', 'kick box':'kickbox', 'mma':'mma' };
function scope(value: string): SiteId { const key = normal(value); if (!Object.hasOwn(scopes,key)) fail('Kapsam veya branş geçersiz.'); return scopes[key]; }
const days = ['pazartesi','salı','çarşamba','perşembe','cuma','cumartesi','pazar'];
const levels = { 'başlangıç':'beginner', 'tüm seviyeler':'all', 'ileri seviye':'advanced' } as const;
export function parseSheetContent(csv: CsvSheets, checkedAt = new Date().toISOString()): ContentSnapshot {
  const settings = new Map<string,string>();
  for (const row of table('Ayarlar', csv.Ayarlar)) { const key = normal(row.text('Ayar')); if (settings.has(key)) fail('Ayarlar: yinelenen ayar.'); settings.set(key, row.text('Değer')); }
  if (settings.get('şema sürümü') !== 'v1') fail('Ayarlar: Şema sürümü v1 olmalı.');
  const status = normal(settings.get('veri durumu') ?? '');
  if (!['örnek','yayında'].includes(status)) fail('Ayarlar: Veri durumu Örnek veya Yayında olmalı.');
  const timezone = settings.get('saat dilimi') ?? '';
  try { new Intl.DateTimeFormat('tr', {timeZone:timezone}).format(); } catch { fail('Ayarlar: Saat dilimi geçersiz.'); }
  const sessions: Session[] = [];
  for (const row of table('Program',csv.Program)) {
    if (!row.active()) continue;
    row.id('Ders kodu'); const discipline = scope(row.text('Branş'));
    if (!discipline || discipline === 'academy') fail('Program: Branş Muay Thai, Kick Box veya MMA olmalı.');
    const day = days.indexOf(normal(row.text('Gün'))); if (day < 0) fail('Program: Gün geçersiz.');
    const rawTime = row.text('Başlangıç saati');
    const match = /^(\d{1,2}):(\d{2})(?::00(?:\.000)?)?$/.exec(rawTime);
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) fail('Program: Başlangıç saati 18:00 biçiminde olmalı.');
    const duration = row.number('Süre (dk)',1,240)!;
    if (Number(match[1])*60 + Number(match[2]) + duration > 1440) fail('Program: Ders aynı gün içinde bitmeli.');
    const levelKey = normal(row.text('Seviye')) as keyof typeof levels; const level = Object.hasOwn(levels,levelKey) ? levels[levelKey] : null; if (!level) fail('Program: Seviye geçersiz.');
    const tr = row.text('Ders adı'); const en = row.text('İngilizce ders adı', false) || tr;
    sessions.push({day,discipline,time:`${match[1].padStart(2,'0')}:${match[2]}`,duration,title:{tr,en},level});
  }
  const groupLessons: MembershipCatalog['groupLessons'] = {academy:[],muaythai:[],kickbox:[],mma:[]};
  for (const row of table('Grup Paketleri',csv['Grup Paketleri'])) {
    if (!row.active()) continue;
    row.id('Paket kodu'); const site = scope(row.text('Kapsam')); if (!site) fail('Grup Paketleri: Kapsam geçersiz.');
    const months = row.number('Süre (ay)',1,60)!;
    if (groupLessons[site].some(plan=>plan.months===months)) fail('Grup Paketleri: aynı kapsam ve süre yineleniyor.');
    groupLessons[site].push({months,price:row.number('Paket ücreti (TL)',1,100_000_000)!});
  }
  const privateLessonsBySite: Record<SiteId,PrivateLessonGroup[]> = {academy:[],muaythai:[],kickbox:[],mma:[]};
  for (const row of table('Özel Dersler',csv['Özel Dersler'])) {
    if (!row.active()) continue;
    row.id('Paket kodu'); const site = scope(row.text('Kapsam')); if (!site) fail('Özel Dersler: Kapsam geçersiz.');
    const participants = row.number('Kişi sayısı',1,4)!, sessionMinutes = row.number('Ders süresi (dk)',1,240)!, lessons = row.number('Ders sayısı',1,200)!;
    let group = privateLessonsBySite[site].find(group=>group.participants===participants);
    if (!group) { group = {participants,sessionMinutes,packages:[]}; privateLessonsBySite[site].push(group); }
    if (group.sessionMinutes !== sessionMinutes || group.packages.some(pack=>pack.lessons===lessons)) fail('Özel Dersler: aynı kişi grubunda ders süresi tutarsız veya ders sayısı yineleniyor.');
    group.packages.push({lessons,price:row.number('Kişi başı paket ücreti (TL)',1,100_000_000)!,validityMonths:row.number('Kullanım süresi (ay)',1,60,true)});
  }
  for (const id of siteIds) { groupLessons[id].sort((a,b)=>a.months-b.months); privateLessonsBySite[id].sort((a,b)=>a.participants-b.participants).forEach(group=>group.packages.sort((a,b)=>a.lessons-b.lessons)); }
  return {schemaVersion:1,source:'sheets',checkedAt,timezone,sessions:sessions.sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time)),catalog:{currency:'TRY',priceBasis:'per_person',status:status==='örnek'?'sample':'published',groupLessons,privateLessons:[],privateLessonsBySite}};
}
/** Validate cached JSON as well as endpoint responses; do not trust browser storage. */
export function isContentSnapshot(input: unknown): input is ContentSnapshot {
  try {
    const d = input as ContentSnapshot;
    if (d.schemaVersion!==1 || !['demo','sheets'].includes(d.source) || !['sample','published'].includes(d.catalog.status) || d.catalog.currency!=='TRY' || d.catalog.priceBasis!=='per_person') return false;
    if (d.source==='sheets' && (!d.checkedAt || !Number.isFinite(Date.parse(d.checkedAt)))) return false;
    new Intl.DateTimeFormat('en',{timeZone:d.timezone}).format();
    const num = (n:number,min:number,max:number) => typeof n==='number' && Number.isFinite(n) && n>=min && n<=max;
    for(const id of siteIds) {
      if (!Array.isArray(d.catalog.groupLessons[id]) || !Array.isArray(privateGroups(d.catalog,id))) return false;
      for(const p of d.catalog.groupLessons[id]) if (!num(p.months,1,60)||!Number.isInteger(p.months)||!num(p.price,1,100_000_000)) return false;
      for(const g of privateGroups(d.catalog,id)) { if(!num(g.participants,1,4)||!Number.isInteger(g.participants)||!num(g.sessionMinutes,1,240)||!Array.isArray(g.packages)||!g.packages.length) return false; for(const p of g.packages) if(!num(p.lessons,1,200)||!Number.isInteger(p.lessons)||!num(p.price,1,100_000_000)||(p.validityMonths!==null&&!num(p.validityMonths,1,60))) return false; }
    }
    return Array.isArray(d.sessions)&&d.sessions.length<=1000&&d.sessions.every(s=>num(s.day,0,6)&&Number.isInteger(s.day)&&siteIds.slice(1).includes(s.discipline)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time)&&num(s.duration,1,240)&&['beginner','all','advanced'].includes(s.level)&&['tr','en'].every(l=>typeof s.title[l as 'tr'|'en']==='string'&&s.title[l as 'tr'|'en'].length<=200));
  } catch { return false; }
}
