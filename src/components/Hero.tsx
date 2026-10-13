"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import KoiScene from "@/components/hero/KoiScene";

type Props = {
  tagline: string;
  categories: { title: string; slug: string }[];
};

const WORD = "AKVARYUM".split("");

export default function Hero({ tagline, categories }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fishY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fishOpacity = useTransform(scrollYProgress, [0.55, 0.95], [1, 0]);
  const uiOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[640px] h-svh items-center justify-center overflow-hidden"
    >
      {/* Arka plan: derin sualtı ışıkları */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/4 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,75,43,0.28),transparent_65%)]" />
        <div className="absolute -bottom-1/3 -left-1/6 h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.25),transparent_65%)]" />
        <div className="absolute -right-1/6 bottom-0 h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.16),transparent_65%)]" />
        <div className="hero-rays absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,8,12,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* Gradient küreler (referanstaki gibi) */}
      <motion.div
        aria-hidden
        style={{ opacity: uiOpacity }}
        className="bubble animate-float absolute top-[18%] right-[6%] z-10 size-14 sm:size-24"
      />
      <motion.div
        aria-hidden
        style={{ opacity: uiOpacity }}
        className="bubble animate-float-slow absolute bottom-[16%] left-[5%] z-10 size-16 sm:size-28"
      />

      {/* Dev başlık */}
      <motion.h1
        style={{ y: titleY }}
        className="font-display relative z-10 w-full px-[2.2vw] text-center leading-none select-none"
        aria-label="Sena Akvaryum"
      >
        <span className="mx-auto block w-fit" aria-hidden>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mb-1 block pl-[0.4vw] text-left text-[11px] font-bold tracking-[0.9em] text-white/80 uppercase sm:mb-3 sm:text-sm"
          >
            Sena
          </motion.span>
          <span className="flex justify-center text-[clamp(2.9rem,14.4vw,14.5rem)] font-black tracking-[-0.05em] text-white">
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: "60%", rotateX: -50 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
            </span>
        </span>
      </motion.h1>

      {/* Slogan: koinin ÖNÜNDE kalsın diye başlıktan ayrı */}
      <motion.p
        style={{ y: titleY, top: "calc(50% + clamp(1.45rem, 7.2vw, 7.25rem) + 2.6rem)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="font-display pointer-events-none absolute inset-x-0 z-30 px-6 text-center text-[9px] font-medium tracking-[0.45em] text-white/85 uppercase [text-shadow:0_2px_18px_rgba(0,0,0,0.9)] sm:text-sm sm:tracking-[0.75em]"
        aria-hidden
      >
        {tagline}
      </motion.p>

      {/* Hero görseli */}
      <motion.div
        style={{ y: fishY, opacity: fishOpacity }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <KoiScene className="absolute inset-0" />
      </motion.div>

      {/* Sol: kategori sayfalayıcı */}
      <motion.nav
        aria-label="Kategoriler"
        style={{ opacity: uiOpacity }}
        className="absolute top-1/2 left-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:left-10"
      >
        {categories.slice(0, 5).map((c, i) => (
          <Link
            key={c.slug}
            href={`/kategori/${c.slug}`}
            title={c.title}
            className={`font-display grid size-11 place-items-center rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all ${
              i === 0
                ? "bg-[conic-gradient(from_200deg,#2f8fff,#ff4b2b,#2f8fff)] p-[1.5px]"
                : "text-white/45 hover:text-white"
            }`}
          >
            {i === 0 ? (
              <span className="grid size-full place-items-center rounded-full bg-ink text-white">
                {c.title.slice(0, 2)}
              </span>
            ) : (
              c.title.slice(0, 2)
            )}
          </Link>
        ))}
      </motion.nav>

      {/* Sağ: nokta göstergesi */}
      <motion.div
        aria-hidden
        style={{ opacity: uiOpacity }}
        className="absolute top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex xl:right-10"
      >
        <span className="size-2 rounded-full bg-white/30" />
        <span className="grid size-10 place-items-center rounded-full bg-[conic-gradient(from_200deg,#2f8fff,#ff4b2b,#2f8fff)] p-[1.5px]">
          <span className="grid size-full place-items-center rounded-full bg-ink">
            <span className="size-2 rounded-full bg-white" />
          </span>
        </span>
        <span className="size-2 rounded-full bg-white/30" />
      </motion.div>

      {/* Alt köşeler */}
      <motion.div
        style={{ opacity: uiOpacity }}
        className="absolute inset-x-5 bottom-7 z-30 flex items-end justify-between sm:inset-x-8 sm:bottom-9 lg:inset-x-14"
      >
        <Link
          href="/#konum"
          className="font-display group flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase"
        >
          <span className="h-px w-8 bg-white/50 transition-all group-hover:w-14 group-hover:bg-ember" />
          Konum
        </Link>
        <Link
          href="/#kategoriler"
          className="font-display group flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase"
        >
          Keşfet
          <span className="grid size-9 place-items-center rounded-full border border-white/30 transition-all group-hover:border-ember group-hover:bg-ember">
            <svg viewBox="0 0 16 16" className="size-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
