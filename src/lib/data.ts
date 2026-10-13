import { cacheLife, cacheTag } from "next/cache";
import { createClient, groq } from "next-sanity";
import { apiVersion, dataset, hasSanity, projectId } from "./env";
import { DEFAULT_CATEGORY_IMAGES, DEFAULT_MASCOTS } from "./photos";
import { seedData } from "./seed";
import { themeColors } from "./themes";
import type {
  Category,
  ImageRef,
  Product,
  SiteData,
  SiteSettings,
  SubCategory,
} from "./types";

const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: true,
});

const img = `{ "url": asset->url, "focal": hotspot{x, y}, "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]{
    shopName, tagline, address, aboutText
  },
  "categories": *[_type == "category" && defined(slug.current)] | order(order asc, title asc){
    "id": _id, title, "slug": slug.current, order, tagline, description, theme,
    "image": image${img},
    "mascot": mascot${img}
  },
  "subCategories": *[_type == "subCategory" && defined(slug.current) && defined(category._ref)] | order(order asc, title asc){
    "id": _id, title, "slug": slug.current, "categoryId": category._ref, "kind": coalesce(kind, "canli"), order,
    "image": image${img}
  },
  "products": *[_type == "product" && defined(slug.current) && defined(category._ref)] | order(_createdAt desc){
    "id": _id, name, "slug": slug.current, "categoryId": category._ref,
    "subCategoryId": subCategory._ref, price, unit, description,
    "inStock": coalesce(inStock, true), "isNew": coalesce(isNew, false),
    "image": image${img}
  }
}`;

type Raw = {
  settings: Partial<SiteSettings> | null;
  categories: (Omit<Category, "colorFrom" | "colorTo" | "image" | "mascot"> & {
    theme?: string;
    image?: ImageRef | null;
    mascot?: ImageRef | null;
  })[];
  subCategories: (Omit<SubCategory, "image"> & { image?: ImageRef | null })[];
  products: (Omit<Product, "image"> & { image?: ImageRef | null })[];
};

const clean = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== "")) as T;

const withImage = <T extends { image?: ImageRef | null }>(o: T) => {
  const { image, ...rest } = o;
  return clean({ ...rest, image: image?.url ? image : undefined }) as Omit<T, "image"> & {
    image?: ImageRef;
  };
};

/**
 * Tüm site verisi tek sorguda gelir (küçük bir dükkan için yeterli ve hızlı).
 * Sanity'de yayınlanan her değişiklik en geç birkaç dakika içinde sitede görünür;
 * /api/revalidate webhook'u bağlanırsa anında görünür.
 */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");

  if (!hasSanity) return seedData;

  // Sanity ayarlıysa örnek (sahte) ürünlere asla düşmeyiz: hata verirsek Next.js önceki
  // başarılı sürümü sunmaya devam eder, ilk kurulumda ise hata net görünür.
  const raw = await client.fetch<Raw>(QUERY);

  const settings: SiteSettings = {
    ...seedData.settings,
    ...clean(raw.settings ?? {}),
  };

  return {
    source: "sanity",
    settings,
    categories: raw.categories.map((c) => {
      const { theme, ...rest } = withImage(c);
      const mascotRef = c.mascot?.url ? c.mascot : undefined;
      // Panelden yüklenmediyse sitede hazır gelen görseller kullanılır.
      const image = rest.image ?? DEFAULT_CATEGORY_IMAGES[rest.slug];
      const mascot = mascotRef ?? DEFAULT_MASCOTS[rest.slug];
      return { ...rest, image, mascot, ...themeColors(theme) };
    }),
    subCategories: raw.subCategories.map(withImage),
    products: raw.products.map(withImage),
  };
}
