// Sanity paneline başlangıç kategorileri/türleri/dükkan bilgisini yükleyen dosyayı üretir.
//   node scripts/make-sanity-seed.mjs
//   npx sanity dataset import sanity-seed/dataset.ndjson production
// Ürün eklemez (fiyatlar sizin olacak); fotoğraflar panelden yüklenir.
import { mkdirSync, writeFileSync } from "node:fs";

const categories = [
  { slug: "balik", title: "Balık", order: 1, theme: "mavi-kirmizi", tagline: "Suyun içindeki renkli dünya", description: "Japon balığından lepistese, betadan melek balığına akvaryumunuza renk katacak canlılar." },
  { slug: "muhabbet-kusu", title: "Muhabbet Kuşu", order: 2, theme: "gokyuzu", tagline: "Evin neşesi", description: "Cıvıl cıvıl, sevecen ve bakımı kolay. Yeşil, mavi, sarı; her renkten muhabbet kuşları." },
  { slug: "papagan", title: "Papağan", order: 4, theme: "turuncu", tagline: "Renkli bir hayat", description: "Sultan papağanından sevda papağanına; zeki, konuşkan ve dost canlısı papağanlar." },
  { slug: "kaplumbaga", title: "Kaplumbağa", order: 3, theme: "yesil", tagline: "Yavaş ama çok sevimli", description: "Su ve kara kaplumbağaları, doğru bakım bilgisi ve ihtiyaç duyacağınız tüm malzemelerle." },
];

const subs = {
  balik: {
    canli: ["Japon Balığı", "Lepistes", "Beta (Savaşçı Balık)", "Moli", "Melek Balığı"],
    malzeme: ["Akvaryumlar", "Akvaryum Dekorları", "Akvaryum Kumları", "Balık Yemleri"],
  },
  "muhabbet-kusu": {
    canli: ["Mavi Muhabbet", "Yeşil Muhabbet", "Sarı Muhabbet"],
    malzeme: ["Kuş Yemleri", "Kafesler", "Yuvalar", "Oyuncaklar"],
  },
  papagan: {
    canli: ["Sultan Papağanı", "Sevda Papağanı", "Jako"],
    malzeme: ["Papağan Yemleri", "Papağan Kafesleri"],
  },
  kaplumbaga: {
    canli: ["Su Kaplumbağası", "Kara Kaplumbağası"],
    malzeme: ["Kaplumbağa Yemleri", "Barınak & Aksesuar"],
  },
};

const slugify = (s) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    shopName: "Sena Akvaryum",
    tagline: "Canlı dostlar · Renkli dünyalar",
    address: "Hastane Cad. No:16/G, Kaşyukarı Mah., Yalvaç / Isparta",
    aboutText:
      "Sena Akvaryum, Yalvaç’ta balıktan muhabbet kuşuna, papağandan kaplumbağaya sevimli dostlarınızı ve onların tüm ihtiyaçlarını bir araya getiriyor. Gelin, canlıları yakından görün; hangisinin size ve evinize uyduğunu birlikte seçelim.",
  },
];

for (const c of categories) {
  docs.push({
    _id: `category-${c.slug}`,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    order: c.order,
    theme: c.theme,
    tagline: c.tagline,
    description: c.description,
  });
  let order = 0;
  for (const kind of ["canli", "malzeme"]) {
    for (const title of subs[c.slug][kind]) {
      order += 1;
      docs.push({
        _id: `sub-${c.slug}-${slugify(title)}`,
        _type: "subCategory",
        title,
        slug: { _type: "slug", current: slugify(title) },
        category: { _type: "reference", _ref: `category-${c.slug}` },
        kind,
        order,
      });
    }
  }
}

mkdirSync("sanity-seed", { recursive: true });
writeFileSync("sanity-seed/dataset.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`sanity-seed/dataset.ndjson yazıldı (${docs.length} kayıt).`);
