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

### Fotoğraf ipuçları

- **Kategori vitrin fotoğrafı:** arka planı kaldırılmış (şeffaf) tek bir hayvan fotoğrafı. Siteyle birlikte 4 kategori için hazır fotoğraf gelir (`public/photos`); panelden yeni fotoğraf yüklenirse o kullanılır.
  Yazının önüne taşan görünüm şeffaf arka plan sayesinde oluşur.
- **Ürün fotoğrafı:** dikey (4:5) çekim en iyi görünür. Kart 4:5 kırpıldığı için ürün kenarda kalıyorsa panelde fotoğrafın üzerindeki **Hotspot** ile asıl ürünü işaretleyin; site o noktayı ortalar.
- **Küçük çizim (maskot):** kategoride "Küçük çizim / logo" alanı vardır; yüklenmezse hazır olan kullanılır. Fotoğrafı olmayan ürünlerde de bu çizim görünür.

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
