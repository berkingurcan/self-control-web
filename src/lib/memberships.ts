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
  tr: {
    type: 'Ders türü', group: 'Grup dersleri', private: 'Özel ders', people: 'Kişi sayısı', person: 'kişi', perPerson: 'kişi başı',
    individual: 'BİREBİR ODAK.', together: 'BİRLİKTE GELİŞİM.', intro: 'Kendi temponda, antrenör eşliğinde. Tek başına veya kendi küçük grubunla çalış.',
    priceNote: 'Gösterilen ücretler kişi başıdır. 2–4 kişilik seçenekler, birlikte katılacağın özel ders grubunun büyüklüğünü belirtir.',
    lessons: 'ders', lesson: 'ders başına', minute: 'dk / ders', validity: 'Kullanım süresi', month: 'ay', single: 'Tek ders',
    packages: 'Özel ders paketi', selected: 'Seçili paket', total: 'Paket toplamı / kişi', ask: 'Özel ders hakkında sor',
    note: 'Özel ders paketleri için örnek fiyatlar gösterilmektedir. Ders saatleri antrenörle birlikte belirlenir. Grup üyeliğinden ayrı bir pakettir.',
    groupNote: 'Grup paketlerinin ücretleri kişi başıdır. Bir aydan uzun paketlerde toplam peşin tutar ve aylık karşılığı gösterilir. Özel ders ve ekipman dahil değildir.',
    oneMonth: 'Kendi ritmini bul.', shortTerm: 'Düzenini kur. İlerlemeyi hisset.', longTerm: 'Disiplini yaşamının parçası yap.', year: 'Yıllık', monthly: 'Aylık', months: 'Aylık'
  },
  en: {
    type: 'Lesson type', group: 'Group classes', private: 'Private lessons', people: 'Number of participants', person: 'people', perPerson: 'per person',
    individual: 'ONE-TO-ONE FOCUS.', together: 'PROGRESS TOGETHER.', intro: 'Work at your own pace with a trainer. Train individually or with your own small group.',
    priceNote: 'All prices are per person. The 2–4 person options refer to the size of the private group attending together.',
    lessons: 'lessons', lesson: 'per lesson', minute: 'min / lesson', validity: 'Valid for', month: 'months', single: 'Single lesson',
    packages: 'Private lesson package', selected: 'Selected plan', total: 'Package total / person', ask: 'Ask about private lessons',
    note: 'Sample private lesson prices are shown. Session times are agreed with the trainer. These packages are separate from group memberships.',
    groupNote: 'Group prices are per person. Plans longer than one month show the full upfront price and monthly equivalent. Private lessons and equipment are excluded.',
    oneMonth: 'Find your own rhythm.', shortTerm: 'Build a routine. Feel the progress.', longTerm: 'Make discipline part of your life.', year: 'Annual', monthly: 'Monthly', months: 'Months'
  }
};
