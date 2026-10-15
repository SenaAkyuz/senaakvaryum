"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./src/lib/env";

export default defineConfig({
  name: "sena-akvaryum",
  title: "Sena Akvaryum Paneli",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  schema: { types: schemaTypes },
  // Sürükle-bırak doğrudan yüklemeyi kapat: her fotoğraf otomatik küçültme/temizleme hattından geçsin
  form: { image: { directUploads: false } },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Sena Akvaryum")
          .items([
            S.listItem()
              .title("Dükkan Bilgileri")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("category").title("Kategoriler"),
            S.documentTypeListItem("subCategory").title("Türler"),
            S.documentTypeListItem("product").title("Ürünler"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== "siteSettings"),
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings"
        ? prev.filter(({ action }) => action && !["unpublish", "delete", "duplicate"].includes(action))
        : prev,
  },
});
