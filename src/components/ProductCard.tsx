import Img from "@/components/Img";
import { formatPrice } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

type Props = {
  product: Product;
  category: Category;
  subTitle?: string;
  /** Fiyat yalnızca burada true ise VE panelden girilmişse görünür. */
  showPrice?: boolean;
};

export default function ProductCard({ product, category, subTitle, showPrice = false }: Props) {
  const { colorFrom: from, colorTo: to } = category;
  const price = showPrice ? formatPrice(product.price, product.unit) : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-panel transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
        {product.image ? (
          <Img
            image={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              background: `radial-gradient(circle at 50% 42%, ${from}2e, transparent 62%), #05080b`,
            }}
          >
            {category.mascot && (
              <Img
                image={category.mascot}
                alt=""
                width={category.mascot.width ?? 400}
                height={category.mascot.height ?? 400}
                sizes="(min-width: 1024px) 14vw, 40vw"
                className="h-auto max-h-[62%] w-auto max-w-[62%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
              />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="font-display rounded-full bg-ember px-3 py-1 text-[10px] font-bold tracking-[0.16em] uppercase">
              Yeni
            </span>
          )}
          {!product.inStock && (
            <span className="font-display rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white/80 uppercase backdrop-blur">
              Tükendi
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p
          className="font-display text-[10px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: from }}
        >
          {subTitle ?? category.title}
        </p>
        <h3 className="font-display mt-1.5 text-lg leading-snug font-bold tracking-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">
            {product.description}
          </p>
        )}
        {price && (
          <p className="font-display mt-auto pt-5 text-xl font-extrabold tracking-tight">{price}</p>
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)` }}
      />
    </article>
  );
}
