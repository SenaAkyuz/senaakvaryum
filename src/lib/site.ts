/** Dükkanın sabit konum bilgileri. Yandex Haritalar kaydından alındı. */
export const SHOP = {
  name: "Sena Akvaryum",
  address: "Hastane Cad. No:16/G, Kaşyukarı Mah., Yalvaç / Isparta",
  lat: 38.297919,
  lng: 31.17649,
  yandexUrl:
    "https://yandex.com.tr/maps/104647/yalvac/house/hastane_cad_no_16g/Z0gYdwBmTUwHQF1ifX54dnVibQ==/",
} as const;

export const mapEmbedUrl = `https://maps.google.com/maps?q=${SHOP.lat},${SHOP.lng}&z=17&hl=tr&output=embed`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lng}`;

/** Fiyat girilmemişse boş döner; site fiyat göstermez. */
export function formatPrice(price?: number, unit?: string) {
  if (price == null) return null;
  const formatted = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(price);
  return `₺${formatted}${unit ? ` / ${unit}` : ""}`;
}
