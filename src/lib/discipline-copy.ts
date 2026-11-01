import type { Lang, SiteId } from '#lib/site.ts';

export type DisciplineId = Exclude<SiteId, 'academy'>;
type DisciplineText = {
  body: string;
  title: string;
  areas: { title: string; body: string }[];
};

export const disciplineCopy: Record<Lang, Record<DisciplineId, DisciplineText>> = {
  tr: {
    muaythai: {
      body: 'Muay Thai antrenmanlarında vuruş teknikleri, savunma, denge ve yakın mesafe çalışmaları birlikte ele alınır.',
      title: 'MUAY THAI\nANTRENMANI',
      areas: [
        { title: 'Duruş ve savunma', body: 'Gard, denge ve ayak hareketleri; mesafeyi koruma ve gelen vuruşlara karşı savunma çalışmaları.' },
        { title: 'Vuruş teknikleri', body: 'Yumruk, tekme, diz ve dirsek teknikleri. Darbe yastığı ve torba üzerinde teknik tekrarlar ve kombinasyonlar.' },
        { title: 'Yakın mesafe', body: 'Yakın mesafede tutuş, denge ve pozisyon kontrolü. Tekniklerin kontrollü eşli çalışmalarla uygulanması.' }
      ]
    },
    kickbox: {
      body: 'Kick boks antrenmanlarında yumruk ve tekme kombinasyonları, savunma, ayak hareketleri ve kondisyon üzerine çalışılır.',
      title: 'KİCK BOKS\nANTRENMANI',
      areas: [
        { title: 'Gard ve ayak hareketleri', body: 'Temel duruş, gard ve yön değiştirme. Vuruş öncesinde ve sonrasında mesafeyi koruma çalışmaları.' },
        { title: 'Yumruk ve tekme', body: 'Yumruk ve tekme tekniklerinin birlikte kullanıldığı kombinasyonlar. Torba ve darbe yastığı üzerinde teknik tekrarlar.' },
        { title: 'Savunma ve kondisyon', body: 'Blok, savuşturma ve karşılık verme çalışmaları. Teknik uygulamayı destekleyen kondisyon ve koordinasyon egzersizleri.' }
      ]
    },
    mma: {
      body: 'MMA antrenmanları, ayakta vuruş tekniklerini güreş ve yer çalışmalarıyla bir araya getirir.',
      title: 'MMA\nANTRENMANI',
      areas: [
        { title: 'Ayakta teknik', body: 'Yumruk ve tekme teknikleri, savunma ve mesafe kontrolü. Ayakta çalışmadan güreşe geçişler.' },
        { title: 'Güreş ve yere alma', body: 'Tutuş, denge ve yere alma teknikleri. Yere alınmaya karşı savunma ve pozisyon çalışmaları.' },
        { title: 'Yer çalışmaları', body: 'Yerde pozisyon kontrolü, pozisyonlar arası geçişler ve savunma. Tekniklerin kontrollü eşli çalışmalarla uygulanması.' }
      ]
    }
  },
  en: {
    muaythai: {
      body: 'Muay Thai training brings together striking techniques, defence, balance and close-range work.',
      title: 'MUAY THAI\nTRAINING',
      areas: [
        { title: 'Stance and defence', body: 'Guard, balance and footwork. Practice in maintaining distance and defending against strikes.' },
        { title: 'Striking techniques', body: 'Punches, kicks, knees and elbows. Technical drills and combinations on pads and bags.' },
        { title: 'Close-range work', body: 'Clinch positioning, balance and control. Applying techniques through controlled partner drills.' }
      ]
    },
    kickbox: {
      body: 'Kickboxing training covers punch and kick combinations, defence, footwork and conditioning.',
      title: 'KICKBOXING\nTRAINING',
      areas: [
        { title: 'Guard and footwork', body: 'Stance, guard and changes of direction. Maintaining distance before and after a strike.' },
        { title: 'Punches and kicks', body: 'Combinations that bring punching and kicking techniques together. Technical drills on bags and pads.' },
        { title: 'Defence and conditioning', body: 'Blocking, parrying and countering. Conditioning and coordination exercises that support technical practice.' }
      ]
    },
    mma: {
      body: 'MMA training brings striking, wrestling and ground techniques together.',
      title: 'MMA\nTRAINING',
      areas: [
        { title: 'Striking', body: 'Punches, kicks, defence and distance control. Transitions from striking to wrestling.' },
        { title: 'Wrestling and takedowns', body: 'Grips, balance and takedown techniques. Takedown defence and positional drills.' },
        { title: 'Ground training', body: 'Ground control, positional transitions and defence. Applying techniques through controlled partner drills.' }
      ]
    }
  }
};
