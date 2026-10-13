/** Kategori renk temaları. Sanity panelinde seçilir, sitede gradient olarak kullanılır. */
export const THEMES = {
  "mavi-kirmizi": { title: "Mavi → Kırmızı (balık)", from: "#3b8cff", to: "#ff4b2b" },
  gokyuzu: { title: "Gök mavisi (muhabbet kuşu)", from: "#5ec8ff", to: "#2f6bff" },
  turuncu: { title: "Sarı → Turuncu (papağan)", from: "#ffe14a", to: "#ff7a1a" },
  yesil: { title: "Limon → Yeşil (kaplumbağa)", from: "#b6e04a", to: "#1f9d6b" },
  "mor-pembe": { title: "Mor → Pembe", from: "#b06bff", to: "#ff5ca8" },
  altin: { title: "Altın → Amber", from: "#ffd23f", to: "#ff8a1f" },
} as const;

export type ThemeKey = keyof typeof THEMES;

export function themeColors(key?: string) {
  const t = THEMES[(key as ThemeKey) ?? "mavi-kirmizi"] ?? THEMES["mavi-kirmizi"];
  return { colorFrom: t.from, colorTo: t.to };
}
