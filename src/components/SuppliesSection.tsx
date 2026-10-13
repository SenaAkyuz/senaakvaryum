import Link from "next/link";
import Img from "@/components/Img";
import Reveal from "@/components/Reveal";
import type { SiteData } from "@/lib/types";

/** Canlıların yanında satılan yem, kafes, akvaryum, dekor gibi ürünlerin ana sayfadaki girişi. */
export default function SuppliesSection({ data }: { data: SiteData }) {
  const groups = data.categories
    .map((category) => ({
      category,
      subs: data.subCategories.filter((s) => s.categoryId === category.id && s.kind === "malzeme"),
    }))
    .filter((g) => g.subs.length > 0);
  if (!groups.length) return null;

  // Bento düzeni: 7/5 – 5/7 şeklinde dönüşümlü genişlik
  const span = (i: number) =>
    [0, 3].includes(i % 4) ? "md:col-span-7" : "md:col-span-5";

  return (
    <section id="malzemeler" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-flame uppercase">
              Malzemeler
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-[-0.04em] uppercase sm:text-6xl">
              Her ihtiyaç,
              <br />
              <span className="text-outline">tek yerde</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Yem, kafes, akvaryum, dekor… Hayvanınız için gereken her şey kendi kategorisinde.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-12">
          {groups.map(({ category, subs }, i) => (
            <li key={category.id} className={span(i)}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <Link
                  href={`/kategori/${category.slug}#malzemeler`}
                  className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#090d12] p-7 transition-colors duration-500 hover:border-white/20 sm:min-h-[340px] sm:p-9"
                >
                  {/* Üstte kategori renginde ince çizgi */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px opacity-70"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${category.colorFrom}, ${category.colorTo}, transparent)`,
                    }}
                  />
                  {/* Maskotun arkasındaki ışık */}
                  <span
                    aria-hidden
                    className="absolute -right-10 -bottom-16 h-[75%] w-[60%] rounded-full opacity-[0.22] transition-opacity duration-700 group-hover:opacity-40"
                    style={{
                      background: `radial-gradient(circle, ${category.colorFrom}, transparent 68%)`,
                    }}
                  />

                  <div className="relative flex items-center justify-between">
                    <span className="font-display text-[11px] font-semibold tracking-[0.3em] text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="grid size-9 place-items-center rounded-full border border-white/15 text-sm text-white/60 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-white group-hover:bg-white group-hover:text-ink"
                    >
                      →
                    </span>
                  </div>

                  <div className="relative mt-auto max-w-[62%] pt-10">
                    <h3 className="font-display text-3xl leading-none font-black tracking-tight sm:text-4xl">
                      {category.title}
                    </h3>
                    <p
                      className="font-display mt-2 text-[10px] font-bold tracking-[0.32em] uppercase"
                      style={{ color: category.colorFrom }}
                    >
                      Malzemeleri
                    </p>
                    <ul className="mt-6 text-sm text-white/65">
                      {subs.slice(0, 5).map((s) => (
                        <li key={s.id} className="border-t border-white/[0.08] py-2 first:border-t-0">
                          {s.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {category.mascot && (
                    <Img
                      image={category.mascot}
                      alt=""
                      width={category.mascot.width ?? 400}
                      height={category.mascot.height ?? 400}
                      sizes="(min-width: 768px) 22vw, 50vw"
                      className="pointer-events-none absolute right-4 bottom-4 h-auto max-h-[62%] w-auto max-w-[44%] object-contain drop-shadow-[0_22px_26px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-105 sm:right-8 sm:bottom-8"
                    />
                  )}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
