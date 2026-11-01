import type { Lang, SiteId } from './site.ts';

export type DisciplineId = Exclude<SiteId, 'academy'>;
export const disciplines: DisciplineId[] = ['muaythai', 'kickbox', 'mma'];
export type Session = { day: number; time: string; duration: number; discipline: DisciplineId; title: Record<Lang, string>; level: 'beginner' | 'all' | 'advanced' };
export const sessions: Session[] = [
  { day: 0, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 0, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Kombinasyon ve ayak hareketleri', en: 'Combinations and footwork' }, level: 'all' },
  { day: 0, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Ayakta teknik ve mesafe kontrolü', en: 'Striking and distance control' }, level: 'all' },
  { day: 1, time: '07:30', duration: 60, discipline: 'kickbox', title: { tr: 'Sabah kondisyonu', en: 'Morning conditioning' }, level: 'all' },
  { day: 1, time: '18:30', duration: 75, discipline: 'muaythai', title: { tr: 'Darbe yastığı çalışması', en: 'Pad drills' }, level: 'all' },
  { day: 1, time: '20:00', duration: 75, discipline: 'mma', title: { tr: 'Güreş ve yere alma', en: 'Wrestling and takedowns' }, level: 'all' },
  { day: 2, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Yakın mesafe ve denge', en: 'Clinch and balance' }, level: 'all' },
  { day: 2, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 2, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Yerde teknik ve pozisyon kontrolü', en: 'Ground techniques and control' }, level: 'all' },
  { day: 3, time: '07:30', duration: 60, discipline: 'kickbox', title: { tr: 'Torba ve kondisyon', en: 'Bag work and conditioning' }, level: 'all' },
  { day: 3, time: '18:30', duration: 75, discipline: 'muaythai', title: { tr: 'Teknik kombinasyonlar', en: 'Technical combinations' }, level: 'all' },
  { day: 3, time: '20:00', duration: 75, discipline: 'mma', title: { tr: 'Pozisyonlar ve geçişler', en: 'Positions and transitions' }, level: 'all' },
  { day: 4, time: '18:00', duration: 60, discipline: 'muaythai', title: { tr: 'Temel teknik', en: 'Fundamentals' }, level: 'beginner' },
  { day: 4, time: '19:15', duration: 60, discipline: 'kickbox', title: { tr: 'Darbe yastığı ve kombinasyon', en: 'Pad combinations' }, level: 'all' },
  { day: 4, time: '20:30', duration: 75, discipline: 'mma', title: { tr: 'Kontrollü uygulama', en: 'Controlled practice' }, level: 'advanced' },
  { day: 5, time: '10:00', duration: 60, discipline: 'kickbox', title: { tr: 'Temel teknik çalışması', en: 'Fundamental techniques' }, level: 'beginner' },
  { day: 5, time: '11:15', duration: 75, discipline: 'muaythai', title: { tr: 'Darbe yastığı ve teknik tekrar', en: 'Pad work and technique drills' }, level: 'all' },
  { day: 5, time: '12:45', duration: 75, discipline: 'mma', title: { tr: 'Güreş ve yer çalışmaları', en: 'Wrestling and ground drills' }, level: 'all' }
];

export const coaches = {
  "head": {
    "image": "trainer-head",
    "position": "50% 29%",
    "tags": {
      "tr": [
        "TEKNİK ÇALIŞMALAR",
        "ANTRENÖR KOORDİNASYONU"
      ],
      "en": [
        "TECHNICAL TRAINING",
        "COACH COORDINATION"
      ]
    },
    "title": {
      "tr": "Baş Antrenör",
      "en": "Head Coach"
    },
    "subtitle": {
      "tr": "Teknik çalışmalar ve antrenör koordinasyonu",
      "en": "Technical training and coach coordination"
    },
    "body": {
      "tr": "Baş antrenörün çalışma alanları, antrenman yaklaşımı ve akademideki görevleri hakkında bilgi edinin. İsim ve özgeçmiş bilgileri henüz eklenmedi.",
      "en": "Read about the head coach’s training areas, approach and role at the academy. The coach’s name and background have not been added yet."
    }
  },
  "muaythai": {
    "image": "trainer-muaythai",
    "position": "50% 24%",
    "tags": {
      "tr": [
        "DARBE YASTIĞI",
        "YAKIN MESAFE",
        "SAVUNMA"
      ],
      "en": [
        "PAD WORK",
        "CLINCH",
        "DEFENCE"
      ]
    },
    "title": {
      "tr": "Muay Thai Antrenörü",
      "en": "Muay Thai Coach"
    },
    "subtitle": {
      "tr": "Temel teknik, savunma ve yakın mesafe çalışmaları.",
      "en": "Fundamental techniques, defence and clinch work."
    },
    "body": {
      "tr": "Muay Thai antrenörlüğü; duruş, denge, vuruş teknikleri, savunma ve yakın mesafe çalışmalarını kapsar. Antrenörün isim ve özgeçmiş bilgileri daha sonra eklenecektir.",
      "en": "Muay Thai coaching covers stance, balance, striking techniques, defence and clinch work. The coach’s name and background will be added later."
    }
  },
  "kickbox": {
    "image": "trainer-kickbox",
    "position": "50% 25%",
    "tags": {
      "tr": [
        "KOMBİNASYON",
        "AYAK HAREKETLERİ",
        "KONDİSYON"
      ],
      "en": [
        "COMBINATIONS",
        "FOOTWORK",
        "CONDITIONING"
      ]
    },
    "title": {
      "tr": "Kick Boks Antrenörü",
      "en": "Kickboxing Coach"
    },
    "subtitle": {
      "tr": "Yumruk ve tekme kombinasyonları, savunma ve kondisyon.",
      "en": "Punch and kick combinations, defence and conditioning."
    },
    "body": {
      "tr": "Kick boks antrenörlüğü; yumruk ve tekme kombinasyonları, savunma, ayak hareketleri ve kondisyon çalışmalarını kapsar. Antrenörün isim ve özgeçmiş bilgileri daha sonra eklenecektir.",
      "en": "Kickboxing coaching covers punch and kick combinations, defence, footwork and conditioning. The coach’s name and background will be added later."
    }
  },
  "mma": {
    "image": "trainer-mma",
    "position": "50% 25%",
    "tags": {
      "tr": [
        "AYAKTA TEKNİK",
        "GÜREŞ",
        "YER ÇALIŞMALARI"
      ],
      "en": [
        "STRIKING",
        "WRESTLING",
        "GROUND TECHNIQUES"
      ]
    },
    "title": {
      "tr": "MMA Antrenörü",
      "en": "MMA Coach"
    },
    "subtitle": {
      "tr": "Ayakta vuruş teknikleri, güreş ve yer çalışmaları.",
      "en": "Striking, wrestling and ground techniques."
    },
    "body": {
      "tr": "MMA antrenörlüğü; ayakta vuruş, güreş, yere alma ve yerde pozisyon kontrolü çalışmalarını kapsar. Antrenörün isim ve özgeçmiş bilgileri daha sonra eklenecektir.",
      "en": "MMA coaching covers striking, wrestling, takedowns and ground position control. The coach’s name and background will be added later."
    }
  }
};
export type CoachId = keyof typeof coaches;

export const demoCopy = {
  "tr": {
    "badge": "ÖRNEK DERS PROGRAMI",
    "note": "Bu bölümdeki ders saatleri ve ücretler örnektir. Güncel program ve fiyatları akademiden teyit edin.",
    "days": [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar"
    ],
    "shortDays": [
      "Pzt",
      "Sal",
      "Çar",
      "Per",
      "Cum",
      "Cmt",
      "Paz"
    ],
    "daySelect": "Ders günü",
    "disciplineSelect": "Branş seçimi",
    "sessions": "ders",
    "minutes": "dk",
    "levels": {
      "beginner": "Başlangıç seviyesi",
      "all": "Tüm seviyeler",
      "advanced": "İleri seviye"
    },
    "weekly": "HAFTALIK PROGRAM",
    "restTitle": "BU GÜN İÇİN DERS BULUNMUYOR",
    "restBody": "Programı incelemek için başka bir gün seçebilirsiniz.",
    "nextDay": "Pazartesi programı",
    "membershipTitle": "ÜYELİK\nSEÇENEKLERİ",
    "membershipIntro": "Branş, ders türü ve süreye göre paketleri karşılaştırın. Güncel ücret ve katılım koşullarını akademiden öğrenebilirsiniz.",
    "membershipLabel": "ÜYELİK VE ÜCRETLER",
    "allAccess": "Tüm branşlar",
    "allAccessBody": "Muay Thai · Kick Boks · MMA",
    "singleAccess": "Tek branş",
    "scope": "Paket kapsamı",
    "periodNames": {
      "1": "1 aylık",
      "6": "6 aylık",
      "12": "12 aylık"
    },
    "periodBody": {
      "1": "1 aylık grup dersi paketi.",
      "6": "6 aylık grup dersi paketi.",
      "12": "12 aylık grup dersi paketi."
    },
    "popular": "PAKET SÜRESİ",
    "monthly": "/ ay",
    "upfront": "Toplam peşin ücret",
    "equivalent": "Aylık karşılığı",
    "save": "Aylık pakete göre",
    "saving": "indirim",
    "benefits": [
      "Seçilen branştaki grup dersleri",
      "Seviyeye uygun antrenman grubu",
      "Cumartesi teknik çalışmaları"
    ],
    "allBenefits": [
      "Üç branştaki grup dersleri",
      "Farklı branşların derslerine katılım",
      "Cumartesi teknik çalışmaları"
    ],
    "cta": "Paket bilgisi alın",
    "packageNote": "Örnek ücretler Türk lirası cinsindedir. Uzun süreli paketlerde toplam peşin tutar gösterilir. Özel dersler ve ekipman dahil değildir.",
    "coachDemo": "ÖRNEK PROFİL",
    "coachNote": "Antrenör profilleri ve fotoğrafları temsilidir. Gerçek isim, özgeçmiş ve uzmanlık bilgileri eklenecektir.",
    "focus": "Çalışma alanları",
    "unnamed": "İsim bilgisi henüz eklenmedi."
  },
  "en": {
    "badge": "SAMPLE CLASS TIMETABLE",
    "note": "Class times and prices in this section are examples. Confirm the current timetable and prices with the academy.",
    "days": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "shortDays": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ],
    "daySelect": "Class day",
    "disciplineSelect": "Select discipline",
    "sessions": "classes",
    "minutes": "min",
    "levels": {
      "beginner": "Beginner",
      "all": "All levels",
      "advanced": "Advanced"
    },
    "weekly": "WEEKLY TIMETABLE",
    "restTitle": "NO CLASSES ON THIS DAY",
    "restBody": "Select another day to view the timetable.",
    "nextDay": "Monday timetable",
    "membershipTitle": "MEMBERSHIP\nOPTIONS",
    "membershipIntro": "Compare packages by discipline, class type and duration. Contact the academy for current prices and joining requirements.",
    "membershipLabel": "MEMBERSHIPS AND PRICES",
    "allAccess": "All disciplines",
    "allAccessBody": "Muay Thai · Kickboxing · MMA",
    "singleAccess": "Single discipline",
    "scope": "Package coverage",
    "periodNames": {
      "1": "1 month",
      "6": "6 months",
      "12": "12 months"
    },
    "periodBody": {
      "1": "A one-month group class package.",
      "6": "A six-month group class package.",
      "12": "A 12-month group class package."
    },
    "popular": "PACKAGE DURATION",
    "monthly": "/ month",
    "upfront": "Total upfront price",
    "equivalent": "Monthly equivalent",
    "save": "Compared with monthly packages",
    "saving": "saving",
    "benefits": [
      "Group classes in the selected discipline",
      "A group appropriate to your level",
      "Saturday technique sessions"
    ],
    "allBenefits": [
      "Group classes in all three disciplines",
      "Access to classes across disciplines",
      "Saturday technique sessions"
    ],
    "cta": "Ask about this package",
    "packageNote": "Sample prices are shown in Turkish lira. Longer packages show the total upfront amount. Private lessons and equipment are not included.",
    "coachDemo": "SAMPLE PROFILE",
    "coachNote": "Coach profiles and photographs are illustrative. Actual names, backgrounds and qualifications will be added.",
    "focus": "Training areas",
    "unnamed": "Name not yet added."
  }
};
