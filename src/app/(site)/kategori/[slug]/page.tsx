import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CategoryPanel from "@/components/CategoryPanel";
import Img from "@/components/Img";
import ProductBrowser from "@/components/ProductBrowser";
import Reveal from "@/components/Reveal";
import { getSiteData } from "@/lib/data";
import type { Category, Product, SubCategory } from "@/lib/types";

export async function generateStaticParams() {
  const { categories } = await getSiteData();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getSiteData();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.title,
    description:
      category.description ??
      `${category.title} ve ${category.title.toLocaleLowerCase("tr-TR")} malzemeleri – Sena Akvaryum, Yalvaç.`,
  };
}

function Section({
  id,
  eyebrow,
  title,
  category,
  subs,
  items,
}: {
  id: string;
  eyebrow: string;
  title: string;
  category: Category;
  subs: SubCategory[];
  items: Product[];
}) {
  return (
    <section id={id} className="scroll-mt-36 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-flame uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl leading-none font-black tracking-[-0.04em] uppercase sm:text-5xl">
              {title}
            </h2>
          </div>
          <span className="font-display text-sm font-bold text-white/40">{items.length}</span>
        </Reveal>
        <ProductBrowser category={category} subCategories={subs} products={items} />
      </div>
    </section>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/kategori/[slug]">, "params">) {
  const { slug } = await params;
  const { categories, subCategories, products } = await getSiteData();
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) notFound();
  const category = categories[index];

  const subs = subCategories.filter((s) => s.categoryId === category.id);
  const canliSubs = subs.filter((s) => s.kind === "canli");
  const malzemeSubs = subs.filter((s) => s.kind === "malzeme");
  const items = products.filter((p) => p.categoryId === category.id);
  const isMalzeme = (p: Product) =>
    malzemeSubs.some((s) => s.id === p.subCategoryId);
  const canli = items.filter((p) => !isMalzeme(p));
  const malzeme = items.filter(isMalzeme);
  const others = categories.filter((c) => c.id !== category.id);

  return (
    <main>
      <CategoryPanel
        category={category}
        index={index}
        variant="page"
        flip={index % 2 === 1}
        subTitles={canliSubs.map((s) => s.title)}
        productCount={items.length}
      />

      {items.length > 0 && (canli.length > 0 && malzeme.length > 0) && (
        <nav
          aria-label="Bölümler"
          className="sticky top-[60px] z-30 border-y border-white/10 bg-ink/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl gap-3 px-5 py-3 sm:px-8">
            <a
              href="#canlilar"
              className="font-display rounded-full border border-white/20 px-5 py-2 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              Canlılar <span className="opacity-50">{canli.length}</span>
            </a>
            <a
              href="#malzemeler"
              className="font-display rounded-full border border-white/20 px-5 py-2 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              Malzemeler <span className="opacity-50">{malzeme.length}</span>
            </a>
          </div>
        </nav>
      )}

      {items.length > 0 && <div id="urunler" className="scroll-mt-36" />}

      {items.length === 0 && (
        <section id="urunler" className="py-16">
          <p className="mx-auto max-w-3xl rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/55">
            Bu kategoride şu an listelenen ürün yok. Dükkanımıza uğrayıp yakından görebilirsiniz.
          </p>
        </section>
      )}

      {canli.length > 0 && (
        <Section
          id="canlilar"
          eyebrow={category.title}
          title="Canlılar"
          category={category}
          subs={canliSubs}
          items={canli}
        />
      )}
      {malzeme.length > 0 && (
        <Section
          id="malzemeler"
          eyebrow={category.title}
          title="Malzemeler"
          category={category}
          subs={malzemeSubs}
          items={malzeme}
        />
      )}

      {others.length > 0 && (
        <section className="border-t border-white/10 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-white/45 uppercase">
              Diğer kategoriler
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:-translate-y-1 hover:border-white/30"
                  >
                    <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#05080b]">
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-30"
                        style={{ background: `radial-gradient(circle at 50% 60%, ${c.colorFrom}, transparent 70%)` }}
                      />
                      {c.mascot && (
                        <Img
                          image={c.mascot}
                          alt=""
                          width={c.mascot.width ?? 200}
                          height={c.mascot.height ?? 200}
                          sizes="64px"
                          className="relative h-[84%] w-auto max-w-[84%] object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </span>
                    <span className="font-display text-sm font-bold tracking-wide uppercase">
                      {c.title}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}

export default function CategoryPage(props: PageProps<"/kategori/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80svh]" />}>
      <CategoryContent params={props.params} />
    </Suspense>
  );
}
