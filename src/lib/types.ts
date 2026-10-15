/** "canli": hayvanın kendisi · "malzeme": yem, kafes, akvaryum, dekor gibi ürünler */
export type SubKind = "canli" | "malzeme";

export type ImageRef = {
  url: string;
  /** Sanity hotspot (0–1): kırpılırken odak noktası */
  focal?: { x: number; y: number };
  /** false: altı doğal bitiyor (ör. dalda duran kuş), alt kenarı yumuşatma */
  softBottom?: boolean;
  /** false: arka planı silinmemiş düz fotoğraf (Sanity metadata) */
  hasAlpha?: boolean;
  lqip?: string;
  width?: number;
  height?: number;
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  order: number;
  tagline?: string;
  description?: string;
  colorFrom: string;
  colorTo: string;
  image?: ImageRef;
  /** Kartlarda küçük görünen çizgi-film/logo görseli */
  mascot?: ImageRef;
};

export type SubCategory = {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  kind: SubKind;
  order: number;
  image?: ImageRef;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  subCategoryId?: string;
  /** Boşsa sitede fiyat gösterilmez. */
  price?: number;
  unit?: string;
  image?: ImageRef;
  description?: string;
  inStock: boolean;
  isNew: boolean;
};

export type SiteSettings = {
  shopName: string;
  tagline: string;
  address: string;
  aboutText: string;
};

export type SiteData = {
  settings: SiteSettings;
  categories: Category[];
  subCategories: SubCategory[];
  products: Product[];
  /** "demo" = Sanity henüz bağlanmadı, örnek içerik gösteriliyor. */
  source: "sanity" | "demo";
};
