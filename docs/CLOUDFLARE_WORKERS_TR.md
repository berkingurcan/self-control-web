# Cloudflare ile yayınlama

Bu repo mevcut **Create an app → Git repository → Create and deploy** ekranındaki `npx wrangler deploy` komutuyla çalışacak şekilde yapılandırılmıştır.

## Panel ayarları

| Alan | Değer |
| --- | --- |
| Repository | `berkingurcan/self-control-web` |
| Branch | `main` |
| Root / Path | Repo kökü; boş veya `/` |
| Worker adı | `self-control-web` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Node sürümü | `24.12.0` |

Wrangler, `wrangler.jsonc` içindeki `build.command` üzerinden `npm run build` komutunu çalıştırır. Ek bir build komutu tanımlamanız gerekmez. `nodejs_compat`, Worker giriş dosyası ve `ASSETS` bağlantısı repoda tanımlıdır.

Panelde Worker adı farklıysa deploy komutunda aynı adı kullanın:

```sh
npx wrangler deploy --name PANELDEKI_WORKER_ADI
```

## Build değişkenleri

```env
NODE_VERSION=24.12.0
PUBLIC_SITE_ID=academy
PUBLIC_ENABLE_PREVIEWS=false
PUBLIC_INDEXABLE=false
PUBLIC_CONTACT_EMAIL=
PUBLIC_WHATSAPP=
PUBLIC_INSTAGRAM=
PUBLIC_ADDRESS=
```

`PUBLIC_*` değerleri build sırasında kullanılır. Özel alan adlarında Worker kimliği gelen alan adına göre seçer. `PUBLIC_SITE_ID`, yerel adreslerde ve `workers.dev` gibi adreslerde kullanılacak varsayılan kimliği belirler. Domain bağlantıları tamamlanmadan tek adreste bütün tasarımları incelemek için `PUBLIC_ENABLE_PREVIEWS=true` kullanılabilir.

## Canlı program ve fiyatlar

Worker'ın **Settings → Variables and Secrets** çalışma zamanı bölümüne **Secret** olarak ekleyin:

```env
SHEETS_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/TABLO_KIMLIGI/edit
```

Bu değişken yalnızca build ortamında tanımlanırsa çalışan Worker'a otomatik taşınmış sayılmaz. Canlı okuma için runtime secret olarak bulunmalıdır. Ayrıntılar: [Google Sheets kurulumu](GOOGLE_SHEETS_TR.md).

## `Types file not found` hatası

Önceki hatada Wrangler, proje yapılandırması bulunmadığı için SvelteKit'i otomatik kurmuş ve build komutuna `wrangler types --check` eklemişti. Kontrol edilen `worker-configuration.d.ts` dosyası bulunmadığından uygulamanın derlemesi başlamadan işlem kesiliyordu.

Repodaki düzeltme:

- `wrangler.jsonc`, giriş dosyasını, statik dosyaları ve build komutunu açıkça tanımlar; otomatik kurulum gerekmez.
- `worker-configuration.d.ts` repoya eklenmiştir.
- `npm run build` uygulamayı doğrudan derler.
- `npm run deploy:check`, gerçek deploy yolunu `--dry-run` ile doğrular.

Yeni commit'i seçip başarısız deployment'ı yeniden çalıştırın. Panelinizde ayrıca eski `wrangler types --check && ...` komutu elle kaydedilmişse build komutunu `npm run build` yapın. Deploy komutu `npx wrangler deploy` olarak kalır.

## Yerel doğrulama

```sh
nvm use
npm ci
npm run check
npm run build:all
npm test
npm run deploy:check
npm run preview:cloudflare
```

`deploy:check` yayın yapmaz. `preview:cloudflare` yerel Workers runtime'ını başlatır. `.dev.vars` veya `.env.local` içindeki yerel runtime değerleri Git'e eklenmez.

İlk dağıtım `workers.dev` adresinde açılır. Özel alan adlarını Worker'ın **Settings → Domains & Routes** bölümünden bağlayın. Academy ve branşların canonical alan adları mevcut kodda korunur. Yalnızca academy üzerinde baş antrenör profili bulunur.

Resmî kaynaklar: [Cloudflare SvelteKit](https://developers.cloudflare.com/workers/framework-guides/web-apps/sveltekit/), [Wrangler yapılandırması](https://developers.cloudflare.com/workers/wrangler/configuration/).
