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
  kickbox: { name: 'Kick Boks', label: 'KİCK BOKS', accent: '#AAC6E6', dark: '#253B55', image: 'kickbox', domain: 'kickbox.selfcontrolfightacademy.com', number: '02', position: '50% 42%', disciplines: ['kickbox'] },
  mma: { name: 'MMA', label: 'MMA', accent: '#E0A097', dark: '#4B2729', image: 'grappling', domain: 'mma.selfcontrolfightacademy.com', number: '03', position: '55% 42%', disciplines: ['mma'] }
} as const;

export function siteName(id: SiteId, lang: Lang) {
  if (id === 'academy') return lang === 'tr' ? 'Akademi' : 'Academy';
  if (id === 'kickbox') return lang === 'tr' ? 'Kick Boks' : 'Kickboxing';
  return sites[id].name;
}

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
  "tr": {
    "nav": {
      "home": "Ana sayfa",
      "training": "Antrenmanlar",
      "about": "Akademi",
      "schedule": "Program",
      "start": "İletişim",
      "privacy": "Gizlilik"
    },
    "skip": "İçeriğe geç",
    "menu": "Menüyü aç",
    "close": "Kapat",
    "start": "İletişim",
    "explore": "Antrenmanları inceleyin",
    "eyebrow": "SELF CONTROL FIGHT ACADEMY",
    "scroll": "AKADEMİYİ İNCELEYİN",
    "philosophy": "TEKNİK, DİSİPLİN VE DÜZENLİ ANTRENMAN",
    "home": {
      "academy": {
        "title": [
          "DENİZLİ",
          "DÖVÜŞ",
          "SPORLARI"
        ],
        "sub": "Denizli’de Muay Thai, kick boks ve MMA. Antrenman içeriklerini, ders programını ve üyelik seçeneklerini inceleyin.",
        "tag": "MUAY THAI · KİCK BOKS · MMA",
        "image": "Antrenör eşliğinde Muay Thai çalışması"
      },
      "muaythai": {
        "title": [
          "MUAY",
          "THAI",
          "ANTRENMANLARI"
        ],
        "sub": "Denizli’de Muay Thai antrenmanları. Temel duruş, savunma, yumruk, tekme, diz ve dirsek tekniklerine odaklanan çalışmalar.",
        "tag": "MUAY THAI / TEKNİK VE KONDİSYON",
        "image": "Muay Thai antrenmanında darbe yastığı çalışması"
      },
      "kickbox": {
        "title": [
          "KİCK",
          "BOKS",
          "ANTRENMANLARI"
        ],
        "sub": "Denizli’de kick boks antrenmanları. Yumruk ve tekme kombinasyonları, savunma, ayak hareketleri ve kondisyon çalışmaları.",
        "tag": "KİCK BOKS / TEKNİK VE KONDİSYON",
        "image": "Kum torbasında kick boks antrenmanı"
      },
      "mma": {
        "title": [
          "MMA",
          "TEKNİK",
          "ANTRENMANLARI"
        ],
        "sub": "Denizli’de MMA antrenmanları. Ayakta vuruş tekniklerini, güreşi ve yer çalışmalarını bir araya getiren antrenman içeriği.",
        "tag": "MMA / KARMA DÖVÜŞ SANATLARI",
        "image": "MMA antrenmanında yerde pozisyon kontrolü"
      }
    },
    "introLabel": "01 / AKADEMİ",
    "introTitle": "ANTRENMAN\nYAKLAŞIMIMIZ",
    "introBody": "Yeni başlayacak sporcuların branş ve grup seçimini antrenörle görüşmesini öneriyoruz. Ders saatleri, ekipman ve katılım koşulları hakkında iletişim bölümünden bilgi alabilirsiniz.",
    "introWords": [
      "TEKNİK",
      "SAYGI",
      "DÜZENLİ ÇALIŞMA"
    ],
    "disciplinesLabel": "02 / BRANŞLAR",
    "disciplinesTitle": "MUAY THAI,\nKİCK BOKS VE MMA",
    "allTraining": "Tüm antrenmanlar",
    "discover": "Branşı inceleyin",
    "discipline": {
      "muaythai": {
        "short": "Yumruk, tekme, diz ve dirsek teknikleri.",
        "description": "Muay Thai; yumruk, tekme, diz ve dirsek teknikleriyle yakın mesafe çalışmalarını kapsar. Antrenmanlarda duruş, denge, savunma ve mesafe kontrolü birlikte ele alınır.",
        "tags": [
          "DURUŞ VE DENGE",
          "DARBE YASTIĞI",
          "YAKIN MESAFE"
        ],
        "focus": [
          "Temel duruş, gard ve ayak hareketleri",
          "Yumruk, tekme, diz ve dirsek teknikleri",
          "Mesafe kontrolü ve yakın mesafe çalışmaları"
        ]
      },
      "kickbox": {
        "short": "Yumruk, tekme, savunma ve kondisyon.",
        "description": "Kick boks antrenmanlarında yumruk ve tekme kombinasyonları, savunma ve ayak hareketleri çalışılır. Torba ve darbe yastığı çalışmalarıyla teknik ve kondisyon geliştirilir.",
        "tags": [
          "KOMBİNASYON",
          "AYAK HAREKETLERİ",
          "KONDİSYON"
        ],
        "focus": [
          "Gard, savunma ve ayak hareketleri",
          "Yumruk ve tekme kombinasyonları",
          "Torba, darbe yastığı ve kondisyon çalışmaları"
        ]
      },
      "mma": {
        "short": "Ayakta teknik, güreş ve yer çalışmaları.",
        "description": "Karma dövüş sanatları olarak bilinen MMA, ayakta vuruş tekniklerini güreş ve yer çalışmalarıyla birleştirir. Antrenmanlarda bu alanlar arasındaki geçişler ve pozisyon kontrolü üzerinde durulur.",
        "tags": [
          "AYAKTA TEKNİK",
          "GÜREŞ",
          "YER ÇALIŞMALARI"
        ],
        "focus": [
          "Ayakta vuruş teknikleri ve mesafe kontrolü",
          "Güreş ve yere alma teknikleri",
          "Yerde pozisyon kontrolü ve geçişler"
        ]
      }
    },
    "processLabel": "03 / BAŞVURU VE KATILIM",
    "processTitle": "İLK ANTRENMAN\nÖNCESİNDE",
    "steps": [
      {
        "title": "Branş hakkında bilgi alın",
        "body": "Muay Thai, kick boks ve MMA içeriklerini inceleyin. Karar vermeden önce antrenöre danışabilirsiniz."
      },
      {
        "title": "Grup ve saatleri öğrenin",
        "body": "Deneyiminizi ve uygun olduğunuz günleri paylaşarak grup ve ders saatleri hakkında bilgi alın."
      },
      {
        "title": "Katılımınızı teyit edin",
        "body": "İlk antrenmandan önce gerekli ekipmanı, ders saatini ve katılım koşullarını öğrenin."
      }
    ],
    "bannerTitle": "ANTRENMANLAR\nHAKKINDA BİLGİ ALIN",
    "bannerSub": "Branş, ders saati ve üyelik sorularınız için bize ulaşabilirsiniz.",
    "aboutLabel": "AKADEMİ HAKKINDA",
    "aboutTitle": "SELF CONTROL\nFIGHT ACADEMY",
    "aboutBody": "Self Control Fight Academy, Denizli’de Muay Thai, kick boks ve MMA branşlarını bir araya getirir. Antrenman yaklaşımının temelinde teknik çalışma, disiplin ve karşılıklı saygı yer alır.",
    "values": [
      {
        "title": "Teknik ve kontrol",
        "body": "Hareketleri doğru öğrenmek ve kontrollü uygulamak, antrenmanın temelidir."
      },
      {
        "title": "Karşılıklı saygı",
        "body": "Antrenörlere, çalışma arkadaşlarına ve salon kurallarına saygılı bir ortamı önemsiyoruz."
      },
      {
        "title": "Düzenli çalışma",
        "body": "Temel tekniklerin yerleşmesi için düzenli katılım ve tekrar önemlidir."
      }
    ],
    "teamTitle": "ANTRENÖRLERİMİZ",
    "teamBody": "Antrenör bilgileri ve akademiye ait fotoğraflar bu alanda paylaşılacaktır.",
    "pending": "BİLGİLER GÜNCELLENECEK",
    "trainingLabel": "BRANŞLAR VE ANTRENMAN İÇERİKLERİ",
    "trainingTitle": "ANTRENMAN\nİÇERİĞİ",
    "trainingSub": "Branşların temel tekniklerini ve çalışma alanlarını inceleyin.",
    "focusLabel": "ÇALIŞMA ALANLARI",
    "enquiry": "Branş hakkında bilgi alın",
    "academyLink": "Akademi ana sayfası",
    "scheduleLabel": "DERS PROGRAMI",
    "scheduleTitle": "HAFTALIK\nDERS PROGRAMI",
    "scheduleSub": "Branşa ve güne göre dersleri inceleyin. Güncel grup ve saat bilgilerini katılımdan önce teyit edin.",
    "all": "Tümü",
    "schedulePending": "Güncel ders programı henüz yayımlanmadı.",
    "scheduleBody": "Ders saatleri ve gruplar hakkında bilgi almak için ilgilendiğiniz branşı ve uygun olduğunuz günleri paylaşabilirsiniz.",
    "askSchedule": "Ders programı hakkında bilgi alın",
    "prices": "Üyelik ve ücretler",
    "pricesBody": "Üyelik süreleri, paket kapsamları ve ücret bilgileri bu bölümde paylaşılacaktır.",
    "startLabel": "İLETİŞİM",
    "startTitle": "BİLGİ VE\nKAYIT İÇİN",
    "startSub": "Branşlar, ders saatleri ve üyelik hakkında bilgi alabilirsiniz.",
    "contactTitle": "İLETİŞİM BİLGİLERİ",
    "address": "Adres",
    "addressPending": "Denizli · Açık adres bilgisi henüz eklenmedi.",
    "contact": "İletişim",
    "contactPending": "Telefon ve e-posta bilgileri henüz eklenmedi.",
    "instagram": "Instagram",
    "instagramPending": "Resmî Instagram hesabı henüz eklenmedi.",
    "faqTitle": "SIK SORULAN\nSORULAR",
    "faqs": [
      {
        "q": "Daha önce antrenman yapmış olmak gerekiyor mu?",
        "a": "Daha önce antrenman yapmadıysanız başvuru sırasında belirtin. Başlangıç grupları ve katılım koşulları hakkında antrenörden bilgi alabilirsiniz."
      },
      {
        "q": "Hangi branşı seçmeliyim?",
        "a": "Muay Thai; yumruk, tekme, diz ve dirsek tekniklerini, kick boks; yumruk ve tekme kombinasyonlarını kapsar. MMA ise ayakta vuruş, güreş ve yer çalışmalarını birleştirir. Hedefinize uygun branşı seçmek için antrenöre danışabilirsiniz."
      },
      {
        "q": "İlk antrenman için hangi ekipmanlar gerekli?",
        "a": "Rahat spor kıyafeti ve su getirebilirsiniz. Eldiven, bandaj ve diğer ekipman gereksinimlerini katılacağınız branşa göre önceden öğrenin."
      },
      {
        "q": "Ders saatlerini ve ücretleri nereden öğrenebilirim?",
        "a": "Program bölümünde haftalık dersleri, Üyelik bölümünde grup ve özel ders paketlerini inceleyebilirsiniz. Şu anda gösterilen saatler ve ücretler örnektir; güncel bilgileri akademiden teyit edin."
      }
    ],
    "install": "Ana ekrana ekleyin",
    "installTitle": "ANA EKRANA\nEKLEME",
    "installBody": "Siteyi cihazınızın ana ekranına ekleyerek daha kolay açabilirsiniz. Cihazınıza kaydedilmiş sayfalar internet bağlantısı olmadığında da görüntülenebilir.",
    "installNative": "Uygulamayı yükle",
    "ios": "iPhone ve iPad",
    "iosInstructions": "Safari’de Paylaş simgesine dokunun ve “Ana Ekrana Ekle” seçeneğini kullanın.",
    "android": "Android ve bilgisayar",
    "androidInstructions": "Tarayıcı menüsündeki “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullanın. Seçeneğin adı ve kullanılabilirliği cihazınıza göre değişebilir.",
    "installed": "Site ana ekranınıza eklenmiş.",
    "offline": "İnternet bağlantısı yok. Kaydedilmiş sayfalar gösteriliyor; bilgiler güncel olmayabilir.",
    "footerLine": "SELF CONTROL FIGHT ACADEMY",
    "footerNote": "Temsili fotoğraflar akademinin salonunu, antrenörlerini veya üyelerini göstermemektedir.",
    "photoCredits": "Fotoğraf kaynakları",
    "designPreview": "ÖRNEK İÇERİK",
    "previewNote": "Ders programı, ücretler ve antrenör profilleri örnektir. Güncel bilgiler ve iletişim ayrıntıları eklenecektir.",
    "identities": "BRANŞLAR",
    "exploreLabel": "SİTE MENÜSÜ",
    "privacyTitle": "GİZLİLİK\nBİLGİLENDİRMESİ",
    "privacyBody": "Bu sürümde üyelik hesabı, takip çerezi veya sunucuya bilgi gönderen bir iletişim formu bulunmaz. E-posta ve WhatsApp bağlantıları ilgili hizmeti açar; bu hizmetlerin kendi koşulları geçerlidir. Ana ekrana ekleme ve çevrimdışı erişim için herkese açık sayfalar ile site dosyaları tarayıcı önbelleğinde saklanabilir. Son doğrulanan program ve ücret bilgileri de geçici çevrimdışı erişim için cihazınızda tutulabilir. Bu kayıtları tarayıcı ayarlarından silebilirsiniz.",
    "privacyPending": "İşletmenin yasal bilgileri ve iletişim kanalları tamamlandığında, KVKK aydınlatma metni ve veri işleme süreçleri yayımdan önce ayrıca gözden geçirilmelidir.",
    "back": "Ana sayfaya dönün",
    "notFound": "SAYFA\nBULUNAMADI",
    "notFoundBody": "Bu bağlantıya ait bir sayfa bulunamadı. Ana sayfadan devam edebilirsiniz."
  },
  "en": {
    "nav": {
      "home": "Home",
      "training": "Training",
      "about": "Academy",
      "schedule": "Timetable",
      "start": "Contact",
      "privacy": "Privacy"
    },
    "skip": "Skip to content",
    "menu": "Open menu",
    "close": "Close",
    "start": "Contact us",
    "explore": "View training",
    "eyebrow": "SELF CONTROL FIGHT ACADEMY",
    "scroll": "ABOUT THE ACADEMY",
    "philosophy": "TECHNIQUE, DISCIPLINE AND REGULAR TRAINING",
    "home": {
      "academy": {
        "title": [
          "MARTIAL",
          "ARTS IN",
          "DENİZLİ"
        ],
        "sub": "Muay Thai, kickboxing and MMA in Denizli. Explore training, class timetables and membership options at Self Control Fight Academy.",
        "tag": "MUAY THAI · KICKBOXING · MMA",
        "image": "Muay Thai training with a coach"
      },
      "muaythai": {
        "title": [
          "MUAY",
          "THAI",
          "TRAINING"
        ],
        "sub": "Muay Thai training in Denizli, covering stance, defence, punches, kicks, knees and elbows.",
        "tag": "MUAY THAI / TECHNIQUE AND CONDITIONING",
        "image": "Muay Thai pad training"
      },
      "kickbox": {
        "title": [
          "KICK",
          "BOXING",
          "TRAINING"
        ],
        "sub": "Kickboxing training in Denizli, with punch and kick combinations, defence, footwork and conditioning.",
        "tag": "KICKBOXING / TECHNIQUE AND CONDITIONING",
        "image": "Kickboxing bag training"
      },
      "mma": {
        "title": [
          "MMA",
          "TECHNIQUE",
          "TRAINING"
        ],
        "sub": "MMA training in Denizli, bringing together striking, wrestling and ground techniques.",
        "tag": "MMA / MIXED MARTIAL ARTS",
        "image": "Ground position practice in MMA training"
      }
    },
    "introLabel": "01 / THE ACADEMY",
    "introTitle": "OUR TRAINING\nAPPROACH",
    "introBody": "Before joining, speak with a coach about your choice of discipline and group. Use the Contact section to ask about class times, equipment and joining requirements.",
    "introWords": [
      "TECHNIQUE",
      "RESPECT",
      "CONSISTENCY"
    ],
    "disciplinesLabel": "02 / DISCIPLINES",
    "disciplinesTitle": "MUAY THAI,\nKICKBOXING AND MMA",
    "allTraining": "All training",
    "discover": "View discipline",
    "discipline": {
      "muaythai": {
        "short": "Punches, kicks, knees and elbows.",
        "description": "Muay Thai combines punches, kicks, knees and elbows with clinch work. Training covers stance, balance, defence and distance control.",
        "tags": [
          "STANCE AND BALANCE",
          "PAD WORK",
          "CLINCH"
        ],
        "focus": [
          "Fundamental stance, guard and footwork",
          "Punch, kick, knee and elbow techniques",
          "Distance control and clinch work"
        ]
      },
      "kickbox": {
        "short": "Combinations, defence and conditioning.",
        "description": "Kickboxing training covers punch and kick combinations, defence and footwork. Bag and pad drills develop technique and conditioning.",
        "tags": [
          "COMBINATIONS",
          "FOOTWORK",
          "CONDITIONING"
        ],
        "focus": [
          "Guard, defence and footwork",
          "Punch and kick combinations",
          "Bag work, pad drills and conditioning"
        ]
      },
      "mma": {
        "short": "Striking, wrestling and ground techniques.",
        "description": "Mixed martial arts combines striking with wrestling and ground techniques. Training covers transitions between these areas and position control.",
        "tags": [
          "STRIKING",
          "WRESTLING",
          "GROUND TECHNIQUES"
        ],
        "focus": [
          "Striking techniques and distance control",
          "Wrestling and takedowns",
          "Ground positions and transitions"
        ]
      }
    },
    "processLabel": "03 / GETTING STARTED",
    "processTitle": "BEFORE YOUR\nFIRST SESSION",
    "steps": [
      {
        "title": "Learn about the disciplines",
        "body": "Review Muay Thai, kickboxing and MMA training. A coach can help you compare the options."
      },
      {
        "title": "Check groups and times",
        "body": "Share your experience and availability to find out about suitable groups and class times."
      },
      {
        "title": "Confirm your attendance",
        "body": "Check equipment, class times and joining requirements before your first session."
      }
    ],
    "bannerTitle": "TRAINING\nINFORMATION",
    "bannerSub": "Contact us with questions about disciplines, class times and memberships.",
    "aboutLabel": "ABOUT THE ACADEMY",
    "aboutTitle": "SELF CONTROL\nFIGHT ACADEMY",
    "aboutBody": "Self Control Fight Academy brings together Muay Thai, kickboxing and MMA in Denizli. Our training approach is based on technical practice, discipline and mutual respect.",
    "values": [
      {
        "title": "Technique and control",
        "body": "Learning correct technique and applying it with control are central to training."
      },
      {
        "title": "Mutual respect",
        "body": "We value respect for coaches, training partners and gym rules."
      },
      {
        "title": "Regular practice",
        "body": "Consistent attendance and repetition help establish sound technique."
      }
    ],
    "teamTitle": "OUR COACHES",
    "teamBody": "Coach information and original academy photography will be added here.",
    "pending": "INFORMATION TO BE UPDATED",
    "trainingLabel": "DISCIPLINES AND TRAINING",
    "trainingTitle": "TRAINING\nCONTENT",
    "trainingSub": "Read about each discipline’s fundamental techniques and areas of practice.",
    "focusLabel": "TRAINING AREAS",
    "enquiry": "Ask about this discipline",
    "academyLink": "Academy home",
    "scheduleLabel": "CLASS TIMETABLE",
    "scheduleTitle": "WEEKLY\nCLASS TIMETABLE",
    "scheduleSub": "Browse classes by discipline and day. Confirm current groups and times before attending.",
    "all": "All",
    "schedulePending": "The current class timetable has not been published yet.",
    "scheduleBody": "Share your preferred discipline and availability to ask about class times and groups.",
    "askSchedule": "Ask about class times",
    "prices": "Memberships and prices",
    "pricesBody": "Membership durations, package details and prices will be listed here.",
    "startLabel": "CONTACT",
    "startTitle": "ENQUIRIES AND\nREGISTRATION",
    "startSub": "Contact us for information about training, class times and memberships.",
    "contactTitle": "CONTACT DETAILS",
    "address": "Address",
    "addressPending": "Denizli · The street address has not been added yet.",
    "contact": "Contact",
    "contactPending": "Phone and email details have not been added yet.",
    "instagram": "Instagram",
    "instagramPending": "The official Instagram account has not been added yet.",
    "faqTitle": "FREQUENTLY ASKED\nQUESTIONS",
    "faqs": [
      {
        "q": "Do I need previous training experience?",
        "a": "Let us know if you are new to martial arts. A coach can explain beginner groups and joining requirements."
      },
      {
        "q": "Which discipline should I choose?",
        "a": "Muay Thai covers punches, kicks, knees and elbows. Kickboxing focuses on punch and kick combinations, while MMA combines striking, wrestling and ground techniques. A coach can help you choose based on your goals."
      },
      {
        "q": "What equipment do I need for my first session?",
        "a": "Bring comfortable sportswear and water. Check the glove, wrap and other equipment requirements for your chosen discipline before attending."
      },
      {
        "q": "Where can I find class times and prices?",
        "a": "The Timetable section lists weekly classes, and Memberships covers group and private lesson packages. The times and prices currently shown are examples; confirm current information with the academy."
      }
    ],
    "install": "Add to home screen",
    "installTitle": "ADD TO\nHOME SCREEN",
    "installBody": "Add the site to your home screen for easier access. Pages saved on your device can also be viewed without an internet connection.",
    "installNative": "Install app",
    "ios": "iPhone and iPad",
    "iosInstructions": "In Safari, tap Share and select “Add to Home Screen”.",
    "android": "Android and desktop",
    "androidInstructions": "Select “Install app” or “Add to Home screen” from your browser menu. The wording and availability depend on your device.",
    "installed": "The site is already added to your home screen.",
    "offline": "No internet connection. Saved pages are being displayed and may be out of date.",
    "footerLine": "SELF CONTROL FIGHT ACADEMY",
    "footerNote": "Illustrative photographs do not show the academy’s premises, coaches or members.",
    "photoCredits": "Photo credits",
    "designPreview": "SAMPLE CONTENT",
    "previewNote": "Class times, prices and coach profiles are examples. Current information and contact details will be added.",
    "identities": "DISCIPLINES",
    "exploreLabel": "SITE MENU",
    "privacyTitle": "PRIVACY\nINFORMATION",
    "privacyBody": "This version has no membership accounts, tracking cookies or contact forms that send information to a server. Email and WhatsApp links open the relevant service, which has its own terms. Your browser may cache public pages and site files for home-screen installation and offline access. The last verified public timetable and prices may also be stored on your device for temporary offline access. You can remove these records through your browser settings.",
    "privacyPending": "The privacy notice and data handling practices will be reviewed before launch once the business’s legal information and contact channels are complete.",
    "back": "Return to home",
    "notFound": "PAGE\nNOT FOUND",
    "notFoundBody": "There is no page at this address. You can continue from the home page."
  }
};
