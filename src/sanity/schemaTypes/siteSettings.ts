import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Dükkan Bilgileri",
  type: "document",
  fields: [
    defineField({
      name: "shopName",
      title: "Dükkan adı",
      type: "string",
      initialValue: "Sena Akvaryum",
    }),
    defineField({
      name: "tagline",
      title: "Slogan",
      type: "string",
      initialValue: "Canlı dostlar · Renkli dünyalar",
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "text",
      rows: 2,
      initialValue: "Hastane Cad. No:16/G, Kaşyukarı Mah., Yalvaç / Isparta",
    }),
    defineField({
      name: "aboutText",
      title: "Hakkımızda yazısı",
      type: "text",
      rows: 5,
    }),
  ],
  preview: { prepare: () => ({ title: "Dükkan Bilgileri" }) },
});
