# Sena Akvaryum

Yalvaç'taki akvaryum & evcil hayvan dükkanı için web sitesi.
Next.js 16 · Tailwind v4 · three.js (3D beta balığı) · Sanity (yönetim paneli)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
```

Sanity bağlanmadan da çalışır: site örnek içerikle açılır (sol altta "Örnek içerik gösteriliyor" yazar).

## Yönetim paneli kurulumu (bir kez, ~10 dk)

1. https://www.sanity.io adresinde ücretsiz hesap açın ve **yeni proje** oluşturun
   (dataset adı: `production`). Proje ID'sini not alın.
2. `.env.local` dosyasına yazın:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. https://www.sanity.io/manage → projeniz → **API → CORS origins** bölümüne ekleyin
   (**Allow credentials** işaretli):
   - `http://localhost:3000`
   - site adresiniz (örn. `https://senaakvaryum.com`)
4. Başlangıç kategorilerini ve türleri yükleyin (ürün eklemez):
   ```bash
   npx sanity login
   npx sanity dataset import sanity-seed/dataset.ndjson production
   ```
5. `npm run dev` → **http://localhost:3000/studio** adresinden giriş yapın.

### Annenin kullanımı (panel: `siteadresi/studio`)

| Yapmak istediği | Nereden |
| --- | --- |
| Yeni ürün eklemek | **Ürünler → +** → adı, kategori, tür, fiyat, fotoğraf → **Publish** |
| Fiyat göstermek | Üründe **Fiyat** alanını doldur (boş bırakılırsa fiyat hiç görünmez; fiyatlar yalnızca kategori sayfalarındaki ürün listesinde çıkar) |
| Fiyat/stok değiştirmek | Ürüne tıkla → değiştir → **Publish** |
| Ürün tükendi | Üründe **Stokta var** kutusunu kapat |
| Vitrinde (ana sayfa) göstermek | Üründe **Ana sayfadaki vitrinde göster** |
| Yeni tür (ör. "Kırmızı Yanaklı" veya "Kafes Örtüleri") | **Türler → +** → kategoriyi seç ve **Canlı** mı **Malzeme** mi olduğunu işaretle |
| Yeni kategori | **Kategoriler → +** (renk temasını ve simgeyi seçin) |
| Adres, slogan, hakkımızda yazısı | **Dükkan Bilgileri** |

Değişiklikler **Publish**'ten sonra en geç ~1 dakikada sitede görünür.
Anında görünmesi için isteğe bağlı webhook: Sanity → API → Webhooks → URL
`https://SITE/api/revalidate?secret=GIZLI`, method POST; aynı GIZLI değeri `SANITY_REVALIDATE_SECRET` olarak ekleyin.

### Site nasıl düzenli: Canlılar ve Malzemeler

Her hayvan kategorisinin (Balık, Muhabbet Kuşu, Papağan, Kaplumbağa) sayfasında iki bölüm vardır:
**Canlılar** (hayvanın kendisi) ve **Malzemeler** (yem, kafes, yuva, oyuncak, akvaryum, dekor, kum…).
Bir *Tür* oluştururken "Canlı" ya da "Malzeme" seçmek yeterli; ürün eklerken o türü seçince doğru bölümde çıkar.
Ana sayfadaki "Malzemeler" bölümü her kategorinin malzeme türlerini otomatik listeler.
İçinde ürün olmayan tür/bölüm sitede görünmez.

### Fotoğraflar: otomatik küçültme ve arka plan temizleme

Panelde fotoğraf yüklerken **dosya boyutu önemli değil**; yükleme anında annenin tarayıcısında şunlar otomatik olur:

- **Ürün fotoğrafları:** en uzun kenar 2400 px'e küçültülür, WebP olarak kaydedilir (kalite %90, gözle fark edilmez). 70 MB'lık bir fotoğraf ~0,3 MB olur.
- **Kategori "Vitrin fotoğrafı" (ana sayfadaki büyük 3D alan):** küçültülür + **yapay zekâ ile arka plan silinir** + kenarlar temizlenir + hayvanın etrafı kırpılır. Sonuç önizlemede görünür; beğenilmezse "Arka planı silmeden kullan" seçilebilir.
- **Küçük çizim (maskot):** otomatik küçültülür, şeffaflığı korunur.
- Siteye gelen ziyaretçiye ise Sanity CDN'i her ekran için ayrıca küçültüp WebP/AVIF olarak sunar.

Bilmen gerekenler:
- Arka plan temizleme ilk kullanımda yaklaşık 40 MB'lık yapay zekâ modelini indirir (1–2 dakika); sonrası daha hızlı. Bilgisayarda yapılması önerilir.
- Arka plan silinmemiş düz bir fotoğraf yüklenirse (ör. önizlemede "silmeden kullan" seçilirse) ana sayfada kenarları yumuşatılarak sahneye oturtulur.
- Telefonla çekilmiş normal fotoğraflar sorunsuzdur. Tarayıcının açamayacağı kadar devasa (yüzlerce MB) dosyalar için panel uyarı verir.
- Ürün fotoğrafı 4:5 kırpıldığı için ürün kenarda kalıyorsa fotoğrafın üzerindeki **Hotspot** ile asıl ürünü işaretleyin.

## Yayına alma (Vercel)

1. Projeyi GitHub'a yükleyin → Vercel'de **Import**.
2. Environment Variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (+ isteğe bağlı `SANITY_REVALIDATE_SECRET`).
3. Sanity CORS listesine Vercel/alan adı adresini ekleyin (yukarıdaki 3. adım).

## Nerede ne var

- `src/components/hero/` – açılıştaki koi görseli (WebGL ile hafifçe dalgalanır)
- `src/components/Hero.tsx` – açılış ekranı
- `src/components/CategoryPanel.tsx` – referanstaki gibi dev gradient başlıklı kategori vitrinleri
- `src/lib/site.ts` – dükkanın konumu ve harita bağlantıları
- `public/mascots/` – çizgi-film maskotlar (kartlarda ve Malzemeler kutularında küçük görünür)
- `public/photos/` – optimize edilmiş (WebP) hazır hayvan fotoğrafları (`-kes`: arka planı silinmiş, `-kart`: ürün kartı, `hero-koi`: açılış, `kuslar`/`bg-su`: arka plan görselleri)
- `src/lib/seed.ts` – Sanity bağlanmadan önce gösterilen örnek içerik
- `src/sanity/schemaTypes/` – panelde görünen alanlar (Türkçe)
