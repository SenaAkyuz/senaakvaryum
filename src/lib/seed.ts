import type { Product, SiteData, SubCategory } from "./types";
import { DEFAULT_CATEGORY_IMAGES, DEFAULT_MASCOTS, card } from "./photos";
import { SHOP } from "./site";

/**
 * Sanity bağlanana kadar siteyi dolu göstermek için örnek içerik.
 * Ürünler SADECE örnektir ve fiyatsızdır; gerçek içerik Sanity panelinden girilir.
 */

const sub = (
  id: string,
  title: string,
  categoryId: string,
  kind: SubCategory["kind"],
  order: number,
): SubCategory => ({
  id,
  title,
  slug: id.replace(/^s-/, ""),
  categoryId,
  kind,
  order,
});

const prod = (
  id: string,
  name: string,
  categoryId: string,
  subCategoryId: string,
  extra: Partial<Product> = {},
): Product => ({
  id,
  name,
  slug: id,
  categoryId,
  subCategoryId,
  inStock: true,
  isNew: false,
  ...extra,
});

export const seedData: SiteData = {
  source: "demo",
  settings: {
    shopName: SHOP.name,
    tagline: "Canlı dostlar · Renkli dünyalar",
    address: SHOP.address,
    aboutText:
      "Sena Akvaryum, Yalvaç’ta balıktan muhabbet kuşuna, papağandan kaplumbağaya sevimli dostlarınızı ve onların tüm ihtiyaçlarını bir araya getiriyor. Gelin, canlıları yakından görün; hangisinin size ve evinize uyduğunu birlikte seçelim.",
  },
  categories: [
    {
      id: "c-balik",
      title: "Balık",
      slug: "balik",
      order: 1,
      tagline: "Suyun içindeki renkli dünya",
      description:
        "Japon balığından lepistese, betadan melek balığına canlılar; akvaryum, dekor, kum ve yem gibi her şey.",
      colorFrom: "#3b8cff",
      colorTo: "#ff4b2b",
      image: DEFAULT_CATEGORY_IMAGES.balik,
      mascot: DEFAULT_MASCOTS.balik,
    },
    {
      id: "c-muhabbet",
      title: "Muhabbet Kuşu",
      slug: "muhabbet-kusu",
      order: 2,
      tagline: "Evin neşesi",
      description:
        "Cıvıl cıvıl, sevecen ve bakımı kolay muhabbet kuşları; yem, kafes, yuva ve oyuncaklarıyla.",
      colorFrom: "#5ec8ff",
      colorTo: "#2f6bff",
      image: DEFAULT_CATEGORY_IMAGES["muhabbet-kusu"],
      mascot: DEFAULT_MASCOTS["muhabbet-kusu"],
    },
    {
      id: "c-kaplumbaga",
      title: "Kaplumbağa",
      slug: "kaplumbaga",
      order: 3,
      tagline: "Yavaş ama çok sevimli",
      description:
        "Su ve kara kaplumbağaları; doğru bakım için yem, barınak ve aksesuarlar.",
      colorFrom: "#b6e04a",
      colorTo: "#1f9d6b",
      image: DEFAULT_CATEGORY_IMAGES.kaplumbaga,
      mascot: DEFAULT_MASCOTS.kaplumbaga,
    },
    {
      id: "c-papagan",
      title: "Papağan",
      slug: "papagan",
      order: 4,
      tagline: "Renkli bir hayat",
      description:
        "Sultan papağanından sevda papağanına; zeki, konuşkan ve dost canlısı papağanlar ve malzemeleri.",
      colorFrom: "#ffe14a",
      colorTo: "#ff7a1a",
      image: DEFAULT_CATEGORY_IMAGES.papagan,
      mascot: DEFAULT_MASCOTS.papagan,
    },
  ],
  subCategories: [
    // Balık
    sub("s-japon", "Japon Balığı", "c-balik", "canli", 1),
    sub("s-lepistes", "Lepistes", "c-balik", "canli", 2),
    sub("s-beta", "Beta (Savaşçı Balık)", "c-balik", "canli", 3),
    sub("s-moli", "Moli", "c-balik", "canli", 4),
    sub("s-melek", "Melek Balığı", "c-balik", "canli", 5),
    sub("s-akvaryum", "Akvaryumlar", "c-balik", "malzeme", 10),
    sub("s-dekor", "Akvaryum Dekorları", "c-balik", "malzeme", 11),
    sub("s-kum", "Akvaryum Kumları", "c-balik", "malzeme", 12),
    sub("s-balik-yem", "Balık Yemleri", "c-balik", "malzeme", 13),
    // Muhabbet kuşu
    sub("s-mavi", "Mavi Muhabbet", "c-muhabbet", "canli", 1),
    sub("s-yesil", "Yeşil Muhabbet", "c-muhabbet", "canli", 2),
    sub("s-sari", "Sarı Muhabbet", "c-muhabbet", "canli", 3),
    sub("s-kus-yem", "Kuş Yemleri", "c-muhabbet", "malzeme", 10),
    sub("s-kafes", "Kafesler", "c-muhabbet", "malzeme", 11),
    sub("s-yuva", "Yuvalar", "c-muhabbet", "malzeme", 12),
    sub("s-kus-oyuncak", "Oyuncaklar", "c-muhabbet", "malzeme", 13),
    // Papağan
    sub("s-sultan", "Sultan Papağanı", "c-papagan", "canli", 1),
    sub("s-sevda", "Sevda Papağanı", "c-papagan", "canli", 2),
    sub("s-jako", "Jako", "c-papagan", "canli", 3),
    sub("s-pap-yem", "Papağan Yemleri", "c-papagan", "malzeme", 10),
    sub("s-pap-kafes", "Papağan Kafesleri", "c-papagan", "malzeme", 11),
    // Kaplumbağa
    sub("s-su-kap", "Su Kaplumbağası", "c-kaplumbaga", "canli", 1),
    sub("s-kara-kap", "Kara Kaplumbağası", "c-kaplumbaga", "canli", 2),
    sub("s-kap-yem", "Kaplumbağa Yemleri", "c-kaplumbaga", "malzeme", 10),
    sub("s-kap-aksesuar", "Barınak & Aksesuar", "c-kaplumbaga", "malzeme", 11),
  ],
  products: [
    prod("p-japon", "Japon Balığı", "c-balik", "s-japon", {
      image: card("japon-baligi"),
      isNew: true,
      description: "Canlı renkli, dayanıklı ve başlangıç için ideal.",
    }),
    prod("p-beta", "Beta Balığı", "c-balik", "s-beta", {
      image: card("betta"),
      isNew: true,
      description: "Gösterişli yüzgeçleriyle akvaryumun yıldızı.",
    }),
    prod("p-lepistes", "Lepistes", "c-balik", "s-lepistes", {
      description: "Rengarenk kuyruklu, hareketli ve neşeli.",
    }),
    prod("p-melek", "Melek Balığı", "c-balik", "s-melek", { inStock: false }),
    prod("p-akvaryum", "Akvaryum", "c-balik", "s-akvaryum"),
    prod("p-dekor", "Akvaryum Dekoru", "c-balik", "s-dekor"),
    prod("p-kum", "Akvaryum Kumu", "c-balik", "s-kum"),
    prod("p-balik-yem", "Balık Yemi", "c-balik", "s-balik-yem"),

    prod("p-mavi", "Mavi Muhabbet Kuşu", "c-muhabbet", "s-mavi", {
      image: card("muhabbet-kusu"),
      isNew: true,
      description: "Sevecen, çabuk alışır, bakımı kolaydır.",
    }),
    prod("p-yesil", "Yeşil Muhabbet Kuşu", "c-muhabbet", "s-yesil"),
    prod("p-kus-yem", "Muhabbet Kuşu Yemi", "c-muhabbet", "s-kus-yem"),
    prod("p-kafes", "Kuş Kafesi", "c-muhabbet", "s-kafes"),
    prod("p-yuva", "Kuş Yuvası", "c-muhabbet", "s-yuva"),
    prod("p-oyuncak", "Kuş Oyuncağı", "c-muhabbet", "s-kus-oyuncak"),

    prod("p-sultan", "Sultan Papağanı", "c-papagan", "s-sultan", {
      image: card("sultan-papagani"),
      isNew: true,
      description: "Tüylü tacıyla sevimli, öğrenmeye açık.",
    }),
    prod("p-sevda", "Sevda Papağanı", "c-papagan", "s-sevda"),
    prod("p-pap-yem", "Papağan Yemi", "c-papagan", "s-pap-yem"),
    prod("p-pap-kafes", "Papağan Kafesi", "c-papagan", "s-pap-kafes"),

    prod("p-su-kap", "Su Kaplumbağası", "c-kaplumbaga", "s-su-kap", {
      image: card("kaplumbaga"),
      description: "Su içinde aktif, merak uyandıran bir dost.",
    }),
    prod("p-kap-yem", "Kaplumbağa Yemi", "c-kaplumbaga", "s-kap-yem"),
    prod("p-kap-barinak", "Kaplumbağa Barınağı", "c-kaplumbaga", "s-kap-aksesuar"),
  ],
};
