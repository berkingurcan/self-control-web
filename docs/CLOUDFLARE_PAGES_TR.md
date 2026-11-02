# Cloudflare Pages ile yayınlama

Bu repo `@sveltejs/adapter-cloudflare` kullanır. Sayfalar önceden üretilir; Google Sheets program/fiyat verilerini okuyan `/api/content` ise Pages Function olarak çalışır. Ayrıca bir backend kurmanız gerekmez.

## İlk projeyi bağlama

1. Cloudflare panelinde **Workers & Pages → Create application → Pages → Import an existing Git repository** yolunu açın. **Workers** oluşturma akışı yerine **Pages** seçin.
2. GitHub bağlantısında `berkingurcan/self-control-web` reposunu seçin.
3. Proje adını örneğin `self-control-academy`, production branch alanını `main` yapın.
4. Aşağıdaki derleme ayarlarını girin.

| Alan | Değer |
| --- | --- |
| Framework preset | `SvelteKit` |
| Root directory | Boş bırakın; `package.json` repo kökünde |
| Build command | `npm run build` |
| Build output directory | `.svelte-kit/cloudflare` |
| Node sürümü | `24.12.0`; repodaki `.nvmrc` tanımlar |

Pages bağımlılıkları `package-lock.json` üzerinden kurar. Bir deploy komutu veya API token girmeniz gerekmez.

5. Environment variables alanına şu değerleri ekleyin:

```env
NODE_VERSION=24.12.0
PUBLIC_SITE_ID=academy
PUBLIC_ENABLE_PREVIEWS=false
PUBLIC_INDEXABLE=false
```

6. Projenin **Settings → Functions → Compatibility flags** / **Runtime** bölümünde `nodejs_compat` bayrağını **Production ve Preview** için ekleyin. Uyumluluk tarihi için `2026-07-30` kullanılabilir; yerel Wrangler kontrolü bu tarihle yapılır. Panelde bölümün adı değişmişse Pages Functions runtime ayarlarını açın.
7. İlk kurulum ekranı runtime ayarını göstermiyorsa projeyi oluşturduktan sonra ayarı ekleyin ve **Retry deployment** ile yeniden derleyin. **Save and Deploy** yayını başlatır.

Tamamlanan deployment, `https://<proje-adı>.pages.dev` adresini verir. Sonraki `main` push’ları otomatik yeniden yayınlanır. Bu repoda sabit bir Wrangler proje adı yoktur: aynı kaynak dört ayrı Pages projesinde kullanılabilir; proje adı ve runtime bayrakları panelde yönetilir.

## Alt branşları yayınlama

Aynı repoyu üç yeni Pages projesine daha bağlayın. Derleme ayarları aynı kalır, `PUBLIC_SITE_ID` değişir:

| Önerilen proje adı | `PUBLIC_SITE_ID` | Bağlanacak özel alan adı |
| --- | --- | --- |
| `self-control-academy` | `academy` | `selfcontrolfightacademy.com` |
| `self-control-muaythai` | `muaythai` | `muaythai.selfcontrolfightacademy.com` |
| `self-control-kickbox` | `kickbox` | `kickbox.selfcontrolfightacademy.com` |
| `self-control-mma` | `mma` | `mma.selfcontrolfightacademy.com` |

Her projede **Production ve Preview** değişkenlerini ve `nodejs_compat` bayrağını ayarlayın. Sitenin üretim yapısı ayrı alan adları içindir. `pages.dev` üzerinde her proje kendi başına açılır, fakat branşlar arası bağlantılar yukarıdaki özel alan adlarına gider. Alan adlarını her projenin **Custom domains → Set up a custom domain** ekranından ekleyip Cloudflare’ın gösterdiği DNS adımlarını izleyin.

Alan adlarını bağlamadan dört tasarımı tek adreste incelemek isterseniz ayrı bir tasarım önizleme projesinde `PUBLIC_SITE_ID=academy`, `PUBLIC_ENABLE_PREVIEWS=true` kullanın. Branşlar `/preview/muaythai`, `/preview/kickbox`, `/preview/mma` altında açılır. Üretim projelerinde `PUBLIC_ENABLE_PREVIEWS=false` bırakın. Bu seçenek Cloudflare’ın Git branch preview özelliğinden bağımsızdır.

## Canlı program ve ücretler

**Settings → Variables and Secrets → Add → Secret** alanına şunu ekleyin:

```env
SHEETS_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/TABLO_KIMLIGI/edit
```

Production ve Preview için ayrı ayrı ekleyin, ardından yeniden deploy edin. Tablo standart Google E-Tablolar görüntüleme bağlantısına sahip ve bağlantıya sahip olanlar tarafından görüntülenebilir olmalıdır. Ayrıntılar: [Google Sheets kurulumu](GOOGLE_SHEETS_TR.md).

- Değişken boşsa paketlenmiş örnek program ve fiyatlar gösterilir.
- Değişken doluyken tablo okunamazsa örnek fiyatlara dönülmez; veri erişim uyarısı gösterilir.
- Başarılı Google Sheets okumaları çalışan Function örneğinde beş dakika yeniden kullanılır. Sonraki hücre düzenlemeleri için deploy gerekmez.
- İletişim için `PUBLIC_CONTACT_EMAIL`, `PUBLIC_WHATSAPP`, `PUBLIC_INSTAGRAM`, `PUBLIC_ADDRESS` değişkenlerini ekleyin. `PUBLIC_*` değişikliklerinden sonra yeniden derleme gerekir.
- İşletme bilgileri tamamlanınca özel alan adlarında indekslemeyi açmak için `PUBLIC_INDEXABLE=true` yapıp yeniden deploy edin. `pages.dev` yanıtlarında ayrıca `noindex` başlığı bulunur.

## Yerel doğrulama

```sh
nvm use
npm ci
npm run check
npm run build:all
npm test
PUBLIC_SITE_ID=academy npm run build
npm run preview:pages
```

Wrangler’ın yazdırdığı yerel adresi açın. Bu komut yayın yapmaz ve Cloudflare oturumu gerektirmez. Google Sheets’i Wrangler ile test etmek için `.dev.vars` dosyasına `SHEETS_SPREADSHEET_URL=...` ekleyin. Wrangler, `.dev.vars` kullanılmadığında `.env.local` dosyasını da okuyabilir. Vite geliştirmesi `.env.local` kullanır; bu dosyalar Git’e eklenmez.

## Yayın sonrası kontrol

- `/`, `/en`, `/api/content`, `/manifest.webmanifest`, `/service-worker.js` açılmalı.
- Academy’de `/bas-antrenor` ve `/en/head-trainer` açılmalı; alt branşlarda profil sayfaları olmamalı.
- Program ve fiyatların örnek/canlı durumu kontrol edilmeli.
- Özel alan adları bağlandıktan sonra branş ve dil bağlantıları, iletişim hedefleri, mobil menü ve PWA kurulumu denenmeli.

Resmî kaynaklar: [Cloudflare Pages SvelteKit](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/), [SvelteKit Cloudflare adaptörü](https://svelte.dev/docs/kit/adapter-cloudflare), [Pages derleme ortamı ve Node sürümü](https://developers.cloudflare.com/pages/configuration/build-image/).
