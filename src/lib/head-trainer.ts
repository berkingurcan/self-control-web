export const headTrainerName = 'Gökhan Denizli';
export const headTrainerPortrait = 'gokhan/gokhan-denizli-profile';
export const headTrainerAcademyPhoto = 'gokhan/gokhan-denizli-ringside';
export const headTrainerInstagram = 'https://www.instagram.com/gokhandennizli/';
const netherlandsGyms = ['SB Gym', 'Mike’s Gym', 'Days Gym Almere'];
const thailandGyms = [
  'Venum Training Camp', 'Tiger Muay Thai', 'Apollo Gym', 'Singha Muay Thai',
  'Dobrynya MMA', 'Rattachai Muay Thai', 'Sinbi Muay Thai', 'AKA Thailand',
  'Superbon Training Camp', 'Bangtao Muay Thai & MMA'
];

export const headTrainerGallery: ReadonlyArray<{ image: string; position: string; mobilePosition?: string }> = [
  { image: 'gokhan/trainer-gae', position: '50% 53%' },
  { image: 'gokhan/venum-krai', position: '50% 38%', mobilePosition: '50% 24%' },
  { image: 'gokhan/mma-team', position: '50% 15%' },
  { image: 'gokhan/ringside', position: '50% 70%', mobilePosition: '50% 53%' },
  { image: 'gokhan/venum-sak', position: '50% 45%' },
  { image: 'gokhan/evo', position: '50% 20%' },
  { image: 'gokhan/mma-camp', position: '50% 15%' },
  { image: 'gokhan/training-team', position: '50% 45%', mobilePosition: '50% 26%' },
  { image: 'gokhan/training-partner', position: '50% 8%' },
  { image: 'gokhan/muay-thai-camp', position: '50% 35%', mobilePosition: '50% 6%' },
  { image: 'gokhan/serkan-ozcaglayan', position: '50% 27%' },
  { image: 'gokhan/bahram-rajabzadeh', position: '50% 40%', mobilePosition: '50% 17%' },
  { image: 'gokhan/frank-hickman', position: '50% 45%', mobilePosition: '50% 37%' },
  { image: 'gokhan/alex-schild', position: '50% 40%' },
  { image: 'gokhan/bangtao', position: '50% 49%', mobilePosition: '50% 36%' },
  { image: 'gokhan/one-lumpinee', position: '50% 50%', mobilePosition: '50% 43%' },
  { image: 'gokhan/dayon-mungra', position: '50% 37%' },
  { image: 'gokhan/ayoub-bourass', position: '50% 29%', mobilePosition: '50% 12%' }
];
// Short overlays for long captions; the desktop cards and lightbox use the full labels.
const photoTileTitles: Partial<Record<string, string>> = {
  'gokhan/mma-team': 'Joey Berkenbosch · DJOESFIT',
  'gokhan/mma-camp': 'Fabrício Gaia',
  'gokhan/serkan-ozcaglayan': 'Serkan Özçağlayan',
  'gokhan/bahram-rajabzadeh': 'Bahram Rajabzadeh',
  'gokhan/trainer-gae': 'Trainer Gae',
  'gokhan/frank-hickman': 'Frank Hickman',
  'gokhan/alex-schild': 'Alex Schild',
  'gokhan/bangtao': 'Bangtao Muay Thai & MMA',
  'gokhan/one-lumpinee': 'ONE Championship · Lumpinee',
  'gokhan/dayon-mungra': 'Dayon Mungra · Days Gym',
  'gokhan/ayoub-bourass': 'Ayoub Bourass · GLORY'
};

export const headTrainerCopy = {
  tr: {
    role: 'Başantrenör', title: ['GÖKHAN', 'DENİZLİ'], back: 'Akademiye dön',
    description: 'Gökhan Denizli, 4. Dan siyah kuşak sahibi Kick Boks ve MMA antrenörü, Denizli MMA İl Temsilcisi ve Self Control Fight Academy’nin kurucusu ve başantrenörüdür.',
    byline: 'Kick Boks & MMA Antrenörü | 4. Dan Siyah Kuşak | Kulüp Başkanı',
    intro: 'Gökhan Denizli, Kick Boks ve MMA branşlarında ulusal ve uluslararası düzeyde sporcu yetiştiren, mesleki gelişimini uluslararası eğitimlerle destekleyen profesyonel bir dövüş sporları antrenörüdür.',
    bioLink: 'Biyografiyi oku', galleryLink: 'Fotoğraf arşivi',
    portrait: 'Self Control Fight Academy tişörtüyle kafesin yanında Gökhan Denizli',
    academyPhotoAlt: 'Gökhan Denizli müsabaka alanının kenarında',
    signature: 'GÖKHAN DENİZLİ / SELF CONTROL FIGHT ACADEMY / DENİZLİ',
    instagram: 'Instagram’da takip et',
    bioLabel: '01 / GÖKHAN DENİZLİ', bioTitle: 'BİYOGRAFİ',
    credentialsTitle: 'Yeterlilikler ve görevler',
    credentials: [
      '4. Dan Siyah Kuşak',
      'Kick Boks 2. Kademe Antrenörü',
      'MMA 2. Kademe Antrenörü – MMA Level 4 Yeterliliği',
      'Denizli MMA İl Temsilcisi',
      'Gökhan Denizli Spor Kulübü Başkanı',
      'Self Control Fight Academy Kurucusu ve Başantrenörü'
    ],
    trainingTitle: 'Uluslararası eğitim ve dövüş sporları deneyimi',
    trainingIntro: 'Gökhan Denizli, antrenörlük kariyeri boyunca Avrupa ve Asya’nın önemli dövüş sporları merkezlerinde eğitim alarak farklı antrenman ekollerini yakından deneyimledi.',
    countries: [
      { name: 'Hollanda', gyms: netherlandsGyms, detail: 'Hollanda’da Avrupa’nın profesyonel Kick Boks ve K-1 antrenman sistemlerini deneyimledi ve GLORY organizasyonunda mücadele eden profesyonel dövüşçülerle antrenman yaptı.' },
      { name: 'Tayland', gyms: thailandGyms, detail: 'Tayland’da Trainer Gae’den çok sayıda özel ders alarak bireysel tekniğini geliştirdi.' }
    ],
    trainingOutcome: 'Uluslararası eğitimlerde edindiği teknik ve taktiksel birikimi kendi antrenörlük sistemine aktararak sporcularının gelişimine katkı sağlıyor.',
    campsTitle: 'Uluslararası sporcu kampları ve profesyonel dövüş sporları',
    camps: [
      'Gökhan Denizli, Self Control Fight Academy’de profesyonel dövüşçülerin kamp ve hazırlık çalışmalarına ev sahipliği yapıyor. Yurt dışından ve Türkiye’nin farklı şehirlerinden Denizli’ye gelen profesyonel dövüşçüler, müsabaka hazırlık kamplarını akademide gerçekleştiriyor.',
      'Self Control Fight Academy, uluslararası antrenman deneyimlerinin paylaşıldığı ve profesyonel müsabaka hazırlıklarının yürütüldüğü bir dövüş sporları merkezi olarak faaliyet gösteriyor.'
    ],
    athleteTitle: 'MMA ve aktif sporcu yetiştiriciliği',
    athletes: [
      'Gökhan Denizli, Kick Boks, K-1 ve MMA branşlarında amatör ve profesyonel sporcular yetiştiriyor. Özellikle MMA’da farklı yaş ve müsabaka kategorilerinde aktif olarak sporcu yetiştiriyor ve sporcularını amatör ve profesyonel müsabakalara hazırlıyor.',
      'Kulübündeki sporcuları, MMA Federasyonu’nun düzenlediği Türkiye şampiyonalarına ve resmî organizasyonlara düzenli olarak kafileler hâlinde götürerek ulusal düzeyde aktif mücadele etmelerini sağlıyor.',
      'Antrenörlüğünü yaptığı sporcular arasında millî takım seviyesine ulaşanlar var. Sporcuları Türkiye şampiyonlukları, uluslararası turnuva dereceleri ve profesyonel müsabaka başarıları elde etti.'
    ],
    academyTitle: 'Self Control Fight Academy',
    academy: [
      'Gökhan Denizli, kurucusu ve başantrenörü olduğu Self Control Fight Academy’de Kick Boks ve MMA branşlarında profesyonel eğitim veriyor. Akademi çocuk, genç ve yetişkin sporculara eğitim programları sunuyor ve amatör ve profesyonel müsabakalara hazırlık çalışmaları yürütüyor.',
      'Akademinin antrenman anlayışı disiplin, teknik yeterlilik, kondisyon, mücadele karakteri ve sürekli gelişime dayanıyor.',
      'Gökhan Denizli’nin hedefi ulusal ve uluslararası arenada mücadele edebilecek, millî takım seviyesine ulaşabilecek ve profesyonel arenada şampiyonluk kazanabilecek sporcular yetiştirmek.'
    ],
    academyProfile: 'Hollanda ve Tayland’da edindiği uluslararası antrenman deneyimini Denizli’ye taşıyan Gökhan Denizli, Kick Boks, K-1 ve MMA’da amatör ve profesyonel sporcular yetiştiriyor. Sporcuları arasında millî takım seviyesine ulaşan, Türkiye şampiyonluğu kazanan, uluslararası turnuvalarda derece alan ve profesyonel müsabakalarda başarı gösteren isimler var.',
    galleryLabel: '02 / FOTOĞRAF ARŞİVİ', galleryTitle: 'HER KAMP,\nYENİ BİR BİRİKİM.',
    galleryBody: 'Gökhan Denizli’nin arşivinden antrenman kampları, ring kenarı ve akademiden kareler.',
    photoTileTitles,
    photoLabels: ['Trainer Gae — Superbon Training Camp', 'Venum Training Camp', 'DJOESFIT & Fightclub — Joey Berkenbosch (Almere, Hollanda)', 'Rajadamnern Stadium / Bangkok', 'Venum Training Camp', 'EVO360 / Pattaya', 'Fabrício Gaia (MMA ve Brezilya Jiu-Jitsu Eğitmeni)', 'Milton Felter, Soufian Sarpong', 'Rafael Fiziev', 'Sinbi Muay Thai / Kru Dee', 'GLORY dövüşçüsü Serkan Özçağlayan salonumuzda', 'Bahram Rajabzadeh — Hollanda Days Gym semineri', 'Frank Hickman — Bangtao Muay Thai & MMA', 'Alex Schild — Bangtao Muay Thai & MMA', 'Bangtao Muay Thai & MMA — Tayland', 'ONE Championship — Lumpinee Stadyumu, Bangkok', 'Dayon Mungra / Days Gym başantrenörü', 'Ayoub Bourass / GLORY dövüşçüsü / Hollanda'],
    photoAlts: ['Trainer Gae ve Gökhan Denizli Superbon Training Camp ringinde Türk bayrağı tutuyor', 'Gökhan Denizli ve bir antrenör Venum Training Camp ringinde', 'Gökhan Denizli ve antrenman ekibi Almere’de DJOESFIT & Fightclub tabelasının önünde', 'Gökhan Denizli Bangkok’ta Rajadamnern Stadium tribününde Türk bayrağı tutuyor', 'Gökhan Denizli Venum Training Camp antrenman alanında bir antrenörle', 'Gökhan Denizli ve Kru De Pattaya’da EVO360 salonunda Türk bayrağı tutuyor', 'Gökhan Denizli MMA antrenman alanında iki antrenman arkadaşıyla', 'Gökhan Denizli Self Control tişörtüyle antrenman ekibinin yanında', 'Gökhan Denizli ve Rafael Fiziev antrenman sonrası', 'Gökhan Denizli ve Kru Dee Sinbi Muay Thai salonunda', 'Serkan Özçağlayan ve Gökhan Denizli Self Control Fight Academy’de kafesin önünde', 'Bahram Rajabzadeh ve Gökhan Denizli Hollanda’da Days Gym seminerinde yan yana', 'Gökhan Denizli ve Frank Hickman Bangtao Muay Thai & MMA antrenman alanında yan yana', 'Gökhan Denizli ve Alex Schild Bangtao Muay Thai & MMA antrenman alanında yan yana', 'Gökhan Denizli ve bir antrenör Bangtao’da ringin önünde Self Control Kickbox bayrağı tutuyor', 'Gökhan Denizli Bangkok’taki Lumpinee Stadyumu’nda ONE Championship ringinin yanında Türk bayrağıyla', 'Gökhan Denizli ve Dayon Mungra, Days Gym’de Self Control Fight Academy tişörtüyle', 'Ayoub Bourass ve Gökhan Denizli Hollanda’da imzalı Self Control Kickbox tişörtüyle'],
    galleryNote: 'Fotoğraflar: Gökhan Denizli’nin kişisel arşivi.', open: 'Fotoğrafı büyüt', close: 'Kapat', previous: 'Önceki fotoğraf', next: 'Sonraki fotoğraf', gallery: 'Gökhan Denizli fotoğraf arşivi',
    ctaLabel: 'BİRLİKTE ÇALIŞALIM', ctaTitle: 'İLK ADIMI\nSALONDA AT.', ctaBody: 'Özel ders, grup antrenmanları ve müsabakaya hazırlık hakkında bilgi almak için bize ulaş.', cta: 'İletişime geç', return: 'Akademiyi keşfet', profileMarker: 'BAŞANTRENÖR', galleryMarker: 'KARE'
  },
  en: {
    role: 'Head Coach', title: ['GÖKHAN', 'DENİZLİ'], back: 'Back to the academy',
    description: 'Gökhan Denizli is a 4th Dan black belt, kickboxing and MMA coach, Denizli provincial MMA representative, and founder and head coach of Self Control Fight Academy.',
    byline: 'Kickboxing & MMA Coach | 4th Dan Black Belt | Club President',
    intro: 'Gökhan Denizli is a professional combat sports coach who develops kickboxing and MMA athletes at national and international level and continues his professional development through training abroad.',
    bioLink: 'Read his biography', galleryLink: 'Photo archive',
    portrait: 'Gökhan Denizli beside the cage wearing a Self Control Fight Academy shirt',
    academyPhotoAlt: 'Gökhan Denizli watching from the edge of the competition area',
    signature: 'GÖKHAN DENİZLİ / SELF CONTROL FIGHT ACADEMY / DENİZLİ',
    instagram: 'Follow on Instagram',
    bioLabel: '01 / GÖKHAN DENİZLİ', bioTitle: 'BIOGRAPHY',
    credentialsTitle: 'Qualifications and roles',
    credentials: [
      '4th Dan Black Belt',
      'Grade 2 Kickboxing Coach',
      'Grade 2 MMA Coach – MMA Level 4 Qualification',
      'Denizli Provincial MMA Representative',
      'President of Gökhan Denizli Sports Club',
      'Founder and Head Coach of Self Control Fight Academy'
    ],
    trainingTitle: 'International training and combat sports experience',
    trainingIntro: 'Throughout his coaching career, Gökhan Denizli has trained at leading combat sports centres across Europe and Asia, gaining first-hand experience of different coaching traditions.',
    countries: [
      { name: 'The Netherlands', gyms: netherlandsGyms, detail: 'In the Netherlands, he experienced European professional kickboxing and K-1 training systems and trained with professional fighters competing in GLORY.' },
      { name: 'Thailand', gyms: thailandGyms, detail: 'In Thailand, he also took numerous private lessons with Trainer Gae to refine his own technique.' }
    ],
    trainingOutcome: 'He incorporates the technical and tactical knowledge gained through international training into his coaching to support his athletes’ development.',
    campsTitle: 'International athlete camps and professional combat sports',
    camps: [
      'Gökhan Denizli hosts professional fighters at Self Control Fight Academy for training camps and competition preparation. Professional fighters travel to Denizli from abroad and from across Türkiye to prepare for bouts at the academy.',
      'Self Control Fight Academy serves as a combat sports centre where athletes share international training experience and prepare for professional competition.'
    ],
    athleteTitle: 'MMA and athlete development',
    athletes: [
      'Gökhan Denizli coaches amateur and professional athletes in kickboxing, K-1 and MMA. In MMA in particular, he actively develops athletes across age groups and competition categories and prepares them for amateur and professional bouts.',
      'He regularly takes groups of athletes from his club to Turkish championships and official events organised by the MMA Federation so they can compete at national level.',
      'Athletes he has coached have reached national team level, won Turkish championship titles, placed in international tournaments and achieved success in professional competition.'
    ],
    academyTitle: 'Self Control Fight Academy',
    academy: [
      'As founder and head coach of Self Control Fight Academy, Gökhan Denizli provides professional coaching in kickboxing and MMA. The academy offers programmes for children, teenagers and adults and prepares athletes for amateur and professional competition.',
      'The academy’s approach is grounded in discipline, technical proficiency, conditioning, fighting spirit and continuous improvement.',
      'Gökhan Denizli aims to develop athletes who can compete nationally and internationally, reach national team level and win professional titles.'
    ],
    academyProfile: 'Gökhan Denizli brings training experience from the Netherlands and Thailand to Denizli, where he coaches amateur and professional athletes in kickboxing, K-1 and MMA. His athletes have reached national team level, won Turkish titles, placed in international tournaments and achieved success in professional competition.',
    galleryLabel: '02 / PHOTO ARCHIVE', galleryTitle: 'EVERY CAMP.\nA NEW PERSPECTIVE.',
    galleryBody: 'Training camps, ringside moments and scenes from the academy, from Gökhan Denizli’s archive.',
    photoTileTitles,
    photoLabels: ['Trainer Gae — Superbon Training Camp', 'Venum Training Camp', 'DJOESFIT & Fightclub — Joey Berkenbosch (Almere, Netherlands)', 'Rajadamnern Stadium / Bangkok', 'Venum Training Camp', 'EVO360 / Pattaya', 'Fabrício Gaia (MMA and Brazilian Jiu-Jitsu Instructor)', 'Milton Felter, Soufian Sarpong', 'Rafael Fiziev', 'Sinbi Muay Thai / Kru Dee', 'GLORY fighter Serkan Özçağlayan at our gym', 'Bahram Rajabzadeh — Days Gym seminar in the Netherlands', 'Frank Hickman — Bangtao Muay Thai & MMA', 'Alex Schild — Bangtao Muay Thai & MMA', 'Bangtao Muay Thai & MMA — Thailand', 'ONE Championship — Lumpinee Stadium, Bangkok', 'Dayon Mungra / Days Gym head coach', 'Ayoub Bourass / GLORY fighter / Netherlands'],
    photoAlts: ['Trainer Gae and Gökhan Denizli holding the Turkish flag in the Superbon Training Camp ring', 'Gökhan Denizli with a coach in a Venum Training Camp ring', 'Gökhan Denizli and his training group in front of the DJOESFIT & Fightclub sign in Almere', 'Gökhan Denizli holding the Turkish flag in the stands at Rajadamnern Stadium in Bangkok', 'Gökhan Denizli standing with a coach at Venum Training Camp', 'Gökhan Denizli and Kru De holding the Turkish flag at EVO360 in Pattaya', 'Gökhan Denizli with two training partners at an MMA gym', 'Gökhan Denizli wearing a Self Control shirt with training partners', 'Gökhan Denizli with Rafael Fiziev after training', 'Gökhan Denizli with Kru Dee at Sinbi Muay Thai', 'Serkan Özçağlayan and Gökhan Denizli in front of the cage at Self Control Fight Academy', 'Bahram Rajabzadeh and Gökhan Denizli standing together at the Days Gym seminar in the Netherlands', 'Gökhan Denizli and Frank Hickman standing together on the mats at Bangtao Muay Thai & MMA', 'Gökhan Denizli and Alex Schild standing together on the mats at Bangtao Muay Thai & MMA', 'Gökhan Denizli and a coach holding a Self Control Kickbox banner beside the ring at Bangtao', 'Gökhan Denizli wearing the Turkish flag beside the ONE Championship ring at Lumpinee Stadium in Bangkok', 'Gökhan Denizli and Dayon Mungra with a Self Control Fight Academy shirt at Days Gym', 'Ayoub Bourass and Gökhan Denizli with a signed Self Control Kickbox shirt in the Netherlands'],
    galleryNote: 'Photography: Gökhan Denizli’s personal archive.', open: 'Enlarge photo', close: 'Close', previous: 'Previous photo', next: 'Next photo', gallery: 'Gökhan Denizli photo archive',
    ctaLabel: 'TRAIN WITH US', ctaTitle: 'TAKE THE\nFIRST STEP.', ctaBody: 'Get in touch about private lessons, group training and competition preparation.', cta: 'Get in touch', return: 'Explore the academy', profileMarker: 'HEAD COACH', galleryMarker: 'PHOTOGRAPHS'
  }
};
