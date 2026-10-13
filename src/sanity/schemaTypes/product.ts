import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ürün adı",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Adres (otomatik)",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subCategory",
      title: "Tür",
      type: "reference",
      to: [{ type: "subCategory" }],
      description:
        "Önce kategoriyi seçin; yalnızca o kategorinin türleri listelenir (canlılar ve malzemeler).",
      validation: (r) => r.required(),
      options: {
        filter: ({ document }) => ({
          filter: "category._ref == $cat",
          params: {
            cat: (document.category as { _ref?: string } | undefined)?._ref ?? "",
          },
        }),
      },
    }),
    defineField({
      name: "price",
      title: "Fiyat (₺)",
      type: "number",
      description: "İsteğe bağlı. Boş bırakırsanız sitede fiyat hiç görünmez.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "unit",
      title: "Birim",
      type: "string",
      initialValue: "adet",
      options: {
        list: [
          { value: "adet", title: "Adet" },
          { value: "çift", title: "Çift" },
          { value: "paket", title: "Paket" },
          { value: "kg", title: "Kg" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Fotoğraf",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Kısa açıklama",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "inStock",
      title: "Stokta var",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isNew",
      title: "Yeni geldi",
      description:
        "İşaretlenirse üründe “Yeni” etiketi çıkar ve ana sayfadaki “Yeni gelenler” bölümünde gösterilir. Eski olunca işareti kaldırın.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", cat: "category.title", price: "price", media: "image" },
    prepare: ({ title, cat, price, media }) => ({
      title,
      subtitle: `${cat ?? "Kategorisiz"}${price != null ? ` · ₺${price}` : ""}`,
      media,
    }),
  },
});
