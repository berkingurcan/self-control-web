# Google E-Tablolar bağlantısı

## Salon sahibinin yapacakları

1. `Self-Control-Google-Sheets-Sablonu.xlsx` dosyasını Google Drive’a yükleyin.
2. Google E-Tablolar ile açın. Gerekirse **Dosya → Google E-Tablolar olarak kaydet** ile yerel Google biçimine dönüştürün. Excel dosyasının Drive önizlemesi yeterli değildir.
3. **Program**, **Grup Paketleri** ve **Özel Dersler** sekmelerindeki örnek verileri değiştirin. İlk satırdaki sütun başlıklarını ve sekme adlarını koruyun.
4. **Ayarlar** sekmesinde `Şema sürümü = v1` değerini koruyun. Saat dilimi varsayılanı `Europe/Istanbul` olur. Örnek içerik için `Veri durumu = Örnek`; gerçek veriler kontrol edildiğinde `Yayında` seçin.
5. **Paylaş → Genel erişim → Bağlantıya sahip herkes → Görüntüleyen** ayarını seçin. Düzenleme hakkını salon sahibinde ve yetkili ekipte tutun.
6. Tarayıcıdaki `https://docs.google.com/spreadsheets/d/.../edit` bağlantısını site yöneticisine iletin. Tek bağlantı yeterlidir. API anahtarı veya Google hesabıyla ziyaretçi girişi gerekmez. “Web’de yayımla” bağlantısı yerine standart dosya bağlantısını kullanın.

## Veri kuralları

- Her aktif ders/paket satırının benzersiz bir kodu olmalıdır.
- **Aktif:** `Evet` satırı yayımlar. `Hayır` veya boş alan taslağı gizler. Tamamlanmamış satırı Evet yapmayın.
- **Kapsam:** `Akademi`, `Muay Thai`, `Kick Box`, `MMA`. Akademi ana sitenin “Tüm disiplinler” paketleridir. Branş siteleri kendi satırlarını kullanır.
- Program branşı yalnızca `Muay Thai`, `Kick Box` veya `MMA` olabilir. Program haftalık tekrar eder.
- Günler Türkçe yazılır. Saat `18:00`, süre dakika cinsinden pozitif tam sayıdır. Ders aynı gün içinde bitmelidir.
- İngilizce ders adı boşsa Türkçe adı kullanılır. Seviye etiketi bilgi amaçlıdır; sitede seviye filtresi yoktur.
- Fiyatları sayısal hücre olarak girin. Para birimi TL’dir. Fiyat **kişi başı paket toplamıdır**. 16 ders, 2 kişi, 22000 TL satırı her katılımcının paket için 22000 TL ödediği anlamına gelir.
- Aylık karşılık, ders başı tutar ve avantaj oranını site hesaplar; bu alanları ayrı satır olarak girmeyin.
- Her kapsamda aynı grup süresi bir kez yer almalıdır. Özel derslerde aynı kapsam + kişi sayısı + ders sayısı bir kez bulunmalıdır. Bir kişi grubundaki ders süreleri tutarlı olmalıdır.
- Tek ders gibi kullanım süresi belirtilmeyen paketlerde `Kullanım süresi (ay)` boş kalabilir. Diğer süreler ay cinsinden tam sayıdır.
- Bir kapsamda bütün paketleri pasifleştirmek paketleri siteden kaldırır. Site bunların yerine örnek fiyat koymaz.
- Her veri sekmesinde en fazla 1000 satır kullanın. Üstte başlık dışında satır, birleştirilmiş hücre veya görsel eklemeyin.
- Tatil veya geçici iptal için ilgili haftalık ders satırını pasifleştirin; gerektiğinde yeniden etkinleştirin. Bu sürüm tarih bazlı istisna takvimi içermez.

## Site yöneticisinin yapacakları

Vite ile yerel geliştirmede `.env.local`, Wrangler önizlemesinde `.dev.vars`, Cloudflare Workers üzerinde ise her projenin **Settings → Variables and Secrets** alanına aşağıdaki sunucu değişkenini ekleyin. **Secret** türünü seçin; çalışma zamanı değişkenleri build değişkenlerinden ayrı tutulur:

```env
SHEETS_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/1iHY6_vBx8lOnagMfkhKM9dy7nVKNun259iZC0Ys-los/edit
```

Bu bağlantı yerel `.env.local` dosyasına eklendi ve herkese açık Google E-Tablolar kaynağından başarıyla okundu. `.env.local` ve `.dev.vars` Git'e dahil edilmez; Cloudflare Workers değişkenini ayrıca ekleyin. Başka bir tabloya geçerken yukarıdaki bağlantıyı değiştirin.

Aynı bağlantı dört Cloudflare dağıtımında da kullanılabilir. Ortam değişkenini ilk eklediğinizde uygulamayı yeniden başlatın / yeniden deploy edin. Sonraki hücre değişiklikleri için deploy gerekmez. İndeksleme, iletişim bilgileri ve site kimliği için mevcut `PUBLIC_*` değişkenleri ayrı kalır.

`SHEETS_SPREADSHEET_URL` boşsa yerel örnek veri kullanılır. Değişken doluyken erişim veya doğrulama hatası olursa örnek fiyatlara sessizce geçilmez.

## Okuma, önbellek ve hata davranışı

- `/api/content` sunucu uç noktası sabit dört sekmeyi Google’ın belgelenmiş Visualization CSV protokolüyle okur. Ziyaretçi tarayıcısı Google’a doğrudan istek göndermez.
- Dört sekme birlikte doğrulanır. Aktif satırda hata varsa kısmi fiyat/program güncellemesi yayımlanmaz. Ayrıntılar sunucu logundadır; ziyaretçi genel bağlantı/hata mesajı görür.
- Çalışan Worker örneği başarılı okumaları yaklaşık 5 dakika bellekte tutar. Yanıtta `s-maxage` başlığı olsa da dinamik yanıtların Cloudflare CDN önbelleğine kendiliğinden girdiği varsayılmaz. Açık sayfa görünürken 5 dakikada bir, görünür hale gelince ve bağlantı geri geldiğinde yenilenir. Google önbelleği ek gecikme yaratabilir.
- Aynı çalışan sunucu örneğindeki eşzamanlı istekler birleştirilir. Hatalı kaynağa 60 saniyelik yeniden deneme aralığı uygulanır.
- Tarayıcı son doğrulanan gerçek tablo verisini cihazda saklar. Hata halinde en fazla 1 saatlik eski veri görünür bir uyarıyla kullanılabilir. Kontrol zamanı yenilenmez. Süre aşılırsa fiyat/program gizlenir ve iletişim bağlantısı gösterilir.
- Sunucunun bellek önbelleği kalıcı veri deposu değildir. Soğuk başlangıçta Google erişilemiyorsa sunucu 503 döner; önceki ziyaretçinin tarayıcı kaydı varsa yalnızca onun izin verilen eski verisi kullanılabilir.
- Başarılı okumanın zamanı, Google dosyasının son düzenlenme zamanı değildir. Aynı veri Google’dan yeniden doğrulanırsa kontrol zamanı yenilenir.
- İlk HTML pazarlama içeriği olarak önceden oluşturulur; program ve fiyatlar tarayıcı açıldığında API’den yüklenir. JavaScript kapalıyken yükleme mesajı görülür. Arama motorları için fiyatların ilk HTML’de sunulması gerekiyorsa bu kısım ayrıca sunucuda render edilecek şekilde değiştirilebilir.
- Bağlı Google dosyası ve yerel `/api/content` yanıtı doğrulandı: 18 ders, 12 grup paketi ve 52 özel ders paketi okundu. Tablo hâlâ `Örnek` durumundadır. Gerçek ücret ve programlar girilip kontrol edildiğinde `Yayında` seçin.
