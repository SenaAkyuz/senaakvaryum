"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";

const POINTS = [
  {
    title: "Yakından görün",
    text: "Canlıları dükkanda gözünüzle görün, sorularınızı sorun, kendiniz seçin.",
  },
  {
    title: "Doğru seçim",
    text: "Akvaryumunuza, kafesinize ve ihtiyacınıza uygun canlıyı birlikte seçelim.",
  },
  {
    title: "Her şey tek yerde",
    text: "Canlının yanında yem, kafes, akvaryum, dekor ve aksesuarlar da burada.",
  },
];

export default function AboutSection({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section
      id="hakkimizda"
      ref={ref}
      className="relative isolate overflow-hidden py-28 sm:py-40 lg:py-48"
    >
      {/* Canlı akvaryum: sağ tarafa oturur, soldan siyaha karışır (kart yok) */}
      <motion.div
        aria-hidden
        style={{ y }}
        className="absolute inset-x-0 -top-[8%] -bottom-[8%] -z-10 lg:left-auto lg:w-[64%] lg:[mask-image:linear-gradient(to_right,transparent_0%,#000_42%)]"
      >
        <Image
          src="/photos/bg-akvaryum.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="object-cover [object-position:50%_34%]"
        />
      </motion.div>
      {/* Mobilde yazının altı koyulaşır; masaüstünde yalnızca üst/alt siyaha karışır */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,8,12,0.86)_0%,rgba(6,8,12,0.6)_100%)] lg:bg-[linear-gradient(90deg,rgba(6,8,12,0.55)_0%,transparent_45%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#06080c_0%,transparent_20%,transparent_80%,#06080c_100%)]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-display flex items-center gap-4 text-[11px] font-semibold tracking-[0.45em] text-white/80 uppercase">
            <span className="h-px w-10 bg-white/50" />
            Hakkımızda
          </p>
          <h2 className="font-display mt-6 text-[clamp(2.8rem,8vw,7rem)] leading-[0.86] font-black tracking-[-0.05em] uppercase [text-shadow:0_4px_50px_rgba(0,0,0,0.5)]">
            Canlılara
            <br />
            gönülden
            <br />
            bağlı
          </h2>
          <p className="mt-9 max-w-lg text-base leading-relaxed text-white/80 [text-shadow:0_2px_24px_rgba(0,0,0,0.8)] sm:text-lg">
            {text}
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-16 sm:mt-24">
          <ol className="grid max-w-4xl gap-x-10 gap-y-8 sm:grid-cols-3">
            {POINTS.map((p, i) => (
              <li key={p.title} className="border-t border-white/30 pt-5">
                <span className="font-display text-[11px] font-bold tracking-[0.3em] text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-3 text-lg font-bold tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.7)]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
