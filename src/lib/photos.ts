import type { ImageRef } from "./types";

/**
 * Sitenin içinde gelen hazır görseller.
 * Panelden bir kategoriye fotoğraf/maskot yüklenirse o kullanılır; yüklenmediyse bunlar gösterilir.
 */
const kes = (name: string, width: number, height: number): ImageRef => ({
  url: `/photos/${name}-kes.webp`,
  width,
  height,
});

const mascot = (name: string, width: number, height: number): ImageRef => ({
  url: `/mascots/mascot-${name}.webp`,
  width,
  height,
});

/** Arka planı silinmiş büyük hayvan fotoğrafları (kategori vitrinleri) */
export const DEFAULT_CATEGORY_IMAGES: Record<string, ImageRef> = {
  balik: kes("betta", 1154, 1268),
  "muhabbet-kusu": { ...kes("muhabbet-kusu", 1210, 1409), softBottom: false },
  papagan: { ...kes("sultan-papagani", 1028, 1500), softBottom: false },
  kaplumbaga: kes("kaplumbaga", 1100, 868),
};

/** Çizgi-film maskotlar (küçük kartlar, malzeme kutuları) */
export const DEFAULT_MASCOTS: Record<string, ImageRef> = {
  balik: mascot("balik", 640, 563),
  "muhabbet-kusu": mascot("muhabbet-kusu", 340, 640),
  papagan: mascot("papagan", 433, 640),
  kaplumbaga: mascot("kaplumbaga", 409, 498),
};

/** Örnek ürünler için kırpılmış kart fotoğrafları (4:5). */
export const card = (name: string): ImageRef => ({
  url: `/photos/${name}-kart.webp`,
  width: 800,
  height: 1000,
});
