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
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="hakkimizda" ref={ref} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#03070d] sm:rounded-[2.75rem]">
          {/* Işıl ışıl su altı mağarası */}
          <motion.div aria-hidden style={{ y }} className="absolute inset-x-0 -top-[10%] -bottom-[10%] -z-10">
            <Image
              src="/photos/bg-magara.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover [object-position:50%_42%]"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(3,7,13,0.94)_0%,rgba(3,7,13,0.78)_38%,rgba(3,7,13,0.25)_72%,rgba(3,7,13,0.55)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#03070d] to-transparent"
          />

          <div className="flex min-h-[640px] flex-col justify-between gap-16 p-7 sm:p-12 lg:min-h-[680px] lg:p-16">
            <Reveal className="max-w-2xl">
              <p className="font-display text-[11px] font-semibold tracking-[0.45em] text-sky uppercase">
                Hakkımızda
              </p>
              <h2 className="font-display mt-5 text-[clamp(2.6rem,7.5vw,6.2rem)] leading-[0.88] font-black tracking-[-0.045em] uppercase">
                Canlılara
                <br />
                <span className="bg-gradient-to-r from-white via-[#bfe8ff] to-[#5fb4ff] bg-clip-text text-transparent">
                  gönülden bağlı
                </span>
              </h2>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                {text}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
                {POINTS.map((p, i) => (
                  <li key={p.title} className="bg-[#050a12]/70 p-6 backdrop-blur-md">
                    <span className="font-display text-xs font-bold tracking-[0.25em] text-sky/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
