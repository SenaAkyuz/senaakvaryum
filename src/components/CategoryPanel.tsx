"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Img from "@/components/Img";
import type { Category } from "@/lib/types";

type Props = {
  category: Category;
  index: number;
  subTitles: string[];
  productCount: number;
  /** "page": kategori sayfasının üstündeki büyük vitrin (h1, "Ürünler" çağrısı) */
  variant?: "section" | "page";
  flip?: boolean;
};

function titleSizes(title: string) {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  const m = Math.min(24, 88 / (longest * 0.8));
  const d = Math.min(13, 46 / (longest * 0.8));
  return { "--fs-m": `${m.toFixed(2)}vw`, "--fs-d": `${d.toFixed(2)}vw` } as React.CSSProperties;
}

function Visual({ category }: { category: Category }) {
  const { colorFrom: from, colorTo: to } = category;
  const image = category.image ?? category.mascot;

  if (!image) {
    // Hiç görsel yoksa yalnızca renkli bir ışık diski
    return (
      <div
        className="mx-auto aspect-square w-[min(70vw,380px)] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle at 35% 30%, ${from}, ${to} 60%, transparent 72%)` }}
      />
    );
  }

  const w = image.width ?? 1200;
  const h = image.height ?? 1200;
  const landscape = w > h * 1.05;
  // Gövdesi alt kenarda kesik, uzun kuş fotoğraflarının altını yumuşat
  const fadeBottom = image.softBottom ?? h > w * 1.25;
  // Arka planı silinmemiş düz fotoğraf (panel dışından yüklenmişse): kenarları yumuşakça eritip sahneye oturt
  const framed = image.hasAlpha === false;
  return (
    <div className={category.slug === "balik" ? "animate-float-slow" : ""}>
      {/* Gölge ayrı katmanda: maske ile birlikte kullanılırsa kenarlarda kutu izi kalır */}
      <div className="[filter:drop-shadow(0_28px_34px_rgba(0,0,0,0.5))]">
        <Img
          image={image}
          alt={`${category.title} – Sena Akvaryum`}
          width={w}
          height={h}
          sizes="(min-width: 1024px) 46vw, 90vw"
          className={`relative z-10 mx-auto object-contain ${
            framed
              ? "[mask-image:radial-gradient(ellipse_at_center,#000_46%,transparent_74%)]"
              : fadeBottom
                ? "[mask-image:linear-gradient(to_bottom,#000_78%,transparent_98%)]"
                : ""
          } ${
            landscape
              ? "h-auto max-h-[56svh] w-[min(92vw,640px)] lg:max-h-[64svh] lg:w-[min(36vw,520px)]"
              : "h-[min(56svh,560px)] w-auto max-w-[92vw] lg:h-[min(66svh,660px)]"
          }`}
        />
      </div>
    </div>
  );
}

export default function CategoryPanel({
  category,
  index,
  subTitles,
  productCount,
  variant = "section",
  flip = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Kaydırma paralaksı
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const titleX = useTransform(scrollYProgress, [0, 1], flip ? [22, -22] : [-22, 22]);

  // Fare ile derinlik: başlık, görsel ve ışık farklı hızda/yönde hareket eder
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18 });
  const sy = useSpring(py, { stiffness: 70, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-9, 9]);
  const rotX = useTransform(sy, [-1, 1], [6, -6]);
  const imgShiftX = useTransform(sx, [-1, 1], [-18, 18]);
  const titleShiftX = useTransform(sx, [-1, 1], [14, -14]);
  const titleShiftY = useTransform(sy, [-1, 1], [8, -8]);
  const glowX = useTransform(sx, [-1, 1], [30, -30]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const isPage = variant === "page";
  const Heading = isPage ? "h1" : "h2";
  const num = String(index + 1).padStart(2, "0");
  const words = category.title.toUpperCase().split(/\s+/);
  const sizes = titleSizes(category.title);
  const gradient = `linear-gradient(100deg, ${category.colorFrom} 0%, ${category.colorTo} 85%)`;
  const titlePlace = `lg:col-span-7 lg:row-start-1 ${
    flip ? "lg:col-start-6 lg:text-right" : "lg:col-start-1"
  }`;

  return (
    <section
      ref={ref}
      id={isPage ? undefined : `kat-${category.slug}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative isolate overflow-hidden ${
        isPage ? "min-h-[88svh] pt-28 pb-14 sm:pt-32" : "min-h-[92svh] py-20 sm:py-24"
      }`}
    >
      {/* Kategori rengiyle ışık (en arka katman) */}
      <motion.div
        aria-hidden
        style={{
          x: glowX,
          background: `radial-gradient(circle, ${category.colorFrom}, ${category.colorTo} 55%, transparent 70%)`,
        }}
        className={`absolute top-1/2 -z-10 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full opacity-[0.22] ${
          flip ? "left-[-14%]" : "right-[-14%]"
        }`}
      />

      <div
        className={`relative mx-auto grid min-h-[inherit] max-w-7xl items-center gap-y-8 px-5 sm:px-8 lg:grid-cols-12 ${
          isPage ? "lg:min-h-[70svh]" : "lg:min-h-[78svh]"
        }`}
      >
        {/* 1) Dev gradient başlık: görselin ARKASINDA */}
        <motion.div style={{ x: titleX }} className={`relative z-10 ${titlePlace}`}>
          <motion.div style={{ x: titleShiftX, y: titleShiftY }}>
            <Heading
              className="cat-title font-display -mt-[0.2em] pt-[0.2em] leading-[0.86] font-black tracking-[-0.045em] uppercase"
              style={{
                ...sizes,
                backgroundImage: gradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {words.map((w) => (
                <span key={w} className="block">
                  {w}
                </span>
              ))}
            </Heading>
          </motion.div>
        </motion.div>

        {/* 2) Hayvan: başlığın üzerine taşar, hafif 3D eğilir */}
        <motion.div
          style={{ y: imgY }}
          className="relative z-20 -mt-[14vw] grid h-[58svh] min-h-[340px] place-items-center [perspective:1100px] lg:-mt-0 lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:h-[72svh] lg:data-[flip=true]:col-start-4"
          data-flip={flip}
        >
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, x: imgShiftX, transformStyle: "preserve-3d" }}
            className="grid place-items-center"
          >
            <Visual category={category} />
          </motion.div>
        </motion.div>

        {/* 3) Başlığın ön kopyası: sadece çizgi, hayvanın ÖNÜNDEN geçer → iç içe derinlik */}
        <motion.div
          aria-hidden
          style={{ x: titleX }}
          className={`pointer-events-none relative z-30 hidden lg:block ${titlePlace}`}
        >
          <motion.div style={{ x: titleShiftX, y: titleShiftY }}>
            <p
              className="cat-title font-display -mt-[0.2em] pt-[0.2em] leading-[0.86] font-black tracking-[-0.045em] uppercase [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.45))]"
              style={{
                ...sizes,
                backgroundImage: gradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {words.map((w) => {
                // Hayvanla çakışan uçtaki harf öne alınır (diğerleri yerinde ama görünmez)
                // Uzun kelimelerde (KAPLUMBAĞA gibi) iki harf birden öne alınır ki hiçbiri gizlenmesin
                const n = w.length >= 8 ? 2 : 1;
                const isFront = (i: number) => (flip ? i < n : i >= w.length - n);
                return (
                  <span key={w} className="block">
                    {[...w].map((ch, i) => (
                      <span key={i} style={{ visibility: isFront(i) ? "visible" : "hidden" }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                );
              })}
            </p>
          </motion.div>
        </motion.div>

        {/* Bilgi bloğu */}
        <div
          className={`relative z-40 lg:row-start-1 lg:self-end ${
            flip ? "lg:col-span-3 lg:col-start-1" : "lg:col-span-4 lg:col-start-9"
          }`}
        >
          <div className="mb-5 flex items-center gap-4">
            <span className="font-display text-outline text-6xl font-black tracking-tighter sm:text-7xl">
              {num}
            </span>
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <h3 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {category.tagline ?? category.title}
          </h3>
          {category.description && (
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              {category.description}
            </p>
          )}
          {subTitles.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${category.title} türleri`}>
              {subTitles.slice(0, 6).map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/75"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          {isPage ? (
            productCount > 0 && (
              <a
                href="#urunler"
                className="font-display mt-7 inline-flex items-center gap-3 rounded-sm border border-white/50 px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] uppercase transition-all hover:border-white hover:bg-white hover:text-ink"
              >
                Ürünlere bak <span aria-hidden>↓</span>
              </a>
            )
          ) : (
            <Link
              href={`/kategori/${category.slug}`}
              className="font-display group mt-7 inline-flex items-center gap-3 rounded-sm border border-white/50 px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] uppercase transition-all hover:border-white hover:bg-white hover:text-ink"
            >
              Ürünleri gör
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
