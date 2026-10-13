import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { SiteData } from "@/lib/types";

/** Ana sayfada yalnızca panelde “Yeni geldi” işaretli ürünler görünür; yoksa bölüm hiç çıkmaz. */
export default function NewArrivals({ data }: { data: SiteData }) {
  const { products, categories, subCategories } = data;
  const list = products.filter((p) => p.isNew).slice(0, 10);
  if (!list.length) return null;

  return (
    <section id="yeni" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-flame uppercase">
            Yeni gelenler
          </p>
          <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-[-0.04em] uppercase sm:text-6xl">
            Dükkana
            <br />
            <span className="text-outline">yeni geldi</span>
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max snap-x snap-mandatory gap-5 px-5 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {list.map((p, i) => {
            const category = categories.find((c) => c.id === p.categoryId);
            if (!category) return null;
            const sub = subCategories.find((s) => s.id === p.subCategoryId);
            const anchor = sub?.kind === "malzeme" ? "malzemeler" : "canlilar";
            return (
              <li key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[320px]">
                <Reveal delay={Math.min(i, 4) * 0.06} className="h-full">
                  <Link
                    href={`/kategori/${category.slug}#${anchor}`}
                    className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <ProductCard product={p} category={category} subTitle={sub?.title} />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
