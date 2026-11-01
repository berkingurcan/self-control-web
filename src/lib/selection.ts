import { privateGroups } from './content-schema.ts';
import type { Lang, SiteId } from './site.ts';
import type { MembershipCatalog } from './memberships.ts';

export type Selection = { discipline: SiteId; type: 'group' | 'private'; months: number; participants: number; lessons: number };
export const experienceKey = Symbol('membership-experience');
export type Experience = { selection: Selection; inMembership: boolean; enquiryOpen: boolean; explicit: boolean };
export function initialSelection(site: SiteId): Selection { return { discipline: site, type: 'group', months: 1, participants: 1, lessons: 8 }; }
export function restoreSelection(params: URLSearchParams, site: SiteId, catalog: MembershipCatalog): Selection {
  const selection = initialSelection(site);
  const discipline = params.get('discipline') as SiteId;
  if (site === 'academy' && Object.hasOwn(catalog.groupLessons, discipline)) selection.discipline = discipline;
  if (params.get('plan') === 'private') selection.type = 'private';
  const months = Number(params.get('months'));
  if (catalog.groupLessons[selection.discipline].some(plan => plan.months === months)) selection.months = months;
  const groups = privateGroups(catalog, selection.discipline);
  const group = groups.find(group => group.participants === Number(params.get('people'))) ?? groups[0];
  const plans = catalog.groupLessons[selection.discipline];
  if (!plans.some(plan => plan.months === selection.months) && plans[0]) selection.months = plans[0].months;
  if (group) selection.participants = group.participants;
  const packages = group?.packages ?? [];
  const lessons = Number(params.get('lessons'));
  if (packages.some(pack => pack.lessons === lessons)) selection.lessons = lessons;
  else if (!packages.some(pack => pack.lessons === selection.lessons) && packages[0]) selection.lessons = packages[0].lessons;
  return selection;
}
export function selectionQuery(selection: Selection) {
  return new URLSearchParams({ discipline: selection.discipline, plan: selection.type, months: String(selection.months), people: String(selection.participants), lessons: String(selection.lessons) }).toString();
}
export function selectedOffer(selection: Selection, catalog: MembershipCatalog) {
  const groups = privateGroups(catalog, selection.discipline);
  const group = groups.find(group => group.participants === selection.participants) ?? groups[0];
  const pack = group?.packages.find(pack => pack.lessons === selection.lessons) ?? group?.packages[0];
  const plan = catalog.groupLessons[selection.discipline].find(plan => plan.months === selection.months) ?? catalog.groupLessons[selection.discipline][0];
  if (selection.type === 'private' ? !pack : !plan) return null;
  return selection.type === 'private' ? { price: pack!.price, unitPrice: pack!.price / pack!.lessons, quantity: pack!.lessons, validity: pack!.validityMonths } : { price: plan.price, unitPrice: plan.price / plan.months, quantity: plan.months, validity: plan.months };
}
export function formatMoney(amount: number, lang: Lang, currency: string, decimals = 0) {
  return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: decimals, minimumFractionDigits: 0 }).format(amount);
}
export function packageLabel(selection: Selection, lang: Lang, catalog: MembershipCatalog) {
  const offer = selectedOffer(selection, catalog);
  if (!offer) return lang === 'tr' ? 'Paket bilgisi güncelleniyor' : 'Plan information is being updated';
  if (selection.type === 'group') return lang === 'tr' ? `${offer.quantity} ay · Grup dersleri` : `${offer.quantity} ${offer.quantity === 1 ? 'month' : 'months'} · Group classes`;
  return lang === 'tr' ? `${selection.participants} kişi · ${offer.quantity} özel ders` : `${selection.participants} ${selection.participants === 1 ? 'person' : 'people'} · ${offer.quantity} private ${offer.quantity === 1 ? 'lesson' : 'lessons'}`;
}
export function enquiryMessage(selection: Selection, lang: Lang, catalog: MembershipCatalog, name: string) {
  const offer = selectedOffer(selection, catalog);
  if (!offer) return '';
  const price = formatMoney(offer.price, lang, catalog.currency);
  return lang === 'tr'
    ? `Merhaba, ${name} dersleri hakkında bilgi almak istiyorum.\nPaket: ${packageLabel(selection, lang, catalog)}\nKişi başı paket ücreti: ${price}\n${catalog.status === 'sample' ? 'Sitede örnek olarak gösterilen paketi inceliyorum. ' : ''}Güncel ücreti, ders saatlerini ve kayıt koşullarını paylaşabilir misiniz?`
    : `Hello, I would like information about ${name} classes.\nPlan: ${packageLabel(selection, lang, catalog)}\nPackage price per person: ${price}\n${catalog.status === 'sample' ? 'I am viewing a sample package on your website. ' : ''}Could you confirm the current price, class times and registration requirements?`;
}
export function whatsappHref(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}
