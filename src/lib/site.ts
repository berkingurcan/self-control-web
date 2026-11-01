import { config as env } from '#lib/config.ts';
export type SiteId = 'academy' | 'muaythai' | 'kickbox' | 'mma';
export type Lang = 'tr' | 'en';
export type PageId = 'home' | 'coach' | 'training' | 'about' | 'schedule' | 'start' | 'privacy';
export const ids: SiteId[] = ['academy', 'muaythai', 'kickbox', 'mma'];
export const pages: PageId[] = ['home', 'coach', 'training', 'about', 'schedule', 'start', 'privacy'];
export const routes: Record<Lang, Record<PageId, string>> = {
  tr: { home: '', coach: 'bas-antrenor', training: 'antrenmanlar', about: 'akademi', schedule: 'program', start: 'basla', privacy: 'gizlilik' },
  en: { home: '', coach: 'head-trainer', training: 'training', about: 'academy', schedule: 'schedule', start: 'start', privacy: 'privacy' }
};
export const sites = {
  academy: { name: 'Fight Academy', label: 'SELF CONTROL', accent: '#ffffff', dark: '#222222', image: 'training', domain: 'selfcontrolfightacademy.com', number: '00', position: '50% 45%', disciplines: ['muaythai', 'kickbox', 'mma'] },
  muaythai: { name: 'Muay Thai', label: 'MUAY THAI', accent: '#B7D19C', dark: '#263D2D', image: 'muay-thai', domain: 'muaythai.selfcontrolfightacademy.com', number: '01', position: '50% 36%', disciplines: ['muaythai'] },
  kickbox: { name: 'Kick Box', label: 'KICK BOX', accent: '#AAC6E6', dark: '#253B55', image: 'kickbox', domain: 'kickbox.selfcontrolfightacademy.com', number: '02', position: '50% 42%', disciplines: ['kickbox'] },
  mma: { name: 'MMA', label: 'MMA', accent: '#E0A097', dark: '#4B2729', image: 'grappling', domain: 'mma.selfcontrolfightacademy.com', number: '03', position: '55% 42%', disciplines: ['mma'] }
} as const;

export const selectedSite: SiteId = ids.includes(env.PUBLIC_SITE_ID as SiteId) ? env.PUBLIC_SITE_ID as SiteId : 'academy';
export function href(page: PageId, lang: Lang, prefix = '') {
  const root = `${prefix}${lang === 'en' ? '/en' : ''}` || '/';
  if (page === 'coach') return `${root === '/' ? '' : root}/${routes[lang].coach}`;
  const anchors: Record<Exclude<PageId, 'coach'>, string> = { home: '', training: 'training', about: 'academy', schedule: 'schedule', start: 'start', privacy: 'privacy' };
  return `${root}${anchors[page] ? `#${anchors[page]}` : ''}`;
}
export function parsePath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  let site = selectedSite;
  let prefix = '';
  if (parts[0] === 'preview' && env.PUBLIC_ENABLE_PREVIEWS === 'true') {
    parts.shift(); const candidate = parts.shift();
    if (!ids.includes(candidate as SiteId)) return null;
    site = candidate as SiteId; prefix = `/preview/${site}`;
  }
  const lang: Lang = parts[0] === 'en' ? (parts.shift(), 'en') : 'tr';
  const page = pages.find(key => routes[lang][key] === parts.join('/'));
  return page ? { site, lang, page, prefix } : null;
}
export function siteHref(id: SiteId, lang: Lang, preview = false) {
  return preview ? href('home', lang, `/preview/${id}`) : `https://${sites[id].domain}${lang === 'en' ? '/en' : '/'}`;
}

export const copy = {
  tr: {
    nav: { home: 'Ana sayfa', training: 'Antrenmanlar', about: 'Akademi', schedule: 'Program', start: 'Başla', privacy: 'Gizlilik' },
    skip: 'İçeriğe geç', menu: 'Menüyü aç', close: 'Kapat', start: 'İlk adımı at', explore: 'Antrenmanları keşfet',
    eyebrow: 'SELF CONTROL FIGHT ACADEMY', scroll: 'KEŞFETMEYE DEVAM ET', philosophy: 'GÜÇ, KONTROLLE BAŞLAR.',
    home: {
      academy: { title: ['GÜCÜNÜ', 'KONTROL', 'ET.'], sub: 'Muay Thai, Kick Box ve MMA. Kendi yolunu bul. Her antrenmanda bir adım ileri git.', tag: 'ÜÇ DİSİPLİN. TEK KARAKTER.', image: 'Partnerli dövüş sporları antrenmanı' },
      muaythai: { title: ['SEKİZ UZUV.', 'TEK', 'ODAK.'], sub: 'Duruş, ritim ve mesafe. Muay Thai dünyasına Self Control disipliniyle adım at.', tag: 'MUAY THAI / THE ART OF EIGHT LIMBS', image: 'Muay Thai pad antrenmanı' },
      kickbox: { title: ['RİTMİNİ', 'BUL.', 'İLERLE.'], sub: 'Yumruk ve tekmelerin aynı ritimde buluştuğu yer. Kick Box ile hareketine yön ver.', tag: 'KICK BOX / PRECISION IN MOTION', image: 'Kum torbasında tekme antrenmanı' },
      mma: { title: ['HER MESAFE.', 'TEK', 'ZİHİN.'], sub: 'Ayakta, clinch’te ve yerde. MMA ile oyunun parçalarını bir araya getir.', tag: 'MMA / COMPLETE YOUR GAME', image: 'MMA yer oyunu için grappling antrenmanı' }
    },
    introLabel: '01 / YAKLAŞIM', introTitle: 'KENDİNİ AŞ.\nKENDİN KAL.', introBody: 'Self Control, yalnızca bir isim değil. Hareketin arkasındaki niyet. Gücün arkasındaki disiplin. Burada yolculuk, kendine verdiğin sözle başlar.',
    introWords: ['DİSİPLİN', 'SAYGI', 'GELİŞİM'], disciplinesLabel: '02 / KENDİ YOLUNU BUL', disciplinesTitle: 'FARKLI YOLLAR.\nAYNI İRADE.', allTraining: 'Tüm antrenmanlar', discover: 'Disiplini keşfet',
    discipline: {
      muaythai: { short: 'Ritim. Mesafe. Karakter.', description: 'Yumruk, tekme, diz ve dirsek. Sekiz uzvun sanatında teknik ve dengeyi birlikte keşfet.', tags: ['DURUŞ & DENGE', 'PAD ÇALIŞMASI', 'CLINCH'], focus: ['Temel duruş, gard ve ayak hareketleri', 'Yumruk, tekme, diz ve dirsek mekaniği', 'Mesafe, zamanlama ve clinch prensipleri'] },
      kickbox: { short: 'Hız. Hassasiyet. Akış.', description: 'Yumruk ve tekme kombinasyonlarını akıcı bir oyuna dönüştür. Hareket ederken karar vermeyi öğren.', tags: ['KOMBİNASYON', 'AYAK OYUNU', 'KONDİSYON'], focus: ['Gard, savunma ve ayak hareketleri', 'Yumruk ve tekme kombinasyonları', 'Torba ve pad ile ritim çalışmaları'] },
      mma: { short: 'Ayakta. Yerde. Her yerde.', description: 'Striking, güreş ve yer oyunu. Farklı mesafeler arasında geçiş yapabilen bütünlüklü bir yaklaşım.', tags: ['STRIKING', 'GÜREŞ', 'GRAPPLING'], focus: ['Ayakta vuruş ve mesafe yönetimi', 'Güreş ve yere alma prensipleri', 'Pozisyon kontrolü ve yerde geçişler'] }
    },
    processLabel: '03 / İLK ANTRENMANINA DOĞRU', processTitle: 'BAŞLAMAK İÇİN\nBİR ADIM YETER.',
    steps: [ { title: 'Yolunu seç', body: 'Muay Thai, Kick Box veya MMA. İlgi alanını keşfet; kararsızsan bize sor.' }, { title: 'Birlikte planlayalım', body: 'Deneyimini, hedefini ve uygun olduğun günleri paylaş. Grup ve saat bilgilerini öğren.' }, { title: 'Hazır gel', body: 'İlk antrenmandan önce ekipman, kıyafet ve katılım detaylarını netleştir.' } ],
    bannerTitle: 'EN ZOR ADIM,\nİLK ADIM.', bannerSub: 'Geri kalanını birlikte planlayalım.',
    aboutLabel: 'AKADEMİ / BİZİ BİR ARAYA GETİREN', aboutTitle: 'ÖNCE\nKENDİNE\nHAKİM OL.', aboutBody: 'Self Control Fight Academy; Muay Thai, Kick Box ve MMA’yı ortak bir disiplin anlayışı altında bir araya getirir. Farklı teknikler. Aynı öz: kendini tanımak ve bilinçli hareket etmek.',
    values: [ { title: 'Kontrol', body: 'Güç, ne zaman ve nasıl kullanacağını bildiğinde anlam kazanır.' }, { title: 'Saygı', body: 'Kendine, partnerine ve öğrenme sürecine saygı. Birlikte gelişmenin temeli.' }, { title: 'Süreklilik', body: 'Gelişim tek bir güne sığmaz. Her tekrar, bir sonraki adımın temelidir.' } ],
    teamTitle: 'EKİPLE TANIŞ.', teamBody: 'Antrenör kadromuz ve akademi fotoğraflarımız burada yer alacak.', pending: 'BİLGİLER YAKINDA',
    trainingLabel: 'ANTRENMANLAR / KENDİ YOLUNU SEÇ', trainingTitle: 'ODAĞINI\nBUL.', trainingSub: 'Her disiplinin dili farklı. Self Control yaklaşımı ortak.', focusLabel: 'TEKNİK ODAK', enquiry: 'Bu disiplin hakkında sor', academyLink: 'Ana akademiye dön',
    scheduleLabel: 'PROGRAM / ANTRENMANINI PLANLA', scheduleTitle: 'ZAMANINI\nAYIR.', scheduleSub: 'Disiplinini seç. Güncel grup, seviye ve saat bilgilerini birlikte netleştirelim.', all: 'Tümü', schedulePending: 'Güncel ders programı yakında.', scheduleBody: 'Kesinleşmemiş saatler göstermiyoruz. İlgilendiğin disiplin ve uygun olduğun günlerle bir mesaj hazırla.', askSchedule: 'Program hakkında sor', prices: 'Üyelik & ücretler', pricesBody: 'Paketler, katılım koşulları ve ücret bilgileri netleştiğinde burada paylaşılacak.',
    startLabel: 'İLK ADIM / TANIŞALIM', startTitle: 'SENİN YOLUN.\nSENİN İLK\nADIMIN.', startSub: 'Bir soru, bir hedef veya sadece merak. Buradan başlayabilirsin.',
    contactTitle: 'AKADEMİYE ULAŞ.', address: 'Adres', addressPending: 'Konum bilgisi yakında paylaşılacak.', contact: 'İletişim', contactPending: 'E-posta ve WhatsApp bilgileri yakında.', instagram: 'Instagram', instagramPending: 'Resmî hesap yakında eklenecek.',
    faqTitle: 'AKLINDAKİLER.', faqs: [ { q: 'Daha önce antrenman yapmış olmam gerekiyor mu?', a: 'Başlamadan önce deneyimini paylaş. Sana uygun grup, seviye ve katılım seçeneklerini akademiyle birlikte netleştirebilirsin.' }, { q: 'Hangi disiplini seçmeliyim?', a: 'Muay Thai sekiz uzuv tekniğine, Kick Box yumruk ve tekme kombinasyonlarına, MMA ise striking, güreş ve yer oyununun bütününe odaklanır. Hedefini paylaşarak seçim için bilgi alabilirsin.' }, { q: 'İlk antrenmana ne getirmeliyim?', a: 'Rahat spor kıyafetleri ve su iyi bir başlangıçtır. Eldiven, bandaj ve diğer ekipman gereksinimlerini katılmadan önce akademiyle doğrula.' }, { q: 'Ders saatlerini ve ücretleri nereden öğrenebilirim?', a: 'Program bölümünde günlere göre örnek dersleri, hemen altında grup üyeliklerini ve kişi sayısına göre özel ders paketlerini inceleyebilirsin. Gerçek program ve ücretler açılıştan önce güncellenecek.' } ],
    install: 'Telefonuna ekle', installTitle: 'SELF CONTROL,\nHEP YANINDA.', installBody: 'Antrenman sayfalarına ana ekranından ulaş. Daha önce açtığın sayfalar çevrimdışıyken de görüntülenebilir.', installNative: 'Uygulamayı yükle', ios: 'iPhone / iPad', iosInstructions: 'Safari’de Paylaş simgesine dokun, ardından “Ana Ekrana Ekle”yi seç.', android: 'Android / masaüstü', androidInstructions: 'Tarayıcı menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullan. Seçenek, tarayıcına ve cihazına göre değişebilir.', installed: 'Ana ekran deneyimi hazır.', offline: 'Çevrimdışısın. Kayıtlı sayfaları görüntülüyorsun; bilgiler güncel olmayabilir.',
    footerLine: 'GÜÇ. DİSİPLİN. SELF CONTROL.', footerNote: 'Fotoğraflar geçici stok görsellerdir; akademinin mekânını veya üyelerini temsil etmez.', photoCredits: 'Fotoğraf kaynakları', designPreview: 'TASARIM ÖNİZLEMESİ', previewNote: 'Program, ücretler ve antrenör profilleri örnek içeriktir. İletişim bilgileri yakında eklenecek.', identities: 'DİSİPLİNLER', exploreLabel: 'KEŞFET',
    privacyTitle: 'GİZLİLİK.', privacyBody: 'Bu sürümde üyelik hesabı, takip çerezi veya sunucuya gönderilen iletişim formu bulunmuyor. E-posta veya WhatsApp seçersen, ilgili hizmetin koşulları geçerli olur. Ana ekrana ekleme ve çevrimdışı erişim için tarayıcın herkese açık sayfaları ve site dosyalarını önbelleğe alabilir. Bu kayıtları tarayıcı ayarlarından silebilirsin.', privacyPending: 'İşletmenin yasal bilgileri ve iletişim kanalları eklendiğinde, KVKK aydınlatma metni ve veri işleme süreçleri yayımdan önce ayrıca gözden geçirilmelidir.',
    back: 'Ana sayfaya dön', notFound: 'BU SAYFA RİNGE ÇIKMADI.', notFoundBody: 'Sayfa bulunamadı. Akademiye geri dönebilirsin.'
  },
  en: {
    nav: { home: 'Home', training: 'Training', about: 'Academy', schedule: 'Schedule', start: 'Start', privacy: 'Privacy' },
    skip: 'Skip to content', menu: 'Open menu', close: 'Close', start: 'Take the first step', explore: 'Explore training',
    eyebrow: 'SELF CONTROL FIGHT ACADEMY', scroll: 'KEEP EXPLORING', philosophy: 'POWER BEGINS WITH CONTROL.',
    home: {
      academy: { title: ['OWN', 'YOUR', 'POWER.'], sub: 'Muay Thai, Kick Box and MMA. Find your discipline. Move forward with every session.', tag: 'THREE DISCIPLINES. ONE CHARACTER.', image: 'Partner martial arts training' },
      muaythai: { title: ['EIGHT LIMBS.', 'ONE', 'FOCUS.'], sub: 'Stance, rhythm and distance. Discover Muay Thai through the discipline of Self Control.', tag: 'MUAY THAI / THE ART OF EIGHT LIMBS', image: 'Muay Thai pad training' },
      kickbox: { title: ['FIND', 'YOUR', 'RHYTHM.'], sub: 'Where punches and kicks move in rhythm. Give your movement direction with Kick Box.', tag: 'KICK BOX / PRECISION IN MOTION', image: 'Kickboxing bag training' },
      mma: { title: ['EVERY RANGE.', 'ONE', 'MIND.'], sub: 'On the feet, in the clinch and on the ground. Bring the pieces together with MMA.', tag: 'MMA / COMPLETE YOUR GAME', image: 'Grappling practice for the ground component of MMA' }
    },
    introLabel: '01 / THE APPROACH', introTitle: 'GO FURTHER.\nSTAY YOURSELF.', introBody: 'Self Control is more than a name. Intent behind movement. Discipline behind power. The journey starts with a commitment to yourself.', introWords: ['DISCIPLINE', 'RESPECT', 'PROGRESS'], disciplinesLabel: '02 / FIND YOUR DISCIPLINE', disciplinesTitle: 'DIFFERENT PATHS.\nTHE SAME DRIVE.', allTraining: 'All training', discover: 'Explore the discipline',
    discipline: {
      muaythai: { short: 'Rhythm. Distance. Character.', description: 'Punches, kicks, knees and elbows. Explore technique and balance through the art of eight limbs.', tags: ['STANCE & BALANCE', 'PAD WORK', 'CLINCH'], focus: ['Fundamental stance, guard and footwork', 'Punch, kick, knee and elbow mechanics', 'Distance, timing and clinch principles'] },
      kickbox: { short: 'Speed. Precision. Flow.', description: 'Turn punch and kick combinations into a flowing game. Learn to make decisions while moving.', tags: ['COMBINATIONS', 'FOOTWORK', 'CONDITIONING'], focus: ['Guard, defence and footwork', 'Punch and kick combinations', 'Rhythm through bag and pad work'] },
      mma: { short: 'Standing. Grounded. Complete.', description: 'Striking, wrestling and ground work. A connected approach to moving between different ranges.', tags: ['STRIKING', 'WRESTLING', 'GRAPPLING'], focus: ['Striking and distance management', 'Wrestling and takedown principles', 'Position control and ground transitions'] }
    },
    processLabel: '03 / TOWARDS YOUR FIRST SESSION', processTitle: 'IT STARTS WITH\nONE STEP.', steps: [ { title: 'Find your discipline', body: 'Muay Thai, Kick Box or MMA. Explore what interests you; ask us if you are undecided.' }, { title: 'Make a plan together', body: 'Share your experience, goals and availability. Ask about groups and training times.' }, { title: 'Come prepared', body: 'Confirm equipment, clothing and participation details before your first session.' } ],
    bannerTitle: 'THE HARDEST STEP\nIS THE FIRST.', bannerSub: 'Let’s plan what comes next together.', aboutLabel: 'THE ACADEMY / WHAT CONNECTS US', aboutTitle: 'MASTER\nYOURSELF\nFIRST.', aboutBody: 'Self Control Fight Academy brings Muay Thai, Kick Box and MMA together under one shared approach to discipline. Different techniques. The same foundation: knowing yourself and moving with intent.',
    values: [ { title: 'Control', body: 'Power has meaning when you understand when and how to use it.' }, { title: 'Respect', body: 'Respect for yourself, your training partner and the process. The foundation of learning together.' }, { title: 'Consistency', body: 'Progress takes more than a day. Every repetition prepares the next step.' } ], teamTitle: 'MEET THE TEAM.', teamBody: 'Our coaching team and academy photography will appear here.', pending: 'DETAILS COMING SOON',
    trainingLabel: 'TRAINING / CHOOSE YOUR PATH', trainingTitle: 'FIND YOUR\nFOCUS.', trainingSub: 'Each discipline has its own language. The Self Control approach connects them.', focusLabel: 'TECHNICAL FOCUS', enquiry: 'Ask about this discipline', academyLink: 'Back to the main academy',
    scheduleLabel: 'SCHEDULE / PLAN YOUR TRAINING', scheduleTitle: 'MAKE\nTHE TIME.', scheduleSub: 'Choose your discipline. Let’s confirm current groups, levels and training times together.', all: 'All', schedulePending: 'The current timetable is coming soon.', scheduleBody: 'We do not display unconfirmed training times. Prepare a message with your preferred discipline and availability.', askSchedule: 'Ask about the timetable', prices: 'Membership & pricing', pricesBody: 'Packages, participation terms and pricing will appear here once confirmed.',
    startLabel: 'THE FIRST STEP / LET’S TALK', startTitle: 'YOUR PATH.\nYOUR FIRST\nSTEP.', startSub: 'A question, a goal or simply curiosity. You can start here.',
    contactTitle: 'REACH THE ACADEMY.', address: 'Address', addressPending: 'Location details will be shared soon.', contact: 'Contact', contactPending: 'Email and WhatsApp details are coming soon.', instagram: 'Instagram', instagramPending: 'Our official account will be added soon.',
    faqTitle: 'ON YOUR MIND.', faqs: [ { q: 'Do I need previous training experience?', a: 'Share your experience before getting started. Confirm suitable groups, levels and participation options with the academy.' }, { q: 'Which discipline should I choose?', a: 'Muay Thai focuses on eight-limb technique, Kick Box on punch and kick combinations, and MMA on connecting striking, wrestling and ground work. Share your goals to ask about the options.' }, { q: 'What should I bring to my first session?', a: 'Comfortable sportswear and water are a good start. Confirm gloves, wraps and any other equipment requirements with the academy before attending.' }, { q: 'Where can I find training times and prices?', a: 'Explore sample classes by day in the Schedule section, followed by group memberships and private lesson packages by participant count. Actual timetables and prices will be updated before launch.' } ],
    install: 'Add to your phone', installTitle: 'SELF CONTROL,\nWITH YOU.', installBody: 'Reach training pages from your home screen. Previously opened pages can also be viewed offline.', installNative: 'Install app', ios: 'iPhone / iPad', iosInstructions: 'In Safari, tap the Share icon, then choose “Add to Home Screen”.', android: 'Android / desktop', androidInstructions: 'Choose “Install app” or “Add to Home screen” in your browser menu. Availability depends on your browser and device.', installed: 'Your home-screen experience is ready.', offline: 'You are offline. Viewing saved pages; information may be out of date.',
    footerLine: 'POWER. DISCIPLINE. SELF CONTROL.', footerNote: 'Temporary stock photography does not depict academy premises or members.', photoCredits: 'Photo credits', designPreview: 'DESIGN PREVIEW', previewNote: 'Timetable, prices and trainer profiles are sample content. Contact information will be added later.', identities: 'DISCIPLINES', exploreLabel: 'EXPLORE',
    privacyTitle: 'PRIVACY.', privacyBody: 'This version has no membership accounts, tracking cookies or contact forms that send data to a server. If you choose email or WhatsApp, that service’s terms apply. For home-screen installation and offline access, your browser may cache public pages and site files. You can remove them in your browser settings.', privacyPending: 'Before launch, the business’s legal details, privacy notice and data handling practices must be reviewed when real contact channels are added.',
    back: 'Back to home', notFound: 'THIS PAGE MISSED THE RING.', notFoundBody: 'We couldn’t find that page. Head back to the academy.'
  }
};
