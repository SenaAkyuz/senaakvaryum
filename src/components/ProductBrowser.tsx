"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Category, Product, SubCategory } from "@/lib/types";

type Props = {
  category: Category;
  /** Yalnızca içinde ürün olan türler gösterilir. */
  subCategories: SubCategory[];
  products: Product[];
};

const trLower = (s: string) => s.toLocaleLowerCase("tr-TR");

export default function ProductBrowser({ category, subCategories, products }: Props) {
  const [sub, setSub] = useState<string>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) {
      if (p.subCategoryId) m.set(p.subCategoryId, (m.get(p.subCategoryId) ?? 0) + 1);
    }
    return m;
  }, [products]);

  const chips = subCategories.filter((s) => (counts.get(s.id) ?? 0) > 0);
  const searchable = products.length > 8;

  const visible = useMemo(() => {
    const q = trLower(query.trim());
    return products.filter((p) => {
      if (sub !== "all" && p.subCategoryId !== sub) return false;
      if (q && !trLower(`${p.name} ${p.description ?? ""}`).includes(q)) return false;
      return true;
    });
  }, [products, sub, query]);

  const chip = (active: boolean) =>
    `font-display shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase transition-all ${
      active
        ? "border-transparent text-ink"
        : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
    }`;
  const activeStyle = {
    background: `linear-gradient(100deg, ${category.colorFrom}, ${category.colorTo})`,
  };

  return (
    <div>
      {(chips.length > 1 || searchable) && (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {chips.length > 1 ? (
            <div
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Tür filtresi"
            >
              <button
                type="button"
                role="tab"
                aria-selected={sub === "all"}
                onClick={() => setSub("all")}
                className={chip(sub === "all")}
                style={sub === "all" ? activeStyle : undefined}
              >
                Tümü <span className="opacity-60">{products.length}</span>
              </button>
              {chips.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={sub === s.id}
                  onClick={() => setSub(s.id)}
                  className={chip(sub === s.id)}
                  style={sub === s.id ? activeStyle : undefined}
                >
                  {s.title} <span className="opacity-60">{counts.get(s.id) ?? 0}</span>
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}

          {searchable && (
            <label className="relative block lg:w-64">
              <span className="sr-only">Ürün ara</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün ara…"
                className="w-full rounded-full border border-white/15 bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/50"
              />
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
              >
                <circle cx="9" cy="9" r="5.5" />
                <path d="m13.5 13.5 4 4" strokeLinecap="round" />
              </svg>
            </label>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/55">
          Aradığınız ürün listede yok. Dükkanımızda olabilir; uğrayıp sorabilirsiniz.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                category={category}
                subTitle={subCategories.find((s) => s.id === p.subCategoryId)?.title}
                showPrice
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
