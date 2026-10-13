import { defineField, defineType } from "sanity";

export const subCategory = defineType({
  name: "subCategory",
  title: "Tür",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tür adı",
      type: "string",
      description: "Örn: Japon Balığı, Lepistes (canlı) · Kuş Yemleri, Kafesler, Akvaryum Dekorları (malzeme)",
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
      name: "category",
      title: "Hangi kategoriye ait?",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Bu bir…",
      type: "string",
      description:
        "Hayvanın kendisiyse “Canlı”; yem, kafes, akvaryum, dekor, oyuncak gibi ürünlerse “Malzeme”. Sitede ayrı bölümlerde gösterilir.",
      initialValue: "canli",
      options: {
        layout: "radio",
        list: [
          { value: "canli", title: "Canlı (hayvan türü)" },
          { value: "malzeme", title: "Malzeme (yem, kafes, akvaryum, dekor…)" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Sıra",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "image",
      title: "Fotoğraf (isteğe bağlı)",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title", cat: "category.title", kind: "kind", media: "image" },
    prepare: ({ title, cat, kind, media }) => ({
      title,
      subtitle: `${cat ?? ""} · ${kind === "malzeme" ? "Malzeme" : "Canlı"}`,
      media,
    }),
  },
});
