import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initialSelection, restoreSelection, selectionQuery, selectedOffer, enquiryMessage, whatsappHref } from '../src/lib/selection.ts';
import { nextSession, mondayIndex } from '../src/lib/schedule.ts';
import { sessions } from '../src/lib/demo.ts';
const catalog = JSON.parse(await readFile(new URL('../src/lib/data/memberships.json', import.meta.url), 'utf8'));

test('language-link selection round trips and keeps private prices per person', () => {
 const selection = { ...initialSelection('kickbox'), type:'private', participants:2, lessons:16 };
 const restored = restoreSelection(new URLSearchParams(selectionQuery(selection)), 'kickbox', catalog);
 assert.deepEqual(restored, selection);
 assert.deepEqual(selectedOffer(restored,catalog),{price:22000,unitPrice:1375,quantity:16,validity:2});
 for(const lang of ['tr','en']) {
  const message=enquiryMessage(restored,lang,catalog,'Kick Box');
  assert(message.includes('Kick Box'));assert(message.includes('16'));assert(message.includes(lang==='tr'?'kişi':'person'));
  const href=whatsappHref('+90 (555) 000 00 00',message);
  assert.equal(new URL(href).searchParams.get('text'),message);
 }
 assert.equal(whatsappHref('', 'test'),null);
 assert.equal(whatsappHref('123', 'test'),null);
});

test('URL values cannot choose unavailable packages or another discipline on a team site', () => {
 const bad=new URLSearchParams('discipline=mma&plan=private&months=-3&people=99&lessons=999');
 const selection=restoreSelection(bad,'kickbox',catalog);
 assert.equal(selection.discipline,'kickbox');assert.equal(selection.months,1);assert.equal(selection.participants,1);assert.equal(selection.lessons,8);
 const academy=restoreSelection(new URLSearchParams('discipline=kickbox&months=3'),'academy',catalog);
 assert.equal(selectedOffer(academy,catalog).price,12000);
 assert.equal(selectedOffer(academy,catalog).unitPrice,4000);
});

test('next class skips past sessions, crosses Sunday, and respects discipline', () => {
 const sunday=new Date(2026,10,1,14,0);
 assert.equal(mondayIndex(sunday),6);
 const next=nextSession(sessions,sunday,'kickbox');
 assert.equal(next.session.day,0);assert.equal(next.dayOffset,1);assert.equal(next.session.discipline,'kickbox');
 const pastMonday=new Date(2026,10,2,22,0);
 assert.equal(nextSession(sessions,pastMonday,'kickbox').session.day,1);
 const mma=nextSession(sessions,new Date(2026,10,6,19,0),'mma');
 assert.equal(mma.session.level,'advanced');
 assert.equal(mma.session.day,4);
 assert.equal(nextSession([],sunday,'academy'),null);
});
