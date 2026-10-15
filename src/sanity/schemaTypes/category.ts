import { defineField, defineType } from "sanity";
import { THEMES } from "@/lib/themes";
import { cutoutSource, optimizeSource } from "../PhotoSource";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori adı",
      type: "string",
      description: "Örn: Balık, Muhabbet Kuşu, Papağan, Kaplumbağa",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Adres (otomatik)",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Küçük sayı önce görünür (1, 2, 3 …).",
      initialValue: 10,
    }),
    defineField({
      name: "tagline",
      title: "Kısa başlık",
      type: "string",
      description: "Örn: Renkli bir hayat",
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "theme",
      title: "Renk teması",
      type: "string",
      initialValue: "mavi-kirmizi",
      options: {
        list: Object.entries(THEMES).map(([value, t]) => ({ value, title: t.title })),
      },
    }),
    defineField({
      name: "image",
      title: "Vitrin fotoğrafı (büyük)",
      type: "image",
      options: { hotspot: true, sources: [cutoutSource] },
      description:
        "Herhangi bir hayvan fotoğrafı yükleyin: sistem otomatik küçültür, arka planı siler ve ana sayfadaki büyük vitrine uygun hâle getirir.",
    }),
    defineField({
      name: "mascot",
      title: "Küçük çizim / logo (isteğe bağlı)",
      type: "image",
      options: { sources: [optimizeSource] },
      description:
        "Kartlarda ve malzeme kutularında görünen küçük çizgi-film hayvan görseli (şeffaf PNG). Yüklemezseniz hazır olan kullanılır.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tagline", media: "image" },
  },
});
