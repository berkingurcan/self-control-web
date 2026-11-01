import type { Lang, SiteId } from './site.ts';

export type DisciplineId = Exclude<SiteId, 'academy'>;
export const disciplines: DisciplineId[] = ['muaythai', 'kickbox', 'mma'];
export type Session = { day: number; time: string; duration: number; discipline: DisciplineId; title: Record<Lang, string>; level: 'beginner' | 'all' | 'advanced' };
export const sessions: Session[] = [
  { day: 0, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 0, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Kombinasyon & ayak oyunu', en: 'Combinations & footwork' }, level: 'all' },
  { day: 0, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Striking & mesafe', en: 'Striking & distance' }, level: 'all' },
  { day: 1, time: '07:30', duration: 60, discipline: 'kickbox', title: { tr: 'Sabah kondisyonu', en: 'Morning conditioning' }, level: 'all' },
  { day: 1, time: '18:30', duration: 75, discipline: 'muaythai', title: { tr: 'Pad & ritim', en: 'Pads & rhythm' }, level: 'all' },
  { day: 1, time: '20:00', duration: 75, discipline: 'mma', title: { tr: 'Güreş & yere alma', en: 'Wrestling & takedowns' }, level: 'all' },
  { day: 2, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Clinch & denge', en: 'Clinch & balance' }, level: 'all' },
  { day: 2, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 2, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Yer oyunu & kontrol', en: 'Ground game & control' }, level: 'all' },
  { day: 3, time: '07:30', duration: 60, discipline: 'kickbox', title: { tr: 'Torba & kondisyon', en: 'Bag work & conditioning' }, level: 'all' },
  { day: 3, time: '18:30', duration: 75, discipline: 'muaythai', title: { tr: 'Teknik kombinasyonlar', en: 'Technical combinations' }, level: 'all' },
  { day: 3, time: '20:00', duration: 75, discipline: 'mma', title: { tr: 'Geçişler & pozisyon', en: 'Transitions & positions' }, level: 'all' },
  { day: 4, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 4, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Pad & kombinasyon', en: 'Pads & combinations' }, level: 'all' },
  { day: 4, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Kontrollü uygulama', en: 'Controlled practice' }, level: 'advanced' },
  { day: 5, time: '10:00', duration: 60, discipline: 'kickbox', title: { tr: 'Hafta sonu temelleri', en: 'Weekend fundamentals' }, level: 'beginner' },
  { day: 5, time: '11:15', duration: 75, discipline: 'muaythai', title: { tr: 'Pad & teknik tekrar', en: 'Pads & technique drills' }, level: 'all' },
  { day: 5, time: '12:45', duration: 75, discipline: 'mma', title: { tr: 'Grappling laboratuvarı', en: 'Grappling lab' }, level: 'all' }
];

export const coaches = {
  head: { image: 'trainer-head', position: '50% 29%', tags: { tr: ['TEKNİK YAKLAŞIM', 'EKİP GELİŞİMİ'], en: ['TECHNICAL APPROACH', 'TEAM DEVELOPMENT'] },
    title: { tr: 'Baş Antrenör', en: 'Head Trainer' }, subtitle: { tr: 'Teknik yaklaşım & ekip koordinasyonu', en: 'Technical approach & team coordination' },
    body: { tr: 'Sağlam bir temel. Bilinçli tekrar. Sürdürülebilir gelişim. Akademinin üç disiplinini ortak bir antrenman anlayışında buluşturan rehber.', en: 'Strong foundations. Purposeful repetition. Sustainable progress. A guide connecting the academy’s three disciplines through a shared training philosophy.' } },
  muaythai: { image: 'trainer-muaythai', position: '50% 24%', tags: { tr: ['PAD', 'CLINCH', 'MESAFE'], en: ['PADS', 'CLINCH', 'DISTANCE'] },
    title: { tr: 'Muay Thai Antrenörü', en: 'Muay Thai Trainer' }, subtitle: { tr: 'Ritim, denge ve sekiz uzvun sanatı.', en: 'Rhythm, balance and the art of eight limbs.' },
    body: { tr: 'Duruştan pad çalışmasına, clinch’ten mesafe kontrolüne. Muay Thai tekniğini adım adım geliştiren bir antrenman yaklaşımı.', en: 'From stance and pad work to clinch and distance control. A coaching approach that develops Muay Thai technique step by step.' } },
  kickbox: { image: 'trainer-kickbox', position: '50% 25%', tags: { tr: ['KOMBİNASYON', 'AYAK OYUNU'], en: ['COMBINATIONS', 'FOOTWORK'] },
    title: { tr: 'Kick Box Antrenörü', en: 'Kick Box Trainer' }, subtitle: { tr: 'Hareketin ritmini birlikte bul.', en: 'Find the rhythm in your movement.' },
    body: { tr: 'Akıcı kombinasyonlar, doğru zamanlama ve aktif savunma. Temelleri güçlendirirken her harekete amaç kazandıran bir yaklaşım.', en: 'Fluid combinations, precise timing and active defence. An approach that gives every movement a purpose while strengthening the basics.' } },
  mma: { image: 'trainer-mma', position: '50% 25%', tags: { tr: ['STRIKING', 'GÜREŞ', 'GRAPPLING'], en: ['STRIKING', 'WRESTLING', 'GRAPPLING'] },
    title: { tr: 'MMA Antrenörü', en: 'MMA Trainer' }, subtitle: { tr: 'Her mesafeyi aynı oyunda birleştir.', en: 'Connect every range into one game.' },
    body: { tr: 'Ayakta vuruş, güreş ve yer oyunu arasında bağlantı kur. Pozisyonları anlayarak, geçişleri çalışarak ve kontrolü koruyarak ilerle.', en: 'Connect striking, wrestling and the ground game. Progress by understanding positions, practising transitions and maintaining control.' } }
};
export type CoachId = keyof typeof coaches;

export const demoCopy = {
  tr: {
    badge: 'ÖRNEK PROGRAM', note: 'Program ve ücretler tasarım önizlemesi için oluşturulmuştur; gerçek ders veya satış teklifi değildir.',
    days: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'], shortDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    daySelect: 'Antrenman günü', disciplineSelect: 'Program ve üyelik disiplini', sessions: 'ders', minutes: 'dk', levels: { beginner: 'Başlangıç', all: 'Tüm seviyeler', advanced: 'İleri seviye' },
    weekly: 'HAFTALIK PROGRAM', restTitle: 'BUGÜN TEMPOYU DÜŞÜR.', restBody: 'Pazar günü grup dersi yok. Yeni haftanın planına göz at.', nextDay: 'Pazartesiyi göster',
    membershipTitle: 'DEVAM ETMEK\nBİR SEÇİM.', membershipIntro: 'Sana uygun süreyi seç. Aynı odağı her antrenmana taşı.', membershipLabel: 'ÜYELİK PAKETLERİ',
    allAccess: 'Tüm disiplinler', allAccessBody: 'Muay Thai + Kick Box + MMA', singleAccess: 'Tek disiplin', scope: 'Paket kapsamı',
    periodNames: { 1: 'Aylık', 6: '6 Aylık', 12: 'Yıllık' }, periodBody: { 1: 'Kendi ritmini bul.', 6: 'Düzenini kur. İlerlemeyi hisset.', 12: 'Disiplini yaşamının parçası yap.' },
    popular: 'ÖNERİLEN SÜRE', monthly: '/ ay', upfront: 'tek seferlik toplam', equivalent: 'Aylık karşılığı', save: 'Aylığa göre', saving: 'avantaj',
    benefits: ['Seçili branşın tüm grup dersleri', 'Seviyene uygun antrenman grubu', 'Cumartesi teknik çalışmaları'], allBenefits: ['Üç branşın tüm grup dersleri', 'Branşlar arası antrenman özgürlüğü', 'Cumartesi teknik çalışmaları'],
    cta: 'Paket hakkında sor', packageNote: 'Örnek fiyatlar TL cinsindedir. 6 ve 12 aylık paketler toplam peşin tutarla gösterilir. Özel ders ve ekipman dahil değildir.',
    coachDemo: 'ÖRNEK PROFİL', coachNote: 'Stok portrelerle hazırlanmış örnek ekip sunumu. İsimler ve gerçek özgeçmişler daha sonra eklenecek.', focus: 'Antrenman odağı', unnamed: 'İsim bilgisi eklenecek'
  },
  en: {
    badge: 'SAMPLE TIMETABLE', note: 'Timetable and prices are created for this design preview; they are not actual classes or a sales offer.',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], shortDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    daySelect: 'Training day', disciplineSelect: 'Timetable and membership discipline', sessions: 'classes', minutes: 'min', levels: { beginner: 'Beginner', all: 'All levels', advanced: 'Advanced' },
    weekly: 'WEEKLY TIMETABLE', restTitle: 'TAKE A BREATHER.', restBody: 'No group classes on Sunday. Take a look at the week ahead.', nextDay: 'Show Monday',
    membershipTitle: 'KEEP SHOWING UP.\nMAKE IT YOURS.', membershipIntro: 'Choose a duration that suits you. Bring the same focus to every session.', membershipLabel: 'MEMBERSHIP PLANS',
    allAccess: 'All disciplines', allAccessBody: 'Muay Thai + Kick Box + MMA', singleAccess: 'Single discipline', scope: 'Plan coverage',
    periodNames: { 1: 'Monthly', 6: '6 Months', 12: 'Annual' }, periodBody: { 1: 'Find your own rhythm.', 6: 'Build a routine. Feel the progress.', 12: 'Make discipline part of your life.' },
    popular: 'RECOMMENDED DURATION', monthly: '/ month', upfront: 'one-off total', equivalent: 'Monthly equivalent', save: 'Compared to monthly', saving: 'saving',
    benefits: ['All group classes in your discipline', 'A group suited to your level', 'Saturday technique sessions'], allBenefits: ['Group classes across all three disciplines', 'Freedom to train across disciplines', 'Saturday technique sessions'],
    cta: 'Ask about this plan', packageNote: 'Sample prices in TRY. The 6- and 12-month plans show the full upfront total. Private lessons and equipment are excluded.',
    coachDemo: 'SAMPLE PROFILE', coachNote: 'Sample team presentation using stock portraits. Names and real biographies will be added later.', focus: 'Training focus', unnamed: 'Name to be added'
  }
};
