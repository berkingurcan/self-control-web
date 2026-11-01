import data from './data/memberships.json';
import type { SiteId } from './site.ts';

export type GroupPackage = { months: number; price: number };
export type PrivatePackage = { lessons: number; price: number; validityMonths: number | null };
export type PrivateLessonGroup = { participants: number; sessionMinutes: number; packages: PrivatePackage[] };
export type MembershipCatalog = {
  currency: string;
  priceBasis: 'per_person';
  status: 'sample' | 'published';
  groupLessons: Record<SiteId, GroupPackage[]>;
  privateLessons: PrivateLessonGroup[];
  privateLessonsBySite?: Record<SiteId, PrivateLessonGroup[]>;
};
export const membershipCatalog: MembershipCatalog = data as MembershipCatalog;

export const membershipCopy = {
  "tr": {
    "type": "Ders türü",
    "group": "Grup dersleri",
    "private": "Özel dersler",
    "people": "Katılımcı sayısı",
    "person": "kişi",
    "perPerson": "kişi başı",
    "individual": "BİREBİR\nÖZEL DERS",
    "together": "KÜÇÜK GRUP\nÖZEL DERS",
    "intro": "Bir kişi için birebir dersleri, 2–4 kişi için birlikte katılabileceğiniz özel ders seçeneklerini inceleyin.",
    "priceNote": "Tüm ücretler kişi başıdır. Katılımcı sayısı, aynı derse birlikte katılacak özel grubun büyüklüğünü belirtir.",
    "lessons": "ders",
    "lesson": "ders başına",
    "minute": "dk / ders",
    "validity": "Geçerlilik süresi",
    "month": "ay",
    "single": "Tek ders",
    "packages": "Özel ders paketi",
    "selected": "Seçili paket",
    "total": "Kişi başı paket ücreti",
    "ask": "Özel ders bilgisi alın",
    "note": "Gösterilen özel ders paketleri ve ücretleri örnektir. Ders saatleri antrenörle belirlenir. Özel dersler grup üyeliğine dahil değildir.",
    "groupNote": "Ücretler kişi başıdır. Bir aydan uzun paketlerde toplam peşin ücret ve aylık karşılığı gösterilir. Özel dersler ve ekipman dahil değildir.",
    "oneMonth": "1 aylık grup dersi paketi.",
    "shortTerm": "Birden fazla ayı kapsayan grup dersi paketi.",
    "longTerm": "12 aylık grup dersi paketi.",
    "year": "12 aylık",
    "monthly": "1 aylık",
    "months": "aylık",
    "marker": "ÖZEL DERSLER"
  },
  "en": {
    "type": "Class type",
    "group": "Group classes",
    "private": "Private lessons",
    "people": "Number of participants",
    "person": "people",
    "perPerson": "per person",
    "individual": "ONE-TO-ONE\nLESSONS",
    "together": "SMALL-GROUP\nPRIVATE LESSONS",
    "intro": "Choose one-to-one lessons or private sessions for a group of 2–4 people attending together.",
    "priceNote": "All prices are per person. The participant count is the size of the private group attending the same session.",
    "lessons": "lessons",
    "lesson": "per lesson",
    "minute": "min / lesson",
    "validity": "Validity",
    "month": "months",
    "single": "Single lesson",
    "packages": "Private lesson package",
    "selected": "Selected package",
    "total": "Package price per person",
    "ask": "Ask about private lessons",
    "note": "Private lesson packages and prices shown here are examples. Session times are arranged with the coach. Private lessons are separate from group memberships.",
    "groupNote": "Prices are per person. Packages longer than one month show the total upfront price and monthly equivalent. Private lessons and equipment are not included.",
    "oneMonth": "A one-month group class package.",
    "shortTerm": "A group class package covering several months.",
    "longTerm": "A 12-month group class package.",
    "year": "12 months",
    "monthly": "1 month",
    "months": "months",
    "marker": "PRIVATE LESSONS"
  }
};
